/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(46)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(12);
var isBuffer = __webpack_require__(25);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(3);
var normalizeHeaderName = __webpack_require__(27);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(13);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(13);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(63)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(65)
/* template */
var __vue_template__ = __webpack_require__(75)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-78715ee5"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/NavigationBar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-78715ee5", Component.options)
  } else {
    hotAPI.reload("data-v-78715ee5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(66)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(68)
/* template */
var __vue_template__ = __webpack_require__(69)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-167c4e0e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/HamburgerMenu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-167c4e0e", Component.options)
  } else {
    hotAPI.reload("data-v-167c4e0e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(76)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(78)
/* template */
var __vue_template__ = __webpack_require__(79)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-870037cc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/ButtonToApp.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-870037cc", Component.options)
  } else {
    hotAPI.reload("data-v-870037cc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.20
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */


/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ("development" !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ("development" !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ("development" !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  
  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    try {
      return fn.apply(null, arguments)
    } finally {
      useMacroTask = false;    
    }
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }

      if (renderCompleted) {
        contexts.length = 0;
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ("development" !== 'production' && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        if (!(key in hash) && !(camelizedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + camelizedKey)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ("development" !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.20';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (true) {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (true) {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (true) {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (true) {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (true) {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (true) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = {
    value: value.trim()
  };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len, str, chr, index$1, expressionPos, expressionEndPos;



function parseModel (val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (true) {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (true) {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (true) {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1 (event, handler, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

var whitespaceRE = /\s+/;

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  // JSDOM may return undefined for transition properties
  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs (s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

var isVShowDirective = function (d) { return d.name === 'show'; };

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(isNotTextNode);
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  beforeMount: function beforeMount () {
    var this$1 = this;

    var update = this._update;
    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1);
      // force removing pass
      this$1.__patch__(
        this$1._vnode,
        this$1.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (true) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        "development" !== 'production' &&
        "development" !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if ("development" !== 'production' &&
      "development" !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (true) {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        if (true) {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (true) {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (true) {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (true) {
      if (el.tag === 'template') {
        warn$2("<template> cannot be keyed. Place the key on real elements instead.");
      }
      if (el.for) {
        var iterator = el.iterator2 || el.iterator1;
        var parent = el.parent;
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn$2(
            "Do not use v-for index as key on <transtion-group> children, " +
            "this is the same as not using keys."
          );
        }
      }
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (true) {
      warn$2(
        ("Invalid v-for expression: " + exp)
      );
    }
  }
}



function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim();
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (true) {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (
          "development" !== 'production' &&
          value.trim().length === 0
        ) {
          warn$2(
            ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
          );
        }
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (true) {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + (map['v-bind']) + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$1 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  'delete': ['Backspace', 'Delete', 'Del']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    return ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + "($event)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) +
    ")"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */





var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !(isReservedTag(el.tag) && !el.component); };
  this.onceId = 0;
  this.staticRenderFns = [];
  this.pre = false;
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data;
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData$2(el, state);
      }

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  var originalPreState = state.pre;
  if (el.pre) {
    state.pre = el.pre;
  }
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  state.pre = originalPreState;
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      var normalizationType = checkSkip && state.maybeComponent(el$1) ? ",1" : "";
      return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
    }
    var normalizationType$1 = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
    }
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */



function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    if (true) {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (true) {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (true) {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (true) {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (true) {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions;

module.exports = Vue;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(20).setImmediate))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*!
  * vue-router v3.0.2
  * (c) 2018 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if ("development" !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

function extend (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

var View = {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    // used by devtools to display a router-view badge
    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
}

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (true) {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "development" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */

var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
      ? 'router-link-active'
      : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
      ? 'router-link-exact-active'
      : globalExactActiveClass;
    var activeClass = this.activeClass == null
      ? activeClassFallback
      : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
      ? exactActiveClassFallback
      : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
}

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (true) {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (true) {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (true) {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ("development" !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (true) {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */

function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = extend({}, next);
    next._normalized = true;
    var params = extend(extend({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (true) {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

/*  */



function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (true) {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null, router))
      : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (true) {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (true) {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (true) {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */

var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  window.history.replaceState({ key: getStateKey() }, '', window.location.href.replace(window.location.origin, ''));
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (true) {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior.call(router, to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (true) {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "development" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (
    instances[key] &&
    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */

var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = decodeURI(window.location.pathname);
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */

var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : decodeURI(href.slice(index + 1))
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */

var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */



var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (true) {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "development" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.2';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);
var settle = __webpack_require__(28);
var buildURL = __webpack_require__(30);
var parseHeaders = __webpack_require__(31);
var isURLSameOrigin = __webpack_require__(32);
var createError = __webpack_require__(14);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(33);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("development" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(34);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(29);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(18);
module.exports = __webpack_require__(116);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__routes_routes__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_layout_PageWrapper__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_layout_PageWrapper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_layout_PageWrapper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_layout_NavigationBar__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_layout_NavigationBar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_layout_NavigationBar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_layout_Footer__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_layout_Footer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_layout_Footer__);

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
__webpack_require__(19);






Vue.component("page-wrapper", __WEBPACK_IMPORTED_MODULE_1__components_layout_PageWrapper___default.a);
Vue.component('page-footer', __WEBPACK_IMPORTED_MODULE_3__components_layout_Footer___default.a);
Vue.component("navigation-bar", __WEBPACK_IMPORTED_MODULE_2__components_layout_NavigationBar___default.a);

var app = new Vue({
  el: '#app',
  router: __WEBPACK_IMPORTED_MODULE_0__routes_routes__["a" /* default */]
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_material_dist_components__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_material_dist_components___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vue_material_dist_components__);




window.Vue = __WEBPACK_IMPORTED_MODULE_0_vue___default.a;
window.VueRouter = __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */];

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_material_dist_components__["MdField"]);
// Vue.use(MdInput);
// Vue.use(MdTextarea);

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(23);

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(21);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(10)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * vue-material v1.0.0-beta-10.2
 * Made with <3 by marcosmoura 2018
 * Released under the MIT License.
 */
!(function(e,t){var n,i;if(true)module.exports=t(__webpack_require__(9));else if("function"==typeof define&&define.amd)define(["vue"],t);else{n=t("object"==typeof exports?require("vue"):e.Vue);for(i in n)("object"==typeof exports?exports:e)[i]=n[i]}})("undefined"!=typeof self?self:this,(function(e){return (function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=502)})([(function(e,t){e.exports=function(e,t,n,i,r,s){var a,o,u,l,d,c=e=e||{},f=typeof e.default;return"object"!==f&&"function"!==f||(a=e,c=e.default),o="function"==typeof c?c.options:c,t&&(o.render=t.render,o.staticRenderFns=t.staticRenderFns,o._compiled=!0),n&&(o.functional=!0),r&&(o._scopeId=r),s?(u=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},o._ssrRegister=u):i&&(u=i),u&&(l=o.functional,d=l?o.render:o.beforeCreate,l?(o._injectStyles=u,o.render=function(e,t){return u.call(t),d(e,t)}):o.beforeCreate=d?[].concat(d,u):[u]),{esModule:a,exports:c,options:o}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t={props:{mdTheme:null},computed:{$mdActiveTheme:function(){var e=s.default.enabled,t=s.default.getThemeName,n=s.default.getAncestorTheme;return e&&!1!==this.mdTheme?t(this.mdTheme||n(this)):null}}};return(0,o.default)(t,e)},r=n(4),s=i(r),a=n(6),o=i(a)}),(function(t,n){t.exports=e}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u;Object.defineProperty(t,"__esModule",{value:!0}),n(7),r=n(5),s=i(r),a=n(4),o=i(a),u=function(){var e=new s.default({ripple:!0,theming:{},locale:{startYear:1900,endYear:2099,dateFormat:"YYYY-MM-DD",days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shorterDays:["S","M","T","W","T","F","S"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"],shorterMonths:["J","F","M","A","M","Ju","Ju","A","Se","O","N","D"],firstDayOfAWeek:0}});return Object.defineProperties(e.theming,{metaColors:{get:function(){return o.default.metaColors},set:function(e){o.default.metaColors=e}},theme:{get:function(){return o.default.theme},set:function(e){o.default.theme=e}},enabled:{get:function(){return o.default.enabled},set:function(e){o.default.enabled=e}}}),e},t.default=function(e){e.material||(e.material=u(),e.prototype.$material=e.material)}}),(function(e,t,n){"use strict";var i,r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),i=n(2),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),s=null,a=null,o=null,t.default=new r.default({data:function(){return{prefix:"md-theme-",theme:"default",enabled:!0,metaColors:!1}},computed:{themeTarget:function(){return!this.$isServer&&document.documentElement},fullThemeName:function(){return this.getThemeName()}},watch:{enabled:{immediate:!0,handler:function(){var e=this.fullThemeName,t=this.themeTarget,n=this.enabled;t&&(n?(t.classList.add(e),this.metaColors&&this.setHtmlMetaColors(e)):(t.classList.remove(e),this.metaColors&&this.setHtmlMetaColors()))}},theme:function(e,t){var n=this.getThemeName,i=this.themeTarget;e=n(e),i.classList.remove(n(t)),i.classList.add(e),this.metaColors&&this.setHtmlMetaColors(e)},metaColors:function(e){e?this.setHtmlMetaColors(this.fullThemeName):this.setHtmlMetaColors()}},methods:{getAncestorTheme:function(e){var t,n=this;return e?(t=e.mdTheme,(function e(i){if(i){var r=i.mdTheme,s=i.$parent;return r&&r!==t?r:e(s)}return n.theme})(e.$parent)):null},getThemeName:function(e){var t=e||this.theme;return this.prefix+t},setMicrosoftColors:function(e){s&&s.setAttribute("content",e)},setThemeColors:function(e){a&&a.setAttribute("content",e)},setMaskColors:function(e){o&&o.setAttribute("color",e)},setHtmlMetaColors:function(e){var t,n="#fff";e&&(t=window.getComputedStyle(document.documentElement),n=t.getPropertyValue("--"+e+"-primary")),n&&(this.setMicrosoftColors(n),this.setThemeColors(n),this.setMaskColors(n))}},mounted:function(){var e=this;s=document.querySelector('[name="msapplication-TileColor"]'),a=document.querySelector('[name="theme-color"]'),o=document.querySelector('[rel="mask-icon"]'),this.enabled&&this.metaColors&&window.addEventListener("load",(function(){e.setHtmlMetaColors(e.fullThemeName)}))}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t={};return r.default.util.defineReactive(t,"reactive",e),t.reactive},i=n(2),r=(function(e){return e&&e.__esModule?e:{default:e}})(i)}),(function(e,t,n){"use strict";function i(e){return!!e&&"object"==typeof e}function r(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||s(e)}function s(e){return e.$$typeof===m}function a(e){return Array.isArray(e)?[]:{}}function o(e,t){return t&&!1===t.clone||!c(e)?e:d(a(e),e,t)}function u(e,t,n){return e.concat(t).map((function(e){return o(e,n)}))}function l(e,t,n){var i={};return c(e)&&Object.keys(e).forEach((function(t){i[t]=o(e[t],n)})),Object.keys(t).forEach((function(r){c(t[r])&&e[r]?i[r]=d(e[r],t[r],n):i[r]=o(t[r],n)})),i}function d(e,t,n){var i=Array.isArray(t),r=Array.isArray(e),s=n||{arrayMerge:u};return i===r?i?(s.arrayMerge||u)(e,t,n):l(e,t,n):o(t,n)}var c,f,m,h;Object.defineProperty(t,"__esModule",{value:!0}),c=function(e){return i(e)&&!r(e)},f="function"==typeof Symbol&&Symbol.for,m=f?Symbol.for("react.element"):60103,d.all=function(e,t){if(!Array.isArray(e))throw Error("first argument should be an array");return e.reduce((function(e,n){return d(e,n,t)}),{})},h=d,t.default=h}),(function(e,t){}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(2),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=function(e,t){return{validator:function(n){return!!t.includes(n)||(r.default.util.warn("The "+e+" prop is invalid. Given value: "+n+". Available options: "+t.join(", ")+".",void 0),!1)}}}}),(function(e,t,n){(function(t){var i,r,s,a,o,u=n(13),l="undefined"==typeof window?t:window,d=["moz","webkit"],c="AnimationFrame",f=l["request"+c],m=l["cancel"+c]||l["cancelRequest"+c];for(i=0;!f&&i<d.length;i++)f=l[d[i]+"Request"+c],m=l[d[i]+"Cancel"+c]||l[d[i]+"CancelRequest"+c];f&&m||(r=0,s=0,a=[],o=1e3/60,f=function(e){if(0===a.length){var t=u(),n=Math.max(0,o-(t-r));r=n+t,setTimeout((function(){var e,t=a.slice(0);for(a.length=0,e=0;e<t.length;e++)if(!t[e].cancelled)try{t[e].callback(r)}catch(e){setTimeout((function(){throw e}),0)}}),Math.round(n))}return a.push({handle:++s,callback:e,cancelled:!1}),s},m=function(e){for(var t=0;t<a.length;t++)a[t].handle===e&&(a[t].cancelled=!0)}),e.exports=function(e){return f.call(l,e)},e.exports.cancel=function(){m.apply(l,arguments)},e.exports.polyfill=function(e){e||(e=l),e.requestAnimationFrame=f,e.cancelAnimationFrame=m}}).call(t,n(11))}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){return Math.random().toString(36).slice(4)};t.default=i}),(function(e,t){var n;n=(function(){return this})();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n}),(function(e,t,n){"use strict";function i(e){n(30)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(19),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(34),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){(function(t){(function(){var n,i,r,s,a,o;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:void 0!==t&&null!==t&&t.hrtime?(e.exports=function(){return(n()-a)/1e6},i=t.hrtime,n=function(){var e;return e=i(),1e9*e[0]+e[1]},s=n(),o=1e9*t.uptime(),a=s-o):Date.now?(e.exports=function(){return Date.now()-r},r=Date.now()):(e.exports=function(){return(new Date).getTime()-r},r=(new Date).getTime())}).call(this)}).call(t,n(14))}),(function(e,t){function n(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}function r(e){if(d===setTimeout)return setTimeout(e,0);if((d===n||!d)&&setTimeout)return d=setTimeout,setTimeout(e,0);try{return d(e,0)}catch(t){try{return d.call(null,e,0)}catch(t){return d.call(this,e,0)}}}function s(e){if(c===clearTimeout)return clearTimeout(e);if((c===i||!c)&&clearTimeout)return c=clearTimeout,clearTimeout(e);try{return c(e)}catch(t){try{return c.call(null,e)}catch(t){return c.call(this,e)}}}function a(){m&&h&&(m=!1,h.length?f=h.concat(f):p=-1,f.length&&o())}function o(){var e,t;if(!m){for(e=r(a),m=!0,t=f.length;t;){for(h=f,f=[];++p<t;)h&&h[p].run();p=-1,t=f.length}h=null,m=!1,s(e)}}function u(e,t){this.fun=e,this.array=t}function l(){}var d,c,f,m,h,p,v=e.exports={};!(function(){try{d="function"==typeof setTimeout?setTimeout:n}catch(e){d=n}try{c="function"==typeof clearTimeout?clearTimeout:i}catch(e){c=i}})(),f=[],m=!1,p=-1,v.nextTick=function(e){var t,n=Array(arguments.length-1);if(arguments.length>1)for(t=1;t<arguments.length;t++)n[t-1]=arguments[t];f.push(new u(e,n)),1!==f.length||m||r(o)},u.prototype.run=function(){this.fun.apply(null,this.array)},v.title="browser",v.browser=!0,v.env={},v.argv=[],v.version="",v.versions={},v.on=l,v.addListener=l,v.once=l,v.off=l,v.removeListener=l,v.removeAllListeners=l,v.emit=l,v.prependListener=l,v.prependOnceListener=l,v.listeners=function(e){return[]},v.binding=function(e){throw Error("process.binding is not supported")},v.cwd=function(){return"/"},v.chdir=function(e){throw Error("process.chdir is not supported")},v.umask=function(){return 0}}),(function(e,t,n){function i(e,t){var n,i,l,c,h,p,v,b,g,_;return d(e)?new Date(e.getTime()):"string"!=typeof e?new Date(e):(n=t||{},i=n.additionalDigits,i=null==i?m:+i,l=r(e),c=s(l.date,i),h=c.year,p=c.restDateString,v=a(p,h),v?(b=v.getTime(),g=0,l.time&&(g=o(l.time)),l.timezone?_=u(l.timezone):(_=new Date(b+g).getTimezoneOffset(),_=new Date(b+g+_*f).getTimezoneOffset()),new Date(b+g+_*f)):new Date(e))}function r(e){var t,n,i={},r=e.split(h);return p.test(r[0])?(i.date=null,t=r[0]):(i.date=r[0],t=r[1]),t&&(n=P.exec(t),n?(i.time=t.replace(n[1],""),i.timezone=n[1]):i.time=t),i}function s(e,t){var n,i,r=b[t],s=_[t],a=g.exec(e)||s.exec(e);return a?(n=a[1],{year:parseInt(n,10),restDateString:e.slice(n.length)}):(a=v.exec(e)||r.exec(e),a?(i=a[1],{year:100*parseInt(i,10),restDateString:e.slice(i.length)}):{year:null})}function a(e,t){var n,i,r,s,a,o,u;return null===t?null:0===e.length?(i=new Date(0),i.setUTCFullYear(t),i):(n=M.exec(e))?(i=new Date(0),r=parseInt(n[1],10)-1,i.setUTCFullYear(t,r),i):(n=y.exec(e))?(i=new Date(0),a=parseInt(n[1],10),i.setUTCFullYear(t,0,a),i):(n=S.exec(e))?(i=new Date(0),r=parseInt(n[1],10)-1,o=parseInt(n[2],10),i.setUTCFullYear(t,r,o),i):(n=w.exec(e))?(s=parseInt(n[1],10)-1,l(t,s)):(n=C.exec(e),n?(s=parseInt(n[1],10)-1,u=parseInt(n[2],10)-1,l(t,s,u)):null)}function o(e){var t,n,i,r=x.exec(e);return r?(t=parseFloat(r[1].replace(",",".")))%24*c:(r=O.exec(e))?(t=parseInt(r[1],10),n=parseFloat(r[2].replace(",",".")),t%24*c+n*f):(r=T.exec(e),r?(t=parseInt(r[1],10),n=parseInt(r[2],10),i=parseFloat(r[3].replace(",",".")),t%24*c+n*f+1e3*i):null)}function u(e){var t,n=$.exec(e);return n?0:(n=D.exec(e))?(t=60*parseInt(n[2],10),"+"===n[1]?-t:t):(n=A.exec(e),n?(t=60*parseInt(n[2],10)+parseInt(n[3],10),"+"===n[1]?-t:t):0)}function l(e,t,n){var i,r,s;return t=t||0,n=n||0,i=new Date(0),i.setUTCFullYear(e,0,4),r=i.getUTCDay()||7,s=7*t+n+1-r,i.setUTCDate(i.getUTCDate()+s),i}var d=n(136),c=36e5,f=6e4,m=2,h=/[T ]/,p=/:/,v=/^(\d{2})$/,b=[/^([+-]\d{2})$/,/^([+-]\d{3})$/,/^([+-]\d{4})$/],g=/^(\d{4})/,_=[/^([+-]\d{4})/,/^([+-]\d{5})/,/^([+-]\d{6})/],M=/^-(\d{2})$/,y=/^-?(\d{3})$/,S=/^-?(\d{2})-?(\d{2})$/,w=/^-?W(\d{2})$/,C=/^-?W(\d{2})-?(\d{1})$/,x=/^(\d{2}([.,]\d*)?)$/,O=/^(\d{2}):?(\d{2}([.,]\d*)?)$/,T=/^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,P=/([Z+-].*)$/,$=/^(Z)$/,D=/^([+-])(\d{2})$/,A=/^([+-])(\d{2}):?(\d{2})$/;e.exports=i}),(function(e,t,n){"use strict";function i(e){n(22)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(17),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(25),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(9),a=i(s),o=n(1),u=i(o),l=n(10),d=i(l),c=n(21),f=i(c),t.default=new u.default({name:"MdRipple",components:{MdWave:f.default},props:{mdActive:null,mdDisabled:Boolean,mdCentered:Boolean,mdEventTrigger:{type:Boolean,default:!0}},data:function(){return{ripples:[],touchTimeout:null,eventType:null}},computed:{isDisabled:function(){return!this.$material.ripple||this.mdDisabled},rippleClasses:function(){return{"md-disabled":this.isDisabled}},waveClasses:function(){return{"md-centered":this.mdCentered}}},watch:{mdActive:function(e){var t="boolean"==typeof e,n="mouseevent"===(""+e.constructor).match(/function (\w*)/)[1].toLowerCase();t&&this.mdCentered&&e?this.startRipple({type:"mousedown"}):n&&this.startRipple(e),this.$emit("update:mdActive",!1)}},methods:{touchMoveCheck:function(){window.clearTimeout(this.touchTimeout)},touchStartCheck:function(e){var t=this;this.touchTimeout=window.setTimeout((function(){t.startRipple(e)}),100)},startRipple:function(e){var t=this;(0,a.default)((function(){var n,i,r=t.eventType,s=t.isDisabled,a=t.mdCentered;s||r&&r!==e.type||(n=t.getSize(),i=null,i=a?t.getCenteredPosition(n):t.getHitPosition(e,n),t.eventType=e.type,t.ripples.push({waveStyles:t.applyStyles(i,n),uuid:(0,d.default)()}))}))},applyStyles:function(e,t){return t+="px",r({},e,{width:t,height:t})},clearWave:function(e){this.ripples=e?this.ripples.filter((function(t){return t.uuid!==e})):[]},getSize:function(){var e=this.$el,t=e.offsetWidth,n=e.offsetHeight;return Math.round(Math.max(t,n))},getCenteredPosition:function(e){var t=-e/2+"px";return{"margin-top":t,"margin-left":t}},getHitPosition:function(e,t){var n=this.$el.getBoundingClientRect(),i=e.pageY,r=e.pageX;return"touchstart"===e.type&&(i=e.changedTouches[0].pageY,r=e.changedTouches[0].pageX),{top:i-n.top-t/2-document.documentElement.scrollTop+"px",left:r-n.left-t/2-document.documentElement.scrollLeft+"px"}}}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdWave",data:function(){return{animating:!0}},props:{waveClasses:null,waveStyles:null},methods:{end:function(){this.animating=null,this.$emit("md-end")}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(31),o=i(a),t.default=new s.default({name:"MdIcon",components:{MdSvgLoader:o.default},props:{mdSrc:String}})}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={};t.default={name:"MdSVGLoader",props:{mdSrc:{type:String,required:!0}},data:function(){return{html:null,error:null}},watch:{mdSrc:function(){this.html=null,this.loadSVG()}},methods:{isSVG:function(e){return e.indexOf("svg")>=0},setHtml:function(e){var t=this;i[this.mdSrc].then((function(e){return t.html=e,t.$nextTick()})).then((function(){return t.$emit("md-loaded")}))},unexpectedError:function(e){this.error="Something bad happened trying to fetch "+this.mdSrc+".",e(this.error)},loadSVG:function(){var e=this;i.hasOwnProperty(this.mdSrc)?this.setHtml():i[this.mdSrc]=new Promise(function(t,n){var i=new window.XMLHttpRequest;i.open("GET",e.mdSrc,!0),i.onload=function(){var r=i.getResponseHeader("content-type");200===i.status?e.isSVG(r)?(t(i.response),e.setHtml()):(e.error="The file "+e.mdSrc+" is not a valid SVG.",n(e.error)):i.status>=400&&i.status<500?(e.error="The file "+e.mdSrc+" do not exists.",n(e.error)):e.unexpectedError(n)},i.onerror=function(){return e.unexpectedError(n)},i.onabort=function(){return e.unexpectedError(n)},i.send()})}},mounted:function(){this.loadSVG()}}}),(function(e,t,n){"use strict";function i(e){n(23)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(18),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(24),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"md-ripple"},on:{"after-enter":e.end}},[e.animating?n("span"):e._e()])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:["md-ripple",e.rippleClasses],on:{"&touchstart":function(t){!(function(t){e.mdEventTrigger&&e.touchStartCheck(t)})(t)},"&touchmove":function(t){!(function(t){e.mdEventTrigger&&e.touchMoveCheck(t)})(t)},"&mousedown":function(t){!(function(t){e.mdEventTrigger&&e.startRipple(t)})(t)}}},[e._t("default"),e._v(" "),e._l(e.ripples,(function(t){return e.isDisabled?e._e():n("md-wave",{key:t.uuid,class:["md-ripple-wave",e.waveClasses],style:t.waveStyles,on:{"md-end":function(n){e.clearWave(t.uuid)}}})}))],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(2),s=i(r),a=n(9),o=i(a),t.default={name:"MdPortal",abstract:!0,props:{mdAttachToParent:Boolean,mdTarget:{type:null,validator:function(e){return!!(HTMLElement&&e&&e instanceof HTMLElement)||(s.default.util.warn("The md-target-el prop is invalid. You should pass a valid HTMLElement.",this),!1)}}},data:function(){return{leaveTimeout:null,originalParentEl:null}},computed:{transitionName:function(){var e,t,n=this._vnode.componentOptions.children[0];if(n){if(e=n.data.transition)return e.name;if(t=n.componentOptions.propsData.name)return t}return"v"},leaveClass:function(){return this.transitionName+"-leave"},leaveActiveClass:function(){return this.transitionName+"-leave-active"},leaveToClass:function(){return this.transitionName+"-leave-to"}},watch:{mdTarget:function(e,t){this.changeParentEl(e),t&&this.$forceUpdate()}},methods:{getTransitionDuration:function(e){var t=window.getComputedStyle(e).transitionDuration,n=parseFloat(t,10),i=t.match(/m?s/);return i&&(i=i[0]),"s"===i?1e3*n:"ms"===i?n:0},killGhostElement:function(e){e.parentNode&&(this.changeParentEl(this.originalParentEl),this.$options._parentElm=this.originalParentEl,e.parentNode.removeChild(e))},initDestroy:function(e){var t=this,n=this.$el;e&&this.$el.nodeType===Node.COMMENT_NODE&&(n=this.$vnode.elm),n.classList.add(this.leaveClass),n.classList.add(this.leaveActiveClass),this.$nextTick().then((function(){n.classList.add(t.leaveToClass),clearTimeout(t.leaveTimeout),t.leaveTimeout=setTimeout((function(){t.destroyElement(n)}),t.getTransitionDuration(n))}))},destroyElement:function(e){var t=this;(0,o.default)((function(){e.classList.remove(t.leaveClass),e.classList.remove(t.leaveActiveClass),e.classList.remove(t.leaveToClass),t.$emit("md-destroy"),t.killGhostElement(e)}))},changeParentEl:function(e){e&&e.appendChild(this.$el)}},mounted:function(){this.originalParentEl||(this.originalParentEl=this.$el.parentNode,this.$emit("md-initial-parent",this.$el.parentNode)),this.mdAttachToParent&&this.$el.parentNode.parentNode?this.changeParentEl(this.$el.parentNode.parentNode):document&&this.changeParentEl(this.mdTarget||document.body)},beforeDestroy:function(){this.$el.classList?this.initDestroy():this.killGhostElement(this.$el)},render:function(e){var t=this.$slots.default;if(t&&t[0])return t[0]}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e};t.default=function(e,t){return i({},t,e.$options.components["router-link"].options.props)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(39),u=i(o),l=n(36),d=i(l),c=n(27),f=i(c),m=n(43),h=i(m),t.default=new a.default({name:"MdButton",data:function(){return{rippleActive:!1}},components:{MdButtonContent:h.default},mixins:[d.default,u.default],props:{href:String,type:{type:String,default:"button"},disabled:Boolean,to:null},computed:{rippleWorks:function(){return this.mdRipple&&!this.disabled}},render:function(e){var t=this,n=e("md-button-content",{attrs:{mdRipple:this.mdRipple,disabled:this.disabled},props:{mdRippleActive:this.rippleActive},on:{"update:mdRippleActive":function(e){return t.rippleActive=e}}},this.$slots.default),i={staticClass:"md-button",class:[this.$mdActiveTheme,{"md-ripple-off":!this.mdRipple,"md-focused":this.mdHasFocus}],attrs:r({},this.attrs,{href:this.href,disabled:this.disabled,type:!this.href&&(this.type||"button")}),on:r({},this.$listeners,{touchstart:function(e){t.rippleWorks&&(t.rippleActive=e),t.$listeners.touchstart&&t.$listeners.touchstart(e)},touchmove:function(e){t.rippleWorks&&(t.rippleActive=e),t.$listeners.touchmove&&t.$listeners.touchmove(e)},mousedown:function(e){t.rippleWorks&&(t.rippleActive=e),t.$listeners.mousedown&&t.$listeners.mousedown(e)}})},s="button";return this.href?s="a":this.$router&&this.to&&(this.$options.props=(0,f.default)(this,this.$options.props),s="router-link",i.props=this.$props,delete i.props.type,delete i.attrs.type,delete i.props.href,delete i.attrs.href),e(s,i,[n])}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(16),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdButtonContent",components:{MdRipple:r.default},props:{mdRipple:Boolean,mdRippleActive:null,disabled:Boolean}}}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){n(32)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(20),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(33),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("i",{staticClass:"md-svg-loader",domProps:{innerHTML:e._s(e.html)}})},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.mdSrc?n("md-svg-loader",{staticClass:"md-icon md-icon-image",class:[e.$mdActiveTheme],attrs:{"md-src":e.mdSrc},on:{"md-loaded":function(t){e.$emit("md-loaded")}}}):n("i",{staticClass:"md-icon md-icon-font",class:[e.$mdActiveTheme]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(36),s=i(r),a=n(168),o=i(a),t.default={mixins:[s.default],components:{MdListItemContent:o.default},props:{disabled:Boolean},computed:{isDisabled:function(){return!this.mdRipple||this.disabled}}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(16),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={components:{MdRipple:r.default},props:{mdRipple:{type:Boolean,default:!0}}}}),(function(e,t,n){"use strict";function i(e){n(42)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(28),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(0),u=null,l=!1,d=i,c=null,f=null,m=o(s.a,u,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(62),a=i(s),o=n(6),u=i(o),l=n(26),d=i(l),t.default={name:"MdPopover",abstract:!0,components:{MdPortal:d.default},props:{mdActive:Boolean,mdSettings:{type:Object,default:function(){return{}}}},data:function(){return{popperInstance:null,originalParentEl:null,shouldRender:!1,shouldActivate:!1}},computed:{popoverClasses:function(){return this.shouldActivate?"md-active":this.shouldRender?"md-rendering":void 0}},watch:{mdActive:{immediate:!0,handler:function(e){this.shouldRender=e,e?this.bindPopper():this.shouldActivate=!1}},mdSettings:function(){this.popperInstance&&this.createPopper()}},methods:{getPopperOptions:function(){var e=this;return{placement:"bottom",modifiers:{preventOverflow:{boundariesElement:"viewport",padding:16},computeStyle:{gpuAcceleration:!1}},onCreate:function(){e.shouldActivate=!0,e.$emit("md-active")}}},setOriginalParent:function(e){this.originalParentEl||(this.originalParentEl=e)},killPopper:function(){this.popperInstance&&(this.popperInstance.destroy(),this.popperInstance=null)},bindPopper:function(){var e=this;this.$nextTick().then((function(){e.originalParentEl&&e.createPopper()}))},createPopper:function(){if(this.mdSettings){var e=(0,u.default)(this.getPopperOptions(),this.mdSettings);this.$el.nodeType!==Node.COMMENT_NODE&&(this.popperInstance=new a.default(this.originalParentEl,this.$el,e))}},resetPopper:function(){this.popperInstance&&(this.killPopper(),this.createPopper())}},beforeDestroy:function(){this.killPopper()},mounted:function(){this.resetPopper()},render:function(e){return e(d.default,{props:r({},this.$attrs),on:r({},this.$listeners,{"md-initial-parent":this.setOriginalParent,"md-destroy":this.killPopper})},this.$slots.default)}}}),(function(e,t,n){"use strict";function i(){try{var e=Object.defineProperty({},"passive",{get:function(){v={passive:!0}}});window.addEventListener("ghost",null,e)}catch(e){}}function r(e){var t=(e.keyCode,e.target);b.currentElement=t}function s(e){b.currentElement=null}function a(){p.addEventListener("keyup",r)}function o(){p.addEventListener("pointerup",s)}function u(){p.addEventListener("MSPointerUp",s)}function l(){p.addEventListener("mouseup",s),"ontouchend"in window&&p.addEventListener("touchend",s,v)}function d(){window.PointerEvent?o():window.MSPointerEvent?u():l(),a()}function c(){h||(p=document.body,i(),d(),h=!0)}var f,m,h,p,v,b;Object.defineProperty(t,"__esModule",{value:!0}),f=n(5),m=(function(e){return e&&e.__esModule?e:{default:e}})(f),h=!1,p=null,v=!1,b=new m.default({currentElement:null}),t.default={data:function(){return{mdHasFocus:!1}},computed:{focusedElement:function(){return b.currentElement}},watch:{focusedElement:function(e){this.mdHasFocus=e===this.$el}},mounted:function(){c()}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e};t.default={props:{value:{},placeholder:String,name:String,maxlength:[String,Number],readonly:Boolean,required:Boolean,disabled:Boolean,mdCounter:[String,Number]},data:function(){return{localValue:this.value,textareaHeight:!1}},computed:{model:{get:function(){return this.localValue},set:function(e){var t=this;"inputevent"!==(""+e.constructor).match(/function (\w*)/)[1].toLowerCase()&&this.$nextTick((function(){t.localValue=e}))}},clear:function(){return this.MdField.clear},attributes:function(){return i({},this.$attrs,{type:this.type,id:this.id,name:this.name,disabled:this.disabled,required:this.required,placeholder:this.placeholder,readonly:this.readonly,maxlength:this.maxlength})}},watch:{model:function(){this.setFieldValue()},clear:function(e){e&&this.clearField()},placeholder:function(){this.setPlaceholder()},disabled:function(){this.setDisabled()},required:function(){this.setRequired()},maxlength:function(){this.setMaxlength()},mdCounter:function(){this.setMaxlength()},localValue:function(e){this.$emit("input",e)},value:function(e){this.localValue=e}},methods:{clearField:function(){this.$el.value="",this.model="",this.setFieldValue()},setLabelFor:function(){var e,t;this.$el.parentNode&&(e=this.$el.parentNode.querySelector("label"))&&(!(t=e.getAttribute("for"))||t.indexOf("md-")>=0)&&e.setAttribute("for",this.id)},setFieldValue:function(){this.MdField.value=this.model},setPlaceholder:function(){this.MdField.placeholder=!!this.placeholder},setDisabled:function(){this.MdField.disabled=!!this.disabled},setRequired:function(){this.MdField.required=!!this.required},setMaxlength:function(){this.mdCounter?this.MdField.counter=parseInt(this.mdCounter,10):this.MdField.maxlength=parseInt(this.maxlength,10)},onFocus:function(){this.MdField.focused=!0},onBlur:function(){this.MdField.focused=!1}},created:function(){this.setFieldValue(),this.setPlaceholder(),this.setDisabled(),this.setRequired(),this.setMaxlength()},mounted:function(){this.setLabelFor()}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={methods:{isAssetIcon:function(e){return/\w+[\/\\.]\w+/.test(e)}}}}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){n(44)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(29),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(45),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-ripple",{attrs:{"md-disabled":!e.mdRipple||e.disabled,"md-event-trigger":!1,"md-active":e.mdRippleActive},on:{"update:mdActive":function(t){return e.$emit("update:mdRippleActive",t)}}},[n("div",{staticClass:"md-button-content"},[e._t("default")],2)])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(60),o=i(a),u=n(82),l=i(u),d=n(84),c=i(d),t.default=new s.default({name:"MdField",components:{MdClearIcon:o.default,MdPasswordOffIcon:l.default,MdPasswordOnIcon:c.default},props:{mdInline:Boolean,mdClearable:Boolean,mdCounter:{type:Boolean,default:!0},mdTogglePassword:{type:Boolean,default:!0}},data:function(){return{showPassword:!1,MdField:{value:null,focused:!1,highlighted:!1,disabled:!1,required:!1,placeholder:!1,textarea:!1,autogrow:!1,maxlength:null,counter:null,password:null,togglePassword:!1,clear:!1,file:!1}}},provide:function(){return{MdField:this.MdField}},computed:{stringValue:function(){return(this.MdField.value||0===this.MdField.value)&&""+this.MdField.value},hasCounter:function(){return this.mdCounter&&(this.MdField.maxlength||this.MdField.counter)},hasPasswordToggle:function(){return this.mdTogglePassword&&this.MdField.password},hasValue:function(){return this.stringValue&&this.stringValue.length>0},valueLength:function(){return this.stringValue?this.stringValue.length:0},fieldClasses:function(){return{"md-inline":this.mdInline,"md-clearable":this.mdClearable,"md-focused":this.MdField.focused,"md-highlight":this.MdField.highlighted,"md-disabled":this.MdField.disabled,"md-required":this.MdField.required,"md-has-value":this.hasValue,"md-has-placeholder":this.MdField.placeholder,"md-has-textarea":this.MdField.textarea,"md-has-password":this.MdField.password,"md-has-file":this.MdField.file,"md-has-select":this.MdField.select,"md-autogrow":this.MdField.autogrow}}},methods:{clearInput:function(){var e=this;this.MdField.clear=!0,this.$emit("md-clear"),this.$nextTick().then((function(){e.MdField.clear=!1}))},togglePassword:function(){this.MdField.togglePassword=!this.MdField.togglePassword},onBlur:function(){this.MdField.highlighted=!1}}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdClearIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdPasswordOffIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdPasswordOnIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(51),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(87),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(10),u=i(o),l=n(40),d=i(l),t.default=new a.default({name:"MdInput",mixins:[d.default],inject:["MdField"],props:{id:{type:String,default:function(){return"md-input-"+(0,u.default)()}},type:{type:String,default:"text"}},computed:{toggleType:function(){return this.MdField.togglePassword},isPassword:function(){return"password"===this.type},listeners:function(){var e=r({},this.$listeners);return delete e.input,e}},watch:{type:function(e){this.setPassword(this.isPassword)},toggleType:function(e){e?this.setTypeText():this.setTypePassword()}},methods:{setPassword:function(e){this.MdField.password=e,this.MdField.togglePassword=!1},setTypePassword:function(){this.$el.type="password"},setTypeText:function(){this.$el.type="text"}},created:function(){this.setPassword(this.isPassword)},beforeDestroy:function(){this.setPassword(!1)}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(26),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdOverlay",components:{MdPortal:r.default},props:{mdActive:Boolean,mdAttachToParent:Boolean,mdFixed:Boolean},computed:{overlayClasses:function(){return{"md-fixed":this.mdFixed}}}}}),(function(e,t,n){"use strict";function i(e){n(61)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(38),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(0),u=null,l=!1,d=i,c=null,f=null,m=o(s.a,u,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdList",data:function(){return{MdList:{expandable:[],expandATab:this.expandATab,pushExpandable:this.pushExpandable,removeExpandable:this.removeExpandable}}},provide:function(){return{MdList:this.MdList}},props:{mdExpandSingle:{default:!1}},methods:{expandATab:function(e){if(this.mdExpandSingle&&e){this.MdList.expandable.filter((function(t){return t!==e})).forEach((function(e){return e.close()}))}},pushExpandable:function(e){var t=this.MdList.expandable;t.find((function(t){return t===e}))||(this.MdList.expandable=t.concat([e]))},removeExpandable:function(e){var t=this.MdList.expandable;t.find((function(t){return t===e}))&&(this.MdList.expandable=t.filter((function(t){return t!==e})))}}})}),(function(e,t,n){"use strict";function i(e){n(90)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(52),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(91),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(2),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdFocusTrap",abstract:!0,methods:{setFocus:function(){var e=this;window.setTimeout((function(){e.$el.tagName&&(e.$el.setAttribute("tabindex","-1"),e.$el.focus())}),20)}},mounted:function(){this.setFocus()},render:function(){try{var e=this.$slots.default;if(!e)return null;if(e.length>1)throw Error();return e[0]}catch(e){r.default.util.warn("MdFocusTrap can only render one, and exactly one child component.",this)}return null}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,i){function r(){e.removeEventListener(t,n)}return t&&t.indexOf("click")>=0&&/iP/i.test(navigator.userAgent)&&(e.style.cursor="pointer"),e.addEventListener(t,n,i||!1),{destroy:r}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(9),s=i(r),a=n(57),o=i(a),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window,t=arguments[1];return{destroy:(0,o.default)(e,"resize",(function(){(0,s.default)(t)}),{passive:!0}).destroy}}}),(function(e,t,n){"use strict";function i(e){n(80)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(46),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(86),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(47),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(81),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t){}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){function n(e){var t=!1;return function(){t||(t=!0,window.Promise.resolve().then((function(){t=!1,e()})))}}function i(e){var t=!1;return function(){t||(t=!0,setTimeout((function(){t=!1,e()}),Ce))}}function r(e){var t={};return e&&"[object Function]"===t.toString.call(e)}function s(e,t){if(1!==e.nodeType)return[];var n=getComputedStyle(e,null);return t?n[t]:n}function a(e){return"HTML"===e.nodeName?e:e.parentNode||e.host}function o(e){if(!e)return document.body;switch(e.nodeName){case"HTML":case"BODY":return e.ownerDocument.body;case"#document":return e.body}var t=s(e),n=t.overflow,i=t.overflowX;return/(auto|scroll)/.test(n+t.overflowY+i)?e:o(a(e))}function u(e){var t=e&&e.offsetParent,n=t&&t.nodeName;return n&&"BODY"!==n&&"HTML"!==n?-1!==["TD","TABLE"].indexOf(t.nodeName)&&"static"===s(t,"position")?u(t):t:e?e.ownerDocument.documentElement:document.documentElement}function l(e){var t=e.nodeName;return"BODY"!==t&&("HTML"===t||u(e.firstElementChild)===e)}function d(e){return null!==e.parentNode?d(e.parentNode):e}function c(e,t){var n,i,r,s,a,o;return e&&e.nodeType&&t&&t.nodeType?(n=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?e:t,r=n?t:e,s=document.createRange(),s.setStart(i,0),s.setEnd(r,0),a=s.commonAncestorContainer,e!==a&&t!==a||i.contains(r)?l(a)?a:u(a):(o=d(e),o.host?c(o.host,t):c(e,d(t).host))):document.documentElement}function f(e){var t,n,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",r="top"===i?"scrollTop":"scrollLeft",s=e.nodeName;return"BODY"===s||"HTML"===s?(t=e.ownerDocument.documentElement,n=e.ownerDocument.scrollingElement||t,n[r]):e[r]}function m(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=f(t,"top"),r=f(t,"left"),s=n?-1:1;return e.top+=i*s,e.bottom+=i*s,e.left+=r*s,e.right+=r*s,e}function h(e,t){var n="x"===t?"Left":"Top",i="Left"===n?"Right":"Bottom";return parseFloat(e["border"+n+"Width"],10)+parseFloat(e["border"+i+"Width"],10)}function p(e,t,n,i){return Math.max(t["offset"+e],t["scroll"+e],n["client"+e],n["offset"+e],n["scroll"+e],ce()?n["offset"+e]+i["margin"+("Height"===e?"Top":"Left")]+i["margin"+("Height"===e?"Bottom":"Right")]:0)}function v(){var e=document.body,t=document.documentElement,n=ce()&&getComputedStyle(t);return{height:p("Height",e,t,n),width:p("Width",e,t,n)}}function b(e){return pe({},e,{right:e.left+e.width,bottom:e.top+e.height})}function g(e){var t,n,i,r,a,o,u,l,d,c={};if(ce())try{c=e.getBoundingClientRect(),t=f(e,"top"),n=f(e,"left"),c.top+=t,c.left+=n,c.bottom+=t,c.right+=n}catch(e){}else c=e.getBoundingClientRect();return i={left:c.left,top:c.top,width:c.right-c.left,height:c.bottom-c.top},r="HTML"===e.nodeName?v():{},a=r.width||e.clientWidth||i.right-i.left,o=r.height||e.clientHeight||i.bottom-i.top,u=e.offsetWidth-a,l=e.offsetHeight-o,(u||l)&&(d=s(e),u-=h(d,"x"),l-=h(d,"y"),i.width-=u,i.height-=l),b(i)}function _(e,t){var n,i,r=ce(),a="HTML"===t.nodeName,u=g(e),l=g(t),d=o(e),c=s(t),f=parseFloat(c.borderTopWidth,10),h=parseFloat(c.borderLeftWidth,10),p=b({top:u.top-l.top-f,left:u.left-l.left-h,width:u.width,height:u.height});return p.marginTop=0,p.marginLeft=0,!r&&a&&(n=parseFloat(c.marginTop,10),i=parseFloat(c.marginLeft,10),p.top-=f-n,p.bottom-=f-n,p.left-=h-i,p.right-=h-i,p.marginTop=n,p.marginLeft=i),(r?t.contains(d):t===d&&"BODY"!==d.nodeName)&&(p=m(p,t)),p}function M(e){var t=e.ownerDocument.documentElement,n=_(e,t),i=Math.max(t.clientWidth,window.innerWidth||0),r=Math.max(t.clientHeight,window.innerHeight||0),s=f(t),a=f(t,"left");return b({top:s-n.top+n.marginTop,left:a-n.left+n.marginLeft,width:i,height:r})}function y(e){var t=e.nodeName;return"BODY"!==t&&"HTML"!==t&&("fixed"===s(e,"position")||y(a(e)))}function S(e,t,n,i){var r,s,u,l,d,f={top:0,left:0},m=c(e,t);return"viewport"===i?f=M(m):(r=void 0,"scrollParent"===i?(r=o(a(t)),"BODY"===r.nodeName&&(r=e.ownerDocument.documentElement)):r="window"===i?e.ownerDocument.documentElement:i,s=_(r,m),"HTML"!==r.nodeName||y(m)?f=s:(u=v(),l=u.height,d=u.width,f.top+=s.top-s.marginTop,f.bottom=l+s.top,f.left+=s.left-s.marginLeft,f.right=d+s.left)),f.left+=n,f.top+=n,f.right-=n,f.bottom-=n,f}function w(e){return e.width*e.height}function C(e,t,n,i,r){var s,a,o,u,l,d,c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;return-1===e.indexOf("auto")?e:(s=S(n,i,c,r),a={top:{width:s.width,height:t.top-s.top},right:{width:s.right-t.right,height:s.height},bottom:{width:s.width,height:s.bottom-t.bottom},left:{width:t.left-s.left,height:s.height}},o=Object.keys(a).map((function(e){return pe({key:e},a[e],{area:w(a[e])})})).sort((function(e,t){return t.area-e.area})),u=o.filter((function(e){var t=e.width,i=e.height;return t>=n.clientWidth&&i>=n.clientHeight})),l=u.length>0?u[0].key:o[0].key,d=e.split("-")[1],l+(d?"-"+d:""))}function x(e,t,n){return _(n,c(t,n))}function O(e){var t=getComputedStyle(e),n=parseFloat(t.marginTop)+parseFloat(t.marginBottom),i=parseFloat(t.marginLeft)+parseFloat(t.marginRight);return{width:e.offsetWidth+i,height:e.offsetHeight+n}}function T(e){var t={left:"right",right:"left",bottom:"top",top:"bottom"};return e.replace(/left|right|bottom|top/g,(function(e){return t[e]}))}function P(e,t,n){var i,r,s,a,o,u,l;return n=n.split("-")[0],i=O(e),r={width:i.width,height:i.height},s=-1!==["right","left"].indexOf(n),a=s?"top":"left",o=s?"left":"top",u=s?"height":"width",l=s?"width":"height",r[a]=t[a]+t[u]/2-i[u]/2,r[o]=n===o?t[o]-i[l]:t[T(o)],r}function $(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function D(e,t,n){if(Array.prototype.findIndex)return e.findIndex((function(e){return e[t]===n}));var i=$(e,(function(e){return e[t]===n}));return e.indexOf(i)}function A(e,t,n){return(void 0===n?e:e.slice(0,D(e,"name",n))).forEach((function(e){e.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=e.function||e.fn;e.enabled&&r(n)&&(t.offsets.popper=b(t.offsets.popper),t.offsets.reference=b(t.offsets.reference),t=n(t,e))})),t}function k(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=x(this.state,this.popper,this.reference),e.placement=C(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.offsets.popper=P(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position="absolute",e=A(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}function j(e,t){return e.some((function(e){var n=e.name;return e.enabled&&n===t}))}function E(e){var t,n,i,r=[!1,"ms","Webkit","Moz","O"],s=e.charAt(0).toUpperCase()+e.slice(1);for(t=0;t<r.length-1;t++)if(n=r[t],i=n?""+n+s:e,void 0!==document.body.style[i])return i;return null}function I(){return this.state.isDestroyed=!0,j(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.left="",this.popper.style.position="",this.popper.style.top="",this.popper.style[E("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function F(e){var t=e.ownerDocument;return t?t.defaultView:window}function R(e,t,n,i){var r="BODY"===e.nodeName,s=r?e.ownerDocument.defaultView:e;s.addEventListener(t,n,{passive:!0}),r||R(o(s.parentNode),t,n,i),i.push(s)}function B(e,t,n,i){n.updateBound=i,F(e).addEventListener("resize",n.updateBound,{passive:!0});var r=o(e);return R(r,"scroll",n.updateBound,n.scrollParents),n.scrollElement=r,n.eventsEnabled=!0,n}function L(){this.state.eventsEnabled||(this.state=B(this.reference,this.options,this.state,this.scheduleUpdate))}function H(e,t){return F(e).removeEventListener("resize",t.updateBound),t.scrollParents.forEach((function(e){e.removeEventListener("scroll",t.updateBound)})),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t}function V(){this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=H(this.reference,this.state))}function N(e){return""!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function z(e,t){Object.keys(t).forEach((function(n){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&N(t[n])&&(i="px"),e.style[n]=t[n]+i}))}function W(e,t){Object.keys(t).forEach((function(n){!1!==t[n]?e.setAttribute(n,t[n]):e.removeAttribute(n)}))}function Y(e){return z(e.instance.popper,e.styles),W(e.instance.popper,e.attributes),e.arrowElement&&Object.keys(e.arrowStyles).length&&z(e.arrowElement,e.arrowStyles),e}function q(e,t,n,i,r){var s=x(r,t,e),a=C(n.placement,s,t,e,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return t.setAttribute("x-placement",a),z(t,{position:"absolute"}),n}function U(e,t){var n,i,r,s,a,o,l,d,c,f,m,h,p,v=t.x,b=t.y,_=e.offsets.popper,M=$(e.instance.modifiers,(function(e){return"applyStyle"===e.name})).gpuAcceleration;return void 0!==M&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!"),n=void 0!==M?M:t.gpuAcceleration,i=u(e.instance.popper),r=g(i),s={position:_.position},a={left:Math.floor(_.left),top:Math.floor(_.top),bottom:Math.floor(_.bottom),right:Math.floor(_.right)},o="bottom"===v?"top":"bottom",l="right"===b?"left":"right",d=E("transform"),c=void 0,f=void 0,f="bottom"===o?-r.height+a.bottom:a.top,c="right"===l?-r.width+a.right:a.left,n&&d?(s[d]="translate3d("+c+"px, "+f+"px, 0)",s[o]=0,s[l]=0,s.willChange="transform"):(m="bottom"===o?-1:1,h="right"===l?-1:1,s[o]=f*m,s[l]=c*h,s.willChange=o+", "+l),p={"x-placement":e.placement},e.attributes=pe({},p,e.attributes),e.styles=pe({},s,e.styles),e.arrowStyles=pe({},e.offsets.arrow,e.arrowStyles),e}function X(e,t,n){var i,r,s=$(e,(function(e){return e.name===t})),a=!!s&&e.some((function(e){return e.name===n&&e.enabled&&e.order<s.order}));return a||(i="`"+t+"`",r="`"+n+"`",console.warn(r+" modifier is required by "+i+" modifier in order to work, be sure to include it before "+i+"!")),a}function G(e,t){var n,i,r,a,o,u,l,d,c,f,m,h,p,v,g,_,M,y;if(!X(e.instance.modifiers,"arrow","keepTogether"))return e;if("string"==typeof(i=t.element)){if(!(i=e.instance.popper.querySelector(i)))return e}else if(!e.instance.popper.contains(i))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),e;return r=e.placement.split("-")[0],a=e.offsets,o=a.popper,u=a.reference,l=-1!==["left","right"].indexOf(r),d=l?"height":"width",c=l?"Top":"Left",f=c.toLowerCase(),m=l?"left":"top",h=l?"bottom":"right",p=O(i)[d],u[h]-p<o[f]&&(e.offsets.popper[f]-=o[f]-(u[h]-p)),u[f]+p>o[h]&&(e.offsets.popper[f]+=u[f]+p-o[h]),e.offsets.popper=b(e.offsets.popper),v=u[f]+u[d]/2-p/2,g=s(e.instance.popper),_=parseFloat(g["margin"+c],10),M=parseFloat(g["border"+c+"Width"],10),y=v-e.offsets.popper[f]-_-M,y=Math.max(Math.min(o[d]-p,y),0),e.arrowElement=i,e.offsets.arrow=(n={},he(n,f,Math.round(y)),he(n,m,""),n),e}function K(e){return"end"===e?"start":"start"===e?"end":e}function J(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=be.indexOf(e),i=be.slice(n+1).concat(be.slice(0,n));return t?i.reverse():i}function Z(e,t){var n,i,r,s,a;if(j(e.instance.modifiers,"inner"))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;switch(n=S(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement),i=e.placement.split("-")[0],r=T(i),s=e.placement.split("-")[1]||"",a=[],t.behavior){case ge.FLIP:a=[i,r];break;case ge.CLOCKWISE:a=J(i);break;case ge.COUNTERCLOCKWISE:a=J(i,!0);break;default:a=t.behavior}return a.forEach((function(o,u){var l,d,c,f,m,h,p,v,b,g,_;if(i!==o||a.length===u+1)return e;i=e.placement.split("-")[0],r=T(i),l=e.offsets.popper,d=e.offsets.reference,c=Math.floor,f="left"===i&&c(l.right)>c(d.left)||"right"===i&&c(l.left)<c(d.right)||"top"===i&&c(l.bottom)>c(d.top)||"bottom"===i&&c(l.top)<c(d.bottom),m=c(l.left)<c(n.left),h=c(l.right)>c(n.right),p=c(l.top)<c(n.top),v=c(l.bottom)>c(n.bottom),b="left"===i&&m||"right"===i&&h||"top"===i&&p||"bottom"===i&&v,g=-1!==["top","bottom"].indexOf(i),_=!!t.flipVariations&&(g&&"start"===s&&m||g&&"end"===s&&h||!g&&"start"===s&&p||!g&&"end"===s&&v),(f||b||_)&&(e.flipped=!0,(f||b)&&(i=a[u+1]),_&&(s=K(s)),e.placement=i+(s?"-"+s:""),e.offsets.popper=pe({},e.offsets.popper,P(e.instance.popper,e.offsets.reference,e.placement)),e=A(e.instance.modifiers,e,"flip"))})),e}function Q(e){var t=e.offsets,n=t.popper,i=t.reference,r=e.placement.split("-")[0],s=Math.floor,a=-1!==["top","bottom"].indexOf(r),o=a?"right":"bottom",u=a?"left":"top",l=a?"width":"height";return n[o]<s(i[u])&&(e.offsets.popper[u]=s(i[u])-n[l]),n[u]>s(i[o])&&(e.offsets.popper[u]=s(i[o])),e}function ee(e,t,n,i){var r,s,a=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),o=+a[1],u=a[2];if(!o)return e;if(0===u.indexOf("%")){switch(r=void 0,u){case"%p":r=n;break;case"%":case"%r":default:r=i}return s=b(r),s[t]/100*o}return"vh"===u||"vw"===u?(void 0,("vh"===u?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*o):o}function te(e,t,n,i){var r,s,a=[0,0],o=-1!==["right","left"].indexOf(i),u=e.split(/(\+|\-)/).map((function(e){return e.trim()})),l=u.indexOf($(u,(function(e){return-1!==e.search(/,|\s/)})));return u[l]&&-1===u[l].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead."),r=/\s*,\s*|\s+/,s=-1!==l?[u.slice(0,l).concat([u[l].split(r)[0]]),[u[l].split(r)[1]].concat(u.slice(l+1))]:[u],s=s.map((function(e,i){var r=(1===i?!o:o)?"height":"width",s=!1;return e.reduce((function(e,t){return""===e[e.length-1]&&-1!==["+","-"].indexOf(t)?(e[e.length-1]=t,s=!0,e):s?(e[e.length-1]+=t,s=!1,e):e.concat(t)}),[]).map((function(e){return ee(e,r,t,n)}))})),s.forEach((function(e,t){e.forEach((function(n,i){N(n)&&(a[t]+=n*("-"===e[i-1]?-1:1))}))})),a}function ne(e,t){var n=t.offset,i=e.placement,r=e.offsets,s=r.popper,a=r.reference,o=i.split("-")[0],u=void 0;return u=N(+n)?[+n,0]:te(n,s,a,o),"left"===o?(s.top+=u[0],s.left-=u[1]):"right"===o?(s.top+=u[0],s.left+=u[1]):"top"===o?(s.left+=u[0],s.top-=u[1]):"bottom"===o&&(s.left+=u[0],s.top+=u[1]),e.popper=s,e}function ie(e,t){var n,i,r,s,a=t.boundariesElement||u(e.instance.popper);return e.instance.reference===a&&(a=u(a)),n=S(e.instance.popper,e.instance.reference,t.padding,a),t.boundaries=n,i=t.priority,r=e.offsets.popper,s={primary:function(e){var i=r[e];return r[e]<n[e]&&!t.escapeWithReference&&(i=Math.max(r[e],n[e])),he({},e,i)},secondary:function(e){var i="right"===e?"left":"top",s=r[i];return r[e]>n[e]&&!t.escapeWithReference&&(s=Math.min(r[i],n[e]-("right"===e?r.width:r.height))),he({},i,s)}},i.forEach((function(e){var t=-1!==["left","top"].indexOf(e)?"primary":"secondary";r=pe({},r,s[t](e))})),e.offsets.popper=r,e}function re(e){var t,n,i,r,s,a,o,u=e.placement,l=u.split("-")[0],d=u.split("-")[1];return d&&(t=e.offsets,n=t.reference,i=t.popper,r=-1!==["bottom","top"].indexOf(l),s=r?"left":"top",a=r?"width":"height",o={start:he({},s,n[s]),end:he({},s,n[s]+n[a]-i[a])},e.offsets.popper=pe({},i,o[d])),e}function se(e){var t,n;if(!X(e.instance.modifiers,"hide","preventOverflow"))return e;if(t=e.offsets.reference,n=$(e.instance.modifiers,(function(e){return"preventOverflow"===e.name})).boundaries,t.bottom<n.top||t.left>n.right||t.top>n.bottom||t.right<n.left){if(!0===e.hide)return e;e.hide=!0,e.attributes["x-out-of-boundaries"]=""}else{if(!1===e.hide)return e;e.hide=!1,e.attributes["x-out-of-boundaries"]=!1}return e}function ae(e){var t=e.placement,n=t.split("-")[0],i=e.offsets,r=i.popper,s=i.reference,a=-1!==["left","right"].indexOf(n),o=-1===["top","left"].indexOf(n);return r[a?"left":"top"]=s[n]-(o?r[a?"width":"height"]:0),e.placement=T(t),e.offsets.popper=b(r),e}var oe,ue,le,de,ce,fe,me,he,pe,ve,be,ge,_e,Me,ye,Se="undefined"!=typeof window&&"undefined"!=typeof document,we=["Edge","Trident","Firefox"],Ce=0;for(oe=0;oe<we.length;oe+=1)if(Se&&navigator.userAgent.indexOf(we[oe])>=0){Ce=1;break}ue=Se&&window.Promise,le=ue?n:i,de=void 0,ce=function(){return void 0===de&&(de=-1!==navigator.appVersion.indexOf("MSIE 10")),de},fe=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},me=(function(){function e(e,t){var n,i;for(n=0;n<t.length;n++)i=t[n],i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}})(),he=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e},pe=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},ve=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],be=ve.slice(3),ge={FLIP:"flip",CLOCKWISE:"clockwise",COUNTERCLOCKWISE:"counterclockwise"},_e={shift:{order:100,enabled:!0,fn:re},offset:{order:200,enabled:!0,fn:ne,offset:0},preventOverflow:{order:300,enabled:!0,fn:ie,priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:Q},arrow:{order:500,enabled:!0,fn:G,element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:Z,behavior:"flip",padding:5,boundariesElement:"viewport"},inner:{order:700,enabled:!1,fn:ae},hide:{order:800,enabled:!0,fn:se},computeStyle:{order:850,enabled:!0,fn:U,gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:Y,onLoad:q,gpuAcceleration:void 0}},Me={placement:"bottom",eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:_e},ye=(function(){function e(t,n){var i,s=this,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};fe(this,e),this.scheduleUpdate=function(){return requestAnimationFrame(s.update)},this.update=le(this.update.bind(this)),this.options=pe({},e.Defaults,a),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=t&&t.jquery?t[0]:t,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(pe({},e.Defaults.modifiers,a.modifiers)).forEach((function(t){s.options.modifiers[t]=pe({},e.Defaults.modifiers[t]||{},a.modifiers?a.modifiers[t]:{})})),this.modifiers=Object.keys(this.options.modifiers).map((function(e){return pe({name:e},s.options.modifiers[e])})).sort((function(e,t){return e.order-t.order})),this.modifiers.forEach((function(e){e.enabled&&r(e.onLoad)&&e.onLoad(s.reference,s.popper,s.options,e,s.state)})),this.update(),i=this.options.eventsEnabled,i&&this.enableEventListeners(),this.state.eventsEnabled=i}return me(e,[{key:"update",value:function(){return k.call(this)}},{key:"destroy",value:function(){return I.call(this)}},{key:"enableEventListeners",value:function(){return L.call(this)}},{key:"disableEventListeners",value:function(){return V.call(this)}}]),e})(),ye.Utils=("undefined"!=typeof window?window:e).PopperUtils,ye.placements=ve,ye.Defaults=Me,t.default=ye}.call(t,n(11))}),(function(e,t,n){"use strict";function i(e){n(143)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(65),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(144),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdContent",props:{mdTag:{type:String,default:"div"}},render:function(e){return e(this.mdTag,{staticClass:"md-content",class:[this.$mdActiveTheme],attrs:this.$attrs,on:this.$listeners},this.$slots.default)}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(26),o=i(a),u=n(55),l=i(u),d=n(56),c=i(d),t.default=new s.default({name:"MdDialog",components:{MdPortal:o.default,MdOverlay:l.default,MdFocusTrap:c.default},props:{mdActive:Boolean,mdBackdrop:{type:Boolean,default:!0},mdBackdropClass:{type:String,default:"md-dialog-overlay"},mdCloseOnEsc:{type:Boolean,default:!0},mdClickOutsideToClose:{type:Boolean,default:!0},mdFullscreen:{type:Boolean,default:!0},mdAnimateFromSource:Boolean},computed:{dialogClasses:function(){return{"md-dialog-fullscreen":this.mdFullscreen}}},watch:{mdActive:function(e){var t=this;this.$nextTick().then((function(){e?t.$emit("md-opened"):t.$emit("md-closed")}))}},methods:{closeDialog:function(){this.$emit("update:mdActive",!1)},onClick:function(){this.mdClickOutsideToClose&&this.closeDialog(),this.$emit("md-clicked-outside")},onEsc:function(){this.mdCloseOnEsc&&this.closeDialog()}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(93),o=i(a),u=n(41),l=i(u),t.default=new s.default({name:"MdEmptyState",mixins:[l.default],props:o.default,computed:{emptyStateClasses:function(){return{"md-rounded":this.mdRounded}},emptyStateStyles:function(){if(this.mdRounded){var e=this.mdSize+"px";return{width:e,height:e}}}}})}),(function(e,t,n){"use strict";var i,r,s;Object.defineProperty(t,"__esModule",{value:!0}),i=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},r=n(8),s=(function(e){return e&&e.__esModule?e:{default:e}})(r),t.default={name:"MdMenu",props:{mdActive:Boolean,mdAlignTrigger:Boolean,mdOffsetX:Number,mdOffsetY:Number,mdFullWidth:Boolean,mdDense:Boolean,mdDirection:i({type:String,default:"bottom-start"},(0,s.default)("md-direction",["top-end","top-start","bottom-end","bottom-start"])),mdCloseOnSelect:{type:Boolean,default:!0},mdCloseOnClick:{type:Boolean,default:!1},mdSize:i({type:String,default:"small"},(0,s.default)("md-size",["auto","small","medium","big","huge"]))},data:function(){return{triggerEl:null,MdMenu:{instance:this,active:this.mdActive,direction:this.mdDirection,size:this.mdSize,alignTrigger:this.mdAlignTrigger,offsetX:this.mdOffsetX,offsetY:this.mdOffsetY,fullWidth:this.mdFullWidth,dense:this.mdDense,closeOnSelect:this.mdCloseOnSelect,closeOnClick:this.mdCloseOnClick,bodyClickObserver:null,windowResizeObserver:null,$el:this.$el}}},provide:function(){return{MdMenu:this.MdMenu}},computed:{isActive:function(){return this.MdMenu.active}},watch:{mdActive:{immediate:!0,handler:function(e){this.MdMenu.active=e}},mdDirection:function(e){this.MdMenu.direction=e},mdSize:function(e){this.MdMenu.size=e},mdAlignTrigger:function(e){this.MdMenu.alignTrigger=e},mdOffsetX:function(e){this.MdMenu.offsetX=e},mdOffsetY:function(e){this.MdMenu.offsetY=e},isActive:function(e){this.$emit("update:mdActive",e),e?this.$emit("md-opened"):this.$emit("md-closed")},mdCloseOnSelect:function(){this.MdMenu.closeOnSelect=this.mdCloseOnSelect},mdCloseOnClick:function(){this.MdMenu.closeOnClick=this.mdCloseOnClick}},methods:{toggleContent:function(e){this.MdMenu.active=!this.MdMenu.active}},mounted:function(){var e=this;this.MdMenu.$el=this.$el,this.$nextTick().then((function(){e.triggerEl=e.$el.querySelector("[md-menu-trigger]"),e.triggerEl&&e.triggerEl.addEventListener("click",e.toggleContent)}))},beforeDestroy:function(){this.triggerEl&&this.triggerEl.removeEventListener("click",this.toggleContent)}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d,c,f,m,h,p,v,b,g;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(8),i(u),l=n(57),d=i(l),c=n(58),f=i(c),m=n(53),h=i(m),p=n(56),v=i(p),b=n(69),g=i(b),t.default=new o.default({name:"MdMenuContent",components:{MdPopover:h.default,MdFocusTrap:v.default,MdList:g.default},props:{mdListClass:[String,Boolean],mdContentClass:[String,Boolean]},inject:["MdMenu"],data:function(){return{highlightIndex:-1,didMount:!1,highlightItems:[],popperSettings:null,menuStyles:""}},computed:{filteredAttrs:function(){var e=this.$attrs;return delete e.id,e},highlightedItem:function(){return this.highlightItems[this.highlightIndex]},shouldRender:function(){return this.MdMenu.active},menuClasses:function(){var e,t="md-menu-content-";return e={},r(e,t+this.MdMenu.direction,!0),r(e,t+this.MdMenu.size,!0),r(e,"md-menu-content",this.didMount),r(e,"md-shallow",!this.didMount),e},listClasses:function(){return s({"md-dense":this.MdMenu.dense},this.mdListClass)}},watch:{shouldRender:function(e){var t=this;e&&(this.setPopperSettings(),this.$nextTick().then((function(){t.setInitialHighlightIndex(),t.createClickEventObserver(),t.createResizeObserver(),t.createKeydownListener()})))}},methods:{setPopperSettings:function(){var e=this.MdMenu,t=e.direction,n=(e.alignTrigger,this.getOffsets()),i=n.offsetX,r=n.offsetY;this.hasCustomOffsets()||(this.MdMenu.instance.$el&&this.MdMenu.instance.$el.offsetHeight&&(r=-this.MdMenu.instance.$el.offsetHeight-11),t.includes("start")?i=-8:t.includes("end")&&(i=8)),this.popperSettings={placement:t,modifiers:{keepTogether:{enabled:!0},flip:{enabled:!1},offset:{offset:i+", "+r}}}},setInitialHighlightIndex:function(){var e=this;this.setHighlightItems(),this.highlightItems.forEach((function(t,n){t.classList.contains("md-selected")&&(e.highlightIndex=n-1)}))},setHighlightItems:function(){if(this.$el.querySelectorAll){var e=this.$el.querySelectorAll(".md-list-item-container:not(.md-list-item-default):not([disabled])");this.highlightItems=Array.from(e)}},setHighlight:function(e){this.setHighlightItems(),this.highlightItems.length&&("down"===e?this.highlightIndex===this.highlightItems.length-1?this.highlightIndex=0:this.highlightIndex++:0===this.highlightIndex?this.highlightIndex=this.highlightItems.length-1:this.highlightIndex--,this.clearAllHighlights(),this.setItemHighlight())},clearAllHighlights:function(){this.highlightItems.forEach((function(e){e.parentNode.__vue__.highlighted=!1}))},setItemHighlight:function(){this.highlightedItem&&(this.highlightedItem.parentNode.__vue__.highlighted=!0,this.$parent.$parent.setOffsets&&this.$parent.$parent.setOffsets(this.highlightedItem.parentNode))},setSelection:function(){this.highlightedItem&&this.highlightedItem.parentNode.click()},onEsc:function(){this.MdMenu.active=!1},getOffsets:function(){var e=this.getBodyPosition(),t=this.MdMenu.offsetX||0,n=this.MdMenu.offsetY||0;return{offsetX:t-e.x,offsetY:n-e.y}},hasCustomOffsets:function(){var e=this.MdMenu,t=e.offsetX,n=e.offsetY;return!!(e.alignTrigger||n||t)},isMenu:function(e){var t=e.target;return!!this.MdMenu.$el&&this.MdMenu.$el.contains(t)},isMenuContentEl:function(e){var t=e.target;return!!this.$refs.menu&&this.$refs.menu.contains(t)},isBackdropExpectMenu:function(e){return!this.$el.contains(e.target)&&!this.isMenu(e)},createClickEventObserver:function(){var e=this;document&&(this.MdMenu.bodyClickObserver=new d.default(document.body,"click",function(t){t.stopPropagation(),e.isMenu(t)||!e.MdMenu.closeOnClick&&!e.isBackdropExpectMenu(t)||(e.MdMenu.active=!1,e.MdMenu.bodyClickObserver.destroy(),e.MdMenu.windowResizeObserver.destroy(),e.destroyKeyDownListener())}))},createKeydownListener:function(){window.addEventListener("keydown",this.keyNavigation)},destroyKeyDownListener:function(){window.removeEventListener("keydown",this.keyNavigation)},keyNavigation:function(e){switch(e.key){case"ArrowUp":e.preventDefault(),this.setHighlight("up");break;case"ArrowDown":e.preventDefault(),this.setHighlight("down");break;case"Enter":case"Space":this.setSelection();break;case"Escape":this.onEsc()}},createResizeObserver:function(){this.MdMenu.windowResizeObserver=new f.default(window,this.setStyles)},setupWatchers:function(){this.$watch("MdMenu.direction",this.setPopperSettings),this.$watch("MdMenu.alignTrigger",this.setPopperSettings),this.$watch("MdMenu.offsetX",this.setPopperSettings),this.$watch("MdMenu.offsetY",this.setPopperSettings)},setStyles:function(){this.MdMenu.fullWidth&&(this.menuStyles="\n          width: "+this.MdMenu.instance.$el.offsetWidth+"px;\n          max-width: "+this.MdMenu.instance.$el.offsetWidth+"px\n        ")},getBodyPosition:function(){var e=document.body,t=e.getBoundingClientRect(),n=t.top;return{x:t.left+(void 0!==window.pageXOffset?window.pageXOffset:e.scrollLeft),y:n+(void 0!==window.pageYOffset?window.pageYOffset:e.scrollTop)}}},mounted:function(){var e=this;this.$nextTick().then((function(){e.setHighlightItems(),e.setupWatchers(),e.setStyles(),e.didMount=!0}))},beforeDestroy:function(){this.MdMenu.bodyClickObserver&&this.MdMenu.bodyClickObserver.destroy(),this.MdMenu.windowResizeObserver&&this.MdMenu.windowResizeObserver.destroy(),this.destroyKeyDownListener()}})}),(function(e,t,n){"use strict";function i(e){n(94)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(54),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(95),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e){return e.hasOwnProperty("mdExpand")&&!1!==e.mdExpand}function s(e,t){if(r(e))return{"md-expand":function(){return t["md-expand"][0]}}}function a(e){var t=Object.keys(e),n=!1;return t.forEach((function(e){c.default.includes(e)&&(n=!0)})),n}function o(e,t){return e&&e.$router&&t.to}function u(e,t,n){return r(e)?w.default:e.disabled?b.default:o(t,e)?(y.default.props=(0,m.default)(t,{target:String}),delete y.default.props.href,y.default):e.href?_.default:a(n)?b.default:p.default}var l,d,c,f,m,h,p,v,b,g,_,M,y,S,w,C,x;Object.defineProperty(t,"__esModule",{value:!0}),l=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},d=n(96),c=i(d),f=n(27),m=i(f),h=n(167),p=i(h),v=n(171),b=i(v),g=n(173),_=i(g),M=n(175),y=i(M),S=n(177),w=i(S),C=n(37),x=i(C),t.default={name:"MdListItem",functional:!0,components:{MdButton:x.default},render:function(e,t){var n=t.parent,i=t.props,r=t.listeners,a=t.data,o=t.slots,d=o(),c=u(i,n,r),f="md-list-item";return a.staticClass&&(f+=" "+a.staticClass),e("li",l({},a,{staticClass:f,on:r}),[e(c,{props:i,scopedSlots:s(i,d),staticClass:"md-list-item-container md-button-clean",on:r},d.default)])}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(35),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdListItemDefault",mixins:[r.default],methods:{toggleControl:function(){var e=this.$el.querySelector(".md-checkbox-container, .md-switch-container, .md-radio-container");e&&e.click()}}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(16),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdListItemContent",components:{MdRipple:r.default},props:{mdDisabled:Boolean}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(35),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdListItemButton",mixins:[r.default]}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(35),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdListItemLink",mixins:[r.default],props:{download:String,href:String,hreflang:String,ping:String,rel:String,target:String,type:String}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(35),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdListItemRouter",mixins:[r.default],computed:{routerProps:function(){return this.$props}}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(9),s=i(r),a=n(179),o=i(a),u=n(35),l=i(u),t.default={name:"MdListItemExpand",components:{MdArrowDownIcon:o.default},mixins:[l.default],inject:["MdList"],data:function(){return{expandStyles:{},showContent:!1}},props:{mdExpanded:Boolean},computed:{expandClasses:function(){return{"md-active":this.showContent}}},methods:{getChildrenSize:function(){var e=this.$refs.listExpand,t=0;return Array.from(e.children).forEach((function(e){t+=e.offsetHeight})),t},fetchStyle:function(){var e=this;return new Promise(function(t){(0,s.default)((function(){var n=0;e.showContent||(n="auto"),e.expandStyles={height:n},t()}))})},toggleExpand:function(){var e=this;this.fetchStyle().then((function(){e.showContent=!e.showContent}))},open:function(){var e=this;if(this.showContent)return!1;this.fetchStyle().then((function(){return[e.showContent=!0]}))},close:function(){var e=this;if(!this.showContent)return!1;this.fetchStyle().then((function(){e.showContent=!1}))}},watch:{mdExpanded:function(){this.mdExpanded?this.open():this.close()},showContent:function(){var e=this,t=this.showContent;this.$emit("update:mdExpanded",t),this.$nextTick((function(){return e.$emit(t?"md-expanded":"md-collapsed")})),t&&this.MdList.expandATab(this)}},created:function(){this.MdList.pushExpandable(this)},mounted:function(){this.mdExpanded&&this.open()},beforeDestroy:function(){this.MdList.removeExpandable(this)}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdArrowDownIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){if("MutationObserver"in window){var i=new window.MutationObserver(n);return i.observe(e,t),{disconnect:function(){i.disconnect()}}}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdToolbar",props:{mdElevation:{type:[String,Number],default:4}}})}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(1)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}}),e._v(" "),n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}})])},function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-icon",{staticClass:"md-icon-image"},[e._m(0)])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(48),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(83),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z",fill:"none"}}),e._v(" "),n("path",{attrs:{d:"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(49),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(85),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}}),e._v(" "),n("path",{attrs:{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-field",class:[e.$mdActiveTheme,e.fieldClasses],on:{blur:e.onBlur}},[e._t("default"),e._v(" "),e.hasCounter?n("span",{staticClass:"md-count"},[e._v(e._s(e.valueLength)+" / "+e._s(e.MdField.maxlength||e.MdField.counter))]):e._e(),e._v(" "),n("transition",{attrs:{name:"md-input-action",appear:""}},[e.hasValue&&e.mdClearable?n("md-button",{staticClass:"md-icon-button md-dense md-input-action md-clear",attrs:{tabindex:"-1",disabled:e.MdField.disabled},on:{click:e.clearInput}},[n("md-clear-icon")],1):e._e()],1),e._v(" "),n("transition",{attrs:{name:"md-input-action",appear:""}},[e.hasPasswordToggle?n("md-button",{staticClass:"md-icon-button md-dense md-input-action md-toggle-password",attrs:{tabindex:"-1"},on:{click:e.togglePassword}},[n(e.MdField.togglePassword?"md-password-off-icon":"md-password-on-icon")],1):e._e()],1)],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("input",e._g(e._b({directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"md-input",domProps:{value:e.model},on:{focus:e.onFocus,blur:e.onBlur,input:function(t){t.target.composing||(e.model=t.target.value)}}},"input",e.attributes,!1),e.listeners))},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){function i(e){var t=r(e);return t.setHours(0,0,0,0),t}var r=n(15);e.exports=i}),(function(e,t,n){function i(e){return r(e,{weekStartsOn:1})}var r=n(320);e.exports=i}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-portal",{attrs:{"md-attach-to-parent":e.mdAttachToParent}},[n("transition",{attrs:{name:"md-overlay"}},[e.mdActive?n("div",e._g({staticClass:"md-overlay",class:e.overlayClasses},e.$listeners)):e._e()])],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){function i(e){var t=r(e),n=t.getFullYear(),i=t.getMonth(),s=new Date(0);return s.setFullYear(n,i+1,0),s.setHours(0,0,0,0),s.getDate()}var r=n(15);e.exports=i}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={mdRounded:Boolean,mdSize:{type:Number,default:420},mdIcon:String,mdLabel:String,mdDescription:String}}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("ul",e._g(e._b({staticClass:"md-list",class:[e.$mdActiveTheme]},"ul",e.$attrs,!1),e.$listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=["click","dblclick","mousedown","mouseup"]}),(function(e,t,n){"use strict";function i(e){n(461)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(203),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(464),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";var i,r,s;Object.defineProperty(t,"__esModule",{value:!0}),i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=n(16),s=(function(e){return e&&e.__esModule?e:{default:e}})(r),t.default={components:{MdRipple:s.default},props:{model:[String,Boolean,Object,Number,Array],value:{type:[String,Boolean,Object,Number]},name:[String,Number],required:Boolean,disabled:Boolean,indeterminate:Boolean,trueValue:{default:!0},falseValue:{default:!1}},model:{prop:"model",event:"change"},data:function(){return{rippleActive:!1}},computed:{attrs:function(){var e={id:this.id,name:this.name,disabled:this.disabled,required:this.required,"true-value":this.trueValue,"false-value":this.falseValue};return this.$options.propsData.hasOwnProperty("value")&&(null!==this.value&&"object"===i(this.value)||(e.value=null===this.value||void 0===this.value?"":this.value+"")),e},isSelected:function(){return this.isModelArray?this.model.includes(this.value):this.hasValue?this.model===this.value:this.model===this.trueValue},isModelArray:function(){return Array.isArray(this.model)},checkClasses:function(){return{"md-checked":this.isSelected,"md-disabled":this.disabled,"md-required":this.required,"md-indeterminate":this.indeterminate}},hasValue:function(){return this.$options.propsData.hasOwnProperty("value")}},methods:{removeItemFromModel:function(e){var t=e.indexOf(this.value);-1!==t&&e.splice(t,1)},handleArrayCheckbox:function(){var e=this.model;this.isSelected?this.removeItemFromModel(e):e.push(this.value),this.$emit("change",e)},handleSingleSelectCheckbox:function(){this.$emit("change",this.isSelected?null:this.value)},handleSimpleCheckbox:function(){this.$emit("change",this.isSelected?this.falseValue:this.trueValue)},toggleCheck:function(){this.disabled||(this.rippleActive=!0,this.isModelArray?this.handleArrayCheckbox():this.hasValue?this.handleSingleSelectCheckbox():this.handleSimpleCheckbox())}}}}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(64),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(0),o=null,u=!1,l=null,d=null,c=null,f=a(r.a,o,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";function i(e){n(151)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(66),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(152),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(12),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(155)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(67),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(156),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){n(157)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(68),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(158),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){n(166)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(70),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(0),u=null,l=!1,d=i,c=null,f=null,m=o(s.a,u,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){n(213)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(79),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(214),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e){return e&&M.includes(e.tag)}function s(e){var t=e.mdRight;return""===t||!!t}function a(e){if(e){var t=createElement(_.default,{props:c({},child.data.attrs)});t.data.slot="md-app-drawer-right-previous",slots.push(t)}}function o(e,t){return e&&M.includes(e.slot)||r(t)}function u(e,t,n,i,r){var u=[],l=!1;return e&&e.forEach((function(e){var r,d=e.data,c=e.componentOptions;if(o(d,c)){if(e.data.slot=d.slot||c.tag,"md-app-drawer"===c.tag){if(r=s(c.propsData),l)return void m.default.util.warn("There shouldn't be more than one drawer in a MdApp at one time.");l=!0,e.data.slot+="-"+(r?"right":"left"),e.key=JSON.stringify({persistent:e.data.attrs["md-persistent"],permanent:e.data.attrs["md-permanent"]}),a(r)}e.data.provide=i.Ctor.options.provide,e.context=t,e.functionalContext=n,u.push(e)}})),u}function l(e){var t=e.filter((function(e){return"md-app-drawer"===e.componentOptions.tag}));return t.length?t:[]}function d(e){var t=e&&e["md-permanent"];return t&&("clipped"===t||"card"===t)}var c,f,m,h,p,v,b,g,_,M;Object.defineProperty(t,"__esModule",{value:!0}),c=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},f=n(2),m=i(f),h=n(224),p=i(h),v=n(227),b=i(v),g=n(230),_=i(g),M=["md-app-toolbar","md-app-drawer","md-app-content"],t.default={name:"MdApp",functional:!0,render:function(e,t){var n,i=t.children,r=t.props,s=t.data,a=p.default,o=e(a),f=o.context,m=o.functionalContext,h=o.componentOptions,v=u(i,f,m,h,e);return l(v).forEach((function(e){e&&d(e.data.attrs)&&(a=b.default)})),n={},s.staticClass&&s.staticClass.split(/\s+/).forEach((function(e){0!==e.length&&(n[e]=!0)})),e(a,{attrs:r,class:c({},n,s.class),style:c({},s.staticStyle,s.style)},v)}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(108),o=i(a),t.default=new s.default({name:"MdAppSideDrawer",mixins:[o.default]})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(9),o=i(a),u=n(8),l=i(u),d=["fixed","fixed-last","reveal","overlap","flexible"],t.default={props:{mdMode:s({type:String},(0,l.default)("md-mode",d)),mdWaterfall:Boolean,mdScrollbar:{type:Boolean,default:!0}},data:function(){return{revealTimer:null,revealLastPos:0,manualTick:!1,MdApp:{options:{mode:null,waterfall:!1,flexible:!1},toolbar:{element:null,titleElement:null,height:"0px",initialHeight:0,top:0,titleSize:20,hasElevation:!0,revealActive:!1,fixedLastActive:!1,fixedLastHeight:!1,overlapOff:!1},drawer:{initialWidth:0,active:!1,mode:"temporary",submode:null,width:0,right:!1}}}},provide:function(){return{MdApp:this.MdApp}},computed:{isFixed:function(){return this.mdMode&&"fixed"!==this.mdMode},isDrawerMini:function(){return"persistent"===this.MdApp.drawer.mode&&"mini"===this.MdApp.drawer.submode},contentPadding:function(){this.MdApp.drawer;return this.MdApp.drawer.active&&"persistent"===this.MdApp.drawer.mode&&"full"===this.MdApp.drawer.submode?this.MdApp.drawer.width:0},contentStyles:function(){return r({},"padding-"+(this.MdApp.drawer.right?"right":"left"),this.contentPadding)},containerStyles:function(){var e={};return this.isFixed&&(e["margin-top"]=this.MdApp.toolbar.initialHeight+"px"),this.isDrawerMini&&(e["padding-"+(this.MdApp.drawer.right?"right":"left")]=this.MdApp.drawer.active?0:this.MdApp.drawer.initialWidth+"px"),e},scrollerClasses:function(){if(this.mdScrollbar)return"md-scrollbar"},appClasses:function(){return{"md-waterfall":this.mdWaterfall,"md-flexible":"flexible"===this.mdMode,"md-fixed":"fixed"===this.mdMode,"md-fixed-last":"fixed-last"===this.mdMode,"md-reveal":"reveal"===this.mdMode,"md-overlap":"overlap"===this.mdMode,"md-drawer-active":this.MdApp.drawer.active}}},watch:{mdMode:function(e){this.MdApp.options.mode=e},mdWaterfall:function(e){this.MdApp.options.waterfall=e,this.setToolbarElevation()}},methods:{setToolbarElevation:function(){this.MdApp.toolbar.hasElevation=!this.mdWaterfall},setToolbarTimer:function(e){var t=this;window.clearTimeout(this.revealTimer),this.revealTimer=window.setTimeout((function(){t.revealLastPos=e}),100)},setToolbarMarginAndHeight:function(e,t){this.MdApp.toolbar.top=e,this.MdApp.toolbar.height=t},getToolbarConstrants:function(e){var t=this.MdApp.toolbar.element.offsetHeight,n=10,i=t+n,r=e.target.scrollTop;return this.MdApp.toolbar.initialHeight||(this.MdApp.toolbar.initialHeight=t),{toolbarHeight:t,safeAmount:n,threshold:i,scrollTop:r,initialHeight:this.MdApp.toolbar.initialHeight}},handleWaterfallScroll:function(e){var t=this.getToolbarConstrants(e),n=t.threshold,i=t.scrollTop,r=4;"reveal"===this.mdMode&&(r=n),this.MdApp.toolbar.hasElevation=i>=r},handleFlexibleMode:function(e){var t,n,i,r,s,a,o,u=this.getToolbarConstrants(e),l=u.scrollTop,d=u.initialHeight,c=this.MdApp.toolbar.element,f=c.querySelector(".md-toolbar-row:first-child"),m=f.offsetHeight,h=d-l,p=l<d-m;m&&(c.style.height=p?h+"px":m+"px"),t=this.MdApp.toolbar.titleElement,t&&(n=20,i=this.MdApp.toolbar.titleSize,p?(r=Math.max(0,1-(l-i)/(h+i+1e-6))*(i-n)+n,t.style.fontSize=r+"px"):t.style.fontSize="20px"),s=this.getToolbarConstrants(e),a=s.threshold,o=s.toolbarHeight,this.setToolbarMarginAndHeight(l-a,o)},handleRevealMode:function(e){var t=this.getToolbarConstrants(e),n=t.toolbarHeight,i=t.safeAmount,r=t.threshold,s=t.scrollTop;this.setToolbarTimer(s),this.setToolbarMarginAndHeight(s-r,n),this.MdApp.toolbar.revealActive=!(s>=r)||this.revealLastPos>s+i},handleFixedLastMode:function(e){var t=this.getToolbarConstrants(e),n=t.scrollTop,i=t.toolbarHeight,r=t.safeAmount,s=this.MdApp.toolbar.element,a=s.querySelector(".md-toolbar-row:first-child"),o=a.offsetHeight;this.setToolbarTimer(n),this.setToolbarMarginAndHeight(n-o,i),this.MdApp.toolbar.fixedLastHeight=o,this.MdApp.toolbar.fixedLastActive=!(n>=o)||this.revealLastPos>n+r},handleOverlapMode:function(e){var t=this.getToolbarConstrants(e),n=t.toolbarHeight,i=t.scrollTop,r=t.initialHeight,s=this.MdApp.toolbar.element,a=s.querySelector(".md-toolbar-row:first-child"),o=a.offsetHeight,u=r-i-100*i/(r-o-o/1.5);o&&(i<r-o&&u>=o?(this.MdApp.toolbar.overlapOff=!1,s.style.height=u+"px"):(this.MdApp.toolbar.overlapOff=!0,s.style.height=o+"px")),this.setToolbarMarginAndHeight(i,n)},handleModeScroll:function(e){"reveal"===this.mdMode?this.handleRevealMode(e):"fixed-last"===this.mdMode?this.handleFixedLastMode(e):"overlap"===this.mdMode?this.handleOverlapMode(e):"flexible"===this.mdMode&&this.handleFlexibleMode(e)},handleScroll:function(e){var t=this;this.MdApp.toolbar.element&&(0,o.default)((function(){t.mdWaterfall&&t.handleWaterfallScroll(e),t.mdMode&&t.handleModeScroll(e)}))}},created:function(){this.MdApp.options.mode=this.mdMode,this.MdApp.options.waterfall=this.mdWaterfall,this.setToolbarElevation()},mounted:function(){var e={target:{scrollTop:0}};"reveal"===this.mdMode&&(this.MdApp.toolbar.revealActive=!0,this.handleRevealMode(e)),"flexible"===this.mdMode&&(this.MdApp.toolbar.revealActive=!0,this.handleFlexibleMode(e)),"fixed-last"===this.mdMode&&(this.MdApp.toolbar.fixedLastActive=!0,this.handleFixedLastMode(e)),"overlap"===this.mdMode&&this.handleOverlapMode(e)}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(108),o=i(a),t.default=new s.default({name:"MdAppInternalDrawer",mixins:[o.default]})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(8),u=i(o),t.default=new a.default({name:"MdDrawer",props:{mdPermanent:r({type:String},(0,u.default)("md-permanent",["full","clipped","card"])),mdPersistent:r({type:String},(0,u.default)("md-persistent",["mini","full"])),mdActive:Boolean,mdFixed:Boolean},computed:{drawerClasses:function(){var e={"md-temporary":this.isTemporary,"md-persistent":this.mdPersistent,"md-permanent":this.mdPermanent,"md-active":this.mdActive,"md-fixed":this.mdFixed};return this.mdPermanent&&(e["md-permanent-"+this.mdPermanent]=!0),this.mdPersistent&&(e["md-persistent-"+this.mdPersistent]=!0),e},isTemporary:function(){return!this.mdPermanent&&!this.mdPersistent}}})}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdAppToolbar",inject:["MdApp"],computed:{toolbarClasses:function(){return{"md-no-elevation":!this.MdApp.toolbar.hasElevation,"md-reveal-active":this.MdApp.toolbar.revealActive,"md-fixed-last-active":this.MdApp.toolbar.fixedLastActive,"md-overlap-off":this.MdApp.toolbar.overlapOff}},toolbarStyles:function(){var e={top:this.MdApp.toolbar.top+"px"};return this.MdApp.toolbar.fixedLastActive&&(e.transform="translate3D(0, "+this.MdApp.toolbar.fixedLastHeight+"px, 0)"),e}},mounted:function(){var e=this.$el.querySelector(".md-title, .md-display-1, .md-display-2");this.MdApp.toolbar.element=this.$el,this.MdApp.toolbar.titleElement=e,e&&(this.MdApp.toolbar.titleSize=parseInt(window.getComputedStyle(e).fontSize,10))}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdAppContent",inject:["MdApp"],computed:{showCard:function(){return this.MdApp.options&&"overlap"===this.MdApp.options.mode}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdAppDrawer",inject:["MdApp"],data:function(){return{drawerElement:{mdActive:null,mode:null,submode:null},initialized:!1}},props:{mdRight:{type:Boolean,default:!1},mdActive:{type:Boolean,default:!1}},computed:{visible:function(){return this.drawerElement.mdActive},mode:function(){return this.drawerElement.mode},submode:function(){return this.drawerElement.submode}},watch:{visible:function(e){this.MdApp.drawer.width=this.getDrawerWidth(),this.MdApp.drawer.active=e},mode:function(e){this.MdApp.drawer.mode=e},submode:function(e){this.MdApp.drawer.submode=e},mdRight:function(e){this.MdApp.drawer.right=e}},methods:{getDrawerWidth:function(){return this.$el?window.getComputedStyle(this.$el).width:0},updateDrawerData:function(){this.MdApp.drawer.width=this.getDrawerWidth(),this.MdApp.drawer.active=this.visible,this.MdApp.drawer.mode=this.mode,this.MdApp.drawer.submode=this.submode,this.MdApp.drawer.right=this.mdRight},clearDrawerData:function(){this.MdApp.drawer.width=0,this.MdApp.drawer.active=!1,this.MdApp.drawer.mode="temporary",this.MdApp.drawer.submode=null,this.MdApp.drawer.initialWidth=0}},mounted:function(){var e=this;this.$nextTick().then((function(){e.MdApp.drawer.initialWidth=e.$el.offsetWidth,e.drawerElement=e.$refs.drawer,e.updateDrawerData(),e.initialized=!0}))},updated:function(){this.drawerElement=this.$refs.drawer},beforeDestroy:function(){this.clearDrawerData()}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(8),l=i(u),d=n(243),c=i(d),t.default=new o.default({name:"MdBadge",components:{MdBadgeStandalone:c.default},props:{mdContent:[String,Number],mdPosition:s({type:String,default:"top"},(0,l.default)("md-position",["top","bottom"])),mdDense:Boolean},computed:{hasDefaultSlot:function(){return!!this.$slots.default},badgeClasses:function(){var e,t=this.getStaticClass(),n=this.$vnode.data.class;return s((e={},r(e,"md-position-"+this.mdPosition,!0),r(e,"md-dense",this.mdDense),e),t,n)},styles:function(){var e=this.$vnode.data.staticStyle,t=this.$vnode.data.style;return s({},e,t)}},methods:{getStaticClass:function(){var e=this.$vnode.data.staticClass;return e?(function(){e.split(" ").filter((function(e){return e})).reduce((function(e,t){return e[t]=!0,e}),{})})():{}}}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdBadgeStandalone"})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(250),o=i(a),u=n(251),l=i(u),d=n(8),c=i(d),t.default={name:"MdAutocomplete",props:{value:{type:null,required:!0},mdDense:Boolean,mdLayout:s({type:String,default:"floating"},(0,c.default)("md-layout",["floating","box"])),mdOpenOnFocus:{type:Boolean,default:!0},mdFuzzySearch:{type:Boolean,default:!0},mdOptions:{type:[Array,Promise],required:!0},mdInputName:String,mdInputId:String,mdInputMaxlength:[String,Number],mdInputPlaceholder:[String,Number]},data:function(){return{searchTerm:this.value,showMenu:!1,triggerPopover:!1,isPromisePending:!1,filteredAsyncOptions:[]}},computed:{isBoxLayout:function(){return"box"===this.mdLayout},fieldClasses:function(){if(this.isBoxLayout)return"md-autocomplete-box"},contentClasses:function(){if(this.isBoxLayout)return"md-autocomplete-box-content"},shouldFilter:function(){return this.mdOptions[0]&&this.searchTerm},filteredStaticOptions:function(){if(this.isPromise(this.mdOptions))return!1;var e=this.mdOptions[0];if(this.shouldFilter){if("string"==typeof e)return this.filterByString();if("object"===(void 0===e?"undefined":r(e)))return this.filterByObject()}return this.mdOptions},hasFilteredItems:function(){return this.filteredStaticOptions.length>0||this.filteredAsyncOptions.length>0},hasScopedEmptySlot:function(){return this.$scopedSlots["md-autocomplete-empty"]}},watch:{mdOptions:{deep:!0,immediate:!0,handler:function(){var e=this;this.isPromise(this.mdOptions)&&(this.isPromisePending=!0,this.mdOptions.then((function(t){e.filteredAsyncOptions=t,e.isPromisePending=!1})))}},value:function(e){this.searchTerm=e}},methods:{getOptions:function(){return this.isPromise(this.mdOptions)?this.filteredAsyncOptions:this.filteredStaticOptions},isPromise:function(e){return(0,l.default)(e)},matchText:function(e){var t=e.toLowerCase(),n=this.searchTerm.toLowerCase();return this.mdFuzzySearch?(0,o.default)(n,t):t.includes(n)},filterByString:function(){var e=this;return this.mdOptions.filter((function(t){return e.matchText(t)}))},filterByObject:function(){var e=this;return this.mdOptions.filter((function(t){var n,i=Object.values(t),r=i.length;for(n=0;n<=r;n++)if("string"==typeof i[n]&&e.matchText(i[n]))return!0}))},openOnFocus:function(){this.mdOpenOnFocus&&this.showOptions()},onInput:function(e){this.$emit("input",e),this.mdOpenOnFocus||this.showOptions(),"inputevent"!==(""+this.searchTerm.constructor).match(/function (\w*)/)[1].toLowerCase()&&this.$emit("md-changed",this.searchTerm)},showOptions:function(){var e=this;if(this.showMenu)return!1;this.showMenu=!0,this.$nextTick().then((function(){e.triggerPopover=!0,e.$emit("md-opened")}))},hideOptions:function(){var e=this,t=function(){e.triggerPopover=!1,e.$emit("md-closed")};this.$nextTick().then((function(){e.showMenu=!1,e.$nextTick().then(t)}))},selectItem:function(e,t){var n=t.target.textContent.trim();this.searchTerm=n,this.$emit("input",e),this.$emit("md-selected",e),this.hideOptions()}}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdAvatar"})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(8),l=i(u),d=n(16),c=i(d),t.default=new o.default({name:"MdBottomBar",components:{MdRipple:c.default},props:{mdSyncRoute:Boolean,mdActiveItem:[String,Number],mdType:s({type:String,default:"fixed"},(0,l.default)("md-type",["fixed","shift"]))},data:function(){return{MdBottomBar:{mouseEvent:null,activeItem:null,items:{}}}},provide:function(){return{MdBottomBar:this.MdBottomBar}},computed:{activeItem:function(){return this.MdBottomBar.activeItem},barClasses:function(){return r({},"md-type-"+this.mdType,!0)}},watch:{activeItem:function(){this.$emit("md-changed",this.activeItem)}},methods:{setupWatchers:function(){this.mdSyncRoute&&this.$watch("$route",{deep:!0,handler:function(){this.mdSyncRoute&&this.setActiveItemByRoute()}})},hasActiveItem:function(){return this.MdBottomBar.activeItem||this.mdActiveItem},getItemsAndKeys:function(){var e=this.MdBottomBar.items;return{items:e,keys:Object.keys(e)}},setActiveItemByIndex:function(e){var t=this.getItemsAndKeys(),n=t.keys;this.mdActiveItem?this.MdBottomBar.activeItem=this.mdActiveItem:this.MdBottomBar.activeItem=n[e]},setActiveItemByRoute:function(){var e=this,t=this.getItemsAndKeys(),n=t.items,i=t.keys,r=null;this.$router&&i.forEach((function(t,i){var s=n[t],a=s.props.to;a&&a===e.$route.path&&(r=i)})),this.hasActiveItem()?i[r]&&(this.MdBottomBar.activeItem=i[r]):i[r]?this.MdBottomBar.activeItem=i[r]:this.MdBottomBar.activeItem=i[0]}},created:function(){this.MdBottomBar.type=this.mdType},mounted:function(){var e=this;this.$nextTick().then((function(){e.mdSyncRoute?e.setActiveItemByRoute():e.setActiveItemByIndex(0),window.setTimeout((function(){e.setupWatchers()}),100)}))}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(41),a=i(s),o=n(10),u=i(o),l=n(27),d=i(l),c=["id","mdLabel","mdIcon","mdDisabled"],t.default={name:"MdBottomBarItem",mixins:[a.default],props:{id:{type:String,default:function(){return"md-bottom-bar-item-"+(0,u.default)()}},to:null,mdLabel:String,mdIcon:String,mdDisabled:Boolean},inject:["MdBottomBar"],watch:{$props:{deep:!0,handler:function(){this.setItemData()}},$attrs:{deep:!0,handler:function(){this.setItemData()}}},computed:{itemClasses:function(){return{"md-active":this.id===this.MdBottomBar.activeItem}},attrs:function(){var e=this,t=r({},this.$attrs);return Object.keys(this.$options.propsData).forEach((function(n){c.includes(n)||(t[n]=e[n])})),t}},methods:{getPropValues:function(){var e=this,t=Object.keys(this.$options.props),n={};return t.forEach((function(t){c.includes(t)||(e[t]?n[t]=e[t]:e.$attrs&&e.$attrs.hasOwnProperty(t)&&(n[t]=!t||e.$attrs[t]))})),n},setItemData:function(){this.$set(this.MdBottomBar.items,this.id,{disabled:this.mdDisabled,options:this.mdTemplateOptions,props:this.getPropValues()})},setActiveItem:function(e){this.MdBottomBar.activeItem=this.id,"shift"===this.MdBottomBar.type&&(this.MdBottomBar.mouseEvent=e)}},beforeCreate:function(){if(this.$router&&this.$options.propsData.to){var e=(0,d.default)(this,this.$options.props);this.$options.props=e}},created:function(){this.setItemData()},beforeDestroy:function(){this.$delete(this.MdBottomBar.items,this.id)}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdCard",props:{mdWithHover:Boolean},data:function(){return{MdCard:{expand:!1}}},provide:function(){return{MdCard:this.MdCard}},computed:{cardClasses:function(){return{"md-with-hover":this.mdWithHover,"md-expand-active":this.MdCard.expand}}}})}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardArea",props:{mdInset:Boolean},computed:{areaClasses:function(){return{"md-inset":this.mdInset}}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardHeader"}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardHeaderText",data:function(){return{parentClasses:null}},mounted:function(){this.parentClasses=this.$parent.$el.classList,this.parentClasses.contains("md-card-header")&&this.parentClasses.add("md-card-header-flex")},beforeDestroy:function(){this.parentClasses.remove("md-card-header-flex")}}}),(function(e,t,n){"use strict";var i,r,s,a;Object.defineProperty(t,"__esModule",{value:!0}),i=(function(){function e(e,t){var n,i,r=[],s=!0,a=!1,o=void 0;try{for(n=e[Symbol.iterator]();!(s=(i=n.next()).done)&&(r.push(i.value),!t||r.length!==t);s=!0);}catch(e){a=!0,o=e}finally{try{!s&&n.return&&n.return()}finally{if(a)throw o}}return r}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}})(),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(8),a=(function(e){return e&&e.__esModule?e:{default:e}})(s),t.default={name:"MdCardMedia",props:{mdRatio:r({type:String},(0,a.default)("md-ratio",["16-9","16/9","16:9","4-3","4/3","4:3","1-1","1/1","1:1"])),mdMedium:Boolean,mdBig:Boolean},computed:{mediaClasses:function(){var e,t,n,r,s={};return this.mdRatio&&(e=this.getAspectRatio())&&(t=i(e,2),n=t[0],r=t[1],s["md-ratio-"+n+"-"+r]=!0),(this.mdMedium||this.mdBig)&&(s={"md-medium":this.mdMedium,"md-big":this.mdBig}),s}},methods:{getAspectRatio:function(){var e=[];return-1!==this.mdRatio.indexOf(":")?e=this.mdRatio.split(":"):-1!==this.mdRatio.indexOf("/")?e=this.mdRatio.split("/"):-1!==this.mdRatio.indexOf("-")&&(e=this.mdRatio.split("-")),2===e.length?e:null}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardMediaActions"}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardMediaCover",props:{mdTextScrim:Boolean,mdSolid:Boolean},data:function(){return{backdropBackground:{}}},computed:{coverClasses:function(){return{"md-text-scrim":this.mdTextScrim,"md-solid":this.mdSolid}},coverStyles:function(){return{background:this.backdropBackground}}},methods:{applyScrimColor:function(e){this.$refs.backdrop&&(this.backdropBackground="linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, "+e/2+") 66%, rgba(0, 0, 0, "+e+") 100%)")},applySolidColor:function(e){var t=this.$el.querySelector(".md-card-area");t&&(t.style.background="rgba(0, 0, 0, "+e+")")},getImageLightness:function(e,t,n){var i=document.createElement("canvas");e.crossOrigin="Anonymous",e.onload=function(){var e,n,r=0,s=void 0,a=void 0,o=void 0,u=void 0,l=void 0,d=void 0,c=void 0;for(i.width=this.width,i.height=this.height,s=i.getContext("2d"),s.drawImage(this,0,0),a=s.getImageData(0,0,i.width,i.height),o=a.data,e=0,n=o.length;e<n;e+=4)u=o[e],l=o[e+1],d=o[e+2],c=Math.floor((u+l+d)/3),r+=c;t(Math.floor(r/(this.width*this.height)))},e.onerror=n}},mounted:function(){var e=this,t=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.6;e.mdTextScrim?e.applyScrimColor(t):e.mdSolid&&e.applySolidColor(t)},n=this.$el.querySelector("img");n&&(this.mdTextScrim||this.mdSolid)&&this.getImageLightness(n,(function(e){var n=256,i=(100*Math.abs(n-e)/n+15)/100;i>=.7&&(i=.7),t(i)}),t)}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardContent"}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardExpand",inject:["MdCard"]}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},r=(function(){function e(e,t){var n,i,r=[],s=!0,a=!1,o=void 0;try{for(n=e[Symbol.iterator]();!(s=(i=n.next()).done)&&(r.push(i.value),!t||r.length!==t);s=!0);}catch(e){a=!0,o=e}finally{try{!s&&n.return&&n.return()}finally{if(a)throw o}}return r}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}})(),t.default={name:"MdCardExpandTrigger",inject:["MdCard"],render:function(e){var t=this,n=r(this.$slots.default,1),s=n[0],a=" md-card-expand-trigger",o={click:function(){t.MdCard.expand=!t.MdCard.expand}};return s?(s.componentOptions.listeners=i({},s.componentOptions.listeners,o),s.data.staticClass+=a,s):e("div",{staticClass:a,on:o})}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdCardExpandContent",inject:["MdCard"],data:function(){return{marginTop:0}},computed:{expand:function(){return this.MdCard.expand},contentStyles:function(){return{"margin-top":"-"+this.marginTop+"px",opacity:0===this.marginTop?1:0}}},watch:{expand:function(e){this.marginTop=e?0:this.$el.children[0].offsetHeight}},mounted:function(){this.marginTop=this.$el.children[0].offsetHeight}}}),(function(e,t,n){"use strict";var i,r,s,a;Object.defineProperty(t,"__esModule",{value:!0}),i=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},r=n(8),s=(function(e){return e&&e.__esModule?e:{default:e}})(r),a=["left","right","space-between"],t.default={name:"MdCardActions",props:{mdAlignment:i({type:String,default:"right"},(0,s.default)("md-alignment",a))}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(98),o=i(a),u=n(10),l=i(u),t.default=new s.default({name:"MdCheckbox",mixins:[o.default],props:{id:{type:String,default:function(){return"md-checkbox-"+(0,l.default)()}}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(59),u=i(o),l=n(50),d=i(l),c=n(10),f=i(c),m=n(8),h=i(m),t.default=new a.default({name:"MdChips",components:{MdField:u.default,MdInput:d.default},props:{value:Array,id:{type:[String,Number],default:function(){return"md-chips-"+(0,f.default)()}},mdInputType:r({type:[String,Number]},(0,h.default)("md-input-type",["email","number","password","search","tel","text","url"])),mdPlaceholder:[String,Number],mdStatic:Boolean,mdLimit:Number,mdCheckDuplicated:{type:Boolean,default:!1},mdFormat:{type:Function}},data:function(){return{inputValue:"",duplicatedChip:null}},computed:{chipsClasses:function(){return{"md-has-value":this.value&&this.value.length}},modelRespectLimit:function(){return!this.mdLimit||this.value.length<this.mdLimit},formattedInputValue:function(){return this.mdFormat?this.mdFormat(this.inputValue):this.inputValue}},methods:{insertChip:function(e){var t=this,n=(e.target,this.formattedInputValue);if(n&&this.modelRespectLimit){if(this.value.includes(n))return this.duplicatedChip=null,void this.$nextTick((function(){t.duplicatedChip=n}));this.value.push(n),this.$emit("input",this.value),this.$emit("md-insert",n),this.inputValue=""}},removeChip:function(e){var t=this,n=this.value.indexOf(e);this.value.splice(n,1),this.$emit("input",this.value),this.$emit("md-delete",e,n),this.$nextTick((function(){return t.$refs.input.$el.focus()}))},handleBackRemove:function(){this.inputValue||this.removeChip(this.value[this.value.length-1])},handleInput:function(){this.mdCheckDuplicated?this.checkDuplicated():this.duplicatedChip=null},checkDuplicated:function(){return this.value.includes(this.formattedInputValue)?!!this.mdCheckDuplicated&&void(this.duplicatedChip=this.formattedInputValue):(this.duplicatedChip=null,!1)}},watch:{value:function(){this.checkDuplicated()}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(39),o=i(a),u=n(36),l=i(u),d=n(60),c=i(d),f=n(37),m=i(f),t.default=new s.default({name:"MdChip",components:{MdButton:m.default,MdClearIcon:c.default},mixins:[o.default,l.default],props:{mdDisabled:Boolean,mdDeletable:Boolean,mdClickable:Boolean,mdDuplicated:{type:Boolean,default:!1}},computed:{chipClasses:function(){return{"md-disabled":this.mdDisabled,"md-deletable":this.mdDeletable,"md-clickable":this.mdClickable,"md-focused":this.mdHasFocus,"md-duplicated":this.mdDuplicated}}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b,g,_,M,y,S,w,C,x;Object.defineProperty(t,"__esModule",{value:!0}),r=n(2),s=i(r),a=n(314),o=i(a),u=n(315),l=i(u),d=n(15),c=i(d),f=n(138),m=i(f),h=n(55),p=i(h),v=n(326),b=i(v),g=n(345),_=i(g),M=n(347),y=i(M),S=n(59),w=i(S),C=n(50),x=i(C),t.default={name:"MdDatepicker",components:{MdOverlay:p.default,MdDateIcon:_.default,MdField:w.default,MdInput:x.default,MdDatepickerDialog:b.default},props:{value:[String,Date],mdDisabledDates:[Array,Function],mdOpenOnFocus:{type:Boolean,default:!0},mdOverrideNative:{type:Boolean,default:!0},mdImmediately:{type:Boolean,default:!1},MdDebounce:{type:Number,default:1e3}},data:function(){return{showDialog:!1,modelDate:null,selectedDate:null}},computed:{type:function(){return this.mdOverrideNative?"text":"date"}},watch:{selectedDate:function(e){e&&(this.modelDate=this.dateToHTMLString(e),this.$emit("input",e))},value:function(){this.value&&(this.modelDate=this.dateToHTMLString(this.value))},modelDate:function(e){if(e){var t=(0,c.default)(e);(0,m.default)(t)&&(this.selectedDate=t)}else this.selectedDate=null}},methods:{onInput:function(e){var t=(0,c.default)(e);(0,m.default)(t)&&(this.selectedDate=t)},toggleDialog:function(){!o.default||this.mdOverrideNative?(this.showDialog=!this.showDialog,this.showDialog?this.$emit("md-opened"):this.$emit("md-closed")):this.$refs.input.$el.click()},onFocus:function(){this.mdOpenOnFocus&&this.toggleDialog()},dateToHTMLString:function(e){var t,n;if(e){t=null,n=this.$material.locale.dateFormat||"YYYY-MM-DD";try{t=(0,l.default)(e,n)}catch(t){s.default.util.warn("The datepicker value is not a valid date. Given value: "+e+".",this)}return t}}},created:function(){this.onInput=(0,y.default)(this.onInput,this.MdDebounce),this.modelDate=this.dateToHTMLString(this.value),this.selectedDate=this.value}}}),(function(e,t){function n(e){return e instanceof Date}e.exports=n}),(function(e,t,n){function i(e){var t,n,i,a=r(e),o=a.getFullYear(),u=new Date(0);return u.setFullYear(o+1,0,4),u.setHours(0,0,0,0),t=s(u),n=new Date(0),n.setFullYear(o,0,4),n.setHours(0,0,0,0),i=s(n),a.getTime()>=t.getTime()?o+1:a.getTime()>=i.getTime()?o:o-1}var r=n(15),s=n(89);e.exports=i}),(function(e,t,n){function i(e){if(r(e))return!isNaN(e);throw new TypeError(toString.call(e)+" is not an instance of Date")}var r=n(136);e.exports=i}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b,g,_,M,y,S,w,C,x,O,T,P,$,D,A,k,j,E,I,F,R,B,L,H,V,N,z;Object.defineProperty(t,"__esModule",{value:!0}),r=n(140),s=i(r),a=n(328),o=i(a),u=n(329),l=i(u),d=n(330),c=i(d),f=n(331),m=i(f),h=n(92),p=i(h),v=n(332),b=i(v),g=n(333),_=i(g),M=n(334),y=i(M),S=n(335),w=i(S),C=n(336),x=i(C),O=n(337),T=i(O),P=n(338),$=i(P),D=n(339),A=i(D),k=n(1),j=i(k),E=n(53),I=i(E),F=n(340),R=i(F),B=n(342),L=i(B),H=n(63),V=i(H),N=7,z=function(e,t){return!(!e||!e.querySelector)&&e.querySelectorAll(t)},t.default=new j.default({name:"MdDatepickerDialog",components:{MdPopover:I.default,MdArrowRightIcon:R.default,MdArrowLeftIcon:L.default,MdDialog:V.default},props:{mdDate:Date,mdDisabledDates:[Array,Function],mdImmediately:{type:Boolean,default:!1}},data:function(){return{currentDate:null,selectedDate:null,showDialog:!1,monthAction:null,currentView:"day",contentStyles:{},availableYears:null}},computed:{firstDayOfAWeek:function(){var e=+this.$material.locale.firstDayOfAWeek;return Number.isNaN(e)||!Number.isFinite(e)?0:(e=Math.floor(e)%N,e+=e<0?N:0,e)},locale:function(){return this.$material.locale},popperSettings:function(){return{placement:"bottom-start",modifiers:{keepTogether:{enabled:!0},flip:{enabled:!1}}}},calendarClasses:function(){return"next"===this.monthAction?"md-next":"md-previous"},firstDayOfMonth:function(){return(0,o.default)(this.currentDate).getDay()},prefixEmptyDays:function(){var e=this.firstDayOfMonth-this.firstDayOfAWeek;return e+=e<0?N:0,e},daysInMonth:function(){return(0,p.default)(this.currentDate)},currentDay:function(){return this.selectedDate?(0,c.default)(this.selectedDate):(0,c.default)(this.currentDate)},currentMonth:function(){return(0,b.default)(this.currentDate)},currentMonthName:function(){return this.locale.months[this.currentMonth]},currentYear:function(){return(0,_.default)(this.currentDate)},selectedYear:function(){return this.selectedDate?(0,_.default)(this.selectedDate):(0,_.default)(this.currentDate)},shortDayName:function(){return this.selectedDate?this.locale.shortDays[(0,m.default)(this.selectedDate)]:this.locale.shortDays[(0,m.default)(this.currentDate)]},shortMonthName:function(){return this.selectedDate?this.locale.shortMonths[(0,b.default)(this.selectedDate)]:this.locale.shortMonths[(0,b.default)(this.currentDate)]}},watch:{mdDate:function(){this.currentDate=this.mdDate||new Date,this.selectedDate=this.mdDate},currentDate:function(e,t){var n=this;this.$nextTick().then((function(){t&&n.setContentStyles()}))},currentView:function(){var e=this;this.$nextTick().then((function(){if("year"===e.currentView){var t=z(e.$el,".md-datepicker-year-button.md-datepicker-selected");t.length&&t[0].scrollIntoView({behavior:"instant",block:"center",inline:"center"})}}))}},methods:{setContentStyles:function(){var e,t=z(this.$el,".md-datepicker-month");t.length&&(e=t[t.length-1],this.contentStyles={height:e.offsetHeight+10+"px"})},setAvailableYears:function(){for(var e=this.locale,t=e.startYear,n=e.endYear,i=t,r=[];i<=n;)r.push(i++);this.availableYears=r},handleDisabledDateByArray:function(e){return this.mdDisabledDates.some((function(t){return(0,w.default)(t,e)}))},isDisabled:function(e){if(this.mdDisabledDates){var t=(0,T.default)(this.currentDate,e);if(Array.isArray(this.mdDisabledDates))return this.handleDisabledDateByArray(t);if("function"==typeof this.mdDisabledDates)return this.mdDisabledDates(t)}},isSelectedDay:function(e){return(0,y.default)(this.selectedDate,(0,T.default)(this.currentDate,e))},isToday:function(e){return(0,x.default)((0,T.default)(this.currentDate,e))},previousMonth:function(){this.monthAction="previous",this.currentDate=(0,l.default)(this.currentDate,1)},nextMonth:function(){this.monthAction="next",this.currentDate=(0,s.default)(this.currentDate,1)},switchMonth:function(e){this.currentDate=(0,$.default)(this.currentDate,e),this.currentView="day"},switchYear:function(e){this.currentDate=(0,A.default)(this.currentDate,e),this.currentView="month"},selectDate:function(e){this.currentDate=(0,T.default)(this.currentDate,e),this.selectedDate=this.currentDate,this.mdImmediately&&(this.$emit("update:mdDate",this.selectedDate),this.closeDialog())},closeDialog:function(){this.$emit("md-closed")},onClose:function(){this.closeDialog()},onCancel:function(){this.closeDialog()},onConfirm:function(){this.$emit("update:mdDate",this.selectedDate),this.closeDialog()},resetDate:function(){this.currentDate=this.mdDate||new Date,this.selectedDate=this.mdDate,this.currentView="day"}},created:function(){this.setAvailableYears(),this.resetDate()}})}),(function(e,t,n){function i(e,t){var n,i=r(e),a=+t,o=i.getMonth()+a,u=new Date(0);return u.setFullYear(i.getFullYear(),o,1),u.setHours(0,0,0,0),n=s(u),i.setMonth(o,Math.min(n,i.getDate())),i}var r=n(15),s=n(92);e.exports=i}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdArrowRightIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdArrowLeftIcon",components:{MdIcon:r.default}}}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-portal",[n("transition",{attrs:{name:"md-dialog"}},[e.mdActive?n("div",e._g({staticClass:"md-dialog",class:[e.dialogClasses,e.$mdActiveTheme],on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key))return null;e.onEsc(t)}}},e.$listeners),[n("md-focus-trap",[n("div",{staticClass:"md-dialog-container"},[e._t("default"),e._v(" "),n("keep-alive",[e.mdBackdrop?n("md-overlay",{class:e.mdBackdropClass,attrs:{"md-fixed":"","md-active":e.mdActive},on:{click:e.onClick}}):e._e()],1)],2)])],1):e._e()])],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdDateIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdDialogTitle"}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdDialogContent"}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdDialogActions"}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdDivider",computed:{insideList:function(){return"md-list"===this.$parent.$options._componentTag}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(55),u=i(o),l=n(8),d=i(l),t.default=new a.default({name:"MdDrawer",components:{MdOverlay:u.default},props:{mdRight:Boolean,mdPermanent:r({type:String},(0,d.default)("md-permanent",["full","clipped","card"])),mdPersistent:r({type:String},(0,d.default)("md-persistent",["mini","full"])),mdActive:Boolean,mdFixed:Boolean},watch:{mdActive:function(e){e?this.$emit("md-opened"):this.$emit("md-closed")}},computed:{drawerClasses:function(){var e={"md-left":!this.mdRight,"md-right":this.mdRight,"md-temporary":this.isTemporary,"md-persistent":this.mdPersistent,"md-permanent":this.mdPermanent,"md-active":this.mdActive,"md-fixed":this.mdFixed};return this.mdPermanent&&(e["md-permanent-"+this.mdPermanent]=!0),this.mdPersistent&&(e["md-persistent-"+this.mdPersistent]=!0),e},isTemporary:function(){return!this.mdPermanent&&!this.mdPersistent},mode:function(){return this.mdPersistent?"persistent":this.mdPermanent?"permanent":"temporary"},submode:function(){return this.mdPersistent?this.mdPersistent:this.mdPermanent?this.mdPermanent:void 0}},methods:{closeDrawer:function(){this.$emit("update:mdActive",!1)}}})}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"md-empty-state",appear:""}},[n("div",{staticClass:"md-empty-state",class:[e.emptyStateClasses,e.$mdActiveTheme],style:e.emptyStateStyles},[n("div",{staticClass:"md-empty-state-container"},[e.mdIcon?[e.isAssetIcon(e.mdIcon)?n("md-icon",{staticClass:"md-empty-state-icon",attrs:{"md-src":e.mdIcon}}):n("md-icon",{staticClass:"md-empty-state-icon"},[e._v(e._s(e.mdIcon))])]:e._e(),e._v(" "),e.mdLabel?n("strong",{staticClass:"md-empty-state-label"},[e._v(e._s(e.mdLabel))]):e._e(),e._v(" "),e.mdDescription?n("p",{staticClass:"md-empty-state-description"},[e._v(e._s(e.mdDescription))]):e._e(),e._v(" "),e._t("default")],2)])])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(9),i(s),a=n(1),i(a),o=n(374),u=i(o),l=n(102),d=i(l),c=n(103),f=i(c),m=n(50),h=i(m),p=n(40),v=i(p),b={x:-15,y:-48},t.default={name:"MdSelect",components:{MdInput:h.default,MdMenu:d.default,MdMenuContent:f.default,MdDropDownIcon:u.default},mixins:[v.default],props:{mdDense:Boolean,mdClass:String,multiple:Boolean,id:String,name:String},inject:["MdField"],data:function(){return{menuStyles:{},offset:{x:b.x,y:0},showSelect:!0,didMount:!1,MdSelect:{items:{},label:null,multiple:!1,modelValue:this.localValue,setValue:this.setValue,setContent:this.setContent,setMultipleValue:this.setMultipleValue,setMultipleContent:this.setMultipleContent}}},provide:function(){return{MdSelect:this.MdSelect}},computed:{attrs:function(){return r({},this.$attrs,{name:this.name,id:this.id})},inputListeners:function(){return r({},this.$listeners,{input:void 0})}},watch:{localValue:{immediate:!0,handler:function(e){this.setFieldContent(),this.MdSelect.modelValue=this.localValue,this.emitSelected(e)}},multiple:{immediate:!0,handler:function(e){this.MdSelect.multiple=e,this.$nextTick(this.initialLocalValueByDefault)}}},methods:{elHasScroll:function(e){return e.scrollHeight>e.offsetHeight},scrollToSelectedOption:function(e,t){var n=e.offsetTop,i=e.offsetHeight,r=t.offsetHeight;t.scrollTop=n-(r-i)/2},setOffsets:function(e){var t,n;this.$isServer||(t=this.$refs.menu.$refs.container)&&(n=e||t.querySelector(".md-selected"),n?(this.scrollToSelectedOption(n,t),this.offset.y=b.y-n.offsetTop+t.scrollTop+8,this.menuStyles={"transform-origin":"0 "+Math.abs(this.offset.y)+"px"}):(this.offset.y=b.y+1,this.menuStyles={}))},onMenuEnter:function(){this.didMount&&(this.setOffsets(),this.MdField.focused=!0,this.$emit("md-opened"))},applyHighlight:function(){this.MdField.focused=!1,this.MdField.highlighted=!0,this.$refs.input.$el.focus()},onClose:function(){this.$emit("md-closed"),this.didMount&&this.applyHighlight()},onFocus:function(){this.didMount&&this.applyHighlight()},removeHighlight:function(){this.MdField.highlighted=!1},openSelect:function(){this.disabled||(this.showSelect=!0)},arrayAccessorRemove:function(e,t){var n=e.slice(0,t),i=e.slice(t+1,e.length);return n.concat(i)},toggleArrayValue:function(e){var t=this.localValue.indexOf(e),n=t>-1;this.localValue=n?this.arrayAccessorRemove(this.localValue,t):this.localValue.concat([e])},setValue:function(e){this.model=e,this.setFieldValue(),this.showSelect=!1},setContent:function(e){this.MdSelect.label=e},setContentByValue:function(){var e=this.MdSelect.items[this.localValue];e?this.setContent(e):this.setContent("")},setMultipleValue:function(e){var t=e;this.toggleArrayValue(t),this.setFieldValue()},setMultipleContentByValue:function(){var e,t=this;this.localValue||this.initialLocalValueByDefault(),e=[],this.localValue.forEach((function(n){var i=t.MdSelect.items[n];i&&e.push(i)})),this.setContent(e.join(", "))},setFieldContent:function(){this.multiple?this.setMultipleContentByValue():this.setContentByValue()},isLocalValueSet:function(){return void 0!==this.localValue&&null!==this.localValue},setLocalValueIfMultiple:function(){isLocalValueSet()?this.localValue=[this.localValue]:this.localValue=[]},setLocalValueIfNotMultiple:function(){this.localValue.length>0?this.localValue=this.localValue[0]:this.localValue=null},initialLocalValueByDefault:function(){var e=Array.isArray(this.localValue);this.multiple&&!e?this.localValue=this.setLocalValueIfMultiple():!this.multiple&&e&&(this.localValue=this.setLocalValueIfNotMultiple())},emitSelected:function(e){this.$emit("md-selected",e)}},mounted:function(){var e=this;this.showSelect=!1,this.setFieldContent(),this.$nextTick().then((function(){e.didMount=!0}))},updated:function(){this.setFieldContent()}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdDropDownIcon",components:{MdIcon:r.default}}}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",e._g({staticClass:"md-menu"},e.$listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-popover",{attrs:{"md-settings":e.popperSettings,"md-active":e.shouldRender}},[e.shouldRender?n("transition",e._g({attrs:{name:"md-menu-content",css:e.didMount}},e.$listeners),[n("div",{ref:"menu",class:[e.menuClasses,e.mdContentClass,e.$mdActiveTheme],style:e.menuStyles},[n("div",{ref:"container",staticClass:"md-menu-content-container md-scrollbar",class:e.$mdActiveTheme},[n("md-list",e._b({class:e.listClasses},"md-list",e.filteredAttrs,!1),[e._t("default")],2)],1)])]):e._e()],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(10),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdOption",props:{value:[String,Number,Boolean],disabled:Boolean},inject:{MdSelect:{},MdOptgroup:{default:{}}},data:function(){return{uniqueId:"md-option-"+(0,r.default)(),isSelected:!1,isChecked:!1}},computed:{selectValue:function(){return this.MdSelect.modelValue},isMultiple:function(){return this.MdSelect.multiple},isDisabled:function(){return this.MdOptgroup.disabled||this.disabled},key:function(){return this.value||0===this.value?this.value:this.uniqueId},inputLabel:function(){return this.MdSelect.label},optionClasses:function(){return{"md-selected":this.isSelected||this.isChecked}}},watch:{selectValue:function(){this.setIsSelected()},isChecked:function(e){e!==this.isSelected&&this.setSelection()},isSelected:function(e){this.isChecked=e}},methods:{getTextContent:function(){if(this.$el)return this.$el.textContent.trim();var e=this.$slots.default;return e?e[0].text.trim():""},setIsSelected:function(){return this.isMultiple?void 0===this.selectValue?void(this.isSelected=!1):void(this.isSelected=this.selectValue.includes(this.value)):void(this.isSelected=this.selectValue===this.value)},setSingleSelection:function(){this.MdSelect.setValue(this.value)},setMultipleSelection:function(){this.MdSelect.setMultipleValue(this.value)},setSelection:function(){this.isDisabled||(this.isMultiple?this.setMultipleSelection():this.setSingleSelection())},setItem:function(){this.$set(this.MdSelect.items,this.key,this.getTextContent())}},updated:function(){this.setItem()},created:function(){this.setItem(),this.setIsSelected()}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdOptgroup",props:{label:String,disabled:Boolean},provide:function(){return{MdOptgroup:{disabled:this.disabled}}}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),s=n(10),a=i(s),o=n(385),u=i(o),l=n(40),d=i(l),t.default={name:"MdFile",components:{MdFileIcon:u.default},props:{id:{type:String,default:function(){return"md-file-"+(0,a.default)()}},name:String},mixins:[d.default],inject:["MdField"],methods:{getMultipleName:function(e){var t=[];return[].concat(r(e)).forEach((function(e){var n=e.name;return t.push(n)})),t.join(", ")},getFileName:function(e,t){return e&&0!==e.length?e.length>1?this.getMultipleName(e):1===e.length?e[0].name:null:t.value.split("\\").pop()},openPicker:function(){this.onFocus(),this.$refs.inputFile.click()},onChange:function(e){this.onFileSelected(e)},onFileSelected:function(e){var t=e.target,n=e.dataTransfer,i=t.files||n.files;this.model=this.getFileName(i,t),this.$emit("md-change",i||t.value)}},created:function(){this.MdField.file=!0},beforeDestroy:function(){this.MdField.file=!1}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdFileIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t){var n=e.style.height,i=e.offsetHeight,r=e.scrollHeight;return e.style.overflow="hidden",i>=r&&(e.style.height=i+t+"px",r<e.scrollHeight)?(e.style.height=n,i):r}var s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(10),l=i(u),d=n(40),c=i(d),t.default=new o.default({name:"MdTextarea",mixins:[c.default],inject:["MdField"],props:{id:{type:String,default:function(){return"md-textarea-"+(0,l.default)()}},mdAutogrow:Boolean},computed:{listeners:function(){return s({},this.$listeners,{input:this.onInput})},textareaStyles:function(){return{height:this.textareaHeight}}},methods:{getTextAreaLineSize:function(){var e=window.getComputedStyle(this.$el);return parseInt(e.lineHeight,10)},setTextAreaSize:function(e){var t,n=e;e||(t=this.getTextAreaLineSize(),n=r(this.$el,t)),this.textareaHeight=n+"px"},applyStyles:function(){var e=this;this.mdAutogrow&&(this.setTextAreaSize(32),this.$nextTick().then((function(){e.setTextAreaSize(),window.setTimeout((function(){e.$el.style.overflow="auto"}),10)})))},setTextarea:function(){this.MdField.textarea=!0},setAutogrow:function(){this.MdField.autogrow=this.mdAutogrow},onInput:function(){this.setFieldValue(),this.applyStyles()}},created:function(){this.setTextarea(),this.setAutogrow()},mounted:function(){this.$nextTick().then(this.applyStyles)},beforeDestroy:function(){this.setTextarea(!1)}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=e;return t||(t="$&"),'<span class="md-highlight-text-match">'+t+"</span>"}function s(e,t){var n,i,a,o,u,l;if(0===t.length)return e;if(-1===(n=e.toLowerCase().indexOf(t[0].toLowerCase())))return"";for(i=0,a=1;a<t.length&&e[n+a]===t[a];a++)i=a;return o=e.slice(0,n),u=r(e.slice(n,n+i+1)),l=s(e.slice(n+i+1),t.slice(i+1)),o+u+l}function a(e,t){var n=RegExp(t+"(?!([^<]+)?<)","gi");return e.replace(n,r())}function o(e,t,n){var i=e.text;return i&&t&&t[0]?n?s(i,t)||i:a(i,t):i}var u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),u=n(2),l=i(u),d=n(1),c=i(d),t.default=new c.default({name:"MdHighlightText",abstract:!0,props:{mdTerm:String,mdFuzzySearch:{type:Boolean,default:!0}},render:function(e){var t,n;try{if(!(t=this.$slots.default))return null;if(t.length>1||t[0].tag)throw Error();return n=o(t[0],this.mdTerm,this.mdFuzzySearch),e("div",{staticClass:"md-highlight-text",class:this.$mdActiveTheme,domProps:{innerHTML:n}})}catch(e){l.default.util.warn("MdHighlightText can only render text nodes.",this)}return null}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdImage",props:{mdSrc:String}})}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(71),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(170),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(72),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(169),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-ripple",{staticClass:"md-list-item-content",attrs:{"md-disabled":e.mdDisabled}},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-list-item-default",on:{click:e.toggleControl}},[n("md-list-item-content",{attrs:{"md-disabled":""}},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(73),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(172),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("button",{staticClass:"md-list-item-button",attrs:{type:"button",disabled:e.disabled}},[n("md-list-item-content",{attrs:{"md-disabled":e.isDisabled}},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(74),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(174),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a",e._b({staticClass:"md-list-item-link"},"a",e.$props,!1),[n("md-list-item-content",{attrs:{"md-disabled":e.isDisabled}},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(75),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(176),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("router-link",e._b({staticClass:"md-list-item-router"},"router-link",e.routerProps,!1),[n("md-list-item-content",{attrs:{"md-disabled":e.isDisabled}},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(178)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(76),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(181),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(77),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(180),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}}),e._v(" "),n("path",{attrs:{d:"M0-.75h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-list-item-expand",class:e.expandClasses},[n("md-list-item-content",{attrs:{"md-disabled":e.isDisabled},nativeOn:{click:function(t){e.toggleExpand(t)}}},[e._t("default"),e._v(" "),n("md-arrow-down-icon",{staticClass:"md-list-expand-icon"})],2),e._v(" "),n("div",{ref:"listExpand",staticClass:"md-list-expand",style:e.expandStyles},[e._t("md-expand")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(96),o=i(a),u=n(104),i(u),t.default=new s.default({name:"MdMenuItem",props:{disabled:Boolean},inject:["MdMenu"],data:function(){return{highlighted:!1}},computed:{itemClasses:function(){return{"md-highlight":this.highlighted}},listeners:function(){var e,t,n=this;return this.disabled?{}:this.MdMenu.closeOnSelect?(e={},t=Object.keys(this.$listeners),t.forEach((function(t){o.default.includes(t)?e[t]=function(e){n.$listeners[t](e),n.closeMenu()}:e[t]=n.$listeners[t]})),e):this.$listeners}},methods:{closeMenu:function(){this.MdMenu.active=!1,this.MdMenu.eventObserver&&this.MdMenu.eventObserver.destroy()},triggerCloseMenu:function(){this.disabled||this.closeMenu()}},mounted:function(){if(this.$el.children&&this.$el.children[0]){"A"===this.$el.children[0].tagName.toUpperCase()&&this.$el.addEventListener("click",this.triggerCloseMenu)}},beforeDestroy:function(){this.$el.removeEventListener("click",this.triggerCloseMenu)}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(8),u=i(o),t.default=new a.default({name:"MdProgressBar",props:{mdValue:{type:Number,default:0},mdBuffer:{type:Number,default:0},mdMode:r({type:String,default:"determinate"},(0,u.default)("md-mode",["determinate","indeterminate","query","buffer"]))},computed:{isDeterminate:function(){return"determinate"===this.mdMode},isBuffer:function(){return"buffer"===this.mdMode},hasAmountFill:function(){return this.isBuffer||this.isDeterminate},progressClasses:function(){return"md-"+this.mdMode},progressValueStyle:function(){if(this.hasAmountFill)return"width: "+this.mdValue+"%"},progressTrackStyle:function(){if(this.hasAmountFill)return"width: "+this.mdBuffer+"%"},progressBufferStyle:function(){if(this.hasAmountFill)return"left: calc("+this.mdBuffer+"% + 8px)"}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(8),l=i(u),d=n(409),c=i(d),f={styleTag:null,diameters:new Set},t.default=new o.default({name:"MdProgressSpinner",props:{mdValue:{type:Number,default:0},mdDiameter:{type:Number,default:60},mdStroke:{type:Number,default:6},mdMode:s({type:String,default:"determinate"},(0,l.default)("md-mode",["determinate","indeterminate"]))},computed:{isDeterminate:function(){return"determinate"===this.mdMode},isIndeterminate:function(){return"indeterminate"===this.mdMode},isIE:function(){return!this.$isServer&&navigator.userAgent.toLowerCase().includes("trident")},progressClasses:function(){var e,t="md-progress-spinner-indeterminate";return this.isIE&&(t+="-fallback"),e={},r(e,t,!0),r(e,"md-"+this.mdMode,!0),e},svgStyles:function(){var e=this.mdDiameter+"px";return{width:e,height:e}},circleStyles:function(){return{"stroke-dashoffset":this.circleStrokeDashOffset,"stroke-dasharray":this.circleStrokeDashArray,"stroke-width":this.circleStrokeWidth,"animation-name":"md-progress-spinner-stroke-rotate-"+this.mdDiameter}},circleRadius:function(){return(this.mdDiameter-this.mdStroke)/2},circleStrokeWidth:function(){return this.mdStroke+"px"},circleCircumference:function(){return 2*Math.PI*this.circleRadius},circleStrokeDashArray:function(){return this.circleCircumference+"px"},circleStrokeDashOffset:function(){return this.isDeterminate?this.circleCircumference*(100-this.mdValue)/100+"px":this.isIndeterminate&&this.isIE?.2*this.circleCircumference+"px":null}},watch:{mdDiameter:function(){this.attachStyleTag()}},methods:{getAnimationCSS:function(){return c.default.replace(/START_VALUE/g,""+.95*this.circleCircumference).replace(/END_VALUE/g,""+.2*this.circleCircumference).replace(/DIAMETER/g,""+this.mdDiameter)},attachStyleTag:function(){var e=f.styleTag;e||(e=document.getElementById("md-progress-spinner-styles")),e||(e=document.createElement("style"),e.id="md-progress-spinner-styles",document.head.appendChild(e),f.styleTag=e),e&&e.sheet&&e.sheet.insertRule(this.getAnimationCSS(),0),f.diameters.add(this.mdDiameter)}},mounted:function(){this.attachStyleTag()}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(10),o=i(a),u=n(16),l=i(u),t.default=new s.default({name:"MdRadio",components:{MdRipple:l.default},props:{model:[String,Number,Boolean],value:{type:[String,Number,Boolean],default:"on"},id:{type:String,default:function(){return"md-radio-"+(0,o.default)()}},name:[String,Number],required:Boolean,disabled:Boolean},model:{prop:"model",event:"change"},data:function(){return{rippleActive:!1}},computed:{isSelected:function(){return this.model===this.value},radioClasses:function(){return{"md-checked":this.isSelected,"md-disabled":this.disabled,"md-required":this.required}}},methods:{toggleCheck:function(){this.disabled||(this.rippleActive=!0,this.$emit("change",this.value))}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d,c,f,m,h;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(8),l=i(u),d=n(26),c=i(d),f=n(419),m=i(f),h=n(421),t.default=new o.default({name:"MdSnackbar",components:{MdPortal:c.default,MdSnackbarContent:m.default},props:{mdActive:Boolean,mdPersistent:Boolean,mdDuration:{type:Number,default:4e3},mdPosition:s({type:String,default:"center"},(0,l.default)("md-position",["center","left"]))},computed:{snackbarClasses:function(){return r({},"md-position-"+this.mdPosition,!0)}},watch:{mdActive:function(e){var t=this;e?(0,h.createSnackbar)(this.mdDuration,this.mdPersistent,this).then((function(){t.$emit("update:mdActive",!1),t.$emit("md-opened")})):((0,h.destroySnackbar)(),this.$emit("md-closed"))}}})}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdSnackbarContent",props:{mdClasses:Array}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(1),o=i(a),u=n(8),l=i(u),t.default=new o.default({name:"MdSpeedDial",props:{mdEvent:s({type:String,default:"hover"},(0,l.default)("md-event",["click","hover"])),mdDirection:s({type:String,default:"top"},(0,l.default)("md-direction",["top","bottom"])),mdEffect:s({type:String,default:"fling"},(0,l.default)("md-effect",["fling","scale","opacity"]))},data:function(){return{MdSpeedDial:{active:!1,event:this.mdEvent,direction:this.mdDirection}}},provide:function(){return{MdSpeedDial:this.MdSpeedDial}},computed:{speedDialClasses:function(){var e;return e={"md-active":this.MdSpeedDial.active,"md-with-hover":"hover"===this.mdEvent},r(e,"md-direction-"+this.mdDirection,!0),r(e,"md-effect-"+this.mdEffect,!0),e}}})}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(37),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdSpeedDialTarget",components:{MdButton:r.default},inject:["MdSpeedDial"],methods:{handleClick:function(){"click"===this.MdSpeedDial.event&&(this.MdSpeedDial.active=!this.MdSpeedDial.active)}}}}),(function(e,t,n){"use strict";function i(e,t,n){return"top"===e?n-t-1:t}Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdSpeedDialContent",inject:["MdSpeedDial"],methods:{setChildrenIndexes:function(){var e=this;this.$nextTick().then((function(){var t=e.$children.length;e.$children.forEach((function(n,r){if("button"===n._vnode.tag){var s=i(e.MdSpeedDial.direction,r,t);n.$el.setAttribute("md-button-index",s),n.$el.classList.add("md-raised")}}))}))}},mounted:function(){this.setChildrenIndexes()},updated:function(){this.setChildrenIndexes()}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(78),o=i(a),u=n(192),l=i(u),t.default=new s.default({name:"MdSteppers",components:{MdStepHeader:l.default},props:{mdSyncRoute:Boolean,mdDynamicHeight:Boolean,mdVertical:Boolean,mdLinear:Boolean,mdAlternative:Boolean,mdActiveStep:[String,Number]},data:function(){return{activeStepIndex:0,noTransition:!0,containerStyles:{},contentStyles:{},MdSteppers:{activeStep:0,isLinear:!1,isVertical:!1,items:{}}}},provide:function(){var e=this.MdSteppers;return e.getStepperNumber=this.getStepperNumber,e.setActiveStep=this.setActiveStep,e.isPreviousStepperDone=this.isPreviousStepperDone,{MdSteppers:e}},computed:{steppersClasses:function(){return{"md-no-transition":this.noTransition,"md-alternative":this.mdAlternative,"md-horizontal":!this.mdVertical,"md-vertical":this.mdVertical,"md-dynamic-height":this.mdDynamicHeight}},activeIndex:function(){return this.MdSteppers.activeStep}},watch:{mdActiveStep:function(e){this.MdSteppers.activeStep=e,this.$emit("md-changed",e)},mdLinear:function(e){this.MdSteppers.isLinear=e},mdVertical:function(e){this.MdSteppers.isVertical=e},activeIndex:function(){var e=this;this.$nextTick().then((function(){e.setActiveStepIndex(),e.calculateStepperPos()}))}},methods:{hasActiveStep:function(){return this.MdSteppers.activeStep||this.mdActiveStep},getItemsAndKeys:function(){var e=this.MdSteppers.items;return{items:e,keys:Object.keys(e)}},getStepperNumber:function(e){return Object.keys(this.MdSteppers.items).indexOf(e)+1},isStepperDone:function(e){return this.MdSteppers.items[e].done},isPreviousStepperDone:function(e){var t=this.MdSteppers.items,n=Object.keys(t),i=this.getStepperNumber(e)-2,r=n[i];return!r||t[r].done},isStepperEditable:function(e){return this.MdSteppers.items[e].editable},setStepperAsDone:function(e){this.MdSteppers.items[e].done=!0},setPreviousStepperAsDone:function(e){var t=this.getStepperNumber(this.MdSteppers.activeStep);this.getStepperNumber(e)>t&&this.setStepperAsDone(this.MdSteppers.activeStep)},setActiveStep:function(e){if(this.mdLinear&&!this.isPreviousStepperDone(e))return!1;e===this.MdSteppers.activeStep||!this.isStepperEditable(e)&&this.isStepperDone(e)||(this.setPreviousStepperAsDone(e),this.MdSteppers.activeStep=e,this.$emit("md-changed",e),this.$emit("update:mdActiveStep",e),this.MdSteppers.items[e].error=null)},setActiveStepIndex:function(){var e=this.$el.querySelector(".md-button.md-active");e&&(this.activeStepIndex=[].indexOf.call(e.parentNode.childNodes,e))},setActiveStepByIndex:function(e){var t=this.getItemsAndKeys(),n=t.keys;this.hasActiveStep()||(this.MdSteppers.activeStep=n[e])},setActiveStepByRoute:function(){var e,t=this,n=this.getItemsAndKeys(),i=n.items,r=n.keys,s=null;if(this.$router&&r.forEach((function(e,n){var r=i[e],a=r.props.to;a&&a===t.$route.path&&(s=n)})),this.hasActiveStep()||s)for(this.MdSteppers.activeStep=r[s],e=0;e<s;e++)this.setStepperAsDone(r[e]);else this.MdSteppers.activeStep=r[0]},setupObservers:function(){var e=this.$el.querySelector(".md-steppers-wrapper");"ResizeObserver"in window?(this.resizeObserver=new window.ResizeObserver(this.calculateStepperPos),this.resizeObserver.observe(this.$el)):window.addEventListener("resize",this.calculateStepperPos),e&&(this.resizeObserver=(0,o.default)(this.$el.querySelector(".md-steppers-wrapper"),{childList:!0,characterData:!0,subtree:!0},this.calculateStepperPos))},calculateStepperPos:function(){if(!this.mdVertical){var e=this.$el.querySelector(".md-stepper:nth-child("+(this.activeStepIndex+1)+")");this.contentStyles={height:e.offsetHeight+"px"},this.containerStyles={transform:"translate3D("+100*-this.activeStepIndex+"%, 0, 0)"}}},setupWatchers:function(){this.mdSyncRoute&&this.$watch("$route",{deep:!0,handler:function(){this.setActiveStepByRoute()}})}},created:function(){this.MdSteppers.activeStep=this.mdActiveStep,this.MdSteppers.isLinear=this.mdLinear,this.MdSteppers.isVertical=this.mdVertical},mounted:function(){var e=this;this.$nextTick().then((function(){return e.mdSyncRoute?e.setActiveStepByRoute():e.setActiveStepByIndex(0),e.$nextTick()})).then((function(){e.setActiveStepIndex(),e.calculateStepperPos(),window.setTimeout((function(){e.noTransition=!1,e.setupObservers(),e.setupWatchers()}),100)}))},beforeDestroy:function(){"ResizeObserver"in window||window.removeEventListener("resize",this.calculateStepperPos)}})}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(193),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(442),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(436),s=i(r),a=n(438),o=i(a),u=n(440),l=i(u),t.default={name:"MdStepperHeader",components:{MdWarningIcon:s.default,MdCheckIcon:o.default,MdEditIcon:l.default},props:{index:{type:String,required:!0}},inject:["MdSteppers"],computed:{data:function(){return this.MdSteppers.items[this.index]},shouldDisable:function(){var e=this.data,t=this.index,n=this.MdSteppers;return!(!e.done||e.editable)||n.isLinear&&!n.isPreviousStepperDone(t)},classes:function(){return{"md-active":this.index===this.MdSteppers.activeStep,"md-error":this.data.error,"md-done":this.data.done}}}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdWarningIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdCheckIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdEditIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(10),a=i(s),o=n(192),u=i(o),t.default={name:"MdStep",components:{MdStepHeader:u.default},props:{id:{type:String,default:function(){return"md-stepper-"+(0,a.default)()}},href:[String,Number],to:null,mdLabel:String,mdDescription:String,mdError:String,mdDone:Boolean,mdEditable:{type:Boolean,default:!0}},inject:["MdSteppers"],watch:{$props:{deep:!0,handler:function(){this.setStepperData()}}},methods:{getPropValues:function(){var e=this,t=Object.keys(this.$options.props),n=["id","mdLabel","mdDescription","mdError","mdEditable"],i={};return t.forEach((function(t){n.includes(t)||(e[t]?i[t]=e[t]:e.$attrs.hasOwnProperty(t)&&(i[t]=!t||e.$attrs[t]))})),i},setStepperData:function(){this.$set(this.MdSteppers.items,this.id,{label:this.mdLabel,description:this.mdDescription,error:this.mdError,done:this.mdDone,editable:this.mdEditable,props:this.getPropValues(),events:this.$listeners})},setupWatchers:function(){var e=this,t=function(t){if(e.MdSteppers.items[e.id])return e.MdSteppers.items[e.id][t]};this.$watch((function(){return t("error")}),(function(){return e.$emit("update:mdError",t("error"))})),this.$watch((function(){return t("done")}),(function(){return e.$emit("update:mdDone",t("done"))}))}},created:function(){this.setStepperData(),this.setupWatchers()},beforeDestroy:function(){this.$delete(this.MdSteppers.items,this.id)},render:function(e){var t={staticClass:"md-stepper",attrs:r({},this.$attrs,{id:this.id}),on:this.$listeners};return this.href?this.buttonProps=this.$options.props:this.$router&&this.to&&(this.$options.props=MdRouterLinkProps(this,this.$options.props),t.props=this.$props),e("div",t,this.$slots.default)}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(1),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default=new r.default({name:"MdSubheader",computed:{insideList:function(){return"md-list"===this.$parent.$options._componentTag}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),s=i(r),a=n(98),o=i(a),u=n(10),l=i(u),t.default=new s.default({name:"MdSwitch",mixins:[o.default],props:{id:{type:String,default:function(){return"md-switch-"+(0,l.default)()}}}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b,g,_,M,y,S,w,C,x;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(9),a=i(s),o=n(459),u=i(o),l=n(10),d=i(l),c=n(8),f=i(c),m=n(460),h=i(m),p=n(468),v=i(p),b=n(207),g=i(b),_=n(475),M=i(_),y=n(209),S=i(y),w=n(58),C=i(w),x=function(e,t){var n,i,r,s=e,a=!0,o=!1,u=void 0;try{for(n=t.split(".")[Symbol.iterator]();!(a=(i=n.next()).done);a=!0)r=i.value,s=s[r]}catch(e){o=!0,u=e}finally{try{!a&&n.return&&n.return()}finally{if(o)throw u}}return s},t.default={name:"MdTable",components:{MdTagSwitcher:u.default,MdTableAlternateHeader:v.default,MdTableThead:h.default,MdTableRow:g.default,MdTableRowGhost:M.default,MdTableCellSelection:S.default},props:{value:[Array,Object],mdModelId:{type:String,default:"id"},mdCard:Boolean,mdFixedHeader:Boolean,mdHeight:{type:[Number,String],default:400},mdSort:String,mdSortOrder:r({type:String,default:"asc"},(0,f.default)("md-sort-order",["asc","desc"])),mdSortFn:{type:Function,default:function(e){var t=this;return e.sort((function(e,n){var i=t.MdTable.sort,r=x(e,i),s=x(n,i),a="asc"===t.MdTable.sortOrder;return"number"==typeof r?a?s-r:r-s:a?s.localeCompare(r):r.localeCompare(s)}))}},mdSelectedValue:{type:[Array,Object]}},data:function(){return{windowResizeObserver:null,fixedHeaderTableWidth:0,fixedHeaderPadding:0,hasContentScroll:!1,MdTable:{items:{},sort:null,sortOrder:null,singleSelection:null,selectedItems:[],selectable:[],fixedHeader:null,contentPadding:null,contentEl:null,hasValue:this.hasValue,emitEvent:this.emitEvent,sortTable:this.sortTable,manageItemSelection:this.manageItemSelection,getModel:this.getModel,getModelItem:this.getModelItem,selectingMode:null},itemsUuidMap:new WeakMap}},computed:{contentTag:function(){return this.mdCard?"md-card":"md-content"},headerCount:function(){return Object.keys(this.MdTable.items).length},selectedCount:function(){return this.MdTable.selectedItems.length},headerStyles:function(){if(this.mdFixedHeader)return"padding-right: "+this.fixedHeaderPadding+"px"},hasValue:function(){return this.value&&0!==this.value.length},headerClasses:function(){if(this.mdFixedHeader&&this.hasContentScroll||!this.hasValue)return"md-table-fixed-header-active"},contentStyles:function(){if(this.mdFixedHeader){var e="number"==typeof this.mdHeight?this.mdHeight+"px":this.mdHeight;return"height: "+e+";max-height: "+e}},contentClasses:function(){if(this.mdFixedHeader&&0===this.value.length)return"md-table-empty"},fixedHeaderTableStyles:function(){return{width:this.fixedHeaderTableWidth+"px"}}},provide:function(){return{MdTable:this.MdTable}},watch:{mdSort:{immediate:!0,handler:function(){this.MdTable.sort=this.mdSort}},mdSortOrder:{immediate:!0,handler:function(){this.MdTable.sortOrder=this.mdSortOrder}},mdFixedHeader:{immediate:!0,handler:function(){this.MdTable.fixedHeader=this.mdFixedHeader}},hasValue:{immediate:!0,handler:function(){this.MdTable.hasValue=this.hasValue}},"MdTable.selectedItems":function(e,t){var n=this;(function(){var i=n.isEmpty(e),r=n.isEmpty(t),s=i&&r;return!s&&(!!s||(e.length!==t.length||!e.every((function(e,n){return e==t[n]}))))})()&&this.select(e)},"MdTable.singleSelection":function(e,t){e!=t&&this.select(e)},mdSelectedValue:function(){this.syncSelectedValue()}},methods:{isEmpty:function(e){return!e||0===e.length},emitEvent:function(e,t){this.$emit(e,t)},getRowId:function(e,t){var n=e[t];return n||(n=this.itemsUuidMap.get(e),n||(n="md-row-"+(0,d.default)(),this.itemsUuidMap.set(e,n)),n)},setScroll:function(e){var t=this;(0,a.default)((function(){t.mdFixedHeader&&(t.$refs.fixedHeaderContainer.scrollLeft=e.target.scrollLeft),t.hasContentScroll=e.target.scrollTop>0}))},setHeaderScroll:function(e){var t=this;(0,a.default)((function(){t.MdTable.contentEl.scrollLeft=e.target.scrollLeft}))},getContentEl:function(){return this.$el.querySelector(".md-table-content")},setContentEl:function(){this.MdTable.contentEl=this.getContentEl()},setHeaderPadding:function(){var e,t;this.setContentEl(),e=this.MdTable.contentEl,t=e.childNodes[0],this.fixedHeaderPadding=e.offsetWidth-t.offsetWidth},getModel:function(){return this.value},getModelItem:function(e){return this.value[e]},manageItemSelection:function(e){this.MdTable.selectedItems.includes(e)?this.MdTable.selectedItems=this.MdTable.selectedItems.filter((function(t){return t!==e})):this.MdTable.selectedItems.push(e)},sortTable:function(){Array.isArray(this.value)&&this.$emit("input",this.mdSortFn(this.value))},select:function(e){this.$emit("update:mdSelectedValue",e),this.$emit("md-selected",e)},syncSelectedValue:function(){"single"===this.MdTable.selectingMode?this.MdTable.singleSelection=this.mdSelectedValue:"multiple"===this.MdTable.selectingMode&&(this.MdTable.selectedItems=this.mdSelectedValue||[])},setWidth:function(){this.mdFixedHeader&&(this.fixedHeaderTableWidth=this.$refs.contentTable.offsetWidth)}},created:function(){var e=this;this.$nextTick().then((function(){e.syncSelectedValue()}))},mounted:function(){this.setContentEl(),this.$nextTick().then(this.setWidth),this.mdFixedHeader&&(this.setHeaderPadding(),this.windowResizeObserver=new C.default(window,this.setWidth))},beforeDestroy:function(){this.windowResizeObserver&&this.windowResizeObserver.destroy()}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e};t.default={functional:!0,props:{mdTag:{type:String,default:"div"}},render:function(e,t){var n=t.props,r=t.children,s=t.data,a=t.listeners;return e(n.mdTag,i({},s,{on:a}),r)}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(97),s=i(r),a=n(465),o=i(a),t.default={name:"MdTableThead",inject:["MdTable"],components:{MdTableHead:s.default,MdTableHeadSelection:o.default}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(462),s=i(r),a=n(58),o=i(a),t.default={name:"MdTableHead",components:{MdUpwardIcon:s.default},props:{mdNumeric:Boolean,numeric:Boolean,id:[String,Number],label:String,tooltip:String,sortBy:String},inject:["MdTable"],data:function(){return{width:null,windowResizeObserver:null}},computed:{hasSort:function(){return this.MdTable.sort&&this.sortBy},isSorted:function(){if(this.MdTable.sort)return this.MdTable.sort===this.sortBy},isDescSorted:function(){return this.isSorted&&"desc"===this.MdTable.sortOrder},isAscSorted:function(){return this.isSorted&&"asc"===this.MdTable.sortOrder},headStyles:function(){return{width:this.width+"px"}},headClasses:function(){return{"md-numeric":this.numeric||this.mdNumeric,"md-sortable":this.hasSort,"md-sorted":this.isSorted,"md-sorted-desc":this.isDescSorted}}},methods:{changeSort:function(){this.hasSort&&(this.isAscSorted?this.MdTable.sortOrder="desc":this.MdTable.sortOrder="asc",this.MdTable.sort=this.sortBy,this.MdTable.emitEvent("md-sorted",this.MdTable.sort),this.MdTable.emitEvent("update:mdSort",this.MdTable.sort),this.MdTable.emitEvent("update:mdSortOrder",this.MdTable.sortOrder),this.MdTable.sortTable())},getChildNodesBySelector:function(e,t){return Array.from(e.childNodes).filter((function(e){var n=e.classList;return n&&n.contains(t)}))},getNodeIndex:function(e,t){return[].indexOf.call(e,t)},setWidth:function(){var e,t,n,i;this.MdTable.fixedHeader&&(e="md-table-cell",t=this.getChildNodesBySelector(this.$el.parentNode,"md-table-head"),n=this.MdTable.contentEl.querySelectorAll("tr:first-child ."+e),i=this.getNodeIndex(t,this.$el),this.width=n[i].offsetWidth)}},updated:function(){this.$nextTick().then(this.setWidth)},mounted:function(){this.$nextTick().then(this.setWidth),this.MdTable.fixedHeader&&(this.windowResizeObserver=new o.default(window,this.setWidth))},beforeDestroy:function(){this.windowResizeObserver&&this.windowResizeObserver.destroy()}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(12),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdUpwardIcon",components:{MdIcon:r.default}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(97),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdTableHeadSelection",components:{MdTableHead:r.default},inject:["MdTable"],computed:{selectableCount:function(){return Object.keys(this.selectable).length},isDisabled:function(){return!this.selectableCount},selectable:function(){return this.MdTable.selectable},selectedItems:function(){return this.MdTable.selectedItems},allSelected:function(){var e=this;return 0!==this.selectableCount&&this.selectable.every((function(t){return e.selectedItems.includes(t)}))}},methods:{onChange:function(e){var t=this;this.MdTable.selectedItems=e?this.selectedItems.concat(this.selectable.filter((function(e){return!t.selectedItems.includes(e)}))):this.selectedItems.filter((function(e){return!t.selectable.includes(e)}))}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdTableAlternateHeader"}}),(function(e,t,n){"use strict";function i(e){n(471)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(208),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(474),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(8),a=i(s),o=n(209),u=i(o),t.default={name:"MdTableRow",components:{MdTableCellSelection:u.default},props:{mdIndex:[Number,String],mdId:[Number,String],mdSelectable:r({type:[String]},(0,a.default)("md-selectable",["multiple","single"])),mdDisabled:Boolean,mdAutoSelect:Boolean,mdItem:[Array,Object]},inject:["MdTable"],data:function(){return{index:null}},computed:{selectableCount:function(){return this.MdTable.selectable.length},isMultipleSelected:function(){return this.MdTable.selectedItems.includes(this.mdItem)},isSingleSelected:function(){return this.MdTable.singleSelection===this.mdItem},hasMultipleSelection:function(){return this.MdTable.hasValue&&"multiple"===this.mdSelectable},hasSingleSelection:function(){return this.MdTable.hasValue&&"single"===this.mdSelectable},rowClasses:function(){if(this.MdTable.hasValue)return{"md-has-selection":!this.mdDisabled&&(this.mdAutoSelect||this.hasSingleSelection),"md-selected":this.isMultipleSelected,"md-selected-single":this.isSingleSelected}},isInSelectedItems:function(){return this.MdTable.selectedItems.includes(this.mdItem)}},watch:{mdDisabled:function(){this.mdDisabled?this.removeSelectableItem():this.addSelectableItem()},mdSelectable:function(){this.MdTable.selectingMode=this.mdSelectable},mdItem:function(e,t){this.removeSelectableItem(t),this.$nextTick(this.addSelectableItem)}},methods:{onClick:function(){this.MdTable.hasValue&&!this.mdDisabled&&(this.hasMultipleSelection?this.selectRowIfMultiple():this.hasSingleSelection&&this.selectRowIfSingle())},toggleSelection:function(){this.MdTable.manageItemSelection(this.mdItem)},addSelection:function(){this.isMultipleSelected||this.MdTable.selectedItems.push(this.mdItem)},removeSelection:function(){var e=this;this.isMultipleSelected&&(this.MdTable.selectedItems=this.MdTable.selectedItems.filter((function(t){return t!==e.mdItem})))},selectRowIfSingle:function(){this.MdTable.singleSelection===this.mdItem?this.MdTable.singleSelection=null:this.MdTable.singleSelection=this.mdItem},selectRowIfMultiple:function(){this.mdAutoSelect&&this.toggleSelection()},addSelectableItem:function(){return!(!this.hasMultipleSelection||this.mdDisabled)&&(!this.MdTable.selectable.includes(this.mdItem)&&void this.MdTable.selectable.push(this.mdItem))},removeSelectableItem:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.mdItem;"multiple"===this.mdSelectable&&(this.MdTable.selectable=this.MdTable.selectable.filter((function(t){return t!==e})))}},created:function(){var e=this;this.$nextTick((function(){e.addSelectableItem(),e.MdTable.selectingMode=e.mdSelectable}))},beforeDestroy:function(){this.removeSelectableItem()}}}),(function(e,t,n){"use strict";function i(e){n(472)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(210),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(473),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdTableCellSelection",props:{value:Boolean,mdRowId:[Number,String],mdSelectable:Boolean,mdDisabled:Boolean},inject:["MdTable"],data:function(){return{isSelected:!1}},watch:{value:{immediate:!0,handler:function(e){this.isSelected=e}}},methods:{onChange:function(){this.$emit("input",this.isSelected)}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdTableRowGhost",props:{mdIndex:[String,Number],mdId:[String,Number],mdItem:[Array,Object]},render:function(){return this.$slots.default[0].componentOptions.propsData.mdIndex=this.mdIndex,this.$slots.default[0].componentOptions.propsData.mdId=this.mdId,this.$slots.default[0].componentOptions.propsData.mdItem=this.mdItem,this.$slots.default[0]}}}),(function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),i=n(105),r=(function(e){return e&&e.__esModule?e:{default:e}})(i),t.default={name:"MdTableToolbar",components:{MdToolbar:r.default},inject:["MdTable"]}}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-toolbar",class:[e.$mdActiveTheme,"md-elevation-"+e.mdElevation]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a;Object.defineProperty(t,"__esModule",{value:!0}),r=n(100),i(r),s=n(93),a=i(s),t.default={name:"MdTableEmptyState",props:a.default,inject:["MdTable"]}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdTableCell",props:{mdId:[String,Number],mdLabel:String,mdNumeric:Boolean,mdTooltip:String,mdSortBy:String},inject:["MdTable"],data:function(){return{index:null,parentNode:null}},computed:{cellClasses:function(){return{"md-numeric":this.mdNumeric}}},watch:{mdSortBy:function(){this.setCellData()},mdNumeric:function(){this.setCellData()},mdLabel:function(){this.setCellData()},mdTooltip:function(){this.setCellData()}},methods:{setCellData:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;this.$set(this.MdTable.items,e.index,{id:e.mdId,label:e.mdLabel,numeric:e.mdNumeric,tooltip:e.mdTooltip,sortBy:e.mdSortBy})},updateAllCellData:function(){var e,t=this;this.MdTable.items={},e=Array.from(this.parentNode.childNodes).filter((function(e){var t=e.tagName,n=e.classList,i=n&&n.contains("md-table-cell-selection");return t&&"td"===t.toLowerCase()&&!i})),e.forEach((function(e,n){var i=e.__vue__;i.index=n,t.setCellData(i)}))}},mounted:function(){this.parentNode=this.$el.parentNode,this.updateAllCellData()},destroyed:function(){if(null!==this.$el.parentNode)return!1;this.updateAllCellData()}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdTablePagination",inject:["MdTable"],props:{mdPageSize:{type:[String,Number],default:10},mdPageOptions:{type:Array,default:function(){return[10,25,50,100]}},mdPage:{type:Number,default:1},mdTotal:{type:[String,Number],default:"Many"},mdLabel:{type:String,default:"Rows per page:"},mdSeparator:{type:String,default:"of"}},data:function(){return{currentPageSize:0}},computed:{currentItemCount:function(){return(this.mdPage-1)*this.mdPageSize+1},currentPageCount:function(){return this.mdPage*this.mdPageSize}},watch:{mdPageSize:{immediate:!0,handler:function(e){this.currentPageSize=this.pageSize}}},methods:{setPageSize:function(){this.$emit("update:mdPageSize",this.currentPageSize)},goToPrevious:function(){},goToNext:function(){}},created:function(){this.currentPageSize=this.mdPageSize}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,o,u,l,d,c,f,m,h,p,v,b;Object.defineProperty(t,"__esModule",{value:!0}),s=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},a=n(9),o=i(a),u=n(1),l=i(u),d=n(41),c=i(d),f=n(8),m=i(f),h=n(78),p=i(h),v=n(99),b=i(v),t.default=new l.default({name:"MdTabs",mixins:[c.default],components:{MdContent:b.default},props:{mdAlignment:s({type:String,default:"left"},(0,m.default)("md-alignment",["left","right","centered","fixed"])),mdElevation:{type:[Number,String],default:0},mdSyncRoute:Boolean,mdDynamicHeight:Boolean,mdActiveTab:[String,Number]},data:function(){return{resizeObserver:null,activeTab:0,activeTabIndex:0,indicatorStyles:{},indicatorClass:null,noTransition:!0,containerStyles:{},contentStyles:{height:"0px"},hasContent:!1,MdTabs:{items:{}}}},provide:function(){return{MdTabs:this.MdTabs}},computed:{tabsClasses:function(){var e;return e={},r(e,"md-alignment-"+this.mdAlignment,!0),r(e,"md-no-transition",this.noTransition),r(e,"md-dynamic-height",this.mdDynamicHeight),e},navigationClasses:function(){return"md-elevation-"+this.mdElevation}},watch:{MdTabs:{deep:!0,handler:function(){this.setHasContent()}},activeTab:function(){var e=this;this.$nextTick().then((function(){e.setIndicatorStyles(),e.setActiveTabIndex(),e.calculateTabPos()}))},mdActiveTab:function(e){this.activeTab=e,this.$emit("md-changed",e)}},methods:{hasActiveTab:function(){return this.activeTab||this.mdActiveTab},getItemsAndKeys:function(){var e=this.MdTabs.items;return{items:e,keys:Object.keys(e)}},setActiveTab:function(e){this.activeTab=e,this.$emit("md-changed",e)},setActiveTabIndex:function(){var e=this.$el.querySelector(".md-button.md-active");e&&(this.activeTabIndex=[].indexOf.call(e.parentNode.childNodes,e))},setActiveTabByIndex:function(e){var t=this.getItemsAndKeys(),n=t.keys;this.hasActiveTab()||(this.activeTab=n[e])},setActiveTabByRoute:function(){var e=this,t=this.getItemsAndKeys(),n=t.items,i=t.keys,r=null;this.$router&&i.forEach((function(t,i){var s=n[t],a=s.props.to;a&&a===e.$route.path&&(r=i)})),this.hasActiveTab()||r?this.activeTab=i[r]:this.activeTab=i[0]},setHasContent:function(){var e=this.getItemsAndKeys(),t=e.items,n=e.keys;this.hasContent=n.some((function(e){return t[e].hasContent}))},setIndicatorStyles:function(){var e=this;(0,o.default)((function(){e.$nextTick().then((function(){var t,n,i,r=e.$el.querySelector(".md-button.md-active");r&&e.$refs.indicator&&(t=r.offsetWidth,n=r.offsetLeft,i=e.$refs.indicator.offsetLeft,e.indicatorClass=i<n?"md-tabs-indicator-right":"md-tabs-indicator-left",e.indicatorStyles={left:n+"px",right:"calc(100% - "+(t+n)+"px)"})}))}))},calculateTabPos:function(){if(this.hasContent){var e=this.$el.querySelector(".md-tab:nth-child("+(this.activeTabIndex+1)+")");this.contentStyles={height:e.offsetHeight+"px"},this.containerStyles={transform:"translate3D("+100*-this.activeTabIndex+"%, 0, 0)"}}},callResizeFunctions:function(){this.setIndicatorStyles(),this.calculateTabPos()},setupObservers:function(){var e=this;this.resizeObserver=(0,p.default)(this.$el.querySelector(".md-tabs-content"),{childList:!0,characterData:!0,subtree:!0},(function(){e.callResizeFunctions()})),window.addEventListener("resize",this.callResizeFunctions)},setupWatchers:function(){this.mdSyncRoute&&this.$watch("$route",{deep:!0,handler:function(){this.mdSyncRoute&&this.setActiveTabByRoute()}})}},created:function(){this.setHasContent(),this.activeTab=this.mdActiveTab},mounted:function(){var e=this;this.$nextTick().then((function(){return e.mdSyncRoute?e.setActiveTabByRoute():e.setActiveTabByIndex(0),e.$nextTick()})).then((function(){e.setActiveTabIndex(),e.calculateTabPos(),window.setTimeout((function(){e.noTransition=!1,e.setupObservers(),e.setupWatchers()}),100)})),this.$refs.navigation.addEventListener("transitionend",this.setIndicatorStyles)},beforeDestroy:function(){this.resizeObserver&&this.resizeObserver.disconnect(),window.removeEventListener("resize",this.callResizeFunctions),this.$refs.navigation.removeEventListener("transitionend",this.setIndicatorStyles)}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(10),a=i(s),o=n(78),u=i(o),l=n(27),d=i(l),t.default={name:"MdTab",props:{id:{type:String,default:function(){return"md-tab-"+(0,a.default)()}},href:[String,Number],to:null,mdDisabled:Boolean,mdLabel:[String,Number],mdIcon:String,mdTemplateData:{type:Object,default:function(){return{}}}},inject:["MdTabs"],data:function(){return{observer:null}},watch:{$props:{deep:!0,handler:function(){this.setTabData()}},$attrs:{deep:!0,handler:function(){this.setTabData()}}},methods:{setTabContent:function(){this.$set(this.MdTabs.items[this.id],"hasContent",!!this.$slots.default)},setupObserver:function(){this.observer=(0,u.default)(this.$el,{childList:!0},this.setTabContent)},setTabData:function(){this.$set(this.MdTabs.items,this.id,{hasContent:!!this.$slots.default,label:this.mdLabel,icon:this.mdIcon,disabled:this.mdDisabled,data:this.mdTemplateData,props:this.getPropValues(),events:this.$listeners})},getPropValues:function(){var e=this,t=Object.keys(this.$options.props),n=["id","mdLabel","mdDisabled","mdTemplateData"],i={};return t.forEach((function(t){n.includes(t)||(e[t]?i[t]=e[t]:e.$attrs.hasOwnProperty(t)&&(i[t]=!t||e.$attrs[t]))})),i}},mounted:function(){this.setupObserver(),this.setTabData()},beforeDestroy:function(){this.observer&&this.observer.disconnect(),this.$delete(this.MdTabs.items,this.id)},render:function(e){var t={staticClass:"md-tab",attrs:r({},this.$attrs,{id:this.id}),on:this.$listeners};return this.href?this.buttonProps=this.$options.props:this.$router&&this.to&&(this.$options.props=(0,d.default)(this,this.$options.props),t.props=this.$props),e("div",t,this.$slots.default)}}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(1),a=i(s),o=n(8),u=i(o),l=n(53),d=i(l),t.default=new a.default({name:"MdTooltip",components:{MdPopover:d.default},props:{mdActive:Boolean,mdDelay:{type:[String,Number],default:0},mdDirection:r({type:String,default:"bottom"},(0,u.default)("md-direction",["top","right","bottom","left"]))},data:function(){return{shouldRender:!1,targetEl:null}},computed:{tooltipClasses:function(){return"md-tooltip-"+this.mdDirection},tooltipStyles:function(){return"transition-delay: "+this.mdDelay+"ms"},popperSettings:function(){return{placement:this.mdDirection,modifiers:{offset:{offset:"0, 16"}}}}},watch:{mdActive:function(){this.shouldRender=this.mdActive},shouldRender:function(e){this.$emit("update:mdActive",e)}},methods:{show:function(){this.shouldRender=!0},hide:function(){this.shouldRender=!1}},mounted:function(){var e=this;this.$nextTick().then((function(){e.shouldRender=e.mdActive,e.targetEl=e._vnode.componentInstance.originalParentEl,e.targetEl&&(e.targetEl.addEventListener("mouseenter",e.show,!1),e.targetEl.addEventListener("mouseleave",e.hide,!1))}))},beforeDestroy:function(){this.targetEl&&(this.targetEl.removeEventListener("mouseenter",this.show),this.targetEl.removeEventListener("mouseleave",this.hide))}})}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(222),o=i(a),u=n(232),l=i(u),d=n(235),c=i(d),f=n(238),m=i(f),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default),e.component(m.default.name,m.default)}}),(function(e,t,n){"use strict";function i(e){n(223)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(106),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(0),u=null,l=!1,d=i,c=null,f=null,m=o(s.a,u,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){n(225)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(107),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(226),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-app md-app-side-drawer md-layout-row",class:[e.appClasses,e.$mdActiveTheme]},[e._t("md-app-drawer-left"),e._v(" "),e._t("md-app-drawer-right-previous"),e._v(" "),n("main",{staticClass:"md-app-container md-flex md-layout-column",class:[e.$mdActiveTheme,e.scrollerClasses],style:e.contentStyles,on:{"&scroll":function(t){e.handleScroll(t)}}},[e._t("md-app-toolbar"),e._v(" "),n("div",{staticClass:"md-app-scroller md-layout-column md-flex",class:[e.$mdActiveTheme,e.scrollerClasses],style:e.containerStyles,on:{"&scroll":function(t){e.handleScroll(t)}}},[e._t("md-app-content")],2)],2),e._v(" "),e._t("md-app-drawer-right")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(228)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(109),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(229),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-app md-app-internal-drawer md-layout-column",class:[e.appClasses,e.$mdActiveTheme]},[e._t("md-app-toolbar"),e._v(" "),n("main",{staticClass:"md-app-container md-flex md-layout-row",class:[e.$mdActiveTheme,e.scrollerClasses],style:[e.containerStyles,e.contentStyles]},[e._t("md-app-drawer-left"),e._v(" "),e._t("md-app-drawer-right-previous"),e._v(" "),n("div",{staticClass:"md-app-scroller md-layout-column md-flex",class:[e.$mdActiveTheme,e.scrollerClasses]},[e._t("md-app-content")],2),e._v(" "),e._t("md-app-drawer-right")],2)],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(110),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(231),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],staticClass:"md-drawer md-right-previous",class:e.drawerClasses})},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(233)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(111),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(234),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-toolbar",e._g(e._b({staticClass:"md-app-toolbar",class:e.toolbarClasses,style:e.toolbarStyles},"md-toolbar",e.$attrs,!1),e.$listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(236)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(112),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(237),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.showCard?n("md-card",e._g(e._b({staticClass:"md-app-content md-flex"},"md-card",e.$attrs,!1),e.$listeners),[e._t("default")],2):n("md-content",e._g(e._b({staticClass:"md-app-content md-flex"},"md-content",e.$attrs,!1),e.$listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(113),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(239),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-drawer",e._g(e._b({ref:"drawer",staticClass:"md-app-drawer",attrs:{"md-active":e.mdActive&&e.initialized,"md-right":e.mdRight}},"md-drawer",e.$attrs,!1),e.$listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(241),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(242)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(114),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(246),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){n(244)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(115),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(245),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-badge",class:[e.$mdActiveTheme]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.hasDefaultSlot?n("div",{staticClass:"md-badge-content"},[e._t("default"),e._v(" "),n("md-badge-standalone",{class:e.badgeClasses,style:e.styles},[n("div",[e._v("\n      "+e._s(e.mdContent)+"\n    ")])])],2):n("md-badge-standalone",{class:e.badgeClasses,style:e.styles},[e._v("\n  "+e._s(e.mdContent)+"\n")])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(248),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(249)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(116),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(252),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";function i(e,t){var n,i,r,s=t.length,a=e.length;if(a>s)return!1;if(a===s)return e===t;e:for(n=0,i=0;n<a;n++){for(r=e.charCodeAt(n);i<s;)if(t.charCodeAt(i++)===r)continue e;return!1}return!0}e.exports=i}),(function(e,t){function n(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}e.exports=n}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-field",{staticClass:"md-autocomplete",class:e.fieldClasses,attrs:{"md-clearable":"","md-inline":e.isBoxLayout}},[n("md-menu",{attrs:{"md-direction":"bottom-start","md-dense":e.mdDense,"md-align-trigger":"","md-full-width":"","md-active":e.showMenu},on:{"update:mdActive":function(t){e.showMenu=t}}},[n("md-input",e._b({attrs:{id:e.mdInputId,name:e.mdInputName,maxlength:e.mdInputMaxlength,placeholder:e.mdInputPlaceholder},on:{focus:function(t){t.stopPropagation(),e.openOnFocus(t)},blur:e.hideOptions,input:e.onInput,click:function(t){t.stopPropagation(),t.preventDefault(),e.openOnFocus(t)}},model:{value:e.searchTerm,callback:function(t){e.searchTerm=t},expression:"searchTerm"}},"md-input",e.$attrs,!1)),e._v(" "),n("md-menu-content",{directives:[{name:"show",rawName:"v-show",value:e.hasScopedEmptySlot||e.hasFilteredItems,expression:"hasScopedEmptySlot || hasFilteredItems"}],class:e.contentClasses},[e.isPromisePending?n("div",{staticClass:"md-autocomplete-loading"},[n("md-progress-spinner",{attrs:{"md-diameter":40,"md-stroke":4,"md-mode":"indeterminate"}})],1):e._e(),e._v(" "),e.hasFilteredItems?n("div",{staticClass:"md-autocomplete-items"},e._l(e.getOptions(),(function(t,i){return n("md-menu-item",{key:i,on:{click:function(n){e.selectItem(t,n)}}},[e.$scopedSlots["md-autocomplete-item"]?e._t("md-autocomplete-item",null,{item:t,term:e.searchTerm}):[e._v(e._s(t))]],2)}))):e.hasScopedEmptySlot?n("md-menu-item",[n("div",{staticClass:"md-autocomplete-empty"},[e._t("md-autocomplete-empty",null,{term:e.searchTerm})],2)]):e._e()],1)],1),e._v(" "),e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(254),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(255)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(117),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(256),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-avatar",class:[e.$mdActiveTheme]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(258),o=i(a),u=n(261),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){n(259)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(118),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(260),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-bottom-bar",class:[e.$mdActiveTheme,e.barClasses]},[n("md-ripple",{attrs:{"md-disabled":"fixed"===e.mdType,"md-active":e.MdBottomBar.mouseEvent}},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(119),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(262),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-button",e._g(e._b({staticClass:"md-bottom-bar-item",class:e.itemClasses,attrs:{id:e.id,disabled:e.mdDisabled,"md-ripple":"fixed"===e.MdBottomBar.type},on:{click:e.setActiveItem}},"md-button",e.attrs,!1),e.$listeners),[e.$slots.default?e._t("default"):[e.isAssetIcon(e.mdIcon)?n("md-icon",{staticClass:"md-bottom-bar-icon",attrs:{"md-src":e.mdIcon}}):n("md-icon",{staticClass:"md-bottom-bar-icon"},[e._v(e._s(e.mdIcon))]),e._v(" "),n("span",{staticClass:"md-bottom-bar-label"},[e._v(e._s(e.mdLabel))])]],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(37),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b,g,_,M,y,S,w,C,x,O,T,P,$;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(265),o=i(a),u=n(268),l=i(u),d=n(271),c=i(d),f=n(274),m=i(f),h=n(276),p=i(h),v=n(279),b=i(v),g=n(282),_=i(g),M=n(285),y=i(M),S=n(288),w=i(S),C=n(291),x=i(C),O=n(293),T=i(O),P=n(296),$=i(P),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default),e.component(m.default.name,m.default),e.component(p.default.name,p.default),e.component(b.default.name,b.default),e.component(_.default.name,_.default),e.component(y.default.name,y.default),e.component(w.default.name,w.default),e.component(x.default.name,x.default),e.component(T.default.name,T.default),e.component($.default.name,$.default)}}),(function(e,t,n){"use strict";function i(e){n(266)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(120),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(267),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card",class:[e.$mdActiveTheme,e.cardClasses]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(269)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(121),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(270),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-area",class:e.areaClasses},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(272)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(122),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(273),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-header"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(123),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(275),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-header-text"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(277)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(124),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(278),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-media",class:e.mediaClasses},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(280)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(125),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(281),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-media-actions"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(283)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(126),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(284),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-card-media-cover",class:e.coverClasses},[e._t("default"),e._v(" "),e.mdTextScrim?n("div",{ref:"backdrop",staticClass:"md-card-backdrop",style:e.coverStyles}):e._e()],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(286)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(127),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(287),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-content"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(289)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(128),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(290),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-expand"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(292)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(129),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(0),u=null,l=!1,d=i,c=null,f=null,m=o(s.a,u,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){n(294)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(130),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(295),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-expand-content",style:e.contentStyles},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(297)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(131),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(298),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-card-actions",class:"md-alignment-"+e.mdAlignment},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(300),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(301)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(132),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(302),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-checkbox",class:[e.$mdActiveTheme,e.checkClasses]},[n("div",{staticClass:"md-checkbox-container",on:{click:function(t){t.stopPropagation(),e.toggleCheck(t)}}},[n("md-ripple",{attrs:{"md-centered":"","md-active":e.rippleActive,"md-disabled":e.disabled},on:{"update:mdActive":function(t){e.rippleActive=t}}},[n("input",e._b({attrs:{id:e.id,type:"checkbox"},domProps:{indeterminate:e.indeterminate}},"input",e.attrs,!1))])],1),e._v(" "),e.$slots.default?n("label",{staticClass:"md-checkbox-label",attrs:{for:e.id},on:{click:function(t){t.preventDefault(),e.toggleCheck(t)}}},[e._t("default")],2):e._e()])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(304),o=i(a),u=n(307),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){n(305)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(133),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(306),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-field",{staticClass:"md-chips",class:[e.$mdActiveTheme,e.chipsClasses]},[e._t("default"),e._v(" "),e._l(e.value,(function(t,i){return n("md-chip",{key:t,attrs:{"md-deletable":!e.mdStatic,"md-clickable":!e.mdStatic,"md-duplicated":e.duplicatedChip===t},on:{keydown:function(n){if(!("button"in n)&&e._k(n.keyCode,"enter",13,n.key))return null;e.$emit("md-click",t,i)},"md-delete":function(n){n.stopPropagation(),e.removeChip(t)}},nativeOn:{click:function(n){e.$emit("md-click",t,i)}}},[e.$scopedSlots["md-chip"]?e._t("md-chip",[e._v(e._s(t))],{chip:t}):[e._v(e._s(t))]],2)})),e._v(" "),!e.mdStatic&&e.modelRespectLimit?n("md-input",{ref:"input",attrs:{type:e.mdInputType,id:e.id,placeholder:e.mdPlaceholder},on:{input:e.handleInput,keydown:[function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.insertChip(t)},function(t){if(!("button"in t)&&8!==t.keyCode)return null;e.handleBackRemove(t)}]},model:{value:e.inputValue,callback:function(t){e.inputValue="string"==typeof t?t.trim():t},expression:"inputValue"}}):e._e()],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(308)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(134),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(309),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"md-chip",appear:""}},[n("div",e._g({staticClass:"md-chip",class:[e.$mdActiveTheme,e.chipClasses],attrs:{tabindex:"0"}},e.$listeners),[e.mdClickable||!e.mdRipple?n("md-ripple",{attrs:{"md-disabled":e.mdDisabled}},[e._t("default")],2):e._t("default"),e._v(" "),n("transition",{attrs:{name:"md-input-action",appear:""}},[e.mdDeletable?n("md-button",{staticClass:"md-icon-button md-dense md-input-action md-clear",attrs:{tabindex:"-1"},on:{click:function(t){e.$emit("md-delete",t)}}},[n("md-clear-icon")],1):e._e()],1)],2)])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(99),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(312),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(313)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(135),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(348),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";e.exports="undefined"!=typeof navigator&&/^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)}),(function(e,t,n){function i(e,t,n){var i,s=t?t+"":"YYYY-MM-DDTHH:mm:ss.SSSZ",a=n||{},o=a.locale,u=m.format.formatters,l=m.format.formattingTokensRegExp;return o&&o.format&&o.format.formatters&&(u=o.format.formatters,o.format.formattingTokensRegExp&&(l=o.format.formattingTokensRegExp)),i=c(e),f(i)?r(s,u,l)(i):"Invalid Date"}function r(e,t,n){var i,r,a=e.match(n),o=a.length;for(i=0;i<o;i++)r=t[a[i]]||h[a[i]],a[i]=r||s(a[i]);return function(e){var t,n="";for(t=0;t<o;t++)a[t]instanceof Function?n+=a[t](e,h):n+=a[t];return n}}function s(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|]$/g,""):e.replace(/\\/g,"")}function a(e,t){var n,i,r,s;return t=t||"",n=e>0?"-":"+",i=Math.abs(e),r=Math.floor(i/60),s=i%60,n+o(r,2)+t+o(s,2)}function o(e,t){for(var n=""+Math.abs(e);n.length<t;)n="0"+n;return n}var u=n(316),l=n(319),d=n(137),c=n(15),f=n(138),m=n(322),h={M:function(e){return e.getMonth()+1},MM:function(e){return o(e.getMonth()+1,2)},Q:function(e){return Math.ceil((e.getMonth()+1)/3)},D:function(e){return e.getDate()},DD:function(e){return o(e.getDate(),2)},DDD:function(e){return u(e)},DDDD:function(e){return o(u(e),3)},d:function(e){return e.getDay()},E:function(e){return e.getDay()||7},W:function(e){return l(e)},WW:function(e){return o(l(e),2)},YY:function(e){return o(e.getFullYear(),4).substr(2)},YYYY:function(e){return o(e.getFullYear(),4)},GG:function(e){return(d(e)+"").substr(2)},GGGG:function(e){return d(e)},H:function(e){return e.getHours()},HH:function(e){return o(e.getHours(),2)},h:function(e){var t=e.getHours();return 0===t?12:t>12?t%12:t},hh:function(e){return o(h.h(e),2)},m:function(e){return e.getMinutes()},mm:function(e){return o(e.getMinutes(),2)},s:function(e){return e.getSeconds()},ss:function(e){return o(e.getSeconds(),2)},S:function(e){return Math.floor(e.getMilliseconds()/100)},SS:function(e){return o(Math.floor(e.getMilliseconds()/10),2)},SSS:function(e){return o(e.getMilliseconds(),3)},Z:function(e){return a(e.getTimezoneOffset(),":")},ZZ:function(e){return a(e.getTimezoneOffset())},X:function(e){return Math.floor(e.getTime()/1e3)},x:function(e){return e.getTime()}};e.exports=i}),(function(e,t,n){function i(e){var t=r(e);return a(t,s(t))+1}var r=n(15),s=n(317),a=n(318);e.exports=i}),(function(e,t,n){function i(e){var t=r(e),n=new Date(0);return n.setFullYear(t.getFullYear(),0,1),n.setHours(0,0,0,0),n}var r=n(15);e.exports=i}),(function(e,t,n){function i(e,t){var n=r(e),i=r(t),o=n.getTime()-n.getTimezoneOffset()*s,u=i.getTime()-i.getTimezoneOffset()*s;return Math.round((o-u)/a)}var r=n(88),s=6e4,a=864e5;e.exports=i}),(function(e,t,n){function i(e){var t=r(e),n=s(t).getTime()-a(t).getTime();return Math.round(n/o)+1}var r=n(15),s=n(89),a=n(321),o=6048e5;e.exports=i}),(function(e,t,n){function i(e,t){var n=t?+t.weekStartsOn||0:0,i=r(e),s=i.getDay(),a=(s<n?7:0)+s-n;return i.setDate(i.getDate()-a),i.setHours(0,0,0,0),i}var r=n(15);e.exports=i}),(function(e,t,n){function i(e){var t=r(e),n=new Date(0);return n.setFullYear(t,0,4),n.setHours(0,0,0,0),s(n)}var r=n(137),s=n(89);e.exports=i}),(function(e,t,n){var i=n(323),r=n(324);e.exports={distanceInWords:i(),format:r()}}),(function(e,t){function n(){function e(e,n,i){i=i||{};var r;return r="string"==typeof t[e]?t[e]:1===n?t[e].one:t[e].other.replace("{{count}}",n),i.addSuffix?i.comparison>0?"in "+r:r+" ago":r}var t={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}};return{localize:e}}e.exports=n}),(function(e,t,n){function i(){var e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],t=["January","February","March","April","May","June","July","August","September","October","November","December"],n=["Su","Mo","Tu","We","Th","Fr","Sa"],i=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],a=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],o=["AM","PM"],u=["am","pm"],l=["a.m.","p.m."],d={MMM:function(t){return e[t.getMonth()]},MMMM:function(e){return t[e.getMonth()]},dd:function(e){return n[e.getDay()]},ddd:function(e){return i[e.getDay()]},dddd:function(e){return a[e.getDay()]},A:function(e){return e.getHours()/12>=1?o[1]:o[0]},a:function(e){return e.getHours()/12>=1?u[1]:u[0]},aa:function(e){return e.getHours()/12>=1?l[1]:l[0]}};return["M","D","DDD","d","Q","W"].forEach((function(e){d[e+"o"]=function(t,n){return r(n[e](t))}})),{formatters:d,formattingTokensRegExp:s(d)}}function r(e){var t=e%100;if(t>20||t<10)switch(t%10){case 1:return e+"st";case 2:return e+"nd";case 3:return e+"rd"}return e+"th"}var s=n(325);e.exports=i}),(function(e,t){function n(e){var t,n,r=[];for(t in e)e.hasOwnProperty(t)&&r.push(t);return n=i.concat(r).sort().reverse(),RegExp("(\\[[^\\[]*\\])|(\\\\)?("+n.join("|")+"|.)","g")}var i=["M","MM","Q","D","DD","DDD","DDDD","d","E","W","WW","YY","YYYY","GG","GGGG","H","HH","h","hh","m","mm","s","ss","S","SS","SSS","Z","ZZ","X","x"];e.exports=n}),(function(e,t,n){"use strict";function i(e){n(327)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(139),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(344),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){function i(e){var t=r(e);return t.setDate(1),t.setHours(0,0,0,0),t}var r=n(15);e.exports=i}),(function(e,t,n){function i(e,t){return r(e,-+t)}var r=n(140);e.exports=i}),(function(e,t,n){function i(e){return r(e).getDate()}var r=n(15);e.exports=i}),(function(e,t,n){function i(e){return r(e).getDay()}var r=n(15);e.exports=i}),(function(e,t,n){function i(e){return r(e).getMonth()}var r=n(15);e.exports=i}),(function(e,t,n){function i(e){return r(e).getFullYear()}var r=n(15);e.exports=i}),(function(e,t,n){function i(e,t){var n=r(e),i=r(t);return n.getTime()===i.getTime()}var r=n(15);e.exports=i}),(function(e,t,n){function i(e,t){var n=r(e),i=r(t);return n.getTime()===i.getTime()}var r=n(88);e.exports=i}),(function(e,t,n){function i(e){return r(e).getTime()===r(new Date).getTime()}var r=n(88);e.exports=i}),(function(e,t,n){function i(e,t){var n=r(e),i=+t;return n.setDate(i),n}var r=n(15);e.exports=i}),(function(e,t,n){function i(e,t){var n,i=r(e),a=+t,o=i.getFullYear(),u=i.getDate(),l=new Date(0);return l.setFullYear(o,a,15),l.setHours(0,0,0,0),n=s(l),i.setMonth(a,Math.min(u,n)),i}var r=n(15),s=n(92);e.exports=i}),(function(e,t,n){function i(e,t){var n=r(e),i=+t;return n.setFullYear(i),n}var r=n(15);e.exports=i}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(141),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(341),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}}),e._v(" "),n("path",{attrs:{d:"M0-.25h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(142),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(343),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"}}),e._v(" "),n("path",{attrs:{d:"M0-.5h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-popover",{attrs:{"md-settings":e.popperSettings,"md-active":""}},[n("transition",{attrs:{name:"md-datepicker-dialog",appear:""},on:{enter:e.setContentStyles,"after-leave":e.resetDate}},[n("div",{staticClass:"md-datepicker-dialog",class:[e.$mdActiveTheme]},[n("div",{staticClass:"md-datepicker-header"},[n("span",{staticClass:"md-datepicker-year-select",class:{"md-selected":"year"===e.currentView},on:{click:function(t){e.currentView="year"}}},[e._v(e._s(e.selectedYear))]),e._v(" "),n("div",{staticClass:"md-datepicker-date-select",class:{"md-selected":"year"!==e.currentView},on:{click:function(t){e.currentView="day"}}},[n("strong",{staticClass:"md-datepicker-dayname"},[e._v(e._s(e.shortDayName)+", ")]),e._v(" "),n("strong",{staticClass:"md-datepicker-monthname"},[e._v(e._s(e.shortMonthName))]),e._v(" "),n("strong",{staticClass:"md-datepicker-day"},[e._v(e._s(e.currentDay))])])]),e._v(" "),n("div",{staticClass:"md-datepicker-body"},[n("transition",{attrs:{name:"md-datepicker-body-header"}},["day"===e.currentView?n("div",{staticClass:"md-datepicker-body-header"},[n("md-button",{staticClass:"md-dense md-icon-button",on:{click:e.previousMonth}},[n("md-arrow-left-icon")],1),e._v(" "),n("md-button",{staticClass:"md-dense md-icon-button",on:{click:e.nextMonth}},[n("md-arrow-right-icon")],1)],1):e._e()]),e._v(" "),n("div",{staticClass:"md-datepicker-body-content",style:e.contentStyles},[n("transition",{attrs:{name:"md-datepicker-view"}},["day"===e.currentView?n("transition-group",{staticClass:"md-datepicker-panel md-datepicker-calendar",class:e.calendarClasses,attrs:{tag:"div",name:"md-datepicker-month"}},e._l([e.currentDate],(function(t){return n("div",{key:t.getMonth(),staticClass:"md-datepicker-panel md-datepicker-month"},[n("md-button",{staticClass:"md-dense md-datepicker-month-trigger",on:{click:function(t){e.currentView="month"}}},[e._v(e._s(e.currentMonthName)+" "+e._s(e.currentYear))]),e._v(" "),n("div",{staticClass:"md-datepicker-week"},[e._l(e.locale.shorterDays,(function(t,i){return i>=e.firstDayOfAWeek?n("span",{key:i},[e._v(e._s(t))]):e._e()})),e._v(" "),e._l(e.locale.shorterDays,(function(t,i){return i<e.firstDayOfAWeek?n("span",{key:i},[e._v(e._s(t))]):e._e()}))],2),e._v(" "),n("div",{staticClass:"md-datepicker-days"},[e._l(e.prefixEmptyDays,(function(e){return n("span",{key:"day-empty-"+e,staticClass:"md-datepicker-empty"})})),e._v(" "),e._l(e.daysInMonth,(function(t){return n("div",{key:"day-"+t,staticClass:"md-datepicker-day"},[n("span",{staticClass:"md-datepicker-day-button",class:{"md-datepicker-selected":e.isSelectedDay(t),"md-datepicker-today":e.isToday(t),"md-datepicker-disabled":e.isDisabled(t)},on:{click:function(n){e.selectDate(t)}}},[e._v(e._s(t))])])}))],2)],1)}))):"month"===e.currentView?n("div",{staticClass:"md-datepicker-panel md-datepicker-month-selector"},[n("md-button",{staticClass:"md-datepicker-year-trigger",on:{click:function(t){e.currentView="year"}}},[e._v(e._s(e.currentYear))]),e._v(" "),e._l(e.locale.months,(function(t,i){return n("span",{key:t,staticClass:"md-datepicker-month-button",class:{"md-datepicker-selected":e.currentMonthName===t},on:{click:function(t){e.switchMonth(i)}}},[e._v(e._s(t))])}))],2):"year"===e.currentView?n("keep-alive",[n("md-content",{staticClass:"md-datepicker-panel md-datepicker-year-selector md-scrollbar"},e._l(e.availableYears,(function(t){return n("span",{key:t,staticClass:"md-datepicker-year-button",class:{"md-datepicker-selected":e.currentYear===t},on:{click:function(n){e.switchYear(t)}}},[e._v(e._s(t))])})))],1):e._e()],1)],1),e._v(" "),n("md-dialog-actions",{staticClass:"md-datepicker-body-footer"},[n("md-button",{staticClass:"md-primary",on:{click:e.onCancel}},[e._v("Cancel")]),e._v(" "),e.mdImmediately?e._e():n("md-button",{staticClass:"md-primary",on:{click:e.onConfirm}},[e._v("Ok")])],1)],1)])])],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(145),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(346),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"}}),e._v(" "),n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=void 0;return function(){var i=this,r=arguments,s=function(){return e.apply(i,r)};clearTimeout(n),n=setTimeout(s,t)}}}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-field",{class:["md-datepicker",{"md-native":!this.mdOverrideNative}],attrs:{"md-clearable":""}},[n("md-date-icon",{staticClass:"md-date-icon",nativeOn:{click:function(t){e.toggleDialog(t)}}}),e._v(" "),n("md-input",{ref:"input",attrs:{type:e.type,value:e.modelDate,pattern:"[0-9]{4}-[0-9]{2}-[0-9]{2}"},on:{input:e.onInput},nativeOn:{focus:function(t){e.onFocus(t)}}}),e._v(" "),e._t("default"),e._v(" "),n("keep-alive",[e.showDialog?n("md-datepicker-dialog",{attrs:{"md-date":e.selectedDate,"md-disabled-dates":e.mdDisabledDates,mdImmediately:e.mdImmediately},on:{"update:mdDate":function(t){e.selectedDate=t},"md-closed":e.toggleDialog}}):e._e()],1),e._v(" "),n("md-overlay",{staticClass:"md-datepicker-overlay",attrs:{"md-fixed":"","md-active":e.showDialog},on:{click:e.toggleDialog}})],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(63),o=i(a),u=n(350),l=i(u),d=n(353),c=i(d),f=n(356),m=i(f),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default),e.component(m.default.name,m.default)}}),(function(e,t,n){"use strict";function i(e){n(351)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(146),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(352),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("span",{staticClass:"md-dialog-title md-title"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(354)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(147),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(355),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-dialog-content"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(357)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(148),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(358),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-dialog-actions"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(360),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(361)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(149),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(362),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.insideList?n("li",{staticClass:"md-divider",class:[e.$mdActiveTheme]}):n("hr",{staticClass:"md-divider",class:[e.$mdActiveTheme]})},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(364),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(365)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(150),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(366),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-drawer",class:[e.$mdActiveTheme,e.drawerClasses]},[e._t("default"),e._v(" "),e.mdFixed?n("md-overlay",{attrs:{"md-active":e.mdActive},on:{click:e.closeDrawer}}):n("md-overlay",{attrs:{"md-active":e.mdActive,"md-attach-to-parent":""},on:{click:e.closeDrawer}})],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(368),t.default=function(e){}}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(100),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(101),o=i(a),u=n(371),l=i(u),d=n(59),c=i(d),f=n(383),m=i(f),h=n(50),p=i(h),v=n(388),b=i(v),t.default=function(e){(0,s.default)(e),e.use(o.default),e.use(l.default),e.component(c.default.name,c.default),e.component(m.default.name,m.default),e.component(p.default.name,p.default),e.component(b.default.name,b.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(372),o=i(a),u=n(377),l=i(u),d=n(380),c=i(d),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default)}}),(function(e,t,n){"use strict";function i(e){n(373)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(153),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(376),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(154),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(375),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M7 10l5 5 5-5z"}}),e._v(" "),n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-menu",{staticClass:"md-select",class:{"md-disabled":e.disabled},attrs:{"md-close-on-select":!1,"md-active":e.showSelect,"md-offset-x":e.offset.x,"md-offset-y":e.offset.y,"md-dense":e.mdDense},on:{"update:mdActive":function(t){e.showSelect=t},"md-closed":e.onClose}},[n("md-input",e._g(e._b({ref:"input",staticClass:"md-input md-select-value",attrs:{readonly:"",disabled:e.disabled,required:e.required,placeholder:e.placeholder},on:{focus:function(t){t.preventDefault(),e.onFocus(t)},blur:function(t){t.preventDefault(),e.removeHighlight(t)},click:e.openSelect,keydown:[function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key))return null;e.openSelect(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.openSelect(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"space",32,t.key))return null;e.openSelect(t)}]},model:{value:e.MdSelect.label,callback:function(t){e.$set(e.MdSelect,"label",t)},expression:"MdSelect.label"}},"md-input",e.attrs,!1),e.inputListeners)),e._v(" "),n("md-drop-down-icon",{nativeOn:{click:function(t){e.openSelect(t)}}}),e._v(" "),n("keep-alive",[n("md-menu-content",{ref:"menu",staticClass:"md-select-menu",style:e.menuStyles,attrs:{"md-content-class":e.mdClass},on:{enter:e.onMenuEnter}},[e.showSelect?e._t("default"):e._e()],2)],1),e._v(" "),e.showSelect?e._e():n("div",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}]},[e._t("default")],2),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"md-input-fake",attrs:{disabled:e.disabled,readonly:"",tabindex:"-1"},domProps:{value:e.model},on:{input:function(t){t.target.composing||(e.model=t.target.value)}}}),e._v(" "),n("select",e._b({directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],attrs:{readonly:"",tabindex:"-1"},on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.model=t.target.multiple?n:n[0]}}},"select",e.attributes,!1))],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(378)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(159),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(379),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-menu-item",{class:e.optionClasses,attrs:{disabled:e.isDisabled},on:{click:e.setSelection}},[e.MdSelect.multiple?n("md-checkbox",{staticClass:"md-primary",attrs:{disabled:e.isDisabled},model:{value:e.isChecked,callback:function(t){e.isChecked=t},expression:"isChecked"}}):e._e(),e._v(" "),n("span",{ref:"text",staticClass:"md-list-item-text"},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(381)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(160),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(382),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-optgroup"},[n("md-subheader",[e._v(e._s(e.label))]),e._v(" "),e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(384)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(161),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(387),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(162),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(386),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"}}),e._v(" "),n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-file"},[n("md-file-icon",{nativeOn:{click:function(t){e.openPicker(t)}}}),e._v(" "),n("input",e._b({directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"md-input",attrs:{readonly:""},domProps:{value:e.model},on:{focus:e.openPicker,blur:e.onBlur,input:function(t){t.target.composing||(e.model=t.target.value)}}},"input",{disabled:e.disabled,required:e.required,placeholder:e.placeholder},!1)),e._v(" "),n("input",e._g(e._b({ref:"inputFile",attrs:{type:"file"},on:{change:e.onChange}},"input",e.attributes,!1),e.$listeners))],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(163),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(389),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("textarea",e._g(e._b({directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"md-textarea",style:e.textareaStyles,domProps:{value:e.model},on:{focus:e.onFocus,blur:e.onBlur,input:function(t){t.target.composing||(e.model=t.target.value)}}},"textarea",e.attributes,!1),e.listeners))},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(391),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(392)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(164),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(0),u=null,l=!1,d=i,c=null,f=null,m=o(s.a,u,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(394),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(395)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(165),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(396),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-image",class:[e.$mdActiveTheme]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(398),t.default=function(e){}}),(function(e,t){}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(69),o=i(a),u=n(104),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(102),o=i(a),u=n(103),l=i(u),d=n(401),c=i(d),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default)}}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(182),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(402),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-list-item",e._g(e._b({staticClass:"md-menu-item",class:[e.itemClasses,e.$mdActiveTheme],attrs:{disabled:e.disabled,tabindex:e.highlighted&&-1}},"md-list-item",e.$attrs,!1),e.listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(404),o=i(a),u=n(407),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){n(405)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(183),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(406),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"md-progress-bar",appear:""}},[n("div",{staticClass:"md-progress-bar",class:[e.progressClasses,e.$mdActiveTheme]},[n("div",{staticClass:"md-progress-bar-track",style:e.progressTrackStyle}),e._v(" "),n("div",{staticClass:"md-progress-bar-fill",style:e.progressValueStyle}),e._v(" "),n("div",{staticClass:"md-progress-bar-buffer",attrs:{Style:e.progressBufferStyle}})])])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(408)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(184),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(410),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default="\n  @keyframes md-progress-spinner-stroke-rotate-DIAMETER {\n    0% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotate(0);\n    }\n\n    12.5% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotate(0);\n    }\n\n    12.51% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotateX(180deg) rotate(72.5deg);\n    }\n\n    25% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotateX(180deg) rotate(72.5deg);\n    }\n\n    25.1% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotate(270deg);\n    }\n\n    37.5% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotate(270deg);\n    }\n\n    37.51% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotateX(180deg) rotate(161.5deg);\n    }\n\n    50% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotateX(180deg) rotate(161.5deg);\n    }\n\n    50.01% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotate(180deg);\n    }\n\n    62.5% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotate(180deg);\n    }\n\n    62.51% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotateX(180deg) rotate(251.5deg);\n    }\n\n    75% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotateX(180deg) rotate(251.5deg);\n    }\n\n    75.01% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotate(90deg);\n    }\n\n    87.5% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotate(90deg);\n    }\n\n    87.51% {\n      stroke-dashoffset: END_VALUE;\n      transform: rotateX(180deg) rotate(341.5deg);\n    }\n\n    100% {\n      stroke-dashoffset: START_VALUE;\n      transform: rotateX(180deg) rotate(341.5deg);\n    }\n  }\n"}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"md-progress-spinner",appear:""}},[n("div",{staticClass:"md-progress-spinner",class:[e.progressClasses,e.$mdActiveTheme]},[n("svg",{staticClass:"md-progress-spinner-draw",style:e.svgStyles,attrs:{preserveAspectRatio:"xMidYMid meet",focusable:"false",viewBox:"0 0 "+e.mdDiameter+" "+e.mdDiameter}},[n("circle",{staticClass:"md-progress-spinner-circle",style:e.circleStyles,attrs:{cx:"50%",cy:"50%",r:e.circleRadius}})])])])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(412),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(413)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(185),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(414),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-radio",class:[e.$mdActiveTheme,e.radioClasses]},[n("div",{staticClass:"md-radio-container",on:{click:function(t){t.stopPropagation(),e.toggleCheck(t)}}},[n("md-ripple",{attrs:{"md-centered":"","md-active":e.rippleActive,"md-disabled":e.disabled},on:{"update:mdActive":function(t){e.rippleActive=t}}},[n("input",e._b({attrs:{type:"radio"}},"input",{id:e.id,name:e.name,disabled:e.disabled,required:e.required,value:e.value},!1))])],1),e._v(" "),e.$slots.default?n("label",{staticClass:"md-radio-label",attrs:{for:e.id},on:{click:function(t){t.preventDefault(),e.toggleCheck(t)}}},[e._t("default")],2):e._e()])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(16),o=i(a),u=n(21),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(417),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(418)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(186),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(422),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(187),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(420),o=n(0),u=!0,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(e,t){var n=t._c;return n("transition",{attrs:{name:"md-snackbar",appear:""}},[n("div",{staticClass:"md-snackbar",class:t.props.mdClasses},[n("div",{staticClass:"md-snackbar-content"},[t._t("default")],2)])])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e,t,n){return new Promise(function(i){r={destroy:function(){r=null,i()}},e!==1/0&&(s=window.setTimeout((function(){a(),t||n._vnode.componentInstance.initDestroy(!0)}),e))})}var r,s,a;Object.defineProperty(t,"__esModule",{value:!0}),r=null,s=null,a=t.destroySnackbar=function(){return new Promise(function(e){r?(window.clearTimeout(s),r.destroy(),window.setTimeout(e,400)):e()})},t.createSnackbar=function(e,t){return r?a().then((function(){return i(e,t)})):i(e,t)}}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.mdPersistent&&e.mdDuration!==1/0?n("md-portal",[n("keep-alive",[e.mdActive?n("md-snackbar-content",{attrs:{"md-classes":[e.snackbarClasses,e.$mdActiveTheme]}},[e._t("default")],2):e._e()],1)],1):n("md-portal",[e.mdActive?n("md-snackbar-content",{attrs:{"md-classes":[e.snackbarClasses,e.$mdActiveTheme]}},[e._t("default")],2):e._e()],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(424),o=i(a),u=n(427),l=i(u),d=n(430),c=i(d),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default)}}),(function(e,t,n){"use strict";function i(e){n(425)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(188),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(426),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-speed-dial",class:[e.$mdActiveTheme,e.speedDialClasses]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(428)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(189),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(429),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-button",e._g(e._b({staticClass:"md-speed-dial-target md-fab",on:{click:e.handleClick}},"md-button",e.$attrs,!1),e.$listeners),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(431)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(190),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(432),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"md-speed-dial-content"},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(434),o=i(a),u=n(444),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){n(435)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(191),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(443),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(194),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(437),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}}),e._v(" "),n("path",{attrs:{d:"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(195),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(439),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}}),e._v(" "),n("path",{attrs:{d:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(196),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(441),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"}}),e._v(" "),n("path",{attrs:{d:"M0 0h24v24H0z",fill:"none"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-button",e._g(e._b({staticClass:"md-stepper-header",class:e.classes,attrs:{disabled:e.shouldDisable},nativeOn:{click:function(t){e.MdSteppers.setActiveStep(e.index)}}},"md-button",e.data.props,!1),e.data.events),[e.data.error?n("md-warning-icon",{staticClass:"md-stepper-icon"}):n("div",{staticClass:"md-stepper-number"},[e.data.done&&e.data.editable?n("md-edit-icon",{staticClass:"md-stepper-editable"}):e.data.done?n("md-check-icon",{staticClass:"md-stepper-done"}):[e._v(e._s(e.MdSteppers.getStepperNumber(e.index)))]],2),e._v(" "),n("div",{staticClass:"md-stepper-text"},[n("span",{staticClass:"md-stepper-label"},[e._v(e._s(e.data.label))]),e._v(" "),e.data.error?n("span",{staticClass:"md-stepper-error"},[e._v(e._s(e.data.error))]):e.data.description?n("span",{staticClass:"md-stepper-description"},[e._v(e._s(e.data.description))]):e._e()])],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-steppers",class:[e.steppersClasses,e.$mdActiveTheme]},[e.mdVertical?e._e():n("div",{staticClass:"md-steppers-navigation"},e._l(e.MdSteppers.items,(function(e,t){return n("md-step-header",{key:t,attrs:{index:t}})}))),e._v(" "),n("div",{staticClass:"md-steppers-wrapper",style:e.contentStyles},[n("div",{staticClass:"md-steppers-container",style:e.containerStyles},[e._t("default")],2)])])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(445)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(197),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(446),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-stepper"},[e.MdSteppers.isVertical?n("md-step-header",{attrs:{index:e.id}}):e._e(),e._v(" "),n("div",{staticClass:"md-stepper-content",class:{"md-active":e.id===e.MdSteppers.activeStep}},[e._t("default")],2)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(448),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(449)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(198),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(450),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.insideList?n("li",{staticClass:"md-subheader",class:[e.$mdActiveTheme]},[e._t("default")],2):n("div",{staticClass:"md-subheader",class:[e.$mdActiveTheme]},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(452),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(453)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(199),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(454),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-switch",class:[e.$mdActiveTheme,e.checkClasses]},[n("div",{staticClass:"md-switch-container",on:{click:function(t){t.stopPropagation(),e.toggleCheck(t)}}},[n("div",{staticClass:"md-switch-thumb"},[n("md-ripple",{attrs:{"md-centered":"","md-active":e.rippleActive,"md-disabled":e.disabled},on:{"update:mdActive":function(t){e.rippleActive=t}}},[n("input",e._b({attrs:{id:e.id,type:"checkbox"}},"input",{id:e.id,name:e.name,disabled:e.disabled,required:e.required,value:e.value},!1))])],1)]),e._v(" "),e.$slots.default?n("label",{staticClass:"md-switch-label",attrs:{for:e.id},on:{click:function(t){t.preventDefault(),e.toggleCheck(t)}}},[e._t("default")],2):e._e()])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b,g,_;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(456),o=i(a),u=n(477),l=i(u),d=n(480),c=i(d),f=n(207),m=i(f),h=n(97),p=i(h),v=n(483),b=i(v),g=n(486),_=i(g),t.default=function(e){(0,s.default)(e),e.component("MdTable",o.default),e.component(l.default.name,l.default),e.component(c.default.name,c.default),e.component(m.default.name,m.default),e.component(p.default.name,p.default),e.component(b.default.name,b.default),e.component(_.default.name,_.default)}}),(function(e,t,n){"use strict";function i(e,t){function n(e){var t=e.componentOptions;return t&&t.tag}var i=["md-table-toolbar","md-table-empty-state","md-table-pagination"],r=Array.from(e),s={};return r.forEach((function(e,t){if(e&&e.tag){var a=n(e);a&&i.includes(a)&&(e.data.slot=a,e.data.attrs=e.data.attrs||{},s[a]=function(){return e},r.splice(t,1))}})),{childNodes:r,slots:s}}var r,s,a;Object.defineProperty(t,"__esModule",{value:!0}),r=Object.assign||function(e){var t,n,i;for(t=1;t<arguments.length;t++){n=arguments[t];for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n(457),a=(function(e){return e&&e.__esModule?e:{default:e}})(s),t.default={name:"MdTableContainer",functional:!0,render:function(e,t){var n,s,o,u=t.data,l=t.props,d=t.children,c=[],f=u.scopedSlots;return d&&(n=i(d,e),s=n.childNodes,o=n.slots,c=s,f=r({},f,o)),e(a.default,r({},u,{props:l,scopedSlots:f}),[c])}}}),(function(e,t,n){"use strict";function i(e){n(458)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(200),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(476),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(201),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(0),o=null,u=!1,l=null,d=null,c=null,f=a(r.a,o,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(202),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(467),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(204),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(463),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-icon",{staticClass:"md-icon-image"},[n("svg",{attrs:{height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"}},[n("path",{attrs:{d:"M0 0h24v24H0V0z",fill:"none"}}),e._v(" "),n("path",{attrs:{d:"M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"}})])])}],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("th",{staticClass:"md-table-head",class:e.headClasses,style:e.headStyles,attrs:{id:e.id},on:{click:e.changeSort}},[e.$slots.default?n("div",{staticClass:"md-table-head-container"},[n("div",{staticClass:"md-table-head-label"},[e._t("default")],2)]):n("md-ripple",{staticClass:"md-table-head-container",attrs:{"md-disabled":!e.hasSort}},[n("div",{staticClass:"md-table-head-label"},[e.hasSort?n("md-upward-icon",{staticClass:"md-table-sortable-icon"},[e._v("arrow_upward")]):e._e(),e._v("\n\n      "+e._s(e.label)+"\n\n      "),e.tooltip?n("md-tooltip",[e._v(e._s(e.tooltip))]):e._e()],1)])],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(205),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(466),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.selectableCount?n("md-table-head",{staticClass:"md-table-cell-selection"},[n("div",{staticClass:"md-table-cell-container"},[n("md-checkbox",{attrs:{model:e.allSelected,disabled:e.isDisabled},on:{change:e.onChange}})],1)]):e._e()},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("thead",[n("tr",[n("md-table-head-selection"),e._v(" "),e._l(e.MdTable.items,(function(t,i){return n("md-table-head",e._b({key:i},"md-table-head",t,!1))}))],2)])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(469)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(206),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(470),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"md-table-alternate-header"}},[n("div",{staticClass:"md-table-alternate-header"},[e._t("default")],2)])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t){}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.mdSelectable?n("td",{staticClass:"md-table-cell md-table-cell-selection"},[n("div",{staticClass:"md-table-cell-container"},[n("md-checkbox",{attrs:{disabled:!e.mdSelectable||e.mdDisabled},on:{change:e.onChange},model:{value:e.isSelected,callback:function(t){e.isSelected=t},expression:"isSelected"}})],1)]):e._e()},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("tr",e._g({staticClass:"md-table-row",class:e.rowClasses,on:{click:e.onClick}},e.$listeners),[e.selectableCount?n("md-table-cell-selection",{attrs:{value:e.isMultipleSelected,"md-disabled":e.mdDisabled,"md-selectable":"multiple"===e.mdSelectable,"md-row-id":e.mdIndex},on:{input:function(t){return t?e.addSelection():e.removeSelection()}}}):e._e(),e._v(" "),e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(211),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(0),o=null,u=!1,l=null,d=null,c=null,f=a(r.a,o,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-tag-switcher",{staticClass:"md-table",attrs:{"md-tag":e.contentTag}},[e._t("md-table-toolbar"),e._v(" "),n("keep-alive",[e.$scopedSlots["md-table-alternate-header"]&&e.selectedCount?n("md-table-alternate-header",[e._t("md-table-alternate-header",null,{count:e.selectedCount})],2):e._e()],1),e._v(" "),e.mdFixedHeader?n("div",{staticClass:"md-table-fixed-header",class:e.headerClasses,style:e.headerStyles},[n("div",{ref:"fixedHeaderContainer",staticClass:"md-table-fixed-header-container",on:{scroll:e.setHeaderScroll}},[n("table",{style:e.fixedHeaderTableStyles},[n("md-table-thead")],1)])]):e._e(),e._v(" "),n("md-content",{staticClass:"md-table-content md-scrollbar",class:e.contentClasses,style:e.contentStyles,on:{scroll:e.setScroll}},[n("table",{ref:"contentTable"},[!e.mdFixedHeader&&e.$scopedSlots["md-table-row"]?n("md-table-thead",{class:e.headerClasses}):e._e(),e._v(" "),e.$scopedSlots["md-table-row"]?e.value.length?n("tbody",e._l(e.value,(function(t,i){return n("md-table-row-ghost",{key:e.getRowId(t,e.mdModelId),attrs:{"md-id":e.getRowId(t,e.mdModelId),"md-index":i,"md-item":t}},[e._t("md-table-row",null,{item:t})],2)}))):e.$scopedSlots["md-table-empty-state"]?n("tbody",[n("tr",[n("td",{attrs:{colspan:e.headerCount}},[e._t("md-table-empty-state")],2)])]):e._e():n("tbody",[e._t("default")],2)],1),e._v(" "),e._t("md-table-pagination")],2),e._v(" "),!e.hasValue&&e.$scopedSlots["md-table-row"]?e._t("default"):e._e()],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(478)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(212),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(479),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-toolbar",{staticClass:"md-table-toolbar md-transparent",attrs:{"md-elevation":0}},[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(481)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(215),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(482),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;return(e._self._c||t)("md-empty-state",e._b({staticClass:"md-table-empty-state"},"md-empty-state",e.$props,!1),[e._t("default")],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(484)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(216),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(485),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("td",{staticClass:"md-table-cell",class:e.cellClasses},[n("div",{staticClass:"md-table-cell-container"},[e._t("default")],2)])},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){n(487)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(217),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(488),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-table-pagination"},[!1!==e.mdPageOptions?[n("span",{staticClass:"md-table-pagination-label"},[e._v(e._s(e.mdLabel))]),e._v(" "),n("md-field",[n("md-select",{attrs:{"md-dense":"","md-class":"md-pagination-select"},on:{changed:e.setPageSize},model:{value:e.currentPageSize,callback:function(t){e.currentPageSize=t},expression:"currentPageSize"}},e._l(e.mdPageOptions,(function(t){return n("md-option",{key:t,attrs:{value:t}},[e._v(e._s(t))])})))],1)]:e._e(),e._v(" "),n("span",[e._v(e._s(e.currentItemCount)+"-"+e._s(e.currentPageCount)+" "+e._s(e.mdSeparator)+" "+e._s(e.mdTotal))]),e._v(" "),n("md-button",{staticClass:"md-icon-button md-table-pagination-previous",attrs:{disabled:1===e.mdPage},on:{click:function(t){e.goToPrevious()}}},[n("md-icon",[e._v("keyboard_arrow_left")])],1),e._v(" "),n("md-button",{staticClass:"md-icon-button md-table-pagination-next",on:{click:function(t){e.goToNext()}}},[n("md-icon",[e._v("keyboard_arrow_right")])],1)],2)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(490),o=i(a),u=n(493),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";function i(e){n(491)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(218),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(492),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"md-tabs",class:[e.tabsClasses,e.$mdActiveTheme]},[n("div",{ref:"navigation",staticClass:"md-tabs-navigation",class:e.navigationClasses},[e._l(e.MdTabs.items,(function(t,i){var r=t.label,s=t.props,a=t.icon,o=t.disabled,u=t.data,l=t.events;return n("md-button",e._g(e._b({key:i,class:{"md-active":i===e.activeTab,"md-icon-label":a&&r},attrs:{disabled:o},nativeOn:{click:function(t){e.setActiveTab(i)}}},"md-button",s,!1),l),[e.$scopedSlots["md-tab"]?e._t("md-tab",null,{tab:{label:r,icon:a,data:u}}):[a?[e.isAssetIcon(a)?n("md-icon",{staticClass:"md-tab-icon",attrs:{"md-src":a}}):n("md-icon",{staticClass:"md-tab-icon"},[e._v(e._s(a))]),e._v(" "),n("span",{staticClass:"md-tab-label"},[e._v(e._s(r))])]:[e._v(e._s(r))]]],2)})),e._v(" "),n("span",{ref:"indicator",staticClass:"md-tabs-indicator",class:e.indicatorClass,style:e.indicatorStyles})],2),e._v(" "),n("md-content",{directives:[{name:"show",rawName:"v-show",value:e.hasContent,expression:"hasContent"}],staticClass:"md-tabs-content",style:e.contentStyles},[n("div",{staticClass:"md-tabs-container",style:e.containerStyles},[e._t("default")],2)])],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(219),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(0),o=null,u=!1,l=null,d=null,c=null,f=a(r.a,o,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(105),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(496),o=i(a),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default)}}),(function(e,t,n){"use strict";function i(e){n(497)}var r,s,a,o,u,l,d,c,f,m;Object.defineProperty(t,"__esModule",{value:!0}),r=n(220),s=n.n(r);for(a in r)"default"!==a&&(function(e){n.d(t,e,(function(){return r[e]}))})(a);o=n(498),u=n(0),l=!1,d=i,c=null,f=null,m=u(s.a,o.a,l,d,c,f),t.default=m.exports}),(function(e,t){}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-popover",{attrs:{"md-settings":e.popperSettings,"md-active":e.shouldRender}},[e.shouldRender?n("transition",{attrs:{name:"md-tooltip"}},[n("div",{staticClass:"md-tooltip",class:[e.tooltipClasses,e.$mdActiveTheme],style:e.tooltipStyles},[e._t("default")],2)]):e._e()],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdDialogAlert",props:{mdTitle:String,mdContent:String,mdConfirmText:{type:String,default:"Ok"}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdDialogConfirm",props:{mdTitle:String,mdContent:String,mdConfirmText:{type:String,default:"Ok"},mdCancelText:{type:String,default:"Cancel"}},methods:{onCancel:function(){this.$emit("md-cancel"),this.$emit("update:mdActive",!1)},onConfirm:function(){this.$emit("md-confirm"),this.$emit("update:mdActive",!1)}}}}),(function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"MdDialogPrompt",props:{value:{},mdTitle:String,mdInputName:String,mdInputId:String,mdInputMaxlength:[String,Number],mdInputPlaceholder:[String,Number],mdContent:String,mdConfirmText:{type:String,default:"Ok"},mdCancelText:{type:String,default:"Cancel"}},data:function(){return{inputValue:null}},watch:{value:function(){this.inputValue=this.value}},methods:{onCancel:function(){this.$emit("md-cancel"),this.$emit("update:mdActive",!1)},onConfirm:function(){this.$emit("input",this.inputValue),this.$emit("md-confirm",this.inputValue),this.$emit("update:mdActive",!1)},setInputFocus:function(){var e=this;window.setTimeout((function(){e.$refs.input.$el.focus()}),50)}},created:function(){this.inputValue=this.value}}}),(function(e,t,n){e.exports=n(503)}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l,d,c,f,m,h,p,v,b,g,_,M,y,S,w,C,x,O,T,P,$,D,A,k,j,E,I,F,R,B,L,H,V,N,z,W,Y,q,U,X,G,K,J,Z,Q,ee,te,ne,ie,re,se,ae,oe,ue,le,de,ce,fe,me,he,pe,ve,be,ge,_e,Me,ye,Se,we,Ce,xe;Object.defineProperty(t,"__esModule",{value:!0}),t.MdTooltip=t.MdToolbar=t.MdTabs=t.MdTable=t.MdSwitch=t.MdSubheader=t.MdSteppers=t.MdSpeedDial=t.MdSnackbar=t.MdRipple=t.MdRadio=t.MdProgress=t.MdMenu=t.MdList=t.MdLayout=t.MdImage=t.MdIcon=t.MdHighlightText=t.MdField=t.MdEmptyState=t.MdElevation=t.MdDrawer=t.MdDivider=t.MdDialogPrompt=t.MdDialogConfirm=t.MdDialogAlert=t.MdDialog=t.MdDatepicker=t.MdContent=t.MdChips=t.MdCheckbox=t.MdCard=t.MdButton=t.MdBottomBar=t.MdAvatar=t.MdAutocomplete=t.MdApp=t.MdBadge=void 0,r=n(221),s=i(r),a=n(240),o=i(a),u=n(247),l=i(u),d=n(253),c=i(d),f=n(257),m=i(f),h=n(263),p=i(h),v=n(264),b=i(v),g=n(299),_=i(g),M=n(303),y=i(M),S=n(310),w=i(S),C=n(311),x=i(C),O=n(349),T=i(O),P=n(504),$=i(P),D=n(507),A=i(D),k=n(510),j=i(k),E=n(359),I=i(E),F=n(363),R=i(F),B=n(367),L=i(B),H=n(369),V=i(H),N=n(370),z=i(N),W=n(390),Y=i(W),q=n(101),U=i(q),X=n(393),G=i(X),K=n(397),J=i(K),Z=n(399),Q=i(Z),ee=n(400),te=i(ee),ne=n(403),ie=i(ne),re=n(411),se=i(re),ae=n(415),oe=i(ae),ue=n(416),le=i(ue),de=n(423),ce=i(de),fe=n(433),me=i(fe),he=n(447),pe=i(he),ve=n(451),be=i(ve),ge=n(455),_e=i(ge),Me=n(489),ye=i(Me),Se=n(494),we=i(Se),Ce=n(495),xe=i(Ce),t.MdBadge=o.default,t.MdApp=s.default,t.MdAutocomplete=l.default,t.MdAvatar=c.default,t.MdBottomBar=m.default,t.MdButton=p.default,t.MdCard=b.default,t.MdCheckbox=_.default,t.MdChips=y.default,t.MdContent=w.default,t.MdDatepicker=x.default,t.MdDialog=T.default,t.MdDialogAlert=$.default,t.MdDialogConfirm=A.default,t.MdDialogPrompt=j.default,t.MdDivider=I.default,t.MdDrawer=R.default,t.MdElevation=L.default,t.MdEmptyState=V.default,t.MdField=z.default,t.MdHighlightText=Y.default,t.MdIcon=U.default,t.MdImage=G.default,t.MdLayout=J.default,t.MdList=Q.default,t.MdMenu=te.default,t.MdProgress=ie.default,t.MdRadio=se.default,t.MdRipple=oe.default,t.MdSnackbar=le.default,t.MdSpeedDial=ce.default,t.MdSteppers=me.default,t.MdSubheader=pe.default,t.MdSwitch=be.default,t.MdTable=_e.default,t.MdTabs=ye.default,t.MdToolbar=we.default,t.MdTooltip=xe.default}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(63),o=i(a),u=n(505),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(499),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(506),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-dialog",e._g(e._b({attrs:{"md-fullscreen":!1}},"md-dialog",e.$attrs,!1),e.$listeners),[e.mdTitle?n("md-dialog-title",[e._v(e._s(e.mdTitle))]):e._e(),e._v(" "),e.mdContent?n("md-dialog-content",{domProps:{innerHTML:e._s(e.mdContent)}}):e._e(),e._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(t){e.$emit("update:mdActive",!1)}}},[e._v(e._s(e.mdConfirmText))])],1)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(63),o=i(a),u=n(508),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(500),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(509),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-dialog",e._g(e._b({attrs:{"md-fullscreen":!1}},"md-dialog",e.$attrs,!1),e.$listeners),[e.mdTitle?n("md-dialog-title",[e._v(e._s(e.mdTitle))]):e._e(),e._v(" "),e.mdContent?n("md-dialog-content",{domProps:{innerHTML:e._s(e.mdContent)}}):e._e(),e._v(" "),n("md-dialog-actions",[n("md-button",{on:{click:e.onCancel}},[e._v(e._s(e.mdCancelText))]),e._v(" "),n("md-button",{staticClass:"md-primary",on:{click:e.onConfirm}},[e._v(e._s(e.mdConfirmText))])],1)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s}),(function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}var r,s,a,o,u,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),s=i(r),a=n(63),o=i(a),u=n(511),l=i(u),t.default=function(e){(0,s.default)(e),e.component(o.default.name,o.default),e.component(l.default.name,l.default)}}),(function(e,t,n){"use strict";var i,r,s,a,o,u,l,d,c,f;Object.defineProperty(t,"__esModule",{value:!0}),i=n(501),r=n.n(i);for(s in i)"default"!==s&&(function(e){n.d(t,e,(function(){return i[e]}))})(s);a=n(512),o=n(0),u=!1,l=null,d=null,c=null,f=o(r.a,a.a,u,l,d,c),t.default=f.exports}),(function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-dialog",e._b({attrs:{"md-fullscreen":!1},on:{"md-opened":e.setInputFocus}},"md-dialog",e.$attrs,!1),[e.mdTitle?n("md-dialog-title",[e._v(e._s(e.mdTitle))]):e._e(),e._v(" "),e.mdContent?n("md-dialog-content",{domProps:{innerHTML:e._s(e.mdContent)}}):e._e(),e._v(" "),n("md-dialog-content",[n("md-field",[n("md-input",{ref:"input",attrs:{id:e.mdInputId,name:e.mdInputName,maxlength:e.mdInputMaxlength,placeholder:e.mdInputPlaceholder},nativeOn:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.onConfirm(t)}},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}})],1)],1),e._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:e.onCancel}},[e._v(e._s(e.mdCancelText))]),e._v(" "),n("md-button",{staticClass:"md-primary",on:{click:e.onConfirm}},[e._v(e._s(e.mdConfirmText))])],1)],1)},r=[],s={render:i,staticRenderFns:r};t.a=s})])}));

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);
var bind = __webpack_require__(12);
var Axios = __webpack_require__(26);
var defaults = __webpack_require__(5);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(16);
axios.CancelToken = __webpack_require__(40);
axios.isCancel = __webpack_require__(15);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(41);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(5);
var utils = __webpack_require__(3);
var InterceptorManager = __webpack_require__(35);
var dispatchRequest = __webpack_require__(36);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(14);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);
var transformData = __webpack_require__(37);
var isCancel = __webpack_require__(15);
var defaults = __webpack_require__(5);
var isAbsoluteURL = __webpack_require__(38);
var combineURLs = __webpack_require__(39);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(16);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_views_Home__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_views_Home___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_views_Home__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_views_Join__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_views_Join___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_views_Join__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_views_Register__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_views_Register___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_views_Register__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_views_Login__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_views_Login___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_views_Login__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_views_Dashboard__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_views_Dashboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_views_Dashboard__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_views_Detail__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_views_Detail___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_views_Detail__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_views_Category__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_views_Category___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_views_Category__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_views_Try__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_views_Try___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_views_Try__);











var routes = [{
    path: '/',
    component: __WEBPACK_IMPORTED_MODULE_1__components_views_Home___default.a,
    meta: {
        title: "Greenify - Home",
        metaTags: [{ name: "description", content: "De overzicht pagina voor Greenify" }, { property: "og:description", content: "De overzicht pagina voor Greenify" }]
    }
},
// {
//     path: '/doe-mee',
//     component: Join,
//     name: 'join'
// },
// {
//     path: '/registreren',
//     component: Register,
//     name: 'register',
//     meta: {
//         title: "Registreren",
//         metaTags: [
//             { name: "description", content: "De registrate pagina voor Greenify" }
//         ]
//     }
// },
{
    path: '/login',
    component: __WEBPACK_IMPORTED_MODULE_4__components_views_Login___default.a,
    name: 'login',
    meta: {
        title: "Inloggen",
        metaTags: [{ name: "description", content: "De login pagina voor Greenify" }, { property: "og:description", content: "De login pagina voor Greenify" }]
    }
}, {
    path: '/registreren',
    component: __WEBPACK_IMPORTED_MODULE_3__components_views_Register___default.a,
    name: 'Registreren',
    meta: {
        title: "Registreren",
        metaTags: [{ name: "description", content: "De login pagina voor Greenify" }, { property: "og:description", content: "De login pagina voor Greenify" }]
    }
}, {
    path: '/dashboard',
    component: __WEBPACK_IMPORTED_MODULE_5__components_views_Dashboard___default.a,
    name: 'dashboard',
    meta: {
        title: "Gebruiker overzicht",
        metaTags: [{ name: "description", content: "De gebruiker overzicht pagina voor Greenify" }, { property: "og:description", content: "De gebruiker overzicht pagina voor Greenify" }]
    }
}, {
    path: '/try',
    component: __WEBPACK_IMPORTED_MODULE_8__components_views_Try___default.a,
    name: 'try'
}, {
    path: '/:category_slug',
    component: __WEBPACK_IMPORTED_MODULE_7__components_views_Category___default.a,
    name: 'category',
    props: true
}, {
    //path: '/:category_slug/:company-slug',
    path: '/detail',
    component: __WEBPACK_IMPORTED_MODULE_6__components_views_Detail___default.a,
    name: 'detail',
    props: true
}];

var router = new __WEBPACK_IMPORTED_MODULE_0_vue_router__["a" /* default */]({
    routes: routes
    // mode: 'history'
});

// This callback runs before every route change, including on page load.
router.beforeEach(function (to, from, next) {
    // This goes through the matched routes from last to first, finding the closest route with a title.
    // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
    var nearestWithTitle = to.matched.slice().reverse().find(function (r) {
        return r.meta && r.meta.title;
    });

    // Find the nearest route element with meta tags.
    var nearestWithMeta = to.matched.slice().reverse().find(function (r) {
        return r.meta && r.meta.metaTags;
    });
    var previousNearestWithMeta = from.matched.slice().reverse().find(function (r) {
        return r.meta && r.meta.metaTags;
    });

    // If a route with a title was found, set the document (page) title to that value.
    if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

    // Remove any stale meta tags from the document using the key attribute we set below.
    Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(function (el) {
        return el.parentNode.removeChild(el);
    });

    // Skip rendering meta tags if there are none.
    if (!nearestWithMeta) return next();

    // Turn the meta tag definitions into actual elements in the head.
    nearestWithMeta.meta.metaTags.map(function (tagDef) {
        var tag = document.createElement('meta');

        Object.keys(tagDef).forEach(function (key) {
            tag.setAttribute(key, tagDef[key]);
        });

        // We use this to track which meta tags we create, so we don't interfere with other ones.
        tag.setAttribute('data-vue-router-controlled', '');

        return tag;
    })
    // Add the meta tags to the document head.
    .forEach(function (tag) {
        return document.head.appendChild(tag);
    });

    next();
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(44)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(47)
/* template */
var __vue_template__ = __webpack_require__(48)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-59b256ea"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-59b256ea", Component.options)
  } else {
    hotAPI.reload("data-v-59b256ea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("76b545aa", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59b256ea\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Home.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59b256ea\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "Home"
});

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { "bottom-color": "#4caf50" } }, [
    _c(
      "div",
      { attrs: { slot: "content" }, slot: "content" },
      [
        _c("h1", { staticClass: "blue-grey-text text-darken-4" }, [
          _vm._v("\n            Hoi, "),
          _c("br"),
          _vm._v(" "),
          _c("span", { staticClass: "green-text" }, [_vm._v("Welkom!")])
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "blue-grey-text text-darken-3" }, [
          _vm._v(
            "\n            In Rotterdam barst het van de duurzame initiatieven. Wil jij weten hoe jij\n            Rotterdam een duurzame stad kan maken?\n        "
          )
        ]),
        _vm._v(" "),
        _c(
          "router-link",
          {
            staticClass: "waves-effect waves-light green btn",
            attrs: { to: { name: "dashboard" } }
          },
          [_vm._v("Doe met ons mee!")]
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-59b256ea", module.exports)
  }
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(50)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(52)
/* template */
var __vue_template__ = __webpack_require__(53)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-c6d6c154"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Join.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c6d6c154", Component.options)
  } else {
    hotAPI.reload("data-v-c6d6c154", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0aaac90a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c6d6c154\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Join.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c6d6c154\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Join.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\na[data-v-c6d6c154] {\n  font-size: 1.5em;\n}\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "AboutPage",
    watch: {
        $route: function $route(to, from) {
            console.log('asdasdasd');
            this.$emit('viewChange', {
                color: 'red'
            });
        }
    }
});

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { "bottom-color": "#4caf50" } }, [
    _c("div", { attrs: { slot: "content" }, slot: "content" }, [
      _c(
        "div",
        { staticClass: "row" },
        [
          _c("h1", { staticClass: "blue-grey-text text-darken-4" }, [
            _vm._v("Doe met "),
            _c("br"),
            _vm._v(" "),
            _c("span", { staticClass: "green-text" }, [_vm._v("ons mee!")])
          ]),
          _vm._v(" "),
          _c("router-link", { attrs: { to: { name: "login" } } }, [
            _vm._v("Inloggen!")
          ]),
          _vm._v(" "),
          _c("p", [_vm._v("Of")]),
          _vm._v(" "),
          _c("router-link", { attrs: { to: { name: "register" } } }, [
            _vm._v("Maak een account aan")
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "row" })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c6d6c154", module.exports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(55)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(57)
/* template */
var __vue_template__ = __webpack_require__(58)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1203224f"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1203224f", Component.options)
  } else {
    hotAPI.reload("data-v-1203224f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("051b81f2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1203224f\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Register.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1203224f\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Register.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\nbutton[data-v-1203224f] {\r\n   display:block;\r\n   margin-top: 10px!important; \r\nborder-radius: 12px;\r\n  height:50px;\r\n  width:200px;\r\n  margin:0 auto;\r\n  border:none;\r\n  border-bottom:1px solid darkgrey;\r\n  color:white;\r\n  background-color: #535C68;\r\n  font-size: 20px;\n}\ninput[data-v-1203224f]{\r\n  display:block;\r\n  \r\n  height:50px;\r\n  width:250px;\r\n  margin:0 auto;\r\n  border:none;\r\n  border-bottom:1px solid darkgrey\n}\nh1[data-v-1203224f]{\r\n    text-align: center;\r\n    color: #6AB04C;\r\n    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n}\r\n", ""]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "RegisterPage",
    data: function data() {
        return {
            data: {}
        };
    },

    methods: {
        submit: function submit() {}
    }

});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { bottomColor: "#6AB04C" } }, [
    _c("div", [
      _c("h1", [_vm._v("REGISTRATIE")]),
      _vm._v(" "),
      _c("form", [
        _c("dt", [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.data.email,
                expression: "data.email"
              }
            ],
            attrs: { placeholder: "EMAIL" },
            domProps: { value: _vm.data.email },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.data, "email", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("dt", [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.data.password,
                expression: "data.password"
              }
            ],
            attrs: { placeholder: "WACHTWOORD" },
            domProps: { value: _vm.data.password },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.data, "password", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("dt", [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.data.repeatPassword,
                expression: "data.repeatPassword"
              }
            ],
            attrs: { placeholder: "WACHTWOORD NOG EEN KEERTJE" },
            domProps: { value: _vm.data.repeatPassword },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.data, "repeatPassword", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("dt", [
          _c("button", { staticClass: "register" }, [
            _c("span", [_vm._v("VERZENDEN")])
          ])
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1203224f", module.exports)
  }
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(62)
/* template */
var __vue_template__ = __webpack_require__(80)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-a0ceb926"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a0ceb926", Component.options)
  } else {
    hotAPI.reload("data-v-a0ceb926", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1515ff4b", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a0ceb926\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a0ceb926\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n*[data-v-a0ceb926]{\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\n}\nh4[data-v-a0ceb926]{\r\n    color: white;\r\n    float: left;\r\n    margin-bottom: 5vw;\r\n    font-size: 7vw;\r\n    margin-top: 6vw;\n}\np[data-v-a0ceb926]{\r\n    color: white;\n}\n.block[data-v-a0ceb926]{\r\n    padding-top: 310px;\r\n    padding-bottom: 20px;\n}\n.headBlock[data-v-a0ceb926]{\r\n    height: 20vw;\r\n    width: 90vw;\n}\r\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_NavigationBar__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_NavigationBar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layout_NavigationBar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_HamburgerMenu__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_HamburgerMenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__layout_HamburgerMenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layout_ButtonToApp__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layout_ButtonToApp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__layout_ButtonToApp__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        ButtonToApp: __WEBPACK_IMPORTED_MODULE_2__layout_ButtonToApp___default.a
    },
    data: function data() {
        return {
            link: '#'
        };
    },

    name: "LoginPage"
});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5910b893", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-78715ee5\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./NavigationBar.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-78715ee5\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./NavigationBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.navbar[data-v-78715ee5] {\n  width: 100%;\n  position: relative;\n  height: 3em;\n  background-color: red;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.navbar h2[data-v-78715ee5] {\n    margin: 0;\n    text-align: center;\n}\n.navbar div[data-v-78715ee5] {\n    padding: 1rem;\n    font-size: 1.4rem;\n}\n", ""]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HamburgerMenu__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HamburgerMenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__HamburgerMenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TopMenu__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TopMenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__TopMenu__);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    name: "NavigationBar",
    props: {
        menuTitle: {
            type: String,
            default: 'MENU'
        },
        title: {
            type: String,
            default: ''
        },
        menu: {
            type: Boolean,
            default: true
        },
        back: {
            type: Boolean,
            default: true
        },
        fontColor: {
            type: String,
            default: 'white'
        },
        color: {
            type: String,
            default: 'green'
        },
        navItems: {
            type: Array,
            default: function _default() {
                return [{ text: 'HOME', route: 'home' }, { text: 'MIJN PROFIEL', route: 'user_dashboard' }, { text: "UITLOGGEN", emit: 'logout_user' }];
            }
        }
    },
    components: {
        HamMenu: __WEBPACK_IMPORTED_MODULE_0__HamburgerMenu___default.a,
        TopMenu: __WEBPACK_IMPORTED_MODULE_1__TopMenu___default.a
    },
    data: function data() {
        return {
            navStyle: {
                backgroundColor: this.color,
                color: this.fontColor
            }
        };
    }
});

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6010a84f", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-167c4e0e\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./HamburgerMenu.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-167c4e0e\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./HamburgerMenu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.ham-menu[data-v-167c4e0e] {\n  position: absolute;\n  min-height: 100vh;\n  width: 100%;\n  z-index: 10;\n}\n.ham-menu.hidden[data-v-167c4e0e] {\n    display: none;\n}\n.ham-menu .menu-title[data-v-167c4e0e] {\n    margin: 0;\n    font-size: 3rem;\n}\n.ham-menu .menu-title-box[data-v-167c4e0e] {\n    padding: .5em 1em;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-flow: row wrap;\n            flex-flow: row wrap;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n}\n.ham-menu .menu-title-box span[data-v-167c4e0e] {\n      padding: .35em;\n      font-size: 2rem;\n}\n.menu-items[data-v-167c4e0e] {\n  list-style: none;\n  padding-left: 1em;\n}\n.menu-items .menu-item[data-v-167c4e0e] {\n    margin: 0;\n    padding: .1em 0;\n    font-size: 2.3rem;\n}\n", ""]);

// exports


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "HamburgerMenu",
    props: {
        color: {
            type: String,
            default: 'green'
        },
        title: {
            type: String,
            default: 'Menu'
        },
        items: {
            type: Array
        },
        fontColor: {
            type: String,
            default: 'white'
        }
    },
    data: function data() {
        return {
            bColor: {
                backgroundColor: this.color,
                color: this.fontColor
            },
            state: 'slideOutUp animated faster hidden'
        };
    },

    methods: {
        closeMenu: function closeMenu() {
            this.state = 'slideOutUp animated faster';
        },
        openMenu: function openMenu() {
            this.state = 'slideInDown animated faster';
        }
    }
});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "ham-menu absolute", class: _vm.state, style: _vm.bColor },
    [
      _c("div", { staticClass: "menu-title-box" }, [
        _c("h2", { staticClass: "menu-title" }, [
          _vm._v("\n            " + _vm._s(_vm.title) + "\n        ")
        ]),
        _vm._v(" "),
        _c("span", { on: { click: _vm.closeMenu } }, [
          _c("i", { staticClass: "fas fa-times" })
        ])
      ]),
      _vm._v(" "),
      _c(
        "ul",
        { staticClass: "menu-items" },
        _vm._l(_vm.items, function(index, item) {
          return _c(
            "li",
            { key: index, staticClass: "menu-item" },
            [
              item.route
                ? _c(
                    "router-link",
                    { attrs: { tag: "span", to: { name: item.route } } },
                    [_vm._v(_vm._s(item.text))]
                  )
                : _c(
                    "span",
                    {
                      on: {
                        click: function($event) {
                          _vm.$emit(item.emit)
                        }
                      }
                    },
                    [_vm._v(_vm._s(item.text))]
                  )
            ],
            1
          )
        })
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-167c4e0e", module.exports)
  }
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(71)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(73)
/* template */
var __vue_template__ = __webpack_require__(74)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-06e48dda"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/TopMenu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-06e48dda", Component.options)
  } else {
    hotAPI.reload("data-v-06e48dda", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(72);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a167dad4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-06e48dda\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TopMenu.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-06e48dda\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TopMenu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.navbar[data-v-06e48dda] {\n  width: 100%;\n  position: relative;\n  height: 3em;\n  background-color: red;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.navbar h2[data-v-06e48dda] {\n    margin: 0;\n    text-align: center;\n}\n.navbar div[data-v-06e48dda] {\n    padding: 1rem;\n    font-size: 1.4rem;\n}\n", ""]);

// exports


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "TopMenu",
    props: {
        title: {
            type: String,
            default: ''
        },
        menu: {
            type: Boolean,
            default: true
        },
        back: {
            type: Boolean,
            default: true
        },
        fontColor: {
            type: String,
            default: 'white'
        },
        color: {
            type: String,
            default: 'green'
        }
    },
    data: function data() {
        return {
            navStyle: {
                backgroundColor: this.color,
                color: this.fontColor
            },
            from: null
        };
    }
});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "navbar", style: _vm.navStyle }, [
    _c("div", { staticClass: "absolute left-icon" }, [
      _vm.back
        ? _c("i", {
            staticClass: " fas fa-arrow-left",
            on: {
              click: function($event) {
                _vm.$router.back()
              }
            }
          })
        : _vm._e()
    ]),
    _vm._v(" "),
    _vm.title
      ? _c("h2", { staticClass: "title" }, [
          _vm._v("\n        " + _vm._s(_vm.title) + "\n    ")
        ])
      : _vm._e(),
    _vm._v(" "),
    _c("div", { staticClass: "right" }, [
      _vm.menu
        ? _c("i", {
            staticClass: "fas fa-align-justify",
            on: {
              click: function($event) {
                _vm.$emit("openMenu")
              }
            }
          })
        : _vm._e()
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-06e48dda", module.exports)
  }
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "no-height-padding" },
    [
      _c("ham-menu", {
        ref: "hamMenu",
        attrs: {
          title: this.menuTitle,
          items: this.navItems,
          color: this.color
        }
      }),
      _vm._v(" "),
      _c("top-menu", {
        attrs: {
          "font-color": this.fontColor,
          color: this.color,
          title: this.title
        },
        on: {
          openMenu: function($event) {
            _vm.$refs.hamMenu.openMenu()
          }
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-78715ee5", module.exports)
  }
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(77);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1493133b", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-870037cc\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ButtonToApp.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-870037cc\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ButtonToApp.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.button-to-app[data-v-870037cc] {\n  width: 40vw;\n  background-color: #99e86a;\n  padding: 0.5vw 0vw 0.5vw 0vw;\n  margin: 2.5vw;\n  text-align: center;\n  border-radius: 3px;\n  -webkit-box-shadow: 0px 1px 5px #8888889d;\n          box-shadow: 0px 1px 5px #8888889d;\n  float: right;\n}\n.button-to-app[data-v-870037cc]:active {\n    background-color: #3e8214;\n    -webkit-box-shadow: 0px 0px #888888;\n            box-shadow: 0px 0px #888888;\n}\na[data-v-870037cc] {\n  text-decoration: none;\n}\np[data-v-870037cc] {\n  color: white;\n  font-size: 4vw;\n  font-weight: bold;\n  text-transform: uppercase;\n  letter-spacing: -1px;\n}\n", ""]);

// exports


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "ButtonToApp",
    props: ['linkSite']
});

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "button-to-app" }, [
    _c("a", { attrs: { href: _vm.linkSite } }, [
      _c("p", [_vm._v("Ga naar de site")])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-870037cc", module.exports)
  }
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { "bottom-color": "red" } }, [
    _c(
      "div",
      { attrs: { slot: "content" }, slot: "content" },
      [
        _c("navigation-bar"),
        _vm._v(" "),
        _c("div", { staticClass: "block" }, [
          _c(
            "div",
            { staticClass: "headBlock" },
            [_c("h4", [_vm._v("BlaBlaCar")]), _vm._v(" "), _c("button-to-app")],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "description" }, [
            _c("p", [
              _vm._v(
                "Beschrijving van het product of het restaurant of de winkel. \n                Ik vind dit een heel mooi product omdat het hele mooie kleuren \n                heeft en heel duurzaam is en al je wensen vervuld maar natuurlijk \n                heeft het ook driehonderd ogen twee balonnen en een aardappel. \n                Dit was mijn spreekbeurt."
              )
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v(
                "Beschrijving van het product of het restaurant of de winkel. \n                Ik vind dit een heel mooi product omdat het hele mooie kleuren \n                heeft en heel duurzaam is en al je wensen vervuld maar natuurlijk \n                heeft het ook driehonderd ogen twee balonnen en een aardappel. \n                Dit was mijn spreekbeurt."
              )
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v(
                "Beschrijving van het product of het restaurant of de winkel. \n                Ik vind dit een heel mooi product omdat het hele mooie kleuren \n                heeft en heel duurzaam is en al je wensen vervuld maar natuurlijk \n                heeft het ook driehonderd ogen twee balonnen en een aardappel. \n                Dit was mijn spreekbeurt."
              )
            ])
          ])
        ])
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-a0ceb926", module.exports)
  }
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(82)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(84)
/* template */
var __vue_template__ = __webpack_require__(90)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5a2d3b18"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Dashboard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5a2d3b18", Component.options)
  } else {
    hotAPI.reload("data-v-5a2d3b18", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(83);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("60b8c4e9", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5a2d3b18\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dashboard.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5a2d3b18\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dashboard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_CategoryCard__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_CategoryCard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layout_CategoryCard__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_NavigationBar__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_NavigationBar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__layout_NavigationBar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layout_HamburgerMenu__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layout_HamburgerMenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__layout_HamburgerMenu__);
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
    name: "DashboardPage",
    components: {
        CategoryCard: __WEBPACK_IMPORTED_MODULE_0__layout_CategoryCard___default.a,
        NavigationBar: __WEBPACK_IMPORTED_MODULE_1__layout_NavigationBar___default.a,
        HamburgerMenu: __WEBPACK_IMPORTED_MODULE_2__layout_HamburgerMenu___default.a
    },
    mounted: function mounted() {
        var _this = this;

        axios.get('/api/categories').then(function (response) {
            return _this.categories = response.data;
        });
    },
    data: function data() {
        return {
            categories: null
        };
    }
});

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(86)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(88)
/* template */
var __vue_template__ = __webpack_require__(89)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3562c098"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/CategoryCard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3562c098", Component.options)
  } else {
    hotAPI.reload("data-v-3562c098", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(87);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7ec7683a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3562c098\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CategoryCard.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3562c098\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CategoryCard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.card[data-v-3562c098] {\n  text-align: center;\n  padding: 3rem;\n  display: block;\n  border-radius: 15px;\n  color: white;\n  text-decoration: none;\n  margin-bottom: 1em;\n}\n.card i[data-v-3562c098] {\n    font-size: 2rem;\n}\n", ""]);

// exports


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['category']
});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "router-link",
    {
      staticClass: "card",
      style: { background: _vm.category.color },
      attrs: {
        to: {
          name: "category",
          params: { category_slug: _vm.category.name, category: _vm.category }
        }
      }
    },
    [
      _c("i", { staticClass: "fas fa-lemon" }),
      _vm._v("\n    " + _vm._s(_vm.category.name.toUpperCase()) + "\n")
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3562c098", module.exports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { "bottom-color": "#30336B" } }, [
    _c(
      "div",
      { attrs: { slot: "content" }, slot: "content" },
      [
        _c("navigation-bar"),
        _vm._v(" "),
        _c("h2", [_vm._v("Dashboard")]),
        _vm._v(" "),
        _vm._l(_vm.categories, function(category, index) {
          return _c("category-card", {
            key: index,
            attrs: { category: category }
          })
        })
      ],
      2
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5a2d3b18", module.exports)
  }
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(92)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(94)
/* template */
var __vue_template__ = __webpack_require__(95)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-708219fd"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Detail.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-708219fd", Component.options)
  } else {
    hotAPI.reload("data-v-708219fd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(93);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("566aa4ac", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-708219fd\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Detail.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-708219fd\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Detail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp__);
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        ButtonToApp: __WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp___default.a
    },
    data: function data() {
        return {
            link: '#'
        };
    },

    name: "DetailPage"
});

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page-wrapper",
    { attrs: { "bottom-color": "#30336B" } },
    [
      _c("h1", [_vm._v("Company")]),
      _vm._v(" "),
      _c("button-to-app", { attrs: { LinkSite: _vm.link } }),
      _vm._v(" "),
      _c("p", [
        _vm._v("Beschrijving van het product of het restaurant of de winkel")
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-708219fd", module.exports)
  }
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(97)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(99)
/* template */
var __vue_template__ = __webpack_require__(100)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-dd95e9ac"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Category.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dd95e9ac", Component.options)
  } else {
    hotAPI.reload("data-v-dd95e9ac", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(98);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("226604c3", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dd95e9ac\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Category.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dd95e9ac\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Category.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "CategoryPage",
    props: ['category']
});

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { "bottom-color": "blue" } }, [
    _c("div", { attrs: { slot: "content" }, slot: "content" })
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-dd95e9ac", module.exports)
  }
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(102)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(104)
/* template */
var __vue_template__ = __webpack_require__(105)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-34b587bf"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/views/Try.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-34b587bf", Component.options)
  } else {
    hotAPI.reload("data-v-34b587bf", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(103);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a141390c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-34b587bf\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Try.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-34b587bf\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Try.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp__);
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        ButtonToApp: __WEBPACK_IMPORTED_MODULE_0__layout_ButtonToApp___default.a
    },
    data: function data() {
        return {
            link: '#'
        };
    },

    name: "LoginPage"
});

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("page-wrapper", { attrs: { "bottom-color": "#999744" } }, [
    _c(
      "div",
      { attrs: { slot: "content" }, slot: "content" },
      [_c("h2", [_vm._v("Try")]), _vm._v(" "), _c("button-to-app")],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-34b587bf", module.exports)
  }
}

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(107)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(109)
/* template */
var __vue_template__ = __webpack_require__(110)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4070fcec"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/PageWrapper.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4070fcec", Component.options)
  } else {
    hotAPI.reload("data-v-4070fcec", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(108);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("14d218e8", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4070fcec\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PageWrapper.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4070fcec\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PageWrapper.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.backgroundImage[data-v-4070fcec] {\n  background-position: center;\n  background-repeat: no-repeat;\n}\n@media only screen and (max-width: 1085px) {\n.backgroundImage[data-v-4070fcec] {\n      background-size: cover;\n      /* Resize the background image to cover the entire container */\n}\n}\n", ""]);

// exports


/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "pageWrapper",
    props: {
        topColor: {
            type: String,
            default: "transparent"
        },
        bottomColor: {
            type: String,
            default: "blue"
        },
        picture: {
            type: String,
            default: ''
        },
        picturePosition: {
            type: String,
            default: 'auto auto'
        },
        bottomFixed: {
            type: Boolean,
            default: true
        }
    },
    data: function data() {
        return {
            tColor: this.topColor,
            sColor: { background: this.bottomColor },
            bColor: {
                backgroundImage: "linear-gradient(-190deg, white 350px, " + this.bottomColor + " 0)"
            },
            bImage: this.picture
        };
    },

    computed: {
        backgroundImage: function backgroundImage() {
            if (this.bImage.length) {
                return {
                    backgroundImage: "url(\"/storage/img/" + this.bImage + "\")",
                    backgroundColor: this.tColor,
                    backgroundPosition: this.picturePosition
                };
            }
            return {
                backgroundColor: this.tColor
            };
        }
    },
    methods: {}
});

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "page-wrapper", style: _vm.bColor }, [
    _c("div", { staticClass: "container" }, [_vm._t("content")], 2)
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4070fcec", module.exports)
  }
}

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(112)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(114)
/* template */
var __vue_template__ = __webpack_require__(115)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e4df7ff6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/layout/Footer.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e4df7ff6", Component.options)
  } else {
    hotAPI.reload("data-v-e4df7ff6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("75c1ea0c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e4df7ff6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Footer.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e4df7ff6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Footer.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.intro-heading[data-v-e4df7ff6] {\n  text-transform: uppercase;\n}\n.intro-heading h1[data-v-e4df7ff6] {\n    font-weight: 900;\n}\n.bottom[data-v-e4df7ff6] {\n  position: fixed !important;\n  color: white;\n  top: 85vh;\n  left: 10px;\n}\n", ""]);

// exports


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {}
});

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "intro-heading bottom" }, [
      _c("p", [
        _vm._v("check ons op"),
        _c("br"),
        _c("a", { attrs: { href: "http://www.facebook.nl" } }, [
          _c("img", {
            staticStyle: { width: "50px", height: "50px" },
            attrs: { src: "https://i.imgur.com/6BI8ck8.png" }
          })
        ])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-e4df7ff6", module.exports)
  }
}

/***/ }),
/* 116 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);