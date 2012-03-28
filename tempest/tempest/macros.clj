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
     
