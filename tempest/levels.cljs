(ns tempest.levels
  (:require [tempest.util :as util]))

;;;;
;;;; Levels are defined by a vector of polar coordinates [r theta],
;;;; which are used to build a vector of 'segments' that form a level.
;;;;
;;;; Levels can be manually specified by building a vector of lines
;;;; manually.
;;;;
;;;; Some types of levels can be built automatically by calling helper
;;;; functions in this module with various parameters.
;;;;
;;;; Levels are drawn radially, from the center point of the canvas.
;;;;
;;;; Levels are stored in the *levels* vector as a list of maps.
;;;;
;;;; Terminology in this module:
;;;;
;;;; "length" and "depth" both refer to how far from origin the inner
;;;; line is drawn, in pixels.
;;;;
;;;; "length-fn" is a function to determine how long between inner and
;;;; outer line.  Takes one argument 'r' to the inner line.  Returns
;;;; 'r' to the outer line.  Default is 'inner r' multiplied by 4.
;;;;
;;;; "width" is how wide, in pixels, the outer line segment is.
;;;;
;;;;
;;;; Enemies travel up segments in steps.  A level has the same number
;;;; of steps per segment, but the size of the steps can vary depending
;;;; on the dimensions of the segment.  Instead of keeping track of its
;;;; coordinates, an enemy keeps track of which segment it is on, and
;;;; how many steps up the segment.


(def ^{:doc "Default length, in pixels, from origin to inner line."}
  *default-line-length* 80)

(def ^{:doc "Default length function, returns argument*4"}
  *default-length-fn* #(* 4 %))

(def *default-steps-per-segment* 100)

(defn build-unlinked-segment-list [max-x]
  (vec ((fn [x segments]
    (if (= x 0)
      segments
      (recur (dec x) (cons [(dec x) x] segments)))
    ) max-x [])))

(defn build-segment-list [max-x linked?]
  (let [segments (build-unlinked-segment-list max-x)]
    (if (true? linked?)
      (conj segments [(last (last segments)) (first (first segments))])
      segments)
    )
  )




;; "Flat" level functions follow:
;;
;; Functions for generating "flat" levels: levels where the edge appears as
;; a straight line.  Something like this garbage:
;;
;;       ___________________________
;;      /  /  / |  |  |  |  |   \   \
;;     /  |  |  |  |  |  |   |   \   \
;;    /  /  |  |   |  |   |   |   |   \
;;   /  /  /   |  |   |   |   |    |   \
;;  /  /  /   |   |   |   |    |    |   \
;; ----------------------------------------
;;
;; Flat levels always start with a line dropped straight down, and build
;; out symmetrically from there.  The width of segments at the "outer" edge
;; (closer to the player) is uniform.
;;

(defn theta-flat [n width depth]
  "Return theta for segment n.  Width is width of segment at the outer edge,
   closest to the player, and depth is the distance to origin."
  (js/Math.round (util/rad-to-deg (js/Math.atan (/ (* (+ n 1) width) depth)))))

(defn r-flat [theta depth]
  "Return r for given theta (see theta-flat)."
  (js/Math.round (/ depth (js/Math.cos (util/deg-to-rad theta)))))

(defn r-theta-pair-flat [n width depth angle-center angle-multiplier]
  "Returns [r theta] for nth straight line segment.  angle-center is the
   angle that theta should be in reference to (probably 270 degrees, a line
   straight down), and angle-multiplier should be -1 to built left or 1 to
   build right."
  (let [th (theta-flat n width depth)]
    [(r-flat th depth) (+ angle-center (* th angle-multiplier))]))

(defn flat-level [segment-count segment-width segment-depth]
  "Return a list of line segments representing a flat level with segment-count
   segments ON EACH SIDE OF CENTER (2*segment-count total), width at the player
   edge of segment-width, and distance from origin to inner-edge as
   segment-depth"
  (concat (reverse (map #(r-theta-pair-flat % segment-width segment-depth 270 -1) (range segment-count)))
          [[80 270]]
          (map #(r-theta-pair-flat % segment-width segment-depth 270 1) (range segment-count))))




;; "Oblong" level functions follow:
;;
;; Functions for generating oblong triangles using Law of Cosines.
;; Use to generate arbitrary levels from a list of angles, gamma(0)..gamma(N),
;; where gamma is the angle between the previous line segment 'towards the player'
;; and the line segment that makes the 'width' of the segment.
;;             ____
;;            /    / \
;;           /    /   \ 
;;          /    /     /
;;         /    /     /
;; gamma1-/->  /     /
;;       /____/     /
;;             \  </--- gamma0
;;              \ /
;;
;; Named 'oblong' after the triangles formed when the lines are extended to origin.
;; As opposed to the flat-levels, which are constructed of right triangles.
;;
;; This is a terrible non-obvious way to construct a level, but does let you
;; construct complex, symmetric structures (both open and closed) with just
;; a list of angles.
;;

(defn r-oblong [gamma width r0]
  "Calculate the next radius of an oblong triangle.  Depends on the gamma
   specified for this segment, the width of the segment, and the previous
   radius r0.  For the first segment, r0 should be straight down
   (270 degrees)."
  (js/Math.sqrt (+ (js/Math.pow width 2)
                   (js/Math.pow r0 2)
                   (* -2 width r0 (js/Math.cos (util/deg-to-rad gamma)))
                   )))

(defn theta-oblong [width r1 r0 theta0 sumfn]
  "Calculate the next theta, the angle (in degrees) in relation to origin,
   for an oblong triangle.  This depends on the width of the segment, the
   previous radius r0, the current radius r1 (see r-oblong), the previous
   theta theta0.  Provide a function, either + or -, to determine the
   direction.  - builds segments clockwise, + builds counterclockwise."
  (sumfn theta0
     (util/rad-to-deg (js/Math.acos
                  (/  (+ (js/Math.pow r1 2)
                         (js/Math.pow r0 2)
                         (* -1 (js/Math.pow width 2)))
                      (* 2 r1 r0))))))
  
(defn r-theta-pair-oblong [gamma width r0 theta0 sumfn]
  "Return a vector [r theta] representing a line segment.  See
   theta-oblong and r-oblong for parameters."
  (let [r1 (r-oblong gamma width r0)]
    (vec (map js/Math.round [r1 (theta-oblong width r1 r0 theta0 sumfn)]))
    ))

(defn oblong-half-level [gammas width height sumfn]
  "Builds vector of line segments in relation to a line dropped straight down,
   with the angles given in gammas.  Only builds in one direction."
  ((fn [gammas r0 theta0 segments]
     (if (= (count gammas) 0)
       segments
       (let [pair (r-theta-pair-oblong (first gammas) width r0 theta0 sumfn)]
         (recur (rest gammas) (first pair) (last pair) (cons pair segments)))))
   gammas height 270 []))

(defn oblong-level [gammas width height]
  "Builds a full level from the angles given in gammas.  Level is symmetric,
   and can be open or closed.  Always starts with a straight down line."
  (concat
   (oblong-half-level gammas width height -)
   [[height 270]]
   (reverse (oblong-half-level gammas width height +))))






;;
;;
;; BELOW HERE ARE LEVELS
;;
;;
;;
;;
;;

;; Flat level with 8 segments
(def *level1_lines* (vec (flat-level 4 15 80)))

;; Custom level, a circle
(def *level2_lines*
  [[*default-line-length* 0]
   [*default-line-length* 18]
   [*default-line-length* 36]
   [*default-line-length* 54]
   [*default-line-length* 72]
   [*default-line-length* 90]
   [*default-line-length* 108]
   [*default-line-length* 126]
   [*default-line-length* 144]
   [*default-line-length* 162]
   [*default-line-length* 180]
   [*default-line-length* 198]
   [*default-line-length* 216]
   [*default-line-length* 234]
   [*default-line-length* 252]
   [*default-line-length* 270]
   [*default-line-length* 288]
   [*default-line-length* 306]   
   [*default-line-length* 324]
   [*default-line-length* 342]
   ])

;; Flat level with 14 segments
(def *level3_lines* (vec (flat-level 7 15 80)))

;; Oblong level, an open "W"
(def *level4_lines* (vec (oblong-level [135 105 90 33] 15 80)))

;; Oblong level, open "eagle wings"
(def *level5_lines* (vec (oblong-level [135 100 90 90 90 85 80 75] 15 80)))

;; Oblong level, a closed, spikey flower
(def *level6_lines* (vec (oblong-level [135 45 90 135 45 90 135 45 90 135 45 90
                                        135 45 90 135 45 90 135 45 90 135 45 135] 15 80)))



(defn make-level-entry [lines loops?]
  "Make a map that defines a level.  A level contains a vector of lines, a
   vector of segments constructed of pairs of lines, and a length function.
   This function takes a vector of lines, and a boolean specifying whether
   the level is a closed loop, or open."
  {:lines lines
   :segments (build-segment-list (- (count lines) 1) loops?)
   :length-fn *default-length-fn*
   :steps *default-steps-per-segment*})

(def *levels*
  [ (make-level-entry *level1_lines* false)
    (make-level-entry *level2_lines* true)
    (make-level-entry *level3_lines* false)
    (make-level-entry *level4_lines* false)
    (make-level-entry *level5_lines* false)
    (make-level-entry *level6_lines* true)])

