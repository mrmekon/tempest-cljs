(ns ^{:doc "
Functions related to the game of tempest, and game state.

Functions in this module create the game state, and modify it based on
player actions or time.  This includes management of entities such as
the player's ship, enemies, and projectiles.
"}
  tempest.core
  (:require [tempest.levels :as levels]
            [tempest.util :as util]
            [tempest.draw :as draw]
            [tempest.path :as path]
            [goog.dom :as dom]
            [goog.events :as events]
            [goog.events.KeyCodes :as key-codes]
            [clojure.browser.repl :as repl]))

(repl/connect "http://localhost:9000/repl")


(def ^{:doc "Boolean flag to mark if the game is paused."}
  *paused* (atom false))


(defn build-projectile
  "Returns a dictionary describing a projectile (bullet) on the given level,
   in the given segment, with a given stride (steps per update to move, with
   negative meaning in and positive meaning out), and given step to start on."
  [level seg-idx stride & {:keys [step] :or {step 0}}]
  {:step step
   :stride stride
   :segment seg-idx
   :level level
   :path-fn path/projectile-path-on-level
   })

(defn build-enemy
  "Returns a dictionary describing an enemy on the given level and segment,
   and starting on the given step.  Step defaults to 0 (innermost step of
   level) if not specified. TODO: Only makes flippers."
  [level seg-idx & {:keys [step] :or {step 0}}]
  {:step step
   :stride 1
   :segment seg-idx
   :path-fn path/flipper-path-on-level
   :level level
   :hits-remaining 1
   :bounding-fn path/flipper-path-bounding-box
   })

(defn build-player
  "Returns a dictionary describing a player on the given level and segment."
  [level seg-idx]
  {:segment seg-idx
   :level level
   :step (:steps level)
   :bullet-stride -5})

(defn entity-next-step
  "Returns the next step position of given entity, taking into account
   minimum and maximum positions of the level."
  [entity]
  (let [stride (:stride entity)
        maxstep (:steps (:level entity))
        newstep (+ stride (:step entity))]
    (cond
     (> newstep maxstep) maxstep
     (< newstep 0) 0
     :else newstep)))

(defn test-entity-next-step []
  (and
   (= 11 (entity-next-step (build-enemy level 0 :step 10)))
   (= 6 (entity-next-step (build-projectile level 0 -4 :step 10)))
   (= 0 (entity-next-step (build-projectile level 0 -4 :step 0)))
   (= 0 (entity-next-step (build-projectile level 0 -4 :step 2)))
   (= 100 (entity-next-step (build-projectile level 0 4 :step 100)))
   (= 100 (entity-next-step (build-projectile level 0 4 :step 98)))))

(defn update-entity-position!
  "Return entity updated with a new position based on its current location and
   stride.  Won't go lower than 0, or higher than the maximum steps of the
   level."
  [entity]
  (assoc entity :step (entity-next-step entity)))

(defn test-update-entity-position! []
  (and 
   (= 11 (:step (update-entity-position! (build-enemy level 0 :step 10))))
   (= 5 (:step (update-entity-position!
                (build-projectile level 0 -5 :step 10))))
   (= 15 (:step (update-entity-position!
                (build-projectile level 0 5 :step 10))))
   (= 0 (:step (update-entity-position!
                (build-projectile level 0 -5 :step 0))))
   (= 100 (:step (update-entity-position!
                  (build-projectile level 0 5 :step 100))))))
  
(defn update-entity-list
  "Recursively call update-entity-position! on all entities in list."
  [entity-list]
  ((fn [oldlist newlist]
     (let [entity (first oldlist)]
       (if (empty? entity)
         newlist
         (recur (rest oldlist)
                (cons (update-entity-position! entity) newlist))))
         ) entity-list []))


(defn entity-between-steps
  "Returns true of entity is on seg-idx, and between steps step0 and step1,
   inclusive."
  [seg-idx step0 step1 entity]
  (let [min (min step0 step1)
        max (max step0 step1)]
    (and
     (= (:segment entity) seg-idx)
     (>= (:step entity) min)
     (<= (:step entity) max))))

(defn test-entity-between-steps []
  (and
   (true? (entity-between-steps 0 0 10 (build-enemy level 0 :step 5)))
   (false? (entity-between-steps 0 0 10 (build-enemy level 0 :step 15)))
   (false? (entity-between-steps 0 0 10 (build-enemy level 1 :step 5)))
   (false? (entity-between-steps 5 10 20 (build-enemy level 5 :step 5)))
   (true? (entity-between-steps 5 10 20 (build-enemy level 5 :step 15)))
  ))


(defn projectiles-after-collision
  "Given an entity and a list of projectiles, returns the entity and updated
   list of projectiles after collisions.  The entity's hits-remaining counter
   is decremented on a collision, and the projectile is removed."
  [entity projectile-list]
  ((fn [entity projectiles-in projectiles-out was-hit?]
     (if (empty? projectiles-in)
       {:entity entity :projectiles projectiles-out :was-hit? was-hit?}
       (let [bullet (first projectiles-in)
             collision? (entity-between-steps
                         (:segment bullet)
                         (:step bullet)
                         (entity-next-step bullet)
                         entity)]
         (if collision?
           (recur (decrement-enemy-hits entity)
                  nil
                  (concat projectiles-out (rest projectiles-in))
                  true)
           (recur entity
                  (rest projectiles-in)
                  (cons bullet projectiles-out)
                  was-hit?)))))
   entity projectile-list '() false))

(defn test-projectiles-after-collision []
  (let [level (get levels/*levels* 4)
        projectiles (list (build-projectile level 0 -1 :step 9)
                          (build-projectile level 0 -5 :step 9)
                          (build-projectile level 0 1 :step 9)
                          (build-projectile level 0 2 :step 9)
                          (build-projectile level 0 5 :step 20)
                          (build-projectile level 5 2 :step 9))
        result (projectiles-after-collision
                (build-enemy level 0 :step 10)
                projectiles)]
    (println (str "Projectiles: "
                  (pr-str (count (:projectiles result)))
                  " of "
                  (pr-str (count projectiles))))
    (println (str "Hits left: " (pr-str (:hits-remaining (:entity result)))))
    (println (str "Was hit: " (pr-str (:was-hit? result))))
     ))

(defn entities-after-collisions
  "Given a list of entities and a list of projectiles, returns the lists
   with entity hit counts updated, entities removed if they have no hits
   remaining, and collided projectiles removed.

   See projectiles-after-collision, which is called for each entity in
   entity-list."
  [entity-list projectile-list]
  ((fn [entities-in entities-out projectiles-in]
     (if (empty? entities-in)
       {:entities entities-out :projectiles projectiles-in}
       (let [{entity :entity projectiles :projectiles was-hit? :was-hit?}
             (projectiles-after-collision (first entities-in)
                                          projectiles-in)]
         (if (and was-hit? (<= (:hits-remaining entity) 0))
           (recur (rest entities-in)
                  entities-out
                  projectiles)
           (recur (rest entities-in)
                  (cons entity entities-out)
                  projectiles)))))
   entity-list '() projectile-list))

(defn test-entities-after-collisions []
  (let [level (get levels/*levels* 4)
        enemies (list (build-enemy level 0 :step 10)
                      (build-enemy level 1 :step 20)
                      (build-enemy level 2 :step 30)
                      (build-enemy level 3 :step 40)
                      (build-enemy level 4 :step 50)
                      (build-enemy level 5 :step 60))
        projectiles (list (build-projectile level 0 -5 :step 9)
                          (build-projectile level 0 5 :step 9)
                          (build-projectile level 1 -5 :step 19)
                          (build-projectile level 1 5 :step 19)
                          (build-projectile level 3 -5 :step 35)
                          (build-projectile level 3 5 :step 35))
        result (entities-after-collisions enemies projectiles)]
    (println (str "Entities: "
                  (pr-str (count (:entities result)))
                  " of "
                  (pr-str (count enemies))))
    (println (str "Projectiles: "
                  (pr-str (count (:projectiles result)))
                  " of "
                  (pr-str (count projectiles))))
    ))



(defn collisions-with-projectile
  "Returns map with keys true and false.  Values under true key have or
   will collide with bullet in the next bullet update.  Values under the
   false key will not."
  [enemy-list bullet]
  (group-by (partial entity-between-steps
                   (:segment bullet)
                   (:step bullet)
                   (entity-next-step bullet))
            enemy-list))


(defn decrement-enemy-hits
  "Decrement hits-remaining count on given enemy."
  [enemy]
  (assoc enemy :hits-remaining (dec (:hits-remaining enemy))))


(defn projectile-off-level?
  "Returns true if a projectile has reached either boundary of the level."
  [projectile]
  (cond
   (zero? (:step projectile)) true
   (>= (:step projectile) (:steps (:level projectile))) true
   :else false))


(defn add-player-projectile!
  "Add a new projectile to the global list of live projectiles, originating
   from the given player, on the segment he is currently on."
  [player]
  (let [level (:level player)
        seg-idx (:segment player)
        stride (:bullet-stride player)
        step (:steps level)]
    (reset! *projectile-list*
            (conj @*projectile-list*
                  (build-projectile level seg-idx stride :step step)))))

(defn segment-player-left
  "Returns the segment to the left of the player.  Loops around the level
   on connected levels, and stops at 0 on unconnected levels."
  [player]
  (let [level (:level player)
        seg-max (dec (count (:segments level)))
        cur-seg (:segment player)
        loops? (:loops? level)
        new-seg (dec cur-seg)]
    (if (< new-seg 0)
      (if loops? seg-max 0)
      new-seg)))


(defn segment-player-right
  "Returns the segment to the right of the player.  Loops around the level
   on connected levels, and stops at max on unconnected levels."
  [player]
  (let [level (:level player)
        seg-max (dec (count (:segments level)))
        cur-seg (:segment player)
        loops? (:loops? level)
        new-seg (inc cur-seg)]
    (if (> new-seg seg-max)
      (if loops? 0 seg-max)
      new-seg)))

(defn set-global-player-segment!
  "Sets global *player*'s segment key to a new value."
  [seg-idx]
  (reset! *player* (assoc @*player* :segment seg-idx)))

(defn keypress
  "Respond to keyboard key presses."
  [event]
  (let [player @*player*
        key (.-keyCode event)]
    (condp = key
      key-codes/RIGHT (set-global-player-segment!
                       (segment-player-right player))
      key-codes/LEFT (set-global-player-segment!
                      (segment-player-left player))
      key-codes/SPACE (add-player-projectile! player)
      key-codes/ESC (def *paused* (atom (not @*paused*)))
      nil
      )))

(defn animationFrameMethod []
  "Returns a callable javascript function to schedule a frame to be drawn.
   Tries to use requestAnimationFrame, or the browser-specific version of
   it that is available.  Falls back on setTimeout if requestAnimationFrame
   is not available on player's browser.

   requestAnimationFrame tries to figure out a consistent framerate based
   on how long frame takes to render.

   The setTimeout fail-over is hard-coded to attempt 30fps.
   "
  (let [window (dom/getWindow)
        names ["requestAnimationFrame"
               "webkitRequestAnimationFrame"
               "mozRequestAnimationFrame"
               "oRequestAnimationFrame"
               "msRequestAnimationFrame"]
        options (map (fn [name] #(aget window name)) names)]
    ((fn [[current & remaining]]
       (cond
        (nil? current) #((.-setTimeout window) % (/ 1000 30))
        (fn? (current)) (current)
        :else (recur remaining)))
     options)))

(def ^{:doc
       "Stores the frame-scheduling function for the current browser.
        This function should be called at the end of each frame to
        schedule the next frame to be drawn at the appropriate time."}
  *animMethod* (animationFrameMethod))



(def *frame-count* (atom 0))
(def *frame-time* (atom (goog.now)))
(def *enemy-list* (atom (list)))
(def *player* (atom (list)))
(def *projectile-list* (atom (list)))

(defn build-game-state
  []
  (atom
   {:enemy-list '()
    :projectile-list '()
    :player '()
    :context nil
    :dims nil
    :level nil
    :frame-count 0
    :frame-time 0
    :paused? false
    }))

(defn update-game!
  "Call all of the drawing functions to redraw the scene, and update all
   of the entities on the level."
  [context dims level]
  (doseq []
    (.clearRect context 0 0 (:width dims) (:height dims))
    (draw/draw-player context dims level (deref *player*))
    (draw/draw-entities context dims level @*enemy-list*)
    (draw/draw-entities context dims level @*projectile-list*)
    
    (when (not @*paused*)
      (let [new-entities (entities-after-collisions @*enemy-list*
                                                      @*projectile-list*)]
        (def *projectile-list* (atom (:projectiles new-entities)))
        (def *enemy-list* (atom (:entities new-entities))))
        
      (def *projectile-list* (atom (update-entity-list @*projectile-list*)))
      (def *projectile-list* (atom (remove projectile-off-level?
                                           @*projectile-list*)))
      (def *enemy-list* (atom (update-entity-list @*enemy-list*)))
      (*animMethod* #(update-game! context dims level)))
    
    (def *frame-count* (atom (inc @*frame-count*)))
    (when (= 20 @*frame-count*)
      (let [fps (/ (* 1000 @*frame-count*)
                   (- (goog.now) @*frame-time*))]
        (dom/setTextContent (dom/getElement "fps")
                            (str "FPS: " (pr-str (js/Math.round fps)))))
      
      (def *frame-count* (atom 0))
      (def *frame-time* (atom (goog.now))))))


