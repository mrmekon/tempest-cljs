(ns ^{:doc "
Publicly exported functions to embed Tempest game in HTML.
"}
  tempest
  (:require [tempest.levels :as levels]
            [tempest.draw :as draw]
            [tempest.core :as c]
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
;;   * Flippers should.. flip.
;;   * Player should be sucked down the level if a flipper touches him
;;   * MOAR ENEMIES
;;   * Jump?  Is that possible with this design?  I think so, easily, by
;;     scaling just the first, undrawn line of player.  It ends up being
;;     normal to the segment's top line.
;;   * Power ups.  Bonus points if they're crazy swirly particle things.
;;   * Board colors.  Blue on black is the classic.
;;   * Current segment highlight color
;;   * Browser + keyboard input stuff
;;     - Find appropriate size for canvas.  Maybe there's a way to make it
;;       "full screen"
;;     - Don't let spacebar scroll the screen, or use a different key
;;     - Any way to change repeat rate?  Probably not
;;     - Any way to use the mouse?
;;     - I'm not above making a custom rotary controller.
;;     - Two keys at the same time?  Gotta swirl-n-shoot.
;;   * Offset flat levels up more, instead of displaying them at the bottom.
;;   * Rate-limit bullets
;;   * Frame timing, and disassociate movement speed from framerate.
;;

(defn ^:export canvasDraw
  "Begins a game of tempest.  'level' specified as a string representation
   of an integer."
  [level]
  (let [document (dom/getDocument)
        level (get levels/*levels* (- (js/parseInt level) 1))
        canvas (dom/getElement "canv-fg")
        context (.getContext canvas "2d")
        bgcanvas (dom/getElement "canv-bg")
        bgcontext (.getContext bgcanvas "2d")
        handler (goog.events.KeyHandler. document true)
        dims {:width (.-width canvas) :height (.-height canvas)}]

    (draw/draw-board bgcontext dims level)
    (events/listen handler "key" (fn [e] (c/queue-keypress e)))
    
    (let [empty-game-state (c/build-game-state)
          game-state (assoc empty-game-state
                       :player (c/build-player level 7)
                       :level level
                       :context context
                       :dims dims
                       :anim-fn (c/animationFrameMethod)
                       :enemy-list (list
                                    (c/build-flipper level 0 :step 0)
                                    (c/build-flipper level 1 :step 0)
                                    (c/build-flipper level 2 :step 0)
                                    (c/build-flipper level 3 :step 0)
                                    (c/build-flipper level 4 :step 0)
                                    (c/build-flipper level 5 :step 0)
                                    (c/build-flipper level 6 :step 0)
                                    (c/build-flipper level 7 :step 0)
                                    (c/build-flipper level 8 :step 0)
                                    (c/build-flipper level 9 :step 0)
                                    (c/build-flipper level 10 :step 0)
                                    (c/build-flipper level 11 :step 0)
                                    (c/build-flipper level 12 :step 0)
                                    (c/build-flipper level 13 :step 0)
                                    (c/build-flipper level 14 :step 0)
                                    (c/build-flipper level 15 :step 0)
                                    (c/build-flipper level 16 :step 0)
                                    (c/build-flipper level 17 :step 0)
                                    (c/build-flipper level 18 :step 0)
                                    (c/build-flipper level 19 :step 0)
                                    (c/build-flipper level 20 :step 0)
                                    (c/build-flipper level 21 :step 0)
                                    (c/build-flipper level 22 :step 0)
                                    (c/build-flipper level 23 :step 0)
                                    (c/build-flipper level 24 :step 0)
                                    (c/build-flipper level 25 :step 0)
                                    (c/build-flipper level 26 :step 0)
                                    (c/build-flipper level 27 :step 0)
                                    (c/build-flipper level 28 :step 0)
                                    (c/build-flipper level 29 :step 0)
                                    (c/build-flipper level 30 :step 0)
                                    (c/build-flipper level 31 :step 0)
                                    (c/build-flipper level 32 :step 0)
                                    (c/build-flipper level 33 :step 0)
                                    (c/build-flipper level 34 :step 0)
                                    (c/build-flipper level 35 :step 0)
                                    (c/build-flipper level 36 :step 0)
                                    (c/build-flipper level 37 :step 0)
                                    (c/build-flipper level 38 :step 0)
                                    (c/build-flipper level 39 :step 0)
                                    (c/build-flipper level 40 :step 0)
                                    (c/build-flipper level 41 :step 0)
                                    (c/build-flipper level 42 :step 0)
                                    (c/build-flipper level 43 :step 0)
                                    (c/build-flipper level 44 :step 0)
                                    (c/build-flipper level 45 :step 0)
                                    (c/build-flipper level 46 :step 0)
                                    ))]
      (c/next-game-state game-state))))


(comment
)
