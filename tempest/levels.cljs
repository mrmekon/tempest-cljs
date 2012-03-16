(ns tempest.levels
  (:require [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.events.EventType :as event-type]
            [goog.math :as math]))

(def *default-line-length* 80)

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
(def *level1_segments*
  [[0 1]
   [1 2]
   [2 3]
   [3 4]
   [4 5]
   [5 6]
   [6 7]
   [7 8]
   [8 9]
   [9 10]
   ])
(def *level1* {:lines *level1_lines*
   :segments *level1_segments*
   :length-fn #(* % 4)})

;; short radius, angle in degrees
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
(def *level2_segments*
  [[0 1]
   [1 2]
   [2 3]
   [3 4]
   [4 5]
   [5 6]
   [6 7]
   [7 8]
   [8 9]
   [9 10]
   [10 11]
   [11 12]
   [12 13]
   [13 14]
   [14 15]
   [15 16]
   [16 17]
   [17 18]
   [18 19]
   [19 0]
   ])
(def *level2* {:lines *level2_lines*
   :segments *level2_segments*
   :length-fn #(* % 4)})

(def *levels*
  [
   {:lines *level1_lines* :segments *level1_segments* :length-fn #(* % 4)}
   {:lines *level2_lines* :segments *level2_segments* :length-fn #(* % 4)}
   ])
