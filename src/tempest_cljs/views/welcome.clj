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
   [:canvas#canv-bg {:width "900" :height "900"
                     :style (str "position: absolute; z-index: 0;"
                                 "background-color: #000000;")}]
   [:canvas#canv-fg {:width "900" :height "900"
                     :style (str "position: absolute; z-index: 1;")}]
   [:p#fps "FPS 0.0"]
   (javascript-tag (str "tempest.canvasDraw(" (pr-str level) ");"))
   ))

