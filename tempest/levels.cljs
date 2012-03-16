(ns tempest.levels
  (:require [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.events.EventType :as event-type]
            [goog.math :as math]))

(def *default-line-length* 80)
(def *default-length-fn* #(* 4 %))

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

(defn rad-to-deg [rad]
  (/ (* rad 180) 3.14159265358979))

(defn deg-to-rad [deg]
  (/ (* deg 3.14159265358979) 180))

(defn theta0 [width depth]
  "Return theta0 in degrees."
  (rad-to-deg (js/Math.atan (/ width depth))))

(defn nth-theta [n width depth]
  (js/Math.round (rad-to-deg (js/Math.atan (/ (* (+ n 1) width) depth)))))

(defn r-for-nth-theta [nth-theta depth]
  (js/Math.round (/ depth (js/Math.cos (deg-to-rad nth-theta)))))

(defn nth-straight-line [n width depth angle-center angle-multiplier]
  "Returns [r theta] for straight line segment n."
  (let [th (nth-theta n width depth)]
    [(r-for-nth-theta th depth) (+ angle-center (* th angle-multiplier))]))

(defn flat-level [segment-count segment-width segment-depth]
  (concat (reverse (map #(nth-straight-line % segment-width segment-depth 270 -1) (range segment-count)))
          [[80 270]]
          (map #(nth-straight-line % segment-width segment-depth 270 1) (range segment-count))))


;; short radius, angle in degrees
;; straight lines: r = *default-line-length*/abs(cos(270-angle))

(def *level1_lines* (vec (flat-level 4 15 80)))

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

(def *level3_lines* (vec (flat-level 7 15 80)))

(comment (def *level3_lines*
  [[111 (- 270 44)]
   [95 (- 270 33)]
   [84 (- 270 18)]
   [80 270]
   [84 (+ 270 18)]
   [95 (+ 270 33)]
   [111 (+ 270 44)]
   ]))

(def *levels*
  [
   {:lines *level1_lines*
    :segments (build-segment-list (- (count *level1_lines*) 1) false)
    :length-fn *default-length-fn*}
   
   {:lines *level2_lines*
    :segments (build-segment-list (- (count *level2_lines*) 1) true)
    :length-fn *default-length-fn*}

   {:lines *level3_lines*
    :segments (build-segment-list (- (count *level3_lines*) 1) false)
    :length-fn *default-length-fn*}
])
