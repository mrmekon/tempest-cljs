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
  [context [p0 & points]]
  (.moveTo context (first p0) (peek p0))
  (doseq [p points]
    (.lineTo context (first p) (peek p)))
  (.lineTo context (first p0) (peek p0))
  (.stroke context)
  )

(defn draw-line
  "Draws a line on the given 2D context of an HTML5 canves element, between
   the two given cartesian coordinates."
  [context point0 point1]
  (.moveTo context (first point0) (peek point0))
  (.lineTo context (first point1) (peek point1))
  (.stroke context))
  

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
  [context dims level player]
  (doseq []
    (.beginPath context)
    (draw-path context
               (vec (map js/Math.round
                         (path/polar-to-cartesian-centered
                          (path/polar-entity-coord player)
                          dims)))
               (path/round-path (path/player-path-on-level player))
               true)
    (.closePath context)))

(defn draw-entities
  "Draws all the entities, defined by paths in 'entity-list', on the 2D context
   of an HTML5 canvas, with :height and :width specified in dims, and on the
   given level."
  [context dims level entity-list]
  (doseq [entity entity-list]
    (.beginPath context)
    (draw-path context
               (path/polar-to-cartesian-centered
                (path/polar-entity-coord entity)
                dims)
               (path/round-path ((:path-fn entity) entity))
               true)
    (.closePath context)))

(defn draw-board
  "Draws a level on a 2D context of an HTML5 canvas with :height and :width
   specified in dims."
  [context dims level]
  (doseq []
   (.beginPath context)
   (doseq [idx (range (count (:segments level)))]
      (draw-rectangle
       context
       (path/round-path (path/rectangle-to-canvas-coords
        dims (path/rectangle-for-segment level idx)))))
    (.closePath context)))
