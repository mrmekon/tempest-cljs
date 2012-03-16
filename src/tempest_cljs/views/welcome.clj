(ns tempest-cljs.views.welcome
  (:require [tempest-cljs.views.common :as common]
            [noir.content.getting-started])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(defpage "/welcome" []
         (common/layout
           [:p "Welcome to tempest-cljs"]))
