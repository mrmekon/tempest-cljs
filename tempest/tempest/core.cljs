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
            [clojure.browser.repl :as repl])
  (:require-macros [tempest.macros :as macros]))

(repl/connect "http://localhost:9000/repl")


(def ^{:doc
       "Global queue for storing player's keypresses.  The browser
        sticks keypresses in this queue via callback, and keys are
        later pulled out and applied to the game state during the
        game logic loop."}
  *key-event-queue* (atom '()))

;; ---

(defn next-game-state
  "**Main logic loop**

Given the current game-state, threads it through a series of functions that
calculate the next game-state.  This is the most fundamental call in the
game; it applies all of the logic.

The last call, schedule-next-frame, schedules this function to be called
again by the browser sometime in the future with the update game-state
after passing through all the other functions.  This implements the game loop.
"
  [game-state]
  (if (:is-zooming? game-state)
    (game-logic-non-playable game-state)
    (game-logic-playable game-state)))

(defn game-logic-playable
  "Called by next-game-state when game and player are active."
  [game-state]
  (let [gs1 (->> game-state
                 clear-player-segment
                 dequeue-keypresses
                 highlight-player-segment
                 maybe-change-level
                 clear-frame
                 draw-board
                 render-frame)
        gs2 (->> gs1
                 remove-collided-entities
                 remove-collided-bullets
                 update-projectile-locations
                 update-enemy-locations
                 maybe-split-tankers
                 handle-dead-enemies
                 maybe-enemies-shoot)
        gs3 (->> gs2
                 maybe-make-enemy
                 check-if-player-captured
                 update-player-if-shot
                 check-if-enemies-remain
                 update-entity-is-flipping
                 update-entity-flippyness
                 animate-player-capture
                 update-frame-count
                 maybe-render-fps-display)]
    (->> gs3 schedule-next-frame)))


(defn game-logic-non-playable
  "Called by next-game-state for non-playable animations."
  [game-state]
  (->> game-state
       clear-frame
       draw-board
       render-frame
       update-frame-count
       maybe-render-fps-display
       schedule-next-frame))

;; ---

(defn build-game-state
  "Returns an empty game-state map."
  []
  {:enemy-list '()
   :projectile-list '()
   :player '()
   :context nil
   :bgcontext nil
   :anim-fn identity
   :dims {:width 0 :height 0}
   :level-idx 0
   :level nil
   :frame-count 0
   :frame-time 0
   :paused? false
   :is-zooming? true
   :zoom-in? true
   :zoom 0.0
   :level-done? false
   })

(defn check-if-enemies-remain
  [game-state]
  (let [level (:level game-state)
        player (:player game-state)
        on-board (count (:enemy-list game-state))
        unlaunched (apply + (vals (:remaining level)))
        remaining (+ on-board unlaunched)]
    (if (zero? remaining)
      (assoc game-state :is-zooming? true :zoom-in? false)
      game-state)))

(defn change-level
  "Changes current level of game."
  [game-state level-idx]
  (let [level (get levels/*levels* level-idx)]
    (assoc game-state
      :level-idx level-idx
      :level level
      :player (build-player level 0)
      :zoom 0.0
      :zoom-in? true
      :is-zooming? true
      :level-done? false
      :projectile-list '()
      :enemy-list '())))

(defn maybe-change-level
  "Reloads or moves to the next level if player is dead, or if all enemies are
   dead."
  [game-state]
  (let [player (:player game-state)
        level (:level game-state)]
    (cond
     (and (:is-dead? player) (:level-done? game-state))
     (change-level game-state (:level-idx game-state))
     (and (not (:is-dead? player)) (:level-done? game-state))
     (change-level game-state (inc (:level-idx game-state)))
     :else game-state)))
             

(defn build-projectile
  "Returns a dictionary describing a projectile (bullet) on the given level,
   in the given segment, with a given stride (steps per update to move, with
   negative meaning in and positive meaning out), and given step to start on."
  [level seg-idx stride & {:keys [step from-enemy?]
                           :or {step 0 from-enemy? false}}]
  {:step step
   :stride stride
   :segment seg-idx
   :damage-segment seg-idx
   :level level
   :path-fn path/projectile-path-on-level
   :from-enemy? from-enemy?
   })

(def ^{:doc "Enumeration of directions a flipper can be flipping."}
  DirectionEnum {"NONE" 0 "CW" 1 "CCW" 2})

(def ^{:doc "Enumeration of types of enemies."}
  EnemyEnum {"NONE" 0 "FLIPPER" 1 "TANKER" 2
             "SPIKER" 3 "FUSEBALL" 4 "PULSAR" 5})

(defn direction-string-from-value
  "Given a value from DirectionEnum, return the corresponding string."
  [val]
  (first (first (filter #(= 1 (peek %)) (into [] maptest)))))

(defn build-enemy
  "Returns a dictionary describing an enemy on the given level and segment,
   and starting on the given step.  Step defaults to 0 (innermost step of
   level) if not specified. TODO: Only makes flippers."
  [level seg-idx & {:keys [step] :or {step 0}}]
  {:step step
   :stride 1
   :segment seg-idx
   :damage-segment seg-idx
   :level level
   :hits-remaining 1
   :path-fn #([])
   :flip-dir (DirectionEnum "NONE")
   :flip-point [0 0]
   :flip-stride 1
   :flip-max-angle 0
   :flip-cur-angle 0
   :flip-probability 0
   :can-flip false
   :shoot-probability 0
   :type (EnemyEnum "NONE")
   })

(defn build-tanker
  "Returns a new tanker enemy.  Tankers move slowly and do not shoot or flip."
  [level seg-idx & {:keys [step] :or {step 0}}]
  (assoc (build-enemy level seg-idx :step step)
    :type (EnemyEnum "TANKER")
    :path-fn path/tanker-path-on-level
    :can-flip false
    :stride 0.2
    :shoot-probability 0.0
    ))

(defn build-flipper
  "A more specific form of build-enemy for initializing a flipper."
  [level seg-idx & {:keys [step] :or {step 0}}]
  (assoc (build-enemy level seg-idx :step step)
    :type (EnemyEnum "FLIPPER")
    :path-fn path/flipper-path-on-level
    :flip-dir (DirectionEnum "NONE")
    :flip-point [0 0]
    :flip-stride 1
    :flip-step-count 20
    :flip-max-angle 0
    :flip-cur-angle 0
    :flip-permanent-dir nil
    :flip-probability 0.015
    :can-flip true
    :shoot-probability 0.004
    ))

(defn projectiles-after-shooting
  "Returns a new list of active projectiles after randomly adding shots from
   enemies."
  [enemy-list projectile-list]
  (loop [[enemy & enemies] enemy-list
         projectiles projectile-list]
    (if (nil? enemy) projectiles
        (if (and (<= (rand) (:shoot-probability enemy))
                 (not= (:step enemy) (:steps (:level enemy)))
                 (pos? (:stride enemy)))
          (recur enemies (add-enemy-projectile projectiles enemy))
          (recur enemies projectiles)))))

(defn maybe-enemies-shoot
  "Randomly adds new projectiles coming from enemies based on the enemies'
   shoot-probability field.  See projectiles-after-shooting."
  [game-state]
  (let [enemies (:enemy-list game-state)
        projectiles (:projectile-list game-state)]
  (assoc game-state
    :projectile-list (projectiles-after-shooting enemies projectiles))))

(defn maybe-make-enemy
  "Randomly create new enemies if the level needs more.  Each level has a total
   count and probability of arrival for each type of enemy.  When a new enemy
   is added by this function, the total count for that type is decremented.
   If zero enemies are on the board, probability of placing one is increased
   two-fold to avoid long gaps with nothing to do."
  [game-state]
  (let [;;flipper-fn (macros/dumbtest flipper)
        flipper-fn (macros/random-enemy-fn flipper)
        tanker-fn (macros/random-enemy-fn tanker)]
    (->> game-state
         flipper-fn
         tanker-fn)))


(defn flip-angle-stride
  "Returns the angle stride of a flipper, which is how many radians to
increment his current flip angle by to be completely flipped onto his
destination segment (angle of max-angle) on 'steps' number of increments,
going clockwise if cw? is true, or counter-clockwise otherwise.

### Implementation details:

There are three known possibilities for determining the stride such that the
flipper appears to flip 'inside' the level:

 * max-angle/steps -- If flipper is going clockwise and max-angle is less
   than zero, or if flipper is going counter-clockwise and max-angle is
   greater than zero.
 * (max-angle - 2PI)/steps -- If flipper is going clockwise and max-angle
   is greater than zero.
 * (max-angle + 2PI)/steps -- If flipper is going counter-clockwise and
   max-angle is less than zero.
"
  [max-angle steps cw?]
  (let [dir0 (/ max-angle steps)
        dir1 (/ (- max-angle 6.2831853) steps)
        dir2 (/ (+ max-angle 6.2831853) steps)]
  (cond
   (<= max-angle 0) (if cw? dir0 dir2)
   :else (if cw? dir1 dir0))))

(defn mark-flipper-for-flipping
  "Updates a flipper's map to indicate that it is currently flipping in the
   given direction, to the given segment index.  cw? should be true if
   flipping clockwise, false for counter-clockwise."
  [flipper direction seg-idx cw?]
  (let [point (path/flip-point-between-segments
               (:level flipper)
               (:segment flipper)
               seg-idx
               (:step flipper)
               cw?)
        max-angle (path/flip-angle-between-segments
                   (:level flipper)
                   (:segment flipper)
                   seg-idx
                   cw?)
        step-count (:flip-step-count flipper)
        stride (flip-angle-stride max-angle step-count cw?)
        permanent (if (= (:steps (:level flipper))
                         (:step flipper)) direction nil)]
    (assoc flipper
      :stride 0
      :old-stride (:stride flipper)
      :flip-dir direction
      :flip-cur-angle 0
      :flip-to-segment seg-idx
      :flip-point point
      :flip-max-angle max-angle
      :flip-stride stride
      :flip-steps-remaining step-count
      :flip-permanent-dir permanent)))

(defn update-entity-stop-flipping
  "Updates an entity and marks it as not currently flipping."
  [flipper]  
  (assoc flipper
    :stride (:old-stride flipper)
    :flip-dir (DirectionEnum "NONE")
    :flip-cur-angle 0
    :segment (:flip-to-segment flipper)))

(defn random-direction
  "Returns a random direction from DirectionEnum (not 'NONE')"
  []
  (condp = (rand-int 2)
        0 (DirectionEnum "CW")
        (DirectionEnum "CCW")))

(defn segment-for-flip-direction
  "Returns the segment that the given flipper would flip into if it flipped
   in direction flip-dir.  If the flipper can't flip that way, it will
   return the flipper's current segment."
  [flipper flip-dir]
  (condp = flip-dir
        (DirectionEnum "CW") (segment-entity-cw flipper)
        (segment-entity-ccw flipper)))

(defn swap-flipper-permanent-dir
  "Given a flipper with its 'permanent direction' set, this swaps the
   permanent direction to be opposite.  A flipper's permanent direction is
   the direction it flips constantly along the outermost edge of the level
   until it hits a boundary."
  [flipper]
  (let [cur-dir (:flip-permanent-dir flipper)
        new-dir (if (= (DirectionEnum "CW") cur-dir)
                  (DirectionEnum "CCW")
                  (DirectionEnum "CW"))]
    (assoc flipper :flip-permanent-dir new-dir)))

(defn engage-flipping
  "Mark flipper as flipping in given direction, unless no segment is in
   that direction."
  [flipper flip-dir]
  (let [flip-seg-idx (segment-for-flip-direction flipper flip-dir)
        cw? (= flip-dir (DirectionEnum "CW"))]
    (if (not= flip-seg-idx (:segment flipper))
      (mark-flipper-for-flipping flipper flip-dir
                                 flip-seg-idx cw?)
      flipper)))

(defn maybe-engage-flipping
  "Given a flipper, returns the flipper possibly modified to be in a state
   of flipping to another segment.  This will always be true if the flipper
   is on the outermost edge of the level, and will randomly be true if it
   has not reached the edge."
  [flipper]
  (let [should-flip (and
                     (true? (:can-flip flipper))
                     (= (:flip-dir flipper) (DirectionEnum "NONE"))
                     (or (<= (rand) (:flip-probability flipper))
                         (= (:step flipper) (:steps (:level flipper)))))
        permanent-dir (:flip-permanent-dir flipper)
        flip-dir (or permanent-dir (random-direction))
        flip-seg-idx (segment-for-flip-direction flipper flip-dir)
        cw? (= flip-dir (DirectionEnum "CW"))]
    (cond
     (false? should-flip) flipper
     (not= flip-seg-idx (:segment flipper)) (mark-flipper-for-flipping
                                             flipper flip-dir
                                             flip-seg-idx cw?)
     (not (nil? permanent-dir)) (swap-flipper-permanent-dir flipper)
     :else flipper)))

(defn mark-player-captured
  "Marks player as being captured."
  [player]
  (assoc player
    :captured? true
    :stride -4))

(defn mark-enemy-capturing
  "Marks enemy as having captured the player."
  [enemy]
  (assoc enemy
    :capturing true
    :can-flip false
    :step (- (:step enemy) 10) ;; looks better if enemy leads player
    :stride -4))

(defn enemy-is-on-player?
  "Returns true if given enemy and player are on top of each other."
  [player enemy]
  (and (= (:segment player) (:segment enemy))
       (= (:step player) (:step enemy))
       (= (DirectionEnum "NONE") (:flip-dir enemy))))

(defn player-and-enemies-if-captured
  "Given player and current list of enemies, returns an updated player
   and updated enemy list if an enemy is capturing the player in vector
   [player enemy-list].  Returns nil if no capture occurred."
  [player enemy-list]
  (let [{colliders true missers false}
        (group-by (partial enemy-is-on-player? player) enemy-list)]
    (when-let [[enemy & rest] colliders]
      [(mark-player-captured player)
       (cons (mark-enemy-capturing enemy) (concat missers rest))])))

(defn check-if-player-captured
  "If player is not already captured, checks all enemies to see if they
   are now capturing the player.  See player-and-enemies-if-captured.
   If capture is in progress, returns game-state with player and enemy-list
   updated."
  [game-state]
  (if (:captured? (:player game-state))
    game-state
    (if-let [[player enemy-list] (player-and-enemies-if-captured
                                  (:player game-state)
                                  (:enemy-list game-state))]
      (assoc game-state :enemy-list enemy-list :player player)
      game-state)))


(defn update-entity-is-flipping
  "Decide if an enemy should start flipping for every enemy on the level."
  [game-state]
  (let [{enemy-list :enemy-list} game-state]
    (assoc game-state :enemy-list (map maybe-engage-flipping enemy-list))))

(defn update-entity-flippyness
  "Update the position of any actively flipping enemy for every enemy on the
   level."
  [game-state]
  (let [{enemy-list :enemy-list} game-state]
    (assoc game-state :enemy-list (map update-flip-angle enemy-list))))

(defn update-flip-angle
  "Given a flipper in the state of flipping, updates its current angle.  If
   the update would cause it to 'land' on its new segment, the flipper is
   updated and returned as a no-longer-flipping.  If the given enemy is
   not flipping, returns it unchanged."
  [flipper]
  (let [new-angle (+ (:flip-stride flipper) (:flip-cur-angle flipper))
        remaining (dec (:flip-steps-remaining flipper))
        new-seg (if (<= remaining (/ (:flip-step-count flipper) 2))
                  (:flip-to-segment flipper)
                  (:segment flipper))]
    (if (not= (:flip-dir flipper) (DirectionEnum "NONE"))
      (if (< remaining 0)
        (update-entity-stop-flipping flipper)
        (assoc flipper
          :damage-segment new-seg
          :flip-cur-angle new-angle
          :flip-steps-remaining remaining))
      flipper)))


(defn build-player
  "Returns a dictionary describing a player on the given level and segment."
  [level seg-idx]
  {:segment seg-idx
   :level level
   :captured? false
   :step (:steps level)
   :bullet-stride -5
   :stride 0
   :path path/*player-path*
   :is-dead? false
   })

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

(defn update-entity-list
  "Call update-entity-position! on all entities in list."
  [entity-list]
  (map update-entity-position! entity-list))

(defn entity-between-steps
  "Returns true of entity is on seg-idx, and between steps step0 and step1,
   inclusive."
  [seg-idx step0 step1 entity]
  (let [min (min step0 step1)
        max (max step0 step1)]
    (and
     (= (:damage-segment entity) seg-idx)
     (>= (:step entity) min)
     (<= (:step entity) max))))

(defn projectiles-after-collision
  "Given an entity and a list of projectiles, returns the entity and updated
   list of projectiles after collisions.  The entity's hits-remaining counter
   is decremented on a collision, and the projectile is removed.  Small amount
   of fudge factor (1 step += actual projectile location) to avoid narrow
   misses in the collision algorithm."
  [entity projectile-list]
  ((fn [entity projectiles-in projectiles-out was-hit?]
     (if (empty? projectiles-in)
       {:entity entity :projectiles projectiles-out :was-hit? was-hit?}
       (let [bullet (first projectiles-in)
             collision? (entity-between-steps
                         (:segment bullet)
                         (inc (:step bullet))
                         (dec (entity-next-step bullet))
                         entity)]
         (if (and (not (:from-enemy? bullet)) collision?)
           (recur (decrement-enemy-hits entity)
                  nil
                  (concat projectiles-out (rest projectiles-in))
                  true)
           (recur entity
                  (rest projectiles-in)
                  (cons bullet projectiles-out)
                  was-hit?)))))
   entity projectile-list '() false))

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
           (recur (rest entities-in)
                  (cons entity entities-out)
                  projectiles))))
   entity-list '() projectile-list))


(defn new-flippers-from-tanker
  "Spawns two new flippers from one tanker.  These flippers are automatically
   set to be flipping to the segments surround the tanker, unless one of the
   directions is blocked, in which case that flipper just stays on the tanker's
   segment."
  [enemy]
  (let [{:keys [segment level step]} enemy]
    (list
     (engage-flipping
      (build-flipper level segment :step step)
      (DirectionEnum "CW"))
     (engage-flipping
      (build-flipper level segment :step step)
      (DirectionEnum "CCW")))))

(defn enemy-list-after-deaths
  "Returns the enemy list updated for deaths.  This means removing enemies
   that died, and possibly adding new enemies for those that spawn children
   on death."
  [enemy-list]
  (let [{live-enemies false dead-enemies true}
        (group-by #(zero? (:hits-remaining %)) enemy-list)]
    (loop [[enemy & enemies] dead-enemies
           enemies-out '()]
      (cond
       (nil? enemy) (concat live-enemies enemies-out)
       (= (:type enemy) (EnemyEnum "TANKER"))
       (recur enemies (concat (new-flippers-from-tanker enemy) enemies-out))
       :else (recur enemies enemies-out)))))

(defn handle-dead-enemies
  "Return game state after handling dead enemies, by removing them and possibly
   replacing them with children."
  [game-state]
  (let [enemy-list (:enemy-list game-state)]
    (assoc game-state :enemy-list (enemy-list-after-deaths enemy-list))))

(defn kill-tanker-at-top
  "If the given tanker is at the top of a level, mark it as dead."
  [tanker]
  (let [step (:step tanker)
        maxstep (:steps (:level tanker))]
    (if (= step maxstep)
      (assoc tanker :hits-remaining 0)
      tanker)))

(defn maybe-split-tankers
  "Marks tankers at the top of the level as ready to split into flippers."
  [game-state]
  (let [enemy-list (:enemy-list game-state)
        {tankers true others false}
        (group-by #(= (:type %) (EnemyEnum "TANKER")) enemy-list)]
    (assoc game-state
      :enemy-list (concat (map kill-tanker-at-top tankers) others))))

(defn animate-player-capture
  "Updates player's position on board while player is in the process of being
   captured by an enemy, and marks player as dead when he reaches the inner
   boundary of the level.  When player dies, level zoom-out is initiated."
  [global-state]
  (let [player (:player global-state)
        captured? (:captured? player)
        isdead? (zero? (:step player))]
    (cond
     (false? captured?) global-state
     (true? isdead?) (assoc global-state
                       :player (assoc player :is-dead? true)
                       :enemy-list '()
                       :projectile-list '()
                       :is-zooming? true
                       :zoom-in? false)
     :else  (assoc global-state :player (update-entity-position! player)))))

(defn update-zoom
  "Updates current zoom value of the level, based on direction of :zoom-in?
   in the global-state.  This is used to animate the board zooming in or
   zooming out at the start or end of a round.  If this was a zoom out, and
   it's finished, mark the level as done so it can restart."
  [global-state]
  (let [zoom (:zoom global-state)
        zoom-in? (:zoom-in? global-state)
        zoom-step 0.04
        newzoom (if zoom-in? (+ zoom zoom-step) (- zoom zoom-step))
        target (if zoom-in? 1.0 0.0)
        cmp (if zoom-in? >= <=)]
    (if (cmp zoom target) (assoc global-state
                            :is-zooming? false
                            :level-done? (not zoom-in?))
        (if (cmp newzoom target)
          (assoc global-state :zoom target)
          (assoc global-state :zoom newzoom)))))

(defn clear-player-segment
  "Returns game-state unchanged, and as a side affect clears the player's
   current segment back to blue.  To avoid weird color mixing, it is cleared
   to black first (2px wide), then redrawn as blue (1.5px wide).  This looks
   right, but is different from how the board is drawn when done all at once."
  [game-state]
  (do
    (set! (. (:bgcontext game-state) -lineWidth) 2)
    (draw/draw-player-segment game-state {:r 0 :g 0 :b 0})
    (set! (. (:bgcontext game-state) -lineWidth) 1.5)
    (draw/draw-player-segment game-state {:r 10 :g 10 :b 100})
    game-state))

(defn highlight-player-segment
  "Returns game-state unchanged, and as a side effect draws the player's
   current segment with a yellow border."
  [game-state]
  (do
    (set! (. (:bgcontext game-state) -lineWidth) 1)
    (draw/draw-player-segment game-state {:r 150 :g 150 :b 15})
    game-state))


(defn draw-board
  "Draws the level when level is zooming in or out, and updates the zoom level.
   This doesn't redraw the board normally, since the board is drawn on a
   different HTML5 canvas than the players for efficiency."
  [global-state]
  (let [is-zooming? (:is-zooming? global-state)
        zoom (:zoom global-state)
        {width :width height :height} (:dims global-state)]
    (if is-zooming?
      (do
        (draw/clear-context (:bgcontext global-state) (:dims global-state))
        (draw/draw-board (assoc global-state
                           :dims {:width (/ width zoom)
                                  :height (/ height zoom)}))
        (update-zoom global-state))
        global-state)))
        

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

(defn add-enemy-projectile
  "Add a new projectile to the global list of live projectiles, originating
   from the given enemy, on the segment he is currently on."
  [projectile-list enemy]
  (let [level (:level enemy)
        seg-idx (:segment enemy)
        stride (+ (:stride enemy) 2)
        step (:step enemy)]
    (conj projectile-list
          (build-projectile level seg-idx stride :step step :from-enemy? true))))

(defn add-player-projectile
  "Add a new projectile to the global list of live projectiles, originating
   from the given player, on the segment he is currently on."
  [projectile-list player]
  (let [level (:level player)
        seg-idx (:segment player)
        stride (:bullet-stride player)
        step (:step player)]
    (conj projectile-list
          (build-projectile level seg-idx stride :step step))))

(defn segment-entity-cw
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


(defn segment-entity-ccw
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


(defn queue-keypress
  "Atomically queue keypress in global queue for later handling.  This should
   be called as the browser's key-handling callback."
  [event]
  (let [key (.-keyCode event)]
    (swap! *key-event-queue* #(concat % [key]))
    (.preventDefault event)
    (.stopPropagation event)))

(defn handle-keypress
  "Returns new game state updated to reflect the results of a player's
   keypress.

   ## Key map

       * Right -- Move counter-clockwise
       * Left -- Move clockwise
       * Space -- Shoot
       * Escape -- Pause
  "
  [game-state key]
  (let [player (:player game-state)
        projectile-list (:projectile-list game-state)
        paused? (:paused? game-state)]
    (condp = key
      key-codes/RIGHT (assoc game-state
                        :player
                        (assoc player :segment (segment-entity-ccw player)))
      key-codes/LEFT  (assoc game-state
                        :player
                        (assoc player :segment (segment-entity-cw player)))
      key-codes/SPACE (assoc game-state
                        :projectile-list
                        (add-player-projectile projectile-list player))
      key-codes/ESC (assoc game-state (not paused?))
      game-state
      )))

(defn dequeue-keypresses
  "Atomically dequeue keypresses from global queue and pass to handle-keypress,
until global queue is empty.  Returns game state updated after applying
all keypresses.

Has a side effect of clearing global *key-event-queue*.

## Implementation details:

Use compare-and-set! instead of swap! to test against the value we
entered the loop with, instead of the current value.  compare-and-set!
returns true only if the update was a success (i.e. the queue hasn't
changed since entering the loop), in which case we handle the key.
If the queue has changed, we do nothing.  The loop always gets called
again with the current deref of the global state.
"
  [game-state]
  (loop [state game-state
         queue @*key-event-queue*]
    (if (empty? queue)
      state
      (let [key (first queue)
            valid? (compare-and-set! *key-event-queue* queue (rest queue))]
        (if (and valid? (not (:captured? (:player game-state))))
          (recur (handle-keypress state key) @*key-event-queue*)
          (recur state @*key-event-queue*))))))


(defn animationFrameMethod
  "Returns a callable javascript function to schedule a frame to be drawn.
Tries to use requestAnimationFrame, or the browser-specific version of
it that is available.  Falls back on setTimeout if requestAnimationFrame
is not available on player's browser.

requestAnimationFrame tries to figure out a consistent framerate based
on how long frame takes to render.

The setTimeout fail-over is hard-coded to attempt 30fps.
"
  []
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


(defn clear-frame
  "Returns game state unmodified, clears the HTML5 canvas as a side-effect."
  [game-state]
  (do
    (draw/clear-context (:context game-state) (:dims game-state))
    game-state))

(defn render-frame
  "Draws the current game-state on the HTML5 canvas.  Returns the game state
   unmodified (drawing is a side-effect)."
  [game-state]
  (let [{context :context
         dims :dims
         level :level
         enemy-list :enemy-list
         projectile-list :projectile-list
         player :player}
        game-state
        {enemy-shots true player-shots false}
        (group-by :from-enemy? projectile-list)]
    (if (not (:is-dead? player))
      (draw/draw-player context dims level player))
    (draw/draw-entities context dims level enemy-list {:r 150 :g 10 :b 10})
    (draw/draw-entities context dims level
                        player-shots
                        {:r 255 :g 255 :b 255})
    (draw/draw-entities context dims level
                        enemy-shots
                        {:r 150 :g 15 :b 150})
    game-state))

(defn remove-collided-entities
  "Detects and removes projectiles that have collided with enemies, and enemies
   whose hit counts have dropped to zero.  Returns updated game-state."
  [game-state]
  (let [{enemy-list :enemy-list
         projectile-list :projectile-list}
        game-state]
    (let [{plist :projectiles elist :entities}
          (entities-after-collisions enemy-list projectile-list)]
      (assoc game-state
        :projectile-list plist
        :enemy-list elist))))

(defn bullets-will-collide?
  "Returns true if two bullets will collide within the next frame, and one is
   from the player and the other is from an enemy."
  [bullet1 bullet2]
  (let [max-stride (max (:stride bullet1) (:stride bullet2))
        min-stride (min (:stride bullet1) (:stride bullet2))
        step1 (:step bullet1)
        step2 (:step bullet2)
        next-step1 (entity-next-step bullet1)
        next-step2 (entity-next-step bullet2)]
    (and (or (and (>= step1 step2) (<= next-step1 next-step2))
             (and (>= step2 step1) (<= next-step2 next-step1)))
         (neg? min-stride)
         (pos? max-stride)
         (if (:from-enemy? bullet1)
           (not (:from-enemy? bullet2))
           (:from-enemy? bullet2)))))
           
(defn projectile-list-without-collisions
  "Given a list of projectiles, returns the list minus any bullet-on-bullet
   collisions that occur within it."
  [projectiles]
  (loop [[bullet & others] projectiles
         survivors '()]
    (if (nil? bullet) survivors
        (let [{not-hit false hit true}
              (group-by #(bullets-will-collide? bullet %) others)]
          (if-not (empty? hit)
            (recur (concat not-hit (rest hit)) survivors)
            (recur others (cons bullet survivors)))))))

(defn remove-collided-bullets
  "Remove bullets that have hit each other.  Only player-vs-enemy collisions
   count.  Breaks list of projectiles into one list per segment, and then
   runs projectile-list-without-collisions on each of those lists to get
   back a final list of only bullets that aren't involved in collisions."
  [game-state]
  (let [projectile-list (:projectile-list game-state)
        segment-lists (vals (group-by :segment projectile-list))
        non-collided (mapcat projectile-list-without-collisions segment-lists)]
    (assoc game-state :projectile-list non-collided)))

(defn bullets-will-kill-player?
  "Returns true given bullet will hit the given player."
  [player bullet]
  (let [next-step (entity-next-step bullet)
        player-step (:step player)]
    (and (= player-step next-step)
         (:from-enemy? bullet))))

(defn update-player-if-shot
  "Updates the player to indicate whether he was shot by an enemy."
  [game-state]
  (let [projectile-list (:projectile-list game-state)
        player (:player game-state)
        on-segment (filter #(= (:segment player) (:segment %)) projectile-list)
        {hit true miss false} (group-by
                               #(bullets-will-kill-player? player %)
                               on-segment)]
    (if-not (empty? hit)
      (assoc game-state
        :player (assoc player :is-dead? true)
        :is-zooming? true
        :enemy-list '()
        :projectile-list '()
        :zoom-in? false)
      game-state)))

(defn update-projectile-locations
  "Returns game-state with all projectiles updated to have new positions
   based on their speeds and current position."
  [game-state]
  (let [{projectile-list :projectile-list} game-state
        rm-fn (partial remove projectile-off-level?)]
    (assoc game-state
      :projectile-list (-> projectile-list
                           update-entity-list
                           rm-fn))))

(defn update-enemy-locations
  "Returns game-state with all of the enemies updated to have new positions
   based on their speeds and current position."
  [game-state]
  (let [{enemy-list :enemy-list} game-state]
    (assoc game-state :enemy-list (update-entity-list enemy-list))))

(defn schedule-next-frame
  "Tells the player's browser to schedule the next frame to be drawn, using
   whatever the best mechanism the browser has to do so."
  [game-state]
  ((:anim-fn game-state) #(next-game-state game-state)))

(defn update-frame-count
  "Increments the game-state's frame counter, which is a count of frames since
   the last FPS measurement."
  [game-state]
  (let [{frame-count :frame-count}
        game-state]
    (assoc game-state :frame-count (inc frame-count))))

(defn render-fps-display
  "Print a string representation of the most recent FPS measurement in
   an HTML element named 'fps'.  This resets the frame-count and frame-time
   currently stored in the game state."
  [game-state]
  (let [{frame-count :frame-count
         frame-time :frame-time}
        game-state
        fps (/ (* 1000 frame-count) (- (goog.now) frame-time))
        str-fps (pr-str (util/round fps))]
    (dom/setTextContent (dom/getElement "fps") (str "FPS: " str-fps))
    (assoc game-state
      :frame-count 0
      :frame-time (goog.now))))

(defn maybe-render-fps-display
  "Calls render-fps-display if the frame-count is above a certain threshhold."
  [game-state]
  (if (= (:frame-count game-state) 20)
    (render-fps-display game-state)
    game-state))

