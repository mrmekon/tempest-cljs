var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    for(var b = a;b = b.substring(0, b.lastIndexOf("."));) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a;
      a in e.pathToNames || (e.pathToNames[a] = {});
      e.pathToNames[a][d] = true
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {});
      e.requires[a][b] = true
    }
  }
};
goog.require = function(a) {
  if(!COMPILED && !goog.getObjectByName(a)) {
    var b = goog.getPathFromDeps_(a);
    if(b) {
      goog.included_[b] = true;
      goog.writeScripts_()
    }else {
      a = "goog.require could not find: " + a;
      goog.global.console && goog.global.console.error(a);
      throw Error(a);
    }
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
COMPILED || (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return typeof a != "undefined" && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
        if(c.substr(d - 7, 7) == "base.js") {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = true)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>');
    return true
  }
  return false
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited)) {
        d.visited[e] = true;
        if(e in d.requires) {
          for(var g in d.requires[e]) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              if(!goog.getObjectByName(g)) {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
      }
      if(!(e in c)) {
        c[e] = true;
        b.push(e)
      }
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  var d = b || goog.global;
  if(arguments.length > 2) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var b = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(b, e);
      return a.apply(d, b)
    }
  }
  return function() {
    return a.apply(d, arguments)
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global._et_ != "undefined") {
          delete goog.global._et_;
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = false;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d;
  d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = false, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = true
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = ("" + a).toLowerCase(), d = ("" + b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
  a = "" + a;
  return!goog.string.encodeUriRegExp_.test(a) ? encodeURIComponent(a) : a
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global && !goog.string.contains(a, "<") ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = goog.global.document.createElement("div");
  b.innerHTML = "<pre>x" + a + "</pre>";
  if(b.firstChild[goog.string.NORMALIZE_FN_]) {
    b.firstChild[goog.string.NORMALIZE_FN_]()
  }
  a = b.firstChild.firstChild.nodeValue.slice(1);
  b.innerHTML = "";
  return goog.string.canonicalizeNewlines(a)
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d) {
    d > b && (d = b);
    var e = a.length - d, a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : "" + a;
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : "" + a
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim("" + a).split("."), e = goog.string.trim("" + b).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", i = e[g] || "", j = RegExp("(\\d*)(\\D*)", "g"), k = RegExp("(\\d*)(\\D*)", "g");
    do {
      var m = j.exec(h) || ["", "", ""], l = k.exec(i) || ["", "", ""];
      if(0 == m[0].length && 0 == l[0].length) {
        break
      }
      var c = 0 == m[1].length ? 0 : parseInt(m[1], 10), o = 0 == l[1].length ? 0 : parseInt(l[1], 10), c = goog.string.compareElements_(c, o) || goog.string.compareElements_(0 == m[2].length, 0 == l[2].length) || goog.string.compareElements_(m[2], l[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
  return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = ("" + a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
  return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = ("" + a).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.userAgent = {};
goog.userAgent.jscript = {};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = !1;
goog.userAgent.jscript.init_ = function() {
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = "ScriptEngine" in goog.global && "JScript" == goog.global.ScriptEngine();
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global.ScriptEngineMajorVersion() + "." + goog.global.ScriptEngineMinorVersion() + "." + goog.global.ScriptEngineBuildVersion() : "0"
};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT || goog.userAgent.jscript.init_();
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? !1 : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.jscript.VERSION, a)
};
goog.string.StringBuffer = function(a, b) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.set = function(a) {
  this.clear();
  this.append(a)
};
goog.userAgent.jscript.HAS_JSCRIPT ? (goog.string.StringBuffer.prototype.bufferLength_ = 0, goog.string.StringBuffer.prototype.append = function(a, b, c) {
  null == b ? this.buffer_[this.bufferLength_++] = a : (this.buffer_.push.apply(this.buffer_, arguments), this.bufferLength_ = this.buffer_.length);
  return this
}) : goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    this.bufferLength_ = this.buffer_.length = 0
  }else {
    this.buffer_ = ""
  }
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var a = this.buffer_.join("");
    this.clear();
    a && this.append(a);
    return a
  }
  return this.buffer_
};
goog.events = {};
goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function() {
};
goog.events.EventWrapper.prototype.unlisten = function() {
};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == a.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != a.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == b.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? "" + b : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isVersion("9"), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("8")};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  goog.Disposable.ENABLE_MONITORING && (goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.ENABLE_MONITORING = !1;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for(b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)])
  }
  return a
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.ENABLE_MONITORING)) {
    var a = goog.getUid(this);
    if(!goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[a]
  }
};
goog.Disposable.prototype.disposeInternal = function() {
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose()
};
goog.events.Event = function(a, b) {
  goog.Disposable.call(this);
  this.type = a;
  this.currentTarget = this.target = b
};
goog.inherits(goog.events.Event, goog.Disposable);
goog.events.Event.prototype.disposeInternal = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
  this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault()
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
MESSAGE:"message", CONNECT:"connect"};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b
};
goog.reflect.sinkValue = new Function("a", "return a");
goog.events.BrowserEvent = function(a, b) {
  a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = !1;
goog.events.BrowserEvent.prototype.altKey = !1;
goog.events.BrowserEvent.prototype.shiftKey = !1;
goog.events.BrowserEvent.prototype.metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type;
  goog.events.Event.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(goog.userAgent.GECKO) {
      try {
        goog.reflect.sinkValue(d.nodeName)
      }catch(e) {
        d = null
      }
    }
  }else {
    c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  delete this.returnValue_;
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
  goog.events.BrowserEvent.superClass_.disposeInternal.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.event_ = null
};
goog.debug = {};
goog.debug.Error = function(a) {
  this.stack = Error().stack || "";
  a && (this.message = "" + a)
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.lastIndexOf(b, c)
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var i = g[h];
      b.call(c, i, h, a) && (e[f++] = i)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }
  for(var b = [], c = 0, d = a.length;c < d;c++) {
    b[c] = a[c]
  }
  return b
};
goog.array.toArray = function(a) {
  return goog.isArray(a) ? goog.array.concat(a) : goog.array.clone(a)
};
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var i = f + g >> 1, j;
    j = c ? b.call(e, a[i], i, a) : b(d, a[i]);
    0 < j ? f = i + 1 : (g = i, h = !j)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  for(var b = b || goog.array.defaultCompare, d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  for(var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  for(var a = goog.bind(a.wrap, a), b = 0;b < goog.debug.entryPointRegistry.refList_.length;b++) {
    goog.debug.entryPointRegistry.refList_[b](a)
  }
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  for(var a = goog.bind(a.unwrap, a), b = 0;b < goog.debug.entryPointRegistry.refList_.length;b++) {
    goog.debug.entryPointRegistry.refList_[b](a)
  }
};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(a) {
  return a
}};
goog.events.Listener = function() {
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = !1;
goog.events.Listener.prototype.callOnce = !1;
goog.events.Listener.prototype.init = function(a, b, c, d, e, f) {
  if(goog.isFunction(a)) {
    this.isFunctionListener_ = !0
  }else {
    if(a && a.handleEvent && goog.isFunction(a.handleEvent)) {
      this.isFunctionListener_ = !1
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.callOnce = !1;
  this.key = ++goog.events.Listener.counter_;
  this.removed = !1
};
goog.events.Listener.prototype.handleEvent = function(a) {
  return this.isFunctionListener_ ? this.listener.call(this.handler || this.src, a) : this.listener.handleEvent.call(this.listener, a)
};
goog.structs = {};
goog.structs.SimplePool = function(a, b) {
  goog.Disposable.call(this);
  this.maxCount_ = b;
  this.freeQueue_ = [];
  this.createInitial_(a)
};
goog.inherits(goog.structs.SimplePool, goog.Disposable);
goog.structs.SimplePool.prototype.createObjectFn_ = null;
goog.structs.SimplePool.prototype.disposeObjectFn_ = null;
goog.structs.SimplePool.prototype.setCreateObjectFn = function(a) {
  this.createObjectFn_ = a
};
goog.structs.SimplePool.prototype.setDisposeObjectFn = function(a) {
  this.disposeObjectFn_ = a
};
goog.structs.SimplePool.prototype.getObject = function() {
  return this.freeQueue_.length ? this.freeQueue_.pop() : this.createObject()
};
goog.structs.SimplePool.prototype.releaseObject = function(a) {
  this.freeQueue_.length < this.maxCount_ ? this.freeQueue_.push(a) : this.disposeObject(a)
};
goog.structs.SimplePool.prototype.createInitial_ = function(a) {
  if(a > this.maxCount_) {
    throw Error("[goog.structs.SimplePool] Initial cannot be greater than max");
  }
  for(var b = 0;b < a;b++) {
    this.freeQueue_.push(this.createObject())
  }
};
goog.structs.SimplePool.prototype.createObject = function() {
  return this.createObjectFn_ ? this.createObjectFn_() : {}
};
goog.structs.SimplePool.prototype.disposeObject = function(a) {
  if(this.disposeObjectFn_) {
    this.disposeObjectFn_(a)
  }else {
    if(goog.isObject(a)) {
      if(goog.isFunction(a.dispose)) {
        a.dispose()
      }else {
        for(var b in a) {
          delete a[b]
        }
      }
    }
  }
};
goog.structs.SimplePool.prototype.disposeInternal = function() {
  goog.structs.SimplePool.superClass_.disposeInternal.call(this);
  for(var a = this.freeQueue_;a.length;) {
    this.disposeObject(a.pop())
  }
  delete this.freeQueue_
};
goog.events.pools = {};
goog.events.ASSUME_GOOD_GC = !1;
(function() {
  function a() {
    return{count_:0, remaining_:0}
  }
  function b() {
    return[]
  }
  function c() {
    var a = function(b) {
      return g.call(a.src, a.key, b)
    };
    return a
  }
  function d() {
    return new goog.events.Listener
  }
  function e() {
    return new goog.events.BrowserEvent
  }
  var f = !goog.events.ASSUME_GOOD_GC && goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7"), g;
  goog.events.pools.setProxyCallbackFunction = function(a) {
    g = a
  };
  if(f) {
    goog.events.pools.getObject = function() {
      return h.getObject()
    };
    goog.events.pools.releaseObject = function(a) {
      h.releaseObject(a)
    };
    goog.events.pools.getArray = function() {
      return i.getObject()
    };
    goog.events.pools.releaseArray = function(a) {
      i.releaseObject(a)
    };
    goog.events.pools.getProxy = function() {
      return j.getObject()
    };
    goog.events.pools.releaseProxy = function() {
      j.releaseObject(c())
    };
    goog.events.pools.getListener = function() {
      return k.getObject()
    };
    goog.events.pools.releaseListener = function(a) {
      k.releaseObject(a)
    };
    goog.events.pools.getEvent = function() {
      return m.getObject()
    };
    goog.events.pools.releaseEvent = function(a) {
      m.releaseObject(a)
    };
    var h = new goog.structs.SimplePool(0, 600);
    h.setCreateObjectFn(a);
    var i = new goog.structs.SimplePool(0, 600);
    i.setCreateObjectFn(b);
    var j = new goog.structs.SimplePool(0, 600);
    j.setCreateObjectFn(c);
    var k = new goog.structs.SimplePool(0, 600);
    k.setCreateObjectFn(d);
    var m = new goog.structs.SimplePool(0, 600);
    m.setCreateObjectFn(e)
  }else {
    goog.events.pools.getObject = a, goog.events.pools.releaseObject = goog.nullFunction, goog.events.pools.getArray = b, goog.events.pools.releaseArray = goog.nullFunction, goog.events.pools.getProxy = c, goog.events.pools.releaseProxy = goog.nullFunction, goog.events.pools.getListener = d, goog.events.pools.releaseListener = goog.nullFunction, goog.events.pools.getEvent = e, goog.events.pools.releaseEvent = goog.nullFunction
  }
})();
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && !(a = a[d[c]], !goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(a, b, c, d, e) {
  if(b) {
    if(goog.isArray(b)) {
      for(var f = 0;f < b.length;f++) {
        goog.events.listen(a, b[f], c, d, e)
      }
      return null
    }
    var d = !!d, g = goog.events.listenerTree_;
    b in g || (g[b] = goog.events.pools.getObject());
    g = g[b];
    d in g || (g[d] = goog.events.pools.getObject(), g.count_++);
    var g = g[d], h = goog.getUid(a), i;
    g.remaining_++;
    if(g[h]) {
      i = g[h];
      for(f = 0;f < i.length;f++) {
        if(g = i[f], g.listener == c && g.handler == e) {
          if(g.removed) {
            break
          }
          return i[f].key
        }
      }
    }else {
      i = g[h] = goog.events.pools.getArray(), g.count_++
    }
    f = goog.events.pools.getProxy();
    f.src = a;
    g = goog.events.pools.getListener();
    g.init(c, f, a, b, d, e);
    c = g.key;
    f.key = c;
    i.push(g);
    goog.events.listeners_[c] = g;
    goog.events.sources_[h] || (goog.events.sources_[h] = goog.events.pools.getArray());
    goog.events.sources_[h].push(g);
    a.addEventListener ? (a == goog.global || !a.customEvent_) && a.addEventListener(b, f, d) : a.attachEvent(goog.events.getOnString_(b), f);
    return c
  }
  throw Error("Invalid event type");
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listenOnce(a, b[f], c, d, e)
    }
    return null
  }
  a = goog.events.listen(a, b, c, d, e);
  goog.events.listeners_[a].callOnce = !0;
  return a
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.unlisten(a, b[f], c, d, e)
    }
    return null
  }
  d = !!d;
  a = goog.events.getListeners_(a, b, d);
  if(!a) {
    return!1
  }
  for(f = 0;f < a.length;f++) {
    if(a[f].listener == c && a[f].capture == d && a[f].handler == e) {
      return goog.events.unlistenByKey(a[f].key)
    }
  }
  return!1
};
goog.events.unlistenByKey = function(a) {
  if(!goog.events.listeners_[a]) {
    return!1
  }
  var b = goog.events.listeners_[a];
  if(b.removed) {
    return!1
  }
  var c = b.src, d = b.type, e = b.proxy, f = b.capture;
  c.removeEventListener ? (c == goog.global || !c.customEvent_) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(goog.events.getOnString_(d), e);
  c = goog.getUid(c);
  e = goog.events.listenerTree_[d][f][c];
  if(goog.events.sources_[c]) {
    var g = goog.events.sources_[c];
    goog.array.remove(g, b);
    0 == g.length && delete goog.events.sources_[c]
  }
  b.removed = !0;
  e.needsCleanup_ = !0;
  goog.events.cleanUp_(d, f, c, e);
  delete goog.events.listeners_[a];
  return!0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e)
};
goog.events.cleanUp_ = function(a, b, c, d) {
  if(!d.locked_ && d.needsCleanup_) {
    for(var e = 0, f = 0;e < d.length;e++) {
      if(d[e].removed) {
        var g = d[e].proxy;
        g.src = null;
        goog.events.pools.releaseProxy(g);
        goog.events.pools.releaseListener(d[e])
      }else {
        e != f && (d[f] = d[e]), f++
      }
    }
    d.length = f;
    d.needsCleanup_ = !1;
    if(0 == f && (goog.events.pools.releaseArray(d), delete goog.events.listenerTree_[a][b][c], goog.events.listenerTree_[a][b].count_--, 0 == goog.events.listenerTree_[a][b].count_ && (goog.events.pools.releaseObject(goog.events.listenerTree_[a][b]), delete goog.events.listenerTree_[a][b], goog.events.listenerTree_[a].count_--), 0 == goog.events.listenerTree_[a].count_)) {
      goog.events.pools.releaseObject(goog.events.listenerTree_[a]), delete goog.events.listenerTree_[a]
    }
  }
};
goog.events.removeAll = function(a, b, c) {
  var d = 0, e = null == b, f = null == c, c = !!c;
  if(null == a) {
    goog.object.forEach(goog.events.sources_, function(a) {
      for(var g = a.length - 1;0 <= g;g--) {
        var h = a[g];
        if((e || b == h.type) && (f || c == h.capture)) {
          goog.events.unlistenByKey(h.key), d++
        }
      }
    })
  }else {
    if(a = goog.getUid(a), goog.events.sources_[a]) {
      for(var a = goog.events.sources_[a], g = a.length - 1;0 <= g;g--) {
        var h = a[g];
        if((e || b == h.type) && (f || c == h.capture)) {
          goog.events.unlistenByKey(h.key), d++
        }
      }
    }
  }
  return d
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.getListeners_(a, b, c) || []
};
goog.events.getListeners_ = function(a, b, c) {
  var d = goog.events.listenerTree_;
  return b in d && (d = d[b], c in d && (d = d[c], a = goog.getUid(a), d[a])) ? d[a] : null
};
goog.events.getListener = function(a, b, c, d, e) {
  d = !!d;
  if(a = goog.events.getListeners_(a, b, d)) {
    for(b = 0;b < a.length;b++) {
      if(a[b].listener == c && a[b].capture == d && a[b].handler == e) {
        return a[b]
      }
    }
  }
  return null
};
goog.events.hasListener = function(a, b, c) {
  var a = goog.getUid(a), d = goog.events.sources_[a];
  if(d) {
    var e = goog.isDef(b), f = goog.isDef(c);
    return e && f ? (d = goog.events.listenerTree_[b], !!d && !!d[c] && a in d[c]) : !e && !f ? !0 : goog.array.some(d, function(a) {
      return e && a.type == b || f && a.capture == c
    })
  }
  return!1
};
goog.events.expose = function(a) {
  var b = [], c;
  for(c in a) {
    a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c])
  }
  return b.join("\n")
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
  var e = goog.events.listenerTree_;
  return b in e && (e = e[b], c in e) ? goog.events.fireListeners_(e[c], a, b, c, d) : !0
};
goog.events.fireListeners_ = function(a, b, c, d, e) {
  var f = 1, b = goog.getUid(b);
  if(a[b]) {
    a.remaining_--;
    a = a[b];
    a.locked_ ? a.locked_++ : a.locked_ = 1;
    try {
      for(var g = a.length, h = 0;h < g;h++) {
        var i = a[h];
        i && !i.removed && (f &= !1 !== goog.events.fireListener(i, e))
      }
    }finally {
      a.locked_--, goog.events.cleanUp_(c, d, b, a)
    }
  }
  return Boolean(f)
};
goog.events.fireListener = function(a, b) {
  var c = a.handleEvent(b);
  a.callOnce && goog.events.unlistenByKey(a.key);
  return c
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(a, b) {
  var c = b.type || b, d = goog.events.listenerTree_;
  if(!(c in d)) {
    return!0
  }
  if(goog.isString(b)) {
    b = new goog.events.Event(b, a)
  }else {
    if(b instanceof goog.events.Event) {
      b.target = b.target || a
    }else {
      var e = b, b = new goog.events.Event(c, a);
      goog.object.extend(b, e)
    }
  }
  var e = 1, f, d = d[c], c = !0 in d, g;
  if(c) {
    f = [];
    for(g = a;g;g = g.getParentEventTarget()) {
      f.push(g)
    }
    g = d[!0];
    g.remaining_ = g.count_;
    for(var h = f.length - 1;!b.propagationStopped_ && 0 <= h && g.remaining_;h--) {
      b.currentTarget = f[h], e &= goog.events.fireListeners_(g, f[h], b.type, !0, b) && !1 != b.returnValue_
    }
  }
  if(!1 in d) {
    if(g = d[!1], g.remaining_ = g.count_, c) {
      for(h = 0;!b.propagationStopped_ && h < f.length && g.remaining_;h++) {
        b.currentTarget = f[h], e &= goog.events.fireListeners_(g, f[h], b.type, !1, b) && !1 != b.returnValue_
      }
    }else {
      for(d = a;!b.propagationStopped_ && d && g.remaining_;d = d.getParentEventTarget()) {
        b.currentTarget = d, e &= goog.events.fireListeners_(g, d, b.type, !1, b) && !1 != b.returnValue_
      }
    }
  }
  return Boolean(e)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if(!goog.events.listeners_[a]) {
    return!0
  }
  var c = goog.events.listeners_[a], d = c.type, e = goog.events.listenerTree_;
  if(!(d in e)) {
    return!0
  }
  var e = e[d], f, g;
  if(goog.events.synthesizeEventPropagation_()) {
    f = b || goog.getObjectByName("window.event");
    var h = !0 in e, i = !1 in e;
    if(h) {
      if(goog.events.isMarkedIeEvent_(f)) {
        return!0
      }
      goog.events.markIeEvent_(f)
    }
    var j = goog.events.pools.getEvent();
    j.init(f, this);
    f = !0;
    try {
      if(h) {
        for(var k = goog.events.pools.getArray(), m = j.currentTarget;m;m = m.parentNode) {
          k.push(m)
        }
        g = e[!0];
        g.remaining_ = g.count_;
        for(var l = k.length - 1;!j.propagationStopped_ && 0 <= l && g.remaining_;l--) {
          j.currentTarget = k[l], f &= goog.events.fireListeners_(g, k[l], d, !0, j)
        }
        if(i) {
          g = e[!1];
          g.remaining_ = g.count_;
          for(l = 0;!j.propagationStopped_ && l < k.length && g.remaining_;l++) {
            j.currentTarget = k[l], f &= goog.events.fireListeners_(g, k[l], d, !1, j)
          }
        }
      }else {
        f = goog.events.fireListener(c, j)
      }
    }finally {
      k && (k.length = 0, goog.events.pools.releaseArray(k)), j.dispose(), goog.events.pools.releaseEvent(j)
    }
    return f
  }
  d = new goog.events.BrowserEvent(b, this);
  try {
    f = goog.events.fireListener(c, d)
  }finally {
    d.dispose()
  }
  return f
};
goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_);
goog.events.markIeEvent_ = function(a) {
  var b = !1;
  if(0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return
    }catch(c) {
      b = !0
    }
  }
  if(b || void 0 == a.returnValue) {
    a.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.synthesizeEventPropagation_ = function() {
  void 0 === goog.events.requiresSyntheticEventPropagation_ && (goog.events.requiresSyntheticEventPropagation_ = goog.userAgent.IE && !goog.global.addEventListener);
  return goog.events.requiresSyntheticEventPropagation_
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
});
goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = !0;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
  goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
  goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  return goog.events.dispatchEvent(this, a)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};
goog.math = {};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isVersion("9"), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isVersion("9") || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", 
H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", SPAN:"SPAN", STRIKE:"STRIKE", 
STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR"};
goog.Timer = function(a, b) {
  goog.events.EventTarget.call(this);
  this.interval_ = a || 1;
  this.timerObject_ = b || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global.window;
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_
};
goog.Timer.prototype.setInterval = function(a) {
  this.interval_ = a;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
};
goog.Timer.prototype.tick_ = function() {
  if(this.enabled) {
    var a = goog.now() - this.last_;
    0 < a && a < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()))
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now())
};
goog.Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, b, c) {
  if(goog.isFunction(a)) {
    c && (a = goog.bind(a, c))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = goog.bind(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return b > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, b || 0)
};
goog.Timer.clear = function(a) {
  goog.Timer.defaultTimerObject.clearTimeout(a)
};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  return(a = a.className) && "function" == typeof a.split ? a.split(/\s+/) : []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), d = goog.dom.classes.add_(c, d);
  a.className = c.join(" ");
  return d
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), d = goog.dom.classes.remove_(c, d);
  a.className = c.join(" ");
  return d
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0, d = 0;d < b.length;d++) {
    goog.array.contains(a, b[d]) || (a.push(b[d]), c++)
  }
  return c == b.length
};
goog.dom.classes.remove_ = function(a, b) {
  for(var c = 0, d = 0;d < a.length;d++) {
    goog.array.contains(b, a[d]) && (goog.array.splice(a, d--, 1), c++)
  }
  return c == b.length
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), a.className = d.join(" "));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && goog.dom.classes.remove_(d, b);
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  a.className = d.join(" ")
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a) {
  this.width = this.width * a;
  this.height = this.height * a;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  return this.scale(this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return a.querySelectorAll && a.querySelector && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(document) || goog.userAgent.isVersion("528"))
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      for(var d = {}, e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  var b = a.document;
  if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
    "undefined" == typeof a.innerHeight && (a = window);
    var b = a.innerHeight, c = a.document.documentElement.scrollHeight;
    a == a.top && c < b && (b -= 15);
    return new goog.math.Size(a.innerWidth, b)
  }
  a = goog.dom.isCss1CompatMode_(b) ? b.documentElement : b.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    var a = goog.dom.getViewportSize_(a).height, c = b.body, d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a), a = goog.dom.getWindow_(a);
  return new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.clone(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(a)
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["<tr>"], f = 0;f < c;f++) {
    e.push(d ? "<td>&nbsp;</td>" : "<td></td>")
  }
  e.push("</tr>");
  e = e.join("");
  c = ["<table>"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.STYLE:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(c) {
    if(1 == c) {
      return arguments[0]
    }
  }else {
    return null
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return goog.userAgent.WEBKIT ? a.document || a.contentWindow.document : a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(b))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(var e = 0, f;f = a.childNodes[e];e++) {
      if(b(f) && (c.push(f), d) || goog.dom.findNodes_(f, b, c, d)) {
        return!0
      }
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a) : !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : a.removeAttribute("tabIndex")
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.userAgent.IE || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(("" + a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  for(var a = [a], d = 0, e;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  for(var c = null == d, e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(a)
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1.0E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  for(var c = c || function(a, b) {
    return a == b
  }, d = d || function(b) {
    return a[b]
  }, e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var i = 0;i < f + 1;i++) {
    g[0][i] = 0
  }
  for(h = 1;h <= e;h++) {
    for(i = 1;i <= e;i++) {
      g[h][i] = c(a[h - 1], b[i - 1]) ? g[h - 1][i - 1] + 1 : Math.max(g[h - 1][i], g[h][i - 1])
    }
  }
  for(var j = [], h = e, i = f;0 < h && 0 < i;) {
    c(a[h - 1], b[i - 1]) ? (j.unshift(d(h - 1, i - 1)), h--, i--) : g[h - 1][i] > g[h][i - 1] ? h-- : i--
  }
  return j
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments), b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
var cljs = {core:{}};
cljs.core._STAR_print_fn_STAR_ = function() {
  throw Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a
};
cljs.core.type_satisfies_ = function(a, b) {
  var c = a[goog.typeOf.call(null, b)];
  if(cljs.core.truth_(c)) {
    return c
  }
  c = a._;
  return cljs.core.truth_(c) ? c : !1
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function(a, b) {
  return Error.call(null, "No protocol method " + a + " defined for type " + goog.typeOf.call(null, b) + ": " + b)
};
cljs.core.aclone = function(a) {
  return Array.prototype.slice.call(a)
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.aget = function(a, b) {
  return a[b]
};
cljs.core.aset = function(a, b, c) {
  return a[b] = c
};
cljs.core.alength = function(a) {
  return a.length
};
cljs.core.IFn = {};
cljs.core._invoke = function() {
  return function(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s, t, ja) {
    switch(arguments.length) {
      case 1:
        var u;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          u = a.cljs$core$IFn$_invoke(a)
        }else {
          var v;
          var ka = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(ka)) {
            v = ka
          }else {
            var la = cljs.core._invoke._;
            if(cljs.core.truth_(la)) {
              v = la
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          u = v.call(null, a)
        }
        return u;
      case 2:
        var w;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          w = a.cljs$core$IFn$_invoke(a, b)
        }else {
          var x;
          var ma = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(ma)) {
            x = ma
          }else {
            var na = cljs.core._invoke._;
            if(cljs.core.truth_(na)) {
              x = na
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          w = x.call(null, a, b)
        }
        return w;
      case 3:
        var y;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          y = a.cljs$core$IFn$_invoke(a, b, c)
        }else {
          var z;
          var oa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(oa)) {
            z = oa
          }else {
            var pa = cljs.core._invoke._;
            if(cljs.core.truth_(pa)) {
              z = pa
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          y = z.call(null, a, b, c)
        }
        return y;
      case 4:
        var A;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          A = a.cljs$core$IFn$_invoke(a, b, c, d)
        }else {
          var B;
          var qa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(qa)) {
            B = qa
          }else {
            var ra = cljs.core._invoke._;
            if(cljs.core.truth_(ra)) {
              B = ra
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          A = B.call(null, a, b, c, d)
        }
        return A;
      case 5:
        var C;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          C = a.cljs$core$IFn$_invoke(a, b, c, d, e)
        }else {
          var D;
          var sa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(sa)) {
            D = sa
          }else {
            var ta = cljs.core._invoke._;
            if(cljs.core.truth_(ta)) {
              D = ta
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          C = D.call(null, a, b, c, d, e)
        }
        return C;
      case 6:
        var E;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          E = a.cljs$core$IFn$_invoke(a, b, c, d, e, f)
        }else {
          var F;
          var ua = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(ua)) {
            F = ua
          }else {
            var va = cljs.core._invoke._;
            if(cljs.core.truth_(va)) {
              F = va
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          E = F.call(null, a, b, c, d, e, f)
        }
        return E;
      case 7:
        var G;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          G = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g)
        }else {
          var H;
          var wa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(wa)) {
            H = wa
          }else {
            var xa = cljs.core._invoke._;
            if(cljs.core.truth_(xa)) {
              H = xa
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          G = H.call(null, a, b, c, d, e, f, g)
        }
        return G;
      case 8:
        var I;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          I = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h)
        }else {
          var J;
          var ya = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(ya)) {
            J = ya
          }else {
            var za = cljs.core._invoke._;
            if(cljs.core.truth_(za)) {
              J = za
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          I = J.call(null, a, b, c, d, e, f, g, h)
        }
        return I;
      case 9:
        var K;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          K = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i)
        }else {
          var L;
          var Aa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Aa)) {
            L = Aa
          }else {
            var Ba = cljs.core._invoke._;
            if(cljs.core.truth_(Ba)) {
              L = Ba
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          K = L.call(null, a, b, c, d, e, f, g, h, i)
        }
        return K;
      case 10:
        var M;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          M = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j)
        }else {
          var N;
          var Ca = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ca)) {
            N = Ca
          }else {
            var Da = cljs.core._invoke._;
            if(cljs.core.truth_(Da)) {
              N = Da
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          M = N.call(null, a, b, c, d, e, f, g, h, i, j)
        }
        return M;
      case 11:
        var O;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          O = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k)
        }else {
          var P;
          var Ea = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ea)) {
            P = Ea
          }else {
            var Fa = cljs.core._invoke._;
            if(cljs.core.truth_(Fa)) {
              P = Fa
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          O = P.call(null, a, b, c, d, e, f, g, h, i, j, k)
        }
        return O;
      case 12:
        var Q;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          Q = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m)
        }else {
          var R;
          var Ga = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ga)) {
            R = Ga
          }else {
            var Ha = cljs.core._invoke._;
            if(cljs.core.truth_(Ha)) {
              R = Ha
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          Q = R.call(null, a, b, c, d, e, f, g, h, i, j, k, m)
        }
        return Q;
      case 13:
        var S;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          S = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l)
        }else {
          var T;
          var Ia = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ia)) {
            T = Ia
          }else {
            var Ja = cljs.core._invoke._;
            if(cljs.core.truth_(Ja)) {
              T = Ja
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          S = T.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l)
        }
        return S;
      case 14:
        var U;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          U = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o)
        }else {
          var V;
          var Ka = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ka)) {
            V = Ka
          }else {
            var La = cljs.core._invoke._;
            if(cljs.core.truth_(La)) {
              V = La
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          U = V.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o)
        }
        return U;
      case 15:
        var W;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          W = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n)
        }else {
          var X;
          var Ma = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ma)) {
            X = Ma
          }else {
            var Na = cljs.core._invoke._;
            if(cljs.core.truth_(Na)) {
              X = Na
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          W = X.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n)
        }
        return W;
      case 16:
        var Y;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          Y = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q)
        }else {
          var Z;
          var Oa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Oa)) {
            Z = Oa
          }else {
            var Pa = cljs.core._invoke._;
            if(cljs.core.truth_(Pa)) {
              Z = Pa
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          Y = Z.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q)
        }
        return Y;
      case 17:
        var $;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          $ = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p)
        }else {
          var aa;
          var Qa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Qa)) {
            aa = Qa
          }else {
            var Ra = cljs.core._invoke._;
            if(cljs.core.truth_(Ra)) {
              aa = Ra
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          $ = aa.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p)
        }
        return $;
      case 18:
        var ba;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          ba = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r)
        }else {
          var ca;
          var Sa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Sa)) {
            ca = Sa
          }else {
            var Ta = cljs.core._invoke._;
            if(cljs.core.truth_(Ta)) {
              ca = Ta
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          ba = ca.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r)
        }
        return ba;
      case 19:
        var da;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          da = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s)
        }else {
          var ea;
          var Ua = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ua)) {
            ea = Ua
          }else {
            var Va = cljs.core._invoke._;
            if(cljs.core.truth_(Va)) {
              ea = Va
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          da = ea.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s)
        }
        return da;
      case 20:
        var fa;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          fa = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s, t)
        }else {
          var ga;
          var Wa = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Wa)) {
            ga = Wa
          }else {
            var Xa = cljs.core._invoke._;
            if(cljs.core.truth_(Xa)) {
              ga = Xa
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          fa = ga.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s, t)
        }
        return fa;
      case 21:
        var ha;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IFn$_invoke : a)) {
          ha = a.cljs$core$IFn$_invoke(a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s, t, ja)
        }else {
          var ia;
          var Ya = cljs.core._invoke[goog.typeOf.call(null, a)];
          if(cljs.core.truth_(Ya)) {
            ia = Ya
          }else {
            var Za = cljs.core._invoke._;
            if(cljs.core.truth_(Za)) {
              ia = Za
            }else {
              throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
            }
          }
          ha = ia.call(null, a, b, c, d, e, f, g, h, i, j, k, m, l, o, n, q, p, r, s, t, ja)
        }
        return ha
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted = {};
cljs.core._count = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ICounted$_count : a)) {
    a = a.cljs$core$ICounted$_count(a)
  }else {
    var b;
    b = cljs.core._count[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._count._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "ICounted.-count", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IEmptyableCollection$_empty : a)) {
    a = a.cljs$core$IEmptyableCollection$_empty(a)
  }else {
    var b;
    b = cljs.core._empty[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._empty._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.ICollection = {};
cljs.core._conj = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ICollection$_conj : a)) {
    c = a.cljs$core$ICollection$_conj(a, b)
  }else {
    c = cljs.core._conj[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._conj._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "ICollection.-conj", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IIndexed$_nth : a)) {
          d = a.cljs$core$IIndexed$_nth(a, b)
        }else {
          d = cljs.core._nth[goog.typeOf.call(null, a)];
          if(!cljs.core.truth_(d) && (d = cljs.core._nth._, !cljs.core.truth_(d))) {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
          }
          d = d.call(null, a, b)
        }
        return d;
      case 3:
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IIndexed$_nth : a)) {
          d = a.cljs$core$IIndexed$_nth(a, b, c)
        }else {
          d = cljs.core._nth[goog.typeOf.call(null, a)];
          if(!cljs.core.truth_(d) && (d = cljs.core._nth._, !cljs.core.truth_(d))) {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
          }
          d = d.call(null, a, b, c)
        }
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ISeq = {};
cljs.core._first = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISeq$_first : a)) {
    a = a.cljs$core$ISeq$_first(a)
  }else {
    var b;
    b = cljs.core._first[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._first._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "ISeq.-first", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._rest = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISeq$_rest : a)) {
    a = a.cljs$core$ISeq$_rest(a)
  }else {
    var b;
    b = cljs.core._rest[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._rest._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "ISeq.-rest", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ILookup$_lookup : a)) {
          d = a.cljs$core$ILookup$_lookup(a, b)
        }else {
          d = cljs.core._lookup[goog.typeOf.call(null, a)];
          if(!cljs.core.truth_(d) && (d = cljs.core._lookup._, !cljs.core.truth_(d))) {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
          }
          d = d.call(null, a, b)
        }
        return d;
      case 3:
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ILookup$_lookup : a)) {
          d = a.cljs$core$ILookup$_lookup(a, b, c)
        }else {
          d = cljs.core._lookup[goog.typeOf.call(null, a)];
          if(!cljs.core.truth_(d) && (d = cljs.core._lookup._, !cljs.core.truth_(d))) {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
          }
          d = d.call(null, a, b, c)
        }
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IAssociative$_contains_key_QMARK_ : a)) {
    c = a.cljs$core$IAssociative$_contains_key_QMARK_(a, b)
  }else {
    c = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._contains_key_QMARK_._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._assoc = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IAssociative$_assoc : a)) {
    a = a.cljs$core$IAssociative$_assoc(a, b, c)
  }else {
    var d;
    d = cljs.core._assoc[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._assoc._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core.IMap = {};
cljs.core._dissoc = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMap$_dissoc : a)) {
    c = a.cljs$core$IMap$_dissoc(a, b)
  }else {
    c = cljs.core._dissoc[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._dissoc._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.ISet = {};
cljs.core._disjoin = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISet$_disjoin : a)) {
    c = a.cljs$core$ISet$_disjoin(a, b)
  }else {
    c = cljs.core._disjoin[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._disjoin._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.IStack = {};
cljs.core._peek = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IStack$_peek : a)) {
    a = a.cljs$core$IStack$_peek(a)
  }else {
    var b;
    b = cljs.core._peek[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._peek._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IStack.-peek", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._pop = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IStack$_pop : a)) {
    a = a.cljs$core$IStack$_pop(a)
  }else {
    var b;
    b = cljs.core._pop[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._pop._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IStack.-pop", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.IVector = {};
cljs.core._assoc_n = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IVector$_assoc_n : a)) {
    a = a.cljs$core$IVector$_assoc_n(a, b, c)
  }else {
    var d;
    d = cljs.core._assoc_n[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._assoc_n._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core.IDeref = {};
cljs.core._deref = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IDeref$_deref : a)) {
    a = a.cljs$core$IDeref$_deref(a)
  }else {
    var b;
    b = cljs.core._deref[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._deref._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IDeref.-deref", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout : a)) {
    a = a.cljs$core$IDerefWithTimeout$_deref_with_timeout(a, b, c)
  }else {
    var d;
    d = cljs.core._deref_with_timeout[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._deref_with_timeout._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core.IMeta = {};
cljs.core._meta = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMeta$_meta : a)) {
    a = a.cljs$core$IMeta$_meta(a)
  }else {
    var b;
    b = cljs.core._meta[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._meta._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IMeta.-meta", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IWithMeta$_with_meta : a)) {
    c = a.cljs$core$IWithMeta$_with_meta(a, b)
  }else {
    c = cljs.core._with_meta[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._with_meta._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d;
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IReduce$_reduce : a)) {
          d = a.cljs$core$IReduce$_reduce(a, b)
        }else {
          d = cljs.core._reduce[goog.typeOf.call(null, a)];
          if(!cljs.core.truth_(d) && (d = cljs.core._reduce._, !cljs.core.truth_(d))) {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
          }
          d = d.call(null, a, b)
        }
        return d;
      case 3:
        if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IReduce$_reduce : a)) {
          d = a.cljs$core$IReduce$_reduce(a, b, c)
        }else {
          d = cljs.core._reduce[goog.typeOf.call(null, a)];
          if(!cljs.core.truth_(d) && (d = cljs.core._reduce._, !cljs.core.truth_(d))) {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
          }
          d = d.call(null, a, b, c)
        }
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IEquiv = {};
cljs.core._equiv = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IEquiv$_equiv : a)) {
    c = a.cljs$core$IEquiv$_equiv(a, b)
  }else {
    c = cljs.core._equiv[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._equiv._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.IHash = {};
cljs.core._hash = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IHash$_hash : a)) {
    a = a.cljs$core$IHash$_hash(a)
  }else {
    var b;
    b = cljs.core._hash[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._hash._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IHash.-hash", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.ISeqable = {};
cljs.core._seq = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISeqable$_seq : a)) {
    a = a.cljs$core$ISeqable$_seq(a)
  }else {
    var b;
    b = cljs.core._seq[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._seq._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.ISequential = {};
cljs.core.IRecord = {};
cljs.core.IPrintable = {};
cljs.core._pr_seq = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IPrintable$_pr_seq : a)) {
    c = a.cljs$core$IPrintable$_pr_seq(a, b)
  }else {
    c = cljs.core._pr_seq[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._pr_seq._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IPending$_realized_QMARK_ : a)) {
    a = a.cljs$core$IPending$_realized_QMARK_(a)
  }else {
    var b;
    b = cljs.core._realized_QMARK_[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._realized_QMARK_._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IPending.-realized?", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core.IWatchable = {};
cljs.core._notify_watches = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IWatchable$_notify_watches : a)) {
    a = a.cljs$core$IWatchable$_notify_watches(a, b, c)
  }else {
    var d;
    d = cljs.core._notify_watches[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._notify_watches._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._add_watch = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IWatchable$_add_watch : a)) {
    a = a.cljs$core$IWatchable$_add_watch(a, b, c)
  }else {
    var d;
    d = cljs.core._add_watch[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._add_watch._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._remove_watch = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IWatchable$_remove_watch : a)) {
    c = a.cljs$core$IWatchable$_remove_watch(a, b)
  }else {
    c = cljs.core._remove_watch[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._remove_watch._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b
};
cljs.core._EQ_ = function(a, b) {
  return cljs.core._equiv.call(null, a, b)
};
cljs.core.nil_QMARK_ = function(a) {
  return null === a
};
cljs.core.type = function(a) {
  return a.constructor
};
cljs.core.IHash["null"] = !0;
cljs.core._hash["null"] = function() {
  return 0
};
cljs.core.ILookup["null"] = !0;
cljs.core._lookup["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IAssociative["null"] = !0;
cljs.core._assoc["null"] = function(a, b, c) {
  return cljs.core.hash_map.call(null, b, c)
};
cljs.core.ICollection["null"] = !0;
cljs.core._conj["null"] = function(a, b) {
  return cljs.core.list.call(null, b)
};
cljs.core.IReduce["null"] = !0;
cljs.core._reduce["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b.call(null);
      case 3:
        return c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IPrintable["null"] = !0;
cljs.core._pr_seq["null"] = function() {
  return cljs.core.list.call(null, "nil")
};
cljs.core.ISet["null"] = !0;
cljs.core._disjoin["null"] = function() {
  return null
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function() {
  return 0
};
cljs.core.IStack["null"] = !0;
cljs.core._peek["null"] = function() {
  return null
};
cljs.core._pop["null"] = function() {
  return null
};
cljs.core.ISeq["null"] = !0;
cljs.core._first["null"] = function() {
  return null
};
cljs.core._rest["null"] = function() {
  return cljs.core.list.call(null)
};
cljs.core.IEquiv["null"] = !0;
cljs.core._equiv["null"] = function(a, b) {
  return null === b
};
cljs.core.IWithMeta["null"] = !0;
cljs.core._with_meta["null"] = function() {
  return null
};
cljs.core.IMeta["null"] = !0;
cljs.core._meta["null"] = function() {
  return null
};
cljs.core.IIndexed["null"] = !0;
cljs.core._nth["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IEmptyableCollection["null"] = !0;
cljs.core._empty["null"] = function() {
  return null
};
cljs.core.IMap["null"] = !0;
cljs.core._dissoc["null"] = function() {
  return null
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return a.toString() === b.toString()
};
cljs.core.IHash.number = !0;
cljs.core._hash.number = function(a) {
  return a
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b
};
cljs.core.IHash["boolean"] = !0;
cljs.core._hash["boolean"] = function(a) {
  return!0 === a ? 1 : 0
};
cljs.core.IHash["function"] = !0;
cljs.core._hash["function"] = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.inc = function(a) {
  return a + 1
};
cljs.core.ci_reduce = function() {
  return function(a, b, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        a: {
          if(cljs.core.truth_(cljs.core._EQ_.call(null, 0, cljs.core._count.call(null, a)))) {
            e = b.call(null)
          }else {
            for(var f = cljs.core._nth.call(null, a, 0), g = 1;;) {
              if(cljs.core.truth_(g < cljs.core._count.call(null, a))) {
                f = b.call(null, f, cljs.core._nth.call(null, a, g)), g += 1
              }else {
                e = f;
                break a
              }
            }
          }
        }
        return e;
      case 3:
        a: {
          e = c;
          for(g = 0;;) {
            if(cljs.core.truth_(g < cljs.core._count.call(null, a))) {
              e = b.call(null, e, cljs.core._nth.call(null, a, g)), g += 1
            }else {
              f = e;
              break a
            }
          }
        }
        return f;
      case 4:
        a: {
          e = c;
          for(f = d;;) {
            if(cljs.core.truth_(f < cljs.core._count.call(null, a))) {
              e = b.call(null, e, cljs.core._nth.call(null, a, f)), f += 1
            }else {
              g = e;
              break a
            }
          }
        }
        return g
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IndexedSeq = function(a, b) {
  this.a = a;
  this.i = b
};
cljs.core.IndexedSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, this.a, b, this.a[this.i], this.i + 1);
      case 3:
        return cljs.core.ci_reduce.call(null, this.a, b, c, this.i)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d = b + this.i;
        return cljs.core.truth_(d < this.a.length) ? this.a[d] : null;
      case 3:
        return d = b + this.i, cljs.core.truth_(d < this.a.length) ? this.a[d] : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count = function() {
  return this.a.length - this.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first = function() {
  return this.a[this.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest = function() {
  return cljs.core.truth_(this.i + 1 < this.a.length) ? new cljs.core.IndexedSeq(this.a, this.i + 1) : cljs.core.list.call(null)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.IndexedSeq;
cljs.core.prim_seq = function(a, b) {
  return cljs.core.truth_(cljs.core._EQ_.call(null, 0, a.length)) ? null : new cljs.core.IndexedSeq(a, b)
};
cljs.core.array_seq = function(a, b) {
  return cljs.core.prim_seq.call(null, a, b)
};
cljs.core.IReduce.array = !0;
cljs.core._reduce.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, b);
      case 3:
        return cljs.core.ci_reduce.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ILookup.array = !0;
cljs.core._lookup.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return a[b];
      case 3:
        return cljs.core._nth.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IIndexed.array = !0;
cljs.core._nth.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.truth_(b < a.length) ? a[b] : null;
      case 3:
        return cljs.core.truth_(b < a.length) ? a[b] : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted.array = !0;
cljs.core._count.array = function(a) {
  return a.length
};
cljs.core.ISeqable.array = !0;
cljs.core._seq.array = function(a) {
  return cljs.core.array_seq.call(null, a, 0)
};
cljs.core.seq = function(a) {
  return cljs.core.truth_(a) ? cljs.core._seq.call(null, a) : null
};
cljs.core.first = function(a) {
  a = cljs.core.seq.call(null, a);
  return cljs.core.truth_(a) ? cljs.core._first.call(null, a) : null
};
cljs.core.rest = function(a) {
  return cljs.core._rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.next = function(a) {
  return cljs.core.truth_(a) ? cljs.core.seq.call(null, cljs.core.rest.call(null, a)) : null
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a))
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a))
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a))
};
cljs.core.last = function(a) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.next.call(null, a))) {
      a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.first.call(null, a)
    }
  }
};
cljs.core.ICounted._ = !0;
cljs.core._count._ = function(a) {
  for(var a = cljs.core.seq.call(null, a), b = 0;;) {
    if(cljs.core.truth_(a)) {
      a = cljs.core.next.call(null, a), b += 1
    }else {
      return b
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0
};
cljs.core.conj = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(d)) {
          b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return a.call(null, b, c)
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return cljs.core._conj.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.empty = function(a) {
  return cljs.core._empty.call(null, a)
};
cljs.core.count = function(a) {
  return cljs.core._count.call(null, a)
};
cljs.core.nth = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, Math.floor(b));
      case 3:
        return cljs.core._nth.call(null, a, Math.floor(b), c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.get = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, b);
      case 3:
        return cljs.core._lookup.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.assoc = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      for(;;) {
        if(b = a.call(null, b, c, d), cljs.core.truth_(h)) {
          c = cljs.core.first.call(null, h), d = cljs.core.second.call(null, h), h = cljs.core.nnext.call(null, h)
        }else {
          return b
        }
      }
    }, d = function(a, d, g, h) {
      var i = null;
      goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, i)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, d, g, h, a)
    };
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 3:
        return cljs.core._assoc.call(null, a, d, e);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.dissoc = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return cljs.core._dissoc.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.with_meta = function(a, b) {
  return cljs.core._with_meta.call(null, a, b)
};
cljs.core.meta = function(a) {
  return cljs.core.truth_(function() {
    return cljs.core.truth_(function() {
      if(cljs.core.truth_(a)) {
        var b = a.cljs$core$IMeta$;
        return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IMeta$")) : b
      }
      return a
    }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a)
  }()) ? cljs.core._meta.call(null, a) : null
};
cljs.core.peek = function(a) {
  return cljs.core._peek.call(null, a)
};
cljs.core.pop = function(a) {
  return cljs.core._pop.call(null, a)
};
cljs.core.disj = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return cljs.core._disjoin.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.hash = function(a) {
  return cljs.core._hash.call(null, a)
};
cljs.core.empty_QMARK_ = function(a) {
  return cljs.core.not.call(null, cljs.core.seq.call(null, a))
};
cljs.core.coll_QMARK_ = function(a) {
  return cljs.core.truth_(null === a) ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ICollection$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ICollection$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
};
cljs.core.set_QMARK_ = function(a) {
  return cljs.core.truth_(null === a) ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISet$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISet$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
};
cljs.core.associative_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IAssociative$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IAssociative$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
};
cljs.core.sequential_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISequential$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISequential$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
};
cljs.core.counted_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ICounted$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ICounted$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
};
cljs.core.map_QMARK_ = function(a) {
  return cljs.core.truth_(null === a) ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IMap$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IMap$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
};
cljs.core.vector_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IVector$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IVector$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
};
cljs.core.js_obj = function() {
  return{}
};
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach.call(null, a, function(a, d) {
    return b.push(d)
  });
  return b
};
cljs.core.js_delete = function(a, b) {
  return delete a[b]
};
cljs.core.lookup_sentinel = cljs.core.js_obj.call(null);
cljs.core.false_QMARK_ = function(a) {
  return!1 === a
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a
};
cljs.core.instance_QMARK_ = function(a, b) {
  return null != b && (b instanceof a || b.constructor === a || a === Object)
};
cljs.core.seq_QMARK_ = function(a) {
  return cljs.core.truth_(null === a) ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISeq$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISeq$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1
};
cljs.core.string_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.not.call(null, function() {
    var b = cljs.core._EQ_.call(null, a.charAt(0), "\ufdd0");
    return cljs.core.truth_(b) ? b : cljs.core._EQ_.call(null, a.charAt(0), "\ufdd1")
  }()) : b
};
cljs.core.keyword_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, a.charAt(0), "\ufdd0") : b
};
cljs.core.symbol_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, a.charAt(0), "\ufdd1") : b
};
cljs.core.number_QMARK_ = function(a) {
  return goog.isNumber.call(null, a)
};
cljs.core.fn_QMARK_ = function(a) {
  return goog.isFunction.call(null, a)
};
cljs.core.integer_QMARK_ = function(a) {
  var b = cljs.core.number_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? a == a.toFixed() : b
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core.truth_(cljs.core._lookup.call(null, a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) ? !1 : !0
};
cljs.core.find = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var c = cljs.core.associative_QMARK_.call(null, a);
      return cljs.core.truth_(c) ? cljs.core.contains_QMARK_.call(null, a, b) : c
    }
    return a
  }()) ? cljs.core.Vector.fromArray([b, cljs.core._lookup.call(null, a, b)]) : null
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      if(cljs.core.truth_(cljs.core.not.call(null, cljs.core._EQ_.call(null, a, b)))) {
        a = cljs.core.set([b, a]);
        for(b = c;;) {
          var d = cljs.core.first.call(null, b), c = cljs.core.next.call(null, b);
          if(cljs.core.truth_(b)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, a, d))) {
              return!1
            }
            a = cljs.core.conj.call(null, a, d);
            b = c
          }else {
            return!0
          }
        }
      }else {
        return!1
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return cljs.core.not.call(null, cljs.core._EQ_.call(null, a, d));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.compare = function(a, b) {
  return goog.array.defaultCompare.call(null, a, b)
};
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core.truth_(cljs.core._EQ_.call(null, a, cljs.core.compare)) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return cljs.core.truth_(cljs.core.number_QMARK_.call(null, d)) ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0
  }
};
cljs.core.sort = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.compare, b);
      case 2:
        var d;
        cljs.core.truth_(cljs.core.seq.call(null, c)) ? (d = cljs.core.to_array.call(null, c), goog.array.stableSort.call(null, d, cljs.core.fn__GT_comparator.call(null, b)), d = cljs.core.seq.call(null, d)) : d = cljs.core.List.EMPTY;
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.sort_by = function() {
  var a = null, b = function(a, b, e) {
    return cljs.core.sort.call(null, function(e, g) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, e), a.call(null, g))
    }, e)
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(null, c, cljs.core.compare, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._reduce.call(null, b, a);
      case 3:
        return cljs.core._reduce.call(null, c, a, b)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.seq_reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d;
        d = cljs.core.seq.call(null, b);
        d = cljs.core.truth_(d) ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, d), cljs.core.next.call(null, d)) : a.call(null);
        return d;
      case 3:
        a: {
          for(var e = b, f = cljs.core.seq.call(null, c);;) {
            if(cljs.core.truth_(f)) {
              e = a.call(null, e, cljs.core.first.call(null, f)), f = cljs.core.next.call(null, f)
            }else {
              d = e;
              break a
            }
          }
        }
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IReduce._ = !0;
cljs.core._reduce._ = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.seq_reduce.call(null, b, a);
      case 3:
        return cljs.core.seq_reduce.call(null, b, c, a)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b + c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c + f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b - c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c - f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b * c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c * f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(c, d, e) {
    switch(arguments.length) {
      case 1:
        return a.call(null, 1, c);
      case 2:
        return c / d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(cljs.core.truth_(a < b)) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b < cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(cljs.core.truth_(a <= b)) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b <= cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(cljs.core.truth_(a > b)) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b > cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(cljs.core.truth_(a >= b)) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b >= cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.dec = function(a) {
  return a - 1
};
cljs.core.max = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b > c ? b : c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c > f ? c : f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return a > d ? a : d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.min = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b < c ? b : c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c < f ? c : f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return a < d ? a : d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.fix = function(a) {
  return cljs.core.truth_(0 <= a) ? Math.floor.call(null, a) : Math.ceil.call(null, a)
};
cljs.core.mod = function(a, b) {
  return a % b
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix.call(null, (a - a % b) / b)
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c
};
cljs.core.rand = function() {
  var a = null;
  return a = function(b) {
    switch(arguments.length) {
      case 0:
        return Math.random.call(null);
      case 1:
        return b * a.call(null)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a))
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b
};
cljs.core.bit_and = function(a, b) {
  return a & b
};
cljs.core.bit_or = function(a, b) {
  return a | b
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b)
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b
};
cljs.core.bit_not = function(a) {
  return~a
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b)
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return cljs.core._equiv.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a
};
cljs.core.nthnext = function(a, b) {
  for(var c = b, d = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return cljs.core.truth_(a) ? 0 < c : a
    }())) {
      var e = c - 1, f = cljs.core.next.call(null, d), c = e, d = f
    }else {
      return d
    }
  }
};
cljs.core.IIndexed._ = !0;
cljs.core._nth._ = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d;
        d = cljs.core.nthnext.call(null, a, b);
        if(cljs.core.truth_(d)) {
          d = cljs.core.first.call(null, d)
        }else {
          throw Error("Index out of bounds");
        }
        return d;
      case 3:
        return d = cljs.core.nthnext.call(null, a, b), d = cljs.core.truth_(d) ? cljs.core.first.call(null, d) : c, d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.str_STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c), b = d, c = e
          }else {
            return a.call(null, b)
          }
        }
      }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
    }, d = function(a, d) {
      var g = null;
      goog.isDef(d) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, g)
    };
    d.cljs$lang$maxFixedArity = 1;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, d, a)
    };
    return d
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return cljs.core.truth_(null === a) ? "" : cljs.core.truth_("\ufdd0'else") ? a.toString() : null;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.str = function() {
  var a = null, b = function() {
    var a = function(a, b) {
      var c = null;
      goog.isDef(b) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return cljs.core.apply.call(null, cljs.core.str_STAR_, a, c)
    };
    a.cljs$lang$maxFixedArity = 1;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), a = cljs.core.rest(a);
      return cljs.core.apply.call(null, cljs.core.str_STAR_, b, a)
    };
    return a
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, a)) ? a.substring(2, a.length) : cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, a)) ? cljs.core.str_STAR_.call(null, ":", a.substring(2, a.length)) : cljs.core.truth_(null === a) ? "" : cljs.core.truth_("\ufdd0'else") ? a.toString() : null;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.subs = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return a.substring(b);
      case 3:
        return a.substring(b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.symbol = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, b)) ? b : cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, b)) && cljs.core.str_STAR_.call(null, "\ufdd1", "'", cljs.core.subs.call(null, b, 2)), cljs.core.str_STAR_.call(null, "\ufdd1", "'", b);
      case 2:
        return a.call(null, cljs.core.str_STAR_.call(null, b, "/", c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.keyword = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, b)) ? b : cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, b)) ? cljs.core.str_STAR_.call(null, "\ufdd0", "'", cljs.core.subs.call(null, b, 2)) : cljs.core.truth_("\ufdd0'else") ? cljs.core.str_STAR_.call(null, "\ufdd0", "'", b) : null;
      case 2:
        return a.call(null, cljs.core.str_STAR_.call(null, b, "/", c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.truth_(cljs.core.sequential_QMARK_.call(null, b)) ? function() {
    for(var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if(cljs.core.truth_(null === c)) {
        return null === d
      }
      if(cljs.core.truth_(null === d)) {
        return!1
      }
      if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d)))) {
        c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
      }else {
        return cljs.core.truth_("\ufdd0'else") ? !1 : null
      }
    }
  }() : null)
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
};
cljs.core.hash_coll = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.hash_combine.call(null, a, cljs.core.hash.call(null, c))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, a)), cljs.core.next.call(null, a))
};
cljs.core.extend_object_BANG_ = function(a, b) {
  var c = cljs.core.seq.call(null, b);
  if(cljs.core.truth_(c)) {
    var d = cljs.core.first.call(null, c);
    cljs.core.nth.call(null, d, 0, null);
    for(cljs.core.nth.call(null, d, 1, null);;) {
      var e = d, d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), d = cljs.core.name.call(null, d);
      a[d] = e;
      c = cljs.core.next.call(null, c);
      if(cljs.core.truth_(c)) {
        d = c, c = cljs.core.first.call(null, d), e = d, d = c, c = e
      }else {
        break
      }
    }
  }
  return a
};
cljs.core.List = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d
};
cljs.core.List.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.List")
};
cljs.core.List.prototype.cljs$core$IHash$ = !0;
cljs.core.List.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.List.prototype.cljs$core$ISequential$ = !0;
cljs.core.List.prototype.cljs$core$ICollection$ = !0;
cljs.core.List.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.List(this.meta, b, a, this.count + 1)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = !0;
cljs.core.List.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.List.prototype.cljs$core$ICounted$ = !0;
cljs.core.List.prototype.cljs$core$ICounted$_count = function() {
  return this.count
};
cljs.core.List.prototype.cljs$core$IStack$ = !0;
cljs.core.List.prototype.cljs$core$IStack$_peek = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop = function(a) {
  return cljs.core._rest.call(null, a)
};
cljs.core.List.prototype.cljs$core$ISeq$ = !0;
cljs.core.List.prototype.cljs$core$ISeq$_first = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest = function() {
  return this.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = !0;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count)
};
cljs.core.List.prototype.cljs$core$IMeta$ = !0;
cljs.core.List.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.List.EMPTY
};
cljs.core.List;
cljs.core.EmptyList = function(a) {
  this.meta = a
};
cljs.core.EmptyList.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count = function() {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.EmptyList(b)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty = function(a) {
  return a
};
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
cljs.core.list = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, a))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.Cons = function(a, b, c) {
  this.meta = a;
  this.first = b;
  this.rest = c
};
cljs.core.Cons.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Cons")
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.Cons.prototype.cljs$core$IHash$ = !0;
cljs.core.Cons.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = !0;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.Cons.prototype.cljs$core$ICollection$ = !0;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.Cons(null, b, a)
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = !0;
cljs.core.Cons.prototype.cljs$core$ISeq$_first = function() {
  return this.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest = function() {
  return cljs.core.truth_(null === this.rest) ? cljs.core.List.EMPTY : this.rest
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = !0;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest)
};
cljs.core.Cons;
cljs.core.cons = function(a, b) {
  return new cljs.core.Cons(null, a, b)
};
cljs.core.IReduce.string = !0;
cljs.core._reduce.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, b);
      case 3:
        return cljs.core.ci_reduce.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ILookup.string = !0;
cljs.core._lookup.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, b);
      case 3:
        return cljs.core._nth.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IIndexed.string = !0;
cljs.core._nth.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.truth_(b < cljs.core._count.call(null, a)) ? a.charAt(b) : null;
      case 3:
        return cljs.core.truth_(b < cljs.core._count.call(null, a)) ? a.charAt(b) : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted.string = !0;
cljs.core._count.string = function(a) {
  return a.length
};
cljs.core.ISeqable.string = !0;
cljs.core._seq.string = function(a) {
  return cljs.core.prim_seq.call(null, a, 0)
};
cljs.core.IHash.string = !0;
cljs.core._hash.string = function(a) {
  return goog.string.hashCode.call(null, a)
};
String.prototype.cljs$core$IFn$ = !0;
String.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.get.call(null, b, this.toString());
      case 3:
        return cljs.core.get.call(null, b, this.toString(), c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
String.prototype.apply = function(a, b) {
  return cljs.core.truth_(2 > cljs.core.count.call(null, b)) ? cljs.core.get.call(null, b[0], a) : cljs.core.get.call(null, b[0], a, b[1])
};
cljs.core.lazy_seq_value = function(a) {
  var b = a.x;
  if(cljs.core.truth_(a.realized)) {
    return b
  }
  a.x = b.call(null);
  a.realized = !0;
  return a.x
};
cljs.core.LazySeq = function(a, b, c) {
  this.meta = a;
  this.realized = b;
  this.x = c
};
cljs.core.LazySeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq = function(a) {
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first = function(a) {
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest = function(a) {
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.LazySeq(b, this.realized, this.x)
};
cljs.core.LazySeq;
cljs.core.to_array = function(a) {
  for(var b = [];;) {
    if(cljs.core.truth_(cljs.core.seq.call(null, a))) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.bounded_count = function(a, b) {
  for(var c = a, d = b, e = 0;;) {
    if(cljs.core.truth_(function() {
      var a = 0 < d;
      return cljs.core.truth_(a) ? cljs.core.seq.call(null, c) : a
    }())) {
      var f = cljs.core.next.call(null, c), g = d - 1, e = e + 1, c = f, d = g
    }else {
      return e
    }
  }
};
cljs.core.spread = function spread(b) {
  return cljs.core.truth_(null === b) ? null : cljs.core.truth_(null === cljs.core.next.call(null, b)) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : cljs.core.truth_("\ufdd0'else") ? cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b))) : null
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, !1, function() {
      return null
    })
  }, c = function(a) {
    return new cljs.core.LazySeq(null, !1, function() {
      return a
    })
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, b);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c
    })
  }, e = function() {
    var b = function(b, c, d) {
      return function m(a, b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = cljs.core.seq.call(null, a);
          return cljs.core.truth_(c) ? cljs.core.cons.call(null, cljs.core.first.call(null, c), m.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? m.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null
        })
      }.call(null, a.call(null, b, c), d)
    }, c = function(a, c, d) {
      var e = null;
      goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, d, a)
    };
    return c
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c, d, i) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, i)))))
    }, b = function(b, d, g, h, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, d, g, h, j)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), h = cljs.core.first(cljs.core.next(cljs.core.next(b))), i = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(b))));
      return a.call(this, d, g, h, i, b)
    };
    return b
  }(), a = function(a, d, e, f, g) {
    switch(arguments.length) {
      case 1:
        return cljs.core.seq.call(null, a);
      case 2:
        return cljs.core.cons.call(null, a, d);
      case 3:
        return cljs.core.cons.call(null, a, cljs.core.cons.call(null, d, e));
      case 4:
        return cljs.core.cons.call(null, a, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, f)));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.apply = function() {
  var a = null, b = function() {
    var a = function(a, b, c, d, i, j) {
      b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, i, cljs.core.spread.call(null, j)))));
      c = a.cljs$lang$maxFixedArity;
      return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core.bounded_count.call(null, b, c) <= c) ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
    }, b = function(b, d, g, h, i, j) {
      var k = null;
      goog.isDef(j) && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, d, g, h, i, k)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), h = cljs.core.first(cljs.core.next(cljs.core.next(b))), i = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), j = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(b))))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(b)))));
      return a.call(this, d, g, h, i, j, b)
    };
    return b
  }(), a = function(a, d, e, f, g, h) {
    switch(arguments.length) {
      case 2:
        var i = a, j = d, k = i.cljs$lang$maxFixedArity;
        return cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core.bounded_count.call(null, j, k + 1) <= k) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      case 3:
        return i = a, j = cljs.core.list_STAR_.call(null, d, e), k = i.cljs$lang$maxFixedArity, cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core.bounded_count.call(null, j, k) <= k) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      case 4:
        return i = a, j = cljs.core.list_STAR_.call(null, d, e, f), k = i.cljs$lang$maxFixedArity, cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core.bounded_count.call(null, j, k) <= k) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      case 5:
        return i = a, j = cljs.core.list_STAR_.call(null, d, e, f, g), k = i.cljs$lang$maxFixedArity, cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core.bounded_count.call(null, j, k) <= k) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.vary_meta = function() {
  var a = function(a, b, e) {
    return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), e))
  }, b = function(b, d, e) {
    var f = null;
    goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
    return a.call(this, d, e, b)
  };
  return b
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      var g = null;
      goog.isDef(c) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, g))
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, b, c, a))
    };
    return a
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return cljs.core.not.call(null, cljs.core._EQ_.call(null, a, d));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.not_empty = function(a) {
  return cljs.core.truth_(cljs.core.seq.call(null, a)) ? a : null
};
cljs.core.every_QMARK_ = function(a, b) {
  for(;;) {
    if(cljs.core.truth_(null === cljs.core.seq.call(null, b))) {
      return!0
    }
    if(cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
      var c = a, d = cljs.core.next.call(null, b), a = c, b = d
    }else {
      return cljs.core.truth_("\ufdd0'else") ? !1 : null
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.every_QMARK_.call(null, a, b))
};
cljs.core.some = function(a, b) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if(cljs.core.truth_(c)) {
        return c
      }
      var c = a, d = cljs.core.next.call(null, b), a = c, b = d
    }else {
      return null
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b))
};
cljs.core.even_QMARK_ = function(a) {
  if(cljs.core.truth_(cljs.core.integer_QMARK_.call(null, a))) {
    return 0 === (a & 1)
  }
  throw Error(cljs.core.str.call(null, "Argument must be an integer: ", a));
};
cljs.core.odd_QMARK_ = function(a) {
  return cljs.core.not.call(null, cljs.core.even_QMARK_.call(null, a))
};
cljs.core.identity = function(a) {
  return a
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      var b = function(b, c, d) {
        var h = null;
        goog.isDef(d) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, h))
      };
      b.cljs$lang$maxFixedArity = 2;
      b.cljs$lang$applyTo = function(b) {
        var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, c, d, b))
      };
      return b
    }(), b = function(b, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.not.call(null, a.call(null));
        case 1:
          return cljs.core.not.call(null, a.call(null, b));
        case 2:
          return cljs.core.not.call(null, a.call(null, b, e));
        default:
          return c.apply(this, arguments)
      }
      throw"Invalid arity: " + arguments.length;
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = c.cljs$lang$applyTo;
    return b
  }()
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      goog.isDef(b) && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a
    };
    return b
  }()
};
cljs.core.comp = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          var i = null;
          goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return a.call(null, cljs.core.apply.call(null, b, c, d, g, i))
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(c) {
          var d = cljs.core.first(c), g = cljs.core.first(cljs.core.next(c)), h = cljs.core.first(cljs.core.next(cljs.core.next(c))), c = cljs.core.rest(cljs.core.next(cljs.core.next(c)));
          return a.call(null, cljs.core.apply.call(null, b, d, g, h, c))
        };
        return c
      }(), c = function(c, g, k, m) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null));
          case 1:
            return a.call(null, b.call(null, c));
          case 2:
            return a.call(null, b.call(null, c, g));
          case 3:
            return a.call(null, b.call(null, c, g, k));
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = null, i = function() {
        var d = function(d, h, i, j) {
          var n = null;
          goog.isDef(j) && (n = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, h, i, n)))
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(d) {
          var h = cljs.core.first(d), i = cljs.core.first(cljs.core.next(d)), j = cljs.core.first(cljs.core.next(cljs.core.next(d))), d = cljs.core.rest(cljs.core.next(cljs.core.next(d)));
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, h, i, j, d)))
        };
        return d
      }(), d = function(d, h, m, l) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null, c.call(null)));
          case 1:
            return a.call(null, b.call(null, c.call(null, d)));
          case 2:
            return a.call(null, b.call(null, c.call(null, d, h)));
          case 3:
            return a.call(null, b.call(null, c.call(null, d, h, m)));
          default:
            return i.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = i.cljs$lang$applyTo;
      return d
    }()
  }, d = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d));
      return function() {
        var a = function(a) {
          for(var a = cljs.core.apply.call(null, cljs.core.first.call(null, e), a), b = cljs.core.next.call(null, e);;) {
            if(cljs.core.truth_(b)) {
              a = cljs.core.first.call(null, b).call(null, a), b = cljs.core.next.call(null, b)
            }else {
              return a
            }
          }
        }, b = function(b) {
          var c = null;
          goog.isDef(b) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return a.call(this, c)
        };
        b.cljs$lang$maxFixedArity = 0;
        b.cljs$lang$applyTo = function(b) {
          b = cljs.core.seq(b);
          return a.call(this, b)
        };
        return b
      }()
    }, b = function(b, c, d, f) {
      var k = null;
      goog.isDef(f) && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, k)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), f = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, f, b)
    };
    return b
  }(), a = function(a, f, g, h) {
    switch(arguments.length) {
      case 0:
        return cljs.core.identity;
      case 1:
        return a;
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      default:
        return d.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  return a
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        var d = null;
        goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, d)
      };
      c.cljs$lang$maxFixedArity = 0;
      c.cljs$lang$applyTo = function(c) {
        c = cljs.core.seq(c);
        return cljs.core.apply.call(null, a, b, c)
      };
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        var e = null;
        goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, c, e)
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(d) {
        d = cljs.core.seq(d);
        return cljs.core.apply.call(null, a, b, c, d)
      };
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        var j = null;
        goog.isDef(e) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, c, d, j)
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(e) {
        e = cljs.core.seq(e);
        return cljs.core.apply.call(null, a, b, c, d, e)
      };
      return e
    }()
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f))
        }, g = function(a) {
          var b = null;
          goog.isDef(a) && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b)
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f.call(this, a)
        };
        return g
      }()
    }, b = function(b, c, d, e, g) {
      var l = null;
      goog.isDef(g) && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, l)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(b))));
      return a.call(this, c, d, e, g, b)
    };
    return b
  }(), a = function(a, g, h, i, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, i);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.fnil = function() {
  var a = function(a, b) {
    return function() {
      var c = null, g = function() {
        var c = function(c, f, g, h) {
          var l = null;
          goog.isDef(h) && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return cljs.core.apply.call(null, a, cljs.core.truth_(null === c) ? b : c, f, g, l)
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(c) {
          var f = cljs.core.first(c), g = cljs.core.first(cljs.core.next(c)), h = cljs.core.first(cljs.core.next(cljs.core.next(c))), c = cljs.core.rest(cljs.core.next(cljs.core.next(c)));
          return cljs.core.apply.call(null, a, cljs.core.truth_(null === f) ? b : f, g, h, c)
        };
        return c
      }(), c = function(c, f, j, k) {
        switch(arguments.length) {
          case 1:
            return a.call(null, cljs.core.truth_(null === c) ? b : c);
          case 2:
            return a.call(null, cljs.core.truth_(null === c) ? b : c, f);
          case 3:
            return a.call(null, cljs.core.truth_(null === c) ? b : c, f, j);
          default:
            return g.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = g.cljs$lang$applyTo;
      return c
    }()
  }, b = function(a, b, c) {
    return function() {
      var g = null, h = function() {
        var g = function(g, h, i, j) {
          return cljs.core.apply.call(null, a, cljs.core.truth_(null === g) ? b : g, cljs.core.truth_(null === h) ? c : h, i, j)
        }, h = function(a, b, c, d) {
          var e = null;
          goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return g.call(this, a, b, c, e)
        };
        h.cljs$lang$maxFixedArity = 3;
        h.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return g.call(this, b, c, d, a)
        };
        return h
      }(), g = function(g, j, k, m) {
        switch(arguments.length) {
          case 2:
            return a.call(null, cljs.core.truth_(null === g) ? b : g, cljs.core.truth_(null === j) ? c : j);
          case 3:
            return a.call(null, cljs.core.truth_(null === g) ? b : g, cljs.core.truth_(null === j) ? c : j, k);
          default:
            return h.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      g.cljs$lang$maxFixedArity = 3;
      g.cljs$lang$applyTo = h.cljs$lang$applyTo;
      return g
    }()
  }, c = function(a, b, c, g) {
    return function() {
      var h = null, i = function() {
        var h = function(h, i, j, k) {
          return cljs.core.apply.call(null, a, cljs.core.truth_(null === h) ? b : h, cljs.core.truth_(null === i) ? c : i, cljs.core.truth_(null === j) ? g : j, k)
        }, i = function(a, b, c, d) {
          var e = null;
          goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return h.call(this, a, b, c, e)
        };
        i.cljs$lang$maxFixedArity = 3;
        i.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return h.call(this, b, c, d, a)
        };
        return i
      }(), h = function(h, k, m, l) {
        switch(arguments.length) {
          case 2:
            return a.call(null, cljs.core.truth_(null === h) ? b : h, cljs.core.truth_(null === k) ? c : k);
          case 3:
            return a.call(null, cljs.core.truth_(null === h) ? b : h, cljs.core.truth_(null === k) ? c : k, cljs.core.truth_(null === m) ? g : m);
          default:
            return i.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      h.cljs$lang$maxFixedArity = 3;
      h.cljs$lang$applyTo = i.cljs$lang$applyTo;
      return h
    }()
  };
  return function(d, e, f, g) {
    switch(arguments.length) {
      case 2:
        return a.call(this, d, e);
      case 3:
        return b.call(this, d, e, f);
      case 4:
        return c.call(this, d, e, f, g)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, b + 1, cljs.core.rest.call(null, g))) : null
    })
  }.call(null, 0, b)
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = b.call(null, cljs.core.first.call(null, d));
      return cljs.core.truth_(e === null) ? keep.call(null, b, cljs.core.rest.call(null, d)) : cljs.core.cons.call(null, e, keep.call(null, b, cljs.core.rest.call(null, d)))
    }
    return null
  })
};
cljs.core.keep_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(cljs.core.truth_(g)) {
        var h = a.call(null, b, cljs.core.first.call(null, g));
        return cljs.core.truth_(h === null) ? d.call(null, b + 1, cljs.core.rest.call(null, g)) : cljs.core.cons.call(null, h, d.call(null, b + 1, cljs.core.rest.call(null, g)))
      }
      return null
    })
  }.call(null, 0, b)
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b, c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, b);
          return cljs.core.truth_(d) ? a.call(null, c) : d
        }())
      }, d = function(b, c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e
        }())
      }, e = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$.call(null, function() {
            var i = b.call(null, c, d, e);
            return cljs.core.truth_(i) ? cljs.core.every_QMARK_.call(null, a, h) : i
          }())
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), b = function(b, g, l, o) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return cljs.core.boolean$.call(null, a.call(null, b));
          case 2:
            return c.call(this, b, g);
          case 3:
            return d.call(this, b, g, l);
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d
        }())
      }, e = function(c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, c);
          return cljs.core.truth_(e) && (e = a.call(null, d), cljs.core.truth_(e)) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e
        }())
      }, k = function(c, d, e) {
        return cljs.core.boolean$.call(null, function() {
          var h = a.call(null, c);
          return cljs.core.truth_(h) && (h = a.call(null, d), cljs.core.truth_(h) && (h = a.call(null, e), cljs.core.truth_(h) && (h = b.call(null, c), cljs.core.truth_(h)))) ? (h = b.call(null, d), cljs.core.truth_(h) ? b.call(null, e) : h) : h
        }())
      }, m = function() {
        var d = function(d, e, i, j) {
          return cljs.core.boolean$.call(null, function() {
            var k = c.call(null, d, e, i);
            return cljs.core.truth_(k) ? cljs.core.every_QMARK_.call(null, function(c) {
              var d = a.call(null, c);
              return cljs.core.truth_(d) ? b.call(null, c) : d
            }, j) : k
          }())
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return k.call(this, a, b, c);
          default:
            return m.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = m.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
        }())
      }, k = function(d, e) {
        return cljs.core.boolean$.call(null, function() {
          var i = a.call(null, d);
          return cljs.core.truth_(i) && (i = b.call(null, d), cljs.core.truth_(i) && (i = c.call(null, d), cljs.core.truth_(i) && (i = a.call(null, e), cljs.core.truth_(i)))) ? (i = b.call(null, e), cljs.core.truth_(i) ? c.call(null, e) : i) : i
        }())
      }, m = function(d, e, i) {
        return cljs.core.boolean$.call(null, function() {
          var j = a.call(null, d);
          return cljs.core.truth_(j) && (j = b.call(null, d), cljs.core.truth_(j) && (j = c.call(null, d), cljs.core.truth_(j) && (j = a.call(null, e), cljs.core.truth_(j) && (j = b.call(null, e), cljs.core.truth_(j) && (j = c.call(null, e), cljs.core.truth_(j) && (j = a.call(null, i), cljs.core.truth_(j))))))) ? (j = b.call(null, i), cljs.core.truth_(j) ? c.call(null, i) : j) : j
        }())
      }, l = function() {
        var e = function(e, j, k, l) {
          return cljs.core.boolean$.call(null, function() {
            var m = d.call(null, e, j, k);
            return cljs.core.truth_(m) ? cljs.core.every_QMARK_.call(null, function(d) {
              var e = a.call(null, d);
              return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
            }, l) : m
          }())
        }, j = function(a, b, c, d) {
          var f = null;
          goog.isDef(d) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return e.call(this, b, c, d, a)
        };
        return j
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return k.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return l.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = l.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.every_QMARK_.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.every_QMARK_.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? c.call(null, b) : d
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.every_QMARK_.call(null, function(d) {
            var e = d.call(null, a);
            return cljs.core.truth_(e) ? (e = d.call(null, b), cljs.core.truth_(e) ? d.call(null, c) : e) : e
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            return cljs.core.boolean$.call(null, function() {
              var g = a.call(null, b, c, d);
              return cljs.core.truth_(g) ? cljs.core.every_QMARK_.call(null, function(a) {
                return cljs.core.every_QMARK_.call(null, a, f)
              }, e) : g
            }())
          }, c = function(a, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
            return b.call(this, c, d, e, a)
          };
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return!0;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var c = function(c, d, e, h) {
          c = b.call(null, c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, h)
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return a.call(null, b);
          case 2:
            var l = d, o = a.call(null, b);
            return cljs.core.truth_(o) ? o : a.call(null, l);
          case 3:
            var o = d, l = e, n = a.call(null, b);
            cljs.core.truth_(n) ? l = n : (o = a.call(null, o), l = cljs.core.truth_(o) ? o : a.call(null, l));
            return l;
          default:
            return c.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c, d, e) {
        var h = a.call(null, c);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.call(null, d);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.call(null, e);
        if(cljs.core.truth_(h)) {
          return h
        }
        c = b.call(null, c);
        if(cljs.core.truth_(c)) {
          return c
        }
        d = b.call(null, d);
        return cljs.core.truth_(d) ? d : b.call(null, e)
      }, e = function() {
        var d = function(d, e, i, j) {
          d = c.call(null, d, e, i);
          return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? d : b.call(null, c)
          }, j)
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), c = function(c, h, l, o) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            var n = c, q = a.call(null, n);
            return cljs.core.truth_(q) ? q : b.call(null, n);
          case 2:
            var q = c, n = h, p = a.call(null, q);
            cljs.core.truth_(p) ? n = p : (p = a.call(null, n), cljs.core.truth_(p) ? n = p : (q = b.call(null, q), n = cljs.core.truth_(q) ? q : b.call(null, n)));
            return n;
          case 3:
            return d.call(this, c, h, l);
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d, e) {
        var i = a.call(null, d);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = b.call(null, d);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = c.call(null, d);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = a.call(null, e);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = b.call(null, e);
        return cljs.core.truth_(i) ? i : c.call(null, e)
      }, k = function(d, e, i) {
        var j = a.call(null, d);
        if(cljs.core.truth_(j)) {
          return j
        }
        j = b.call(null, d);
        if(cljs.core.truth_(j)) {
          return j
        }
        d = c.call(null, d);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = a.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = b.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        e = c.call(null, e);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.call(null, i);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, i);
        return cljs.core.truth_(e) ? e : c.call(null, i)
      }, m = function() {
        var e = function(e, j, k, m) {
          e = d.call(null, e, j, k);
          return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
            var e = a.call(null, d);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = b.call(null, d);
            return cljs.core.truth_(e) ? e : c.call(null, d)
          }, m)
        }, j = function(a, b, c, d) {
          var f = null;
          goog.isDef(d) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return e.call(this, b, c, d, a)
        };
        return j
      }(), d = function(d, i, n, q) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            var p;
            p = d;
            var r = a.call(null, p);
            cljs.core.truth_(r) ? p = r : (r = b.call(null, p), p = cljs.core.truth_(r) ? r : c.call(null, p));
            return p;
          case 2:
            return e.call(this, d, i);
          case 3:
            return k.call(this, d, i, n);
          default:
            return m.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = m.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.some.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.some.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? d : c.call(null, b)
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.some.call(null, function(d) {
            var e = d.call(null, a);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = d.call(null, b);
            return cljs.core.truth_(e) ? e : d.call(null, c)
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            b = a.call(null, b, c, d);
            return cljs.core.truth_(b) ? b : cljs.core.some.call(null, function(a) {
              return cljs.core.some.call(null, a, f)
            }, e)
          }, c = function(a, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
            return b.call(this, c, d, e, a)
          };
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return null;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, c);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d))) : null
    })
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var e = cljs.core.seq.call(null, c), j = cljs.core.seq.call(null, d);
      return cljs.core.truth_(cljs.core.truth_(e) ? j : e) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, j)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, j))) : null
    })
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var j = cljs.core.seq.call(null, c), k = cljs.core.seq.call(null, d), m = cljs.core.seq.call(null, e);
      return cljs.core.truth_(cljs.core.truth_(j) ? cljs.core.truth_(k) ? m : k : j) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, j), cljs.core.first.call(null, k), cljs.core.first.call(null, m)), a.call(null, b, cljs.core.rest.call(null, j), cljs.core.rest.call(null, k), cljs.core.rest.call(null, m))) : null
    })
  }, e = function() {
    var b = function(b, c, d, e, f) {
      return a.call(null, function(a) {
        return cljs.core.apply.call(null, b, a)
      }, function o(b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = a.call(null, cljs.core.seq, b);
          return cljs.core.truth_(cljs.core.every_QMARK_.call(null, cljs.core.identity, c)) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), o.call(null, a.call(null, cljs.core.rest, c))) : null
        })
      }.call(null, cljs.core.conj.call(null, f, e, d, c)))
    }, c = function(a, c, d, e, g) {
      var l = null;
      goog.isDef(g) && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, l)
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
      return b.call(this, c, d, e, g, a)
    };
    return c
  }(), a = function(a, g, h, i, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, i);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    if(cljs.core.truth_(b > 0)) {
      var d = cljs.core.seq.call(null, c);
      if(cljs.core.truth_(d)) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, d), take.call(null, b - 1, cljs.core.rest.call(null, d)))
      }
    }
    return null
  })
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = 0 < a;
        return cljs.core.truth_(b) ? c : b
      }())) {
        var g = a - 1, h = cljs.core.rest.call(null, c), a = g, b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  })
};
cljs.core.drop_last = function() {
  var a = null, b = function(a, b) {
    return cljs.core.map.call(null, function(a) {
      return a
    }, b, cljs.core.drop.call(null, a, b))
  };
  return a = function(c, d) {
    switch(arguments.length) {
      case 1:
        return a.call(null, 1, c);
      case 2:
        return b.call(this, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.take_last = function(a, b) {
  for(var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if(cljs.core.truth_(d)) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = c;
        return cljs.core.truth_(b) ? a.call(null, cljs.core.first.call(null, c)) : b
      }())) {
        var g = a, h = cljs.core.rest.call(null, c), a = g, b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  })
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, !1, function() {
    var c = cljs.core.seq.call(null, b);
    return cljs.core.truth_(c) ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null
  })
};
cljs.core.split_at = function(a, b) {
  return cljs.core.Vector.fromArray([cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)])
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b, a.call(null, b))
    })
  };
  return a = function(c, d) {
    switch(arguments.length) {
      case 1:
        return b.call(this, c);
      case 2:
        return cljs.core.take.call(null, c, a.call(null, d))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b))
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b))
    })
  };
  return a = function(c, d) {
    switch(arguments.length) {
      case 1:
        return b.call(this, c);
      case 2:
        return cljs.core.take.call(null, c, a.call(null, d))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
    return iterate.call(null, b, b.call(null, c))
  }))
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, b), g = cljs.core.seq.call(null, c);
      return cljs.core.truth_(cljs.core.truth_(f) ? g : f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), cljs.core.cons.call(null, cljs.core.first.call(null, g), a.call(null, cljs.core.rest.call(null, f), cljs.core.rest.call(null, g)))) : null
    })
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, !1, function() {
        var e = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
        return cljs.core.truth_(cljs.core.every_QMARK_.call(null, cljs.core.identity, e)) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, e), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, e))) : null
      })
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  return a
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b))
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, a);
      return cljs.core.truth_(f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.truth_(cljs.core.seq.call(null, e)) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null
    })
  }.call(null, null, a)
};
cljs.core.mapcat = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      var g = null;
      goog.isDef(c) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, a, b, g))
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, b, c, a))
    };
    return a
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return cljs.core.flatten1.call(null, cljs.core.map.call(null, a, d));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), d = cljs.core.rest.call(null, d);
      return cljs.core.truth_(b.call(null, e)) ? cljs.core.cons.call(null, e, filter.call(null, b, d)) : filter.call(null, b, d)
    }
    return null
  })
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b)
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null)
    })
  }.call(null, c)
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return cljs.core.not.call(null, cljs.core.sequential_QMARK_.call(null, a))
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)))
};
cljs.core.into = function(a, b) {
  return cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.partition = function() {
  var a = null, b = function(b, c, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(cljs.core.truth_(g)) {
        var h = cljs.core.take.call(null, b, g);
        return cljs.core.truth_(cljs.core._EQ_.call(null, b, cljs.core.count.call(null, h))) ? cljs.core.cons.call(null, h, a.call(null, b, c, cljs.core.drop.call(null, c, g))) : null
      }
      return null
    })
  }, c = function(b, c, f, g) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq.call(null, g);
      if(cljs.core.truth_(h)) {
        var i = cljs.core.take.call(null, b, h);
        return cljs.core.truth_(cljs.core._EQ_.call(null, b, cljs.core.count.call(null, i))) ? cljs.core.cons.call(null, i, a.call(null, b, c, f, cljs.core.drop.call(null, c, h))) : cljs.core.list.call(null, cljs.core.take.call(null, b, cljs.core.concat.call(null, i, f)))
      }
      return null
    })
  };
  return a = function(d, e, f, g) {
    switch(arguments.length) {
      case 2:
        return a.call(null, d, d, e);
      case 3:
        return b.call(this, d, e, f);
      case 4:
        return c.call(this, d, e, f, g)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.get_in = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.reduce.call(null, cljs.core.get, a, b);
      case 3:
        var d;
        a: {
          for(var e = cljs.core.lookup_sentinel, f = a, g = cljs.core.seq.call(null, b);;) {
            if(cljs.core.truth_(g)) {
              f = cljs.core.get.call(null, f, cljs.core.first.call(null, g), e);
              if(cljs.core.truth_(e === f)) {
                d = c;
                break a
              }
              g = cljs.core.next.call(null, g)
            }else {
              d = f;
              break a
            }
          }
        }
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nthnext.call(null, c, 1);
  return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d)
};
cljs.core.update_in = function() {
  var a = function(a, d, e, f) {
    var g = cljs.core.nth.call(null, d, 0, null), d = cljs.core.nthnext.call(null, d, 1);
    return cljs.core.truth_(d) ? cljs.core.assoc.call(null, a, g, cljs.core.apply.call(null, b, cljs.core.get.call(null, a, g), d, e, f)) : cljs.core.assoc.call(null, a, g, cljs.core.apply.call(null, e, cljs.core.get.call(null, a, g), f))
  }, b = function(b, d, e, f) {
    var g = null;
    goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return a.call(this, b, d, e, g)
  };
  b.cljs$lang$maxFixedArity = 3;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), f = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
    return a.call(this, d, e, f, b)
  };
  return b
}();
cljs.core.Vector = function(a, b) {
  this.meta = a;
  this.array = b
};
cljs.core.Vector.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$ = !0;
cljs.core.Vector.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = !0;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, b, null);
      case 3:
        return cljs.core._nth.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$IAssociative$ = !0;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  a = cljs.core.aclone.call(null, this.array);
  a[b] = c;
  return new cljs.core.Vector(this.meta, a)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = !0;
cljs.core.Vector.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$ISequential$ = !0;
cljs.core.Vector.prototype.cljs$core$ICollection$ = !0;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj = function(a, b) {
  var c = cljs.core.aclone.call(null, this.array);
  c.push(b);
  return new cljs.core.Vector(this.meta, c)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = !0;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, this.array, b);
      case 3:
        return cljs.core.ci_reduce.call(null, this.array, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  return cljs.core.truth_(0 < a.array.length) ? function c(d) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.truth_(d < a.array.length) ? cljs.core.cons.call(null, a.array[d], c.call(null, d + 1)) : null
    })
  }.call(null, 0) : null
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = !0;
cljs.core.Vector.prototype.cljs$core$ICounted$_count = function() {
  return this.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = !0;
cljs.core.Vector.prototype.cljs$core$IStack$_peek = function() {
  var a = this.array.length;
  return cljs.core.truth_(0 < a) ? this.array[a - 1] : null
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop = function() {
  if(cljs.core.truth_(0 < this.array.length)) {
    var a = cljs.core.aclone.call(null, this.array);
    a.pop();
    return new cljs.core.Vector(this.meta, a)
  }
  throw Error("Can't pop empty vector");
};
cljs.core.Vector.prototype.cljs$core$IVector$ = !0;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n = function(a, b, c) {
  return cljs.core._assoc.call(null, a, b, c)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Vector(b, this.array)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = !0;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth = function() {
  var a = function(a, b) {
    var e = this;
    return cljs.core.truth_(function() {
      var a = 0 <= b;
      return cljs.core.truth_(a) ? b < e.array.length : a
    }()) ? e.array[b] : null
  }, b = function(a, b, e) {
    var f = this;
    return cljs.core.truth_(function() {
      var a = 0 <= b;
      return cljs.core.truth_(a) ? b < f.array.length : a
    }()) ? f.array[b] : e
  };
  return function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(this, c, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, []);
cljs.core.Vector.fromArray = function(a) {
  return new cljs.core.Vector(null, a)
};
cljs.core.vec = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.Vector.EMPTY, a)
};
cljs.core.vector = function() {
  var a = function(a) {
    var c = null;
    goog.isDef(a) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return cljs.core.vec.call(null, c)
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = function(a) {
    a = cljs.core.seq(a);
    return cljs.core.vec.call(null, a)
  };
  return a
}();
cljs.core.Subvec = function(a, b, c, d) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d
};
cljs.core.Subvec.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$ = !0;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = !0;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, b, null);
      case 3:
        return cljs.core._nth.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = !0;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  a = this.start + b;
  return new cljs.core.Subvec(this.meta, cljs.core._assoc.call(null, this.v, a, c), this.start, this.end > a + 1 ? this.end : a + 1)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = !0;
cljs.core.Subvec.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Subvec.prototype.cljs$core$ISequential$ = !0;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = !0;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.Subvec(this.meta, cljs.core._assoc_n.call(null, this.v, this.end, b), this.start, this.end + 1)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = !0;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, b);
      case 3:
        return cljs.core.ci_reduce.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  return function c(d) {
    return cljs.core.truth_(cljs.core._EQ_.call(null, d, a.end)) ? null : cljs.core.cons.call(null, cljs.core._nth.call(null, a.v, d), new cljs.core.LazySeq(null, !1, function() {
      return c.call(null, d + 1)
    }))
  }.call(null, a.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = !0;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count = function() {
  return this.end - this.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = !0;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek = function() {
  return cljs.core._nth.call(null, this.v, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop = function() {
  if(cljs.core.truth_(cljs.core._EQ_.call(null, this.start, this.end))) {
    throw Error("Can't pop empty vector");
  }
  return new cljs.core.Subvec(this.meta, this.v, this.start, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = !0;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n = function(a, b, c) {
  return cljs.core._assoc.call(null, a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Subvec(b, this.v, this.start, this.end)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = !0;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, this.v, this.start + b);
      case 3:
        return cljs.core._nth.call(null, this.v, this.start + b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this.meta)
};
cljs.core.Subvec;
cljs.core.subvec = function() {
  var a = null;
  return a = function(b, c, d) {
    switch(arguments.length) {
      case 2:
        return a.call(null, b, c, cljs.core.count.call(null, b));
      case 3:
        return new cljs.core.Subvec(null, b, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.PersistentQueueSeq = function(a, b, c) {
  this.meta = a;
  this.front = b;
  this.rear = c
};
cljs.core.PersistentQueueSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first = function() {
  return cljs.core._first.call(null, this.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest = function(a) {
  var b = cljs.core.next.call(null, this.front);
  return cljs.core.truth_(b) ? new cljs.core.PersistentQueueSeq(this.meta, b, this.rear) : cljs.core.truth_(null === this.rear) ? cljs.core._empty.call(null, a) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear)
};
cljs.core.PersistentQueueSeq;
cljs.core.PersistentQueue = function(a, b, c, d) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d
};
cljs.core.PersistentQueue.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.call(null, function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.Vector.fromArray([])
  }(), b)) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.call(null, c.front, b), cljs.core.Vector.fromArray([]))
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this, b = cljs.core.seq.call(null, a.rear);
  return cljs.core.truth_(function() {
    var c = a.front;
    return cljs.core.truth_(c) ? c : b
  }()) ? new cljs.core.PersistentQueueSeq(null, a.front, cljs.core.seq.call(null, b)) : cljs.core.List.EMPTY
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count = function() {
  return this.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek = function() {
  return cljs.core._first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next.call(null, this.front), cljs.core.truth_(a) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq.call(null, this.rear), cljs.core.Vector.fromArray([]))) : a
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first = function() {
  return cljs.core.first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest = function(a) {
  return cljs.core.rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.Vector.fromArray([]));
cljs.core.NeverEquiv = function() {
};
cljs.core.NeverEquiv.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = !0;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv = function() {
  return!1
};
cljs.core.NeverEquiv;
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.truth_(cljs.core.map_QMARK_.call(null, b)) ? cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b))) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a))
  }, a)) : null : null)
};
cljs.core.scan_array = function(a, b, c) {
  for(var d = c.length, e = 0;;) {
    if(cljs.core.truth_(e < d)) {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, b, c[e]))) {
        return e
      }
      e += a
    }else {
      return null
    }
  }
};
cljs.core.obj_map_contains_key_QMARK_ = function() {
  var a = null, b = function(a, b, e, f) {
    return cljs.core.truth_(function() {
      var e = goog.isString.call(null, a);
      return cljs.core.truth_(e) ? b.hasOwnProperty(a) : e
    }()) ? e : f
  };
  return a = function(c, d, e, f) {
    switch(arguments.length) {
      case 2:
        return a.call(null, c, d, !0, !1);
      case 4:
        return b.call(this, c, d, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.call(null, a), d = cljs.core.hash.call(null, b);
  return cljs.core.truth_(c < d) ? -1 : cljs.core.truth_(c > d) ? 1 : cljs.core.truth_("\ufdd0'else") ? 0 : null
};
cljs.core.ObjMap = function(a, b, c) {
  this.meta = a;
  this.keys = b;
  this.strobj = c
};
cljs.core.ObjMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, b, null);
      case 3:
        return cljs.core.obj_map_contains_key_QMARK_.call(null, b, this.strobj, this.strobj[b], c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  if(cljs.core.truth_(goog.isString.call(null, b))) {
    var a = goog.object.clone.call(null, this.strobj), d = a.hasOwnProperty(b);
    a[b] = c;
    if(cljs.core.truth_(d)) {
      return new cljs.core.ObjMap(this.meta, this.keys, a)
    }
    c = cljs.core.aclone.call(null, this.keys);
    c.push(b);
    return new cljs.core.ObjMap(this.meta, c, a)
  }
  return cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null, b, c), cljs.core.seq.call(null, a)), this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = function(a, b) {
  return cljs.core.obj_map_contains_key_QMARK_.call(null, b, this.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = !0;
cljs.core.ObjMap.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.truth_(cljs.core.vector_QMARK_.call(null, b)) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  return cljs.core.truth_(0 < a.keys.length) ? cljs.core.map.call(null, function(b) {
    return cljs.core.vector.call(null, b, a.strobj[b])
  }, a.keys.sort(cljs.core.obj_map_compare_keys)) : null
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count = function() {
  return this.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc = function(a, b) {
  var c = this;
  if(cljs.core.truth_(function() {
    var a = goog.isString.call(null, b);
    return cljs.core.truth_(a) ? c.strobj.hasOwnProperty(b) : a
  }())) {
    var d = cljs.core.aclone.call(null, c.keys), e = goog.object.clone.call(null, c.strobj);
    d.splice(cljs.core.scan_array.call(null, 1, b, d), 1);
    cljs.core.js_delete.call(null, e, b);
    return new cljs.core.ObjMap(c.meta, d, e)
  }
  return a
};
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], cljs.core.js_obj.call(null));
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b)
};
cljs.core.HashMap = function(a, b, c) {
  this.meta = a;
  this.count = b;
  this.hashobj = c
};
cljs.core.HashMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$ = !0;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, b, null);
      case 3:
        var d = this.hashobj[cljs.core.hash.call(null, b)], e = cljs.core.truth_(d) ? cljs.core.scan_array.call(null, 2, b, d) : null;
        return cljs.core.truth_(e) ? d[e + 1] : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  var a = cljs.core.hash.call(null, b), d = this.hashobj[a];
  if(cljs.core.truth_(d)) {
    var d = cljs.core.aclone.call(null, d), e = goog.object.clone.call(null, this.hashobj);
    e[a] = d;
    a = cljs.core.scan_array.call(null, 2, b, d);
    if(cljs.core.truth_(a)) {
      return d[a + 1] = c, new cljs.core.HashMap(this.meta, this.count, e)
    }
    d.push(b, c);
    return new cljs.core.HashMap(this.meta, this.count + 1, e)
  }
  d = goog.object.clone.call(null, this.hashobj);
  d[a] = [b, c];
  return new cljs.core.HashMap(this.meta, this.count + 1, d)
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = function(a, b) {
  var c = this.hashobj[cljs.core.hash.call(null, b)], c = cljs.core.truth_(c) ? cljs.core.scan_array.call(null, 2, b, c) : null;
  return cljs.core.truth_(c) ? !0 : !1
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = !0;
cljs.core.HashMap.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.truth_(cljs.core.vector_QMARK_.call(null, b)) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  if(cljs.core.truth_(0 < a.count)) {
    var b = cljs.core.js_keys.call(null, a.hashobj).sort();
    return cljs.core.mapcat.call(null, function(b) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, a.hashobj[b]))
    }, b)
  }
  return null
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count = function() {
  return this.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.HashMap(b, this.count, this.hashobj)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = !0;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc = function(a, b) {
  var c = cljs.core.hash.call(null, b), d = this.hashobj[c], e = cljs.core.truth_(d) ? cljs.core.scan_array.call(null, 2, b, d) : null;
  if(cljs.core.truth_(cljs.core.not.call(null, e))) {
    return a
  }
  var f = goog.object.clone.call(null, this.hashobj);
  cljs.core.truth_(3 > d.length) ? cljs.core.js_delete.call(null, f, c) : (d = cljs.core.aclone.call(null, d), d.splice(e, 2), f[c] = d);
  return new cljs.core.HashMap(this.meta, this.count - 1, f)
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, cljs.core.js_obj.call(null));
cljs.core.HashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.HashMap.EMPTY;;) {
    if(cljs.core.truth_(d < c)) {
      var f = d + 1, e = cljs.core.assoc.call(null, e, a[d], b[d]), d = f
    }else {
      return e
    }
  }
};
cljs.core.hash_map = function() {
  var a = function(a) {
    for(var a = cljs.core.seq.call(null, a), b = cljs.core.HashMap.EMPTY;;) {
      if(cljs.core.truth_(a)) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a)), a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.keys = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, a))
};
cljs.core.vals = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, a))
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.ObjMap.fromObject([], {}), b)
    }, a) : null
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(b, d) {
        var e = cljs.core.first.call(null, d), i = cljs.core.second.call(null, d);
        return cljs.core.truth_(cljs.core.contains_QMARK_.call(null, b, e)) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), i)) : cljs.core.assoc.call(null, b, e, i)
      };
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.reduce.call(null, e, cljs.core.truth_(a) ? a : cljs.core.ObjMap.fromObject([], {}), cljs.core.seq.call(null, b))
      }, b)
    }
    return null
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.select_keys = function(a, b) {
  for(var c = cljs.core.ObjMap.fromObject([], {}), d = cljs.core.seq.call(null, b);;) {
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), f = cljs.core.get.call(null, a, e, "\ufdd0'user/not-found"), c = cljs.core.truth_(cljs.core.not_EQ_.call(null, f, "\ufdd0'user/not-found")) ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.Set = function(a, b) {
  this.meta = a;
  this.hash_map = b
};
cljs.core.Set.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Set")
};
cljs.core.Set.prototype.cljs$core$IHash$ = !0;
cljs.core.Set.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Set.prototype.cljs$core$ILookup$ = !0;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, b, null);
      case 3:
        return cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this.hash_map, b)) ? b : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Set.prototype.cljs$core$IFn$ = !0;
cljs.core.Set.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Set.prototype.cljs$core$ICollection$ = !0;
cljs.core.Set.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.Set(this.meta, cljs.core.assoc.call(null, this.hash_map, b, null))
};
cljs.core.Set.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq = function() {
  return cljs.core.keys.call(null, this.hash_map)
};
cljs.core.Set.prototype.cljs$core$ISet$ = !0;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin = function(a, b) {
  return new cljs.core.Set(this.meta, cljs.core.dissoc.call(null, this.hash_map, b))
};
cljs.core.Set.prototype.cljs$core$ICounted$ = !0;
cljs.core.Set.prototype.cljs$core$ICounted$_count = function(a) {
  return cljs.core.count.call(null, cljs.core.seq.call(null, a))
};
cljs.core.Set.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return cljs.core.truth_(c) ? (c = cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b)), cljs.core.truth_(c) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c) : c
};
cljs.core.Set.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Set(b, this.hash_map)
};
cljs.core.Set.prototype.cljs$core$IMeta$ = !0;
cljs.core.Set.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.Set.EMPTY, this.meta)
};
cljs.core.Set;
cljs.core.Set.EMPTY = new cljs.core.Set(null, cljs.core.hash_map.call(null));
cljs.core.set = function(a) {
  for(var a = cljs.core.seq.call(null, a), b = cljs.core.Set.EMPTY;;) {
    if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_.call(null, a)))) {
      var c = cljs.core.rest.call(null, a), b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = c
    }else {
      return b
    }
  }
};
cljs.core.replace = function(a, b) {
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, b))) {
    var c = cljs.core.count.call(null, b);
    return cljs.core.reduce.call(null, function(b, c) {
      var f = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, f)) : b
    }, b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }
  return cljs.core.map.call(null, function(b) {
    var c = cljs.core.find.call(null, a, b);
    return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b
  }, b)
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      return function(a, d) {
        for(;;) {
          var e = a, i = cljs.core.nth.call(null, e, 0, null), e = cljs.core.seq.call(null, e);
          if(cljs.core.truth_(e)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, d, i))) {
              i = cljs.core.rest.call(null, e);
              e = d;
              a = i;
              d = e
            }else {
              return cljs.core.cons.call(null, i, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, i)))
            }
          }else {
            return null
          }
        }
      }.call(null, a, e)
    })
  }.call(null, a, cljs.core.set([]))
};
cljs.core.butlast = function(a) {
  for(var b = cljs.core.Vector.fromArray([]);;) {
    if(cljs.core.truth_(cljs.core.next.call(null, a))) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.seq.call(null, b)
    }
  }
};
cljs.core.name = function(a) {
  if(cljs.core.truth_(cljs.core.string_QMARK_.call(null, a))) {
    return a
  }
  if(cljs.core.truth_(function() {
    var b = cljs.core.keyword_QMARK_.call(null, a);
    return cljs.core.truth_(b) ? b : cljs.core.symbol_QMARK_.call(null, a)
  }())) {
    var b = a.lastIndexOf("/");
    return cljs.core.truth_(0 > b) ? cljs.core.subs.call(null, a, 2) : cljs.core.subs.call(null, a, b + 1)
  }
  if(cljs.core.truth_("\ufdd0'else")) {
    throw Error(cljs.core.str.call(null, "Doesn't support name: ", a));
  }
  return null
};
cljs.core.namespace = function(a) {
  if(cljs.core.truth_(function() {
    var b = cljs.core.keyword_QMARK_.call(null, a);
    return cljs.core.truth_(b) ? b : cljs.core.symbol_QMARK_.call(null, a)
  }())) {
    var b = a.lastIndexOf("/");
    return cljs.core.truth_(-1 < b) ? cljs.core.subs.call(null, a, 2, b) : null
  }
  throw Error(cljs.core.str.call(null, "Doesn't support namespace: ", a));
};
cljs.core.zipmap = function(a, b) {
  for(var c = cljs.core.ObjMap.fromObject([], {}), d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return cljs.core.truth_(a) ? e : a
    }())) {
      var c = cljs.core.assoc.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), f = cljs.core.next.call(null, d), g = cljs.core.next.call(null, e), d = f, e = g
    }else {
      return c
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), h)
    }, d = function(a, d, g, h) {
      var i = null;
      goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, i)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, d, g, h, a)
    };
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 2:
        return d;
      case 3:
        return cljs.core.truth_(a.call(null, d) > a.call(null, e)) ? d : e;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.min_key = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), h)
    }, d = function(a, d, g, h) {
      var i = null;
      goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, i)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, d, g, h, a)
    };
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 2:
        return d;
      case 3:
        return cljs.core.truth_(a.call(null, d) < a.call(null, e)) ? d : e;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, e);
      return cljs.core.truth_(f) ? cljs.core.cons.call(null, cljs.core.take.call(null, b, f), a.call(null, b, d, cljs.core.drop.call(null, d, f))) : null
    })
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(null, c, c, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return cljs.core.truth_(d) ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, d))) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_while.call(null, b, cljs.core.rest.call(null, d))) : null : null
  })
};
cljs.core.Range = function(a, b, c, d) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d
};
cljs.core.Range.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Range")
};
cljs.core.Range.prototype.cljs$core$IHash$ = !0;
cljs.core.Range.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Range.prototype.cljs$core$ISequential$ = !0;
cljs.core.Range.prototype.cljs$core$ICollection$ = !0;
cljs.core.Range.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = !0;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, b);
      case 3:
        return cljs.core.ci_reduce.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Range.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq = function(a) {
  var b = cljs.core.truth_(0 < this.step) ? cljs.core._LT_ : cljs.core._GT_;
  return cljs.core.truth_(b.call(null, this.start, this.end)) ? a : null
};
cljs.core.Range.prototype.cljs$core$ICounted$ = !0;
cljs.core.Range.prototype.cljs$core$ICounted$_count = function(a) {
  return cljs.core.truth_(cljs.core.not.call(null, cljs.core._seq.call(null, a))) ? 0 : Math.ceil.call(null, (this.end - this.start) / this.step)
};
cljs.core.Range.prototype.cljs$core$ISeq$ = !0;
cljs.core.Range.prototype.cljs$core$ISeq$_first = function() {
  return this.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest = function(a) {
  return cljs.core.truth_(cljs.core._seq.call(null, a)) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step) : cljs.core.list.call(null)
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = !0;
cljs.core.Range.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth = function() {
  var a = function(a, b) {
    var e = this;
    if(cljs.core.truth_(b < cljs.core._count.call(null, a))) {
      return e.start + b * e.step
    }
    if(cljs.core.truth_(function() {
      var a = e.start > e.end;
      return cljs.core.truth_(a) ? cljs.core._EQ_.call(null, e.step, 0) : a
    }())) {
      return e.start
    }
    throw Error("Index out of bounds");
  }, b = function(a, b, e) {
    var f = this;
    return cljs.core.truth_(b < cljs.core._count.call(null, a)) ? f.start + b * f.step : cljs.core.truth_(function() {
      var a = f.start > f.end;
      return cljs.core.truth_(a) ? cljs.core._EQ_.call(null, f.step, 0) : a
    }()) ? f.start : e
  };
  return function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(this, c, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.Range;
cljs.core.range = function() {
  var a = null;
  return a = function(b, c, d) {
    switch(arguments.length) {
      case 0:
        return a.call(null, 0, Number.MAX_VALUE, 1);
      case 1:
        return a.call(null, 0, b, 1);
      case 2:
        return a.call(null, b, c, 1);
      case 3:
        return new cljs.core.Range(null, b, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_nth.call(null, b, cljs.core.drop.call(null, b, d))) : null
  })
};
cljs.core.split_with = function(a, b) {
  return cljs.core.Vector.fromArray([cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)])
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), f = b.call(null, e), e = cljs.core.cons.call(null, e, cljs.core.take_while.call(null, function(c) {
        return cljs.core._EQ_.call(null, f, b.call(null, c))
      }, cljs.core.next.call(null, d)));
      return cljs.core.cons.call(null, e, partition_by.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, e), d))))
    }
    return null
  })
};
cljs.core.frequencies = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc.call(null, a, c, cljs.core.get.call(null, a, c, 0) + 1)
  }, cljs.core.ObjMap.fromObject([], {}), a)
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, c);
      return cljs.core.truth_(f) ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core.list.call(null, b.call(null))
    })
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null
    }))
  };
  return a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var b = function(b, c, d, e) {
          var g = null;
          goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, b, c, d, g))
        };
        b.cljs$lang$maxFixedArity = 3;
        b.cljs$lang$applyTo = function(b) {
          var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, b))
        };
        return b
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, b));
          case 2:
            return cljs.core.vector.call(null, a.call(null, b, d));
          case 3:
            return cljs.core.vector.call(null, a.call(null, b, d, e));
          default:
            return c.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, h), cljs.core.apply.call(null, b, c, d, e, h))
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), c = function(c, e, h, l) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, c), b.call(null, c));
          case 2:
            return cljs.core.vector.call(null, a.call(null, c, e), b.call(null, c, e));
          case 3:
            return cljs.core.vector.call(null, a.call(null, c, e, h), b.call(null, c, e, h));
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, i, j) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, d, e, i, j), cljs.core.apply.call(null, b, d, e, i, j), cljs.core.apply.call(null, c, d, e, i, j))
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), d = function(d, i, l, o) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null), c.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, d), b.call(null, d), c.call(null, d));
          case 2:
            return cljs.core.vector.call(null, a.call(null, d, i), b.call(null, d, i), c.call(null, d, i));
          case 3:
            return cljs.core.vector.call(null, a.call(null, d, i, l), b.call(null, d, i, l), c.call(null, d, i, l));
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function() {
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null))
          }, cljs.core.Vector.fromArray([]), e)
        }, c = function(a) {
          return cljs.core.reduce.call(null, function(b, c) {
            return cljs.core.conj.call(null, b, c.call(null, a))
          }, cljs.core.Vector.fromArray([]), e)
        }, d = function(a, b) {
          return cljs.core.reduce.call(null, function(c, d) {
            return cljs.core.conj.call(null, c, d.call(null, a, b))
          }, cljs.core.Vector.fromArray([]), e)
        }, f = function(a, b, c) {
          return cljs.core.reduce.call(null, function(d, e) {
            return cljs.core.conj.call(null, d, e.call(null, a, b, c))
          }, cljs.core.Vector.fromArray([]), e)
        }, g = function() {
          var a = function(a, b, c, d) {
            return cljs.core.reduce.call(null, function(e, f) {
              return cljs.core.conj.call(null, e, cljs.core.apply.call(null, f, a, b, c, d))
            }, cljs.core.Vector.fromArray([]), e)
          }, b = function(b, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return a.call(this, b, c, d, f)
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = function(b) {
            var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
            return a.call(this, c, d, e, b)
          };
          return b
        }(), a = function(a, e, h, i) {
          switch(arguments.length) {
            case 0:
              return b.call(this);
            case 1:
              return c.call(this, a);
            case 2:
              return d.call(this, a, e);
            case 3:
              return f.call(this, a, e, h);
            default:
              return g.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = g.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.dorun = function() {
  var a = function(a, c) {
    for(;;) {
      if(cljs.core.truth_(function() {
        var d = cljs.core.seq.call(null, c);
        return cljs.core.truth_(d) ? 0 < a : d
      }())) {
        var d = a - 1, e = cljs.core.next.call(null, c), a = d, c = e
      }else {
        return null
      }
    }
  };
  return function(b, c) {
    switch(arguments.length) {
      case 1:
        var d;
        a: {
          for(var e = b;;) {
            if(cljs.core.truth_(cljs.core.seq.call(null, e))) {
              e = cljs.core.next.call(null, e)
            }else {
              d = null;
              break a
            }
          }
        }
        return d;
      case 2:
        return a.call(this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.doall = function() {
  return function(a, b) {
    switch(arguments.length) {
      case 1:
        return cljs.core.dorun.call(null, a), a;
      case 2:
        return cljs.core.dorun.call(null, a, b), b
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b)) ? cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, c), 1)) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return cljs.core.truth_(null === c) ? null : cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, c), 1)) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c)
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.truth_(cljs.core.coll_QMARK_.call(null, d)) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, e + cljs.core.count.call(null, f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, !1, function() {
    return cljs.core.cons.call(null, d, re_seq.call(null, b, g))
  }) : null
};
cljs.core.re_pattern = function(a) {
  var b = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.call(null, b, 0, null);
  a = cljs.core.nth.call(null, b, 1, null);
  b = cljs.core.nth.call(null, b, 2, null);
  return RegExp(b, a)
};
cljs.core.pr_sequential = function(a, b, c, d, e, f) {
  return cljs.core.concat.call(null, cljs.core.Vector.fromArray([b]), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.Vector.fromArray([c]), cljs.core.map.call(null, function(b) {
    return a.call(null, b, e)
  }, f))), cljs.core.Vector.fromArray([d]))
};
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null
};
cljs.core.flush = function() {
  return null
};
cljs.core.pr_seq = function pr_seq(b, c) {
  return cljs.core.truth_(null === b) ? cljs.core.list.call(null, "nil") : cljs.core.truth_(void 0 === b) ? cljs.core.list.call(null, "#<undefined>") : cljs.core.truth_("\ufdd0'else") ? cljs.core.concat.call(null, cljs.core.truth_(function() {
    var d = cljs.core.get.call(null, c, "\ufdd0'meta");
    return cljs.core.truth_(d) ? (d = function() {
      return cljs.core.truth_(function() {
        if(cljs.core.truth_(b)) {
          var c = b.cljs$core$IMeta$;
          return cljs.core.truth_(c) ? cljs.core.not.call(null, b.hasOwnProperty("cljs$core$IMeta$")) : c
        }
        return b
      }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b)
    }(), cljs.core.truth_(d) ? cljs.core.meta.call(null, b) : d) : d
  }()) ? cljs.core.concat.call(null, cljs.core.Vector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta.call(null, b), c), cljs.core.Vector.fromArray([" "])) : null, cljs.core.truth_(function() {
    return cljs.core.truth_(function() {
      if(cljs.core.truth_(b)) {
        var c = b.cljs$core$IPrintable$;
        return cljs.core.truth_(c) ? cljs.core.not.call(null, b.hasOwnProperty("cljs$core$IPrintable$")) : c
      }
      return b
    }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, b)
  }()) ? cljs.core._pr_seq.call(null, b, c) : cljs.core.list.call(null, "#<", cljs.core.str.call(null, b), ">")) : null
};
cljs.core.pr_str_with_opts = function(a, b) {
  var c = cljs.core.first.call(null, a), d = new goog.string.StringBuffer, e = cljs.core.seq.call(null, a);
  if(cljs.core.truth_(e)) {
    for(var f = cljs.core.first.call(null, e);;) {
      cljs.core.truth_(f === c) || d.append(" ");
      var g = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, f, b));
      if(cljs.core.truth_(g)) {
        for(f = cljs.core.first.call(null, g);;) {
          if(d.append(f), f = cljs.core.next.call(null, g), cljs.core.truth_(f)) {
            g = f, f = cljs.core.first.call(null, g)
          }else {
            break
          }
        }
      }
      e = cljs.core.next.call(null, e);
      if(cljs.core.truth_(e)) {
        f = e, e = cljs.core.first.call(null, f), g = f, f = e, e = g
      }else {
        break
      }
    }
  }
  return cljs.core.str.call(null, d)
};
cljs.core.pr_with_opts = function(a, b) {
  var c = cljs.core.first.call(null, a), d = cljs.core.seq.call(null, a);
  if(cljs.core.truth_(d)) {
    for(var e = cljs.core.first.call(null, d);;) {
      cljs.core.truth_(e === c) || cljs.core.string_print.call(null, " ");
      var f = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, e, b));
      if(cljs.core.truth_(f)) {
        for(e = cljs.core.first.call(null, f);;) {
          if(cljs.core.string_print.call(null, e), e = cljs.core.next.call(null, f), cljs.core.truth_(e)) {
            f = e, e = cljs.core.first.call(null, f)
          }else {
            break
          }
        }
      }
      d = cljs.core.next.call(null, d);
      if(cljs.core.truth_(d)) {
        e = d, d = cljs.core.first.call(null, e), f = e, e = d, d = f
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core.get.call(null, a, "\ufdd0'flush-on-newline")) ? cljs.core.flush.call(null) : null
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core.pr_opts = function() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0'readably":cljs.core._STAR_print_readably_STAR_, "\ufdd0'meta":cljs.core._STAR_print_meta_STAR_, "\ufdd0'dup":cljs.core._STAR_print_dup_STAR_})
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.IPrintable.number = !0;
cljs.core._pr_seq.number = function(a) {
  return cljs.core.list.call(null, cljs.core.str.call(null, a))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable["boolean"] = !0;
cljs.core._pr_seq["boolean"] = function(a) {
  return cljs.core.list.call(null, cljs.core.str.call(null, a))
};
cljs.core.Set.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Set.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", b, a)
};
cljs.core.IPrintable.string = !0;
cljs.core._pr_seq.string = function(a, b) {
  return cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, a)) ? cljs.core.list.call(null, cljs.core.str.call(null, ":", function() {
    var b = cljs.core.namespace.call(null, a);
    return cljs.core.truth_(b) ? cljs.core.str.call(null, b, "/") : null
  }(), cljs.core.name.call(null, a))) : cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, a)) ? cljs.core.list.call(null, cljs.core.str.call(null, function() {
    var b = cljs.core.namespace.call(null, a);
    return cljs.core.truth_(b) ? cljs.core.str.call(null, b, "/") : null
  }(), cljs.core.name.call(null, a))) : cljs.core.truth_("\ufdd0'else") ? cljs.core.list.call(null, cljs.core.truth_("\ufdd0'readably".call(null, b)) ? goog.string.quote.call(null, a) : a) : null
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = !0;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable.array = !0;
cljs.core._pr_seq.array = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#<Array [", ", ", "]>", b, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable["function"] = !0;
cljs.core._pr_seq["function"] = function(a) {
  return cljs.core.list.call(null, "#<", cljs.core.str.call(null, a), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "()")
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d
};
cljs.core.Atom.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$ = !0;
cljs.core.Atom.prototype.cljs$core$IHash$_hash = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = !0;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches = function(a, b, c) {
  var d = cljs.core.seq.call(null, this.watches);
  if(cljs.core.truth_(d)) {
    var e = cljs.core.first.call(null, d);
    cljs.core.nth.call(null, e, 0, null);
    for(cljs.core.nth.call(null, e, 1, null);;) {
      var f = e, e = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      f.call(null, e, a, b, c);
      d = cljs.core.next.call(null, d);
      if(cljs.core.truth_(d)) {
        e = d, d = cljs.core.first.call(null, e), f = e, e = d, d = f
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch = function(a, b, c) {
  return a.watches = cljs.core.assoc.call(null, this.watches, b, c)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch = function(a, b) {
  return a.watches = cljs.core.dissoc.call(null, this.watches, b)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.concat.call(null, cljs.core.Vector.fromArray(["#<Atom: "]), cljs.core._pr_seq.call(null, this.state, b), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = !0;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = !0;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref = function() {
  return this.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return a === b
};
cljs.core.Atom;
cljs.core.atom = function() {
  var a = null, b = function() {
    var a = function(a, b) {
      var c = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, "\ufdd0'validator"), c = cljs.core.get.call(null, c, "\ufdd0'meta");
      return new cljs.core.Atom(a, c, d, null)
    }, b = function(b, d) {
      var g = null;
      goog.isDef(d) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, g)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), b = cljs.core.rest(b);
      return a.call(this, d, b)
    };
    return b
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return new cljs.core.Atom(a, null, null, null);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if(cljs.core.truth_(c) && !cljs.core.truth_(c.call(null, b))) {
    throw Error(cljs.core.str.call(null, "Assert failed: ", "Validator rejected reference state", "\n", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 3072)))));
  }
  c = a.state;
  a.state = b;
  cljs.core._notify_watches.call(null, a, c, b);
  return b
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c, g, h, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, g, h, j))
    };
    a.cljs$lang$maxFixedArity = 5;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), g = cljs.core.first(cljs.core.next(cljs.core.next(a))), h = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), i = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a))))), a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
      return cljs.core.reset_BANG_.call(null, b, cljs.core.apply.call(null, c, b.state, g, h, i, a))
    };
    return a
  }(), a = function(a, d, e, f, g, h) {
    switch(arguments.length) {
      case 2:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state));
      case 3:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state, e));
      case 4:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state, e, f));
      case 5:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state, e, f, g));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core.truth_(cljs.core._EQ_.call(null, a.state, b)) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a)
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b
};
cljs.core.get_validator = function(a) {
  return a.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, c, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.meta = cljs.core.apply.call(null, c, a.meta, e)
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
    return c.meta = cljs.core.apply.call(null, d, c.meta, a)
  };
  return a
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch.call(null, a, b, c)
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch.call(null, a, b)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null;
  return a = function(b) {
    switch(arguments.length) {
      case 0:
        return a.call(null, "G__");
      case 1:
        return cljs.core.truth_(null === cljs.core.gensym_counter) && (cljs.core.gensym_counter = cljs.core.atom.call(null, 0)), cljs.core.symbol.call(null, cljs.core.str.call(null, b, cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc)))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.f = a;
  this.state = b
};
cljs.core.Delay.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$ = !0;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_ = function() {
  return cljs.core.not.call(null, null === cljs.core.deref.call(null, this.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = !0;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref = function() {
  cljs.core.truth_(cljs.core.deref.call(null, this.state)) || cljs.core.swap_BANG_.call(null, this.state, this.f);
  return cljs.core.deref.call(null, this.state)
};
cljs.core.Delay;
cljs.core.delay = function() {
  var a = function(a) {
    return new cljs.core.Delay(function() {
      return cljs.core.apply.call(null, cljs.core.identity, a)
    }, cljs.core.atom.call(null, null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.delay_QMARK_ = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, a)
};
cljs.core.force = function(a) {
  return cljs.core.truth_(cljs.core.delay_QMARK_.call(null, a)) ? cljs.core.deref.call(null, a) : a
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a)
};
cljs.core.js__GT_clj = function() {
  var a = function(a, b) {
    var e = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, e = cljs.core.get.call(null, e, "\ufdd0'keywordize-keys"), f = cljs.core.truth_(e) ? cljs.core.keyword : cljs.core.str;
    return function h(a) {
      return cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.doall.call(null, cljs.core.map.call(null, h, a)) : cljs.core.truth_(cljs.core.coll_QMARK_.call(null, a)) ? cljs.core.into.call(null, cljs.core.empty.call(null, a), cljs.core.map.call(null, h, a)) : cljs.core.truth_(goog.isArray.call(null, a)) ? cljs.core.vec.call(null, cljs.core.map.call(null, h, a)) : cljs.core.truth_(goog.isObject.call(null, a)) ? cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), function() {
        return function k(b) {
          return new cljs.core.LazySeq(null, !1, function() {
            for(;;) {
              if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
                var c = cljs.core.first.call(null, b);
                return cljs.core.cons.call(null, cljs.core.Vector.fromArray([f.call(null, c), h.call(null, a[c])]), k.call(null, cljs.core.rest.call(null, b)))
              }
              return null
            }
          })
        }.call(null, cljs.core.js_keys.call(null, a))
      }()) : cljs.core.truth_("\ufdd0'else") ? a : null
    }.call(null, a)
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.call(null, cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var c = function(c) {
      var d = cljs.core.get.call(null, cljs.core.deref.call(null, b), c);
      if(cljs.core.truth_(d)) {
        return d
      }
      d = cljs.core.apply.call(null, a, c);
      cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d);
      return d
    }, d = function(a) {
      var b = null;
      goog.isDef(a) && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b)
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c.call(this, a)
    };
    return d
  }()
};
cljs.core.trampoline = function() {
  var a = null, b = function() {
    var b = function(b, c) {
      return a.call(null, function() {
        return cljs.core.apply.call(null, b, c)
      })
    }, d = function(a, d) {
      var g = null;
      goog.isDef(d) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, g)
    };
    d.cljs$lang$maxFixedArity = 1;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, d, a)
    };
    return d
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 1:
        var e;
        a: {
          for(var f = a;;) {
            if(f = f.call(null), !cljs.core.truth_(cljs.core.fn_QMARK_.call(null, f))) {
              e = f;
              break a
            }
          }
        }
        return e;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.rand = function() {
  var a = null;
  return a = function(b) {
    switch(arguments.length) {
      case 0:
        return a.call(null, 1);
      case 1:
        return Math.random() * b
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.rand_int = function(a) {
  return Math.floor(Math.random() * a)
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)))
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc.call(null, b, e, cljs.core.conj.call(null, cljs.core.get.call(null, b, e, cljs.core.Vector.fromArray([])), d))
  }, cljs.core.ObjMap.fromObject([], {}), b)
};
cljs.core.make_hierarchy = function() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'descendants":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'ancestors":cljs.core.ObjMap.fromObject([], {})})
};
cljs.core.global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, d, e) {
    var f = cljs.core._EQ_.call(null, d, e);
    if(cljs.core.truth_(f)) {
      return f
    }
    f = cljs.core.contains_QMARK_.call(null, "\ufdd0'ancestors".call(null, b).call(null, d), e);
    if(cljs.core.truth_(f)) {
      return f
    }
    f = cljs.core.vector_QMARK_.call(null, e);
    if(cljs.core.truth_(f)) {
      if(f = cljs.core.vector_QMARK_.call(null, d), cljs.core.truth_(f)) {
        if(f = cljs.core._EQ_.call(null, cljs.core.count.call(null, e), cljs.core.count.call(null, d)), cljs.core.truth_(f)) {
          for(var g = !0, h = 0;;) {
            if(cljs.core.truth_(function() {
              var a = cljs.core.not.call(null, g);
              return cljs.core.truth_(a) ? a : cljs.core._EQ_.call(null, h, cljs.core.count.call(null, e))
            }())) {
              return g
            }
            var f = a.call(null, b, d.call(null, h), e.call(null, h)), i = h + 1, g = f, h = i
          }
        }else {
          return f
        }
      }else {
        return f
      }
    }else {
      return f
    }
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), c, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.parents = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b);
      case 2:
        return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'parents".call(null, b), c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ancestors = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b);
      case 2:
        return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'ancestors".call(null, b), c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.descendants = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b);
      case 2:
        return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'descendants".call(null, b), c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.derive = function() {
  var a = null, b = function(a, b, e) {
    if(!cljs.core.truth_(cljs.core.not_EQ_.call(null, b, e))) {
      throw Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 3368)))));
    }
    var f = "\ufdd0'parents".call(null, a), g = "\ufdd0'descendants".call(null, a), h = "\ufdd0'ancestors".call(null, a), i = function(a, b, c, d, e) {
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, e, b, cljs.core.set([])), cljs.core.cons.call(null, d, e.call(null, d))))
      }, a, cljs.core.cons.call(null, b, c.call(null, b)))
    };
    if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, f.call(null, b), e))) {
      b = null
    }else {
      if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, h.call(null, b), e))) {
        throw Error(cljs.core.str.call(null, b, "already has", e, "as ancestor"));
      }
      if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, h.call(null, e), b))) {
        throw Error(cljs.core.str.call(null, "Cyclic derivation:", e, "has", b, "as ancestor"));
      }
      b = cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, "\ufdd0'parents".call(null, a), b, cljs.core.conj.call(null, cljs.core.get.call(null, f, b, cljs.core.set([])), e)), "\ufdd0'ancestors":i.call(null, "\ufdd0'ancestors".call(null, a), b, g, e, h), "\ufdd0'descendants":i.call(null, "\ufdd0'descendants".call(null, a), e, h, b, g)})
    }
    return cljs.core.truth_(b) ? b : a
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        if(!cljs.core.truth_(cljs.core.namespace.call(null, d))) {
          throw Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'namespace", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 3364)))));
        }
        cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, a, c, d);
        return null;
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.underive = function() {
  var a = null, b = function(a, b, e) {
    var f = "\ufdd0'parents".call(null, a), g = cljs.core.truth_(f.call(null, b)) ? cljs.core.disj.call(null, f.call(null, b), e) : cljs.core.set([]), g = cljs.core.truth_(cljs.core.not_empty.call(null, g)) ? cljs.core.assoc.call(null, f, b, g) : cljs.core.dissoc.call(null, f, b), g = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)))
    }, cljs.core.seq.call(null, g)));
    return cljs.core.truth_(cljs.core.contains_QMARK_.call(null, f.call(null, b), e)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.apply.call(null, cljs.core.derive, a, b)
    }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, g)) : a
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, a, c, d), null;
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function() {
    return cljs.core.deref.call(null, b)
  });
  return cljs.core.swap_BANG_.call(null, c, function() {
    return cljs.core.deref.call(null, d)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.call(null, c);;) {
      if(cljs.core.truth_(0 < cljs.core.count.call(null, e))) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }();
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.call(null, b);;) {
      if(cljs.core.truth_(0 < cljs.core.count.call(null, e))) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, e), c, d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }();
  return cljs.core.truth_(e) ? e : !1
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b)
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var i = cljs.core.reduce.call(null, function(d, e) {
    var g = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    if(cljs.core.truth_(cljs.core.isa_QMARK_.call(null, c, g))) {
      var h = cljs.core.truth_(function() {
        var b = null === d;
        return cljs.core.truth_(b) ? b : cljs.core.dominates.call(null, g, cljs.core.first.call(null, d), f)
      }()) ? e : d;
      if(!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, h), g, f))) {
        throw Error(cljs.core.str.call(null, "Multiple methods in multimethod '", b, "' match dispatch value: ", c, " -> ", g, " and ", cljs.core.first.call(null, h), ", and neither is preferred"));
      }
      return h
    }
    return d
  }, null, cljs.core.deref.call(null, e));
  if(cljs.core.truth_(i)) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d)))) {
      return cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, i)), cljs.core.second.call(null, i)
    }
    cljs.core.reset_cache.call(null, g, e, h, d);
    return find_and_cache_best_method.call(null, b, c, d, e, f, g, h)
  }
  return null
};
cljs.core.IMultiFn = {};
cljs.core._reset = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_reset : a)) {
    a = a.cljs$core$IMultiFn$_reset(a)
  }else {
    var b;
    b = cljs.core._reset[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._reset._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._add_method = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_add_method : a)) {
    a = a.cljs$core$IMultiFn$_add_method(a, b, c)
  }else {
    var d;
    d = cljs.core._add_method[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._add_method._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._remove_method = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_remove_method : a)) {
    c = a.cljs$core$IMultiFn$_remove_method(a, b)
  }else {
    c = cljs.core._remove_method[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._remove_method._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._prefer_method = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_prefer_method : a)) {
    a = a.cljs$core$IMultiFn$_prefer_method(a, b, c)
  }else {
    var d;
    d = cljs.core._prefer_method[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(d) && (d = cljs.core._prefer_method._, !cljs.core.truth_(d))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._get_method = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_get_method : a)) {
    c = a.cljs$core$IMultiFn$_get_method(a, b)
  }else {
    c = cljs.core._get_method[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._get_method._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._methods = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_methods : a)) {
    a = a.cljs$core$IMultiFn$_methods(a)
  }else {
    var b;
    b = cljs.core._methods[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._methods._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._prefers = function(a) {
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_prefers : a)) {
    a = a.cljs$core$IMultiFn$_prefers(a)
  }else {
    var b;
    b = cljs.core._prefers[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(b) && (b = cljs.core._prefers._, !cljs.core.truth_(b))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._dispatch = function(a, b) {
  var c;
  if(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMultiFn$_dispatch : a)) {
    c = a.cljs$core$IMultiFn$_dispatch(a, b)
  }else {
    c = cljs.core._dispatch[goog.typeOf.call(null, a)];
    if(!cljs.core.truth_(c) && (c = cljs.core._dispatch._, !cljs.core.truth_(c))) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core.do_dispatch = function(a, b, c) {
  b = cljs.core.apply.call(null, b, c);
  a = cljs.core._get_method.call(null, a, b);
  if(!cljs.core.truth_(a)) {
    throw Error(cljs.core.str.call(null, "No method in multimethod '", cljs.core.name, "' for dispatch value: ", b));
  }
  return cljs.core.apply.call(null, a, c)
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h
};
cljs.core.MultiFn.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$ = !0;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = !0;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function() {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this.method_cache, function() {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this.prefer_table, function() {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function() {
    return null
  });
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method = function(a, b) {
  cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy))) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  if(cljs.core.truth_(c)) {
    return c
  }
  c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw Error(cljs.core.str.call(null, "Preference conflict in multimethod '", this.name, "': ", c, " is already preferred to ", b));
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core.get.call(null, a, b, cljs.core.set([])), c))
  });
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods = function() {
  return cljs.core.deref.call(null, this.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers = function() {
  return cljs.core.deref.call(null, this.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch = function(a, b) {
  return cljs.core.do_dispatch.call(null, a, this.dispatch_fn, b)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, c) {
    var d = null;
    goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return cljs.core._dispatch.call(null, this, d)
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = function(a) {
    cljs.core.first(a);
    a = cljs.core.rest(a);
    return cljs.core._dispatch.call(null, this, a)
  };
  return a
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return cljs.core._dispatch.call(null, this, b)
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a)
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b)
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c)
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a)
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b)
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a)
};
var tempest = {levels:{}};
tempest.levels._STAR_default_line_length_STAR_ = 80;
tempest.levels._STAR_level1_lines_STAR_ = cljs.core.Vector.fromArray([cljs.core.Vector.fromArray([113, 225]), cljs.core.Vector.fromArray([99, 234]), cljs.core.Vector.fromArray([90, 243]), cljs.core.Vector.fromArray([84, 252]), cljs.core.Vector.fromArray([81, 261]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 270]), cljs.core.Vector.fromArray([81, 279]), cljs.core.Vector.fromArray([84, 288]), cljs.core.Vector.fromArray([90, 297]), cljs.core.Vector.fromArray([99, 306]), 
cljs.core.Vector.fromArray([113, 315])]);
tempest.levels._STAR_level1_segments_STAR_ = cljs.core.Vector.fromArray([cljs.core.Vector.fromArray([0, 1]), cljs.core.Vector.fromArray([1, 2]), cljs.core.Vector.fromArray([2, 3]), cljs.core.Vector.fromArray([3, 4]), cljs.core.Vector.fromArray([4, 5]), cljs.core.Vector.fromArray([5, 6]), cljs.core.Vector.fromArray([6, 7]), cljs.core.Vector.fromArray([7, 8]), cljs.core.Vector.fromArray([8, 9]), cljs.core.Vector.fromArray([9, 10])]);
tempest.levels._STAR_level1_STAR_ = cljs.core.ObjMap.fromObject(["\ufdd0'lines", "\ufdd0'segments", "\ufdd0'length-fn"], {"\ufdd0'lines":tempest.levels._STAR_level1_lines_STAR_, "\ufdd0'segments":tempest.levels._STAR_level1_segments_STAR_, "\ufdd0'length-fn":function(a) {
  return 4 * a
}});
tempest.levels._STAR_level2_lines_STAR_ = cljs.core.Vector.fromArray([cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 0]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 18]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 36]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 54]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 72]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 
90]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 108]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 126]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 144]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 162]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 180]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 198]), 
cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 216]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 234]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 252]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 270]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 288]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 306]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 
324]), cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 342])]);
tempest.levels._STAR_level2_segments_STAR_ = cljs.core.Vector.fromArray([cljs.core.Vector.fromArray([0, 1]), cljs.core.Vector.fromArray([1, 2]), cljs.core.Vector.fromArray([2, 3]), cljs.core.Vector.fromArray([3, 4]), cljs.core.Vector.fromArray([4, 5]), cljs.core.Vector.fromArray([5, 6]), cljs.core.Vector.fromArray([6, 7]), cljs.core.Vector.fromArray([7, 8]), cljs.core.Vector.fromArray([8, 9]), cljs.core.Vector.fromArray([9, 10]), cljs.core.Vector.fromArray([10, 11]), cljs.core.Vector.fromArray([11, 
12]), cljs.core.Vector.fromArray([12, 13]), cljs.core.Vector.fromArray([13, 14]), cljs.core.Vector.fromArray([14, 15]), cljs.core.Vector.fromArray([15, 16]), cljs.core.Vector.fromArray([16, 17]), cljs.core.Vector.fromArray([17, 18]), cljs.core.Vector.fromArray([18, 19]), cljs.core.Vector.fromArray([19, 0])]);
tempest.levels._STAR_level2_STAR_ = cljs.core.ObjMap.fromObject(["\ufdd0'lines", "\ufdd0'segments", "\ufdd0'length-fn"], {"\ufdd0'lines":tempest.levels._STAR_level2_lines_STAR_, "\ufdd0'segments":tempest.levels._STAR_level2_segments_STAR_, "\ufdd0'length-fn":function(a) {
  return 4 * a
}});
tempest.levels._STAR_levels_STAR_ = cljs.core.Vector.fromArray([cljs.core.ObjMap.fromObject(["\ufdd0'lines", "\ufdd0'segments", "\ufdd0'length-fn"], {"\ufdd0'lines":tempest.levels._STAR_level1_lines_STAR_, "\ufdd0'segments":tempest.levels._STAR_level1_segments_STAR_, "\ufdd0'length-fn":function(a) {
  return 4 * a
}}), cljs.core.ObjMap.fromObject(["\ufdd0'lines", "\ufdd0'segments", "\ufdd0'length-fn"], {"\ufdd0'lines":tempest.levels._STAR_level2_lines_STAR_, "\ufdd0'segments":tempest.levels._STAR_level2_segments_STAR_, "\ufdd0'length-fn":function(a) {
  return 4 * a
}})]);
tempest.polar_to_cartesian_coords = function() {
  return function(a, b) {
    switch(arguments.length) {
      case 1:
        var c = cljs.core.nth.call(null, a, 0, null), d = cljs.core.nth.call(null, a, 1, null);
        return cljs.core.Vector.fromArray([goog.math.angleDx.call(null, d, c), goog.math.angleDy.call(null, d, c)]);
      case 2:
        return d = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null), d = b.call(null, d), cljs.core.Vector.fromArray([goog.math.angleDx.call(null, c, d), goog.math.angleDy.call(null, c, d)])
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
tempest.rectangle_for_segment = function(a, b) {
  var c = cljs.core.get.call(null, "\ufdd0'segments".call(null, a), b), d = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null), d = cljs.core.get.call(null, "\ufdd0'lines".call(null, a), d), c = cljs.core.get.call(null, "\ufdd0'lines".call(null, a), c);
  return cljs.core.Vector.fromArray([tempest.polar_to_cartesian_coords.call(null, d), tempest.polar_to_cartesian_coords.call(null, d, "\ufdd0'length-fn".call(null, a)), tempest.polar_to_cartesian_coords.call(null, c, "\ufdd0'length-fn".call(null, a)), tempest.polar_to_cartesian_coords.call(null, c)])
};
tempest.point_to_canvas_coords = function(a, b) {
  var c = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, d = cljs.core.get.call(null, c, "\ufdd0'width"), c = cljs.core.get.call(null, c, "\ufdd0'height"), d = d / 2, c = c / 2;
  console.log(cljs.core.str.call(null, cljs.core.pr_str.call(null, b), "->", cljs.core.pr_str.call(null, cljs.core.Vector.fromArray([cljs.core.first.call(null, b) + d, c - cljs.core.last.call(null, b)]))));
  return cljs.core.Vector.fromArray([cljs.core.first.call(null, b) + d, c - cljs.core.last.call(null, b)])
};
tempest.rectangle_to_canvas_coords = function(a, b) {
  return cljs.core.map.call(null, function(b) {
    return tempest.point_to_canvas_coords.call(null, a, b)
  }, b)
};
tempest.rand_coord = function(a) {
  var b = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, a = cljs.core.get.call(null, b, "\ufdd0'width"), b = cljs.core.get.call(null, b, "\ufdd0'height");
  return cljs.core.Vector.fromArray([goog.math.randomInt.call(null, a), goog.math.randomInt.call(null, b)])
};
tempest.draw_random_line = function(a, b) {
  var c = tempest.rand_coord.call(null, b), d = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null), e = tempest.rand_coord.call(null, b), f = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null);
  a.moveTo(d, c);
  a.lineTo(f, e);
  return a.stroke()
};
tempest.draw_rectangle = function(a, b) {
  var c = cljs.core.nth.call(null, b, 0, null), d = cljs.core.nthnext.call(null, b, 1);
  console.log(cljs.core.str.call(null, "Points", cljs.core.pr_str.call(null, d)));
  console.log(cljs.core.str.call(null, "Move to: ", cljs.core.pr_str.call(null, c)));
  a.moveTo(cljs.core.first.call(null, c), cljs.core.last.call(null, c));
  var e = cljs.core.seq.call(null, d);
  if(cljs.core.truth_(e)) {
    for(d = cljs.core.first.call(null, e);;) {
      if(console.log(cljs.core.str.call(null, "Draw to: ", cljs.core.pr_str.call(null, d))), a.lineTo(cljs.core.first.call(null, d), cljs.core.last.call(null, d)), d = cljs.core.next.call(null, e), cljs.core.truth_(d)) {
        e = d, d = cljs.core.first.call(null, e)
      }else {
        break
      }
    }
  }
  a.lineTo(cljs.core.first.call(null, c), cljs.core.last.call(null, c));
  return a.stroke()
};
tempest.canvasDraw = function(a) {
  var b = goog.dom.getElement.call(null, "canv1"), c = b.getContext("2d");
  new goog.Timer(500);
  var b = cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":b.width, "\ufdd0'height":b.height}), a = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, parseInt.call(null, a) - 1), d = cljs.core.seq.call(null, cljs.core.range.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, a))));
  if(cljs.core.truth_(d)) {
    for(var e = cljs.core.first.call(null, d);;) {
      if(tempest.draw_rectangle.call(null, c, tempest.rectangle_to_canvas_coords.call(null, b, tempest.rectangle_for_segment.call(null, a, e))), e = cljs.core.next.call(null, d), cljs.core.truth_(e)) {
        d = e, e = cljs.core.first.call(null, d)
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
goog.exportSymbol("tempest.canvasDraw", tempest.canvasDraw);

