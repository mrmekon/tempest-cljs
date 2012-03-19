(ns tempest
  (:require [tempest.levels :as levels]
            [tempest.util :as util]
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

(def player-path
  [[20 225]
   [10 275]
   [12 90]
   [16 40]
   [16 320]
   [12 270]
   [10 85]
   [20 135]])

(def flipper-path
  [[32 16]
   [16 214]
   [16 326]
   [64 164]
   [16 326]
   [16 214]
   [32 16]])

(defn round-path [path]
  (map (fn [coords]
         [(js/Math.round (first coords))
          (js/Math.round (last coords))])
       path))

(defn flipper-path-with-width [width]
  (let [r (/ width (js/Math.cos (util/deg-to-rad 16)))]
    (round-path
     [[(/ r 2) 16]
      [(/ r 4) 214]
      [(/ r 4) 326]
      [r 164]
      [(/ r 4) 326]
      [(/ r 4) 214]
      [(/ r 2) 16]])))
  

(defn scale-polar-coord [scalefn coord]
  [(scalefn (first coord)) (last coord)])

(defn rotate-path [angle path]
  "Add angle to all polar coordinates in path."
  (map (fn [coords]
         [(first coords)
          (mod (+ angle (last coords)) 360)])
       path))

(defn scale-path [scale path]
  "Multiply all lengths of polar coordinates in path by scale."
  (map (fn [coords]
         [(* scale (first coords))
          (last coords)])
       path))

(defn rebase-origin [point origin]
  "Return cartesian coordinate 'point' in relation to 'origin'."
  (map + point origin))

(defn draw-path [context origin vecs]
  (do
    (.moveTo context (first origin) (last origin))    
    ((fn [origin vecs]
       (if (nil? vecs)
         nil
         (let [line (first vecs)
               point (rebase-origin (polar-to-cartesian-coords line) origin)]
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

(defn steps-per-segment [level seg-idx]
  (/
   (-
    (first (segment-midpoint level seg-idx true))
    (first (segment-midpoint level seg-idx false)))
   (:steps level)))


(defn ^:export canvasDraw [level]
  (let [canvas (dom/getElement "canv1")
        context (.getContext canvas "2d")
        timer (goog.Timer. 500)
        dims {:width (.-width canvas) :height (.-height canvas)}
        level (get levels/*levels* (- (js/parseInt level) 1))]
    (draw-path context [600 200] (scale-path 0.5 flipper-path))
    (draw-path context [600 250] (scale-path 0.75 flipper-path))
    (draw-path context [600 300] (scale-path 1.0 flipper-path))
    (draw-path context [600 350] (scale-path 1.25 flipper-path))
    (draw-path context [600 400] (scale-path 1.5 flipper-path))
    
    (draw-path context [200 200] player-path)
    (draw-path context [250 250] (rotate-path 45 player-path))
    (draw-path context [300 300] (rotate-path 90 player-path))
    (draw-path context [350 350] (rotate-path 135 player-path))
    (draw-path context [400 400] (rotate-path 180 player-path))
    (doseq [idx (range (count (:segments level)))]
      (.log js/console (str "Index: " (pr-str idx)))
      (.log js/console (str "Midpoint: " (pr-str (segment-midpoint level idx false))))
      (.log js/console (str "Length: " (pr-str
      (-
       (first (segment-midpoint level idx true))
       (first (segment-midpoint level idx false))))))
      (draw-rectangle context (rectangle-to-canvas-coords dims (rectangle-for-segment level idx))))
  ))

(comment (defn ^:export canvasDraw []
  (let [canvas (dom/getElement "canv1")
        context (.getContext canvas "2d")
        timer (goog.Timer. 500)
        dims {:width 500 :height 400}]
    (events/listen timer goog.Timer/TICK #(draw-random-line context dims))
    (. timer (start))
  )))
