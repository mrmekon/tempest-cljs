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
        handler (goog.events.KeyHandler. document)
        dims {:width (.-width canvas) :height (.-height canvas)}]

    (.log js/console (str "Animation function: " (pr-str c/*animMethod*)))

    (reset! c/*player* (c/build-player level 7))
    (reset! c/*enemy-list*
            (list
             (c/build-enemy level 0 :step 0)
             (c/build-enemy level 1 :step 0)
             (c/build-enemy level 1 :step 10)
             (c/build-enemy level 1 :step 20)
             (c/build-enemy level 1 :step 30)
             (c/build-enemy level 1 :step 40)
             (c/build-enemy level 1 :step 50)
             (c/build-enemy level 1 :step 60)
             (c/build-enemy level 1 :step 70)
             (c/build-enemy level 3 :step 0)
             (c/build-enemy level 3 :step 10)
             (c/build-enemy level 3 :step 20)
             (c/build-enemy level 3 :step 30)
             (c/build-enemy level 3 :step 40)
             (c/build-enemy level 3 :step 50)
             (c/build-enemy level 3 :step 60)
             (c/build-enemy level 3 :step 70)
             (c/build-enemy level 7 :step 0)
             (c/build-enemy level 7 :step 10)
             (c/build-enemy level 7 :step 20)
             (c/build-enemy level 7 :step 30)
             (c/build-enemy level 7 :step 40)
             (c/build-enemy level 7 :step 50)
             (c/build-enemy level 8 :step 0)
             (c/build-enemy level 8 :step 10)
             (c/build-enemy level 8 :step 20)
             (c/build-enemy level 8 :step 30)
             (c/build-enemy level 8 :step 40)
             (c/build-enemy level 8 :step 50)
             (c/build-enemy level 8 :step 60)
             (c/build-enemy level 11 :step 10)))
  
    
    (draw/draw-board bgcontext dims level)
    (c/*animMethod* #(c/update-game! context dims level))
    (events/listen handler "key" (fn [e] (c/keypress e)))))

    
