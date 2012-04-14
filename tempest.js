var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(name) {
  if(!COMPILED) {
    if(goog.getObjectByName(name) && !goog.implicitNamespaces_[name]) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    var namespace = name;
    while(namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name)
};
goog.setTestOnly = function(opt_message) {
  if(COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0])
  }
  for(var part;parts.length && (part = parts.shift());) {
    if(!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    }else {
      if(cur[part]) {
        cur = cur[part]
      }else {
        cur = cur[part] = {}
      }
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for(var part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for(var x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if(!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for(var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if(!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {}
      }
      deps.pathToNames[path][provide] = true
    }
    for(var j = 0;require = requires[j];j++) {
      if(!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
};
goog.require = function(rule) {
  if(!COMPILED) {
    if(goog.getObjectByName(rule)) {
      return
    }
    var path = goog.getPathFromDeps_(rule);
    if(path) {
      goog.included_[path] = true;
      goog.writeScripts_()
    }else {
      var errorMessage = "goog.require could not find: " + rule;
      if(goog.global.console) {
        goog.global.console["error"](errorMessage)
      }
      throw Error(errorMessage);
    }
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(var_args) {
  return arguments[0]
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
};
if(!COMPILED) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return
    }else {
      if(!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for(var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if(src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true
    }
  };
  goog.writeScriptTag_ = function(src) {
    if(goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if(path in deps.written) {
        return
      }
      if(path in deps.visited) {
        if(!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path)
        }
        return
      }
      deps.visited[path] = true;
      if(path in deps.requires) {
        for(var requireName in deps.requires[path]) {
          if(requireName in deps.nameToPath) {
            visitNode(deps.nameToPath[requireName])
          }else {
            if(!goog.getObjectByName(requireName)) {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if(!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path)
      }
    }
    for(var path in goog.included_) {
      if(!deps.written[path]) {
        visitNode(path)
      }
    }
    for(var i = 0;i < scripts.length;i++) {
      if(scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if(rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule]
    }else {
      return null
    }
  };
  goog.findBasePath_();
  if(!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js")
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  if(propName in object) {
    for(var key in object) {
      if(key == propName && Object.prototype.hasOwnProperty.call(object, propName)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(object, propName) {
  if(object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName)
  }else {
    return goog.propertyIsEnumerableCustom_(object, propName)
  }
};
goog.isDef = function(val) {
  return val !== undefined
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == "object" || type == "array" || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  if("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
Object.prototype.clone;
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  var context = selfObj || goog.global;
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(context, newArgs)
    }
  }else {
    return function() {
      return fn.apply(context, arguments)
    }
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if(Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_
  }else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for(var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  };
  var rename;
  if(goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts
  }else {
    rename = function(a) {
      return a
    }
  }
  if(opt_modifier) {
    return className + "-" + rename(opt_modifier)
  }else {
    return rename(className)
  }
};
goog.setCssNameMapping = function(mapping, style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = style
};
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for(var key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(new RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for(var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
};
goog.string.subs = function(str, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var replacement = String(arguments[i]).replace(/\$/g, "$$$$");
    str = str.replace(/\%s/, replacement)
  }
  return str
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str)
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str))
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str)
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str)
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str)
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str)
};
goog.string.isSpace = function(ch) {
  return ch == " "
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd"
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if(test1 < test2) {
    return-1
  }else {
    if(test1 == test2) {
      return 0
    }else {
      return 1
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if(str1 == str2) {
    return 0
  }
  if(!str1) {
    return-1
  }
  if(!str2) {
    return 1
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for(var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if(a != b) {
      var num1 = parseInt(a, 10);
      if(!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if(!isNaN(num2) && num1 - num2) {
          return num1 - num2
        }
      }
      return a < b ? -1 : 1
    }
  }
  if(tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length
  }
  return str1 < str2 ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(str) {
  str = String(str);
  if(!goog.string.encodeUriRegExp_.test(str)) {
    return encodeURIComponent(str)
  }
  return str
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if(opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(str)) {
      return str
    }
    if(str.indexOf("&") != -1) {
      str = str.replace(goog.string.amperRe_, "&amp;")
    }
    if(str.indexOf("<") != -1) {
      str = str.replace(goog.string.ltRe_, "&lt;")
    }
    if(str.indexOf(">") != -1) {
      str = str.replace(goog.string.gtRe_, "&gt;")
    }
    if(str.indexOf('"') != -1) {
      str = str.replace(goog.string.quotRe_, "&quot;")
    }
    return str
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(str) {
  if(goog.string.contains(str, "&")) {
    if("document" in goog.global && !goog.string.contains(str, "<")) {
      return goog.string.unescapeEntitiesUsingDom_(str)
    }else {
      return goog.string.unescapePureXmlEntities_(str)
    }
  }
  return str
};
goog.string.unescapeEntitiesUsingDom_ = function(str) {
  var el = goog.global["document"]["createElement"]("div");
  el["innerHTML"] = "<pre>x" + str + "</pre>";
  if(el["firstChild"][goog.string.NORMALIZE_FN_]) {
    el["firstChild"][goog.string.NORMALIZE_FN_]()
  }
  str = el["firstChild"]["firstChild"]["nodeValue"].slice(1);
  el["innerHTML"] = "";
  return goog.string.canonicalizeNewlines(str)
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if(!isNaN(n)) {
            return String.fromCharCode(n)
          }
        }
        return s
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml)
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for(var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if(str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1)
    }
  }
  return str
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(str.length > chars) {
    str = str.substring(0, chars - 3) + "..."
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(opt_trailingChars) {
    if(opt_trailingChars > chars) {
      opt_trailingChars = chars
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint)
  }else {
    if(str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos)
    }
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if(s.quote) {
    return s.quote()
  }else {
    var sb = ['"'];
    for(var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
    }
    sb.push('"');
    return sb.join("")
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for(var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i))
  }
  return sb.join("")
};
goog.string.escapeChar = function(c) {
  if(c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c]
  }
  if(c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c]
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if(cc > 31 && cc < 127) {
    rv = c
  }else {
    if(cc < 256) {
      rv = "\\x";
      if(cc < 16 || cc > 256) {
        rv += "0"
      }
    }else {
      rv = "\\u";
      if(cc < 4096) {
        rv += "0"
      }
    }
    rv += cc.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[c] = rv
};
goog.string.toMap = function(s) {
  var rv = {};
  for(var i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = true
  }
  return rv
};
goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if(index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength)
  }
  return resultStr
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "")
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "")
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string)
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if(index == -1) {
    index = s.length
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj)
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for(var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if(v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
    }while(order == 0)
  }
  return order
};
goog.string.compareElements_ = function(left, right) {
  if(left < right) {
    return-1
  }else {
    if(left > right) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for(var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_
  }
  return result
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if(num == 0 && goog.string.isEmpty(str)) {
    return NaN
  }
  return num
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(str) {
  return goog.string.toCamelCaseCache_[str] || (goog.string.toCamelCaseCache_[str] = String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(str) {
  return goog.string.toSelectorCaseCache_[str] || (goog.string.toSelectorCaseCache_[str] = String(str).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  this.stack = (new Error).stack || "";
  if(opt_msg) {
    this.message = String(opt_msg)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.string");
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if(givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs
  }else {
    if(defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs
    }
  }
  throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return condition
};
goog.asserts.fail = function(opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3))
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.NATIVE_ARRAY_PROTOTYPES = true;
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.indexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i < arr.length;i++) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if(fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex)
  }
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.lastIndexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i >= 0;i--) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;--i) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      var val = arr2[i];
      if(f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val
      }
    }
  }
  return res
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr)
    }
  }
  return res
};
goog.array.reduce = function(arr, f, val, opt_obj) {
  if(arr.reduce) {
    if(opt_obj) {
      return arr.reduce(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduce(f, val)
    }
  }
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.reduceRight = function(arr, f, val, opt_obj) {
  if(arr.reduceRight) {
    if(opt_obj) {
      return arr.reduceRight(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduceRight(f, val)
    }
  }
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true
    }
  }
  return false
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false
    }
  }
  return true
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;i--) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0
};
goog.array.clear = function(arr) {
  if(!goog.isArray(arr)) {
    for(var i = arr.length - 1;i >= 0;i--) {
      delete arr[i]
    }
  }
  arr.length = 0
};
goog.array.insert = function(arr, obj) {
  if(!goog.array.contains(arr, obj)) {
    arr.push(obj)
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj)
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if(arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj)
  }else {
    goog.array.insertAt(arr, obj, i)
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if(rv = i >= 0) {
    goog.array.removeAt(arr, i)
  }
  return rv
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if(i >= 0) {
    goog.array.removeAt(arr, i);
    return true
  }
  return false
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(arr) {
  if(goog.isArray(arr)) {
    return goog.array.concat(arr)
  }else {
    var rv = [];
    for(var i = 0, len = arr.length;i < len;i++) {
      rv[i] = arr[i]
    }
    return rv
  }
};
goog.array.toArray = function(object) {
  if(goog.isArray(object)) {
    return goog.array.concat(object)
  }
  return goog.array.clone(object)
};
goog.array.extend = function(arr1, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    var isArrayLike;
    if(goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && arr2.hasOwnProperty("callee")) {
      arr1.push.apply(arr1, arr2)
    }else {
      if(isArrayLike) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        for(var j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j]
        }
      }else {
        arr1.push(arr2)
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1))
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if(arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start)
  }else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end)
  }
};
goog.array.removeDuplicates = function(arr, opt_rv) {
  var returnArray = opt_rv || arr;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while(cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
    if(!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current
    }
  }
  returnArray.length = cursorInsert
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while(left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if(isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr)
    }else {
      compareResult = compareFn(opt_target, arr[middle])
    }
    if(compareResult > 0) {
      left = middle + 1
    }else {
      right = middle;
      found = !compareResult
    }
  }
  return found ? left : ~left
};
goog.array.sort = function(arr, opt_compareFn) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(arr, opt_compareFn || goog.array.defaultCompare)
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for(var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]}
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
  }
  goog.array.sort(arr, stableCompareFn);
  for(var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key])
  })
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for(var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if(compareResult > 0 || compareResult == 0 && opt_strict) {
      return false
    }
  }
  return true
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if(!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for(var i = 0;i < l;i++) {
    if(!equalsFn(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
};
goog.array.compare = function(arr1, arr2, opt_equalsFn) {
  return goog.array.equals(arr1, arr2, opt_equalsFn)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if(index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true
  }
  return false
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false
};
goog.array.bucket = function(array, sorter) {
  var buckets = {};
  for(var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter(value, i, array);
    if(goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value)
    }
  }
  return buckets
};
goog.array.repeat = function(value, n) {
  var array = [];
  for(var i = 0;i < n;i++) {
    array[i] = value
  }
  return array
};
goog.array.flatten = function(var_args) {
  var result = [];
  for(var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if(goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element))
    }else {
      result.push(element)
    }
  }
  return result
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if(array.length) {
    n %= array.length;
    if(n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n))
    }else {
      if(n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n))
      }
    }
  }
  return array
};
goog.array.zip = function(var_args) {
  if(!arguments.length) {
    return[]
  }
  var result = [];
  for(var i = 0;true;i++) {
    var value = [];
    for(var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if(i >= arr.length) {
        return result
      }
      value.push(arr[i])
    }
    result.push(value)
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for(var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp
  }
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for(var key in obj) {
    f.call(opt_obj, obj[key], key, obj)
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key]
    }
  }
  return res
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj)
  }
  return res
};
goog.object.some = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      return true
    }
  }
  return false
};
goog.object.every = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(!f.call(opt_obj, obj[key], key, obj)) {
      return false
    }
  }
  return true
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for(var key in obj) {
    rv++
  }
  return rv
};
goog.object.getAnyKey = function(obj) {
  for(var key in obj) {
    return key
  }
};
goog.object.getAnyValue = function(obj) {
  for(var key in obj) {
    return obj[key]
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val)
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = obj[key]
  }
  return res
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = key
  }
  return res
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for(var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if(!goog.isDef(obj)) {
      break
    }
  }
  return obj
};
goog.object.containsKey = function(obj, key) {
  return key in obj
};
goog.object.containsValue = function(obj, val) {
  for(var key in obj) {
    if(obj[key] == val) {
      return true
    }
  }
  return false
};
goog.object.findKey = function(obj, f, opt_this) {
  for(var key in obj) {
    if(f.call(opt_this, obj[key], key, obj)) {
      return key
    }
  }
  return undefined
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key]
};
goog.object.isEmpty = function(obj) {
  for(var key in obj) {
    return false
  }
  return true
};
goog.object.clear = function(obj) {
  for(var i in obj) {
    delete obj[i]
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if(rv = key in obj) {
    delete obj[key]
  }
  return rv
};
goog.object.add = function(obj, key, val) {
  if(key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val)
};
goog.object.get = function(obj, key, opt_val) {
  if(key in obj) {
    return obj[key]
  }
  return opt_val
};
goog.object.set = function(obj, key, value) {
  obj[key] = value
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value
};
goog.object.clone = function(obj) {
  var res = {};
  for(var key in obj) {
    res[key] = obj[key]
  }
  return res
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key])
    }
    return clone
  }
  return obj
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for(var key in obj) {
    transposed[obj[key]] = key
  }
  return transposed
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for(var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for(key in source) {
      target[key] = source[key]
    }
    for(var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if(Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for(var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1]
  }
  return rv
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var rv = {};
  for(var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true
  }
  return rv
};
goog.provide("goog.userAgent.jscript");
goog.require("goog.string");
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;
goog.userAgent.jscript.init_ = function() {
  var hasScriptEngine = "ScriptEngine" in goog.global;
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = hasScriptEngine && goog.global["ScriptEngine"]() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global["ScriptEngineMajorVersion"]() + "." + goog.global["ScriptEngineMinorVersion"]() + "." + goog.global["ScriptEngineBuildVersion"]() : "0"
};
if(!goog.userAgent.jscript.ASSUME_NO_JSCRIPT) {
  goog.userAgent.jscript.init_()
}
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(version) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, version) >= 0
};
goog.provide("goog.string.StringBuffer");
goog.require("goog.userAgent.jscript");
goog.string.StringBuffer = function(opt_a1, var_args) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  if(opt_a1 != null) {
    this.append.apply(this, arguments)
  }
};
goog.string.StringBuffer.prototype.set = function(s) {
  this.clear();
  this.append(s)
};
if(goog.userAgent.jscript.HAS_JSCRIPT) {
  goog.string.StringBuffer.prototype.bufferLength_ = 0;
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    if(opt_a2 == null) {
      this.buffer_[this.bufferLength_++] = a1
    }else {
      this.buffer_.push.apply(this.buffer_, arguments);
      this.bufferLength_ = this.buffer_.length
    }
    return this
  }
}else {
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    this.buffer_ += a1;
    if(opt_a2 != null) {
      for(var i = 1;i < arguments.length;i++) {
        this.buffer_ += arguments[i]
      }
    }
    return this
  }
}
goog.string.StringBuffer.prototype.clear = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    this.buffer_.length = 0;
    this.bufferLength_ = 0
  }else {
    this.buffer_ = ""
  }
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var str = this.buffer_.join("");
    this.clear();
    if(str) {
      this.append(str)
    }
    return str
  }else {
    return this.buffer_
  }
};
goog.provide("cljs.core");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
goog.require("goog.object");
goog.require("goog.array");
cljs.core._STAR_print_fn_STAR_ = function _STAR_print_fn_STAR_(_) {
  throw new Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.truth_ = function truth_(x) {
  return x != null && x !== false
};
cljs.core.type_satisfies_ = function type_satisfies_(p, x) {
  var or__3548__auto____81680 = p[goog.typeOf.call(null, x)];
  if(cljs.core.truth_(or__3548__auto____81680)) {
    return or__3548__auto____81680
  }else {
    var or__3548__auto____81681 = p["_"];
    if(cljs.core.truth_(or__3548__auto____81681)) {
      return or__3548__auto____81681
    }else {
      return false
    }
  }
};
cljs.core.is_proto_ = function is_proto_(x) {
  return x.constructor.prototype === x
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function missing_protocol(proto, obj) {
  return Error.call(null, "No protocol method " + proto + " defined for type " + goog.typeOf.call(null, obj) + ": " + obj)
};
cljs.core.aclone = function aclone(array_like) {
  return Array.prototype.slice.call(array_like)
};
cljs.core.array = function array(var_args) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.aget = function aget(array, i) {
  return array[i]
};
cljs.core.aset = function aset(array, i, val) {
  return array[i] = val
};
cljs.core.alength = function alength(array) {
  return array.length
};
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var _invoke = null;
  var _invoke__81745 = function(this$) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81682 = this$;
      if(cljs.core.truth_(and__3546__auto____81682)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81682
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$)
    }else {
      return function() {
        var or__3548__auto____81683 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81683)) {
          return or__3548__auto____81683
        }else {
          var or__3548__auto____81684 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81684)) {
            return or__3548__auto____81684
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__81746 = function(this$, a) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81685 = this$;
      if(cljs.core.truth_(and__3546__auto____81685)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81685
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a)
    }else {
      return function() {
        var or__3548__auto____81686 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81686)) {
          return or__3548__auto____81686
        }else {
          var or__3548__auto____81687 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81687)) {
            return or__3548__auto____81687
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__81747 = function(this$, a, b) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81688 = this$;
      if(cljs.core.truth_(and__3546__auto____81688)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81688
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b)
    }else {
      return function() {
        var or__3548__auto____81689 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81689)) {
          return or__3548__auto____81689
        }else {
          var or__3548__auto____81690 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81690)) {
            return or__3548__auto____81690
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__81748 = function(this$, a, b, c) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81691 = this$;
      if(cljs.core.truth_(and__3546__auto____81691)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81691
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c)
    }else {
      return function() {
        var or__3548__auto____81692 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81692)) {
          return or__3548__auto____81692
        }else {
          var or__3548__auto____81693 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81693)) {
            return or__3548__auto____81693
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__81749 = function(this$, a, b, c, d) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81694 = this$;
      if(cljs.core.truth_(and__3546__auto____81694)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81694
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d)
    }else {
      return function() {
        var or__3548__auto____81695 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81695)) {
          return or__3548__auto____81695
        }else {
          var or__3548__auto____81696 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81696)) {
            return or__3548__auto____81696
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__81750 = function(this$, a, b, c, d, e) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81697 = this$;
      if(cljs.core.truth_(and__3546__auto____81697)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81697
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e)
    }else {
      return function() {
        var or__3548__auto____81698 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81698)) {
          return or__3548__auto____81698
        }else {
          var or__3548__auto____81699 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81699)) {
            return or__3548__auto____81699
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__81751 = function(this$, a, b, c, d, e, f) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81700 = this$;
      if(cljs.core.truth_(and__3546__auto____81700)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81700
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f)
    }else {
      return function() {
        var or__3548__auto____81701 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81701)) {
          return or__3548__auto____81701
        }else {
          var or__3548__auto____81702 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81702)) {
            return or__3548__auto____81702
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__81752 = function(this$, a, b, c, d, e, f, g) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81703 = this$;
      if(cljs.core.truth_(and__3546__auto____81703)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81703
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g)
    }else {
      return function() {
        var or__3548__auto____81704 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81704)) {
          return or__3548__auto____81704
        }else {
          var or__3548__auto____81705 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81705)) {
            return or__3548__auto____81705
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__81753 = function(this$, a, b, c, d, e, f, g, h) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81706 = this$;
      if(cljs.core.truth_(and__3546__auto____81706)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81706
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h)
    }else {
      return function() {
        var or__3548__auto____81707 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81707)) {
          return or__3548__auto____81707
        }else {
          var or__3548__auto____81708 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81708)) {
            return or__3548__auto____81708
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__81754 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81709 = this$;
      if(cljs.core.truth_(and__3546__auto____81709)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81709
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i)
    }else {
      return function() {
        var or__3548__auto____81710 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81710)) {
          return or__3548__auto____81710
        }else {
          var or__3548__auto____81711 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81711)) {
            return or__3548__auto____81711
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__81755 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81712 = this$;
      if(cljs.core.truth_(and__3546__auto____81712)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81712
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      return function() {
        var or__3548__auto____81713 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81713)) {
          return or__3548__auto____81713
        }else {
          var or__3548__auto____81714 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81714)) {
            return or__3548__auto____81714
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__81756 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81715 = this$;
      if(cljs.core.truth_(and__3546__auto____81715)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81715
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      return function() {
        var or__3548__auto____81716 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81716)) {
          return or__3548__auto____81716
        }else {
          var or__3548__auto____81717 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81717)) {
            return or__3548__auto____81717
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__81757 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81718 = this$;
      if(cljs.core.truth_(and__3546__auto____81718)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81718
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      return function() {
        var or__3548__auto____81719 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81719)) {
          return or__3548__auto____81719
        }else {
          var or__3548__auto____81720 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81720)) {
            return or__3548__auto____81720
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__81758 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81721 = this$;
      if(cljs.core.truth_(and__3546__auto____81721)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81721
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      return function() {
        var or__3548__auto____81722 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81722)) {
          return or__3548__auto____81722
        }else {
          var or__3548__auto____81723 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81723)) {
            return or__3548__auto____81723
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__81759 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81724 = this$;
      if(cljs.core.truth_(and__3546__auto____81724)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81724
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      return function() {
        var or__3548__auto____81725 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81725)) {
          return or__3548__auto____81725
        }else {
          var or__3548__auto____81726 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81726)) {
            return or__3548__auto____81726
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__81760 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81727 = this$;
      if(cljs.core.truth_(and__3546__auto____81727)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81727
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      return function() {
        var or__3548__auto____81728 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81728)) {
          return or__3548__auto____81728
        }else {
          var or__3548__auto____81729 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81729)) {
            return or__3548__auto____81729
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__81761 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81730 = this$;
      if(cljs.core.truth_(and__3546__auto____81730)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81730
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      return function() {
        var or__3548__auto____81731 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81731)) {
          return or__3548__auto____81731
        }else {
          var or__3548__auto____81732 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81732)) {
            return or__3548__auto____81732
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__81762 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81733 = this$;
      if(cljs.core.truth_(and__3546__auto____81733)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81733
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      return function() {
        var or__3548__auto____81734 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81734)) {
          return or__3548__auto____81734
        }else {
          var or__3548__auto____81735 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81735)) {
            return or__3548__auto____81735
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__81763 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81736 = this$;
      if(cljs.core.truth_(and__3546__auto____81736)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81736
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      return function() {
        var or__3548__auto____81737 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81737)) {
          return or__3548__auto____81737
        }else {
          var or__3548__auto____81738 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81738)) {
            return or__3548__auto____81738
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__81764 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81739 = this$;
      if(cljs.core.truth_(and__3546__auto____81739)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81739
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      return function() {
        var or__3548__auto____81740 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81740)) {
          return or__3548__auto____81740
        }else {
          var or__3548__auto____81741 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81741)) {
            return or__3548__auto____81741
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__81765 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81742 = this$;
      if(cljs.core.truth_(and__3546__auto____81742)) {
        return this$.cljs$core$IFn$_invoke
      }else {
        return and__3546__auto____81742
      }
    }())) {
      return this$.cljs$core$IFn$_invoke(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      return function() {
        var or__3548__auto____81743 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____81743)) {
          return or__3548__auto____81743
        }else {
          var or__3548__auto____81744 = cljs.core._invoke["_"];
          if(cljs.core.truth_(or__3548__auto____81744)) {
            return or__3548__auto____81744
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
  };
  _invoke = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    switch(arguments.length) {
      case 1:
        return _invoke__81745.call(this, this$);
      case 2:
        return _invoke__81746.call(this, this$, a);
      case 3:
        return _invoke__81747.call(this, this$, a, b);
      case 4:
        return _invoke__81748.call(this, this$, a, b, c);
      case 5:
        return _invoke__81749.call(this, this$, a, b, c, d);
      case 6:
        return _invoke__81750.call(this, this$, a, b, c, d, e);
      case 7:
        return _invoke__81751.call(this, this$, a, b, c, d, e, f);
      case 8:
        return _invoke__81752.call(this, this$, a, b, c, d, e, f, g);
      case 9:
        return _invoke__81753.call(this, this$, a, b, c, d, e, f, g, h);
      case 10:
        return _invoke__81754.call(this, this$, a, b, c, d, e, f, g, h, i);
      case 11:
        return _invoke__81755.call(this, this$, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return _invoke__81756.call(this, this$, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return _invoke__81757.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return _invoke__81758.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return _invoke__81759.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return _invoke__81760.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return _invoke__81761.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return _invoke__81762.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return _invoke__81763.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s);
      case 20:
        return _invoke__81764.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t);
      case 21:
        return _invoke__81765.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return _invoke
}();
cljs.core.ICounted = {};
cljs.core._count = function _count(coll) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81767 = coll;
    if(cljs.core.truth_(and__3546__auto____81767)) {
      return coll.cljs$core$ICounted$_count
    }else {
      return and__3546__auto____81767
    }
  }())) {
    return coll.cljs$core$ICounted$_count(coll)
  }else {
    return function() {
      var or__3548__auto____81768 = cljs.core._count[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81768)) {
        return or__3548__auto____81768
      }else {
        var or__3548__auto____81769 = cljs.core._count["_"];
        if(cljs.core.truth_(or__3548__auto____81769)) {
          return or__3548__auto____81769
        }else {
          throw cljs.core.missing_protocol.call(null, "ICounted.-count", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function _empty(coll) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81770 = coll;
    if(cljs.core.truth_(and__3546__auto____81770)) {
      return coll.cljs$core$IEmptyableCollection$_empty
    }else {
      return and__3546__auto____81770
    }
  }())) {
    return coll.cljs$core$IEmptyableCollection$_empty(coll)
  }else {
    return function() {
      var or__3548__auto____81771 = cljs.core._empty[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81771)) {
        return or__3548__auto____81771
      }else {
        var or__3548__auto____81772 = cljs.core._empty["_"];
        if(cljs.core.truth_(or__3548__auto____81772)) {
          return or__3548__auto____81772
        }else {
          throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ICollection = {};
cljs.core._conj = function _conj(coll, o) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81773 = coll;
    if(cljs.core.truth_(and__3546__auto____81773)) {
      return coll.cljs$core$ICollection$_conj
    }else {
      return and__3546__auto____81773
    }
  }())) {
    return coll.cljs$core$ICollection$_conj(coll, o)
  }else {
    return function() {
      var or__3548__auto____81774 = cljs.core._conj[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81774)) {
        return or__3548__auto____81774
      }else {
        var or__3548__auto____81775 = cljs.core._conj["_"];
        if(cljs.core.truth_(or__3548__auto____81775)) {
          return or__3548__auto____81775
        }else {
          throw cljs.core.missing_protocol.call(null, "ICollection.-conj", coll);
        }
      }
    }().call(null, coll, o)
  }
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var _nth = null;
  var _nth__81782 = function(coll, n) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81776 = coll;
      if(cljs.core.truth_(and__3546__auto____81776)) {
        return coll.cljs$core$IIndexed$_nth
      }else {
        return and__3546__auto____81776
      }
    }())) {
      return coll.cljs$core$IIndexed$_nth(coll, n)
    }else {
      return function() {
        var or__3548__auto____81777 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(cljs.core.truth_(or__3548__auto____81777)) {
          return or__3548__auto____81777
        }else {
          var or__3548__auto____81778 = cljs.core._nth["_"];
          if(cljs.core.truth_(or__3548__auto____81778)) {
            return or__3548__auto____81778
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__81783 = function(coll, n, not_found) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81779 = coll;
      if(cljs.core.truth_(and__3546__auto____81779)) {
        return coll.cljs$core$IIndexed$_nth
      }else {
        return and__3546__auto____81779
      }
    }())) {
      return coll.cljs$core$IIndexed$_nth(coll, n, not_found)
    }else {
      return function() {
        var or__3548__auto____81780 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(cljs.core.truth_(or__3548__auto____81780)) {
          return or__3548__auto____81780
        }else {
          var or__3548__auto____81781 = cljs.core._nth["_"];
          if(cljs.core.truth_(or__3548__auto____81781)) {
            return or__3548__auto____81781
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n, not_found)
    }
  };
  _nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return _nth__81782.call(this, coll, n);
      case 3:
        return _nth__81783.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return _nth
}();
cljs.core.ISeq = {};
cljs.core._first = function _first(coll) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81785 = coll;
    if(cljs.core.truth_(and__3546__auto____81785)) {
      return coll.cljs$core$ISeq$_first
    }else {
      return and__3546__auto____81785
    }
  }())) {
    return coll.cljs$core$ISeq$_first(coll)
  }else {
    return function() {
      var or__3548__auto____81786 = cljs.core._first[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81786)) {
        return or__3548__auto____81786
      }else {
        var or__3548__auto____81787 = cljs.core._first["_"];
        if(cljs.core.truth_(or__3548__auto____81787)) {
          return or__3548__auto____81787
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81788 = coll;
    if(cljs.core.truth_(and__3546__auto____81788)) {
      return coll.cljs$core$ISeq$_rest
    }else {
      return and__3546__auto____81788
    }
  }())) {
    return coll.cljs$core$ISeq$_rest(coll)
  }else {
    return function() {
      var or__3548__auto____81789 = cljs.core._rest[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81789)) {
        return or__3548__auto____81789
      }else {
        var or__3548__auto____81790 = cljs.core._rest["_"];
        if(cljs.core.truth_(or__3548__auto____81790)) {
          return or__3548__auto____81790
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-rest", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var _lookup = null;
  var _lookup__81797 = function(o, k) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81791 = o;
      if(cljs.core.truth_(and__3546__auto____81791)) {
        return o.cljs$core$ILookup$_lookup
      }else {
        return and__3546__auto____81791
      }
    }())) {
      return o.cljs$core$ILookup$_lookup(o, k)
    }else {
      return function() {
        var or__3548__auto____81792 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(cljs.core.truth_(or__3548__auto____81792)) {
          return or__3548__auto____81792
        }else {
          var or__3548__auto____81793 = cljs.core._lookup["_"];
          if(cljs.core.truth_(or__3548__auto____81793)) {
            return or__3548__auto____81793
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__81798 = function(o, k, not_found) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81794 = o;
      if(cljs.core.truth_(and__3546__auto____81794)) {
        return o.cljs$core$ILookup$_lookup
      }else {
        return and__3546__auto____81794
      }
    }())) {
      return o.cljs$core$ILookup$_lookup(o, k, not_found)
    }else {
      return function() {
        var or__3548__auto____81795 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(cljs.core.truth_(or__3548__auto____81795)) {
          return or__3548__auto____81795
        }else {
          var or__3548__auto____81796 = cljs.core._lookup["_"];
          if(cljs.core.truth_(or__3548__auto____81796)) {
            return or__3548__auto____81796
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k, not_found)
    }
  };
  _lookup = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return _lookup__81797.call(this, o, k);
      case 3:
        return _lookup__81798.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return _lookup
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function _contains_key_QMARK_(coll, k) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81800 = coll;
    if(cljs.core.truth_(and__3546__auto____81800)) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK_
    }else {
      return and__3546__auto____81800
    }
  }())) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK_(coll, k)
  }else {
    return function() {
      var or__3548__auto____81801 = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81801)) {
        return or__3548__auto____81801
      }else {
        var or__3548__auto____81802 = cljs.core._contains_key_QMARK_["_"];
        if(cljs.core.truth_(or__3548__auto____81802)) {
          return or__3548__auto____81802
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81803 = coll;
    if(cljs.core.truth_(and__3546__auto____81803)) {
      return coll.cljs$core$IAssociative$_assoc
    }else {
      return and__3546__auto____81803
    }
  }())) {
    return coll.cljs$core$IAssociative$_assoc(coll, k, v)
  }else {
    return function() {
      var or__3548__auto____81804 = cljs.core._assoc[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81804)) {
        return or__3548__auto____81804
      }else {
        var or__3548__auto____81805 = cljs.core._assoc["_"];
        if(cljs.core.truth_(or__3548__auto____81805)) {
          return or__3548__auto____81805
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", coll);
        }
      }
    }().call(null, coll, k, v)
  }
};
cljs.core.IMap = {};
cljs.core._dissoc = function _dissoc(coll, k) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81806 = coll;
    if(cljs.core.truth_(and__3546__auto____81806)) {
      return coll.cljs$core$IMap$_dissoc
    }else {
      return and__3546__auto____81806
    }
  }())) {
    return coll.cljs$core$IMap$_dissoc(coll, k)
  }else {
    return function() {
      var or__3548__auto____81807 = cljs.core._dissoc[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81807)) {
        return or__3548__auto____81807
      }else {
        var or__3548__auto____81808 = cljs.core._dissoc["_"];
        if(cljs.core.truth_(or__3548__auto____81808)) {
          return or__3548__auto____81808
        }else {
          throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core.ISet = {};
cljs.core._disjoin = function _disjoin(coll, v) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81809 = coll;
    if(cljs.core.truth_(and__3546__auto____81809)) {
      return coll.cljs$core$ISet$_disjoin
    }else {
      return and__3546__auto____81809
    }
  }())) {
    return coll.cljs$core$ISet$_disjoin(coll, v)
  }else {
    return function() {
      var or__3548__auto____81810 = cljs.core._disjoin[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81810)) {
        return or__3548__auto____81810
      }else {
        var or__3548__auto____81811 = cljs.core._disjoin["_"];
        if(cljs.core.truth_(or__3548__auto____81811)) {
          return or__3548__auto____81811
        }else {
          throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", coll);
        }
      }
    }().call(null, coll, v)
  }
};
cljs.core.IStack = {};
cljs.core._peek = function _peek(coll) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81812 = coll;
    if(cljs.core.truth_(and__3546__auto____81812)) {
      return coll.cljs$core$IStack$_peek
    }else {
      return and__3546__auto____81812
    }
  }())) {
    return coll.cljs$core$IStack$_peek(coll)
  }else {
    return function() {
      var or__3548__auto____81813 = cljs.core._peek[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81813)) {
        return or__3548__auto____81813
      }else {
        var or__3548__auto____81814 = cljs.core._peek["_"];
        if(cljs.core.truth_(or__3548__auto____81814)) {
          return or__3548__auto____81814
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81815 = coll;
    if(cljs.core.truth_(and__3546__auto____81815)) {
      return coll.cljs$core$IStack$_pop
    }else {
      return and__3546__auto____81815
    }
  }())) {
    return coll.cljs$core$IStack$_pop(coll)
  }else {
    return function() {
      var or__3548__auto____81816 = cljs.core._pop[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81816)) {
        return or__3548__auto____81816
      }else {
        var or__3548__auto____81817 = cljs.core._pop["_"];
        if(cljs.core.truth_(or__3548__auto____81817)) {
          return or__3548__auto____81817
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-pop", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core.IVector = {};
cljs.core._assoc_n = function _assoc_n(coll, n, val) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81818 = coll;
    if(cljs.core.truth_(and__3546__auto____81818)) {
      return coll.cljs$core$IVector$_assoc_n
    }else {
      return and__3546__auto____81818
    }
  }())) {
    return coll.cljs$core$IVector$_assoc_n(coll, n, val)
  }else {
    return function() {
      var or__3548__auto____81819 = cljs.core._assoc_n[goog.typeOf.call(null, coll)];
      if(cljs.core.truth_(or__3548__auto____81819)) {
        return or__3548__auto____81819
      }else {
        var or__3548__auto____81820 = cljs.core._assoc_n["_"];
        if(cljs.core.truth_(or__3548__auto____81820)) {
          return or__3548__auto____81820
        }else {
          throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", coll);
        }
      }
    }().call(null, coll, n, val)
  }
};
cljs.core.IDeref = {};
cljs.core._deref = function _deref(o) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81821 = o;
    if(cljs.core.truth_(and__3546__auto____81821)) {
      return o.cljs$core$IDeref$_deref
    }else {
      return and__3546__auto____81821
    }
  }())) {
    return o.cljs$core$IDeref$_deref(o)
  }else {
    return function() {
      var or__3548__auto____81822 = cljs.core._deref[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81822)) {
        return or__3548__auto____81822
      }else {
        var or__3548__auto____81823 = cljs.core._deref["_"];
        if(cljs.core.truth_(or__3548__auto____81823)) {
          return or__3548__auto____81823
        }else {
          throw cljs.core.missing_protocol.call(null, "IDeref.-deref", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function _deref_with_timeout(o, msec, timeout_val) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81824 = o;
    if(cljs.core.truth_(and__3546__auto____81824)) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout
    }else {
      return and__3546__auto____81824
    }
  }())) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout(o, msec, timeout_val)
  }else {
    return function() {
      var or__3548__auto____81825 = cljs.core._deref_with_timeout[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81825)) {
        return or__3548__auto____81825
      }else {
        var or__3548__auto____81826 = cljs.core._deref_with_timeout["_"];
        if(cljs.core.truth_(or__3548__auto____81826)) {
          return or__3548__auto____81826
        }else {
          throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", o);
        }
      }
    }().call(null, o, msec, timeout_val)
  }
};
cljs.core.IMeta = {};
cljs.core._meta = function _meta(o) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81827 = o;
    if(cljs.core.truth_(and__3546__auto____81827)) {
      return o.cljs$core$IMeta$_meta
    }else {
      return and__3546__auto____81827
    }
  }())) {
    return o.cljs$core$IMeta$_meta(o)
  }else {
    return function() {
      var or__3548__auto____81828 = cljs.core._meta[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81828)) {
        return or__3548__auto____81828
      }else {
        var or__3548__auto____81829 = cljs.core._meta["_"];
        if(cljs.core.truth_(or__3548__auto____81829)) {
          return or__3548__auto____81829
        }else {
          throw cljs.core.missing_protocol.call(null, "IMeta.-meta", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function _with_meta(o, meta) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81830 = o;
    if(cljs.core.truth_(and__3546__auto____81830)) {
      return o.cljs$core$IWithMeta$_with_meta
    }else {
      return and__3546__auto____81830
    }
  }())) {
    return o.cljs$core$IWithMeta$_with_meta(o, meta)
  }else {
    return function() {
      var or__3548__auto____81831 = cljs.core._with_meta[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81831)) {
        return or__3548__auto____81831
      }else {
        var or__3548__auto____81832 = cljs.core._with_meta["_"];
        if(cljs.core.truth_(or__3548__auto____81832)) {
          return or__3548__auto____81832
        }else {
          throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", o);
        }
      }
    }().call(null, o, meta)
  }
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var _reduce = null;
  var _reduce__81839 = function(coll, f) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81833 = coll;
      if(cljs.core.truth_(and__3546__auto____81833)) {
        return coll.cljs$core$IReduce$_reduce
      }else {
        return and__3546__auto____81833
      }
    }())) {
      return coll.cljs$core$IReduce$_reduce(coll, f)
    }else {
      return function() {
        var or__3548__auto____81834 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(cljs.core.truth_(or__3548__auto____81834)) {
          return or__3548__auto____81834
        }else {
          var or__3548__auto____81835 = cljs.core._reduce["_"];
          if(cljs.core.truth_(or__3548__auto____81835)) {
            return or__3548__auto____81835
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__81840 = function(coll, f, start) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____81836 = coll;
      if(cljs.core.truth_(and__3546__auto____81836)) {
        return coll.cljs$core$IReduce$_reduce
      }else {
        return and__3546__auto____81836
      }
    }())) {
      return coll.cljs$core$IReduce$_reduce(coll, f, start)
    }else {
      return function() {
        var or__3548__auto____81837 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(cljs.core.truth_(or__3548__auto____81837)) {
          return or__3548__auto____81837
        }else {
          var or__3548__auto____81838 = cljs.core._reduce["_"];
          if(cljs.core.truth_(or__3548__auto____81838)) {
            return or__3548__auto____81838
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f, start)
    }
  };
  _reduce = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return _reduce__81839.call(this, coll, f);
      case 3:
        return _reduce__81840.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return _reduce
}();
cljs.core.IEquiv = {};
cljs.core._equiv = function _equiv(o, other) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81842 = o;
    if(cljs.core.truth_(and__3546__auto____81842)) {
      return o.cljs$core$IEquiv$_equiv
    }else {
      return and__3546__auto____81842
    }
  }())) {
    return o.cljs$core$IEquiv$_equiv(o, other)
  }else {
    return function() {
      var or__3548__auto____81843 = cljs.core._equiv[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81843)) {
        return or__3548__auto____81843
      }else {
        var or__3548__auto____81844 = cljs.core._equiv["_"];
        if(cljs.core.truth_(or__3548__auto____81844)) {
          return or__3548__auto____81844
        }else {
          throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", o);
        }
      }
    }().call(null, o, other)
  }
};
cljs.core.IHash = {};
cljs.core._hash = function _hash(o) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81845 = o;
    if(cljs.core.truth_(and__3546__auto____81845)) {
      return o.cljs$core$IHash$_hash
    }else {
      return and__3546__auto____81845
    }
  }())) {
    return o.cljs$core$IHash$_hash(o)
  }else {
    return function() {
      var or__3548__auto____81846 = cljs.core._hash[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81846)) {
        return or__3548__auto____81846
      }else {
        var or__3548__auto____81847 = cljs.core._hash["_"];
        if(cljs.core.truth_(or__3548__auto____81847)) {
          return or__3548__auto____81847
        }else {
          throw cljs.core.missing_protocol.call(null, "IHash.-hash", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.ISeqable = {};
cljs.core._seq = function _seq(o) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81848 = o;
    if(cljs.core.truth_(and__3546__auto____81848)) {
      return o.cljs$core$ISeqable$_seq
    }else {
      return and__3546__auto____81848
    }
  }())) {
    return o.cljs$core$ISeqable$_seq(o)
  }else {
    return function() {
      var or__3548__auto____81849 = cljs.core._seq[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81849)) {
        return or__3548__auto____81849
      }else {
        var or__3548__auto____81850 = cljs.core._seq["_"];
        if(cljs.core.truth_(or__3548__auto____81850)) {
          return or__3548__auto____81850
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", o);
        }
      }
    }().call(null, o)
  }
};
cljs.core.ISequential = {};
cljs.core.IRecord = {};
cljs.core.IPrintable = {};
cljs.core._pr_seq = function _pr_seq(o, opts) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81851 = o;
    if(cljs.core.truth_(and__3546__auto____81851)) {
      return o.cljs$core$IPrintable$_pr_seq
    }else {
      return and__3546__auto____81851
    }
  }())) {
    return o.cljs$core$IPrintable$_pr_seq(o, opts)
  }else {
    return function() {
      var or__3548__auto____81852 = cljs.core._pr_seq[goog.typeOf.call(null, o)];
      if(cljs.core.truth_(or__3548__auto____81852)) {
        return or__3548__auto____81852
      }else {
        var or__3548__auto____81853 = cljs.core._pr_seq["_"];
        if(cljs.core.truth_(or__3548__auto____81853)) {
          return or__3548__auto____81853
        }else {
          throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", o);
        }
      }
    }().call(null, o, opts)
  }
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function _realized_QMARK_(d) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81854 = d;
    if(cljs.core.truth_(and__3546__auto____81854)) {
      return d.cljs$core$IPending$_realized_QMARK_
    }else {
      return and__3546__auto____81854
    }
  }())) {
    return d.cljs$core$IPending$_realized_QMARK_(d)
  }else {
    return function() {
      var or__3548__auto____81855 = cljs.core._realized_QMARK_[goog.typeOf.call(null, d)];
      if(cljs.core.truth_(or__3548__auto____81855)) {
        return or__3548__auto____81855
      }else {
        var or__3548__auto____81856 = cljs.core._realized_QMARK_["_"];
        if(cljs.core.truth_(or__3548__auto____81856)) {
          return or__3548__auto____81856
        }else {
          throw cljs.core.missing_protocol.call(null, "IPending.-realized?", d);
        }
      }
    }().call(null, d)
  }
};
cljs.core.IWatchable = {};
cljs.core._notify_watches = function _notify_watches(this$, oldval, newval) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81857 = this$;
    if(cljs.core.truth_(and__3546__auto____81857)) {
      return this$.cljs$core$IWatchable$_notify_watches
    }else {
      return and__3546__auto____81857
    }
  }())) {
    return this$.cljs$core$IWatchable$_notify_watches(this$, oldval, newval)
  }else {
    return function() {
      var or__3548__auto____81858 = cljs.core._notify_watches[goog.typeOf.call(null, this$)];
      if(cljs.core.truth_(or__3548__auto____81858)) {
        return or__3548__auto____81858
      }else {
        var or__3548__auto____81859 = cljs.core._notify_watches["_"];
        if(cljs.core.truth_(or__3548__auto____81859)) {
          return or__3548__auto____81859
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81860 = this$;
    if(cljs.core.truth_(and__3546__auto____81860)) {
      return this$.cljs$core$IWatchable$_add_watch
    }else {
      return and__3546__auto____81860
    }
  }())) {
    return this$.cljs$core$IWatchable$_add_watch(this$, key, f)
  }else {
    return function() {
      var or__3548__auto____81861 = cljs.core._add_watch[goog.typeOf.call(null, this$)];
      if(cljs.core.truth_(or__3548__auto____81861)) {
        return or__3548__auto____81861
      }else {
        var or__3548__auto____81862 = cljs.core._add_watch["_"];
        if(cljs.core.truth_(or__3548__auto____81862)) {
          return or__3548__auto____81862
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____81863 = this$;
    if(cljs.core.truth_(and__3546__auto____81863)) {
      return this$.cljs$core$IWatchable$_remove_watch
    }else {
      return and__3546__auto____81863
    }
  }())) {
    return this$.cljs$core$IWatchable$_remove_watch(this$, key)
  }else {
    return function() {
      var or__3548__auto____81864 = cljs.core._remove_watch[goog.typeOf.call(null, this$)];
      if(cljs.core.truth_(or__3548__auto____81864)) {
        return or__3548__auto____81864
      }else {
        var or__3548__auto____81865 = cljs.core._remove_watch["_"];
        if(cljs.core.truth_(or__3548__auto____81865)) {
          return or__3548__auto____81865
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", this$);
        }
      }
    }().call(null, this$, key)
  }
};
cljs.core.identical_QMARK_ = function identical_QMARK_(x, y) {
  return x === y
};
cljs.core._EQ_ = function _EQ_(x, y) {
  return cljs.core._equiv.call(null, x, y)
};
cljs.core.nil_QMARK_ = function nil_QMARK_(x) {
  return x === null
};
cljs.core.type = function type(x) {
  return x.constructor
};
cljs.core.IHash["null"] = true;
cljs.core._hash["null"] = function(o) {
  return 0
};
cljs.core.ILookup["null"] = true;
cljs.core._lookup["null"] = function() {
  var G__81866 = null;
  var G__81866__81867 = function(o, k) {
    return null
  };
  var G__81866__81868 = function(o, k, not_found) {
    return not_found
  };
  G__81866 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__81866__81867.call(this, o, k);
      case 3:
        return G__81866__81868.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81866
}();
cljs.core.IAssociative["null"] = true;
cljs.core._assoc["null"] = function(_, k, v) {
  return cljs.core.hash_map.call(null, k, v)
};
cljs.core.ICollection["null"] = true;
cljs.core._conj["null"] = function(_, o) {
  return cljs.core.list.call(null, o)
};
cljs.core.IReduce["null"] = true;
cljs.core._reduce["null"] = function() {
  var G__81870 = null;
  var G__81870__81871 = function(_, f) {
    return f.call(null)
  };
  var G__81870__81872 = function(_, f, start) {
    return start
  };
  G__81870 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__81870__81871.call(this, _, f);
      case 3:
        return G__81870__81872.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81870
}();
cljs.core.IPrintable["null"] = true;
cljs.core._pr_seq["null"] = function(o) {
  return cljs.core.list.call(null, "nil")
};
cljs.core.ISet["null"] = true;
cljs.core._disjoin["null"] = function(_, v) {
  return null
};
cljs.core.ICounted["null"] = true;
cljs.core._count["null"] = function(_) {
  return 0
};
cljs.core.IStack["null"] = true;
cljs.core._peek["null"] = function(_) {
  return null
};
cljs.core._pop["null"] = function(_) {
  return null
};
cljs.core.ISeq["null"] = true;
cljs.core._first["null"] = function(_) {
  return null
};
cljs.core._rest["null"] = function(_) {
  return cljs.core.list.call(null)
};
cljs.core.IEquiv["null"] = true;
cljs.core._equiv["null"] = function(_, o) {
  return o === null
};
cljs.core.IWithMeta["null"] = true;
cljs.core._with_meta["null"] = function(_, meta) {
  return null
};
cljs.core.IMeta["null"] = true;
cljs.core._meta["null"] = function(_) {
  return null
};
cljs.core.IIndexed["null"] = true;
cljs.core._nth["null"] = function() {
  var G__81874 = null;
  var G__81874__81875 = function(_, n) {
    return null
  };
  var G__81874__81876 = function(_, n, not_found) {
    return not_found
  };
  G__81874 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__81874__81875.call(this, _, n);
      case 3:
        return G__81874__81876.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81874
}();
cljs.core.IEmptyableCollection["null"] = true;
cljs.core._empty["null"] = function(_) {
  return null
};
cljs.core.IMap["null"] = true;
cljs.core._dissoc["null"] = function(_, k) {
  return null
};
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv = function(o, other) {
  return o.toString() === other.toString()
};
cljs.core.IHash["number"] = true;
cljs.core._hash["number"] = function(o) {
  return o
};
cljs.core.IEquiv["number"] = true;
cljs.core._equiv["number"] = function(x, o) {
  return x === o
};
cljs.core.IHash["boolean"] = true;
cljs.core._hash["boolean"] = function(o) {
  return o === true ? 1 : 0
};
cljs.core.IHash["function"] = true;
cljs.core._hash["function"] = function(o) {
  return goog.getUid.call(null, o)
};
cljs.core.inc = function inc(x) {
  return x + 1
};
cljs.core.ci_reduce = function() {
  var ci_reduce = null;
  var ci_reduce__81884 = function(cicoll, f) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, 0, cljs.core._count.call(null, cicoll)))) {
      return f.call(null)
    }else {
      var val__81878 = cljs.core._nth.call(null, cicoll, 0);
      var n__81879 = 1;
      while(true) {
        if(cljs.core.truth_(n__81879 < cljs.core._count.call(null, cicoll))) {
          var G__81888 = f.call(null, val__81878, cljs.core._nth.call(null, cicoll, n__81879));
          var G__81889 = n__81879 + 1;
          val__81878 = G__81888;
          n__81879 = G__81889;
          continue
        }else {
          return val__81878
        }
        break
      }
    }
  };
  var ci_reduce__81885 = function(cicoll, f, val) {
    var val__81880 = val;
    var n__81881 = 0;
    while(true) {
      if(cljs.core.truth_(n__81881 < cljs.core._count.call(null, cicoll))) {
        var G__81890 = f.call(null, val__81880, cljs.core._nth.call(null, cicoll, n__81881));
        var G__81891 = n__81881 + 1;
        val__81880 = G__81890;
        n__81881 = G__81891;
        continue
      }else {
        return val__81880
      }
      break
    }
  };
  var ci_reduce__81886 = function(cicoll, f, val, idx) {
    var val__81882 = val;
    var n__81883 = idx;
    while(true) {
      if(cljs.core.truth_(n__81883 < cljs.core._count.call(null, cicoll))) {
        var G__81892 = f.call(null, val__81882, cljs.core._nth.call(null, cicoll, n__81883));
        var G__81893 = n__81883 + 1;
        val__81882 = G__81892;
        n__81883 = G__81893;
        continue
      }else {
        return val__81882
      }
      break
    }
  };
  ci_reduce = function(cicoll, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return ci_reduce__81884.call(this, cicoll, f);
      case 3:
        return ci_reduce__81885.call(this, cicoll, f, val);
      case 4:
        return ci_reduce__81886.call(this, cicoll, f, val, idx)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return ci_reduce
}();
cljs.core.IndexedSeq = function(a, i) {
  this.a = a;
  this.i = i
};
cljs.core.IndexedSeq.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__81894 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce = function() {
  var G__81907 = null;
  var G__81907__81908 = function(_, f) {
    var this__81895 = this;
    return cljs.core.ci_reduce.call(null, this__81895.a, f, this__81895.a[this__81895.i], this__81895.i + 1)
  };
  var G__81907__81909 = function(_, f, start) {
    var this__81896 = this;
    return cljs.core.ci_reduce.call(null, this__81896.a, f, start, this__81896.i)
  };
  G__81907 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__81907__81908.call(this, _, f);
      case 3:
        return G__81907__81909.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81907
}();
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__81897 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__81898 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth = function() {
  var G__81911 = null;
  var G__81911__81912 = function(coll, n) {
    var this__81899 = this;
    var i__81900 = n + this__81899.i;
    if(cljs.core.truth_(i__81900 < this__81899.a.length)) {
      return this__81899.a[i__81900]
    }else {
      return null
    }
  };
  var G__81911__81913 = function(coll, n, not_found) {
    var this__81901 = this;
    var i__81902 = n + this__81901.i;
    if(cljs.core.truth_(i__81902 < this__81901.a.length)) {
      return this__81901.a[i__81902]
    }else {
      return not_found
    }
  };
  G__81911 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__81911__81912.call(this, coll, n);
      case 3:
        return G__81911__81913.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81911
}();
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count = function(_) {
  var this__81903 = this;
  return this__81903.a.length - this__81903.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first = function(_) {
  var this__81904 = this;
  return this__81904.a[this__81904.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest = function(_) {
  var this__81905 = this;
  if(cljs.core.truth_(this__81905.i + 1 < this__81905.a.length)) {
    return new cljs.core.IndexedSeq(this__81905.a, this__81905.i + 1)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq = function(this$) {
  var this__81906 = this;
  return this$
};
cljs.core.IndexedSeq;
cljs.core.prim_seq = function prim_seq(prim, i) {
  if(cljs.core.truth_(cljs.core._EQ_.call(null, 0, prim.length))) {
    return null
  }else {
    return new cljs.core.IndexedSeq(prim, i)
  }
};
cljs.core.array_seq = function array_seq(array, i) {
  return cljs.core.prim_seq.call(null, array, i)
};
cljs.core.IReduce["array"] = true;
cljs.core._reduce["array"] = function() {
  var G__81915 = null;
  var G__81915__81916 = function(array, f) {
    return cljs.core.ci_reduce.call(null, array, f)
  };
  var G__81915__81917 = function(array, f, start) {
    return cljs.core.ci_reduce.call(null, array, f, start)
  };
  G__81915 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__81915__81916.call(this, array, f);
      case 3:
        return G__81915__81917.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81915
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__81919 = null;
  var G__81919__81920 = function(array, k) {
    return array[k]
  };
  var G__81919__81921 = function(array, k, not_found) {
    return cljs.core._nth.call(null, array, k, not_found)
  };
  G__81919 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__81919__81920.call(this, array, k);
      case 3:
        return G__81919__81921.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81919
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__81923 = null;
  var G__81923__81924 = function(array, n) {
    if(cljs.core.truth_(n < array.length)) {
      return array[n]
    }else {
      return null
    }
  };
  var G__81923__81925 = function(array, n, not_found) {
    if(cljs.core.truth_(n < array.length)) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__81923 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__81923__81924.call(this, array, n);
      case 3:
        return G__81923__81925.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__81923
}();
cljs.core.ICounted["array"] = true;
cljs.core._count["array"] = function(a) {
  return a.length
};
cljs.core.ISeqable["array"] = true;
cljs.core._seq["array"] = function(array) {
  return cljs.core.array_seq.call(null, array, 0)
};
cljs.core.seq = function seq(coll) {
  if(cljs.core.truth_(coll)) {
    return cljs.core._seq.call(null, coll)
  }else {
    return null
  }
};
cljs.core.first = function first(coll) {
  var temp__3698__auto____81927 = cljs.core.seq.call(null, coll);
  if(cljs.core.truth_(temp__3698__auto____81927)) {
    var s__81928 = temp__3698__auto____81927;
    return cljs.core._first.call(null, s__81928)
  }else {
    return null
  }
};
cljs.core.rest = function rest(coll) {
  return cljs.core._rest.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.next = function next(coll) {
  if(cljs.core.truth_(coll)) {
    return cljs.core.seq.call(null, cljs.core.rest.call(null, coll))
  }else {
    return null
  }
};
cljs.core.second = function second(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll))
};
cljs.core.ffirst = function ffirst(coll) {
  return cljs.core.first.call(null, cljs.core.first.call(null, coll))
};
cljs.core.nfirst = function nfirst(coll) {
  return cljs.core.next.call(null, cljs.core.first.call(null, coll))
};
cljs.core.fnext = function fnext(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll))
};
cljs.core.nnext = function nnext(coll) {
  return cljs.core.next.call(null, cljs.core.next.call(null, coll))
};
cljs.core.last = function last(s) {
  while(true) {
    if(cljs.core.truth_(cljs.core.next.call(null, s))) {
      var G__81929 = cljs.core.next.call(null, s);
      s = G__81929;
      continue
    }else {
      return cljs.core.first.call(null, s)
    }
    break
  }
};
cljs.core.ICounted["_"] = true;
cljs.core._count["_"] = function(x) {
  var s__81930 = cljs.core.seq.call(null, x);
  var n__81931 = 0;
  while(true) {
    if(cljs.core.truth_(s__81930)) {
      var G__81932 = cljs.core.next.call(null, s__81930);
      var G__81933 = n__81931 + 1;
      s__81930 = G__81932;
      n__81931 = G__81933;
      continue
    }else {
      return n__81931
    }
    break
  }
};
cljs.core.IEquiv["_"] = true;
cljs.core._equiv["_"] = function(x, o) {
  return x === o
};
cljs.core.not = function not(x) {
  if(cljs.core.truth_(x)) {
    return false
  }else {
    return true
  }
};
cljs.core.conj = function() {
  var conj = null;
  var conj__81934 = function(coll, x) {
    return cljs.core._conj.call(null, coll, x)
  };
  var conj__81935 = function() {
    var G__81937__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__81938 = conj.call(null, coll, x);
          var G__81939 = cljs.core.first.call(null, xs);
          var G__81940 = cljs.core.next.call(null, xs);
          coll = G__81938;
          x = G__81939;
          xs = G__81940;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__81937 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__81937__delegate.call(this, coll, x, xs)
    };
    G__81937.cljs$lang$maxFixedArity = 2;
    G__81937.cljs$lang$applyTo = function(arglist__81941) {
      var coll = cljs.core.first(arglist__81941);
      var x = cljs.core.first(cljs.core.next(arglist__81941));
      var xs = cljs.core.rest(cljs.core.next(arglist__81941));
      return G__81937__delegate.call(this, coll, x, xs)
    };
    return G__81937
  }();
  conj = function(coll, x, var_args) {
    var xs = var_args;
    switch(arguments.length) {
      case 2:
        return conj__81934.call(this, coll, x);
      default:
        return conj__81935.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  conj.cljs$lang$maxFixedArity = 2;
  conj.cljs$lang$applyTo = conj__81935.cljs$lang$applyTo;
  return conj
}();
cljs.core.empty = function empty(coll) {
  return cljs.core._empty.call(null, coll)
};
cljs.core.count = function count(coll) {
  return cljs.core._count.call(null, coll)
};
cljs.core.nth = function() {
  var nth = null;
  var nth__81942 = function(coll, n) {
    return cljs.core._nth.call(null, coll, Math.floor(n))
  };
  var nth__81943 = function(coll, n, not_found) {
    return cljs.core._nth.call(null, coll, Math.floor(n), not_found)
  };
  nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return nth__81942.call(this, coll, n);
      case 3:
        return nth__81943.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return nth
}();
cljs.core.get = function() {
  var get = null;
  var get__81945 = function(o, k) {
    return cljs.core._lookup.call(null, o, k)
  };
  var get__81946 = function(o, k, not_found) {
    return cljs.core._lookup.call(null, o, k, not_found)
  };
  get = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return get__81945.call(this, o, k);
      case 3:
        return get__81946.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return get
}();
cljs.core.assoc = function() {
  var assoc = null;
  var assoc__81949 = function(coll, k, v) {
    return cljs.core._assoc.call(null, coll, k, v)
  };
  var assoc__81950 = function() {
    var G__81952__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__81948 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__81953 = ret__81948;
          var G__81954 = cljs.core.first.call(null, kvs);
          var G__81955 = cljs.core.second.call(null, kvs);
          var G__81956 = cljs.core.nnext.call(null, kvs);
          coll = G__81953;
          k = G__81954;
          v = G__81955;
          kvs = G__81956;
          continue
        }else {
          return ret__81948
        }
        break
      }
    };
    var G__81952 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__81952__delegate.call(this, coll, k, v, kvs)
    };
    G__81952.cljs$lang$maxFixedArity = 3;
    G__81952.cljs$lang$applyTo = function(arglist__81957) {
      var coll = cljs.core.first(arglist__81957);
      var k = cljs.core.first(cljs.core.next(arglist__81957));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__81957)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__81957)));
      return G__81952__delegate.call(this, coll, k, v, kvs)
    };
    return G__81952
  }();
  assoc = function(coll, k, v, var_args) {
    var kvs = var_args;
    switch(arguments.length) {
      case 3:
        return assoc__81949.call(this, coll, k, v);
      default:
        return assoc__81950.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  assoc.cljs$lang$maxFixedArity = 3;
  assoc.cljs$lang$applyTo = assoc__81950.cljs$lang$applyTo;
  return assoc
}();
cljs.core.dissoc = function() {
  var dissoc = null;
  var dissoc__81959 = function(coll) {
    return coll
  };
  var dissoc__81960 = function(coll, k) {
    return cljs.core._dissoc.call(null, coll, k)
  };
  var dissoc__81961 = function() {
    var G__81963__delegate = function(coll, k, ks) {
      while(true) {
        var ret__81958 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__81964 = ret__81958;
          var G__81965 = cljs.core.first.call(null, ks);
          var G__81966 = cljs.core.next.call(null, ks);
          coll = G__81964;
          k = G__81965;
          ks = G__81966;
          continue
        }else {
          return ret__81958
        }
        break
      }
    };
    var G__81963 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__81963__delegate.call(this, coll, k, ks)
    };
    G__81963.cljs$lang$maxFixedArity = 2;
    G__81963.cljs$lang$applyTo = function(arglist__81967) {
      var coll = cljs.core.first(arglist__81967);
      var k = cljs.core.first(cljs.core.next(arglist__81967));
      var ks = cljs.core.rest(cljs.core.next(arglist__81967));
      return G__81963__delegate.call(this, coll, k, ks)
    };
    return G__81963
  }();
  dissoc = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return dissoc__81959.call(this, coll);
      case 2:
        return dissoc__81960.call(this, coll, k);
      default:
        return dissoc__81961.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  dissoc.cljs$lang$maxFixedArity = 2;
  dissoc.cljs$lang$applyTo = dissoc__81961.cljs$lang$applyTo;
  return dissoc
}();
cljs.core.with_meta = function with_meta(o, meta) {
  return cljs.core._with_meta.call(null, o, meta)
};
cljs.core.meta = function meta(o) {
  if(cljs.core.truth_(function() {
    var x__451__auto____81968 = o;
    if(cljs.core.truth_(function() {
      var and__3546__auto____81969 = x__451__auto____81968;
      if(cljs.core.truth_(and__3546__auto____81969)) {
        var and__3546__auto____81970 = x__451__auto____81968.cljs$core$IMeta$;
        if(cljs.core.truth_(and__3546__auto____81970)) {
          return cljs.core.not.call(null, x__451__auto____81968.hasOwnProperty("cljs$core$IMeta$"))
        }else {
          return and__3546__auto____81970
        }
      }else {
        return and__3546__auto____81969
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, x__451__auto____81968)
    }
  }())) {
    return cljs.core._meta.call(null, o)
  }else {
    return null
  }
};
cljs.core.peek = function peek(coll) {
  return cljs.core._peek.call(null, coll)
};
cljs.core.pop = function pop(coll) {
  return cljs.core._pop.call(null, coll)
};
cljs.core.disj = function() {
  var disj = null;
  var disj__81972 = function(coll) {
    return coll
  };
  var disj__81973 = function(coll, k) {
    return cljs.core._disjoin.call(null, coll, k)
  };
  var disj__81974 = function() {
    var G__81976__delegate = function(coll, k, ks) {
      while(true) {
        var ret__81971 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__81977 = ret__81971;
          var G__81978 = cljs.core.first.call(null, ks);
          var G__81979 = cljs.core.next.call(null, ks);
          coll = G__81977;
          k = G__81978;
          ks = G__81979;
          continue
        }else {
          return ret__81971
        }
        break
      }
    };
    var G__81976 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__81976__delegate.call(this, coll, k, ks)
    };
    G__81976.cljs$lang$maxFixedArity = 2;
    G__81976.cljs$lang$applyTo = function(arglist__81980) {
      var coll = cljs.core.first(arglist__81980);
      var k = cljs.core.first(cljs.core.next(arglist__81980));
      var ks = cljs.core.rest(cljs.core.next(arglist__81980));
      return G__81976__delegate.call(this, coll, k, ks)
    };
    return G__81976
  }();
  disj = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return disj__81972.call(this, coll);
      case 2:
        return disj__81973.call(this, coll, k);
      default:
        return disj__81974.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  disj.cljs$lang$maxFixedArity = 2;
  disj.cljs$lang$applyTo = disj__81974.cljs$lang$applyTo;
  return disj
}();
cljs.core.hash = function hash(o) {
  return cljs.core._hash.call(null, o)
};
cljs.core.empty_QMARK_ = function empty_QMARK_(coll) {
  return cljs.core.not.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.coll_QMARK_ = function coll_QMARK_(x) {
  if(cljs.core.truth_(x === null)) {
    return false
  }else {
    var x__451__auto____81981 = x;
    if(cljs.core.truth_(function() {
      var and__3546__auto____81982 = x__451__auto____81981;
      if(cljs.core.truth_(and__3546__auto____81982)) {
        var and__3546__auto____81983 = x__451__auto____81981.cljs$core$ICollection$;
        if(cljs.core.truth_(and__3546__auto____81983)) {
          return cljs.core.not.call(null, x__451__auto____81981.hasOwnProperty("cljs$core$ICollection$"))
        }else {
          return and__3546__auto____81983
        }
      }else {
        return and__3546__auto____81982
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, x__451__auto____81981)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(cljs.core.truth_(x === null)) {
    return false
  }else {
    var x__451__auto____81984 = x;
    if(cljs.core.truth_(function() {
      var and__3546__auto____81985 = x__451__auto____81984;
      if(cljs.core.truth_(and__3546__auto____81985)) {
        var and__3546__auto____81986 = x__451__auto____81984.cljs$core$ISet$;
        if(cljs.core.truth_(and__3546__auto____81986)) {
          return cljs.core.not.call(null, x__451__auto____81984.hasOwnProperty("cljs$core$ISet$"))
        }else {
          return and__3546__auto____81986
        }
      }else {
        return and__3546__auto____81985
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, x__451__auto____81984)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var x__451__auto____81987 = x;
  if(cljs.core.truth_(function() {
    var and__3546__auto____81988 = x__451__auto____81987;
    if(cljs.core.truth_(and__3546__auto____81988)) {
      var and__3546__auto____81989 = x__451__auto____81987.cljs$core$IAssociative$;
      if(cljs.core.truth_(and__3546__auto____81989)) {
        return cljs.core.not.call(null, x__451__auto____81987.hasOwnProperty("cljs$core$IAssociative$"))
      }else {
        return and__3546__auto____81989
      }
    }else {
      return and__3546__auto____81988
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, x__451__auto____81987)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var x__451__auto____81990 = x;
  if(cljs.core.truth_(function() {
    var and__3546__auto____81991 = x__451__auto____81990;
    if(cljs.core.truth_(and__3546__auto____81991)) {
      var and__3546__auto____81992 = x__451__auto____81990.cljs$core$ISequential$;
      if(cljs.core.truth_(and__3546__auto____81992)) {
        return cljs.core.not.call(null, x__451__auto____81990.hasOwnProperty("cljs$core$ISequential$"))
      }else {
        return and__3546__auto____81992
      }
    }else {
      return and__3546__auto____81991
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, x__451__auto____81990)
  }
};
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var x__451__auto____81993 = x;
  if(cljs.core.truth_(function() {
    var and__3546__auto____81994 = x__451__auto____81993;
    if(cljs.core.truth_(and__3546__auto____81994)) {
      var and__3546__auto____81995 = x__451__auto____81993.cljs$core$ICounted$;
      if(cljs.core.truth_(and__3546__auto____81995)) {
        return cljs.core.not.call(null, x__451__auto____81993.hasOwnProperty("cljs$core$ICounted$"))
      }else {
        return and__3546__auto____81995
      }
    }else {
      return and__3546__auto____81994
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, x__451__auto____81993)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(cljs.core.truth_(x === null)) {
    return false
  }else {
    var x__451__auto____81996 = x;
    if(cljs.core.truth_(function() {
      var and__3546__auto____81997 = x__451__auto____81996;
      if(cljs.core.truth_(and__3546__auto____81997)) {
        var and__3546__auto____81998 = x__451__auto____81996.cljs$core$IMap$;
        if(cljs.core.truth_(and__3546__auto____81998)) {
          return cljs.core.not.call(null, x__451__auto____81996.hasOwnProperty("cljs$core$IMap$"))
        }else {
          return and__3546__auto____81998
        }
      }else {
        return and__3546__auto____81997
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, x__451__auto____81996)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var x__451__auto____81999 = x;
  if(cljs.core.truth_(function() {
    var and__3546__auto____82000 = x__451__auto____81999;
    if(cljs.core.truth_(and__3546__auto____82000)) {
      var and__3546__auto____82001 = x__451__auto____81999.cljs$core$IVector$;
      if(cljs.core.truth_(and__3546__auto____82001)) {
        return cljs.core.not.call(null, x__451__auto____81999.hasOwnProperty("cljs$core$IVector$"))
      }else {
        return and__3546__auto____82001
      }
    }else {
      return and__3546__auto____82000
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, x__451__auto____81999)
  }
};
cljs.core.js_obj = function js_obj() {
  return{}
};
cljs.core.js_keys = function js_keys(obj) {
  var keys__82002 = [];
  goog.object.forEach.call(null, obj, function(val, key, obj) {
    return keys__82002.push(key)
  });
  return keys__82002
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key]
};
cljs.core.lookup_sentinel = cljs.core.js_obj.call(null);
cljs.core.false_QMARK_ = function false_QMARK_(x) {
  return x === false
};
cljs.core.true_QMARK_ = function true_QMARK_(x) {
  return x === true
};
cljs.core.undefined_QMARK_ = function undefined_QMARK_(x) {
  return void 0 === x
};
cljs.core.instance_QMARK_ = function instance_QMARK_(t, o) {
  return o != null && (o instanceof t || o.constructor === t || t === Object)
};
cljs.core.seq_QMARK_ = function seq_QMARK_(s) {
  if(cljs.core.truth_(s === null)) {
    return false
  }else {
    var x__451__auto____82003 = s;
    if(cljs.core.truth_(function() {
      var and__3546__auto____82004 = x__451__auto____82003;
      if(cljs.core.truth_(and__3546__auto____82004)) {
        var and__3546__auto____82005 = x__451__auto____82003.cljs$core$ISeq$;
        if(cljs.core.truth_(and__3546__auto____82005)) {
          return cljs.core.not.call(null, x__451__auto____82003.hasOwnProperty("cljs$core$ISeq$"))
        }else {
          return and__3546__auto____82005
        }
      }else {
        return and__3546__auto____82004
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, x__451__auto____82003)
    }
  }
};
cljs.core.boolean$ = function boolean$(x) {
  if(cljs.core.truth_(x)) {
    return true
  }else {
    return false
  }
};
cljs.core.string_QMARK_ = function string_QMARK_(x) {
  var and__3546__auto____82006 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3546__auto____82006)) {
    return cljs.core.not.call(null, function() {
      var or__3548__auto____82007 = cljs.core._EQ_.call(null, x.charAt(0), "\ufdd0");
      if(cljs.core.truth_(or__3548__auto____82007)) {
        return or__3548__auto____82007
      }else {
        return cljs.core._EQ_.call(null, x.charAt(0), "\ufdd1")
      }
    }())
  }else {
    return and__3546__auto____82006
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__3546__auto____82008 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3546__auto____82008)) {
    return cljs.core._EQ_.call(null, x.charAt(0), "\ufdd0")
  }else {
    return and__3546__auto____82008
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__3546__auto____82009 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3546__auto____82009)) {
    return cljs.core._EQ_.call(null, x.charAt(0), "\ufdd1")
  }else {
    return and__3546__auto____82009
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber.call(null, n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction.call(null, f)
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__3546__auto____82010 = cljs.core.number_QMARK_.call(null, n);
  if(cljs.core.truth_(and__3546__auto____82010)) {
    return n == n.toFixed()
  }else {
    return and__3546__auto____82010
  }
};
cljs.core.contains_QMARK_ = function contains_QMARK_(coll, v) {
  if(cljs.core.truth_(cljs.core._lookup.call(null, coll, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)) {
    return false
  }else {
    return true
  }
};
cljs.core.find = function find(coll, k) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____82011 = coll;
    if(cljs.core.truth_(and__3546__auto____82011)) {
      var and__3546__auto____82012 = cljs.core.associative_QMARK_.call(null, coll);
      if(cljs.core.truth_(and__3546__auto____82012)) {
        return cljs.core.contains_QMARK_.call(null, coll, k)
      }else {
        return and__3546__auto____82012
      }
    }else {
      return and__3546__auto____82011
    }
  }())) {
    return cljs.core.PersistentVector.fromArray([k, cljs.core._lookup.call(null, coll, k)])
  }else {
    return null
  }
};
cljs.core.distinct_QMARK_ = function() {
  var distinct_QMARK_ = null;
  var distinct_QMARK___82017 = function(x) {
    return true
  };
  var distinct_QMARK___82018 = function(x, y) {
    return cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y))
  };
  var distinct_QMARK___82019 = function() {
    var G__82021__delegate = function(x, y, more) {
      if(cljs.core.truth_(cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y)))) {
        var s__82013 = cljs.core.set([y, x]);
        var xs__82014 = more;
        while(true) {
          var x__82015 = cljs.core.first.call(null, xs__82014);
          var etc__82016 = cljs.core.next.call(null, xs__82014);
          if(cljs.core.truth_(xs__82014)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, s__82013, x__82015))) {
              return false
            }else {
              var G__82022 = cljs.core.conj.call(null, s__82013, x__82015);
              var G__82023 = etc__82016;
              s__82013 = G__82022;
              xs__82014 = G__82023;
              continue
            }
          }else {
            return true
          }
          break
        }
      }else {
        return false
      }
    };
    var G__82021 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82021__delegate.call(this, x, y, more)
    };
    G__82021.cljs$lang$maxFixedArity = 2;
    G__82021.cljs$lang$applyTo = function(arglist__82024) {
      var x = cljs.core.first(arglist__82024);
      var y = cljs.core.first(cljs.core.next(arglist__82024));
      var more = cljs.core.rest(cljs.core.next(arglist__82024));
      return G__82021__delegate.call(this, x, y, more)
    };
    return G__82021
  }();
  distinct_QMARK_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return distinct_QMARK___82017.call(this, x);
      case 2:
        return distinct_QMARK___82018.call(this, x, y);
      default:
        return distinct_QMARK___82019.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  distinct_QMARK_.cljs$lang$maxFixedArity = 2;
  distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___82019.cljs$lang$applyTo;
  return distinct_QMARK_
}();
cljs.core.compare = function compare(x, y) {
  return goog.array.defaultCompare.call(null, x, y)
};
cljs.core.fn__GT_comparator = function fn__GT_comparator(f) {
  if(cljs.core.truth_(cljs.core._EQ_.call(null, f, cljs.core.compare))) {
    return cljs.core.compare
  }else {
    return function(x, y) {
      var r__82025 = f.call(null, x, y);
      if(cljs.core.truth_(cljs.core.number_QMARK_.call(null, r__82025))) {
        return r__82025
      }else {
        if(cljs.core.truth_(r__82025)) {
          return-1
        }else {
          if(cljs.core.truth_(f.call(null, y, x))) {
            return 1
          }else {
            return 0
          }
        }
      }
    }
  }
};
cljs.core.sort = function() {
  var sort = null;
  var sort__82027 = function(coll) {
    return sort.call(null, cljs.core.compare, coll)
  };
  var sort__82028 = function(comp, coll) {
    if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
      var a__82026 = cljs.core.to_array.call(null, coll);
      goog.array.stableSort.call(null, a__82026, cljs.core.fn__GT_comparator.call(null, comp));
      return cljs.core.seq.call(null, a__82026)
    }else {
      return cljs.core.List.EMPTY
    }
  };
  sort = function(comp, coll) {
    switch(arguments.length) {
      case 1:
        return sort__82027.call(this, comp);
      case 2:
        return sort__82028.call(this, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return sort
}();
cljs.core.sort_by = function() {
  var sort_by = null;
  var sort_by__82030 = function(keyfn, coll) {
    return sort_by.call(null, keyfn, cljs.core.compare, coll)
  };
  var sort_by__82031 = function(keyfn, comp, coll) {
    return cljs.core.sort.call(null, function(x, y) {
      return cljs.core.fn__GT_comparator.call(null, comp).call(null, keyfn.call(null, x), keyfn.call(null, y))
    }, coll)
  };
  sort_by = function(keyfn, comp, coll) {
    switch(arguments.length) {
      case 2:
        return sort_by__82030.call(this, keyfn, comp);
      case 3:
        return sort_by__82031.call(this, keyfn, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return sort_by
}();
cljs.core.reduce = function() {
  var reduce = null;
  var reduce__82033 = function(f, coll) {
    return cljs.core._reduce.call(null, coll, f)
  };
  var reduce__82034 = function(f, val, coll) {
    return cljs.core._reduce.call(null, coll, f, val)
  };
  reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return reduce__82033.call(this, f, val);
      case 3:
        return reduce__82034.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return reduce
}();
cljs.core.seq_reduce = function() {
  var seq_reduce = null;
  var seq_reduce__82040 = function(f, coll) {
    var temp__3695__auto____82036 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3695__auto____82036)) {
      var s__82037 = temp__3695__auto____82036;
      return cljs.core.reduce.call(null, f, cljs.core.first.call(null, s__82037), cljs.core.next.call(null, s__82037))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__82041 = function(f, val, coll) {
    var val__82038 = val;
    var coll__82039 = cljs.core.seq.call(null, coll);
    while(true) {
      if(cljs.core.truth_(coll__82039)) {
        var G__82043 = f.call(null, val__82038, cljs.core.first.call(null, coll__82039));
        var G__82044 = cljs.core.next.call(null, coll__82039);
        val__82038 = G__82043;
        coll__82039 = G__82044;
        continue
      }else {
        return val__82038
      }
      break
    }
  };
  seq_reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return seq_reduce__82040.call(this, f, val);
      case 3:
        return seq_reduce__82041.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return seq_reduce
}();
cljs.core.IReduce["_"] = true;
cljs.core._reduce["_"] = function() {
  var G__82045 = null;
  var G__82045__82046 = function(coll, f) {
    return cljs.core.seq_reduce.call(null, f, coll)
  };
  var G__82045__82047 = function(coll, f, start) {
    return cljs.core.seq_reduce.call(null, f, start, coll)
  };
  G__82045 = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return G__82045__82046.call(this, coll, f);
      case 3:
        return G__82045__82047.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82045
}();
cljs.core._PLUS_ = function() {
  var _PLUS_ = null;
  var _PLUS___82049 = function() {
    return 0
  };
  var _PLUS___82050 = function(x) {
    return x
  };
  var _PLUS___82051 = function(x, y) {
    return x + y
  };
  var _PLUS___82052 = function() {
    var G__82054__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _PLUS_, x + y, more)
    };
    var G__82054 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82054__delegate.call(this, x, y, more)
    };
    G__82054.cljs$lang$maxFixedArity = 2;
    G__82054.cljs$lang$applyTo = function(arglist__82055) {
      var x = cljs.core.first(arglist__82055);
      var y = cljs.core.first(cljs.core.next(arglist__82055));
      var more = cljs.core.rest(cljs.core.next(arglist__82055));
      return G__82054__delegate.call(this, x, y, more)
    };
    return G__82054
  }();
  _PLUS_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _PLUS___82049.call(this);
      case 1:
        return _PLUS___82050.call(this, x);
      case 2:
        return _PLUS___82051.call(this, x, y);
      default:
        return _PLUS___82052.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _PLUS_.cljs$lang$maxFixedArity = 2;
  _PLUS_.cljs$lang$applyTo = _PLUS___82052.cljs$lang$applyTo;
  return _PLUS_
}();
cljs.core._ = function() {
  var _ = null;
  var ___82056 = function(x) {
    return-x
  };
  var ___82057 = function(x, y) {
    return x - y
  };
  var ___82058 = function() {
    var G__82060__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _, x - y, more)
    };
    var G__82060 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82060__delegate.call(this, x, y, more)
    };
    G__82060.cljs$lang$maxFixedArity = 2;
    G__82060.cljs$lang$applyTo = function(arglist__82061) {
      var x = cljs.core.first(arglist__82061);
      var y = cljs.core.first(cljs.core.next(arglist__82061));
      var more = cljs.core.rest(cljs.core.next(arglist__82061));
      return G__82060__delegate.call(this, x, y, more)
    };
    return G__82060
  }();
  _ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return ___82056.call(this, x);
      case 2:
        return ___82057.call(this, x, y);
      default:
        return ___82058.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _.cljs$lang$maxFixedArity = 2;
  _.cljs$lang$applyTo = ___82058.cljs$lang$applyTo;
  return _
}();
cljs.core._STAR_ = function() {
  var _STAR_ = null;
  var _STAR___82062 = function() {
    return 1
  };
  var _STAR___82063 = function(x) {
    return x
  };
  var _STAR___82064 = function(x, y) {
    return x * y
  };
  var _STAR___82065 = function() {
    var G__82067__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _STAR_, x * y, more)
    };
    var G__82067 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82067__delegate.call(this, x, y, more)
    };
    G__82067.cljs$lang$maxFixedArity = 2;
    G__82067.cljs$lang$applyTo = function(arglist__82068) {
      var x = cljs.core.first(arglist__82068);
      var y = cljs.core.first(cljs.core.next(arglist__82068));
      var more = cljs.core.rest(cljs.core.next(arglist__82068));
      return G__82067__delegate.call(this, x, y, more)
    };
    return G__82067
  }();
  _STAR_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _STAR___82062.call(this);
      case 1:
        return _STAR___82063.call(this, x);
      case 2:
        return _STAR___82064.call(this, x, y);
      default:
        return _STAR___82065.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _STAR_.cljs$lang$maxFixedArity = 2;
  _STAR_.cljs$lang$applyTo = _STAR___82065.cljs$lang$applyTo;
  return _STAR_
}();
cljs.core._SLASH_ = function() {
  var _SLASH_ = null;
  var _SLASH___82069 = function(x) {
    return _SLASH_.call(null, 1, x)
  };
  var _SLASH___82070 = function(x, y) {
    return x / y
  };
  var _SLASH___82071 = function() {
    var G__82073__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__82073 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82073__delegate.call(this, x, y, more)
    };
    G__82073.cljs$lang$maxFixedArity = 2;
    G__82073.cljs$lang$applyTo = function(arglist__82074) {
      var x = cljs.core.first(arglist__82074);
      var y = cljs.core.first(cljs.core.next(arglist__82074));
      var more = cljs.core.rest(cljs.core.next(arglist__82074));
      return G__82073__delegate.call(this, x, y, more)
    };
    return G__82073
  }();
  _SLASH_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _SLASH___82069.call(this, x);
      case 2:
        return _SLASH___82070.call(this, x, y);
      default:
        return _SLASH___82071.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _SLASH_.cljs$lang$maxFixedArity = 2;
  _SLASH_.cljs$lang$applyTo = _SLASH___82071.cljs$lang$applyTo;
  return _SLASH_
}();
cljs.core._LT_ = function() {
  var _LT_ = null;
  var _LT___82075 = function(x) {
    return true
  };
  var _LT___82076 = function(x, y) {
    return x < y
  };
  var _LT___82077 = function() {
    var G__82079__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(x < y)) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__82080 = y;
            var G__82081 = cljs.core.first.call(null, more);
            var G__82082 = cljs.core.next.call(null, more);
            x = G__82080;
            y = G__82081;
            more = G__82082;
            continue
          }else {
            return y < cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__82079 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82079__delegate.call(this, x, y, more)
    };
    G__82079.cljs$lang$maxFixedArity = 2;
    G__82079.cljs$lang$applyTo = function(arglist__82083) {
      var x = cljs.core.first(arglist__82083);
      var y = cljs.core.first(cljs.core.next(arglist__82083));
      var more = cljs.core.rest(cljs.core.next(arglist__82083));
      return G__82079__delegate.call(this, x, y, more)
    };
    return G__82079
  }();
  _LT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT___82075.call(this, x);
      case 2:
        return _LT___82076.call(this, x, y);
      default:
        return _LT___82077.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT_.cljs$lang$maxFixedArity = 2;
  _LT_.cljs$lang$applyTo = _LT___82077.cljs$lang$applyTo;
  return _LT_
}();
cljs.core._LT__EQ_ = function() {
  var _LT__EQ_ = null;
  var _LT__EQ___82084 = function(x) {
    return true
  };
  var _LT__EQ___82085 = function(x, y) {
    return x <= y
  };
  var _LT__EQ___82086 = function() {
    var G__82088__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(x <= y)) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__82089 = y;
            var G__82090 = cljs.core.first.call(null, more);
            var G__82091 = cljs.core.next.call(null, more);
            x = G__82089;
            y = G__82090;
            more = G__82091;
            continue
          }else {
            return y <= cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__82088 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82088__delegate.call(this, x, y, more)
    };
    G__82088.cljs$lang$maxFixedArity = 2;
    G__82088.cljs$lang$applyTo = function(arglist__82092) {
      var x = cljs.core.first(arglist__82092);
      var y = cljs.core.first(cljs.core.next(arglist__82092));
      var more = cljs.core.rest(cljs.core.next(arglist__82092));
      return G__82088__delegate.call(this, x, y, more)
    };
    return G__82088
  }();
  _LT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT__EQ___82084.call(this, x);
      case 2:
        return _LT__EQ___82085.call(this, x, y);
      default:
        return _LT__EQ___82086.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT__EQ_.cljs$lang$maxFixedArity = 2;
  _LT__EQ_.cljs$lang$applyTo = _LT__EQ___82086.cljs$lang$applyTo;
  return _LT__EQ_
}();
cljs.core._GT_ = function() {
  var _GT_ = null;
  var _GT___82093 = function(x) {
    return true
  };
  var _GT___82094 = function(x, y) {
    return x > y
  };
  var _GT___82095 = function() {
    var G__82097__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(x > y)) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__82098 = y;
            var G__82099 = cljs.core.first.call(null, more);
            var G__82100 = cljs.core.next.call(null, more);
            x = G__82098;
            y = G__82099;
            more = G__82100;
            continue
          }else {
            return y > cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__82097 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82097__delegate.call(this, x, y, more)
    };
    G__82097.cljs$lang$maxFixedArity = 2;
    G__82097.cljs$lang$applyTo = function(arglist__82101) {
      var x = cljs.core.first(arglist__82101);
      var y = cljs.core.first(cljs.core.next(arglist__82101));
      var more = cljs.core.rest(cljs.core.next(arglist__82101));
      return G__82097__delegate.call(this, x, y, more)
    };
    return G__82097
  }();
  _GT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT___82093.call(this, x);
      case 2:
        return _GT___82094.call(this, x, y);
      default:
        return _GT___82095.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT_.cljs$lang$maxFixedArity = 2;
  _GT_.cljs$lang$applyTo = _GT___82095.cljs$lang$applyTo;
  return _GT_
}();
cljs.core._GT__EQ_ = function() {
  var _GT__EQ_ = null;
  var _GT__EQ___82102 = function(x) {
    return true
  };
  var _GT__EQ___82103 = function(x, y) {
    return x >= y
  };
  var _GT__EQ___82104 = function() {
    var G__82106__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(x >= y)) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__82107 = y;
            var G__82108 = cljs.core.first.call(null, more);
            var G__82109 = cljs.core.next.call(null, more);
            x = G__82107;
            y = G__82108;
            more = G__82109;
            continue
          }else {
            return y >= cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__82106 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82106__delegate.call(this, x, y, more)
    };
    G__82106.cljs$lang$maxFixedArity = 2;
    G__82106.cljs$lang$applyTo = function(arglist__82110) {
      var x = cljs.core.first(arglist__82110);
      var y = cljs.core.first(cljs.core.next(arglist__82110));
      var more = cljs.core.rest(cljs.core.next(arglist__82110));
      return G__82106__delegate.call(this, x, y, more)
    };
    return G__82106
  }();
  _GT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT__EQ___82102.call(this, x);
      case 2:
        return _GT__EQ___82103.call(this, x, y);
      default:
        return _GT__EQ___82104.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT__EQ_.cljs$lang$maxFixedArity = 2;
  _GT__EQ_.cljs$lang$applyTo = _GT__EQ___82104.cljs$lang$applyTo;
  return _GT__EQ_
}();
cljs.core.dec = function dec(x) {
  return x - 1
};
cljs.core.max = function() {
  var max = null;
  var max__82111 = function(x) {
    return x
  };
  var max__82112 = function(x, y) {
    return x > y ? x : y
  };
  var max__82113 = function() {
    var G__82115__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, max, x > y ? x : y, more)
    };
    var G__82115 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82115__delegate.call(this, x, y, more)
    };
    G__82115.cljs$lang$maxFixedArity = 2;
    G__82115.cljs$lang$applyTo = function(arglist__82116) {
      var x = cljs.core.first(arglist__82116);
      var y = cljs.core.first(cljs.core.next(arglist__82116));
      var more = cljs.core.rest(cljs.core.next(arglist__82116));
      return G__82115__delegate.call(this, x, y, more)
    };
    return G__82115
  }();
  max = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return max__82111.call(this, x);
      case 2:
        return max__82112.call(this, x, y);
      default:
        return max__82113.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  max.cljs$lang$maxFixedArity = 2;
  max.cljs$lang$applyTo = max__82113.cljs$lang$applyTo;
  return max
}();
cljs.core.min = function() {
  var min = null;
  var min__82117 = function(x) {
    return x
  };
  var min__82118 = function(x, y) {
    return x < y ? x : y
  };
  var min__82119 = function() {
    var G__82121__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, min, x < y ? x : y, more)
    };
    var G__82121 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82121__delegate.call(this, x, y, more)
    };
    G__82121.cljs$lang$maxFixedArity = 2;
    G__82121.cljs$lang$applyTo = function(arglist__82122) {
      var x = cljs.core.first(arglist__82122);
      var y = cljs.core.first(cljs.core.next(arglist__82122));
      var more = cljs.core.rest(cljs.core.next(arglist__82122));
      return G__82121__delegate.call(this, x, y, more)
    };
    return G__82121
  }();
  min = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return min__82117.call(this, x);
      case 2:
        return min__82118.call(this, x, y);
      default:
        return min__82119.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  min.cljs$lang$maxFixedArity = 2;
  min.cljs$lang$applyTo = min__82119.cljs$lang$applyTo;
  return min
}();
cljs.core.fix = function fix(q) {
  if(cljs.core.truth_(q >= 0)) {
    return Math.floor.call(null, q)
  }else {
    return Math.ceil.call(null, q)
  }
};
cljs.core.mod = function mod(n, d) {
  return n % d
};
cljs.core.quot = function quot(n, d) {
  var rem__82123 = n % d;
  return cljs.core.fix.call(null, (n - rem__82123) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__82124 = cljs.core.quot.call(null, n, d);
  return n - d * q__82124
};
cljs.core.rand = function() {
  var rand = null;
  var rand__82125 = function() {
    return Math.random.call(null)
  };
  var rand__82126 = function(n) {
    return n * rand.call(null)
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__82125.call(this);
      case 1:
        return rand__82126.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, n))
};
cljs.core.bit_xor = function bit_xor(x, y) {
  return x ^ y
};
cljs.core.bit_and = function bit_and(x, y) {
  return x & y
};
cljs.core.bit_or = function bit_or(x, y) {
  return x | y
};
cljs.core.bit_and_not = function bit_and_not(x, y) {
  return x & ~y
};
cljs.core.bit_clear = function bit_clear(x, n) {
  return x & ~(1 << n)
};
cljs.core.bit_flip = function bit_flip(x, n) {
  return x ^ 1 << n
};
cljs.core.bit_not = function bit_not(x) {
  return~x
};
cljs.core.bit_set = function bit_set(x, n) {
  return x | 1 << n
};
cljs.core.bit_test = function bit_test(x, n) {
  return(x & 1 << n) != 0
};
cljs.core.bit_shift_left = function bit_shift_left(x, n) {
  return x << n
};
cljs.core.bit_shift_right = function bit_shift_right(x, n) {
  return x >> n
};
cljs.core._EQ__EQ_ = function() {
  var _EQ__EQ_ = null;
  var _EQ__EQ___82128 = function(x) {
    return true
  };
  var _EQ__EQ___82129 = function(x, y) {
    return cljs.core._equiv.call(null, x, y)
  };
  var _EQ__EQ___82130 = function() {
    var G__82132__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__82133 = y;
            var G__82134 = cljs.core.first.call(null, more);
            var G__82135 = cljs.core.next.call(null, more);
            x = G__82133;
            y = G__82134;
            more = G__82135;
            continue
          }else {
            return _EQ__EQ_.call(null, y, cljs.core.first.call(null, more))
          }
        }else {
          return false
        }
        break
      }
    };
    var G__82132 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82132__delegate.call(this, x, y, more)
    };
    G__82132.cljs$lang$maxFixedArity = 2;
    G__82132.cljs$lang$applyTo = function(arglist__82136) {
      var x = cljs.core.first(arglist__82136);
      var y = cljs.core.first(cljs.core.next(arglist__82136));
      var more = cljs.core.rest(cljs.core.next(arglist__82136));
      return G__82132__delegate.call(this, x, y, more)
    };
    return G__82132
  }();
  _EQ__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ__EQ___82128.call(this, x);
      case 2:
        return _EQ__EQ___82129.call(this, x, y);
      default:
        return _EQ__EQ___82130.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _EQ__EQ_.cljs$lang$maxFixedArity = 2;
  _EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___82130.cljs$lang$applyTo;
  return _EQ__EQ_
}();
cljs.core.pos_QMARK_ = function pos_QMARK_(n) {
  return n > 0
};
cljs.core.zero_QMARK_ = function zero_QMARK_(n) {
  return n === 0
};
cljs.core.neg_QMARK_ = function neg_QMARK_(x) {
  return x < 0
};
cljs.core.nthnext = function nthnext(coll, n) {
  var n__82137 = n;
  var xs__82138 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____82139 = xs__82138;
      if(cljs.core.truth_(and__3546__auto____82139)) {
        return n__82137 > 0
      }else {
        return and__3546__auto____82139
      }
    }())) {
      var G__82140 = n__82137 - 1;
      var G__82141 = cljs.core.next.call(null, xs__82138);
      n__82137 = G__82140;
      xs__82138 = G__82141;
      continue
    }else {
      return xs__82138
    }
    break
  }
};
cljs.core.IIndexed["_"] = true;
cljs.core._nth["_"] = function() {
  var G__82146 = null;
  var G__82146__82147 = function(coll, n) {
    var temp__3695__auto____82142 = cljs.core.nthnext.call(null, coll, n);
    if(cljs.core.truth_(temp__3695__auto____82142)) {
      var xs__82143 = temp__3695__auto____82142;
      return cljs.core.first.call(null, xs__82143)
    }else {
      throw new Error("Index out of bounds");
    }
  };
  var G__82146__82148 = function(coll, n, not_found) {
    var temp__3695__auto____82144 = cljs.core.nthnext.call(null, coll, n);
    if(cljs.core.truth_(temp__3695__auto____82144)) {
      var xs__82145 = temp__3695__auto____82144;
      return cljs.core.first.call(null, xs__82145)
    }else {
      return not_found
    }
  };
  G__82146 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82146__82147.call(this, coll, n);
      case 3:
        return G__82146__82148.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82146
}();
cljs.core.str_STAR_ = function() {
  var str_STAR_ = null;
  var str_STAR___82150 = function() {
    return""
  };
  var str_STAR___82151 = function(x) {
    if(cljs.core.truth_(x === null)) {
      return""
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return x.toString()
      }else {
        return null
      }
    }
  };
  var str_STAR___82152 = function() {
    var G__82154__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__82155 = sb.append(str_STAR_.call(null, cljs.core.first.call(null, more)));
            var G__82156 = cljs.core.next.call(null, more);
            sb = G__82155;
            more = G__82156;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__82154 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__82154__delegate.call(this, x, ys)
    };
    G__82154.cljs$lang$maxFixedArity = 1;
    G__82154.cljs$lang$applyTo = function(arglist__82157) {
      var x = cljs.core.first(arglist__82157);
      var ys = cljs.core.rest(arglist__82157);
      return G__82154__delegate.call(this, x, ys)
    };
    return G__82154
  }();
  str_STAR_ = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str_STAR___82150.call(this);
      case 1:
        return str_STAR___82151.call(this, x);
      default:
        return str_STAR___82152.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  str_STAR_.cljs$lang$maxFixedArity = 1;
  str_STAR_.cljs$lang$applyTo = str_STAR___82152.cljs$lang$applyTo;
  return str_STAR_
}();
cljs.core.str = function() {
  var str = null;
  var str__82158 = function() {
    return""
  };
  var str__82159 = function(x) {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, x))) {
      return x.substring(2, x.length)
    }else {
      if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, x))) {
        return cljs.core.str_STAR_.call(null, ":", x.substring(2, x.length))
      }else {
        if(cljs.core.truth_(x === null)) {
          return""
        }else {
          if(cljs.core.truth_("\ufdd0'else")) {
            return x.toString()
          }else {
            return null
          }
        }
      }
    }
  };
  var str__82160 = function() {
    var G__82162__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__82163 = sb.append(str.call(null, cljs.core.first.call(null, more)));
            var G__82164 = cljs.core.next.call(null, more);
            sb = G__82163;
            more = G__82164;
            continue
          }else {
            return cljs.core.str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__82162 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__82162__delegate.call(this, x, ys)
    };
    G__82162.cljs$lang$maxFixedArity = 1;
    G__82162.cljs$lang$applyTo = function(arglist__82165) {
      var x = cljs.core.first(arglist__82165);
      var ys = cljs.core.rest(arglist__82165);
      return G__82162__delegate.call(this, x, ys)
    };
    return G__82162
  }();
  str = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str__82158.call(this);
      case 1:
        return str__82159.call(this, x);
      default:
        return str__82160.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  str.cljs$lang$maxFixedArity = 1;
  str.cljs$lang$applyTo = str__82160.cljs$lang$applyTo;
  return str
}();
cljs.core.subs = function() {
  var subs = null;
  var subs__82166 = function(s, start) {
    return s.substring(start)
  };
  var subs__82167 = function(s, start, end) {
    return s.substring(start, end)
  };
  subs = function(s, start, end) {
    switch(arguments.length) {
      case 2:
        return subs__82166.call(this, s, start);
      case 3:
        return subs__82167.call(this, s, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return subs
}();
cljs.core.symbol = function() {
  var symbol = null;
  var symbol__82169 = function(name) {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, name))) {
      name
    }else {
      if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, name))) {
        cljs.core.str_STAR_.call(null, "\ufdd1", "'", cljs.core.subs.call(null, name, 2))
      }else {
      }
    }
    return cljs.core.str_STAR_.call(null, "\ufdd1", "'", name)
  };
  var symbol__82170 = function(ns, name) {
    return symbol.call(null, cljs.core.str_STAR_.call(null, ns, "/", name))
  };
  symbol = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return symbol__82169.call(this, ns);
      case 2:
        return symbol__82170.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return symbol
}();
cljs.core.keyword = function() {
  var keyword = null;
  var keyword__82172 = function(name) {
    if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, name))) {
      return name
    }else {
      if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, name))) {
        return cljs.core.str_STAR_.call(null, "\ufdd0", "'", cljs.core.subs.call(null, name, 2))
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          return cljs.core.str_STAR_.call(null, "\ufdd0", "'", name)
        }else {
          return null
        }
      }
    }
  };
  var keyword__82173 = function(ns, name) {
    return keyword.call(null, cljs.core.str_STAR_.call(null, ns, "/", name))
  };
  keyword = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return keyword__82172.call(this, ns);
      case 2:
        return keyword__82173.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return keyword
}();
cljs.core.equiv_sequential = function equiv_sequential(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.truth_(cljs.core.sequential_QMARK_.call(null, y)) ? function() {
    var xs__82175 = cljs.core.seq.call(null, x);
    var ys__82176 = cljs.core.seq.call(null, y);
    while(true) {
      if(cljs.core.truth_(xs__82175 === null)) {
        return ys__82176 === null
      }else {
        if(cljs.core.truth_(ys__82176 === null)) {
          return false
        }else {
          if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.first.call(null, xs__82175), cljs.core.first.call(null, ys__82176)))) {
            var G__82177 = cljs.core.next.call(null, xs__82175);
            var G__82178 = cljs.core.next.call(null, ys__82176);
            xs__82175 = G__82177;
            ys__82176 = G__82178;
            continue
          }else {
            if(cljs.core.truth_("\ufdd0'else")) {
              return false
            }else {
              return null
            }
          }
        }
      }
      break
    }
  }() : null)
};
cljs.core.hash_combine = function hash_combine(seed, hash) {
  return seed ^ hash + 2654435769 + (seed << 6) + (seed >> 2)
};
cljs.core.hash_coll = function hash_coll(coll) {
  return cljs.core.reduce.call(null, function(p1__82179_SHARP_, p2__82180_SHARP_) {
    return cljs.core.hash_combine.call(null, p1__82179_SHARP_, cljs.core.hash.call(null, p2__82180_SHARP_))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, coll)), cljs.core.next.call(null, coll))
};
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__82181__82182 = cljs.core.seq.call(null, fn_map);
  if(cljs.core.truth_(G__82181__82182)) {
    var G__82184__82186 = cljs.core.first.call(null, G__82181__82182);
    var vec__82185__82187 = G__82184__82186;
    var key_name__82188 = cljs.core.nth.call(null, vec__82185__82187, 0, null);
    var f__82189 = cljs.core.nth.call(null, vec__82185__82187, 1, null);
    var G__82181__82190 = G__82181__82182;
    var G__82184__82191 = G__82184__82186;
    var G__82181__82192 = G__82181__82190;
    while(true) {
      var vec__82193__82194 = G__82184__82191;
      var key_name__82195 = cljs.core.nth.call(null, vec__82193__82194, 0, null);
      var f__82196 = cljs.core.nth.call(null, vec__82193__82194, 1, null);
      var G__82181__82197 = G__82181__82192;
      var str_name__82198 = cljs.core.name.call(null, key_name__82195);
      obj[str_name__82198] = f__82196;
      var temp__3698__auto____82199 = cljs.core.next.call(null, G__82181__82197);
      if(cljs.core.truth_(temp__3698__auto____82199)) {
        var G__82181__82200 = temp__3698__auto____82199;
        var G__82201 = cljs.core.first.call(null, G__82181__82200);
        var G__82202 = G__82181__82200;
        G__82184__82191 = G__82201;
        G__82181__82192 = G__82202;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return obj
};
cljs.core.List = function(meta, first, rest, count) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.count = count
};
cljs.core.List.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.List")
};
cljs.core.List.prototype.cljs$core$IHash$ = true;
cljs.core.List.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82203 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82204 = this;
  return new cljs.core.List(this__82204.meta, o, coll, this__82204.count + 1)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82205 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82206 = this;
  return this__82206.count
};
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek = function(coll) {
  var this__82207 = this;
  return this__82207.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop = function(coll) {
  var this__82208 = this;
  return cljs.core._rest.call(null, coll)
};
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first = function(coll) {
  var this__82209 = this;
  return this__82209.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest = function(coll) {
  var this__82210 = this;
  return this__82210.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82211 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82212 = this;
  return new cljs.core.List(meta, this__82212.first, this__82212.rest, this__82212.count)
};
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82213 = this;
  return this__82213.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82214 = this;
  return cljs.core.List.EMPTY
};
cljs.core.List;
cljs.core.EmptyList = function(meta) {
  this.meta = meta
};
cljs.core.EmptyList.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$ = true;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82215 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82216 = this;
  return new cljs.core.List(this__82216.meta, o, null, 1)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82217 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82218 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek = function(coll) {
  var this__82219 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop = function(coll) {
  var this__82220 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first = function(coll) {
  var this__82221 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest = function(coll) {
  var this__82222 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82223 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82224 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82225 = this;
  return this__82225.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82226 = this;
  return coll
};
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reverse = function reverse(coll) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, coll)
};
cljs.core.list = function() {
  var list__delegate = function(items) {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, items))
  };
  var list = function(var_args) {
    var items = null;
    if(goog.isDef(var_args)) {
      items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return list__delegate.call(this, items)
  };
  list.cljs$lang$maxFixedArity = 0;
  list.cljs$lang$applyTo = function(arglist__82227) {
    var items = cljs.core.seq(arglist__82227);
    return list__delegate.call(this, items)
  };
  return list
}();
cljs.core.Cons = function(meta, first, rest) {
  this.meta = meta;
  this.first = first;
  this.rest = rest
};
cljs.core.Cons.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Cons")
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = true;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82228 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$IHash$ = true;
cljs.core.Cons.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82229 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82230 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82231 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__82231.meta)
};
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82232 = this;
  return new cljs.core.Cons(null, o, coll)
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first = function(coll) {
  var this__82233 = this;
  return this__82233.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest = function(coll) {
  var this__82234 = this;
  if(cljs.core.truth_(this__82234.rest === null)) {
    return cljs.core.List.EMPTY
  }else {
    return this__82234.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82235 = this;
  return this__82235.meta
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82236 = this;
  return new cljs.core.Cons(meta, this__82236.first, this__82236.rest)
};
cljs.core.Cons;
cljs.core.cons = function cons(x, seq) {
  return new cljs.core.Cons(null, x, seq)
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__82237 = null;
  var G__82237__82238 = function(string, f) {
    return cljs.core.ci_reduce.call(null, string, f)
  };
  var G__82237__82239 = function(string, f, start) {
    return cljs.core.ci_reduce.call(null, string, f, start)
  };
  G__82237 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__82237__82238.call(this, string, f);
      case 3:
        return G__82237__82239.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82237
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__82241 = null;
  var G__82241__82242 = function(string, k) {
    return cljs.core._nth.call(null, string, k)
  };
  var G__82241__82243 = function(string, k, not_found) {
    return cljs.core._nth.call(null, string, k, not_found)
  };
  G__82241 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82241__82242.call(this, string, k);
      case 3:
        return G__82241__82243.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82241
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__82245 = null;
  var G__82245__82246 = function(string, n) {
    if(cljs.core.truth_(n < cljs.core._count.call(null, string))) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__82245__82247 = function(string, n, not_found) {
    if(cljs.core.truth_(n < cljs.core._count.call(null, string))) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__82245 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82245__82246.call(this, string, n);
      case 3:
        return G__82245__82247.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82245
}();
cljs.core.ICounted["string"] = true;
cljs.core._count["string"] = function(s) {
  return s.length
};
cljs.core.ISeqable["string"] = true;
cljs.core._seq["string"] = function(string) {
  return cljs.core.prim_seq.call(null, string, 0)
};
cljs.core.IHash["string"] = true;
cljs.core._hash["string"] = function(o) {
  return goog.string.hashCode.call(null, o)
};
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = function() {
  var G__82255 = null;
  var G__82255__82256 = function(tsym82249, coll) {
    var tsym82249__82251 = this;
    var this$__82252 = tsym82249__82251;
    return cljs.core.get.call(null, coll, this$__82252.toString())
  };
  var G__82255__82257 = function(tsym82250, coll, not_found) {
    var tsym82250__82253 = this;
    var this$__82254 = tsym82250__82253;
    return cljs.core.get.call(null, coll, this$__82254.toString(), not_found)
  };
  G__82255 = function(tsym82250, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82255__82256.call(this, tsym82250, coll);
      case 3:
        return G__82255__82257.call(this, tsym82250, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82255
}();
String["prototype"]["apply"] = function(s, args) {
  if(cljs.core.truth_(cljs.core.count.call(null, args) < 2)) {
    return cljs.core.get.call(null, args[0], s)
  }else {
    return cljs.core.get.call(null, args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__82259 = lazy_seq.x;
  if(cljs.core.truth_(lazy_seq.realized)) {
    return x__82259
  }else {
    lazy_seq.x = x__82259.call(null);
    lazy_seq.realized = true;
    return lazy_seq.x
  }
};
cljs.core.LazySeq = function(meta, realized, x) {
  this.meta = meta;
  this.realized = realized;
  this.x = x
};
cljs.core.LazySeq.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82260 = this;
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = true;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82261 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82262 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82263 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__82263.meta)
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82264 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first = function(coll) {
  var this__82265 = this;
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest = function(coll) {
  var this__82266 = this;
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82267 = this;
  return this__82267.meta
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82268 = this;
  return new cljs.core.LazySeq(meta, this__82268.realized, this__82268.x)
};
cljs.core.LazySeq;
cljs.core.to_array = function to_array(s) {
  var ary__82269 = [];
  var s__82270 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, s__82270))) {
      ary__82269.push(cljs.core.first.call(null, s__82270));
      var G__82271 = cljs.core.next.call(null, s__82270);
      s__82270 = G__82271;
      continue
    }else {
      return ary__82269
    }
    break
  }
};
cljs.core.bounded_count = function bounded_count(s, n) {
  var s__82272 = s;
  var i__82273 = n;
  var sum__82274 = 0;
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____82275 = i__82273 > 0;
      if(cljs.core.truth_(and__3546__auto____82275)) {
        return cljs.core.seq.call(null, s__82272)
      }else {
        return and__3546__auto____82275
      }
    }())) {
      var G__82276 = cljs.core.next.call(null, s__82272);
      var G__82277 = i__82273 - 1;
      var G__82278 = sum__82274 + 1;
      s__82272 = G__82276;
      i__82273 = G__82277;
      sum__82274 = G__82278;
      continue
    }else {
      return sum__82274
    }
    break
  }
};
cljs.core.spread = function spread(arglist) {
  if(cljs.core.truth_(arglist === null)) {
    return null
  }else {
    if(cljs.core.truth_(cljs.core.next.call(null, arglist) === null)) {
      return cljs.core.seq.call(null, cljs.core.first.call(null, arglist))
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, arglist), spread.call(null, cljs.core.next.call(null, arglist)))
      }else {
        return null
      }
    }
  }
};
cljs.core.concat = function() {
  var concat = null;
  var concat__82282 = function() {
    return new cljs.core.LazySeq(null, false, function() {
      return null
    })
  };
  var concat__82283 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return x
    })
  };
  var concat__82284 = function(x, y) {
    return new cljs.core.LazySeq(null, false, function() {
      var s__82279 = cljs.core.seq.call(null, x);
      if(cljs.core.truth_(s__82279)) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__82279), concat.call(null, cljs.core.rest.call(null, s__82279), y))
      }else {
        return y
      }
    })
  };
  var concat__82285 = function() {
    var G__82287__delegate = function(x, y, zs) {
      var cat__82281 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__82280 = cljs.core.seq.call(null, xys);
          if(cljs.core.truth_(xys__82280)) {
            return cljs.core.cons.call(null, cljs.core.first.call(null, xys__82280), cat.call(null, cljs.core.rest.call(null, xys__82280), zs))
          }else {
            if(cljs.core.truth_(zs)) {
              return cat.call(null, cljs.core.first.call(null, zs), cljs.core.next.call(null, zs))
            }else {
              return null
            }
          }
        })
      };
      return cat__82281.call(null, concat.call(null, x, y), zs)
    };
    var G__82287 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82287__delegate.call(this, x, y, zs)
    };
    G__82287.cljs$lang$maxFixedArity = 2;
    G__82287.cljs$lang$applyTo = function(arglist__82288) {
      var x = cljs.core.first(arglist__82288);
      var y = cljs.core.first(cljs.core.next(arglist__82288));
      var zs = cljs.core.rest(cljs.core.next(arglist__82288));
      return G__82287__delegate.call(this, x, y, zs)
    };
    return G__82287
  }();
  concat = function(x, y, var_args) {
    var zs = var_args;
    switch(arguments.length) {
      case 0:
        return concat__82282.call(this);
      case 1:
        return concat__82283.call(this, x);
      case 2:
        return concat__82284.call(this, x, y);
      default:
        return concat__82285.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  concat.cljs$lang$maxFixedArity = 2;
  concat.cljs$lang$applyTo = concat__82285.cljs$lang$applyTo;
  return concat
}();
cljs.core.list_STAR_ = function() {
  var list_STAR_ = null;
  var list_STAR___82289 = function(args) {
    return cljs.core.seq.call(null, args)
  };
  var list_STAR___82290 = function(a, args) {
    return cljs.core.cons.call(null, a, args)
  };
  var list_STAR___82291 = function(a, b, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, args))
  };
  var list_STAR___82292 = function(a, b, c, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, args)))
  };
  var list_STAR___82293 = function() {
    var G__82295__delegate = function(a, b, c, d, more) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, more)))))
    };
    var G__82295 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__82295__delegate.call(this, a, b, c, d, more)
    };
    G__82295.cljs$lang$maxFixedArity = 4;
    G__82295.cljs$lang$applyTo = function(arglist__82296) {
      var a = cljs.core.first(arglist__82296);
      var b = cljs.core.first(cljs.core.next(arglist__82296));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82296)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82296))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82296))));
      return G__82295__delegate.call(this, a, b, c, d, more)
    };
    return G__82295
  }();
  list_STAR_ = function(a, b, c, d, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return list_STAR___82289.call(this, a);
      case 2:
        return list_STAR___82290.call(this, a, b);
      case 3:
        return list_STAR___82291.call(this, a, b, c);
      case 4:
        return list_STAR___82292.call(this, a, b, c, d);
      default:
        return list_STAR___82293.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  list_STAR_.cljs$lang$maxFixedArity = 4;
  list_STAR_.cljs$lang$applyTo = list_STAR___82293.cljs$lang$applyTo;
  return list_STAR_
}();
cljs.core.apply = function() {
  var apply = null;
  var apply__82306 = function(f, args) {
    var fixed_arity__82297 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.truth_(cljs.core.bounded_count.call(null, args, fixed_arity__82297 + 1) <= fixed_arity__82297)) {
        return f.apply(f, cljs.core.to_array.call(null, args))
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, args))
    }
  };
  var apply__82307 = function(f, x, args) {
    var arglist__82298 = cljs.core.list_STAR_.call(null, x, args);
    var fixed_arity__82299 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.truth_(cljs.core.bounded_count.call(null, arglist__82298, fixed_arity__82299) <= fixed_arity__82299)) {
        return f.apply(f, cljs.core.to_array.call(null, arglist__82298))
      }else {
        return f.cljs$lang$applyTo(arglist__82298)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__82298))
    }
  };
  var apply__82308 = function(f, x, y, args) {
    var arglist__82300 = cljs.core.list_STAR_.call(null, x, y, args);
    var fixed_arity__82301 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.truth_(cljs.core.bounded_count.call(null, arglist__82300, fixed_arity__82301) <= fixed_arity__82301)) {
        return f.apply(f, cljs.core.to_array.call(null, arglist__82300))
      }else {
        return f.cljs$lang$applyTo(arglist__82300)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__82300))
    }
  };
  var apply__82309 = function(f, x, y, z, args) {
    var arglist__82302 = cljs.core.list_STAR_.call(null, x, y, z, args);
    var fixed_arity__82303 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.truth_(cljs.core.bounded_count.call(null, arglist__82302, fixed_arity__82303) <= fixed_arity__82303)) {
        return f.apply(f, cljs.core.to_array.call(null, arglist__82302))
      }else {
        return f.cljs$lang$applyTo(arglist__82302)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__82302))
    }
  };
  var apply__82310 = function() {
    var G__82312__delegate = function(f, a, b, c, d, args) {
      var arglist__82304 = cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, args)))));
      var fixed_arity__82305 = f.cljs$lang$maxFixedArity;
      if(cljs.core.truth_(f.cljs$lang$applyTo)) {
        if(cljs.core.truth_(cljs.core.bounded_count.call(null, arglist__82304, fixed_arity__82305) <= fixed_arity__82305)) {
          return f.apply(f, cljs.core.to_array.call(null, arglist__82304))
        }else {
          return f.cljs$lang$applyTo(arglist__82304)
        }
      }else {
        return f.apply(f, cljs.core.to_array.call(null, arglist__82304))
      }
    };
    var G__82312 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__82312__delegate.call(this, f, a, b, c, d, args)
    };
    G__82312.cljs$lang$maxFixedArity = 5;
    G__82312.cljs$lang$applyTo = function(arglist__82313) {
      var f = cljs.core.first(arglist__82313);
      var a = cljs.core.first(cljs.core.next(arglist__82313));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82313)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82313))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82313)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82313)))));
      return G__82312__delegate.call(this, f, a, b, c, d, args)
    };
    return G__82312
  }();
  apply = function(f, a, b, c, d, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 2:
        return apply__82306.call(this, f, a);
      case 3:
        return apply__82307.call(this, f, a, b);
      case 4:
        return apply__82308.call(this, f, a, b, c);
      case 5:
        return apply__82309.call(this, f, a, b, c, d);
      default:
        return apply__82310.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  apply.cljs$lang$maxFixedArity = 5;
  apply.cljs$lang$applyTo = apply__82310.cljs$lang$applyTo;
  return apply
}();
cljs.core.vary_meta = function() {
  var vary_meta__delegate = function(obj, f, args) {
    return cljs.core.with_meta.call(null, obj, cljs.core.apply.call(null, f, cljs.core.meta.call(null, obj), args))
  };
  var vary_meta = function(obj, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return vary_meta__delegate.call(this, obj, f, args)
  };
  vary_meta.cljs$lang$maxFixedArity = 2;
  vary_meta.cljs$lang$applyTo = function(arglist__82314) {
    var obj = cljs.core.first(arglist__82314);
    var f = cljs.core.first(cljs.core.next(arglist__82314));
    var args = cljs.core.rest(cljs.core.next(arglist__82314));
    return vary_meta__delegate.call(this, obj, f, args)
  };
  return vary_meta
}();
cljs.core.not_EQ_ = function() {
  var not_EQ_ = null;
  var not_EQ___82315 = function(x) {
    return false
  };
  var not_EQ___82316 = function(x, y) {
    return cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y))
  };
  var not_EQ___82317 = function() {
    var G__82319__delegate = function(x, y, more) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, x, y, more))
    };
    var G__82319 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82319__delegate.call(this, x, y, more)
    };
    G__82319.cljs$lang$maxFixedArity = 2;
    G__82319.cljs$lang$applyTo = function(arglist__82320) {
      var x = cljs.core.first(arglist__82320);
      var y = cljs.core.first(cljs.core.next(arglist__82320));
      var more = cljs.core.rest(cljs.core.next(arglist__82320));
      return G__82319__delegate.call(this, x, y, more)
    };
    return G__82319
  }();
  not_EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return not_EQ___82315.call(this, x);
      case 2:
        return not_EQ___82316.call(this, x, y);
      default:
        return not_EQ___82317.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  not_EQ_.cljs$lang$maxFixedArity = 2;
  not_EQ_.cljs$lang$applyTo = not_EQ___82317.cljs$lang$applyTo;
  return not_EQ_
}();
cljs.core.not_empty = function not_empty(coll) {
  if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
    return coll
  }else {
    return null
  }
};
cljs.core.every_QMARK_ = function every_QMARK_(pred, coll) {
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, coll) === null)) {
      return true
    }else {
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, coll)))) {
        var G__82321 = pred;
        var G__82322 = cljs.core.next.call(null, coll);
        pred = G__82321;
        coll = G__82322;
        continue
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          return false
        }else {
          return null
        }
      }
    }
    break
  }
};
cljs.core.not_every_QMARK_ = function not_every_QMARK_(pred, coll) {
  return cljs.core.not.call(null, cljs.core.every_QMARK_.call(null, pred, coll))
};
cljs.core.some = function some(pred, coll) {
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
      var or__3548__auto____82323 = pred.call(null, cljs.core.first.call(null, coll));
      if(cljs.core.truth_(or__3548__auto____82323)) {
        return or__3548__auto____82323
      }else {
        var G__82324 = pred;
        var G__82325 = cljs.core.next.call(null, coll);
        pred = G__82324;
        coll = G__82325;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.not_any_QMARK_ = function not_any_QMARK_(pred, coll) {
  return cljs.core.not.call(null, cljs.core.some.call(null, pred, coll))
};
cljs.core.even_QMARK_ = function even_QMARK_(n) {
  if(cljs.core.truth_(cljs.core.integer_QMARK_.call(null, n))) {
    return(n & 1) === 0
  }else {
    throw new Error(cljs.core.str.call(null, "Argument must be an integer: ", n));
  }
};
cljs.core.odd_QMARK_ = function odd_QMARK_(n) {
  return cljs.core.not.call(null, cljs.core.even_QMARK_.call(null, n))
};
cljs.core.identity = function identity(x) {
  return x
};
cljs.core.complement = function complement(f) {
  return function() {
    var G__82326 = null;
    var G__82326__82327 = function() {
      return cljs.core.not.call(null, f.call(null))
    };
    var G__82326__82328 = function(x) {
      return cljs.core.not.call(null, f.call(null, x))
    };
    var G__82326__82329 = function(x, y) {
      return cljs.core.not.call(null, f.call(null, x, y))
    };
    var G__82326__82330 = function() {
      var G__82332__delegate = function(x, y, zs) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, f, x, y, zs))
      };
      var G__82332 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__82332__delegate.call(this, x, y, zs)
      };
      G__82332.cljs$lang$maxFixedArity = 2;
      G__82332.cljs$lang$applyTo = function(arglist__82333) {
        var x = cljs.core.first(arglist__82333);
        var y = cljs.core.first(cljs.core.next(arglist__82333));
        var zs = cljs.core.rest(cljs.core.next(arglist__82333));
        return G__82332__delegate.call(this, x, y, zs)
      };
      return G__82332
    }();
    G__82326 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__82326__82327.call(this);
        case 1:
          return G__82326__82328.call(this, x);
        case 2:
          return G__82326__82329.call(this, x, y);
        default:
          return G__82326__82330.apply(this, arguments)
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__82326.cljs$lang$maxFixedArity = 2;
    G__82326.cljs$lang$applyTo = G__82326__82330.cljs$lang$applyTo;
    return G__82326
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__82334__delegate = function(args) {
      return x
    };
    var G__82334 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__82334__delegate.call(this, args)
    };
    G__82334.cljs$lang$maxFixedArity = 0;
    G__82334.cljs$lang$applyTo = function(arglist__82335) {
      var args = cljs.core.seq(arglist__82335);
      return G__82334__delegate.call(this, args)
    };
    return G__82334
  }()
};
cljs.core.comp = function() {
  var comp = null;
  var comp__82339 = function() {
    return cljs.core.identity
  };
  var comp__82340 = function(f) {
    return f
  };
  var comp__82341 = function(f, g) {
    return function() {
      var G__82345 = null;
      var G__82345__82346 = function() {
        return f.call(null, g.call(null))
      };
      var G__82345__82347 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__82345__82348 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__82345__82349 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__82345__82350 = function() {
        var G__82352__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__82352 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82352__delegate.call(this, x, y, z, args)
        };
        G__82352.cljs$lang$maxFixedArity = 3;
        G__82352.cljs$lang$applyTo = function(arglist__82353) {
          var x = cljs.core.first(arglist__82353);
          var y = cljs.core.first(cljs.core.next(arglist__82353));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82353)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82353)));
          return G__82352__delegate.call(this, x, y, z, args)
        };
        return G__82352
      }();
      G__82345 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__82345__82346.call(this);
          case 1:
            return G__82345__82347.call(this, x);
          case 2:
            return G__82345__82348.call(this, x, y);
          case 3:
            return G__82345__82349.call(this, x, y, z);
          default:
            return G__82345__82350.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__82345.cljs$lang$maxFixedArity = 3;
      G__82345.cljs$lang$applyTo = G__82345__82350.cljs$lang$applyTo;
      return G__82345
    }()
  };
  var comp__82342 = function(f, g, h) {
    return function() {
      var G__82354 = null;
      var G__82354__82355 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__82354__82356 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__82354__82357 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__82354__82358 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__82354__82359 = function() {
        var G__82361__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.call(null, h, x, y, z, args)))
        };
        var G__82361 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82361__delegate.call(this, x, y, z, args)
        };
        G__82361.cljs$lang$maxFixedArity = 3;
        G__82361.cljs$lang$applyTo = function(arglist__82362) {
          var x = cljs.core.first(arglist__82362);
          var y = cljs.core.first(cljs.core.next(arglist__82362));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82362)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82362)));
          return G__82361__delegate.call(this, x, y, z, args)
        };
        return G__82361
      }();
      G__82354 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__82354__82355.call(this);
          case 1:
            return G__82354__82356.call(this, x);
          case 2:
            return G__82354__82357.call(this, x, y);
          case 3:
            return G__82354__82358.call(this, x, y, z);
          default:
            return G__82354__82359.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__82354.cljs$lang$maxFixedArity = 3;
      G__82354.cljs$lang$applyTo = G__82354__82359.cljs$lang$applyTo;
      return G__82354
    }()
  };
  var comp__82343 = function() {
    var G__82363__delegate = function(f1, f2, f3, fs) {
      var fs__82336 = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, f1, f2, f3, fs));
      return function() {
        var G__82364__delegate = function(args) {
          var ret__82337 = cljs.core.apply.call(null, cljs.core.first.call(null, fs__82336), args);
          var fs__82338 = cljs.core.next.call(null, fs__82336);
          while(true) {
            if(cljs.core.truth_(fs__82338)) {
              var G__82365 = cljs.core.first.call(null, fs__82338).call(null, ret__82337);
              var G__82366 = cljs.core.next.call(null, fs__82338);
              ret__82337 = G__82365;
              fs__82338 = G__82366;
              continue
            }else {
              return ret__82337
            }
            break
          }
        };
        var G__82364 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__82364__delegate.call(this, args)
        };
        G__82364.cljs$lang$maxFixedArity = 0;
        G__82364.cljs$lang$applyTo = function(arglist__82367) {
          var args = cljs.core.seq(arglist__82367);
          return G__82364__delegate.call(this, args)
        };
        return G__82364
      }()
    };
    var G__82363 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__82363__delegate.call(this, f1, f2, f3, fs)
    };
    G__82363.cljs$lang$maxFixedArity = 3;
    G__82363.cljs$lang$applyTo = function(arglist__82368) {
      var f1 = cljs.core.first(arglist__82368);
      var f2 = cljs.core.first(cljs.core.next(arglist__82368));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82368)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82368)));
      return G__82363__delegate.call(this, f1, f2, f3, fs)
    };
    return G__82363
  }();
  comp = function(f1, f2, f3, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 0:
        return comp__82339.call(this);
      case 1:
        return comp__82340.call(this, f1);
      case 2:
        return comp__82341.call(this, f1, f2);
      case 3:
        return comp__82342.call(this, f1, f2, f3);
      default:
        return comp__82343.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  comp.cljs$lang$maxFixedArity = 3;
  comp.cljs$lang$applyTo = comp__82343.cljs$lang$applyTo;
  return comp
}();
cljs.core.partial = function() {
  var partial = null;
  var partial__82369 = function(f, arg1) {
    return function() {
      var G__82374__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, args)
      };
      var G__82374 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__82374__delegate.call(this, args)
      };
      G__82374.cljs$lang$maxFixedArity = 0;
      G__82374.cljs$lang$applyTo = function(arglist__82375) {
        var args = cljs.core.seq(arglist__82375);
        return G__82374__delegate.call(this, args)
      };
      return G__82374
    }()
  };
  var partial__82370 = function(f, arg1, arg2) {
    return function() {
      var G__82376__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, args)
      };
      var G__82376 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__82376__delegate.call(this, args)
      };
      G__82376.cljs$lang$maxFixedArity = 0;
      G__82376.cljs$lang$applyTo = function(arglist__82377) {
        var args = cljs.core.seq(arglist__82377);
        return G__82376__delegate.call(this, args)
      };
      return G__82376
    }()
  };
  var partial__82371 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__82378__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, arg3, args)
      };
      var G__82378 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__82378__delegate.call(this, args)
      };
      G__82378.cljs$lang$maxFixedArity = 0;
      G__82378.cljs$lang$applyTo = function(arglist__82379) {
        var args = cljs.core.seq(arglist__82379);
        return G__82378__delegate.call(this, args)
      };
      return G__82378
    }()
  };
  var partial__82372 = function() {
    var G__82380__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__82381__delegate = function(args) {
          return cljs.core.apply.call(null, f, arg1, arg2, arg3, cljs.core.concat.call(null, more, args))
        };
        var G__82381 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__82381__delegate.call(this, args)
        };
        G__82381.cljs$lang$maxFixedArity = 0;
        G__82381.cljs$lang$applyTo = function(arglist__82382) {
          var args = cljs.core.seq(arglist__82382);
          return G__82381__delegate.call(this, args)
        };
        return G__82381
      }()
    };
    var G__82380 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__82380__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__82380.cljs$lang$maxFixedArity = 4;
    G__82380.cljs$lang$applyTo = function(arglist__82383) {
      var f = cljs.core.first(arglist__82383);
      var arg1 = cljs.core.first(cljs.core.next(arglist__82383));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82383)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82383))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82383))));
      return G__82380__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    return G__82380
  }();
  partial = function(f, arg1, arg2, arg3, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return partial__82369.call(this, f, arg1);
      case 3:
        return partial__82370.call(this, f, arg1, arg2);
      case 4:
        return partial__82371.call(this, f, arg1, arg2, arg3);
      default:
        return partial__82372.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partial.cljs$lang$maxFixedArity = 4;
  partial.cljs$lang$applyTo = partial__82372.cljs$lang$applyTo;
  return partial
}();
cljs.core.fnil = function() {
  var fnil = null;
  var fnil__82384 = function(f, x) {
    return function() {
      var G__82388 = null;
      var G__82388__82389 = function(a) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a)
      };
      var G__82388__82390 = function(a, b) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a, b)
      };
      var G__82388__82391 = function(a, b, c) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a, b, c)
      };
      var G__82388__82392 = function() {
        var G__82394__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, cljs.core.truth_(a === null) ? x : a, b, c, ds)
        };
        var G__82394 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82394__delegate.call(this, a, b, c, ds)
        };
        G__82394.cljs$lang$maxFixedArity = 3;
        G__82394.cljs$lang$applyTo = function(arglist__82395) {
          var a = cljs.core.first(arglist__82395);
          var b = cljs.core.first(cljs.core.next(arglist__82395));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82395)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82395)));
          return G__82394__delegate.call(this, a, b, c, ds)
        };
        return G__82394
      }();
      G__82388 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__82388__82389.call(this, a);
          case 2:
            return G__82388__82390.call(this, a, b);
          case 3:
            return G__82388__82391.call(this, a, b, c);
          default:
            return G__82388__82392.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__82388.cljs$lang$maxFixedArity = 3;
      G__82388.cljs$lang$applyTo = G__82388__82392.cljs$lang$applyTo;
      return G__82388
    }()
  };
  var fnil__82385 = function(f, x, y) {
    return function() {
      var G__82396 = null;
      var G__82396__82397 = function(a, b) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a, cljs.core.truth_(b === null) ? y : b)
      };
      var G__82396__82398 = function(a, b, c) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a, cljs.core.truth_(b === null) ? y : b, c)
      };
      var G__82396__82399 = function() {
        var G__82401__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, cljs.core.truth_(a === null) ? x : a, cljs.core.truth_(b === null) ? y : b, c, ds)
        };
        var G__82401 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82401__delegate.call(this, a, b, c, ds)
        };
        G__82401.cljs$lang$maxFixedArity = 3;
        G__82401.cljs$lang$applyTo = function(arglist__82402) {
          var a = cljs.core.first(arglist__82402);
          var b = cljs.core.first(cljs.core.next(arglist__82402));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82402)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82402)));
          return G__82401__delegate.call(this, a, b, c, ds)
        };
        return G__82401
      }();
      G__82396 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__82396__82397.call(this, a, b);
          case 3:
            return G__82396__82398.call(this, a, b, c);
          default:
            return G__82396__82399.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__82396.cljs$lang$maxFixedArity = 3;
      G__82396.cljs$lang$applyTo = G__82396__82399.cljs$lang$applyTo;
      return G__82396
    }()
  };
  var fnil__82386 = function(f, x, y, z) {
    return function() {
      var G__82403 = null;
      var G__82403__82404 = function(a, b) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a, cljs.core.truth_(b === null) ? y : b)
      };
      var G__82403__82405 = function(a, b, c) {
        return f.call(null, cljs.core.truth_(a === null) ? x : a, cljs.core.truth_(b === null) ? y : b, cljs.core.truth_(c === null) ? z : c)
      };
      var G__82403__82406 = function() {
        var G__82408__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, cljs.core.truth_(a === null) ? x : a, cljs.core.truth_(b === null) ? y : b, cljs.core.truth_(c === null) ? z : c, ds)
        };
        var G__82408 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82408__delegate.call(this, a, b, c, ds)
        };
        G__82408.cljs$lang$maxFixedArity = 3;
        G__82408.cljs$lang$applyTo = function(arglist__82409) {
          var a = cljs.core.first(arglist__82409);
          var b = cljs.core.first(cljs.core.next(arglist__82409));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82409)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82409)));
          return G__82408__delegate.call(this, a, b, c, ds)
        };
        return G__82408
      }();
      G__82403 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__82403__82404.call(this, a, b);
          case 3:
            return G__82403__82405.call(this, a, b, c);
          default:
            return G__82403__82406.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__82403.cljs$lang$maxFixedArity = 3;
      G__82403.cljs$lang$applyTo = G__82403__82406.cljs$lang$applyTo;
      return G__82403
    }()
  };
  fnil = function(f, x, y, z) {
    switch(arguments.length) {
      case 2:
        return fnil__82384.call(this, f, x);
      case 3:
        return fnil__82385.call(this, f, x, y);
      case 4:
        return fnil__82386.call(this, f, x, y, z)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return fnil
}();
cljs.core.map_indexed = function map_indexed(f, coll) {
  var mapi__82412 = function mpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____82410 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____82410)) {
        var s__82411 = temp__3698__auto____82410;
        return cljs.core.cons.call(null, f.call(null, idx, cljs.core.first.call(null, s__82411)), mpi.call(null, idx + 1, cljs.core.rest.call(null, s__82411)))
      }else {
        return null
      }
    })
  };
  return mapi__82412.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3698__auto____82413 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3698__auto____82413)) {
      var s__82414 = temp__3698__auto____82413;
      var x__82415 = f.call(null, cljs.core.first.call(null, s__82414));
      if(cljs.core.truth_(x__82415 === null)) {
        return keep.call(null, f, cljs.core.rest.call(null, s__82414))
      }else {
        return cljs.core.cons.call(null, x__82415, keep.call(null, f, cljs.core.rest.call(null, s__82414)))
      }
    }else {
      return null
    }
  })
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__82425 = function kpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____82422 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____82422)) {
        var s__82423 = temp__3698__auto____82422;
        var x__82424 = f.call(null, idx, cljs.core.first.call(null, s__82423));
        if(cljs.core.truth_(x__82424 === null)) {
          return kpi.call(null, idx + 1, cljs.core.rest.call(null, s__82423))
        }else {
          return cljs.core.cons.call(null, x__82424, kpi.call(null, idx + 1, cljs.core.rest.call(null, s__82423)))
        }
      }else {
        return null
      }
    })
  };
  return keepi__82425.call(null, 0, coll)
};
cljs.core.every_pred = function() {
  var every_pred = null;
  var every_pred__82470 = function(p) {
    return function() {
      var ep1 = null;
      var ep1__82475 = function() {
        return true
      };
      var ep1__82476 = function(x) {
        return cljs.core.boolean$.call(null, p.call(null, x))
      };
      var ep1__82477 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82432 = p.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82432)) {
            return p.call(null, y)
          }else {
            return and__3546__auto____82432
          }
        }())
      };
      var ep1__82478 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82433 = p.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82433)) {
            var and__3546__auto____82434 = p.call(null, y);
            if(cljs.core.truth_(and__3546__auto____82434)) {
              return p.call(null, z)
            }else {
              return and__3546__auto____82434
            }
          }else {
            return and__3546__auto____82433
          }
        }())
      };
      var ep1__82479 = function() {
        var G__82481__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3546__auto____82435 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__3546__auto____82435)) {
              return cljs.core.every_QMARK_.call(null, p, args)
            }else {
              return and__3546__auto____82435
            }
          }())
        };
        var G__82481 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82481__delegate.call(this, x, y, z, args)
        };
        G__82481.cljs$lang$maxFixedArity = 3;
        G__82481.cljs$lang$applyTo = function(arglist__82482) {
          var x = cljs.core.first(arglist__82482);
          var y = cljs.core.first(cljs.core.next(arglist__82482));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82482)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82482)));
          return G__82481__delegate.call(this, x, y, z, args)
        };
        return G__82481
      }();
      ep1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep1__82475.call(this);
          case 1:
            return ep1__82476.call(this, x);
          case 2:
            return ep1__82477.call(this, x, y);
          case 3:
            return ep1__82478.call(this, x, y, z);
          default:
            return ep1__82479.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep1.cljs$lang$maxFixedArity = 3;
      ep1.cljs$lang$applyTo = ep1__82479.cljs$lang$applyTo;
      return ep1
    }()
  };
  var every_pred__82471 = function(p1, p2) {
    return function() {
      var ep2 = null;
      var ep2__82483 = function() {
        return true
      };
      var ep2__82484 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82436 = p1.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82436)) {
            return p2.call(null, x)
          }else {
            return and__3546__auto____82436
          }
        }())
      };
      var ep2__82485 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82437 = p1.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82437)) {
            var and__3546__auto____82438 = p1.call(null, y);
            if(cljs.core.truth_(and__3546__auto____82438)) {
              var and__3546__auto____82439 = p2.call(null, x);
              if(cljs.core.truth_(and__3546__auto____82439)) {
                return p2.call(null, y)
              }else {
                return and__3546__auto____82439
              }
            }else {
              return and__3546__auto____82438
            }
          }else {
            return and__3546__auto____82437
          }
        }())
      };
      var ep2__82486 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82440 = p1.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82440)) {
            var and__3546__auto____82441 = p1.call(null, y);
            if(cljs.core.truth_(and__3546__auto____82441)) {
              var and__3546__auto____82442 = p1.call(null, z);
              if(cljs.core.truth_(and__3546__auto____82442)) {
                var and__3546__auto____82443 = p2.call(null, x);
                if(cljs.core.truth_(and__3546__auto____82443)) {
                  var and__3546__auto____82444 = p2.call(null, y);
                  if(cljs.core.truth_(and__3546__auto____82444)) {
                    return p2.call(null, z)
                  }else {
                    return and__3546__auto____82444
                  }
                }else {
                  return and__3546__auto____82443
                }
              }else {
                return and__3546__auto____82442
              }
            }else {
              return and__3546__auto____82441
            }
          }else {
            return and__3546__auto____82440
          }
        }())
      };
      var ep2__82487 = function() {
        var G__82489__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3546__auto____82445 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__3546__auto____82445)) {
              return cljs.core.every_QMARK_.call(null, function(p1__82416_SHARP_) {
                var and__3546__auto____82446 = p1.call(null, p1__82416_SHARP_);
                if(cljs.core.truth_(and__3546__auto____82446)) {
                  return p2.call(null, p1__82416_SHARP_)
                }else {
                  return and__3546__auto____82446
                }
              }, args)
            }else {
              return and__3546__auto____82445
            }
          }())
        };
        var G__82489 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82489__delegate.call(this, x, y, z, args)
        };
        G__82489.cljs$lang$maxFixedArity = 3;
        G__82489.cljs$lang$applyTo = function(arglist__82490) {
          var x = cljs.core.first(arglist__82490);
          var y = cljs.core.first(cljs.core.next(arglist__82490));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82490)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82490)));
          return G__82489__delegate.call(this, x, y, z, args)
        };
        return G__82489
      }();
      ep2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep2__82483.call(this);
          case 1:
            return ep2__82484.call(this, x);
          case 2:
            return ep2__82485.call(this, x, y);
          case 3:
            return ep2__82486.call(this, x, y, z);
          default:
            return ep2__82487.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep2.cljs$lang$maxFixedArity = 3;
      ep2.cljs$lang$applyTo = ep2__82487.cljs$lang$applyTo;
      return ep2
    }()
  };
  var every_pred__82472 = function(p1, p2, p3) {
    return function() {
      var ep3 = null;
      var ep3__82491 = function() {
        return true
      };
      var ep3__82492 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82447 = p1.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82447)) {
            var and__3546__auto____82448 = p2.call(null, x);
            if(cljs.core.truth_(and__3546__auto____82448)) {
              return p3.call(null, x)
            }else {
              return and__3546__auto____82448
            }
          }else {
            return and__3546__auto____82447
          }
        }())
      };
      var ep3__82493 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82449 = p1.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82449)) {
            var and__3546__auto____82450 = p2.call(null, x);
            if(cljs.core.truth_(and__3546__auto____82450)) {
              var and__3546__auto____82451 = p3.call(null, x);
              if(cljs.core.truth_(and__3546__auto____82451)) {
                var and__3546__auto____82452 = p1.call(null, y);
                if(cljs.core.truth_(and__3546__auto____82452)) {
                  var and__3546__auto____82453 = p2.call(null, y);
                  if(cljs.core.truth_(and__3546__auto____82453)) {
                    return p3.call(null, y)
                  }else {
                    return and__3546__auto____82453
                  }
                }else {
                  return and__3546__auto____82452
                }
              }else {
                return and__3546__auto____82451
              }
            }else {
              return and__3546__auto____82450
            }
          }else {
            return and__3546__auto____82449
          }
        }())
      };
      var ep3__82494 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3546__auto____82454 = p1.call(null, x);
          if(cljs.core.truth_(and__3546__auto____82454)) {
            var and__3546__auto____82455 = p2.call(null, x);
            if(cljs.core.truth_(and__3546__auto____82455)) {
              var and__3546__auto____82456 = p3.call(null, x);
              if(cljs.core.truth_(and__3546__auto____82456)) {
                var and__3546__auto____82457 = p1.call(null, y);
                if(cljs.core.truth_(and__3546__auto____82457)) {
                  var and__3546__auto____82458 = p2.call(null, y);
                  if(cljs.core.truth_(and__3546__auto____82458)) {
                    var and__3546__auto____82459 = p3.call(null, y);
                    if(cljs.core.truth_(and__3546__auto____82459)) {
                      var and__3546__auto____82460 = p1.call(null, z);
                      if(cljs.core.truth_(and__3546__auto____82460)) {
                        var and__3546__auto____82461 = p2.call(null, z);
                        if(cljs.core.truth_(and__3546__auto____82461)) {
                          return p3.call(null, z)
                        }else {
                          return and__3546__auto____82461
                        }
                      }else {
                        return and__3546__auto____82460
                      }
                    }else {
                      return and__3546__auto____82459
                    }
                  }else {
                    return and__3546__auto____82458
                  }
                }else {
                  return and__3546__auto____82457
                }
              }else {
                return and__3546__auto____82456
              }
            }else {
              return and__3546__auto____82455
            }
          }else {
            return and__3546__auto____82454
          }
        }())
      };
      var ep3__82495 = function() {
        var G__82497__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__3546__auto____82462 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__3546__auto____82462)) {
              return cljs.core.every_QMARK_.call(null, function(p1__82417_SHARP_) {
                var and__3546__auto____82463 = p1.call(null, p1__82417_SHARP_);
                if(cljs.core.truth_(and__3546__auto____82463)) {
                  var and__3546__auto____82464 = p2.call(null, p1__82417_SHARP_);
                  if(cljs.core.truth_(and__3546__auto____82464)) {
                    return p3.call(null, p1__82417_SHARP_)
                  }else {
                    return and__3546__auto____82464
                  }
                }else {
                  return and__3546__auto____82463
                }
              }, args)
            }else {
              return and__3546__auto____82462
            }
          }())
        };
        var G__82497 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82497__delegate.call(this, x, y, z, args)
        };
        G__82497.cljs$lang$maxFixedArity = 3;
        G__82497.cljs$lang$applyTo = function(arglist__82498) {
          var x = cljs.core.first(arglist__82498);
          var y = cljs.core.first(cljs.core.next(arglist__82498));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82498)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82498)));
          return G__82497__delegate.call(this, x, y, z, args)
        };
        return G__82497
      }();
      ep3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep3__82491.call(this);
          case 1:
            return ep3__82492.call(this, x);
          case 2:
            return ep3__82493.call(this, x, y);
          case 3:
            return ep3__82494.call(this, x, y, z);
          default:
            return ep3__82495.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep3.cljs$lang$maxFixedArity = 3;
      ep3.cljs$lang$applyTo = ep3__82495.cljs$lang$applyTo;
      return ep3
    }()
  };
  var every_pred__82473 = function() {
    var G__82499__delegate = function(p1, p2, p3, ps) {
      var ps__82465 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__82500 = function() {
          return true
        };
        var epn__82501 = function(x) {
          return cljs.core.every_QMARK_.call(null, function(p1__82418_SHARP_) {
            return p1__82418_SHARP_.call(null, x)
          }, ps__82465)
        };
        var epn__82502 = function(x, y) {
          return cljs.core.every_QMARK_.call(null, function(p1__82419_SHARP_) {
            var and__3546__auto____82466 = p1__82419_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3546__auto____82466)) {
              return p1__82419_SHARP_.call(null, y)
            }else {
              return and__3546__auto____82466
            }
          }, ps__82465)
        };
        var epn__82503 = function(x, y, z) {
          return cljs.core.every_QMARK_.call(null, function(p1__82420_SHARP_) {
            var and__3546__auto____82467 = p1__82420_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3546__auto____82467)) {
              var and__3546__auto____82468 = p1__82420_SHARP_.call(null, y);
              if(cljs.core.truth_(and__3546__auto____82468)) {
                return p1__82420_SHARP_.call(null, z)
              }else {
                return and__3546__auto____82468
              }
            }else {
              return and__3546__auto____82467
            }
          }, ps__82465)
        };
        var epn__82504 = function() {
          var G__82506__delegate = function(x, y, z, args) {
            return cljs.core.boolean$.call(null, function() {
              var and__3546__auto____82469 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__3546__auto____82469)) {
                return cljs.core.every_QMARK_.call(null, function(p1__82421_SHARP_) {
                  return cljs.core.every_QMARK_.call(null, p1__82421_SHARP_, args)
                }, ps__82465)
              }else {
                return and__3546__auto____82469
              }
            }())
          };
          var G__82506 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__82506__delegate.call(this, x, y, z, args)
          };
          G__82506.cljs$lang$maxFixedArity = 3;
          G__82506.cljs$lang$applyTo = function(arglist__82507) {
            var x = cljs.core.first(arglist__82507);
            var y = cljs.core.first(cljs.core.next(arglist__82507));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82507)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82507)));
            return G__82506__delegate.call(this, x, y, z, args)
          };
          return G__82506
        }();
        epn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return epn__82500.call(this);
            case 1:
              return epn__82501.call(this, x);
            case 2:
              return epn__82502.call(this, x, y);
            case 3:
              return epn__82503.call(this, x, y, z);
            default:
              return epn__82504.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        epn.cljs$lang$maxFixedArity = 3;
        epn.cljs$lang$applyTo = epn__82504.cljs$lang$applyTo;
        return epn
      }()
    };
    var G__82499 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__82499__delegate.call(this, p1, p2, p3, ps)
    };
    G__82499.cljs$lang$maxFixedArity = 3;
    G__82499.cljs$lang$applyTo = function(arglist__82508) {
      var p1 = cljs.core.first(arglist__82508);
      var p2 = cljs.core.first(cljs.core.next(arglist__82508));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82508)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82508)));
      return G__82499__delegate.call(this, p1, p2, p3, ps)
    };
    return G__82499
  }();
  every_pred = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return every_pred__82470.call(this, p1);
      case 2:
        return every_pred__82471.call(this, p1, p2);
      case 3:
        return every_pred__82472.call(this, p1, p2, p3);
      default:
        return every_pred__82473.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  every_pred.cljs$lang$maxFixedArity = 3;
  every_pred.cljs$lang$applyTo = every_pred__82473.cljs$lang$applyTo;
  return every_pred
}();
cljs.core.some_fn = function() {
  var some_fn = null;
  var some_fn__82548 = function(p) {
    return function() {
      var sp1 = null;
      var sp1__82553 = function() {
        return null
      };
      var sp1__82554 = function(x) {
        return p.call(null, x)
      };
      var sp1__82555 = function(x, y) {
        var or__3548__auto____82510 = p.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82510)) {
          return or__3548__auto____82510
        }else {
          return p.call(null, y)
        }
      };
      var sp1__82556 = function(x, y, z) {
        var or__3548__auto____82511 = p.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82511)) {
          return or__3548__auto____82511
        }else {
          var or__3548__auto____82512 = p.call(null, y);
          if(cljs.core.truth_(or__3548__auto____82512)) {
            return or__3548__auto____82512
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__82557 = function() {
        var G__82559__delegate = function(x, y, z, args) {
          var or__3548__auto____82513 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__3548__auto____82513)) {
            return or__3548__auto____82513
          }else {
            return cljs.core.some.call(null, p, args)
          }
        };
        var G__82559 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82559__delegate.call(this, x, y, z, args)
        };
        G__82559.cljs$lang$maxFixedArity = 3;
        G__82559.cljs$lang$applyTo = function(arglist__82560) {
          var x = cljs.core.first(arglist__82560);
          var y = cljs.core.first(cljs.core.next(arglist__82560));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82560)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82560)));
          return G__82559__delegate.call(this, x, y, z, args)
        };
        return G__82559
      }();
      sp1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp1__82553.call(this);
          case 1:
            return sp1__82554.call(this, x);
          case 2:
            return sp1__82555.call(this, x, y);
          case 3:
            return sp1__82556.call(this, x, y, z);
          default:
            return sp1__82557.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp1.cljs$lang$maxFixedArity = 3;
      sp1.cljs$lang$applyTo = sp1__82557.cljs$lang$applyTo;
      return sp1
    }()
  };
  var some_fn__82549 = function(p1, p2) {
    return function() {
      var sp2 = null;
      var sp2__82561 = function() {
        return null
      };
      var sp2__82562 = function(x) {
        var or__3548__auto____82514 = p1.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82514)) {
          return or__3548__auto____82514
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__82563 = function(x, y) {
        var or__3548__auto____82515 = p1.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82515)) {
          return or__3548__auto____82515
        }else {
          var or__3548__auto____82516 = p1.call(null, y);
          if(cljs.core.truth_(or__3548__auto____82516)) {
            return or__3548__auto____82516
          }else {
            var or__3548__auto____82517 = p2.call(null, x);
            if(cljs.core.truth_(or__3548__auto____82517)) {
              return or__3548__auto____82517
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__82564 = function(x, y, z) {
        var or__3548__auto____82518 = p1.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82518)) {
          return or__3548__auto____82518
        }else {
          var or__3548__auto____82519 = p1.call(null, y);
          if(cljs.core.truth_(or__3548__auto____82519)) {
            return or__3548__auto____82519
          }else {
            var or__3548__auto____82520 = p1.call(null, z);
            if(cljs.core.truth_(or__3548__auto____82520)) {
              return or__3548__auto____82520
            }else {
              var or__3548__auto____82521 = p2.call(null, x);
              if(cljs.core.truth_(or__3548__auto____82521)) {
                return or__3548__auto____82521
              }else {
                var or__3548__auto____82522 = p2.call(null, y);
                if(cljs.core.truth_(or__3548__auto____82522)) {
                  return or__3548__auto____82522
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__82565 = function() {
        var G__82567__delegate = function(x, y, z, args) {
          var or__3548__auto____82523 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__3548__auto____82523)) {
            return or__3548__auto____82523
          }else {
            return cljs.core.some.call(null, function(p1__82426_SHARP_) {
              var or__3548__auto____82524 = p1.call(null, p1__82426_SHARP_);
              if(cljs.core.truth_(or__3548__auto____82524)) {
                return or__3548__auto____82524
              }else {
                return p2.call(null, p1__82426_SHARP_)
              }
            }, args)
          }
        };
        var G__82567 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82567__delegate.call(this, x, y, z, args)
        };
        G__82567.cljs$lang$maxFixedArity = 3;
        G__82567.cljs$lang$applyTo = function(arglist__82568) {
          var x = cljs.core.first(arglist__82568);
          var y = cljs.core.first(cljs.core.next(arglist__82568));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82568)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82568)));
          return G__82567__delegate.call(this, x, y, z, args)
        };
        return G__82567
      }();
      sp2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp2__82561.call(this);
          case 1:
            return sp2__82562.call(this, x);
          case 2:
            return sp2__82563.call(this, x, y);
          case 3:
            return sp2__82564.call(this, x, y, z);
          default:
            return sp2__82565.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp2.cljs$lang$maxFixedArity = 3;
      sp2.cljs$lang$applyTo = sp2__82565.cljs$lang$applyTo;
      return sp2
    }()
  };
  var some_fn__82550 = function(p1, p2, p3) {
    return function() {
      var sp3 = null;
      var sp3__82569 = function() {
        return null
      };
      var sp3__82570 = function(x) {
        var or__3548__auto____82525 = p1.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82525)) {
          return or__3548__auto____82525
        }else {
          var or__3548__auto____82526 = p2.call(null, x);
          if(cljs.core.truth_(or__3548__auto____82526)) {
            return or__3548__auto____82526
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__82571 = function(x, y) {
        var or__3548__auto____82527 = p1.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82527)) {
          return or__3548__auto____82527
        }else {
          var or__3548__auto____82528 = p2.call(null, x);
          if(cljs.core.truth_(or__3548__auto____82528)) {
            return or__3548__auto____82528
          }else {
            var or__3548__auto____82529 = p3.call(null, x);
            if(cljs.core.truth_(or__3548__auto____82529)) {
              return or__3548__auto____82529
            }else {
              var or__3548__auto____82530 = p1.call(null, y);
              if(cljs.core.truth_(or__3548__auto____82530)) {
                return or__3548__auto____82530
              }else {
                var or__3548__auto____82531 = p2.call(null, y);
                if(cljs.core.truth_(or__3548__auto____82531)) {
                  return or__3548__auto____82531
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__82572 = function(x, y, z) {
        var or__3548__auto____82532 = p1.call(null, x);
        if(cljs.core.truth_(or__3548__auto____82532)) {
          return or__3548__auto____82532
        }else {
          var or__3548__auto____82533 = p2.call(null, x);
          if(cljs.core.truth_(or__3548__auto____82533)) {
            return or__3548__auto____82533
          }else {
            var or__3548__auto____82534 = p3.call(null, x);
            if(cljs.core.truth_(or__3548__auto____82534)) {
              return or__3548__auto____82534
            }else {
              var or__3548__auto____82535 = p1.call(null, y);
              if(cljs.core.truth_(or__3548__auto____82535)) {
                return or__3548__auto____82535
              }else {
                var or__3548__auto____82536 = p2.call(null, y);
                if(cljs.core.truth_(or__3548__auto____82536)) {
                  return or__3548__auto____82536
                }else {
                  var or__3548__auto____82537 = p3.call(null, y);
                  if(cljs.core.truth_(or__3548__auto____82537)) {
                    return or__3548__auto____82537
                  }else {
                    var or__3548__auto____82538 = p1.call(null, z);
                    if(cljs.core.truth_(or__3548__auto____82538)) {
                      return or__3548__auto____82538
                    }else {
                      var or__3548__auto____82539 = p2.call(null, z);
                      if(cljs.core.truth_(or__3548__auto____82539)) {
                        return or__3548__auto____82539
                      }else {
                        return p3.call(null, z)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      var sp3__82573 = function() {
        var G__82575__delegate = function(x, y, z, args) {
          var or__3548__auto____82540 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__3548__auto____82540)) {
            return or__3548__auto____82540
          }else {
            return cljs.core.some.call(null, function(p1__82427_SHARP_) {
              var or__3548__auto____82541 = p1.call(null, p1__82427_SHARP_);
              if(cljs.core.truth_(or__3548__auto____82541)) {
                return or__3548__auto____82541
              }else {
                var or__3548__auto____82542 = p2.call(null, p1__82427_SHARP_);
                if(cljs.core.truth_(or__3548__auto____82542)) {
                  return or__3548__auto____82542
                }else {
                  return p3.call(null, p1__82427_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__82575 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__82575__delegate.call(this, x, y, z, args)
        };
        G__82575.cljs$lang$maxFixedArity = 3;
        G__82575.cljs$lang$applyTo = function(arglist__82576) {
          var x = cljs.core.first(arglist__82576);
          var y = cljs.core.first(cljs.core.next(arglist__82576));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82576)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82576)));
          return G__82575__delegate.call(this, x, y, z, args)
        };
        return G__82575
      }();
      sp3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp3__82569.call(this);
          case 1:
            return sp3__82570.call(this, x);
          case 2:
            return sp3__82571.call(this, x, y);
          case 3:
            return sp3__82572.call(this, x, y, z);
          default:
            return sp3__82573.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp3.cljs$lang$maxFixedArity = 3;
      sp3.cljs$lang$applyTo = sp3__82573.cljs$lang$applyTo;
      return sp3
    }()
  };
  var some_fn__82551 = function() {
    var G__82577__delegate = function(p1, p2, p3, ps) {
      var ps__82543 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__82578 = function() {
          return null
        };
        var spn__82579 = function(x) {
          return cljs.core.some.call(null, function(p1__82428_SHARP_) {
            return p1__82428_SHARP_.call(null, x)
          }, ps__82543)
        };
        var spn__82580 = function(x, y) {
          return cljs.core.some.call(null, function(p1__82429_SHARP_) {
            var or__3548__auto____82544 = p1__82429_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3548__auto____82544)) {
              return or__3548__auto____82544
            }else {
              return p1__82429_SHARP_.call(null, y)
            }
          }, ps__82543)
        };
        var spn__82581 = function(x, y, z) {
          return cljs.core.some.call(null, function(p1__82430_SHARP_) {
            var or__3548__auto____82545 = p1__82430_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3548__auto____82545)) {
              return or__3548__auto____82545
            }else {
              var or__3548__auto____82546 = p1__82430_SHARP_.call(null, y);
              if(cljs.core.truth_(or__3548__auto____82546)) {
                return or__3548__auto____82546
              }else {
                return p1__82430_SHARP_.call(null, z)
              }
            }
          }, ps__82543)
        };
        var spn__82582 = function() {
          var G__82584__delegate = function(x, y, z, args) {
            var or__3548__auto____82547 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__3548__auto____82547)) {
              return or__3548__auto____82547
            }else {
              return cljs.core.some.call(null, function(p1__82431_SHARP_) {
                return cljs.core.some.call(null, p1__82431_SHARP_, args)
              }, ps__82543)
            }
          };
          var G__82584 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__82584__delegate.call(this, x, y, z, args)
          };
          G__82584.cljs$lang$maxFixedArity = 3;
          G__82584.cljs$lang$applyTo = function(arglist__82585) {
            var x = cljs.core.first(arglist__82585);
            var y = cljs.core.first(cljs.core.next(arglist__82585));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82585)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82585)));
            return G__82584__delegate.call(this, x, y, z, args)
          };
          return G__82584
        }();
        spn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return spn__82578.call(this);
            case 1:
              return spn__82579.call(this, x);
            case 2:
              return spn__82580.call(this, x, y);
            case 3:
              return spn__82581.call(this, x, y, z);
            default:
              return spn__82582.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        spn.cljs$lang$maxFixedArity = 3;
        spn.cljs$lang$applyTo = spn__82582.cljs$lang$applyTo;
        return spn
      }()
    };
    var G__82577 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__82577__delegate.call(this, p1, p2, p3, ps)
    };
    G__82577.cljs$lang$maxFixedArity = 3;
    G__82577.cljs$lang$applyTo = function(arglist__82586) {
      var p1 = cljs.core.first(arglist__82586);
      var p2 = cljs.core.first(cljs.core.next(arglist__82586));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82586)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82586)));
      return G__82577__delegate.call(this, p1, p2, p3, ps)
    };
    return G__82577
  }();
  some_fn = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return some_fn__82548.call(this, p1);
      case 2:
        return some_fn__82549.call(this, p1, p2);
      case 3:
        return some_fn__82550.call(this, p1, p2, p3);
      default:
        return some_fn__82551.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  some_fn.cljs$lang$maxFixedArity = 3;
  some_fn.cljs$lang$applyTo = some_fn__82551.cljs$lang$applyTo;
  return some_fn
}();
cljs.core.map = function() {
  var map = null;
  var map__82599 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____82587 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____82587)) {
        var s__82588 = temp__3698__auto____82587;
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s__82588)), map.call(null, f, cljs.core.rest.call(null, s__82588)))
      }else {
        return null
      }
    })
  };
  var map__82600 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__82589 = cljs.core.seq.call(null, c1);
      var s2__82590 = cljs.core.seq.call(null, c2);
      if(cljs.core.truth_(function() {
        var and__3546__auto____82591 = s1__82589;
        if(cljs.core.truth_(and__3546__auto____82591)) {
          return s2__82590
        }else {
          return and__3546__auto____82591
        }
      }())) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__82589), cljs.core.first.call(null, s2__82590)), map.call(null, f, cljs.core.rest.call(null, s1__82589), cljs.core.rest.call(null, s2__82590)))
      }else {
        return null
      }
    })
  };
  var map__82601 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__82592 = cljs.core.seq.call(null, c1);
      var s2__82593 = cljs.core.seq.call(null, c2);
      var s3__82594 = cljs.core.seq.call(null, c3);
      if(cljs.core.truth_(function() {
        var and__3546__auto____82595 = s1__82592;
        if(cljs.core.truth_(and__3546__auto____82595)) {
          var and__3546__auto____82596 = s2__82593;
          if(cljs.core.truth_(and__3546__auto____82596)) {
            return s3__82594
          }else {
            return and__3546__auto____82596
          }
        }else {
          return and__3546__auto____82595
        }
      }())) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__82592), cljs.core.first.call(null, s2__82593), cljs.core.first.call(null, s3__82594)), map.call(null, f, cljs.core.rest.call(null, s1__82592), cljs.core.rest.call(null, s2__82593), cljs.core.rest.call(null, s3__82594)))
      }else {
        return null
      }
    })
  };
  var map__82602 = function() {
    var G__82604__delegate = function(f, c1, c2, c3, colls) {
      var step__82598 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__82597 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.truth_(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__82597))) {
            return cljs.core.cons.call(null, map.call(null, cljs.core.first, ss__82597), step.call(null, map.call(null, cljs.core.rest, ss__82597)))
          }else {
            return null
          }
        })
      };
      return map.call(null, function(p1__82509_SHARP_) {
        return cljs.core.apply.call(null, f, p1__82509_SHARP_)
      }, step__82598.call(null, cljs.core.conj.call(null, colls, c3, c2, c1)))
    };
    var G__82604 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__82604__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__82604.cljs$lang$maxFixedArity = 4;
    G__82604.cljs$lang$applyTo = function(arglist__82605) {
      var f = cljs.core.first(arglist__82605);
      var c1 = cljs.core.first(cljs.core.next(arglist__82605));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82605)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82605))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__82605))));
      return G__82604__delegate.call(this, f, c1, c2, c3, colls)
    };
    return G__82604
  }();
  map = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return map__82599.call(this, f, c1);
      case 3:
        return map__82600.call(this, f, c1, c2);
      case 4:
        return map__82601.call(this, f, c1, c2, c3);
      default:
        return map__82602.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  map.cljs$lang$maxFixedArity = 4;
  map.cljs$lang$applyTo = map__82602.cljs$lang$applyTo;
  return map
}();
cljs.core.take = function take(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    if(cljs.core.truth_(n > 0)) {
      var temp__3698__auto____82606 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____82606)) {
        var s__82607 = temp__3698__auto____82606;
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__82607), take.call(null, n - 1, cljs.core.rest.call(null, s__82607)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.drop = function drop(n, coll) {
  var step__82610 = function(n, coll) {
    while(true) {
      var s__82608 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__3546__auto____82609 = n > 0;
        if(cljs.core.truth_(and__3546__auto____82609)) {
          return s__82608
        }else {
          return and__3546__auto____82609
        }
      }())) {
        var G__82611 = n - 1;
        var G__82612 = cljs.core.rest.call(null, s__82608);
        n = G__82611;
        coll = G__82612;
        continue
      }else {
        return s__82608
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__82610.call(null, n, coll)
  })
};
cljs.core.drop_last = function() {
  var drop_last = null;
  var drop_last__82613 = function(s) {
    return drop_last.call(null, 1, s)
  };
  var drop_last__82614 = function(n, s) {
    return cljs.core.map.call(null, function(x, _) {
      return x
    }, s, cljs.core.drop.call(null, n, s))
  };
  drop_last = function(n, s) {
    switch(arguments.length) {
      case 1:
        return drop_last__82613.call(this, n);
      case 2:
        return drop_last__82614.call(this, n, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return drop_last
}();
cljs.core.take_last = function take_last(n, coll) {
  var s__82616 = cljs.core.seq.call(null, coll);
  var lead__82617 = cljs.core.seq.call(null, cljs.core.drop.call(null, n, coll));
  while(true) {
    if(cljs.core.truth_(lead__82617)) {
      var G__82618 = cljs.core.next.call(null, s__82616);
      var G__82619 = cljs.core.next.call(null, lead__82617);
      s__82616 = G__82618;
      lead__82617 = G__82619;
      continue
    }else {
      return s__82616
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__82622 = function(pred, coll) {
    while(true) {
      var s__82620 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__3546__auto____82621 = s__82620;
        if(cljs.core.truth_(and__3546__auto____82621)) {
          return pred.call(null, cljs.core.first.call(null, s__82620))
        }else {
          return and__3546__auto____82621
        }
      }())) {
        var G__82623 = pred;
        var G__82624 = cljs.core.rest.call(null, s__82620);
        pred = G__82623;
        coll = G__82624;
        continue
      }else {
        return s__82620
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__82622.call(null, pred, coll)
  })
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3698__auto____82625 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3698__auto____82625)) {
      var s__82626 = temp__3698__auto____82625;
      return cljs.core.concat.call(null, s__82626, cycle.call(null, s__82626))
    }else {
      return null
    }
  })
};
cljs.core.split_at = function split_at(n, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null, n, coll), cljs.core.drop.call(null, n, coll)])
};
cljs.core.repeat = function() {
  var repeat = null;
  var repeat__82627 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, x, repeat.call(null, x))
    })
  };
  var repeat__82628 = function(n, x) {
    return cljs.core.take.call(null, n, repeat.call(null, x))
  };
  repeat = function(n, x) {
    switch(arguments.length) {
      case 1:
        return repeat__82627.call(this, n);
      case 2:
        return repeat__82628.call(this, n, x)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return repeat
}();
cljs.core.replicate = function replicate(n, x) {
  return cljs.core.take.call(null, n, cljs.core.repeat.call(null, x))
};
cljs.core.repeatedly = function() {
  var repeatedly = null;
  var repeatedly__82630 = function(f) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, f.call(null), repeatedly.call(null, f))
    })
  };
  var repeatedly__82631 = function(n, f) {
    return cljs.core.take.call(null, n, repeatedly.call(null, f))
  };
  repeatedly = function(n, f) {
    switch(arguments.length) {
      case 1:
        return repeatedly__82630.call(this, n);
      case 2:
        return repeatedly__82631.call(this, n, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return repeatedly
}();
cljs.core.iterate = function iterate(f, x) {
  return cljs.core.cons.call(null, x, new cljs.core.LazySeq(null, false, function() {
    return iterate.call(null, f, f.call(null, x))
  }))
};
cljs.core.interleave = function() {
  var interleave = null;
  var interleave__82637 = function(c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__82633 = cljs.core.seq.call(null, c1);
      var s2__82634 = cljs.core.seq.call(null, c2);
      if(cljs.core.truth_(function() {
        var and__3546__auto____82635 = s1__82633;
        if(cljs.core.truth_(and__3546__auto____82635)) {
          return s2__82634
        }else {
          return and__3546__auto____82635
        }
      }())) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s1__82633), cljs.core.cons.call(null, cljs.core.first.call(null, s2__82634), interleave.call(null, cljs.core.rest.call(null, s1__82633), cljs.core.rest.call(null, s2__82634))))
      }else {
        return null
      }
    })
  };
  var interleave__82638 = function() {
    var G__82640__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__82636 = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, colls, c2, c1));
        if(cljs.core.truth_(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__82636))) {
          return cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, ss__82636), cljs.core.apply.call(null, interleave, cljs.core.map.call(null, cljs.core.rest, ss__82636)))
        }else {
          return null
        }
      })
    };
    var G__82640 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82640__delegate.call(this, c1, c2, colls)
    };
    G__82640.cljs$lang$maxFixedArity = 2;
    G__82640.cljs$lang$applyTo = function(arglist__82641) {
      var c1 = cljs.core.first(arglist__82641);
      var c2 = cljs.core.first(cljs.core.next(arglist__82641));
      var colls = cljs.core.rest(cljs.core.next(arglist__82641));
      return G__82640__delegate.call(this, c1, c2, colls)
    };
    return G__82640
  }();
  interleave = function(c1, c2, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return interleave__82637.call(this, c1, c2);
      default:
        return interleave__82638.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  interleave.cljs$lang$maxFixedArity = 2;
  interleave.cljs$lang$applyTo = interleave__82638.cljs$lang$applyTo;
  return interleave
}();
cljs.core.interpose = function interpose(sep, coll) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, sep), coll))
};
cljs.core.flatten1 = function flatten1(colls) {
  var cat__82644 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3695__auto____82642 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3695__auto____82642)) {
        var coll__82643 = temp__3695__auto____82642;
        return cljs.core.cons.call(null, cljs.core.first.call(null, coll__82643), cat.call(null, cljs.core.rest.call(null, coll__82643), colls))
      }else {
        if(cljs.core.truth_(cljs.core.seq.call(null, colls))) {
          return cat.call(null, cljs.core.first.call(null, colls), cljs.core.rest.call(null, colls))
        }else {
          return null
        }
      }
    })
  };
  return cat__82644.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__82645 = function(f, coll) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, f, coll))
  };
  var mapcat__82646 = function() {
    var G__82648__delegate = function(f, coll, colls) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, f, coll, colls))
    };
    var G__82648 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__82648__delegate.call(this, f, coll, colls)
    };
    G__82648.cljs$lang$maxFixedArity = 2;
    G__82648.cljs$lang$applyTo = function(arglist__82649) {
      var f = cljs.core.first(arglist__82649);
      var coll = cljs.core.first(cljs.core.next(arglist__82649));
      var colls = cljs.core.rest(cljs.core.next(arglist__82649));
      return G__82648__delegate.call(this, f, coll, colls)
    };
    return G__82648
  }();
  mapcat = function(f, coll, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapcat__82645.call(this, f, coll);
      default:
        return mapcat__82646.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  mapcat.cljs$lang$maxFixedArity = 2;
  mapcat.cljs$lang$applyTo = mapcat__82646.cljs$lang$applyTo;
  return mapcat
}();
cljs.core.filter = function filter(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3698__auto____82650 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3698__auto____82650)) {
      var s__82651 = temp__3698__auto____82650;
      var f__82652 = cljs.core.first.call(null, s__82651);
      var r__82653 = cljs.core.rest.call(null, s__82651);
      if(cljs.core.truth_(pred.call(null, f__82652))) {
        return cljs.core.cons.call(null, f__82652, filter.call(null, pred, r__82653))
      }else {
        return filter.call(null, pred, r__82653)
      }
    }else {
      return null
    }
  })
};
cljs.core.remove = function remove(pred, coll) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, pred), coll)
};
cljs.core.tree_seq = function tree_seq(branch_QMARK_, children, root) {
  var walk__82655 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.call(null, walk, children.call(null, node)) : null)
    })
  };
  return walk__82655.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter.call(null, function(p1__82654_SHARP_) {
    return cljs.core.not.call(null, cljs.core.sequential_QMARK_.call(null, p1__82654_SHARP_))
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, x)))
};
cljs.core.into = function into(to, from) {
  return cljs.core.reduce.call(null, cljs.core._conj, to, from)
};
cljs.core.partition = function() {
  var partition = null;
  var partition__82662 = function(n, coll) {
    return partition.call(null, n, n, coll)
  };
  var partition__82663 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____82656 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____82656)) {
        var s__82657 = temp__3698__auto____82656;
        var p__82658 = cljs.core.take.call(null, n, s__82657);
        if(cljs.core.truth_(cljs.core._EQ_.call(null, n, cljs.core.count.call(null, p__82658)))) {
          return cljs.core.cons.call(null, p__82658, partition.call(null, n, step, cljs.core.drop.call(null, step, s__82657)))
        }else {
          return null
        }
      }else {
        return null
      }
    })
  };
  var partition__82664 = function(n, step, pad, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____82659 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____82659)) {
        var s__82660 = temp__3698__auto____82659;
        var p__82661 = cljs.core.take.call(null, n, s__82660);
        if(cljs.core.truth_(cljs.core._EQ_.call(null, n, cljs.core.count.call(null, p__82661)))) {
          return cljs.core.cons.call(null, p__82661, partition.call(null, n, step, pad, cljs.core.drop.call(null, step, s__82660)))
        }else {
          return cljs.core.list.call(null, cljs.core.take.call(null, n, cljs.core.concat.call(null, p__82661, pad)))
        }
      }else {
        return null
      }
    })
  };
  partition = function(n, step, pad, coll) {
    switch(arguments.length) {
      case 2:
        return partition__82662.call(this, n, step);
      case 3:
        return partition__82663.call(this, n, step, pad);
      case 4:
        return partition__82664.call(this, n, step, pad, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return partition
}();
cljs.core.get_in = function() {
  var get_in = null;
  var get_in__82670 = function(m, ks) {
    return cljs.core.reduce.call(null, cljs.core.get, m, ks)
  };
  var get_in__82671 = function(m, ks, not_found) {
    var sentinel__82666 = cljs.core.lookup_sentinel;
    var m__82667 = m;
    var ks__82668 = cljs.core.seq.call(null, ks);
    while(true) {
      if(cljs.core.truth_(ks__82668)) {
        var m__82669 = cljs.core.get.call(null, m__82667, cljs.core.first.call(null, ks__82668), sentinel__82666);
        if(cljs.core.truth_(sentinel__82666 === m__82669)) {
          return not_found
        }else {
          var G__82673 = sentinel__82666;
          var G__82674 = m__82669;
          var G__82675 = cljs.core.next.call(null, ks__82668);
          sentinel__82666 = G__82673;
          m__82667 = G__82674;
          ks__82668 = G__82675;
          continue
        }
      }else {
        return m__82667
      }
      break
    }
  };
  get_in = function(m, ks, not_found) {
    switch(arguments.length) {
      case 2:
        return get_in__82670.call(this, m, ks);
      case 3:
        return get_in__82671.call(this, m, ks, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return get_in
}();
cljs.core.assoc_in = function assoc_in(m, p__82676, v) {
  var vec__82677__82678 = p__82676;
  var k__82679 = cljs.core.nth.call(null, vec__82677__82678, 0, null);
  var ks__82680 = cljs.core.nthnext.call(null, vec__82677__82678, 1);
  if(cljs.core.truth_(ks__82680)) {
    return cljs.core.assoc.call(null, m, k__82679, assoc_in.call(null, cljs.core.get.call(null, m, k__82679), ks__82680, v))
  }else {
    return cljs.core.assoc.call(null, m, k__82679, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__82681, f, args) {
    var vec__82682__82683 = p__82681;
    var k__82684 = cljs.core.nth.call(null, vec__82682__82683, 0, null);
    var ks__82685 = cljs.core.nthnext.call(null, vec__82682__82683, 1);
    if(cljs.core.truth_(ks__82685)) {
      return cljs.core.assoc.call(null, m, k__82684, cljs.core.apply.call(null, update_in, cljs.core.get.call(null, m, k__82684), ks__82685, f, args))
    }else {
      return cljs.core.assoc.call(null, m, k__82684, cljs.core.apply.call(null, f, cljs.core.get.call(null, m, k__82684), args))
    }
  };
  var update_in = function(m, p__82681, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__82681, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__82686) {
    var m = cljs.core.first(arglist__82686);
    var p__82681 = cljs.core.first(cljs.core.next(arglist__82686));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__82686)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__82686)));
    return update_in__delegate.call(this, m, p__82681, f, args)
  };
  return update_in
}();
cljs.core.Vector = function(meta, array) {
  this.meta = meta;
  this.array = array
};
cljs.core.Vector.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$ = true;
cljs.core.Vector.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82687 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup = function() {
  var G__82720 = null;
  var G__82720__82721 = function(coll, k) {
    var this__82688 = this;
    return cljs.core._nth.call(null, coll, k, null)
  };
  var G__82720__82722 = function(coll, k, not_found) {
    var this__82689 = this;
    return cljs.core._nth.call(null, coll, k, not_found)
  };
  G__82720 = function(coll, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82720__82721.call(this, coll, k);
      case 3:
        return G__82720__82722.call(this, coll, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82720
}();
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc = function(coll, k, v) {
  var this__82690 = this;
  var new_array__82691 = cljs.core.aclone.call(null, this__82690.array);
  new_array__82691[k] = v;
  return new cljs.core.Vector(this__82690.meta, new_array__82691)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = function() {
  var G__82724 = null;
  var G__82724__82725 = function(tsym82692, k) {
    var this__82694 = this;
    var tsym82692__82695 = this;
    var coll__82696 = tsym82692__82695;
    return cljs.core._lookup.call(null, coll__82696, k)
  };
  var G__82724__82726 = function(tsym82693, k, not_found) {
    var this__82697 = this;
    var tsym82693__82698 = this;
    var coll__82699 = tsym82693__82698;
    return cljs.core._lookup.call(null, coll__82699, k, not_found)
  };
  G__82724 = function(tsym82693, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82724__82725.call(this, tsym82693, k);
      case 3:
        return G__82724__82726.call(this, tsym82693, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82724
}();
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82700 = this;
  var new_array__82701 = cljs.core.aclone.call(null, this__82700.array);
  new_array__82701.push(o);
  return new cljs.core.Vector(this__82700.meta, new_array__82701)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce = function() {
  var G__82728 = null;
  var G__82728__82729 = function(v, f) {
    var this__82702 = this;
    return cljs.core.ci_reduce.call(null, this__82702.array, f)
  };
  var G__82728__82730 = function(v, f, start) {
    var this__82703 = this;
    return cljs.core.ci_reduce.call(null, this__82703.array, f, start)
  };
  G__82728 = function(v, f, start) {
    switch(arguments.length) {
      case 2:
        return G__82728__82729.call(this, v, f);
      case 3:
        return G__82728__82730.call(this, v, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82728
}();
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82704 = this;
  if(cljs.core.truth_(this__82704.array.length > 0)) {
    var vector_seq__82705 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(cljs.core.truth_(i < this__82704.array.length)) {
          return cljs.core.cons.call(null, this__82704.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__82705.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82706 = this;
  return this__82706.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek = function(coll) {
  var this__82707 = this;
  var count__82708 = this__82707.array.length;
  if(cljs.core.truth_(count__82708 > 0)) {
    return this__82707.array[count__82708 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop = function(coll) {
  var this__82709 = this;
  if(cljs.core.truth_(this__82709.array.length > 0)) {
    var new_array__82710 = cljs.core.aclone.call(null, this__82709.array);
    new_array__82710.pop();
    return new cljs.core.Vector(this__82709.meta, new_array__82710)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n = function(coll, n, val) {
  var this__82711 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82712 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82713 = this;
  return new cljs.core.Vector(meta, this__82713.array)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82714 = this;
  return this__82714.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth = function() {
  var G__82732 = null;
  var G__82732__82733 = function(coll, n) {
    var this__82715 = this;
    if(cljs.core.truth_(function() {
      var and__3546__auto____82716 = 0 <= n;
      if(cljs.core.truth_(and__3546__auto____82716)) {
        return n < this__82715.array.length
      }else {
        return and__3546__auto____82716
      }
    }())) {
      return this__82715.array[n]
    }else {
      return null
    }
  };
  var G__82732__82734 = function(coll, n, not_found) {
    var this__82717 = this;
    if(cljs.core.truth_(function() {
      var and__3546__auto____82718 = 0 <= n;
      if(cljs.core.truth_(and__3546__auto____82718)) {
        return n < this__82717.array.length
      }else {
        return and__3546__auto____82718
      }
    }())) {
      return this__82717.array[n]
    }else {
      return not_found
    }
  };
  G__82732 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82732__82733.call(this, coll, n);
      case 3:
        return G__82732__82734.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82732
}();
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82719 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__82719.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, []);
cljs.core.Vector.fromArray = function(xs) {
  return new cljs.core.Vector(null, xs)
};
cljs.core.tail_off = function tail_off(pv) {
  var cnt__82736 = pv.cnt;
  if(cljs.core.truth_(cnt__82736 < 32)) {
    return 0
  }else {
    return cnt__82736 - 1 >> 5 << 5
  }
};
cljs.core.new_path = function new_path(level, node) {
  var ll__82737 = level;
  var ret__82738 = node;
  while(true) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, 0, ll__82737))) {
      return ret__82738
    }else {
      var embed__82739 = ret__82738;
      var r__82740 = cljs.core.aclone.call(null, cljs.core.PersistentVector.EMPTY_NODE);
      var ___82741 = r__82740[0] = embed__82739;
      var G__82742 = ll__82737 - 5;
      var G__82743 = r__82740;
      ll__82737 = G__82742;
      ret__82738 = G__82743;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__82744 = cljs.core.aclone.call(null, parent);
  var subidx__82745 = pv.cnt - 1 >> level & 31;
  if(cljs.core.truth_(cljs.core._EQ_.call(null, 5, level))) {
    ret__82744[subidx__82745] = tailnode;
    return ret__82744
  }else {
    var temp__3695__auto____82746 = parent[subidx__82745];
    if(cljs.core.truth_(temp__3695__auto____82746)) {
      var child__82747 = temp__3695__auto____82746;
      var node_to_insert__82748 = push_tail.call(null, pv, level - 5, child__82747, tailnode);
      var ___82749 = ret__82744[subidx__82745] = node_to_insert__82748;
      return ret__82744
    }else {
      var node_to_insert__82750 = cljs.core.new_path.call(null, level - 5, tailnode);
      var ___82751 = ret__82744[subidx__82745] = node_to_insert__82750;
      return ret__82744
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____82752 = 0 <= i;
    if(cljs.core.truth_(and__3546__auto____82752)) {
      return i < pv.cnt
    }else {
      return and__3546__auto____82752
    }
  }())) {
    if(cljs.core.truth_(i >= cljs.core.tail_off.call(null, pv))) {
      return pv.tail
    }else {
      var node__82753 = pv.root;
      var level__82754 = pv.shift;
      while(true) {
        if(cljs.core.truth_(level__82754 > 0)) {
          var G__82755 = node__82753[i >> level__82754 & 31];
          var G__82756 = level__82754 - 5;
          node__82753 = G__82755;
          level__82754 = G__82756;
          continue
        }else {
          return node__82753
        }
        break
      }
    }
  }else {
    throw new Error(cljs.core.str.call(null, "No item ", i, " in vector of length ", pv.cnt));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__82757 = cljs.core.aclone.call(null, node);
  if(cljs.core.truth_(level === 0)) {
    ret__82757[i & 31] = val;
    return ret__82757
  }else {
    var subidx__82758 = i >> level & 31;
    var ___82759 = ret__82757[subidx__82758] = do_assoc.call(null, pv, level - 5, node[subidx__82758], i, val);
    return ret__82757
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__82760 = pv.cnt - 2 >> level & 31;
  if(cljs.core.truth_(level > 5)) {
    var new_child__82761 = pop_tail.call(null, pv, level - 5, node[subidx__82760]);
    if(cljs.core.truth_(function() {
      var and__3546__auto____82762 = new_child__82761 === null;
      if(cljs.core.truth_(and__3546__auto____82762)) {
        return subidx__82760 === 0
      }else {
        return and__3546__auto____82762
      }
    }())) {
      return null
    }else {
      var ret__82763 = cljs.core.aclone.call(null, node);
      var ___82764 = ret__82763[subidx__82760] = new_child__82761;
      return ret__82763
    }
  }else {
    if(cljs.core.truth_(subidx__82760 === 0)) {
      return null
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        var ret__82765 = cljs.core.aclone.call(null, node);
        var ___82766 = ret__82765[subidx__82760] = null;
        return ret__82765
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector = function(meta, cnt, shift, root, tail) {
  this.meta = meta;
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail
};
cljs.core.PersistentVector.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82767 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup = function() {
  var G__82807 = null;
  var G__82807__82808 = function(coll, k) {
    var this__82768 = this;
    return cljs.core._nth.call(null, coll, k, null)
  };
  var G__82807__82809 = function(coll, k, not_found) {
    var this__82769 = this;
    return cljs.core._nth.call(null, coll, k, not_found)
  };
  G__82807 = function(coll, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82807__82808.call(this, coll, k);
      case 3:
        return G__82807__82809.call(this, coll, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82807
}();
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc = function(coll, k, v) {
  var this__82770 = this;
  if(cljs.core.truth_(function() {
    var and__3546__auto____82771 = 0 <= k;
    if(cljs.core.truth_(and__3546__auto____82771)) {
      return k < this__82770.cnt
    }else {
      return and__3546__auto____82771
    }
  }())) {
    if(cljs.core.truth_(cljs.core.tail_off.call(null, coll) <= k)) {
      var new_tail__82772 = cljs.core.aclone.call(null, this__82770.tail);
      new_tail__82772[k & 31] = v;
      return new cljs.core.PersistentVector(this__82770.meta, this__82770.cnt, this__82770.shift, this__82770.root, new_tail__82772)
    }else {
      return new cljs.core.PersistentVector(this__82770.meta, this__82770.cnt, this__82770.shift, cljs.core.do_assoc.call(null, coll, this__82770.shift, this__82770.root, k, v), this__82770.tail)
    }
  }else {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, k, this__82770.cnt))) {
      return cljs.core._conj.call(null, coll, v)
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        throw new Error(cljs.core.str.call(null, "Index ", k, " out of bounds  [0,", this__82770.cnt, "]"));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentVector.prototype.call = function() {
  var G__82811 = null;
  var G__82811__82812 = function(tsym82773, k) {
    var this__82775 = this;
    var tsym82773__82776 = this;
    var coll__82777 = tsym82773__82776;
    return cljs.core._lookup.call(null, coll__82777, k)
  };
  var G__82811__82813 = function(tsym82774, k, not_found) {
    var this__82778 = this;
    var tsym82774__82779 = this;
    var coll__82780 = tsym82774__82779;
    return cljs.core._lookup.call(null, coll__82780, k, not_found)
  };
  G__82811 = function(tsym82774, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82811__82812.call(this, tsym82774, k);
      case 3:
        return G__82811__82813.call(this, tsym82774, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82811
}();
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82781 = this;
  if(cljs.core.truth_(this__82781.cnt - cljs.core.tail_off.call(null, coll) < 32)) {
    var new_tail__82782 = cljs.core.aclone.call(null, this__82781.tail);
    new_tail__82782.push(o);
    return new cljs.core.PersistentVector(this__82781.meta, this__82781.cnt + 1, this__82781.shift, this__82781.root, new_tail__82782)
  }else {
    var root_overflow_QMARK___82783 = this__82781.cnt >> 5 > 1 << this__82781.shift;
    var new_shift__82784 = cljs.core.truth_(root_overflow_QMARK___82783) ? this__82781.shift + 5 : this__82781.shift;
    var new_root__82786 = cljs.core.truth_(root_overflow_QMARK___82783) ? function() {
      var n_r__82785 = cljs.core.aclone.call(null, cljs.core.PersistentVector.EMPTY_NODE);
      n_r__82785[0] = this__82781.root;
      n_r__82785[1] = cljs.core.new_path.call(null, this__82781.shift, this__82781.tail);
      return n_r__82785
    }() : cljs.core.push_tail.call(null, coll, this__82781.shift, this__82781.root, this__82781.tail);
    return new cljs.core.PersistentVector(this__82781.meta, this__82781.cnt + 1, new_shift__82784, new_root__82786, [o])
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce = function() {
  var G__82815 = null;
  var G__82815__82816 = function(v, f) {
    var this__82787 = this;
    return cljs.core.ci_reduce.call(null, v, f)
  };
  var G__82815__82817 = function(v, f, start) {
    var this__82788 = this;
    return cljs.core.ci_reduce.call(null, v, f, start)
  };
  G__82815 = function(v, f, start) {
    switch(arguments.length) {
      case 2:
        return G__82815__82816.call(this, v, f);
      case 3:
        return G__82815__82817.call(this, v, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82815
}();
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82789 = this;
  if(cljs.core.truth_(this__82789.cnt > 0)) {
    var vector_seq__82790 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(cljs.core.truth_(i < this__82789.cnt)) {
          return cljs.core.cons.call(null, cljs.core._nth.call(null, coll, i), vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__82790.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82791 = this;
  return this__82791.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek = function(coll) {
  var this__82792 = this;
  if(cljs.core.truth_(this__82792.cnt > 0)) {
    return cljs.core._nth.call(null, coll, this__82792.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop = function(coll) {
  var this__82793 = this;
  if(cljs.core.truth_(this__82793.cnt === 0)) {
    throw new Error("Can't pop empty vector");
  }else {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, 1, this__82793.cnt))) {
      return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__82793.meta)
    }else {
      if(cljs.core.truth_(1 < this__82793.cnt - cljs.core.tail_off.call(null, coll))) {
        return new cljs.core.PersistentVector(this__82793.meta, this__82793.cnt - 1, this__82793.shift, this__82793.root, cljs.core.aclone.call(null, this__82793.tail))
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          var new_tail__82794 = cljs.core.array_for.call(null, coll, this__82793.cnt - 2);
          var nr__82795 = cljs.core.pop_tail.call(null, this__82793.shift, this__82793.root);
          var new_root__82796 = cljs.core.truth_(nr__82795 === null) ? cljs.core.PersistentVector.EMPTY_NODE : nr__82795;
          var cnt_1__82797 = this__82793.cnt - 1;
          if(cljs.core.truth_(function() {
            var and__3546__auto____82798 = 5 < this__82793.shift;
            if(cljs.core.truth_(and__3546__auto____82798)) {
              return new_root__82796[1] === null
            }else {
              return and__3546__auto____82798
            }
          }())) {
            return new cljs.core.PersistentVector(this__82793.meta, cnt_1__82797, this__82793.shift - 5, new_root__82796[0], new_tail__82794)
          }else {
            return new cljs.core.PersistentVector(this__82793.meta, cnt_1__82797, this__82793.shift, new_root__82796, new_tail__82794)
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n = function(coll, n, val) {
  var this__82799 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82800 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82801 = this;
  return new cljs.core.PersistentVector(meta, this__82801.cnt, this__82801.shift, this__82801.root, this__82801.tail)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82802 = this;
  return this__82802.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth = function() {
  var G__82819 = null;
  var G__82819__82820 = function(coll, n) {
    var this__82803 = this;
    return cljs.core.array_for.call(null, coll, n)[n & 31]
  };
  var G__82819__82821 = function(coll, n, not_found) {
    var this__82804 = this;
    if(cljs.core.truth_(function() {
      var and__3546__auto____82805 = 0 <= n;
      if(cljs.core.truth_(and__3546__auto____82805)) {
        return n < this__82804.cnt
      }else {
        return and__3546__auto____82805
      }
    }())) {
      return cljs.core._nth.call(null, coll, n)
    }else {
      return not_found
    }
  };
  G__82819 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82819__82820.call(this, coll, n);
      case 3:
        return G__82819__82821.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82819
}();
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82806 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__82806.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = new Array(32);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, []);
cljs.core.PersistentVector.fromArray = function(xs) {
  return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, xs)
};
cljs.core.vec = function vec(coll) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.PersistentVector.EMPTY, coll)
};
cljs.core.vector = function() {
  var vector__delegate = function(args) {
    return cljs.core.vec.call(null, args)
  };
  var vector = function(var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return vector__delegate.call(this, args)
  };
  vector.cljs$lang$maxFixedArity = 0;
  vector.cljs$lang$applyTo = function(arglist__82823) {
    var args = cljs.core.seq(arglist__82823);
    return vector__delegate.call(this, args)
  };
  return vector
}();
cljs.core.Subvec = function(meta, v, start, end) {
  this.meta = meta;
  this.v = v;
  this.start = start;
  this.end = end
};
cljs.core.Subvec.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$ = true;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82824 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup = function() {
  var G__82852 = null;
  var G__82852__82853 = function(coll, k) {
    var this__82825 = this;
    return cljs.core._nth.call(null, coll, k, null)
  };
  var G__82852__82854 = function(coll, k, not_found) {
    var this__82826 = this;
    return cljs.core._nth.call(null, coll, k, not_found)
  };
  G__82852 = function(coll, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82852__82853.call(this, coll, k);
      case 3:
        return G__82852__82854.call(this, coll, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82852
}();
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc = function(coll, key, val) {
  var this__82827 = this;
  var v_pos__82828 = this__82827.start + key;
  return new cljs.core.Subvec(this__82827.meta, cljs.core._assoc.call(null, this__82827.v, v_pos__82828, val), this__82827.start, this__82827.end > v_pos__82828 + 1 ? this__82827.end : v_pos__82828 + 1)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = function() {
  var G__82856 = null;
  var G__82856__82857 = function(tsym82829, k) {
    var this__82831 = this;
    var tsym82829__82832 = this;
    var coll__82833 = tsym82829__82832;
    return cljs.core._lookup.call(null, coll__82833, k)
  };
  var G__82856__82858 = function(tsym82830, k, not_found) {
    var this__82834 = this;
    var tsym82830__82835 = this;
    var coll__82836 = tsym82830__82835;
    return cljs.core._lookup.call(null, coll__82836, k, not_found)
  };
  G__82856 = function(tsym82830, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82856__82857.call(this, tsym82830, k);
      case 3:
        return G__82856__82858.call(this, tsym82830, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82856
}();
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82837 = this;
  return new cljs.core.Subvec(this__82837.meta, cljs.core._assoc_n.call(null, this__82837.v, this__82837.end, o), this__82837.start, this__82837.end + 1)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce = function() {
  var G__82860 = null;
  var G__82860__82861 = function(coll, f) {
    var this__82838 = this;
    return cljs.core.ci_reduce.call(null, coll, f)
  };
  var G__82860__82862 = function(coll, f, start) {
    var this__82839 = this;
    return cljs.core.ci_reduce.call(null, coll, f, start)
  };
  G__82860 = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return G__82860__82861.call(this, coll, f);
      case 3:
        return G__82860__82862.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82860
}();
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82840 = this;
  var subvec_seq__82841 = function subvec_seq(i) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, i, this__82840.end))) {
      return null
    }else {
      return cljs.core.cons.call(null, cljs.core._nth.call(null, this__82840.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }))
    }
  };
  return subvec_seq__82841.call(null, this__82840.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82842 = this;
  return this__82842.end - this__82842.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek = function(coll) {
  var this__82843 = this;
  return cljs.core._nth.call(null, this__82843.v, this__82843.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop = function(coll) {
  var this__82844 = this;
  if(cljs.core.truth_(cljs.core._EQ_.call(null, this__82844.start, this__82844.end))) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__82844.meta, this__82844.v, this__82844.start, this__82844.end - 1)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n = function(coll, n, val) {
  var this__82845 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82846 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82847 = this;
  return new cljs.core.Subvec(meta, this__82847.v, this__82847.start, this__82847.end)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82848 = this;
  return this__82848.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth = function() {
  var G__82864 = null;
  var G__82864__82865 = function(coll, n) {
    var this__82849 = this;
    return cljs.core._nth.call(null, this__82849.v, this__82849.start + n)
  };
  var G__82864__82866 = function(coll, n, not_found) {
    var this__82850 = this;
    return cljs.core._nth.call(null, this__82850.v, this__82850.start + n, not_found)
  };
  G__82864 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82864__82865.call(this, coll, n);
      case 3:
        return G__82864__82866.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82864
}();
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82851 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__82851.meta)
};
cljs.core.Subvec;
cljs.core.subvec = function() {
  var subvec = null;
  var subvec__82868 = function(v, start) {
    return subvec.call(null, v, start, cljs.core.count.call(null, v))
  };
  var subvec__82869 = function(v, start, end) {
    return new cljs.core.Subvec(null, v, start, end)
  };
  subvec = function(v, start, end) {
    switch(arguments.length) {
      case 2:
        return subvec__82868.call(this, v, start);
      case 3:
        return subvec__82869.call(this, v, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return subvec
}();
cljs.core.PersistentQueueSeq = function(meta, front, rear) {
  this.meta = meta;
  this.front = front;
  this.rear = rear
};
cljs.core.PersistentQueueSeq.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82871 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82872 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82873 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82874 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__82874.meta)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82875 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first = function(coll) {
  var this__82876 = this;
  return cljs.core._first.call(null, this__82876.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest = function(coll) {
  var this__82877 = this;
  var temp__3695__auto____82878 = cljs.core.next.call(null, this__82877.front);
  if(cljs.core.truth_(temp__3695__auto____82878)) {
    var f1__82879 = temp__3695__auto____82878;
    return new cljs.core.PersistentQueueSeq(this__82877.meta, f1__82879, this__82877.rear)
  }else {
    if(cljs.core.truth_(this__82877.rear === null)) {
      return cljs.core._empty.call(null, coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__82877.meta, this__82877.rear, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82880 = this;
  return this__82880.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82881 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__82881.front, this__82881.rear)
};
cljs.core.PersistentQueueSeq;
cljs.core.PersistentQueue = function(meta, count, front, rear) {
  this.meta = meta;
  this.count = count;
  this.front = front;
  this.rear = rear
};
cljs.core.PersistentQueue.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82882 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__82883 = this;
  if(cljs.core.truth_(this__82883.front)) {
    return new cljs.core.PersistentQueue(this__82883.meta, this__82883.count + 1, this__82883.front, cljs.core.conj.call(null, function() {
      var or__3548__auto____82884 = this__82883.rear;
      if(cljs.core.truth_(or__3548__auto____82884)) {
        return or__3548__auto____82884
      }else {
        return cljs.core.PersistentVector.fromArray([])
      }
    }(), o))
  }else {
    return new cljs.core.PersistentQueue(this__82883.meta, this__82883.count + 1, cljs.core.conj.call(null, this__82883.front, o), cljs.core.PersistentVector.fromArray([]))
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82885 = this;
  var rear__82886 = cljs.core.seq.call(null, this__82885.rear);
  if(cljs.core.truth_(function() {
    var or__3548__auto____82887 = this__82885.front;
    if(cljs.core.truth_(or__3548__auto____82887)) {
      return or__3548__auto____82887
    }else {
      return rear__82886
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__82885.front, cljs.core.seq.call(null, rear__82886))
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82888 = this;
  return this__82888.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek = function(coll) {
  var this__82889 = this;
  return cljs.core._first.call(null, this__82889.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop = function(coll) {
  var this__82890 = this;
  if(cljs.core.truth_(this__82890.front)) {
    var temp__3695__auto____82891 = cljs.core.next.call(null, this__82890.front);
    if(cljs.core.truth_(temp__3695__auto____82891)) {
      var f1__82892 = temp__3695__auto____82891;
      return new cljs.core.PersistentQueue(this__82890.meta, this__82890.count - 1, f1__82892, this__82890.rear)
    }else {
      return new cljs.core.PersistentQueue(this__82890.meta, this__82890.count - 1, cljs.core.seq.call(null, this__82890.rear), cljs.core.PersistentVector.fromArray([]))
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first = function(coll) {
  var this__82893 = this;
  return cljs.core.first.call(null, this__82893.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest = function(coll) {
  var this__82894 = this;
  return cljs.core.rest.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82895 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82896 = this;
  return new cljs.core.PersistentQueue(meta, this__82896.count, this__82896.front, this__82896.rear)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82897 = this;
  return this__82897.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82898 = this;
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.fromArray([]));
cljs.core.NeverEquiv = function() {
};
cljs.core.NeverEquiv.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = true;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv = function(o, other) {
  var this__82899 = this;
  return false
};
cljs.core.NeverEquiv;
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function equiv_map(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.truth_(cljs.core.map_QMARK_.call(null, y)) ? cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, x), cljs.core.count.call(null, y))) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(xkv) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, y, cljs.core.first.call(null, xkv), cljs.core.never_equiv), cljs.core.second.call(null, xkv))
  }, x)) : null : null)
};
cljs.core.scan_array = function scan_array(incr, k, array) {
  var len__82900 = array.length;
  var i__82901 = 0;
  while(true) {
    if(cljs.core.truth_(i__82901 < len__82900)) {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, k, array[i__82901]))) {
        return i__82901
      }else {
        var G__82902 = i__82901 + incr;
        i__82901 = G__82902;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.obj_map_contains_key_QMARK_ = function() {
  var obj_map_contains_key_QMARK_ = null;
  var obj_map_contains_key_QMARK___82904 = function(k, strobj) {
    return obj_map_contains_key_QMARK_.call(null, k, strobj, true, false)
  };
  var obj_map_contains_key_QMARK___82905 = function(k, strobj, true_val, false_val) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____82903 = goog.isString.call(null, k);
      if(cljs.core.truth_(and__3546__auto____82903)) {
        return strobj.hasOwnProperty(k)
      }else {
        return and__3546__auto____82903
      }
    }())) {
      return true_val
    }else {
      return false_val
    }
  };
  obj_map_contains_key_QMARK_ = function(k, strobj, true_val, false_val) {
    switch(arguments.length) {
      case 2:
        return obj_map_contains_key_QMARK___82904.call(this, k, strobj);
      case 4:
        return obj_map_contains_key_QMARK___82905.call(this, k, strobj, true_val, false_val)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return obj_map_contains_key_QMARK_
}();
cljs.core.obj_map_compare_keys = function obj_map_compare_keys(a, b) {
  var a__82908 = cljs.core.hash.call(null, a);
  var b__82909 = cljs.core.hash.call(null, b);
  if(cljs.core.truth_(a__82908 < b__82909)) {
    return-1
  }else {
    if(cljs.core.truth_(a__82908 > b__82909)) {
      return 1
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return 0
      }else {
        return null
      }
    }
  }
};
cljs.core.ObjMap = function(meta, keys, strobj) {
  this.meta = meta;
  this.keys = keys;
  this.strobj = strobj
};
cljs.core.ObjMap.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = true;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82910 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup = function() {
  var G__82937 = null;
  var G__82937__82938 = function(coll, k) {
    var this__82911 = this;
    return cljs.core._lookup.call(null, coll, k, null)
  };
  var G__82937__82939 = function(coll, k, not_found) {
    var this__82912 = this;
    return cljs.core.obj_map_contains_key_QMARK_.call(null, k, this__82912.strobj, this__82912.strobj[k], not_found)
  };
  G__82937 = function(coll, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82937__82938.call(this, coll, k);
      case 3:
        return G__82937__82939.call(this, coll, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82937
}();
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc = function(coll, k, v) {
  var this__82913 = this;
  if(cljs.core.truth_(goog.isString.call(null, k))) {
    var new_strobj__82914 = goog.object.clone.call(null, this__82913.strobj);
    var overwrite_QMARK___82915 = new_strobj__82914.hasOwnProperty(k);
    new_strobj__82914[k] = v;
    if(cljs.core.truth_(overwrite_QMARK___82915)) {
      return new cljs.core.ObjMap(this__82913.meta, this__82913.keys, new_strobj__82914)
    }else {
      var new_keys__82916 = cljs.core.aclone.call(null, this__82913.keys);
      new_keys__82916.push(k);
      return new cljs.core.ObjMap(this__82913.meta, new_keys__82916, new_strobj__82914)
    }
  }else {
    return cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null, k, v), cljs.core.seq.call(null, coll)), this__82913.meta)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = function(coll, k) {
  var this__82917 = this;
  return cljs.core.obj_map_contains_key_QMARK_.call(null, k, this__82917.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = function() {
  var G__82941 = null;
  var G__82941__82942 = function(tsym82918, k) {
    var this__82920 = this;
    var tsym82918__82921 = this;
    var coll__82922 = tsym82918__82921;
    return cljs.core._lookup.call(null, coll__82922, k)
  };
  var G__82941__82943 = function(tsym82919, k, not_found) {
    var this__82923 = this;
    var tsym82919__82924 = this;
    var coll__82925 = tsym82919__82924;
    return cljs.core._lookup.call(null, coll__82925, k, not_found)
  };
  G__82941 = function(tsym82919, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82941__82942.call(this, tsym82919, k);
      case 3:
        return G__82941__82943.call(this, tsym82919, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82941
}();
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj = function(coll, entry) {
  var this__82926 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry))) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82927 = this;
  if(cljs.core.truth_(this__82927.keys.length > 0)) {
    return cljs.core.map.call(null, function(p1__82907_SHARP_) {
      return cljs.core.vector.call(null, p1__82907_SHARP_, this__82927.strobj[p1__82907_SHARP_])
    }, this__82927.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82928 = this;
  return this__82928.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82929 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82930 = this;
  return new cljs.core.ObjMap(meta, this__82930.keys, this__82930.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82931 = this;
  return this__82931.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82932 = this;
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this__82932.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc = function(coll, k) {
  var this__82933 = this;
  if(cljs.core.truth_(function() {
    var and__3546__auto____82934 = goog.isString.call(null, k);
    if(cljs.core.truth_(and__3546__auto____82934)) {
      return this__82933.strobj.hasOwnProperty(k)
    }else {
      return and__3546__auto____82934
    }
  }())) {
    var new_keys__82935 = cljs.core.aclone.call(null, this__82933.keys);
    var new_strobj__82936 = goog.object.clone.call(null, this__82933.strobj);
    new_keys__82935.splice(cljs.core.scan_array.call(null, 1, k, new_keys__82935), 1);
    cljs.core.js_delete.call(null, new_strobj__82936, k);
    return new cljs.core.ObjMap(this__82933.meta, new_keys__82935, new_strobj__82936)
  }else {
    return coll
  }
};
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], cljs.core.js_obj.call(null));
cljs.core.ObjMap.fromObject = function(ks, obj) {
  return new cljs.core.ObjMap(null, ks, obj)
};
cljs.core.HashMap = function(meta, count, hashobj) {
  this.meta = meta;
  this.count = count;
  this.hashobj = hashobj
};
cljs.core.HashMap.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$ = true;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__82946 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup = function() {
  var G__82984 = null;
  var G__82984__82985 = function(coll, k) {
    var this__82947 = this;
    return cljs.core._lookup.call(null, coll, k, null)
  };
  var G__82984__82986 = function(coll, k, not_found) {
    var this__82948 = this;
    var bucket__82949 = this__82948.hashobj[cljs.core.hash.call(null, k)];
    var i__82950 = cljs.core.truth_(bucket__82949) ? cljs.core.scan_array.call(null, 2, k, bucket__82949) : null;
    if(cljs.core.truth_(i__82950)) {
      return bucket__82949[i__82950 + 1]
    }else {
      return not_found
    }
  };
  G__82984 = function(coll, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82984__82985.call(this, coll, k);
      case 3:
        return G__82984__82986.call(this, coll, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82984
}();
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc = function(coll, k, v) {
  var this__82951 = this;
  var h__82952 = cljs.core.hash.call(null, k);
  var bucket__82953 = this__82951.hashobj[h__82952];
  if(cljs.core.truth_(bucket__82953)) {
    var new_bucket__82954 = cljs.core.aclone.call(null, bucket__82953);
    var new_hashobj__82955 = goog.object.clone.call(null, this__82951.hashobj);
    new_hashobj__82955[h__82952] = new_bucket__82954;
    var temp__3695__auto____82956 = cljs.core.scan_array.call(null, 2, k, new_bucket__82954);
    if(cljs.core.truth_(temp__3695__auto____82956)) {
      var i__82957 = temp__3695__auto____82956;
      new_bucket__82954[i__82957 + 1] = v;
      return new cljs.core.HashMap(this__82951.meta, this__82951.count, new_hashobj__82955)
    }else {
      new_bucket__82954.push(k, v);
      return new cljs.core.HashMap(this__82951.meta, this__82951.count + 1, new_hashobj__82955)
    }
  }else {
    var new_hashobj__82958 = goog.object.clone.call(null, this__82951.hashobj);
    new_hashobj__82958[h__82952] = [k, v];
    return new cljs.core.HashMap(this__82951.meta, this__82951.count + 1, new_hashobj__82958)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = function(coll, k) {
  var this__82959 = this;
  var bucket__82960 = this__82959.hashobj[cljs.core.hash.call(null, k)];
  var i__82961 = cljs.core.truth_(bucket__82960) ? cljs.core.scan_array.call(null, 2, k, bucket__82960) : null;
  if(cljs.core.truth_(i__82961)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = function() {
  var G__82988 = null;
  var G__82988__82989 = function(tsym82962, k) {
    var this__82964 = this;
    var tsym82962__82965 = this;
    var coll__82966 = tsym82962__82965;
    return cljs.core._lookup.call(null, coll__82966, k)
  };
  var G__82988__82990 = function(tsym82963, k, not_found) {
    var this__82967 = this;
    var tsym82963__82968 = this;
    var coll__82969 = tsym82963__82968;
    return cljs.core._lookup.call(null, coll__82969, k, not_found)
  };
  G__82988 = function(tsym82963, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__82988__82989.call(this, tsym82963, k);
      case 3:
        return G__82988__82990.call(this, tsym82963, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__82988
}();
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj = function(coll, entry) {
  var this__82970 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry))) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__82971 = this;
  if(cljs.core.truth_(this__82971.count > 0)) {
    var hashes__82972 = cljs.core.js_keys.call(null, this__82971.hashobj).sort();
    return cljs.core.mapcat.call(null, function(p1__82945_SHARP_) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, this__82971.hashobj[p1__82945_SHARP_]))
    }, hashes__82972)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__82973 = this;
  return this__82973.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__82974 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__82975 = this;
  return new cljs.core.HashMap(meta, this__82975.count, this__82975.hashobj)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__82976 = this;
  return this__82976.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__82977 = this;
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this__82977.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc = function(coll, k) {
  var this__82978 = this;
  var h__82979 = cljs.core.hash.call(null, k);
  var bucket__82980 = this__82978.hashobj[h__82979];
  var i__82981 = cljs.core.truth_(bucket__82980) ? cljs.core.scan_array.call(null, 2, k, bucket__82980) : null;
  if(cljs.core.truth_(cljs.core.not.call(null, i__82981))) {
    return coll
  }else {
    var new_hashobj__82982 = goog.object.clone.call(null, this__82978.hashobj);
    if(cljs.core.truth_(3 > bucket__82980.length)) {
      cljs.core.js_delete.call(null, new_hashobj__82982, h__82979)
    }else {
      var new_bucket__82983 = cljs.core.aclone.call(null, bucket__82980);
      new_bucket__82983.splice(i__82981, 2);
      new_hashobj__82982[h__82979] = new_bucket__82983
    }
    return new cljs.core.HashMap(this__82978.meta, this__82978.count - 1, new_hashobj__82982)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, cljs.core.js_obj.call(null));
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__82992 = ks.length;
  var i__82993 = 0;
  var out__82994 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(cljs.core.truth_(i__82993 < len__82992)) {
      var G__82995 = i__82993 + 1;
      var G__82996 = cljs.core.assoc.call(null, out__82994, ks[i__82993], vs[i__82993]);
      i__82993 = G__82995;
      out__82994 = G__82996;
      continue
    }else {
      return out__82994
    }
    break
  }
};
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in$__82997 = cljs.core.seq.call(null, keyvals);
    var out__82998 = cljs.core.HashMap.EMPTY;
    while(true) {
      if(cljs.core.truth_(in$__82997)) {
        var G__82999 = cljs.core.nnext.call(null, in$__82997);
        var G__83000 = cljs.core.assoc.call(null, out__82998, cljs.core.first.call(null, in$__82997), cljs.core.second.call(null, in$__82997));
        in$__82997 = G__82999;
        out__82998 = G__83000;
        continue
      }else {
        return out__82998
      }
      break
    }
  };
  var hash_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return hash_map__delegate.call(this, keyvals)
  };
  hash_map.cljs$lang$maxFixedArity = 0;
  hash_map.cljs$lang$applyTo = function(arglist__83001) {
    var keyvals = cljs.core.seq(arglist__83001);
    return hash_map__delegate.call(this, keyvals)
  };
  return hash_map
}();
cljs.core.keys = function keys(hash_map) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, hash_map))
};
cljs.core.vals = function vals(hash_map) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, hash_map))
};
cljs.core.merge = function() {
  var merge__delegate = function(maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      return cljs.core.reduce.call(null, function(p1__83002_SHARP_, p2__83003_SHARP_) {
        return cljs.core.conj.call(null, function() {
          var or__3548__auto____83004 = p1__83002_SHARP_;
          if(cljs.core.truth_(or__3548__auto____83004)) {
            return or__3548__auto____83004
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), p2__83003_SHARP_)
      }, maps)
    }else {
      return null
    }
  };
  var merge = function(var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return merge__delegate.call(this, maps)
  };
  merge.cljs$lang$maxFixedArity = 0;
  merge.cljs$lang$applyTo = function(arglist__83005) {
    var maps = cljs.core.seq(arglist__83005);
    return merge__delegate.call(this, maps)
  };
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      var merge_entry__83008 = function(m, e) {
        var k__83006 = cljs.core.first.call(null, e);
        var v__83007 = cljs.core.second.call(null, e);
        if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, m, k__83006))) {
          return cljs.core.assoc.call(null, m, k__83006, f.call(null, cljs.core.get.call(null, m, k__83006), v__83007))
        }else {
          return cljs.core.assoc.call(null, m, k__83006, v__83007)
        }
      };
      var merge2__83010 = function(m1, m2) {
        return cljs.core.reduce.call(null, merge_entry__83008, function() {
          var or__3548__auto____83009 = m1;
          if(cljs.core.truth_(or__3548__auto____83009)) {
            return or__3548__auto____83009
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), cljs.core.seq.call(null, m2))
      };
      return cljs.core.reduce.call(null, merge2__83010, maps)
    }else {
      return null
    }
  };
  var merge_with = function(f, var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return merge_with__delegate.call(this, f, maps)
  };
  merge_with.cljs$lang$maxFixedArity = 1;
  merge_with.cljs$lang$applyTo = function(arglist__83011) {
    var f = cljs.core.first(arglist__83011);
    var maps = cljs.core.rest(arglist__83011);
    return merge_with__delegate.call(this, f, maps)
  };
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__83013 = cljs.core.ObjMap.fromObject([], {});
  var keys__83014 = cljs.core.seq.call(null, keyseq);
  while(true) {
    if(cljs.core.truth_(keys__83014)) {
      var key__83015 = cljs.core.first.call(null, keys__83014);
      var entry__83016 = cljs.core.get.call(null, map, key__83015, "\ufdd0'user/not-found");
      var G__83017 = cljs.core.truth_(cljs.core.not_EQ_.call(null, entry__83016, "\ufdd0'user/not-found")) ? cljs.core.assoc.call(null, ret__83013, key__83015, entry__83016) : ret__83013;
      var G__83018 = cljs.core.next.call(null, keys__83014);
      ret__83013 = G__83017;
      keys__83014 = G__83018;
      continue
    }else {
      return ret__83013
    }
    break
  }
};
cljs.core.Set = function(meta, hash_map) {
  this.meta = meta;
  this.hash_map = hash_map
};
cljs.core.Set.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Set")
};
cljs.core.Set.prototype.cljs$core$IHash$ = true;
cljs.core.Set.prototype.cljs$core$IHash$_hash = function(coll) {
  var this__83019 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.Set.prototype.cljs$core$ILookup$ = true;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup = function() {
  var G__83040 = null;
  var G__83040__83041 = function(coll, v) {
    var this__83020 = this;
    return cljs.core._lookup.call(null, coll, v, null)
  };
  var G__83040__83042 = function(coll, v, not_found) {
    var this__83021 = this;
    if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__83021.hash_map, v))) {
      return v
    }else {
      return not_found
    }
  };
  G__83040 = function(coll, v, not_found) {
    switch(arguments.length) {
      case 2:
        return G__83040__83041.call(this, coll, v);
      case 3:
        return G__83040__83042.call(this, coll, v, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83040
}();
cljs.core.Set.prototype.cljs$core$IFn$ = true;
cljs.core.Set.prototype.call = function() {
  var G__83044 = null;
  var G__83044__83045 = function(tsym83022, k) {
    var this__83024 = this;
    var tsym83022__83025 = this;
    var coll__83026 = tsym83022__83025;
    return cljs.core._lookup.call(null, coll__83026, k)
  };
  var G__83044__83046 = function(tsym83023, k, not_found) {
    var this__83027 = this;
    var tsym83023__83028 = this;
    var coll__83029 = tsym83023__83028;
    return cljs.core._lookup.call(null, coll__83029, k, not_found)
  };
  G__83044 = function(tsym83023, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__83044__83045.call(this, tsym83023, k);
      case 3:
        return G__83044__83046.call(this, tsym83023, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83044
}();
cljs.core.Set.prototype.cljs$core$ICollection$ = true;
cljs.core.Set.prototype.cljs$core$ICollection$_conj = function(coll, o) {
  var this__83030 = this;
  return new cljs.core.Set(this__83030.meta, cljs.core.assoc.call(null, this__83030.hash_map, o, null))
};
cljs.core.Set.prototype.cljs$core$ISeqable$ = true;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq = function(coll) {
  var this__83031 = this;
  return cljs.core.keys.call(null, this__83031.hash_map)
};
cljs.core.Set.prototype.cljs$core$ISet$ = true;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin = function(coll, v) {
  var this__83032 = this;
  return new cljs.core.Set(this__83032.meta, cljs.core.dissoc.call(null, this__83032.hash_map, v))
};
cljs.core.Set.prototype.cljs$core$ICounted$ = true;
cljs.core.Set.prototype.cljs$core$ICounted$_count = function(coll) {
  var this__83033 = this;
  return cljs.core.count.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.Set.prototype.cljs$core$IEquiv$ = true;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv = function(coll, other) {
  var this__83034 = this;
  var and__3546__auto____83035 = cljs.core.set_QMARK_.call(null, other);
  if(cljs.core.truth_(and__3546__auto____83035)) {
    var and__3546__auto____83036 = cljs.core._EQ_.call(null, cljs.core.count.call(null, coll), cljs.core.count.call(null, other));
    if(cljs.core.truth_(and__3546__auto____83036)) {
      return cljs.core.every_QMARK_.call(null, function(p1__83012_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__83012_SHARP_)
      }, other)
    }else {
      return and__3546__auto____83036
    }
  }else {
    return and__3546__auto____83035
  }
};
cljs.core.Set.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta = function(coll, meta) {
  var this__83037 = this;
  return new cljs.core.Set(meta, this__83037.hash_map)
};
cljs.core.Set.prototype.cljs$core$IMeta$ = true;
cljs.core.Set.prototype.cljs$core$IMeta$_meta = function(coll) {
  var this__83038 = this;
  return this__83038.meta
};
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty = function(coll) {
  var this__83039 = this;
  return cljs.core.with_meta.call(null, cljs.core.Set.EMPTY, this__83039.meta)
};
cljs.core.Set;
cljs.core.Set.EMPTY = new cljs.core.Set(null, cljs.core.hash_map.call(null));
cljs.core.set = function set(coll) {
  var in$__83049 = cljs.core.seq.call(null, coll);
  var out__83050 = cljs.core.Set.EMPTY;
  while(true) {
    if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_.call(null, in$__83049)))) {
      var G__83051 = cljs.core.rest.call(null, in$__83049);
      var G__83052 = cljs.core.conj.call(null, out__83050, cljs.core.first.call(null, in$__83049));
      in$__83049 = G__83051;
      out__83050 = G__83052;
      continue
    }else {
      return out__83050
    }
    break
  }
};
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, coll))) {
    var n__83053 = cljs.core.count.call(null, coll);
    return cljs.core.reduce.call(null, function(v, i) {
      var temp__3695__auto____83054 = cljs.core.find.call(null, smap, cljs.core.nth.call(null, v, i));
      if(cljs.core.truth_(temp__3695__auto____83054)) {
        var e__83055 = temp__3695__auto____83054;
        return cljs.core.assoc.call(null, v, i, cljs.core.second.call(null, e__83055))
      }else {
        return v
      }
    }, coll, cljs.core.take.call(null, n__83053, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }else {
    return cljs.core.map.call(null, function(p1__83048_SHARP_) {
      var temp__3695__auto____83056 = cljs.core.find.call(null, smap, p1__83048_SHARP_);
      if(cljs.core.truth_(temp__3695__auto____83056)) {
        var e__83057 = temp__3695__auto____83056;
        return cljs.core.second.call(null, e__83057)
      }else {
        return p1__83048_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__83065 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__83058, seen) {
        while(true) {
          var vec__83059__83060 = p__83058;
          var f__83061 = cljs.core.nth.call(null, vec__83059__83060, 0, null);
          var xs__83062 = vec__83059__83060;
          var temp__3698__auto____83063 = cljs.core.seq.call(null, xs__83062);
          if(cljs.core.truth_(temp__3698__auto____83063)) {
            var s__83064 = temp__3698__auto____83063;
            if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, seen, f__83061))) {
              var G__83066 = cljs.core.rest.call(null, s__83064);
              var G__83067 = seen;
              p__83058 = G__83066;
              seen = G__83067;
              continue
            }else {
              return cljs.core.cons.call(null, f__83061, step.call(null, cljs.core.rest.call(null, s__83064), cljs.core.conj.call(null, seen, f__83061)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    })
  };
  return step__83065.call(null, coll, cljs.core.set([]))
};
cljs.core.butlast = function butlast(s) {
  var ret__83068 = cljs.core.PersistentVector.fromArray([]);
  var s__83069 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.next.call(null, s__83069))) {
      var G__83070 = cljs.core.conj.call(null, ret__83068, cljs.core.first.call(null, s__83069));
      var G__83071 = cljs.core.next.call(null, s__83069);
      ret__83068 = G__83070;
      s__83069 = G__83071;
      continue
    }else {
      return cljs.core.seq.call(null, ret__83068)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.truth_(cljs.core.string_QMARK_.call(null, x))) {
    return x
  }else {
    if(cljs.core.truth_(function() {
      var or__3548__auto____83072 = cljs.core.keyword_QMARK_.call(null, x);
      if(cljs.core.truth_(or__3548__auto____83072)) {
        return or__3548__auto____83072
      }else {
        return cljs.core.symbol_QMARK_.call(null, x)
      }
    }())) {
      var i__83073 = x.lastIndexOf("/");
      if(cljs.core.truth_(i__83073 < 0)) {
        return cljs.core.subs.call(null, x, 2)
      }else {
        return cljs.core.subs.call(null, x, i__83073 + 1)
      }
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        throw new Error(cljs.core.str.call(null, "Doesn't support name: ", x));
      }else {
        return null
      }
    }
  }
};
cljs.core.namespace = function namespace(x) {
  if(cljs.core.truth_(function() {
    var or__3548__auto____83074 = cljs.core.keyword_QMARK_.call(null, x);
    if(cljs.core.truth_(or__3548__auto____83074)) {
      return or__3548__auto____83074
    }else {
      return cljs.core.symbol_QMARK_.call(null, x)
    }
  }())) {
    var i__83075 = x.lastIndexOf("/");
    if(cljs.core.truth_(i__83075 > -1)) {
      return cljs.core.subs.call(null, x, 2, i__83075)
    }else {
      return null
    }
  }else {
    throw new Error(cljs.core.str.call(null, "Doesn't support namespace: ", x));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__83078 = cljs.core.ObjMap.fromObject([], {});
  var ks__83079 = cljs.core.seq.call(null, keys);
  var vs__83080 = cljs.core.seq.call(null, vals);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83081 = ks__83079;
      if(cljs.core.truth_(and__3546__auto____83081)) {
        return vs__83080
      }else {
        return and__3546__auto____83081
      }
    }())) {
      var G__83082 = cljs.core.assoc.call(null, map__83078, cljs.core.first.call(null, ks__83079), cljs.core.first.call(null, vs__83080));
      var G__83083 = cljs.core.next.call(null, ks__83079);
      var G__83084 = cljs.core.next.call(null, vs__83080);
      map__83078 = G__83082;
      ks__83079 = G__83083;
      vs__83080 = G__83084;
      continue
    }else {
      return map__83078
    }
    break
  }
};
cljs.core.max_key = function() {
  var max_key = null;
  var max_key__83087 = function(k, x) {
    return x
  };
  var max_key__83088 = function(k, x, y) {
    if(cljs.core.truth_(k.call(null, x) > k.call(null, y))) {
      return x
    }else {
      return y
    }
  };
  var max_key__83089 = function() {
    var G__83091__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__83076_SHARP_, p2__83077_SHARP_) {
        return max_key.call(null, k, p1__83076_SHARP_, p2__83077_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__83091 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__83091__delegate.call(this, k, x, y, more)
    };
    G__83091.cljs$lang$maxFixedArity = 3;
    G__83091.cljs$lang$applyTo = function(arglist__83092) {
      var k = cljs.core.first(arglist__83092);
      var x = cljs.core.first(cljs.core.next(arglist__83092));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83092)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83092)));
      return G__83091__delegate.call(this, k, x, y, more)
    };
    return G__83091
  }();
  max_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return max_key__83087.call(this, k, x);
      case 3:
        return max_key__83088.call(this, k, x, y);
      default:
        return max_key__83089.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  max_key.cljs$lang$maxFixedArity = 3;
  max_key.cljs$lang$applyTo = max_key__83089.cljs$lang$applyTo;
  return max_key
}();
cljs.core.min_key = function() {
  var min_key = null;
  var min_key__83093 = function(k, x) {
    return x
  };
  var min_key__83094 = function(k, x, y) {
    if(cljs.core.truth_(k.call(null, x) < k.call(null, y))) {
      return x
    }else {
      return y
    }
  };
  var min_key__83095 = function() {
    var G__83097__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__83085_SHARP_, p2__83086_SHARP_) {
        return min_key.call(null, k, p1__83085_SHARP_, p2__83086_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__83097 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__83097__delegate.call(this, k, x, y, more)
    };
    G__83097.cljs$lang$maxFixedArity = 3;
    G__83097.cljs$lang$applyTo = function(arglist__83098) {
      var k = cljs.core.first(arglist__83098);
      var x = cljs.core.first(cljs.core.next(arglist__83098));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83098)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83098)));
      return G__83097__delegate.call(this, k, x, y, more)
    };
    return G__83097
  }();
  min_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return min_key__83093.call(this, k, x);
      case 3:
        return min_key__83094.call(this, k, x, y);
      default:
        return min_key__83095.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  min_key.cljs$lang$maxFixedArity = 3;
  min_key.cljs$lang$applyTo = min_key__83095.cljs$lang$applyTo;
  return min_key
}();
cljs.core.partition_all = function() {
  var partition_all = null;
  var partition_all__83101 = function(n, coll) {
    return partition_all.call(null, n, n, coll)
  };
  var partition_all__83102 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____83099 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____83099)) {
        var s__83100 = temp__3698__auto____83099;
        return cljs.core.cons.call(null, cljs.core.take.call(null, n, s__83100), partition_all.call(null, n, step, cljs.core.drop.call(null, step, s__83100)))
      }else {
        return null
      }
    })
  };
  partition_all = function(n, step, coll) {
    switch(arguments.length) {
      case 2:
        return partition_all__83101.call(this, n, step);
      case 3:
        return partition_all__83102.call(this, n, step, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return partition_all
}();
cljs.core.take_while = function take_while(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3698__auto____83104 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3698__auto____83104)) {
      var s__83105 = temp__3698__auto____83104;
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, s__83105)))) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__83105), take_while.call(null, pred, cljs.core.rest.call(null, s__83105)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.Range = function(meta, start, end, step) {
  this.meta = meta;
  this.start = start;
  this.end = end;
  this.step = step
};
cljs.core.Range.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Range")
};
cljs.core.Range.prototype.cljs$core$IHash$ = true;
cljs.core.Range.prototype.cljs$core$IHash$_hash = function(rng) {
  var this__83106 = this;
  return cljs.core.hash_coll.call(null, rng)
};
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj = function(rng, o) {
  var this__83107 = this;
  return cljs.core.cons.call(null, o, rng)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce = function() {
  var G__83123 = null;
  var G__83123__83124 = function(rng, f) {
    var this__83108 = this;
    return cljs.core.ci_reduce.call(null, rng, f)
  };
  var G__83123__83125 = function(rng, f, s) {
    var this__83109 = this;
    return cljs.core.ci_reduce.call(null, rng, f, s)
  };
  G__83123 = function(rng, f, s) {
    switch(arguments.length) {
      case 2:
        return G__83123__83124.call(this, rng, f);
      case 3:
        return G__83123__83125.call(this, rng, f, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83123
}();
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq = function(rng) {
  var this__83110 = this;
  var comp__83111 = cljs.core.truth_(this__83110.step > 0) ? cljs.core._LT_ : cljs.core._GT_;
  if(cljs.core.truth_(comp__83111.call(null, this__83110.start, this__83110.end))) {
    return rng
  }else {
    return null
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count = function(rng) {
  var this__83112 = this;
  if(cljs.core.truth_(cljs.core.not.call(null, cljs.core._seq.call(null, rng)))) {
    return 0
  }else {
    return Math["ceil"].call(null, (this__83112.end - this__83112.start) / this__83112.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first = function(rng) {
  var this__83113 = this;
  return this__83113.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest = function(rng) {
  var this__83114 = this;
  if(cljs.core.truth_(cljs.core._seq.call(null, rng))) {
    return new cljs.core.Range(this__83114.meta, this__83114.start + this__83114.step, this__83114.end, this__83114.step)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv = function(rng, other) {
  var this__83115 = this;
  return cljs.core.equiv_sequential.call(null, rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta = function(rng, meta) {
  var this__83116 = this;
  return new cljs.core.Range(meta, this__83116.start, this__83116.end, this__83116.step)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta = function(rng) {
  var this__83117 = this;
  return this__83117.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth = function() {
  var G__83127 = null;
  var G__83127__83128 = function(rng, n) {
    var this__83118 = this;
    if(cljs.core.truth_(n < cljs.core._count.call(null, rng))) {
      return this__83118.start + n * this__83118.step
    }else {
      if(cljs.core.truth_(function() {
        var and__3546__auto____83119 = this__83118.start > this__83118.end;
        if(cljs.core.truth_(and__3546__auto____83119)) {
          return cljs.core._EQ_.call(null, this__83118.step, 0)
        }else {
          return and__3546__auto____83119
        }
      }())) {
        return this__83118.start
      }else {
        throw new Error("Index out of bounds");
      }
    }
  };
  var G__83127__83129 = function(rng, n, not_found) {
    var this__83120 = this;
    if(cljs.core.truth_(n < cljs.core._count.call(null, rng))) {
      return this__83120.start + n * this__83120.step
    }else {
      if(cljs.core.truth_(function() {
        var and__3546__auto____83121 = this__83120.start > this__83120.end;
        if(cljs.core.truth_(and__3546__auto____83121)) {
          return cljs.core._EQ_.call(null, this__83120.step, 0)
        }else {
          return and__3546__auto____83121
        }
      }())) {
        return this__83120.start
      }else {
        return not_found
      }
    }
  };
  G__83127 = function(rng, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__83127__83128.call(this, rng, n);
      case 3:
        return G__83127__83129.call(this, rng, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83127
}();
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty = function(rng) {
  var this__83122 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__83122.meta)
};
cljs.core.Range;
cljs.core.range = function() {
  var range = null;
  var range__83131 = function() {
    return range.call(null, 0, Number["MAX_VALUE"], 1)
  };
  var range__83132 = function(end) {
    return range.call(null, 0, end, 1)
  };
  var range__83133 = function(start, end) {
    return range.call(null, start, end, 1)
  };
  var range__83134 = function(start, end, step) {
    return new cljs.core.Range(null, start, end, step)
  };
  range = function(start, end, step) {
    switch(arguments.length) {
      case 0:
        return range__83131.call(this);
      case 1:
        return range__83132.call(this, start);
      case 2:
        return range__83133.call(this, start, end);
      case 3:
        return range__83134.call(this, start, end, step)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return range
}();
cljs.core.take_nth = function take_nth(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3698__auto____83136 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3698__auto____83136)) {
      var s__83137 = temp__3698__auto____83136;
      return cljs.core.cons.call(null, cljs.core.first.call(null, s__83137), take_nth.call(null, n, cljs.core.drop.call(null, n, s__83137)))
    }else {
      return null
    }
  })
};
cljs.core.split_with = function split_with(pred, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null, pred, coll), cljs.core.drop_while.call(null, pred, coll)])
};
cljs.core.partition_by = function partition_by(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3698__auto____83139 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__3698__auto____83139)) {
      var s__83140 = temp__3698__auto____83139;
      var fst__83141 = cljs.core.first.call(null, s__83140);
      var fv__83142 = f.call(null, fst__83141);
      var run__83143 = cljs.core.cons.call(null, fst__83141, cljs.core.take_while.call(null, function(p1__83138_SHARP_) {
        return cljs.core._EQ_.call(null, fv__83142, f.call(null, p1__83138_SHARP_))
      }, cljs.core.next.call(null, s__83140)));
      return cljs.core.cons.call(null, run__83143, partition_by.call(null, f, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, run__83143), s__83140))))
    }else {
      return null
    }
  })
};
cljs.core.frequencies = function frequencies(coll) {
  return cljs.core.reduce.call(null, function(counts, x) {
    return cljs.core.assoc.call(null, counts, x, cljs.core.get.call(null, counts, x, 0) + 1)
  }, cljs.core.ObjMap.fromObject([], {}), coll)
};
cljs.core.reductions = function() {
  var reductions = null;
  var reductions__83158 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3695__auto____83154 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3695__auto____83154)) {
        var s__83155 = temp__3695__auto____83154;
        return reductions.call(null, f, cljs.core.first.call(null, s__83155), cljs.core.rest.call(null, s__83155))
      }else {
        return cljs.core.list.call(null, f.call(null))
      }
    })
  };
  var reductions__83159 = function(f, init, coll) {
    return cljs.core.cons.call(null, init, new cljs.core.LazySeq(null, false, function() {
      var temp__3698__auto____83156 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__3698__auto____83156)) {
        var s__83157 = temp__3698__auto____83156;
        return reductions.call(null, f, f.call(null, init, cljs.core.first.call(null, s__83157)), cljs.core.rest.call(null, s__83157))
      }else {
        return null
      }
    }))
  };
  reductions = function(f, init, coll) {
    switch(arguments.length) {
      case 2:
        return reductions__83158.call(this, f, init);
      case 3:
        return reductions__83159.call(this, f, init, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return reductions
}();
cljs.core.juxt = function() {
  var juxt = null;
  var juxt__83162 = function(f) {
    return function() {
      var G__83167 = null;
      var G__83167__83168 = function() {
        return cljs.core.vector.call(null, f.call(null))
      };
      var G__83167__83169 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x))
      };
      var G__83167__83170 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y))
      };
      var G__83167__83171 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z))
      };
      var G__83167__83172 = function() {
        var G__83174__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args))
        };
        var G__83174 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__83174__delegate.call(this, x, y, z, args)
        };
        G__83174.cljs$lang$maxFixedArity = 3;
        G__83174.cljs$lang$applyTo = function(arglist__83175) {
          var x = cljs.core.first(arglist__83175);
          var y = cljs.core.first(cljs.core.next(arglist__83175));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83175)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83175)));
          return G__83174__delegate.call(this, x, y, z, args)
        };
        return G__83174
      }();
      G__83167 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__83167__83168.call(this);
          case 1:
            return G__83167__83169.call(this, x);
          case 2:
            return G__83167__83170.call(this, x, y);
          case 3:
            return G__83167__83171.call(this, x, y, z);
          default:
            return G__83167__83172.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__83167.cljs$lang$maxFixedArity = 3;
      G__83167.cljs$lang$applyTo = G__83167__83172.cljs$lang$applyTo;
      return G__83167
    }()
  };
  var juxt__83163 = function(f, g) {
    return function() {
      var G__83176 = null;
      var G__83176__83177 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null))
      };
      var G__83176__83178 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x))
      };
      var G__83176__83179 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y))
      };
      var G__83176__83180 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__83176__83181 = function() {
        var G__83183__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__83183 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__83183__delegate.call(this, x, y, z, args)
        };
        G__83183.cljs$lang$maxFixedArity = 3;
        G__83183.cljs$lang$applyTo = function(arglist__83184) {
          var x = cljs.core.first(arglist__83184);
          var y = cljs.core.first(cljs.core.next(arglist__83184));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83184)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83184)));
          return G__83183__delegate.call(this, x, y, z, args)
        };
        return G__83183
      }();
      G__83176 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__83176__83177.call(this);
          case 1:
            return G__83176__83178.call(this, x);
          case 2:
            return G__83176__83179.call(this, x, y);
          case 3:
            return G__83176__83180.call(this, x, y, z);
          default:
            return G__83176__83181.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__83176.cljs$lang$maxFixedArity = 3;
      G__83176.cljs$lang$applyTo = G__83176__83181.cljs$lang$applyTo;
      return G__83176
    }()
  };
  var juxt__83164 = function(f, g, h) {
    return function() {
      var G__83185 = null;
      var G__83185__83186 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null), h.call(null))
      };
      var G__83185__83187 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__83185__83188 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__83185__83189 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__83185__83190 = function() {
        var G__83192__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args), cljs.core.apply.call(null, h, x, y, z, args))
        };
        var G__83192 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__83192__delegate.call(this, x, y, z, args)
        };
        G__83192.cljs$lang$maxFixedArity = 3;
        G__83192.cljs$lang$applyTo = function(arglist__83193) {
          var x = cljs.core.first(arglist__83193);
          var y = cljs.core.first(cljs.core.next(arglist__83193));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83193)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83193)));
          return G__83192__delegate.call(this, x, y, z, args)
        };
        return G__83192
      }();
      G__83185 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__83185__83186.call(this);
          case 1:
            return G__83185__83187.call(this, x);
          case 2:
            return G__83185__83188.call(this, x, y);
          case 3:
            return G__83185__83189.call(this, x, y, z);
          default:
            return G__83185__83190.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__83185.cljs$lang$maxFixedArity = 3;
      G__83185.cljs$lang$applyTo = G__83185__83190.cljs$lang$applyTo;
      return G__83185
    }()
  };
  var juxt__83165 = function() {
    var G__83194__delegate = function(f, g, h, fs) {
      var fs__83161 = cljs.core.list_STAR_.call(null, f, g, h, fs);
      return function() {
        var G__83195 = null;
        var G__83195__83196 = function() {
          return cljs.core.reduce.call(null, function(p1__83144_SHARP_, p2__83145_SHARP_) {
            return cljs.core.conj.call(null, p1__83144_SHARP_, p2__83145_SHARP_.call(null))
          }, cljs.core.PersistentVector.fromArray([]), fs__83161)
        };
        var G__83195__83197 = function(x) {
          return cljs.core.reduce.call(null, function(p1__83146_SHARP_, p2__83147_SHARP_) {
            return cljs.core.conj.call(null, p1__83146_SHARP_, p2__83147_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.fromArray([]), fs__83161)
        };
        var G__83195__83198 = function(x, y) {
          return cljs.core.reduce.call(null, function(p1__83148_SHARP_, p2__83149_SHARP_) {
            return cljs.core.conj.call(null, p1__83148_SHARP_, p2__83149_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.fromArray([]), fs__83161)
        };
        var G__83195__83199 = function(x, y, z) {
          return cljs.core.reduce.call(null, function(p1__83150_SHARP_, p2__83151_SHARP_) {
            return cljs.core.conj.call(null, p1__83150_SHARP_, p2__83151_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.fromArray([]), fs__83161)
        };
        var G__83195__83200 = function() {
          var G__83202__delegate = function(x, y, z, args) {
            return cljs.core.reduce.call(null, function(p1__83152_SHARP_, p2__83153_SHARP_) {
              return cljs.core.conj.call(null, p1__83152_SHARP_, cljs.core.apply.call(null, p2__83153_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.fromArray([]), fs__83161)
          };
          var G__83202 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__83202__delegate.call(this, x, y, z, args)
          };
          G__83202.cljs$lang$maxFixedArity = 3;
          G__83202.cljs$lang$applyTo = function(arglist__83203) {
            var x = cljs.core.first(arglist__83203);
            var y = cljs.core.first(cljs.core.next(arglist__83203));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83203)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83203)));
            return G__83202__delegate.call(this, x, y, z, args)
          };
          return G__83202
        }();
        G__83195 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__83195__83196.call(this);
            case 1:
              return G__83195__83197.call(this, x);
            case 2:
              return G__83195__83198.call(this, x, y);
            case 3:
              return G__83195__83199.call(this, x, y, z);
            default:
              return G__83195__83200.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__83195.cljs$lang$maxFixedArity = 3;
        G__83195.cljs$lang$applyTo = G__83195__83200.cljs$lang$applyTo;
        return G__83195
      }()
    };
    var G__83194 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__83194__delegate.call(this, f, g, h, fs)
    };
    G__83194.cljs$lang$maxFixedArity = 3;
    G__83194.cljs$lang$applyTo = function(arglist__83204) {
      var f = cljs.core.first(arglist__83204);
      var g = cljs.core.first(cljs.core.next(arglist__83204));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83204)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__83204)));
      return G__83194__delegate.call(this, f, g, h, fs)
    };
    return G__83194
  }();
  juxt = function(f, g, h, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 1:
        return juxt__83162.call(this, f);
      case 2:
        return juxt__83163.call(this, f, g);
      case 3:
        return juxt__83164.call(this, f, g, h);
      default:
        return juxt__83165.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  juxt.cljs$lang$maxFixedArity = 3;
  juxt.cljs$lang$applyTo = juxt__83165.cljs$lang$applyTo;
  return juxt
}();
cljs.core.dorun = function() {
  var dorun = null;
  var dorun__83206 = function(coll) {
    while(true) {
      if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
        var G__83209 = cljs.core.next.call(null, coll);
        coll = G__83209;
        continue
      }else {
        return null
      }
      break
    }
  };
  var dorun__83207 = function(n, coll) {
    while(true) {
      if(cljs.core.truth_(function() {
        var and__3546__auto____83205 = cljs.core.seq.call(null, coll);
        if(cljs.core.truth_(and__3546__auto____83205)) {
          return n > 0
        }else {
          return and__3546__auto____83205
        }
      }())) {
        var G__83210 = n - 1;
        var G__83211 = cljs.core.next.call(null, coll);
        n = G__83210;
        coll = G__83211;
        continue
      }else {
        return null
      }
      break
    }
  };
  dorun = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return dorun__83206.call(this, n);
      case 2:
        return dorun__83207.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return dorun
}();
cljs.core.doall = function() {
  var doall = null;
  var doall__83212 = function(coll) {
    cljs.core.dorun.call(null, coll);
    return coll
  };
  var doall__83213 = function(n, coll) {
    cljs.core.dorun.call(null, n, coll);
    return coll
  };
  doall = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return doall__83212.call(this, n);
      case 2:
        return doall__83213.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return doall
}();
cljs.core.re_matches = function re_matches(re, s) {
  var matches__83215 = re.exec(s);
  if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.first.call(null, matches__83215), s))) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, matches__83215), 1))) {
      return cljs.core.first.call(null, matches__83215)
    }else {
      return cljs.core.vec.call(null, matches__83215)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__83216 = re.exec(s);
  if(cljs.core.truth_(matches__83216 === null)) {
    return null
  }else {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, matches__83216), 1))) {
      return cljs.core.first.call(null, matches__83216)
    }else {
      return cljs.core.vec.call(null, matches__83216)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__83217 = cljs.core.re_find.call(null, re, s);
  var match_idx__83218 = s.search(re);
  var match_str__83219 = cljs.core.truth_(cljs.core.coll_QMARK_.call(null, match_data__83217)) ? cljs.core.first.call(null, match_data__83217) : match_data__83217;
  var post_match__83220 = cljs.core.subs.call(null, s, match_idx__83218 + cljs.core.count.call(null, match_str__83219));
  if(cljs.core.truth_(match_data__83217)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, match_data__83217, re_seq.call(null, re, post_match__83220))
    })
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__83222__83223 = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___83224 = cljs.core.nth.call(null, vec__83222__83223, 0, null);
  var flags__83225 = cljs.core.nth.call(null, vec__83222__83223, 1, null);
  var pattern__83226 = cljs.core.nth.call(null, vec__83222__83223, 2, null);
  return new RegExp(pattern__83226, flags__83225)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([begin]), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.PersistentVector.fromArray([sep]), cljs.core.map.call(null, function(p1__83221_SHARP_) {
    return print_one.call(null, p1__83221_SHARP_, opts)
  }, coll))), cljs.core.PersistentVector.fromArray([end]))
};
cljs.core.string_print = function string_print(x) {
  cljs.core._STAR_print_fn_STAR_.call(null, x);
  return null
};
cljs.core.flush = function flush() {
  return null
};
cljs.core.pr_seq = function pr_seq(obj, opts) {
  if(cljs.core.truth_(obj === null)) {
    return cljs.core.list.call(null, "nil")
  }else {
    if(cljs.core.truth_(void 0 === obj)) {
      return cljs.core.list.call(null, "#<undefined>")
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return cljs.core.concat.call(null, cljs.core.truth_(function() {
          var and__3546__auto____83227 = cljs.core.get.call(null, opts, "\ufdd0'meta");
          if(cljs.core.truth_(and__3546__auto____83227)) {
            var and__3546__auto____83231 = function() {
              var x__451__auto____83228 = obj;
              if(cljs.core.truth_(function() {
                var and__3546__auto____83229 = x__451__auto____83228;
                if(cljs.core.truth_(and__3546__auto____83229)) {
                  var and__3546__auto____83230 = x__451__auto____83228.cljs$core$IMeta$;
                  if(cljs.core.truth_(and__3546__auto____83230)) {
                    return cljs.core.not.call(null, x__451__auto____83228.hasOwnProperty("cljs$core$IMeta$"))
                  }else {
                    return and__3546__auto____83230
                  }
                }else {
                  return and__3546__auto____83229
                }
              }())) {
                return true
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, x__451__auto____83228)
              }
            }();
            if(cljs.core.truth_(and__3546__auto____83231)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__3546__auto____83231
            }
          }else {
            return and__3546__auto____83227
          }
        }()) ? cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta.call(null, obj), opts), cljs.core.PersistentVector.fromArray([" "])) : null, cljs.core.truth_(function() {
          var x__451__auto____83232 = obj;
          if(cljs.core.truth_(function() {
            var and__3546__auto____83233 = x__451__auto____83232;
            if(cljs.core.truth_(and__3546__auto____83233)) {
              var and__3546__auto____83234 = x__451__auto____83232.cljs$core$IPrintable$;
              if(cljs.core.truth_(and__3546__auto____83234)) {
                return cljs.core.not.call(null, x__451__auto____83232.hasOwnProperty("cljs$core$IPrintable$"))
              }else {
                return and__3546__auto____83234
              }
            }else {
              return and__3546__auto____83233
            }
          }())) {
            return true
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, x__451__auto____83232)
          }
        }()) ? cljs.core._pr_seq.call(null, obj, opts) : cljs.core.list.call(null, "#<", cljs.core.str.call(null, obj), ">"))
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb = function pr_sb(objs, opts) {
  var first_obj__83235 = cljs.core.first.call(null, objs);
  var sb__83236 = new goog.string.StringBuffer;
  var G__83237__83238 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__83237__83238)) {
    var obj__83239 = cljs.core.first.call(null, G__83237__83238);
    var G__83237__83240 = G__83237__83238;
    while(true) {
      if(cljs.core.truth_(obj__83239 === first_obj__83235)) {
      }else {
        sb__83236.append(" ")
      }
      var G__83241__83242 = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, obj__83239, opts));
      if(cljs.core.truth_(G__83241__83242)) {
        var string__83243 = cljs.core.first.call(null, G__83241__83242);
        var G__83241__83244 = G__83241__83242;
        while(true) {
          sb__83236.append(string__83243);
          var temp__3698__auto____83245 = cljs.core.next.call(null, G__83241__83244);
          if(cljs.core.truth_(temp__3698__auto____83245)) {
            var G__83241__83246 = temp__3698__auto____83245;
            var G__83249 = cljs.core.first.call(null, G__83241__83246);
            var G__83250 = G__83241__83246;
            string__83243 = G__83249;
            G__83241__83244 = G__83250;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__3698__auto____83247 = cljs.core.next.call(null, G__83237__83240);
      if(cljs.core.truth_(temp__3698__auto____83247)) {
        var G__83237__83248 = temp__3698__auto____83247;
        var G__83251 = cljs.core.first.call(null, G__83237__83248);
        var G__83252 = G__83237__83248;
        obj__83239 = G__83251;
        G__83237__83240 = G__83252;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return sb__83236
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  return cljs.core.str.call(null, cljs.core.pr_sb.call(null, objs, opts))
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  var sb__83253 = cljs.core.pr_sb.call(null, objs, opts);
  sb__83253.append("\n");
  return cljs.core.str.call(null, sb__83253)
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  var first_obj__83254 = cljs.core.first.call(null, objs);
  var G__83255__83256 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__83255__83256)) {
    var obj__83257 = cljs.core.first.call(null, G__83255__83256);
    var G__83255__83258 = G__83255__83256;
    while(true) {
      if(cljs.core.truth_(obj__83257 === first_obj__83254)) {
      }else {
        cljs.core.string_print.call(null, " ")
      }
      var G__83259__83260 = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, obj__83257, opts));
      if(cljs.core.truth_(G__83259__83260)) {
        var string__83261 = cljs.core.first.call(null, G__83259__83260);
        var G__83259__83262 = G__83259__83260;
        while(true) {
          cljs.core.string_print.call(null, string__83261);
          var temp__3698__auto____83263 = cljs.core.next.call(null, G__83259__83262);
          if(cljs.core.truth_(temp__3698__auto____83263)) {
            var G__83259__83264 = temp__3698__auto____83263;
            var G__83267 = cljs.core.first.call(null, G__83259__83264);
            var G__83268 = G__83259__83264;
            string__83261 = G__83267;
            G__83259__83262 = G__83268;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__3698__auto____83265 = cljs.core.next.call(null, G__83255__83258);
      if(cljs.core.truth_(temp__3698__auto____83265)) {
        var G__83255__83266 = temp__3698__auto____83265;
        var G__83269 = cljs.core.first.call(null, G__83255__83266);
        var G__83270 = G__83255__83266;
        obj__83257 = G__83269;
        G__83255__83258 = G__83270;
        continue
      }else {
        return null
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.newline = function newline(opts) {
  cljs.core.string_print.call(null, "\n");
  if(cljs.core.truth_(cljs.core.get.call(null, opts, "\ufdd0'flush-on-newline"))) {
    return cljs.core.flush.call(null)
  }else {
    return null
  }
};
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core.pr_opts = function pr_opts() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0'readably":cljs.core._STAR_print_readably_STAR_, "\ufdd0'meta":cljs.core._STAR_print_meta_STAR_, "\ufdd0'dup":cljs.core._STAR_print_dup_STAR_})
};
cljs.core.pr_str = function() {
  var pr_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var pr_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr_str__delegate.call(this, objs)
  };
  pr_str.cljs$lang$maxFixedArity = 0;
  pr_str.cljs$lang$applyTo = function(arglist__83271) {
    var objs = cljs.core.seq(arglist__83271);
    return pr_str__delegate.call(this, objs)
  };
  return pr_str
}();
cljs.core.prn_str = function() {
  var prn_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var prn_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn_str__delegate.call(this, objs)
  };
  prn_str.cljs$lang$maxFixedArity = 0;
  prn_str.cljs$lang$applyTo = function(arglist__83272) {
    var objs = cljs.core.seq(arglist__83272);
    return prn_str__delegate.call(this, objs)
  };
  return prn_str
}();
cljs.core.pr = function() {
  var pr__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var pr = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr__delegate.call(this, objs)
  };
  pr.cljs$lang$maxFixedArity = 0;
  pr.cljs$lang$applyTo = function(arglist__83273) {
    var objs = cljs.core.seq(arglist__83273);
    return pr__delegate.call(this, objs)
  };
  return pr
}();
cljs.core.print = function() {
  var cljs_core_print__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var cljs_core_print = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return cljs_core_print__delegate.call(this, objs)
  };
  cljs_core_print.cljs$lang$maxFixedArity = 0;
  cljs_core_print.cljs$lang$applyTo = function(arglist__83274) {
    var objs = cljs.core.seq(arglist__83274);
    return cljs_core_print__delegate.call(this, objs)
  };
  return cljs_core_print
}();
cljs.core.print_str = function() {
  var print_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var print_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return print_str__delegate.call(this, objs)
  };
  print_str.cljs$lang$maxFixedArity = 0;
  print_str.cljs$lang$applyTo = function(arglist__83275) {
    var objs = cljs.core.seq(arglist__83275);
    return print_str__delegate.call(this, objs)
  };
  return print_str
}();
cljs.core.println = function() {
  var println__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  };
  var println = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println__delegate.call(this, objs)
  };
  println.cljs$lang$maxFixedArity = 0;
  println.cljs$lang$applyTo = function(arglist__83276) {
    var objs = cljs.core.seq(arglist__83276);
    return println__delegate.call(this, objs)
  };
  return println
}();
cljs.core.println_str = function() {
  var println_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var println_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println_str__delegate.call(this, objs)
  };
  println_str.cljs$lang$maxFixedArity = 0;
  println_str.cljs$lang$applyTo = function(arglist__83277) {
    var objs = cljs.core.seq(arglist__83277);
    return println_str__delegate.call(this, objs)
  };
  return println_str
}();
cljs.core.prn = function() {
  var prn__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  };
  var prn = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn__delegate.call(this, objs)
  };
  prn.cljs$lang$maxFixedArity = 0;
  prn.cljs$lang$applyTo = function(arglist__83278) {
    var objs = cljs.core.seq(arglist__83278);
    return prn__delegate.call(this, objs)
  };
  return prn
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  var pr_pair__83279 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__83279, "{", ", ", "}", opts, coll)
};
cljs.core.IPrintable["number"] = true;
cljs.core._pr_seq["number"] = function(n, opts) {
  return cljs.core.list.call(null, cljs.core.str.call(null, n))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["boolean"] = true;
cljs.core._pr_seq["boolean"] = function(bool, opts) {
  return cljs.core.list.call(null, cljs.core.str.call(null, bool))
};
cljs.core.Set.prototype.cljs$core$IPrintable$ = true;
cljs.core.Set.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", opts, coll)
};
cljs.core.IPrintable["string"] = true;
cljs.core._pr_seq["string"] = function(obj, opts) {
  if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, obj))) {
    return cljs.core.list.call(null, cljs.core.str.call(null, ":", function() {
      var temp__3698__auto____83280 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__3698__auto____83280)) {
        var nspc__83281 = temp__3698__auto____83280;
        return cljs.core.str.call(null, nspc__83281, "/")
      }else {
        return null
      }
    }(), cljs.core.name.call(null, obj)))
  }else {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, obj))) {
      return cljs.core.list.call(null, cljs.core.str.call(null, function() {
        var temp__3698__auto____83282 = cljs.core.namespace.call(null, obj);
        if(cljs.core.truth_(temp__3698__auto____83282)) {
          var nspc__83283 = temp__3698__auto____83282;
          return cljs.core.str.call(null, nspc__83283, "/")
        }else {
          return null
        }
      }(), cljs.core.name.call(null, obj)))
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return cljs.core.list.call(null, cljs.core.truth_("\ufdd0'readably".call(null, opts)) ? goog.string.quote.call(null, obj) : obj)
      }else {
        return null
      }
    }
  }
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = true;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["array"] = true;
cljs.core._pr_seq["array"] = function(a, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#<Array [", ", ", "]>", opts, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["function"] = true;
cljs.core._pr_seq["function"] = function(this$) {
  return cljs.core.list.call(null, "#<", cljs.core.str.call(null, this$), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.list.call(null, "()")
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = true;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq = function(coll, opts) {
  var pr_pair__83284 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__83284, "{", ", ", "}", opts, coll)
};
cljs.core.Atom = function(state, meta, validator, watches) {
  this.state = state;
  this.meta = meta;
  this.validator = validator;
  this.watches = watches
};
cljs.core.Atom.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$ = true;
cljs.core.Atom.prototype.cljs$core$IHash$_hash = function(this$) {
  var this__83285 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches = function(this$, oldval, newval) {
  var this__83286 = this;
  var G__83287__83288 = cljs.core.seq.call(null, this__83286.watches);
  if(cljs.core.truth_(G__83287__83288)) {
    var G__83290__83292 = cljs.core.first.call(null, G__83287__83288);
    var vec__83291__83293 = G__83290__83292;
    var key__83294 = cljs.core.nth.call(null, vec__83291__83293, 0, null);
    var f__83295 = cljs.core.nth.call(null, vec__83291__83293, 1, null);
    var G__83287__83296 = G__83287__83288;
    var G__83290__83297 = G__83290__83292;
    var G__83287__83298 = G__83287__83296;
    while(true) {
      var vec__83299__83300 = G__83290__83297;
      var key__83301 = cljs.core.nth.call(null, vec__83299__83300, 0, null);
      var f__83302 = cljs.core.nth.call(null, vec__83299__83300, 1, null);
      var G__83287__83303 = G__83287__83298;
      f__83302.call(null, key__83301, this$, oldval, newval);
      var temp__3698__auto____83304 = cljs.core.next.call(null, G__83287__83303);
      if(cljs.core.truth_(temp__3698__auto____83304)) {
        var G__83287__83305 = temp__3698__auto____83304;
        var G__83312 = cljs.core.first.call(null, G__83287__83305);
        var G__83313 = G__83287__83305;
        G__83290__83297 = G__83312;
        G__83287__83298 = G__83313;
        continue
      }else {
        return null
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch = function(this$, key, f) {
  var this__83306 = this;
  return this$.watches = cljs.core.assoc.call(null, this__83306.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch = function(this$, key) {
  var this__83307 = this;
  return this$.watches = cljs.core.dissoc.call(null, this__83307.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq = function(a, opts) {
  var this__83308 = this;
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["#<Atom: "]), cljs.core._pr_seq.call(null, this__83308.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta = function(_) {
  var this__83309 = this;
  return this__83309.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref = function(_) {
  var this__83310 = this;
  return this__83310.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv = function(o, other) {
  var this__83311 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__83320 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__83321 = function() {
    var G__83323__delegate = function(x, p__83314) {
      var map__83315__83316 = p__83314;
      var map__83315__83317 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__83315__83316)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__83315__83316) : map__83315__83316;
      var validator__83318 = cljs.core.get.call(null, map__83315__83317, "\ufdd0'validator");
      var meta__83319 = cljs.core.get.call(null, map__83315__83317, "\ufdd0'meta");
      return new cljs.core.Atom(x, meta__83319, validator__83318, null)
    };
    var G__83323 = function(x, var_args) {
      var p__83314 = null;
      if(goog.isDef(var_args)) {
        p__83314 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__83323__delegate.call(this, x, p__83314)
    };
    G__83323.cljs$lang$maxFixedArity = 1;
    G__83323.cljs$lang$applyTo = function(arglist__83324) {
      var x = cljs.core.first(arglist__83324);
      var p__83314 = cljs.core.rest(arglist__83324);
      return G__83323__delegate.call(this, x, p__83314)
    };
    return G__83323
  }();
  atom = function(x, var_args) {
    var p__83314 = var_args;
    switch(arguments.length) {
      case 1:
        return atom__83320.call(this, x);
      default:
        return atom__83321.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  atom.cljs$lang$maxFixedArity = 1;
  atom.cljs$lang$applyTo = atom__83321.cljs$lang$applyTo;
  return atom
}();
cljs.core.reset_BANG_ = function reset_BANG_(a, new_value) {
  var temp__3698__auto____83325 = a.validator;
  if(cljs.core.truth_(temp__3698__auto____83325)) {
    var validate__83326 = temp__3698__auto____83325;
    if(cljs.core.truth_(validate__83326.call(null, new_value))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", "Validator rejected reference state", "\n", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 3282)))));
    }
  }else {
  }
  var old_value__83327 = a.state;
  a.state = new_value;
  cljs.core._notify_watches.call(null, a, old_value__83327, new_value);
  return new_value
};
cljs.core.swap_BANG_ = function() {
  var swap_BANG_ = null;
  var swap_BANG___83328 = function(a, f) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state))
  };
  var swap_BANG___83329 = function(a, f, x) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x))
  };
  var swap_BANG___83330 = function(a, f, x, y) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y))
  };
  var swap_BANG___83331 = function(a, f, x, y, z) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y, z))
  };
  var swap_BANG___83332 = function() {
    var G__83334__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, f, a.state, x, y, z, more))
    };
    var G__83334 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__83334__delegate.call(this, a, f, x, y, z, more)
    };
    G__83334.cljs$lang$maxFixedArity = 5;
    G__83334.cljs$lang$applyTo = function(arglist__83335) {
      var a = cljs.core.first(arglist__83335);
      var f = cljs.core.first(cljs.core.next(arglist__83335));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__83335)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__83335))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__83335)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__83335)))));
      return G__83334__delegate.call(this, a, f, x, y, z, more)
    };
    return G__83334
  }();
  swap_BANG_ = function(a, f, x, y, z, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return swap_BANG___83328.call(this, a, f);
      case 3:
        return swap_BANG___83329.call(this, a, f, x);
      case 4:
        return swap_BANG___83330.call(this, a, f, x, y);
      case 5:
        return swap_BANG___83331.call(this, a, f, x, y, z);
      default:
        return swap_BANG___83332.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  swap_BANG_.cljs$lang$maxFixedArity = 5;
  swap_BANG_.cljs$lang$applyTo = swap_BANG___83332.cljs$lang$applyTo;
  return swap_BANG_
}();
cljs.core.compare_and_set_BANG_ = function compare_and_set_BANG_(a, oldval, newval) {
  if(cljs.core.truth_(cljs.core._EQ_.call(null, a.state, oldval))) {
    cljs.core.reset_BANG_.call(null, a, newval);
    return true
  }else {
    return false
  }
};
cljs.core.deref = function deref(o) {
  return cljs.core._deref.call(null, o)
};
cljs.core.set_validator_BANG_ = function set_validator_BANG_(iref, val) {
  return iref.validator = val
};
cljs.core.get_validator = function get_validator(iref) {
  return iref.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var alter_meta_BANG___delegate = function(iref, f, args) {
    return iref.meta = cljs.core.apply.call(null, f, iref.meta, args)
  };
  var alter_meta_BANG_ = function(iref, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return alter_meta_BANG___delegate.call(this, iref, f, args)
  };
  alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__83336) {
    var iref = cljs.core.first(arglist__83336);
    var f = cljs.core.first(cljs.core.next(arglist__83336));
    var args = cljs.core.rest(cljs.core.next(arglist__83336));
    return alter_meta_BANG___delegate.call(this, iref, f, args)
  };
  return alter_meta_BANG_
}();
cljs.core.reset_meta_BANG_ = function reset_meta_BANG_(iref, m) {
  return iref.meta = m
};
cljs.core.add_watch = function add_watch(iref, key, f) {
  return cljs.core._add_watch.call(null, iref, key, f)
};
cljs.core.remove_watch = function remove_watch(iref, key) {
  return cljs.core._remove_watch.call(null, iref, key)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var gensym = null;
  var gensym__83337 = function() {
    return gensym.call(null, "G__")
  };
  var gensym__83338 = function(prefix_string) {
    if(cljs.core.truth_(cljs.core.gensym_counter === null)) {
      cljs.core.gensym_counter = cljs.core.atom.call(null, 0)
    }else {
    }
    return cljs.core.symbol.call(null, cljs.core.str.call(null, prefix_string, cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc)))
  };
  gensym = function(prefix_string) {
    switch(arguments.length) {
      case 0:
        return gensym__83337.call(this);
      case 1:
        return gensym__83338.call(this, prefix_string)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return gensym
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(state, f) {
  this.state = state;
  this.f = f
};
cljs.core.Delay.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$ = true;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_ = function(d) {
  var this__83340 = this;
  return"\ufdd0'done".call(null, cljs.core.deref.call(null, this__83340.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref = function(_) {
  var this__83341 = this;
  return"\ufdd0'value".call(null, cljs.core.swap_BANG_.call(null, this__83341.state, function(p__83342) {
    var curr_state__83343 = p__83342;
    var curr_state__83344 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, curr_state__83343)) ? cljs.core.apply.call(null, cljs.core.hash_map, curr_state__83343) : curr_state__83343;
    var done__83345 = cljs.core.get.call(null, curr_state__83344, "\ufdd0'done");
    if(cljs.core.truth_(done__83345)) {
      return curr_state__83344
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__83341.f.call(null)})
    }
  }))
};
cljs.core.Delay;
cljs.core.delay_QMARK_ = function delay_QMARK_(x) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, x)
};
cljs.core.force = function force(x) {
  if(cljs.core.truth_(cljs.core.delay_QMARK_.call(null, x))) {
    return cljs.core.deref.call(null, x)
  }else {
    return x
  }
};
cljs.core.realized_QMARK_ = function realized_QMARK_(d) {
  return cljs.core._realized_QMARK_.call(null, d)
};
cljs.core.js__GT_clj = function() {
  var js__GT_clj__delegate = function(x, options) {
    var map__83346__83347 = options;
    var map__83346__83348 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__83346__83347)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__83346__83347) : map__83346__83347;
    var keywordize_keys__83349 = cljs.core.get.call(null, map__83346__83348, "\ufdd0'keywordize-keys");
    var keyfn__83350 = cljs.core.truth_(keywordize_keys__83349) ? cljs.core.keyword : cljs.core.str;
    var f__83356 = function thisfn(x) {
      if(cljs.core.truth_(cljs.core.seq_QMARK_.call(null, x))) {
        return cljs.core.doall.call(null, cljs.core.map.call(null, thisfn, x))
      }else {
        if(cljs.core.truth_(cljs.core.coll_QMARK_.call(null, x))) {
          return cljs.core.into.call(null, cljs.core.empty.call(null, x), cljs.core.map.call(null, thisfn, x))
        }else {
          if(cljs.core.truth_(goog.isArray.call(null, x))) {
            return cljs.core.vec.call(null, cljs.core.map.call(null, thisfn, x))
          }else {
            if(cljs.core.truth_(goog.isObject.call(null, x))) {
              return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), function() {
                var iter__520__auto____83355 = function iter__83351(s__83352) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__83352__83353 = s__83352;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__83352__83353))) {
                        var k__83354 = cljs.core.first.call(null, s__83352__83353);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__83350.call(null, k__83354), thisfn.call(null, x[k__83354])]), iter__83351.call(null, cljs.core.rest.call(null, s__83352__83353)))
                      }else {
                        return null
                      }
                      break
                    }
                  })
                };
                return iter__520__auto____83355.call(null, cljs.core.js_keys.call(null, x))
              }())
            }else {
              if(cljs.core.truth_("\ufdd0'else")) {
                return x
              }else {
                return null
              }
            }
          }
        }
      }
    };
    return f__83356.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__83357) {
    var x = cljs.core.first(arglist__83357);
    var options = cljs.core.rest(arglist__83357);
    return js__GT_clj__delegate.call(this, x, options)
  };
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__83358 = cljs.core.atom.call(null, cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var G__83362__delegate = function(args) {
      var temp__3695__auto____83359 = cljs.core.get.call(null, cljs.core.deref.call(null, mem__83358), args);
      if(cljs.core.truth_(temp__3695__auto____83359)) {
        var v__83360 = temp__3695__auto____83359;
        return v__83360
      }else {
        var ret__83361 = cljs.core.apply.call(null, f, args);
        cljs.core.swap_BANG_.call(null, mem__83358, cljs.core.assoc, args, ret__83361);
        return ret__83361
      }
    };
    var G__83362 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__83362__delegate.call(this, args)
    };
    G__83362.cljs$lang$maxFixedArity = 0;
    G__83362.cljs$lang$applyTo = function(arglist__83363) {
      var args = cljs.core.seq(arglist__83363);
      return G__83362__delegate.call(this, args)
    };
    return G__83362
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__83365 = function(f) {
    while(true) {
      var ret__83364 = f.call(null);
      if(cljs.core.truth_(cljs.core.fn_QMARK_.call(null, ret__83364))) {
        var G__83368 = ret__83364;
        f = G__83368;
        continue
      }else {
        return ret__83364
      }
      break
    }
  };
  var trampoline__83366 = function() {
    var G__83369__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.call(null, f, args)
      })
    };
    var G__83369 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__83369__delegate.call(this, f, args)
    };
    G__83369.cljs$lang$maxFixedArity = 1;
    G__83369.cljs$lang$applyTo = function(arglist__83370) {
      var f = cljs.core.first(arglist__83370);
      var args = cljs.core.rest(arglist__83370);
      return G__83369__delegate.call(this, f, args)
    };
    return G__83369
  }();
  trampoline = function(f, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 1:
        return trampoline__83365.call(this, f);
      default:
        return trampoline__83366.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  trampoline.cljs$lang$maxFixedArity = 1;
  trampoline.cljs$lang$applyTo = trampoline__83366.cljs$lang$applyTo;
  return trampoline
}();
cljs.core.rand = function() {
  var rand = null;
  var rand__83371 = function() {
    return rand.call(null, 1)
  };
  var rand__83372 = function(n) {
    return Math.random() * n
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__83371.call(this);
      case 1:
        return rand__83372.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return Math.floor(Math.random() * n)
};
cljs.core.rand_nth = function rand_nth(coll) {
  return cljs.core.nth.call(null, coll, cljs.core.rand_int.call(null, cljs.core.count.call(null, coll)))
};
cljs.core.group_by = function group_by(f, coll) {
  return cljs.core.reduce.call(null, function(ret, x) {
    var k__83374 = f.call(null, x);
    return cljs.core.assoc.call(null, ret, k__83374, cljs.core.conj.call(null, cljs.core.get.call(null, ret, k__83374, cljs.core.PersistentVector.fromArray([])), x))
  }, cljs.core.ObjMap.fromObject([], {}), coll)
};
cljs.core.make_hierarchy = function make_hierarchy() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'descendants":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'ancestors":cljs.core.ObjMap.fromObject([], {})})
};
cljs.core.global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
cljs.core.isa_QMARK_ = function() {
  var isa_QMARK_ = null;
  var isa_QMARK___83383 = function(child, parent) {
    return isa_QMARK_.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), child, parent)
  };
  var isa_QMARK___83384 = function(h, child, parent) {
    var or__3548__auto____83375 = cljs.core._EQ_.call(null, child, parent);
    if(cljs.core.truth_(or__3548__auto____83375)) {
      return or__3548__auto____83375
    }else {
      var or__3548__auto____83376 = cljs.core.contains_QMARK_.call(null, "\ufdd0'ancestors".call(null, h).call(null, child), parent);
      if(cljs.core.truth_(or__3548__auto____83376)) {
        return or__3548__auto____83376
      }else {
        var and__3546__auto____83377 = cljs.core.vector_QMARK_.call(null, parent);
        if(cljs.core.truth_(and__3546__auto____83377)) {
          var and__3546__auto____83378 = cljs.core.vector_QMARK_.call(null, child);
          if(cljs.core.truth_(and__3546__auto____83378)) {
            var and__3546__auto____83379 = cljs.core._EQ_.call(null, cljs.core.count.call(null, parent), cljs.core.count.call(null, child));
            if(cljs.core.truth_(and__3546__auto____83379)) {
              var ret__83380 = true;
              var i__83381 = 0;
              while(true) {
                if(cljs.core.truth_(function() {
                  var or__3548__auto____83382 = cljs.core.not.call(null, ret__83380);
                  if(cljs.core.truth_(or__3548__auto____83382)) {
                    return or__3548__auto____83382
                  }else {
                    return cljs.core._EQ_.call(null, i__83381, cljs.core.count.call(null, parent))
                  }
                }())) {
                  return ret__83380
                }else {
                  var G__83386 = isa_QMARK_.call(null, h, child.call(null, i__83381), parent.call(null, i__83381));
                  var G__83387 = i__83381 + 1;
                  ret__83380 = G__83386;
                  i__83381 = G__83387;
                  continue
                }
                break
              }
            }else {
              return and__3546__auto____83379
            }
          }else {
            return and__3546__auto____83378
          }
        }else {
          return and__3546__auto____83377
        }
      }
    }
  };
  isa_QMARK_ = function(h, child, parent) {
    switch(arguments.length) {
      case 2:
        return isa_QMARK___83383.call(this, h, child);
      case 3:
        return isa_QMARK___83384.call(this, h, child, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return isa_QMARK_
}();
cljs.core.parents = function() {
  var parents = null;
  var parents__83388 = function(tag) {
    return parents.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var parents__83389 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'parents".call(null, h), tag))
  };
  parents = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return parents__83388.call(this, h);
      case 2:
        return parents__83389.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return parents
}();
cljs.core.ancestors = function() {
  var ancestors = null;
  var ancestors__83391 = function(tag) {
    return ancestors.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var ancestors__83392 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'ancestors".call(null, h), tag))
  };
  ancestors = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return ancestors__83391.call(this, h);
      case 2:
        return ancestors__83392.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return ancestors
}();
cljs.core.descendants = function() {
  var descendants = null;
  var descendants__83394 = function(tag) {
    return descendants.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var descendants__83395 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'descendants".call(null, h), tag))
  };
  descendants = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return descendants__83394.call(this, h);
      case 2:
        return descendants__83395.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return descendants
}();
cljs.core.derive = function() {
  var derive = null;
  var derive__83405 = function(tag, parent) {
    if(cljs.core.truth_(cljs.core.namespace.call(null, parent))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'namespace", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 3566)))));
    }
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, derive, tag, parent);
    return null
  };
  var derive__83406 = function(h, tag, parent) {
    if(cljs.core.truth_(cljs.core.not_EQ_.call(null, tag, parent))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 3570)))));
    }
    var tp__83400 = "\ufdd0'parents".call(null, h);
    var td__83401 = "\ufdd0'descendants".call(null, h);
    var ta__83402 = "\ufdd0'ancestors".call(null, h);
    var tf__83403 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.call(null, function(ret, k) {
        return cljs.core.assoc.call(null, ret, k, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, targets, k, cljs.core.set([])), cljs.core.cons.call(null, target, targets.call(null, target))))
      }, m, cljs.core.cons.call(null, source, sources.call(null, source)))
    };
    var or__3548__auto____83404 = cljs.core.truth_(cljs.core.contains_QMARK_.call(null, tp__83400.call(null, tag), parent)) ? null : function() {
      if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, ta__83402.call(null, tag), parent))) {
        throw new Error(cljs.core.str.call(null, tag, "already has", parent, "as ancestor"));
      }else {
      }
      if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, ta__83402.call(null, parent), tag))) {
        throw new Error(cljs.core.str.call(null, "Cyclic derivation:", parent, "has", tag, "as ancestor"));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, "\ufdd0'parents".call(null, h), tag, cljs.core.conj.call(null, cljs.core.get.call(null, tp__83400, tag, cljs.core.set([])), parent)), "\ufdd0'ancestors":tf__83403.call(null, "\ufdd0'ancestors".call(null, h), tag, td__83401, parent, ta__83402), "\ufdd0'descendants":tf__83403.call(null, "\ufdd0'descendants".call(null, h), parent, ta__83402, tag, td__83401)})
    }();
    if(cljs.core.truth_(or__3548__auto____83404)) {
      return or__3548__auto____83404
    }else {
      return h
    }
  };
  derive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return derive__83405.call(this, h, tag);
      case 3:
        return derive__83406.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return derive
}();
cljs.core.underive = function() {
  var underive = null;
  var underive__83412 = function(tag, parent) {
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, underive, tag, parent);
    return null
  };
  var underive__83413 = function(h, tag, parent) {
    var parentMap__83408 = "\ufdd0'parents".call(null, h);
    var childsParents__83409 = cljs.core.truth_(parentMap__83408.call(null, tag)) ? cljs.core.disj.call(null, parentMap__83408.call(null, tag), parent) : cljs.core.set([]);
    var newParents__83410 = cljs.core.truth_(cljs.core.not_empty.call(null, childsParents__83409)) ? cljs.core.assoc.call(null, parentMap__83408, tag, childsParents__83409) : cljs.core.dissoc.call(null, parentMap__83408, tag);
    var deriv_seq__83411 = cljs.core.flatten.call(null, cljs.core.map.call(null, function(p1__83397_SHARP_) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, p1__83397_SHARP_), cljs.core.interpose.call(null, cljs.core.first.call(null, p1__83397_SHARP_), cljs.core.second.call(null, p1__83397_SHARP_)))
    }, cljs.core.seq.call(null, newParents__83410)));
    if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, parentMap__83408.call(null, tag), parent))) {
      return cljs.core.reduce.call(null, function(p1__83398_SHARP_, p2__83399_SHARP_) {
        return cljs.core.apply.call(null, cljs.core.derive, p1__83398_SHARP_, p2__83399_SHARP_)
      }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, deriv_seq__83411))
    }else {
      return h
    }
  };
  underive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return underive__83412.call(this, h, tag);
      case 3:
        return underive__83413.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return underive
}();
cljs.core.reset_cache = function reset_cache(method_cache, method_table, cached_hierarchy, hierarchy) {
  cljs.core.swap_BANG_.call(null, method_cache, function(_) {
    return cljs.core.deref.call(null, method_table)
  });
  return cljs.core.swap_BANG_.call(null, cached_hierarchy, function(_) {
    return cljs.core.deref.call(null, hierarchy)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(x, y, prefer_table) {
  var xprefs__83415 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__3548__auto____83417 = cljs.core.truth_(function() {
    var and__3546__auto____83416 = xprefs__83415;
    if(cljs.core.truth_(and__3546__auto____83416)) {
      return xprefs__83415.call(null, y)
    }else {
      return and__3546__auto____83416
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__3548__auto____83417)) {
    return or__3548__auto____83417
  }else {
    var or__3548__auto____83419 = function() {
      var ps__83418 = cljs.core.parents.call(null, y);
      while(true) {
        if(cljs.core.truth_(cljs.core.count.call(null, ps__83418) > 0)) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first.call(null, ps__83418), prefer_table))) {
          }else {
          }
          var G__83422 = cljs.core.rest.call(null, ps__83418);
          ps__83418 = G__83422;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__3548__auto____83419)) {
      return or__3548__auto____83419
    }else {
      var or__3548__auto____83421 = function() {
        var ps__83420 = cljs.core.parents.call(null, x);
        while(true) {
          if(cljs.core.truth_(cljs.core.count.call(null, ps__83420) > 0)) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, ps__83420), y, prefer_table))) {
            }else {
            }
            var G__83423 = cljs.core.rest.call(null, ps__83420);
            ps__83420 = G__83423;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__3548__auto____83421)) {
        return or__3548__auto____83421
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__3548__auto____83424 = cljs.core.prefers_STAR_.call(null, x, y, prefer_table);
  if(cljs.core.truth_(or__3548__auto____83424)) {
    return or__3548__auto____83424
  }else {
    return cljs.core.isa_QMARK_.call(null, x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__83433 = cljs.core.reduce.call(null, function(be, p__83425) {
    var vec__83426__83427 = p__83425;
    var k__83428 = cljs.core.nth.call(null, vec__83426__83427, 0, null);
    var ___83429 = cljs.core.nth.call(null, vec__83426__83427, 1, null);
    var e__83430 = vec__83426__83427;
    if(cljs.core.truth_(cljs.core.isa_QMARK_.call(null, dispatch_val, k__83428))) {
      var be2__83432 = cljs.core.truth_(function() {
        var or__3548__auto____83431 = be === null;
        if(cljs.core.truth_(or__3548__auto____83431)) {
          return or__3548__auto____83431
        }else {
          return cljs.core.dominates.call(null, k__83428, cljs.core.first.call(null, be), prefer_table)
        }
      }()) ? e__83430 : be;
      if(cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, be2__83432), k__83428, prefer_table))) {
      }else {
        throw new Error(cljs.core.str.call(null, "Multiple methods in multimethod '", name, "' match dispatch value: ", dispatch_val, " -> ", k__83428, " and ", cljs.core.first.call(null, be2__83432), ", and neither is preferred"));
      }
      return be2__83432
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__83433)) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy)))) {
      cljs.core.swap_BANG_.call(null, method_cache, cljs.core.assoc, dispatch_val, cljs.core.second.call(null, best_entry__83433));
      return cljs.core.second.call(null, best_entry__83433)
    }else {
      cljs.core.reset_cache.call(null, method_cache, method_table, cached_hierarchy, hierarchy);
      return find_and_cache_best_method.call(null, name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy)
    }
  }else {
    return null
  }
};
cljs.core.IMultiFn = {};
cljs.core._reset = function _reset(mf) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83434 = mf;
    if(cljs.core.truth_(and__3546__auto____83434)) {
      return mf.cljs$core$IMultiFn$_reset
    }else {
      return and__3546__auto____83434
    }
  }())) {
    return mf.cljs$core$IMultiFn$_reset(mf)
  }else {
    return function() {
      var or__3548__auto____83435 = cljs.core._reset[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83435)) {
        return or__3548__auto____83435
      }else {
        var or__3548__auto____83436 = cljs.core._reset["_"];
        if(cljs.core.truth_(or__3548__auto____83436)) {
          return or__3548__auto____83436
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83437 = mf;
    if(cljs.core.truth_(and__3546__auto____83437)) {
      return mf.cljs$core$IMultiFn$_add_method
    }else {
      return and__3546__auto____83437
    }
  }())) {
    return mf.cljs$core$IMultiFn$_add_method(mf, dispatch_val, method)
  }else {
    return function() {
      var or__3548__auto____83438 = cljs.core._add_method[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83438)) {
        return or__3548__auto____83438
      }else {
        var or__3548__auto____83439 = cljs.core._add_method["_"];
        if(cljs.core.truth_(or__3548__auto____83439)) {
          return or__3548__auto____83439
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83440 = mf;
    if(cljs.core.truth_(and__3546__auto____83440)) {
      return mf.cljs$core$IMultiFn$_remove_method
    }else {
      return and__3546__auto____83440
    }
  }())) {
    return mf.cljs$core$IMultiFn$_remove_method(mf, dispatch_val)
  }else {
    return function() {
      var or__3548__auto____83441 = cljs.core._remove_method[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83441)) {
        return or__3548__auto____83441
      }else {
        var or__3548__auto____83442 = cljs.core._remove_method["_"];
        if(cljs.core.truth_(or__3548__auto____83442)) {
          return or__3548__auto____83442
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83443 = mf;
    if(cljs.core.truth_(and__3546__auto____83443)) {
      return mf.cljs$core$IMultiFn$_prefer_method
    }else {
      return and__3546__auto____83443
    }
  }())) {
    return mf.cljs$core$IMultiFn$_prefer_method(mf, dispatch_val, dispatch_val_y)
  }else {
    return function() {
      var or__3548__auto____83444 = cljs.core._prefer_method[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83444)) {
        return or__3548__auto____83444
      }else {
        var or__3548__auto____83445 = cljs.core._prefer_method["_"];
        if(cljs.core.truth_(or__3548__auto____83445)) {
          return or__3548__auto____83445
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83446 = mf;
    if(cljs.core.truth_(and__3546__auto____83446)) {
      return mf.cljs$core$IMultiFn$_get_method
    }else {
      return and__3546__auto____83446
    }
  }())) {
    return mf.cljs$core$IMultiFn$_get_method(mf, dispatch_val)
  }else {
    return function() {
      var or__3548__auto____83447 = cljs.core._get_method[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83447)) {
        return or__3548__auto____83447
      }else {
        var or__3548__auto____83448 = cljs.core._get_method["_"];
        if(cljs.core.truth_(or__3548__auto____83448)) {
          return or__3548__auto____83448
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83449 = mf;
    if(cljs.core.truth_(and__3546__auto____83449)) {
      return mf.cljs$core$IMultiFn$_methods
    }else {
      return and__3546__auto____83449
    }
  }())) {
    return mf.cljs$core$IMultiFn$_methods(mf)
  }else {
    return function() {
      var or__3548__auto____83450 = cljs.core._methods[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83450)) {
        return or__3548__auto____83450
      }else {
        var or__3548__auto____83451 = cljs.core._methods["_"];
        if(cljs.core.truth_(or__3548__auto____83451)) {
          return or__3548__auto____83451
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83452 = mf;
    if(cljs.core.truth_(and__3546__auto____83452)) {
      return mf.cljs$core$IMultiFn$_prefers
    }else {
      return and__3546__auto____83452
    }
  }())) {
    return mf.cljs$core$IMultiFn$_prefers(mf)
  }else {
    return function() {
      var or__3548__auto____83453 = cljs.core._prefers[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83453)) {
        return or__3548__auto____83453
      }else {
        var or__3548__auto____83454 = cljs.core._prefers["_"];
        if(cljs.core.truth_(or__3548__auto____83454)) {
          return or__3548__auto____83454
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83455 = mf;
    if(cljs.core.truth_(and__3546__auto____83455)) {
      return mf.cljs$core$IMultiFn$_dispatch
    }else {
      return and__3546__auto____83455
    }
  }())) {
    return mf.cljs$core$IMultiFn$_dispatch(mf, args)
  }else {
    return function() {
      var or__3548__auto____83456 = cljs.core._dispatch[goog.typeOf.call(null, mf)];
      if(cljs.core.truth_(or__3548__auto____83456)) {
        return or__3548__auto____83456
      }else {
        var or__3548__auto____83457 = cljs.core._dispatch["_"];
        if(cljs.core.truth_(or__3548__auto____83457)) {
          return or__3548__auto____83457
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__83458 = cljs.core.apply.call(null, dispatch_fn, args);
  var target_fn__83459 = cljs.core._get_method.call(null, mf, dispatch_val__83458);
  if(cljs.core.truth_(target_fn__83459)) {
  }else {
    throw new Error(cljs.core.str.call(null, "No method in multimethod '", cljs.core.name, "' for dispatch value: ", dispatch_val__83458));
  }
  return cljs.core.apply.call(null, target_fn__83459, args)
};
cljs.core.MultiFn = function(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  this.name = name;
  this.dispatch_fn = dispatch_fn;
  this.default_dispatch_val = default_dispatch_val;
  this.hierarchy = hierarchy;
  this.method_table = method_table;
  this.prefer_table = prefer_table;
  this.method_cache = method_cache;
  this.cached_hierarchy = cached_hierarchy
};
cljs.core.MultiFn.cljs$core$IPrintable$_pr_seq = function(this__367__auto__) {
  return cljs.core.list.call(null, "cljs.core.MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$ = true;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash = function(this$) {
  var this__83460 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset = function(mf) {
  var this__83461 = this;
  cljs.core.swap_BANG_.call(null, this__83461.method_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__83461.method_cache, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__83461.prefer_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__83461.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method = function(mf, dispatch_val, method) {
  var this__83462 = this;
  cljs.core.swap_BANG_.call(null, this__83462.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache.call(null, this__83462.method_cache, this__83462.method_table, this__83462.cached_hierarchy, this__83462.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method = function(mf, dispatch_val) {
  var this__83463 = this;
  cljs.core.swap_BANG_.call(null, this__83463.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache.call(null, this__83463.method_cache, this__83463.method_table, this__83463.cached_hierarchy, this__83463.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method = function(mf, dispatch_val) {
  var this__83464 = this;
  if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this__83464.cached_hierarchy), cljs.core.deref.call(null, this__83464.hierarchy)))) {
  }else {
    cljs.core.reset_cache.call(null, this__83464.method_cache, this__83464.method_table, this__83464.cached_hierarchy, this__83464.hierarchy)
  }
  var temp__3695__auto____83465 = cljs.core.deref.call(null, this__83464.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__3695__auto____83465)) {
    var target_fn__83466 = temp__3695__auto____83465;
    return target_fn__83466
  }else {
    var temp__3695__auto____83467 = cljs.core.find_and_cache_best_method.call(null, this__83464.name, dispatch_val, this__83464.hierarchy, this__83464.method_table, this__83464.prefer_table, this__83464.method_cache, this__83464.cached_hierarchy);
    if(cljs.core.truth_(temp__3695__auto____83467)) {
      var target_fn__83468 = temp__3695__auto____83467;
      return target_fn__83468
    }else {
      return cljs.core.deref.call(null, this__83464.method_table).call(null, this__83464.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__83469 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, dispatch_val_x, dispatch_val_y, this__83469.prefer_table))) {
    throw new Error(cljs.core.str.call(null, "Preference conflict in multimethod '", this__83469.name, "': ", dispatch_val_y, " is already preferred to ", dispatch_val_x));
  }else {
  }
  cljs.core.swap_BANG_.call(null, this__83469.prefer_table, function(old) {
    return cljs.core.assoc.call(null, old, dispatch_val_x, cljs.core.conj.call(null, cljs.core.get.call(null, old, dispatch_val_x, cljs.core.set([])), dispatch_val_y))
  });
  return cljs.core.reset_cache.call(null, this__83469.method_cache, this__83469.method_table, this__83469.cached_hierarchy, this__83469.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods = function(mf) {
  var this__83470 = this;
  return cljs.core.deref.call(null, this__83470.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers = function(mf) {
  var this__83471 = this;
  return cljs.core.deref.call(null, this__83471.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch = function(mf, args) {
  var this__83472 = this;
  return cljs.core.do_dispatch.call(null, mf, this__83472.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__83473__delegate = function(_, args) {
    return cljs.core._dispatch.call(null, this, args)
  };
  var G__83473 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__83473__delegate.call(this, _, args)
  };
  G__83473.cljs$lang$maxFixedArity = 1;
  G__83473.cljs$lang$applyTo = function(arglist__83474) {
    var _ = cljs.core.first(arglist__83474);
    var args = cljs.core.rest(arglist__83474);
    return G__83473__delegate.call(this, _, args)
  };
  return G__83473
}();
cljs.core.MultiFn.prototype.apply = function(_, args) {
  return cljs.core._dispatch.call(null, this, args)
};
cljs.core.remove_all_methods = function remove_all_methods(multifn) {
  return cljs.core._reset.call(null, multifn)
};
cljs.core.remove_method = function remove_method(multifn, dispatch_val) {
  return cljs.core._remove_method.call(null, multifn, dispatch_val)
};
cljs.core.prefer_method = function prefer_method(multifn, dispatch_val_x, dispatch_val_y) {
  return cljs.core._prefer_method.call(null, multifn, dispatch_val_x, dispatch_val_y)
};
cljs.core.methods$ = function methods$(multifn) {
  return cljs.core._methods.call(null, multifn)
};
cljs.core.get_method = function get_method(multifn, dispatch_val) {
  return cljs.core._get_method.call(null, multifn, dispatch_val)
};
cljs.core.prefers = function prefers(multifn) {
  return cljs.core._prefers.call(null, multifn)
};
goog.provide("tempest.util");
goog.require("cljs.core");
tempest.util.rad_to_deg = function rad_to_deg(rad) {
  return rad * 180 / 3.14159265358979
};
tempest.util.deg_to_rad = function deg_to_rad(deg) {
  return deg * 3.14159265358979 / 180
};
tempest.util.round = function round(num) {
  return~~(0.5 + num)
};
goog.provide("tempest.levels");
goog.require("cljs.core");
goog.require("tempest.util");
tempest.levels._STAR_default_line_length_STAR_ = 20;
tempest.levels._STAR_default_length_fn_STAR_ = function _STAR_default_length_fn_STAR_(p1__81488_SHARP_) {
  return 4 * p1__81488_SHARP_
};
tempest.levels._STAR_default_steps_per_segment_STAR_ = 200;
tempest.levels.build_unlinked_segment_list = function build_unlinked_segment_list(max_x) {
  return cljs.core.vec.call(null, function(x, segments) {
    while(true) {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, x, 0))) {
        return segments
      }else {
        var G__81489 = x - 1;
        var G__81490 = cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([x - 1, x]), segments);
        x = G__81489;
        segments = G__81490;
        continue
      }
      break
    }
  }.call(null, max_x, cljs.core.PersistentVector.fromArray([])))
};
tempest.levels.build_segment_list = function build_segment_list(max_x, linked_QMARK_) {
  var segments__81491 = tempest.levels.build_unlinked_segment_list.call(null, max_x);
  if(cljs.core.truth_(linked_QMARK_ === true)) {
    return cljs.core.conj.call(null, segments__81491, cljs.core.PersistentVector.fromArray([cljs.core.last.call(null, cljs.core.last.call(null, segments__81491)), cljs.core.first.call(null, cljs.core.first.call(null, segments__81491))]))
  }else {
    return segments__81491
  }
};
tempest.levels.theta_flat = function theta_flat(n, width, depth) {
  return Math["round"].call(null, tempest.util.rad_to_deg.call(null, Math["atan"].call(null, (n + 1) * width / depth)))
};
tempest.levels.r_flat = function r_flat(theta, depth) {
  return Math["round"].call(null, depth / Math["cos"].call(null, tempest.util.deg_to_rad.call(null, theta)))
};
tempest.levels.r_theta_pair_flat = function r_theta_pair_flat(n, width, depth, angle_center, angle_multiplier) {
  var th__81494 = tempest.levels.theta_flat.call(null, n, width, depth);
  return cljs.core.PersistentVector.fromArray([tempest.levels.r_flat.call(null, th__81494, depth), angle_center + th__81494 * angle_multiplier])
};
tempest.levels.flat_level = function flat_level(segment_count, segment_width, segment_depth) {
  return cljs.core.concat.call(null, cljs.core.reverse.call(null, cljs.core.map.call(null, function(p1__81492_SHARP_) {
    return tempest.levels.r_theta_pair_flat.call(null, p1__81492_SHARP_, segment_width, segment_depth, 270, -1)
  }, cljs.core.range.call(null, segment_count))), cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([80, 270])]), cljs.core.map.call(null, function(p1__81493_SHARP_) {
    return tempest.levels.r_theta_pair_flat.call(null, p1__81493_SHARP_, segment_width, segment_depth, 270, 1)
  }, cljs.core.range.call(null, segment_count)))
};
tempest.levels.r_oblong = function r_oblong(gamma, width, r0) {
  return Math["sqrt"].call(null, Math["pow"].call(null, width, 2) + Math["pow"].call(null, r0, 2) + -2 * width * r0 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, gamma)))
};
tempest.levels.theta_oblong = function theta_oblong(width, r1, r0, theta0, sumfn) {
  return sumfn.call(null, theta0, tempest.util.rad_to_deg.call(null, Math["acos"].call(null, (Math["pow"].call(null, r1, 2) + Math["pow"].call(null, r0, 2) + -1 * Math["pow"].call(null, width, 2)) / (2 * r1 * r0))))
};
tempest.levels.r_theta_pair_oblong = function r_theta_pair_oblong(gamma, width, r0, theta0, sumfn) {
  var r1__81495 = tempest.levels.r_oblong.call(null, gamma, width, r0);
  return cljs.core.vec.call(null, cljs.core.map.call(null, Math["round"], cljs.core.PersistentVector.fromArray([r1__81495, tempest.levels.theta_oblong.call(null, width, r1__81495, r0, theta0, sumfn)])))
};
tempest.levels.oblong_half_level = function oblong_half_level(gammas, width, height, sumfn) {
  return function(gammas, r0, theta0, segments) {
    while(true) {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, gammas), 0))) {
        return segments
      }else {
        var pair__81496 = tempest.levels.r_theta_pair_oblong.call(null, cljs.core.first.call(null, gammas), width, r0, theta0, sumfn);
        var G__81497 = cljs.core.rest.call(null, gammas);
        var G__81498 = cljs.core.first.call(null, pair__81496);
        var G__81499 = cljs.core.last.call(null, pair__81496);
        var G__81500 = cljs.core.cons.call(null, pair__81496, segments);
        gammas = G__81497;
        r0 = G__81498;
        theta0 = G__81499;
        segments = G__81500;
        continue
      }
      break
    }
  }.call(null, gammas, height, 270, cljs.core.PersistentVector.fromArray([]))
};
tempest.levels.oblong_level = function oblong_level(gammas, width, height) {
  return cljs.core.concat.call(null, tempest.levels.oblong_half_level.call(null, gammas, width, height, cljs.core._), cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([height, 270])]), cljs.core.reverse.call(null, tempest.levels.oblong_half_level.call(null, gammas, width, height, cljs.core._PLUS_)))
};
tempest.levels._STAR_level1_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.flat_level.call(null, 4, 15, 80));
tempest.levels._STAR_level2_lines_STAR_ = cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 0]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 18]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 36]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 54]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 
72]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 90]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 108]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 126]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 144]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 162]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 
180]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 198]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 216]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 234]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 252]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 270]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 
288]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 306]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 324]), cljs.core.PersistentVector.fromArray([tempest.levels._STAR_default_line_length_STAR_, 342])]);
tempest.levels._STAR_level3_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.flat_level.call(null, 7, 15, 80));
tempest.levels._STAR_level4_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([135, 105, 90, 33]), 15, 60));
tempest.levels._STAR_level5_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([135, 100, 90, 90, 90, 85, 80, 75]), 15, 60));
tempest.levels._STAR_level6_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45]), 15, 80));
tempest.levels._STAR_level6_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45, 90, 135, 45]), 11, 57));
tempest.levels._STAR_level7_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([135, 45, 135, 45]), 15, 3));
tempest.levels._STAR_level8_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([135, 105, 90, 33]), 8, 10));
tempest.levels._STAR_level9_lines_STAR_ = cljs.core.vec.call(null, tempest.levels.oblong_level.call(null, cljs.core.PersistentVector.fromArray([50, 50, 60, 60, 70]), 15, 60));
tempest.levels._STAR_level10_lines_STAR_ = cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([38, 203]), cljs.core.PersistentVector.fromArray([43, 217]), cljs.core.PersistentVector.fromArray([34, 229]), cljs.core.PersistentVector.fromArray([44, 239]), cljs.core.PersistentVector.fromArray([39, 255]), cljs.core.PersistentVector.fromArray([50, 262]), cljs.core.PersistentVector.fromArray([50, 278]), cljs.core.PersistentVector.fromArray([39, 284]), cljs.core.PersistentVector.fromArray([44, 
300]), cljs.core.PersistentVector.fromArray([34, 310]), cljs.core.PersistentVector.fromArray([43, 322]), cljs.core.PersistentVector.fromArray([38, 336])]);
tempest.levels.make_level_entry = function() {
  var make_level_entry__delegate = function(lines, loops_QMARK_, enemy_count, enemy_probability, p__81503) {
    var map__81504__81505 = p__81503;
    var map__81504__81506 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81504__81505)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81504__81505) : map__81504__81505;
    var steps__81507 = cljs.core.get.call(null, map__81504__81506, "\ufdd0'steps", tempest.levels._STAR_default_steps_per_segment_STAR_);
    var length_fn__81508 = cljs.core.get.call(null, map__81504__81506, "\ufdd0'length-fn", tempest.levels._STAR_default_length_fn_STAR_);
    return cljs.core.ObjMap.fromObject(["\ufdd0'lines", "\ufdd0'loops?", "\ufdd0'segments", "\ufdd0'length-fn", "\ufdd0'steps", "\ufdd0'remaining", "\ufdd0'probability"], {"\ufdd0'lines":lines, "\ufdd0'loops?":loops_QMARK_, "\ufdd0'segments":tempest.levels.build_segment_list.call(null, cljs.core.count.call(null, lines) - 1, loops_QMARK_), "\ufdd0'length-fn":length_fn__81508, "\ufdd0'steps":steps__81507, "\ufdd0'remaining":enemy_count, "\ufdd0'probability":enemy_probability})
  };
  var make_level_entry = function(lines, loops_QMARK_, enemy_count, enemy_probability, var_args) {
    var p__81503 = null;
    if(goog.isDef(var_args)) {
      p__81503 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
    }
    return make_level_entry__delegate.call(this, lines, loops_QMARK_, enemy_count, enemy_probability, p__81503)
  };
  make_level_entry.cljs$lang$maxFixedArity = 4;
  make_level_entry.cljs$lang$applyTo = function(arglist__81509) {
    var lines = cljs.core.first(arglist__81509);
    var loops_QMARK_ = cljs.core.first(cljs.core.next(arglist__81509));
    var enemy_count = cljs.core.first(cljs.core.next(cljs.core.next(arglist__81509)));
    var enemy_probability = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__81509))));
    var p__81503 = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__81509))));
    return make_level_entry__delegate.call(this, lines, loops_QMARK_, enemy_count, enemy_probability, p__81503)
  };
  return make_level_entry
}();
tempest.levels._STAR_levels_STAR_ = cljs.core.PersistentVector.fromArray([tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level1_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":6, "\ufdd0'tanker":0, "\ufdd0'spiker":2}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0, "\ufdd0'spiker":0.01})), tempest.levels.make_level_entry.call(null, 
tempest.levels._STAR_level2_lines_STAR_, true, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":0, "\ufdd0'spiker":3}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0, "\ufdd0'spiker":0.0050}), "\ufdd0'length-fn", function(p1__81501_SHARP_) {
  return 9 * p1__81501_SHARP_
}), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level3_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":5, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050})), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level4_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", 
"\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050})), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level5_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", 
"\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050})), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level6_lines_STAR_, true, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050})), 
tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level7_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050})), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level8_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", 
"\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050}), "\ufdd0'length-fn", function(p1__81502_SHARP_) {
  return 10 * p1__81502_SHARP_
}, "\ufdd0'steps", 400), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level9_lines_STAR_, false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050})), tempest.levels.make_level_entry.call(null, tempest.levels._STAR_level10_lines_STAR_, 
false, cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":20, "\ufdd0'tanker":10, "\ufdd0'spiker":6}), cljs.core.ObjMap.fromObject(["\ufdd0'flipper", "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0.01, "\ufdd0'tanker":0.0050, "\ufdd0'spiker":0.0050}))]);
goog.provide("goog.userAgent");
goog.require("goog.string");
goog.userAgent.ASSUME_IE = false;
goog.userAgent.ASSUME_GECKO = false;
goog.userAgent.ASSUME_WEBKIT = false;
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;
goog.userAgent.ASSUME_OPERA = false;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global["navigator"] ? goog.global["navigator"].userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"]
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;
  var ua;
  if(!goog.userAgent.BROWSER_KNOWN_ && (ua = goog.userAgent.getUserAgentString())) {
    var navigator = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = ua.indexOf("Opera") == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && ua.indexOf("MSIE") != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && ua.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && ua.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && navigator.product == "Gecko"
  }
};
if(!goog.userAgent.BROWSER_KNOWN_) {
  goog.userAgent.init_()
}
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = false;
goog.userAgent.ASSUME_WINDOWS = false;
goog.userAgent.ASSUME_LINUX = false;
goog.userAgent.ASSUME_X11 = false;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator()["appVersion"] || "", "X11")
};
if(!goog.userAgent.PLATFORM_KNOWN_) {
  goog.userAgent.initPlatform_()
}
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if(goog.userAgent.OPERA && goog.global["opera"]) {
    var operaVersion = goog.global["opera"].version;
    version = typeof operaVersion == "function" ? operaVersion() : operaVersion
  }else {
    if(goog.userAgent.GECKO) {
      re = /rv\:([^\);]+)(\)|;)/
    }else {
      if(goog.userAgent.IE) {
        re = /MSIE\s+([^\);]+)(\)|;)/
      }else {
        if(goog.userAgent.WEBKIT) {
          re = /WebKit\/(\S+)/
        }
      }
    }
    if(re) {
      var arr = re.exec(goog.userAgent.getUserAgentString());
      version = arr ? arr[1] : ""
    }
  }
  if(goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if(docMode > parseFloat(version)) {
      return String(docMode)
    }
  }
  return version
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(version) {
  return goog.userAgent.isVersionCache_[version] || (goog.userAgent.isVersionCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0)
};
goog.provide("goog.dom.BrowserFeature");
goog.require("goog.userAgent");
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isVersion("9"), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isVersion("9") || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.provide("goog.dom.TagName");
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", 
H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", SPAN:"SPAN", STRIKE:"STRIKE", 
STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR"};
goog.provide("goog.dom.classes");
goog.require("goog.array");
goog.dom.classes.set = function(element, className) {
  element.className = className
};
goog.dom.classes.get = function(element) {
  var className = element.className;
  return className && typeof className.split == "function" ? className.split(/\s+/) : []
};
goog.dom.classes.add = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var b = goog.dom.classes.add_(classes, args);
  element.className = classes.join(" ");
  return b
};
goog.dom.classes.remove = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var b = goog.dom.classes.remove_(classes, args);
  element.className = classes.join(" ");
  return b
};
goog.dom.classes.add_ = function(classes, args) {
  var rv = 0;
  for(var i = 0;i < args.length;i++) {
    if(!goog.array.contains(classes, args[i])) {
      classes.push(args[i]);
      rv++
    }
  }
  return rv == args.length
};
goog.dom.classes.remove_ = function(classes, args) {
  var rv = 0;
  for(var i = 0;i < classes.length;i++) {
    if(goog.array.contains(args, classes[i])) {
      goog.array.splice(classes, i--, 1);
      rv++
    }
  }
  return rv == args.length
};
goog.dom.classes.swap = function(element, fromClass, toClass) {
  var classes = goog.dom.classes.get(element);
  var removed = false;
  for(var i = 0;i < classes.length;i++) {
    if(classes[i] == fromClass) {
      goog.array.splice(classes, i--, 1);
      removed = true
    }
  }
  if(removed) {
    classes.push(toClass);
    element.className = classes.join(" ")
  }
  return removed
};
goog.dom.classes.addRemove = function(element, classesToRemove, classesToAdd) {
  var classes = goog.dom.classes.get(element);
  if(goog.isString(classesToRemove)) {
    goog.array.remove(classes, classesToRemove)
  }else {
    if(goog.isArray(classesToRemove)) {
      goog.dom.classes.remove_(classes, classesToRemove)
    }
  }
  if(goog.isString(classesToAdd) && !goog.array.contains(classes, classesToAdd)) {
    classes.push(classesToAdd)
  }else {
    if(goog.isArray(classesToAdd)) {
      goog.dom.classes.add_(classes, classesToAdd)
    }
  }
  element.className = classes.join(" ")
};
goog.dom.classes.has = function(element, className) {
  return goog.array.contains(goog.dom.classes.get(element), className)
};
goog.dom.classes.enable = function(element, className, enabled) {
  if(enabled) {
    goog.dom.classes.add(element, className)
  }else {
    goog.dom.classes.remove(element, className)
  }
};
goog.dom.classes.toggle = function(element, className) {
  var add = !goog.dom.classes.has(element, className);
  goog.dom.classes.enable(element, className, add);
  return add
};
goog.provide("goog.math.Coordinate");
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
if(goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return"(" + this.x + ", " + this.y + ")"
  }
}
goog.math.Coordinate.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.provide("goog.math.Size");
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height
};
goog.math.Size.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
if(goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return"(" + this.width + " x " + this.height + ")"
  }
}
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
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height
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
goog.math.Size.prototype.scale = function(s) {
  this.width *= s;
  this.height *= s;
  return this
};
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s)
};
goog.provide("goog.dom");
goog.provide("goog.dom.DomHelper");
goog.provide("goog.dom.NodeType");
goog.require("goog.array");
goog.require("goog.dom.BrowserFeature");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classes");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.dom.ASSUME_QUIRKS_MODE = false;
goog.dom.ASSUME_STANDARDS_MODE = false;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.defaultDomHelper_;
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(element) {
  return goog.isString(element) ? document.getElementById(element) : element
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el)
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if(goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll("." + className)
  }else {
    if(parent.getElementsByClassName) {
      return parent.getElementsByClassName(className)
    }
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if(goog.dom.canUseQuerySelector_(parent)) {
    retVal = parent.querySelector("." + className)
  }else {
    retVal = goog.dom.getElementsByClass(className, opt_el)[0]
  }
  return retVal || null
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return parent.querySelectorAll && parent.querySelector && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(document) || goog.userAgent.isVersion("528"))
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName = opt_tag && opt_tag != "*" ? opt_tag.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query)
  }
  if(opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if(tagName) {
      var arrayLike = {};
      var len = 0;
      for(var i = 0, el;el = els[i];i++) {
        if(tagName == el.nodeName) {
          arrayLike[len++] = el
        }
      }
      arrayLike.length = len;
      return arrayLike
    }else {
      return els
    }
  }
  var els = parent.getElementsByTagName(tagName || "*");
  if(opt_class) {
    var arrayLike = {};
    var len = 0;
    for(var i = 0, el;el = els[i];i++) {
      var className = el.className;
      if(typeof className.split == "function" && goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el
      }
    }
    arrayLike.length = len;
    return arrayLike
  }else {
    return els
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if(key == "style") {
      element.style.cssText = val
    }else {
      if(key == "class") {
        element.className = val
      }else {
        if(key == "for") {
          element.htmlFor = val
        }else {
          if(key in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val)
          }else {
            element[key] = val
          }
        }
      }
    }
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {"cellpadding":"cellPadding", "cellspacing":"cellSpacing", "colspan":"colSpan", "rowspan":"rowSpan", "valign":"vAlign", "height":"height", "width":"width", "usemap":"useMap", "frameborder":"frameBorder", "maxlength":"maxLength", "type":"type"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window)
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
    if(typeof win.innerHeight == "undefined") {
      win = window
    }
    var innerHeight = win.innerHeight;
    var scrollHeight = win.document.documentElement.scrollHeight;
    if(win == win.top) {
      if(scrollHeight < innerHeight) {
        innerHeight -= 15
      }
    }
    return new goog.math.Size(win.innerWidth, innerHeight)
  }
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document;
  var height = 0;
  if(doc) {
    var vh = goog.dom.getViewportSize_(win).height;
    var body = doc.body;
    var docEl = doc.documentElement;
    if(goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight
    }else {
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if(docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight
      }
      if(sh > vh) {
        height = sh > oh ? sh : oh
      }else {
        height = sh < oh ? sh : oh
      }
    }
  }
  return height
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    if(attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"')
    }
    if(attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      attributes = clone;
      delete attributes.type
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("")
  }
  var element = doc.createElement(tagName);
  if(attributes) {
    if(goog.isString(attributes)) {
      element.className = attributes
    }else {
      if(goog.isArray(attributes)) {
        goog.dom.classes.add.apply(null, [element].concat(attributes))
      }else {
        goog.dom.setProperties(element, attributes)
      }
    }
  }
  if(args.length > 2) {
    goog.dom.append_(doc, element, args, 2)
  }
  return element
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    if(child) {
      parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child)
    }
  }
  for(var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    if(goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.clone(arg) : arg, childHandler)
    }else {
      childHandler(arg)
    }
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name)
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(content)
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp)
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var rowHtml = ["<tr>"];
  for(var i = 0;i < columns;i++) {
    rowHtml.push(fillWithNbsp ? "<td>&nbsp;</td>" : "<td></td>")
  }
  rowHtml.push("</tr>");
  rowHtml = rowHtml.join("");
  var totalHtml = ["<table>"];
  for(i = 0;i < rows;i++) {
    totalHtml.push(rowHtml)
  }
  totalHtml.push("</table>");
  var elem = doc.createElement(goog.dom.TagName.DIV);
  elem.innerHTML = totalHtml.join("");
  return elem.removeChild(elem.firstChild)
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString)
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement("div");
  if(goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = "<br>" + htmlString;
    tempDiv.removeChild(tempDiv.firstChild)
  }else {
    tempDiv.innerHTML = htmlString
  }
  if(tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(tempDiv.firstChild)
  }else {
    var fragment = doc.createDocumentFragment();
    while(tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild)
    }
    return fragment
  }
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(doc) {
  if(goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE
  }
  return doc.compatMode == "CSS1Compat"
};
goog.dom.canHaveChildren = function(node) {
  if(node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false
  }
  switch(node.tagName) {
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
      return false
  }
  return true
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child)
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1)
};
goog.dom.removeChildren = function(node) {
  var child;
  while(child = node.firstChild) {
    node.removeChild(child)
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if(refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode)
  }
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if(refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling)
  }
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null)
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if(parent) {
    parent.replaceChild(newNode, oldNode)
  }
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if(parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(element.removeNode) {
      return element.removeNode(false)
    }else {
      while(child = element.firstChild) {
        parent.insertBefore(child, element)
      }
      return goog.dom.removeNode(element)
    }
  }
};
goog.dom.getChildren = function(element) {
  if(goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && element.children != undefined) {
    return element.children
  }
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(node) {
  if(node.firstElementChild != undefined) {
    return node.firstElementChild
  }
  return goog.dom.getNextElementNode_(node.firstChild, true)
};
goog.dom.getLastElementChild = function(node) {
  if(node.lastElementChild != undefined) {
    return node.lastElementChild
  }
  return goog.dom.getNextElementNode_(node.lastChild, false)
};
goog.dom.getNextElementSibling = function(node) {
  if(node.nextElementSibling != undefined) {
    return node.nextElementSibling
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true)
};
goog.dom.getPreviousElementSibling = function(node) {
  if(node.previousElementSibling != undefined) {
    return node.previousElementSibling
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false)
};
goog.dom.getNextElementNode_ = function(node, forward) {
  while(node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling
  }
  return node
};
goog.dom.getNextNode = function(node) {
  if(!node) {
    return null
  }
  if(node.firstChild) {
    return node.firstChild
  }
  while(node && !node.nextSibling) {
    node = node.parentNode
  }
  return node ? node.nextSibling : null
};
goog.dom.getPreviousNode = function(node) {
  if(!node) {
    return null
  }
  if(!node.previousSibling) {
    return node.parentNode
  }
  node = node.previousSibling;
  while(node && node.lastChild) {
    node = node.lastChild
  }
  return node
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj["window"] == obj
};
goog.dom.contains = function(parent, descendant) {
  if(parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant)
  }
  if(typeof parent.compareDocumentPosition != "undefined") {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16)
  }
  while(descendant && parent != descendant) {
    descendant = descendant.parentNode
  }
  return descendant == parent
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if(node1 == node2) {
    return 0
  }
  if(node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1
  }
  if("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if(isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex
    }else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;
      if(parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2)
      }
      if(!isElement1 && goog.dom.contains(parent1, node2)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2)
      }
      if(!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1)
      }
      return(isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex)
    }
  }
  var doc = goog.dom.getOwnerDocument(node1);
  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);
  return range1.compareBoundaryPoints(goog.global["Range"].START_TO_END, range2)
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if(parent == node) {
    return-1
  }
  var sibling = node;
  while(sibling.parentNode != parent) {
    sibling = sibling.parentNode
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode)
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while(s = s.previousSibling) {
    if(s == node1) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if(!count) {
    return null
  }else {
    if(count == 1) {
      return arguments[0]
    }
  }
  var paths = [];
  var minLength = Infinity;
  for(i = 0;i < count;i++) {
    var ancestors = [];
    var node = arguments[i];
    while(node) {
      ancestors.unshift(node);
      node = node.parentNode
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length)
  }
  var output = null;
  for(i = 0;i < minLength;i++) {
    var first = paths[0][i];
    for(var j = 1;j < count;j++) {
      if(first != paths[j][i]) {
        return output
      }
    }
    output = first
  }
  return output
};
goog.dom.getOwnerDocument = function(node) {
  return node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document
};
goog.dom.getFrameContentDocument = function(frame) {
  var doc;
  if(goog.userAgent.WEBKIT) {
    doc = frame.document || frame.contentWindow.document
  }else {
    doc = frame.contentDocument || frame.contentWindow.document
  }
  return doc
};
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(frame))
};
goog.dom.setTextContent = function(element, text) {
  if("textContent" in element) {
    element.textContent = text
  }else {
    if(element.firstChild && element.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      while(element.lastChild != element.firstChild) {
        element.removeChild(element.lastChild)
      }
      element.firstChild.data = text
    }else {
      goog.dom.removeChildren(element);
      var doc = goog.dom.getOwnerDocument(element);
      element.appendChild(doc.createTextNode(text))
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if("outerHTML" in element) {
    return element.outerHTML
  }else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement("div");
    div.appendChild(element.cloneNode(true));
    return div.innerHTML
  }
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if(root != null) {
    for(var i = 0, child;child = root.childNodes[i];i++) {
      if(p(child)) {
        rv.push(child);
        if(findOne) {
          return true
        }
      }
      if(goog.dom.findNodes_(child, p, rv, findOne)) {
        return true
      }
    }
  }
  return false
};
goog.dom.TAGS_TO_IGNORE_ = {"SCRIPT":1, "STYLE":1, "HEAD":1, "IFRAME":1, "OBJECT":1};
goog.dom.PREDEFINED_TAG_VALUES_ = {"IMG":" ", "BR":"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  if(attrNode && attrNode.specified) {
    var index = element.tabIndex;
    return goog.isNumber(index) && index >= 0
  }
  return false
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  if(enable) {
    element.tabIndex = 0
  }else {
    element.removeAttribute("tabIndex")
  }
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText)
  }else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join("")
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  if(!goog.userAgent.IE) {
    textContent = textContent.replace(/ +/g, " ")
  }
  if(textContent != " ") {
    textContent = textContent.replace(/^\s*/, "")
  }
  return textContent
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);
  return buf.join("")
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if(node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
  }else {
    if(node.nodeType == goog.dom.NodeType.TEXT) {
      if(normalizeWhitespace) {
        buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""))
      }else {
        buf.push(node.nodeValue)
      }
    }else {
      if(node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName])
      }else {
        var child = node.firstChild;
        while(child) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace);
          child = child.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while(node && node != root) {
    var cur = node;
    while(cur = cur.previousSibling) {
      buf.unshift(goog.dom.getTextContent(cur))
    }
    node = node.parentNode
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur;
  while(stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if(cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    }else {
      if(cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        pos += text.length
      }else {
        if(cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length
        }else {
          for(var i = cur.childNodes.length - 1;i >= 0;i--) {
            stack.push(cur.childNodes[i])
          }
        }
      }
    }
  }
  if(goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur
  }
  return cur
};
goog.dom.isNodeList = function(val) {
  if(val && typeof val.length == "number") {
    if(goog.isObject(val)) {
      return typeof val.item == "function" || typeof val.item == "string"
    }else {
      if(goog.isFunction(val)) {
        return typeof val.item == "function"
      }
    }
  }
  return false
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class) {
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return goog.dom.getAncestor(element, function(node) {
    return(!tagName || node.nodeName == tagName) && (!opt_class || goog.dom.classes.has(node, opt_class))
  }, true)
};
goog.dom.getAncestorByClass = function(element, opt_class) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, opt_class)
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if(!opt_includeNode) {
    element = element.parentNode
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while(element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    if(matcher(element)) {
      return element
    }
    element = element.parentNode;
    steps++
  }
  return null
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  if(goog.isString(element)) {
    return this.document_.getElementById(element)
  }else {
    return element
  }
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc)
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.Appendable;
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name)
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(content)
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString)
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
goog.provide("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyCodes = {MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, QUESTION_MARK:63, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, 
V:86, W:87, X:88, Y:89, Z:90, META:91, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, 
BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, WIN_IME:229, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(e) {
  if(e.altKey && !e.ctrlKey || e.metaKey || e.keyCode >= goog.events.KeyCodes.F1 && e.keyCode <= goog.events.KeyCodes.F12) {
    return false
  }
  switch(e.keyCode) {
    case goog.events.KeyCodes.ALT:
    ;
    case goog.events.KeyCodes.CAPS_LOCK:
    ;
    case goog.events.KeyCodes.CONTEXT_MENU:
    ;
    case goog.events.KeyCodes.CTRL:
    ;
    case goog.events.KeyCodes.DOWN:
    ;
    case goog.events.KeyCodes.END:
    ;
    case goog.events.KeyCodes.ESC:
    ;
    case goog.events.KeyCodes.HOME:
    ;
    case goog.events.KeyCodes.INSERT:
    ;
    case goog.events.KeyCodes.LEFT:
    ;
    case goog.events.KeyCodes.MAC_FF_META:
    ;
    case goog.events.KeyCodes.META:
    ;
    case goog.events.KeyCodes.NUMLOCK:
    ;
    case goog.events.KeyCodes.NUM_CENTER:
    ;
    case goog.events.KeyCodes.PAGE_DOWN:
    ;
    case goog.events.KeyCodes.PAGE_UP:
    ;
    case goog.events.KeyCodes.PAUSE:
    ;
    case goog.events.KeyCodes.PHANTOM:
    ;
    case goog.events.KeyCodes.PRINT_SCREEN:
    ;
    case goog.events.KeyCodes.RIGHT:
    ;
    case goog.events.KeyCodes.SHIFT:
    ;
    case goog.events.KeyCodes.UP:
    ;
    case goog.events.KeyCodes.WIN_KEY:
      return false;
    default:
      return true
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(keyCode, opt_heldKeyCode, opt_shiftKey, opt_ctrlKey, opt_altKey) {
  if(!goog.userAgent.IE && !(goog.userAgent.WEBKIT && goog.userAgent.isVersion("525"))) {
    return true
  }
  if(goog.userAgent.MAC && opt_altKey) {
    return goog.events.KeyCodes.isCharacterKey(keyCode)
  }
  if(opt_altKey && !opt_ctrlKey) {
    return false
  }
  if(!opt_shiftKey && (opt_heldKeyCode == goog.events.KeyCodes.CTRL || opt_heldKeyCode == goog.events.KeyCodes.ALT)) {
    return false
  }
  if(goog.userAgent.IE && opt_ctrlKey && opt_heldKeyCode == keyCode) {
    return false
  }
  switch(keyCode) {
    case goog.events.KeyCodes.ENTER:
      return true;
    case goog.events.KeyCodes.ESC:
      return!goog.userAgent.WEBKIT
  }
  return goog.events.KeyCodes.isCharacterKey(keyCode)
};
goog.events.KeyCodes.isCharacterKey = function(keyCode) {
  if(keyCode >= goog.events.KeyCodes.ZERO && keyCode <= goog.events.KeyCodes.NINE) {
    return true
  }
  if(keyCode >= goog.events.KeyCodes.NUM_ZERO && keyCode <= goog.events.KeyCodes.NUM_MULTIPLY) {
    return true
  }
  if(keyCode >= goog.events.KeyCodes.A && keyCode <= goog.events.KeyCodes.Z) {
    return true
  }
  if(goog.userAgent.WEBKIT && keyCode == 0) {
    return true
  }
  switch(keyCode) {
    case goog.events.KeyCodes.SPACE:
    ;
    case goog.events.KeyCodes.QUESTION_MARK:
    ;
    case goog.events.KeyCodes.NUM_PLUS:
    ;
    case goog.events.KeyCodes.NUM_MINUS:
    ;
    case goog.events.KeyCodes.NUM_PERIOD:
    ;
    case goog.events.KeyCodes.NUM_DIVISION:
    ;
    case goog.events.KeyCodes.SEMICOLON:
    ;
    case goog.events.KeyCodes.DASH:
    ;
    case goog.events.KeyCodes.EQUALS:
    ;
    case goog.events.KeyCodes.COMMA:
    ;
    case goog.events.KeyCodes.PERIOD:
    ;
    case goog.events.KeyCodes.SLASH:
    ;
    case goog.events.KeyCodes.APOSTROPHE:
    ;
    case goog.events.KeyCodes.SINGLE_QUOTE:
    ;
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    ;
    case goog.events.KeyCodes.BACKSLASH:
    ;
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return true;
    default:
      return false
  }
};
goog.provide("goog.math");
goog.require("goog.array");
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max)
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a)
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1.0E-6)
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360)
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180
};
goog.math.toDegrees = function(angleRadians) {
  return angleRadians * 180 / Math.PI
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees))
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees))
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)))
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  if(d > 180) {
    d = d - 360
  }else {
    if(d <= -180) {
      d = 360 + d
    }
  }
  return d
};
goog.math.sign = function(x) {
  return x == 0 ? 0 : x < 0 ? -1 : 1
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b
  };
  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1]
  };
  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];
  for(var i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0
  }
  for(var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0
  }
  for(i = 1;i <= length1;i++) {
    for(j = 1;j <= length1;j++) {
      if(compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1
      }else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1])
      }
    }
  }
  var result = [];
  var i = length1, j = length2;
  while(i > 0 && j > 0) {
    if(compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--
    }else {
      if(arr[i - 1][j] > arr[i][j - 1]) {
        i--
      }else {
        j--
      }
    }
  }
  return result
};
goog.math.sum = function(var_args) {
  return goog.array.reduce(arguments, function(sum, value) {
    return sum + value
  }, 0)
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(var_args) {
  var sampleSize = arguments.length;
  if(sampleSize < 2) {
    return 0
  }
  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2)
  })) / (sampleSize - 1);
  return Math.sqrt(variance)
};
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num)
};
goog.provide("tempest.path");
goog.require("cljs.core");
goog.require("tempest.levels");
goog.require("tempest.util");
goog.require("goog.dom");
goog.require("goog.math");
tempest.path.add_sub = function add_sub(point0, point1) {
  return cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, point1) + cljs.core.first.call(null, point0), cljs.core.peek.call(null, point1) - cljs.core.peek.call(null, point0)])
};
tempest.path.cartesian_edge_coordinates = function cartesian_edge_coordinates(level, seg_idx, step) {
  var edges__81510 = tempest.path.polar_lines_for_segment.call(null, level, seg_idx, false);
  var edge_steps__81511 = tempest.path.step_lengths_for_segment_lines.call(null, level, seg_idx);
  var offset0__81512 = cljs.core.first.call(null, edge_steps__81511) * step;
  var offset1__81513 = cljs.core.peek.call(null, edge_steps__81511) * step;
  var point0__81514 = tempest.path.polar_extend.call(null, offset0__81512, cljs.core.first.call(null, edges__81510));
  var point1__81515 = tempest.path.polar_extend.call(null, offset1__81513, cljs.core.peek.call(null, edges__81510));
  return cljs.core.PersistentVector.fromArray([tempest.path.polar_to_cartesian_coords.call(null, point0__81514), tempest.path.polar_to_cartesian_coords.call(null, point1__81515)])
};
tempest.path.cartesian_point_between_segments = function cartesian_point_between_segments(level, seg_idx0, seg_idx1, step) {
  var line__81516 = tempest.path.edge_line_between_segments.call(null, level, seg_idx0, seg_idx1);
  var line_steps__81517 = tempest.path.step_length_for_level_line.call(null, level, line__81516);
  var offset__81518 = line_steps__81517 * step;
  var point0__81519 = tempest.path.polar_extend.call(null, offset__81518, line__81516);
  return tempest.path.polar_to_cartesian_coords.call(null, point0__81519)
};
tempest.path.edge_line_between_segments = function edge_line_between_segments(level, seg_idx0, seg_idx1) {
  var segs0__81520 = cljs.core.get.call(null, "\ufdd0'segments".call(null, level), seg_idx0);
  var segs1__81521 = cljs.core.get.call(null, "\ufdd0'segments".call(null, level), seg_idx1);
  var allsegs__81522 = cljs.core.flatten.call(null, cljs.core.PersistentVector.fromArray([segs0__81520, segs1__81521]));
  return cljs.core.first.call(null, function() {
    var iter__520__auto____81530 = function iter__81523(s__81524) {
      return new cljs.core.LazySeq(null, false, function() {
        var s__81524__81525 = s__81524;
        while(true) {
          if(cljs.core.truth_(cljs.core.seq.call(null, s__81524__81525))) {
            var vec__81526__81527 = cljs.core.first.call(null, s__81524__81525);
            var id__81528 = cljs.core.nth.call(null, vec__81526__81527, 0, null);
            var freq__81529 = cljs.core.nth.call(null, vec__81526__81527, 1, null);
            if(cljs.core.truth_(freq__81529 > 1)) {
              return cljs.core.cons.call(null, cljs.core.get.call(null, "\ufdd0'lines".call(null, level), id__81528), iter__81523.call(null, cljs.core.rest.call(null, s__81524__81525)))
            }else {
              var G__81531 = cljs.core.rest.call(null, s__81524__81525);
              s__81524__81525 = G__81531;
              continue
            }
          }else {
            return null
          }
          break
        }
      })
    };
    return iter__520__auto____81530.call(null, cljs.core.frequencies.call(null, allsegs__81522))
  }())
};
tempest.path.flip_angle_between_segments = function flip_angle_between_segments(level, seg_idx_cur, seg_idx_new, cw_QMARK_) {
  var angle_cur__81532 = tempest.path.segment_angle.call(null, level, seg_idx_cur);
  var angle_new__81533 = tempest.path.segment_angle.call(null, level, seg_idx_new);
  return(0 - (angle_new__81533 + 3.14159265 - angle_cur__81532)) % 6.2831853
};
tempest.path.flip_point_between_segments = function flip_point_between_segments(level, seg_idx_cur, seg_idx_new, step, cw_QMARK_) {
  var vec__81534__81536 = tempest.path.cartesian_point_between_segments.call(null, level, seg_idx_cur, seg_idx_new, step);
  var x0__81537 = cljs.core.nth.call(null, vec__81534__81536, 0, null);
  var y0__81538 = cljs.core.nth.call(null, vec__81534__81536, 1, null);
  var vec__81535__81539 = tempest.path.polar_to_cartesian_coords.call(null, tempest.path.polar_segment_midpoint.call(null, level, seg_idx_cur, step));
  var x1__81540 = cljs.core.nth.call(null, vec__81535__81539, 0, null);
  var y1__81541 = cljs.core.nth.call(null, vec__81535__81539, 1, null);
  var edge_points__81542 = tempest.path.cartesian_edge_coordinates.call(null, level, seg_idx_new, step);
  return cljs.core.PersistentVector.fromArray([x1__81540 - x0__81537, y0__81538 - y1__81541])
};
tempest.path.rebase_origin = function rebase_origin(point, origin) {
  return tempest.path.add_sub.call(null, point, origin)
};
tempest.path.polar_to_cartesian_centered = function polar_to_cartesian_centered(point, p__81543) {
  var map__81544__81545 = p__81543;
  var map__81544__81546 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81544__81545)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81544__81545) : map__81544__81545;
  var width__81547 = cljs.core.get.call(null, map__81544__81546, "\ufdd0'width");
  var height__81548 = cljs.core.get.call(null, map__81544__81546, "\ufdd0'height");
  return tempest.path.rebase_origin.call(null, tempest.path.polar_to_cartesian_coords.call(null, point), cljs.core.PersistentVector.fromArray([width__81547 / 2, height__81548 / 2]))
};
tempest.path.polar_to_cartesian_coords = function() {
  var polar_to_cartesian_coords = null;
  var polar_to_cartesian_coords__81560 = function(p__81549) {
    var vec__81551__81552 = p__81549;
    var r__81553 = cljs.core.nth.call(null, vec__81551__81552, 0, null);
    var angle__81554 = cljs.core.nth.call(null, vec__81551__81552, 1, null);
    return cljs.core.PersistentVector.fromArray([goog.math.angleDx.call(null, angle__81554, r__81553), goog.math.angleDy.call(null, angle__81554, r__81553)])
  };
  var polar_to_cartesian_coords__81561 = function(p__81550, length_fn) {
    var vec__81555__81556 = p__81550;
    var r__81557 = cljs.core.nth.call(null, vec__81555__81556, 0, null);
    var angle__81558 = cljs.core.nth.call(null, vec__81555__81556, 1, null);
    var newr__81559 = length_fn.call(null, r__81557);
    return cljs.core.PersistentVector.fromArray([goog.math.angleDx.call(null, angle__81558, newr__81559), goog.math.angleDy.call(null, angle__81558, newr__81559)])
  };
  polar_to_cartesian_coords = function(p__81550, length_fn) {
    switch(arguments.length) {
      case 1:
        return polar_to_cartesian_coords__81560.call(this, p__81550);
      case 2:
        return polar_to_cartesian_coords__81561.call(this, p__81550, length_fn)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return polar_to_cartesian_coords
}();
tempest.path.round_path_math = function round_path_math(path) {
  return cljs.core.map.call(null, function(coords) {
    return cljs.core.PersistentVector.fromArray([Math["round"].call(null, cljs.core.first.call(null, coords)), Math["round"].call(null, cljs.core.peek.call(null, coords))])
  }, path)
};
tempest.path.round_path_hack = function round_path_hack(path) {
  return cljs.core.map.call(null, function(p__81563) {
    var vec__81564__81565 = p__81563;
    var x__81566 = cljs.core.nth.call(null, vec__81564__81565, 0, null);
    var y__81567 = cljs.core.nth.call(null, vec__81564__81565, 1, null);
    return cljs.core.PersistentVector.fromArray([~~(0.5 + x__81566), ~~(0.5 + y__81567)])
  }, path)
};
tempest.path.round_path = tempest.path.round_path_hack;
tempest.path.point_to_canvas_coords = function point_to_canvas_coords(p__81569, p) {
  var map__81570__81571 = p__81569;
  var map__81570__81572 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81570__81571)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81570__81571) : map__81570__81571;
  var width__81573 = cljs.core.get.call(null, map__81570__81572, "\ufdd0'width");
  var height__81574 = cljs.core.get.call(null, map__81570__81572, "\ufdd0'height");
  var xmid__81575 = width__81573 / 2;
  var ymid__81576 = height__81574 / 2;
  return cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, p) + xmid__81575, ymid__81576 - cljs.core.peek.call(null, p)])
};
tempest.path.rectangle_to_canvas_coords = function rectangle_to_canvas_coords(dims, rect) {
  return cljs.core.map.call(null, function(p1__81568_SHARP_) {
    return tempest.path.point_to_canvas_coords.call(null, dims, p1__81568_SHARP_)
  }, rect)
};
tempest.path.rectangle_for_segment = function rectangle_for_segment(level, seg_idx) {
  var vec__81577__81578 = cljs.core.get.call(null, "\ufdd0'segments".call(null, level), seg_idx);
  var seg0__81579 = cljs.core.nth.call(null, vec__81577__81578, 0, null);
  var seg1__81580 = cljs.core.nth.call(null, vec__81577__81578, 1, null);
  var line0__81581 = cljs.core.get.call(null, "\ufdd0'lines".call(null, level), seg0__81579);
  var line1__81582 = cljs.core.get.call(null, "\ufdd0'lines".call(null, level), seg1__81580);
  return cljs.core.PersistentVector.fromArray([tempest.path.polar_to_cartesian_coords.call(null, line0__81581), tempest.path.polar_to_cartesian_coords.call(null, line0__81581, "\ufdd0'length-fn".call(null, level)), tempest.path.polar_to_cartesian_coords.call(null, line1__81582, "\ufdd0'length-fn".call(null, level)), tempest.path.polar_to_cartesian_coords.call(null, line1__81582)])
};
tempest.path.polar_segment_midpoint = function polar_segment_midpoint(level, seg_idx, step) {
  var steplen__81583 = tempest.path.step_length_segment_midpoint.call(null, level, seg_idx);
  var offset__81584 = steplen__81583 * step;
  var midpoint__81585 = tempest.path.segment_midpoint.call(null, level, seg_idx);
  return tempest.path.polar_extend.call(null, offset__81584, midpoint__81585)
};
tempest.path.polar_entity_coord = function polar_entity_coord(entity) {
  return tempest.path.polar_segment_midpoint.call(null, "\ufdd0'level".call(null, entity), "\ufdd0'segment".call(null, entity), "\ufdd0'step".call(null, entity))
};
tempest.path.step_length_segment_midpoint = function step_length_segment_midpoint(level, seg_idx) {
  return(cljs.core.first.call(null, tempest.path.segment_midpoint.call(null, level, seg_idx, true)) - cljs.core.first.call(null, tempest.path.segment_midpoint.call(null, level, seg_idx, false))) / "\ufdd0'steps".call(null, level)
};
tempest.path.step_length_segment_edge = function step_length_segment_edge(level, line) {
  return("\ufdd0'length-fn".call(null, level).call(null, cljs.core.first.call(null, line)) - cljs.core.first.call(null, line)) / "\ufdd0'steps".call(null, level)
};
tempest.path.step_length_line = function step_length_line(level, point0, point1) {
  return Math["abs"].call(null, (cljs.core.first.call(null, point0) - cljs.core.first.call(null, point1)) / "\ufdd0'steps".call(null, level))
};
tempest.path.step_length_for_level_line = function step_length_for_level_line(level, line) {
  var longline__81590 = tempest.path.scale_polar_coord.call(null, "\ufdd0'length-fn".call(null, level), line);
  return tempest.path.step_length_line.call(null, level, line, longline__81590)
};
tempest.path.step_lengths_for_segment_lines = function step_lengths_for_segment_lines(level, seg_idx) {
  var coords__81591 = cljs.core.concat.call(null, tempest.path.polar_lines_for_segment.call(null, level, seg_idx, false), tempest.path.polar_lines_for_segment.call(null, level, seg_idx, true));
  var line0__81592 = cljs.core.take_nth.call(null, 2, coords__81591);
  var line1__81593 = cljs.core.take_nth.call(null, 2, cljs.core.rest.call(null, coords__81591));
  return cljs.core.PersistentVector.fromArray([cljs.core.apply.call(null, function(p1__81586_SHARP_, p2__81587_SHARP_) {
    return tempest.path.step_length_line.call(null, level, p1__81586_SHARP_, p2__81587_SHARP_)
  }, line0__81592), cljs.core.apply.call(null, function(p1__81588_SHARP_, p2__81589_SHARP_) {
    return tempest.path.step_length_line.call(null, level, p1__81588_SHARP_, p2__81589_SHARP_)
  }, line1__81593)])
};
tempest.path.polar_distance = function polar_distance(p__81594, p__81595) {
  var vec__81596__81598 = p__81594;
  var r0__81599 = cljs.core.nth.call(null, vec__81596__81598, 0, null);
  var theta0__81600 = cljs.core.nth.call(null, vec__81596__81598, 1, null);
  var vec__81597__81601 = p__81595;
  var r1__81602 = cljs.core.nth.call(null, vec__81597__81601, 0, null);
  var theta1__81603 = cljs.core.nth.call(null, vec__81597__81601, 1, null);
  return Math["sqrt"].call(null, Math["pow"].call(null, r0__81599, 2) + Math["pow"].call(null, r1__81602, 2) + -2 * r0__81599 * r1__81602 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, theta1__81603 - theta0__81600)))
};
tempest.path.polar_midpoint_r = function polar_midpoint_r(p__81604, p__81605) {
  var vec__81606__81608 = p__81604;
  var r0__81609 = cljs.core.nth.call(null, vec__81606__81608, 0, null);
  var theta0__81610 = cljs.core.nth.call(null, vec__81606__81608, 1, null);
  var vec__81607__81611 = p__81605;
  var r1__81612 = cljs.core.nth.call(null, vec__81607__81611, 0, null);
  var theta1__81613 = cljs.core.nth.call(null, vec__81607__81611, 1, null);
  return Math["round"].call(null, Math["sqrt"].call(null, Math["pow"].call(null, r0__81609, 2) + Math["pow"].call(null, r1__81612, 2) + 2 * r0__81609 * r1__81612 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, theta1__81613 - theta0__81610))) / 2)
};
tempest.path.polar_midpoint_theta = function polar_midpoint_theta(p__81614, p__81615) {
  var vec__81616__81618 = p__81614;
  var r0__81619 = cljs.core.nth.call(null, vec__81616__81618, 0, null);
  var theta0__81620 = cljs.core.nth.call(null, vec__81616__81618, 1, null);
  var vec__81617__81621 = p__81615;
  var r1__81622 = cljs.core.nth.call(null, vec__81617__81621, 0, null);
  var theta1__81623 = cljs.core.nth.call(null, vec__81617__81621, 1, null);
  return Math["round"].call(null, (tempest.util.rad_to_deg.call(null, Math["atan2"].call(null, r0__81619 * Math["sin"].call(null, tempest.util.deg_to_rad.call(null, theta0__81620)) + r1__81622 * Math["sin"].call(null, tempest.util.deg_to_rad.call(null, theta1__81623)), r0__81619 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, theta0__81620)) + r1__81622 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, theta1__81623)))) + 360) % 360)
};
tempest.path.polar_midpoint = function polar_midpoint(point0, point1) {
  return cljs.core.PersistentVector.fromArray([tempest.path.polar_midpoint_r.call(null, point0, point1), tempest.path.polar_midpoint_theta.call(null, point0, point1)])
};
tempest.path.segment_midpoint = function segment_midpoint(level, seg_idx, scaled_QMARK_) {
  return cljs.core.apply.call(null, tempest.path.polar_midpoint, tempest.path.polar_lines_for_segment.call(null, level, seg_idx, scaled_QMARK_))
};
tempest.path.scale_polar_coord = function scale_polar_coord(scalefn, coord) {
  return cljs.core.PersistentVector.fromArray([scalefn.call(null, cljs.core.first.call(null, coord)), cljs.core.peek.call(null, coord)])
};
tempest.path.polar_extend = function polar_extend(length, coord) {
  return cljs.core.PersistentVector.fromArray([length + cljs.core.first.call(null, coord), cljs.core.peek.call(null, coord)])
};
tempest.path.polar_lines_for_segment = function polar_lines_for_segment(level, seg_idx, scaled_QMARK_) {
  var vec__81624__81625 = cljs.core.get.call(null, "\ufdd0'segments".call(null, level), seg_idx);
  var seg0__81626 = cljs.core.nth.call(null, vec__81624__81625, 0, null);
  var seg1__81627 = cljs.core.nth.call(null, vec__81624__81625, 1, null);
  var line0__81628 = cljs.core.get.call(null, "\ufdd0'lines".call(null, level), seg0__81626);
  var line1__81629 = cljs.core.get.call(null, "\ufdd0'lines".call(null, level), seg1__81627);
  if(cljs.core.truth_(scaled_QMARK_ === true)) {
    return cljs.core.PersistentVector.fromArray([tempest.path.scale_polar_coord.call(null, "\ufdd0'length-fn".call(null, level), line0__81628), tempest.path.scale_polar_coord.call(null, "\ufdd0'length-fn".call(null, level), line1__81629)])
  }else {
    return cljs.core.PersistentVector.fromArray([line0__81628, line1__81629])
  }
};
tempest.path._STAR_player_path_STAR_ = cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([24, 90]), cljs.core.PersistentVector.fromArray([26, 196]), cljs.core.PersistentVector.fromArray([16, 333]), cljs.core.PersistentVector.fromArray([10, 135]), cljs.core.PersistentVector.fromArray([18, 11]), cljs.core.PersistentVector.fromArray([18, 349]), cljs.core.PersistentVector.fromArray([10, 225]), cljs.core.PersistentVector.fromArray([16, 27]), cljs.core.PersistentVector.fromArray([26, 
164])]);
tempest.path.bounding_box_from_radius = function bounding_box_from_radius(origin, radius) {
  var d__81630 = radius * 2;
  return cljs.core.ObjMap.fromObject(["\ufdd0'x", "\ufdd0'y", "\ufdd0'width", "\ufdd0'height"], {"\ufdd0'x":cljs.core.first.call(null, origin) - radius, "\ufdd0'y":cljs.core.peek.call(null, origin) - radius, "\ufdd0'width":d__81630, "\ufdd0'height":d__81630})
};
tempest.path.player_path_on_level = function player_path_on_level(player) {
  return tempest.path.rotate_path.call(null, tempest.path.enemy_angle.call(null, player), tempest.path.player_path_with_width.call(null, 0.75 * tempest.path.entity_desired_width.call(null, player), cljs.core._EQ_.call(null, "\ufdd0'step".call(null, player), "\ufdd0'steps".call(null, "\ufdd0'level".call(null, player)))))
};
tempest.path.flipper_path_bounding_circle_radius = function flipper_path_bounding_circle_radius(path) {
  return cljs.core.map.call(null, cljs.core.first, path)
};
tempest.path.flipper_path_on_level = function flipper_path_on_level(flipper) {
  var coord__81631 = tempest.path.polar_entity_coord.call(null, flipper);
  return tempest.path.rotate_path.call(null, tempest.path.enemy_angle.call(null, flipper), tempest.path.flipper_path_with_width.call(null, 0.8 * tempest.path.entity_desired_width.call(null, flipper)))
};
tempest.path.tanker_path_on_level = function tanker_path_on_level(tanker) {
  var coord__81632 = tempest.path.polar_entity_coord.call(null, tanker);
  return tempest.path.rotate_path.call(null, tempest.path.enemy_angle.call(null, tanker), tempest.path.tanker_path_with_width.call(null, tempest.path.entity_desired_width.call(null, tanker)))
};
tempest.path.spiker_path_on_level = function spiker_path_on_level(entity) {
  var coord__81633 = tempest.path.polar_entity_coord.call(null, entity);
  return tempest.path.rotate_path.call(null, tempest.path.enemy_angle.call(null, entity), tempest.path.spiker_path_with_width.call(null, tempest.path.entity_desired_width.call(null, entity)))
};
tempest.path.projectile_path_on_level = function projectile_path_on_level(projectile) {
  var coord__81634 = tempest.path.polar_entity_coord.call(null, projectile);
  return tempest.path.rotate_path.call(null, tempest.path.enemy_angle.call(null, projectile), tempest.path.projectile_path_with_width.call(null, 0.3 * tempest.path.entity_desired_width.call(null, projectile)))
};
tempest.path.tanker_path_with_width = function tanker_path_with_width(width) {
  var r__81635 = 0.55 * (width / (2 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, 45))));
  var midheight__81636 = 0.55 * r__81635 * Math["sin"].call(null, tempest.util.deg_to_rad.call(null, 45));
  var r2__81637 = 0.55 * (width / 2 / (2 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, 65))));
  return cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([midheight__81636, 270]), cljs.core.PersistentVector.fromArray([r__81635, 45]), cljs.core.PersistentVector.fromArray([r__81635, 135]), cljs.core.PersistentVector.fromArray([r__81635, 225]), cljs.core.PersistentVector.fromArray([r__81635, 315]), cljs.core.PersistentVector.fromArray([r2__81637, 65]), cljs.core.PersistentVector.fromArray([r2__81637, 115]), cljs.core.PersistentVector.fromArray([r2__81637, 245]), cljs.core.PersistentVector.fromArray([r2__81637, 
  295])])
};
tempest.path.flipper_path_with_width = function flipper_path_with_width(width) {
  var r__81638 = width / Math["cos"].call(null, tempest.util.deg_to_rad.call(null, 16));
  return cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([0, 0]), cljs.core.PersistentVector.fromArray([r__81638 / 2, 16]), cljs.core.PersistentVector.fromArray([r__81638 / 4, 214]), cljs.core.PersistentVector.fromArray([r__81638 / 4, 326]), cljs.core.PersistentVector.fromArray([r__81638, 164]), cljs.core.PersistentVector.fromArray([r__81638 / 4, 326]), cljs.core.PersistentVector.fromArray([r__81638 / 4, 214]), cljs.core.PersistentVector.fromArray([r__81638 / 2, 16])])
};
tempest.path.spiker_path_with_width = function spiker_path_with_width(width) {
  var r__81639 = tempest.util.round.call(null, width / Math["cos"].call(null, tempest.util.deg_to_rad.call(null, 16)));
  var r_14__81640 = r__81639 / 14;
  var r_11__81641 = r__81639 / 11;
  var r_8__81642 = r__81639 / 8;
  var r_6__81643 = r__81639 / 6;
  var r_5__81644 = r__81639 / 5;
  var r_4__81645 = r__81639 / 4;
  return cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([0, 0]), cljs.core.PersistentVector.fromArray([r_14__81640, 0]), cljs.core.PersistentVector.fromArray([r_14__81640, 60]), cljs.core.PersistentVector.fromArray([r_11__81641, 120]), cljs.core.PersistentVector.fromArray([r_11__81641, 180]), cljs.core.PersistentVector.fromArray([r_8__81642, 240]), cljs.core.PersistentVector.fromArray([r_8__81642, 300]), cljs.core.PersistentVector.fromArray([r_6__81643, 0]), cljs.core.PersistentVector.fromArray([r_6__81643, 
  60]), cljs.core.PersistentVector.fromArray([r_5__81644, 120]), cljs.core.PersistentVector.fromArray([r_5__81644, 180]), cljs.core.PersistentVector.fromArray([r_4__81645, 240]), cljs.core.PersistentVector.fromArray([r_4__81645, 300]), cljs.core.PersistentVector.fromArray([r_5__81644, 350]), cljs.core.PersistentVector.fromArray([r_5__81644, 40])])
};
tempest.path.player_path_with_width = function player_path_with_width(width, offset_QMARK_) {
  var r__81646 = width / 2 / Math["cos"].call(null, tempest.util.deg_to_rad.call(null, 16));
  var offset__81647 = cljs.core.truth_(offset_QMARK_) ? r__81646 : 0;
  return cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([offset__81647, 90]), cljs.core.PersistentVector.fromArray([r__81646, 196]), cljs.core.PersistentVector.fromArray([0.62 * r__81646, 333]), cljs.core.PersistentVector.fromArray([0.38 * r__81646, 135]), cljs.core.PersistentVector.fromArray([0.69 * r__81646, 11]), cljs.core.PersistentVector.fromArray([0.69 * r__81646, 349]), cljs.core.PersistentVector.fromArray([0.38 * r__81646, 225]), cljs.core.PersistentVector.fromArray([0.62 * 
  r__81646, 27]), cljs.core.PersistentVector.fromArray([r__81646, 164])])
};
tempest.path.projectile_path_with_width = function projectile_path_with_width(width) {
  var r__81648 = width / (2 * Math["cos"].call(null, tempest.util.deg_to_rad.call(null, 45)));
  var midheight__81649 = r__81648 * Math["sin"].call(null, tempest.util.deg_to_rad.call(null, 45));
  return cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([midheight__81649, 270]), cljs.core.PersistentVector.fromArray([r__81648, 45]), cljs.core.PersistentVector.fromArray([r__81648, 135]), cljs.core.PersistentVector.fromArray([r__81648, 225]), cljs.core.PersistentVector.fromArray([r__81648, 315])])
};
tempest.path.rotate_path = function rotate_path(angle, path) {
  return cljs.core.map.call(null, function(coords) {
    return cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, coords), (angle + cljs.core.peek.call(null, coords)) % 360])
  }, path)
};
tempest.path.scale_path = function scale_path(scale, path) {
  return cljs.core.map.call(null, function(coords) {
    return cljs.core.PersistentVector.fromArray([scale * cljs.core.first.call(null, coords), cljs.core.peek.call(null, coords)])
  }, path)
};
tempest.path.path_extend = function path_extend(length, path) {
  return cljs.core.map.call(null, function(p1__81650_SHARP_) {
    return tempest.path.polar_extend.call(null, length, p1__81650_SHARP_)
  }, path)
};
tempest.path.segment_angle = function segment_angle(level, seg_idx) {
  var vec__81651__81652 = tempest.path.polar_lines_for_segment.call(null, level, seg_idx, false);
  var point0__81653 = cljs.core.nth.call(null, vec__81651__81652, 0, null);
  var point1__81654 = cljs.core.nth.call(null, vec__81651__81652, 1, null);
  return cljs.core.apply.call(null, Math["atan2"], cljs.core.vec.call(null, cljs.core.reverse.call(null, cljs.core.map.call(null, cljs.core._, tempest.path.polar_to_cartesian_coords.call(null, point0__81653), tempest.path.polar_to_cartesian_coords.call(null, point1__81654)))))
};
tempest.path.enemy_angle = function enemy_angle(enemy) {
  return tempest.util.rad_to_deg.call(null, tempest.path.segment_angle.call(null, "\ufdd0'level".call(null, enemy), "\ufdd0'segment".call(null, enemy)))
};
tempest.path.entity_desired_width = function entity_desired_width(enemy) {
  var edges__81655 = tempest.path.polar_lines_for_segment.call(null, "\ufdd0'level".call(null, enemy), "\ufdd0'segment".call(null, enemy), false);
  var edge_steps__81656 = tempest.path.step_lengths_for_segment_lines.call(null, "\ufdd0'level".call(null, enemy), "\ufdd0'segment".call(null, enemy));
  var offset0__81657 = cljs.core.first.call(null, edge_steps__81656) * "\ufdd0'step".call(null, enemy);
  var offset1__81658 = cljs.core.peek.call(null, edge_steps__81656) * "\ufdd0'step".call(null, enemy);
  var point0__81659 = tempest.path.polar_extend.call(null, offset0__81657, cljs.core.first.call(null, edges__81655));
  var point1__81660 = tempest.path.polar_extend.call(null, offset1__81658, cljs.core.peek.call(null, edges__81655));
  return tempest.path.polar_distance.call(null, point0__81659, point1__81660)
};
goog.provide("goog.events.EventType");
goog.require("goog.userAgent");
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
MESSAGE:"message", CONNECT:"connect"};
goog.provide("goog.disposable.IDisposable");
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose;
goog.disposable.IDisposable.prototype.isDisposed;
goog.provide("goog.Disposable");
goog.provide("goog.dispose");
goog.require("goog.disposable.IDisposable");
goog.Disposable = function() {
  if(goog.Disposable.ENABLE_MONITORING) {
    goog.Disposable.instances_[goog.getUid(this)] = this
  }
};
goog.Disposable.ENABLE_MONITORING = false;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [];
  for(var id in goog.Disposable.instances_) {
    if(goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)])
    }
  }
  return ret
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if(goog.Disposable.ENABLE_MONITORING) {
      var uid = goog.getUid(this);
      if(!goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + " did not call the goog.Disposable base " + "constructor or was disposed of after a clearUndisposedObjects " + "call");
      }
      delete goog.Disposable.instances_[uid]
    }
  }
};
goog.Disposable.prototype.disposeInternal = function() {
};
goog.dispose = function(obj) {
  if(obj && typeof obj.dispose == "function") {
    obj.dispose()
  }
};
goog.provide("goog.debug.EntryPointMonitor");
goog.provide("goog.debug.entryPointRegistry");
goog.debug.EntryPointMonitor = function() {
};
goog.debug.EntryPointMonitor.prototype.wrap;
goog.debug.EntryPointMonitor.prototype.unwrap;
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  var transformer = goog.bind(monitor.wrap, monitor);
  for(var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var transformer = goog.bind(monitor.unwrap, monitor);
  for(var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
};
goog.provide("goog.debug.errorHandlerWeakDep");
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(fn, opt_tracers) {
  return fn
}};
goog.provide("goog.events.BrowserFeature");
goog.require("goog.userAgent");
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isVersion("9"), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("8")};
goog.provide("goog.events.Event");
goog.require("goog.Disposable");
goog.events.Event = function(type, opt_target) {
  goog.Disposable.call(this);
  this.type = type;
  this.target = opt_target;
  this.currentTarget = this.target
};
goog.inherits(goog.events.Event, goog.Disposable);
goog.events.Event.prototype.disposeInternal = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
goog.events.Event.prototype.propagationStopped_ = false;
goog.events.Event.prototype.returnValue_ = true;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true
};
goog.events.Event.prototype.preventDefault = function() {
  this.returnValue_ = false
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation()
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault()
};
goog.provide("goog.reflect");
goog.reflect.object = function(type, object) {
  return object
};
goog.reflect.sinkValue = new Function("a", "return a");
goog.provide("goog.events.BrowserEvent");
goog.provide("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.reflect");
goog.require("goog.userAgent");
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  if(opt_e) {
    this.init(opt_e, opt_currentTarget)
  }
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.currentTarget;
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
goog.events.BrowserEvent.prototype.ctrlKey = false;
goog.events.BrowserEvent.prototype.altKey = false;
goog.events.BrowserEvent.prototype.shiftKey = false;
goog.events.BrowserEvent.prototype.metaKey = false;
goog.events.BrowserEvent.prototype.state;
goog.events.BrowserEvent.prototype.platformModifierKey = false;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  goog.events.Event.call(this, type);
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  if(relatedTarget) {
    if(goog.userAgent.GECKO) {
      try {
        goog.reflect.sinkValue(relatedTarget.nodeName)
      }catch(err) {
        relatedTarget = null
      }
    }
  }else {
    if(type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement
    }else {
      if(type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement
      }
    }
  }
  this.relatedTarget = relatedTarget;
  this.offsetX = e.offsetX !== undefined ? e.offsetX : e.layerX;
  this.offsetY = e.offsetY !== undefined ? e.offsetY : e.layerY;
  this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
  this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
  this.screenX = e.screenX || 0;
  this.screenY = e.screenY || 0;
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  delete this.returnValue_;
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(button) {
  if(!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if(this.type == "click") {
      return button == goog.events.BrowserEvent.MouseButton.LEFT
    }else {
      return!!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[button])
    }
  }else {
    return this.event_.button == button
  }
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if(this.event_.stopPropagation) {
    this.event_.stopPropagation()
  }else {
    this.event_.cancelBubble = true
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if(!be.preventDefault) {
    be.returnValue = false;
    if(goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        var VK_F1 = 112;
        var VK_F12 = 123;
        if(be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1
        }
      }catch(ex) {
      }
    }
  }else {
    be.preventDefault()
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
  goog.events.BrowserEvent.superClass_.disposeInternal.call(this);
  this.event_ = null;
  this.target = null;
  this.currentTarget = null;
  this.relatedTarget = null
};
goog.provide("goog.events.EventWrapper");
goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function(src, listener, opt_capt, opt_scope, opt_eventHandler) {
};
goog.events.EventWrapper.prototype.unlisten = function(src, listener, opt_capt, opt_scope, opt_eventHandler) {
};
goog.provide("goog.events.Listener");
goog.events.Listener = function() {
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.prototype.isFunctionListener_;
goog.events.Listener.prototype.listener;
goog.events.Listener.prototype.proxy;
goog.events.Listener.prototype.src;
goog.events.Listener.prototype.type;
goog.events.Listener.prototype.capture;
goog.events.Listener.prototype.handler;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = false;
goog.events.Listener.prototype.callOnce = false;
goog.events.Listener.prototype.init = function(listener, proxy, src, type, capture, opt_handler) {
  if(goog.isFunction(listener)) {
    this.isFunctionListener_ = true
  }else {
    if(listener && listener.handleEvent && goog.isFunction(listener.handleEvent)) {
      this.isFunctionListener_ = false
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.callOnce = false;
  this.key = ++goog.events.Listener.counter_;
  this.removed = false
};
goog.events.Listener.prototype.handleEvent = function(eventObject) {
  if(this.isFunctionListener_) {
    return this.listener.call(this.handler || this.src, eventObject)
  }
  return this.listener.handleEvent.call(this.listener, eventObject)
};
goog.provide("goog.structs.SimplePool");
goog.require("goog.Disposable");
goog.structs.SimplePool = function(initialCount, maxCount) {
  goog.Disposable.call(this);
  this.maxCount_ = maxCount;
  this.freeQueue_ = [];
  this.createInitial_(initialCount)
};
goog.inherits(goog.structs.SimplePool, goog.Disposable);
goog.structs.SimplePool.prototype.createObjectFn_ = null;
goog.structs.SimplePool.prototype.disposeObjectFn_ = null;
goog.structs.SimplePool.prototype.setCreateObjectFn = function(createObjectFn) {
  this.createObjectFn_ = createObjectFn
};
goog.structs.SimplePool.prototype.setDisposeObjectFn = function(disposeObjectFn) {
  this.disposeObjectFn_ = disposeObjectFn
};
goog.structs.SimplePool.prototype.getObject = function() {
  if(this.freeQueue_.length) {
    return this.freeQueue_.pop()
  }
  return this.createObject()
};
goog.structs.SimplePool.prototype.releaseObject = function(obj) {
  if(this.freeQueue_.length < this.maxCount_) {
    this.freeQueue_.push(obj)
  }else {
    this.disposeObject(obj)
  }
};
goog.structs.SimplePool.prototype.createInitial_ = function(initialCount) {
  if(initialCount > this.maxCount_) {
    throw Error("[goog.structs.SimplePool] Initial cannot be greater than max");
  }
  for(var i = 0;i < initialCount;i++) {
    this.freeQueue_.push(this.createObject())
  }
};
goog.structs.SimplePool.prototype.createObject = function() {
  if(this.createObjectFn_) {
    return this.createObjectFn_()
  }else {
    return{}
  }
};
goog.structs.SimplePool.prototype.disposeObject = function(obj) {
  if(this.disposeObjectFn_) {
    this.disposeObjectFn_(obj)
  }else {
    if(goog.isObject(obj)) {
      if(goog.isFunction(obj.dispose)) {
        obj.dispose()
      }else {
        for(var i in obj) {
          delete obj[i]
        }
      }
    }
  }
};
goog.structs.SimplePool.prototype.disposeInternal = function() {
  goog.structs.SimplePool.superClass_.disposeInternal.call(this);
  var freeQueue = this.freeQueue_;
  while(freeQueue.length) {
    this.disposeObject(freeQueue.pop())
  }
  delete this.freeQueue_
};
goog.provide("goog.events.pools");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.Listener");
goog.require("goog.structs.SimplePool");
goog.require("goog.userAgent.jscript");
goog.events.ASSUME_GOOD_GC = false;
goog.events.pools.getObject;
goog.events.pools.releaseObject;
goog.events.pools.getArray;
goog.events.pools.releaseArray;
goog.events.pools.getProxy;
goog.events.pools.setProxyCallbackFunction;
goog.events.pools.releaseProxy;
goog.events.pools.getListener;
goog.events.pools.releaseListener;
goog.events.pools.getEvent;
goog.events.pools.releaseEvent;
(function() {
  var BAD_GC = !goog.events.ASSUME_GOOD_GC && goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7");
  function getObject() {
    return{count_:0, remaining_:0}
  }
  function getArray() {
    return[]
  }
  var proxyCallbackFunction;
  goog.events.pools.setProxyCallbackFunction = function(cb) {
    proxyCallbackFunction = cb
  };
  function getProxy() {
    var f = function(eventObject) {
      return proxyCallbackFunction.call(f.src, f.key, eventObject)
    };
    return f
  }
  function getListener() {
    return new goog.events.Listener
  }
  function getEvent() {
    return new goog.events.BrowserEvent
  }
  if(!BAD_GC) {
    goog.events.pools.getObject = getObject;
    goog.events.pools.releaseObject = goog.nullFunction;
    goog.events.pools.getArray = getArray;
    goog.events.pools.releaseArray = goog.nullFunction;
    goog.events.pools.getProxy = getProxy;
    goog.events.pools.releaseProxy = goog.nullFunction;
    goog.events.pools.getListener = getListener;
    goog.events.pools.releaseListener = goog.nullFunction;
    goog.events.pools.getEvent = getEvent;
    goog.events.pools.releaseEvent = goog.nullFunction
  }else {
    goog.events.pools.getObject = function() {
      return objectPool.getObject()
    };
    goog.events.pools.releaseObject = function(obj) {
      objectPool.releaseObject(obj)
    };
    goog.events.pools.getArray = function() {
      return arrayPool.getObject()
    };
    goog.events.pools.releaseArray = function(obj) {
      arrayPool.releaseObject(obj)
    };
    goog.events.pools.getProxy = function() {
      return proxyPool.getObject()
    };
    goog.events.pools.releaseProxy = function(obj) {
      proxyPool.releaseObject(getProxy())
    };
    goog.events.pools.getListener = function() {
      return listenerPool.getObject()
    };
    goog.events.pools.releaseListener = function(obj) {
      listenerPool.releaseObject(obj)
    };
    goog.events.pools.getEvent = function() {
      return eventPool.getObject()
    };
    goog.events.pools.releaseEvent = function(obj) {
      eventPool.releaseObject(obj)
    };
    var OBJECT_POOL_INITIAL_COUNT = 0;
    var OBJECT_POOL_MAX_COUNT = 600;
    var objectPool = new goog.structs.SimplePool(OBJECT_POOL_INITIAL_COUNT, OBJECT_POOL_MAX_COUNT);
    objectPool.setCreateObjectFn(getObject);
    var ARRAY_POOL_INITIAL_COUNT = 0;
    var ARRAY_POOL_MAX_COUNT = 600;
    var arrayPool = new goog.structs.SimplePool(ARRAY_POOL_INITIAL_COUNT, ARRAY_POOL_MAX_COUNT);
    arrayPool.setCreateObjectFn(getArray);
    var HANDLE_EVENT_PROXY_POOL_INITIAL_COUNT = 0;
    var HANDLE_EVENT_PROXY_POOL_MAX_COUNT = 600;
    var proxyPool = new goog.structs.SimplePool(HANDLE_EVENT_PROXY_POOL_INITIAL_COUNT, HANDLE_EVENT_PROXY_POOL_MAX_COUNT);
    proxyPool.setCreateObjectFn(getProxy);
    var LISTENER_POOL_INITIAL_COUNT = 0;
    var LISTENER_POOL_MAX_COUNT = 600;
    var listenerPool = new goog.structs.SimplePool(LISTENER_POOL_INITIAL_COUNT, LISTENER_POOL_MAX_COUNT);
    listenerPool.setCreateObjectFn(getListener);
    var EVENT_POOL_INITIAL_COUNT = 0;
    var EVENT_POOL_MAX_COUNT = 600;
    var eventPool = new goog.structs.SimplePool(EVENT_POOL_INITIAL_COUNT, EVENT_POOL_MAX_COUNT);
    eventPool.setCreateObjectFn(getEvent)
  }
})();
goog.provide("goog.events");
goog.require("goog.array");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.debug.errorHandlerWeakDep");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.Event");
goog.require("goog.events.EventWrapper");
goog.require("goog.events.pools");
goog.require("goog.object");
goog.require("goog.userAgent");
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.requiresSyntheticEventPropagation_;
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if(!type) {
    throw Error("Invalid event type");
  }else {
    if(goog.isArray(type)) {
      for(var i = 0;i < type.length;i++) {
        goog.events.listen(src, type[i], listener, opt_capt, opt_handler)
      }
      return null
    }else {
      var capture = !!opt_capt;
      var map = goog.events.listenerTree_;
      if(!(type in map)) {
        map[type] = goog.events.pools.getObject()
      }
      map = map[type];
      if(!(capture in map)) {
        map[capture] = goog.events.pools.getObject();
        map.count_++
      }
      map = map[capture];
      var srcUid = goog.getUid(src);
      var listenerArray, listenerObj;
      map.remaining_++;
      if(!map[srcUid]) {
        listenerArray = map[srcUid] = goog.events.pools.getArray();
        map.count_++
      }else {
        listenerArray = map[srcUid];
        for(var i = 0;i < listenerArray.length;i++) {
          listenerObj = listenerArray[i];
          if(listenerObj.listener == listener && listenerObj.handler == opt_handler) {
            if(listenerObj.removed) {
              break
            }
            return listenerArray[i].key
          }
        }
      }
      var proxy = goog.events.pools.getProxy();
      proxy.src = src;
      listenerObj = goog.events.pools.getListener();
      listenerObj.init(listener, proxy, src, type, capture, opt_handler);
      var key = listenerObj.key;
      proxy.key = key;
      listenerArray.push(listenerObj);
      goog.events.listeners_[key] = listenerObj;
      if(!goog.events.sources_[srcUid]) {
        goog.events.sources_[srcUid] = goog.events.pools.getArray()
      }
      goog.events.sources_[srcUid].push(listenerObj);
      if(src.addEventListener) {
        if(src == goog.global || !src.customEvent_) {
          src.addEventListener(type, proxy, capture)
        }
      }else {
        src.attachEvent(goog.events.getOnString_(type), proxy)
      }
      return key
    }
  }
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler)
    }
    return null
  }
  var key = goog.events.listen(src, type, listener, opt_capt, opt_handler);
  var listenerObj = goog.events.listeners_[key];
  listenerObj.callOnce = true;
  return key
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler)
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler)
    }
    return null
  }
  var capture = !!opt_capt;
  var listenerArray = goog.events.getListeners_(src, type, capture);
  if(!listenerArray) {
    return false
  }
  for(var i = 0;i < listenerArray.length;i++) {
    if(listenerArray[i].listener == listener && listenerArray[i].capture == capture && listenerArray[i].handler == opt_handler) {
      return goog.events.unlistenByKey(listenerArray[i].key)
    }
  }
  return false
};
goog.events.unlistenByKey = function(key) {
  if(!goog.events.listeners_[key]) {
    return false
  }
  var listener = goog.events.listeners_[key];
  if(listener.removed) {
    return false
  }
  var src = listener.src;
  var type = listener.type;
  var proxy = listener.proxy;
  var capture = listener.capture;
  if(src.removeEventListener) {
    if(src == goog.global || !src.customEvent_) {
      src.removeEventListener(type, proxy, capture)
    }
  }else {
    if(src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy)
    }
  }
  var srcUid = goog.getUid(src);
  var listenerArray = goog.events.listenerTree_[type][capture][srcUid];
  if(goog.events.sources_[srcUid]) {
    var sourcesArray = goog.events.sources_[srcUid];
    goog.array.remove(sourcesArray, listener);
    if(sourcesArray.length == 0) {
      delete goog.events.sources_[srcUid]
    }
  }
  listener.removed = true;
  listenerArray.needsCleanup_ = true;
  goog.events.cleanUp_(type, capture, srcUid, listenerArray);
  delete goog.events.listeners_[key];
  return true
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler)
};
goog.events.cleanUp_ = function(type, capture, srcUid, listenerArray) {
  if(!listenerArray.locked_) {
    if(listenerArray.needsCleanup_) {
      for(var oldIndex = 0, newIndex = 0;oldIndex < listenerArray.length;oldIndex++) {
        if(listenerArray[oldIndex].removed) {
          var proxy = listenerArray[oldIndex].proxy;
          proxy.src = null;
          goog.events.pools.releaseProxy(proxy);
          goog.events.pools.releaseListener(listenerArray[oldIndex]);
          continue
        }
        if(oldIndex != newIndex) {
          listenerArray[newIndex] = listenerArray[oldIndex]
        }
        newIndex++
      }
      listenerArray.length = newIndex;
      listenerArray.needsCleanup_ = false;
      if(newIndex == 0) {
        goog.events.pools.releaseArray(listenerArray);
        delete goog.events.listenerTree_[type][capture][srcUid];
        goog.events.listenerTree_[type][capture].count_--;
        if(goog.events.listenerTree_[type][capture].count_ == 0) {
          goog.events.pools.releaseObject(goog.events.listenerTree_[type][capture]);
          delete goog.events.listenerTree_[type][capture];
          goog.events.listenerTree_[type].count_--
        }
        if(goog.events.listenerTree_[type].count_ == 0) {
          goog.events.pools.releaseObject(goog.events.listenerTree_[type]);
          delete goog.events.listenerTree_[type]
        }
      }
    }
  }
};
goog.events.removeAll = function(opt_obj, opt_type, opt_capt) {
  var count = 0;
  var noObj = opt_obj == null;
  var noType = opt_type == null;
  var noCapt = opt_capt == null;
  opt_capt = !!opt_capt;
  if(!noObj) {
    var srcUid = goog.getUid(opt_obj);
    if(goog.events.sources_[srcUid]) {
      var sourcesArray = goog.events.sources_[srcUid];
      for(var i = sourcesArray.length - 1;i >= 0;i--) {
        var listener = sourcesArray[i];
        if((noType || opt_type == listener.type) && (noCapt || opt_capt == listener.capture)) {
          goog.events.unlistenByKey(listener.key);
          count++
        }
      }
    }
  }else {
    goog.object.forEach(goog.events.sources_, function(listeners) {
      for(var i = listeners.length - 1;i >= 0;i--) {
        var listener = listeners[i];
        if((noType || opt_type == listener.type) && (noCapt || opt_capt == listener.capture)) {
          goog.events.unlistenByKey(listener.key);
          count++
        }
      }
    })
  }
  return count
};
goog.events.getListeners = function(obj, type, capture) {
  return goog.events.getListeners_(obj, type, capture) || []
};
goog.events.getListeners_ = function(obj, type, capture) {
  var map = goog.events.listenerTree_;
  if(type in map) {
    map = map[type];
    if(capture in map) {
      map = map[capture];
      var objUid = goog.getUid(obj);
      if(map[objUid]) {
        return map[objUid]
      }
    }
  }
  return null
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  var capture = !!opt_capt;
  var listenerArray = goog.events.getListeners_(src, type, capture);
  if(listenerArray) {
    for(var i = 0;i < listenerArray.length;i++) {
      if(listenerArray[i].listener == listener && listenerArray[i].capture == capture && listenerArray[i].handler == opt_handler) {
        return listenerArray[i]
      }
    }
  }
  return null
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  var objUid = goog.getUid(obj);
  var listeners = goog.events.sources_[objUid];
  if(listeners) {
    var hasType = goog.isDef(opt_type);
    var hasCapture = goog.isDef(opt_capture);
    if(hasType && hasCapture) {
      var map = goog.events.listenerTree_[opt_type];
      return!!map && !!map[opt_capture] && objUid in map[opt_capture]
    }else {
      if(!(hasType || hasCapture)) {
        return true
      }else {
        return goog.array.some(listeners, function(listener) {
          return hasType && listener.type == opt_type || hasCapture && listener.capture == opt_capture
        })
      }
    }
  }
  return false
};
goog.events.expose = function(e) {
  var str = [];
  for(var key in e) {
    if(e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")")
    }else {
      str.push(key + " = " + e[key])
    }
  }
  return str.join("\n")
};
goog.events.getOnString_ = function(type) {
  if(type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type]
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  var map = goog.events.listenerTree_;
  if(type in map) {
    map = map[type];
    if(capture in map) {
      return goog.events.fireListeners_(map[capture], obj, type, capture, eventObject)
    }
  }
  return true
};
goog.events.fireListeners_ = function(map, obj, type, capture, eventObject) {
  var retval = 1;
  var objUid = goog.getUid(obj);
  if(map[objUid]) {
    map.remaining_--;
    var listenerArray = map[objUid];
    if(!listenerArray.locked_) {
      listenerArray.locked_ = 1
    }else {
      listenerArray.locked_++
    }
    try {
      var length = listenerArray.length;
      for(var i = 0;i < length;i++) {
        var listener = listenerArray[i];
        if(listener && !listener.removed) {
          retval &= goog.events.fireListener(listener, eventObject) !== false
        }
      }
    }finally {
      listenerArray.locked_--;
      goog.events.cleanUp_(type, capture, objUid, listenerArray)
    }
  }
  return Boolean(retval)
};
goog.events.fireListener = function(listener, eventObject) {
  var rv = listener.handleEvent(eventObject);
  if(listener.callOnce) {
    goog.events.unlistenByKey(listener.key)
  }
  return rv
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(src, e) {
  var type = e.type || e;
  var map = goog.events.listenerTree_;
  if(!(type in map)) {
    return true
  }
  if(goog.isString(e)) {
    e = new goog.events.Event(e, src)
  }else {
    if(!(e instanceof goog.events.Event)) {
      var oldEvent = e;
      e = new goog.events.Event(type, src);
      goog.object.extend(e, oldEvent)
    }else {
      e.target = e.target || src
    }
  }
  var rv = 1, ancestors;
  map = map[type];
  var hasCapture = true in map;
  var targetsMap;
  if(hasCapture) {
    ancestors = [];
    for(var parent = src;parent;parent = parent.getParentEventTarget()) {
      ancestors.push(parent)
    }
    targetsMap = map[true];
    targetsMap.remaining_ = targetsMap.count_;
    for(var i = ancestors.length - 1;!e.propagationStopped_ && i >= 0 && targetsMap.remaining_;i--) {
      e.currentTarget = ancestors[i];
      rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type, true, e) && e.returnValue_ != false
    }
  }
  var hasBubble = false in map;
  if(hasBubble) {
    targetsMap = map[false];
    targetsMap.remaining_ = targetsMap.count_;
    if(hasCapture) {
      for(var i = 0;!e.propagationStopped_ && i < ancestors.length && targetsMap.remaining_;i++) {
        e.currentTarget = ancestors[i];
        rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type, false, e) && e.returnValue_ != false
      }
    }else {
      for(var current = src;!e.propagationStopped_ && current && targetsMap.remaining_;current = current.getParentEventTarget()) {
        e.currentTarget = current;
        rv &= goog.events.fireListeners_(targetsMap, current, e.type, false, e) && e.returnValue_ != false
      }
    }
  }
  return Boolean(rv)
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(key, opt_evt) {
  if(!goog.events.listeners_[key]) {
    return true
  }
  var listener = goog.events.listeners_[key];
  var type = listener.type;
  var map = goog.events.listenerTree_;
  if(!(type in map)) {
    return true
  }
  map = map[type];
  var retval, targetsMap;
  if(goog.events.synthesizeEventPropagation_()) {
    var ieEvent = opt_evt || goog.getObjectByName("window.event");
    var hasCapture = true in map;
    var hasBubble = false in map;
    if(hasCapture) {
      if(goog.events.isMarkedIeEvent_(ieEvent)) {
        return true
      }
      goog.events.markIeEvent_(ieEvent)
    }
    var evt = goog.events.pools.getEvent();
    evt.init(ieEvent, this);
    retval = true;
    try {
      if(hasCapture) {
        var ancestors = goog.events.pools.getArray();
        for(var parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent)
        }
        targetsMap = map[true];
        targetsMap.remaining_ = targetsMap.count_;
        for(var i = ancestors.length - 1;!evt.propagationStopped_ && i >= 0 && targetsMap.remaining_;i--) {
          evt.currentTarget = ancestors[i];
          retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type, true, evt)
        }
        if(hasBubble) {
          targetsMap = map[false];
          targetsMap.remaining_ = targetsMap.count_;
          for(var i = 0;!evt.propagationStopped_ && i < ancestors.length && targetsMap.remaining_;i++) {
            evt.currentTarget = ancestors[i];
            retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type, false, evt)
          }
        }
      }else {
        retval = goog.events.fireListener(listener, evt)
      }
    }finally {
      if(ancestors) {
        ancestors.length = 0;
        goog.events.pools.releaseArray(ancestors)
      }
      evt.dispose();
      goog.events.pools.releaseEvent(evt)
    }
    return retval
  }
  var be = new goog.events.BrowserEvent(opt_evt, this);
  try {
    retval = goog.events.fireListener(listener, be)
  }finally {
    be.dispose()
  }
  return retval
};
goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_);
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = false;
  if(e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return
    }catch(ex) {
      useReturnValue = true
    }
  }
  if(useReturnValue || e.returnValue == undefined) {
    e.returnValue = true
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++
};
goog.events.synthesizeEventPropagation_ = function() {
  if(goog.events.requiresSyntheticEventPropagation_ === undefined) {
    goog.events.requiresSyntheticEventPropagation_ = goog.userAgent.IE && !goog.global["addEventListener"]
  }
  return goog.events.requiresSyntheticEventPropagation_
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
});
goog.provide("goog.events.EventTarget");
goog.require("goog.Disposable");
goog.require("goog.events");
goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = true;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope)
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope)
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  return goog.events.dispatchEvent(this, e)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};
goog.provide("clojure.browser.event");
goog.require("cljs.core");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
clojure.browser.event.EventType = {};
clojure.browser.event.event_types = function event_types(this$) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83582 = this$;
    if(cljs.core.truth_(and__3546__auto____83582)) {
      return this$.clojure$browser$event$EventType$event_types
    }else {
      return and__3546__auto____83582
    }
  }())) {
    return this$.clojure$browser$event$EventType$event_types(this$)
  }else {
    return function() {
      var or__3548__auto____83583 = clojure.browser.event.event_types[goog.typeOf.call(null, this$)];
      if(cljs.core.truth_(or__3548__auto____83583)) {
        return or__3548__auto____83583
      }else {
        var or__3548__auto____83584 = clojure.browser.event.event_types["_"];
        if(cljs.core.truth_(or__3548__auto____83584)) {
          return or__3548__auto____83584
        }else {
          throw cljs.core.missing_protocol.call(null, "EventType.event-types", this$);
        }
      }
    }().call(null, this$)
  }
};
Element.prototype.clojure$browser$event$EventType$ = true;
Element.prototype.clojure$browser$event$EventType$event_types = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__83585) {
    var vec__83586__83587 = p__83585;
    var k__83588 = cljs.core.nth.call(null, vec__83586__83587, 0, null);
    var v__83589 = cljs.core.nth.call(null, vec__83586__83587, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__83588.toLowerCase()), v__83589])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.events.EventType))))
};
goog.events.EventTarget.prototype.clojure$browser$event$EventType$ = true;
goog.events.EventTarget.prototype.clojure$browser$event$EventType$event_types = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__83590) {
    var vec__83591__83592 = p__83590;
    var k__83593 = cljs.core.nth.call(null, vec__83591__83592, 0, null);
    var v__83594 = cljs.core.nth.call(null, vec__83591__83592, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__83593.toLowerCase()), v__83594])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.events.EventType))))
};
clojure.browser.event.listen = function() {
  var listen = null;
  var listen__83595 = function(src, type, fn) {
    return listen.call(null, src, type, fn, false)
  };
  var listen__83596 = function(src, type, fn, capture_QMARK_) {
    return goog.events.listen.call(null, src, cljs.core.get.call(null, clojure.browser.event.event_types.call(null, src), type, type), fn, capture_QMARK_)
  };
  listen = function(src, type, fn, capture_QMARK_) {
    switch(arguments.length) {
      case 3:
        return listen__83595.call(this, src, type, fn);
      case 4:
        return listen__83596.call(this, src, type, fn, capture_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return listen
}();
clojure.browser.event.listen_once = function() {
  var listen_once = null;
  var listen_once__83598 = function(src, type, fn) {
    return listen_once.call(null, src, type, fn, false)
  };
  var listen_once__83599 = function(src, type, fn, capture_QMARK_) {
    return goog.events.listenOnce.call(null, src, cljs.core.get.call(null, clojure.browser.event.event_types.call(null, src), type, type), fn, capture_QMARK_)
  };
  listen_once = function(src, type, fn, capture_QMARK_) {
    switch(arguments.length) {
      case 3:
        return listen_once__83598.call(this, src, type, fn);
      case 4:
        return listen_once__83599.call(this, src, type, fn, capture_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return listen_once
}();
clojure.browser.event.unlisten = function() {
  var unlisten = null;
  var unlisten__83601 = function(src, type, fn) {
    return unlisten.call(null, src, type, fn, false)
  };
  var unlisten__83602 = function(src, type, fn, capture_QMARK_) {
    return goog.events.unlisten.call(null, src, cljs.core.get.call(null, clojure.browser.event.event_types.call(null, src), type, type), fn, capture_QMARK_)
  };
  unlisten = function(src, type, fn, capture_QMARK_) {
    switch(arguments.length) {
      case 3:
        return unlisten__83601.call(this, src, type, fn);
      case 4:
        return unlisten__83602.call(this, src, type, fn, capture_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return unlisten
}();
clojure.browser.event.unlisten_by_key = function unlisten_by_key(key) {
  return goog.events.unlistenByKey.call(null, key)
};
clojure.browser.event.dispatch_event = function dispatch_event(src, event) {
  return goog.events.dispatchEvent.call(null, src, event)
};
clojure.browser.event.expose = function expose(e) {
  return goog.events.expose.call(null, e)
};
clojure.browser.event.fire_listeners = function fire_listeners(obj, type, capture, event) {
  return null
};
clojure.browser.event.total_listener_count = function total_listener_count() {
  return goog.events.getTotalListenerCount.call(null)
};
clojure.browser.event.get_listener = function get_listener(src, type, listener, opt_capt, opt_handler) {
  return null
};
clojure.browser.event.all_listeners = function all_listeners(obj, type, capture) {
  return null
};
clojure.browser.event.unique_event_id = function unique_event_id(event_type) {
  return null
};
clojure.browser.event.has_listener = function has_listener(obj, opt_type, opt_capture) {
  return null
};
clojure.browser.event.remove_all = function remove_all(opt_obj, opt_type, opt_capt) {
  return null
};
goog.provide("goog.structs");
goog.require("goog.array");
goog.require("goog.object");
goog.structs.getCount = function(col) {
  if(typeof col.getCount == "function") {
    return col.getCount()
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return col.length
  }
  return goog.object.getCount(col)
};
goog.structs.getValues = function(col) {
  if(typeof col.getValues == "function") {
    return col.getValues()
  }
  if(goog.isString(col)) {
    return col.split("")
  }
  if(goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for(var i = 0;i < l;i++) {
      rv.push(col[i])
    }
    return rv
  }
  return goog.object.getValues(col)
};
goog.structs.getKeys = function(col) {
  if(typeof col.getKeys == "function") {
    return col.getKeys()
  }
  if(typeof col.getValues == "function") {
    return undefined
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for(var i = 0;i < l;i++) {
      rv.push(i)
    }
    return rv
  }
  return goog.object.getKeys(col)
};
goog.structs.contains = function(col, val) {
  if(typeof col.contains == "function") {
    return col.contains(val)
  }
  if(typeof col.containsValue == "function") {
    return col.containsValue(val)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(col, val)
  }
  return goog.object.containsValue(col, val)
};
goog.structs.isEmpty = function(col) {
  if(typeof col.isEmpty == "function") {
    return col.isEmpty()
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty(col)
  }
  return goog.object.isEmpty(col)
};
goog.structs.clear = function(col) {
  if(typeof col.clear == "function") {
    col.clear()
  }else {
    if(goog.isArrayLike(col)) {
      goog.array.clear(col)
    }else {
      goog.object.clear(col)
    }
  }
};
goog.structs.forEach = function(col, f, opt_obj) {
  if(typeof col.forEach == "function") {
    col.forEach(f, opt_obj)
  }else {
    if(goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj)
    }else {
      var keys = goog.structs.getKeys(col);
      var values = goog.structs.getValues(col);
      var l = values.length;
      for(var i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col)
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if(typeof col.filter == "function") {
    return col.filter(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj)
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if(keys) {
    rv = {};
    for(var i = 0;i < l;i++) {
      if(f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i]
      }
    }
  }else {
    rv = [];
    for(var i = 0;i < l;i++) {
      if(f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i])
      }
    }
  }
  return rv
};
goog.structs.map = function(col, f, opt_obj) {
  if(typeof col.map == "function") {
    return col.map(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj)
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if(keys) {
    rv = {};
    for(var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col)
    }
  }else {
    rv = [];
    for(var i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col)
    }
  }
  return rv
};
goog.structs.some = function(col, f, opt_obj) {
  if(typeof col.some == "function") {
    return col.some(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    if(f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true
    }
  }
  return false
};
goog.structs.every = function(col, f, opt_obj) {
  if(typeof col.every == "function") {
    return col.every(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    if(!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false
    }
  }
  return true
};
goog.provide("goog.iter");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.iter.Iterable;
if("StopIteration" in goog.global) {
  goog.iter.StopIteration = goog.global["StopIteration"]
}else {
  goog.iter.StopIteration = Error("StopIteration")
}
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this
};
goog.iter.toIterator = function(iterable) {
  if(iterable instanceof goog.iter.Iterator) {
    return iterable
  }
  if(typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false)
  }
  if(goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while(true) {
        if(i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if(!(i in iterable)) {
          i++;
          continue
        }
        return iterable[i++]
      }
    };
    return newIter
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if(goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj)
    }catch(ex) {
      if(ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }else {
    iterable = goog.iter.toIterator(iterable);
    try {
      while(true) {
        f.call(opt_obj, iterable.next(), undefined, iterable)
      }
    }catch(ex) {
      if(ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      var val = iterable.next();
      if(f.call(opt_obj, val, undefined, iterable)) {
        return val
      }
    }
  };
  return newIter
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if(arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop
  }
  if(step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if(step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv
  };
  return newIter
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator)
};
goog.iter.map = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      var val = iterable.next();
      return f.call(opt_obj, val, undefined, iterable)
    }
  };
  return newIter
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val)
  });
  return rval
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while(true) {
      if(f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while(true) {
      if(!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true
};
goog.iter.chain = function(var_args) {
  var args = arguments;
  var length = args.length;
  var i = 0;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    try {
      if(i >= length) {
        throw goog.iter.StopIteration;
      }
      var current = goog.iter.toIterator(args[i]);
      return current.next()
    }catch(ex) {
      if(ex !== goog.iter.StopIteration || i >= length) {
        throw ex;
      }else {
        i++;
        return this.next()
      }
    }
  };
  return newIter
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while(true) {
      var val = iterable.next();
      if(dropping && f.call(opt_obj, val, undefined, iterable)) {
        continue
      }else {
        dropping = false
      }
      return val
    }
  };
  return newIter
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var taking = true;
  newIter.next = function() {
    while(true) {
      if(taking) {
        var val = iterable.next();
        if(f.call(opt_obj, val, undefined, iterable)) {
          return val
        }else {
          taking = false
        }
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return newIter
};
goog.iter.toArray = function(iterable) {
  if(goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable)
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val)
  });
  return array
};
goog.iter.equals = function(iterable1, iterable2) {
  iterable1 = goog.iter.toIterator(iterable1);
  iterable2 = goog.iter.toIterator(iterable2);
  var b1, b2;
  try {
    while(true) {
      b1 = b2 = false;
      var val1 = iterable1.next();
      b1 = true;
      var val2 = iterable2.next();
      b2 = true;
      if(val1 != val2) {
        return false
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }else {
      if(b1 && !b2) {
        return false
      }
      if(!b2) {
        try {
          val2 = iterable2.next();
          return false
        }catch(ex1) {
          if(ex1 !== goog.iter.StopIteration) {
            throw ex1;
          }
          return true
        }
      }
    }
  }
  return false
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next()
  }catch(e) {
    if(e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return!arr.length
  });
  if(someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator
  }
  var iter = new goog.iter.Iterator;
  var arrays = arguments;
  var indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if(indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex]
      });
      for(var i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if(indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break
        }
        if(i == 0) {
          indicies = null;
          break
        }
        indicies[i] = 0
      }
      return retVal
    }
    throw goog.iter.StopIteration;
  };
  return iter
};
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.require("goog.structs");
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  var argLength = arguments.length;
  if(argLength > 1) {
    if(argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1])
    }
  }else {
    if(opt_map) {
      this.addAll(opt_map)
    }
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var rv = [];
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key])
  }
  return rv
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key)
};
goog.structs.Map.prototype.containsValue = function(val) {
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if(goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true
    }
  }
  return false
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if(this === otherMap) {
    return true
  }
  if(this.count_ != otherMap.getCount()) {
    return false
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var key, i = 0;key = this.keys_[i];i++) {
    if(!equalityFn(this.get(key), otherMap.get(key))) {
      return false
    }
  }
  return true
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0
};
goog.structs.Map.prototype.remove = function(key) {
  if(goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if(this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_()
    }
    return true
  }
  return false
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;
    while(srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if(goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
  if(this.count_ != this.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;
    while(srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if(!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if(goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key]
  }
  return opt_val
};
goog.structs.Map.prototype.set = function(key, value) {
  if(!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push(key);
    this.version_++
  }
  this.map_[key] = value
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if(map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues()
  }else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map)
  }
  for(var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map;
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key)
  }
  return transposed
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {};
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key]
  }
  return obj
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false)
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0;
  var keys = this.keys_;
  var map = this.map_;
  var version = this.version_;
  var selfObj = this;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      if(version != selfObj.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key]
    }
  };
  return newIter
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
};
goog.provide("goog.uri.utils");
goog.provide("goog.uri.utils.ComponentIndex");
goog.require("goog.asserts");
goog.require("goog.string");
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = [];
  if(opt_scheme) {
    out.push(opt_scheme, ":")
  }
  if(opt_domain) {
    out.push("//");
    if(opt_userInfo) {
      out.push(opt_userInfo, "@")
    }
    out.push(opt_domain);
    if(opt_port) {
      out.push(":", opt_port)
    }
  }
  if(opt_path) {
    out.push(opt_path)
  }
  if(opt_queryData) {
    out.push("?", opt_queryData)
  }
  if(opt_fragment) {
    out.push("#", opt_fragment)
  }
  return out.join("")
};
goog.uri.utils.splitRe_ = new RegExp("^" + "(?:" + "([^:/?#.]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([\\w\\d\\-\\u0100-\\uffff.%]*)" + "(?::([0-9]+))?" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#(.*))?" + "$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  return uri.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.decodeIfPossible_ = function(uri) {
  return uri && decodeURIComponent(uri)
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri)
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri)
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri))
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri)
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri))
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri)
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri))
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri)
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1)
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "")
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri))
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex)
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1);
  var pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if(goog.DEBUG && (uri.indexOf("#") >= 0 || uri.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not " + "supported: [" + uri + "]");
  }
};
goog.uri.utils.QueryValue;
goog.uri.utils.QueryArray;
goog.uri.utils.appendQueryData_ = function(buffer) {
  if(buffer[1]) {
    var baseUri = buffer[0];
    var hashIndex = baseUri.indexOf("#");
    if(hashIndex >= 0) {
      buffer.push(baseUri.substr(hashIndex));
      buffer[0] = baseUri = baseUri.substr(0, hashIndex)
    }
    var questionIndex = baseUri.indexOf("?");
    if(questionIndex < 0) {
      buffer[1] = "?"
    }else {
      if(questionIndex == baseUri.length - 1) {
        buffer[1] = undefined
      }
    }
  }
  return buffer.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if(goog.isArray(value)) {
    value = value;
    for(var j = 0;j < value.length;j++) {
      pairs.push("&", key);
      if(value[j] !== "") {
        pairs.push("=", goog.string.urlEncode(value[j]))
      }
    }
  }else {
    if(value != null) {
      pairs.push("&", key);
      if(value !== "") {
        pairs.push("=", goog.string.urlEncode(value))
      }
    }
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for(var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer)
  }
  return buffer
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for(var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer)
  }
  return buffer
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("")
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map))
};
goog.uri.utils.appendParam = function(uri, key, value) {
  return goog.uri.utils.appendQueryData_([uri, "&", key, "=", goog.string.urlEncode(value)])
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex;
  var keyLength = keyEncoded.length;
  while((index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1);
    if(precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if(!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index
      }
    }
    index += keyLength + 1
  }
  return-1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if(foundIndex < 0) {
    return null
  }else {
    var endPosition = uri.indexOf("&", foundIndex);
    if(endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex
    }
    foundIndex += keyEncoded.length + 1;
    return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex))
  }
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var result = [];
  while((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    position = uri.indexOf("&", foundIndex);
    if(position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)))
  }
  return result
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var buffer = [];
  while((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    buffer.push(uri.substring(position, foundIndex));
    position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex)
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value)
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  if(goog.string.endsWith(baseUri, "/")) {
    baseUri = baseUri.substr(0, baseUri.length - 1)
  }
  if(goog.string.startsWith(path, "/")) {
    path = path.substr(1)
  }
  return goog.string.buildString(baseUri, "/", path)
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.provide("goog.Uri");
goog.provide("goog.Uri.QueryData");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.uri.utils.ComponentIndex");
goog.Uri = function(opt_uri, opt_ignoreCase) {
  var m;
  if(opt_uri instanceof goog.Uri) {
    this.setIgnoreCase(opt_ignoreCase == null ? opt_uri.getIgnoreCase() : opt_ignoreCase);
    this.setScheme(opt_uri.getScheme());
    this.setUserInfo(opt_uri.getUserInfo());
    this.setDomain(opt_uri.getDomain());
    this.setPort(opt_uri.getPort());
    this.setPath(opt_uri.getPath());
    this.setQueryData(opt_uri.getQueryData().clone());
    this.setFragment(opt_uri.getFragment())
  }else {
    if(opt_uri && (m = goog.uri.utils.split(String(opt_uri)))) {
      this.setIgnoreCase(!!opt_ignoreCase);
      this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
      this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
      this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
      this.setPort(m[goog.uri.utils.ComponentIndex.PORT]);
      this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", true);
      this.setQuery(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", true);
      this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true)
    }else {
      this.setIgnoreCase(!!opt_ignoreCase);
      this.queryData_ = new goog.Uri.QueryData(null, this, this.ignoreCase_)
    }
  }
};
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.queryData_;
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = false;
goog.Uri.prototype.ignoreCase_ = false;
goog.Uri.prototype.toString = function() {
  if(this.cachedToString_) {
    return this.cachedToString_
  }
  var out = [];
  if(this.scheme_) {
    out.push(goog.Uri.encodeSpecialChars_(this.scheme_, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":")
  }
  if(this.domain_) {
    out.push("//");
    if(this.userInfo_) {
      out.push(goog.Uri.encodeSpecialChars_(this.userInfo_, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@")
    }
    out.push(goog.Uri.encodeString_(this.domain_));
    if(this.port_ != null) {
      out.push(":", String(this.getPort()))
    }
  }
  if(this.path_) {
    if(this.hasDomain() && this.path_.charAt(0) != "/") {
      out.push("/")
    }
    out.push(goog.Uri.encodeSpecialChars_(this.path_, goog.Uri.reDisallowedInPath_))
  }
  var query = String(this.queryData_);
  if(query) {
    out.push("?", query)
  }
  if(this.fragment_) {
    out.push("#", goog.Uri.encodeSpecialChars_(this.fragment_, goog.Uri.reDisallowedInFragment_))
  }
  return this.cachedToString_ = out.join("")
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone();
  var overridden = relativeUri.hasScheme();
  if(overridden) {
    absoluteUri.setScheme(relativeUri.getScheme())
  }else {
    overridden = relativeUri.hasUserInfo()
  }
  if(overridden) {
    absoluteUri.setUserInfo(relativeUri.getUserInfo())
  }else {
    overridden = relativeUri.hasDomain()
  }
  if(overridden) {
    absoluteUri.setDomain(relativeUri.getDomain())
  }else {
    overridden = relativeUri.hasPort()
  }
  var path = relativeUri.getPath();
  if(overridden) {
    absoluteUri.setPort(relativeUri.getPort())
  }else {
    overridden = relativeUri.hasPath();
    if(overridden) {
      if(path.charAt(0) != "/") {
        if(this.hasDomain() && !this.hasPath()) {
          path = "/" + path
        }else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          if(lastSlashIndex != -1) {
            path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path
          }
        }
      }
      path = goog.Uri.removeDotSegments(path)
    }
  }
  if(overridden) {
    absoluteUri.setPath(path)
  }else {
    overridden = relativeUri.hasQuery()
  }
  if(overridden) {
    absoluteUri.setQuery(relativeUri.getDecodedQuery())
  }else {
    overridden = relativeUri.hasFragment()
  }
  if(overridden) {
    absoluteUri.setFragment(relativeUri.getFragment())
  }
  return absoluteUri
};
goog.Uri.prototype.clone = function() {
  return goog.Uri.create(this.scheme_, this.userInfo_, this.domain_, this.port_, this.path_, this.queryData_.clone(), this.fragment_, this.ignoreCase_)
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme) : newScheme;
  if(this.scheme_) {
    this.scheme_ = this.scheme_.replace(/:$/, "")
  }
  return this
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain) : newDomain;
  return this
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_
};
goog.Uri.prototype.getPort = function() {
  return this.port_
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(newPort) {
    newPort = Number(newPort);
    if(isNaN(newPort) || newPort < 0) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort
  }else {
    this.port_ = null
  }
  return this
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null
};
goog.Uri.prototype.getPath = function() {
  return this.path_
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath) : newPath;
  return this
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== ""
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(queryData instanceof goog.Uri.QueryData) {
    this.queryData_ = queryData;
    this.queryData_.uri_ = this;
    this.queryData_.setIgnoreCase(this.ignoreCase_)
  }else {
    if(!opt_decode) {
      queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_)
    }
    this.queryData_ = new goog.Uri.QueryData(queryData, this, this.ignoreCase_)
  }
  return this
};
goog.Uri.prototype.setQuery = function(newQuery, opt_decode) {
  return this.setQueryData(newQuery, opt_decode)
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.queryData_.set(key, value);
  return this
};
goog.Uri.prototype.setParameterValues = function(key, values) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(!goog.isArray(values)) {
    values = [String(values)]
  }
  this.queryData_.setValues(key, values);
  return this
};
goog.Uri.prototype.getParameterValues = function(name) {
  return this.queryData_.getValues(name)
};
goog.Uri.prototype.getParameterValue = function(paramName) {
  return this.queryData_.get(paramName)
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(uri2) {
  return(!this.hasDomain() && !uri2.hasDomain() || this.getDomain() == uri2.getDomain()) && (!this.hasPort() && !uri2.hasPort() || this.getPort() == uri2.getPort())
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this
};
goog.Uri.prototype.removeParameter = function(key) {
  this.enforceReadOnly();
  this.queryData_.remove(key);
  return this
};
goog.Uri.prototype.setReadOnly = function(isReadOnly) {
  this.isReadOnly_ = isReadOnly;
  return this
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
  if(this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  if(this.queryData_) {
    this.queryData_.setIgnoreCase(ignoreCase)
  }
  return this
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase)
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri
};
goog.Uri.resolve = function(base, rel) {
  if(!(base instanceof goog.Uri)) {
    base = goog.Uri.parse(base)
  }
  if(!(rel instanceof goog.Uri)) {
    rel = goog.Uri.parse(rel)
  }
  return base.resolve(rel)
};
goog.Uri.removeDotSegments = function(path) {
  if(path == ".." || path == ".") {
    return""
  }else {
    if(!goog.string.contains(path, "./") && !goog.string.contains(path, "/.")) {
      return path
    }else {
      var leadingSlash = goog.string.startsWith(path, "/");
      var segments = path.split("/");
      var out = [];
      for(var pos = 0;pos < segments.length;) {
        var segment = segments[pos++];
        if(segment == ".") {
          if(leadingSlash && pos == segments.length) {
            out.push("")
          }
        }else {
          if(segment == "..") {
            if(out.length > 1 || out.length == 1 && out[0] != "") {
              out.pop()
            }
            if(leadingSlash && pos == segments.length) {
              out.push("")
            }
          }else {
            out.push(segment);
            leadingSlash = true
          }
        }
      }
      return out.join("/")
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(val) {
  return val ? decodeURIComponent(val) : ""
};
goog.Uri.encodeString_ = function(unescapedPart) {
  if(goog.isString(unescapedPart)) {
    return encodeURIComponent(unescapedPart)
  }
  return null
};
goog.Uri.encodeSpecialRegExp_ = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra) {
  var ret = null;
  if(goog.isString(unescapedPart)) {
    ret = unescapedPart;
    if(!goog.Uri.encodeSpecialRegExp_.test(ret)) {
      ret = encodeURI(unescapedPart)
    }
    if(ret.search(extra) >= 0) {
      ret = ret.replace(extra, goog.Uri.encodeChar_)
    }
  }
  return ret
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return"%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInPath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String);
  var pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.encodedQuery_ = opt_query || null;
  this.uri_ = opt_uri || null;
  this.ignoreCase_ = !!opt_ignoreCase
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if(!this.keyMap_) {
    this.keyMap_ = new goog.structs.Map;
    if(this.encodedQuery_) {
      var pairs = this.encodedQuery_.split("&");
      for(var i = 0;i < pairs.length;i++) {
        var indexOfEquals = pairs[i].indexOf("=");
        var name = null;
        var value = null;
        if(indexOfEquals >= 0) {
          name = pairs[i].substring(0, indexOfEquals);
          value = pairs[i].substring(indexOfEquals + 1)
        }else {
          name = pairs[i]
        }
        name = goog.string.urlDecode(name);
        name = this.getKeyName_(name);
        this.add(name, value ? goog.string.urlDecode(value) : "")
      }
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if(typeof keys == "undefined") {
    throw Error("Keys are undefined");
  }
  return goog.Uri.QueryData.createFromKeysValues(keys, goog.structs.getValues(map), opt_uri, opt_ignoreCase)
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if(keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  var queryData = new goog.Uri.QueryData(null, opt_uri, opt_ignoreCase);
  for(var i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i])
  }
  return queryData
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.decodedQuery_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if(!this.containsKey(key)) {
    this.keyMap_.set(key, value)
  }else {
    var current = this.keyMap_.get(key);
    if(goog.isArray(current)) {
      current.push(value)
    }else {
      this.keyMap_.set(key, [current, value])
    }
  }
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if(this.keyMap_.containsKey(key)) {
    this.invalidateCache_();
    var old = this.keyMap_.get(key);
    if(goog.isArray(old)) {
      this.count_ -= old.length
    }else {
      this.count_--
    }
    return this.keyMap_.remove(key)
  }
  return false
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  if(this.keyMap_) {
    this.keyMap_.clear()
  }
  this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key)
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value)
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  var vals = this.keyMap_.getValues();
  var keys = this.keyMap_.getKeys();
  var rv = [];
  for(var i = 0;i < keys.length;i++) {
    var val = vals[i];
    if(goog.isArray(val)) {
      for(var j = 0;j < val.length;j++) {
        rv.push(keys[i])
      }
    }else {
      rv.push(keys[i])
    }
  }
  return rv
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv;
  if(opt_key) {
    var key = this.getKeyName_(opt_key);
    if(this.containsKey(key)) {
      var value = this.keyMap_.get(key);
      if(goog.isArray(value)) {
        return value
      }else {
        rv = [];
        rv.push(value)
      }
    }else {
      rv = []
    }
  }else {
    var vals = this.keyMap_.getValues();
    rv = [];
    for(var i = 0;i < vals.length;i++) {
      var val = vals[i];
      if(goog.isArray(val)) {
        goog.array.extend(rv, val)
      }else {
        rv.push(val)
      }
    }
  }
  return rv
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if(this.containsKey(key)) {
    var old = this.keyMap_.get(key);
    if(goog.isArray(old)) {
      this.count_ -= old.length
    }else {
      this.count_--
    }
  }
  this.keyMap_.set(key, value);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if(this.containsKey(key)) {
    var val = this.keyMap_.get(key);
    if(goog.isArray(val)) {
      return val[0]
    }else {
      return val
    }
  }else {
    return opt_default
  }
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if(this.containsKey(key)) {
    var old = this.keyMap_.get(key);
    if(goog.isArray(old)) {
      this.count_ -= old.length
    }else {
      this.count_--
    }
  }
  if(values.length > 0) {
    this.keyMap_.set(key, values);
    this.count_ += values.length
  }
};
goog.Uri.QueryData.prototype.toString = function() {
  if(this.encodedQuery_) {
    return this.encodedQuery_
  }
  if(!this.keyMap_) {
    return""
  }
  var sb = [];
  var count = 0;
  var keys = this.keyMap_.getKeys();
  for(var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var encodedKey = goog.string.urlEncode(key);
    var val = this.keyMap_.get(key);
    if(goog.isArray(val)) {
      for(var j = 0;j < val.length;j++) {
        if(count > 0) {
          sb.push("&")
        }
        sb.push(encodedKey);
        if(val[j] !== "") {
          sb.push("=", goog.string.urlEncode(val[j]))
        }
        count++
      }
    }else {
      if(count > 0) {
        sb.push("&")
      }
      sb.push(encodedKey);
      if(val !== "") {
        sb.push("=", goog.string.urlEncode(val))
      }
      count++
    }
  }
  return this.encodedQuery_ = sb.join("")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  if(!this.decodedQuery_) {
    this.decodedQuery_ = goog.Uri.decodeOrEmpty_(this.toString())
  }
  return this.decodedQuery_
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  delete this.decodedQuery_;
  delete this.encodedQuery_;
  if(this.uri_) {
    delete this.uri_.cachedToString_
  }
};
goog.Uri.QueryData.prototype.filterKeys = function(keys) {
  this.ensureKeyMapInitialized_();
  goog.structs.forEach(this.keyMap_, function(value, key, map) {
    if(!goog.array.contains(keys, key)) {
      this.remove(key)
    }
  }, this);
  return this
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  if(this.decodedQuery_) {
    rv.decodedQuery_ = this.decodedQuery_
  }
  if(this.encodedQuery_) {
    rv.encodedQuery_ = this.encodedQuery_
  }
  if(this.keyMap_) {
    rv.keyMap_ = this.keyMap_.clone()
  }
  return rv
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  if(this.ignoreCase_) {
    keyName = keyName.toLowerCase()
  }
  return keyName
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  if(resetKeys) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    goog.structs.forEach(this.keyMap_, function(value, key, map) {
      var lowerCase = key.toLowerCase();
      if(key != lowerCase) {
        this.remove(key);
        this.add(lowerCase, value)
      }
    }, this)
  }
  this.ignoreCase_ = ignoreCase
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for(var i = 0;i < arguments.length;i++) {
    var data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value)
    }, this)
  }
};
goog.provide("goog.json");
goog.provide("goog.json.Serializer");
goog.json.isValid_ = function(s) {
  if(/^\s*$/.test(s)) {
    return false
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""))
};
goog.json.parse = function(s) {
  var o = String(s);
  if(goog.json.isValid_(o)) {
    try {
      return eval("(" + o + ")")
    }catch(ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = function(s) {
  return eval("(" + s + ")")
};
goog.json.serialize = function(object) {
  return(new goog.json.Serializer).serialize(object)
};
goog.json.Serializer = function() {
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serialize_(object, sb);
  return sb.join("")
};
goog.json.Serializer.prototype.serialize_ = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_(object, sb);
      break;
    case "number":
      this.serializeNumber_(object, sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if(object == null) {
        sb.push("null");
        break
      }
      if(goog.isArray(object)) {
        this.serializeArray_(object, sb);
        break
      }
      this.serializeObject_(object, sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if(c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c]
    }
    var cc = c.charCodeAt(0);
    var rv = "\\u";
    if(cc < 16) {
      rv += "000"
    }else {
      if(cc < 256) {
        rv += "00"
      }else {
        if(cc < 4096) {
          rv += "0"
        }
      }
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16)
  }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null")
};
goog.json.Serializer.prototype.serializeArray_ = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for(var i = 0;i < l;i++) {
    sb.push(sep);
    this.serialize_(arr[i], sb);
    sep = ","
  }
  sb.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for(var key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      if(typeof value != "function") {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(":");
        this.serialize_(value, sb);
        sep = ","
      }
    }
  }
  sb.push("}")
};
goog.provide("goog.structs.Set");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  if(opt_values) {
    this.addAll(opt_values)
  }
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  if(type == "object" && val || type == "function") {
    return"o" + goog.getUid(val)
  }else {
    return type.substr(0, 1) + val
  }
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element)
};
goog.structs.Set.prototype.addAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    this.add(values[i])
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    this.remove(values[i])
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element))
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element))
};
goog.structs.Set.prototype.containsAll = function(col) {
  return goog.structs.every(col, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(col) {
  var result = new goog.structs.Set;
  var values = goog.structs.getValues(col);
  for(var i = 0;i < values.length;i++) {
    var value = values[i];
    if(this.contains(value)) {
      result.add(value)
    }
  }
  return result
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col)
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if(this.getCount() > colCount) {
    return false
  }
  if(!(col instanceof goog.structs.Set) && colCount > 5) {
    col = new goog.structs.Set(col)
  }
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value)
  })
};
goog.structs.Set.prototype.__iterator__ = function(opt_keys) {
  return this.map_.__iterator__(false)
};
goog.provide("goog.debug");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs.Set");
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global;
  var oldErrorHandler = target.onerror;
  target.onerror = function(message, url, line) {
    if(oldErrorHandler) {
      oldErrorHandler(message, url, line)
    }
    logFunc({message:message, fileName:url, line:line});
    return Boolean(opt_cancel)
  }
};
goog.debug.expose = function(obj, opt_showFn) {
  if(typeof obj == "undefined") {
    return"undefined"
  }
  if(obj == null) {
    return"NULL"
  }
  var str = [];
  for(var x in obj) {
    if(!opt_showFn && goog.isFunction(obj[x])) {
      continue
    }
    var s = x + " = ";
    try {
      s += obj[x]
    }catch(e) {
      s += "*** " + e + " ***"
    }
    str.push(s)
  }
  return str.join("\n")
};
goog.debug.deepExpose = function(obj, opt_showFn) {
  var previous = new goog.structs.Set;
  var str = [];
  var helper = function(obj, space) {
    var nestspace = space + "  ";
    var indentMultiline = function(str) {
      return str.replace(/\n/g, "\n" + space)
    };
    try {
      if(!goog.isDef(obj)) {
        str.push("undefined")
      }else {
        if(goog.isNull(obj)) {
          str.push("NULL")
        }else {
          if(goog.isString(obj)) {
            str.push('"' + indentMultiline(obj) + '"')
          }else {
            if(goog.isFunction(obj)) {
              str.push(indentMultiline(String(obj)))
            }else {
              if(goog.isObject(obj)) {
                if(previous.contains(obj)) {
                  str.push("*** reference loop detected ***")
                }else {
                  previous.add(obj);
                  str.push("{");
                  for(var x in obj) {
                    if(!opt_showFn && goog.isFunction(obj[x])) {
                      continue
                    }
                    str.push("\n");
                    str.push(nestspace);
                    str.push(x + " = ");
                    helper(obj[x], nestspace)
                  }
                  str.push("\n" + space + "}")
                }
              }else {
                str.push(obj)
              }
            }
          }
        }
      }
    }catch(e) {
      str.push("*** " + e + " ***")
    }
  };
  helper(obj, "");
  return str.join("")
};
goog.debug.exposeArray = function(arr) {
  var str = [];
  for(var i = 0;i < arr.length;i++) {
    if(goog.isArray(arr[i])) {
      str.push(goog.debug.exposeArray(arr[i]))
    }else {
      str.push(arr[i])
    }
  }
  return"[ " + str.join(", ") + " ]"
};
goog.debug.exposeException = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err);
    var error = "Message: " + goog.string.htmlEscape(e.message) + '\nUrl: <a href="view-source:' + e.fileName + '" target="_new">' + e.fileName + "</a>\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(e.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(opt_fn) + "-> ");
    return error
  }catch(e2) {
    return"Exception trying to expose exception! You win, we lose. " + e2
  }
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if(goog.isString(err)) {
    return{"message":err, "name":"Unknown error", "lineNumber":"Not available", "fileName":href, "stack":"Not available"}
  }
  var lineNumber, fileName;
  var threwError = false;
  try {
    lineNumber = err.lineNumber || err.line || "Not available"
  }catch(e) {
    lineNumber = "Not available";
    threwError = true
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || href
  }catch(e) {
    fileName = "Not available";
    threwError = true
  }
  if(threwError || !err.lineNumber || !err.fileName || !err.stack) {
    return{"message":err.message, "name":err.name, "lineNumber":lineNumber, "fileName":fileName, "stack":err.stack || "Not available"}
  }
  return err
};
goog.debug.enhanceError = function(err, opt_message) {
  var error = typeof err == "string" ? Error(err) : err;
  if(!error.stack) {
    error.stack = goog.debug.getStacktrace(arguments.callee.caller)
  }
  if(opt_message) {
    var x = 0;
    while(error["message" + x]) {
      ++x
    }
    error["message" + x] = String(opt_message)
  }
  return error
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  var sb = [];
  var fn = arguments.callee.caller;
  var depth = 0;
  while(fn && (!opt_depth || depth < opt_depth)) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller
    }catch(e) {
      sb.push("[exception trying to get caller]\n");
      break
    }
    depth++;
    if(depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break
    }
  }
  if(opt_depth && depth >= opt_depth) {
    sb.push("[...reached max depth limit...]")
  }else {
    sb.push("[end]")
  }
  return sb.join("")
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(opt_fn) {
  return goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, [])
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if(goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]")
  }else {
    if(fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      var args = fn.arguments;
      for(var i = 0;i < args.length;i++) {
        if(i > 0) {
          sb.push(", ")
        }
        var argDesc;
        var arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = goog.debug.getFunctionName(arg);
            argDesc = argDesc ? argDesc : "[fn]";
            break;
          case "undefined":
          ;
          default:
            argDesc = typeof arg;
            break
        }
        if(argDesc.length > 40) {
          argDesc = argDesc.substr(0, 40) + "..."
        }
        sb.push(argDesc)
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited))
      }catch(e) {
        sb.push("[exception trying to get caller]\n")
      }
    }else {
      if(fn) {
        sb.push("[...long stack...]")
      }else {
        sb.push("[end]")
      }
    }
  }
  return sb.join("")
};
goog.debug.getFunctionName = function(fn) {
  var functionSource = String(fn);
  if(!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    if(matches) {
      var method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method
    }else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]"
    }
  }
  return goog.debug.fnNameCache_[functionSource]
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
goog.debug.fnNameCache_ = {};
goog.provide("goog.debug.LogRecord");
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber)
};
goog.debug.LogRecord.prototype.time_;
goog.debug.LogRecord.prototype.level_;
goog.debug.LogRecord.prototype.msg_;
goog.debug.LogRecord.prototype.loggerName_;
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = true;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  if(goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof opt_sequenceNumber == "number" ? opt_sequenceNumber : goog.debug.LogRecord.nextSequenceNumber_++
  }
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
  delete this.exceptionText_
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_
};
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
  this.exceptionText_ = text
};
goog.debug.LogRecord.prototype.setLoggerName = function(loggerName) {
  this.loggerName_ = loggerName
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_
};
goog.debug.LogRecord.prototype.setMessage = function(msg) {
  this.msg_ = msg
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_
};
goog.debug.LogRecord.prototype.setMillis = function(time) {
  this.time_ = time
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_
};
goog.provide("goog.debug.LogBuffer");
goog.require("goog.asserts");
goog.require("goog.debug.LogRecord");
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining " + "goog.debug.LogBuffer.CAPACITY.");
  this.clear()
};
goog.debug.LogBuffer.getInstance = function() {
  if(!goog.debug.LogBuffer.instance_) {
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer
  }
  return goog.debug.LogBuffer.instance_
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.buffer_;
goog.debug.LogBuffer.prototype.curIndex_;
goog.debug.LogBuffer.prototype.isFull_;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if(this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName)
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return goog.debug.LogBuffer.CAPACITY > 0
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = new Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = false
};
goog.debug.LogBuffer.prototype.forEachRecord = function(func) {
  var buffer = this.buffer_;
  if(!buffer[0]) {
    return
  }
  var curIndex = this.curIndex_;
  var i = this.isFull_ ? curIndex : -1;
  do {
    i = (i + 1) % goog.debug.LogBuffer.CAPACITY;
    func(buffer[i])
  }while(i != curIndex)
};
goog.provide("goog.debug.LogManager");
goog.provide("goog.debug.Logger");
goog.provide("goog.debug.Logger.Level");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug");
goog.require("goog.debug.LogBuffer");
goog.require("goog.debug.LogRecord");
goog.debug.Logger = function(name) {
  this.name_ = name
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = true;
if(!goog.debug.Logger.ENABLE_HIERARCHY) {
  goog.debug.Logger.rootHandlers_ = [];
  goog.debug.Logger.rootLevel_
}
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for(var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level;
    goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  if(!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_()
  }
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  if(!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_()
  }
  if(value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value]
  }
  for(var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if(level.value <= value) {
      return level
    }
  }
  return null
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name)
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    if(!this.handlers_) {
      this.handlers_ = []
    }
    this.handlers_.push(handler)
  }else {
    goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootHandlers_.push(handler)
  }
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
  return!!handlers && goog.array.remove(handlers, handler)
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_
};
goog.debug.Logger.prototype.getChildren = function() {
  if(!this.children_) {
    this.children_ = {}
  }
  return this.children_
};
goog.debug.Logger.prototype.setLevel = function(level) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    this.level_ = level
  }else {
    goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootLevel_ = level
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return this.level_
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if(!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if(this.level_) {
    return this.level_
  }
  if(this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail("Root logger has no level set.");
  return null
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return level.value >= this.getEffectiveLevel().value
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  if(this.isLoggable(level)) {
    this.doLogRecord_(this.getLogRecord(level, msg, opt_exception))
  }
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception) {
  if(goog.debug.LogBuffer.isBufferingEnabled()) {
    var logRecord = goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_)
  }else {
    logRecord = new goog.debug.LogRecord(level, String(msg), this.name_)
  }
  if(opt_exception) {
    logRecord.setException(opt_exception);
    logRecord.setExceptionText(goog.debug.exposeException(opt_exception, arguments.callee.caller))
  }
  return logRecord
};
goog.debug.Logger.prototype.shout = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception)
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception)
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception)
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.INFO, msg, opt_exception)
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception)
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINE, msg, opt_exception)
};
goog.debug.Logger.prototype.finer = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINER, msg, opt_exception)
};
goog.debug.Logger.prototype.finest = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception)
};
goog.debug.Logger.prototype.logRecord = function(logRecord) {
  if(this.isLoggable(logRecord.getLevel())) {
    this.doLogRecord_(logRecord)
  }
};
goog.debug.Logger.prototype.logToSpeedTracer_ = function(msg) {
  if(goog.global["console"] && goog.global["console"]["markTimeline"]) {
    goog.global["console"]["markTimeline"](msg)
  }
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  this.logToSpeedTracer_("log:" + logRecord.getMessage());
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var target = this;
    while(target) {
      target.callPublish_(logRecord);
      target = target.getParent()
    }
  }else {
    for(var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord)
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if(this.handlers_) {
    for(var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord)
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if(!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger("");
    goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG)
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name)
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")")
  }
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf(".");
    var parentName = name.substr(0, lastDotIndex);
    var leafName = name.substr(lastDotIndex + 1);
    var parentLogger = goog.debug.LogManager.getLogger(parentName);
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger)
  }
  goog.debug.LogManager.loggers_[name] = logger;
  return logger
};
goog.provide("goog.messaging.MessageChannel");
goog.messaging.MessageChannel = function() {
};
goog.messaging.MessageChannel.prototype.connect = function(opt_connectCb) {
};
goog.messaging.MessageChannel.prototype.isConnected = function() {
};
goog.messaging.MessageChannel.prototype.registerService = function(serviceName, callback, opt_objectPayload) {
};
goog.messaging.MessageChannel.prototype.registerDefaultService = function(callback) {
};
goog.messaging.MessageChannel.prototype.send = function(serviceName, payload) {
};
goog.provide("goog.messaging.AbstractChannel");
goog.require("goog.Disposable");
goog.require("goog.debug");
goog.require("goog.debug.Logger");
goog.require("goog.json");
goog.require("goog.messaging.MessageChannel");
goog.messaging.AbstractChannel = function() {
  goog.base(this);
  this.services_ = {}
};
goog.inherits(goog.messaging.AbstractChannel, goog.Disposable);
goog.messaging.AbstractChannel.prototype.defaultService_;
goog.messaging.AbstractChannel.prototype.logger = goog.debug.Logger.getLogger("goog.messaging.AbstractChannel");
goog.messaging.AbstractChannel.prototype.connect = function(opt_connectCb) {
  if(opt_connectCb) {
    opt_connectCb()
  }
};
goog.messaging.AbstractChannel.prototype.isConnected = function() {
  return true
};
goog.messaging.AbstractChannel.prototype.registerService = function(serviceName, callback, opt_objectPayload) {
  this.services_[serviceName] = {callback:callback, objectPayload:!!opt_objectPayload}
};
goog.messaging.AbstractChannel.prototype.registerDefaultService = function(callback) {
  this.defaultService_ = callback
};
goog.messaging.AbstractChannel.prototype.send = goog.abstractMethod;
goog.messaging.AbstractChannel.prototype.deliver = function(serviceName, payload) {
  var service = this.getService(serviceName, payload);
  if(!service) {
    return
  }
  payload = this.decodePayload(serviceName, payload, service.objectPayload);
  if(goog.isDefAndNotNull(payload)) {
    service.callback(payload)
  }
};
goog.messaging.AbstractChannel.prototype.getService = function(serviceName, payload) {
  var service = this.services_[serviceName];
  if(service) {
    return service
  }else {
    if(this.defaultService_) {
      var callback = goog.partial(this.defaultService_, serviceName);
      var objectPayload = goog.isObject(payload);
      return{callback:callback, objectPayload:objectPayload}
    }
  }
  this.logger.warning('Unknown service name "' + serviceName + '"');
  return null
};
goog.messaging.AbstractChannel.prototype.decodePayload = function(serviceName, payload, objectPayload) {
  if(objectPayload && goog.isString(payload)) {
    try {
      return goog.json.parse(payload)
    }catch(err) {
      this.logger.warning("Expected JSON payload for " + serviceName + ', was "' + payload + '"');
      return null
    }
  }else {
    if(!objectPayload && !goog.isString(payload)) {
      return goog.json.serialize(payload)
    }
  }
  return payload
};
goog.messaging.AbstractChannel.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  goog.dispose(this.logger);
  delete this.logger;
  delete this.services_;
  delete this.defaultService_
};
goog.provide("goog.net.xpc");
goog.provide("goog.net.xpc.CfgFields");
goog.provide("goog.net.xpc.ChannelStates");
goog.provide("goog.net.xpc.TransportNames");
goog.provide("goog.net.xpc.TransportTypes");
goog.provide("goog.net.xpc.UriCfgFields");
goog.require("goog.debug.Logger");
goog.net.xpc.TransportTypes = {NATIVE_MESSAGING:1, FRAME_ELEMENT_METHOD:2, IFRAME_RELAY:3, IFRAME_POLLING:4, FLASH:5, NIX:6};
goog.net.xpc.TransportNames = {1:"NativeMessagingTransport", 2:"FrameElementMethodTransport", 3:"IframeRelayTransport", 4:"IframePollingTransport", 5:"FlashTransport", 6:"NixTransport"};
goog.net.xpc.CfgFields = {CHANNEL_NAME:"cn", AUTH_TOKEN:"at", REMOTE_AUTH_TOKEN:"rat", PEER_URI:"pu", IFRAME_ID:"ifrid", TRANSPORT:"tp", LOCAL_RELAY_URI:"lru", PEER_RELAY_URI:"pru", LOCAL_POLL_URI:"lpu", PEER_POLL_URI:"ppu", PEER_HOSTNAME:"ph"};
goog.net.xpc.UriCfgFields = [goog.net.xpc.CfgFields.PEER_URI, goog.net.xpc.CfgFields.LOCAL_RELAY_URI, goog.net.xpc.CfgFields.PEER_RELAY_URI, goog.net.xpc.CfgFields.LOCAL_POLL_URI, goog.net.xpc.CfgFields.PEER_POLL_URI];
goog.net.xpc.ChannelStates = {NOT_CONNECTED:1, CONNECTED:2, CLOSED:3};
goog.net.xpc.TRANSPORT_SERVICE_ = "tp";
goog.net.xpc.SETUP = "SETUP";
goog.net.xpc.SETUP_ACK_ = "SETUP_ACK";
goog.net.xpc.channels_ = {};
goog.net.xpc.getRandomString = function(length, opt_characters) {
  var chars = opt_characters || goog.net.xpc.randomStringCharacters_;
  var charsLength = chars.length;
  var s = "";
  while(length-- > 0) {
    s += chars.charAt(Math.floor(Math.random() * charsLength))
  }
  return s
};
goog.net.xpc.randomStringCharacters_ = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
goog.net.xpc.logger = goog.debug.Logger.getLogger("goog.net.xpc");
goog.provide("goog.net.xpc.Transport");
goog.require("goog.Disposable");
goog.require("goog.net.xpc");
goog.net.xpc.Transport = function(opt_domHelper) {
  goog.Disposable.call(this);
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper()
};
goog.inherits(goog.net.xpc.Transport, goog.Disposable);
goog.net.xpc.Transport.prototype.transportType = 0;
goog.net.xpc.Transport.prototype.getType = function() {
  return this.transportType
};
goog.net.xpc.Transport.prototype.getWindow = function() {
  return this.domHelper_.getWindow()
};
goog.net.xpc.Transport.prototype.getName = function() {
  return goog.net.xpc.TransportNames[this.transportType] || ""
};
goog.net.xpc.Transport.prototype.transportServiceHandler = goog.abstractMethod;
goog.net.xpc.Transport.prototype.connect = goog.abstractMethod;
goog.net.xpc.Transport.prototype.send = goog.abstractMethod;
goog.provide("goog.net.xpc.FrameElementMethodTransport");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.Transport");
goog.net.xpc.FrameElementMethodTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.queue_ = [];
  this.deliverQueuedCb_ = goog.bind(this.deliverQueued_, this)
};
goog.inherits(goog.net.xpc.FrameElementMethodTransport, goog.net.xpc.Transport);
goog.net.xpc.FrameElementMethodTransport.prototype.transportType = goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD;
goog.net.xpc.FrameElementMethodTransport.prototype.recursive_ = false;
goog.net.xpc.FrameElementMethodTransport.prototype.timer_ = 0;
goog.net.xpc.FrameElementMethodTransport.outgoing_ = null;
goog.net.xpc.FrameElementMethodTransport.prototype.connect = function() {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannel.Role.OUTER) {
    this.iframeElm_ = this.channel_.iframeElement_;
    this.iframeElm_["XPC_toOuter"] = goog.bind(this.incoming_, this)
  }else {
    this.attemptSetup_()
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.attemptSetup_ = function() {
  var retry = true;
  try {
    if(!this.iframeElm_) {
      this.iframeElm_ = this.getWindow().frameElement
    }
    if(this.iframeElm_ && this.iframeElm_["XPC_toOuter"]) {
      this.outgoing_ = this.iframeElm_["XPC_toOuter"];
      this.iframeElm_["XPC_toOuter"]["XPC_toInner"] = goog.bind(this.incoming_, this);
      retry = false;
      this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
      this.channel_.notifyConnected_()
    }
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + e)
  }
  if(retry) {
    if(!this.attemptSetupCb_) {
      this.attemptSetupCb_ = goog.bind(this.attemptSetup_, this)
    }
    this.getWindow().setTimeout(this.attemptSetupCb_, 100)
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.transportServiceHandler = function(payload) {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannel.Role.OUTER && !this.channel_.isConnected() && payload == goog.net.xpc.SETUP_ACK_) {
    this.outgoing_ = this.iframeElm_["XPC_toOuter"]["XPC_toInner"];
    this.channel_.notifyConnected_()
  }else {
    throw Error("Got unexpected transport message.");
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.incoming_ = function(serviceName, payload) {
  if(!this.recursive_ && this.queue_.length == 0) {
    this.channel_.deliver_(serviceName, payload)
  }else {
    this.queue_.push({serviceName:serviceName, payload:payload});
    if(this.queue_.length == 1) {
      this.timer_ = this.getWindow().setTimeout(this.deliverQueuedCb_, 1)
    }
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.deliverQueued_ = function() {
  while(this.queue_.length) {
    var msg = this.queue_.shift();
    this.channel_.deliver_(msg.serviceName, msg.payload)
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.send = function(service, payload) {
  this.recursive_ = true;
  this.outgoing_(service, payload);
  this.recursive_ = false
};
goog.net.xpc.FrameElementMethodTransport.prototype.disposeInternal = function() {
  goog.net.xpc.FrameElementMethodTransport.superClass_.disposeInternal.call(this);
  this.outgoing_ = null;
  this.iframeElm_ = null
};
goog.provide("goog.net.xpc.IframePollingTransport");
goog.provide("goog.net.xpc.IframePollingTransport.Receiver");
goog.provide("goog.net.xpc.IframePollingTransport.Sender");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.Transport");
goog.require("goog.userAgent");
goog.net.xpc.IframePollingTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.sendUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI];
  this.rcvUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI];
  this.sendQueue_ = []
};
goog.inherits(goog.net.xpc.IframePollingTransport, goog.net.xpc.Transport);
goog.net.xpc.IframePollingTransport.prototype.transportType = goog.net.xpc.TransportTypes.IFRAME_POLLING;
goog.net.xpc.IframePollingTransport.prototype.sequence_ = 0;
goog.net.xpc.IframePollingTransport.prototype.waitForAck_ = false;
goog.net.xpc.IframePollingTransport.prototype.initialized_ = false;
goog.net.xpc.IframePollingTransport.IFRAME_PREFIX = "googlexpc";
goog.net.xpc.IframePollingTransport.prototype.getMsgFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_" + this.channel_.name + "_msg"
};
goog.net.xpc.IframePollingTransport.prototype.getAckFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_" + this.channel_.name + "_ack"
};
goog.net.xpc.IframePollingTransport.prototype.connect = function() {
  goog.net.xpc.logger.fine("transport connect called");
  if(!this.initialized_) {
    goog.net.xpc.logger.fine("initializing...");
    this.constructSenderFrames_();
    this.initialized_ = true
  }
  this.checkForeignFramesReady_()
};
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrames_ = function() {
  var name = this.getMsgFrameName_();
  this.msgIframeElm_ = this.constructSenderFrame_(name);
  this.msgWinObj_ = this.getWindow().frames[name];
  name = this.getAckFrameName_();
  this.ackIframeElm_ = this.constructSenderFrame_(name);
  this.ackWinObj_ = this.getWindow().frames[name]
};
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrame_ = function(id) {
  goog.net.xpc.logger.finest("constructing sender frame: " + id);
  var ifr = goog.dom.createElement("iframe");
  var s = ifr.style;
  s.position = "absolute";
  s.top = "-10px";
  s.left = "10px";
  s.width = "1px";
  s.height = "1px";
  ifr.id = ifr.name = id;
  ifr.src = this.sendUri_ + "#INITIAL";
  this.getWindow().document.body.appendChild(ifr);
  return ifr
};
goog.net.xpc.IframePollingTransport.prototype.innerPeerReconnect_ = function() {
  goog.net.xpc.logger.finest("innerPeerReconnect called");
  this.channel_.name = goog.net.xpc.getRandomString(10);
  goog.net.xpc.logger.finest("switching channels: " + this.channel_.name);
  this.deconstructSenderFrames_();
  this.initialized_ = false;
  this.reconnectFrame_ = this.constructSenderFrame_(goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_reconnect_" + this.channel_.name)
};
goog.net.xpc.IframePollingTransport.prototype.outerPeerReconnect_ = function() {
  goog.net.xpc.logger.finest("outerPeerReconnect called");
  var frames = this.channel_.peerWindowObject_.frames;
  var length = frames.length;
  for(var i = 0;i < length;i++) {
    var frameName;
    try {
      if(frames[i] && frames[i].name) {
        frameName = frames[i].name
      }
    }catch(e) {
    }
    if(!frameName) {
      continue
    }
    var message = frameName.split("_");
    if(message.length == 3 && message[0] == goog.net.xpc.IframePollingTransport.IFRAME_PREFIX && message[1] == "reconnect") {
      this.channel_.name = message[2];
      this.deconstructSenderFrames_();
      this.initialized_ = false;
      break
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.deconstructSenderFrames_ = function() {
  goog.net.xpc.logger.finest("deconstructSenderFrames called");
  if(this.msgIframeElm_) {
    this.msgIframeElm_.parentNode.removeChild(this.msgIframeElm_);
    this.msgIframeElm_ = null;
    this.msgWinObj_ = null
  }
  if(this.ackIframeElm_) {
    this.ackIframeElm_.parentNode.removeChild(this.ackIframeElm_);
    this.ackIframeElm_ = null;
    this.ackWinObj_ = null
  }
};
goog.net.xpc.IframePollingTransport.prototype.checkForeignFramesReady_ = function() {
  if(!(this.isRcvFrameReady_(this.getMsgFrameName_()) && this.isRcvFrameReady_(this.getAckFrameName_()))) {
    goog.net.xpc.logger.finest("foreign frames not (yet) present");
    if(this.channel_.getRole() == goog.net.xpc.CrossPageChannel.Role.INNER && !this.reconnectFrame_) {
      this.innerPeerReconnect_()
    }else {
      if(this.channel_.getRole() == goog.net.xpc.CrossPageChannel.Role.OUTER) {
        this.outerPeerReconnect_()
      }
    }
    this.getWindow().setTimeout(goog.bind(this.connect, this), 100)
  }else {
    goog.net.xpc.logger.fine("foreign frames present");
    this.msgReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(this, this.channel_.peerWindowObject_.frames[this.getMsgFrameName_()], goog.bind(this.processIncomingMsg, this));
    this.ackReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(this, this.channel_.peerWindowObject_.frames[this.getAckFrameName_()], goog.bind(this.processIncomingAck, this));
    this.checkLocalFramesPresent_()
  }
};
goog.net.xpc.IframePollingTransport.prototype.isRcvFrameReady_ = function(frameName) {
  goog.net.xpc.logger.finest("checking for receive frame: " + frameName);
  try {
    var winObj = this.channel_.peerWindowObject_.frames[frameName];
    if(!winObj || winObj.location.href.indexOf(this.rcvUri_) != 0) {
      return false
    }
  }catch(e) {
    return false
  }
  return true
};
goog.net.xpc.IframePollingTransport.prototype.checkLocalFramesPresent_ = function() {
  var frames = this.channel_.peerWindowObject_.frames;
  if(!(frames[this.getAckFrameName_()] && frames[this.getMsgFrameName_()])) {
    if(!this.checkLocalFramesPresentCb_) {
      this.checkLocalFramesPresentCb_ = goog.bind(this.checkLocalFramesPresent_, this)
    }
    this.getWindow().setTimeout(this.checkLocalFramesPresentCb_, 100);
    goog.net.xpc.logger.fine("local frames not (yet) present")
  }else {
    this.msgSender_ = new goog.net.xpc.IframePollingTransport.Sender(this.sendUri_, this.msgWinObj_);
    this.ackSender_ = new goog.net.xpc.IframePollingTransport.Sender(this.sendUri_, this.ackWinObj_);
    goog.net.xpc.logger.fine("local frames ready");
    this.getWindow().setTimeout(goog.bind(function() {
      this.msgSender_.send(goog.net.xpc.SETUP);
      this.sentConnectionSetup_ = true;
      this.waitForAck_ = true;
      goog.net.xpc.logger.fine("SETUP sent")
    }, this), 100)
  }
};
goog.net.xpc.IframePollingTransport.prototype.checkIfConnected_ = function() {
  if(this.sentConnectionSetupAck_ && this.rcvdConnectionSetupAck_) {
    this.channel_.notifyConnected_();
    if(this.deliveryQueue_) {
      goog.net.xpc.logger.fine("delivering queued messages " + "(" + this.deliveryQueue_.length + ")");
      for(var i = 0, m;i < this.deliveryQueue_.length;i++) {
        m = this.deliveryQueue_[i];
        this.channel_.deliver_(m.service, m.payload)
      }
      delete this.deliveryQueue_
    }
  }else {
    goog.net.xpc.logger.finest("checking if connected: " + "ack sent:" + this.sentConnectionSetupAck_ + ", ack rcvd: " + this.rcvdConnectionSetupAck_)
  }
};
goog.net.xpc.IframePollingTransport.prototype.processIncomingMsg = function(raw) {
  goog.net.xpc.logger.finest("msg received: " + raw);
  if(raw == goog.net.xpc.SETUP) {
    if(!this.ackSender_) {
      return
    }
    this.ackSender_.send(goog.net.xpc.SETUP_ACK_);
    goog.net.xpc.logger.finest("SETUP_ACK sent");
    this.sentConnectionSetupAck_ = true;
    this.checkIfConnected_()
  }else {
    if(this.channel_.isConnected() || this.sentConnectionSetupAck_) {
      var pos = raw.indexOf("|");
      var head = raw.substring(0, pos);
      var frame = raw.substring(pos + 1);
      pos = head.indexOf(",");
      if(pos == -1) {
        var seq = head;
        this.ackSender_.send("ACK:" + seq);
        this.deliverPayload_(frame)
      }else {
        var seq = head.substring(0, pos);
        this.ackSender_.send("ACK:" + seq);
        var partInfo = head.substring(pos + 1).split("/");
        var part0 = parseInt(partInfo[0], 10);
        var part1 = parseInt(partInfo[1], 10);
        if(part0 == 1) {
          this.parts_ = []
        }
        this.parts_.push(frame);
        if(part0 == part1) {
          this.deliverPayload_(this.parts_.join(""));
          delete this.parts_
        }
      }
    }else {
      goog.net.xpc.logger.warning("received msg, but channel is not connected")
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.processIncomingAck = function(msgStr) {
  goog.net.xpc.logger.finest("ack received: " + msgStr);
  if(msgStr == goog.net.xpc.SETUP_ACK_) {
    this.waitForAck_ = false;
    this.rcvdConnectionSetupAck_ = true;
    this.checkIfConnected_()
  }else {
    if(this.channel_.isConnected()) {
      if(!this.waitForAck_) {
        goog.net.xpc.logger.warning("got unexpected ack");
        return
      }
      var seq = parseInt(msgStr.split(":")[1], 10);
      if(seq == this.sequence_) {
        this.waitForAck_ = false;
        this.sendNextFrame_()
      }else {
        goog.net.xpc.logger.warning("got ack with wrong sequence")
      }
    }else {
      goog.net.xpc.logger.warning("received ack, but channel not connected")
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.sendNextFrame_ = function() {
  if(this.waitForAck_ || !this.sendQueue_.length) {
    return
  }
  var s = this.sendQueue_.shift();
  ++this.sequence_;
  this.msgSender_.send(this.sequence_ + s);
  goog.net.xpc.logger.finest("msg sent: " + this.sequence_ + s);
  this.waitForAck_ = true
};
goog.net.xpc.IframePollingTransport.prototype.deliverPayload_ = function(s) {
  var pos = s.indexOf(":");
  var service = s.substr(0, pos);
  var payload = s.substring(pos + 1);
  if(!this.channel_.isConnected()) {
    (this.deliveryQueue_ || (this.deliveryQueue_ = [])).push({service:service, payload:payload});
    goog.net.xpc.logger.finest("queued delivery")
  }else {
    this.channel_.deliver_(service, payload)
  }
};
goog.net.xpc.IframePollingTransport.prototype.MAX_FRAME_LENGTH_ = 3800;
goog.net.xpc.IframePollingTransport.prototype.send = function(service, payload) {
  var frame = service + ":" + payload;
  if(!goog.userAgent.IE || payload.length <= this.MAX_FRAME_LENGTH_) {
    this.sendQueue_.push("|" + frame)
  }else {
    var l = payload.length;
    var num = Math.ceil(l / this.MAX_FRAME_LENGTH_);
    var pos = 0;
    var i = 1;
    while(pos < l) {
      this.sendQueue_.push("," + i + "/" + num + "|" + frame.substr(pos, this.MAX_FRAME_LENGTH_));
      i++;
      pos += this.MAX_FRAME_LENGTH_
    }
  }
  this.sendNextFrame_()
};
goog.net.xpc.IframePollingTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  var receivers = goog.net.xpc.IframePollingTransport.receivers_;
  goog.array.remove(receivers, this.msgReceiver_);
  goog.array.remove(receivers, this.ackReceiver_);
  this.msgReceiver_ = this.ackReceiver_ = null;
  goog.dom.removeNode(this.msgIframeElm_);
  goog.dom.removeNode(this.ackIframeElm_);
  this.msgIframeElm_ = this.ackIframeElm_ = null;
  this.msgWinObj_ = this.ackWinObj_ = null
};
goog.net.xpc.IframePollingTransport.receivers_ = [];
goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ = 10;
goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_ = 100;
goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ = 1E3;
goog.net.xpc.IframePollingTransport.receive_ = function() {
  var rcvd = false;
  try {
    for(var i = 0, l = goog.net.xpc.IframePollingTransport.receivers_.length;i < l;i++) {
      rcvd = rcvd || goog.net.xpc.IframePollingTransport.receivers_[i].receive()
    }
  }catch(e) {
    goog.net.xpc.logger.info("receive_() failed: " + e);
    goog.net.xpc.IframePollingTransport.receivers_[i].transport_.channel_.notifyTransportError_();
    if(!goog.net.xpc.IframePollingTransport.receivers_.length) {
      return
    }
  }
  var now = goog.now();
  if(rcvd) {
    goog.net.xpc.IframePollingTransport.lastActivity_ = now
  }
  var t = now - goog.net.xpc.IframePollingTransport.lastActivity_ < goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ ? goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ : goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_;
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(goog.net.xpc.IframePollingTransport.receiveCb_, t)
};
goog.net.xpc.IframePollingTransport.receiveCb_ = goog.bind(goog.net.xpc.IframePollingTransport.receive_, goog.net.xpc.IframePollingTransport);
goog.net.xpc.IframePollingTransport.startRcvTimer_ = function() {
  goog.net.xpc.logger.fine("starting receive-timer");
  goog.net.xpc.IframePollingTransport.lastActivity_ = goog.now();
  if(goog.net.xpc.IframePollingTransport.rcvTimer_) {
    window.clearTimeout(goog.net.xpc.IframePollingTransport.rcvTimer_)
  }
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(goog.net.xpc.IframePollingTransport.receiveCb_, goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_)
};
goog.net.xpc.IframePollingTransport.Sender = function(url, windowObj) {
  this.sendUri_ = url;
  this.sendFrame_ = windowObj;
  this.cycle_ = 0
};
goog.net.xpc.IframePollingTransport.Sender.prototype.send = function(payload) {
  this.cycle_ = ++this.cycle_ % 2;
  var url = this.sendUri_ + "#" + this.cycle_ + encodeURIComponent(payload);
  try {
    if(goog.userAgent.WEBKIT) {
      this.sendFrame_.location.href = url
    }else {
      this.sendFrame_.location.replace(url)
    }
  }catch(e) {
    goog.net.xpc.logger.severe("sending failed", e)
  }
  goog.net.xpc.IframePollingTransport.startRcvTimer_()
};
goog.net.xpc.IframePollingTransport.Receiver = function(transport, windowObj, callback) {
  this.transport_ = transport;
  this.rcvFrame_ = windowObj;
  this.cb_ = callback;
  this.currentLoc_ = this.rcvFrame_.location.href.split("#")[0] + "#INITIAL";
  goog.net.xpc.IframePollingTransport.receivers_.push(this);
  goog.net.xpc.IframePollingTransport.startRcvTimer_()
};
goog.net.xpc.IframePollingTransport.Receiver.prototype.receive = function() {
  var loc = this.rcvFrame_.location.href;
  if(loc != this.currentLoc_) {
    this.currentLoc_ = loc;
    var payload = loc.split("#")[1];
    if(payload) {
      payload = payload.substr(1);
      this.cb_(decodeURIComponent(payload))
    }
    return true
  }else {
    return false
  }
};
goog.provide("goog.net.xpc.IframeRelayTransport");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.Transport");
goog.require("goog.userAgent");
goog.net.xpc.IframeRelayTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.peerRelayUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI];
  this.peerIframeId_ = this.channel_.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  if(goog.userAgent.WEBKIT) {
    goog.net.xpc.IframeRelayTransport.startCleanupTimer_()
  }
};
goog.inherits(goog.net.xpc.IframeRelayTransport, goog.net.xpc.Transport);
if(goog.userAgent.WEBKIT) {
  goog.net.xpc.IframeRelayTransport.iframeRefs_ = [];
  goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_ = 1E3;
  goog.net.xpc.IframeRelayTransport.IFRAME_MAX_AGE_ = 3E3;
  goog.net.xpc.IframeRelayTransport.cleanupTimer_ = 0;
  goog.net.xpc.IframeRelayTransport.startCleanupTimer_ = function() {
    if(!goog.net.xpc.IframeRelayTransport.cleanupTimer_) {
      goog.net.xpc.IframeRelayTransport.cleanupTimer_ = window.setTimeout(function() {
        goog.net.xpc.IframeRelayTransport.cleanup_()
      }, goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_)
    }
  };
  goog.net.xpc.IframeRelayTransport.cleanup_ = function(opt_maxAge) {
    var now = goog.now();
    var maxAge = opt_maxAge || goog.net.xpc.IframeRelayTransport.IFRAME_MAX_AGE_;
    while(goog.net.xpc.IframeRelayTransport.iframeRefs_.length && now - goog.net.xpc.IframeRelayTransport.iframeRefs_[0].timestamp >= maxAge) {
      var ifr = goog.net.xpc.IframeRelayTransport.iframeRefs_.shift().iframeElement;
      goog.dom.removeNode(ifr);
      goog.net.xpc.logger.finest("iframe removed")
    }
    goog.net.xpc.IframeRelayTransport.cleanupTimer_ = window.setTimeout(goog.net.xpc.IframeRelayTransport.cleanupCb_, goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_)
  };
  goog.net.xpc.IframeRelayTransport.cleanupCb_ = function() {
    goog.net.xpc.IframeRelayTransport.cleanup_()
  }
}
goog.net.xpc.IframeRelayTransport.IE_PAYLOAD_MAX_SIZE_ = 1800;
goog.net.xpc.IframeRelayTransport.FragmentInfo;
goog.net.xpc.IframeRelayTransport.fragmentMap_ = {};
goog.net.xpc.IframeRelayTransport.prototype.transportType = goog.net.xpc.TransportTypes.IFRAME_RELAY;
goog.net.xpc.IframeRelayTransport.prototype.connect = function() {
  if(!this.getWindow()["xpcRelay"]) {
    this.getWindow()["xpcRelay"] = goog.net.xpc.IframeRelayTransport.receiveMessage_
  }
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP)
};
goog.net.xpc.IframeRelayTransport.receiveMessage_ = function(channelName, frame) {
  var pos = frame.indexOf(":");
  var header = frame.substr(0, pos);
  var payload = frame.substr(pos + 1);
  if(!goog.userAgent.IE || (pos = header.indexOf("|")) == -1) {
    var service = header
  }else {
    var service = header.substr(0, pos);
    var fragmentIdStr = header.substr(pos + 1);
    pos = fragmentIdStr.indexOf("+");
    var messageIdStr = fragmentIdStr.substr(0, pos);
    var fragmentNum = parseInt(fragmentIdStr.substr(pos + 1), 10);
    var fragmentInfo = goog.net.xpc.IframeRelayTransport.fragmentMap_[messageIdStr];
    if(!fragmentInfo) {
      fragmentInfo = goog.net.xpc.IframeRelayTransport.fragmentMap_[messageIdStr] = {fragments:[], received:0, expected:0}
    }
    if(goog.string.contains(fragmentIdStr, "++")) {
      fragmentInfo.expected = fragmentNum + 1
    }
    fragmentInfo.fragments[fragmentNum] = payload;
    fragmentInfo.received++;
    if(fragmentInfo.received != fragmentInfo.expected) {
      return
    }
    payload = fragmentInfo.fragments.join("");
    delete goog.net.xpc.IframeRelayTransport.fragmentMap_[messageIdStr]
  }
  goog.net.xpc.channels_[channelName].deliver_(service, decodeURIComponent(payload))
};
goog.net.xpc.IframeRelayTransport.prototype.transportServiceHandler = function(payload) {
  if(payload == goog.net.xpc.SETUP) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
    this.channel_.notifyConnected_()
  }else {
    if(payload == goog.net.xpc.SETUP_ACK_) {
      this.channel_.notifyConnected_()
    }
  }
};
goog.net.xpc.IframeRelayTransport.prototype.send = function(service, payload) {
  var encodedPayload = encodeURIComponent(payload);
  var encodedLen = encodedPayload.length;
  var maxSize = goog.net.xpc.IframeRelayTransport.IE_PAYLOAD_MAX_SIZE_;
  if(goog.userAgent.IE && encodedLen > maxSize) {
    var messageIdStr = goog.string.getRandomString();
    for(var startIndex = 0, fragmentNum = 0;startIndex < encodedLen;fragmentNum++) {
      var payloadFragment = encodedPayload.substr(startIndex, maxSize);
      startIndex += maxSize;
      var fragmentIdStr = messageIdStr + (startIndex >= encodedLen ? "++" : "+") + fragmentNum;
      this.send_(service, payloadFragment, fragmentIdStr)
    }
  }else {
    this.send_(service, encodedPayload)
  }
};
goog.net.xpc.IframeRelayTransport.prototype.send_ = function(service, encodedPayload, opt_fragmentIdStr) {
  if(goog.userAgent.IE) {
    var div = this.getWindow().document.createElement("div");
    div.innerHTML = '<iframe onload="this.xpcOnload()"></iframe>';
    var ifr = div.childNodes[0];
    div = null;
    ifr["xpcOnload"] = goog.net.xpc.IframeRelayTransport.iframeLoadHandler_
  }else {
    var ifr = this.getWindow().document.createElement("iframe");
    if(goog.userAgent.WEBKIT) {
      goog.net.xpc.IframeRelayTransport.iframeRefs_.push({timestamp:goog.now(), iframeElement:ifr})
    }else {
      goog.events.listen(ifr, "load", goog.net.xpc.IframeRelayTransport.iframeLoadHandler_)
    }
  }
  var style = ifr.style;
  style.visibility = "hidden";
  style.width = ifr.style.height = "0px";
  style.position = "absolute";
  var url = this.peerRelayUri_;
  url += "#" + this.channel_.name;
  if(this.peerIframeId_) {
    url += "," + this.peerIframeId_
  }
  url += "|" + service;
  if(opt_fragmentIdStr) {
    url += "|" + opt_fragmentIdStr
  }
  url += ":" + encodedPayload;
  ifr.src = url;
  this.getWindow().document.body.appendChild(ifr);
  goog.net.xpc.logger.finest("msg sent: " + url)
};
goog.net.xpc.IframeRelayTransport.iframeLoadHandler_ = function() {
  goog.net.xpc.logger.finest("iframe-load");
  goog.dom.removeNode(this);
  this.xpcOnload = null
};
goog.net.xpc.IframeRelayTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  if(goog.userAgent.WEBKIT) {
    goog.net.xpc.IframeRelayTransport.cleanup_(0)
  }
};
goog.provide("goog.net.xpc.NativeMessagingTransport");
goog.require("goog.events");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.Transport");
goog.net.xpc.NativeMessagingTransport = function(channel, peerHostname, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.peerHostname_ = peerHostname || "*"
};
goog.inherits(goog.net.xpc.NativeMessagingTransport, goog.net.xpc.Transport);
goog.net.xpc.NativeMessagingTransport.prototype.initialized_ = false;
goog.net.xpc.NativeMessagingTransport.prototype.transportType = goog.net.xpc.TransportTypes.NATIVE_MESSAGING;
goog.net.xpc.NativeMessagingTransport.activeCount_ = {};
goog.net.xpc.NativeMessagingTransport.initialize_ = function(listenWindow) {
  var uid = goog.getUid(listenWindow);
  var value = goog.net.xpc.NativeMessagingTransport.activeCount_[uid];
  if(!goog.isNumber(value)) {
    value = 0
  }
  if(value == 0) {
    goog.events.listen(listenWindow.postMessage ? listenWindow : listenWindow.document, "message", goog.net.xpc.NativeMessagingTransport.messageReceived_, false, goog.net.xpc.NativeMessagingTransport)
  }
  goog.net.xpc.NativeMessagingTransport.activeCount_[uid] = value + 1
};
goog.net.xpc.NativeMessagingTransport.messageReceived_ = function(msgEvt) {
  var data = msgEvt.getBrowserEvent().data;
  var headDelim = data.indexOf("|");
  var serviceDelim = data.indexOf(":");
  if(headDelim == -1 || serviceDelim == -1) {
    return false
  }
  var channelName = data.substring(0, headDelim);
  var service = data.substring(headDelim + 1, serviceDelim);
  var payload = data.substring(serviceDelim + 1);
  goog.net.xpc.logger.fine("messageReceived: channel=" + channelName + ", service=" + service + ", payload=" + payload);
  var channel = goog.net.xpc.channels_[channelName];
  if(channel) {
    channel.deliver_(service, payload, msgEvt.getBrowserEvent().origin);
    return true
  }
  for(var staleChannelName in goog.net.xpc.channels_) {
    var staleChannel = goog.net.xpc.channels_[staleChannelName];
    if(staleChannel.getRole() == goog.net.xpc.CrossPageChannel.Role.INNER && !staleChannel.isConnected() && service == goog.net.xpc.TRANSPORT_SERVICE_ && payload == goog.net.xpc.SETUP) {
      goog.net.xpc.logger.fine("changing channel name to " + channelName);
      staleChannel.name = channelName;
      delete goog.net.xpc.channels_[staleChannelName];
      goog.net.xpc.channels_[channelName] = staleChannel;
      staleChannel.deliver_(service, payload);
      return true
    }
  }
  goog.net.xpc.logger.info('channel name mismatch; message ignored"');
  return false
};
goog.net.xpc.NativeMessagingTransport.prototype.transportServiceHandler = function(payload) {
  switch(payload) {
    case goog.net.xpc.SETUP:
      this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
      break;
    case goog.net.xpc.SETUP_ACK_:
      this.channel_.notifyConnected_();
      break
  }
};
goog.net.xpc.NativeMessagingTransport.prototype.connect = function() {
  goog.net.xpc.NativeMessagingTransport.initialize_(this.getWindow());
  this.initialized_ = true;
  this.connectWithRetries_()
};
goog.net.xpc.NativeMessagingTransport.prototype.connectWithRetries_ = function() {
  if(this.channel_.isConnected() || this.isDisposed()) {
    return
  }
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP);
  this.getWindow().setTimeout(goog.bind(this.connectWithRetries_, this), 100)
};
goog.net.xpc.NativeMessagingTransport.prototype.send = function(service, payload) {
  var win = this.channel_.peerWindowObject_;
  if(!win) {
    goog.net.xpc.logger.fine("send(): window not ready");
    return
  }
  var obj = win.postMessage ? win : win.document;
  this.send = function(service, payload) {
    goog.net.xpc.logger.fine("send(): payload=" + payload + " to hostname=" + this.peerHostname_);
    obj.postMessage(this.channel_.name + "|" + service + ":" + payload, this.peerHostname_)
  };
  this.send(service, payload)
};
goog.net.xpc.NativeMessagingTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  if(this.initialized_) {
    var listenWindow = this.getWindow();
    var uid = goog.getUid(listenWindow);
    var value = goog.net.xpc.NativeMessagingTransport.activeCount_[uid];
    goog.net.xpc.NativeMessagingTransport.activeCount_[uid] = value - 1;
    if(value == 1) {
      goog.events.unlisten(listenWindow.postMessage ? listenWindow : listenWindow.document, "message", goog.net.xpc.NativeMessagingTransport.messageReceived_, false, goog.net.xpc.NativeMessagingTransport)
    }
  }
};
goog.provide("goog.net.xpc.NixTransport");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.Transport");
goog.net.xpc.NixTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.authToken_ = channel[goog.net.xpc.CfgFields.AUTH_TOKEN] || "";
  this.remoteAuthToken_ = channel[goog.net.xpc.CfgFields.REMOTE_AUTH_TOKEN] || "";
  goog.net.xpc.NixTransport.conductGlobalSetup_(this.getWindow());
  this[goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE] = this.handleMessage_;
  this[goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL] = this.createChannel_
};
goog.inherits(goog.net.xpc.NixTransport, goog.net.xpc.Transport);
goog.net.xpc.NixTransport.NIX_WRAPPER = "GCXPC____NIXVBS_wrapper";
goog.net.xpc.NixTransport.NIX_GET_WRAPPER = "GCXPC____NIXVBS_get_wrapper";
goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE = "GCXPC____NIXJS_handle_message";
goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL = "GCXPC____NIXJS_create_channel";
goog.net.xpc.NixTransport.NIX_ID_FIELD = "GCXPC____NIXVBS_container";
goog.net.xpc.NixTransport.conductGlobalSetup_ = function(listenWindow) {
  if(listenWindow["nix_setup_complete"]) {
    return
  }
  var vbscript = "Class " + goog.net.xpc.NixTransport.NIX_WRAPPER + "\n " + "Private m_Transport\n" + "Private m_Auth\n" + "Public Sub SetTransport(transport)\n" + "If isEmpty(m_Transport) Then\n" + "Set m_Transport = transport\n" + "End If\n" + "End Sub\n" + "Public Sub SetAuth(auth)\n" + "If isEmpty(m_Auth) Then\n" + "m_Auth = auth\n" + "End If\n" + "End Sub\n" + "Public Function GetAuthToken()\n " + "GetAuthToken = m_Auth\n" + "End Function\n" + "Public Sub SendMessage(service, payload)\n " + 
  "Call m_Transport." + goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE + "(service, payload)\n" + "End Sub\n" + "Public Sub CreateChannel(channel)\n " + "Call m_Transport." + goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL + "(channel)\n" + "End Sub\n" + "Public Sub " + goog.net.xpc.NixTransport.NIX_ID_FIELD + "()\n " + "End Sub\n" + "End Class\n " + "Function " + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + "(transport, auth)\n" + "Dim wrap\n" + "Set wrap = New " + goog.net.xpc.NixTransport.NIX_WRAPPER + 
  "\n" + "wrap.SetTransport transport\n" + "wrap.SetAuth auth\n" + "Set " + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + " = wrap\n" + "End Function";
  try {
    listenWindow.execScript(vbscript, "vbscript");
    listenWindow["nix_setup_complete"] = true
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting global setup: " + e)
  }
};
goog.net.xpc.NixTransport.prototype.transportType = goog.net.xpc.TransportTypes.NIX;
goog.net.xpc.NixTransport.prototype.localSetupCompleted_ = false;
goog.net.xpc.NixTransport.prototype.nixChannel_ = null;
goog.net.xpc.NixTransport.prototype.connect = function() {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannel.Role.OUTER) {
    this.attemptOuterSetup_()
  }else {
    this.attemptInnerSetup_()
  }
};
goog.net.xpc.NixTransport.prototype.attemptOuterSetup_ = function() {
  if(this.localSetupCompleted_) {
    return
  }
  var innerFrame = this.channel_.iframeElement_;
  try {
    innerFrame.contentWindow.opener = this.getWindow()[goog.net.xpc.NixTransport.NIX_GET_WRAPPER](this, this.authToken_);
    this.localSetupCompleted_ = true
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + e)
  }
  if(!this.localSetupCompleted_) {
    this.getWindow().setTimeout(goog.bind(this.attemptOuterSetup_, this), 100)
  }
};
goog.net.xpc.NixTransport.prototype.attemptInnerSetup_ = function() {
  if(this.localSetupCompleted_) {
    return
  }
  try {
    var opener = this.getWindow().opener;
    if(opener && goog.net.xpc.NixTransport.NIX_ID_FIELD in opener) {
      this.nixChannel_ = opener;
      var remoteAuthToken = this.nixChannel_["GetAuthToken"]();
      if(remoteAuthToken != this.remoteAuthToken_) {
        goog.net.xpc.logger.severe("Invalid auth token from other party");
        return
      }
      this.nixChannel_["CreateChannel"](this.getWindow()[goog.net.xpc.NixTransport.NIX_GET_WRAPPER](this, this.authToken_));
      this.localSetupCompleted_ = true;
      this.channel_.notifyConnected_()
    }
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + e);
    return
  }
  if(!this.localSetupCompleted_) {
    this.getWindow().setTimeout(goog.bind(this.attemptInnerSetup_, this), 100)
  }
};
goog.net.xpc.NixTransport.prototype.createChannel_ = function(channel) {
  if(typeof channel != "unknown" || !(goog.net.xpc.NixTransport.NIX_ID_FIELD in channel)) {
    goog.net.xpc.logger.severe("Invalid NIX channel given to createChannel_")
  }
  this.nixChannel_ = channel;
  var remoteAuthToken = this.nixChannel_["GetAuthToken"]();
  if(remoteAuthToken != this.remoteAuthToken_) {
    goog.net.xpc.logger.severe("Invalid auth token from other party");
    return
  }
  this.channel_.notifyConnected_()
};
goog.net.xpc.NixTransport.prototype.handleMessage_ = function(serviceName, payload) {
  function deliveryHandler() {
    this.channel_.deliver_(serviceName, payload)
  }
  this.getWindow().setTimeout(goog.bind(deliveryHandler, this), 1)
};
goog.net.xpc.NixTransport.prototype.send = function(service, payload) {
  if(typeof this.nixChannel_ !== "unknown") {
    goog.net.xpc.logger.severe("NIX channel not connected")
  }
  this.nixChannel_["SendMessage"](service, payload)
};
goog.net.xpc.NixTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  this.nixChannel_ = null
};
goog.provide("goog.net.xpc.CrossPageChannel");
goog.provide("goog.net.xpc.CrossPageChannel.Role");
goog.require("goog.Disposable");
goog.require("goog.Uri");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.json");
goog.require("goog.messaging.AbstractChannel");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.FrameElementMethodTransport");
goog.require("goog.net.xpc.IframePollingTransport");
goog.require("goog.net.xpc.IframeRelayTransport");
goog.require("goog.net.xpc.NativeMessagingTransport");
goog.require("goog.net.xpc.NixTransport");
goog.require("goog.net.xpc.Transport");
goog.require("goog.userAgent");
goog.net.xpc.CrossPageChannel = function(cfg, opt_domHelper) {
  goog.base(this);
  for(var i = 0, uriField;uriField = goog.net.xpc.UriCfgFields[i];i++) {
    if(uriField in cfg && !/^https?:\/\//.test(cfg[uriField])) {
      throw Error("URI " + cfg[uriField] + " is invalid for field " + uriField);
    }
  }
  this.cfg_ = cfg;
  this.name = this.cfg_[goog.net.xpc.CfgFields.CHANNEL_NAME] || goog.net.xpc.getRandomString(10);
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
  goog.net.xpc.channels_[this.name] = this;
  goog.events.listen(window, "unload", goog.net.xpc.CrossPageChannel.disposeAll_);
  goog.net.xpc.logger.info("CrossPageChannel created: " + this.name)
};
goog.inherits(goog.net.xpc.CrossPageChannel, goog.messaging.AbstractChannel);
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_ = new RegExp("^%*" + goog.net.xpc.TRANSPORT_SERVICE_ + "$");
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_ = new RegExp("^%+" + goog.net.xpc.TRANSPORT_SERVICE_ + "$");
goog.net.xpc.CrossPageChannel.prototype.transport_ = null;
goog.net.xpc.CrossPageChannel.prototype.state_ = goog.net.xpc.ChannelStates.NOT_CONNECTED;
goog.net.xpc.CrossPageChannel.prototype.isConnected = function() {
  return this.state_ == goog.net.xpc.ChannelStates.CONNECTED
};
goog.net.xpc.CrossPageChannel.prototype.peerWindowObject_ = null;
goog.net.xpc.CrossPageChannel.prototype.iframeElement_ = null;
goog.net.xpc.CrossPageChannel.prototype.setPeerWindowObject = function(peerWindowObject) {
  this.peerWindowObject_ = peerWindowObject
};
goog.net.xpc.CrossPageChannel.prototype.determineTransportType_ = function() {
  var transportType;
  if(goog.isFunction(document.postMessage) || goog.isFunction(window.postMessage) || goog.userAgent.IE && window.postMessage) {
    transportType = goog.net.xpc.TransportTypes.NATIVE_MESSAGING
  }else {
    if(goog.userAgent.GECKO) {
      transportType = goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD
    }else {
      if(goog.userAgent.IE && this.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI]) {
        transportType = goog.net.xpc.TransportTypes.IFRAME_RELAY
      }else {
        if(goog.userAgent.IE) {
          transportType = goog.net.xpc.TransportTypes.NIX
        }else {
          if(this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI] && this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]) {
            transportType = goog.net.xpc.TransportTypes.IFRAME_POLLING
          }
        }
      }
    }
  }
  return transportType
};
goog.net.xpc.CrossPageChannel.prototype.createTransport_ = function() {
  if(this.transport_) {
    return
  }
  if(!this.cfg_[goog.net.xpc.CfgFields.TRANSPORT]) {
    this.cfg_[goog.net.xpc.CfgFields.TRANSPORT] = this.determineTransportType_()
  }
  switch(this.cfg_[goog.net.xpc.CfgFields.TRANSPORT]) {
    case goog.net.xpc.TransportTypes.NATIVE_MESSAGING:
      this.transport_ = new goog.net.xpc.NativeMessagingTransport(this, this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME], this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.NIX:
      this.transport_ = new goog.net.xpc.NixTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD:
      this.transport_ = new goog.net.xpc.FrameElementMethodTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.IFRAME_RELAY:
      this.transport_ = new goog.net.xpc.IframeRelayTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.IFRAME_POLLING:
      this.transport_ = new goog.net.xpc.IframePollingTransport(this, this.domHelper_);
      break
  }
  if(this.transport_) {
    goog.net.xpc.logger.info("Transport created: " + this.transport_.getName())
  }else {
    throw Error("CrossPageChannel: No suitable transport found!");
  }
};
goog.net.xpc.CrossPageChannel.prototype.getTransportType = function() {
  return this.transport_.getType()
};
goog.net.xpc.CrossPageChannel.prototype.getTransportName = function() {
  return this.transport_.getName()
};
goog.net.xpc.CrossPageChannel.prototype.getPeerConfiguration = function() {
  var peerCfg = {};
  peerCfg[goog.net.xpc.CfgFields.CHANNEL_NAME] = this.name;
  peerCfg[goog.net.xpc.CfgFields.TRANSPORT] = this.cfg_[goog.net.xpc.CfgFields.TRANSPORT];
  if(this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI]) {
    peerCfg[goog.net.xpc.CfgFields.PEER_RELAY_URI] = this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI]
  }
  if(this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI]) {
    peerCfg[goog.net.xpc.CfgFields.PEER_POLL_URI] = this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI]
  }
  if(this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]) {
    peerCfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]
  }
  return peerCfg
};
goog.net.xpc.CrossPageChannel.prototype.createPeerIframe = function(parentElm, opt_configureIframeCb, opt_addCfgParam) {
  var iframeId = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  if(!iframeId) {
    iframeId = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID] = "xpcpeer" + goog.net.xpc.getRandomString(4)
  }
  var iframeElm = goog.dom.createElement("IFRAME");
  iframeElm.id = iframeElm.name = iframeId;
  if(opt_configureIframeCb) {
    opt_configureIframeCb(iframeElm)
  }else {
    iframeElm.style.width = iframeElm.style.height = "100%"
  }
  var peerUri = this.cfg_[goog.net.xpc.CfgFields.PEER_URI];
  if(goog.isString(peerUri)) {
    peerUri = this.cfg_[goog.net.xpc.CfgFields.PEER_URI] = new goog.Uri(peerUri)
  }
  if(opt_addCfgParam !== false) {
    peerUri.setParameterValue("xpc", goog.json.serialize(this.getPeerConfiguration()))
  }
  if(goog.userAgent.GECKO || goog.userAgent.WEBKIT) {
    this.deferConnect_ = true;
    window.setTimeout(goog.bind(function() {
      this.deferConnect_ = false;
      parentElm.appendChild(iframeElm);
      iframeElm.src = peerUri.toString();
      goog.net.xpc.logger.info("peer iframe created (" + iframeId + ")");
      if(this.connectDeferred_) {
        this.connect(this.connectCb_)
      }
    }, this), 1)
  }else {
    iframeElm.src = peerUri.toString();
    parentElm.appendChild(iframeElm);
    goog.net.xpc.logger.info("peer iframe created (" + iframeId + ")")
  }
  return iframeElm
};
goog.net.xpc.CrossPageChannel.prototype.deferConnect_ = false;
goog.net.xpc.CrossPageChannel.prototype.connectDeferred_ = false;
goog.net.xpc.CrossPageChannel.prototype.connect = function(opt_connectCb) {
  this.connectCb_ = opt_connectCb || goog.nullFunction;
  if(this.deferConnect_) {
    goog.net.xpc.logger.info("connect() deferred");
    this.connectDeferred_ = true;
    return
  }
  goog.net.xpc.logger.info("connect()");
  if(this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]) {
    this.iframeElement_ = this.domHelper_.getElement(this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID])
  }
  if(this.iframeElement_) {
    var winObj = this.iframeElement_.contentWindow;
    if(!winObj) {
      winObj = window.frames[this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]]
    }
    this.setPeerWindowObject(winObj)
  }
  if(!this.peerWindowObject_) {
    if(window == top) {
      throw Error("CrossPageChannel: Can't connect, peer window-object not set.");
    }else {
      this.setPeerWindowObject(window.parent)
    }
  }
  this.createTransport_();
  this.transport_.connect()
};
goog.net.xpc.CrossPageChannel.prototype.close = function() {
  if(!this.isConnected()) {
    return
  }
  this.state_ = goog.net.xpc.ChannelStates.CLOSED;
  this.transport_.dispose();
  this.transport_ = null;
  goog.net.xpc.logger.info('Channel "' + this.name + '" closed')
};
goog.net.xpc.CrossPageChannel.prototype.notifyConnected_ = function() {
  if(this.isConnected()) {
    return
  }
  this.state_ = goog.net.xpc.ChannelStates.CONNECTED;
  goog.net.xpc.logger.info('Channel "' + this.name + '" connected');
  this.connectCb_()
};
goog.net.xpc.CrossPageChannel.prototype.notifyTransportError_ = function() {
  goog.net.xpc.logger.info("Transport Error");
  this.close()
};
goog.net.xpc.CrossPageChannel.prototype.send = function(serviceName, payload) {
  if(!this.isConnected()) {
    goog.net.xpc.logger.severe("Can't send. Channel not connected.");
    return
  }
  if(this.peerWindowObject_.closed) {
    goog.net.xpc.logger.severe("Peer has disappeared.");
    this.close();
    return
  }
  if(goog.isObject(payload)) {
    payload = goog.json.serialize(payload)
  }
  this.transport_.send(this.escapeServiceName_(serviceName), payload)
};
goog.net.xpc.CrossPageChannel.prototype.deliver_ = function(serviceName, payload, opt_origin) {
  if(!this.isMessageOriginAcceptable_(opt_origin)) {
    goog.net.xpc.logger.warning('Message received from unapproved origin "' + opt_origin + '" - rejected.');
    return
  }
  if(this.isDisposed()) {
    goog.net.xpc.logger.warning("CrossPageChannel::deliver_(): Disposed.")
  }else {
    if(!serviceName || serviceName == goog.net.xpc.TRANSPORT_SERVICE_) {
      this.transport_.transportServiceHandler(payload)
    }else {
      if(this.isConnected()) {
        this.deliver(this.unescapeServiceName_(serviceName), payload)
      }else {
        goog.net.xpc.logger.info("CrossPageChannel::deliver_(): Not connected.")
      }
    }
  }
};
goog.net.xpc.CrossPageChannel.prototype.escapeServiceName_ = function(name) {
  if(goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_.test(name)) {
    name = "%" + name
  }
  return name.replace(/[%:|]/g, encodeURIComponent)
};
goog.net.xpc.CrossPageChannel.prototype.unescapeServiceName_ = function(name) {
  name = name.replace(/%[0-9a-f]{2}/gi, decodeURIComponent);
  if(goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_.test(name)) {
    return name.substring(1)
  }else {
    return name
  }
};
goog.net.xpc.CrossPageChannel.Role = {OUTER:0, INNER:1};
goog.net.xpc.CrossPageChannel.prototype.getRole = function() {
  return window.parent == this.peerWindowObject_ ? goog.net.xpc.CrossPageChannel.Role.INNER : goog.net.xpc.CrossPageChannel.Role.OUTER
};
goog.net.xpc.CrossPageChannel.prototype.isMessageOriginAcceptable_ = function(opt_origin) {
  var peerHostname = this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME];
  return goog.string.isEmptySafe(opt_origin) || goog.string.isEmptySafe(peerHostname) || opt_origin == this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME]
};
goog.net.xpc.CrossPageChannel.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  this.close();
  this.peerWindowObject_ = null;
  this.iframeElement_ = null;
  delete goog.net.xpc.channels_[this.name]
};
goog.net.xpc.CrossPageChannel.disposeAll_ = function() {
  for(var name in goog.net.xpc.channels_) {
    var ch = goog.net.xpc.channels_[name];
    if(ch) {
      ch.dispose()
    }
  }
};
goog.provide("goog.net.EventType");
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
goog.provide("goog.Timer");
goog.require("goog.events.EventTarget");
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global["window"];
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_
};
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if(this.timer_ && this.enabled) {
    this.stop();
    this.start()
  }else {
    if(this.timer_) {
      this.stop()
    }
  }
};
goog.Timer.prototype.tick_ = function() {
  if(this.enabled) {
    var elapsed = goog.now() - this.last_;
    if(elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed);
      return
    }
    this.dispatchTick();
    if(this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = goog.now()
    }
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
  this.enabled = true;
  if(!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now()
  }
};
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if(this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null
  }
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if(goog.isFunction(listener)) {
    if(opt_handler) {
      listener = goog.bind(listener, opt_handler)
    }
  }else {
    if(listener && typeof listener.handleEvent == "function") {
      listener = goog.bind(listener.handleEvent, listener)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  if(opt_delay > goog.Timer.MAX_TIMEOUT_) {
    return-1
  }else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0)
  }
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId)
};
goog.provide("goog.net.ErrorCode");
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch(errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return"No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return"Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return"File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return"Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return"Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return"An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return"Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return"Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return"Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return"The resource is not available offline";
    default:
      return"Unrecognized error code"
  }
};
goog.provide("goog.net.HttpStatus");
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505};
goog.provide("goog.net.XmlHttpFactory");
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.createInstance = goog.abstractMethod;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions())
};
goog.net.XmlHttpFactory.prototype.internalGetOptions = goog.abstractMethod;
goog.provide("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XmlHttpFactory");
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = xhrFactory;
  this.optionsFactory_ = optionsFactory
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_()
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_()
};
goog.provide("goog.net.DefaultXmlHttpFactory");
goog.provide("goog.net.XmlHttp");
goog.provide("goog.net.XmlHttp.OptionType");
goog.provide("goog.net.XmlHttp.ReadyState");
goog.require("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XmlHttpFactory");
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance()
};
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions()
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.factory_;
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(factory, optionsFactory))
};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this)
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  if(progId) {
    return new ActiveXObject(progId)
  }else {
    return new XMLHttpRequest
  }
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_();
  var options = {};
  if(progId) {
    options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = true;
    options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = true
  }
  return options
};
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_ = null;
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if(!this.ieProgId_ && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    var ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    for(var i = 0;i < ACTIVE_X_IDENTS.length;i++) {
      var candidate = ACTIVE_X_IDENTS[i];
      try {
        new ActiveXObject(candidate);
        this.ieProgId_ = candidate;
        return candidate
      }catch(e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled," + " or MSXML might not be installed");
  }
  return this.ieProgId_
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.provide("goog.net.xhrMonitor");
goog.require("goog.array");
goog.require("goog.debug.Logger");
goog.require("goog.userAgent");
goog.net.XhrMonitor_ = function() {
  if(!goog.userAgent.GECKO) {
    return
  }
  this.contextsToXhr_ = {};
  this.xhrToContexts_ = {};
  this.stack_ = []
};
goog.net.XhrMonitor_.getKey = function(obj) {
  return goog.isString(obj) ? obj : goog.isObject(obj) ? goog.getUid(obj) : ""
};
goog.net.XhrMonitor_.prototype.logger_ = goog.debug.Logger.getLogger("goog.net.xhrMonitor");
goog.net.XhrMonitor_.prototype.enabled_ = goog.userAgent.GECKO;
goog.net.XhrMonitor_.prototype.setEnabled = function(val) {
  this.enabled_ = goog.userAgent.GECKO && val
};
goog.net.XhrMonitor_.prototype.pushContext = function(context) {
  if(!this.enabled_) {
    return
  }
  var key = goog.net.XhrMonitor_.getKey(context);
  this.logger_.finest("Pushing context: " + context + " (" + key + ")");
  this.stack_.push(key)
};
goog.net.XhrMonitor_.prototype.popContext = function() {
  if(!this.enabled_) {
    return
  }
  var context = this.stack_.pop();
  this.logger_.finest("Popping context: " + context);
  this.updateDependentContexts_(context)
};
goog.net.XhrMonitor_.prototype.isContextSafe = function(context) {
  if(!this.enabled_) {
    return true
  }
  var deps = this.contextsToXhr_[goog.net.XhrMonitor_.getKey(context)];
  this.logger_.fine("Context is safe : " + context + " - " + deps);
  return!deps
};
goog.net.XhrMonitor_.prototype.markXhrOpen = function(xhr) {
  if(!this.enabled_) {
    return
  }
  var uid = goog.getUid(xhr);
  this.logger_.fine("Opening XHR : " + uid);
  for(var i = 0;i < this.stack_.length;i++) {
    var context = this.stack_[i];
    this.addToMap_(this.contextsToXhr_, context, uid);
    this.addToMap_(this.xhrToContexts_, uid, context)
  }
};
goog.net.XhrMonitor_.prototype.markXhrClosed = function(xhr) {
  if(!this.enabled_) {
    return
  }
  var uid = goog.getUid(xhr);
  this.logger_.fine("Closing XHR : " + uid);
  delete this.xhrToContexts_[uid];
  for(var context in this.contextsToXhr_) {
    goog.array.remove(this.contextsToXhr_[context], uid);
    if(this.contextsToXhr_[context].length == 0) {
      delete this.contextsToXhr_[context]
    }
  }
};
goog.net.XhrMonitor_.prototype.updateDependentContexts_ = function(xhrUid) {
  var contexts = this.xhrToContexts_[xhrUid];
  var xhrs = this.contextsToXhr_[xhrUid];
  if(contexts && xhrs) {
    this.logger_.finest("Updating dependent contexts");
    goog.array.forEach(contexts, function(context) {
      goog.array.forEach(xhrs, function(xhr) {
        this.addToMap_(this.contextsToXhr_, context, xhr);
        this.addToMap_(this.xhrToContexts_, xhr, context)
      }, this)
    }, this)
  }
};
goog.net.XhrMonitor_.prototype.addToMap_ = function(map, key, value) {
  if(!map[key]) {
    map[key] = []
  }
  if(!goog.array.contains(map[key], value)) {
    map[key].push(value)
  }
};
goog.net.xhrMonitor = new goog.net.XhrMonitor_;
goog.provide("goog.net.XhrIo");
goog.provide("goog.net.XhrIo.ResponseType");
goog.require("goog.Timer");
goog.require("goog.debug.Logger");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.debug.errorHandlerWeakDep");
goog.require("goog.events.EventTarget");
goog.require("goog.json");
goog.require("goog.net.ErrorCode");
goog.require("goog.net.EventType");
goog.require("goog.net.HttpStatus");
goog.require("goog.net.XmlHttp");
goog.require("goog.net.xhrMonitor");
goog.require("goog.object");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.events.EventTarget.call(this);
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.debug.Logger.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?:?$/i;
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval) {
  var x = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(x);
  if(opt_callback) {
    goog.events.listen(x, goog.net.EventType.COMPLETE, opt_callback)
  }
  goog.events.listen(x, goog.net.EventType.READY, goog.partial(goog.net.XhrIo.cleanupSend_, x));
  if(opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval)
  }
  x.send(url, opt_method, opt_content, opt_headers)
};
goog.net.XhrIo.cleanup = function() {
  var instances = goog.net.XhrIo.sendInstances_;
  while(instances.length) {
    instances.pop().dispose()
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
};
goog.net.XhrIo.cleanupSend_ = function(XhrIo) {
  XhrIo.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, XhrIo)
};
goog.net.XhrIo.prototype.active_ = false;
goog.net.XhrIo.prototype.xhr_ = null;
goog.net.XhrIo.prototype.xhrOptions_ = null;
goog.net.XhrIo.prototype.lastUri_ = "";
goog.net.XhrIo.prototype.lastMethod_ = "";
goog.net.XhrIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
goog.net.XhrIo.prototype.lastError_ = "";
goog.net.XhrIo.prototype.errorDispatched_ = false;
goog.net.XhrIo.prototype.inSend_ = false;
goog.net.XhrIo.prototype.inOpen_ = false;
goog.net.XhrIo.prototype.inAbort_ = false;
goog.net.XhrIo.prototype.timeoutInterval_ = 0;
goog.net.XhrIo.prototype.timeoutId_ = null;
goog.net.XhrIo.prototype.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
goog.net.XhrIo.prototype.withCredentials_ = false;
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms)
};
goog.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type
};
goog.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials
};
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if(this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request");
  }
  var method = opt_method || "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = false;
  this.active_ = true;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  goog.net.xhrMonitor.markXhrOpen(this.xhr_);
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    this.logger_.fine(this.formatMsg_("Opening Xhr"));
    this.inOpen_ = true;
    this.xhr_.open(method, url, true);
    this.inOpen_ = false
  }catch(err) {
    this.logger_.fine(this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return
  }
  var content = opt_content || "";
  var headers = this.headers.clone();
  if(opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers.set(key, value)
    })
  }
  if(method == "POST" && !headers.containsKey(goog.net.XhrIo.CONTENT_TYPE_HEADER)) {
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE)
  }
  goog.structs.forEach(headers, function(value, key) {
    this.xhr_.setRequestHeader(key, value)
  }, this);
  if(this.responseType_) {
    this.xhr_.responseType = this.responseType_
  }
  if(goog.object.containsKey(this.xhr_, "withCredentials")) {
    this.xhr_.withCredentials = this.withCredentials_
  }
  try {
    if(this.timeoutId_) {
      goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_);
      this.timeoutId_ = null
    }
    if(this.timeoutInterval_ > 0) {
      this.logger_.fine(this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete"));
      this.timeoutId_ = goog.Timer.defaultTimerObject.setTimeout(goog.bind(this.timeout_, this), this.timeoutInterval_)
    }
    this.logger_.fine(this.formatMsg_("Sending request"));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false
  }catch(err) {
    this.logger_.fine(this.formatMsg_("Send error: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err)
  }
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : new goog.net.XmlHttp
};
goog.net.XhrIo.prototype.dispatchEvent = function(e) {
  if(this.xhr_) {
    goog.net.xhrMonitor.pushContext(this.xhr_);
    try {
      return goog.net.XhrIo.superClass_.dispatchEvent.call(this, e)
    }finally {
      goog.net.xhrMonitor.popContext()
    }
  }else {
    return goog.net.XhrIo.superClass_.dispatchEvent.call(this, e)
  }
};
goog.net.XhrIo.prototype.timeout_ = function() {
  if(typeof goog == "undefined") {
  }else {
    if(this.xhr_) {
      this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting";
      this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
      this.logger_.fine(this.formatMsg_(this.lastError_));
      this.dispatchEvent(goog.net.EventType.TIMEOUT);
      this.abort(goog.net.ErrorCode.TIMEOUT)
    }
  }
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = false;
  if(this.xhr_) {
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false
  }
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_()
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  if(!this.errorDispatched_) {
    this.errorDispatched_ = true;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR)
  }
};
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if(this.xhr_ && this.active_) {
    this.logger_.fine(this.formatMsg_("Aborting"));
    this.active_ = false;
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.cleanUpXhr_()
  }
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  if(this.xhr_) {
    if(this.active_) {
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false
    }
    this.cleanUpXhr_(true)
  }
  goog.net.XhrIo.superClass_.disposeInternal.call(this)
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if(!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    this.onReadyStateChangeEntryPoint_()
  }else {
    this.onReadyStateChangeHelper_()
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_()
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if(!this.active_) {
    return
  }
  if(typeof goog == "undefined") {
  }else {
    if(this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && this.getStatus() == 2) {
      this.logger_.fine(this.formatMsg_("Local request error detected and ignored"))
    }else {
      if(this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.defaultTimerObject.setTimeout(goog.bind(this.onReadyStateChange_, this), 0);
        return
      }
      this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);
      if(this.isComplete()) {
        this.logger_.fine(this.formatMsg_("Request complete"));
        this.active_ = false;
        if(this.isSuccess()) {
          this.dispatchEvent(goog.net.EventType.COMPLETE);
          this.dispatchEvent(goog.net.EventType.SUCCESS)
        }else {
          this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
          this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]";
          this.dispatchErrors_()
        }
        this.cleanUpXhr_()
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if(this.xhr_) {
    var xhr = this.xhr_;
    var clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhr_ = null;
    this.xhrOptions_ = null;
    if(this.timeoutId_) {
      goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_);
      this.timeoutId_ = null
    }
    if(!opt_fromDispose) {
      goog.net.xhrMonitor.pushContext(xhr);
      this.dispatchEvent(goog.net.EventType.READY);
      goog.net.xhrMonitor.popContext()
    }
    goog.net.xhrMonitor.markXhrClosed(xhr);
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange
    }catch(e) {
      this.logger_.severe("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
};
goog.net.XhrIo.prototype.isActive = function() {
  return!!this.xhr_
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE
};
goog.net.XhrIo.prototype.isSuccess = function() {
  switch(this.getStatus()) {
    case 0:
      return!this.isLastUriEffectiveSchemeHttp_();
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
      return true;
    default:
      return false
  }
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var lastUriScheme = goog.isString(this.lastUri_) ? goog.uri.utils.getScheme(this.lastUri_) : this.lastUri_.getScheme();
  if(lastUriScheme) {
    return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(lastUriScheme)
  }
  if(self.location) {
    return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(self.location.protocol)
  }else {
    return true
  }
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1
  }catch(e) {
    this.logger_.warning("Can not get status: " + e.message);
    return-1
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : ""
  }catch(e) {
    this.logger_.fine("Can not get status: " + e.message);
    return""
  }
};
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_)
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : ""
  }catch(e) {
    this.logger_.fine("Can not get responseText: " + e.message);
    return""
  }
};
goog.net.XhrIo.prototype.getResponseXml = function() {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null
  }catch(e) {
    this.logger_.fine("Can not get responseXML: " + e.message);
    return null
  }
};
goog.net.XhrIo.prototype.getResponseJson = function(opt_xssiPrefix) {
  if(!this.xhr_) {
    return undefined
  }
  var responseText = this.xhr_.responseText;
  if(opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length)
  }
  return goog.json.parse(responseText)
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    return this.xhr_ && this.xhr_.response
  }catch(e) {
    this.logger_.fine("Can not get response: " + e.message);
    return null
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(key) : undefined
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : ""
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_)
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]"
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
});
goog.provide("clojure.browser.net");
goog.require("cljs.core");
goog.require("clojure.browser.event");
goog.require("goog.net.XhrIo");
goog.require("goog.net.EventType");
goog.require("goog.net.xpc.CfgFields");
goog.require("goog.net.xpc.CrossPageChannel");
goog.require("goog.json");
clojure.browser.net._STAR_timeout_STAR_ = 1E4;
clojure.browser.net.event_types = cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__83488) {
  var vec__83489__83490 = p__83488;
  var k__83491 = cljs.core.nth.call(null, vec__83489__83490, 0, null);
  var v__83492 = cljs.core.nth.call(null, vec__83489__83490, 1, null);
  return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__83491.toLowerCase()), v__83492])
}, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.net.EventType))));
clojure.browser.net.IConnection = {};
clojure.browser.net.connect = function() {
  var connect = null;
  var connect__83523 = function(this$) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83493 = this$;
      if(cljs.core.truth_(and__3546__auto____83493)) {
        return this$.clojure$browser$net$IConnection$connect
      }else {
        return and__3546__auto____83493
      }
    }())) {
      return this$.clojure$browser$net$IConnection$connect(this$)
    }else {
      return function() {
        var or__3548__auto____83494 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83494)) {
          return or__3548__auto____83494
        }else {
          var or__3548__auto____83495 = clojure.browser.net.connect["_"];
          if(cljs.core.truth_(or__3548__auto____83495)) {
            return or__3548__auto____83495
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var connect__83524 = function(this$, opt1) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83496 = this$;
      if(cljs.core.truth_(and__3546__auto____83496)) {
        return this$.clojure$browser$net$IConnection$connect
      }else {
        return and__3546__auto____83496
      }
    }())) {
      return this$.clojure$browser$net$IConnection$connect(this$, opt1)
    }else {
      return function() {
        var or__3548__auto____83497 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83497)) {
          return or__3548__auto____83497
        }else {
          var or__3548__auto____83498 = clojure.browser.net.connect["_"];
          if(cljs.core.truth_(or__3548__auto____83498)) {
            return or__3548__auto____83498
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1)
    }
  };
  var connect__83525 = function(this$, opt1, opt2) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83499 = this$;
      if(cljs.core.truth_(and__3546__auto____83499)) {
        return this$.clojure$browser$net$IConnection$connect
      }else {
        return and__3546__auto____83499
      }
    }())) {
      return this$.clojure$browser$net$IConnection$connect(this$, opt1, opt2)
    }else {
      return function() {
        var or__3548__auto____83500 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83500)) {
          return or__3548__auto____83500
        }else {
          var or__3548__auto____83501 = clojure.browser.net.connect["_"];
          if(cljs.core.truth_(or__3548__auto____83501)) {
            return or__3548__auto____83501
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1, opt2)
    }
  };
  var connect__83526 = function(this$, opt1, opt2, opt3) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83502 = this$;
      if(cljs.core.truth_(and__3546__auto____83502)) {
        return this$.clojure$browser$net$IConnection$connect
      }else {
        return and__3546__auto____83502
      }
    }())) {
      return this$.clojure$browser$net$IConnection$connect(this$, opt1, opt2, opt3)
    }else {
      return function() {
        var or__3548__auto____83503 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83503)) {
          return or__3548__auto____83503
        }else {
          var or__3548__auto____83504 = clojure.browser.net.connect["_"];
          if(cljs.core.truth_(or__3548__auto____83504)) {
            return or__3548__auto____83504
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1, opt2, opt3)
    }
  };
  connect = function(this$, opt1, opt2, opt3) {
    switch(arguments.length) {
      case 1:
        return connect__83523.call(this, this$);
      case 2:
        return connect__83524.call(this, this$, opt1);
      case 3:
        return connect__83525.call(this, this$, opt1, opt2);
      case 4:
        return connect__83526.call(this, this$, opt1, opt2, opt3)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return connect
}();
clojure.browser.net.transmit = function() {
  var transmit = null;
  var transmit__83528 = function(this$, opt) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83505 = this$;
      if(cljs.core.truth_(and__3546__auto____83505)) {
        return this$.clojure$browser$net$IConnection$transmit
      }else {
        return and__3546__auto____83505
      }
    }())) {
      return this$.clojure$browser$net$IConnection$transmit(this$, opt)
    }else {
      return function() {
        var or__3548__auto____83506 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83506)) {
          return or__3548__auto____83506
        }else {
          var or__3548__auto____83507 = clojure.browser.net.transmit["_"];
          if(cljs.core.truth_(or__3548__auto____83507)) {
            return or__3548__auto____83507
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt)
    }
  };
  var transmit__83529 = function(this$, opt, opt2) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83508 = this$;
      if(cljs.core.truth_(and__3546__auto____83508)) {
        return this$.clojure$browser$net$IConnection$transmit
      }else {
        return and__3546__auto____83508
      }
    }())) {
      return this$.clojure$browser$net$IConnection$transmit(this$, opt, opt2)
    }else {
      return function() {
        var or__3548__auto____83509 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83509)) {
          return or__3548__auto____83509
        }else {
          var or__3548__auto____83510 = clojure.browser.net.transmit["_"];
          if(cljs.core.truth_(or__3548__auto____83510)) {
            return or__3548__auto____83510
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2)
    }
  };
  var transmit__83530 = function(this$, opt, opt2, opt3) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83511 = this$;
      if(cljs.core.truth_(and__3546__auto____83511)) {
        return this$.clojure$browser$net$IConnection$transmit
      }else {
        return and__3546__auto____83511
      }
    }())) {
      return this$.clojure$browser$net$IConnection$transmit(this$, opt, opt2, opt3)
    }else {
      return function() {
        var or__3548__auto____83512 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83512)) {
          return or__3548__auto____83512
        }else {
          var or__3548__auto____83513 = clojure.browser.net.transmit["_"];
          if(cljs.core.truth_(or__3548__auto____83513)) {
            return or__3548__auto____83513
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3)
    }
  };
  var transmit__83531 = function(this$, opt, opt2, opt3, opt4) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83514 = this$;
      if(cljs.core.truth_(and__3546__auto____83514)) {
        return this$.clojure$browser$net$IConnection$transmit
      }else {
        return and__3546__auto____83514
      }
    }())) {
      return this$.clojure$browser$net$IConnection$transmit(this$, opt, opt2, opt3, opt4)
    }else {
      return function() {
        var or__3548__auto____83515 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83515)) {
          return or__3548__auto____83515
        }else {
          var or__3548__auto____83516 = clojure.browser.net.transmit["_"];
          if(cljs.core.truth_(or__3548__auto____83516)) {
            return or__3548__auto____83516
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3, opt4)
    }
  };
  var transmit__83532 = function(this$, opt, opt2, opt3, opt4, opt5) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83517 = this$;
      if(cljs.core.truth_(and__3546__auto____83517)) {
        return this$.clojure$browser$net$IConnection$transmit
      }else {
        return and__3546__auto____83517
      }
    }())) {
      return this$.clojure$browser$net$IConnection$transmit(this$, opt, opt2, opt3, opt4, opt5)
    }else {
      return function() {
        var or__3548__auto____83518 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83518)) {
          return or__3548__auto____83518
        }else {
          var or__3548__auto____83519 = clojure.browser.net.transmit["_"];
          if(cljs.core.truth_(or__3548__auto____83519)) {
            return or__3548__auto____83519
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3, opt4, opt5)
    }
  };
  transmit = function(this$, opt, opt2, opt3, opt4, opt5) {
    switch(arguments.length) {
      case 2:
        return transmit__83528.call(this, this$, opt);
      case 3:
        return transmit__83529.call(this, this$, opt, opt2);
      case 4:
        return transmit__83530.call(this, this$, opt, opt2, opt3);
      case 5:
        return transmit__83531.call(this, this$, opt, opt2, opt3, opt4);
      case 6:
        return transmit__83532.call(this, this$, opt, opt2, opt3, opt4, opt5)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return transmit
}();
clojure.browser.net.close = function close(this$) {
  if(cljs.core.truth_(function() {
    var and__3546__auto____83520 = this$;
    if(cljs.core.truth_(and__3546__auto____83520)) {
      return this$.clojure$browser$net$IConnection$close
    }else {
      return and__3546__auto____83520
    }
  }())) {
    return this$.clojure$browser$net$IConnection$close(this$)
  }else {
    return function() {
      var or__3548__auto____83521 = clojure.browser.net.close[goog.typeOf.call(null, this$)];
      if(cljs.core.truth_(or__3548__auto____83521)) {
        return or__3548__auto____83521
      }else {
        var or__3548__auto____83522 = clojure.browser.net.close["_"];
        if(cljs.core.truth_(or__3548__auto____83522)) {
          return or__3548__auto____83522
        }else {
          throw cljs.core.missing_protocol.call(null, "IConnection.close", this$);
        }
      }
    }().call(null, this$)
  }
};
goog.net.XhrIo.prototype.clojure$browser$event$EventType$ = true;
goog.net.XhrIo.prototype.clojure$browser$event$EventType$event_types = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__83534) {
    var vec__83535__83536 = p__83534;
    var k__83537 = cljs.core.nth.call(null, vec__83535__83536, 0, null);
    var v__83538 = cljs.core.nth.call(null, vec__83535__83536, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__83537.toLowerCase()), v__83538])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.net.EventType))))
};
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$ = true;
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$transmit = function() {
  var G__83539 = null;
  var G__83539__83540 = function(this$, uri) {
    return clojure.browser.net.transmit.call(null, this$, uri, "GET", null, null, clojure.browser.net._STAR_timeout_STAR_)
  };
  var G__83539__83541 = function(this$, uri, method) {
    return clojure.browser.net.transmit.call(null, this$, uri, method, null, null, clojure.browser.net._STAR_timeout_STAR_)
  };
  var G__83539__83542 = function(this$, uri, method, content) {
    return clojure.browser.net.transmit.call(null, this$, uri, method, content, null, clojure.browser.net._STAR_timeout_STAR_)
  };
  var G__83539__83543 = function(this$, uri, method, content, headers) {
    return clojure.browser.net.transmit.call(null, this$, uri, method, content, headers, clojure.browser.net._STAR_timeout_STAR_)
  };
  var G__83539__83544 = function(this$, uri, method, content, headers, timeout) {
    this$.setTimeoutInterval(timeout);
    return this$.send(uri, method, content, headers)
  };
  G__83539 = function(this$, uri, method, content, headers, timeout) {
    switch(arguments.length) {
      case 2:
        return G__83539__83540.call(this, this$, uri);
      case 3:
        return G__83539__83541.call(this, this$, uri, method);
      case 4:
        return G__83539__83542.call(this, this$, uri, method, content);
      case 5:
        return G__83539__83543.call(this, this$, uri, method, content, headers);
      case 6:
        return G__83539__83544.call(this, this$, uri, method, content, headers, timeout)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83539
}();
clojure.browser.net.xpc_config_fields = cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__83546) {
  var vec__83547__83548 = p__83546;
  var k__83549 = cljs.core.nth.call(null, vec__83547__83548, 0, null);
  var v__83550 = cljs.core.nth.call(null, vec__83547__83548, 1, null);
  return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__83549.toLowerCase()), v__83550])
}, cljs.core.js__GT_clj.call(null, goog.net.xpc.CfgFields)));
clojure.browser.net.xhr_connection = function xhr_connection() {
  return new goog.net.XhrIo
};
clojure.browser.net.ICrossPageChannel = {};
clojure.browser.net.register_service = function() {
  var register_service = null;
  var register_service__83557 = function(this$, service_name, fn) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83551 = this$;
      if(cljs.core.truth_(and__3546__auto____83551)) {
        return this$.clojure$browser$net$ICrossPageChannel$register_service
      }else {
        return and__3546__auto____83551
      }
    }())) {
      return this$.clojure$browser$net$ICrossPageChannel$register_service(this$, service_name, fn)
    }else {
      return function() {
        var or__3548__auto____83552 = clojure.browser.net.register_service[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83552)) {
          return or__3548__auto____83552
        }else {
          var or__3548__auto____83553 = clojure.browser.net.register_service["_"];
          if(cljs.core.truth_(or__3548__auto____83553)) {
            return or__3548__auto____83553
          }else {
            throw cljs.core.missing_protocol.call(null, "ICrossPageChannel.register-service", this$);
          }
        }
      }().call(null, this$, service_name, fn)
    }
  };
  var register_service__83558 = function(this$, service_name, fn, encode_json_QMARK_) {
    if(cljs.core.truth_(function() {
      var and__3546__auto____83554 = this$;
      if(cljs.core.truth_(and__3546__auto____83554)) {
        return this$.clojure$browser$net$ICrossPageChannel$register_service
      }else {
        return and__3546__auto____83554
      }
    }())) {
      return this$.clojure$browser$net$ICrossPageChannel$register_service(this$, service_name, fn, encode_json_QMARK_)
    }else {
      return function() {
        var or__3548__auto____83555 = clojure.browser.net.register_service[goog.typeOf.call(null, this$)];
        if(cljs.core.truth_(or__3548__auto____83555)) {
          return or__3548__auto____83555
        }else {
          var or__3548__auto____83556 = clojure.browser.net.register_service["_"];
          if(cljs.core.truth_(or__3548__auto____83556)) {
            return or__3548__auto____83556
          }else {
            throw cljs.core.missing_protocol.call(null, "ICrossPageChannel.register-service", this$);
          }
        }
      }().call(null, this$, service_name, fn, encode_json_QMARK_)
    }
  };
  register_service = function(this$, service_name, fn, encode_json_QMARK_) {
    switch(arguments.length) {
      case 3:
        return register_service__83557.call(this, this$, service_name, fn);
      case 4:
        return register_service__83558.call(this, this$, service_name, fn, encode_json_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return register_service
}();
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$ = true;
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$connect = function() {
  var G__83560 = null;
  var G__83560__83561 = function(this$) {
    return clojure.browser.net.connect.call(null, this$, null)
  };
  var G__83560__83562 = function(this$, on_connect_fn) {
    return this$.connect(on_connect_fn)
  };
  var G__83560__83563 = function(this$, on_connect_fn, config_iframe_fn) {
    return clojure.browser.net.connect.call(null, this$, on_connect_fn, config_iframe_fn, document.body)
  };
  var G__83560__83564 = function(this$, on_connect_fn, config_iframe_fn, iframe_parent) {
    this$.createPeerIframe(iframe_parent, config_iframe_fn);
    return this$.connect(on_connect_fn)
  };
  G__83560 = function(this$, on_connect_fn, config_iframe_fn, iframe_parent) {
    switch(arguments.length) {
      case 1:
        return G__83560__83561.call(this, this$);
      case 2:
        return G__83560__83562.call(this, this$, on_connect_fn);
      case 3:
        return G__83560__83563.call(this, this$, on_connect_fn, config_iframe_fn);
      case 4:
        return G__83560__83564.call(this, this$, on_connect_fn, config_iframe_fn, iframe_parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83560
}();
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$transmit = function(this$, service_name, payload) {
  return this$.send(cljs.core.name.call(null, service_name), payload)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$close = function(this$) {
  return this$.close(cljs.core.List.EMPTY)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$ICrossPageChannel$ = true;
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$ICrossPageChannel$register_service = function() {
  var G__83566 = null;
  var G__83566__83567 = function(this$, service_name, fn) {
    return clojure.browser.net.register_service.call(null, this$, service_name, fn, false)
  };
  var G__83566__83568 = function(this$, service_name, fn, encode_json_QMARK_) {
    return this$.registerService(cljs.core.name.call(null, service_name), fn, encode_json_QMARK_)
  };
  G__83566 = function(this$, service_name, fn, encode_json_QMARK_) {
    switch(arguments.length) {
      case 3:
        return G__83566__83567.call(this, this$, service_name, fn);
      case 4:
        return G__83566__83568.call(this, this$, service_name, fn, encode_json_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__83566
}();
clojure.browser.net.xpc_connection = function() {
  var xpc_connection = null;
  var xpc_connection__83579 = function() {
    var temp__3698__auto____83570 = (new goog.Uri(window.location.href)).getParameterValue("xpc");
    if(cljs.core.truth_(temp__3698__auto____83570)) {
      var config__83571 = temp__3698__auto____83570;
      return new goog.net.xpc.CrossPageChannel(goog.json.parse.call(null, config__83571))
    }else {
      return null
    }
  };
  var xpc_connection__83580 = function(config) {
    return new goog.net.xpc.CrossPageChannel(cljs.core.reduce.call(null, function(sum, p__83572) {
      var vec__83573__83574 = p__83572;
      var k__83575 = cljs.core.nth.call(null, vec__83573__83574, 0, null);
      var v__83576 = cljs.core.nth.call(null, vec__83573__83574, 1, null);
      var temp__3695__auto____83577 = cljs.core.get.call(null, clojure.browser.net.xpc_config_fields, k__83575);
      if(cljs.core.truth_(temp__3695__auto____83577)) {
        var field__83578 = temp__3695__auto____83577;
        return cljs.core.assoc.call(null, sum, field__83578, v__83576)
      }else {
        return sum
      }
    }, cljs.core.ObjMap.fromObject([], {}), config).strobj)
  };
  xpc_connection = function(config) {
    switch(arguments.length) {
      case 0:
        return xpc_connection__83579.call(this);
      case 1:
        return xpc_connection__83580.call(this, config)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return xpc_connection
}();
goog.provide("clojure.browser.repl");
goog.require("cljs.core");
goog.require("clojure.browser.net");
goog.require("clojure.browser.event");
clojure.browser.repl.xpc_connection = cljs.core.atom.call(null, null);
clojure.browser.repl.repl_print = function repl_print(data) {
  var temp__3695__auto____83475 = cljs.core.deref.call(null, clojure.browser.repl.xpc_connection);
  if(cljs.core.truth_(temp__3695__auto____83475)) {
    var conn__83476 = temp__3695__auto____83475;
    return clojure.browser.net.transmit.call(null, conn__83476, "\ufdd0'print", cljs.core.pr_str.call(null, data))
  }else {
    return null
  }
};
clojure.browser.repl.evaluate_javascript = function evaluate_javascript(conn, block) {
  var result__83479 = function() {
    try {
      return cljs.core.ObjMap.fromObject(["\ufdd0'status", "\ufdd0'value"], {"\ufdd0'status":"\ufdd0'success", "\ufdd0'value":cljs.core.str.call(null, eval(block))})
    }catch(e83477) {
      if(cljs.core.truth_(cljs.core.instance_QMARK_.call(null, Error, e83477))) {
        var e__83478 = e83477;
        return cljs.core.ObjMap.fromObject(["\ufdd0'status", "\ufdd0'value", "\ufdd0'stacktrace"], {"\ufdd0'status":"\ufdd0'exception", "\ufdd0'value":cljs.core.pr_str.call(null, e__83478), "\ufdd0'stacktrace":cljs.core.truth_(e__83478.hasOwnProperty("stack")) ? e__83478.stack : "No stacktrace available."})
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          throw e83477;
        }else {
          return null
        }
      }
    }
  }();
  return cljs.core.pr_str.call(null, result__83479)
};
clojure.browser.repl.send_result = function send_result(connection, url, data) {
  return clojure.browser.net.transmit.call(null, connection, url, "POST", data, null, 0)
};
clojure.browser.repl.send_print = function() {
  var send_print = null;
  var send_print__83481 = function(url, data) {
    return send_print.call(null, url, data, 0)
  };
  var send_print__83482 = function(url, data, n) {
    var conn__83480 = clojure.browser.net.xhr_connection.call(null);
    clojure.browser.event.listen.call(null, conn__83480, "\ufdd0'error", function(_) {
      if(cljs.core.truth_(n < 10)) {
        return send_print.call(null, url, data, n + 1)
      }else {
        return console.log(cljs.core.str.call(null, "Could not send ", data, " after ", n, " attempts."))
      }
    });
    return clojure.browser.net.transmit.call(null, conn__83480, url, "POST", data, null, 0)
  };
  send_print = function(url, data, n) {
    switch(arguments.length) {
      case 2:
        return send_print__83481.call(this, url, data);
      case 3:
        return send_print__83482.call(this, url, data, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return send_print
}();
clojure.browser.repl.order = cljs.core.atom.call(null, 0);
clojure.browser.repl.wrap_message = function wrap_message(t, data) {
  return cljs.core.pr_str.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'type", "\ufdd0'content", "\ufdd0'order"], {"\ufdd0'type":t, "\ufdd0'content":data, "\ufdd0'order":cljs.core.swap_BANG_.call(null, clojure.browser.repl.order, cljs.core.inc)}))
};
clojure.browser.repl.start_evaluator = function start_evaluator(url) {
  var temp__3695__auto____83484 = clojure.browser.net.xpc_connection.call(null);
  if(cljs.core.truth_(temp__3695__auto____83484)) {
    var repl_connection__83485 = temp__3695__auto____83484;
    var connection__83486 = clojure.browser.net.xhr_connection.call(null);
    clojure.browser.event.listen.call(null, connection__83486, "\ufdd0'success", function(e) {
      return clojure.browser.net.transmit.call(null, repl_connection__83485, "\ufdd0'evaluate-javascript", e.currentTarget.getResponseText(cljs.core.List.EMPTY))
    });
    clojure.browser.net.register_service.call(null, repl_connection__83485, "\ufdd0'send-result", function(data) {
      return clojure.browser.repl.send_result.call(null, connection__83486, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'result", data))
    });
    clojure.browser.net.register_service.call(null, repl_connection__83485, "\ufdd0'print", function(data) {
      return clojure.browser.repl.send_print.call(null, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'print", data))
    });
    clojure.browser.net.connect.call(null, repl_connection__83485, cljs.core.constantly.call(null, null));
    return setTimeout.call(null, function() {
      return clojure.browser.repl.send_result.call(null, connection__83486, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'ready", "ready"))
    }, 50)
  }else {
    return alert.call(null, "No 'xpc' param provided to child iframe.")
  }
};
clojure.browser.repl.connect = function connect(repl_server_url) {
  var repl_connection__83487 = clojure.browser.net.xpc_connection.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'peer_uri"], {"\ufdd0'peer_uri":repl_server_url}));
  cljs.core.swap_BANG_.call(null, clojure.browser.repl.xpc_connection, cljs.core.constantly.call(null, repl_connection__83487));
  clojure.browser.net.register_service.call(null, repl_connection__83487, "\ufdd0'evaluate-javascript", function(js) {
    return clojure.browser.net.transmit.call(null, repl_connection__83487, "\ufdd0'send-result", clojure.browser.repl.evaluate_javascript.call(null, repl_connection__83487, js))
  });
  return clojure.browser.net.connect.call(null, repl_connection__83487, cljs.core.constantly.call(null, null), function(iframe) {
    return iframe.style.display = "none"
  })
};
goog.provide("tempest.draw");
goog.require("cljs.core");
goog.require("tempest.levels");
goog.require("tempest.util");
goog.require("tempest.path");
goog.require("goog.dom");
tempest.draw.draw_rectangle = function draw_rectangle(context, p__81382) {
  var vec__81383__81388 = p__81382;
  var vec__81384__81389 = cljs.core.nth.call(null, vec__81383__81388, 0, null);
  var x0__81390 = cljs.core.nth.call(null, vec__81384__81389, 0, null);
  var y0__81391 = cljs.core.nth.call(null, vec__81384__81389, 1, null);
  var vec__81385__81392 = cljs.core.nth.call(null, vec__81383__81388, 1, null);
  var x1__81393 = cljs.core.nth.call(null, vec__81385__81392, 0, null);
  var y1__81394 = cljs.core.nth.call(null, vec__81385__81392, 1, null);
  var vec__81386__81395 = cljs.core.nth.call(null, vec__81383__81388, 2, null);
  var x2__81396 = cljs.core.nth.call(null, vec__81386__81395, 0, null);
  var y2__81397 = cljs.core.nth.call(null, vec__81386__81395, 1, null);
  var vec__81387__81398 = cljs.core.nth.call(null, vec__81383__81388, 3, null);
  var x3__81399 = cljs.core.nth.call(null, vec__81387__81398, 0, null);
  var y3__81400 = cljs.core.nth.call(null, vec__81387__81398, 1, null);
  context.moveTo(x0__81390, y0__81391);
  context.lineTo(x1__81393, y1__81394);
  context.lineTo(x2__81396, y2__81397);
  context.lineTo(x3__81399, y3__81400);
  context.lineTo(x0__81390, y0__81391);
  return context.stroke()
};
tempest.draw.draw_line = function draw_line(context, point0, point1) {
  context.moveTo(cljs.core.first.call(null, point0), cljs.core.peek.call(null, point0));
  context.lineTo(cljs.core.first.call(null, point1), cljs.core.peek.call(null, point1));
  return context.stroke()
};
tempest.draw.max_flipper_angle = function max_flipper_angle() {
  return null
};
tempest.draw.draw_path_rotated = function draw_path_rotated(context, origin, vecs, skipfirst_QMARK_, point, angle) {
  context.save();
  context.translate(cljs.core.first.call(null, origin) - cljs.core.first.call(null, point), cljs.core.peek.call(null, origin) - cljs.core.peek.call(null, point));
  context.rotate(angle);
  (function(origin, vecs, skip_QMARK_) {
    while(true) {
      if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, vecs))) {
        return null
      }else {
        var line__81401 = cljs.core.first.call(null, vecs);
        var point__81402 = tempest.path.rebase_origin.call(null, tempest.path.polar_to_cartesian_coords.call(null, line__81401), origin);
        context.lineTo(cljs.core.first.call(null, point__81402), cljs.core.peek.call(null, point__81402));
        var G__81403 = point__81402;
        var G__81404 = cljs.core.next.call(null, vecs);
        var G__81405 = false;
        origin = G__81403;
        vecs = G__81404;
        skip_QMARK_ = G__81405;
        continue
      }
      break
    }
  }).call(null, cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, point), cljs.core.peek.call(null, point)]), vecs, skipfirst_QMARK_);
  context.stroke();
  return context.restore()
};
tempest.draw.draw_path = function draw_path(context, origin, vecs, skipfirst_QMARK_) {
  context.moveTo(cljs.core.first.call(null, origin), cljs.core.peek.call(null, origin));
  (function(origin, vecs, skip_QMARK_) {
    while(true) {
      if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, vecs))) {
        return null
      }else {
        var line__81406 = cljs.core.first.call(null, vecs);
        var point__81407 = tempest.path.rebase_origin.call(null, tempest.path.polar_to_cartesian_coords.call(null, line__81406), origin);
        if(cljs.core.truth_(cljs.core.not.call(null, skip_QMARK_))) {
          context.lineTo(cljs.core.first.call(null, point__81407), cljs.core.peek.call(null, point__81407))
        }else {
          context.moveTo(cljs.core.first.call(null, point__81407), cljs.core.peek.call(null, point__81407))
        }
        var G__81408 = point__81407;
        var G__81409 = cljs.core.next.call(null, vecs);
        var G__81410 = false;
        origin = G__81408;
        vecs = G__81409;
        skip_QMARK_ = G__81410;
        continue
      }
      break
    }
  }).call(null, origin, vecs, skipfirst_QMARK_);
  return context.stroke()
};
tempest.draw.draw_player = function draw_player(context, dims, level, player, zoom) {
  context.save();
  context.beginPath();
  if(cljs.core.truth_(zoom === 0)) {
    context.scale(1.0E-5, 1.0E-4)
  }else {
    context.scale(zoom, zoom)
  }
  context.strokeStyle = cljs.core.str.call(null, "rgb(255,255,0)");
  tempest.draw.draw_path.call(null, context, tempest.path.polar_to_cartesian_centered.call(null, tempest.path.polar_entity_coord.call(null, player), dims), tempest.path.round_path.call(null, tempest.path.player_path_on_level.call(null, player)), true);
  context.closePath();
  return context.restore()
};
tempest.draw.draw_entities = function draw_entities(context, dims, level, entity_list, color, zoom) {
  var map__81411__81412 = color;
  var map__81411__81413 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81411__81412)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81411__81412) : map__81411__81412;
  var r__81414 = cljs.core.get.call(null, map__81411__81413, "\ufdd0'r");
  var g__81415 = cljs.core.get.call(null, map__81411__81413, "\ufdd0'g");
  var b__81416 = cljs.core.get.call(null, map__81411__81413, "\ufdd0'b");
  var color_str__81417 = cljs.core.str.call(null, "rgb(", r__81414, ",", g__81415, ",", b__81416, ")");
  context.save();
  if(cljs.core.truth_(zoom === 0)) {
    context.scale(1.0E-5, 1.0E-4)
  }else {
    context.scale(zoom, zoom)
  }
  var G__81418__81419 = cljs.core.seq.call(null, entity_list);
  if(cljs.core.truth_(G__81418__81419)) {
    var entity__81420 = cljs.core.first.call(null, G__81418__81419);
    var G__81418__81421 = G__81418__81419;
    while(true) {
      context.beginPath();
      context.strokeStyle = color_str__81417;
      tempest.draw.draw_path_rotated.call(null, context, tempest.path.polar_to_cartesian_centered.call(null, tempest.path.polar_entity_coord.call(null, entity__81420), dims), tempest.path.round_path.call(null, "\ufdd0'path-fn".call(null, entity__81420).call(null, entity__81420)), true, "\ufdd0'flip-point".call(null, entity__81420), "\ufdd0'flip-cur-angle".call(null, entity__81420));
      context.closePath();
      var temp__3698__auto____81422 = cljs.core.next.call(null, G__81418__81421);
      if(cljs.core.truth_(temp__3698__auto____81422)) {
        var G__81418__81423 = temp__3698__auto____81422;
        var G__81424 = cljs.core.first.call(null, G__81418__81423);
        var G__81425 = G__81418__81423;
        entity__81420 = G__81424;
        G__81418__81421 = G__81425;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return context.restore()
};
tempest.draw.draw_spike = function draw_spike(p__81426, seg_idx, length) {
  var map__81427__81428 = p__81426;
  var map__81427__81429 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81427__81428)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81427__81428) : map__81427__81428;
  var level__81430 = cljs.core.get.call(null, map__81427__81429, "\ufdd0'level");
  var context__81431 = cljs.core.get.call(null, map__81427__81429, "\ufdd0'context");
  var dims__81432 = cljs.core.get.call(null, map__81427__81429, "\ufdd0'dims");
  context__81431.beginPath();
  context__81431.strokeStyle = cljs.core.str.call(null, "rgb(10, 150, 10)");
  tempest.draw.draw_line.call(null, context__81431, tempest.path.polar_to_cartesian_centered.call(null, tempest.path.segment_midpoint.call(null, level__81430, seg_idx, false), dims__81432), tempest.path.polar_to_cartesian_centered.call(null, tempest.path.polar_segment_midpoint.call(null, level__81430, seg_idx, length), dims__81432));
  return context__81431.closePath()
};
tempest.draw.draw_all_spikes = function draw_all_spikes(game_state) {
  var context__81433 = "\ufdd0'context".call(null, game_state);
  var zoom__81434 = "\ufdd0'zoom".call(null, game_state);
  var spikes__81435 = "\ufdd0'spikes".call(null, game_state);
  var spike_count__81436 = cljs.core.count.call(null, spikes__81435);
  context__81433.save();
  if(cljs.core.truth_(zoom__81434 === 0)) {
    context__81433.scale(1.0E-5, 1.0E-4)
  }else {
    context__81433.scale(zoom__81434, zoom__81434)
  }
  var G__81437__81438 = cljs.core.seq.call(null, cljs.core.range.call(null, spike_count__81436));
  if(cljs.core.truth_(G__81437__81438)) {
    var idx__81439 = cljs.core.first.call(null, G__81437__81438);
    var G__81437__81440 = G__81437__81438;
    while(true) {
      var length__81441 = cljs.core.nth.call(null, spikes__81435, idx__81439);
      if(cljs.core.truth_(length__81441 > 0)) {
        tempest.draw.draw_spike.call(null, game_state, idx__81439, length__81441)
      }else {
      }
      var temp__3698__auto____81442 = cljs.core.next.call(null, G__81437__81440);
      if(cljs.core.truth_(temp__3698__auto____81442)) {
        var G__81437__81443 = temp__3698__auto____81442;
        var G__81444 = cljs.core.first.call(null, G__81437__81443);
        var G__81445 = G__81437__81443;
        idx__81439 = G__81444;
        G__81437__81440 = G__81445;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return context__81433.restore()
};
tempest.draw.draw_player_segment = function draw_player_segment(p__81446, p__81447) {
  var map__81448__81451 = p__81446;
  var map__81448__81452 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81448__81451)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81448__81451) : map__81448__81451;
  var player__81453 = cljs.core.get.call(null, map__81448__81452, "\ufdd0'player");
  var zoom__81454 = cljs.core.get.call(null, map__81448__81452, "\ufdd0'zoom");
  var level__81455 = cljs.core.get.call(null, map__81448__81452, "\ufdd0'level");
  var dims__81456 = cljs.core.get.call(null, map__81448__81452, "\ufdd0'dims");
  var context__81457 = cljs.core.get.call(null, map__81448__81452, "\ufdd0'bgcontext");
  var map__81449__81458 = cljs.core.get.call(null, map__81448__81452, "\ufdd0'player");
  var map__81449__81459 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81449__81458)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81449__81458) : map__81449__81458;
  var pseg__81460 = cljs.core.get.call(null, map__81449__81459, "\ufdd0'segment");
  var map__81450__81461 = p__81447;
  var map__81450__81462 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81450__81461)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81450__81461) : map__81450__81461;
  var b__81463 = cljs.core.get.call(null, map__81450__81462, "\ufdd0'b");
  var g__81464 = cljs.core.get.call(null, map__81450__81462, "\ufdd0'g");
  var r__81465 = cljs.core.get.call(null, map__81450__81462, "\ufdd0'r");
  context__81457.beginPath();
  context__81457.strokeStyle = cljs.core.str.call(null, "rgb(", r__81465, ",", g__81464, ",", b__81463, ")");
  tempest.draw.draw_rectangle.call(null, context__81457, tempest.path.round_path.call(null, tempest.path.rectangle_to_canvas_coords.call(null, dims__81456, tempest.path.rectangle_for_segment.call(null, level__81455, pseg__81460))));
  return context__81457.closePath()
};
tempest.draw.draw_board = function draw_board(p__81466) {
  var map__81467__81468 = p__81466;
  var map__81467__81469 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81467__81468)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81467__81468) : map__81467__81468;
  var player__81470 = cljs.core.get.call(null, map__81467__81469, "\ufdd0'player");
  var zoom__81471 = cljs.core.get.call(null, map__81467__81469, "\ufdd0'zoom");
  var level__81472 = cljs.core.get.call(null, map__81467__81469, "\ufdd0'level");
  var dims__81473 = cljs.core.get.call(null, map__81467__81469, "\ufdd0'dims");
  var context__81474 = cljs.core.get.call(null, map__81467__81469, "\ufdd0'bgcontext");
  context__81474.save();
  if(cljs.core.truth_(zoom__81471 === 0)) {
    context__81474.scale(1.0E-5, 1.0E-4)
  }else {
    context__81474.scale(zoom__81471, zoom__81471)
  }
  context__81474.lineWidth = 1;
  context__81474.strokeStyle = cljs.core.str.call(null, "rgb(10,10,100)");
  context__81474.beginPath();
  var G__81475__81476 = cljs.core.seq.call(null, cljs.core.range.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, level__81472))));
  if(cljs.core.truth_(G__81475__81476)) {
    var idx__81477 = cljs.core.first.call(null, G__81475__81476);
    var G__81475__81478 = G__81475__81476;
    while(true) {
      tempest.draw.draw_rectangle.call(null, context__81474, tempest.path.round_path.call(null, tempest.path.rectangle_to_canvas_coords.call(null, dims__81473, tempest.path.rectangle_for_segment.call(null, level__81472, idx__81477))));
      var temp__3698__auto____81479 = cljs.core.next.call(null, G__81475__81478);
      if(cljs.core.truth_(temp__3698__auto____81479)) {
        var G__81475__81480 = temp__3698__auto____81479;
        var G__81481 = cljs.core.first.call(null, G__81475__81480);
        var G__81482 = G__81475__81480;
        idx__81477 = G__81481;
        G__81475__81478 = G__81482;
        continue
      }else {
      }
      break
    }
  }else {
  }
  context__81474.restore();
  return context__81474.closePath()
};
tempest.draw.clear_context = function clear_context(context, dims) {
  var map__81483__81484 = dims;
  var map__81483__81485 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81483__81484)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81483__81484) : map__81483__81484;
  var width__81486 = cljs.core.get.call(null, map__81483__81485, "\ufdd0'width");
  var height__81487 = cljs.core.get.call(null, map__81483__81485, "\ufdd0'height");
  return context.clearRect(0, 0, width__81486, height__81487)
};
goog.provide("tempest.core");
goog.require("cljs.core");
goog.require("tempest.levels");
goog.require("tempest.util");
goog.require("tempest.draw");
goog.require("tempest.path");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.KeyCodes");
goog.require("clojure.browser.repl");
tempest.core.next_game_state = function next_game_state(game_state) {
  if(cljs.core.truth_("\ufdd0'paused?".call(null, game_state))) {
    return tempest.core.game_logic_paused.call(null, game_state)
  }else {
    if(cljs.core.truth_("\ufdd0'player-zooming?".call(null, game_state))) {
      return tempest.core.game_logic_player_shooping_down_level.call(null, game_state)
    }else {
      if(cljs.core.truth_("\ufdd0'is-zooming?".call(null, game_state))) {
        return tempest.core.game_logic_non_playable.call(null, game_state)
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          return tempest.core.game_logic_playable.call(null, game_state)
        }else {
          return null
        }
      }
    }
  }
};
tempest.core.game_logic_paused = function game_logic_paused(game_state) {
  return tempest.core.schedule_next_frame.call(null, tempest.core.dequeue_keypresses_while_paused.call(null, game_state))
};
tempest.core.game_logic_player_shooping_down_level = function game_logic_player_shooping_down_level(game_state) {
  return tempest.core.schedule_next_frame.call(null, tempest.core.maybe_render_fps_display.call(null, tempest.core.update_frame_count.call(null, tempest.core.maybe_change_level.call(null, tempest.core.mark_player_if_spiked.call(null, tempest.core.animate_player_shooping.call(null, tempest.core.update_projectile_locations.call(null, tempest.core.remove_spiked_bullets.call(null, tempest.core.render_frame.call(null, tempest.core.draw_board.call(null, tempest.core.clear_frame.call(null, tempest.core.highlight_player_segment.call(null, 
  tempest.core.dequeue_keypresses.call(null, tempest.core.clear_player_segment.call(null, game_state))))))))))))))
};
tempest.core.game_logic_playable = function game_logic_playable(game_state) {
  var gs1__80831 = tempest.core.render_frame.call(null, tempest.core.draw_board.call(null, tempest.core.clear_frame.call(null, tempest.core.maybe_change_level.call(null, tempest.core.highlight_player_segment.call(null, tempest.core.dequeue_keypresses.call(null, tempest.core.clear_player_segment.call(null, game_state)))))));
  var gs2__80832 = tempest.core.maybe_enemies_shoot.call(null, tempest.core.handle_exiting_spikers.call(null, tempest.core.handle_dead_enemies.call(null, tempest.core.maybe_split_tankers.call(null, tempest.core.update_enemy_directions.call(null, tempest.core.update_enemy_locations.call(null, tempest.core.update_projectile_locations.call(null, tempest.core.remove_collided_bullets.call(null, tempest.core.remove_collided_entities.call(null, tempest.core.remove_spiked_bullets.call(null, gs1__80831))))))))));
  var gs3__80833 = tempest.core.maybe_render_fps_display.call(null, tempest.core.update_frame_count.call(null, tempest.core.animate_player_capture.call(null, tempest.core.update_entity_flippyness.call(null, tempest.core.update_entity_is_flipping.call(null, tempest.core.update_player_if_shot.call(null, tempest.core.check_if_player_captured.call(null, tempest.core.check_if_enemies_remain.call(null, tempest.core.maybe_make_enemy.call(null, tempest.core.handle_spike_laying.call(null, gs2__80832))))))))));
  return tempest.core.schedule_next_frame.call(null, gs3__80833)
};
tempest.core.game_logic_non_playable = function game_logic_non_playable(game_state) {
  return tempest.core.schedule_next_frame.call(null, tempest.core.maybe_render_fps_display.call(null, tempest.core.update_frame_count.call(null, tempest.core.render_frame.call(null, tempest.core.draw_board.call(null, tempest.core.clear_frame.call(null, tempest.core.dequeue_keypresses_while_paused.call(null, game_state)))))))
};
tempest.core._STAR_key_event_queue_STAR_ = cljs.core.atom.call(null, cljs.core.List.EMPTY);
tempest.core.build_game_state = function build_game_state() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'zoom-in?", "\ufdd0'spikes", "\ufdd0'frame-time", "\ufdd0'enemy-list", "\ufdd0'frame-count", "\ufdd0'context", "\ufdd0'player-zooming?", "\ufdd0'player", "\ufdd0'is-zooming?", "\ufdd0'dims", "\ufdd0'projectile-list", "\ufdd0'paused?", "\ufdd0'anim-fn", "\ufdd0'zoom", "\ufdd0'level", "\ufdd0'bgcontext", "\ufdd0'level-idx", "\ufdd0'level-done?"], {"\ufdd0'zoom-in?":true, "\ufdd0'spikes":cljs.core.PersistentVector.fromArray([]), "\ufdd0'frame-time":0, "\ufdd0'enemy-list":cljs.core.List.EMPTY, 
  "\ufdd0'frame-count":0, "\ufdd0'context":null, "\ufdd0'player-zooming?":false, "\ufdd0'player":cljs.core.List.EMPTY, "\ufdd0'is-zooming?":true, "\ufdd0'dims":cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":0, "\ufdd0'height":0}), "\ufdd0'projectile-list":cljs.core.List.EMPTY, "\ufdd0'paused?":false, "\ufdd0'anim-fn":cljs.core.identity, "\ufdd0'zoom":0, "\ufdd0'level":null, "\ufdd0'bgcontext":null, "\ufdd0'level-idx":0, "\ufdd0'level-done?":false})
};
tempest.core.check_if_enemies_remain = function check_if_enemies_remain(game_state) {
  var level__80834 = "\ufdd0'level".call(null, game_state);
  var player__80835 = "\ufdd0'player".call(null, game_state);
  var on_board__80836 = cljs.core.count.call(null, "\ufdd0'enemy-list".call(null, game_state));
  var unlaunched__80837 = cljs.core.apply.call(null, cljs.core._PLUS_, cljs.core.vals.call(null, "\ufdd0'remaining".call(null, level__80834)));
  var remaining__80838 = on_board__80836 + unlaunched__80837;
  if(cljs.core.truth_(remaining__80838 === 0)) {
    return cljs.core.assoc.call(null, game_state, "\ufdd0'player", cljs.core.assoc.call(null, player__80835, "\ufdd0'stride", -2), "\ufdd0'player-zooming?", true)
  }else {
    return game_state
  }
};
tempest.core.change_level = function change_level(game_state, level_idx) {
  var level__80839 = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, level_idx);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'level-idx", level_idx, "\ufdd0'level", level__80839, "\ufdd0'player", tempest.core.build_player.call(null, level__80839, 0), "\ufdd0'zoom", 0, "\ufdd0'zoom-in?", true, "\ufdd0'is-zooming?", true, "\ufdd0'level-done?", false, "\ufdd0'player-zooming?", false, "\ufdd0'projectile-list", cljs.core.List.EMPTY, "\ufdd0'enemy-list", cljs.core.List.EMPTY, "\ufdd0'spikes", cljs.core.vec.call(null, cljs.core.take.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, 
  level__80839)), cljs.core.repeat.call(null, 0))))
};
tempest.core.maybe_change_level = function maybe_change_level(game_state) {
  var player__80840 = "\ufdd0'player".call(null, game_state);
  var level__80841 = "\ufdd0'level".call(null, game_state);
  if(cljs.core.truth_(function() {
    var and__3546__auto____80842 = "\ufdd0'is-dead?".call(null, player__80840);
    if(cljs.core.truth_(and__3546__auto____80842)) {
      return"\ufdd0'level-done?".call(null, game_state)
    }else {
      return and__3546__auto____80842
    }
  }())) {
    return tempest.core.change_level.call(null, game_state, "\ufdd0'level-idx".call(null, game_state))
  }else {
    if(cljs.core.truth_(function() {
      var and__3546__auto____80843 = cljs.core.not.call(null, "\ufdd0'is-dead?".call(null, player__80840));
      if(cljs.core.truth_(and__3546__auto____80843)) {
        return"\ufdd0'level-done?".call(null, game_state)
      }else {
        return and__3546__auto____80843
      }
    }())) {
      return tempest.core.change_level.call(null, game_state, "\ufdd0'level-idx".call(null, game_state) + 1)
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return game_state
      }else {
        return null
      }
    }
  }
};
tempest.core.build_projectile = function() {
  var build_projectile__delegate = function(level, seg_idx, stride, p__80844) {
    var map__80845__80846 = p__80844;
    var map__80845__80847 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80845__80846)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80845__80846) : map__80845__80846;
    var from_enemy_QMARK___80848 = cljs.core.get.call(null, map__80845__80847, "\ufdd0'from-enemy?", false);
    var step__80849 = cljs.core.get.call(null, map__80845__80847, "\ufdd0'step", 0);
    return cljs.core.ObjMap.fromObject(["\ufdd0'step", "\ufdd0'stride", "\ufdd0'segment", "\ufdd0'damage-segment", "\ufdd0'level", "\ufdd0'path-fn", "\ufdd0'from-enemy?"], {"\ufdd0'step":step__80849, "\ufdd0'stride":stride, "\ufdd0'segment":seg_idx, "\ufdd0'damage-segment":seg_idx, "\ufdd0'level":level, "\ufdd0'path-fn":tempest.path.projectile_path_on_level, "\ufdd0'from-enemy?":from_enemy_QMARK___80848})
  };
  var build_projectile = function(level, seg_idx, stride, var_args) {
    var p__80844 = null;
    if(goog.isDef(var_args)) {
      p__80844 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return build_projectile__delegate.call(this, level, seg_idx, stride, p__80844)
  };
  build_projectile.cljs$lang$maxFixedArity = 3;
  build_projectile.cljs$lang$applyTo = function(arglist__80850) {
    var level = cljs.core.first(arglist__80850);
    var seg_idx = cljs.core.first(cljs.core.next(arglist__80850));
    var stride = cljs.core.first(cljs.core.next(cljs.core.next(arglist__80850)));
    var p__80844 = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__80850)));
    return build_projectile__delegate.call(this, level, seg_idx, stride, p__80844)
  };
  return build_projectile
}();
tempest.core.DirectionEnum = cljs.core.ObjMap.fromObject(["NONE", "CW", "CCW"], {"NONE":0, "CW":1, "CCW":2});
tempest.core.EnemyEnum = cljs.core.ObjMap.fromObject(["NONE", "FLIPPER", "TANKER", "SPIKER", "FUSEBALL", "PULSAR"], {"NONE":0, "FLIPPER":1, "TANKER":2, "SPIKER":3, "FUSEBALL":4, "PULSAR":5});
tempest.core.direction_string_from_value = function direction_string_from_value(val) {
  return cljs.core.first.call(null, cljs.core.first.call(null, cljs.core.filter.call(null, function(p1__80851_SHARP_) {
    return cljs.core._EQ_.call(null, val, cljs.core.peek.call(null, p1__80851_SHARP_))
  }, cljs.core.into.call(null, cljs.core.PersistentVector.fromArray([]), tempest.core.DirectionEnum))))
};
tempest.core.build_enemy = function() {
  var build_enemy__delegate = function(level, seg_idx, p__80852) {
    var map__80853__80854 = p__80852;
    var map__80853__80855 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80853__80854)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80853__80854) : map__80853__80854;
    var step__80856 = cljs.core.get.call(null, map__80853__80855, "\ufdd0'step", 0);
    return cljs.core.ObjMap.fromObject(["\ufdd0'flip-dir", "\ufdd0'hits-remaining", "\ufdd0'flip-point", "\ufdd0'stride", "\ufdd0'segment", "\ufdd0'damage-segment", "\ufdd0'flip-probability", "\ufdd0'shoot-probability", "\ufdd0'type", "\ufdd0'flip-stride", "\ufdd0'level", "\ufdd0'step", "\ufdd0'flip-max-angle", "\ufdd0'can-flip", "\ufdd0'flip-cur-angle", "\ufdd0'path-fn"], {"\ufdd0'flip-dir":tempest.core.DirectionEnum.call(null, "NONE"), "\ufdd0'hits-remaining":1, "\ufdd0'flip-point":cljs.core.PersistentVector.fromArray([0, 
    0]), "\ufdd0'stride":1, "\ufdd0'segment":seg_idx, "\ufdd0'damage-segment":seg_idx, "\ufdd0'flip-probability":0, "\ufdd0'shoot-probability":0, "\ufdd0'type":tempest.core.EnemyEnum.call(null, "NONE"), "\ufdd0'flip-stride":1, "\ufdd0'level":level, "\ufdd0'step":step__80856, "\ufdd0'flip-max-angle":0, "\ufdd0'can-flip":false, "\ufdd0'flip-cur-angle":0, "\ufdd0'path-fn":function() {
      return cljs.core.PersistentVector.fromArray([]).call(null)
    }})
  };
  var build_enemy = function(level, seg_idx, var_args) {
    var p__80852 = null;
    if(goog.isDef(var_args)) {
      p__80852 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return build_enemy__delegate.call(this, level, seg_idx, p__80852)
  };
  build_enemy.cljs$lang$maxFixedArity = 2;
  build_enemy.cljs$lang$applyTo = function(arglist__80857) {
    var level = cljs.core.first(arglist__80857);
    var seg_idx = cljs.core.first(cljs.core.next(arglist__80857));
    var p__80852 = cljs.core.rest(cljs.core.next(arglist__80857));
    return build_enemy__delegate.call(this, level, seg_idx, p__80852)
  };
  return build_enemy
}();
tempest.core.build_tanker = function() {
  var build_tanker__delegate = function(level, seg_idx, p__80858) {
    var map__80859__80860 = p__80858;
    var map__80859__80861 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80859__80860)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80859__80860) : map__80859__80860;
    var step__80862 = cljs.core.get.call(null, map__80859__80861, "\ufdd0'step", 0);
    return cljs.core.assoc.call(null, tempest.core.build_enemy.call(null, level, seg_idx, "\ufdd0'step", step__80862), "\ufdd0'type", tempest.core.EnemyEnum.call(null, "TANKER"), "\ufdd0'path-fn", tempest.path.tanker_path_on_level, "\ufdd0'can-flip", false, "\ufdd0'stride", 0.2, "\ufdd0'shoot-probability", 0)
  };
  var build_tanker = function(level, seg_idx, var_args) {
    var p__80858 = null;
    if(goog.isDef(var_args)) {
      p__80858 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return build_tanker__delegate.call(this, level, seg_idx, p__80858)
  };
  build_tanker.cljs$lang$maxFixedArity = 2;
  build_tanker.cljs$lang$applyTo = function(arglist__80863) {
    var level = cljs.core.first(arglist__80863);
    var seg_idx = cljs.core.first(cljs.core.next(arglist__80863));
    var p__80858 = cljs.core.rest(cljs.core.next(arglist__80863));
    return build_tanker__delegate.call(this, level, seg_idx, p__80858)
  };
  return build_tanker
}();
tempest.core.build_spiker = function() {
  var build_spiker__delegate = function(level, seg_idx, p__80864) {
    var map__80865__80866 = p__80864;
    var map__80865__80867 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80865__80866)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80865__80866) : map__80865__80866;
    var step__80868 = cljs.core.get.call(null, map__80865__80867, "\ufdd0'step", 0);
    return cljs.core.assoc.call(null, tempest.core.build_enemy.call(null, level, seg_idx, "\ufdd0'step", step__80868), "\ufdd0'type", tempest.core.EnemyEnum.call(null, "SPIKER"), "\ufdd0'path-fn", tempest.path.spiker_path_on_level, "\ufdd0'can-flip", false, "\ufdd0'stride", 1, "\ufdd0'shoot-probability", 0.0010, "\ufdd0'max-step", cljs.core.rand_int.call(null, "\ufdd0'steps".call(null, level) - 40) + 20)
  };
  var build_spiker = function(level, seg_idx, var_args) {
    var p__80864 = null;
    if(goog.isDef(var_args)) {
      p__80864 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return build_spiker__delegate.call(this, level, seg_idx, p__80864)
  };
  build_spiker.cljs$lang$maxFixedArity = 2;
  build_spiker.cljs$lang$applyTo = function(arglist__80869) {
    var level = cljs.core.first(arglist__80869);
    var seg_idx = cljs.core.first(cljs.core.next(arglist__80869));
    var p__80864 = cljs.core.rest(cljs.core.next(arglist__80869));
    return build_spiker__delegate.call(this, level, seg_idx, p__80864)
  };
  return build_spiker
}();
tempest.core.build_flipper = function() {
  var build_flipper__delegate = function(level, seg_idx, p__80870) {
    var map__80871__80872 = p__80870;
    var map__80871__80873 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80871__80872)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80871__80872) : map__80871__80872;
    var step__80874 = cljs.core.get.call(null, map__80871__80873, "\ufdd0'step", 0);
    return cljs.core.assoc.call(null, tempest.core.build_enemy.call(null, level, seg_idx, "\ufdd0'step", step__80874), "\ufdd0'type", tempest.core.EnemyEnum.call(null, "FLIPPER"), "\ufdd0'path-fn", tempest.path.flipper_path_on_level, "\ufdd0'flip-dir", tempest.core.DirectionEnum.call(null, "NONE"), "\ufdd0'flip-point", cljs.core.PersistentVector.fromArray([0, 0]), "\ufdd0'flip-stride", 1, "\ufdd0'flip-step-count", 20, "\ufdd0'flip-max-angle", 0, "\ufdd0'flip-cur-angle", 0, "\ufdd0'flip-permanent-dir", 
    null, "\ufdd0'flip-probability", 0.015, "\ufdd0'can-flip", true, "\ufdd0'shoot-probability", 0.0040)
  };
  var build_flipper = function(level, seg_idx, var_args) {
    var p__80870 = null;
    if(goog.isDef(var_args)) {
      p__80870 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return build_flipper__delegate.call(this, level, seg_idx, p__80870)
  };
  build_flipper.cljs$lang$maxFixedArity = 2;
  build_flipper.cljs$lang$applyTo = function(arglist__80875) {
    var level = cljs.core.first(arglist__80875);
    var seg_idx = cljs.core.first(cljs.core.next(arglist__80875));
    var p__80870 = cljs.core.rest(cljs.core.next(arglist__80875));
    return build_flipper__delegate.call(this, level, seg_idx, p__80870)
  };
  return build_flipper
}();
tempest.core.projectiles_after_shooting = function projectiles_after_shooting(enemy_list, projectile_list) {
  var G__80877__80879 = enemy_list;
  var vec__80878__80880 = G__80877__80879;
  var enemy__80881 = cljs.core.nth.call(null, vec__80878__80880, 0, null);
  var enemies__80882 = cljs.core.nthnext.call(null, vec__80878__80880, 1);
  var projectiles__80883 = projectile_list;
  var G__80877__80884 = G__80877__80879;
  var projectiles__80885 = projectiles__80883;
  while(true) {
    var vec__80886__80887 = G__80877__80884;
    var enemy__80888 = cljs.core.nth.call(null, vec__80886__80887, 0, null);
    var enemies__80889 = cljs.core.nthnext.call(null, vec__80886__80887, 1);
    var projectiles__80890 = projectiles__80885;
    if(cljs.core.truth_(enemy__80888 === null)) {
      return projectiles__80890
    }else {
      if(cljs.core.truth_(function() {
        var and__3546__auto____80891 = cljs.core.rand.call(null) <= "\ufdd0'shoot-probability".call(null, enemy__80888);
        if(cljs.core.truth_(and__3546__auto____80891)) {
          var and__3546__auto____80892 = cljs.core.not_EQ_.call(null, "\ufdd0'step".call(null, enemy__80888), "\ufdd0'steps".call(null, "\ufdd0'level".call(null, enemy__80888)));
          if(cljs.core.truth_(and__3546__auto____80892)) {
            return"\ufdd0'stride".call(null, enemy__80888) > 0
          }else {
            return and__3546__auto____80892
          }
        }else {
          return and__3546__auto____80891
        }
      }())) {
        var G__80893 = enemies__80889;
        var G__80894 = tempest.core.add_enemy_projectile.call(null, projectiles__80890, enemy__80888);
        G__80877__80884 = G__80893;
        projectiles__80885 = G__80894;
        continue
      }else {
        var G__80895 = enemies__80889;
        var G__80896 = projectiles__80890;
        G__80877__80884 = G__80895;
        projectiles__80885 = G__80896;
        continue
      }
    }
    break
  }
};
tempest.core.maybe_enemies_shoot = function maybe_enemies_shoot(game_state) {
  var enemies__80897 = "\ufdd0'enemy-list".call(null, game_state);
  var projectiles__80898 = "\ufdd0'projectile-list".call(null, game_state);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'projectile-list", tempest.core.projectiles_after_shooting.call(null, enemies__80897, projectiles__80898))
};
tempest.core.maybe_make_enemy = function maybe_make_enemy(game_state) {
  var flipper_fn__80915 = function(game_state__3208__auto__) {
    var level__3209__auto____80902 = "\ufdd0'level".call(null, game_state__3208__auto__);
    var enemy_list__3210__auto____80903 = "\ufdd0'enemy-list".call(null, game_state__3208__auto__);
    var r__3211__auto____80904 = cljs.core.truth_(cljs.core.empty_QMARK_.call(null, enemy_list__3210__auto____80903)) ? cljs.core.rand.call(null) / 2 : cljs.core.rand.call(null);
    var map__80899__80905 = level__3209__auto____80902;
    var map__80899__80906 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80899__80905)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80899__80905) : map__80899__80905;
    var segments__3214__auto____80907 = cljs.core.get.call(null, map__80899__80906, "\ufdd0'segments");
    var map__80900__80908 = cljs.core.get.call(null, map__80899__80906, "\ufdd0'remaining");
    var map__80900__80909 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80900__80908)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80900__80908) : map__80900__80908;
    var more_QMARK___3212__auto____80910 = cljs.core.get.call(null, map__80900__80909, cljs.core.keyword.call(null, "flipper"));
    var map__80901__80911 = cljs.core.get.call(null, map__80899__80906, "\ufdd0'probability");
    var map__80901__80912 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80901__80911)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80901__80911) : map__80901__80911;
    var prob__3213__auto____80913 = cljs.core.get.call(null, map__80901__80912, cljs.core.keyword.call(null, "flipper"));
    if(cljs.core.truth_(function() {
      var and__3546__auto____80914 = r__3211__auto____80904 <= prob__3213__auto____80913;
      if(cljs.core.truth_(and__3546__auto____80914)) {
        return more_QMARK___3212__auto____80910 > 0
      }else {
        return and__3546__auto____80914
      }
    }())) {
      return cljs.core.assoc.call(null, game_state__3208__auto__, "\ufdd0'enemy-list", cljs.core.cons.call(null, tempest.core.build_flipper.call(null, level__3209__auto____80902, cljs.core.rand_int.call(null, cljs.core.count.call(null, segments__3214__auto____80907))), enemy_list__3210__auto____80903), "\ufdd0'level", cljs.core.assoc_in.call(null, level__3209__auto____80902, cljs.core.PersistentVector.fromArray(["\ufdd0'remaining", cljs.core.keyword.call(null, "flipper")]), more_QMARK___3212__auto____80910 - 
      1))
    }else {
      return game_state__3208__auto__
    }
  };
  var tanker_fn__80932 = function(game_state__3208__auto__) {
    var level__3209__auto____80919 = "\ufdd0'level".call(null, game_state__3208__auto__);
    var enemy_list__3210__auto____80920 = "\ufdd0'enemy-list".call(null, game_state__3208__auto__);
    var r__3211__auto____80921 = cljs.core.truth_(cljs.core.empty_QMARK_.call(null, enemy_list__3210__auto____80920)) ? cljs.core.rand.call(null) / 2 : cljs.core.rand.call(null);
    var map__80916__80922 = level__3209__auto____80919;
    var map__80916__80923 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80916__80922)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80916__80922) : map__80916__80922;
    var segments__3214__auto____80924 = cljs.core.get.call(null, map__80916__80923, "\ufdd0'segments");
    var map__80917__80925 = cljs.core.get.call(null, map__80916__80923, "\ufdd0'probability");
    var map__80917__80926 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80917__80925)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80917__80925) : map__80917__80925;
    var prob__3213__auto____80927 = cljs.core.get.call(null, map__80917__80926, cljs.core.keyword.call(null, "tanker"));
    var map__80918__80928 = cljs.core.get.call(null, map__80916__80923, "\ufdd0'remaining");
    var map__80918__80929 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80918__80928)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80918__80928) : map__80918__80928;
    var more_QMARK___3212__auto____80930 = cljs.core.get.call(null, map__80918__80929, cljs.core.keyword.call(null, "tanker"));
    if(cljs.core.truth_(function() {
      var and__3546__auto____80931 = r__3211__auto____80921 <= prob__3213__auto____80927;
      if(cljs.core.truth_(and__3546__auto____80931)) {
        return more_QMARK___3212__auto____80930 > 0
      }else {
        return and__3546__auto____80931
      }
    }())) {
      return cljs.core.assoc.call(null, game_state__3208__auto__, "\ufdd0'enemy-list", cljs.core.cons.call(null, tempest.core.build_tanker.call(null, level__3209__auto____80919, cljs.core.rand_int.call(null, cljs.core.count.call(null, segments__3214__auto____80924))), enemy_list__3210__auto____80920), "\ufdd0'level", cljs.core.assoc_in.call(null, level__3209__auto____80919, cljs.core.PersistentVector.fromArray(["\ufdd0'remaining", cljs.core.keyword.call(null, "tanker")]), more_QMARK___3212__auto____80930 - 
      1))
    }else {
      return game_state__3208__auto__
    }
  };
  var spiker_fn__80949 = function(game_state__3208__auto__) {
    var level__3209__auto____80936 = "\ufdd0'level".call(null, game_state__3208__auto__);
    var enemy_list__3210__auto____80937 = "\ufdd0'enemy-list".call(null, game_state__3208__auto__);
    var r__3211__auto____80938 = cljs.core.truth_(cljs.core.empty_QMARK_.call(null, enemy_list__3210__auto____80937)) ? cljs.core.rand.call(null) / 2 : cljs.core.rand.call(null);
    var map__80933__80939 = level__3209__auto____80936;
    var map__80933__80940 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80933__80939)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80933__80939) : map__80933__80939;
    var segments__3214__auto____80941 = cljs.core.get.call(null, map__80933__80940, "\ufdd0'segments");
    var map__80934__80942 = cljs.core.get.call(null, map__80933__80940, "\ufdd0'remaining");
    var map__80934__80943 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80934__80942)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80934__80942) : map__80934__80942;
    var more_QMARK___3212__auto____80944 = cljs.core.get.call(null, map__80934__80943, cljs.core.keyword.call(null, "spiker"));
    var map__80935__80945 = cljs.core.get.call(null, map__80933__80940, "\ufdd0'probability");
    var map__80935__80946 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80935__80945)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80935__80945) : map__80935__80945;
    var prob__3213__auto____80947 = cljs.core.get.call(null, map__80935__80946, cljs.core.keyword.call(null, "spiker"));
    if(cljs.core.truth_(function() {
      var and__3546__auto____80948 = r__3211__auto____80938 <= prob__3213__auto____80947;
      if(cljs.core.truth_(and__3546__auto____80948)) {
        return more_QMARK___3212__auto____80944 > 0
      }else {
        return and__3546__auto____80948
      }
    }())) {
      return cljs.core.assoc.call(null, game_state__3208__auto__, "\ufdd0'enemy-list", cljs.core.cons.call(null, tempest.core.build_spiker.call(null, level__3209__auto____80936, cljs.core.rand_int.call(null, cljs.core.count.call(null, segments__3214__auto____80941))), enemy_list__3210__auto____80937), "\ufdd0'level", cljs.core.assoc_in.call(null, level__3209__auto____80936, cljs.core.PersistentVector.fromArray(["\ufdd0'remaining", cljs.core.keyword.call(null, "spiker")]), more_QMARK___3212__auto____80944 - 
      1))
    }else {
      return game_state__3208__auto__
    }
  };
  return spiker_fn__80949.call(null, tanker_fn__80932.call(null, flipper_fn__80915.call(null, game_state)))
};
tempest.core.flip_angle_stride = function flip_angle_stride(max_angle, steps, cw_QMARK_) {
  var dir0__80950 = max_angle / steps;
  var dir1__80951 = (max_angle - 6.2831853) / steps;
  var dir2__80952 = (max_angle + 6.2831853) / steps;
  if(cljs.core.truth_(max_angle <= 0)) {
    if(cljs.core.truth_(cw_QMARK_)) {
      return dir0__80950
    }else {
      return dir2__80952
    }
  }else {
    if(cljs.core.truth_("\ufdd0'else")) {
      if(cljs.core.truth_(cw_QMARK_)) {
        return dir1__80951
      }else {
        return dir0__80950
      }
    }else {
      return null
    }
  }
};
tempest.core.mark_flipper_for_flipping = function mark_flipper_for_flipping(flipper, direction, seg_idx, cw_QMARK_) {
  var point__80953 = tempest.path.flip_point_between_segments.call(null, "\ufdd0'level".call(null, flipper), "\ufdd0'segment".call(null, flipper), seg_idx, "\ufdd0'step".call(null, flipper), cw_QMARK_);
  var max_angle__80954 = tempest.path.flip_angle_between_segments.call(null, "\ufdd0'level".call(null, flipper), "\ufdd0'segment".call(null, flipper), seg_idx, cw_QMARK_);
  var step_count__80955 = "\ufdd0'flip-step-count".call(null, flipper);
  var stride__80956 = tempest.core.flip_angle_stride.call(null, max_angle__80954, step_count__80955, cw_QMARK_);
  var permanent__80957 = cljs.core.truth_(cljs.core._EQ_.call(null, "\ufdd0'steps".call(null, "\ufdd0'level".call(null, flipper)), "\ufdd0'step".call(null, flipper))) ? direction : null;
  return cljs.core.assoc.call(null, flipper, "\ufdd0'stride", 0, "\ufdd0'old-stride", "\ufdd0'stride".call(null, flipper), "\ufdd0'flip-dir", direction, "\ufdd0'flip-cur-angle", 0, "\ufdd0'flip-to-segment", seg_idx, "\ufdd0'flip-point", point__80953, "\ufdd0'flip-max-angle", max_angle__80954, "\ufdd0'flip-stride", stride__80956, "\ufdd0'flip-steps-remaining", step_count__80955, "\ufdd0'flip-permanent-dir", permanent__80957)
};
tempest.core.update_entity_stop_flipping = function update_entity_stop_flipping(flipper) {
  return cljs.core.assoc.call(null, flipper, "\ufdd0'stride", "\ufdd0'old-stride".call(null, flipper), "\ufdd0'flip-dir", tempest.core.DirectionEnum.call(null, "NONE"), "\ufdd0'flip-cur-angle", 0, "\ufdd0'segment", "\ufdd0'flip-to-segment".call(null, flipper))
};
tempest.core.random_direction = function random_direction() {
  var pred__80958__80961 = cljs.core._EQ_;
  var expr__80959__80962 = cljs.core.rand_int.call(null, 2);
  if(cljs.core.truth_(pred__80958__80961.call(null, 0, expr__80959__80962))) {
    return tempest.core.DirectionEnum.call(null, "CW")
  }else {
    return tempest.core.DirectionEnum.call(null, "CCW")
  }
};
tempest.core.segment_for_flip_direction = function segment_for_flip_direction(flipper, flip_dir) {
  var pred__80963__80966 = cljs.core._EQ_;
  var expr__80964__80967 = flip_dir;
  if(cljs.core.truth_(pred__80963__80966.call(null, tempest.core.DirectionEnum.call(null, "CW"), expr__80964__80967))) {
    return tempest.core.segment_entity_cw.call(null, flipper)
  }else {
    return tempest.core.segment_entity_ccw.call(null, flipper)
  }
};
tempest.core.swap_flipper_permanent_dir = function swap_flipper_permanent_dir(flipper) {
  var cur_dir__80968 = "\ufdd0'flip-permanent-dir".call(null, flipper);
  var new_dir__80969 = cljs.core.truth_(cljs.core._EQ_.call(null, tempest.core.DirectionEnum.call(null, "CW"), cur_dir__80968)) ? tempest.core.DirectionEnum.call(null, "CCW") : tempest.core.DirectionEnum.call(null, "CW");
  return cljs.core.assoc.call(null, flipper, "\ufdd0'flip-permanent-dir", new_dir__80969)
};
tempest.core.engage_flipping = function engage_flipping(flipper, flip_dir) {
  var flip_seg_idx__80970 = tempest.core.segment_for_flip_direction.call(null, flipper, flip_dir);
  var cw_QMARK___80971 = cljs.core._EQ_.call(null, flip_dir, tempest.core.DirectionEnum.call(null, "CW"));
  if(cljs.core.truth_(cljs.core.not_EQ_.call(null, flip_seg_idx__80970, "\ufdd0'segment".call(null, flipper)))) {
    return tempest.core.mark_flipper_for_flipping.call(null, flipper, flip_dir, flip_seg_idx__80970, cw_QMARK___80971)
  }else {
    return flipper
  }
};
tempest.core.maybe_engage_flipping = function maybe_engage_flipping(flipper) {
  var should_flip__80975 = function() {
    var and__3546__auto____80972 = "\ufdd0'can-flip".call(null, flipper) === true;
    if(cljs.core.truth_(and__3546__auto____80972)) {
      var and__3546__auto____80973 = cljs.core._EQ_.call(null, "\ufdd0'flip-dir".call(null, flipper), tempest.core.DirectionEnum.call(null, "NONE"));
      if(cljs.core.truth_(and__3546__auto____80973)) {
        var or__3548__auto____80974 = cljs.core.rand.call(null) <= "\ufdd0'flip-probability".call(null, flipper);
        if(cljs.core.truth_(or__3548__auto____80974)) {
          return or__3548__auto____80974
        }else {
          return cljs.core._EQ_.call(null, "\ufdd0'step".call(null, flipper), "\ufdd0'steps".call(null, "\ufdd0'level".call(null, flipper)))
        }
      }else {
        return and__3546__auto____80973
      }
    }else {
      return and__3546__auto____80972
    }
  }();
  var permanent_dir__80976 = "\ufdd0'flip-permanent-dir".call(null, flipper);
  var flip_dir__80978 = function() {
    var or__3548__auto____80977 = permanent_dir__80976;
    if(cljs.core.truth_(or__3548__auto____80977)) {
      return or__3548__auto____80977
    }else {
      return tempest.core.random_direction.call(null)
    }
  }();
  var flip_seg_idx__80979 = tempest.core.segment_for_flip_direction.call(null, flipper, flip_dir__80978);
  var cw_QMARK___80980 = cljs.core._EQ_.call(null, flip_dir__80978, tempest.core.DirectionEnum.call(null, "CW"));
  if(cljs.core.truth_(should_flip__80975 === false)) {
    return flipper
  }else {
    if(cljs.core.truth_(cljs.core.not_EQ_.call(null, flip_seg_idx__80979, "\ufdd0'segment".call(null, flipper)))) {
      return tempest.core.mark_flipper_for_flipping.call(null, flipper, flip_dir__80978, flip_seg_idx__80979, cw_QMARK___80980)
    }else {
      if(cljs.core.truth_(cljs.core.not.call(null, permanent_dir__80976 === null))) {
        return tempest.core.swap_flipper_permanent_dir.call(null, flipper)
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          return flipper
        }else {
          return null
        }
      }
    }
  }
};
tempest.core.mark_player_captured = function mark_player_captured(player) {
  return cljs.core.assoc.call(null, player, "\ufdd0'captured?", true, "\ufdd0'stride", -4)
};
tempest.core.mark_enemy_capturing = function mark_enemy_capturing(enemy) {
  return cljs.core.assoc.call(null, enemy, "\ufdd0'capturing", true, "\ufdd0'can-flip", false, "\ufdd0'step", "\ufdd0'step".call(null, enemy) - 10, "\ufdd0'stride", -4)
};
tempest.core.enemy_is_on_player_QMARK_ = function enemy_is_on_player_QMARK_(player, enemy) {
  var and__3546__auto____80981 = cljs.core._EQ_.call(null, "\ufdd0'segment".call(null, player), "\ufdd0'segment".call(null, enemy));
  if(cljs.core.truth_(and__3546__auto____80981)) {
    var and__3546__auto____80982 = cljs.core._EQ_.call(null, "\ufdd0'step".call(null, player), "\ufdd0'step".call(null, enemy));
    if(cljs.core.truth_(and__3546__auto____80982)) {
      return cljs.core._EQ_.call(null, tempest.core.DirectionEnum.call(null, "NONE"), "\ufdd0'flip-dir".call(null, enemy))
    }else {
      return and__3546__auto____80982
    }
  }else {
    return and__3546__auto____80981
  }
};
tempest.core.player_and_enemies_if_captured = function player_and_enemies_if_captured(player, enemy_list) {
  var map__80983__80984 = cljs.core.group_by.call(null, cljs.core.partial.call(null, tempest.core.enemy_is_on_player_QMARK_, player), enemy_list);
  var map__80983__80985 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80983__80984)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80983__80984) : map__80983__80984;
  var colliders__80986 = cljs.core.get.call(null, map__80983__80985, true);
  var missers__80987 = cljs.core.get.call(null, map__80983__80985, false);
  var temp__3698__auto____80988 = colliders__80986;
  if(cljs.core.truth_(temp__3698__auto____80988)) {
    var vec__80989__80990 = temp__3698__auto____80988;
    var enemy__80991 = cljs.core.nth.call(null, vec__80989__80990, 0, null);
    var rest__80992 = cljs.core.nthnext.call(null, vec__80989__80990, 1);
    return cljs.core.PersistentVector.fromArray([tempest.core.mark_player_captured.call(null, player), cljs.core.cons.call(null, tempest.core.mark_enemy_capturing.call(null, enemy__80991), cljs.core.concat.call(null, missers__80987, rest__80992))])
  }else {
    return null
  }
};
tempest.core.check_if_player_captured = function check_if_player_captured(game_state) {
  if(cljs.core.truth_("\ufdd0'captured?".call(null, "\ufdd0'player".call(null, game_state)))) {
    return game_state
  }else {
    var temp__3695__auto____80993 = tempest.core.player_and_enemies_if_captured.call(null, "\ufdd0'player".call(null, game_state), "\ufdd0'enemy-list".call(null, game_state));
    if(cljs.core.truth_(temp__3695__auto____80993)) {
      var vec__80994__80995 = temp__3695__auto____80993;
      var player__80996 = cljs.core.nth.call(null, vec__80994__80995, 0, null);
      var enemy_list__80997 = cljs.core.nth.call(null, vec__80994__80995, 1, null);
      return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", enemy_list__80997, "\ufdd0'player", player__80996)
    }else {
      return game_state
    }
  }
};
tempest.core.update_entity_is_flipping = function update_entity_is_flipping(game_state) {
  var map__80998__80999 = game_state;
  var map__80998__81000 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80998__80999)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80998__80999) : map__80998__80999;
  var enemy_list__81001 = cljs.core.get.call(null, map__80998__81000, "\ufdd0'enemy-list");
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", cljs.core.map.call(null, tempest.core.maybe_engage_flipping, enemy_list__81001))
};
tempest.core.update_entity_flippyness = function update_entity_flippyness(game_state) {
  var map__81002__81003 = game_state;
  var map__81002__81004 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81002__81003)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81002__81003) : map__81002__81003;
  var enemy_list__81005 = cljs.core.get.call(null, map__81002__81004, "\ufdd0'enemy-list");
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", cljs.core.map.call(null, tempest.core.update_flip_angle, enemy_list__81005))
};
tempest.core.update_flip_angle = function update_flip_angle(flipper) {
  var new_angle__81006 = "\ufdd0'flip-stride".call(null, flipper) + "\ufdd0'flip-cur-angle".call(null, flipper);
  var remaining__81007 = "\ufdd0'flip-steps-remaining".call(null, flipper) - 1;
  var new_seg__81008 = cljs.core.truth_(remaining__81007 <= "\ufdd0'flip-step-count".call(null, flipper) / 2) ? "\ufdd0'flip-to-segment".call(null, flipper) : "\ufdd0'segment".call(null, flipper);
  if(cljs.core.truth_(cljs.core.not_EQ_.call(null, "\ufdd0'flip-dir".call(null, flipper), tempest.core.DirectionEnum.call(null, "NONE")))) {
    if(cljs.core.truth_(remaining__81007 < 0)) {
      return tempest.core.update_entity_stop_flipping.call(null, flipper)
    }else {
      return cljs.core.assoc.call(null, flipper, "\ufdd0'damage-segment", new_seg__81008, "\ufdd0'flip-cur-angle", new_angle__81006, "\ufdd0'flip-steps-remaining", remaining__81007)
    }
  }else {
    return flipper
  }
};
tempest.core.build_player = function build_player(level, seg_idx) {
  return cljs.core.ObjMap.fromObject(["\ufdd0'segment", "\ufdd0'level", "\ufdd0'captured?", "\ufdd0'step", "\ufdd0'bullet-stride", "\ufdd0'stride", "\ufdd0'path", "\ufdd0'is-dead?"], {"\ufdd0'segment":seg_idx, "\ufdd0'level":level, "\ufdd0'captured?":false, "\ufdd0'step":"\ufdd0'steps".call(null, level), "\ufdd0'bullet-stride":-5, "\ufdd0'stride":0, "\ufdd0'path":tempest.path._STAR_player_path_STAR_, "\ufdd0'is-dead?":false})
};
tempest.core.entity_next_step = function entity_next_step(entity) {
  var stride__81009 = "\ufdd0'stride".call(null, entity);
  var maxstep__81010 = "\ufdd0'steps".call(null, "\ufdd0'level".call(null, entity));
  var newstep__81011 = stride__81009 + "\ufdd0'step".call(null, entity);
  if(cljs.core.truth_(newstep__81011 > maxstep__81010)) {
    return maxstep__81010
  }else {
    if(cljs.core.truth_(newstep__81011 < 0)) {
      return 0
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return newstep__81011
      }else {
        return null
      }
    }
  }
};
tempest.core.update_entity_position_BANG_ = function update_entity_position_BANG_(entity) {
  return cljs.core.assoc.call(null, entity, "\ufdd0'step", tempest.core.entity_next_step.call(null, entity))
};
tempest.core.update_entity_list_positions = function update_entity_list_positions(entity_list) {
  return cljs.core.map.call(null, tempest.core.update_entity_position_BANG_, entity_list)
};
tempest.core.update_entity_direction_BANG_ = function update_entity_direction_BANG_(entity) {
  var map__81013__81014 = entity;
  var map__81013__81015 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81013__81014)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81013__81014) : map__81013__81014;
  var stride__81016 = cljs.core.get.call(null, map__81013__81015, "\ufdd0'stride");
  var max_step__81017 = cljs.core.get.call(null, map__81013__81015, "\ufdd0'max-step");
  var step__81018 = cljs.core.get.call(null, map__81013__81015, "\ufdd0'step");
  var newstride__81019 = cljs.core.truth_(step__81018 >= max_step__81017) ? -stride__81016 : stride__81016;
  return cljs.core.assoc.call(null, entity, "\ufdd0'stride", newstride__81019)
};
tempest.core.update_entity_list_directions = function update_entity_list_directions(entity_list) {
  var map__81020__81021 = cljs.core.group_by.call(null, function(p1__81012_SHARP_) {
    return cljs.core.contains_QMARK_.call(null, p1__81012_SHARP_, "\ufdd0'max-step")
  }, entity_list);
  var map__81020__81022 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81020__81021)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81020__81021) : map__81020__81021;
  var spikers__81023 = cljs.core.get.call(null, map__81020__81022, true);
  var others__81024 = cljs.core.get.call(null, map__81020__81022, false);
  return cljs.core.concat.call(null, others__81024, cljs.core.map.call(null, tempest.core.update_entity_direction_BANG_, spikers__81023))
};
tempest.core.entity_between_steps = function entity_between_steps(seg_idx, step0, step1, entity) {
  var min__81025 = step0 < step1 ? step0 : step1;
  var max__81026 = step0 > step1 ? step0 : step1;
  var and__3546__auto____81027 = cljs.core._EQ_.call(null, "\ufdd0'damage-segment".call(null, entity), seg_idx);
  if(cljs.core.truth_(and__3546__auto____81027)) {
    var and__3546__auto____81028 = "\ufdd0'step".call(null, entity) >= min__81025;
    if(cljs.core.truth_(and__3546__auto____81028)) {
      return"\ufdd0'step".call(null, entity) <= max__81026
    }else {
      return and__3546__auto____81028
    }
  }else {
    return and__3546__auto____81027
  }
};
tempest.core.projectiles_after_collision = function projectiles_after_collision(entity, projectile_list) {
  return function(entity, projectiles_in, projectiles_out, was_hit_QMARK_) {
    while(true) {
      if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, projectiles_in))) {
        return cljs.core.ObjMap.fromObject(["\ufdd0'entity", "\ufdd0'projectiles", "\ufdd0'was-hit?"], {"\ufdd0'entity":entity, "\ufdd0'projectiles":projectiles_out, "\ufdd0'was-hit?":was_hit_QMARK_})
      }else {
        var bullet__81029 = cljs.core.first.call(null, projectiles_in);
        var collision_QMARK___81030 = tempest.core.entity_between_steps.call(null, "\ufdd0'segment".call(null, bullet__81029), "\ufdd0'step".call(null, bullet__81029) + 1, tempest.core.entity_next_step.call(null, bullet__81029) - 1, entity);
        if(cljs.core.truth_(function() {
          var and__3546__auto____81031 = cljs.core.not.call(null, "\ufdd0'from-enemy?".call(null, bullet__81029));
          if(cljs.core.truth_(and__3546__auto____81031)) {
            return collision_QMARK___81030
          }else {
            return and__3546__auto____81031
          }
        }())) {
          var G__81032 = tempest.core.decrement_enemy_hits.call(null, entity);
          var G__81033 = null;
          var G__81034 = cljs.core.concat.call(null, projectiles_out, cljs.core.rest.call(null, projectiles_in));
          var G__81035 = true;
          entity = G__81032;
          projectiles_in = G__81033;
          projectiles_out = G__81034;
          was_hit_QMARK_ = G__81035;
          continue
        }else {
          var G__81036 = entity;
          var G__81037 = cljs.core.rest.call(null, projectiles_in);
          var G__81038 = cljs.core.cons.call(null, bullet__81029, projectiles_out);
          var G__81039 = was_hit_QMARK_;
          entity = G__81036;
          projectiles_in = G__81037;
          projectiles_out = G__81038;
          was_hit_QMARK_ = G__81039;
          continue
        }
      }
      break
    }
  }.call(null, entity, projectile_list, cljs.core.List.EMPTY, false)
};
tempest.core.entities_after_collisions = function entities_after_collisions(entity_list, projectile_list) {
  return function(entities_in, entities_out, projectiles_in) {
    while(true) {
      if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, entities_in))) {
        return cljs.core.ObjMap.fromObject(["\ufdd0'entities", "\ufdd0'projectiles"], {"\ufdd0'entities":entities_out, "\ufdd0'projectiles":projectiles_in})
      }else {
        var map__81040__81041 = tempest.core.projectiles_after_collision.call(null, cljs.core.first.call(null, entities_in), projectiles_in);
        var map__81040__81042 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81040__81041)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81040__81041) : map__81040__81041;
        var entity__81043 = cljs.core.get.call(null, map__81040__81042, "\ufdd0'entity");
        var projectiles__81044 = cljs.core.get.call(null, map__81040__81042, "\ufdd0'projectiles");
        var was_hit_QMARK___81045 = cljs.core.get.call(null, map__81040__81042, "\ufdd0'was-hit?");
        var G__81046 = cljs.core.rest.call(null, entities_in);
        var G__81047 = cljs.core.cons.call(null, entity__81043, entities_out);
        var G__81048 = projectiles__81044;
        entities_in = G__81046;
        entities_out = G__81047;
        projectiles_in = G__81048;
        continue
      }
      break
    }
  }.call(null, entity_list, cljs.core.List.EMPTY, projectile_list)
};
tempest.core.new_flippers_from_tanker = function new_flippers_from_tanker(enemy) {
  var map__81050__81051 = enemy;
  var map__81050__81052 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81050__81051)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81050__81051) : map__81050__81051;
  var step__81053 = cljs.core.get.call(null, map__81050__81052, "\ufdd0'step");
  var level__81054 = cljs.core.get.call(null, map__81050__81052, "\ufdd0'level");
  var segment__81055 = cljs.core.get.call(null, map__81050__81052, "\ufdd0'segment");
  return cljs.core.list.call(null, tempest.core.engage_flipping.call(null, tempest.core.build_flipper.call(null, level__81054, segment__81055, "\ufdd0'step", step__81053), tempest.core.DirectionEnum.call(null, "CW")), tempest.core.engage_flipping.call(null, tempest.core.build_flipper.call(null, level__81054, segment__81055, "\ufdd0'step", step__81053), tempest.core.DirectionEnum.call(null, "CCW")))
};
tempest.core.enemy_list_after_deaths = function enemy_list_after_deaths(enemy_list) {
  var map__81056__81057 = cljs.core.group_by.call(null, function(p1__81049_SHARP_) {
    return"\ufdd0'hits-remaining".call(null, p1__81049_SHARP_) === 0
  }, enemy_list);
  var map__81056__81058 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81056__81057)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81056__81057) : map__81056__81057;
  var live_enemies__81059 = cljs.core.get.call(null, map__81056__81058, false);
  var dead_enemies__81060 = cljs.core.get.call(null, map__81056__81058, true);
  var G__81062__81064 = dead_enemies__81060;
  var vec__81063__81065 = G__81062__81064;
  var enemy__81066 = cljs.core.nth.call(null, vec__81063__81065, 0, null);
  var enemies__81067 = cljs.core.nthnext.call(null, vec__81063__81065, 1);
  var enemies_out__81068 = cljs.core.List.EMPTY;
  var G__81062__81069 = G__81062__81064;
  var enemies_out__81070 = enemies_out__81068;
  while(true) {
    var vec__81071__81072 = G__81062__81069;
    var enemy__81073 = cljs.core.nth.call(null, vec__81071__81072, 0, null);
    var enemies__81074 = cljs.core.nthnext.call(null, vec__81071__81072, 1);
    var enemies_out__81075 = enemies_out__81070;
    if(cljs.core.truth_(enemy__81073 === null)) {
      return cljs.core.concat.call(null, live_enemies__81059, enemies_out__81075)
    }else {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, "\ufdd0'type".call(null, enemy__81073), tempest.core.EnemyEnum.call(null, "TANKER")))) {
        var G__81076 = enemies__81074;
        var G__81077 = cljs.core.concat.call(null, tempest.core.new_flippers_from_tanker.call(null, enemy__81073), enemies_out__81075);
        G__81062__81069 = G__81076;
        enemies_out__81070 = G__81077;
        continue
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          var G__81078 = enemies__81074;
          var G__81079 = enemies_out__81075;
          G__81062__81069 = G__81078;
          enemies_out__81070 = G__81079;
          continue
        }else {
          return null
        }
      }
    }
    break
  }
};
tempest.core.handle_dead_enemies = function handle_dead_enemies(game_state) {
  var enemy_list__81081 = "\ufdd0'enemy-list".call(null, game_state);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", tempest.core.enemy_list_after_deaths.call(null, enemy_list__81081))
};
tempest.core.enemy_list_after_exiting_spikers = function enemy_list_after_exiting_spikers(enemy_list) {
  var map__81082__81083 = cljs.core.group_by.call(null, function(p1__81080_SHARP_) {
    return cljs.core._EQ_.call(null, "\ufdd0'type".call(null, p1__81080_SHARP_), tempest.core.EnemyEnum.call(null, "SPIKER"))
  }, enemy_list);
  var map__81082__81084 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81082__81083)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81082__81083) : map__81082__81083;
  var spikers__81085 = cljs.core.get.call(null, map__81082__81084, true);
  var others__81086 = cljs.core.get.call(null, map__81082__81084, false);
  var G__81088__81090 = spikers__81085;
  var vec__81089__81091 = G__81088__81090;
  var enemy__81092 = cljs.core.nth.call(null, vec__81089__81091, 0, null);
  var enemies__81093 = cljs.core.nthnext.call(null, vec__81089__81091, 1);
  var enemies_out__81094 = cljs.core.List.EMPTY;
  var G__81088__81095 = G__81088__81090;
  var enemies_out__81096 = enemies_out__81094;
  while(true) {
    var vec__81097__81098 = G__81088__81095;
    var enemy__81099 = cljs.core.nth.call(null, vec__81097__81098, 0, null);
    var enemies__81100 = cljs.core.nthnext.call(null, vec__81097__81098, 1);
    var enemies_out__81101 = enemies_out__81096;
    if(cljs.core.truth_(enemy__81099 === null)) {
      return cljs.core.concat.call(null, others__81086, enemies_out__81101)
    }else {
      if(cljs.core.truth_(function() {
        var and__3546__auto____81102 = "\ufdd0'stride".call(null, enemy__81099) < 0;
        if(cljs.core.truth_(and__3546__auto____81102)) {
          return"\ufdd0'step".call(null, enemy__81099) === 0
        }else {
          return and__3546__auto____81102
        }
      }())) {
        var G__81103 = enemies__81100;
        var G__81104 = enemies_out__81101;
        G__81088__81095 = G__81103;
        enemies_out__81096 = G__81104;
        continue
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          var G__81105 = enemies__81100;
          var G__81106 = cljs.core.cons.call(null, enemy__81099, enemies_out__81101);
          G__81088__81095 = G__81105;
          enemies_out__81096 = G__81106;
          continue
        }else {
          return null
        }
      }
    }
    break
  }
};
tempest.core.handle_exiting_spikers = function handle_exiting_spikers(game_state) {
  var enemy_list__81107 = "\ufdd0'enemy-list".call(null, game_state);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", tempest.core.enemy_list_after_exiting_spikers.call(null, enemy_list__81107))
};
tempest.core.spikes_after_spike_laying = function spikes_after_spike_laying(enemy_list, spikes) {
  var G__81110__81112 = enemy_list;
  var vec__81111__81113 = G__81110__81112;
  var enemy__81114 = cljs.core.nth.call(null, vec__81111__81113, 0, null);
  var enemies__81115 = cljs.core.nthnext.call(null, vec__81111__81113, 1);
  var spikes_out__81116 = spikes;
  var G__81110__81117 = G__81110__81112;
  var spikes_out__81118 = spikes_out__81116;
  while(true) {
    var vec__81119__81120 = G__81110__81117;
    var enemy__81121 = cljs.core.nth.call(null, vec__81119__81120, 0, null);
    var enemies__81122 = cljs.core.nthnext.call(null, vec__81119__81120, 1);
    var spikes_out__81123 = spikes_out__81118;
    var map__81124__81125 = enemy__81121;
    var map__81124__81126 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81124__81125)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81124__81125) : map__81124__81125;
    var segment__81127 = cljs.core.get.call(null, map__81124__81126, "\ufdd0'segment");
    var step__81128 = cljs.core.get.call(null, map__81124__81126, "\ufdd0'step");
    var spike_step__81129 = cljs.core.nth.call(null, spikes_out__81123, segment__81127);
    if(cljs.core.truth_(enemy__81121 === null)) {
      return spikes_out__81123
    }else {
      if(cljs.core.truth_(step__81128 >= spike_step__81129)) {
        var G__81130 = enemies__81122;
        var G__81131 = cljs.core.assoc.call(null, spikes_out__81123, segment__81127, step__81128);
        G__81110__81117 = G__81130;
        spikes_out__81118 = G__81131;
        continue
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          var G__81132 = enemies__81122;
          var G__81133 = spikes_out__81123;
          G__81110__81117 = G__81132;
          spikes_out__81118 = G__81133;
          continue
        }else {
          return null
        }
      }
    }
    break
  }
};
tempest.core.handle_spike_laying = function handle_spike_laying(game_state) {
  var enemy_list__81134 = "\ufdd0'enemy-list".call(null, game_state);
  var spikes__81135 = "\ufdd0'spikes".call(null, game_state);
  var spiker_list__81136 = cljs.core.filter.call(null, function(p1__81108_SHARP_) {
    return cljs.core._EQ_.call(null, "\ufdd0'type".call(null, p1__81108_SHARP_), tempest.core.EnemyEnum.call(null, "SPIKER"))
  }, enemy_list__81134);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'spikes", tempest.core.spikes_after_spike_laying.call(null, spiker_list__81136, spikes__81135))
};
tempest.core.kill_tanker_at_top = function kill_tanker_at_top(tanker) {
  var step__81138 = "\ufdd0'step".call(null, tanker);
  var maxstep__81139 = "\ufdd0'steps".call(null, "\ufdd0'level".call(null, tanker));
  if(cljs.core.truth_(cljs.core._EQ_.call(null, step__81138, maxstep__81139))) {
    return cljs.core.assoc.call(null, tanker, "\ufdd0'hits-remaining", 0)
  }else {
    return tanker
  }
};
tempest.core.maybe_split_tankers = function maybe_split_tankers(game_state) {
  var enemy_list__81141 = "\ufdd0'enemy-list".call(null, game_state);
  var map__81140__81142 = cljs.core.group_by.call(null, function(p1__81137_SHARP_) {
    return cljs.core._EQ_.call(null, "\ufdd0'type".call(null, p1__81137_SHARP_), tempest.core.EnemyEnum.call(null, "TANKER"))
  }, enemy_list__81141);
  var map__81140__81143 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81140__81142)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81140__81142) : map__81140__81142;
  var tankers__81144 = cljs.core.get.call(null, map__81140__81143, true);
  var others__81145 = cljs.core.get.call(null, map__81140__81143, false);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", cljs.core.concat.call(null, cljs.core.map.call(null, tempest.core.kill_tanker_at_top, tankers__81144), others__81145))
};
tempest.core.mark_player_if_spiked = function mark_player_if_spiked(game_state) {
  var map__81146__81147 = game_state;
  var map__81146__81148 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81146__81147)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81146__81147) : map__81146__81147;
  var player__81149 = cljs.core.get.call(null, map__81146__81148, "\ufdd0'player");
  var spikes__81150 = cljs.core.get.call(null, map__81146__81148, "\ufdd0'spikes");
  var step__81151 = "\ufdd0'step".call(null, player__81149);
  var segment__81152 = "\ufdd0'segment".call(null, player__81149);
  var spike_len__81153 = cljs.core.nth.call(null, spikes__81150, segment__81152);
  if(cljs.core.truth_(spike_len__81153 === 0)) {
    return game_state
  }else {
    if(cljs.core.truth_(step__81151 <= spike_len__81153)) {
      return cljs.core.assoc.call(null, game_state, "\ufdd0'player", cljs.core.assoc.call(null, player__81149, "\ufdd0'is-dead?", true), "\ufdd0'is-zooming?", true, "\ufdd0'zoom-in?", false, "\ufdd0'player-zooming?", false)
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return game_state
      }else {
        return null
      }
    }
  }
};
tempest.core.animate_player_shooping = function animate_player_shooping(game_state) {
  var player__81154 = "\ufdd0'player".call(null, game_state);
  var level__81155 = "\ufdd0'level".call(null, game_state);
  var zoom__81156 = "\ufdd0'zoom".call(null, game_state);
  if(cljs.core.truth_("\ufdd0'level-done?".call(null, game_state))) {
    return game_state
  }else {
    if(cljs.core.truth_(zoom__81156 >= 10)) {
      return cljs.core.assoc.call(null, game_state, "\ufdd0'level-done?", true)
    }else {
      if(cljs.core.truth_("\ufdd0'step".call(null, player__81154) === 0)) {
        return cljs.core.assoc.call(null, game_state, "\ufdd0'zoom", zoom__81156 + 0.2)
      }else {
        if(cljs.core.truth_("\ufdd0'else")) {
          return cljs.core.assoc.call(null, game_state, "\ufdd0'player", tempest.core.update_entity_position_BANG_.call(null, player__81154), "\ufdd0'zoom", 1 + ("\ufdd0'steps".call(null, level__81155) - "\ufdd0'step".call(null, player__81154)) / 150, "\ufdd0'is-zooming?", true, "\ufdd0'zoom-in?", false)
        }else {
          return null
        }
      }
    }
  }
};
tempest.core.animate_player_capture = function animate_player_capture(game_state) {
  var player__81157 = "\ufdd0'player".call(null, game_state);
  var captured_QMARK___81158 = "\ufdd0'captured?".call(null, player__81157);
  var isdead_QMARK___81159 = "\ufdd0'step".call(null, player__81157) === 0;
  if(cljs.core.truth_(captured_QMARK___81158 === false)) {
    return game_state
  }else {
    if(cljs.core.truth_(isdead_QMARK___81159 === true)) {
      return cljs.core.assoc.call(null, tempest.core.clear_level_entities.call(null, game_state), "\ufdd0'player", cljs.core.assoc.call(null, player__81157, "\ufdd0'is-dead?", true), "\ufdd0'is-zooming?", true, "\ufdd0'zoom-in?", false)
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return cljs.core.assoc.call(null, game_state, "\ufdd0'player", tempest.core.update_entity_position_BANG_.call(null, player__81157))
      }else {
        return null
      }
    }
  }
};
tempest.core.clear_level_entities = function clear_level_entities(game_state) {
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", cljs.core.List.EMPTY, "\ufdd0'projectile-list", cljs.core.List.EMPTY, "\ufdd0'spikes", cljs.core.PersistentVector.fromArray([]))
};
tempest.core.update_zoom = function update_zoom(game_state) {
  var zoom__81160 = "\ufdd0'zoom".call(null, game_state);
  var zoom_in_QMARK___81161 = "\ufdd0'zoom-in?".call(null, game_state);
  var zoom_step__81162 = 0.04;
  var newzoom__81163 = cljs.core.truth_(zoom_in_QMARK___81161) ? zoom__81160 + zoom_step__81162 : zoom__81160 - zoom_step__81162;
  var target__81164 = cljs.core.truth_(zoom_in_QMARK___81161) ? 1 : 0;
  var cmp__81165 = cljs.core.truth_(zoom_in_QMARK___81161) ? cljs.core._GT__EQ_ : cljs.core._LT__EQ_;
  if(cljs.core.truth_(cmp__81165.call(null, zoom__81160, target__81164))) {
    return cljs.core.assoc.call(null, game_state, "\ufdd0'is-zooming?", false, "\ufdd0'level-done?", cljs.core.not.call(null, zoom_in_QMARK___81161))
  }else {
    if(cljs.core.truth_(cmp__81165.call(null, newzoom__81163, target__81164))) {
      return cljs.core.assoc.call(null, game_state, "\ufdd0'zoom", target__81164)
    }else {
      return cljs.core.assoc.call(null, game_state, "\ufdd0'zoom", newzoom__81163)
    }
  }
};
tempest.core.clear_player_segment = function clear_player_segment(game_state) {
  "\ufdd0'bgcontext".call(null, game_state).lineWidth = 2;
  tempest.draw.draw_player_segment.call(null, game_state, cljs.core.ObjMap.fromObject(["\ufdd0'r", "\ufdd0'g", "\ufdd0'b"], {"\ufdd0'r":0, "\ufdd0'g":0, "\ufdd0'b":0}));
  "\ufdd0'bgcontext".call(null, game_state).lineWidth = 1.5;
  tempest.draw.draw_player_segment.call(null, game_state, cljs.core.ObjMap.fromObject(["\ufdd0'r", "\ufdd0'g", "\ufdd0'b"], {"\ufdd0'r":10, "\ufdd0'g":10, "\ufdd0'b":100}));
  return game_state
};
tempest.core.highlight_player_segment = function highlight_player_segment(game_state) {
  "\ufdd0'bgcontext".call(null, game_state).lineWidth = 1;
  tempest.draw.draw_player_segment.call(null, game_state, cljs.core.ObjMap.fromObject(["\ufdd0'r", "\ufdd0'g", "\ufdd0'b"], {"\ufdd0'r":150, "\ufdd0'g":150, "\ufdd0'b":15}));
  return game_state
};
tempest.core.draw_board = function draw_board(game_state) {
  var is_zooming_QMARK___81167 = "\ufdd0'is-zooming?".call(null, game_state);
  var zoom__81168 = "\ufdd0'zoom".call(null, game_state);
  var map__81166__81169 = "\ufdd0'dims".call(null, game_state);
  var map__81166__81170 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81166__81169)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81166__81169) : map__81166__81169;
  var width__81171 = cljs.core.get.call(null, map__81166__81170, "\ufdd0'width");
  var height__81172 = cljs.core.get.call(null, map__81166__81170, "\ufdd0'height");
  if(cljs.core.truth_(is_zooming_QMARK___81167)) {
    tempest.draw.clear_context.call(null, "\ufdd0'bgcontext".call(null, game_state), "\ufdd0'dims".call(null, game_state));
    tempest.draw.draw_board.call(null, cljs.core.assoc.call(null, game_state, "\ufdd0'dims", cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":width__81171 / zoom__81168, "\ufdd0'height":height__81172 / zoom__81168})));
    if(cljs.core.truth_("\ufdd0'player-zooming?".call(null, game_state))) {
      return game_state
    }else {
      return tempest.core.update_zoom.call(null, game_state)
    }
  }else {
    return game_state
  }
};
tempest.core.collisions_with_projectile = function collisions_with_projectile(enemy_list, bullet) {
  return cljs.core.group_by.call(null, cljs.core.partial.call(null, tempest.core.entity_between_steps, "\ufdd0'segment".call(null, bullet), "\ufdd0'step".call(null, bullet), tempest.core.entity_next_step.call(null, bullet)), enemy_list)
};
tempest.core.decrement_enemy_hits = function decrement_enemy_hits(enemy) {
  return cljs.core.assoc.call(null, enemy, "\ufdd0'hits-remaining", "\ufdd0'hits-remaining".call(null, enemy) - 1)
};
tempest.core.projectile_off_level_QMARK_ = function projectile_off_level_QMARK_(projectile) {
  if(cljs.core.truth_("\ufdd0'step".call(null, projectile) === 0)) {
    return true
  }else {
    if(cljs.core.truth_("\ufdd0'step".call(null, projectile) >= "\ufdd0'steps".call(null, "\ufdd0'level".call(null, projectile)))) {
      return true
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        return false
      }else {
        return null
      }
    }
  }
};
tempest.core.add_enemy_projectile = function add_enemy_projectile(projectile_list, enemy) {
  var level__81173 = "\ufdd0'level".call(null, enemy);
  var seg_idx__81174 = "\ufdd0'segment".call(null, enemy);
  var stride__81175 = "\ufdd0'stride".call(null, enemy) + 2;
  var step__81176 = "\ufdd0'step".call(null, enemy);
  return cljs.core.conj.call(null, projectile_list, tempest.core.build_projectile.call(null, level__81173, seg_idx__81174, stride__81175, "\ufdd0'step", step__81176, "\ufdd0'from-enemy?", true))
};
tempest.core.add_player_projectile = function add_player_projectile(projectile_list, player) {
  var level__81177 = "\ufdd0'level".call(null, player);
  var seg_idx__81178 = "\ufdd0'segment".call(null, player);
  var stride__81179 = "\ufdd0'bullet-stride".call(null, player);
  var step__81180 = "\ufdd0'step".call(null, player);
  return cljs.core.conj.call(null, projectile_list, tempest.core.build_projectile.call(null, level__81177, seg_idx__81178, stride__81179, "\ufdd0'step", step__81180))
};
tempest.core.segment_entity_cw = function segment_entity_cw(player) {
  var level__81181 = "\ufdd0'level".call(null, player);
  var seg_max__81182 = cljs.core.count.call(null, "\ufdd0'segments".call(null, level__81181)) - 1;
  var cur_seg__81183 = "\ufdd0'segment".call(null, player);
  var loops_QMARK___81184 = "\ufdd0'loops?".call(null, level__81181);
  var new_seg__81185 = cur_seg__81183 - 1;
  if(cljs.core.truth_(new_seg__81185 < 0)) {
    if(cljs.core.truth_(loops_QMARK___81184)) {
      return seg_max__81182
    }else {
      return 0
    }
  }else {
    return new_seg__81185
  }
};
tempest.core.segment_entity_ccw = function segment_entity_ccw(player) {
  var level__81187 = "\ufdd0'level".call(null, player);
  var seg_max__81188 = cljs.core.count.call(null, "\ufdd0'segments".call(null, level__81187)) - 1;
  var cur_seg__81189 = "\ufdd0'segment".call(null, player);
  var loops_QMARK___81190 = "\ufdd0'loops?".call(null, level__81187);
  var new_seg__81191 = cur_seg__81189 + 1;
  if(cljs.core.truth_(new_seg__81191 > seg_max__81188)) {
    if(cljs.core.truth_(loops_QMARK___81190)) {
      return 0
    }else {
      return seg_max__81188
    }
  }else {
    return new_seg__81191
  }
};
tempest.core.queue_keypress = function queue_keypress(event) {
  var key__81192 = event.keyCode;
  cljs.core.swap_BANG_.call(null, tempest.core._STAR_key_event_queue_STAR_, function(p1__81186_SHARP_) {
    return cljs.core.concat.call(null, p1__81186_SHARP_, cljs.core.PersistentVector.fromArray([key__81192]))
  });
  event.preventDefault();
  return event.stopPropagation()
};
tempest.core.dequeue_keypresses_while_paused = function dequeue_keypresses_while_paused(game_state) {
  var state__81193 = game_state;
  var queue__81194 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
  while(true) {
    if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, queue__81194))) {
      return state__81193
    }else {
      var key__81195 = cljs.core.first.call(null, queue__81194);
      var valid_QMARK___81196 = cljs.core.compare_and_set_BANG_.call(null, tempest.core._STAR_key_event_queue_STAR_, queue__81194, cljs.core.rest.call(null, queue__81194));
      if(cljs.core.truth_(valid_QMARK___81196)) {
        var G__81197 = tempest.core.handle_keypress_unpause.call(null, state__81193, key__81195);
        var G__81198 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
        state__81193 = G__81197;
        queue__81194 = G__81198;
        continue
      }else {
        var G__81199 = state__81193;
        var G__81200 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
        state__81193 = G__81199;
        queue__81194 = G__81200;
        continue
      }
    }
    break
  }
};
tempest.core.handle_keypress_unpause = function handle_keypress_unpause(game_state, key) {
  var paused_QMARK___81201 = "\ufdd0'paused?".call(null, game_state);
  var pred__81202__81205 = cljs.core._EQ_;
  var expr__81203__81206 = key;
  if(cljs.core.truth_(pred__81202__81205.call(null, goog.events.KeyCodes.ESC, expr__81203__81206))) {
    return cljs.core.assoc.call(null, game_state, "\ufdd0'paused?", cljs.core.not.call(null, paused_QMARK___81201))
  }else {
    return game_state
  }
};
tempest.core.handle_keypress = function handle_keypress(game_state, key) {
  var player__81207 = "\ufdd0'player".call(null, game_state);
  var projectile_list__81208 = "\ufdd0'projectile-list".call(null, game_state);
  var paused_QMARK___81209 = "\ufdd0'paused?".call(null, game_state);
  var pred__81210__81213 = cljs.core._EQ_;
  var expr__81211__81214 = key;
  if(cljs.core.truth_(pred__81210__81213.call(null, goog.events.KeyCodes.RIGHT, expr__81211__81214))) {
    return cljs.core.assoc.call(null, game_state, "\ufdd0'player", cljs.core.assoc.call(null, player__81207, "\ufdd0'segment", tempest.core.segment_entity_ccw.call(null, player__81207)))
  }else {
    if(cljs.core.truth_(pred__81210__81213.call(null, goog.events.KeyCodes.LEFT, expr__81211__81214))) {
      return cljs.core.assoc.call(null, game_state, "\ufdd0'player", cljs.core.assoc.call(null, player__81207, "\ufdd0'segment", tempest.core.segment_entity_cw.call(null, player__81207)))
    }else {
      if(cljs.core.truth_(pred__81210__81213.call(null, goog.events.KeyCodes.SPACE, expr__81211__81214))) {
        return cljs.core.assoc.call(null, game_state, "\ufdd0'projectile-list", tempest.core.add_player_projectile.call(null, projectile_list__81208, player__81207))
      }else {
        if(cljs.core.truth_(pred__81210__81213.call(null, goog.events.KeyCodes.ESC, expr__81211__81214))) {
          return cljs.core.assoc.call(null, game_state, "\ufdd0'paused?", cljs.core.not.call(null, paused_QMARK___81209))
        }else {
          return game_state
        }
      }
    }
  }
};
tempest.core.dequeue_keypresses = function dequeue_keypresses(game_state) {
  var state__81216 = game_state;
  var queue__81217 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
  while(true) {
    if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, queue__81217))) {
      return state__81216
    }else {
      var key__81218 = cljs.core.first.call(null, queue__81217);
      var valid_QMARK___81219 = cljs.core.compare_and_set_BANG_.call(null, tempest.core._STAR_key_event_queue_STAR_, queue__81217, cljs.core.rest.call(null, queue__81217));
      if(cljs.core.truth_(cljs.core.not.call(null, valid_QMARK___81219))) {
        var G__81220 = state__81216;
        var G__81221 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
        state__81216 = G__81220;
        queue__81217 = G__81221;
        continue
      }else {
        if(cljs.core.truth_(cljs.core.not.call(null, "\ufdd0'captured?".call(null, "\ufdd0'player".call(null, game_state))))) {
          var G__81222 = tempest.core.handle_keypress.call(null, state__81216, key__81218);
          var G__81223 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
          state__81216 = G__81222;
          queue__81217 = G__81223;
          continue
        }else {
          if(cljs.core.truth_("\ufdd0'else")) {
            var G__81224 = tempest.core.handle_keypress_unpause.call(null, state__81216, key__81218);
            var G__81225 = cljs.core.deref.call(null, tempest.core._STAR_key_event_queue_STAR_);
            state__81216 = G__81224;
            queue__81217 = G__81225;
            continue
          }else {
            return null
          }
        }
      }
    }
    break
  }
};
tempest.core.animationFrameMethod = function animationFrameMethod() {
  var window__81226 = goog.dom.getWindow.call(null);
  var names__81227 = cljs.core.PersistentVector.fromArray(["requestAnimationFrame", "webkitRequestAnimationFrame", "mozRequestAnimationFrame", "oRequestAnimationFrame", "msRequestAnimationFrame"]);
  var options__81228 = cljs.core.map.call(null, function(name) {
    return function() {
      return window__81226[name]
    }
  }, names__81227);
  return function(p__81229) {
    while(true) {
      var vec__81230__81231 = p__81229;
      var current__81232 = cljs.core.nth.call(null, vec__81230__81231, 0, null);
      var remaining__81233 = cljs.core.nthnext.call(null, vec__81230__81231, 1);
      if(cljs.core.truth_(current__81232 === null)) {
        return function(p__81229) {
          return function(p1__81215_SHARP_) {
            return window__81226.setTimeout.call(null, p1__81215_SHARP_, 1E3 / 30)
          }
        }(p__81229)
      }else {
        if(cljs.core.truth_(cljs.core.fn_QMARK_.call(null, current__81232.call(null)))) {
          return current__81232.call(null)
        }else {
          if(cljs.core.truth_("\ufdd0'else")) {
            var G__81234 = remaining__81233;
            p__81229 = G__81234;
            continue
          }else {
            return null
          }
        }
      }
      break
    }
  }.call(null, options__81228)
};
tempest.core.clear_frame = function clear_frame(game_state) {
  tempest.draw.clear_context.call(null, "\ufdd0'context".call(null, game_state), "\ufdd0'dims".call(null, game_state));
  return game_state
};
tempest.core.render_frame = function render_frame(game_state) {
  var map__81235__81237 = game_state;
  var map__81235__81238 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81235__81237)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81235__81237) : map__81235__81237;
  var context__81239 = cljs.core.get.call(null, map__81235__81238, "\ufdd0'context");
  var dims__81240 = cljs.core.get.call(null, map__81235__81238, "\ufdd0'dims");
  var level__81241 = cljs.core.get.call(null, map__81235__81238, "\ufdd0'level");
  var enemy_list__81242 = cljs.core.get.call(null, map__81235__81238, "\ufdd0'enemy-list");
  var projectile_list__81243 = cljs.core.get.call(null, map__81235__81238, "\ufdd0'projectile-list");
  var player__81244 = cljs.core.get.call(null, map__81235__81238, "\ufdd0'player");
  var map__81236__81245 = cljs.core.group_by.call(null, "\ufdd0'from-enemy?", projectile_list__81243);
  var map__81236__81246 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81236__81245)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81236__81245) : map__81236__81245;
  var enemy_shots__81247 = cljs.core.get.call(null, map__81236__81246, true);
  var player_shots__81248 = cljs.core.get.call(null, map__81236__81246, false);
  var zoom__81249 = "\ufdd0'zoom".call(null, game_state);
  var zoom_dims__81250 = cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":"\ufdd0'width".call(null, dims__81240) / zoom__81249, "\ufdd0'height":"\ufdd0'height".call(null, dims__81240) / zoom__81249});
  tempest.draw.draw_all_spikes.call(null, cljs.core.assoc.call(null, game_state, "\ufdd0'dims", zoom_dims__81250));
  if(cljs.core.truth_(cljs.core.not.call(null, "\ufdd0'is-dead?".call(null, player__81244)))) {
    tempest.draw.draw_player.call(null, context__81239, zoom_dims__81250, level__81241, player__81244, "\ufdd0'zoom".call(null, game_state))
  }else {
  }
  tempest.draw.draw_entities.call(null, context__81239, zoom_dims__81250, level__81241, enemy_list__81242, cljs.core.ObjMap.fromObject(["\ufdd0'r", "\ufdd0'g", "\ufdd0'b"], {"\ufdd0'r":150, "\ufdd0'g":10, "\ufdd0'b":10}), zoom__81249);
  tempest.draw.draw_entities.call(null, context__81239, zoom_dims__81250, level__81241, player_shots__81248, cljs.core.ObjMap.fromObject(["\ufdd0'r", "\ufdd0'g", "\ufdd0'b"], {"\ufdd0'r":255, "\ufdd0'g":255, "\ufdd0'b":255}), zoom__81249);
  tempest.draw.draw_entities.call(null, context__81239, zoom_dims__81250, level__81241, enemy_shots__81247, cljs.core.ObjMap.fromObject(["\ufdd0'r", "\ufdd0'g", "\ufdd0'b"], {"\ufdd0'r":150, "\ufdd0'g":15, "\ufdd0'b":150}), zoom__81249);
  return game_state
};
tempest.core.remove_collided_entities = function remove_collided_entities(game_state) {
  var map__81251__81252 = game_state;
  var map__81251__81253 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81251__81252)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81251__81252) : map__81251__81252;
  var enemy_list__81254 = cljs.core.get.call(null, map__81251__81253, "\ufdd0'enemy-list");
  var projectile_list__81255 = cljs.core.get.call(null, map__81251__81253, "\ufdd0'projectile-list");
  var map__81256__81257 = tempest.core.entities_after_collisions.call(null, enemy_list__81254, projectile_list__81255);
  var map__81256__81258 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81256__81257)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81256__81257) : map__81256__81257;
  var plist__81259 = cljs.core.get.call(null, map__81256__81258, "\ufdd0'projectiles");
  var elist__81260 = cljs.core.get.call(null, map__81256__81258, "\ufdd0'entities");
  return cljs.core.assoc.call(null, game_state, "\ufdd0'projectile-list", plist__81259, "\ufdd0'enemy-list", elist__81260)
};
tempest.core.bullets_will_collide_QMARK_ = function bullets_will_collide_QMARK_(bullet1, bullet2) {
  var max_stride__81262 = "\ufdd0'stride".call(null, bullet1) > "\ufdd0'stride".call(null, bullet2) ? "\ufdd0'stride".call(null, bullet1) : "\ufdd0'stride".call(null, bullet2);
  var min_stride__81263 = "\ufdd0'stride".call(null, bullet1) < "\ufdd0'stride".call(null, bullet2) ? "\ufdd0'stride".call(null, bullet1) : "\ufdd0'stride".call(null, bullet2);
  var step1__81264 = "\ufdd0'step".call(null, bullet1);
  var step2__81265 = "\ufdd0'step".call(null, bullet2);
  var next_step1__81266 = tempest.core.entity_next_step.call(null, bullet1);
  var next_step2__81267 = tempest.core.entity_next_step.call(null, bullet2);
  var and__3546__auto____81271 = function() {
    var or__3548__auto____81269 = function() {
      var and__3546__auto____81268 = step1__81264 >= step2__81265;
      if(cljs.core.truth_(and__3546__auto____81268)) {
        return next_step1__81266 <= next_step2__81267
      }else {
        return and__3546__auto____81268
      }
    }();
    if(cljs.core.truth_(or__3548__auto____81269)) {
      return or__3548__auto____81269
    }else {
      var and__3546__auto____81270 = step2__81265 >= step1__81264;
      if(cljs.core.truth_(and__3546__auto____81270)) {
        return next_step2__81267 <= next_step1__81266
      }else {
        return and__3546__auto____81270
      }
    }
  }();
  if(cljs.core.truth_(and__3546__auto____81271)) {
    var and__3546__auto____81272 = min_stride__81263 < 0;
    if(cljs.core.truth_(and__3546__auto____81272)) {
      var and__3546__auto____81273 = max_stride__81262 > 0;
      if(cljs.core.truth_(and__3546__auto____81273)) {
        if(cljs.core.truth_("\ufdd0'from-enemy?".call(null, bullet1))) {
          return cljs.core.not.call(null, "\ufdd0'from-enemy?".call(null, bullet2))
        }else {
          return"\ufdd0'from-enemy?".call(null, bullet2)
        }
      }else {
        return and__3546__auto____81273
      }
    }else {
      return and__3546__auto____81272
    }
  }else {
    return and__3546__auto____81271
  }
};
tempest.core.projectile_list_without_collisions = function projectile_list_without_collisions(projectiles) {
  var G__81275__81277 = projectiles;
  var vec__81276__81278 = G__81275__81277;
  var bullet__81279 = cljs.core.nth.call(null, vec__81276__81278, 0, null);
  var others__81280 = cljs.core.nthnext.call(null, vec__81276__81278, 1);
  var survivors__81281 = cljs.core.List.EMPTY;
  var G__81275__81282 = G__81275__81277;
  var survivors__81283 = survivors__81281;
  while(true) {
    var vec__81284__81285 = G__81275__81282;
    var bullet__81286 = cljs.core.nth.call(null, vec__81284__81285, 0, null);
    var others__81287 = cljs.core.nthnext.call(null, vec__81284__81285, 1);
    var survivors__81288 = survivors__81283;
    if(cljs.core.truth_(bullet__81286 === null)) {
      return survivors__81288
    }else {
      var map__81289__81290 = cljs.core.group_by.call(null, function(G__81275__81282, survivors__81283, vec__81284__81285, bullet__81286, others__81287, survivors__81288) {
        return function(p1__81261_SHARP_) {
          return tempest.core.bullets_will_collide_QMARK_.call(null, bullet__81286, p1__81261_SHARP_)
        }
      }(G__81275__81282, survivors__81283, vec__81284__81285, bullet__81286, others__81287, survivors__81288), others__81287);
      var map__81289__81291 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81289__81290)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81289__81290) : map__81289__81290;
      var not_hit__81292 = cljs.core.get.call(null, map__81289__81291, false);
      var hit__81293 = cljs.core.get.call(null, map__81289__81291, true);
      if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_.call(null, hit__81293)))) {
        var G__81294 = cljs.core.concat.call(null, not_hit__81292, cljs.core.rest.call(null, hit__81293));
        var G__81295 = survivors__81288;
        G__81275__81282 = G__81294;
        survivors__81283 = G__81295;
        continue
      }else {
        var G__81296 = others__81287;
        var G__81297 = cljs.core.cons.call(null, bullet__81286, survivors__81288);
        G__81275__81282 = G__81296;
        survivors__81283 = G__81297;
        continue
      }
    }
    break
  }
};
tempest.core.remove_collided_bullets = function remove_collided_bullets(game_state) {
  var projectile_list__81298 = "\ufdd0'projectile-list".call(null, game_state);
  var segment_lists__81299 = cljs.core.vals.call(null, cljs.core.group_by.call(null, "\ufdd0'segment", projectile_list__81298));
  var non_collided__81300 = cljs.core.mapcat.call(null, tempest.core.projectile_list_without_collisions, segment_lists__81299);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'projectile-list", non_collided__81300)
};
tempest.core.decrement_spike_length = function decrement_spike_length(spike_len, hit_count) {
  var new_len__81302 = spike_len - 10 * hit_count;
  if(cljs.core.truth_(new_len__81302 <= 5)) {
    return 0
  }else {
    return new_len__81302
  }
};
tempest.core.filter_spike_bullet_collisions = function filter_spike_bullet_collisions(projectile_list, spike_len) {
  var map__81303__81304 = cljs.core.group_by.call(null, function(p1__81301_SHARP_) {
    return"\ufdd0'step".call(null, p1__81301_SHARP_) <= spike_len
  }, projectile_list);
  var map__81303__81305 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81303__81304)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81303__81304) : map__81303__81304;
  var hit__81306 = cljs.core.get.call(null, map__81303__81305, true);
  var missed__81307 = cljs.core.get.call(null, map__81303__81305, false);
  return cljs.core.PersistentVector.fromArray([missed__81307, tempest.core.decrement_spike_length.call(null, spike_len, cljs.core.count.call(null, hit__81306))])
};
tempest.core.remove_spiked_bullets = function remove_spiked_bullets(game_state) {
  var projectile_list__81309 = "\ufdd0'projectile-list".call(null, game_state);
  var map__81308__81310 = cljs.core.group_by.call(null, "\ufdd0'from-enemy?", projectile_list__81309);
  var map__81308__81311 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81308__81310)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81308__81310) : map__81308__81310;
  var player_list__81312 = cljs.core.get.call(null, map__81308__81311, false);
  var enemy_list__81313 = cljs.core.get.call(null, map__81308__81311, true);
  var segmented_projectiles__81314 = cljs.core.group_by.call(null, "\ufdd0'segment", player_list__81312);
  var G__81316__81318 = segmented_projectiles__81314;
  var vec__81317__81319 = G__81316__81318;
  var seg_bullets__81320 = cljs.core.nth.call(null, vec__81317__81319, 0, null);
  var remaining__81321 = cljs.core.nthnext.call(null, vec__81317__81319, 1);
  var spikes__81322 = "\ufdd0'spikes".call(null, game_state);
  var projectiles_out__81323 = cljs.core.List.EMPTY;
  var G__81316__81324 = G__81316__81318;
  var spikes__81325 = spikes__81322;
  var projectiles_out__81326 = projectiles_out__81323;
  while(true) {
    var vec__81327__81328 = G__81316__81324;
    var seg_bullets__81329 = cljs.core.nth.call(null, vec__81327__81328, 0, null);
    var remaining__81330 = cljs.core.nthnext.call(null, vec__81327__81328, 1);
    var spikes__81331 = spikes__81325;
    var projectiles_out__81332 = projectiles_out__81326;
    if(cljs.core.truth_(seg_bullets__81329 === null)) {
      return cljs.core.assoc.call(null, game_state, "\ufdd0'projectile-list", cljs.core.concat.call(null, projectiles_out__81332, enemy_list__81313), "\ufdd0'spikes", spikes__81331)
    }else {
      var vec__81333__81335 = seg_bullets__81329;
      var key__81336 = cljs.core.nth.call(null, vec__81333__81335, 0, null);
      var bullets__81337 = cljs.core.nth.call(null, vec__81333__81335, 1, null);
      var spike_len__81338 = cljs.core.nth.call(null, spikes__81331, key__81336);
      var vec__81334__81339 = tempest.core.filter_spike_bullet_collisions.call(null, bullets__81337, spike_len__81338);
      var bullets__81340 = cljs.core.nth.call(null, vec__81334__81339, 0, null);
      var new_len__81341 = cljs.core.nth.call(null, vec__81334__81339, 1, null);
      var G__81342 = remaining__81330;
      var G__81343 = cljs.core.assoc.call(null, spikes__81331, key__81336, new_len__81341);
      var G__81344 = cljs.core.concat.call(null, projectiles_out__81332, bullets__81340);
      G__81316__81324 = G__81342;
      spikes__81325 = G__81343;
      projectiles_out__81326 = G__81344;
      continue
    }
    break
  }
};
tempest.core.bullets_will_kill_player_QMARK_ = function bullets_will_kill_player_QMARK_(player, bullet) {
  var next_step__81347 = tempest.core.entity_next_step.call(null, bullet);
  var player_step__81348 = "\ufdd0'step".call(null, player);
  var and__3546__auto____81349 = cljs.core._EQ_.call(null, player_step__81348, next_step__81347);
  if(cljs.core.truth_(and__3546__auto____81349)) {
    return"\ufdd0'from-enemy?".call(null, bullet)
  }else {
    return and__3546__auto____81349
  }
};
tempest.core.update_player_if_shot = function update_player_if_shot(game_state) {
  var projectile_list__81351 = "\ufdd0'projectile-list".call(null, game_state);
  var player__81352 = "\ufdd0'player".call(null, game_state);
  var on_segment__81353 = cljs.core.filter.call(null, function(p1__81345_SHARP_) {
    return cljs.core._EQ_.call(null, "\ufdd0'segment".call(null, player__81352), "\ufdd0'segment".call(null, p1__81345_SHARP_))
  }, projectile_list__81351);
  var map__81350__81354 = cljs.core.group_by.call(null, function(p1__81346_SHARP_) {
    return tempest.core.bullets_will_kill_player_QMARK_.call(null, player__81352, p1__81346_SHARP_)
  }, on_segment__81353);
  var map__81350__81355 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81350__81354)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81350__81354) : map__81350__81354;
  var hit__81356 = cljs.core.get.call(null, map__81350__81355, true);
  var miss__81357 = cljs.core.get.call(null, map__81350__81355, false);
  if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_.call(null, hit__81356)))) {
    return cljs.core.assoc.call(null, tempest.core.clear_level_entities.call(null, game_state), "\ufdd0'player", cljs.core.assoc.call(null, player__81352, "\ufdd0'is-dead?", true), "\ufdd0'is-zooming?", true, "\ufdd0'player-zooming?", false, "\ufdd0'zoom-in?", false)
  }else {
    return game_state
  }
};
tempest.core.update_projectile_locations = function update_projectile_locations(game_state) {
  var map__81358__81359 = game_state;
  var map__81358__81360 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81358__81359)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81358__81359) : map__81358__81359;
  var projectile_list__81361 = cljs.core.get.call(null, map__81358__81360, "\ufdd0'projectile-list");
  var rm_fn__81362 = cljs.core.partial.call(null, cljs.core.remove, tempest.core.projectile_off_level_QMARK_);
  return cljs.core.assoc.call(null, game_state, "\ufdd0'projectile-list", rm_fn__81362.call(null, tempest.core.update_entity_list_positions.call(null, projectile_list__81361)))
};
tempest.core.update_enemy_locations = function update_enemy_locations(game_state) {
  var map__81363__81364 = game_state;
  var map__81363__81365 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81363__81364)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81363__81364) : map__81363__81364;
  var enemy_list__81366 = cljs.core.get.call(null, map__81363__81365, "\ufdd0'enemy-list");
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", tempest.core.update_entity_list_positions.call(null, enemy_list__81366))
};
tempest.core.update_enemy_directions = function update_enemy_directions(game_state) {
  var map__81367__81368 = game_state;
  var map__81367__81369 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81367__81368)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81367__81368) : map__81367__81368;
  var enemy_list__81370 = cljs.core.get.call(null, map__81367__81369, "\ufdd0'enemy-list");
  return cljs.core.assoc.call(null, game_state, "\ufdd0'enemy-list", tempest.core.update_entity_list_directions.call(null, enemy_list__81370))
};
tempest.core.schedule_next_frame = function schedule_next_frame(game_state) {
  return"\ufdd0'anim-fn".call(null, game_state).call(null, function() {
    return tempest.core.next_game_state.call(null, game_state)
  })
};
tempest.core.update_frame_count = function update_frame_count(game_state) {
  var map__81371__81372 = game_state;
  var map__81371__81373 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81371__81372)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81371__81372) : map__81371__81372;
  var frame_count__81374 = cljs.core.get.call(null, map__81371__81373, "\ufdd0'frame-count");
  return cljs.core.assoc.call(null, game_state, "\ufdd0'frame-count", frame_count__81374 + 1)
};
tempest.core.render_fps_display = function render_fps_display(game_state) {
  var map__81375__81376 = game_state;
  var map__81375__81377 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__81375__81376)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__81375__81376) : map__81375__81376;
  var frame_count__81378 = cljs.core.get.call(null, map__81375__81377, "\ufdd0'frame-count");
  var frame_time__81379 = cljs.core.get.call(null, map__81375__81377, "\ufdd0'frame-time");
  var fps__81380 = 1E3 * frame_count__81378 / (goog.now.call(null) - frame_time__81379);
  var str_fps__81381 = cljs.core.pr_str.call(null, tempest.util.round.call(null, fps__81380));
  goog.dom.setTextContent.call(null, goog.dom.getElement.call(null, "fps"), cljs.core.str.call(null, "FPS: ", str_fps__81381));
  return cljs.core.assoc.call(null, game_state, "\ufdd0'frame-count", 0, "\ufdd0'frame-time", goog.now.call(null))
};
tempest.core.maybe_render_fps_display = function maybe_render_fps_display(game_state) {
  if(cljs.core.truth_(cljs.core._EQ_.call(null, "\ufdd0'frame-count".call(null, game_state), 20))) {
    return tempest.core.render_fps_display.call(null, game_state)
  }else {
    return game_state
  }
};
goog.provide("goog.events.KeyEvent");
goog.provide("goog.events.KeyHandler");
goog.provide("goog.events.KeyHandler.EventType");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyHandler = function(opt_element, opt_capture) {
  goog.events.EventTarget.call(this);
  if(opt_element) {
    this.attach(opt_element, opt_capture)
  }
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.EventType = {KEY:"key"};
goog.events.KeyHandler.safariKey_ = {3:goog.events.KeyCodes.ENTER, 12:goog.events.KeyCodes.NUMLOCK, 63232:goog.events.KeyCodes.UP, 63233:goog.events.KeyCodes.DOWN, 63234:goog.events.KeyCodes.LEFT, 63235:goog.events.KeyCodes.RIGHT, 63236:goog.events.KeyCodes.F1, 63237:goog.events.KeyCodes.F2, 63238:goog.events.KeyCodes.F3, 63239:goog.events.KeyCodes.F4, 63240:goog.events.KeyCodes.F5, 63241:goog.events.KeyCodes.F6, 63242:goog.events.KeyCodes.F7, 63243:goog.events.KeyCodes.F8, 63244:goog.events.KeyCodes.F9, 
63245:goog.events.KeyCodes.F10, 63246:goog.events.KeyCodes.F11, 63247:goog.events.KeyCodes.F12, 63248:goog.events.KeyCodes.PRINT_SCREEN, 63272:goog.events.KeyCodes.DELETE, 63273:goog.events.KeyCodes.HOME, 63275:goog.events.KeyCodes.END, 63276:goog.events.KeyCodes.PAGE_UP, 63277:goog.events.KeyCodes.PAGE_DOWN, 63289:goog.events.KeyCodes.NUMLOCK, 63302:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.keyIdentifier_ = {"Up":goog.events.KeyCodes.UP, "Down":goog.events.KeyCodes.DOWN, "Left":goog.events.KeyCodes.LEFT, "Right":goog.events.KeyCodes.RIGHT, "Enter":goog.events.KeyCodes.ENTER, "F1":goog.events.KeyCodes.F1, "F2":goog.events.KeyCodes.F2, "F3":goog.events.KeyCodes.F3, "F4":goog.events.KeyCodes.F4, "F5":goog.events.KeyCodes.F5, "F6":goog.events.KeyCodes.F6, "F7":goog.events.KeyCodes.F7, "F8":goog.events.KeyCodes.F8, "F9":goog.events.KeyCodes.F9, "F10":goog.events.KeyCodes.F10, 
"F11":goog.events.KeyCodes.F11, "F12":goog.events.KeyCodes.F12, "U+007F":goog.events.KeyCodes.DELETE, "Home":goog.events.KeyCodes.HOME, "End":goog.events.KeyCodes.END, "PageUp":goog.events.KeyCodes.PAGE_UP, "PageDown":goog.events.KeyCodes.PAGE_DOWN, "Insert":goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.mozKeyCodeToKeyCodeMap_ = {61:187, 59:186};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersion("525");
goog.events.KeyHandler.prototype.handleKeyDown_ = function(e) {
  if(goog.userAgent.WEBKIT && (this.lastKey_ == goog.events.KeyCodes.CTRL && !e.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !e.altKey)) {
    this.lastKey_ = -1;
    this.keyCode_ = -1
  }
  if(goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(e.keyCode, this.lastKey_, e.shiftKey, e.ctrlKey, e.altKey)) {
    this.handleEvent(e)
  }else {
    if(goog.userAgent.GECKO && e.keyCode in goog.events.KeyHandler.mozKeyCodeToKeyCodeMap_) {
      this.keyCode_ = goog.events.KeyHandler.mozKeyCodeToKeyCodeMap_[e.keyCode]
    }else {
      this.keyCode_ = e.keyCode
    }
  }
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(e) {
  this.lastKey_ = -1;
  this.keyCode_ = -1
};
goog.events.KeyHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var keyCode, charCode;
  if(goog.userAgent.IE && e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = keyCode != goog.events.KeyCodes.ENTER && keyCode != goog.events.KeyCodes.ESC ? be.keyCode : 0
  }else {
    if(goog.userAgent.WEBKIT && e.type == goog.events.EventType.KEYPRESS) {
      keyCode = this.keyCode_;
      charCode = be.charCode >= 0 && be.charCode < 63232 && goog.events.KeyCodes.isCharacterKey(keyCode) ? be.charCode : 0
    }else {
      if(goog.userAgent.OPERA) {
        keyCode = this.keyCode_;
        charCode = goog.events.KeyCodes.isCharacterKey(keyCode) ? be.keyCode : 0
      }else {
        keyCode = be.keyCode || this.keyCode_;
        charCode = be.charCode || 0;
        if(goog.userAgent.MAC && charCode == goog.events.KeyCodes.QUESTION_MARK && !keyCode) {
          keyCode = goog.events.KeyCodes.SLASH
        }
      }
    }
  }
  var key = keyCode;
  var keyIdentifier = be.keyIdentifier;
  if(keyCode) {
    if(keyCode >= 63232 && keyCode in goog.events.KeyHandler.safariKey_) {
      key = goog.events.KeyHandler.safariKey_[keyCode]
    }else {
      if(keyCode == 25 && e.shiftKey) {
        key = 9
      }
    }
  }else {
    if(keyIdentifier && keyIdentifier in goog.events.KeyHandler.keyIdentifier_) {
      key = goog.events.KeyHandler.keyIdentifier_[keyIdentifier]
    }
  }
  var repeat = key == this.lastKey_;
  this.lastKey_ = key;
  var event = new goog.events.KeyEvent(key, charCode, repeat, be);
  try {
    this.dispatchEvent(event)
  }finally {
    event.dispose()
  }
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_
};
goog.events.KeyHandler.prototype.attach = function(element, opt_capture) {
  if(this.keyUpKey_) {
    this.detach()
  }
  this.element_ = element;
  this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, opt_capture);
  this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, opt_capture, this);
  this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, opt_capture, this)
};
goog.events.KeyHandler.prototype.detach = function() {
  if(this.keyPressKey_) {
    goog.events.unlistenByKey(this.keyPressKey_);
    goog.events.unlistenByKey(this.keyDownKey_);
    goog.events.unlistenByKey(this.keyUpKey_);
    this.keyPressKey_ = null;
    this.keyDownKey_ = null;
    this.keyUpKey_ = null
  }
  this.element_ = null;
  this.lastKey_ = -1;
  this.keyCode_ = -1
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach()
};
goog.events.KeyEvent = function(keyCode, charCode, repeat, browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.keyCode = keyCode;
  this.charCode = charCode;
  this.repeat = repeat
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.provide("tempest.benchmarks");
goog.require("cljs.core");
goog.require("tempest.levels");
goog.require("tempest.draw");
goog.require("tempest.core");
goog.require("goog.dom");
tempest.benchmarks.benchmarkTempest = function benchmarkTempest(enemies, projectiles) {
  var document__80812 = goog.dom.getDocument.call(null);
  var canvas__80813 = goog.dom.getElement.call(null, "canv-fg");
  var context__80814 = canvas__80813.getContext("2d");
  var bgcanvas__80815 = goog.dom.getElement.call(null, "canv-bg");
  var bgcontext__80816 = bgcanvas__80815.getContext("2d");
  var dims__80817 = cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":canvas__80813.width, "\ufdd0'height":canvas__80813.height});
  var level__80818 = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, 0);
  console.log(cljs.core.str.call(null, cljs.core.count.call(null, enemies), " enemies"));
  console.log(cljs.core.str.call(null, cljs.core.count.call(null, projectiles), " projectiles"));
  var empty_game_state__80819 = tempest.benchmarks.init_benchmarks.call(null, tempest.core.build_game_state.call(null));
  var game_state__80820 = cljs.core.assoc.call(null, tempest.core.change_level.call(null, cljs.core.assoc.call(null, empty_game_state__80819, "\ufdd0'context", context__80814, "\ufdd0'bgcontext", bgcontext__80816, "\ufdd0'dims", dims__80817, "\ufdd0'anim-fn", tempest.core.animationFrameMethod.call(null)), 0), "\ufdd0'enemy-list", enemies, "\ufdd0'projectile-list", projectiles, "\ufdd0'level", cljs.core.assoc.call(null, level__80818, "\ufdd0'probability", cljs.core.ObjMap.fromObject(["\ufdd0'flipper", 
  "\ufdd0'tanker", "\ufdd0'spiker"], {"\ufdd0'flipper":0, "\ufdd0'tanker":0, "\ufdd0'spiker":0})));
  return tempest.benchmarks.next_game_state.call(null, game_state__80820)
};
tempest.benchmarks.init_benchmarks = function init_benchmarks(game_state) {
  return cljs.core.assoc.call(null, game_state, "\ufdd0'bm-frames", 0, "\ufdd0'bm-start", goog.now.call(null))
};
tempest.benchmarks.increment_benchmark_frames = function increment_benchmark_frames(game_state) {
  return cljs.core.assoc.call(null, game_state, "\ufdd0'bm-frames", "\ufdd0'bm-frames".call(null, game_state) + 1)
};
tempest.benchmarks.render_benchmark_result = function render_benchmark_result(game_state) {
  var map__80821__80822 = game_state;
  var map__80821__80823 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__80821__80822)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__80821__80822) : map__80821__80822;
  var frames__80824 = cljs.core.get.call(null, map__80821__80823, "\ufdd0'bm-frames");
  var start__80825 = cljs.core.get.call(null, map__80821__80823, "\ufdd0'bm-start");
  var fps__80826 = frames__80824 / ((goog.now.call(null) - start__80825) / 1E3);
  var str_fps__80827 = cljs.core.pr_str.call(null, fps__80826);
  return goog.dom.setTextContent.call(null, goog.dom.getElement.call(null, "fps"), cljs.core.str.call(null, "BENCHMARK FPS: ", str_fps__80827))
};
tempest.benchmarks.next_game_state = function next_game_state(game_state) {
  return tempest.benchmarks.benchmark_logic.call(null, game_state)
};
tempest.benchmarks.schedule_next_frame = function schedule_next_frame(game_state) {
  if(cljs.core.truth_(goog.now.call(null) - "\ufdd0'bm-start".call(null, game_state) < 15E3)) {
    return"\ufdd0'anim-fn".call(null, game_state).call(null, function() {
      return tempest.benchmarks.next_game_state.call(null, game_state)
    })
  }else {
    return tempest.benchmarks.render_benchmark_result.call(null, game_state)
  }
};
tempest.benchmarks.benchmark_logic = function benchmark_logic(game_state) {
  var gs1__80828 = tempest.core.render_frame.call(null, tempest.core.draw_board.call(null, tempest.core.clear_frame.call(null, tempest.core.dequeue_keypresses.call(null, game_state))));
  var gs2__80829 = tempest.core.maybe_enemies_shoot.call(null, tempest.core.handle_exiting_spikers.call(null, tempest.core.handle_dead_enemies.call(null, tempest.core.maybe_split_tankers.call(null, tempest.core.update_enemy_directions.call(null, tempest.core.update_enemy_locations.call(null, tempest.core.update_projectile_locations.call(null, tempest.core.remove_collided_bullets.call(null, tempest.core.remove_collided_entities.call(null, tempest.core.remove_spiked_bullets.call(null, gs1__80828))))))))));
  var gs3__80830 = tempest.benchmarks.increment_benchmark_frames.call(null, tempest.core.maybe_render_fps_display.call(null, tempest.core.update_frame_count.call(null, tempest.core.update_entity_flippyness.call(null, tempest.core.update_entity_is_flipping.call(null, tempest.core.check_if_enemies_remain.call(null, tempest.core.maybe_make_enemy.call(null, tempest.core.handle_spike_laying.call(null, gs2__80829))))))));
  return tempest.benchmarks.schedule_next_frame.call(null, gs3__80830)
};
goog.provide("tempest");
goog.require("cljs.core");
goog.require("tempest.levels");
goog.require("tempest.draw");
goog.require("tempest.core");
goog.require("tempest.benchmarks");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.KeyHandler");
tempest.flipper_on_each_segment = function flipper_on_each_segment(level) {
  return cljs.core.map.call(null, function(p1__81661_SHARP_) {
    return cljs.core.assoc.call(null, tempest.core.build_flipper.call(null, level, p1__81661_SHARP_, "\ufdd0'step", 0), "\ufdd0'flip-probability", 1)
  }, cljs.core.range.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, level))))
};
tempest.flipper_on_each_segment_noflip = function flipper_on_each_segment_noflip(level) {
  return cljs.core.map.call(null, function(p1__81662_SHARP_) {
    return cljs.core.assoc.call(null, tempest.core.build_flipper.call(null, level, p1__81662_SHARP_, "\ufdd0'step", 0), "\ufdd0'flip-probability", 0)
  }, cljs.core.range.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, level))))
};
tempest.spiker_on_each_segment = function spiker_on_each_segment(level) {
  return cljs.core.map.call(null, function(p1__81663_SHARP_) {
    return cljs.core.assoc.call(null, tempest.core.build_spiker.call(null, level, p1__81663_SHARP_, "\ufdd0'step", 0), "\ufdd0'max-step", "\ufdd0'steps".call(null, level))
  }, cljs.core.range.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, level))))
};
tempest.projectile_on_each_segment = function projectile_on_each_segment(level, stride) {
  return cljs.core.map.call(null, function(p1__81664_SHARP_) {
    return tempest.core.build_projectile.call(null, level, p1__81664_SHARP_, stride, "\ufdd0'step", "\ufdd0'steps".call(null, level))
  }, cljs.core.range.call(null, cljs.core.count.call(null, "\ufdd0'segments".call(null, level))))
};
tempest.canvasDraw = function canvasDraw(level_str) {
  var document__81665 = goog.dom.getDocument.call(null);
  var level_idx__81666 = parseInt.call(null, level_str) - 1;
  var canvas__81667 = goog.dom.getElement.call(null, "canv-fg");
  var context__81668 = canvas__81667.getContext("2d");
  var bgcanvas__81669 = goog.dom.getElement.call(null, "canv-bg");
  var bgcontext__81670 = bgcanvas__81669.getContext("2d");
  var handler__81671 = new goog.events.KeyHandler(document__81665, true);
  var dims__81672 = cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":canvas__81667.width, "\ufdd0'height":canvas__81667.height});
  goog.events.listen.call(null, handler__81671, "key", function(e) {
    return tempest.core.queue_keypress.call(null, e)
  });
  var empty_game_state__81673 = tempest.core.build_game_state.call(null);
  var game_state__81674 = tempest.core.change_level.call(null, cljs.core.assoc.call(null, empty_game_state__81673, "\ufdd0'context", context__81668, "\ufdd0'bgcontext", bgcontext__81670, "\ufdd0'dims", dims__81672, "\ufdd0'anim-fn", tempest.core.animationFrameMethod.call(null)), level_idx__81666);
  return tempest.core.next_game_state.call(null, game_state__81674)
};
goog.exportSymbol("tempest.canvasDraw", tempest.canvasDraw);
tempest.benchmarkFlippers = function benchmarkFlippers() {
  var level__81675 = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, 0);
  return tempest.benchmarks.benchmarkTempest.call(null, cljs.core.apply.call(null, cljs.core.concat, cljs.core.take.call(null, 5, cljs.core.repeatedly.call(null, function() {
    return tempest.flipper_on_each_segment.call(null, level__81675)
  }))), cljs.core.List.EMPTY)
};
goog.exportSymbol("tempest.benchmarkFlippers", tempest.benchmarkFlippers);
tempest.benchmarkFlippersNoFlip = function benchmarkFlippersNoFlip() {
  var level__81676 = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, 0);
  return tempest.benchmarks.benchmarkTempest.call(null, cljs.core.apply.call(null, cljs.core.concat, cljs.core.take.call(null, 5, cljs.core.repeatedly.call(null, function() {
    return tempest.flipper_on_each_segment_noflip.call(null, level__81676)
  }))), cljs.core.List.EMPTY)
};
goog.exportSymbol("tempest.benchmarkFlippersNoFlip", tempest.benchmarkFlippersNoFlip);
tempest.benchmarkSpikers = function benchmarkSpikers() {
  var level__81678 = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, 0);
  return tempest.benchmarks.benchmarkTempest.call(null, cljs.core.apply.call(null, cljs.core.concat, cljs.core.take.call(null, 10, cljs.core.repeatedly.call(null, function() {
    return tempest.spiker_on_each_segment.call(null, level__81678)
  }))), cljs.core.List.EMPTY)
};
goog.exportSymbol("tempest.benchmarkSpikers", tempest.benchmarkSpikers);
tempest.benchmarkProjectiles = function benchmarkProjectiles() {
  var level__81679 = cljs.core.get.call(null, tempest.levels._STAR_levels_STAR_, 0);
  return tempest.benchmarks.benchmarkTempest.call(null, cljs.core.apply.call(null, cljs.core.concat, cljs.core.take.call(null, 8, cljs.core.repeatedly.call(null, function() {
    return tempest.spiker_on_each_segment.call(null, level__81679)
  }))), cljs.core.flatten.call(null, cljs.core.map.call(null, function(p1__81677_SHARP_) {
    return tempest.projectile_on_each_segment.call(null, level__81679, p1__81677_SHARP_)
  }, cljs.core.range.call(null, -1, -9, -1))))
};
goog.exportSymbol("tempest.benchmarkProjectiles", tempest.benchmarkProjectiles);
