;;
;; This file is part of tempest-cljs
;; Copyright (c) 2012, Trevor Bentley
;; All rights reserved.
;; See LICENSE file for details.
;;

(ns ^{:doc "
Publicly exported functions to embed Tempest game in HTML.
"}
  tempest
  (:require [tempest.levels :as levels]
            [tempest.draw :as draw]
            [tempest.core :as c]
            [tempest.benchmarks :as bench]
            [goog.dom :as dom]
            [goog.events :as events]
            [goog.events.KeyHandler :as key-handler]))

;; ## Design notes:
;;
;;  * Nearly everything is defined with polar coordinates (length and angle)
;;  * "Entities" are players, enemies, projectiles
;;  * "Entities" are defined by a path, a series of polar coordinates, that
;;    are in relation to the previous point in the path.
;;  * Polar coordinates are converted to cartesian coordinates shortly before
;;    drawing.
;;  * Levels have a number of "steps" defined, which is how many occupiable
;;    points the level has (instead of allowing continuous motion).
;;  * An entity's location in the level is dictated by its current segment,
;;    and which step of the level it's on.
;;  * An entity has a "stride", which is how many steps it moves per update.
;;    The sign of the stride is direction, with positive strides moving out
;;    towards the player.
;;
;; ## Obscure design oddities:
;;
;;  * draw-path can optionally follow, but not draw, the first line of an
;;    entity's path.  There is a crazy reason for this.  The 'center' of
;;    an entity when drawn ends up being the first point drawn.  The first
;;    vertex is the one that gets centered on its location on the board. If
;;    the needs to be centered around a point that is not drawn (or just
;;    not its first point), the first, undrawn line given to draw-path
;;    can be a line from where the entity's center should be to its first
;;    drawn vertex.  An example is the player's ship, whose first vertex
;;    is it's "rear thruster", but who's origin when drawing must be up
;;    in the front center of the ship.
;;
;;
;; ## TODO:
;;
;;   * MOAR ENEMIES
;;   * Jump?  Is that possible with this design?  I think so, easily, by
;;     scaling just the first, undrawn line of player.  It ends up being
;;     normal to the segment's top line.
;;   * Power ups.  Bonus points if they're crazy swirly particle things.
;;   * Browser + keyboard input stuff
;;     - Any way to change repeat rate?  Probably not
;;     - Any way to use the mouse?
;;     - I'm not above making a custom rotary controller.
;;     - Two keys at the same time?  Gotta swirl-n-shoot.
;;   * Rate-limit bullets
;;   * Frame timing, and disassociate movement speed from framerate.
;;

(defn flipper-on-each-segment
  "List of enemies, one per segment."
  [level]
  (map #(assoc (c/build-flipper level % :step 0) :flip-probability 1)
       (range (count (:segments level)))))

(defn flipper-on-each-segment-noflip
  "List of enemies, one per segment."
  [level]
  (map #(assoc (c/build-flipper level % :step 0) :flip-probability 0)
       (range (count (:segments level)))))

(defn spiker-on-each-segment
  "List of enemies, one per segment."
  [level]
  (map #(assoc (c/build-spiker level % :step 0) :max-step (:steps level))
       (range (count (:segments level)))))

(defn projectile-on-each-segment
  "List of projectiles, one per segment."
  [level stride]
  (map #(c/build-projectile level % stride :step (:steps level))
       (range (count (:segments level)))))

(defn ^:export canvasDraw
  "Begins a game of tempest.  'level' specified as a string representation
   of an integer."
  [level-str]
  (let [document (dom/getDocument)
        level-idx (- (js/parseInt level-str) 1)
        canvas (dom/getElement "canv-fg")
        context (.getContext canvas "2d")
        bgcanvas (dom/getElement "canv-bg")
        bgcontext (.getContext bgcanvas "2d")
        handler (goog.events.KeyHandler. document true)
        dims {:width (.-width canvas) :height (.-height canvas)}]

    (events/listen handler "key" (fn [e] (c/queue-keypress e)))

    (let [empty-game-state (c/build-game-state)
          game-state (c/change-level
                      (assoc empty-game-state
                        :context context
                        :bgcontext bgcontext
                        :dims dims
                        :anim-fn (c/animationFrameMethod))
                      level-idx)]
      (c/next-game-state game-state))))



(defn ^:export benchmarkFlippers []
  (let [level (get levels/*levels* 0)]
    (bench/benchmarkTempest
     (apply concat
            (take 5
                  (repeatedly
                   #(flipper-on-each-segment level))))
     '())))

(defn ^:export benchmarkFlippersNoFlip []
  (let [level (get levels/*levels* 0)]
    (bench/benchmarkTempest
     (apply concat
            (take 5
                  (repeatedly
                   #(flipper-on-each-segment-noflip level))))
     '())))

(defn ^:export benchmarkSpikers []
  (let [level (get levels/*levels* 0)]
    (bench/benchmarkTempest
     (apply concat
            (take 10
                  (repeatedly
                   #(spiker-on-each-segment level))))
     '())))

(defn ^:export benchmarkProjectiles []
  (let [level (get levels/*levels* 0)]
    (bench/benchmarkTempest
      (apply concat
             (take 8
                   (repeatedly
                    #(spiker-on-each-segment level))))
      (flatten (map #(projectile-on-each-segment level %) (range -1 -9 -1))))))

