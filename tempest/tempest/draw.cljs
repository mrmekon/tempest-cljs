;;
;; This file is part of tempest-cljs
;; Copyright (c) 2012, Trevor Bentley
;; All rights reserved.
;; See LICENSE file for details.
;;

(ns ^{:doc "
Functions related to drawing on an HTML5 canvas.

The functions in this module are responsible for drawing paths on an
HTML5 canvas.  This includes both primitive draw functions, and higher
level functions to draw complete game entities using the primitives.
"}
  tempest.draw
  (:require [tempest.levels :as levels]
            [tempest.util :as util]
            [tempest.path :as path]
            [goog.dom :as dom]))

(defn draw-rectangle
  "Draws a rectangle (4 cartesian coordinates in a vector) on the 2D context
   of an HTML5 canvas."
  [context [[x0 y0] [x1 y1] [x2 y2] [x3 y3]]]
  (.moveTo context x0 y0)
  (.lineTo context x1 y1)
  (.lineTo context x2 y2)
  (.lineTo context x3 y3)
  (.lineTo context x0 y0)
  (.stroke context)
  )

(defn draw-line
  "Draws a line on the given 2D context of an HTML5 canves element, between
   the two given cartesian coordinates."
  [context point0 point1]
  (.moveTo context (first point0) (peek point0))
  (.lineTo context (first point1) (peek point1))
  (.stroke context))

(defn max-flipper-angle
  []
  ;; get (x0,y0) and (x1,y1) of corners of current segment
  ;; gamma = atan2(y1-y0,x1-x0)
  ;; theta = PI-gamma
  )

(defn draw-path-rotated
  [context origin vecs skipfirst? point angle]
  ;; determine x/y translate and origin offsets by difference between
  ;; cartesian midpoint of segment and cartesian corner of segment.
  ;;
  ;; angle starts at 0, and ends at some angle difference between 
  (do
    (.save context)
    (.translate context
                (- (first origin) (first point))
                (- (peek origin) (peek point)))
    (.rotate context angle)
    ((fn [origin vecs skip?]
       (if (empty? vecs)
         nil
         (let [line (first vecs)
               point (path/rebase-origin (path/polar-to-cartesian-coords line)
                                         origin)]
           (.lineTo context (first point) (peek point))
           (recur point (next vecs) false))))
     [(first point) (peek point)] vecs skipfirst?)
     ;;[0 0] vecs skipfirst?)
    (.stroke context)
    (.restore context)
    ))

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
               point (path/rebase-origin (path/polar-to-cartesian-coords line)
                                         origin)]
           (if-not skip?
             (.lineTo context (first point) (peek point))
             (.moveTo context (first point) (peek point)))
           (recur point (next vecs) false))))
     origin vecs skipfirst?)
    (.stroke context)))


(defn draw-player
  "Draws a player, defined by the given path 'player', on the 2D context of
   an HTML5 canvas, with :height and :width specified in dims, and on the
   given level."
  [context dims level player zoom]
  (doseq []
    (.save context)
    (.beginPath context)
    (if (zero? zoom)
      (.scale context 0.00001 0.0001)
      (.scale context zoom zoom))
    (set! (. context -strokeStyle) (str "rgb(255,255,0)"))
    (draw-path context
               (path/polar-to-cartesian-centered
                (path/polar-entity-coord player)
                dims)
               (path/round-path (path/player-path-on-level player))
               true)
    (.closePath context)
    (.restore context)))

(defn draw-entities
  "Draws all the entities, defined by paths in 'entity-list', on the 2D context
   of an HTML5 canvas, with :height and :width specified in dims, and on the
   given level."
  [context dims level entity-list color zoom]
  (let [{r :r g :g b :b} color
        color-str (str "rgb(" r "," g "," b ")")]
    (.save context)
    (if (zero? zoom)
      (.scale context 0.00001 0.0001)
      (.scale context zoom zoom))
    (doseq [entity entity-list]
      (.beginPath context)
      (set! (. context -strokeStyle) color-str)
      (draw-path-rotated context
                         (path/polar-to-cartesian-centered
                          (path/polar-entity-coord entity)
                          dims)
                         (path/round-path ((:path-fn entity) entity))
                         true
                         (:flip-point entity)
                         (:flip-cur-angle entity))
      (.closePath context))
    (.restore context)))

(defn draw-spike
  [{:keys [dims context level]} seg-idx length]
  (.beginPath context)
  (set! (. context -strokeStyle) (str "rgb(10, 150, 10)"))
  (draw-line context
              (path/polar-to-cartesian-centered
               (path/segment-midpoint level seg-idx false) dims)
              (path/polar-to-cartesian-centered
               (path/polar-segment-midpoint level seg-idx length) dims))
  (.closePath context))

(defn draw-all-spikes
  [game-state]
  (let [context (:context game-state) zoom (:zoom game-state)
        spikes (:spikes game-state) spike-count (count spikes)]
    (.save context)
    (if (zero? zoom)
      (.scale context 0.00001 0.0001)
      (.scale context zoom zoom))
    (doseq [idx (range spike-count)]
      (let [length (nth spikes idx)] 
        (if (pos? length)
          (draw-spike game-state idx length))))
    (.restore context)
    ))

;;(for [idx (range spike-count)
;;                  spike (nth spikes idx)
;;                  :when (pos? spike)] 
;;  #(draw-spike game-state idx spike))

(defn draw-player-segment
  "Draws just the segment of the board that the player is on, with the given
   color."
  [{:keys [dims level zoom player] context :bgcontext {pseg :segment} :player}
   {:keys [r g b]}]
  (.beginPath context)
  (set! (. context -strokeStyle) (str "rgb(" r "," g "," b ")"))
  (draw-rectangle
   context
   (path/round-path (path/rectangle-to-canvas-coords
                     dims
                     (path/rectangle-for-segment level pseg))))
  (.closePath context))
  

(defn draw-board
  "Draws a level on a 2D context of an HTML5 canvas with :height and :width
   specified in dims."
  [{:keys [dims level zoom player] context :bgcontext}]
  (doseq []
    (.save context)
    ;; To fix bug in Firefox.  scale to 0.0 breaks it.
    (if (zero? zoom)
      (.scale context 0.00001 0.0001)
      (.scale context zoom zoom))
    (set! (. context -lineWidth) 1)
    (set! (. context -strokeStyle) (str "rgb(10,10,100)"))
    (.beginPath context)
    (doseq [idx (range (count (:segments level)))]
      (draw-rectangle
       context
       (path/round-path (path/rectangle-to-canvas-coords
                         dims
                         (path/rectangle-for-segment level idx)))))
    (.restore context)
    (.closePath context)
    ))


(defn clear-context
  "Clears an HTML5 context"
  [context dims]
  (let [{width :width height :height} dims]
    (.clearRect context 0 0 width height)))
