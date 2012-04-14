;;
;; This file is part of tempest-cljs
;; Copyright (c) 2012, Trevor Bentley
;; All rights reserved.
;; See LICENSE file for details.
;;

(ns ^{:doc "
Functions for benchmarking tempest-cljs.
"}
  tempest.benchmarks
  (:require [tempest.levels :as levels]
            [tempest.draw :as draw]
            [tempest.core :as c]
            [goog.dom :as dom]))

(defn benchmarkTempest
  "Run benchmark tests for tempest-cljs."
  [enemies projectiles]
  (let [document (dom/getDocument)
        canvas (dom/getElement "canv-fg")
        context (.getContext canvas "2d")
        bgcanvas (dom/getElement "canv-bg")
        bgcontext (.getContext bgcanvas "2d")
        dims {:width (.-width canvas) :height (.-height canvas)}
        level (get levels/*levels* 0)]

    (.log js/console (str (count enemies) " enemies"))
    (.log js/console (str (count projectiles) " projectiles"))

    (let [empty-game-state (init-benchmarks (c/build-game-state))
          game-state (assoc
                         (c/change-level
                          (assoc empty-game-state
                            :context context
                            :bgcontext bgcontext
                            :dims dims
                            :anim-fn (c/animationFrameMethod))
                          0)
                       :enemy-list enemies
                       :projectile-list projectiles
                       :level (assoc level :probability
                                     {:flipper 0 :tanker 0 :spiker 0}))]
      (next-game-state game-state))))



(defn init-benchmarks
  [game-state]
  (assoc game-state
    :bm-frames 0
    :bm-start (goog.now)))

(defn increment-benchmark-frames
  [game-state]
  (assoc game-state :bm-frames (inc (:bm-frames game-state))))

(defn render-benchmark-result
  [game-state]
  (let [{frames :bm-frames start :bm-start} game-state
        fps (/ frames (/ (- (goog.now) start) 1000))
        str-fps (pr-str fps)]
    (dom/setTextContent (dom/getElement "fps")
                        (str "BENCHMARK FPS: " str-fps))))

(defn next-game-state
  [game-state]
  (benchmark-logic game-state))

(defn schedule-next-frame
  [game-state]
  (if (< (- (goog.now) (:bm-start game-state)) 15000)
    ((:anim-fn game-state) #(next-game-state game-state))
    (render-benchmark-result game-state)))

(defn benchmark-logic
  [game-state]
  (let [gs1 (->> game-state
                 c/dequeue-keypresses
                 c/clear-frame
                 c/draw-board
                 c/render-frame)
        gs2 (->> gs1
                 c/remove-spiked-bullets
                 c/remove-collided-entities
                 c/remove-collided-bullets
                 c/update-projectile-locations
                 c/update-enemy-locations
                 c/update-enemy-directions
                 c/maybe-split-tankers
                 c/handle-dead-enemies
                 c/handle-exiting-spikers
                 c/maybe-enemies-shoot)
        gs3 (->> gs2
                 c/handle-spike-laying
                 c/maybe-make-enemy
                 c/check-if-enemies-remain
                 c/update-entity-is-flipping
                 c/update-entity-flippyness
                 c/update-frame-count
                 c/maybe-render-fps-display
                 increment-benchmark-frames)]
    (->> gs3 schedule-next-frame)))

