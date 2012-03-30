(ns ^{:doc "
Functions related to path and coordinate creation and manipulation.

Functions in this module work with polar coordinates, cartesian coordinate,
and 'paths' consisting of a sequence of coordinates.
"}
  tempest.path
  (:require [tempest.levels :as levels]
            [tempest.util :as util]
            [goog.dom :as dom]
            [goog.math :as math]))

(defn add-sub
  "Given two polar coordinates, returns one polar coordinate with the first
   elements (radii) summed, and the second elements (angles) subtracted.
   i.e. [r1+r0, th1-th0].  This is used to move point0 to be relative to
   point1."
  [point0 point1]
  [(+ (first point1) (first point0))
   (- (peek point1) (peek point0))])

(defn cartesian-edge-coordinates
  "Returns a pair of cartesian coordinates [[x0 y0] [x1 y1]], representing
   the points on the edges of the given segment of the given level at the
   given step.

   That is, this returns the two points at the edge of a segment between which
   an entity would be drawn."
  [level seg-idx step]
  (let [edges (polar-lines-for-segment level seg-idx false)
        edge-steps (step-lengths-for-segment-lines level seg-idx)
        offset0 (* (first edge-steps) step)
        offset1 (* (peek edge-steps) step)
        point0 (polar-extend offset0 (first edges))
        point1 (polar-extend offset1 (peek edges))]
    [(polar-to-cartesian-coords point0)
     (polar-to-cartesian-coords point1)]))

(defn cartesian-point-between-segments
  [level seg-idx0 seg-idx1 step]
  (let [line (edge-line-between-segments level seg-idx0 seg-idx1)
        line-steps (step-length-for-level-line level line)        
        offset (* line-steps step)
        point0 (polar-extend offset line)]
    (polar-to-cartesian-coords point0)))


(defn edge-line-between-segments
  [level seg-idx0 seg-idx1]
  (let [segs0 (get (:segments level) seg-idx0)
        segs1 (get (:segments level) seg-idx1)
        allsegs (flatten [segs0 segs1])]
    (first (for [[id freq] (frequencies allsegs) :when (> freq 1)]
             (get (:lines level) id)))))

(defn flip-angle-between-segments
  "Returns the angle, in radians, between the two given segments on the
given level."
  [level seg-idx-cur seg-idx-new cw?]
  (let [angle-cur (segment-angle level seg-idx-cur)
        angle-new (segment-angle level seg-idx-new)]
      (- 0 (- (+ angle-new 3.14159265) angle-cur))
  ))

(defn flip-point-between-segments
  [level seg-idx-cur seg-idx-new step cw?]
  (let [[x0 y0] (cartesian-point-between-segments level
                                                  seg-idx-cur
                                                  seg-idx-new
                                                  step)
        [x1 y1] (polar-to-cartesian-coords
                 (polar-segment-midpoint level seg-idx-cur step))
        edge-points (cartesian-edge-coordinates level seg-idx-new step)]
    (.log js/console (pr-str "Edge points: " edge-points
                             "\nPivot point: " [x0 y0]))
    (.log js/console (pr-str "Result: " [(- x0 x1) (- y0 y1)]))
    [(- x1 x0) (- y0 y1)]))

(comment
(defn flip-point-between-segments
  [level seg-idx-cur seg-idx-new step cw?]
  (let [[x0 y0] (polar-to-cartesian-coords
                 (polar-segment-midpoint level seg-idx-cur step))
        [[x1 y1] [x2 y2]] (cartesian-edge-coordinates level seg-idx-new step)]
    (.log js/console (str "CW? " (pr-str cw?) " "
                          (pr-str [(- x0 x2) (- y2 y0)]
                                  [(- x1 x0) (- y0 y1)])))
    (if cw?
      [(- x0 x2) (- y2 y0)]
      [(- x1 x0) (- y0 y1)])))
)

(defn rebase-origin
  "Return cartesian coordinate 'point' in relation to 'origin'."
  [point origin]
  (add-sub point origin))

(defn polar-to-cartesian-centered
  "Converts a polar coordinate (r,theta) into a cartesian coordinate (x,y)
   centered on in a rectangle with given width and height."
  [point {width :width height :height}]
  (rebase-origin (polar-to-cartesian-coords point) [(/ width 2) (/ height 2)]))

(defn polar-to-cartesian-coords
  "Converts polar coordinates to cartesian coordinates.  If optional length-fn
   is specified, it is applied to the radius first."
  ([[r angle]] [(math/angleDx angle r) (math/angleDy angle r)])
  ([[r angle] length-fn]
     (let [newr (length-fn r)]
       [(math/angleDx angle newr) (math/angleDy angle newr)])
     )
  )

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

(defn polar-segment-midpoint
  "Returns current polar coordinates to the entity."
  [level seg-idx step]
  (let [steplen (step-length-segment-midpoint level seg-idx)
        offset (* steplen step)
        midpoint (segment-midpoint level seg-idx)]
    (polar-extend offset midpoint)))

(defn polar-entity-coord
  "Returns current polar coordinates to the entity."
  [entity]
  (polar-segment-midpoint (:level entity)
                          (:segment entity)
                          (:step entity)))


(comment
  (defn polar-entity-coord
  "Returns current polar coordinates to the entity."
  [entity]
  (let [steplen (step-length-segment-midpoint (:level entity)
                                              (:segment entity))
        offset (* steplen (:step entity))
        midpoint (segment-midpoint (:level entity) (:segment entity))]
    (polar-extend offset midpoint)))
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

(defn step-length-for-level-line
  [level line]
  (let [longline (scale-polar-coord (:length-fn level) line)]
    (step-length-line level line longline)))

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


(defn scale-polar-coord
  "Return a polar coordinate with the first element (radius) scaled using
   the function scalefn"
  [scalefn coord]
  [(scalefn (first coord)) (peek coord)])

(defn polar-extend
  "Add 'length' to radius of polar coordinate."
  [length coord]
  [(+ length (first coord))
   (peek coord)])

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

;; Path that defines player.
(def ^{:doc "Path, in polar coordinates, describing the player's ship."}
  *player-path*
  [[40 90]
   [44 196]
   [27 333]
   [17 135]
   [30 11]
   [30 349]
   [17 225]
   [27 27]
   [44 164]])

(defn bounding-box-from-radius
  [origin radius]
  (let [d (* radius 2)]
    {:x (- (first origin) radius)
     :y (- (peek origin) radius)
     :width d
     :height d}))

(defn player-path-on-level
  "Returns the path of polar coordinates to draw the player correctly at its
   current location.  It corrects for size and angle."
  [player]
  (let [coord (polar-entity-coord player)]
    (scale-path 0.6 (rotate-path
     (enemy-angle player)
     *player-path*))))

(defn flipper-path-bounding-circle-radius
  "Returns the radius of the bounding circle around the given flipper's path."
  [path]
  (max (map first path)))

(defn flipper-path-on-level
  "Returns the path of polar coordinates to draw a flipper correctly at its
   current location.  It corrects for size and angle."
  [flipper]
  (let [coord (polar-entity-coord flipper)]
    (rotate-path
     (enemy-angle flipper)
     (flipper-path-with-width (* 0.8 (entity-desired-width flipper))))))

(defn projectile-path-on-level
  "Returns the path of polar coordinates to draw a projectile correctly at its
   current location.  It corrects for size and angle."
  [projectile]
  (let [coord (polar-entity-coord projectile)]
    (rotate-path
     (enemy-angle projectile)
     (projectile-path-with-width (* 0.3 (entity-desired-width projectile))))))

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

(defn path-extend
  "Add 'length' to all polar coordinates in path"
  [length path]
  (map #(polar-extend length %) path))

(defn segment-angle
  "Returns the angle (in radians) of the given segment.
   The angle of a segment is the angle of any line projected onto it."
  [level seg-idx]
  (let [[point0 point1] (polar-lines-for-segment level seg-idx false)]
    (apply js/Math.atan2
           (vec (reverse (map - (polar-to-cartesian-coords point0)
                              (polar-to-cartesian-coords point1)))))))

(defn enemy-angle
  "Returns the angle (in degrees) from origin that the enemy needs to be
   rotated to appear in the correct orientation at its current spot on the
   level. In reality, it returns the angle of the line that traverses the
   segment across the midpoint of the enemy.  TODO: This should be renamed to
   'entity-angle', it works with anything on the board."
  [enemy]
  (util/rad-to-deg (segment-angle (:level enemy) (:segment enemy))))

(defn entity-desired-width
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

