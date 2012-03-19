(ns tempest.util
  (:require [goog.dom :as dom]
            [goog.Timer :as timer]
            [goog.events :as events]
            [goog.events.EventType :as event-type]
            [goog.math :as math]))

(defn rad-to-deg [rad]
  (/ (* rad 180) 3.14159265358979))

(defn deg-to-rad [deg]
  (/ (* deg 3.14159265358979) 180))


