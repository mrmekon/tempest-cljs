(defproject tempest-cljs "0.1.0-SNAPSHOT"
            :description "FIXME: write this!"
            :dependencies [[org.clojure/clojure "1.3.0"]
                           [noir "1.2.1"]]
            :plugins [[lein-cljsbuild "0.1.3"]]
            :cljsbuild {
              :builds [{:source-path "tempest"
                        :compiler {:output-to "resources/public/tempest.js"
                                   :optimizations :simple
                                   :pretty-print true}}]}
            :main tempest-cljs.server)

