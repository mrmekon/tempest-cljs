(ns tempest.macros)

(defmacro fntime [& body]
  `(let [starttime# (goog.now)]
     (do
       ~@body
       (.log js/console
             (str "Fn time: " (pr-str (- (goog.now) starttime#)) " ms")))))
     

(defmacro dofn [& body]
  `(do ~@body))
