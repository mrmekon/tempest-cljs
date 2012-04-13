;;
;; This file is part of tempest-cljs
;; Copyright (c) 2012, Trevor Bentley
;; All rights reserved.
;; See LICENSE file for details.
;;

(ns tempest.macros
  "Macros for Tempest, in separate namespace because of ClojureScript
   limitation."
  )

(defmacro fntime
  "Log time taken to run given expressions to javascript console."
  [& body]
  `(let [starttime# (goog.now)]
     (do
       ~@body
       (.log js/console
             (str "Fn time: " (pr-str (- (goog.now) starttime#)) " ms")))))

(defmacro random-enemy-fn
  "Macro that returns a function that generates an enemy of type 'type'
   randomly.  The returned function should be given the game-state,
   and it will generate a random number, and create a new enemy of the given
   type if the random number is under the enemy type's probability and more
   of the given type of enemy are permitted on the level.

   Calls 'build-TYPE' function to make an enemy, with 'TYPE' replaced by
   whatever random-enemy-fn was called with.

   Example usage: (let [ffn (random-enemy-fn flipper)] (ffn game-state))"
  [type]
  `(fn [game-state#]
    (let [level# (:level game-state#)
          enemy-list# (:enemy-list game-state#)
          r# (if (empty? enemy-list#) (/ (rand) 2) (rand))
          {{more?# (keyword ~(name type))} :remaining
           {prob# (keyword ~(name type))} :probability
           segments# :segments} level#]
      (if (and (<= r# prob#) (pos? more?#))
        (assoc game-state#
          :enemy-list (cons (~(symbol (str "build-" (name type)))
                             level#
                             (rand-int (count segments#))) enemy-list#)
          :level (assoc-in level#
                           [:remaining (keyword ~(name type))] (dec more?#)))
        game-state#))))
