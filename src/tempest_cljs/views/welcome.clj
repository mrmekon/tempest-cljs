(ns tempest-cljs.views.welcome
  (:require [tempest-cljs.views.common :as common]
            [noir.response :as resp])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(use 'noir.core 'hiccup.page-helpers 'hiccup.form-helpers)
(require '[noir.validation :as vali])
(require '[noir.response :as resp])

(defpage "/tempest/:level" {:keys [level]}
  (common/site-layout
   (include-js "/tempest.js")
   [:canvas#canv1 {:width "900" :height "900"}]
   [:p#fps "FPS 0.0"]
   (javascript-tag (str "tempest.canvasDraw(" (pr-str level) ");"))
   ))

