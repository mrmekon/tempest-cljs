(ns tempest
  (:require [tempest.levels :as levels]
            [tempest.util :as util]
            [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.math :as math]
            [goog.events.KeyHandler :as key-handler]
            [goog.events.KeyCodes :as key-codes]
            [clojure.browser.repl :as repl])
  (:require-macros [tempest.macros :as macros]))

;;
;;
;; Rough design notes:
;;
;;  * Nearly everything is defined with polar coordinates (length and angle)
;;  * "Entities" are players, enemies, projectiles
;;  * "Entities" are defined by a path, a series of polar coordinates, that
;;    are in relation to the previous point in the path.
;;  * Polar coordinates are converted to cartesian coordinates shortly before
;;    drawing.
;;  * Levels have a number of "steps" defined, which is how many occupiable
;;    points the level has (instead of allowing continuous motion).
;;  * An entity's location in the level is dictated by its current segment,
;;    and which step of the level it's on.
;;  * An entity has a "stride", which is how many steps it moves per update.
;;    The sign of the stride is direction, with positive strides moving out
;;    towards the player.
;;
;; Obscure design oddities:
;;
;;  * draw-path can optionally follow, but not draw, the first line of an
;;    entity's path.  There is a crazy reason for this.  The 'center' of
;;    an entity when drawn ends up being the first point drawn.  The first
;;    vertex is the one that gets centered on its location on the board. If
;;    the needs to be centered around a point that is not drawn (or just
;;    not its first point), the first, undrawn line given to draw-path
;;    can be a line from where the entity's center should be to its first
;;    drawn vertex.  An example is the player's ship, whose first vertex
;;    is it's "rear thruster", but who's origin when drawing must be up
;;    in the front center of the ship.
;;
;;


(repl/connect "http://localhost:9000/repl")

;;
;; TODO:
;;
;;   * BUG: there's an extra segment at the top of level 6 with no width
;;   * Bullet updates should check if they hit or passed over an enemy
;;   * Flippers should.. flip.
;;   * Player should be sucked down the level if a flipper touches him
;;   * MOAR ENEMIES
;;   * Jump?  Is that possible with this design?  I think so, easily, by
;;     scaling just the first, undrawn line of player.  It ends up being
;;     normal to the segment's top line.
;;   * Power ups.  Bonus points if they're crazy swirly particle things.
;;   * Board colors.  Blue on black is the classic.
;;   * Current segment highlight color
;;   * Browser + keyboard input stuff
;;     - Find appropriate size for canvas.  Maybe there's a way to make it
;;       "full screen"
;;     - Don't let spacebar scroll the screen, or use a different key
;;     - Any way to change repeat rate?  Probably not
;;     - Any way to use the mouse?
;;     - I'm not above making a custom rotary controller.
;;     - Two keys at the same time?  Gotta swirl-n-shoot.
;;   * Offset flat levels up more, instead of displaying them at the bottom.
;;   * Rate-limit bullets
;;   * Frame timing, and disassociate movement speed from framerate.
;;

;; Path that defines player.
(def player-path
  [[40 90]
   [44 196]
   [27 333]
   [17 135]
   [30 11]
   [30 349]
   [17 225]
   [27 27]
   [44 164]])


;;(def flipper-path
;;  [[32 16]
;;   [16 214]
;;   [16 326]
;;   [64 164]
;;   [16 326]
;;   [16 214]
;;   [32 16]])

;;(def bullet-path
;;  [[11.3 90]
;;   [16 45]
;;   [16 135]
;;   [16 225]
;;   [16 315]
;;   ])

(defn round-path-math
  "Rounds all numbers in a path (vector of 2-tuples) to nearest integer."
  [path]
  (map (fn [coords]
         [(js/Math.round (first coords))
          (js/Math.round (peek coords))])
       path))

(defn round-path-hack
  "Rounds all numbers in a path (vector of 2-tuples) to nearest integer.
   ONLY WORKS WITH POSITIVE NUMBERS.  Faster than round-path-math."
  [path]
  (map (fn [[x y]]
         [(js* "~~" (+ 0.5 x))
          (js* "~~" (+ 0.5 y))])
       path))

;; Use round-path-hack for now, since it's theoretically faster
(def round-path round-path-hack)

(defn flipper-path-with-width
  "Returns a path to draw a 'flipper' enemy with given width."
  [width]
  (let [r (/ width (js/Math.cos (util/deg-to-rad 16)))]
    [[0 0]
     [(/ r 2) 16]
     [(/ r 4) 214]
     [(/ r 4) 326]
     [r 164]
     [(/ r 4) 326]
     [(/ r 4) 214]
     [(/ r 2) 16]]))

(defn projectile-path-with-width
  "Returns a path to draw a projectile with the given width."
  [width]
  (let [r (/ width (* 2 (js/Math.cos (util/deg-to-rad 45))))
        midheight (* r (js/Math.sin (util/deg-to-rad 45)))]
    [[midheight 270]
     [r 45]
     [r 135]
     [r 225]
     [r 315]]))

(defn build-projectile
  "Returns a dictionary describing a projectile (bullet) on the given level,
   in the given segment, with a given stride (steps per update to move, with
   negative meaning in and positive meaning out), and given step to start on."
  [level seg-idx stride & {:keys [step] :or {step 0}}]
  {:step step
   :stride stride
   :segment seg-idx
   :level level
   :path-fn projectile-path-on-level
   })

(defn build-enemy
  "Returns a dictionary describing an enemy on the given level and segment,
   and starting on the given step.  Step defaults to 0 (innermost step of
   level) if not specified. TODO: Only makes flippers."
  [level seg-idx & {:keys [step] :or {step 0}}]
  {:step step
   :stride 1
   :segment seg-idx
   :path-fn flipper-path-on-level
   :level level
   :hits-remaining 1})

(defn build-player
  "Returns a dictionary describing a player on the given level and segment."
  [level seg-idx]
  {:segment seg-idx
   :level level
   :step (:steps level)})

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

(defn scale-polar-coord
  "Return a polar coordinate with the first element (radius) scaled using
   the function scalefn"
  [scalefn coord]
  [(scalefn (first coord)) (peek coord)])

(defn rotate-path
  "Add angle to all polar coordinates in path."
  [angle path]
  (map (fn [coords]
         [(first coords)
          (mod (+ angle (peek coords)) 360)])
       path))

(defn scale-path
  "Multiply all lengths of polar coordinates in path by scale."
  [scale path]
  (map (fn [coords]
         [(* scale (first coords))
          (peek coords)])
       path))

(defn polar-extend
  "Add 'length' to radius of polar coordinate."
  [length coord]
  [(+ length (first coord))
   (peek coord)])

(defn path-extend
  "Add 'length' to all polar coordinates in path"
  [length path]
  (map #(polar-extend length %) path))

(defn polar-entity-coord
  "Returns current polar coordinates to the entity."
  [entity]
  (let [steplen (step-length-segment-midpoint (:level entity)
                                              (:segment entity))
        offset (* steplen (:step entity))
        midpoint (segment-midpoint (:level entity) (:segment entity))]
    (polar-extend offset midpoint)))

(defn enemy-angle
  "Returns the angle from origin that the enemy needs to be rotated to
   appear in the correct orientation at its current spot on the level.
   In reality, it returns the angle of the line that traverses the segment
   across the midpoint of the enemy.  TODO: This should be renamed to
   'entity-angle', it works with anything on the board."
  [enemy]
  (let [edges (polar-lines-for-segment (:level enemy)
                                       (:segment enemy)
                                       false)
        edge-steps (step-lengths-for-segment-lines (:level enemy)
                                                   (:segment enemy))
        offset0 (* (first edge-steps) (:step enemy))
        offset1 (* (peek edge-steps) (:step enemy))
        point0 (polar-extend offset0 (first edges))
        point1 (polar-extend offset1 (peek edges))]
    (util/rad-to-deg
     (apply js/Math.atan2
            (vec (reverse (map - (polar-to-cartesian-coords point0)
                      (polar-to-cartesian-coords point1))))))))
  

(defn enemy-desired-width
  "Returns how wide the given enemy should be drawn to span the full width
   of its current location.  In reality, that means returning the length of
   the line that spans the level segment, cutting through the enemy's
   midpoint.  TODO: rename this entity-desired-width."
  [enemy]
  (let [edges (polar-lines-for-segment (:level enemy)
                                       (:segment enemy)
                                       false)
        edge-steps (step-lengths-for-segment-lines (:level enemy)
                                                   (:segment enemy))
        offset0 (* (first edge-steps) (:step enemy))
        offset1 (* (peek edge-steps) (:step enemy))
        point0 (polar-extend offset0 (first edges))
        point1 (polar-extend offset1 (peek edges))]
    (polar-distance point0 point1)))

(defn player-path-on-level
  "Returns the path of polar coordinates to draw the player correctly at its
   current location.  It corrects for size and angle."
  [player]
  (let [coord (polar-entity-coord player)]
    (scale-path 0.6 (rotate-path
     (enemy-angle player)
     player-path))))

(defn flipper-path-on-level
  "Returns the path of polar coordinates to draw a flipper correctly at its
   current location.  It corrects for size and angle."
  [flipper]
  (let [coord (polar-entity-coord flipper)]
    (rotate-path
     (enemy-angle flipper)
     (flipper-path-with-width (* 0.8 (enemy-desired-width flipper))))))

(defn projectile-path-on-level
  "Returns the path of polar coordinates to draw a projectile correctly at its
   current location.  It corrects for size and angle."
  [projectile]
  (let [coord (polar-entity-coord projectile)]
    (rotate-path
     (enemy-angle projectile)
     (projectile-path-with-width (* 0.3 (enemy-desired-width projectile))))))

(defn add-sub
  "Given two polar coordinates, returns one polar coordinate with the first
   elements (radii) summed, and the second elements (angles) subtracted.
   i.e. [r1+r0, th1-th0].  This is used to move point0 to be relative to
   point1."
  [point0 point1]
  [(+ (first point1) (first point0))
   (- (peek point1) (peek point0))])
  
(defn rebase-origin
  "Return cartesian coordinate 'point' in relation to 'origin'."
  [point origin]
  (add-sub point origin))

(defn polar-to-cartesian-centered
  "Converts a polar coordinate (r,theta) into a cartesian coordinate (x,y)
   centered on in a rectangle with given width and height."
  [point {width :width height :height}]
  (rebase-origin (polar-to-cartesian-coords point) [(/ width 2) (/ height 2)]))

(defn draw-path
  "Draws a 'path', a vector of multiple polar coordinates, on an HTML5 2D
   drawing canvas.

   context -- The '2D Context' of an HTML5 canvas element
   origin -- The point (cartesian coordinate) to start drawing from
   vecs -- Vector of polar coordinates to draw
   skipfirst? -- Whether the first line described by vecs should be drawn.  If
      no, the first line can be used to offset the path, in effect changing the
      'midpoint' of the entity being drawn.  If yes, the 'midpoint' of the
      object is the first vertex from which the first line is drawn.
  "
  [context origin vecs skipfirst?]
  (do
    (.moveTo context (first origin) (peek origin))    
    ((fn [origin vecs skip?]
       (if (empty? vecs)
         nil
         (let [line (first vecs)
               point (rebase-origin (polar-to-cartesian-coords line) origin)]
           (if-not skip?
             (.lineTo context (first point) (peek point))
             (.moveTo context (first point) (peek point)))
           (recur point (next vecs) false))))
     origin vecs skipfirst?)
    (.stroke context)))



(defn polar-to-cartesian-coords
  "Converts polar coordinates to cartesian coordinates.  If optional length-fn
   is specified, it is applied to the radius first."
  ([[r angle]] [(math/angleDx angle r) (math/angleDy angle r)])
  ([[r angle] length-fn]
     (let [newr (length-fn r)]
       [(math/angleDx angle newr) (math/angleDy angle newr)])
     )
  )

(defn polar-distance
  "Returns distance between to points specified by polar coordinates."
  [[r0 theta0] [r1 theta1]]
  (js/Math.sqrt
   (+
    (js/Math.pow r0 2)
    (js/Math.pow r1 2)
    (* -2 r0 r1 (js/Math.cos (util/deg-to-rad (- theta1 theta0)))))))

(defn polar-midpoint-r
  "Returns the radius to the midpoint of a line drawn between two polar
   coordinates."
  [[r0 theta0] [r1 theta1]]
  (js/Math.round
   (/
    (js/Math.sqrt 
     (+
      (js/Math.pow r0 2)
      (js/Math.pow r1 2)
      (* 2 r0 r1 (js/Math.cos (util/deg-to-rad (- theta1 theta0))))))
    2)))

(defn polar-midpoint-theta
  "Returns the angle to the midpoint of a line drawn between two polar
   coordinates."
  [[r0 theta0] [r1 theta1]]
  (js/Math.round
   (mod
    (+ (util/rad-to-deg
        (js/Math.atan2
         (+
          (* r0 (js/Math.sin (util/deg-to-rad theta0)))
          (* r1 (js/Math.sin (util/deg-to-rad theta1))))
         (+
          (* r0 (js/Math.cos (util/deg-to-rad theta0)))
          (* r1 (js/Math.cos (util/deg-to-rad theta1))))
         ))
       360) 360)))

(defn polar-midpoint
  "Returns polar coordinate representing the midpoint between the two
   points specified.  This can be used to draw a line down the middle
   of a level segment -- the line that entities should follow."
  [point0 point1]
  [(polar-midpoint-r point0 point1)
   (polar-midpoint-theta point0 point1)]
  )

(defn segment-midpoint
  "Given a level and a segment index, returns the midpoint of the segment.
   scaled? determines whether it gives you the inner (false) or outer (true)
   point."
  [level seg-idx scaled?]
  (apply polar-midpoint
         (polar-lines-for-segment level seg-idx scaled?)))


(defn polar-lines-for-segment
  "Returns vector [line0 line1], where lineN is a polar coordinate describing
   the line from origin (canvas midpoint) that would draw the edges of a level
   segment.

   'scaled?' sets whether you want the unscaled, inner point, or the
   outer point scaled with the level's scale function.

   To actually draw a level's line, you would move to the unscaled point
   without drawing, and then draw to the scaled point.
   "
  [level seg-idx scaled?]
  (let [[seg0 seg1] (get (:segments level) seg-idx)
        line0 (get (:lines level) seg0)
        line1 (get (:lines level) seg1)]
    (if (true? scaled?)
      [(scale-polar-coord (:length-fn level) line0)
       (scale-polar-coord (:length-fn level) line1)]
      [line0 line1]
      )))

(defn rectangle-for-segment
  "Returns vector [[x0 y0] [x1 y1] [x2 y2] [x3 y3]] describing segment's
   rectangle in cartesian coordinates."
  [level seg-idx]
  (let [[seg0 seg1] (get (:segments level) seg-idx)
        line0 (get (:lines level) seg0)
        line1 (get (:lines level) seg1)]
    [(polar-to-cartesian-coords line0)
     (polar-to-cartesian-coords line0 (:length-fn level))
     (polar-to-cartesian-coords line1 (:length-fn level))
     (polar-to-cartesian-coords line1)]
    ))

(defn point-to-canvas-coords
  "Center a cartesian coordinate centered around (0,0) to be centered around
   the middle of a rectangle with the given width and height.  It inverts y,
   assuming that the input y is 'up', and in the output y is 'down', as is
   the case with an HTML5 canvas."
  [{width :width height :height} p]
  (let [xmid (/ width 2)
        ymid (/ height 2)]
    [(+ (first p) xmid) (- ymid (peek p))]
  ))

(defn rectangle-to-canvas-coords
  "Given a rectangle (vector of 4 cartesian coordinates) centered around (0,0),
   this function shifts them to be centered around the center of an HTML5
   canvas with the :width and :height set in dims."
  [dims rect]
  (map #(point-to-canvas-coords dims %) rect)
  )


(defn draw-rectangle
  "Draws a rectangle (4 cartesian coordinates in a vector) on the 2D context
   of an HTML5 canvas."
  [context [p0 & points]]
  (.moveTo context (first p0) (peek p0))
  (doseq [p points]
    (.lineTo context (first p) (peek p)))
  (.lineTo context (first p0) (peek p0))
  (.stroke context)
  )

(defn step-length-segment-midpoint
  "Finds the 'step length' of a line through the middle of a level's segment.
   This is how many pixels an entity should move per update to travel one
   step."
  [level seg-idx]
  (/
   (-
    (first (segment-midpoint level seg-idx true))
    (first (segment-midpoint level seg-idx false)))
   (:steps level)))

(defn step-length-segment-edge
  "Finds the 'step length' of a line along the edge of a level's segment."
  [level line]
  (/
   (-
    ((:length-fn level) (first line))
    (first line))
   (:steps level)))

(defn step-length-line
  "Finds the 'step length' of an arbitrary line on the given level."
  [level point0 point1]
  (js/Math.abs
   (/
    (-
     (first point0)
     (first point1))
    (:steps level))))

(defn step-lengths-for-segment-lines
  "Returns a vector [len0 len1] with the 'step length' for the two edge
   lines that mark the boundaries of the given segment."
  [level seg-idx]
  (let [coords (concat (polar-lines-for-segment level seg-idx false)
                       (polar-lines-for-segment level seg-idx true))
        line0 (take-nth 2 coords)
        line1 (take-nth 2 (rest coords))]
    [(apply #(step-length-line level %1 %2) line0)
     (apply #(step-length-line level %1 %2) line1)]))

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



;;
;; Old, replaced collision detection code
;;
(defn remove-collided-enemies!
  [bullet]
  (def *enemy-list*
    (atom (get (collisions-with-projectile @*enemy-list* bullet) false))))
(defn collisions-with-projectile-list
  "Calls collisions-with-projectile for every projectile in bullet-list.
   Returns a dictionary with true key for all enemies involved in a collision,
   and a false key for all unaffected enemies."
  [enemy-list bullet-list]
  (doall (map remove-collided-enemies! bullet-list)))





(defn draw-line
  "Draws a line on the given 2D context of an HTML5 canves element, between
   the two given cartesian coordinates."
  [context point0 point1]
  (.moveTo context (first point0) (peek point0))
  (.lineTo context (first point1) (peek point1))
  (.stroke context))
  

(defn draw-player
  "Draws a player, defined by the given path 'player', on the 2D context of
   an HTML5 canvas, with :height and :width specified in dims, and on the
   given level."
  [context dims level player]
  (doseq []
    (.beginPath context)
    (draw-path context
               (vec (map js/Math.round
                         (polar-to-cartesian-centered
                          (polar-entity-coord player)
                          dims)))
               (round-path (player-path-on-level player))
               true)
    (.closePath context)))

(defn draw-entities
  "Draws all the entities, defined by paths in 'entity-list', on the 2D context
   of an HTML5 canvas, with :height and :width specified in dims, and on the
   given level."
  [context dims level entity-list]
  (doseq [entity entity-list]
    (.beginPath context)
    (draw-path context
               (polar-to-cartesian-centered (polar-entity-coord entity) dims)
               (round-path ((:path-fn entity) entity))
               true)
    (.closePath context)))

(defn draw-enemies
  "Draws all the enemies, defined by paths in 'enemy-list', on the 2D context
   of an HTML5 canvas, with :height and :width specified in dims, and on the
   given level. TODO: This only draws flippers."
  [context dims level]
  (doseq [enemy @*enemy-list*]
    (.beginPath context)                           
    (draw-path context
               (polar-to-cartesian-centered (polar-entity-coord enemy) dims)
               (flipper-path-on-level enemy)
               true)
    (.closePath context)))

(defn draw-board
  "Draws a level on a 2D context of an HTML5 canvas with :height and :width
   specified in dims."
  [context dims level]
  (doseq []
   (.beginPath context)
   (doseq [idx (range (count (:segments level)))]
      (draw-rectangle
       context
       (round-path (rectangle-to-canvas-coords
        dims (rectangle-for-segment level idx)))))
    (.closePath context)))

(defn projectile-off-level?
  "Returns true if a projectile has reached either boundary of the level."
  [projectile]
  (cond
   (zero? (:step projectile)) true
   (>= (:step projectile) (:steps (:level projectile))) true
   :else false))


(defn draw-world
  "Call all of the drawing functions to redraw the scene, and update all
   of the entities on the level."
  [context dims level]
  (doseq []
    (.clearRect context 0 0 (:width dims) (:height dims))
    (comment (.clearRect context
                (/ (:width dims) 4) (/ (:height dims) 4)
                (/ (:width dims) 2) (/ (:height dims) 2)))
    ;;(draw-board context dims level)
    (draw-player context dims level (deref *player*))
    (draw-entities context dims level @*enemy-list*)
    (draw-entities context dims level @*projectile-list*)
    
    (when (not @*paused*)
      (let [new-entities (entities-after-collisions @*enemy-list*
                                                    @*projectile-list*)]
        (def *projectile-list* (atom (:projectiles new-entities)))
        (def *enemy-list* (atom (:entities new-entities))))
        
      (def *projectile-list* (atom (update-entity-list @*projectile-list*)))
      (def *projectile-list* (atom (remove projectile-off-level?
                                           @*projectile-list*)))
      (def *enemy-list* (atom (update-entity-list @*enemy-list*)))
      (*animMethod* #(draw-world context dims level)))
    
    (def *frame-count* (atom (inc @*frame-count*)))
    (when (= 20 @*frame-count*)
      (let [fps (/ (* 1000 @*frame-count*)
                   (- (goog.now) @*frame-time*))]
        (dom/setTextContent (dom/getElement "fps")
                            (str "FPS: " (pr-str (js/Math.round fps)))))
      
      (def *frame-count* (atom 0))
      (def *frame-time* (atom (goog.now))))))

(defn add-projectile
  "Add a new projectile to the global list of live projectiles."
  [level seg-idx stride step]
  (def *projectile-list*
    (atom
     (conj @*projectile-list*
           (build-projectile level seg-idx stride :step step)))))

(defn keypress
  "Respond to keyboard key presses."
  [event]
  (let [player @*player*
        level (:level player)
        seg-count (count (:segments level))
        segment (:segment player)
        key (.-keyCode event)]
    (condp = key
          key-codes/RIGHT (def *player*
                           (atom
                            (assoc @*player* :segment
                                   (mod (+ segment 1) seg-count))))
          key-codes/LEFT (def *player*
                           (atom
                            (assoc @*player* :segment
                                   (mod (+ (- segment 1) seg-count)
                                        seg-count))))
          key-codes/SPACE (add-projectile level segment -5 (:steps level))
          key-codes/ESC (def *paused* (atom (not @*paused*)))
          nil
          )))

(defn animationFrameMethod []
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

(def *paused* (atom false))

(def *animMethod* (animationFrameMethod))

(defn ^:export canvasDraw
  "Begins a camge of tempest.  'level' specified as a string representation
   of an integer."
  [level]
  (let [document (dom/getDocument)
        timer (goog.Timer. 20)
        level (get levels/*levels* (- (js/parseInt level) 1))
        canvas (dom/getElement "canv-fg")
        context (.getContext canvas "2d")
        bgcanvas (dom/getElement "canv-bg")
        bgcontext (.getContext bgcanvas "2d")
        handler (goog.events.KeyHandler. document)
        dims {:width (.-width canvas) :height (.-height canvas)}]

    (.log js/console (str "Animation function: " (pr-str *animMethod*)))
    
    (draw-board bgcontext dims level)
    
    (def *frame-count* (atom 0))
    (def *frame-time* (atom (goog.now)))

    (def *enemy-list*
      (atom
       (list
        (build-enemy level 0 :step 0)
        (build-enemy level 1 :step 0)
        (build-enemy level 1 :step 10)
        (build-enemy level 1 :step 20)
        (build-enemy level 1 :step 30)
        (build-enemy level 1 :step 40)
        (build-enemy level 1 :step 50)
        (build-enemy level 1 :step 60)
        (build-enemy level 1 :step 70)
        (build-enemy level 3 :step 0)
        (build-enemy level 3 :step 10)
        (build-enemy level 3 :step 20)
        (build-enemy level 3 :step 30)
        (build-enemy level 3 :step 40)
        (build-enemy level 3 :step 50)
        (build-enemy level 3 :step 60)
        (build-enemy level 3 :step 70)
        (build-enemy level 7 :step 0)
        (build-enemy level 7 :step 10)
        (build-enemy level 7 :step 20)
        (build-enemy level 7 :step 30)
        (build-enemy level 7 :step 40)
        (build-enemy level 7 :step 50)
        (build-enemy level 8 :step 0)
        (build-enemy level 8 :step 10)
        (build-enemy level 8 :step 20)
        (build-enemy level 8 :step 30)
        (build-enemy level 8 :step 40)
        (build-enemy level 8 :step 50)
        (build-enemy level 8 :step 60)
        (build-enemy level 11 :step 10))))
    (def *player*
      (atom (doall (build-player level 7))))
    (def *projectile-list*
      (atom (list)))
    
    (*animMethod* #(draw-world context dims level))

    (events/listen handler "key" (fn [e] (keypress e)))))

    
