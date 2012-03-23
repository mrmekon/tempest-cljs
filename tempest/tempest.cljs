(ns tempest
  (:require [tempest.levels :as levels]
            [tempest.util :as util]
            [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.math :as math]
            [goog.events.KeyHandler :as key-handler]
            [goog.events.KeyCodes :as key-codes]
            [clojure.browser.repl :as repl]))

;;
;;
;; Rough design notes:
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


;;(repl/connect "http://localhost:9000/repl")

;;
;; TODO:
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


(def flipper-path
  [[32 16]
   [16 214]
   [16 326]
   [64 164]
   [16 326]
   [16 214]
   [32 16]])

(def bullet-path
  [[11.3 90]
   [16 45]
   [16 135]
   [16 225]
   [16 315]
   ])

(defn round-path
  "Rounds all numbers in a path (vector of 2-tuples) to nearest integer."
  [path]
  (map (fn [coords]
         [(js/Math.round (first coords))
          (js/Math.round (last coords))])
       path))

(defn flipper-path-with-width
  "Returns a path to draw a 'flipper' enemy with given width."
  [width]
  (let [r (/ width (js/Math.cos (util/deg-to-rad 16)))]
    (round-path
     [[0 0]
      [(/ r 2) 16]
      [(/ r 4) 214]
      [(/ r 4) 326]
      [r 164]
      [(/ r 4) 326]
      [(/ r 4) 214]
      [(/ r 2) 16]])))

(defn projectile-path-with-width
  "Returns a path to draw a projectile with the given width."
  [width]
  (let [r (/ width (* 2 (js/Math.cos (util/deg-to-rad 45))))
        midheight (* r (js/Math.sin (util/deg-to-rad 45)))]
    (round-path
     [[midheight 270]
      [r 45]
      [r 135]
      [r 225]
      [r 315]])))

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
   :level level})

(defn build-player
  "Returns a dictionary describing a player on the given level and segment."
  [level seg-idx]
  {:segment seg-idx
   :level level
   :step (:steps level)})

(defn update-entity-position!
  "Return entity updated with a new position based on its current location and
   stride.  Won't go lower than 0, or higher than the maximum steps of the
   level."
  [object]
  (let [stride (:stride object)
        maxstep (:steps (:level object))
        newstep (+ stride (:step object))]
    (cond
     (> newstep maxstep) (assoc object :step maxstep)
     (< newstep 0) (assoc object :step 0)
     :else (assoc object :step newstep))))

(comment (defn update-enemy-position [enemy]
  (if (< (:step enemy) (:steps (:level enemy)))
    (assoc enemy :step (+ (:stride enemy) (:step enemy)))
    enemy)))

(defn update-entity-list
  "Recursively call update-entity-position! on all entities in list."
  [entity-list]
  ((fn [oldlist newlist]
     (let [entity (first oldlist)]
       (if (nil? entity)
         (vec newlist)
         (recur (rest oldlist)
                (cons (update-entity-position! entity) newlist))))
         ) entity-list []))

(defn scale-polar-coord
  "Return a polar coordinate with the first element (radius) scaled using
   the function scalefn"
  [scalefn coord]
  [(scalefn (first coord)) (last coord)])

(defn rotate-path
  "Add angle to all polar coordinates in path."
  [angle path]
  (map (fn [coords]
         [(first coords)
          (mod (+ angle (last coords)) 360)])
       path))

(defn scale-path
  "Multiply all lengths of polar coordinates in path by scale."
  [scale path]
  (map (fn [coords]
         [(* scale (first coords))
          (last coords)])
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
    (.moveTo context (first origin) (last origin))    
    ((fn [origin vecs skip?]
       (if (nil? vecs)
         nil
         (let [line (first vecs)
               point (rebase-origin (polar-to-cartesian-coords line) origin)]
           (if-not skip?
             (.lineTo context (first point) (last point))
             (.moveTo context (first point) (last point)))
           (recur point (next vecs) false))))
     origin vecs skipfirst?)
    (.stroke context)))



(defn polar-to-cartesian-coords
  ([[r angle]] [(math/angleDx angle r) (math/angleDy angle r)])
  ([[r angle] length-fn]
     (let [newr (length-fn r)]
       [(math/angleDx angle newr) (math/angleDy angle newr)])
     )
  )

(defn polar-distance [[r0 theta0] [r1 theta1]]
  (js/Math.sqrt
   (+
    (js/Math.pow r0 2)
    (js/Math.pow r1 2)
    (* -2 r0 r1 (js/Math.cos (util/deg-to-rad (- theta1 theta0)))))))

(defn polar-midpoint-r [[r0 theta0] [r1 theta1]]
  (js/Math.round
   (/
    (js/Math.sqrt 
     (+
      (js/Math.pow r0 2)
      (js/Math.pow r1 2)
      (* 2 r0 r1 (js/Math.cos (util/deg-to-rad (- theta1 theta0))))))
    2)))

(defn polar-midpoint-theta  [[r0 theta0] [r1 theta1]]
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

(defn polar-midpoint [line0 line1]
  [(polar-midpoint-r line0 line1)
   (polar-midpoint-theta line0 line1)]
  )

(defn segment-midpoint [level seg-idx scaled?]
  (apply polar-midpoint
         (polar-lines-for-segment level seg-idx scaled?)))

;; Returns vector [line0 line1], where lineN is the polar coordinates
;; describing an edge line of a segment.
(defn polar-lines-for-segment [level seg-idx scaled?]
  (let [[seg0 seg1] (get (:segments level) seg-idx)
        line0 (get (:lines level) seg0)
        line1 (get (:lines level) seg1)]
    (if (true? scaled?)
      [(scale-polar-coord (:length-fn level) line0)
       (scale-polar-coord (:length-fn level) line1)]
      [line0 line1]
    )))

;; Returns vector [[x0 y0] [x1 y1] [x2 y2] [x3 y3]] describing segment rectangle
;; in cartesian coordinates.
(defn rectangle-for-segment [level seg-idx]
  (let [[seg0 seg1] (get (:segments level) seg-idx)
        line0 (get (:lines level) seg0)
        line1 (get (:lines level) seg1)]
    [(polar-to-cartesian-coords line0)
     (polar-to-cartesian-coords line0 (:length-fn level))
     (polar-to-cartesian-coords line1 (:length-fn level))
     (polar-to-cartesian-coords line1)]
    ))

(defn point-to-canvas-coords [{width :width height :height} p]
  (let [xmid (/ width 2)
        ymid (/ height 2)]
    [(+ (first p) xmid) (- ymid (last p))]
  ))

(defn rectangle-to-canvas-coords [dims rect]
  (map #(point-to-canvas-coords dims %) rect)
  )

(defn rand-coord [{width :width height :height}]
  [(math/randomInt width)
   (math/randomInt height)])

(defn draw-random-line [context dims]
  (let [[x1 y1] (rand-coord dims)
        [x2 y2] (rand-coord dims)]
    (.moveTo context x1,y1)
    (.lineTo context x2,y2)
    (.stroke context)))  

(defn draw-rectangle [context [p0 & points]]
  (.moveTo context (first p0) (last p0))
  (doseq [p points]
    (.lineTo context (first p) (last p)))
  (.lineTo context (first p0) (last p0))
  (.stroke context)
  )

(defn step-length-segment-midpoint [level seg-idx]
  (/
   (-
    (first (segment-midpoint level seg-idx true))
    (first (segment-midpoint level seg-idx false)))
   (:steps level)))

(defn step-length-segment-edge [level line]
  (/
   (-
    ((:length-fn level) (first line))
    (first line))
   (:steps level)))

(defn step-length-line [level point0 point1]
  (js/Math.abs
   (/
    (-
     (first point0)
     (first point1))
    (:steps level))))

(defn step-lengths-for-segment-lines [level seg-idx]
  (let [coords (concat (polar-lines-for-segment level seg-idx false)
                       (polar-lines-for-segment level seg-idx true))
        line0 (take-nth 2 coords)
        line1 (take-nth 2 (rest coords))]
    [(apply #(step-length-line level %1 %2) line0)
     (apply #(step-length-line level %1 %2) line1)]))


(defn draw-line [context point0 point1]
    (.moveTo context (first point0) (peek point0))
    (.lineTo context (first point1) (peek point1))
    (.stroke context))
  

(defn draw-player [context dims level player]
  (doseq []
    (.beginPath context)
    (draw-path context
               (vec (map js/Math.round
                         (polar-to-cartesian-centered
                          (polar-entity-coord player)
                          dims)))
               (player-path-on-level player)
               true)
    (.closePath context)))

(defn draw-entities [context dims level entity-list]
  (doseq [entity entity-list]
    (.beginPath context)
    (draw-path context
               (polar-to-cartesian-centered (polar-entity-coord entity) dims)
               ((:path-fn entity) entity)
               true)
    (.closePath context)))

(defn draw-enemies [context dims level]
  (doseq [enemy *enemy-list*]
    (.beginPath context)
    (draw-path context
               (polar-to-cartesian-centered (polar-entity-coord enemy) dims)
               (flipper-path-on-level enemy)
               true)
    (.closePath context)))

(defn draw-board [context dims level]
  (doseq []
   (.beginPath context)
    (doseq [idx (range (count (:segments level)))]
      (draw-rectangle
       context
       (rectangle-to-canvas-coords
        dims (rectangle-for-segment level idx))))
    (.closePath context)))

(defn projectile-off-level? [projectile]
  (cond
   (zero? (:step projectile)) true
   (>= (:step projectile) (:steps (:level projectile))) true
   :else false))

(defn draw-world [context dims level]
  (doseq []
   (.clearRect context 0 0 (:width dims) (:height dims))
   (draw-board context dims level)
   (draw-player context dims level (deref *player*))
   (comment (draw-enemies context dims level))
   (draw-entities context dims level *enemy-list*)
   (draw-entities context dims level @*projectile-list*)
   (when (not @*paused*)
     (def *enemy-list* (update-entity-list *enemy-list*))
     (def *projectile-list* (atom (update-entity-list @*projectile-list*)))
     (def *projectile-list* (atom (vec (remove projectile-off-level? @*projectile-list*))))
     )))

(defn add-projectile [level seg-idx stride step]
  (def *projectile-list*
    (atom
     (vec (conj @*projectile-list*
                (build-projectile level seg-idx stride :step step))))))

(defn keypress [event]
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

(def *paused* (atom false))

(defn ^:export canvasDraw [level]
  (let [document (dom/getDocument)
        timer (goog.Timer. 50)
        level (get levels/*levels* (- (js/parseInt level) 1))
        canvas (dom/getElement "canv1")
        context (.getContext canvas "2d")
        handler (goog.events.KeyHandler. document)
        dims {:width (.-width canvas) :height (.-height canvas)}]
    
    (def *enemy-list*
      [(build-enemy level 0 :step 0)
       (build-enemy level 3 :step 20)
       ;;(build-enemy level 7 :step 80)
       ;;(build-enemy level 8 :step 80)
       (build-enemy level 11 :step 100)])
    (def *player*
      (atom (doall (build-player level 7))))
    (def *projectile-list*
      (atom [(build-projectile level 0 4)
             (build-projectile level 8 -4 :step 100)
             (build-projectile level 5 4 :step 100)]))

    (events/listen timer goog.Timer/TICK #(draw-world context dims level))
    (events/listen handler "key" (fn [e] (keypress e)))
    (. timer (start))))

(comment (defn ^:export canvasDraw []
  (let [canvas (dom/getElement "canv1")
        context (.getContext canvas "2d")
        timer (goog.Timer. 500)
        dims {:width 500 :height 400}]
    ;;(.log js/console (str "Enemy: " (pr-str (:segment enemy)))))
    (events/listen timer goog.Timer/TICK #(draw-random-line context dims))
    (. timer (start))
  )))
