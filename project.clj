(defproject tempest-cljs "0.1.1-SNAPSHOT"
  :description "Clone of Tempest vector-graphic arcade game.
                Written in ClojureScript, and uses HTML5 2D canvas
                for display."
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [noir "1.2.1"]]
  :dev-dependencies [[lein-marginalia "0.7.0-SNAPSHOT"]]
  :plugins [[lein-cljsbuild "0.1.3"]]
  :cljsbuild {
              :builds [{:source-path "tempest"
                        :compiler {:output-to "resources/public/tempest.js"
                                   :optimizations :simple
                                   :pretty-print true}}]}
  :main tempest-cljs.server)

