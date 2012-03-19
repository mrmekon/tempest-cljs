(ns tempest
  (:require [tempest.levels :as levels]
            [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.events.EventType :as event-type]
            [goog.math :as math]))


;;
;; Draw player:
;;
;;               
;;  /|         |\ 
;;  | |        | | <-- claw
;;   \ \      / /
;;    \ \ __ / / <---- arm
;;      \    /
;;        \/   <------ origin
;;
;;
;; drawn as vectors
;; start at origin (x,y)
;; right arm: (10, 45 deg)
;; right claw: (5, 95 deg)
;; right claw inner: (6, 270 deg)
;; right arm inner: (8, 220 deg)
;; left arm inner: (8, 140 deg)
;; left claw inner: (6, 90 deg)
;; left claw: (5, 265 deg)
;; left arm: (10, 315 deg)

(def player-vectors
  [[10 45]
   [5 95]
   [6 270]
   [8 220]
   [8 140]
   [6 90]
   [5 265]
   [10 315]])

(def player-vectors
  [[20 225]
   [10 275]
   [12 90]
   [16 40]
   [16 320]
   [12 270]
   [10 85]
   [20 135]])

(defn rotate-path [angle path]
  (map (fn [coords]
         [(first coords)
          (mod (+ angle (last coords)) 360)])
       path))

(defn rebase-origin [point origin]
  (map + point origin))

(defn draw-path [context origin vecs]
  (do
    (.moveTo context (first origin) (last origin))    
    ((fn [origin vecs]
       (if (nil? vecs)
         nil
         (let [line (first vecs)
               point (rebase-origin (polar-to-cartesian-coords line) origin)]
           (.log js/console (str "Draw vector: " (pr-str (first vecs))))
           ;;(println (str "Draw vector: " (pr-str (first vecs))))
           ;;(println (str "From point: " (pr-str origin)))
           (.lineTo context (first point) (last point))
           (recur point (next vecs)))))
     origin vecs)
    (.stroke context)))



(defn polar-to-cartesian-coords
  ([[r angle]] [(math/angleDx angle r) (math/angleDy angle r)])
  ([[r angle] length-fn]
     (let [newr (length-fn r)]
       [(math/angleDx angle newr) (math/angleDy angle newr)])
     )
  )

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
    (.log js/console (str (pr-str p) "->" (pr-str [(+ (first p) xmid) (- ymid (last p))])))
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
  (.log js/console (str "Points" (pr-str points)))
  (.log js/console (str "Move to: " (pr-str p0)))
  (.moveTo context (first p0) (last p0))
  (doseq [p points]
    (.log js/console (str "Draw to: " (pr-str p)))
    (.lineTo context (first p) (last p)))
  (.lineTo context (first p0) (last p0))
  (.stroke context)
  )


(defn ^:export canvasDraw [level]
  (let [canvas (dom/getElement "canv1")
        context (.getContext canvas "2d")
        timer (goog.Timer. 500)
        dims {:width (.-width canvas) :height (.-height canvas)}
        level (get levels/*levels* (- (js/parseInt level) 1))]
    (draw-path context [200 200] player-vectors)
    (draw-path context [250 250] (rotate-path 45 player-vectors))
    (draw-path context [300 300] (rotate-path 90 player-vectors))
    (draw-path context [350 350] (rotate-path 135 player-vectors))
    (draw-path context [400 400] (rotate-path 180 player-vectors))
    (doseq [idx (range (count (:segments level)))]
      (draw-rectangle context(rectangle-to-canvas-coords dims (rectangle-for-segment level idx))))
  ))

(comment (defn ^:export canvasDraw []
  (let [canvas (dom/getElement "canv1")
        context (.getContext canvas "2d")
        timer (goog.Timer. 500)
        dims {:width 500 :height 400}]
    (events/listen timer goog.Timer/TICK #(draw-random-line context dims))
    (. timer (start))
  )))
