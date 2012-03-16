(ns tempest
  (:require [tempest.levels :as levels]
            [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.events.EventType :as event-type]
            [goog.math :as math]))

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
