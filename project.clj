(defproject tempest-cljs "0.1.4-SNAPSHOT"
  :description "Clone of Tempest vector-graphic arcade game.
                Written in ClojureScript, and uses HTML5 2D canvas
                for display."
  :license {:name "Modified BSD License"
            :url "http://www.opensource.org/licenses/BSD-3-Clause"
            :distribution :repo}
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [noir "1.2.1"]]
  :dev-dependencies [[lein-marginalia "0.7.0-SNAPSHOT"]]
  :plugins [[lein-cljsbuild "0.1.7"]]
  :cljsbuild {
              :builds [{:source-path "tempest"
                        :compiler {:output-to "resources/public/tempest.js"
                                   :optimizations :whitespace
                                   ;;:optimizations :advanced
                                   :pretty-print true}}]}
  :main tempest-cljs.server)

