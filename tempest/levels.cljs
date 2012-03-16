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

;; short radius, angle in degrees
;; straight lines: r = *default-line-length*/abs(cos(270-angle))
(def *level1_lines*
  [[113 225]
   [99 234]
   [90 243]
   [84 252]
   [81 261]
   [*default-line-length* 270]
   [81 279]
   [84 288]
   [90 297]
   [99 306]
   [113 315]])

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


(def *levels*
  [
   {:lines *level1_lines*
    :segments (build-segment-list (- (count *level1_lines*) 1) false)
    :length-fn *default-length-fn*}
   
   {:lines *level2_lines*
    :segments (build-segment-list (- (count *level2_lines*) 1) true)
    :length-fn *default-length-fn*}
   ])
