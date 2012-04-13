;;
;; This file is part of tempest-cljs
;; Copyright (c) 2012, Trevor Bentley
;; All rights reserved.
;; See LICENSE file for details.
;;

(ns ^{:doc "Small utility and math helper functions."}
  tempest.util)

(defn rad-to-deg
  "Convert radians to degrees"
  [rad]
  (/ (* rad 180) 3.14159265358979))

(defn deg-to-rad
  "Convert degrees to radians"
  [deg]
  (/ (* deg 3.14159265358979) 180))

(defn round
  "Perform quick rounding of given number.  ONLY WORKS WITH POSITIVE NUMBERS."
  [num]
  (js* "~~" (+ 0.5 num)))

