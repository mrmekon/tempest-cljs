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
   [:div#links {:style "color: #FFFFFF; position: absolute; z-index: 2;"}
    (link-to {:style (str "color: #FFFFFF; position:absolute;"
                          "width:200px; text-decoration: none;"
                          "border-bottom: 1px dotted;")}
             "https://github.com/mrmekon/tempest-cljs/"
             "tempest-cljs on github")
    (link-to {:style (str "color: #FFFFFF; position: absolute;"
                          "left: 201px; width: 100px; text-decoration: none;"
                          "border-bottom: 1px dotted;")}
             "http://www.trevorbentley.com"
             "trevor bentley")]
   [:canvas#canv-bg {:width "1000" :height "700"
                     :style (str "position: absolute; z-index: 0;"
                                 "background-color: #000000;")}]
   [:canvas#canv-fg {:width "1000" :height "700"
                     :style (str "position: absolute; z-index: 1;")}]
   [:p#fps {:style "color: #FFFFFF; position: absolute; top: 690px"} "FPS 0.0"]
   (javascript-tag (str "tempest.canvasDraw(" (pr-str level) ");"))
   ))

