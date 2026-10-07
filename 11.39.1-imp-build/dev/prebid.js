/* prebid.js v11.40.0-pre
Updated: 2026-10-07
Modules: impactifyBidAdapter, tcfControl, consentManagementGpp, consentManagementTcf, gppControl_usstates, gppControl_usnat, gptPreAuction, storageControl, debugging */

if (!window.pbjs || !window.pbjs.libLoaded) {
 (function(){
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/dlv/index.js"
/*!***************************************!*\
  !*** ../../node_modules/dlv/index.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dlv)
/* harmony export */ });
function dlv(obj, key, def, p, undef) {
	key = key.split ? key.split('.') : key;
	for (p = 0; p < key.length; p++) {
		obj = obj ? obj[key[p]] : undef;
	}
	return obj === undef ? def : obj;
}


/***/ },

/***/ "../../node_modules/fun-hooks/no-eval/index.js"
/*!*****************************************************!*\
  !*** ../../node_modules/fun-hooks/no-eval/index.js ***!
  \*****************************************************/
(module) {

/*
* @license MIT
* Fun Hooks v1.1.0
* (c) @snapwich
*/
create.SYNC = 1;
create.ASYNC = 2;
create.QUEUE = 4;

var packageName = "fun-hooks";

var defaults = Object.freeze({
  ready: 0
});

var hookableMap = new WeakMap();

function rest(args, skip) {
  return Array.prototype.slice.call(args, skip);
}

function runAll(queue) {
  var queued;
  // eslint-disable-next-line no-cond-assign
  while ((queued = queue.shift())) {
    queued();
  }
}

function create(config) {
  var hooks = {};
  var postReady = [];

  config = Object.assign({}, defaults, config);

  function dispatch(arg1, arg2) {
    if (typeof arg1 === "function") {
      return hookFn.call(null, "sync", arg1, arg2);
    } else if (typeof arg1 === "string" && typeof arg2 === "function") {
      return hookFn.apply(null, arguments);
    } else if (typeof arg1 === "object") {
      return hookObj.apply(null, arguments);
    }
  }

  var ready;
  if (config.ready) {
    dispatch.ready = function() {
      ready = true;
      runAll(postReady);
    };
  } else {
    ready = true;
  }

  function hookObj(obj, props, objName) {
    var walk = true;
    if (typeof props === "undefined") {
      props = Object.getOwnPropertyNames(obj).filter(prop => !prop.match(/^_/));
      walk = false;
    }
    var objHooks = {};
    var doNotHook = ["constructor"];
    do {
      props.forEach(function(prop) {
        var parts = prop.match(/(?:(sync|async):)?(.+)/);
        var type = parts[1] || "sync";
        var name = parts[2];
        if (
          !objHooks[name] &&
          typeof obj[name] === "function" &&
          !(doNotHook.indexOf(name) !== -1)
        ) {
          var fn = obj[name];
          objHooks[name] = obj[name] = hookFn(
            type,
            fn,
            objName ? [objName, name] : undefined
          );
        }
      });
      obj = Object.getPrototypeOf(obj);
    } while (walk && obj);
    return objHooks;
  }

  /**
   * Navigates a string path to return a hookable function.  If not found, creates a placeholder for hooks.
   * @param {(Array<string> | string)} path
   */
  function get(path) {
    var parts = Array.isArray(path) ? path : path.split(".");
    return parts.reduce(function(memo, part, i) {
      var item = memo[part];
      var installed = false;
      if (item) {
        return item;
      } else if (i === parts.length - 1) {
        if (!ready) {
          postReady.push(function() {
            if (!installed) {
              // eslint-disable-next-line no-console
              console.warn(
                packageName +
                  ": referenced '" +
                  path +
                  "' but it was never created"
              );
            }
          });
        }
        return (memo[part] = newHookable(function(fn) {
          memo[part] = fn;
          installed = true;
        }));
      }
      return (memo[part] = {});
    }, hooks);
  }

  function newHookable(onInstall) {
    var before = [];
    var after = [];
    var generateTrap = function() {};

    var api = {
      before: function(hook, priority) {
        return add.call(this, before, "before", hook, priority);
      },
      after: function(hook, priority) {
        return add.call(this, after, "after", hook, priority);
      },
      getHooks: function(match) {
        var hooks = before.concat(after);
        if (typeof match === "object") {
          hooks = hooks.filter(function(entry) {
            return Object.keys(match).every(function(prop) {
              return entry[prop] === match[prop];
            });
          });
        }
        try {
          Object.assign(hooks, {
            remove: function() {
              hooks.forEach(function(entry) {
                entry.remove();
              });
              return this;
            }
          });
        } catch (e) {
          console.error(
            "error adding `remove` to array, did you modify Array.prototype?"
          );
        }
        return hooks;
      },
      removeAll: function() {
        return this.getHooks().remove();
      }
    };

    var meta = {
      install: function(type, fn, generate) {
        this.type = type;
        generateTrap = generate;
        generate(before, after);
        onInstall && onInstall(fn);
      }
    };

    // store meta data related to hookable. use `api.after` since `api` reference is not available on our proxy.
    hookableMap.set(api.after, meta);

    return api;

    function add(store, type, hook, priority) {
      var entry = {
        hook: hook,
        type: type,
        priority: priority || 10,
        remove: function() {
          var index = store.indexOf(entry);
          if (index !== -1) {
            store.splice(index, 1);
            generateTrap(before, after);
          }
        }
      };
      store.push(entry);
      store.sort(function(a, b) {
        return b.priority - a.priority;
      });
      generateTrap(before, after);
      return this;
    }
  }

  function hookFn(type, fn, name) {
    // check if function has already been wrapped
    var meta = fn.after && hookableMap.get(fn.after);
    if (meta) {
      if (meta.type !== type) {
        throw packageName + ": recreated hookable with different type";
      } else {
        return fn;
      }
    }

    var hookable = name ? get(name) : newHookable();

    var trap;

    var handlers = {
      get: function(target, prop) {
        return hookable[prop] || Reflect.get.apply(Reflect, arguments);
      }
    };

    if (!ready) {
      postReady.push(setTrap);
    }

    var hookedFn = new Proxy(fn, handlers);

    hookableMap.get(hookedFn.after).install(type, hookedFn, generateTrap);

    return hookedFn;

    // eslint-disable-next-line no-redeclare
    function generateTrap(before, after) {
      var order = [];
      var targetIndex;
      if (before.length || after.length) {
        before.forEach(addToOrder);
        // placeholder for target function wrapper
        targetIndex = order.push(undefined) - 1;
        after.forEach(addToOrder);
        trap = function(target, thisArg, args) {
          var localOrder = order.slice();
          var curr = 0;
          var result;
          var callback =
            type === "async" &&
            typeof args[args.length - 1] === "function" &&
            args.pop();
          function bail(value) {
            if (type === "sync") {
              result = value;
            } else if (callback) {
              callback.apply(null, arguments);
            }
          }
          function next(value) {
            if (localOrder[curr]) {
              var args = rest(arguments);
              next.bail = bail;
              args.unshift(next);
              return localOrder[curr++].apply(thisArg, args);
            }
            if (type === "sync") {
              result = value;
            } else if (callback) {
              callback.apply(null, arguments);
            }
          }
          localOrder[targetIndex] = function() {
            var args = rest(arguments, 1);
            if (type === "async" && callback) {
              delete next.bail;
              args.push(next);
            }
            var result = target.apply(thisArg, args);
            if (type === "sync") {
              next(result);
            }
          };
          next.apply(null, args);
          return result;
        };
      } else {
        trap = undefined;
      }
      setTrap();

      function addToOrder(entry) {
        order.push(entry.hook);
      }
    }

    function setTrap() {
      if (
        ready ||
        (type === "sync" && !(config.ready & create.SYNC)) ||
        (type === "async" && !(config.ready & create.ASYNC))
      ) {
        handlers.apply = trap;
      } else if (type === "sync" || !(config.ready & create.QUEUE)) {
        handlers.apply = function() {
          throw packageName + ": hooked function not ready";
        };
      } else {
        handlers.apply = function() {
          var args = arguments;
          postReady.push(function() {
            hookedFn.apply(args[1], args[2]);
          });
        };
      }
    }
  }

  dispatch.get = get;
  return dispatch;
}

/* global module */
module.exports = create;


/***/ },

/***/ "../../node_modules/dset/dist/index.mjs"
/*!**********************************************!*\
  !*** ../../node_modules/dset/dist/index.mjs ***!
  \**********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dset: () => (/* binding */ dset)
/* harmony export */ });
function dset(obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, l=keys.length, t=obj, x, k;
	while (i < l) {
		k = ''+keys[i++];
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') break;
		t = t[k] = (i === l) ? val : (typeof(x=t[k])===typeof(keys)) ? x : (keys[i]*0 !== 0 || !!~(''+keys[i]).indexOf('.')) ? {} : [];
	}
}


/***/ },

/***/ "../../node_modules/klona/json/index.mjs"
/*!***********************************************!*\
  !*** ../../node_modules/klona/json/index.mjs ***!
  \***********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   klona: () => (/* binding */ klona)
/* harmony export */ });
function klona(val) {
	var k, out, tmp;

	if (Array.isArray(val)) {
		out = Array(k=val.length);
		while (k--) out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;
		return out;
	}

	if (Object.prototype.toString.call(val) === '[object Object]') {
		out = {}; // null
		for (k in val) {
			if (k === '__proto__') {
				Object.defineProperty(out, k, {
					value: klona(val[k]),
					configurable: true,
					enumerable: true,
					writable: true,
				});
			} else {
				out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;
			}
		}
		return out;
	}

	return val;
}


/***/ },

/***/ "./buildOptions.mjs"
/*!**************************!*\
  !*** ./buildOptions.mjs ***!
  \**************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "pbGlobal": "pbjs",
  "defineGlobal": true,
  "features": {
    "NATIVE": true,
    "VIDEO": true,
    "UID2_CSTG": true,
    "GREEDY": false,
    "AUDIO": true,
    "LOG_NON_ERROR": true,
    "LOG_ERROR": true
  },
  "distUrlBase": "/build/dev/",
  "skipCalls": {}
});

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		const deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			let notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				let [chunkIds, fn, priority] = deferred[i];
/******/ 				let fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					const r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/set anonymous default export name */
/******/ 	(() => {
/******/ 		// set .name for anonymous default exports per ES spec
/******/ 		__webpack_require__.dn = (x) => {
/******/ 			(Object.getOwnPropertyDescriptor(x, "name") || {}).writable || Object.defineProperty(x, "name", { value: "default", configurable: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			"prebid-core": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		const chunkLoadingGlobal = self["pbjsChunk"] = self["pbjsChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	let __webpack_exports__ = __webpack_require__.O(undefined, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display"], () => (__webpack_require__("./src/prebid.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["chunk-core"],{

/***/ "./src/Renderer.js"
/*!*************************!*\
  !*** ./src/Renderer.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* binding */ Renderer),
/* harmony export */   executeRenderer: () => (/* binding */ executeRenderer),
/* harmony export */   isRendererRequired: () => (/* binding */ isRendererRequired)
/* harmony export */ });
/* harmony import */ var _adloader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adloader.js */ "./src/adloader.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");




const pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_2__.getGlobal)();
const moduleCode = 'outstream';
/**
 * A Renderer stores some functions which are used to render a particular Bid.
 * These are used in Outstream Video Bids, returned on the Bid by the adapter, and will
 * be used to render that bid unless the Publisher overrides them.
 */
class Renderer {
  /**
   * Set by `executeRenderer`; not available before rendering is requested.
   */

  /**
   * Set by `setRender`; renderers that were installed without a render function do not have one.
   */

  constructor(options) {
    const {
      url,
      config,
      id,
      callback,
      loaded,
      adUnitCode,
      renderNow
    } = options;
    this.url = url;
    this.config = config;
    this.handlers = {};
    this.id = id;
    this.renderNow = renderNow;
    this.adUnitCode = adUnitCode;

    // a renderer may push to the command queue to delay rendering until the
    // render function is loaded by loadExternalScript, at which point the the command
    // queue will be processed
    this.loaded = loaded;
    this.cmd = [];
    this.push = func => {
      if (typeof func !== 'function') {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Commands given to Renderer.push must be wrapped in a function');
        return;
      }
      this.loaded ? func() : this.cmd.push(func);
    };

    // bidders may override this with the `callback` property given to `install`
    this.callback = callback || (() => {
      this.loaded = true;
      this.process();
    });
    this.render = (...renderArgs) => {
      const runRender = () => {
        if (this._render) {
          this._render(...renderArgs);
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`No render function was provided, please use .setRender on the renderer`);
        }
      };
      if (isRendererPreferredFromAdUnit(adUnitCode)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`External Js not loaded by Renderer since renderer url and callback is already defined on adUnit ${adUnitCode}`);
        runRender();
      } else if (renderNow) {
        runRender();
      } else {
        // we expect to load a renderer url once only so cache the request to load script
        this.cmd.unshift(runRender); // should render run first ?
        (0,_adloader_js__WEBPACK_IMPORTED_MODULE_0__.loadExternalScript)(url, _activities_modules_js__WEBPACK_IMPORTED_MODULE_3__.MODULE_TYPE_PREBID, moduleCode, this.callback, this.documentContext);
      }
    };
  }
  static install(options) {
    const {
      url,
      config,
      id,
      callback,
      loaded,
      adUnitCode,
      renderNow
    } = options;
    return new Renderer({
      url,
      config,
      id,
      callback,
      loaded,
      adUnitCode,
      renderNow
    });
  }
  getConfig() {
    return this.config;
  }
  setRender(fn) {
    this._render = fn;
  }
  setEventHandlers(handlers) {
    this.handlers = handlers;
  }
  handleVideoEvent({
    id,
    eventName
  }) {
    if (typeof this.handlers[eventName] === 'function') {
      this.handlers[eventName]();
    }
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)(`Prebid Renderer event for id ${id} type ${eventName}`);
  }

  /*
   * Calls functions that were pushed to the command queue before the
   * renderer was loaded by `loadExternalScript`
   */
  process() {
    while (this.cmd.length > 0) {
      try {
        this.cmd.shift()();
      } catch (error) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Error processing Renderer command on ad unit '${this.adUnitCode}':`, error);
      }
    }
  }
}

/**
 * Checks whether creative rendering should be done by Renderer or not.
 */
function isRendererRequired(renderer) {
  return !!(renderer && (renderer.url || renderer.renderNow));
}

/**
 * Render the bid returned by the adapter
 * @param renderer Renderer object installed by adapter
 * @param bid Bid response
 * @param doc context document of bid
 */
function executeRenderer(renderer, bid, doc) {
  let docContext = null;
  if (renderer.config && renderer.config.documentResolver) {
    docContext = renderer.config.documentResolver(bid, document, doc); // a user provided callback, which should return a Document, and expect the parameters; bid, sourceDocument, renderDocument
  }
  if (!docContext) {
    docContext = document;
  }
  renderer.documentContext = docContext;
  renderer.render(bid, renderer.documentContext);
}
function isRendererPreferredFromAdUnit(adUnitCode) {
  const adUnits = pbjsInstance.adUnits;
  const adUnit = adUnits.find(adUnit => {
    return adUnit.code === adUnitCode;
  });
  if (!adUnit) {
    return false;
  }

  // renderer defined at adUnit level
  const adUnitRenderer = adUnit?.renderer;
  const hasValidAdUnitRenderer = !!(adUnitRenderer && adUnitRenderer.url && adUnitRenderer.render);

  // renderer defined at adUnit.mediaTypes level
  const mediaTypeRenderer = adUnit?.mediaTypes?.video?.renderer;
  const hasValidMediaTypeRenderer = !!(mediaTypeRenderer && mediaTypeRenderer.url && mediaTypeRenderer.render);
  return !!(hasValidAdUnitRenderer && !(adUnitRenderer.backupOnly === true) || hasValidMediaTypeRenderer && !(mediaTypeRenderer.backupOnly === true));
}

/***/ },

/***/ "./src/activities/activities.js"
/*!**************************************!*\
  !*** ./src/activities/activities.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTIVITY_ACCESS_DEVICE: () => (/* binding */ ACTIVITY_ACCESS_DEVICE),
/* harmony export */   ACTIVITY_ACCESS_REQUEST_CREDENTIALS: () => (/* binding */ ACTIVITY_ACCESS_REQUEST_CREDENTIALS),
/* harmony export */   ACTIVITY_ADD_BID_RESPONSE: () => (/* binding */ ACTIVITY_ADD_BID_RESPONSE),
/* harmony export */   ACTIVITY_ENRICH_EIDS: () => (/* binding */ ACTIVITY_ENRICH_EIDS),
/* harmony export */   ACTIVITY_ENRICH_UFPD: () => (/* binding */ ACTIVITY_ENRICH_UFPD),
/* harmony export */   ACTIVITY_FETCH_BIDS: () => (/* binding */ ACTIVITY_FETCH_BIDS),
/* harmony export */   ACTIVITY_LOAD_EXTERNAL_SCRIPT: () => (/* binding */ ACTIVITY_LOAD_EXTERNAL_SCRIPT),
/* harmony export */   ACTIVITY_REPORT_ANALYTICS: () => (/* binding */ ACTIVITY_REPORT_ANALYTICS),
/* harmony export */   ACTIVITY_SYNC_USER: () => (/* binding */ ACTIVITY_SYNC_USER),
/* harmony export */   ACTIVITY_TRANSMIT_EIDS: () => (/* binding */ ACTIVITY_TRANSMIT_EIDS),
/* harmony export */   ACTIVITY_TRANSMIT_PRECISE_GEO: () => (/* binding */ ACTIVITY_TRANSMIT_PRECISE_GEO),
/* harmony export */   ACTIVITY_TRANSMIT_TID: () => (/* binding */ ACTIVITY_TRANSMIT_TID),
/* harmony export */   ACTIVITY_TRANSMIT_UFPD: () => (/* binding */ ACTIVITY_TRANSMIT_UFPD)
/* harmony export */ });
/**
 * Activity (that are relevant for privacy) definitions
 *
 * ref. https://docs.google.com/document/d/1dRxFUFmhh2jGanzGZvfkK_6jtHPpHXWD7Qsi6KEugeE
 * & https://github.com/prebid/Prebid.js/issues/9546
 */

/**
 * accessDevice: some component wants to read or write to localStorage or cookies.
 */
const ACTIVITY_ACCESS_DEVICE = 'accessDevice';
/**
 * syncUser: A bid adapter wants to run a user sync.
 */
const ACTIVITY_SYNC_USER = 'syncUser';
/**
 * enrichUfpd: some component wants to add user first-party data to bid requests.
 */
const ACTIVITY_ENRICH_UFPD = 'enrichUfpd';
/**
 * enrichEids: some component wants to add user IDs to bid requests.
 */
const ACTIVITY_ENRICH_EIDS = 'enrichEids';
/**
 * fetchBid: a bidder wants to bid.
 */
const ACTIVITY_FETCH_BIDS = 'fetchBids';

/**
 * reportAnalytics: some component wants to phone home with analytics data.
 */
const ACTIVITY_REPORT_ANALYTICS = 'reportAnalytics';

/**
 * some component wants access to (and send along) user IDs
 */
const ACTIVITY_TRANSMIT_EIDS = 'transmitEids';

/**
 * transmitUfpd: some component wants access to (and send along) user FPD
 */
const ACTIVITY_TRANSMIT_UFPD = 'transmitUfpd';

/**
 * transmitPreciseGeo: some component wants access to (and send along) geolocation info
 */
const ACTIVITY_TRANSMIT_PRECISE_GEO = 'transmitPreciseGeo';

/**
 * transmit TID: some component wants access ot (and send along) transaction IDs
 */
const ACTIVITY_TRANSMIT_TID = 'transmitTid';

/**
 * loadExternalScript: adLoader.js is allowed to load external script
 */
const ACTIVITY_LOAD_EXTERNAL_SCRIPT = 'loadExternalScript';

/**
 * accessRequestCredentials: setting withCredentials flag in ajax request config
 */
const ACTIVITY_ACCESS_REQUEST_CREDENTIALS = 'accessRequestCredentials';

/**
 * acceptBid: a bid is about to be accepted.
 */
const ACTIVITY_ADD_BID_RESPONSE = 'acceptBid';

/***/ },

/***/ "./src/activities/activityParams.js"
/*!******************************************!*\
  !*** ./src/activities/activityParams.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activityParams: () => (/* binding */ activityParams)
/* harmony export */ });
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./params.js */ "./src/activities/params.js");



/**
 * Utility function for building common activity parameters - broken out to its own
 * file to avoid circular imports.
 */
const activityParams = (0,_params_js__WEBPACK_IMPORTED_MODULE_1__.activityParamsBuilder)(alias => _adapterManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].resolveAlias(alias));

/***/ },

/***/ "./src/activities/modules.js"
/*!***********************************!*\
  !*** ./src/activities/modules.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MODULE_TYPE_ANALYTICS: () => (/* binding */ MODULE_TYPE_ANALYTICS),
/* harmony export */   MODULE_TYPE_BIDDER: () => (/* binding */ MODULE_TYPE_BIDDER),
/* harmony export */   MODULE_TYPE_PREBID: () => (/* binding */ MODULE_TYPE_PREBID),
/* harmony export */   MODULE_TYPE_RTD: () => (/* binding */ MODULE_TYPE_RTD),
/* harmony export */   MODULE_TYPE_UID: () => (/* binding */ MODULE_TYPE_UID)
/* harmony export */ });
const MODULE_TYPE_PREBID = 'prebid';
const MODULE_TYPE_BIDDER = 'bidder';
const MODULE_TYPE_UID = 'userId';
const MODULE_TYPE_RTD = 'rtd';
const MODULE_TYPE_ANALYTICS = 'analytics';

/***/ },

/***/ "./src/activities/params.js"
/*!**********************************!*\
  !*** ./src/activities/params.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTIVITY_PARAM_ADAPTER_CODE: () => (/* binding */ ACTIVITY_PARAM_ADAPTER_CODE),
/* harmony export */   ACTIVITY_PARAM_ANL_CONFIG: () => (/* binding */ ACTIVITY_PARAM_ANL_CONFIG),
/* harmony export */   ACTIVITY_PARAM_COMPONENT: () => (/* binding */ ACTIVITY_PARAM_COMPONENT),
/* harmony export */   ACTIVITY_PARAM_COMPONENT_NAME: () => (/* binding */ ACTIVITY_PARAM_COMPONENT_NAME),
/* harmony export */   ACTIVITY_PARAM_COMPONENT_TYPE: () => (/* binding */ ACTIVITY_PARAM_COMPONENT_TYPE),
/* harmony export */   ACTIVITY_PARAM_S2S_NAME: () => (/* binding */ ACTIVITY_PARAM_S2S_NAME),
/* harmony export */   ACTIVITY_PARAM_STORAGE_KEY: () => (/* binding */ ACTIVITY_PARAM_STORAGE_KEY),
/* harmony export */   ACTIVITY_PARAM_STORAGE_TYPE: () => (/* binding */ ACTIVITY_PARAM_STORAGE_TYPE),
/* harmony export */   ACTIVITY_PARAM_STORAGE_WRITE: () => (/* binding */ ACTIVITY_PARAM_STORAGE_WRITE),
/* harmony export */   ACTIVITY_PARAM_SYNC_TYPE: () => (/* binding */ ACTIVITY_PARAM_SYNC_TYPE),
/* harmony export */   ACTIVITY_PARAM_SYNC_URL: () => (/* binding */ ACTIVITY_PARAM_SYNC_URL),
/* harmony export */   activityParamsBuilder: () => (/* binding */ activityParamsBuilder),
/* harmony export */   buildActivityParams: () => (/* binding */ buildActivityParams)
/* harmony export */ });
/* harmony import */ var _modules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules.js */ "./src/activities/modules.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook.js */ "./src/hook.js");



/**
 * Component ID - who is trying to perform the activity?
 * Relevant for all activities.
 */
const ACTIVITY_PARAM_COMPONENT = 'component';
const ACTIVITY_PARAM_COMPONENT_TYPE = ACTIVITY_PARAM_COMPONENT + 'Type';
const ACTIVITY_PARAM_COMPONENT_NAME = ACTIVITY_PARAM_COMPONENT + 'Name';

/**
 * Code of the bid adapter that `componentName` is an alias of.
 * May be the same as the component name.
 *
 * relevant for all activities, but only when componentType is 'bidder'.
 */
const ACTIVITY_PARAM_ADAPTER_CODE = 'adapterCode';

/**
 * Storage type - either 'html5' or 'cookie'.
 * Relevant for: accessDevice
 */
const ACTIVITY_PARAM_STORAGE_TYPE = 'storageType';

/**
 * Storage key - cookie name or localStorage key.
 * Relevant for: accessDevice
 */
const ACTIVITY_PARAM_STORAGE_KEY = 'storageKey';

/**
 * True if attempting to write to device storage; false otherwise (e.g. when reading from or checking availability of storage).
 * Relevant for: accessDevice
 */
const ACTIVITY_PARAM_STORAGE_WRITE = 'write';

/**
 * s2sConfig[].configName, used to identify a particular s2s instance
 * relevant for: fetchBids, but only when component is 'prebid.pbsBidAdapter'
 */
const ACTIVITY_PARAM_S2S_NAME = 'configName';
/**
 * user sync type - 'iframe' or 'pixel'
 * relevant for: syncUser
 */
const ACTIVITY_PARAM_SYNC_TYPE = 'syncType';
/**
 * user sync URL
 * relevant for: syncUser
 */
const ACTIVITY_PARAM_SYNC_URL = 'syncUrl';
/**
 * Configuration options for analytics adapter - the argument passed to `enableAnalytics`.
 * Relevant for: reportAnalytics
 * @private
 * @constant
 * @type {string}
 */
const ACTIVITY_PARAM_ANL_CONFIG = '_config';
function activityParamsBuilder(resolveAlias) {
  return function activityParams(moduleType, moduleName, params) {
    const defaults = {
      [ACTIVITY_PARAM_COMPONENT_TYPE]: moduleType,
      [ACTIVITY_PARAM_COMPONENT_NAME]: moduleName,
      [ACTIVITY_PARAM_COMPONENT]: `${moduleType}.${moduleName}`
    };
    if (moduleType === _modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_BIDDER) {
      defaults[ACTIVITY_PARAM_ADAPTER_CODE] = resolveAlias(moduleName);
    }
    return buildActivityParams(Object.assign(defaults, params));
  };
}
const buildActivityParams = (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)('sync', params => params);

/***/ },

/***/ "./src/activities/redactor.js"
/*!************************************!*\
  !*** ./src/activities/redactor.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   redactor: () => (/* binding */ redactor)
/* harmony export */ });
/* unused harmony exports ORTB_UFPD_PATHS, ORTB_EIDS_PATHS, ORTB_GEO_PATHS, ORTB_IPV4_PATHS, ORTB_IPV6_PATHS, redactRule, objectTransformer, sessionedApplies, isData, appliesWhenActivityDenied, ortb2TransmitRules, redactorFactory */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _rules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./activities.js */ "./src/activities/activities.js");
/* harmony import */ var _utils_ipUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/ipUtils.js */ "./src/utils/ipUtils.js");





const ORTB_UFPD_PATHS = ['data', 'ext.data', 'yob', 'gender', 'keywords', 'kwarray', 'id', 'buyeruid', 'customdata'].map(f => `user.${f}`).concat('device.ifa');
const ORTB_EIDS_PATHS = ['user.eids', 'user.ext.eids'];
const ORTB_GEO_PATHS = ['user.geo.lat', 'user.geo.lon', 'device.geo.lat', 'device.geo.lon'];
const ORTB_IPV4_PATHS = ['device.ip'];
const ORTB_IPV6_PATHS = ['device.ipv6'];

/**
 * @typedef TransformationRuleDef
 * @property {name}
 * @property {Array[string]} paths dot-separated list of paths that this rule applies to.
 * @property {function(*): boolean} applies a predicate that should return true if this rule applies
 * (and the transformation defined herein should be applied). The arguments are those passed to the transformation function.
 * @property {name} a name for the rule; used to debounce calls to `applies` (and avoid excessive logging):
 * if a rule with the same name was already found to apply (or not), this one will (or won't) as well.
 */

/**
 * @typedef RedactRuleDef A rule that removes, or replaces, values from an object (modifications are done in-place).
 * @augments TransformationRuleDef
 * @property {function(*): *} get? substitution functions for values that should be redacted;
 *  takes in the original (unredacted) value as an input, and returns a substitute to use in the redacted
 *  version. If it returns undefined, or this option is omitted, protected paths will be removed
 *  from the redacted object.
 */

/**
 * @param {RedactRuleDef} ruleDef
 * @return {TransformationRule}
 */
function redactRule(ruleDef) {
  return Object.assign({
    get() {},
    run(root, path, object, property, applies) {
      const val = object && object[property];
      if (isData(val) && applies()) {
        const repl = this.get(val);
        if (repl === undefined) {
          delete object[property];
        } else {
          object[property] = repl;
        }
      }
    }
  }, ruleDef);
}

/**
 * @typedef TransformationRule
 * @augments TransformationRuleDef
 * @property {function} run rule logic - see `redactRule` for an example.
 */

/**
 * @typedef {Function} TransformationFunction
 * @param object object to transform
 * @param ...args arguments to pass down to rule's `apply` methods.
 */

/**
 * Return a transformation function that will apply the given rules to an object.
 *
 * @param {Array[TransformationRule]} rules
 * @return {TransformationFunction}
 */
function objectTransformer(rules) {
  rules.forEach(rule => {
    rule.paths = rule.paths.map(path => {
      const parts = path.split('.');
      const tail = parts.pop();
      return [parts.length > 0 ? parts.join('.') : null, tail];
    });
  });
  return function applyTransform(session, obj, ...args) {
    const result = [];
    const applies = sessionedApplies(session, ...args);
    rules.forEach(rule => {
      if (session[rule.name] === false) return;
      for (const [head, tail] of rule.paths) {
        const parent = head == null ? obj : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, head);
        result.push(rule.run(obj, head, parent, tail, applies.bind(null, rule)));
        if (session[rule.name] === false) return;
      }
    });
    return result.filter(el => el != null);
  };
}
function sessionedApplies(session, ...args) {
  return function applies(rule) {
    if (!session.hasOwnProperty(rule.name)) {
      session[rule.name] = !!rule.applies(...args);
    }
    return session[rule.name];
  };
}
function isData(val) {
  return val != null && (typeof val !== 'object' || Object.keys(val).length > 0);
}
function appliesWhenActivityDenied(activity, isAllowed = _rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed) {
  return function applies(params) {
    return !isAllowed(activity, params);
  };
}
function bidRequestTransmitRules(isAllowed = _rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed) {
  return [{
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_EIDS,
    paths: ['userId', 'userIdAsEids'],
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_EIDS, isAllowed)
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_TID,
    paths: ['ortb2Imp.ext.tid', 'ortb2Imp.ext.tidSource'],
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_TID, isAllowed)
  }].map(redactRule);
}
function ortb2TransmitRules(isAllowed = _rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed) {
  return [{
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_UFPD,
    paths: ORTB_UFPD_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_UFPD, isAllowed)
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_EIDS,
    paths: ORTB_EIDS_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_EIDS, isAllowed)
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_PRECISE_GEO,
    paths: ORTB_GEO_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_PRECISE_GEO, isAllowed),
    get(val) {
      return Math.round((val + Number.EPSILON) * 100) / 100;
    }
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_PRECISE_GEO,
    paths: ORTB_IPV4_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_PRECISE_GEO, isAllowed),
    get(val) {
      return (0,_utils_ipUtils_js__WEBPACK_IMPORTED_MODULE_4__.scrubIPv4)(val);
    }
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_PRECISE_GEO,
    paths: ORTB_IPV6_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_PRECISE_GEO, isAllowed),
    get(val) {
      return (0,_utils_ipUtils_js__WEBPACK_IMPORTED_MODULE_4__.scrubIPv6)(val);
    }
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_TID,
    paths: ['source.tid', 'source.ext.tidSource'],
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_TID, isAllowed)
  }].map(redactRule);
}
function redactorFactory(isAllowed = _rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed) {
  const redactOrtb2 = objectTransformer(ortb2TransmitRules(isAllowed));
  const redactBidRequest = objectTransformer(bidRequestTransmitRules(isAllowed));
  return function redactor(params) {
    const session = {};
    return {
      ortb2(obj) {
        redactOrtb2(session, obj, params);
        return obj;
      },
      bidRequest(obj) {
        redactBidRequest(session, obj, params);
        return obj;
      }
    };
  };
}

/**
 * Returns an object that can redact other privacy-sensitive objects according
 * to activity rules.
 *
 * @param {{}} params activity parameters to use for activity checks
 * @return {{ortb2: function({}): {}, bidRequest: function({}): {}}} methods
 *  that can redact disallowed data from ORTB2 and/or bid request objects.
 */
const redactor = redactorFactory();
// by default, TIDs are off since version 8
(0,_rules_js__WEBPACK_IMPORTED_MODULE_2__.registerActivityControl)(_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_TRANSMIT_TID, 'enableTIDs config', () => {
  if (!_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('enableTIDs')) {
    return {
      allow: false,
      reason: 'TIDs are disabled'
    };
  }
});

/***/ },

/***/ "./src/activities/rules.js"
/*!*********************************!*\
  !*** ./src/activities/rules.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isActivityAllowed: () => (/* binding */ isActivityAllowed),
/* harmony export */   registerActivityControl: () => (/* binding */ registerActivityControl)
/* harmony export */ });
/* unused harmony export ruleRegistry */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./params.js */ "./src/activities/params.js");



/**
 * @param logger
 * @return {((function(string, string, function(Object): {allow: boolean, reason?: string}, number=): function(): void)|(function(string, {}): boolean)|*)[]}
 */
function ruleRegistry(logger = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.prefixLog)('Activity control:')) {
  const registry = {};
  function getRules(activity) {
    registry[activity] = registry[activity] || [];
    return registry[activity];
  }
  function runRule(activity, name, rule, params) {
    let res;
    try {
      res = rule(params);
    } catch (e) {
      logger.logError(`Exception in rule ${name} for '${activity}'`, e);
      res = {
        allow: false,
        reason: e
      };
    }
    return res && Object.assign({
      activity,
      name,
      component: params[_params_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_PARAM_COMPONENT]
    }, res);
  }
  const dupes = {};
  const DEDUPE_INTERVAL = 1000;

  // eslint-disable-next-line no-restricted-syntax
  function logResult({
    activity,
    name,
    allow,
    reason,
    component
  }) {
    const msg = `${name} ${allow ? 'allowed' : 'denied'} '${activity}' for '${component}'${reason ? ':' : ''}`;
    const deduping = dupes.hasOwnProperty(msg);
    if (deduping) {
      clearTimeout(dupes[msg]);
    }
    dupes[msg] = setTimeout(() => delete dupes[msg], DEDUPE_INTERVAL);
    if (!deduping) {
      const parts = [msg];
      reason && parts.push(reason);
      (allow ? logger.logInfo : logger.logWarn).apply(logger, parts);
    }
  }
  return [
  /**
   * Register an activity control rule.
   *
   * @param {string} activity - Activity name, as defined in `activities.js`.
   * @param {string} ruleName - A name for this rule, used for logging.
   * @param {function(Object): {allow: boolean, reason?: string}} rule - Rule definition function. Takes in activity
   *        parameters as a single map; MAY return an object {allow, reason}, where allow is true/false,
   *        and reason is an optional message used for logging.
   *
   *        {allow: true} will allow this activity AS LONG AS no other rules with the same or higher priority return {allow: false};
   *        {allow: false} will deny this activity AS LONG AS no other rules with higher priority return {allow: true};
   *        Returning null/undefined has no effect - the decision is left to other rules.
   *        If no rule returns an allow value, the default is to allow the activity.
   *
   * @param {number} [priority=10] - Rule priority; lower number means higher priority.
   * @returns {function(): void} - A function that unregisters the rule when called.
   */
  function registerActivityControl(activity, ruleName, rule, priority = 10) {
    const rules = getRules(activity);
    const pos = rules.findIndex(([itemPriority]) => priority < itemPriority);
    const entry = [priority, ruleName, rule];
    rules.splice(pos < 0 ? rules.length : pos, 0, entry);
    return function () {
      const idx = rules.indexOf(entry);
      if (idx >= 0) rules.splice(idx, 1);
    };
  },
  /**
   * Test whether an activity is allowed.
   *
   * @param {string} activity activity name
   * @param {{}} params activity parameters; should be generated through the `activityParams` utility.
   * @return {boolean} true for allow, false for deny.
   */
  function isActivityAllowed(activity, params) {
    let lastPriority, foundAllow;
    for (const [priority, name, rule] of getRules(activity)) {
      if (lastPriority !== priority && foundAllow) break;
      lastPriority = priority;
      const ruleResult = runRule(activity, name, rule, params);
      if (ruleResult) {
        if (!ruleResult.allow) {
          logResult(ruleResult);
          return false;
        } else {
          foundAllow = ruleResult;
        }
      }
    }
    foundAllow && logResult(foundAllow);
    return true;
  }];
}
const [registerActivityControl, isActivityAllowed] = ruleRegistry();

/***/ },

/***/ "./src/adRendering.js"
/*!****************************!*\
  !*** ./src/adRendering.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deferRendering: () => (/* binding */ deferRendering),
/* harmony export */   getRenderingData: () => (/* binding */ getRenderingData),
/* harmony export */   getSafeRenderer: () => (/* binding */ getSafeRenderer),
/* harmony export */   handleCreativeEvent: () => (/* binding */ handleCreativeEvent),
/* harmony export */   handleNativeMessage: () => (/* binding */ handleNativeMessage),
/* harmony export */   handleRender: () => (/* binding */ handleRender),
/* harmony export */   insertLocatorFrame: () => (/* binding */ insertLocatorFrame),
/* harmony export */   markBidAsRendered: () => (/* binding */ markBidAsRendered),
/* harmony export */   markWinner: () => (/* binding */ markWinner),
/* harmony export */   markWinningBid: () => (/* binding */ markWinningBid),
/* harmony export */   renderAdDirect: () => (/* binding */ renderAdDirect),
/* harmony export */   renderIfDeferred: () => (/* binding */ renderIfDeferred)
/* harmony export */ });
/* unused harmony exports emitAdRenderFail, emitAdRenderSucceeded, emitBrowserIntervention, doRender */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _Renderer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _creativeRenderers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./creativeRenderers.js */ "./src/creativeRenderers.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _targeting_filters_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./targeting/filters.js */ "./src/targeting/filters.js");
/* harmony import */ var _eventTrackers_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./eventTrackers.js */ "./src/eventTrackers.js");
/* harmony import */ var _utils_yield_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./utils/yield.js */ "./src/utils/yield.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
















const {
  AD_RENDER_FAILED,
  AD_RENDER_SUCCEEDED,
  STALE_RENDER,
  BID_WON,
  EXPIRED_RENDER
} = _constants_js__WEBPACK_IMPORTED_MODULE_2__.EVENTS;
const {
  EXCEPTION
} = _constants_js__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON;
const markWinningBid = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (bid) {
  ((0,_eventTrackers_js__WEBPACK_IMPORTED_MODULE_13__.parseEventTrackers)(bid.eventtrackers)[_eventTrackers_js__WEBPACK_IMPORTED_MODULE_13__.EVENT_TYPE_WIN]?.[_eventTrackers_js__WEBPACK_IMPORTED_MODULE_13__.TRACKER_METHOD_IMG] || []).forEach(url => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.politeTriggerPixel)(url));
  _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(BID_WON, bid);
  _auctionManager_js__WEBPACK_IMPORTED_MODULE_6__.auctionManager.addWinningBid(bid);
});
/**
 * Emit the AD_RENDER_FAILED event.
 */
function emitAdRenderFail({
  reason,
  message,
  bid,
  id
}) {
  const data = {
    reason,
    message
  };
  if (bid) {
    data.bid = bid;
    data.adId = bid.adId;
  }
  if (id) data.adId = id;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Error rendering ad (id: ${id}): ${message}`);
  _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(AD_RENDER_FAILED, data);
}
/**
 * Emit the AD_RENDER_SUCCEEDED event.
 * (Note: Invocation of this function indicates that the render function did not generate an error, it does not guarantee that tracking for this event has occurred yet.)
 */
function emitAdRenderSucceeded({
  doc,
  bid,
  id
}) {
  const data = {
    doc,
    bid,
    adId: id
  };
  _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].callAdRenderSucceededBidder(bid.adapterCode || bid.bidder, bid);
  _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(AD_RENDER_SUCCEEDED, data);
}

/**
 * Data for the BROWSER_INTERVENTION event.
 */

/**
 * Emit the BROWSER_INTERVENTION event.
 * This event is fired when the browser blocks an ad from rendering, typically due to ad blocking software or browser security features.
 */
function emitBrowserIntervention(data) {
  const {
    bid,
    intervention
  } = data;
  _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].callOnInterventionBidder(bid.adapterCode || bid.bidder, bid, intervention);
  _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BROWSER_INTERVENTION, data);
}
function handleCreativeEvent(data, bidResponse) {
  switch (data.event) {
    case _constants_js__WEBPACK_IMPORTED_MODULE_2__.EVENTS.AD_RENDER_FAILED:
      emitAdRenderFail({
        bid: bidResponse,
        id: bidResponse.adId,
        reason: data.info.reason,
        message: data.info.message
      });
      break;
    case _constants_js__WEBPACK_IMPORTED_MODULE_2__.EVENTS.AD_RENDER_SUCCEEDED:
      emitAdRenderSucceeded({
        doc: null,
        bid: bidResponse,
        id: bidResponse.adId
      });
      break;
    case _constants_js__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BROWSER_INTERVENTION:
      emitBrowserIntervention({
        bid: bidResponse,
        adId: bidResponse.adId,
        intervention: data.intervention
      });
      break;
    default:
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Received event request for unsupported event: '${data.event}' (adId: '${bidResponse.adId}')`);
  }
}
function handleNativeMessage(data, bidResponse, {
  resizeFn,
  fireTrackers = _native_js__WEBPACK_IMPORTED_MODULE_9__.fireNativeTrackers
}) {
  switch (data.action) {
    case 'resizeNativeHeight':
      resizeFn(data.width, data.height);
      break;
    default:
      fireTrackers(data, bidResponse);
  }
}
const HANDLERS = {
  [_constants_js__WEBPACK_IMPORTED_MODULE_2__.MESSAGES.EVENT]: handleCreativeEvent
};
if (true) {
  HANDLERS[_constants_js__WEBPACK_IMPORTED_MODULE_2__.MESSAGES.NATIVE] = handleNativeMessage;
}
function creativeMessageHandler(deps) {
  return function (type, data, bidResponse) {
    if (HANDLERS.hasOwnProperty(type)) {
      HANDLERS[type](data, bidResponse, deps);
    }
  };
}
const getRenderingData = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (bidResponse, options) {
  const {
    ad,
    adUrl,
    width,
    height,
    instl
  } = prepareBidForRendering(bidResponse, options);
  return {
    ad,
    adUrl,
    width,
    height,
    instl
  };
});
function prepareBidForRendering(bidResponse, options) {
  const {
    ad,
    adUrl,
    cpm,
    originalCpm,
    safeRenderer
  } = bidResponse;
  const repl = {
    AUCTION_PRICE: originalCpm || cpm,
    CLICKTHROUGH: options?.clickUrl || ''
  };
  const result = {
    ...bidResponse,
    ad: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.replaceMacros)(ad, repl),
    adUrl: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.replaceMacros)(adUrl, repl)
  };
  if (safeRenderer) {
    result.safeRenderer = {
      ...safeRenderer,
      config: typeof safeRenderer?.getConfig === 'function' ? safeRenderer.getConfig(bidResponse) : safeRenderer?.config
    };
  }
  return result;
}
function prepareRenderingData(bidResponse, options, safeRenderer) {
  if (safeRenderer) {
    const {
      ad,
      adUrl,
      width,
      height,
      instl,
      vastXml,
      vastUrl,
      mediaType,
      safeRenderer: preparedSafeRenderer
    } = prepareBidForRendering(bidResponse, options);
    return {
      ad,
      adUrl,
      width,
      height,
      instl,
      vastXml,
      vastUrl,
      mediaType,
      safeRenderer: preparedSafeRenderer
    };
  }
  return getRenderingData(bidResponse, options);
}
const doRender = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function ({
  renderFn,
  resizeFn,
  bidResponse,
  options,
  doc,
  isMainDocument = doc === document && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.inIframe)()
}) {
  const safeRenderer = getSafeRenderer(bidResponse);
  const videoBid =  true && bidResponse.mediaType === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_5__.VIDEO;
  if ((isMainDocument || videoBid) && !safeRenderer?.url) {
    emitAdRenderFail({
      reason: _constants_js__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON.PREVENT_WRITING_ON_MAIN_DOCUMENT,
      message: videoBid ? 'Cannot render video ad without a renderer' : `renderAd was prevented from writing to the main document.`,
      bid: bidResponse,
      id: bidResponse.adId
    });
    return;
  }
  const data = prepareRenderingData(bidResponse, options, safeRenderer);
  renderFn(Object.assign({
    adId: bidResponse.adId
  }, data));
  const {
    width,
    height
  } = data;
  if ((width ?? height) != null) {
    resizeFn(width, height);
  }
});
doRender.before(function (next, args) {
  // run renderers from a high priority hook to allow the video module to insert itself between this and "normal" rendering.
  const {
    bidResponse,
    doc
  } = args;
  if ((0,_Renderer_js__WEBPACK_IMPORTED_MODULE_4__.isRendererRequired)(bidResponse.renderer) && !getSafeRenderer(bidResponse)) {
    (0,_Renderer_js__WEBPACK_IMPORTED_MODULE_4__.executeRenderer)(bidResponse.renderer, bidResponse, doc);
    emitAdRenderSucceeded({
      doc,
      bid: bidResponse,
      id: bidResponse.adId
    });
    next.bail();
  } else {
    next(args);
  }
}, 100);
function handleRender({
  renderFn,
  resizeFn,
  adId,
  options,
  bidResponse,
  doc
}) {
  if (bidResponse != null && options?.viewUrl != null) {
    bidResponse.viewUrl = options.viewUrl;
  }
  deferRendering(bidResponse, () => {
    if (bidResponse == null) {
      emitAdRenderFail({
        reason: _constants_js__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON.CANNOT_FIND_AD,
        message: `Cannot find ad '${adId}'`,
        id: adId
      });
      return;
    }
    if (bidResponse.status === _constants_js__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.RENDERED) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Ad id ${adId} has been rendered before`);
      _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(STALE_RENDER, bidResponse);
      if (_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('auctionOptions')?.suppressStaleRender) {
        return;
      }
    }
    if (!_targeting_filters_js__WEBPACK_IMPORTED_MODULE_12__.bidFilters.isBidNotExpired(bidResponse)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Ad id ${adId} has been expired`);
      _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(EXPIRED_RENDER, bidResponse);
      if (_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('auctionOptions')?.suppressExpiredRender) {
        return;
      }
    }
    try {
      doRender({
        renderFn,
        resizeFn,
        bidResponse,
        options,
        doc
      });
    } catch (e) {
      emitAdRenderFail({
        reason: _constants_js__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON.EXCEPTION,
        message: e.message,
        id: adId,
        bid: bidResponse
      });
    }
  });
}
function markBidAsRendered(bidResponse) {
  const metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_11__.useMetrics)(bidResponse.metrics);
  metrics.checkpoint('bidRender');
  metrics.timeBetween('bidWon', 'bidRender', 'render.deferred');
  metrics.timeBetween('auctionEnd', 'bidRender', 'render.pending');
  metrics.timeBetween('requestBids', 'bidRender', 'render.e2e');
  bidResponse.status = _constants_js__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.RENDERED;
}
const DEFERRED_RENDER = new WeakMap();
const WINNERS = new WeakSet();
function deferRendering(bidResponse, renderFn) {
  if (bidResponse == null) {
    // if the bid is missing, let renderFn deal with it now
    renderFn();
    return;
  }
  DEFERRED_RENDER.set(bidResponse, renderFn);
  if (!bidResponse.deferRendering) {
    renderIfDeferred(bidResponse);
  }
  markWinner(bidResponse);
}
function markWinner(bidResponse) {
  if (!WINNERS.has(bidResponse)) {
    WINNERS.add(bidResponse);
    markWinningBid(bidResponse);
  }
}
function renderIfDeferred(bidResponse) {
  const renderFn = DEFERRED_RENDER.get(bidResponse);
  if (renderFn) {
    renderFn();
    markBidAsRendered(bidResponse);
    DEFERRED_RENDER.delete(bidResponse);
  }
}
let legacyRender = false;
_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('auctionOptions', opts => {
  legacyRender = opts.auctionOptions?.legacyRender ?? false;
});
const renderAdDirect = (0,_utils_yield_js__WEBPACK_IMPORTED_MODULE_14__.yieldsIf)(() => !legacyRender, function renderAdDirect(doc, adId, options) {
  let bid;
  function fail(reason, message) {
    emitAdRenderFail(Object.assign({
      id: adId,
      bid
    }, {
      reason,
      message
    }));
  }
  function resizeFn(width, height) {
    const frame = doc.defaultView?.frameElement;
    if (frame) {
      if (width) {
        frame.width = width;
        frame.style.width && (frame.style.width = `${width}px`);
      }
      if (height) {
        frame.height = height;
        frame.style.height && (frame.style.height = `${height}px`);
      }
    }
  }
  const messageHandler = creativeMessageHandler({
    resizeFn
  });
  function waitForDocumentReady(doc) {
    return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_15__.PbPromise(resolve => {
      if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }
  function renderFn(adData) {
    // This condition was authored by a bot (Claude Code).
    // `legacyRender` is meant for creatives that break on the extra iframe added in 10.12; a safe
    // renderer's script is written against the `pbRenderInFrame` contract and expects to run inside
    // that frame, so it is never one of those. Writing the markup here would also bypass doRender's
    // PREVENT_WRITING_ON_MAIN_DOCUMENT guard: for a main-document or video bid, `safeRenderer.url`
    // is the only thing that exempted this bid from it.
    if (adData.ad && legacyRender && !getSafeRenderer(bid)) {
      doc.write(adData.ad);
      doc.close();
      emitAdRenderSucceeded({
        doc,
        bid,
        id: bid.adId
      });
    } else {
      _utils_promise_js__WEBPACK_IMPORTED_MODULE_15__.PbPromise.all([(0,_creativeRenderers_js__WEBPACK_IMPORTED_MODULE_7__.getCreativeRenderer)(bid), waitForDocumentReady(doc)]).then(([render]) => render(adData, {
        sendMessage: (type, data) => messageHandler(type, data, bid),
        mkFrame: _utils_js__WEBPACK_IMPORTED_MODULE_0__.createIframe
      }, doc.defaultView)).then(() => emitAdRenderSucceeded({
        doc,
        bid,
        id: bid.adId
      }), e => {
        fail(e?.reason || _constants_js__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON.EXCEPTION, e?.message);
        e?.stack && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(e);
      });
    }
    // TODO: this is almost certainly the wrong way to do this
    const creativeComment = document.createComment(`Creative ${bid.creativeId} served by ${bid.bidder} Prebid.js Header Bidding`);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.insertElement)(creativeComment, doc, 'html');
  }
  try {
    if (!adId || !doc) {
      fail(_constants_js__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON.MISSING_DOC_OR_ADID, `missing ${adId ? 'doc' : 'adId'}`);
    } else {
      bid = _auctionManager_js__WEBPACK_IMPORTED_MODULE_6__.auctionManager.findBidByAdId(adId);
      handleRender({
        renderFn,
        resizeFn,
        adId,
        options: {
          clickUrl: options?.clickThrough,
          viewUrl: options?.viewUrl
        },
        bidResponse: bid,
        doc
      });
    }
  } catch (e) {
    fail(EXCEPTION, e.message);
  }
});

/**
 * Insert an invisible, named iframe that can be used by creatives to locate the window Prebid is running in
 * (by looking for one that has `.frames[PB_LOCATOR]` defined).
 * This is necessary because in some situations creatives may be rendered inside nested iframes - Prebid is not necessarily
 * in the immediate parent window.
 */
function insertLocatorFrame() {
  if (!window.frames[_constants_js__WEBPACK_IMPORTED_MODULE_2__.PB_LOCATOR]) {
    if (!document.body) {
      window.requestAnimationFrame(insertLocatorFrame);
    } else {
      const frame = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvisibleIframe)();
      frame.name = _constants_js__WEBPACK_IMPORTED_MODULE_2__.PB_LOCATOR;
      document.body.appendChild(frame);
    }
  }
}
function getSafeRenderer(bidResponse) {
  return bidResponse.safeRenderer;
}

/***/ },

/***/ "./src/adUnits.js"
/*!************************!*\
  !*** ./src/adUnits.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAuctionsCounter: () => (/* binding */ getAuctionsCounter),
/* harmony export */   getBidderRequestsCounter: () => (/* binding */ getBidderRequestsCounter),
/* harmony export */   getBidderWinsCounter: () => (/* binding */ getBidderWinsCounter),
/* harmony export */   getRequestsCounter: () => (/* binding */ getRequestsCounter),
/* harmony export */   incrementAuctionsCounter: () => (/* binding */ incrementAuctionsCounter),
/* harmony export */   incrementBidderRequestsCounter: () => (/* binding */ incrementBidderRequestsCounter),
/* harmony export */   incrementBidderWinsCounter: () => (/* binding */ incrementBidderWinsCounter),
/* harmony export */   incrementRequestsCounter: () => (/* binding */ incrementRequestsCounter)
/* harmony export */ });
/* unused harmony export reset */
/**
 * Configuration for the creative SafeRenderer (iframe script URL + optional config, resolved at render time).
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

/**
 * Ad unit objects generated by Prebid (as opposed to the definitions provided by the publisher)
 * can have a placeholder "null" bidder to represent s2s-only stored requests.
 */

const REQUESTS = 'requests';
const WINS = 'wins';
const AUCTIONS = 'auctions';
let adUnits = {};
function reset() {
  adUnits = {};
}
function ensureAdUnit(adunit, bidderCode) {
  const adUnit = adUnits[adunit] = adUnits[adunit] || {
    bidders: {}
  };
  if (bidderCode) {
    adUnit.bidders[bidderCode] = adUnit.bidders[bidderCode] || {};
    return adUnit.bidders[bidderCode];
  }
  return adUnit;
}
function incrementer(counter, byBidder) {
  return function (adUnit, bidder) {
    const counters = ensureAdUnit(adUnit, byBidder && bidder);
    counters[counter] = (counters[counter] ?? 0) + 1;
    return counters[counter];
  };
}
function getter(counter, byBidder) {
  return function (adUnit, bidder) {
    return ensureAdUnit(adUnit, byBidder && bidder)[counter] ?? 0;
  };
}

/**
 * Increments and returns current Adunit counter
 */
const incrementRequestsCounter = incrementer(REQUESTS, false);

/**
 * Increments and returns current Adunit requests counter for a bidder
 */
const incrementBidderRequestsCounter = incrementer(REQUESTS, true);

/**
 * Increments and returns current Adunit wins counter for a bidder
 */
const incrementBidderWinsCounter = incrementer(WINS, true);

/**
 * Increments and returns current Adunit auctions counter
 */
const incrementAuctionsCounter = incrementer(AUCTIONS, false);

/**
 * Returns current Adunit counter
 */
const getRequestsCounter = getter(REQUESTS, false);

/**
 * Returns current Adunit requests counter for a specific bidder code
 */
const getBidderRequestsCounter = getter(REQUESTS, true);

/**
 * Returns current Adunit requests counter for a specific bidder code
 */
const getBidderWinsCounter = getter(WINS, true);

/**
 * Returns current Adunit auctions counter
 */
const getAuctionsCounter = getter(AUCTIONS, false);

/***/ },

/***/ "./src/adapter.js"
/*!************************!*\
  !*** ./src/adapter.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Adapter)
/* harmony export */ });
function Adapter(code) {
  var bidderCode = code;
  function setBidderCode(code) {
    bidderCode = code;
  }
  function getBidderCode() {
    return bidderCode;
  }
  function callBids() {}
  return {
    callBids: callBids,
    setBidderCode: setBidderCode,
    getBidderCode: getBidderCode
  };
}

/***/ },

/***/ "./src/adapterManager.js"
/*!*******************************!*\
  !*** ./src/adapterManager.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activityParams: () => (/* binding */ activityParams),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getS2SBidderSet: () => (/* binding */ getS2SBidderSet)
/* harmony export */ });
/* unused harmony exports PBS_ADAPTER_NAME, PARTITIONS, dep, s2sActivityParams, filterBidsForAdUnit, setupAdUnitMediaTypes, _partitionBidders, partitionBidders */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _ajax_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ajax.js */ "./src/ajax.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _adUnits_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./adUnits.js */ "./src/adUnits.js");
/* harmony import */ var _refererDetection_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./refererDetection.js */ "./src/refererDetection.js");
/* harmony import */ var _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_params_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _activities_redactor_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./activities/redactor.js */ "./src/activities/redactor.js");
/* harmony import */ var _eventTrackers_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./eventTrackers.js */ "./src/eventTrackers.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/** @module adaptermanger */






















const PBS_ADAPTER_NAME = 'pbsBidAdapter';
const PARTITIONS = {
  CLIENT: 'client',
  SERVER: 'server'
};
const dep = {
  isAllowed: _activities_rules_js__WEBPACK_IMPORTED_MODULE_15__.isActivityAllowed,
  redact: _activities_redactor_js__WEBPACK_IMPORTED_MODULE_18__.redactor
};
const _bidderRegistry = {};
const _aliasRegistry = {};
const _analyticsRegistry = {};
let _s2sConfigs = [];
_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('s2sConfig', config => {
  if (config && config.s2sConfig) {
    _s2sConfigs = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(config.s2sConfig) ? config.s2sConfig : [config.s2sConfig];
  }
});
const activityParams = (0,_activities_params_js__WEBPACK_IMPORTED_MODULE_17__.activityParamsBuilder)(alias => adapterManager.resolveAlias(alias));
function getConfigName(s2sConfig) {
  // According to our docs, "module" bid (stored impressions)
  // have params.configName referring to s2sConfig.name,
  // but for a long while this was checking against s2sConfig.configName.
  // Keep allowing s2sConfig.configName to avoid the breaking change
  return s2sConfig.configName ?? s2sConfig.name;
}
function s2sActivityParams(s2sConfig) {
  return activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_PREBID, PBS_ADAPTER_NAME, {
    [_activities_params_js__WEBPACK_IMPORTED_MODULE_17__.ACTIVITY_PARAM_S2S_NAME]: getConfigName(s2sConfig)
  });
}
const ADUNIT_BID_PROPERTIES = ['nativeParams', 'nativeOrtbRequest', 'renderer', 'element'];
function getBids({
  bidderCode,
  auctionId,
  bidderRequestId,
  adUnits,
  src,
  metrics,
  getTid
}) {
  return adUnits.reduce((result, adUnit) => {
    const bids = adUnit.bids.filter(bid => bid.bidder === bidderCode);
    if (bidderCode == null && bids.length === 0 && adUnit.s2sBid != null) {
      bids.push({
        bidder: null
      });
    }
    result.push(bids.reduce((bids, bid) => {
      const [tid, tidSource] = getTid(bid.bidder, adUnit.transactionId, bid.ortb2Imp?.ext?.tid ?? adUnit.ortb2Imp?.ext?.tid);
      bid = Object.assign({}, bid, {
        ortb2Imp: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({}, adUnit.ortb2Imp, bid.ortb2Imp, {
          ext: {
            tid,
            tidSource
          }
        })
      }, (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getDefinedParams)(adUnit, ADUNIT_BID_PROPERTIES));
      const mediaTypes = bid.mediaTypes == null ? adUnit.mediaTypes : bid.mediaTypes;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isValidMediaTypes)(mediaTypes)) {
        bid = Object.assign({}, bid, {
          mediaTypes
        });
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`mediaTypes is not correctly configured for adunit ${adUnit.code}`);
      }
      if (src === 'client') {
        (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.incrementBidderRequestsCounter)(adUnit.code, bidderCode);
      }
      bids.push(Object.assign({}, bid, {
        adUnitCode: adUnit.code,
        transactionId: adUnit.transactionId,
        adUnitId: adUnit.adUnitId,
        sizes: mediaTypes?.banner?.sizes || mediaTypes?.video?.playerSize || [],
        bidId: bid.bid_id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)(),
        bidderRequestId,
        auctionId,
        src,
        metrics,
        auctionsCount: (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.getAuctionsCounter)(adUnit.code),
        bidRequestsCount: (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.getRequestsCounter)(adUnit.code),
        bidderRequestsCount: (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.getBidderRequestsCounter)(adUnit.code, bid.bidder),
        bidderWinsCount: (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.getBidderWinsCounter)(adUnit.code, bid.bidder),
        deferBilling: !!adUnit.deferBilling
      }));
      return bids;
    }, []));
    return result;
  }, []).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten, []).filter(val => val !== '');
}

/**
 * Filter an adUnit's  bids for building client and/or server requests
 *
 * @param bids an array of bids as defined in an adUnit
 * @param s2sConfig null if the adUnit is being routed to a client adapter; otherwise the s2s adapter's config
 * @returns the subset of `bids` that are pertinent for the given `s2sConfig`
 */
const filterBidsForAdUnit = (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('sync', function (bids, s2sConfig, {
  getS2SBidders = getS2SBidderSet
} = {}) {
  if (s2sConfig == null) {
    return bids;
  } else {
    const serverBidders = getS2SBidders(s2sConfig);
    return bids.filter(bid => {
      if (!serverBidders.has(bid.bidder)) return false;
      if (bid.s2sConfigName == null) return true;
      const configName = getConfigName(s2sConfig);
      const allowedS2SConfigs = Array.isArray(bid.s2sConfigName) ? bid.s2sConfigName : [bid.s2sConfigName];
      return allowedS2SConfigs.includes(configName);
    });
  }
}, 'filterBidsForAdUnit');
function getAdUnitCopyForPrebidServer(adUnits, s2sConfig) {
  let adUnitsCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(adUnits);
  let hasModuleBids = false;
  adUnitsCopy.forEach(adUnit => {
    // filter out client side bids
    const s2sBids = adUnit.bids.filter(b => b.module === PBS_ADAPTER_NAME && b.params?.configName === getConfigName(s2sConfig));
    if (s2sBids.length === 1) {
      adUnit.s2sBid = s2sBids[0];
      hasModuleBids = true;
      adUnit.ortb2Imp = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({}, adUnit.s2sBid.ortb2Imp, adUnit.ortb2Imp);
    } else if (s2sBids.length > 1) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('Multiple "module" bids for the same s2s configuration; all will be ignored', s2sBids);
    }
    adUnit.bids = filterBidsForAdUnit(adUnit.bids, s2sConfig).map(bid => {
      bid.bid_id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getUniqueIdentifierStr)();
      return bid;
    });
  });
  adUnitsCopy = adUnitsCopy.filter(adUnit => {
    if (s2sConfig.filterBidderlessCalls) {
      if (adUnit.bids.length === 1 && adUnit.bids[0].bidder == null) return false;
    }
    return adUnit.bids.length !== 0 || adUnit.s2sBid != null;
  });

  // don't send empty requests
  return {
    adUnits: adUnitsCopy,
    hasModuleBids
  };
}
function getAdUnitCopyForClientAdapters(adUnits) {
  let adUnitsClientCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(adUnits);
  adUnitsClientCopy.forEach(adUnit => {
    adUnit.bids = filterBidsForAdUnit(adUnit.bids, null);
  });

  // don't send empty requests
  adUnitsClientCopy = adUnitsClientCopy.filter(adUnit => {
    return adUnit.bids.length !== 0;
  });
  return adUnitsClientCopy;
}

/**
 * Filter and/or modify media types for ad units based on the given labels.
 *
 * This should return adUnits that are active for the given labels, modified to have their `mediaTypes`
 * conform to size mapping configuration. If different bids for the same adUnit should use different `mediaTypes`,
 * they should be exposed under `adUnit.bids[].mediaTypes`.
 */
const setupAdUnitMediaTypes = (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('sync', (adUnits, labels) => {
  return adUnits;
}, 'setupAdUnitMediaTypes');

/**
 * @param {{}|Array<{}>} s2sConfigs
 * @returns {Set<String>} a set of all the bidder codes that should be routed through the S2S adapter(s)
 *                        as defined in `s2sConfigs`
 */
function getS2SBidderSet(s2sConfigs) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(s2sConfigs)) s2sConfigs = [s2sConfigs];
  // `null` represents the "no bid bidder" - when an ad unit is meant only for S2S adapters, like stored impressions
  const serverBidders = new Set([null]);
  s2sConfigs.filter(s2s => s2s && s2s.enabled).flatMap(s2s => s2s.bidders).forEach(bidder => serverBidders.add(bidder));
  return serverBidders;
}

/**
 * @param {Array} adUnits - The ad units to be processed.
 * @param {Object} s2sConfigs - The server-to-server configurations.
 * @returns {Object} - An object containing arrays of bidder codes for client and server.
 * @returns {Object} return.client - Array of bidder codes that should be routed to client adapters.
 * @returns {Object} return.server - Array of bidder codes that should be routed to server adapters.
 */
function _partitionBidders(adUnits, s2sConfigs, {
  getS2SBidders = getS2SBidderSet
} = {}) {
  const serverBidders = getS2SBidders(s2sConfigs);
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getBidderCodes)(adUnits).reduce((memo, bidder) => {
    const partition = serverBidders.has(bidder) ? PARTITIONS.SERVER : PARTITIONS.CLIENT;
    memo[partition].push(bidder);
    return memo;
  }, {
    [PARTITIONS.CLIENT]: [],
    [PARTITIONS.SERVER]: []
  });
}
const partitionBidders = (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('sync', _partitionBidders, 'partitionBidders');
function tidFactory() {
  const consistent = !!_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('consistentTIDs');
  let tidSource, getTid;
  if (consistent) {
    tidSource = 'pbjsStable';
    getTid = saneTid => saneTid;
  } else {
    tidSource = 'pbjs';
    getTid = (() => {
      const tids = {};
      return (saneTid, bidderCode) => {
        if (!tids.hasOwnProperty(bidderCode)) {
          tids[bidderCode] = {};
        }
        if (!tids[bidderCode].hasOwnProperty(saneTid)) {
          tids[bidderCode][saneTid] = `u${(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)()}`;
        }
        return tids[bidderCode][saneTid];
      };
    })();
  }
  return function (bidderCode, saneTid, fpdTid) {
    return [fpdTid ?? getTid(saneTid, bidderCode), fpdTid != null ? 'pub' : tidSource];
  };
}
function isAnalyticsAllowed(analyticsConfig) {
  return dep.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_16__.ACTIVITY_REPORT_ANALYTICS, activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_ANALYTICS, analyticsConfig.provider, {
    [_activities_params_js__WEBPACK_IMPORTED_MODULE_17__.ACTIVITY_PARAM_ANL_CONFIG]: analyticsConfig
  }));
}
const adapterManager = {
  bidderRegistry: _bidderRegistry,
  analyticsRegistry: _analyticsRegistry,
  /**
   * Map from alias codes to the bidder code they alias.
   */
  aliasRegistry: _aliasRegistry,
  makeBidRequests: (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('sync', function (adUnits, auctionStart, auctionId, cbTimeout, labels, ortb2Fragments = {}, auctionMetrics) {
    auctionMetrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_12__.useMetrics)(auctionMetrics);
    /**
     * emit and pass adunits for external modification
     * @see {@link https://github.com/prebid/Prebid.js/issues/4149|Issue}
     */
    _events_js__WEBPACK_IMPORTED_MODULE_10__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_11__.EVENTS.BEFORE_REQUEST_BIDS, adUnits);
    if (true) {
      (0,_native_js__WEBPACK_IMPORTED_MODULE_2__.decorateAdUnitsWithNativeParams)(adUnits);
    }
    adUnits.map(adUnit => adUnit.code).filter(_utils_js__WEBPACK_IMPORTED_MODULE_0__.uniques).forEach(_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.incrementAuctionsCounter);
    const ortb2 = ortb2Fragments.global || {};
    const bidderOrtb2 = ortb2Fragments.bidder || {};
    const getTid = tidFactory();
    const getCacheKey = (bidderCode, s2sActivityParams) => {
      const s2sName = s2sActivityParams != null ? s2sActivityParams[_activities_params_js__WEBPACK_IMPORTED_MODULE_17__.ACTIVITY_PARAM_S2S_NAME] : '';
      return s2sName ? `${bidderCode}:${s2sName}` : `${bidderCode}:`;
    };
    const mergeBidderFpd = (() => {
      const fpdCache = {};
      return function (auctionId, bidderCode, s2sActivityParams) {
        const cacheKey = getCacheKey(bidderCode, s2sActivityParams);
        const redact = dep.redact(s2sActivityParams != null ? s2sActivityParams : activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_BIDDER, bidderCode));
        if (fpdCache[cacheKey] !== undefined) {
          return [fpdCache[cacheKey], redact];
        }
        const [tid, tidSource] = getTid(bidderCode, auctionId, bidderOrtb2[bidderCode]?.source?.tid ?? ortb2.source?.tid);
        const fpd = Object.freeze(redact.ortb2((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({}, ortb2, bidderOrtb2[bidderCode], {
          source: {
            tid,
            ext: {
              tidSource
            }
          }
        })));
        fpdCache[cacheKey] = fpd;
        return [fpd, redact];
      };
    })();
    let {
      [PARTITIONS.CLIENT]: clientBidders,
      [PARTITIONS.SERVER]: serverBidders
    } = partitionBidders(adUnits, _s2sConfigs);
    const allowedBidders = new Set();
    adUnits.forEach(au => {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(au.mediaTypes)) {
        au.mediaTypes = {};
      }

      // filter out bidders that cannot participate in the auction
      au.bids = au.bids.filter(bid => {
        if (!bid.bidder) {
          return true;
        }
        const [ortb2] = mergeBidderFpd(auctionId, bid.bidder);
        const isS2S = serverBidders.includes(bid.bidder) && !clientBidders.includes(bid.bidder);
        return dep.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_16__.ACTIVITY_FETCH_BIDS, activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_BIDDER, bid.bidder, {
          bid,
          ortb2,
          adUnit: au,
          auctionId,
          isS2S
        }));
      });
      au.bids.forEach(bid => {
        allowedBidders.add(bid.bidder);
      });
      (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.incrementRequestsCounter)(au.code);
    });
    clientBidders = clientBidders.filter(bidder => allowedBidders.has(bidder));
    serverBidders = serverBidders.filter(bidder => allowedBidders.has(bidder));
    adUnits = setupAdUnitMediaTypes(adUnits, labels);
    if (_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('bidderSequence') === _config_js__WEBPACK_IMPORTED_MODULE_5__.RANDOM) {
      clientBidders = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.shuffle)(clientBidders);
    }
    const refererInfo = (0,_refererDetection_js__WEBPACK_IMPORTED_MODULE_8__.getRefererInfo)();
    const bidRequests = [];
    function addOrtb2(bidderRequest, s2sActivityParams) {
      const [fpd, redact] = mergeBidderFpd(bidderRequest.auctionId, bidderRequest.bidderCode, s2sActivityParams);
      bidderRequest.ortb2 = fpd;
      bidderRequest.bids = bidderRequest.bids.map(bid => {
        bid.ortb2 = fpd;
        return redact.bidRequest(bid);
      });
      return bidderRequest;
    }
    const pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_20__.getGlobal)();
    function getPageViewIdForBidder(bidderCode) {
      if (!pbjsInstance.pageViewIdPerBidder.has(bidderCode)) {
        pbjsInstance.pageViewIdPerBidder.set(bidderCode, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)());
      }
      return pbjsInstance.pageViewIdPerBidder.get(bidderCode);
    }
    _s2sConfigs.forEach(s2sConfig => {
      const s2sParams = s2sActivityParams(s2sConfig);
      if (s2sConfig && s2sConfig.enabled && dep.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_16__.ACTIVITY_FETCH_BIDS, s2sParams)) {
        const {
          adUnits: adUnitsS2SCopy,
          hasModuleBids
        } = getAdUnitCopyForPrebidServer(adUnits, s2sConfig);

        // uniquePbsTid is so we know which server to send which bids to during the callBids function
        const uniquePbsTid = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)();
        (serverBidders.length === 0 && hasModuleBids ? [null] : serverBidders).forEach(bidderCode => {
          const bidderRequestId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)();
          const pageViewId = getPageViewIdForBidder(bidderCode);
          const metrics = auctionMetrics.fork();
          const bidderRequest = addOrtb2({
            bidderCode,
            auctionId,
            bidderRequestId,
            pageViewId,
            uniquePbsTid,
            bids: getBids({
              bidderCode,
              auctionId,
              bidderRequestId,
              'adUnits': (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(adUnitsS2SCopy),
              src: _constants_js__WEBPACK_IMPORTED_MODULE_11__.S2S.SRC,
              metrics,
              getTid
            }),
            auctionStart: auctionStart,
            timeout: s2sConfig.timeout,
            src: _constants_js__WEBPACK_IMPORTED_MODULE_11__.S2S.SRC,
            refererInfo,
            metrics,
            alwaysHasCapacity: s2sConfig.alwaysHasCapacity
          }, s2sParams);
          if (bidderRequest.bids.length !== 0) {
            bidRequests.push(bidderRequest);
          }
        });

        // update the s2sAdUnits object and remove all bids that didn't pass sizeConfig/label checks from getBids()
        // this is to keep consistency and only allow bids/adunits that passed the checks to go to pbs
        adUnitsS2SCopy.forEach(adUnitCopy => {
          const validBids = adUnitCopy.bids.filter(adUnitBid => bidRequests.find(request => request.bids.find(reqBid => reqBid.bidId === adUnitBid.bid_id)));
          adUnitCopy.bids = validBids;
        });
        bidRequests.forEach(request => {
          if (request.adUnitsS2SCopy === undefined) {
            request.adUnitsS2SCopy = adUnitsS2SCopy.filter(au => au.bids.length > 0 || au.s2sBid != null);
          }
        });
      }
    });

    // client adapters
    const adUnitsClientCopy = getAdUnitCopyForClientAdapters(adUnits);
    clientBidders.forEach(bidderCode => {
      const bidderRequestId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)();
      const pageViewId = getPageViewIdForBidder(bidderCode);
      const metrics = auctionMetrics.fork();
      const adapter = _bidderRegistry[bidderCode];
      const bidderRequest = addOrtb2({
        bidderCode,
        auctionId,
        pageViewId,
        bidderRequestId,
        bids: getBids({
          bidderCode,
          auctionId,
          bidderRequestId,
          'adUnits': (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(adUnitsClientCopy),
          src: 'client',
          metrics,
          getTid
        }),
        auctionStart: auctionStart,
        timeout: cbTimeout,
        refererInfo,
        metrics,
        src: 'client',
        alwaysHasCapacity: adapter?.getSpec?.().alwaysHasCapacity
      });
      if (!adapter) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Trying to make a request for bidder that does not exist: ${bidderCode}`);
      }
      if (adapter && bidderRequest.bids && bidderRequest.bids.length !== 0) {
        bidRequests.push(bidderRequest);
      }
    });
    bidRequests.forEach(bidRequest => {
      if (_consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.gdprDataHandler.getConsentData()) {
        bidRequest['gdprConsent'] = _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.gdprDataHandler.getConsentData();
      }
      if (_consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.uspDataHandler.getConsentData()) {
        bidRequest['uspConsent'] = _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.uspDataHandler.getConsentData();
      }
      if (_consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.gppDataHandler.getConsentData()) {
        bidRequest['gppConsent'] = _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.gppDataHandler.getConsentData();
      }
    });
    return bidRequests;
  }, 'makeBidRequests'),
  callBids(adUnits, bidRequests, addBidResponse, doneCb, requestCallbacks, requestBidsTimeout, onTimelyResponse, ortb2Fragments = {}) {
    if (!bidRequests.length) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('callBids executed with no bidRequests.  Were they filtered by labels or sizing?');
      return;
    }
    const [clientBidderRequests, serverBidderRequests] = bidRequests.reduce((partitions, bidRequest) => {
      partitions[Number(typeof bidRequest.src !== 'undefined' && bidRequest.src === _constants_js__WEBPACK_IMPORTED_MODULE_11__.S2S.SRC)].push(bidRequest);
      return partitions;
    }, [[], []]);
    var uniqueServerBidRequests = [];
    serverBidderRequests.forEach(serverBidRequest => {
      var index = -1;
      for (var i = 0; i < uniqueServerBidRequests.length; ++i) {
        if (serverBidRequest.uniquePbsTid === uniqueServerBidRequests[i].uniquePbsTid) {
          index = i;
          break;
        }
      }
      if (index <= -1) {
        uniqueServerBidRequests.push(serverBidRequest);
      }
    });
    let counter = 0;
    _s2sConfigs.forEach(s2sConfig => {
      if (s2sConfig && uniqueServerBidRequests[counter] && getS2SBidderSet(s2sConfig).has(uniqueServerBidRequests[counter].bidderCode)) {
        // s2s should get the same client side timeout as other client side requests.
        const s2sAjax = (0,_ajax_js__WEBPACK_IMPORTED_MODULE_4__.qualifiedAjaxBuilder)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_PREBID, PBS_ADAPTER_NAME, requestBidsTimeout, requestCallbacks ? {
          request: requestCallbacks.request.bind(null, 's2s'),
          done: requestCallbacks.done
        } : undefined);
        const adaptersServerSide = s2sConfig.bidders;
        const s2sAdapter = _bidderRegistry[s2sConfig.adapter];
        const uniquePbsTid = uniqueServerBidRequests[counter].uniquePbsTid;
        const adUnitsS2SCopy = uniqueServerBidRequests[counter].adUnitsS2SCopy;
        const uniqueServerRequests = serverBidderRequests.filter(serverBidRequest => serverBidRequest.uniquePbsTid === uniquePbsTid);
        if (s2sAdapter) {
          const s2sBidRequest = {
            'ad_units': adUnitsS2SCopy,
            s2sConfig,
            ortb2Fragments,
            requestBidsTimeout
          };
          if (s2sBidRequest.ad_units.length) {
            const doneCbs = uniqueServerRequests.map(bidRequest => {
              bidRequest.start = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.timestamp)();
              return function (timedOut, ...args) {
                if (!timedOut) {
                  onTimelyResponse(bidRequest.bidderRequestId);
                }
                doneCb.apply(bidRequest, [timedOut, ...args]);
              };
            });
            const bidders = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getBidderCodes)(s2sBidRequest.ad_units).filter(bidder => adaptersServerSide.includes(bidder));
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`CALLING S2S HEADER BIDDERS ==== ${bidders.length > 0 ? bidders.join(', ') : 'No bidder specified, using "ortb2Imp" definition(s) only'}`);

            // fire BID_REQUESTED event for each s2s bidRequest
            uniqueServerRequests.forEach(bidRequest => {
              // add the new sourceTid
              _events_js__WEBPACK_IMPORTED_MODULE_10__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_11__.EVENTS.BID_REQUESTED, {
                ...bidRequest,
                tid: bidRequest.auctionId
              });
            });

            // make bid requests
            s2sAdapter.callBids(s2sBidRequest, serverBidderRequests, addBidResponse, timedOut => doneCbs.forEach(done => done(timedOut)), s2sAjax);
          }
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('missing ' + s2sConfig.adapter);
        }
        counter++;
      }
    });

    // handle client adapter requests
    clientBidderRequests.forEach(bidderRequest => {
      bidderRequest.start = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.timestamp)();
      const adapter = _bidderRegistry[bidderRequest.bidderCode];
      _config_js__WEBPACK_IMPORTED_MODULE_5__.config.runWithBidder(bidderRequest.bidderCode, () => {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`CALLING BIDDER`);
        _events_js__WEBPACK_IMPORTED_MODULE_10__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_11__.EVENTS.BID_REQUESTED, bidderRequest);
      });
      const ajax = (0,_ajax_js__WEBPACK_IMPORTED_MODULE_4__.qualifiedAjaxBuilder)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_BIDDER, bidderRequest.bidderCode, requestBidsTimeout, requestCallbacks ? {
        request: requestCallbacks.request.bind(null, bidderRequest.bidderCode),
        done: requestCallbacks.done
      } : undefined);
      const adapterDone = doneCb.bind(bidderRequest);
      try {
        _config_js__WEBPACK_IMPORTED_MODULE_5__.config.runWithBidder(bidderRequest.bidderCode, adapter.callBids.bind(adapter, bidderRequest, addBidResponse, adapterDone, ajax, () => onTimelyResponse(bidderRequest.bidderRequestId), _config_js__WEBPACK_IMPORTED_MODULE_5__.config.callbackWithBidder(bidderRequest.bidderCode)));
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`${bidderRequest.bidderCode} Bid Adapter emitted an uncaught error when parsing their bidRequest`, {
          e,
          bidRequest: bidderRequest
        });
        adapterDone();
      }
    });
  },
  videoAdapters: [],
  registerBidAdapter(bidAdapter, bidderCode, {
    supportedMediaTypes = []
  } = {}) {
    if (bidAdapter && bidderCode) {
      if (typeof bidAdapter.callBids === 'function') {
        _bidderRegistry[bidderCode] = bidAdapter;
        _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.GDPR_GVLIDS.register(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_BIDDER, bidderCode, bidAdapter.getSpec?.().gvlid);
        if ( true && supportedMediaTypes.includes('video')) {
          adapterManager.videoAdapters.push(bidderCode);
        }
        if ( true && supportedMediaTypes.includes('native')) {
          _native_js__WEBPACK_IMPORTED_MODULE_2__.nativeAdapters.push(bidderCode);
        }
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Bidder adaptor error for bidder code: ' + bidderCode + 'bidder must implement a callBids() function');
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('bidAdapter or bidderCode not specified');
    }
  },
  aliasBidAdapter(bidderCode, alias, options) {
    const existingAlias = _bidderRegistry[alias];
    if (typeof existingAlias === 'undefined') {
      const bidAdapter = _bidderRegistry[bidderCode];
      if (typeof bidAdapter === 'undefined') {
        // check if alias is part of s2sConfig and allow them to register if so (as base bidder may be s2s-only)
        const nonS2SAlias = [];
        _s2sConfigs.forEach(s2sConfig => {
          if (s2sConfig.bidders && s2sConfig.bidders.length) {
            const s2sBidders = s2sConfig && s2sConfig.bidders;
            if (!(s2sConfig && s2sBidders.includes(alias))) {
              nonS2SAlias.push(bidderCode);
            } else {
              _aliasRegistry[alias] = bidderCode;
            }
          }
        });
        nonS2SAlias.forEach(bidderCode => {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('bidderCode "' + bidderCode + '" is not an existing bidder.', 'adapterManager.aliasBidAdapter');
        });
      } else {
        try {
          let newAdapter;
          const supportedMediaTypes = getSupportedMediaTypes(bidderCode);
          // Have kept old code to support backward compatibilitiy.
          // Remove this if loop when all adapters are supporting bidderFactory. i.e When Prebid.js is 1.0
          if (bidAdapter.constructor.prototype !== Object.prototype) {
            newAdapter = new bidAdapter.constructor();
            newAdapter.setBidderCode(alias);
          } else {
            const {
              useBaseGvlid = false
            } = options || {};
            const spec = bidAdapter.getSpec();
            const gvlid = useBaseGvlid ? spec.gvlid : options?.gvlid;
            if (gvlid == null && spec.gvlid != null) {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Alias '${alias}' will NOT re-use the GVL ID of the original adapter ('${spec.code}', gvlid: ${spec.gvlid}). Functionality that requires TCF consent may not work as expected.`);
            }
            const skipPbsAliasing = options && options.skipPbsAliasing;
            newAdapter = (0,_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_3__.newBidder)(Object.assign({}, spec, {
              code: alias,
              gvlid,
              skipPbsAliasing
            }));
            _aliasRegistry[alias] = bidderCode;
          }
          adapterManager.registerBidAdapter(newAdapter, alias, {
            supportedMediaTypes
          });
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(bidderCode + ' bidder does not currently support aliasing.', 'adapterManager.aliasBidAdapter');
        }
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)('alias name "' + alias + '" has been already specified.');
    }
  },
  resolveAlias(alias) {
    let code = alias;
    let visited;
    while (_aliasRegistry[code] && (!visited || !visited.has(code))) {
      code = _aliasRegistry[code];
      (visited = visited || new Set()).add(code);
    }
    return code;
  },
  registerAnalyticsAdapter({
    adapter,
    code,
    gvlid
  }) {
    if (adapter && code) {
      if (typeof adapter.enableAnalytics === 'function') {
        adapter.code = code;
        _analyticsRegistry[code] = {
          adapter,
          gvlid
        };
        _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.GDPR_GVLIDS.register(_activities_modules_js__WEBPACK_IMPORTED_MODULE_14__.MODULE_TYPE_ANALYTICS, code, gvlid);
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Prebid Error: Analytics adaptor error for analytics "${code}"
        analytics adapter must implement an enableAnalytics() function`);
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Prebid Error: analyticsAdapter or analyticsCode not specified');
    }
  },
  enableAnalytics(config) {
    (Array.isArray(config) ? config : [config]).forEach(adapterConfig => {
      const entry = _analyticsRegistry[adapterConfig.provider];
      if (entry && entry.adapter) {
        entry.config = adapterConfig;
        if (isAnalyticsAllowed(adapterConfig)) {
          try {
            // the registry is keyed by provider name, which loses the tie between an adapter and
            // the configuration type it declared; the two do match, having been registered together
            entry.adapter.enableAnalytics(adapterConfig);
            entry.enabled = true;
          } catch (e) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Could not enable '${adapterConfig.provider}' analytics`, e);
          }
        }
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Prebid Error: no analytics adapter found in registry for '${adapterConfig.provider}'.`);
      }
    });
  },
  disableAnalytics(adapterCode) {
    const entry = _analyticsRegistry[adapterCode];
    if (entry && entry.enabled) {
      if (typeof entry.adapter.disableAnalytics === 'function') {
        try {
          entry.adapter.disableAnalytics();
          entry.enabled = false;
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Could not disable '${adapterCode}' analytics`, e);
        }
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Could not disable '${adapterCode}' analytics: adapter does not provide a 'disableAnalytics' method`);
      }
    }
  },
  refreshAnalytics() {
    Object.entries(_analyticsRegistry).forEach(([code, entry]) => {
      const {
        enabled,
        config
      } = entry;
      if (enabled && !isAnalyticsAllowed(config)) {
        adapterManager.disableAnalytics(code);
      } else if (!enabled && config != null) {
        adapterManager.enableAnalytics(config);
      }
    });
  },
  getBidAdapter(bidder) {
    return _bidderRegistry[bidder];
  },
  getAnalyticsAdapter(code) {
    return _analyticsRegistry[code];
  },
  callTimedOutBidders(adUnits, timedOutBidders, cbTimeout) {
    timedOutBidders = timedOutBidders.map(timedOutBidder => {
      // Adding user configured params & timeout to timeout event data
      timedOutBidder.params = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getUserConfiguredParams)(adUnits, timedOutBidder.adUnitCode, timedOutBidder.bidder);
      timedOutBidder.timeout = cbTimeout;
      return timedOutBidder;
    });
    timedOutBidders = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.groupBy)(timedOutBidders, 'bidder');
    Object.keys(timedOutBidders).forEach(bidder => {
      tryCallBidderMethod(bidder, 'onTimeout', timedOutBidders[bidder]);
    });
  },
  callBidWonBidder(bidder, bid, adUnits) {
    // Adding user configured params to bidWon event data
    bid.params = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getUserConfiguredParams)(adUnits, bid.adUnitCode, bid.bidder);
    (0,_adUnits_js__WEBPACK_IMPORTED_MODULE_7__.incrementBidderWinsCounter)(bid.adUnitCode, bid.bidder);
    tryCallBidderMethod(bidder, 'onBidWon', bid);
  },
  triggerBilling: (() => {
    const BILLED = new WeakSet();
    return bid => {
      if (!BILLED.has(bid)) {
        BILLED.add(bid);
        ((0,_eventTrackers_js__WEBPACK_IMPORTED_MODULE_19__.parseEventTrackers)(bid.eventtrackers)[_eventTrackers_js__WEBPACK_IMPORTED_MODULE_19__.EVENT_TYPE_IMPRESSION]?.[_eventTrackers_js__WEBPACK_IMPORTED_MODULE_19__.TRACKER_METHOD_IMG] || []).forEach(url => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.politeTriggerPixel)(url));
        tryCallBidderMethod(bid.bidder, 'onBidBillable', bid);
      }
    };
  })(),
  callSetTargetingBidder(bidder, bid) {
    tryCallBidderMethod(bidder, 'onSetTargeting', bid);
  },
  callBidViewableBidder(bidder, bid) {
    tryCallBidderMethod(bidder, 'onBidViewable', bid);
  },
  callBidderError(bidder, error, bidderRequest) {
    const param = {
      error,
      bidderRequest
    };
    tryCallBidderMethod(bidder, 'onBidderError', param);
  },
  callAdRenderSucceededBidder(bidder, bid) {
    tryCallBidderMethod(bidder, 'onAdRenderSucceeded', bid);
  },
  callOnInterventionBidder(bidder, bid, intervention) {
    const param = {
      bid,
      intervention
    };
    tryCallBidderMethod(bidder, 'onIntervention', param);
  },
  /**
   * Ask every adapter to delete PII.
   * See https://github.com/prebid/Prebid.js/issues/9081
   */
  callDataDeletionRequest: (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('sync', function (...args) {
    const method = 'onDataDeletionRequest';
    Object.keys(_bidderRegistry).filter(bidder => !_aliasRegistry.hasOwnProperty(bidder)).forEach(bidder => {
      const target = getBidderMethod(bidder, method);
      if (target != null) {
        const bidderRequests = _auctionManager_js__WEBPACK_IMPORTED_MODULE_13__.auctionManager.getBidsRequested().filter(br => resolveAlias(br.bidderCode) === bidder);
        invokeBidderMethod(bidder, method, ...target, bidderRequests, ...args);
      }
    });
    Object.entries(_analyticsRegistry).forEach(([name, entry]) => {
      const fn = entry?.adapter?.[method];
      if (typeof fn === 'function') {
        try {
          fn.apply(entry.adapter, args);
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`error calling ${method} of ${name}`, e);
        }
      }
    });
  })
};
function getSupportedMediaTypes(bidderCode) {
  const supportedMediaTypes = [];
  if ( true && adapterManager.videoAdapters.includes(bidderCode)) supportedMediaTypes.push('video');
  if ( true && _native_js__WEBPACK_IMPORTED_MODULE_2__.nativeAdapters.includes(bidderCode)) supportedMediaTypes.push('native');
  return supportedMediaTypes;
}
function getBidderMethod(bidder, method) {
  const adapter = _bidderRegistry[bidder];
  const spec = adapter?.getSpec && adapter.getSpec();
  if (spec && spec[method] && typeof spec[method] === 'function') {
    return [spec, spec[method]];
  }
}
function invokeBidderMethod(bidder, method, spec, fn, ...params) {
  try {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)(`Invoking ${bidder}.${method}`);
    _config_js__WEBPACK_IMPORTED_MODULE_5__.config.runWithBidder(bidder, fn.bind(spec, ...params));
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Error calling ${method} of ${bidder}`);
  }
}
function tryCallBidderMethod(bidder, method, param) {
  if (param?.source !== _constants_js__WEBPACK_IMPORTED_MODULE_11__.S2S.SRC) {
    const target = getBidderMethod(bidder, method);
    if (target != null) {
      invokeBidderMethod(bidder, method, ...target, param);
    }
  }
}
function resolveAlias(alias) {
  const seen = new Set();
  while (_aliasRegistry.hasOwnProperty(alias) && !seen.has(alias)) {
    seen.add(alias);
    alias = _aliasRegistry[alias];
  }
  return alias;
}
_consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.allConsent.onChange(adapterManager.refreshAnalytics);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (adapterManager);

/***/ },

/***/ "./src/adapters/bidderFactory.js"
/*!***************************************!*\
  !*** ./src/adapters/bidderFactory.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   newBidder: () => (/* binding */ newBidder),
/* harmony export */   registerBidder: () => (/* binding */ registerBidder)
/* harmony export */ });
/* unused harmony exports guardTids, processBidderRequests, registerSyncInner, isValid, adapterMetrics */
/* harmony import */ var _adapter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../adapter.js */ "./src/adapter.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _bidfactory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _userSync_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../userSync.js */ "./src/userSync.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../native.js */ "./src/native.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../video.js */ "./src/video.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../events.js */ "./src/events.js");
/* harmony import */ var _utils_untrustedJson_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/untrustedJson.js */ "./src/utils/untrustedJson.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils.js */ "./src/utils/objects.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../hook.js */ "./src/hook.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../activities/activityParams.js */ "./src/activities/activityParams.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _consentHandler_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../consentHandler.js */ "./src/consentHandler.js");





















/**
 * This file aims to support Adapters during the Prebid 0.x -> 1.x transition.
 *
 * Prebid 1.x and Prebid 0.x will be in separate branches--perhaps for a long time.
 * This function defines an API for adapter construction which is compatible with both versions.
 * Adapters which use it can maintain their code in master, and only this file will need to change
 * in the 1.x branch.
 *
 * Typical usage looks something like:
 *
 * const adapter = registerBidder({
 *   code: 'myBidderCode',
 *   aliases: ['alias1', 'alias2'],
 *   supportedMediaTypes: ['video', 'native'],
 *   isBidRequestValid: function(paramsObject) { return true/false },
 *   buildRequests: function(bidRequests, bidderRequest) { return some ServerRequest(s) },
 *   interpretResponse: function(oneServerResponse) { return some Bids, or throw an error. }
 * });
 *
 * @see BidderSpec for the full API and more thorough descriptions.
 *
 */

/**
 * @typedef {object} ServerResponse
 *
 * @property {*} body The response body. If this is legal JSON, then it will be parsed. Otherwise it'll be a
 *   string with the body's content.
 * @property {{get: function(string): string}} headers The response headers.
 *   Call this like `ServerResponse.headers.get("Content-Type")`
 */

/**
 * @typedef {Object} SyncOptions
 *
 * An object containing information about usersyncs which the adapter should obey.
 *
 * @property {boolean} iframeEnabled True if iframe usersyncs are allowed, and false otherwise
 * @property {boolean} pixelEnabled True if image usersyncs are allowed, and false otherwise
 */

/**
 * TODO: Move this to the UserSync module after that PR is merged.
 *
 * @typedef {object} UserSync
 *
 * @property {('image'|'iframe')} type The type of user sync to be done.
 * @property {string} url The URL which makes the sync happen.
 * @property {function} [onCleanup] Releases work associated with an iframe when it is removed.
 */

// common params for all mediaTypes
const COMMON_BID_RESPONSE_KEYS = ['cpm', 'ttl', 'creativeId', 'netRevenue', 'currency'];
const TIDS = {
  auctionId: request => request.ortb2?.source?.tid,
  transactionId: request => request.ortb2Imp?.ext?.tid
};
/**
 * Register a bidder with prebid, using the given spec.
 *
 * If possible, Adapter modules should use this function instead of adapterManager.registerBidAdapter().
 *
 * @param {BidderSpec} spec An object containing the bare-bones functions we need to make a Bidder.
 */
function registerBidder(spec) {
  const mediaTypes = Array.isArray(spec.supportedMediaTypes) ? {
    supportedMediaTypes: spec.supportedMediaTypes
  } : undefined;
  function putBidder(spec) {
    const bidder = newBidder(spec);
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].registerBidAdapter(bidder, spec.code, mediaTypes);
  }
  putBidder(spec);
  if (Array.isArray(spec.aliases)) {
    spec.aliases.forEach(alias => {
      let aliasCode = alias;
      let gvlid;
      let skipPbsAliasing;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isPlainObject)(alias)) {
        aliasCode = alias.code;
        gvlid = alias.gvlid;
        skipPbsAliasing = alias.skipPbsAliasing;
      }
      _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].aliasRegistry[aliasCode] = spec.code;
      putBidder(Object.assign({}, spec, {
        code: aliasCode,
        gvlid,
        skipPbsAliasing
      }));
    });
  }
}
function makeTidGuard({
  bidderCode
}) {
  const tidsAllowed = (0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_16__.isActivityAllowed)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_19__.ACTIVITY_TRANSMIT_TID, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_17__.activityParams)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_18__.MODULE_TYPE_BIDDER, bidderCode));
  function get(target, prop, receiver) {
    if (TIDS.hasOwnProperty(prop)) {
      return tidsAllowed ? TIDS[prop](target) : null;
    }
    return Reflect.get(target, prop, receiver);
  }
  function privateAccessProxy(target, handler) {
    const proxy = new Proxy(target, handler);
    // always allow methods (such as getFloor) private access to TIDs
    Object.entries(target).filter(([_, v]) => typeof v === 'function').forEach(([prop, fn]) => {
      proxy[prop] = fn.bind(target);
    });
    return proxy;
  }
  const bidRequest = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.memoize)(br => privateAccessProxy(br, {
    get
  }), arg => arg.bidId);
  /**
   * Return a view on bidd(er) requests where auctionId/transactionId are nulled if the bidder is not allowed `transmitTid`.
   *
   * Because both auctionId and transactionId are used for Prebid's own internal bookkeeping, we cannot simply erase them
   * from request objects; and because request objects are quite complex and not easily cloneable, we hide the IDs
   * with a proxy instead. This should be used only around the adapter logic.
   */
  return {
    bidRequest,
    bidderRequest: br => privateAccessProxy(br, {
      get(target, prop, receiver) {
        if (prop === 'bids') return br.bids.map(bidRequest);
        return get(target, prop, receiver);
      }
    })
  };
}

// Guards are cached per bidderRequest, so every use of the same request sees
// the same guard: stable proxy identity, and one transmitTid activity check
// per bidder request. The cache is keyed weakly, so an entry cannot outlive
// the bidderRequest it guards.
const tidGuards = new WeakMap();
function guardTids(bidderRequest) {
  let guard = tidGuards.get(bidderRequest);
  if (guard == null) {
    guard = makeTidGuard(bidderRequest);
    tidGuards.set(bidderRequest, guard);
  }
  return guard;
}
/**
 * Make a new bidder from the given spec. This is exported mainly for testing.
 * Adapters will probably find it more convenient to use registerBidder instead.
 *
 * @param {BidderSpec} spec
 */
function newBidder(spec) {
  return Object.assign((0,_adapter_js__WEBPACK_IMPORTED_MODULE_0__["default"])(spec.code), {
    getSpec: function () {
      return Object.freeze(Object.assign({}, spec));
    },
    registerSyncs,
    callBids: function (bidderRequest, addBidResponse, done, ajax, onTimelyResponse, configEnabledCallback) {
      if (!Array.isArray(bidderRequest.bids)) {
        return;
      }
      const tidGuard = guardTids(bidderRequest);
      const adUnitCodesHandled = {};
      function addBidWithCode(adUnitCode, bid, responseMediaType = null) {
        const metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_15__.useMetrics)(bid.metrics);
        metrics.checkpoint('addBidResponse');
        adUnitCodesHandled[adUnitCode] = true;
        if (metrics.measureTime('addBidResponse.validate', () => isValid(adUnitCode, bid, {
          responseMediaType
        }))) {
          addBidResponse(adUnitCode, bid);
        } else {
          addBidResponse.reject(adUnitCode, bid, _constants_js__WEBPACK_IMPORTED_MODULE_7__.REJECTION_REASON.INVALID);
        }
      }

      // After all the responses have come back, call done() and
      // register any required usersync pixels.
      const responses = [];
      function afterAllResponses() {
        done();
        _config_js__WEBPACK_IMPORTED_MODULE_2__.config.runWithBidder(spec.code, () => {
          _events_js__WEBPACK_IMPORTED_MODULE_8__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_7__.EVENTS.BIDDER_DONE, bidderRequest);
          registerSyncs(responses, bidderRequest.gdprConsent, bidderRequest.uspConsent, bidderRequest.gppConsent);
        });
      }
      const validBidRequests = adapterMetrics(bidderRequest).measureTime('validate', () => bidderRequest.bids.filter(br => filterAndWarn(tidGuard.bidRequest(br))));
      if (validBidRequests.length === 0) {
        afterAllResponses();
        return;
      }
      const bidRequestMap = {};
      validBidRequests.forEach(bid => {
        bidRequestMap[bid.bidId] = bid;
      });
      processBidderRequests(spec, validBidRequests, bidderRequest, ajax, configEnabledCallback, {
        onRequest: requestObject => _events_js__WEBPACK_IMPORTED_MODULE_8__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_7__.EVENTS.BEFORE_BIDDER_HTTP, bidderRequest, requestObject),
        onResponse: resp => {
          onTimelyResponse(spec.code);
          responses.push(resp);
        },
        // If the server responds with an error, there's not much we can do beside logging.
        onError: (errorMessage, error) => {
          if (!error.timedOut) {
            onTimelyResponse(spec.code);
          }
          _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].callBidderError(spec.code, error, bidderRequest);
          _events_js__WEBPACK_IMPORTED_MODULE_8__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_7__.EVENTS.BIDDER_ERROR, {
            error,
            bidderRequest
          });
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(`Server call for ${spec.code} failed: ${errorMessage} ${error.status}. Continuing without bids.`, {
            bidRequests: validBidRequests
          });
        },
        onBid: bidResponse => {
          const bidRequest = bidRequestMap[bidResponse.requestId];
          const bid = bidResponse;
          if (bidRequest) {
            bid.adapterCode = bidRequest.bidder;
            if (isInvalidAlternateBidder(bidResponse.bidderCode, bidRequest.bidder)) {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)(`${bidResponse.bidderCode} is not a registered partner or known bidder of ${bidRequest.bidder}, hence continuing without bid. If you wish to support this bidder, please mark allowAlternateBidderCodes as true in bidderSettings.`);
              addBidResponse.reject(bidRequest.adUnitCode, bidResponse, _constants_js__WEBPACK_IMPORTED_MODULE_7__.REJECTION_REASON.BIDDER_DISALLOWED);
              return;
            }
            // creating a copy of original values as cpm and currency are modified later
            bid.originalCpm = bidResponse.cpm;
            bid.originalCurrency = bidResponse.currency;
            bid.meta = bidResponse.meta || Object.assign({}, bidResponse[bidRequest.bidder]);
            bid.deferBilling = bidRequest.deferBilling;
            bid.deferRendering = bid.deferBilling && (bidResponse.deferRendering ?? typeof spec.onBidBillable !== 'function');
            const prebidBid = Object.assign((0,_bidfactory_js__WEBPACK_IMPORTED_MODULE_3__.createBid)(bidRequest), bid, (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.pick)(bidRequest, Object.keys(TIDS)));
            const responseMediaType = Object.prototype.hasOwnProperty.call(bidResponse, 'mediaType') ? bidResponse.mediaType : null;
            addBidWithCode(bidRequest.adUnitCode, prebidBid, responseMediaType);
          } else {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)(`Bidder ${spec.code} made bid for unknown request ID: ${bidResponse.requestId}. Ignoring.`);
            addBidResponse.reject(null, bidResponse, _constants_js__WEBPACK_IMPORTED_MODULE_7__.REJECTION_REASON.INVALID_REQUEST_ID);
          }
        },
        onCompletion: afterAllResponses
      });
    }
  });
  function isInvalidAlternateBidder(responseBidder, requestBidder) {
    const allowAlternateBidderCodes = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_14__.bidderSettings.get(requestBidder, 'allowAlternateBidderCodes') || false;
    let alternateBiddersList = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_14__.bidderSettings.get(requestBidder, 'allowedAlternateBidderCodes');
    if (!!responseBidder && !!requestBidder && requestBidder !== responseBidder) {
      alternateBiddersList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isArray)(alternateBiddersList) ? alternateBiddersList.map(val => val.trim().toLowerCase()).filter(val => !!val).filter(_utils_js__WEBPACK_IMPORTED_MODULE_10__.uniques) : alternateBiddersList;
      if (!allowAlternateBidderCodes || (0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isArray)(alternateBiddersList) && alternateBiddersList[0] !== '*' && !alternateBiddersList.includes(responseBidder)) {
        return true;
      }
    }
    return false;
  }
  function registerSyncs(responses, gdprConsent, uspConsent, gppConsent) {
    registerSyncInner(spec, responses, gdprConsent, uspConsent, gppConsent);
  }
  function filterAndWarn(bid) {
    if (!spec.isBidRequestValid(bid)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)(`Invalid bid sent to bidder ${spec.code}: ${JSON.stringify(bid)}`);
      return false;
    }
    return true;
  }
}
const RESPONSE_PROPS = ['bids',
// allow bid adapters to still reply with paapi (which will be ignored).
'paapi'];

/**
 * Run a set of bid requests - that entails converting them to HTTP requests, sending
 * them over the network, and parsing the responses.
 *
 * @param spec bid adapter spec
 * @param bids bid requests to run
 * @param bidderRequest the bid request object that `bids` is connected to
 * @param ajax ajax method to use
 * @param wrapCallback a function used to wrap every callback (for the purpose of `config.currentBidder`)
 */
const processBidderRequests = (0,_hook_js__WEBPACK_IMPORTED_MODULE_12__.hook)('async', function (spec, bids, bidderRequest, ajax, wrapCallback, {
  onRequest,
  onResponse,
  onError,
  onBid,
  onCompletion
}) {
  const metrics = adapterMetrics(bidderRequest);
  onCompletion = metrics.startTiming('total').stopBefore(onCompletion);
  const tidGuard = guardTids(bidderRequest);
  let requests = metrics.measureTime('buildRequests', () => spec.buildRequests(bids.map(tidGuard.bidRequest), tidGuard.bidderRequest(bidderRequest)));
  if (!Array.isArray(requests)) {
    requests = [requests];
  }
  if (!requests || requests.length === 0) {
    onCompletion();
    return;
  }
  const requestDone = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.delayExecution)(onCompletion, requests.length);
  requests.forEach(request => {
    const requestMetrics = metrics.fork();
    function addBid(bid) {
      if (bid != null) bid.metrics = requestMetrics.fork().renameWith();
      onBid(bid);
    }
    // If the server responds successfully, use the adapter code to unpack the Bids from it.
    // If the adapter code fails, no bids should be added. After all the bids have been added,
    // make sure to call the `requestDone` function so that we're one step closer to calling onCompletion().
    const onSuccess = wrapCallback(function (response, responseObj) {
      networkDone?.();
      try {
        response = (0,_utils_untrustedJson_js__WEBPACK_IMPORTED_MODULE_9__.parseUntrustedJSON)(response);
      } catch (e) {/* response might not be JSON... that's ok. */}

      // Make response headers available for #1742. These are lazy-loaded because most adapters won't need them.
      response = {
        body: response,
        headers: headerParser(responseObj)
      };
      onResponse(response);
      try {
        response = requestMetrics.measureTime('interpretResponse', () => spec.interpretResponse(response, request));
      } catch (err) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(`Bidder ${spec.code} failed to interpret the server's response. Continuing without bids`, null, err);
        requestDone();
        return;
      }

      // adapters can reply with:
      // a single bid
      // an array of bids
      // a BidderAuctionResponse object

      let bids;
      if (response && !Object.keys(response).some(key => !RESPONSE_PROPS.includes(key))) {
        bids = response.bids;
      } else {
        bids = response;
      }
      if (bids) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_11__.isArray)(bids)) {
          bids.forEach(addBid);
        } else {
          addBid(bids);
        }
      }
      requestDone();
      function headerParser(xmlHttpResponse) {
        return {
          get: responseObj.getResponseHeader.bind(responseObj)
        };
      }
    });
    const onFailure = wrapCallback(function (errorMessage, error) {
      networkDone?.();
      onError(errorMessage, error);
      requestDone();
    });
    onRequest(request);
    let networkDone;
    const debugMode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.getParameterByName)(_constants_js__WEBPACK_IMPORTED_MODULE_7__.DEBUG_MODE).toUpperCase() === 'TRUE' || (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.debugTurnedOn)();
    function getOptions(defaults) {
      return Object.assign(defaults, request.options);
    }

    // start network timer here so we do not include the compression time in `net` metric
    const doAjax = (url, payload, options) => {
      networkDone = requestMetrics.startTiming('net');
      ajax(url, {
        success: onSuccess,
        error: onFailure
      }, payload, options);
    };
    switch (request.method) {
      case 'GET':
        doAjax(`${request.url}${formatGetParameters(request.data)}`, undefined, getOptions({
          method: 'GET',
          withCredentials: true
        }));
        break;
      case 'POST':
        const enableGZipCompression = request.options?.endpointCompression;
        const callAjax = ({
          url,
          payload
        }) => {
          doAjax(url, payload, getOptions({
            method: 'POST',
            contentType: 'text/plain',
            withCredentials: true
          }));
        };
        if (enableGZipCompression && debugMode) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)(`Skipping GZIP compression for ${spec.code} as debug mode is enabled`);
        }
        if (enableGZipCompression && !debugMode && (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.isGzipCompressionSupported)()) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.compressDataWithGZip)(request.data).then(compressedPayload => {
            const url = new URL(request.url);
            if (!url.searchParams.has('gzip')) {
              url.searchParams.set('gzip', '1');
            }
            callAjax({
              url: url.href,
              payload: compressedPayload
            });
          });
        } else {
          callAjax({
            url: request.url,
            payload: typeof request.data === 'string' ? request.data : JSON.stringify(request.data)
          });
        }
        break;
      default:
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)(`Skipping invalid request from ${spec.code}. Request type ${request.method} must be GET or POST`);
        requestDone();
    }
    function formatGetParameters(data) {
      if (data) {
        return `?${typeof data === 'object' ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.parseQueryStringParameters)(data) : data}`;
      }
      return '';
    }
  });
}, 'processBidderRequests');
const registerSyncInner = (0,_hook_js__WEBPACK_IMPORTED_MODULE_12__.hook)('async', function (spec, responses, gdprConsent, uspConsent, gppConsent) {
  const aliasSyncEnabled = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('userSync.aliasSyncEnabled');
  if (spec.getUserSyncs && (aliasSyncEnabled || !_adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].aliasRegistry[spec.code])) {
    let syncs = spec.getUserSyncs({
      iframeEnabled: _userSync_js__WEBPACK_IMPORTED_MODULE_4__.userSync.canBidderRegisterSync('iframe', spec.code),
      pixelEnabled: _userSync_js__WEBPACK_IMPORTED_MODULE_4__.userSync.canBidderRegisterSync('image', spec.code)
    }, responses, gdprConsent, uspConsent, gppConsent, _consentHandler_js__WEBPACK_IMPORTED_MODULE_20__.coppaDataHandler.getCoppa());
    if (syncs) {
      if (!Array.isArray(syncs)) {
        syncs = [syncs];
      }
      syncs.forEach(sync => {
        _userSync_js__WEBPACK_IMPORTED_MODULE_4__.userSync.registerSync(sync.type, spec.code, sync.url, sync.onCleanup);
      });
      _userSync_js__WEBPACK_IMPORTED_MODULE_4__.userSync.bidderDone(spec.code);
    }
  }
}, 'registerSyncs');
// check that the bid has a width and height set
function validBidSize(adUnitCode, bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_13__.auctionManager.index
} = {}) {
  if ((bid.width || parseInt(bid.width, 10) === 0) && (bid.height || parseInt(bid.height, 10) === 0)) {
    bid.width = parseInt(bid.width, 10);
    bid.height = parseInt(bid.height, 10);
    return true;
  }
  if (bid.wratio != null && bid.hratio != null) {
    bid.wratio = parseInt(bid.wratio, 10);
    bid.hratio = parseInt(bid.hratio, 10);
    return true;
  }
  const bidRequest = index.getBidRequest(bid);
  const mediaTypes = index.getMediaTypes(bid);
  const sizes = bidRequest && bidRequest.sizes || mediaTypes && mediaTypes.banner && mediaTypes.banner.sizes;
  const parsedSizes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.parseSizesInput)(sizes);

  // if a banner impression has one valid size, we assign that size to any bid
  // response that does not explicitly set width or height
  if (parsedSizes.length === 1) {
    const [width, height] = parsedSizes[0].split('x');
    bid.width = parseInt(width, 10);
    bid.height = parseInt(height, 10);
    return true;
  }
  return false;
}

// Validate the arguments sent to us by the adapter. If this returns false, the bid should be totally ignored.
function isValid(adUnitCode, bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_13__.auctionManager.index,
  responseMediaType = bid.mediaType
} = {}) {
  function hasValidKeys() {
    const bidKeys = Object.keys(bid);
    return COMMON_BID_RESPONSE_KEYS.every(key => bidKeys.includes(key) && ![undefined, null].includes(bid[key]));
  }
  function errorMessage(msg) {
    return `Invalid bid from ${bid.bidderCode}. Ignoring bid: ${msg}`;
  }
  if (!adUnitCode) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)('No adUnitCode was supplied to addBidResponse.');
    return false;
  }
  if (!bid) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logWarn)(`Some adapter tried to add an undefined bid for ${adUnitCode}.`);
    return false;
  }
  if (!hasValidKeys()) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(errorMessage(`Bidder ${bid.bidderCode} is missing required params. Check http://prebid.org/dev-docs/bidder-adapter-1.html for list of params.`));
    return false;
  }
  const auctionOptions = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('auctionOptions') || {};
  const rejectUnknownMediaTypes = auctionOptions.rejectUnknownMediaTypes === true;
  const rejectInvalidMediaTypes = auctionOptions.rejectInvalidMediaTypes !== false;
  const mediaTypes = index.getMediaTypes(bid);
  if (mediaTypes && Object.keys(mediaTypes).length > 0) {
    if (responseMediaType == null && rejectUnknownMediaTypes) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(errorMessage(`Bid mediaType is required. Allowed: ${Object.keys(mediaTypes).join(', ')}`));
      return false;
    }
    if (responseMediaType != null && rejectInvalidMediaTypes && !mediaTypes.hasOwnProperty(responseMediaType)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(errorMessage(`Bid mediaType '${responseMediaType}' is not supported by the ad unit. Allowed: ${Object.keys(mediaTypes).join(', ')}`));
      return false;
    }
  }
  if ( true && bid.mediaType === 'native' && !(0,_native_js__WEBPACK_IMPORTED_MODULE_5__.nativeBidIsValid)(bid, {
    index
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(errorMessage('Native bid missing some required properties.'));
    return false;
  }
  if ( true && bid.mediaType === 'video' && !(0,_video_js__WEBPACK_IMPORTED_MODULE_6__.isValidVideoBid)(bid, {
    index
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(errorMessage(`Video bid does not have required vastUrl or renderer property`));
    return false;
  }
  if (bid.mediaType === 'banner' && !validBidSize(adUnitCode, bid, {
    index
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.logError)(errorMessage(`Banner bids require a width and height`));
    return false;
  }
  return true;
}
function adapterMetrics(bidderRequest) {
  return (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_15__.useMetrics)(bidderRequest.metrics).renameWith(n => [`adapter.client.${n}`, `adapters.client.${bidderRequest.bidderCode}.${n}`]);
}

/***/ },

/***/ "./src/adloader.js"
/*!*************************!*\
  !*** ./src/adloader.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadExternalScript: () => (/* binding */ loadExternalScript)
/* harmony export */ });
/* unused harmony export preloadExternalScript */
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./activities/activityParams.js */ "./src/activities/activityParams.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");




const _requestCache = new WeakMap();
function isAllowed(url, moduleType, moduleCode) {
  if (!moduleType || !moduleCode || !url) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('cannot load external script without url, moduleType, or moduleCode');
    return false;
  }
  if (!(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__.ACTIVITY_LOAD_EXTERNAL_SCRIPT, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_1__.activityParams)(moduleType, moduleCode))) {
    return false;
  }
  return true;
}

/**
 * Loads external javascript. Can only be used if external JS is approved by Prebid. See https://github.com/prebid/prebid-js-external-js-template#policy
 * Each unique URL will be loaded at most 1 time.
 * @param {string} url the url to load
 * @param {string} moduleType moduleType of the module requesting this resource
 * @param {string} moduleCode bidderCode or module code of the module requesting this resource
 * @param {function} [callback] callback function to be called after the script is loaded
 * @param {Document} [doc] the context document, in which the script will be loaded, defaults to loaded document
 * @param {object} attributes an object of attributes to be added to the script with setAttribute by [key] and [value]; Only the attributes passed in the first request of a url will be added.
 */
function loadExternalScript(url, moduleType, moduleCode, callback, doc, attributes) {
  if (!isAllowed(url, moduleType, moduleCode)) return;
  const hasCallback = typeof callback === 'function' || typeof callback?.success === 'function' || typeof callback?.error === 'function';
  function runCallback(cb, err) {
    if (err == null) {
      if (typeof cb === 'function') {
        cb();
      } else {
        cb.success?.();
      }
    } else {
      cb.error?.(err);
    }
  }
  if (!doc) {
    doc = document; // provide a "valid" key for the WeakMap
  }
  // only load each asset once
  const storedCachedObject = getCacheObject(doc, url);
  if (storedCachedObject) {
    if (hasCallback) {
      if (storedCachedObject.loaded) {
        // invokeCallbacks immediately
        runCallback(callback, storedCachedObject.error);
      } else {
        // queue the callback
        storedCachedObject.callbacks.push(callback);
      }
    }
    return storedCachedObject.tag;
  }
  const cachedDocObj = _requestCache.get(doc) || {};
  const cacheObject = {
    error: null,
    loaded: false,
    tag: null,
    callbacks: []
  };
  cachedDocObj[url] = cacheObject;
  _requestCache.set(doc, cachedDocObj);
  if (hasCallback) {
    cacheObject.callbacks.push(callback);
  }
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)(`module ${moduleCode} is loading external JavaScript`);
  return requestResource(url, function () {
    cacheObject.loaded = true;
    try {
      for (let i = 0; i < cacheObject.callbacks.length; i++) {
        runCallback(cacheObject.callbacks[i], cacheObject.error);
      }
      cacheObject.callbacks.length = 0;
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('Error executing callback', 'adloader.js:loadExternalScript', e);
    }
  }, doc, attributes);
  function requestResource(tagSrc, callback, doc, attributes) {
    if (!doc) {
      doc = document;
    }
    var jptScript = doc.createElement('script');
    jptScript.type = 'text/javascript';
    jptScript.async = true;
    const cacheObject = getCacheObject(doc, url);
    if (cacheObject) {
      cacheObject.tag = jptScript;
    }
    function errorListener(e) {
      cacheObject.error = e;
      exit();
    }
    jptScript.addEventListener('error', errorListener);
    function exit() {
      jptScript.removeEventListener('error', errorListener);
      jptScript.onload = null;
      jptScript.onreadystatechange = null;
      callback();
    }
    if (jptScript.readyState) {
      jptScript.onreadystatechange = function () {
        if (jptScript.readyState === 'loaded' || jptScript.readyState === 'complete') {
          jptScript.onreadystatechange = null;
          exit();
        }
      };
    } else {
      jptScript.onload = function () {
        exit();
      };
    }
    jptScript.src = tagSrc;
    if (attributes) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.setScriptAttributes)(jptScript, attributes);
    }

    // add the new script tag to the page
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.insertElement)(jptScript, doc);
    return jptScript;
  }
  function getCacheObject(doc, url) {
    const cachedDocObj = _requestCache.get(doc);
    if (cachedDocObj && cachedDocObj[url]) {
      return cachedDocObj[url];
    }
    return null; // return new cache object?
  }
}
;
const doPreload = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.memoize)(function (url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = reject;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.insertElement)(link);
  });
});
async function preloadExternalScript(url, moduleType, moduleCode) {
  if (!isAllowed(url, moduleType, moduleCode)) {
    throw new Error('Denied');
  }
  return doPreload(url);
}
preloadExternalScript.clear = doPreload.clear;

/***/ },

/***/ "./src/ajax.js"
/*!*********************!*\
  !*** ./src/ajax.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   noCredsAjax: () => (/* binding */ noCredsAjax),
/* harmony export */   qualifiedAjaxBuilder: () => (/* binding */ qualifiedAjaxBuilder)
/* harmony export */ });
/* unused harmony exports dep, toFetchRequest, fetcherFactory, attachCallbacks, ajaxBuilder, sendBeacon, qualifiedFetcherFactory, ajax, fetch, noCredsFetch */
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./activities/activityParams.js */ "./src/activities/activityParams.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");





const dep = {
  fetch: window.fetch.bind(window),
  makeRequest: (r, o) => new Request(r, o),
  timeout(timeout, resource) {
    const ctl = new AbortController();
    let cancelTimer = setTimeout(() => {
      ctl.abort();
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)(`Request timeout after ${timeout}ms`, resource);
      cancelTimer = null;
    }, timeout);
    return {
      signal: ctl.signal,
      done() {
        cancelTimer && clearTimeout(cancelTimer);
      }
    };
  }
};
const GET = 'GET';
const POST = 'POST';
const CTYPE = 'Content-Type';
const KEEPALIVE_MAX_BODY_SIZE = 64 * 1024;
/**
 * transform legacy `ajax` parameters into a fetch request.
 * @returns {Request}
 */
function toFetchRequest(url, data, options = {}) {
  const method = options.method || (data ? POST : GET);
  if (method === GET && data) {
    const urlInfo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.parseUrl)(url, options);
    Object.assign(urlInfo.search, data);
    url = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.buildUrl)(urlInfo);
  }
  const headers = new Headers(options.customHeaders);
  headers.set(CTYPE, options.contentType || 'text/plain');
  const rqOpts = {
    method,
    headers
  };
  if (method !== GET && data) {
    rqOpts.body = data;
  }
  if (options.withCredentials) {
    rqOpts.credentials = 'include';
  }
  const request = dep.makeRequest(url, rqOpts);
  if (options.keepalive) {
    // do not set the "real" keepalive flag as Safari won't allow us to change it
    request._keepalive = true;
  }
  return request;
}
function callerContext(callers = []) {
  const stack = [callers];
  return {
    attach(fn, callers) {
      return function (...args) {
        stack.push(callers);
        try {
          return fn(...args);
        } finally {
          stack.pop();
        }
      };
    },
    getCallers() {
      return stack[stack.length - 1];
    }
  };
}
function fixedCallerContext(moduleType, moduleName) {
  return {
    attach: fn => fn,
    getCallers: () => [[moduleType, moduleName]]
  };
}

/**
 * Return a version of `fetch` that automatically cancels requests after `timeout` milliseconds.
 *
 * If provided, `request` and `done` should be functions accepting a single argument.
 * `request` is invoked at the beginning of each request, and `done` at the end; both are passed its origin.
 */
function fetcherFactory(timeout = 3000, {
  request,
  done
} = {}, moduleType, moduleName) {
  return fetcherFactoryImpl(callerContext(), timeout, {
    request,
    done
  }, moduleType, moduleName);
}
fetcherFactory.withCallers = callers => {
  // this is not intended to be used directly; see plugins/callerContext.js
  return (...args) => {
    return fetcherFactoryImpl(callerContext(callers), ...args);
  };
};
function fetcherFactoryImpl(context, timeout = 3000, {
  request,
  done
} = {}, moduleType, moduleName) {
  if (moduleName && moduleType) {
    context = fixedCallerContext(moduleType, moduleName);
  }
  let fetcher = (resource, options) => {
    // special treatment for keepalive - because of inconsistent browser behavior,
    // we must start with keepalive: false and flip it as a last step
    // Updating request options with new Request(oldRequest, newOptions):
    //  on Firefox, will default newOptions.keepalive = false
    //  on Safari, will not allow keepalive = true to become = false
    const keepalive = resource?._keepalive ?? options?.keepalive ?? resource?.keepalive;
    let to;
    if (timeout != null && options?.signal == null && !_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('disableAjaxTimeout')) {
      to = dep.timeout(timeout, resource);
      options = Object.assign({
        signal: to.signal
      }, options);
    }
    let request = dep.makeRequest(resource, {
      ...options,
      keepalive: false
    });
    if (request.credentials === 'include' && (context.getCallers().length === 0 || context.getCallers().some(([moduleType, moduleName]) => !(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__.ACTIVITY_ACCESS_REQUEST_CREDENTIALS, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_1__.activityParams)(moduleType, moduleName))))) {
      request = dep.makeRequest(request, {
        credentials: 'same-origin'
      });
    }
    let pm;
    if (keepalive) {
      // requests can be "used" only once - and blob() counts as usage, so clone the request
      pm = request.clone().blob().then(blob => {
        if (blob.size > KEEPALIVE_MAX_BODY_SIZE) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)(`Ignoring keepalive: request body exceeds ${KEEPALIVE_MAX_BODY_SIZE} bytes`, request);
        } else {
          request = dep.makeRequest(request, {
            keepalive: true
          });
        }
        return dep.fetch(request);
      });
    } else {
      pm = dep.fetch(request);
    }
    if (to?.done != null) pm = pm.finally(to.done);
    return pm;
  };
  if (request != null || done != null) {
    fetcher = (fetch => function (resource, options) {
      const origin = new URL(resource?.url == null ? resource : resource.url, document.location).origin;
      let req = fetch(resource, options);
      request && request(origin);
      if (done) req = req.finally(() => done(origin));
      return req;
    })(fetcher);
  }
  fetcher.withCallers = callers => context.attach(fetcher, callers);
  return fetcher;
}
function toXHR({
  status,
  statusText = '',
  headers,
  url
}, responseText) {
  let xml;
  function getXML(onError) {
    if (xml === undefined) {
      try {
        xml = new DOMParser().parseFromString(responseText, headers?.get(CTYPE)?.split(';')?.[0]);
      } catch (e) {
        xml = null;
        onError && onError(e);
      }
    }
    return xml;
  }
  return {
    // eslint-disable-next-line no-restricted-globals
    readyState: XMLHttpRequest.DONE,
    status,
    statusText,
    responseText,
    response: responseText,
    responseType: '',
    responseURL: url,
    get responseXML() {
      return getXML(_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError);
    },
    getResponseHeader: header => headers?.has(header) ? headers.get(header) : null,
    toJSON() {
      return Object.assign({
        responseXML: getXML()
      }, this);
    },
    timedOut: false
  };
}

/**
 * attach legacy `ajax` callbacks to a fetch promise.
 */
function attachCallbacks(fetchPm, callback) {
  const {
    success,
    error
  } = typeof callback === 'object' && callback != null ? callback : {
    success: typeof callback === 'function' ? callback : () => null,
    error: (e, x) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Network error', e, x)
  };
  return fetchPm.then(response => response.text().then(responseText => [response, responseText])).then(([response, responseText]) => {
    const xhr = toXHR(response, responseText);
    response.ok || response.status === 304 ? success(responseText, xhr) : error(response.statusText, xhr);
  }, reason => error('', Object.assign(toXHR({
    status: 0
  }, ''), {
    reason,
    timedOut: reason?.name === 'AbortError'
  })));
}
function ajaxBuilder(timeout = 3000, {
  request,
  done
} = {}, moduleType, moduleName) {
  return ajaxBuilderImpl(callerContext(), timeout, {
    request,
    done
  }, moduleType, moduleName);
}
ajaxBuilder.withCallers = callers => {
  // this is not intended to be used directly; see plugins/callerContext.js
  return (...args) => {
    return ajaxBuilderImpl(callerContext(callers), ...args);
  };
};
function ajaxBuilderImpl(context, timeout = 3000, {
  request,
  done
} = {}, moduleType, moduleName) {
  const fetcher = fetcherFactoryImpl(context, timeout, {
    request,
    done
  }, moduleType, moduleName);
  function ajax(url, callback, data, options = {}) {
    attachCallbacks(fetcher(toFetchRequest(url, data, options)), callback);
  }
  ajax.withCallers = callers => context.attach(ajax, callers);
  return ajax;
}

/**
 * simple wrapper around sendBeacon such that invocations of navigator.sendBeacon can be centrally maintained.
 * verifies that the navigator and sendBeacon are defined for maximum compatibility
 * @param {string} url The URL that will receive the data. Can be relative or absolute.
 * @param {*} data An ArrayBuffer, a TypedArray, a DataView, a Blob, a string literal or object, a FormData or a URLSearchParams object containing the data to send.
 * @returns {boolean} true if the user agent successfully queued the data for transfer. Otherwise, it returns false.
 */
function sendBeacon(url, data) {
  if (!window.navigator || !window.navigator.sendBeacon) {
    return false;
  }
  return window.navigator.sendBeacon(url, data);
}
function requireNames(fn) {
  return function (moduleType, moduleName, timeout, requestCallbacks) {
    if (!moduleType || !moduleName) {
      throw new Error('moduleType and moduleName are required');
    }
    return fn(timeout, requestCallbacks, moduleType, moduleName);
  };
}

/**
 * A version of ajaxBuilder that requires an explicit moduleType and moduleName.
 */
const qualifiedAjaxBuilder = requireNames(ajaxBuilder);
/**
 * A version of fetcherFactory that requires an explicit moduleType and moduleName.
 */
const qualifiedFetcherFactory = requireNames(fetcherFactory);
const ajax = ajaxBuilder();
const fetch = fetcherFactory();

// the difference between 'noCredsAjax'/'noCredsFetch' and 'ajax'/'fetch' is that the latter two (together with
// ajaxBuilder and fetcherFactory) are automatically decorated with moduleType/moduleName at build time -
// see plugins/callerContext.js

/**
 * A version of `ajax` that will never include request credentials (withCredentials = false).
 */
const noCredsAjax = ajax;
/**
 * A version of `fetch` that will  never include request credentials (credentials = 'same-origin').
 */
const noCredsFetch = fetch;

/***/ },

/***/ "./src/auction.js"
/*!************************!*\
  !*** ./src/auction.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AUCTION_COMPLETED: () => (/* binding */ AUCTION_COMPLETED),
/* harmony export */   addBidToAuction: () => (/* binding */ addBidToAuction),
/* harmony export */   getStandardBidderSettings: () => (/* binding */ getStandardBidderSettings),
/* harmony export */   newAuction: () => (/* binding */ newAuction)
/* harmony export */ });
/* unused harmony exports AUCTION_STARTED, AUCTION_IN_PROGRESS, resetAuctionState, beforeInitAuction, addBidResponse, responsesReady, addBidderRequests, bidsBackCallback, auctionCallbacks, getPreparedBidForAuction, getMediaTypeGranularity, getPriceGranularity, getPriceByGranularity, getCreativeId, getAdvertiserDomain, getDSP, getPrimaryCatId, getKeyValueTargetingPairs, adjustBids */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cpmBucketManager.js */ "./src/cpmBucketManager.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _videoCache_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./videoCache.js */ "./src/videoCache.js");
/* harmony import */ var _Renderer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _userSync_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./userSync.js */ "./src/userSync.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _utils_cpm_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./utils/cpm.js */ "./src/utils/cpm.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./utils/ttlCollection.js */ "./src/utils/ttlCollection.js");
/* harmony import */ var _bidTTL_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./bidTTL.js */ "./src/bidTTL.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _utils_wrapsInBids_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./utils/wrapsInBids.js */ "./src/utils/wrapsInBids.js");
/* harmony import */ var _utils_desirability_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./utils/desirability.js */ "./src/utils/desirability.js");

























const {
  syncUsers
} = _userSync_js__WEBPACK_IMPORTED_MODULE_7__.userSync;
const AUCTION_STARTED = 'started';
const AUCTION_IN_PROGRESS = 'inProgress';
const AUCTION_COMPLETED = 'completed';
// register event for bid adjustment
_events_js__WEBPACK_IMPORTED_MODULE_12__.on(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.BID_ADJUSTMENT, function (bid) {
  adjustBids(bid);
});
const MAX_REQUESTS_PER_ORIGIN = 4;
const outstandingRequests = {};
const sourceInfo = {};
const queuedCalls = [];
const pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_18__.getGlobal)();

/**
 * Clear global state for tests
 */
function resetAuctionState() {
  queuedCalls.length = 0;
  [outstandingRequests, sourceInfo].forEach(ob => Object.keys(ob).forEach(k => {
    delete ob[k];
  }));
}
const beforeInitAuction = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', auction => {});
function newAuction({
  adUnits,
  adUnitCodes,
  callback,
  cbTimeout,
  labels,
  auctionId,
  ortb2Fragments,
  metrics
}) {
  metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_16__.useMetrics)(metrics);
  const _adUnits = adUnits;
  const _labels = labels;
  const _adUnitCodes = adUnitCodes;
  const _auctionId = auctionId || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)();
  const _timeout = cbTimeout;
  const _timelyRequests = new Set();
  const done = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_15__.defer)();
  const requestsDone = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_15__.defer)();
  let _bidsRejected = [];
  let _callback = callback;
  let _bidderRequests = [];
  const _bidsReceived = (0,_utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_19__.ttlCollection)({
    startTime: bid => bid.responseTimestamp,
    ttl: bid => {
      const minTTL = (0,_bidTTL_js__WEBPACK_IMPORTED_MODULE_20__.getEffectiveMinBidCacheTTL)(bid);
      return minTTL == null ? null : Math.max(minTTL, bid.ttl) * 1000;
    }
  });
  let _noBids = [];
  let _winningBids = [];
  let _auctionStart;
  let _auctionEnd;
  let _timeoutTimer;
  let _auctionStatus;
  let _nonBids = [];
  function addBidRequests(bidderRequests) {
    _bidderRequests = _bidderRequests.concat(bidderRequests);
  }
  function addBidReceived(bid) {
    _bidsReceived.add(bid);
  }
  function addBidRejected(bidsRejected) {
    _bidsRejected = _bidsRejected.concat(bidsRejected);
  }
  function addNoBid(noBid) {
    _noBids = _noBids.concat(noBid);
  }
  function addSeatNonBids(seatnonbids) {
    _nonBids = _nonBids.concat(seatnonbids);
  }
  function getProperties() {
    return {
      auctionId: _auctionId,
      timestamp: _auctionStart,
      auctionEnd: _auctionEnd,
      auctionStatus: _auctionStatus,
      adUnits: _adUnits,
      adUnitCodes: _adUnitCodes,
      labels: _labels,
      bidderRequests: _bidderRequests,
      noBids: _noBids,
      bidsReceived: _bidsReceived.toArray(),
      bidsRejected: _bidsRejected,
      winningBids: _winningBids,
      timeout: _timeout,
      metrics: metrics,
      seatNonBids: _nonBids
    };
  }
  function startAuctionTimer() {
    _timeoutTimer = setTimeout(() => executeCallback(true), _timeout);
  }
  function executeCallback(timedOut) {
    if (!timedOut) {
      clearTimeout(_timeoutTimer);
    } else {
      _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.AUCTION_TIMEOUT, getProperties());
    }
    if (_auctionEnd === undefined) {
      let timedOutRequests = [];
      if (timedOut) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`Auction ${_auctionId} timedOut`);
        timedOutRequests = _bidderRequests.filter(rq => !_timelyRequests.has(rq.bidderRequestId)).flatMap(br => br.bids);
        if (timedOutRequests.length) {
          _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.BID_TIMEOUT, timedOutRequests);
        }
      }
      _auctionStatus = AUCTION_COMPLETED;
      _auctionEnd = Date.now();
      metrics.checkpoint('auctionEnd');
      metrics.timeBetween('requestBids', 'auctionEnd', 'requestBids.total');
      metrics.timeBetween('callBids', 'auctionEnd', 'requestBids.callBids');
      done.resolve();
      _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.AUCTION_END, getProperties());
      bidsBackCallback(_adUnits, auctionId, function () {
        try {
          if (_callback != null) {
            const bids = _bidsReceived.toArray().filter(bid => _adUnitCodes.includes(bid.adUnitCode)).reduce(groupByPlacement, {});
            _callback.apply(pbjsInstance, [bids, timedOut, _auctionId]);
            _callback = null;
          }
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Error executing bidsBackHandler', null, e);
        } finally {
          // Calling timed out bidders
          if (timedOutRequests.length) {
            _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].callTimedOutBidders(adUnits, timedOutRequests, _timeout);
          }
          // Only automatically sync if the publisher has not chosen to "enableOverride"
          const userSyncConfig = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('userSync') ?? {};
          if (!userSyncConfig.enableOverride) {
            // Delay the auto sync by the config delay
            syncUsers(userSyncConfig.syncDelay);
          }
        }
      });
    }
  }
  function auctionDone() {
    _config_js__WEBPACK_IMPORTED_MODULE_6__.config.resetBidder();
    // when all bidders have called done callback atleast once it means auction is complete
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)(`Bids Received for Auction with id: ${_auctionId}`, _bidsReceived.toArray());
    _auctionStatus = AUCTION_COMPLETED;
    executeCallback(false);
  }
  function onTimelyResponse(bidderRequestId) {
    _timelyRequests.add(bidderRequestId);
  }
  function callBids() {
    _auctionStatus = AUCTION_STARTED;
    _auctionStart = Date.now();
    const bidRequests = metrics.measureTime('requestBids.makeRequests', () => _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].makeBidRequests(_adUnits, _auctionStart, _auctionId, _timeout, _labels, ortb2Fragments, metrics));
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)(`Bids Requested for Auction with id: ${_auctionId}`, bidRequests);
    metrics.checkpoint('callBids');
    if (bidRequests.length < 1) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('No valid bid requests returned for auction');
      auctionDone();
    } else {
      addBidderRequests.call({
        dispatch: addBidderRequestsCallback,
        context: this
      }, bidRequests);
    }
  }

  /**
   * callback executed after addBidderRequests completes
   * @param {BidRequest[]} bidRequests
   */
  function addBidderRequestsCallback(bidRequests) {
    bidRequests.forEach(bidRequest => {
      addBidRequests(bidRequest);
    });
    const requests = {};
    const call = {
      bidRequests,
      run: () => {
        beforeInitAuction(this);
        startAuctionTimer();
        _auctionStatus = AUCTION_IN_PROGRESS;
        _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.AUCTION_INIT, getProperties());
        const callbacks = auctionCallbacks(auctionDone, this);
        _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].callBids(_adUnits, bidRequests, callbacks.addBidResponse, callbacks.adapterDone, {
          request(source, origin) {
            increment(outstandingRequests, origin);
            increment(requests, source);
            if (!sourceInfo[source]) {
              sourceInfo[source] = {
                SRA: true,
                origin
              };
            }
            if (requests[source] > 1) {
              sourceInfo[source].SRA = false;
            }
          },
          done(origin) {
            outstandingRequests[origin]--;
            if (queuedCalls[0]) {
              if (runIfOriginHasCapacity(queuedCalls[0])) {
                queuedCalls.shift();
              }
            }
          }
        }, _timeout, onTimelyResponse, ortb2Fragments);
        requestsDone.resolve();
      }
    };
    if (!runIfOriginHasCapacity(call)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('queueing auction due to limited endpoint capacity');
      queuedCalls.push(call);
    }
    function runIfOriginHasCapacity(call) {
      let hasCapacity = true;
      const maxRequests = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('maxRequestsPerOrigin') || MAX_REQUESTS_PER_ORIGIN;
      call.bidRequests.some(bidRequest => {
        let requests = 1;
        const source = typeof bidRequest.src !== 'undefined' && bidRequest.src === _constants_js__WEBPACK_IMPORTED_MODULE_14__.S2S.SRC ? 's2s' : bidRequest.bidderCode;

        // if the bidder has alwaysHasCapacity flag set and forceMaxRequestsPerOrigin is false, don't check capacity
        if (bidRequest.alwaysHasCapacity && !_config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('forceMaxRequestsPerOrigin')) {
          return false;
        }

        // if we have no previous info on this source just let them through
        if (sourceInfo[source]) {
          if (sourceInfo[source].SRA === false) {
            // some bidders might use more than the MAX_REQUESTS_PER_ORIGIN in a single auction.  In those cases
            // set their request count to MAX_REQUESTS_PER_ORIGIN so the auction isn't permanently queued waiting
            // for capacity for that bidder
            requests = Math.min(bidRequest.bids.length, maxRequests);
          }
          if (outstandingRequests[sourceInfo[source].origin] + requests > maxRequests) {
            hasCapacity = false;
          }
        }
        // return only used for terminating this .some() iteration early if it is determined we don't have capacity
        return !hasCapacity;
      });
      if (hasCapacity) {
        call.run();
      }
      return hasCapacity;
    }
    function increment(obj, prop) {
      if (typeof obj[prop] === 'undefined') {
        obj[prop] = 1;
      } else {
        obj[prop]++;
      }
    }
  }
  function addWinningBid(winningBid) {
    _winningBids = _winningBids.concat(winningBid);
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].callBidWonBidder(winningBid.adapterCode || winningBid.bidder, winningBid, adUnits);
    if (!winningBid.deferBilling) {
      _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].triggerBilling(winningBid);
    }
  }
  function setBidTargeting(bid) {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].callSetTargetingBidder(bid.adapterCode || bid.bidder, bid);
    _bidsReceived.refresh();
  }
  return {
    addBidReceived,
    addBidRejected,
    addNoBid,
    addSeatNonBids,
    callBids,
    addWinningBid,
    setBidTargeting,
    getWinningBids: () => _winningBids,
    getAuctionStart: () => _auctionStart,
    getAuctionEnd: () => _auctionEnd,
    getTimeout: () => _timeout,
    getAuctionId: () => _auctionId,
    getAuctionStatus: () => _auctionStatus,
    getAdUnits: () => _adUnits,
    getAdUnitCodes: () => _adUnitCodes,
    getBidRequests: () => _bidderRequests,
    getBidsReceived: () => _bidsReceived.toArray(),
    getNoBids: () => _noBids,
    getNonBids: () => _nonBids,
    getFPD: () => ortb2Fragments,
    getMetrics: () => metrics,
    refreshBidTTLs: () => _bidsReceived.refresh(),
    end: done.promise,
    requestsDone: requestsDone.promise,
    getProperties
  };
}
/**
 * Hook into this to intercept bids before they are added to an auction.
 */
const addBidResponse = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.ignoreCallbackArg)((0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function (adUnitCode, bid, reject) {
  if (!isValidPrice(bid)) {
    reject(_constants_js__WEBPACK_IMPORTED_MODULE_14__.REJECTION_REASON.PRICE_TOO_HIGH);
  } else if (!(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_21__.isActivityAllowed)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_22__.ACTIVITY_ADD_BID_RESPONSE, (0,_adapterManager_js__WEBPACK_IMPORTED_MODULE_13__.activityParams)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_23__.MODULE_TYPE_BIDDER, bid.bidder || bid.bidderCode, {
    bid,
    ortb2: _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index.getOrtb2(bid),
    adUnit: _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index.getAdUnit(bid)
  }))) {
    reject(_constants_js__WEBPACK_IMPORTED_MODULE_14__.REJECTION_REASON.BIDDER_DISALLOWED);
  } else {
    this.dispatch.call(null, adUnitCode, bid);
  }
}, 'addBidResponse'));

/**
 * Delay hook for adapter responses.
 *
 * `ready` is a promise; auctions wait for it to resolve before closing. Modules can hook into this
 * to delay the end of auctions while they perform initialization that does not need to delay their start.
 */
const responsesReady = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', ready => ready, 'responsesReady');
const addBidderRequests = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (bidderRequests) {
  this.dispatch.call(this.context, bidderRequests);
}, 'addBidderRequests');
const bidsBackCallback = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function (adUnits, auctionId, callback) {
  if (callback) {
    callback();
  }
}, 'bidsBackCallback');
function auctionCallbacks(auctionDone, auctionInstance, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) {
  let outstandingBidsAdded = 0;
  let allAdapterCalledDone = false;
  const bidderRequestsDone = new Set();
  const bidResponseMap = {};
  function afterBidAdded() {
    outstandingBidsAdded--;
    if (allAdapterCalledDone && outstandingBidsAdded === 0) {
      auctionDone();
    }
  }
  function handleBidResponse(adUnitCode, bid, handler) {
    bidResponseMap[bid.requestId] = true;
    addCommonResponseProperties(bid, adUnitCode);
    outstandingBidsAdded++;
    return handler(afterBidAdded);
  }
  function acceptBidResponse(adUnitCode, bid) {
    handleBidResponse(adUnitCode, bid, done => {
      const bidResponse = getPreparedBidForAuction(bid);
      _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.BID_ACCEPTED, bidResponse);
      if ( true && bidResponse.mediaType === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO ||  true && bidResponse.mediaType === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.AUDIO) {
        tryAddVideoAudioBid(auctionInstance, bidResponse, done);
      } else {
        if ( true && (0,_native_js__WEBPACK_IMPORTED_MODULE_3__.isNativeResponse)(bidResponse)) {
          (0,_native_js__WEBPACK_IMPORTED_MODULE_3__.setNativeResponseProperties)(bidResponse, index.getAdUnit(bidResponse));
        }
        addBidToAuction(auctionInstance, bidResponse);
        done();
      }
    });
  }
  function rejectBidResponse(adUnitCode, bid, reason) {
    return handleBidResponse(adUnitCode, bid, done => {
      bid.rejectionReason = reason;
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Bid from ${bid.bidder || 'unknown bidder'} was rejected: ${reason}`, bid);
      _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.BID_REJECTED, bid);
      auctionInstance.addBidRejected(bid);
      done();
    });
  }
  function adapterDone() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const bidderRequest = this;
    let bidderRequests = auctionInstance.getBidRequests();
    const auctionOptionsConfig = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('auctionOptions');
    bidderRequestsDone.add(bidderRequest);
    if (auctionOptionsConfig && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(auctionOptionsConfig)) {
      const secondaryBidders = auctionOptionsConfig.secondaryBidders;
      if (secondaryBidders && !bidderRequests.every(bidder => secondaryBidders.includes(bidder.bidderCode))) {
        bidderRequests = bidderRequests.filter(request => !secondaryBidders.includes(request.bidderCode));
      }
    }
    allAdapterCalledDone = bidderRequests.every(bidderRequest => bidderRequestsDone.has(bidderRequest));
    bidderRequest.bids.forEach(bid => {
      if (!bidResponseMap[bid.bidId]) {
        addBidTimingProperties(bid);
        auctionInstance.addNoBid(bid);
        _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.NO_BID, bid);
      }
    });
    if (allAdapterCalledDone && outstandingBidsAdded === 0) {
      auctionDone();
    }
  }
  return {
    addBidResponse: function () {
      function addBid(adUnitCode, bid) {
        addBidResponse.call({
          dispatch: acceptBidResponse
        }, adUnitCode, bid, (() => {
          let rejected = false;
          return reason => {
            if (!rejected) {
              rejectBidResponse(adUnitCode, bid, reason);
              rejected = true;
            }
          };
        })());
      }
      addBid.reject = rejectBidResponse;
      return addBid;
    }(),
    adapterDone: function () {
      responsesReady(_utils_promise_js__WEBPACK_IMPORTED_MODULE_15__.PbPromise.resolve()).finally(() => adapterDone.call(this));
    }
  };
}

// Add a bid to the auction.
function addBidToAuction(auctionInstance, bidResponse) {
  setupBidTargeting(bidResponse);
  (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_16__.useMetrics)(bidResponse.metrics).timeSince('addBidResponse', 'addBidResponse.total');
  auctionInstance.addBidReceived(bidResponse);
  _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.BID_RESPONSE, bidResponse);
}

// Video bids may fail if the cache is down, or there's trouble on the network.
function tryAddVideoAudioBid(auctionInstance, bidResponse, afterBidAdded, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) {
  const videoMediaType = index.getMediaTypes({
    requestId: bidResponse.originalRequestId || bidResponse.requestId,
    adUnitId: bidResponse.adUnitId
  })?.video;
  (0,_videoCache_js__WEBPACK_IMPORTED_MODULE_4__.handleVideoBidCaching)({
    bidResponse,
    auctionInstance,
    afterBidAdded,
    videoMediaType
  });
}
/**
 * Add timing properties to a bid response
 */
function addBidTimingProperties(bidResponse, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) {
  const bidderRequest = index.getBidderRequest(bidResponse);
  const start = bidderRequest && bidderRequest.start || bidResponse.requestTimestamp;
  Object.assign(bidResponse, {
    responseTimestamp: bidResponse.responseTimestamp || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.timestamp)(),
    requestTimestamp: bidResponse.requestTimestamp || start
  });
  bidResponse.timeToRespond = bidResponse.responseTimestamp - bidResponse.requestTimestamp;
}

/**
 * Augment `bidResponse` with properties that are common across all bids - including rejected bids.
 */
function addCommonResponseProperties(bidResponse, adUnitCode, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) {
  const adUnit = index.getAdUnit(bidResponse);
  addBidTimingProperties(bidResponse, {
    index
  });
  Object.assign(bidResponse, {
    cpm: parseFloat(bidResponse.cpm) || 0,
    bidder: bidResponse.bidder || bidResponse.bidderCode,
    adUnitCode
  });
  if (adUnit?.ttlBuffer != null) {
    bidResponse.ttlBuffer = adUnit.ttlBuffer;
  }
}

/**
 * Add additional bid response properties that are universal for all _accepted_ bids.
 */
function getPreparedBidForAuction(bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) {
  // Let listeners know that now is the time to adjust the bid, if they want to.
  //
  // CAREFUL: Publishers rely on certain bid properties to be available (like cpm),
  // but others to not be set yet (like priceStrings). See #1372 and #1389.
  _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_14__.EVENTS.BID_ADJUSTMENT, bid);
  const adUnit = index.getAdUnit(bid);
  bid.instl = adUnit?.ortb2Imp?.instl === 1;
  bid.element = adUnit?.element;

  // a publisher-defined renderer can be used to render bids
  const bidRequest = index.getBidRequest(bid);
  const bidRenderer = bidRequest?.renderer || adUnit?.renderer;
  const bidSafeRenderer = bidRequest?.safeRenderer || adUnit?.safeRenderer;

  // a publisher can also define a renderer for a mediaType
  const bidObjectMediaType = bid.mediaType;
  const mediaTypes = index.getMediaTypes(bid);
  const bidMediaType = mediaTypes && mediaTypes[bidObjectMediaType];
  const mediaTypeRenderer = bidMediaType && bidMediaType.renderer;
  const mediaTypeSafeRenderer = bidMediaType && bidMediaType.safeRenderer;
  let renderer = null;

  // the renderer for the mediaType takes precendence
  if (mediaTypeRenderer && mediaTypeRenderer.render && !(mediaTypeRenderer.backupOnly === true && bid.renderer)) {
    renderer = mediaTypeRenderer;
  } else if (bidRenderer && bidRenderer.render && !(bidRenderer.backupOnly === true && bid.renderer)) {
    renderer = bidRenderer;
  }
  let safeRenderer = null;
  if (mediaTypeSafeRenderer && mediaTypeSafeRenderer?.url && !(mediaTypeRenderer?.backupOnly === true && bid.safeRenderer)) {
    safeRenderer = mediaTypeSafeRenderer;
  } else if (bidSafeRenderer && bidSafeRenderer?.url && !(mediaTypeRenderer?.backupOnly === true && bid.safeRenderer)) {
    safeRenderer = bidSafeRenderer;
  }
  if (safeRenderer != null) {
    bid.safeRenderer = safeRenderer;
  }
  const allowTopWindowRenderers = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('allowTopWindowRenderers') ?? true;
  if (allowTopWindowRenderers) {
    if (renderer) {
      // be aware, an adapter could already have installed the bidder, in which case this overwrite's the existing adapter
      bid.renderer = _Renderer_js__WEBPACK_IMPORTED_MODULE_5__.Renderer.install({
        url: renderer.url,
        config: renderer.options,
        renderNow: renderer.url == null
      }); // rename options to config, to make it consistent?
      bid.renderer.setRender(renderer.render);
    }
  } else {
    bid.renderer = null;
  }

  // Use the config value 'mediaTypeGranularity' if it has been defined for mediaType, else use 'customPriceBucket'
  const mediaTypeGranularity = getMediaTypeGranularity(bid.mediaType, mediaTypes, _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('mediaTypePriceGranularity'));
  const priceStringsObj = (0,_cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_2__.getPriceBucketString)(bid.cpm, typeof mediaTypeGranularity === 'object' ? mediaTypeGranularity : _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('customPriceBucket'), _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('currency.granularityMultiplier'));
  bid.pbLg = priceStringsObj.low;
  bid.pbMg = priceStringsObj.med;
  bid.pbHg = priceStringsObj.high;
  bid.pbAg = priceStringsObj.auto;
  bid.pbDg = priceStringsObj.dense;
  bid.pbCg = priceStringsObj.custom;
  return bid;
}
function setupBidTargeting(bidObject) {
  let keyValues;
  const cpmCheck = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__.bidderSettings.get(bidObject.bidderCode, 'allowZeroCpmBids') === true ? bidObject.cpm >= 0 : bidObject.cpm > 0;
  if (bidObject.bidderCode && (cpmCheck || bidObject.dealId)) {
    keyValues = getKeyValueTargetingPairs(bidObject.bidderCode, bidObject);
  }

  // use any targeting provided as defaults, otherwise just set from getKeyValueTargetingPairs
  bidObject.adserverTargeting = Object.assign(bidObject.adserverTargeting || {}, keyValues);
}
function getMediaTypeGranularity(mediaType, mediaTypes, mediaTypePriceGranularity) {
  if (mediaType && mediaTypePriceGranularity) {
    if ( true && mediaType === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO) {
      const context = mediaTypes?.[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO]?.context ?? 'instream';
      if (mediaTypePriceGranularity[`${_mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO}-${context}`]) {
        return mediaTypePriceGranularity[`${_mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO}-${context}`];
      }
    }
    return mediaTypePriceGranularity[mediaType];
  }
}

/**
 * This function returns the price granularity defined. It can be either publisher defined or default value
 * @param {Bid} bid bid response object
 * @param {object} obj
 * @param {object} obj.index
 * @returns {string} granularity
 */
const getPriceGranularity = (bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) => {
  // Use the config value 'mediaTypeGranularity' if it has been set for mediaType, else use 'priceGranularity'
  const mediaTypeGranularity = getMediaTypeGranularity(bid.mediaType, index.getMediaTypes(bid), _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('mediaTypePriceGranularity'));
  const granularity = typeof bid.mediaType === 'string' && mediaTypeGranularity ? typeof mediaTypeGranularity === 'string' ? mediaTypeGranularity : 'custom' : _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('priceGranularity');
  return granularity;
};

/**
 * This function returns a function to get bid price by price granularity
 * @param {string} granularity
 * @returns {function}
 */
const getPriceByGranularity = granularity => {
  return bid => {
    const bidGranularity = granularity || getPriceGranularity(bid);
    if (bidGranularity === _constants_js__WEBPACK_IMPORTED_MODULE_14__.GRANULARITY_OPTIONS.AUTO) {
      return bid.pbAg;
    } else if (bidGranularity === _constants_js__WEBPACK_IMPORTED_MODULE_14__.GRANULARITY_OPTIONS.DENSE) {
      return bid.pbDg;
    } else if (bidGranularity === _constants_js__WEBPACK_IMPORTED_MODULE_14__.GRANULARITY_OPTIONS.LOW) {
      return bid.pbLg;
    } else if (bidGranularity === _constants_js__WEBPACK_IMPORTED_MODULE_14__.GRANULARITY_OPTIONS.MEDIUM) {
      return bid.pbMg;
    } else if (bidGranularity === _constants_js__WEBPACK_IMPORTED_MODULE_14__.GRANULARITY_OPTIONS.HIGH) {
      return bid.pbHg;
    } else if (bidGranularity === _constants_js__WEBPACK_IMPORTED_MODULE_14__.GRANULARITY_OPTIONS.CUSTOM) {
      return bid.pbCg;
    }
  };
};

/**
 * This function returns a function to get crid from bid response
 * @returns {function}
 */
const getCreativeId = () => {
  return bid => {
    return bid.creativeId ? bid.creativeId : '';
  };
};

/**
 * This function returns a function to get first advertiser domain from bid response meta
 * @returns {function}
 */
const getAdvertiserDomain = () => {
  return bid => {
    return bid.meta && bid.meta.advertiserDomains && bid.meta.advertiserDomains.length > 0 ? [bid.meta.advertiserDomains].flat()[0] : '';
  };
};

/**
 * This function returns a function to get dsp name or id from bid response meta
 * @returns {function}
 */
const getDSP = () => {
  return bid => {
    return bid.meta && (bid.meta.networkId || bid.meta.networkName) ? bid?.meta?.networkName || bid?.meta?.networkId : '';
  };
};

/**
 * This function returns a function to get the primary category id from bid response meta
 * @returns {function}
 */
const getPrimaryCatId = () => {
  return bid => {
    const catId = bid?.meta?.primaryCatId;
    if (Array.isArray(catId)) {
      return catId[0] || '';
    }
    return catId || '';
  };
};
function createKeyVal(key, value) {
  return {
    key,
    val: typeof value === 'function' ? function (bidResponse, bidReq) {
      return value(bidResponse, bidReq);
    } : function (bidResponse) {
      return bidResponse[value];
    }
  };
}
function defaultAdserverTargeting() {
  return [createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.BIDDER, 'bidderCode'), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.AD_ID, 'adId'), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.PRICE_BUCKET, getPriceByGranularity()), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.SIZE, 'size'), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.DEAL, 'dealId'), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.SOURCE, 'source'), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.FORMAT, 'mediaType'), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.ADOMAIN, getAdvertiserDomain()), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.ACAT, getPrimaryCatId()), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.DSP, getDSP()), createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.CRID, getCreativeId())];
}

/**
 * @param {string} mediaType
 * @param {string} bidderCode
 * @returns {*}
 */
function getStandardBidderSettings(mediaType, bidderCode) {
  const standardSettings = Object.assign({}, _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__.bidderSettings.settingsFor(null));
  if (!standardSettings[_constants_js__WEBPACK_IMPORTED_MODULE_14__.JSON_MAPPING.ADSERVER_TARGETING]) {
    standardSettings[_constants_js__WEBPACK_IMPORTED_MODULE_14__.JSON_MAPPING.ADSERVER_TARGETING] = defaultAdserverTargeting();
  }
  if ( true && mediaType === 'video') {
    const adserverTargeting = standardSettings[_constants_js__WEBPACK_IMPORTED_MODULE_14__.JSON_MAPPING.ADSERVER_TARGETING].slice();
    standardSettings[_constants_js__WEBPACK_IMPORTED_MODULE_14__.JSON_MAPPING.ADSERVER_TARGETING] = adserverTargeting;

    // Adding hb_uuid + hb_cache_id
    [_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.UUID, _constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.CACHE_ID].forEach(targetingKeyVal => {
      if (typeof adserverTargeting.find(kvPair => kvPair.key === targetingKeyVal) === 'undefined') {
        adserverTargeting.push(createKeyVal(targetingKeyVal, 'videoCacheKey'));
      }
    });

    // Adding hb_cache_host
    if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('cache.url') && (!bidderCode || _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__.bidderSettings.get(bidderCode, 'sendStandardTargeting') !== false)) {
      if (typeof adserverTargeting.find(targetingKeyVal => targetingKeyVal.key === _constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.CACHE_HOST) === 'undefined') {
        adserverTargeting.push(createKeyVal(_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.CACHE_HOST, function (bidResponse) {
          if (bidResponse.cacheUrl) {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.parseUrl)(bidResponse.cacheUrl).hostname;
          }
          return bidResponse.adserverTargeting?.[_constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.CACHE_HOST];
        }));
      }
    }
  }
  return standardSettings;
}
function getKeyValueTargetingPairs(bidderCode, custBidObj, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index
} = {}) {
  if (!custBidObj) {
    return {};
  }
  const bidRequest = index.getBidRequest(custBidObj);
  var keyValues = {};

  // 1) set the keys from "standard" setting or from prebid defaults
  // initialize default if not set
  const standardSettings = getStandardBidderSettings(custBidObj.mediaType, bidderCode);
  setKeys(keyValues, standardSettings, custBidObj, bidRequest);

  // 2) set keys from specific bidder setting override if they exist
  if (bidderCode && _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__.bidderSettings.getOwn(bidderCode, _constants_js__WEBPACK_IMPORTED_MODULE_14__.JSON_MAPPING.ADSERVER_TARGETING)) {
    setKeys(keyValues, _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__.bidderSettings.ownSettingsFor(bidderCode), custBidObj, bidRequest);
    custBidObj.sendStandardTargeting = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_11__.bidderSettings.get(bidderCode, 'sendStandardTargeting');
  }
  return keyValues;
}
function setKeys(keyValues, bidderSettings, custBidObj, bidReq) {
  var targeting = bidderSettings[_constants_js__WEBPACK_IMPORTED_MODULE_14__.JSON_MAPPING.ADSERVER_TARGETING];
  custBidObj.size = custBidObj.getSize();
  (targeting || []).forEach(function (kvPair) {
    var key = kvPair.key;
    var value = kvPair.val;
    if (keyValues[key]) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('The key: ' + key + ' is being overwritten');
    }
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFn)(value)) {
      try {
        value = value(custBidObj, bidReq);
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('bidmanager', 'ERROR', e);
      }
    }
    if ((typeof bidderSettings.suppressEmptyKeys !== 'undefined' && bidderSettings.suppressEmptyKeys === true || key === _constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.DEAL || key === _constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.ACAT || key === _constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.DSP || key === _constants_js__WEBPACK_IMPORTED_MODULE_14__.TARGETING_KEYS.CRID) && (
    // hb_deal & hb_acat are suppressed automatically if not set

    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmptyStr)(value) || value === null || value === undefined)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)("suppressing empty key '" + key + "' from adserver targeting");
    } else {
      keyValues[key] = value;
    }
  });
  return keyValues;
}
function adjustBids(bid) {
  const bidRequest = _auctionManager_js__WEBPACK_IMPORTED_MODULE_10__.auctionManager.index.getBidRequest(bid);
  const bidPriceAdjusted = (0,_utils_cpm_js__WEBPACK_IMPORTED_MODULE_17__.adjustCpm)(bid.cpm, bid, bidRequest);
  if (bidPriceAdjusted >= 0) {
    bid.cpm = bidPriceAdjusted;
  }

  // defaults to  cpm
  const bidDesirabilityAdjusted = (0,_utils_desirability_js__WEBPACK_IMPORTED_MODULE_25__.adjustDesirability)(bid, bidRequest);
  bid.desirability = bidDesirabilityAdjusted;
}

/**
 * groupByPlacement is a reduce function that converts an array of Bid objects
 * to an object with placement codes as keys, with each key representing an object
 * with an array of `Bid` objects for that placement
 * @returns {*} as { [adUnitCode]: { bids: [Bid, Bid, Bid] } }
 */
function groupByPlacement(bidsByPlacement, bid) {
  if (!bidsByPlacement[bid.adUnitCode]) {
    bidsByPlacement[bid.adUnitCode] = (0,_utils_wrapsInBids_js__WEBPACK_IMPORTED_MODULE_24__.wrapInBids)([]);
  }
  bidsByPlacement[bid.adUnitCode].push(bid);
  return bidsByPlacement;
}

/**
 * isValidPrice is price validation function
 * which checks if price from bid response
 * is not higher than top limit set in config
 * @type {Function}
 * @param bid
 * @returns {boolean}
 */
function isValidPrice(bid) {
  const maxBidValue = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('maxBid');
  if (!maxBidValue || !bid.cpm) return true;
  return maxBidValue >= Number(bid.cpm);
}

/***/ },

/***/ "./src/auctionIndex.js"
/*!*****************************!*\
  !*** ./src/auctionIndex.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuctionIndex: () => (/* binding */ AuctionIndex)
/* harmony export */ });
/**
 * Retrieves request-related bid data.
 * All methods are designed to work with Bid (response) objects returned by bid adapters.
 */
class AuctionIndex {
  #getAuctions;
  constructor(getAuctions) {
    this.#getAuctions = getAuctions;
  }

  /**
   * Returns auction instance for `auctionId`
   */
  getAuction({
    auctionId
  }) {
    if (auctionId != null) {
      return this.#getAuctions().find(auction => auction.getAuctionId() === auctionId);
    }
  }

  /**
   * Returns `adUnit` object for `adUnitId`.
   * You should prefer `getMediaTypes` for looking up bid media types.
   */
  getAdUnit({
    adUnitId
  }) {
    if (adUnitId != null) {
      return this.#getAuctions().flatMap(a => a.getAdUnits()).find(au => au.adUnitId === adUnitId);
    }
  }

  /**
   * Returns mediaTypes object from bidRequest (through `requestId`) falling back to the adUnit (through `adUnitId`).
   * The bidRequest is given precedence because its mediaTypes can differ from the adUnit's (if bidder-specific labels
   * are in use). Bids that have no associated request do not have labels either, and use the adUnit's mediaTypes.
   */
  getMediaTypes({
    adUnitId,
    requestId
  }) {
    if (requestId != null) {
      const req = this.getBidRequest({
        requestId
      });
      if (req != null && (adUnitId == null || req.adUnitId === adUnitId)) {
        return req.mediaTypes;
      }
    } else if (adUnitId != null) {
      const au = this.getAdUnit({
        adUnitId
      });
      if (au != null) {
        return au.mediaTypes;
      }
    }
  }

  /**
   * Returns bidderRequest that matches both requestId and bidderRequestId (if either or both are provided).
   * Bid responses are not guaranteed to have a corresponding request.
   */
  getBidderRequest({
    requestId,
    bidderRequestId
  }) {
    if (requestId != null || bidderRequestId != null) {
      let bers = this.#getAuctions().flatMap(a => a.getBidRequests());
      if (bidderRequestId != null) {
        bers = bers.filter(ber => ber.bidderRequestId === bidderRequestId);
      }
      if (requestId == null) {
        return bers[0];
      } else {
        return bers.find(ber => ber.bids && ber.bids.find(br => br.bidId === requestId) != null);
      }
    }
  }

  /**
   * Returns bidRequest object for requestId.
   * Bid responses are not guaranteed to have a corresponding request.
   */
  getBidRequest({
    requestId
  }) {
    if (requestId != null) {
      return this.#getAuctions().flatMap(a => a.getBidRequests()).flatMap(ber => ber.bids).find(br => br && br.bidId === requestId);
    }
  }

  /**
   * Returns ortb2 object for bid
   */
  getOrtb2(bid) {
    return this.getBidderRequest(bid)?.ortb2 || this.getAuction(bid)?.getFPD()?.global;
  }
}

/***/ },

/***/ "./src/auctionManager.js"
/*!*******************************!*\
  !*** ./src/auctionManager.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   auctionManager: () => (/* binding */ auctionManager)
/* harmony export */ });
/* unused harmony export newAuctionManager */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _auction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auction.js */ "./src/auction.js");
/* harmony import */ var _auctionIndex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auctionIndex.js */ "./src/auctionIndex.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/ttlCollection.js */ "./src/utils/ttlCollection.js");
/* harmony import */ var _bidTTL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./bidTTL.js */ "./src/bidTTL.js");
/**
 * AuctionManager modules is responsible for creating auction instances.
 * This module is the gateway for Prebid core to access auctions.
 * It stores all created instances of auction and can be used to get consolidated values from auction.
 */

/**
 * @typedef {Object} AuctionManager
 *
 * @property {function(): Array} getBidsRequested - returns consolidated bid requests
 * @property {function(): Array} getBidsReceived - returns consolidated bid received
 * @property {function(string): Array} getAllBidsForAdUnitCode - returns consolidated bid received for a given adUnit
 * @property {function(): Array} getAllWinningBids - returns all winning bids
 * @property {function(): Array} getAdUnits - returns consolidated adUnits
 * @property {function(): Array} getAdUnitCodes - returns consolidated adUnitCodes
 * @property {function(): Array} getNoBids - returns consolidated adUnitCodes
 * @property {function(string, string): void} setStatusForBids - set status for bids
 * @property {function(): string} getLastAuctionId - returns last auctionId
 * @property {function(Object): Object} createAuction - creates auction instance and stores it for future reference
 * @property {function(string): Object} findBidByAdId - find bid received by adId. This function will be called by $$PREBID_GLOBAL$$.renderAd
 * @property {function(): Object} getStandardBidderAdServerTargeting - returns standard bidder targeting for all the adapters. Refer http://prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.bidderSettings for more details
 * @property {function(Object): void} addWinningBid - add a winning bid to an auction based on auctionId
 * @property {function(): void} clearAllAuctions - clear all auctions for testing
 * @property {function(): Array} getAuctions - returns tracked auction instances
 * @property {function(*): *} onExpiry
 * @property {AuctionIndex} index
 */










/**
 * Creates new instance of auctionManager. There will only be one instance of auctionManager but
 * a factory is created to assist in testing.
 *
 * @returns {AuctionManager} auctionManagerInstance
 */
function newAuctionManager() {
  const _auctions = (0,_utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_6__.ttlCollection)({
    startTime: au => au.end.then(() => au.getAuctionEnd()),
    ttl: au => au.end.then(() => {
      const bids = au.getBidsReceived();
      if (bids.length === 0) {
        const minTTL = (0,_bidTTL_js__WEBPACK_IMPORTED_MODULE_7__.getMinBidCacheTTL)();
        return minTTL == null ? null : minTTL * 1000;
      }
      const ttls = bids.map(bid => {
        const minTTL = (0,_bidTTL_js__WEBPACK_IMPORTED_MODULE_7__.getEffectiveMinBidCacheTTL)(bid);
        if (minTTL == null) return null;
        return Math.max(minTTL, bid.ttl);
      });
      if (ttls.some(t => t == null)) return null;
      return Math.max(...ttls) * 1000;
    })
  });
  (0,_bidTTL_js__WEBPACK_IMPORTED_MODULE_7__.onMinBidCacheTTLChange)(() => {
    for (const auction of _auctions) {
      auction.refreshBidTTLs();
    }
    _auctions.refresh();
  });
  const auctionManager = {
    onExpiry: _auctions.onExpiry
  };
  function getAuction(auctionId) {
    for (const auction of _auctions) {
      if (auction.getAuctionId() === auctionId) return auction;
    }
  }

  // Auctions that have not yet ended, keyed by auctionId. The auctionId can be
  // supplied by the publisher, so concurrent auctions may share one: each key
  // holds the set of live auctions using it. An entry is added on creation and
  // removed when the auction's `end` promise resolves. An auction whose `end`
  // never resolves — e.g. callBids() throwing out of makeBidRequests before
  // the timeout timer is armed, or a request queued on origin capacity that
  // never frees — stays in this map for the page lifetime; clearAllAuctions
  // does not clear it, because mid-flight routing (below) depends on entries
  // surviving that call. This is bounded to those error paths: entries are not
  // retained per normal auction, and do not accumulate with auction count.
  const _inFlightAuctions = new Map();

  // Single listener routing PBS analytics nonbids to the auction(s) they
  // belong to. Delivery targets the union of the in-flight set for the
  // auctionId and every auction in the TTL'd cache with a matching id,
  // deduplicated: the in-flight set covers auctions that ended or were removed
  // from the cache (e.g. clearAllAuctions) while the PBS response was
  // outstanding, and the cache covers auctions that have ended but not yet
  // been evicted by TTL. auctionId can be publisher-supplied, so more than one
  // auction may match on either side.
  _events_js__WEBPACK_IMPORTED_MODULE_4__.on(_constants_js__WEBPACK_IMPORTED_MODULE_3__.EVENTS.PBS_ANALYTICS, event => {
    if (event.seatnonbid != null) {
      const targets = new Set(_inFlightAuctions.get(event.auctionId));
      for (const auction of _auctions) {
        if (auction.getAuctionId() === event.auctionId) targets.add(auction);
      }
      targets.forEach(auction => auction.addSeatNonBids(event.seatnonbid));
    }
  });
  auctionManager.addWinningBid = function (bid) {
    const metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_5__.useMetrics)(bid.metrics);
    metrics.checkpoint('bidWon');
    metrics.timeBetween('auctionEnd', 'bidWon', 'adserver.pending');
    metrics.timeBetween('requestBids', 'bidWon', 'adserver.e2e');
    const auction = getAuction(bid.auctionId);
    if (auction) {
      auction.addWinningBid(bid);
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Auction not found when adding winning bid`);
    }
  };
  Object.entries({
    getAllWinningBids: {
      name: 'getWinningBids'
    },
    getBidsRequested: {
      name: 'getBidRequests'
    },
    getNoBids: {},
    getAdUnits: {},
    getBidsReceived: {
      pre(auction) {
        return auction.getAuctionStatus() === _auction_js__WEBPACK_IMPORTED_MODULE_1__.AUCTION_COMPLETED;
      }
    },
    getAdUnitCodes: {
      post: _utils_js__WEBPACK_IMPORTED_MODULE_0__.uniques
    }
  }).forEach(([mgrMethod, {
    name = mgrMethod,
    pre,
    post
  }]) => {
    const mapper = pre == null ? auction => auction[name]() : auction => pre(auction) ? auction[name]() : [];
    const filter = post == null ? items => items : items => items.filter(post);
    auctionManager[mgrMethod] = () => {
      return filter(_auctions.toArray().flatMap(mapper));
    };
  });
  function allBidsReceived() {
    return _auctions.toArray().flatMap(au => au.getBidsReceived());
  }
  auctionManager.getAllBidsForAdUnitCode = function (adUnitCode) {
    return allBidsReceived().filter(bid => bid && bid.adUnitCode === adUnitCode);
  };
  auctionManager.createAuction = function (opts) {
    const auction = (0,_auction_js__WEBPACK_IMPORTED_MODULE_1__.newAuction)(opts);
    _addAuction(auction);
    const auctionId = auction.getAuctionId();
    if (!_inFlightAuctions.has(auctionId)) {
      _inFlightAuctions.set(auctionId, new Set());
    }
    _inFlightAuctions.get(auctionId).add(auction);
    auction.end.then(() => {
      const auctions = _inFlightAuctions.get(auctionId);
      if (auctions != null) {
        auctions.delete(auction);
        if (auctions.size === 0) {
          _inFlightAuctions.delete(auctionId);
        }
      }
    });
    return auction;
  };
  auctionManager.findBidByAdId = function (adId) {
    return allBidsReceived().find(bid => bid.adId === adId);
  };
  auctionManager.getStandardBidderAdServerTargeting = function () {
    return (0,_auction_js__WEBPACK_IMPORTED_MODULE_1__.getStandardBidderSettings)()[_constants_js__WEBPACK_IMPORTED_MODULE_3__.JSON_MAPPING.ADSERVER_TARGETING];
  };
  auctionManager.setStatusForBids = function (adId, status) {
    const bid = auctionManager.findBidByAdId(adId);
    if (bid) bid.status = status;
    if (bid && status === _constants_js__WEBPACK_IMPORTED_MODULE_3__.BID_STATUS.BID_TARGETING_SET) {
      const auction = getAuction(bid.auctionId);
      if (auction) {
        auction.setBidTargeting(bid);
        _auctions.refresh();
      }
    }
  };
  auctionManager.getLastAuctionId = function () {
    const auctions = _auctions.toArray();
    return auctions.length && auctions[auctions.length - 1].getAuctionId();
  };
  auctionManager.clearAllAuctions = function () {
    _auctions.clear();
  };
  auctionManager.getAuctions = function () {
    return _auctions.toArray();
  };
  function _addAuction(auction) {
    _auctions.add(auction);
  }
  auctionManager.index = new _auctionIndex_js__WEBPACK_IMPORTED_MODULE_2__.AuctionIndex(() => _auctions.toArray());
  return auctionManager;
}
const auctionManager = newAuctionManager();

/***/ },

/***/ "./src/audio.js"
/*!**********************!*\
  !*** ./src/audio.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ORTB_AUDIO_PARAMS: () => (/* binding */ ORTB_AUDIO_PARAMS),
/* harmony export */   fillAudioDefaults: () => (/* binding */ fillAudioDefaults)
/* harmony export */ });
/* unused harmony exports OUTSTREAM, INSTREAM, isValidAudioBid, checkAudioBidSetup */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");





const OUTSTREAM = 'outstream';
const INSTREAM = 'instream';
const ORTB_PARAMS = [['mimes', value => Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string')], ['minduration', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['maxduration', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['startdelay', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['maxseq', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['poddur', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['protocols', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['battr', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['maxextended', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['minbitrate', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['maxbitrate', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['delivery', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['api', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['companiontype', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['feed', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['stitched', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['nvol', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger]];

/**
 * List of OpenRTB 2.x audio object properties with simple validators.
 * Not included: `companionad`, `durfloors`, `ext`
 * reference: https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md
 */
const ORTB_AUDIO_PARAMS = new Map(ORTB_PARAMS);
function fillAudioDefaults(adUnit) {}

/**
 * Validate that the assets required for audio context are present on the bid
 */
function isValidAudioBid(bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_4__.auctionManager.index
} = {}) {
  const audioMediaType = index.getMediaTypes(bid)?.audio;
  const context = audioMediaType && audioMediaType?.context;
  const useCacheKey = audioMediaType && audioMediaType?.useCacheKey;
  const adUnit = index.getAdUnit(bid);

  // if context not defined assume default 'instream' for audio bids
  // instream bids require a vast url or vast xml content
  return checkAudioBidSetup(bid, adUnit, audioMediaType, context, useCacheKey);
}
const checkAudioBidSetup = (0,_hook_js__WEBPACK_IMPORTED_MODULE_3__.hook)('sync', function (bid, adUnit, audioMediaType, context, useCacheKey) {
  if (audioMediaType && (useCacheKey || context !== OUTSTREAM)) {
    // xml-only audio bids require a prebid cache url
    const {
      url,
      useLocal
    } = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('cache') || {};
    if (!url && !useLocal && bid.vastXml && !bid.vastUrl) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`
        This bid contains only vastXml and will not work when a prebid cache url is not specified.
        Try enabling either prebid cache with ${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_5__.getGlobalVarName)()}.setConfig({ cache: {url: "..."} });
        or local cache with ${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_5__.getGlobalVarName)()}.setConfig({ cache: { useLocal: true }});
      `);
      return false;
    }
    return !!(bid.vastUrl || bid.vastXml);
  }

  // outstream bids require a renderer on the bid or pub-defined on adunit
  if (context === OUTSTREAM && !useCacheKey) {
    return !!(bid.renderer || adUnit && adUnit.renderer || audioMediaType.renderer);
  }
  return true;
}, 'checkAudioBidSetup');

/***/ },

/***/ "./src/banner.js"
/*!***********************!*\
  !*** ./src/banner.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ORTB_BANNER_PARAMS: () => (/* binding */ ORTB_BANNER_PARAMS)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");

const ORTB_PARAMS = [['format', value => Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'object')], ['w', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isInteger], ['h', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isInteger], ['btype', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isArrayOfNums], ['battr', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isArrayOfNums], ['pos', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isInteger], ['mimes', value => Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string')], ['topframe', value => [1, 0].includes(value)], ['expdir', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isArrayOfNums], ['api', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isArrayOfNums], ['id', _utils_js__WEBPACK_IMPORTED_MODULE_0__.isStr], ['vcm', value => [1, 0].includes(value)]];

/**
 * List of OpenRTB 2.x banner object properties with simple validators.
 * Not included: `ext`
 * reference: https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md
 */
const ORTB_BANNER_PARAMS = new Map(ORTB_PARAMS);

/***/ },

/***/ "./src/bidTTL.js"
/*!***********************!*\
  !*** ./src/bidTTL.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBufferedTTL: () => (/* binding */ getBufferedTTL),
/* harmony export */   getEffectiveMinBidCacheTTL: () => (/* binding */ getEffectiveMinBidCacheTTL),
/* harmony export */   getMinBidCacheTTL: () => (/* binding */ getMinBidCacheTTL),
/* harmony export */   onMinBidCacheTTLChange: () => (/* binding */ onMinBidCacheTTLChange)
/* harmony export */ });
/* unused harmony export getMinTargetedBidCacheTTL */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");



const CACHE_TTL_SETTING = 'minBidCacheTTL';
const MIN_TARGETED_BID_CACHE_TTL_SETTING = 'minTargetedBidCacheTTL';
let TTL_BUFFER = 1;
let minCacheTTL = null;
let minTargetedBidCacheTTL = null;
const listeners = [];
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('ttlBuffer', cfg => {
  if (typeof cfg.ttlBuffer === 'number') {
    TTL_BUFFER = cfg.ttlBuffer;
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Invalid value for ttlBuffer', cfg.ttlBuffer);
  }
});
function getBufferedTTL(bid) {
  return bid.ttl - (bid.hasOwnProperty('ttlBuffer') ? bid.ttlBuffer : TTL_BUFFER);
}
function getMinBidCacheTTL() {
  return minCacheTTL;
}
function getMinTargetedBidCacheTTL() {
  return minTargetedBidCacheTTL;
}

/**
 * Returns the effective minimum cache TTL in seconds for a bid.
 * When minTargetedBidCacheTTL is set and the bid has had targeting set, uses that;
 * otherwise uses minBidCacheTTL. Returns null if no minimum applies (bid kept for page lifetime).
 */
function getEffectiveMinBidCacheTTL(bid) {
  const baseTTL = minCacheTTL;
  if (baseTTL == null && minTargetedBidCacheTTL == null) {
    return null;
  }
  if (bid?.status === _constants_js__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.BID_TARGETING_SET && typeof minTargetedBidCacheTTL === 'number') {
    return minTargetedBidCacheTTL;
  }
  return baseTTL;
}
function notifyCacheTTLChange() {
  listeners.forEach(l => l(minCacheTTL));
}
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig(CACHE_TTL_SETTING, cfg => {
  const prev = minCacheTTL;
  minCacheTTL = cfg?.[CACHE_TTL_SETTING];
  minCacheTTL = typeof minCacheTTL === 'number' ? minCacheTTL : null;
  if (prev !== minCacheTTL) {
    notifyCacheTTLChange();
  }
});
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig(MIN_TARGETED_BID_CACHE_TTL_SETTING, cfg => {
  const prev = minTargetedBidCacheTTL;
  minTargetedBidCacheTTL = cfg?.[MIN_TARGETED_BID_CACHE_TTL_SETTING];
  minTargetedBidCacheTTL = typeof minTargetedBidCacheTTL === 'number' ? minTargetedBidCacheTTL : null;
  if (prev !== minTargetedBidCacheTTL) {
    notifyCacheTTLChange();
  }
});
function onMinBidCacheTTLChange(listener) {
  listeners.push(listener);
}

/***/ },

/***/ "./src/bidderSettings.js"
/*!*******************************!*\
  !*** ./src/bidderSettings.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bidderSettings: () => (/* binding */ bidderSettings)
/* harmony export */ });
/* unused harmony export ScopedSettings */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");




// eslint-disable-next-line @typescript-eslint/no-unused-vars

class ScopedSettings {
  constructor(getSettings, defaultScope) {
    this.getSettings = getSettings;
    this.defaultScope = defaultScope;
  }

  /**
   * Get setting value at `path` under the given scope, falling back to the default scope if needed.
   * If `scope` is `null`, get the setting's default value.
   */
  get(scope, path) {
    let value = this.getOwn(scope, path);
    if (typeof value === 'undefined') {
      value = this.getOwn(null, path);
    }
    return value;
  }

  /**
   * Get the setting value at `path` *without* falling back to the default value.
   */
  getOwn(scope, path) {
    scope = this.#resolveScope(scope);
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this.getSettings(), `${scope}.${path}`);
  }

  /**
   * @returns all existing scopes except the default one.
   */
  getScopes() {
    return Object.keys(this.getSettings()).filter(scope => scope !== this.defaultScope);
  }

  /**
   * @returns all settings in the given scope, merged with the settings for the default scope.
   */
  settingsFor(scope) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({}, this.ownSettingsFor(null), this.ownSettingsFor(scope));
  }

  /**
   * @returns all settings in the given scope, *without* any of the default settings.
   */
  ownSettingsFor(scope) {
    scope = this.#resolveScope(scope);
    return this.getSettings()[scope] || {};
  }
  #resolveScope(scope) {
    if (scope == null) {
      return this.defaultScope;
    } else {
      return scope;
    }
  }
}
const bidderSettings = new ScopedSettings(() => (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_2__.getGlobal)().bidderSettings || {}, _constants_js__WEBPACK_IMPORTED_MODULE_3__.JSON_MAPPING.BD_SETTING_STANDARD);

/***/ },

/***/ "./src/bidfactory.js"
/*!***************************!*\
  !*** ./src/bidfactory.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBid: () => (/* binding */ createBid)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");


/**
 * Bid metadata.
 */

/**
 * Bid responses as provided by adapters; core then transforms these into `Bid`s
 */

// <format>BidResponesProperties - adapter interpretResponse properties specific to the format.
// they are included in both BidResponse and Bid types.
// Here we have only "naked" declarations, extended in banner/video/native.ts as well as modules.

// <format>BidProperties - format specific properties of Bid objects generated by Prebid, but not in
// (or different from) adapter responses. Again,these are just naked declarations, extended in their place of
// use.

// the following adds `property?: undefined` declarations for each property
// that is in some other format, to avoid requiring type casts
// every time that property is used

// eslint-disable-next-line @typescript-eslint/no-redeclare
function Bid({
  src = 'client',
  bidder = '',
  bidId,
  transactionId,
  adUnitId,
  auctionId
} = {}) {
  var _bidSrc = src;
  Object.assign(this, {
    bidderCode: bidder,
    width: 0,
    height: 0,
    adId: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getUniqueIdentifierStr)(),
    requestId: bidId,
    transactionId,
    adUnitId,
    auctionId,
    mediaType: 'banner',
    source: _bidSrc
  });

  // returns the size of the bid creative. Concatenation of width and height by ‘x’.
  this.getSize = function () {
    return this.width + 'x' + this.height;
  };
}
function createBid(identifiers) {
  return new Bid(identifiers);
}

/***/ },

/***/ "./src/buildOptions.js"
/*!*****************************!*\
  !*** ./src/buildOptions.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDistUrlBase: () => (/* binding */ getDistUrlBase),
/* harmony export */   getGlobalVarName: () => (/* binding */ getGlobalVarName),
/* harmony export */   shouldDefineGlobal: () => (/* binding */ shouldDefineGlobal)
/* harmony export */ });
/* harmony import */ var _buildOptions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../buildOptions.mjs */ "./buildOptions.mjs");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line import/no-unresolved
 // autogenerated during precompilation

function getGlobalVarName() {
  return _buildOptions_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].pbGlobal;
}
function shouldDefineGlobal() {
  return _buildOptions_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].defineGlobal;
}
function getDistUrlBase() {
  return _buildOptions_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].distUrlBase;
}

/***/ },

/***/ "./src/config.js"
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RANDOM: () => (/* binding */ RANDOM),
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
/* unused harmony export newConfig */
/* harmony import */ var _cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cpmBucketManager.js */ "./src/cpmBucketManager.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/*
 * Module for getting and setting Prebid configuration.
*/




const DEFAULT_DEBUG = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)(_constants_js__WEBPACK_IMPORTED_MODULE_4__.DEBUG_MODE).toUpperCase() === 'TRUE';
const DEFAULT_BIDDER_TIMEOUT = 3000;
const DEFAULT_ENABLE_SEND_ALL_BIDS = true;
const DEFAULT_DISABLE_AJAX_TIMEOUT = false;
const DEFAULT_BID_CACHE = false;
const DEFAULT_DEVICE_ACCESS = true;
const DEFAULT_MAX_NESTED_IFRAMES = 10;
const DEFAULT_MAXBID_VALUE = 5000;
const DEFAULT_IFRAMES_CONFIG = {};
const RANDOM = 'random';
const FIXED = 'fixed';
const VALID_ORDERS = {};
VALID_ORDERS[RANDOM] = true;
VALID_ORDERS[FIXED] = true;
const DEFAULT_BIDDER_SEQUENCE = RANDOM;
const GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};
const ALL_TOPICS = '*';
function attachProperties(config, useDefaultValues = true) {
  const values = useDefaultValues ? {
    priceGranularity: GRANULARITY_OPTIONS.MEDIUM,
    customPriceBucket: {},
    mediaTypePriceGranularity: {},
    bidderSequence: DEFAULT_BIDDER_SEQUENCE,
    auctionOptions: {}
  } : {};
  const validateauctionOptions = (() => {
    const boolKeys = ['suppressStaleRender', 'suppressExpiredRender', 'legacyRender', 'rejectUnknownMediaTypes', 'rejectInvalidMediaTypes'];
    const arrKeys = ['secondaryBidders'];
    const enumKeys = {
      viewabilityMeasurement: ['observer', 'boundingBox']
    };
    const allKeys = [].concat(boolKeys).concat(arrKeys).concat(Object.keys(enumKeys));
    return function validateauctionOptions(val) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Auction Options must be an object');
        return false;
      }
      for (const k of Object.keys(val)) {
        if (!allKeys.includes(k)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Auction Options given an incorrect param: ${k}`);
          return false;
        }
        if (arrKeys.includes(k)) {
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Auction Options ${k} must be of type Array`);
            return false;
          } else if (!val[k].every(_utils_js__WEBPACK_IMPORTED_MODULE_3__.isStr)) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Auction Options ${k} must be only string`);
            return false;
          }
        } else if (boolKeys.includes(k)) {
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isBoolean)(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Auction Options ${k} must be of type boolean`);
            return false;
          }
        } else if (enumKeys.hasOwnProperty(k)) {
          if (!enumKeys[k].includes(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Auction Options ${k} must be one of: ${enumKeys[k].join(', ')}`);
            return false;
          }
        }
      }
      return true;
    };
  })();
  function getProp(name) {
    return values[name];
  }
  function setProp(name, val) {
    if (!values.hasOwnProperty(name)) {
      Object.defineProperty(config, name, {
        enumerable: true
      });
    }
    values[name] = val;
  }
  const props = {
    publisherDomain: {
      set(val) {
        if (val != null) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('publisherDomain is deprecated and has no effect since v7 - use pageUrl instead');
        }
        setProp('publisherDomain', val);
      }
    },
    priceGranularity: {
      set(val) {
        if (validatePriceGranularity(val)) {
          if (typeof val === 'string') {
            setProp('priceGranularity', hasGranularity(val) ? val : GRANULARITY_OPTIONS.MEDIUM);
          } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(val)) {
            setProp('customPriceBucket', val);
            setProp('priceGranularity', GRANULARITY_OPTIONS.CUSTOM);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('Using custom price granularity');
          }
        }
      }
    },
    customPriceBucket: {},
    mediaTypePriceGranularity: {
      set(val) {
        val != null && setProp('mediaTypePriceGranularity', Object.keys(val).reduce((aggregate, item) => {
          if (validatePriceGranularity(val[item])) {
            if (typeof val[item] === 'string') {
              aggregate[item] = hasGranularity(val[item]) ? val[item] : getProp('priceGranularity');
            } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(val[item])) {
              aggregate[item] = val[item];
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)(`Using custom price granularity for ${item}`);
            }
          } else {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Invalid price granularity for media type: ${item}`);
          }
          return aggregate;
        }, {}));
      }
    },
    bidderSequence: {
      set(val) {
        if (VALID_ORDERS[val]) {
          setProp('bidderSequence', val);
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Invalid order: ${val}. Bidder Sequence was not set.`);
        }
      }
    },
    auctionOptions: {
      set(val) {
        if (validateauctionOptions(val)) {
          setProp('auctionOptions', val);
        }
      }
    }
  };
  Object.defineProperties(config, Object.fromEntries(Object.entries(props).map(([k, def]) => [k, Object.assign({
    get: getProp.bind(null, k),
    set: setProp.bind(null, k),
    enumerable: values.hasOwnProperty(k),
    configurable: !values.hasOwnProperty(k)
  }, def)])));
  return config;
  function hasGranularity(val) {
    return Object.keys(GRANULARITY_OPTIONS).find(option => val === GRANULARITY_OPTIONS[option]);
  }
  function validatePriceGranularity(val) {
    if (!val) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Prebid Error: no value passed to `setPriceGranularity()`');
      return false;
    }
    if (typeof val === 'string') {
      if (!hasGranularity(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.');
      }
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(val)) {
      if (!(0,_cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_0__.isValidPriceConfig)(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Invalid custom price value passed to `setPriceGranularity()`');
        return false;
      }
    }
    return true;
  }
}
function newConfig() {
  const listeners = [];
  let defaults;
  let config;
  let bidderConfig;
  let currBidder = null;
  function resetConfig() {
    defaults = {};
    const newConfig = attachProperties({
      // `debug` is equivalent to legacy `pbjs.logging` property
      debug: DEFAULT_DEBUG,
      bidderTimeout: DEFAULT_BIDDER_TIMEOUT,
      enableSendAllBids: DEFAULT_ENABLE_SEND_ALL_BIDS,
      useBidCache: DEFAULT_BID_CACHE,
      /**
       * deviceAccess set to false will disable setCookie, getCookie, hasLocalStorage
       * @type {boolean}
       */
      deviceAccess: DEFAULT_DEVICE_ACCESS,
      disableAjaxTimeout: DEFAULT_DISABLE_AJAX_TIMEOUT,
      // default max nested iframes for referer detection
      maxNestedIframes: DEFAULT_MAX_NESTED_IFRAMES,
      // default max bid
      maxBid: DEFAULT_MAXBID_VALUE,
      userSync: {
        topics: DEFAULT_IFRAMES_CONFIG
      }
    });
    if (config) {
      callSubscribers(Object.keys(config).reduce((memo, topic) => {
        if (config[topic] !== newConfig[topic]) {
          memo[topic] = newConfig[topic] || {};
        }
        return memo;
      }, {}));
    }
    config = newConfig;
    bidderConfig = {};
  }

  /**
   * Returns base config with bidder overrides (if there is currently a bidder)
   * @private
   */
  function _getConfig() {
    if (currBidder && bidderConfig && (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(bidderConfig[currBidder])) {
      const curr = bidderConfig[currBidder];
      const topics = new Set([...Object.keys(config), ...Object.keys(curr)]);
      const merged = {};
      for (const topic of topics) {
        const base = config[topic];
        const override = curr[topic];
        merged[topic] = override === undefined ? base : base === undefined ? override : (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(override) ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)({}, base, override) : override;
      }
      return merged;
    }
    return {
      ...config
    };
  }
  function _getRestrictedConfig() {
    // This causes reading 'ortb2' to throw an error; with prebid 7, that will almost
    // always be the incorrect way to access FPD configuration (https://github.com/prebid/Prebid.js/issues/7651)
    // code that needs the ortb2 config should explicitly use `getAnyConfig`
    // TODO: this is meant as a temporary tripwire to catch inadvertent use of `getConfig('ortb')` as we transition.
    // It should be removed once the risk of that happening is low enough.
    const conf = _getConfig();
    Object.defineProperty(conf, 'ortb2', {
      get: function () {
        throw new Error('invalid access to \'ortb2\' config - use request parameters instead');
      }
    });
    return conf;
  }
  const [getAnyConfig, getConfig] = [_getConfig, _getRestrictedConfig].map(accessor => {
    /*
     * Returns configuration object if called without parameters,
     * or single configuration property if given a string matching a configuration
     * property name.  Allows deep access e.g. getConfig('currency.adServerCurrency')
     *
     * If called with callback parameter, or a string and a callback parameter,
     * subscribes to configuration updates. See `subscribe` function for usage.
     */
    return function getConfig(...args) {
      if (args.length <= 1 && typeof args[0] !== 'function') {
        const option = args[0];
        return option ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(accessor(), option) : _getConfig();
      }
      return subscribe(...args);
    };
  });
  const [readConfig, readAnyConfig] = [getConfig, getAnyConfig].map(wrapee => {
    /*
     * Like getConfig, except that it returns a deepClone of the result.
     */
    return function readConfig(...args) {
      let res = wrapee(...args);
      if (res && typeof res === 'object') {
        res = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.deepClone)(res);
      }
      return res;
    };
  });

  /**
   * Internal API for modules (such as prebid-server) that might need access to all bidder config
   */
  function getBidderConfig() {
    return bidderConfig;
  }

  /*
   * Set configuration.
   */
  function setConfig(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(options)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('setConfig options must be an object');
      return;
    }
    const topics = Object.keys(options);
    const topicalConfig = {};
    topics.forEach(topic => {
      let option = options[topic];
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(defaults[topic]) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(option)) {
        option = Object.assign({}, defaults[topic], option);
      }
      try {
        topicalConfig[topic] = config[topic] = option;
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Cannot set config for property ${topic} : `, e);
      }
    });
    callSubscribers(topicalConfig);
  }

  /**
   * Sets configuration defaults which setConfig values can be applied on top of
   * @param {object} options
   */
  function setDefaults(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(defaults)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('defaults must be an object');
      return;
    }
    Object.assign(defaults, options);
    // Add default values to config as well
    Object.assign(config, options);
  }

  /*
   * Adds a function to a set of listeners that are invoked whenever `setConfig`
   * is called. The subscribed function will be passed the options object that
   * was used in the `setConfig` call. Topics can be subscribed to to only get
   * updates when specific properties are updated by passing a topic string as
   * the first parameter.
   *
   * If `options.init` is true, the listener will be immediately called with the current options.
   *
   * Returns an `unsubscribe` function for removing the subscriber from the
   * set of listeners
   *
   * Example use:
   * // subscribe to all configuration changes
   * subscribe((config) => console.log('config set:', config));
   *
   * // subscribe to only 'logging' changes
   * subscribe('logging', (config) => console.log('logging set:', config));
   *
   * // unsubscribe
   * const unsubscribe = subscribe(...);
   * unsubscribe(); // no longer listening
   *
   */

  function subscribe(topic, listener, options = {}) {
    let callback = listener;
    if (typeof topic !== 'string') {
      // first param should be callback function in this case,
      // meaning it gets called for any config change
      callback = topic;
      topic = ALL_TOPICS;
      options = listener || {};
    }
    if (typeof callback !== 'function') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('listener must be a function');
      return;
    }
    const nl = {
      topic,
      callback
    };
    listeners.push(nl);
    if (options.init) {
      if (topic === ALL_TOPICS) {
        callback(getConfig());
      } else {
        callback({
          [topic]: getConfig(topic)
        });
      }
    }

    // save and call this function to remove the listener
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(nl), 1);
    };
  }

  /*
   * Calls listeners that were added by the `subscribe` function
   */
  function callSubscribers(options) {
    const TOPICS = Object.keys(options);

    // call subscribers of a specific topic, passing only that configuration
    listeners.filter(listener => TOPICS.includes(listener.topic)).forEach(listener => {
      listener.callback({
        [listener.topic]: options[listener.topic]
      });
    });

    // call subscribers that didn't give a topic, passing everything that was set
    listeners.filter(listener => listener.topic === ALL_TOPICS).forEach(listener => listener.callback(options));
  }
  function setBidderConfig(config, mergeFlag = false) {
    try {
      check(config);
      config.bidders.forEach(bidder => {
        if (!bidderConfig[bidder]) {
          bidderConfig[bidder] = attachProperties({}, false);
        }
        Object.keys(config.config).forEach(topic => {
          const option = config.config[topic];
          const currentConfig = bidderConfig[bidder][topic];
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(option) && (currentConfig == null || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(currentConfig))) {
            const func = mergeFlag ? _utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep : Object.assign;
            bidderConfig[bidder][topic] = func({}, currentConfig || {}, option);
          } else {
            bidderConfig[bidder][topic] = option;
          }
        });
      });
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(e);
    }
    function check(obj) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(obj)) {
        throw new Error('setBidderConfig bidder options must be an object');
      }
      if (!(Array.isArray(obj.bidders) && obj.bidders.length)) {
        throw new Error('setBidderConfig bidder options must contain a bidders list with at least 1 bidder');
      }
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(obj.config)) {
        throw new Error('setBidderConfig bidder options must contain a config object');
      }
    }
  }
  function mergeConfig(config) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(config)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('mergeConfig input must be an object');
      return;
    }
    const mergedConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)(_getConfig(), config);
    const updatedConfig = Object.keys(config).reduce((accumulator, topic) => {
      if (Object.prototype.hasOwnProperty.call(mergedConfig, topic)) {
        accumulator[topic] = mergedConfig[topic];
      }
      return accumulator;
    }, {});
    setConfig(updatedConfig);
    return mergedConfig;
  }
  function mergeBidderConfig(config) {
    return setBidderConfig(config, true);
  }

  /**
   * Internal functions for core to execute some synchronous code while having an active bidder set.
   */
  function runWithBidder(bidder, fn) {
    currBidder = bidder;
    try {
      return fn();
    } finally {
      resetBidder();
    }
  }
  function callbackWithBidder(bidder) {
    return function (cb) {
      return function (...args) {
        if (typeof cb === 'function') {
          return runWithBidder(bidder, cb.bind(this, ...args));
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('config.callbackWithBidder callback is not a function');
        }
      };
    };
  }
  function getCurrentBidder() {
    return currBidder;
  }
  function resetBidder() {
    currBidder = null;
  }
  resetConfig();
  return {
    getCurrentBidder,
    resetBidder,
    getConfig,
    getAnyConfig,
    readConfig,
    readAnyConfig,
    setConfig,
    mergeConfig,
    setDefaults,
    resetConfig,
    runWithBidder,
    callbackWithBidder,
    setBidderConfig,
    getBidderConfig,
    mergeBidderConfig
  };
}

/**
 * Set a `cache.url` if we should use prebid-cache to store video bids before adding bids to the auction.
 * This must be set if you want to use the gamAdServerVideo module.
 */
const config = newConfig();

/***/ },

/***/ "./src/consentHandler.js"
/*!*******************************!*\
  !*** ./src/consentHandler.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GDPR_GVLIDS: () => (/* binding */ GDPR_GVLIDS),
/* harmony export */   GVL_PURPOSES: () => (/* binding */ GVL_PURPOSES),
/* harmony export */   VENDORLESS_GVLID: () => (/* binding */ VENDORLESS_GVLID),
/* harmony export */   allConsent: () => (/* binding */ allConsent),
/* harmony export */   coppaDataHandler: () => (/* binding */ coppaDataHandler),
/* harmony export */   gdprDataHandler: () => (/* binding */ gdprDataHandler),
/* harmony export */   gppDataHandler: () => (/* binding */ gppDataHandler),
/* harmony export */   uspDataHandler: () => (/* binding */ uspDataHandler)
/* harmony export */ });
/* unused harmony exports CONSENT_GDPR, CONSENT_GPP, CONSENT_USP, CONSENT_COPPA, consentHandler, gvlidRegistry, multiHandler */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.js */ "./src/config.js");



/**
 * Placeholder gvlid for when vendor consent is not required. When this value is used as gvlid, the gdpr
 * enforcement module will take it to mean "vendor consent was given".
 *
 * see https://github.com/prebid/Prebid.js/issues/8161
 */
const VENDORLESS_GVLID = Symbol("VENDORLESS_GVLID");
const CONSENT_GDPR = 'gdpr';
const CONSENT_GPP = 'gpp';
const CONSENT_USP = 'usp';
const CONSENT_COPPA = 'coppa';

/**
 * Consent data by framework. Every member type is declared in core, so it is known whether or not
 * the module that populates it is part of the build; the data itself is only ever collected by that
 * module.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

function consentHandler({
  getMeta = (consentData, generatedAt) => ({
    generatedAt
  }),
  hashFields
} = {}) {
  let enabled;
  let dirty;
  let df;
  let generatedTime;
  let consentData;
  let ready;
  let hash;
  let error;
  let hasError;
  let listeners;
  function reset() {
    df = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_2__.defer)();
    enabled = false;
    consentData = null;
    ready = false;
    generatedTime = null;
    dirty = true;
    hash = null;
    error = null;
    hasError = false;
    listeners = [];
  }
  function getHashData(consentData) {
    return consentData && hashFields ? hashFields.map(f => consentData[f]) : consentData;
  }
  function hasConsentChanged(newConsentData) {
    return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(getHashData(consentData), getHashData(newConsentData));
  }
  function notifyListeners() {
    if (dirty) {
      listeners.forEach(l => l(consentData));
    }
  }
  function resolve(data) {
    dirty = hasConsentChanged(data);
    consentData = data;
    hasError = false;
    error = null;
    ready = true;
    df.resolve(data);
    notifyListeners();
  }
  function reject(err) {
    dirty = hasConsentChanged(null);
    consentData = null;
    ready = true;
    error = err;
    hasError = true;
    df.reject(err);
    notifyListeners();
  }
  reset();
  return {
    reset,
    get generatedTime() {
      return generatedTime;
    },
    enable() {
      enabled = true;
    },
    get enabled() {
      return enabled;
    },
    get ready() {
      return ready;
    },
    get promise() {
      if (ready) {
        return hasError ? _utils_promise_js__WEBPACK_IMPORTED_MODULE_2__.PbPromise.reject(error) : _utils_promise_js__WEBPACK_IMPORTED_MODULE_2__.PbPromise.resolve(consentData);
      }
      if (!enabled) {
        resolve(null);
      }
      return df.promise;
    },
    setConsentData(data, time = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.timestamp)()) {
      generatedTime = time;
      resolve(data);
    },
    getConsentData() {
      return enabled ? consentData : null;
    },
    getConsentMeta() {
      if (generatedTime != null && consentData != null) {
        return getMeta(consentData, generatedTime);
      }
    },
    error: reject,
    get hash() {
      if (dirty) {
        hash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.cyrb53Hash)(JSON.stringify(getHashData(consentData)));
        dirty = false;
      }
      return hash;
    },
    onChange(listener) {
      listeners.push(listener);
    }
  };
}
const uspDataHandler = consentHandler();
const gdprDataHandler = consentHandler({
  getMeta(consentData, generatedAt) {
    if (consentData.vendorData) {
      return {
        gdprApplies: consentData.gdprApplies,
        consentStringSize: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(consentData.vendorData.tcString) ? consentData.vendorData.tcString.length : 0,
        generatedAt,
        apiVersion: consentData.apiVersion
      };
    }
  },
  hashFields: ['gdprApplies', 'consentString']
});
const gppDataHandler = consentHandler({
  hashFields: ['applicableSections', 'gppString']
});
const coppaDataHandler = (() => {
  const handler = (handler => Object.assign(handler, {
    getCoppa() {
      return handler.getConsentData();
    },
    reset() {}
  }))(consentHandler({
    getMeta(consentData, generatedAt) {
      return consentData;
    }
  }));
  handler.enable();
  handler.setConsentData(!!_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('coppa'));
  _config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('coppa', cfg => {
    // on resetConfig cfg.coppa comes in as an empty object
    handler.setConsentData(typeof cfg.coppa === 'object' && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(cfg.coppa) ? false : !!cfg.coppa);
  });
  return handler;
})();
function gvlidRegistry() {
  const registry = {};
  const flat = {};
  const none = {};
  return {
    /**
     * Register a module's GVL ID.
     * @param moduleType defined in `activities/modules.js`
     * @param moduleName
     * @param gvlid
     */
    register(moduleType, moduleName, gvlid) {
      if (gvlid) {
        (registry[moduleName] = registry[moduleName] || {})[moduleType] = gvlid;
        if (flat.hasOwnProperty(moduleName)) {
          if (flat[moduleName] !== gvlid) flat[moduleName] = none;
        } else {
          flat[moduleName] = gvlid;
        }
      }
    },
    /**
     * Get a module's GVL ID(s).
     *
     * @param moduleName - The name of the module.
     * @return An object where:
     *   `modules` is a map from module type to that module's GVL ID;
     *   `gvlid` is the single GVL ID for this family of modules (only defined if all modules with this name declare the same ID).
     */
    get(moduleName) {
      const result = {
        modules: registry[moduleName] || {}
      };
      if (flat.hasOwnProperty(moduleName) && flat[moduleName] !== none) {
        result.gvlid = flat[moduleName];
      }
      return result;
    }
  };
}
const GDPR_GVLIDS = gvlidRegistry();
const ALL_HANDLERS = {
  [CONSENT_GDPR]: gdprDataHandler,
  [CONSENT_USP]: uspDataHandler,
  [CONSENT_GPP]: gppDataHandler,
  [CONSENT_COPPA]: coppaDataHandler
};
function multiHandler(handlers = ALL_HANDLERS) {
  const entries = Object.entries(handlers);
  function collector(method) {
    return function () {
      return Object.fromEntries(entries.map(([name, handler]) => [name, handler[method]()]));
    };
  }
  const getConsentData = collector('getConsentData');
  const resetAll = collector('reset');
  let listeners;
  function reset() {
    listeners = [];
    Object.values(handlers).forEach(handler => handler.onChange(() => {
      listeners.forEach(listener => listener(getConsentData()));
    }));
  }
  reset();
  return {
    getConsentData,
    onChange(listener) {
      listeners.push(listener);
    },
    get promise() {
      return _utils_promise_js__WEBPACK_IMPORTED_MODULE_2__.PbPromise.all(entries.map(([name, handler]) => handler.promise.then(val => [name, val]))).then(entries => Object.fromEntries(entries));
    },
    get hash() {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.cyrb53Hash)(entries.map(([_, handler]) => handler.hash).join(':'));
    },
    getConsentMeta: collector('getConsentMeta'),
    reset() {
      resetAll();
      reset();
    }
  };
}
const allConsent = multiHandler();
const GVL_PURPOSES = {}; // this is populated by plugins/gvlPurposes.js

/***/ },

/***/ "./src/constants.js"
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AD_RENDER_FAILED_REASON: () => (/* binding */ AD_RENDER_FAILED_REASON),
/* harmony export */   BID_STATUS: () => (/* binding */ BID_STATUS),
/* harmony export */   DEBUG_MODE: () => (/* binding */ DEBUG_MODE),
/* harmony export */   DEFAULT_TARGETING_KEYS: () => (/* binding */ DEFAULT_TARGETING_KEYS),
/* harmony export */   EVENTS: () => (/* binding */ EVENTS),
/* harmony export */   EVENT_ID_PATHS: () => (/* binding */ EVENT_ID_PATHS),
/* harmony export */   GRANULARITY_OPTIONS: () => (/* binding */ GRANULARITY_OPTIONS),
/* harmony export */   JSON_MAPPING: () => (/* binding */ JSON_MAPPING),
/* harmony export */   MESSAGES: () => (/* binding */ MESSAGES),
/* harmony export */   NATIVE_ASSET_TYPES: () => (/* binding */ NATIVE_ASSET_TYPES),
/* harmony export */   NATIVE_IMAGE_TYPES: () => (/* binding */ NATIVE_IMAGE_TYPES),
/* harmony export */   NATIVE_KEYS: () => (/* binding */ NATIVE_KEYS),
/* harmony export */   NATIVE_KEYS_THAT_ARE_NOT_ASSETS: () => (/* binding */ NATIVE_KEYS_THAT_ARE_NOT_ASSETS),
/* harmony export */   PB_LOCATOR: () => (/* binding */ PB_LOCATOR),
/* harmony export */   PREBID_NATIVE_DATA_KEYS_TO_ORTB: () => (/* binding */ PREBID_NATIVE_DATA_KEYS_TO_ORTB),
/* harmony export */   REJECTION_REASON: () => (/* binding */ REJECTION_REASON),
/* harmony export */   S2S: () => (/* binding */ S2S),
/* harmony export */   TARGETING_KEYS: () => (/* binding */ TARGETING_KEYS)
/* harmony export */ });
/* unused harmony export STATUS */
const JSON_MAPPING = {
  PL_CODE: 'code',
  PL_SIZE: 'sizes',
  PL_BIDS: 'bids',
  BD_BIDDER: 'bidder',
  BD_ID: 'paramsd',
  BD_PL_ID: 'placementId',
  ADSERVER_TARGETING: 'adserverTargeting',
  BD_SETTING_STANDARD: 'standard'
};
const DEBUG_MODE = 'pbjs_debug';
const STATUS = {
  GOOD: 1
};
const EVENTS = {
  AUCTION_INIT: 'auctionInit',
  AUCTION_TIMEOUT: 'auctionTimeout',
  AUCTION_END: 'auctionEnd',
  BID_ADJUSTMENT: 'bidAdjustment',
  BID_TIMEOUT: 'bidTimeout',
  BID_REQUESTED: 'bidRequested',
  BID_RESPONSE: 'bidResponse',
  BID_ACCEPTED: 'bidAccepted',
  BID_REJECTED: 'bidRejected',
  NO_BID: 'noBid',
  BID_WON: 'bidWon',
  BIDDER_DONE: 'bidderDone',
  BIDDER_ERROR: 'bidderError',
  SET_TARGETING: 'setTargeting',
  BEFORE_REQUEST_BIDS: 'beforeRequestBids',
  BEFORE_BIDDER_HTTP: 'beforeBidderHttp',
  REQUEST_BIDS: 'requestBids',
  AD_RENDER_FAILED: 'adRenderFailed',
  AD_RENDER_SUCCEEDED: 'adRenderSucceeded',
  TCF2_ENFORCEMENT: 'tcf2Enforcement',
  AUCTION_DEBUG: 'auctionDebug',
  BID_VIEWABLE: 'bidViewable',
  STALE_RENDER: 'staleRender',
  EXPIRED_RENDER: 'expiredRender',
  BILLABLE_EVENT: 'billableEvent',
  PBS_ANALYTICS: 'pbsAnalytics',
  BEFORE_PBS_HTTP: 'beforePBSHttp',
  BROWSI_INIT: 'browsiInit',
  BROWSI_DATA: 'browsiData',
  BROWSER_INTERVENTION: 'browserIntervention'
};
const AD_RENDER_FAILED_REASON = {
  PREVENT_WRITING_ON_MAIN_DOCUMENT: 'preventWritingOnMainDocument',
  NO_AD: 'noAd',
  EXCEPTION: 'exception',
  CANNOT_FIND_AD: 'cannotFindAd',
  MISSING_DOC_OR_ADID: 'missingDocOrAdid'
};
const EVENT_ID_PATHS = {
  bidWon: 'adUnitCode'
};
const GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};
const TARGETING_KEYS = {
  BIDDER: 'hb_bidder',
  AD_ID: 'hb_adid',
  PRICE_BUCKET: 'hb_pb',
  SIZE: 'hb_size',
  DEAL: 'hb_deal',
  SOURCE: 'hb_source',
  FORMAT: 'hb_format',
  UUID: 'hb_uuid',
  CACHE_ID: 'hb_cache_id',
  CACHE_HOST: 'hb_cache_host',
  ADOMAIN: 'hb_adomain',
  ACAT: 'hb_acat',
  CRID: 'hb_crid',
  DSP: 'hb_dsp',
  VERSION: 'hb_ver'
};
const DEFAULT_TARGETING_KEYS = {
  BIDDER: 'hb_bidder',
  AD_ID: 'hb_adid',
  PRICE_BUCKET: 'hb_pb',
  SIZE: 'hb_size',
  DEAL: 'hb_deal',
  FORMAT: 'hb_format',
  UUID: 'hb_uuid',
  CACHE_HOST: 'hb_cache_host',
  VERSION: 'hb_ver'
};
const NATIVE_KEYS = {
  title: 'hb_native_title',
  body: 'hb_native_body',
  body2: 'hb_native_body2',
  privacyLink: 'hb_native_privacy',
  privacyIcon: 'hb_native_privicon',
  sponsoredBy: 'hb_native_brand',
  image: 'hb_native_image',
  icon: 'hb_native_icon',
  clickUrl: 'hb_native_linkurl',
  displayUrl: 'hb_native_displayurl',
  cta: 'hb_native_cta',
  rating: 'hb_native_rating',
  address: 'hb_native_address',
  downloads: 'hb_native_downloads',
  likes: 'hb_native_likes',
  phone: 'hb_native_phone',
  price: 'hb_native_price',
  salePrice: 'hb_native_saleprice',
  rendererUrl: 'hb_renderer_url',
  adTemplate: 'hb_adTemplate'
};
const S2S = {
  SRC: 's2s',
  DEFAULT_ENDPOINT: 'https://prebid.adnxs.com/pbs/v1/openrtb2/auction',
  SYNCED_BIDDERS_KEY: 'pbjsSyncs'
};
const BID_STATUS = {
  BID_TARGETING_SET: 'targetingSet',
  RENDERED: 'rendered',
  BID_REJECTED: 'bidRejected'
};
const REJECTION_REASON = {
  INVALID: 'Bid has missing or invalid properties',
  INVALID_REQUEST_ID: 'Invalid request ID',
  BIDDER_DISALLOWED: 'Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes',
  FLOOR_NOT_MET: 'Bid does not meet price floor',
  CANNOT_CONVERT_CURRENCY: 'Unable to convert currency',
  DSA_REQUIRED: 'Bid does not provide required DSA transparency info',
  DSA_MISMATCH: 'Bid indicates inappropriate DSA rendering method',
  PRICE_TOO_HIGH: 'Bid price exceeds maximum value'
};
const PREBID_NATIVE_DATA_KEYS_TO_ORTB = {
  body: 'desc',
  body2: 'desc2',
  sponsoredBy: 'sponsored',
  cta: 'ctatext',
  rating: 'rating',
  address: 'address',
  downloads: 'downloads',
  likes: 'likes',
  phone: 'phone',
  price: 'price',
  salePrice: 'saleprice',
  displayUrl: 'displayurl'
};
const NATIVE_ASSET_TYPES = {
  sponsored: 1,
  desc: 2,
  rating: 3,
  likes: 4,
  downloads: 5,
  price: 6,
  saleprice: 7,
  phone: 8,
  address: 9,
  desc2: 10,
  displayurl: 11,
  ctatext: 12
};
const NATIVE_IMAGE_TYPES = {
  ICON: 1,
  MAIN: 3
};
const NATIVE_KEYS_THAT_ARE_NOT_ASSETS = ['privacyIcon', 'clickUrl', 'adTemplate', 'rendererUrl', 'type'];
const MESSAGES = {
  REQUEST: 'Prebid Request',
  RESPONSE: 'Prebid Response',
  NATIVE: 'Prebid Native',
  EVENT: 'Prebid Event',
  INTERVENTION: 'Prebid Intervention'
};
const PB_LOCATOR = '__pb_locator__';

/***/ },

/***/ "./src/cpmBucketManager.js"
/*!*********************************!*\
  !*** ./src/cpmBucketManager.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPriceBucketString: () => (/* binding */ getPriceBucketString),
/* harmony export */   isValidPriceConfig: () => (/* binding */ isValidPriceConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* eslint-disable array-callback-return */


const _defaultPrecision = 2;
const _lgPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.5
  }]
};
const _mgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.1
  }]
};
const _hgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.01
  }]
};
const _densePriceConfig = {
  'buckets': [{
    'max': 3,
    'increment': 0.01
  }, {
    'max': 8,
    'increment': 0.05
  }, {
    'max': 20,
    'increment': 0.5
  }]
};
const _autoPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.05
  }, {
    'max': 10,
    'increment': 0.1
  }, {
    'max': 20,
    'increment': 0.5
  }]
};
function getPriceBucketString(cpm, customConfig, granularityMultiplier = 1) {
  let cpmFloat = parseFloat(cpm);
  if (isNaN(cpmFloat)) {
    cpmFloat = '';
  }
  return {
    low: cpmFloat === '' ? '' : getCpmStringValue(cpm, _lgPriceConfig, granularityMultiplier),
    med: cpmFloat === '' ? '' : getCpmStringValue(cpm, _mgPriceConfig, granularityMultiplier),
    high: cpmFloat === '' ? '' : getCpmStringValue(cpm, _hgPriceConfig, granularityMultiplier),
    auto: cpmFloat === '' ? '' : getCpmStringValue(cpm, _autoPriceConfig, granularityMultiplier),
    dense: cpmFloat === '' ? '' : getCpmStringValue(cpm, _densePriceConfig, granularityMultiplier),
    custom: cpmFloat === '' ? '' : getCpmStringValue(cpm, customConfig, granularityMultiplier)
  };
}
function getCpmStringValue(cpm, config, granularityMultiplier) {
  let cpmStr = '';
  if (!isValidPriceConfig(config)) {
    return cpmStr;
  }
  const cap = config.buckets.reduce((prev, curr) => {
    if (prev.max > curr.max) {
      return prev;
    }
    return curr;
  }, {
    'max': 0
  });
  let bucketFloor = 0;
  const bucket = config.buckets.find(bucket => {
    if (cpm > cap.max * granularityMultiplier) {
      // cpm exceeds cap, just return the cap.
      let precision = bucket.precision;
      if (typeof precision === 'undefined') {
        precision = _defaultPrecision;
      }
      cpmStr = (bucket.max * granularityMultiplier).toFixed(precision);
    } else if (cpm <= bucket.max * granularityMultiplier && cpm >= bucketFloor * granularityMultiplier) {
      bucket.min = bucketFloor;
      return bucket;
    } else {
      bucketFloor = bucket.max;
    }
  });
  if (bucket) {
    cpmStr = getCpmTarget(cpm, bucket, granularityMultiplier);
  }
  return cpmStr;
}
function isValidPriceConfig(config) {
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(config) || !config.buckets || !Array.isArray(config.buckets)) {
    return false;
  }
  let isValid = true;
  config.buckets.forEach(bucket => {
    if (!bucket.max || !bucket.increment) {
      isValid = false;
    }
  });
  return isValid;
}
function getCpmTarget(cpm, bucket, granularityMultiplier) {
  const precision = typeof bucket.precision !== 'undefined' ? bucket.precision : _defaultPrecision;
  const increment = bucket.increment * granularityMultiplier;
  const bucketMin = bucket.min * granularityMultiplier;
  let roundingFunction = Math.floor;
  const customRoundingFunction = _config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cpmRoundingFunction');
  if (typeof customRoundingFunction === 'function') {
    roundingFunction = customRoundingFunction;
  }

  // start increments at the bucket min and then add bucket min back to arrive at the correct rounding
  // note - we're padding the values to avoid using decimals in the math prior to flooring
  // this is done as JS can return values slightly below the expected mark which would skew the price bucket target
  //   (eg 4.01 / 0.01 = 400.99999999999994)
  // min precison should be 2 to move decimal place over.
  const pow = Math.pow(10, precision + 2);
  const cpmToRound = (cpm * pow - bucketMin * pow) / (increment * pow);
  let cpmTarget;
  let invalidRounding;
  // It is likely that we will be passed {cpmRoundingFunction: roundingFunction()}
  // rather than the expected {cpmRoundingFunction: roundingFunction}. Default back to floor in that case
  try {
    cpmTarget = roundingFunction(cpmToRound) * increment + bucketMin;
  } catch (err) {
    invalidRounding = true;
  }
  if (invalidRounding || typeof cpmTarget !== 'number') {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('Invalid rounding function passed in config');
    cpmTarget = Math.floor(cpmToRound) * increment + bucketMin;
  }
  // force to 10 decimal places to deal with imprecise decimal/binary conversions
  //    (for example 0.1 * 3 = 0.30000000000000004)

  cpmTarget = Number(cpmTarget.toFixed(10));
  return cpmTarget.toFixed(precision);
}


/***/ },

/***/ "./src/creativeRenderers.js"
/*!**********************************!*\
  !*** ./src/creativeRenderers.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PUC_MIN_VERSION: () => (/* binding */ PUC_MIN_VERSION),
/* harmony export */   getCreativeDefaultRendererSource: () => (/* binding */ getCreativeDefaultRendererSource),
/* harmony export */   getCreativeRenderer: () => (/* binding */ getCreativeRenderer),
/* harmony export */   getCreativeRendererSource: () => (/* binding */ getCreativeRendererSource)
/* harmony export */ });
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _creative_renderers_display_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../creative-renderers/display.js */ "./creative-renderers/display.js");
/* harmony import */ var _creative_renderers_safe_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../creative-renderers/safe.js */ "./creative-renderers/safe.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _adRendering_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./adRendering.js */ "./src/adRendering.js");


// eslint-disable-next-line import/no-unresolved
 // autogenerated during precompilation
// eslint-disable-next-line import/no-unresolved
 // autogenerated during precompilation



// the minimum rendererVersion that will be used by PUC
const PUC_MIN_VERSION = 3;
const getCreativeDefaultRendererSource = (0,_hook_js__WEBPACK_IMPORTED_MODULE_4__.hook)('sync', function (bidResponse) {
  return _creative_renderers_display_js__WEBPACK_IMPORTED_MODULE_2__.RENDERER;
});
const getCreativeRendererSource = function (bidResponse) {
  if ((0,_adRendering_js__WEBPACK_IMPORTED_MODULE_5__.getSafeRenderer)(bidResponse)) {
    return _creative_renderers_safe_js__WEBPACK_IMPORTED_MODULE_3__.RENDERER;
  }
  return getCreativeDefaultRendererSource(bidResponse);
};
const getCreativeRenderer = function () {
  const renderers = {};
  return function (bidResponse) {
    const src = getCreativeRendererSource(bidResponse);
    if (!renderers.hasOwnProperty(src)) {
      renderers[src] = new _utils_promise_js__WEBPACK_IMPORTED_MODULE_0__.PbPromise(resolve => {
        const iframe = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createInvisibleIframe)();
        iframe.srcdoc = `
            <script>${src}</script>
            <script>
              window.parent.postMessage(
                  { type: 'RENDERER_READY_${bidResponse.adId}' },
                  '*'
            );</script>`;
        const listenerForRendererReady = event => {
          if (event.source !== iframe.contentWindow) return;
          if (event.data?.type === `RENDERER_READY_${bidResponse.adId}`) {
            window.removeEventListener('message', listenerForRendererReady);
            resolve(iframe.contentWindow.render);
          }
        };
        window.addEventListener('message', listenerForRendererReady);
        document.body.appendChild(iframe);
      });
    }
    return renderers[src];
  };
}();

/***/ },

/***/ "./src/debugging.js"
/*!**************************!*\
  !*** ./src/debugging.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEBUG_KEY: () => (/* binding */ DEBUG_KEY),
/* harmony export */   getPubcidOptout: () => (/* binding */ getPubcidOptout),
/* harmony export */   loadSession: () => (/* binding */ loadSession)
/* harmony export */ });
/* unused harmony exports debuggingModuleLoader, debuggingControls, reset */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _bidfactory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _Renderer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _libraries_fpdUtils_pubcidOptout_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libraries/fpdUtils/pubcidOptout.js */ "./libraries/fpdUtils/pubcidOptout.js");
/* harmony import */ var _standaloneModuleLoader_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./standaloneModuleLoader.js */ "./src/standaloneModuleLoader.js");
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");












const STORAGE = (0,_storageManager_js__WEBPACK_IMPORTED_MODULE_7__.getCoreStorageManager)('debugging');
function getPubcidOptout() {
  return (0,_libraries_fpdUtils_pubcidOptout_js__WEBPACK_IMPORTED_MODULE_8__.hasPubcidOptout)(STORAGE);
}
const DEBUG_KEY = `__${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_10__.getGlobalVarName)()}_debugging__`;
function debuggingModuleLoader({
  alreadyInstalled,
  script
} = {}) {
  return (0,_standaloneModuleLoader_js__WEBPACK_IMPORTED_MODULE_9__.standaloneModuleLoader)({
    moduleName: 'debugging',
    installProp: '_installDebugging',
    bundle: 'debugging-standalone.js',
    deps: {
      DEBUG_KEY,
      hook: _hook_js__WEBPACK_IMPORTED_MODULE_1__.hook,
      config: _config_js__WEBPACK_IMPORTED_MODULE_0__.config,
      createBid: _bidfactory_js__WEBPACK_IMPORTED_MODULE_3__.createBid,
      logger: (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.prefixLog)('DEBUG:'),
      utils: _utils_js__WEBPACK_IMPORTED_MODULE_2__,
      BANNER: _mediaTypes_js__WEBPACK_IMPORTED_MODULE_5__.BANNER,
      NATIVE: _mediaTypes_js__WEBPACK_IMPORTED_MODULE_5__.NATIVE,
      VIDEO: _mediaTypes_js__WEBPACK_IMPORTED_MODULE_5__.VIDEO,
      Renderer: _Renderer_js__WEBPACK_IMPORTED_MODULE_6__.Renderer,
      getPubcidOptout
    },
    alreadyInstalled,
    script
  });
}
function debuggingControls({
  load = debuggingModuleLoader(),
  hook = (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.getHook)('requestBids')
} = {}) {
  let promise = null;
  let enabled = false;
  function waitForDebugging(next, ...args) {
    return (promise || _utils_promise_js__WEBPACK_IMPORTED_MODULE_4__.PbPromise.resolve()).catch(e => {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(`Could not load debugging module`, e);
    }).then(() => next.apply(this, args));
  }
  function enable() {
    if (!enabled) {
      promise = load();
      // set debugging to high priority so that it has the opportunity to mess with most things
      hook.before(waitForDebugging, 99);
      enabled = true;
    }
  }
  function disable() {
    hook.getHooks({
      hook: waitForDebugging
    }).remove();
    enabled = false;
  }
  function reset() {
    promise = null;
    disable();
  }
  return {
    enable,
    disable,
    reset
  };
}
const ctl = debuggingControls();
const reset = ctl.reset;
function loadSession() {
  let storage = null;
  try {
    // eslint-disable-next-line no-restricted-properties
    storage = window.sessionStorage;
  } catch (e) {}
  if (storage !== null) {
    const debugging = ctl;
    let config = null;
    try {
      config = storage.getItem(DEBUG_KEY);
    } catch (e) {}
    if (config !== null) {
      // just make sure the module runs; it will take care of parsing the config (and disabling itself if necessary)
      debugging.enable();
    }
  }
}
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('debugging', function ({
  debugging
}) {
  debugging?.enabled ? ctl.enable() : ctl.disable();
});

/***/ },

/***/ "./src/devtoolsMcp.js"
/*!****************************!*\
  !*** ./src/devtoolsMcp.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initDevtoolsMcp: () => (/* binding */ initDevtoolsMcp)
/* harmony export */ });
/* unused harmony exports devtoolsMcpLoader, shouldLoadDevtoolsMcp */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidTTL_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./bidTTL.js */ "./src/bidTTL.js");
/* harmony import */ var _targeting_filters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./targeting/filters.js */ "./src/targeting/filters.js");
/* harmony import */ var _standaloneModuleLoader_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./standaloneModuleLoader.js */ "./src/standaloneModuleLoader.js");








const MODULE_NAME = 'devtoolsMcp';
const STANDALONE_BUNDLE = `${MODULE_NAME}-standalone.js`;

// Dependencies handed to the module's `install`. Kept here (in core) so the
// on-demand standalone bundle can stay free of Prebid internals.
const DEPS = {
  auctionManager: _auctionManager_js__WEBPACK_IMPORTED_MODULE_4__.auctionManager,
  getGlobal: _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.getGlobal,
  getBufferedTTL: _bidTTL_js__WEBPACK_IMPORTED_MODULE_5__.getBufferedTTL,
  getEffectiveMinBidCacheTTL: _bidTTL_js__WEBPACK_IMPORTED_MODULE_5__.getEffectiveMinBidCacheTTL,
  isBidUsable: _targeting_filters_js__WEBPACK_IMPORTED_MODULE_6__.isBidUsable,
  getGlobalVarName: _buildOptions_js__WEBPACK_IMPORTED_MODULE_3__.getGlobalVarName,
  shouldDefineGlobal: _buildOptions_js__WEBPACK_IMPORTED_MODULE_3__.shouldDefineGlobal
};

/**
 * Load the devtoolsMcp standalone bundle (once) and install it with the core
 * dependencies. Unlike the debugging loader this has no relation to auctions -
 * it simply pulls in the bundle.
 */
function devtoolsMcpLoader({
  alreadyInstalled,
  script,
  deps = DEPS
} = {}) {
  return (0,_standaloneModuleLoader_js__WEBPACK_IMPORTED_MODULE_7__.standaloneModuleLoader)({
    moduleName: MODULE_NAME,
    installProp: '_installDevtoolsMcp',
    bundle: STANDALONE_BUNDLE,
    deps,
    alreadyInstalled,
    script
  });
}
function shouldLoadDevtoolsMcp() {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.debugTurnedOn)();
}

/**
 * Watch for the load condition (debug turned on) and pull in the module the
 * first time it is met.
 */
function initDevtoolsMcp({
  load = devtoolsMcpLoader(),
  shouldLoad = shouldLoadDevtoolsMcp
} = {}) {
  let requested = false;
  function check() {
    if (!requested && shouldLoad()) {
      requested = true;
      load().catch(e => (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)('Could not load DevTools MCP module', e));
    }
  }
  // `debug` may already be on (URL param / session) or be enabled later via setConfig
  const unsubscribe = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('debug', check);
  check();
  return unsubscribe;
}

/***/ },

/***/ "./src/eventTrackers.js"
/*!******************************!*\
  !*** ./src/eventTrackers.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EVENT_TYPE_IMPRESSION: () => (/* binding */ EVENT_TYPE_IMPRESSION),
/* harmony export */   EVENT_TYPE_VIEWABLE: () => (/* binding */ EVENT_TYPE_VIEWABLE),
/* harmony export */   EVENT_TYPE_WIN: () => (/* binding */ EVENT_TYPE_WIN),
/* harmony export */   TRACKER_METHOD_IMG: () => (/* binding */ TRACKER_METHOD_IMG),
/* harmony export */   TRACKER_METHOD_JS: () => (/* binding */ TRACKER_METHOD_JS),
/* harmony export */   parseEventTrackers: () => (/* binding */ parseEventTrackers)
/* harmony export */ });
const TRACKER_METHOD_IMG = 1;
const TRACKER_METHOD_JS = 2;
const EVENT_TYPE_IMPRESSION = 1;
const EVENT_TYPE_WIN = 500;
const EVENT_TYPE_VIEWABLE = 2;

/**
 * Returns a map from event type (EVENT_TYPE_*)
 * to a map from tracker method (TRACKER_METHOD_*)
 * to an array of tracking URLs
 *
 * @param {{}[]} eventTrackers an array of "Event Tracker Response Object" as defined
 *  in the ORTB native 1.2 spec (https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf, section 5.8)
 * @returns {{[type: string]: {[method: string]: string[]}}}
 */
function parseEventTrackers(eventTrackers) {
  return (eventTrackers ?? []).reduce((tally, {
    event,
    method,
    url
  }) => {
    const trackersForType = tally[event] = tally[event] ?? {};
    const trackersForMethod = trackersForType[method] = trackersForType[method] ?? [];
    trackersForMethod.push(url);
    return tally;
  }, {});
}

/***/ },

/***/ "./src/events.js"
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   emit: () => (/* binding */ emit),
/* harmony export */   getEvents: () => (/* binding */ getEvents),
/* harmony export */   off: () => (/* binding */ off),
/* harmony export */   on: () => (/* binding */ on)
/* harmony export */ });
/* unused harmony exports get, addEvents, has, listen, clearEvents */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/ttlCollection.js */ "./src/utils/ttlCollection.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/logging.js */ "./src/utils/logging.js");
/**
 * events.js
 */






// hide video events (unless the video module is included) with this one weird trick

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

const TTL_CONFIG = 'eventHistoryTTL';
let eventTTL = null;

// keep a record of all events fired
const eventsFired = (0,_utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_2__.ttlCollection)({
  monotonic: true,
  ttl: () => eventTTL
});
_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig(TTL_CONFIG, cfg => {
  const previous = eventTTL;
  const val = cfg?.[TTL_CONFIG];
  eventTTL = typeof val === 'number' ? val * 1000 : null;
  if (previous !== eventTTL) {
    eventsFired.refresh();
  }
});

// define entire events
let allEvents = Object.values(_constants_js__WEBPACK_IMPORTED_MODULE_1__.EVENTS);
const idPaths = _constants_js__WEBPACK_IMPORTED_MODULE_1__.EVENT_ID_PATHS;
let counter = 0;
const HANDLERS = new WeakMap();
const _public = function () {
  const _handlers = {};
  function _dispatch(eventName, args) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage('Emitting event for: ' + eventName);
    const eventPayload = args[0] || {};
    const idPath = idPaths[eventName];
    const key = eventPayload[idPath];
    const event = _handlers[eventName] || {
      que: []
    };
    var eventKeys = Object.keys(event);
    const callbacks = [];

    // record the event:
    const eventRecord = {
      eventType: eventName,
      args: eventPayload,
      id: key,
      elapsedTime: _utils_js__WEBPACK_IMPORTED_MODULE_0__.getPerformanceNow(),
      sequence: counter++
    };
    eventsFired.add(eventRecord);

    /**
     * Push each specific callback to the `callbacks` array.
     * If the `event` map has a key that matches the value of the
     * event payload id path, e.g. `eventPayload[idPath]`, then apply
     * each function in the `que` array as an argument to push to the
     * `callbacks` array
     */
    if (key && eventKeys.includes(key)) {
      callbacks.push(...event[key].que);
    }

    /** Push each general callback to the `callbacks` array. */
    callbacks.push(...event.que);

    /** call each of the callbacks */
    (callbacks || []).forEach(function (fn) {
      if (!fn) return;
      try {
        fn(eventRecord, ...args);
      } catch (e) {
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError('Error executing handler:', 'events.js', e, eventName);
      }
    });
  }
  function _checkAvailableEvent(event) {
    return allEvents.includes(event);
  }
  function listen(eventName, handler, id) {
    // check whether available event or not
    if (_checkAvailableEvent(eventName)) {
      const event = _handlers[eventName] || {
        que: []
      };
      if (id) {
        event[id] = event[id] || {
          que: []
        };
        event[id].que.push(handler);
      } else {
        event.que.push(handler);
      }
      _handlers[eventName] = event;
    } else {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError('Wrong event name : ' + eventName + ' Valid event names :' + allEvents);
    }
  }
  return {
    has: _checkAvailableEvent,
    listen,
    on: function (eventName, handler, id) {
      const innerHandler = HANDLERS.has(handler) ? HANDLERS.get(handler) : (_, ...args) => handler(...args);
      HANDLERS.set(handler, innerHandler);
      listen(eventName, innerHandler, id);
    },
    emit: function (eventName, ...args) {
      _dispatch(eventName, args);
    },
    off: function (eventName, handler, id) {
      if (handler != null && HANDLERS.has(handler)) {
        handler = HANDLERS.get(handler);
      }
      const event = _handlers[eventName];
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event) || _utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event.que) && _utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event[id])) {
        return;
      }
      if (id && (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event[id]) || _utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event[id].que))) {
        return;
      }
      const removeHandler = que => que.filter(item => item !== handler);
      if (id && event[id].que?.length > 0) {
        event[id].que = removeHandler(event[id].que);
      } else if (event.que?.length > 0) {
        event.que = removeHandler(event.que);
      }
      _handlers[eventName] = event;
    },
    get: function () {
      return _handlers;
    },
    addEvents: function (events) {
      allEvents = allEvents.concat(events);
    },
    /**
     * Return a copy of all events fired
     */
    getEvents: function () {
      return eventsFired.toArray().map(val => Object.assign({}, val));
    }
  };
}();
(0,_utils_logging_js__WEBPACK_IMPORTED_MODULE_4__._setEventEmitter)(_public.emit.bind(_public));
const {
  on,
  off,
  get,
  getEvents,
  emit,
  addEvents,
  has,
  listen
} = _public;
function clearEvents() {
  counter = 0;
  eventsFired.clear();
}

/***/ },

/***/ "./src/fpd/enrichment.js"
/*!*******************************!*\
  !*** ./src/fpd/enrichment.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enrichFPD: () => (/* binding */ enrichFPD)
/* harmony export */ });
/* unused harmony exports dep, getJsonLdKeywords, getMetaTagKeywords */
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hook.js */ "./src/hook.js");
/* harmony import */ var _refererDetection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../refererDetection.js */ "./src/refererDetection.js");
/* harmony import */ var _rootDomain_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rootDomain.js */ "./src/fpd/rootDomain.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils.js */ "./src/utils/objects.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils.js */ "./src/utils/winDimensions.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _sua_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sua.js */ "./src/fpd/sua.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _oneClient_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./oneClient.js */ "./src/fpd/oneClient.js");
/* harmony import */ var _libraries_viewport_viewport_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../libraries/viewport/viewport.js */ "./libraries/viewport/viewport.js");









const dep = {
  getRefererInfo: _refererDetection_js__WEBPACK_IMPORTED_MODULE_1__.getRefererInfo,
  findRootDomain: _rootDomain_js__WEBPACK_IMPORTED_MODULE_2__.findRootDomain,
  getWindowTop: _utils_js__WEBPACK_IMPORTED_MODULE_3__.getWindowTop,
  getWindowSelf: _utils_js__WEBPACK_IMPORTED_MODULE_3__.getWindowSelf,
  getHighEntropySUA: _sua_js__WEBPACK_IMPORTED_MODULE_9__.getHighEntropySUA,
  getLowEntropySUA: _sua_js__WEBPACK_IMPORTED_MODULE_9__.getLowEntropySUA,
  getDocument: _utils_js__WEBPACK_IMPORTED_MODULE_3__.getDocument
};
const oneClient = (0,_oneClient_js__WEBPACK_IMPORTED_MODULE_11__.clientSectionChecker)('FPD');
/**
 * Enrich an ortb2 object with first-party data.
 * @param {Promise<Object>} fpd - A promise that resolves to an ortb2 object.
 * @returns {Promise<Object>} - A promise that resolves to an enriched ortb2 object.
 */
const enrichFPD = (0,_hook_js__WEBPACK_IMPORTED_MODULE_0__.hook)('sync', fpd => {
  const promArr = [fpd, getSUA().catch(() => null)];
  return _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.PbPromise.all(promArr).then(([ortb2, sua]) => {
    const ri = dep.getRefererInfo();
    Object.entries(ENRICHMENTS).forEach(([section, getEnrichments]) => {
      const data = getEnrichments(ortb2, ri);
      if (data && Object.keys(data).length > 0) {
        ortb2[section] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.mergeDeep)({}, data, ortb2[section]);
      }
    });
    if (sua) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(ortb2, 'device.sua', Object.assign({}, sua, ortb2.device.sua));
    }
    const documentLang = dep.getDocument().documentElement.lang;
    if (documentLang) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(ortb2, 'site.ext.data.documentLang', documentLang);
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(ortb2, 'site.content.language')) {
        const langCode = documentLang.split('-')[0];
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(ortb2, 'site.content.language', langCode);
      }
    }
    ortb2 = oneClient(ortb2);
    for (const section of _oneClient_js__WEBPACK_IMPORTED_MODULE_11__.CLIENT_SECTIONS) {
      if ((0,_oneClient_js__WEBPACK_IMPORTED_MODULE_11__.hasSection)(ortb2, section)) {
        ortb2[section] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.mergeDeep)({}, clientEnrichment(ortb2, ri), ortb2[section]);
        break;
      }
    }
    return ortb2;
  });
});
function winFallback(fn) {
  try {
    return fn(dep.getWindowTop());
  } catch (e) {
    return fn(dep.getWindowSelf());
  }
}
function getSUA() {
  const hints = _config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('firstPartyData.uaHints');
  return !Array.isArray(hints) || hints.length === 0 ? _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.PbPromise.resolve(dep.getLowEntropySUA()) : dep.getHighEntropySUA(hints);
}
function removeUndef(obj) {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getDefinedParams)(obj, Object.keys(obj));
}
const ENRICHMENTS = {
  site(ortb2, ri) {
    if (_oneClient_js__WEBPACK_IMPORTED_MODULE_11__.CLIENT_SECTIONS.filter(p => p !== 'site').some(_oneClient_js__WEBPACK_IMPORTED_MODULE_11__.hasSection.bind(null, ortb2))) {
      // do not enrich site if dooh or app are set
      return;
    }
    return removeUndef({
      page: ri.page,
      ref: ri.ref
    });
  },
  device() {
    return winFallback(win => {
      // screen.width and screen.height are the physical dimensions of the screen
      const w = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.getWinDimensions)().screen.width;
      const h = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.getWinDimensions)().screen.height;

      // vpw and vph are the viewport dimensions of the browser window
      const {
        width: vpw,
        height: vph
      } = (0,_libraries_viewport_viewport_js__WEBPACK_IMPORTED_MODULE_12__.getViewportSize)();
      const device = {
        w,
        h,
        ua: win.navigator.userAgent,
        language: win.navigator.language.split('-').shift(),
        ext: {
          vpw,
          vph
        }
      };
      return device;
    });
  },
  regs() {
    const regs = {};
    if (winFallback(win => win.navigator.globalPrivacyControl)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(regs, 'ext.gpc', '1');
    }
    const coppa = _config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('coppa');
    if (typeof coppa === 'boolean') {
      regs.coppa = coppa ? 1 : 0;
    }
    return regs;
  }
};

/**
 * Detect keywords also from json/ld if this is present
 */
const getJsonLdKeywords = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.memoize)(() => {
  return winFallback(win => {
    const doc = win.document;
    const scriptTags = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    let keywords = [];
    for (const scriptTag of scriptTags) {
      try {
        const jsonData = JSON.parse(scriptTag.textContent);
        const jsonObjects = Array.isArray(jsonData) ? jsonData : [jsonData];
        for (const obj of jsonObjects) {
          if (typeof obj.keywords === 'string') {
            const parts = obj.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
            keywords.push(...parts);
          }
        }
      } catch (error) {
        // silent
      }
    }
    return keywords;
  });
});
const getMetaTagKeywords = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.memoize)(() => {
  return winFallback(win => {
    return win.document.querySelector('meta[name="keywords"]')?.content?.split(',').map(k => k.trim());
  });
});

// Enrichment of properties common across dooh, app and site - will be dropped into whatever
// section is appropriate
function clientEnrichment(ortb2, ri) {
  const domain = (0,_refererDetection_js__WEBPACK_IMPORTED_MODULE_1__.parseDomain)(ri.page, {
    noLeadingWww: true
  });
  const keywords = new Set();
  if (_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('firstPartyData.keywords.meta') ?? true) {
    (getMetaTagKeywords() ?? []).forEach(key => keywords.add(key));
  }
  if (_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('firstPartyData.keywords.json') ?? true) {
    (getJsonLdKeywords() ?? []).forEach(key => keywords.add(key));
  }
  return removeUndef({
    domain,
    keywords: keywords.size > 0 ? Array.from(keywords.keys()).join(',') : undefined,
    publisher: removeUndef({
      domain: dep.findRootDomain(domain)
    })
  });
}

/***/ },

/***/ "./src/fpd/normalize.js"
/*!******************************!*\
  !*** ./src/fpd/normalize.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeFPD: () => (/* binding */ normalizeFPD)
/* harmony export */ });
/* unused harmony exports normalizeEIDs, makeNormalizer */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hook.js */ "./src/hook.js");


const normalizeFPD = (0,_hook_js__WEBPACK_IMPORTED_MODULE_3__.hook)('sync', function (ortb2Fragments) {
  [normalizeEIDs, makeNormalizer('source.schain', 'source.ext.schain', 'source.ext.schain'), makeNormalizer('device.sua', 'device.ext.sua', 'device.sua'), makeNormalizer('regs.gdpr', 'regs.ext.gdpr', 'regs.ext.gdpr'), makeNormalizer('user.consent', 'user.ext.consent', 'user.ext.consent'), makeNormalizer('regs.us_privacy', 'regs.ext.us_privacy', 'regs.ext.us_privacy'), makeNormalizer('regs.gpp', 'regs.ext.gpp', 'regs.gpp'), makeNormalizer('regs.gpp_sid', 'regs.ext.gpp_sid', 'regs.gpp_sid')].forEach(normalizer => applyNormalizer(normalizer, ortb2Fragments));
  return ortb2Fragments;
});
function applyNormalizer(normalizer, ortb2Fragments) {
  ortb2Fragments.global = normalizer(ortb2Fragments.global, 'global FPD');
  Object.entries(ortb2Fragments.bidder).forEach(([bidder, ortb2]) => {
    ortb2Fragments.bidder[bidder] = normalizer(ortb2, `bidder '${bidder}' FPD`);
  });
}
function normalizeEIDs(target, context) {
  if (!target) return target;
  const seen = [];
  const eids = [...(target?.user?.eids ?? []).map(eid => [0, eid]), ...(target?.user?.ext?.eids ?? []).map(eid => [1, eid])].filter(([source, eid]) => {
    if (seen.findIndex(([candidateSource, candidateEid]) => source !== candidateSource && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(candidateEid, eid)) > -1) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Found duplicate EID in user.eids and user.ext.eids (${context})`, eid);
      return false;
    } else {
      seen.push([source, eid]);
      return true;
    }
  });
  if (eids.length > 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(target, 'user.ext.eids', eids.map(([_, eid]) => eid));
  }
  delete target?.user?.eids;
  return target;
}
function makeNormalizer(preferred, fallback, dest) {
  if (dest !== preferred && dest !== fallback) throw new Error('invalid argument');
  const delPath = (dest === preferred ? fallback : preferred).split('.');
  const delProp = delPath.pop();
  const delTarget = delPath.join('.');
  return function (ortb2, context) {
    if (!ortb2) return ortb2;
    const prefData = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ortb2, preferred);
    const fallbackData = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ortb2, fallback);
    if (prefData != null && fallbackData != null && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(prefData, fallbackData)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Conflicting ${preferred} and ${fallback} (${context}), preferring ${preferred}`, {
        [preferred]: prefData,
        [fallback]: fallbackData
      });
    }
    if ((prefData ?? fallbackData) != null) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortb2, dest, prefData ?? fallbackData);
    }
    const ignoredTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ortb2, delTarget);
    if (ignoredTarget != null && typeof ignoredTarget === 'object') {
      delete ignoredTarget[delProp];
    }
    return ortb2;
  };
}

/***/ },

/***/ "./src/fpd/oneClient.js"
/*!******************************!*\
  !*** ./src/fpd/oneClient.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLIENT_SECTIONS: () => (/* binding */ CLIENT_SECTIONS),
/* harmony export */   clientSectionChecker: () => (/* binding */ clientSectionChecker),
/* harmony export */   hasSection: () => (/* binding */ hasSection)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");


// mutually exclusive ORTB sections in order of priority - 'dooh' beats 'app' & 'site' and 'app' beats 'site';
// if one is set, the others will be removed
const CLIENT_SECTIONS = ['dooh', 'app', 'site'];
function clientSectionChecker(logPrefix) {
  return function onlyOneClientSection(ortb2) {
    CLIENT_SECTIONS.reduce((found, section) => {
      if (hasSection(ortb2, section)) {
        if (found != null) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`${logPrefix} specifies both '${found}' and '${section}'; dropping the latter.`);
          delete ortb2[section];
        } else {
          found = section;
        }
      }
      return found;
    }, null);
    return ortb2;
  };
}
function hasSection(ortb2, section) {
  return ortb2[section] != null && Object.keys(ortb2[section]).length > 0;
}

/***/ },

/***/ "./src/fpd/rootDomain.js"
/*!*******************************!*\
  !*** ./src/fpd/rootDomain.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findRootDomain: () => (/* binding */ findRootDomain)
/* harmony export */ });
/* unused harmony export coreStorage */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../storageManager.js */ "./src/storageManager.js");


const coreStorage = (0,_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.getCoreStorageManager)('fpdEnrichment');

/**
 * Find the root domain by testing for the topmost domain that will allow setting cookies.
 */

const findRootDomain = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.memoize)(function findRootDomain(fullDomain = window.location.host) {
  if (!coreStorage.cookiesAreEnabled()) {
    return fullDomain;
  }
  const domainParts = fullDomain.split('.');
  if (domainParts.length === 2) {
    return fullDomain;
  }
  let rootDomain;
  let continueSearching;
  let startIndex = -2;
  do {
    rootDomain = domainParts.slice(startIndex).join('.');
    if ((0,_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.canSetCookie)(rootDomain, coreStorage)) {
      continueSearching = false;
    } else {
      startIndex += -1;
      continueSearching = Math.abs(startIndex) <= domainParts.length;
    }
  } while (continueSearching);
  return rootDomain;
});

/***/ },

/***/ "./src/fpd/sua.js"
/*!************************!*\
  !*** ./src/fpd/sua.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHighEntropySUA: () => (/* binding */ getHighEntropySUA),
/* harmony export */   getLowEntropySUA: () => (/* binding */ getLowEntropySUA)
/* harmony export */ });
/* unused harmony exports SUA_SOURCE_UNKNOWN, SUA_SOURCE_LOW_ENTROPY, SUA_SOURCE_HIGH_ENTROPY, SUA_SOURCE_UA_HEADER, HIGH_ENTROPY_HINTS, LOW_ENTROPY_HINTS, lowEntropySUAAccessor, highEntropySUAAccessor, uaDataToSUA */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/utils/objects.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/promise.js */ "./src/utils/promise.js");


const SUA_SOURCE_UNKNOWN = 0;
const SUA_SOURCE_LOW_ENTROPY = 1;
const SUA_SOURCE_HIGH_ENTROPY = 2;
const SUA_SOURCE_UA_HEADER = 3;

// "high entropy" (i.e. privacy-sensitive) fields that can be requested from the navigator.
const HIGH_ENTROPY_HINTS = ['architecture', 'bitness', 'model', 'platformVersion', 'fullVersionList'];
const LOW_ENTROPY_HINTS = ['brands', 'mobile', 'platform'];

/**
 * Returns low entropy UA client hints encoded as an ortb2.6 device.sua object; or null if no UA client hints are available.
 */
const getLowEntropySUA = lowEntropySUAAccessor();

/**
 * Returns a promise to high entropy UA client hints encoded as an ortb2.6 device.sua object, or null if no UA client hints are available.
 *
 * Note that the return value is a promise because the underlying browser API returns a promise; this
 * seems to plan for additional controls (such as alerts / permission request prompts to the user); it's unclear
 * at the moment if this means that asking for more hints would result in slower / more expensive calls.
 *
 * @param {Array[String]} hints hints to request, defaults to all (HIGH_ENTROPY_HINTS).
 */
const getHighEntropySUA = highEntropySUAAccessor();
function lowEntropySUAAccessor(uaData = window.navigator?.userAgentData) {
  const sua = uaData && LOW_ENTROPY_HINTS.some(h => typeof uaData[h] !== 'undefined') ? Object.freeze(uaDataToSUA(SUA_SOURCE_LOW_ENTROPY, uaData)) : null;
  return function () {
    return sua;
  };
}
function highEntropySUAAccessor(uaData = window.navigator?.userAgentData) {
  const cache = {};
  const keys = new WeakMap();
  return function (hints = HIGH_ENTROPY_HINTS) {
    if (!keys.has(hints)) {
      const sorted = Array.from(hints);
      sorted.sort();
      keys.set(hints, sorted.join('|'));
    }
    const key = keys.get(hints);
    if (!cache.hasOwnProperty(key)) {
      try {
        cache[key] = uaData.getHighEntropyValues(hints).then(result => {
          return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(result) ? null : Object.freeze(uaDataToSUA(SUA_SOURCE_HIGH_ENTROPY, result));
        }).catch(() => null);
      } catch (e) {
        cache[key] = _utils_promise_js__WEBPACK_IMPORTED_MODULE_2__.PbPromise.resolve(null);
      }
    }
    return cache[key];
  };
}

/**
 * Convert a User Agent client hints object to an ORTB 2.6 device.sua fragment
 * https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf
 *
 * @param source source of the UAData object (0 to 3)
 * @param uaData https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/
 * @return {{}}
 */
function uaDataToSUA(source, uaData) {
  function toBrandVersion(brand, version) {
    const bv = {
      brand
    };
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(version) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmptyStr)(version)) {
      bv.version = version.split('.');
    }
    return bv;
  }
  const sua = {
    source
  };
  if (uaData.platform) {
    sua.platform = toBrandVersion(uaData.platform, uaData.platformVersion);
  }
  if (uaData.fullVersionList || uaData.brands) {
    sua.browsers = (uaData.fullVersionList || uaData.brands).map(({
      brand,
      version
    }) => toBrandVersion(brand, version));
  }
  if (typeof uaData['mobile'] !== 'undefined') {
    sua.mobile = uaData.mobile ? 1 : 0;
  }
  ['model', 'bitness', 'architecture'].forEach(prop => {
    const value = uaData[prop];
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(value)) {
      sua[prop] = value;
    }
  });
  return sua;
}

/***/ },

/***/ "./src/hook.js"
/*!*********************!*\
  !*** ./src/hook.js ***!
  \*********************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHook: () => (/* binding */ getHook),
/* harmony export */   hook: () => (/* binding */ hook),
/* harmony export */   ignoreCallbackArg: () => (/* binding */ ignoreCallbackArg),
/* harmony export */   wrapHook: () => (/* binding */ wrapHook)
/* harmony export */ });
/* unused harmony exports ready, setupBeforeHookFnOnce, module, submodule */
/* harmony import */ var fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fun-hooks/no-eval/index.js */ "../../node_modules/fun-hooks/no-eval/index.js");
/* harmony import */ var fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");


/**
 * NOTE: you must not call `next` asynchronously from 'sync' hooks
 * see https://github.com/snapwich/fun-hooks/issues/42
 */

const hook = fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default()({
  ready: (fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default().SYNC) | (fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default().ASYNC) | (fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default().QUEUE)
});
const readyCtl = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.defer)();
hook.ready = (() => {
  const ready = hook.ready;
  return function () {
    try {
      return ready.apply(hook);
    } finally {
      readyCtl.resolve();
    }
  };
})();

/**
 * A promise that resolves when hooks are ready.
 * @type {Promise}
 */
const ready = readyCtl.promise;
const getHook = hook.get;
function setupBeforeHookFnOnce(baseFn, hookFn, priority = 15) {
  const result = baseFn.getHooks({
    hook: hookFn
  });
  if (result.length === 0) {
    baseFn.before(hookFn, priority);
  }
}
const submoduleInstallMap = {};
function module(name, install, {
  postInstallAllowed = false
} = {}) {
  hook('async', function (submodules) {
    submodules.forEach(args => install(...args));
    if (postInstallAllowed) submoduleInstallMap[name] = install;
  }, name)([]); // will be queued until hook.ready() called in pbjs.processQueue();
}
function submodule(name, ...args) {
  const install = submoduleInstallMap[name];
  if (install) return install(...args);
  getHook(name).before((next, modules) => {
    modules.push(args);
    next(modules);
  });
}

/**
 * Copy hook methods (.before, .after, etc) from a given hook to a given wrapper object.
 */
function wrapHook(hook, wrapper) {
  Object.defineProperties(wrapper, Object.fromEntries(['before', 'after', 'getHooks', 'removeAll'].map(m => [m, {
    get: () => hook[m]
  }])));
  return wrapper;
}

/**
 * 'async' hooks expect the last argument to be a callback, and have special treatment for it if it's a function;
 * which prevents it from being used as a normal argument in 'before' hooks - and presents a modified version of it
 * to the hooked function.
 *
 * This returns a wrapper around a given 'async' hook that works around this, for when the last argument
 * should be treated as a normal argument.
 */
function ignoreCallbackArg(hook) {
  return wrapHook(hook, function (...args) {
    args.push(function () {});
    return hook.apply(this, args);
  });
}

/***/ },

/***/ "./src/mediaTypes.js"
/*!***************************!*\
  !*** ./src/mediaTypes.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AUDIO: () => (/* binding */ AUDIO),
/* harmony export */   BANNER: () => (/* binding */ BANNER),
/* harmony export */   NATIVE: () => (/* binding */ NATIVE),
/* harmony export */   VIDEO: () => (/* binding */ VIDEO)
/* harmony export */ });
/* unused harmony export ALL_MEDIATYPES */
/**
 * This file contains the valid Media Types in Prebid.
 *
 * All adapters are assumed to support banner ads. Other media types are specified by Adapters when they
 * register themselves with prebid-core.
 */

const NATIVE = 'native';
const VIDEO = 'video';
const BANNER = 'banner';
const AUDIO = 'audio';
const ALL_MEDIATYPES = [NATIVE, VIDEO, BANNER, AUDIO];

/***/ },

/***/ "./src/native.js"
/*!***********************!*\
  !*** ./src/native.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decorateAdUnitsWithNativeParams: () => (/* binding */ decorateAdUnitsWithNativeParams),
/* harmony export */   fireNativeTrackers: () => (/* binding */ fireNativeTrackers),
/* harmony export */   getAllAssetsMessage: () => (/* binding */ getAllAssetsMessage),
/* harmony export */   getAssetMessage: () => (/* binding */ getAssetMessage),
/* harmony export */   isNativeResponse: () => (/* binding */ isNativeResponse),
/* harmony export */   nativeAdapters: () => (/* binding */ nativeAdapters),
/* harmony export */   nativeBidIsValid: () => (/* binding */ nativeBidIsValid),
/* harmony export */   setNativeResponseProperties: () => (/* binding */ setNativeResponseProperties)
/* harmony export */ });
/* unused harmony exports IMAGE, processNativeAdUnitParams, isOpenRTBBidRequestValid, nativeAdUnit, nativeBidder, hasNonNativeBidder, isNativeOpenRTBBidValid, fireImpressionTrackers, fireClickTrackers, filterEventTrackers, getNativeRenderingData, toOrtbNativeRequest, fromOrtbNativeRequest, convertOrtbRequestToProprietaryNative, legacyPropertiesToOrtbNative, toOrtbNativeResponse, toLegacyResponse */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _adRendering_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./adRendering.js */ "./src/adRendering.js");
/* harmony import */ var _creativeRenderers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./creativeRenderers.js */ "./src/creativeRenderers.js");
/* harmony import */ var _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./eventTrackers.js */ "./src/eventTrackers.js");







const nativeAdapters = [];
const IMAGE = {
  ortb: {
    ver: '1.2',
    assets: [{
      required: 1,
      id: 1,
      img: {
        type: 3,
        wmin: 100,
        hmin: 100
      }
    }, {
      required: 1,
      id: 2,
      title: {
        len: 140
      }
    }, {
      required: 1,
      id: 3,
      data: {
        type: 1
      }
    }, {
      required: 0,
      id: 4,
      data: {
        type: 2
      }
    }, {
      required: 0,
      id: 5,
      img: {
        type: 1,
        wmin: 20,
        hmin: 20
      }
    }]
  },
  image: {
    required: true
  },
  title: {
    required: true
  },
  sponsoredBy: {
    required: true
  },
  clickUrl: {
    required: true
  },
  body: {
    required: false
  },
  icon: {
    required: false
  }
};
const SUPPORTED_TYPES = {
  image: IMAGE
};

// inverse native maps useful for converting to legacy
const PREBID_NATIVE_DATA_KEYS_TO_ORTB_INVERSE = inverse(_constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB);
const NATIVE_ASSET_TYPES_INVERSE = inverse(_constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_ASSET_TYPES);
function isNativeResponse(bidResponse) {
  // check for native data and not mediaType; it's possible
  // to treat banner responses as native
  return bidResponse.native != null && typeof bidResponse.native === 'object';
}

/**
 * Recieves nativeParams from an adUnit. If the params were not of type 'type',
 * passes them on directly. If they were of type 'type', translate
 * them into the predefined specific asset requests for that type of native ad.
 */
function processNativeAdUnitParams(params) {
  if (params && params.type && typeIsSupported(params.type)) {
    params = SUPPORTED_TYPES[params.type];
  }
  if (params && params.ortb && !isOpenRTBBidRequestValid(params.ortb)) {
    return;
  }
  return params;
}
function decorateAdUnitsWithNativeParams(adUnits) {
  adUnits.forEach(adUnit => {
    const nativeParams = adUnit.nativeParams || adUnit?.mediaTypes?.native;
    if (nativeParams) {
      adUnit.nativeParams = processNativeAdUnitParams(nativeParams);
    }
    if (adUnit.nativeParams) {
      adUnit.nativeOrtbRequest = adUnit.nativeParams.ortb || toOrtbNativeRequest(adUnit.nativeParams);
    }
  });
}
function isOpenRTBBidRequestValid(ortb) {
  const assets = ortb.assets;
  if (!Array.isArray(assets) || assets.length === 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`assets in mediaTypes.native.ortb is not an array, or it's empty. Assets: `, assets);
    return false;
  }

  // validate that ids exist, that they are unique and that they are numbers
  const ids = assets.map(asset => asset.id);
  if (assets.length !== new Set(ids).size || ids.some(id => id !== parseInt(id, 10))) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`each asset object must have 'id' property, it must be unique and it must be an integer`);
    return false;
  }
  if (ortb.hasOwnProperty('eventtrackers') && !Array.isArray(ortb.eventtrackers)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('ortb.eventtrackers is not an array. Eventtrackers: ', ortb.eventtrackers);
    return false;
  }
  return assets.every(asset => isOpenRTBAssetValid(asset));
}
function isOpenRTBAssetValid(asset) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(asset)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`asset must be an object. Provided asset: `, asset);
    return false;
  }
  if (asset.img) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.img.w) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.img.wmin)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`for img asset there must be 'w' or 'wmin' property`);
      return false;
    }
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.img.h) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.img.hmin)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`for img asset there must be 'h' or 'hmin' property`);
      return false;
    }
  } else if (asset.title) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.title.len)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`for title asset there must be 'len' property defined`);
      return false;
    }
  } else if (asset.data) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.data.type)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`for data asset 'type' property must be a number`);
      return false;
    }
  } else if (asset.video) {
    if (!Array.isArray(asset.video.mimes) || !Array.isArray(asset.video.protocols) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.video.minduration) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(asset.video.maxduration)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('video asset is not properly configured');
      return false;
    }
  }
  return true;
}

/**
 * Check if the native type specified in the adUnit is supported by Prebid.
 */
function typeIsSupported(type) {
  if (!(type && Object.keys(SUPPORTED_TYPES).includes(type))) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`${type} nativeParam is not supported`);
    return false;
  }
  return true;
}

/**
 * Helper functions for working with native-enabled adUnits
 * TODO: abstract this and the video helper functions into general
 * adunit validation helper functions
 */
const nativeAdUnit = adUnit => {
  const mediaType = adUnit.mediaType === 'native';
  const mediaTypes = adUnit?.mediaTypes?.native;
  return mediaType || mediaTypes;
};
const nativeBidder = bid => nativeAdapters.includes(bid.bidder);
const hasNonNativeBidder = adUnit => adUnit.bids.filter(bid => !nativeBidder(bid)).length;

/**
 * Validate that the native assets on this bid contain all assets that were
 * marked as required in the adUnit configuration.
 * bid Native bid to validate
 * @return {Boolean} If object is valid
 */
function nativeBidIsValid(bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index
} = {}) {
  const adUnit = index.getAdUnit(bid);
  if (!adUnit) {
    return false;
  }
  const ortbRequest = adUnit.nativeOrtbRequest;
  const ortbResponse = bid.native?.ortb || toOrtbNativeResponse(bid.native, ortbRequest);
  return isNativeOpenRTBBidValid(ortbResponse, ortbRequest);
}
function isNativeOpenRTBBidValid(bidORTB, bidRequestORTB) {
  if (!bidORTB?.link?.url) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`native response doesn't have 'link' property. Ortb response: `, bidORTB);
    return false;
  }
  const requiredAssetIds = bidRequestORTB.assets.filter(asset => asset.required === 1).map(a => a.id);
  const returnedAssetIds = bidORTB.assets.map(asset => asset.id);
  const match = requiredAssetIds.every(assetId => returnedAssetIds.includes(assetId));
  if (!match) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`didn't receive a bid with all required assets. Required ids: ${requiredAssetIds}, but received ids in response: ${returnedAssetIds}`);
  }
  return match;
}

/*
 * Native responses may have associated impression or click trackers.
 * This retrieves the appropriate tracker urls for the given ad object and
 * fires them. As a native creatives may be in a cross-origin frame, it may be
 * necessary to invoke this function via postMessage. secureCreatives is
 * configured to fire this function when it receives a `message` of 'Prebid Native'
 * and an `adId` with the value of the `bid.adId`. When a message is posted with
 * these parameters, impression trackers are fired. To fire click trackers, the
 * message should contain an `action` set to 'click'.
 *
 * // Native creative template example usage
 * <a href="%%CLICK_URL_UNESC%%%%PATTERN:hb_native_linkurl%%"
 *    target="_blank"
 *    onclick="fireTrackers('click')">
 *    %%PATTERN:hb_native_title%%
 * </a>
 *
 * <script>
 *   function fireTrackers(action) {
 *     var message = {message: 'Prebid Native', adId: '%%PATTERN:hb_adid%%'};
 *     if (action === 'click') {message.action = 'click';} // fires click trackers
 *     window.parent.postMessage(JSON.stringify(message), '*');
 *   }
 *   fireTrackers(); // fires impressions when creative is loaded
 * </script>
 */
function fireNativeTrackers(message, bidResponse) {
  const nativeResponse = bidResponse.native.ortb || legacyPropertiesToOrtbNative(bidResponse.native);
  if (message.action === 'click') {
    fireClickTrackers(nativeResponse, message?.assetId);
  } else {
    fireImpressionTrackers(nativeResponse, bidResponse);
  }
  return message.action;
}
function fireImpressionTrackers(nativeResponse, bidResponse, {
  runMarkup = mkup => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.insertHtmlIntoIframe)(mkup),
  fetchURL = _utils_js__WEBPACK_IMPORTED_MODULE_0__.politeTriggerPixel
} = {}) {
  const filteredEventTrackers = filterEventTrackers(nativeResponse, bidResponse);
  let {
    [_eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_IMG]: img = [],
    [_eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_JS]: js = []
  } = (0,_eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.parseEventTrackers)(filteredEventTrackers || [])[_eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.EVENT_TYPE_IMPRESSION] || {};
  if (nativeResponse.imptrackers) {
    img = img.concat(nativeResponse.imptrackers);
  }
  img.forEach(url => fetchURL(url));
  js = js.map(url => `<script async src="${url}"></script>`);
  if (nativeResponse.jstracker) {
    // jstracker is already HTML markup
    js = js.concat([nativeResponse.jstracker]);
  }
  if (js.length) {
    runMarkup(js.join('\n'));
  }
}
function fireClickTrackers(nativeResponse, assetId = null, {
  fetchURL = _utils_js__WEBPACK_IMPORTED_MODULE_0__.triggerPixel
} = {}) {
  // legacy click tracker
  if (!assetId) {
    (nativeResponse.link?.clicktrackers || []).forEach(url => fetchURL(url));
  } else {
    // ortb click tracker. This will try to call the clicktracker associated with the asset;
    // will fallback to the link if none is found.
    const assetIdLinkMap = (nativeResponse.assets || []).filter(a => a.link).reduce((map, asset) => {
      map[asset.id] = asset.link;
      return map;
    }, {});
    const masterClickTrackers = nativeResponse.link?.clicktrackers || [];
    const assetLink = assetIdLinkMap[assetId];
    let clickTrackers = masterClickTrackers;
    if (assetLink) {
      clickTrackers = assetLink.clicktrackers || [];
    }
    clickTrackers.forEach(url => fetchURL(url));
  }
}
function filterEventTrackers(nativeResponse, bid) {
  const DEFAULT_ALLOWED_TRACKERS = [{
    event: _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.EVENT_TYPE_IMPRESSION,
    methods: [_eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_IMG, _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_JS]
  }, {
    event: _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.EVENT_TYPE_VIEWABLE,
    methods: [_eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_IMG, _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_JS]
  }];
  const mediaTypes = _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index.getMediaTypes(bid) || {};
  const nativeMediaType = mediaTypes.native || {};
  const requestEventTrackers = nativeMediaType.ortb?.eventtrackers || DEFAULT_ALLOWED_TRACKERS;
  const {
    eventtrackers = []
  } = nativeResponse || {};
  return eventtrackers.filter(tracker => requestEventTrackers.some(requestTracker => requestTracker.event === tracker.event && requestTracker.methods.includes(tracker.method)));
}
function setNativeResponseProperties(bid, adUnit) {
  const nativeOrtbRequest = adUnit?.nativeOrtbRequest;
  const nativeOrtbResponse = bid.native?.ortb;
  if (nativeOrtbRequest && nativeOrtbResponse) {
    const legacyResponse = toLegacyResponse(nativeOrtbResponse, nativeOrtbRequest);
    Object.assign(bid.native, legacyResponse);
  }
  ['rendererUrl', 'adTemplate'].forEach(prop => {
    const val = adUnit?.nativeParams?.[prop];
    if (val) {
      bid.native[prop] = getAssetValue(val);
    }
  });
}
function getNativeAssets(nativeProps, keys, ext = false) {
  const assets = [];
  Object.entries(nativeProps).filter(([k, v]) => v && (ext === false && k === 'ext' || keys == null || keys.includes(k))).forEach(([key, value]) => {
    if (ext === false && key === 'ext') {
      assets.push(...getNativeAssets(value, keys, true));
    } else if (ext || _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_KEYS.hasOwnProperty(key)) {
      assets.push({
        key,
        value: getAssetValue(value)
      });
    }
  });
  return assets;
}
function getNativeRenderingData(bid, adUnit, keys) {
  const data = {
    ...(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getDefinedParams)(bid.native, ['rendererUrl', 'adTemplate']),
    assets: getNativeAssets(bid.native, keys),
    nativeKeys: _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_KEYS
  };
  if (bid.native.ortb) {
    data.ortb = bid.native.ortb;
  } else if (adUnit.mediaTypes?.native?.ortb) {
    data.ortb = toOrtbNativeResponse(bid.native, adUnit.nativeOrtbRequest);
  }
  return data;
}
function assetsMessage(data, adObject, keys, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index
} = {}) {
  const msg = {
    message: 'assetResponse',
    adId: data.adId
  };
  let renderData = (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_5__.getRenderingData)(adObject).native;
  if (renderData) {
    // if we have native rendering data (set up by the nativeRendering module)
    // include it in full ("all assets") together with the renderer.
    // this is to allow PUC to use dynamic renderers without requiring changes in creative setup
    msg.native = Object.assign({}, renderData);
    msg.renderer = (0,_creativeRenderers_js__WEBPACK_IMPORTED_MODULE_6__.getCreativeDefaultRendererSource)(adObject);
    msg.rendererVersion = _creativeRenderers_js__WEBPACK_IMPORTED_MODULE_6__.PUC_MIN_VERSION;
    if (keys != null) {
      renderData.assets = renderData.assets.filter(({
        key
      }) => keys.includes(key));
    }
  } else {
    renderData = getNativeRenderingData(adObject, index.getAdUnit(adObject), keys);
  }
  return Object.assign(msg, renderData);
}
const NATIVE_KEYS_INVERTED = Object.fromEntries(Object.entries(_constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_KEYS).map(([k, v]) => [v, k]));

/**
 * Constructs a message object containing asset values for each of the
 * requested data keys.
 */
function getAssetMessage(data, adObject) {
  const keys = data.assets.map(k => NATIVE_KEYS_INVERTED[k]);
  return assetsMessage(data, adObject, keys);
}
function getAllAssetsMessage(data, adObject) {
  return assetsMessage(data, adObject, null);
}

/**
 * Native assets can be a string or an object with a url prop. Returns the value
 * appropriate for sending in adserver targeting or placeholder replacement.
 */
function getAssetValue(value) {
  return value?.url || value;
}
/**
 * converts Prebid legacy native assets request to OpenRTB format
 * @param {object} legacyNativeAssets an object that describes a native bid request in Prebid proprietary format
 * @returns an OpenRTB format of the same bid request
 */
function toOrtbNativeRequest(legacyNativeAssets) {
  if (!legacyNativeAssets && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(legacyNativeAssets)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Native assets object is empty or not an object: ', legacyNativeAssets);
    return;
  }
  const ortb = {
    ver: '1.2',
    assets: []
  };
  for (const key in legacyNativeAssets) {
    // skip conversion for non-asset keys
    if (_constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_KEYS_THAT_ARE_NOT_ASSETS.includes(key)) continue;
    if (!_constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_KEYS.hasOwnProperty(key)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Unrecognized native asset code: ${key}. Asset will be ignored.`);
      continue;
    }
    if (key === 'privacyLink') {
      ortb.privacy = 1;
      continue;
    }
    const asset = legacyNativeAssets[key];
    let required = 0;
    if (asset.required && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean)(asset.required)) {
      required = Number(asset.required);
    }
    const ortbAsset = {
      id: ortb.assets.length,
      required
    };
    // data cases
    if (key in _constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB) {
      ortbAsset.data = {
        type: _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_ASSET_TYPES[_constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB[key]]
      };
      if (asset.len) {
        ortbAsset.data.len = asset.len;
      }
      // icon or image case
    } else if (key === 'icon' || key === 'image') {
      ortbAsset.img = {
        type: key === 'icon' ? _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_IMAGE_TYPES.ICON : _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_IMAGE_TYPES.MAIN
      };
      // if min_width and min_height are defined in aspect_ratio, they are preferred
      if (asset.aspect_ratios) {
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(asset.aspect_ratios)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)("image.aspect_ratios was passed, but it's not a an array:", asset.aspect_ratios);
        } else if (!asset.aspect_ratios.length) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)("image.aspect_ratios was passed, but it's empty:", asset.aspect_ratios);
        } else {
          const {
            min_width: minWidth,
            min_height: minHeight
          } = asset.aspect_ratios[0];
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger)(minWidth) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger)(minHeight)) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('image.aspect_ratios min_width or min_height are invalid: ', minWidth, minHeight);
          } else {
            ortbAsset.img.wmin = minWidth;
            ortbAsset.img.hmin = minHeight;
          }
          const aspectRatios = asset.aspect_ratios.filter(ar => ar.ratio_width && ar.ratio_height).map(ratio => `${ratio.ratio_width}:${ratio.ratio_height}`);
          if (aspectRatios.length > 0) {
            ortbAsset.img.ext = {
              aspectratios: aspectRatios
            };
          }
        }
      }

      // if asset.sizes exist, by OpenRTB spec we should remove wmin and hmin
      if (asset.sizes) {
        if (asset.sizes.length !== 2 || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger)(asset.sizes[0]) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger)(asset.sizes[1])) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('image.sizes was passed, but its value is not an array of integers:', asset.sizes);
        } else {
          ortbAsset.img.w = asset.sizes[0];
          ortbAsset.img.h = asset.sizes[1];
          delete ortbAsset.img.hmin;
          delete ortbAsset.img.wmin;
        }
      }
      // title case
    } else if (key === 'title') {
      ortbAsset.title = {
        // in openRTB, len is required for titles, while in legacy prebid was not.
        // for this reason, if len is missing in legacy prebid, we're adding a default value of 140.
        len: asset.len || 140
      };
      // all extensions to the native bid request are passed as is
    } else if (key === 'ext') {
      ortbAsset.ext = asset;
      // in `ext` case, required field is not needed
      delete ortbAsset.required;
    }
    ortb.assets.push(ortbAsset);
  }
  return ortb;
}

/**
 * Greatest common divisor between two positive integers
 * https://en.wikipedia.org/wiki/Euclidean_algorithm
 */
function gcd(a, b) {
  while (a && b && a !== b) {
    if (a > b) {
      a = a - b;
    } else {
      b = b - a;
    }
  }
  return a || b;
}

/**
 * This function converts an OpenRTB native request object to Prebid proprietary
 * format. The purpose of this function is to help adapters to handle the
 * transition phase where publishers may be using OpenRTB objects but the
 *  bidder does not yet support it.
 * @param {object} openRTBRequest an OpenRTB v1.2 request object
 * @returns a Prebid legacy native format request
 */
function fromOrtbNativeRequest(openRTBRequest) {
  if (!isOpenRTBBidRequestValid(openRTBRequest)) {
    return;
  }
  const oldNativeObject = {};
  for (const asset of openRTBRequest.assets) {
    if (asset.title) {
      const title = {
        required: asset.required ? Boolean(asset.required) : false,
        len: asset.title.len
      };
      oldNativeObject.title = title;
    } else if (asset.img) {
      const image = {
        required: asset.required ? Boolean(asset.required) : false
      };
      if (asset.img.w && asset.img.h) {
        image.sizes = [asset.img.w, asset.img.h];
      } else if (asset.img.wmin && asset.img.hmin) {
        const scale = gcd(asset.img.wmin, asset.img.hmin);
        image.aspect_ratios = [{
          min_width: asset.img.wmin,
          min_height: asset.img.hmin,
          ratio_width: asset.img.wmin / scale,
          ratio_height: asset.img.hmin / scale
        }];
      }
      if (asset.img.type === _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_IMAGE_TYPES.MAIN) {
        oldNativeObject.image = image;
      } else {
        oldNativeObject.icon = image;
      }
    } else if (asset.data) {
      const assetType = Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_ASSET_TYPES).find(k => _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_ASSET_TYPES[k] === asset.data.type);
      const prebidAssetName = Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB).find(k => _constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB[k] === assetType);
      oldNativeObject[prebidAssetName] = {
        required: asset.required ? Boolean(asset.required) : false
      };
      if (asset.data.len) {
        oldNativeObject[prebidAssetName].len = asset.data.len;
      }
    }
    if (openRTBRequest.privacy) {
      oldNativeObject.privacyLink = {
        required: false
      };
    }
    // video was not supported by old prebid assets
  }
  return oldNativeObject;
}

/**
 * Converts an OpenRTB request to a proprietary Prebid.js format.
 * The proprietary Prebid format has many limitations and will be dropped in
 * the future; adapters are encouraged to stop using it in favour of OpenRTB format.
 * IMPLEMENTATION DETAILS: This function returns the same exact object if no
 * conversion is needed. If a conversion is needed (meaning, at least one
 * bidRequest contains a native.ortb definition), it will return a copy.
 *
 * @param bidRequests an array of valid bid requests
 * @returns an array of valid bid requests where the openRTB bids are converted to proprietary format.
 */
function convertOrtbRequestToProprietaryNative(bidRequests) {
  if (true) {
    if (!bidRequests || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(bidRequests)) return bidRequests;
    // check if a conversion is needed
    if (!bidRequests.some(bidRequest => (bidRequest?.mediaTypes || {})[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE]?.ortb)) {
      return bidRequests;
    }
    const bidRequestsCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(bidRequests);
    // convert Native ORTB definition to old-style prebid native definition
    for (const bidRequest of bidRequestsCopy) {
      if (bidRequest.mediaTypes && bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE] && bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE].ortb) {
        bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE] = Object.assign((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pick)(bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE], _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_KEYS_THAT_ARE_NOT_ASSETS), fromOrtbNativeRequest(bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE].ortb));
        bidRequest.nativeParams = processNativeAdUnitParams(bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_4__.NATIVE]);
      }
    }
    return bidRequestsCopy;
  }
  // removed by dead control flow

}

/**
 * convert PBJS proprietary native properties that are *not* assets to the ORTB native format.
 *
 * @param legacyNative `bidResponse.native` object as returned by adapters
 */
function legacyPropertiesToOrtbNative(legacyNative) {
  const response = {
    link: {},
    eventtrackers: []
  };
  Object.entries(legacyNative).forEach(([key, value]) => {
    switch (key) {
      case 'clickUrl':
        response.link.url = value;
        break;
      case 'clickTrackers':
        response.link.clicktrackers = Array.isArray(value) ? value : [value];
        break;
      case 'impressionTrackers':
        (Array.isArray(value) ? value : [value]).forEach(url => {
          response.eventtrackers.push({
            event: _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.EVENT_TYPE_IMPRESSION,
            method: _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_IMG,
            url
          });
        });
        break;
      case 'javascriptTrackers':
        // jstracker is deprecated, but we need to use it here since 'javascriptTrackers' is markup, not an url
        // TODO: at the time of writing this, core expected javascriptTrackers to be a string (despite the name),
        // but many adapters are passing an array. It's possible that some of them are, in fact, passing URLs and not markup
        // in general, native trackers seem to be neglected and/or broken
        response.jstracker = Array.isArray(value) ? value.join('') : value;
        break;
      case 'privacyLink':
        response.privacy = value;
        break;
    }
  });
  return response;
}
function toOrtbNativeResponse(legacyResponse, ortbRequest) {
  const ortbResponse = {
    ...legacyPropertiesToOrtbNative(legacyResponse),
    assets: []
  };
  function useRequestAsset(predicate, fn) {
    let asset = ortbRequest.assets.find(predicate);
    if (asset != null) {
      asset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(asset);
      fn(asset);
      ortbResponse.assets.push(asset);
    }
  }
  Object.keys(legacyResponse).filter(key => !!legacyResponse[key]).forEach(key => {
    const value = getAssetValue(legacyResponse[key]);
    switch (key) {
      // process titles
      case 'title':
        useRequestAsset(asset => asset.title != null, titleAsset => {
          titleAsset.title = {
            text: value
          };
        });
        break;
      case 'image':
      case 'icon':
        const imageType = key === 'image' ? _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_IMAGE_TYPES.MAIN : _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_IMAGE_TYPES.ICON;
        useRequestAsset(asset => asset.img != null && asset.img.type === imageType, imageAsset => {
          imageAsset.img = {
            url: value
          };
        });
        break;
      default:
        if (key in _constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB) {
          useRequestAsset(asset => asset.data != null && asset.data.type === _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_ASSET_TYPES[_constants_js__WEBPACK_IMPORTED_MODULE_3__.PREBID_NATIVE_DATA_KEYS_TO_ORTB[key]], dataAsset => {
            dataAsset.data = {
              value
            };
          });
        }
        break;
    }
  });
  return ortbResponse;
}

/**
 * Generates a legacy response from an ortb response. Useful during the transition period.
 * @param {*} ortbResponse a standard ortb response object
 * @param {*} ortbRequest the ortb request, useful to match ids.
 * @returns an object containing the response in legacy native format: { title: "this is a title", image: ... }
 */
function toLegacyResponse(ortbResponse, ortbRequest) {
  const legacyResponse = {};
  const requestAssets = ortbRequest?.assets || [];
  legacyResponse.clickUrl = ortbResponse.link?.url;
  legacyResponse.privacyLink = ortbResponse.privacy;
  for (const asset of ortbResponse?.assets || []) {
    const requestAsset = requestAssets.find(reqAsset => asset.id === reqAsset.id);
    if (asset.title) {
      legacyResponse.title = asset.title.text;
    } else if (asset.img) {
      legacyResponse[requestAsset?.img?.type === _constants_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE_IMAGE_TYPES.MAIN ? 'image' : 'icon'] = {
        url: asset.img.url,
        width: asset.img.w,
        height: asset.img.h
      };
    } else if (asset.data) {
      legacyResponse[PREBID_NATIVE_DATA_KEYS_TO_ORTB_INVERSE[NATIVE_ASSET_TYPES_INVERSE[requestAsset?.data?.type]]] = asset.data.value;
    }
  }

  // Handle trackers
  legacyResponse.impressionTrackers = [];
  let jsTrackers = [];
  if (ortbResponse.imptrackers) {
    legacyResponse.impressionTrackers.push(...ortbResponse.imptrackers);
  }
  for (const eventTracker of ortbResponse?.eventtrackers || []) {
    if (eventTracker.event === _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.EVENT_TYPE_IMPRESSION && eventTracker.method === _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_IMG) {
      legacyResponse.impressionTrackers.push(eventTracker.url);
    }
    if (eventTracker.event === _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.EVENT_TYPE_IMPRESSION && eventTracker.method === _eventTrackers_js__WEBPACK_IMPORTED_MODULE_7__.TRACKER_METHOD_JS) {
      jsTrackers.push(eventTracker.url);
    }
  }
  jsTrackers = jsTrackers.map(url => `<script async src="${url}"></script>`);
  if (ortbResponse?.jstracker) {
    jsTrackers.push(ortbResponse.jstracker);
  }
  if (jsTrackers.length) {
    legacyResponse.javascriptTrackers = jsTrackers.join('\n');
  }
  return legacyResponse;
}

/**
 * Inverts key-values of an object.
 */
function inverse(obj) {
  var retobj = {};
  for (var key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
}

/***/ },

/***/ "./src/pbjsORTB.js"
/*!*************************!*\
  !*** ./src/pbjsORTB.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REQUEST: () => (/* binding */ REQUEST),
/* harmony export */   registerOrtbProcessor: () => (/* binding */ registerOrtbProcessor)
/* harmony export */ });
/* unused harmony exports PROCESSOR_TYPES, PROCESSOR_DIALECTS, IMP, BID_RESPONSE, RESPONSE, DEFAULT, PBS, processorRegistry, getProcessors */
const PROCESSOR_TYPES = ['request', 'imp', 'bidResponse', 'response'];
const PROCESSOR_DIALECTS = ['default', 'pbs'];
const [REQUEST, IMP, BID_RESPONSE, RESPONSE] = PROCESSOR_TYPES;
const [DEFAULT, PBS] = PROCESSOR_DIALECTS;
const types = new Set(PROCESSOR_TYPES);
function processorRegistry() {
  const processors = {};
  return {
    registerOrtbProcessor({
      type,
      name,
      fn,
      priority = 0,
      dialects = [DEFAULT]
    }) {
      if (!types.has(type)) {
        throw new Error(`ORTB processor type must be one of: ${PROCESSOR_TYPES.join(', ')}`);
      }
      dialects.forEach(dialect => {
        if (!processors.hasOwnProperty(dialect)) {
          processors[dialect] = {};
        }
        if (!processors[dialect].hasOwnProperty(type)) {
          processors[dialect][type] = {};
        }
        processors[dialect][type][name] = {
          priority,
          fn
        };
      });
    },
    getProcessors(dialect) {
      return processors[dialect] || {};
    }
  };
}
const {
  registerOrtbProcessor,
  getProcessors
} = processorRegistry();

/***/ },

/***/ "./src/prebid.js"
/*!***********************!*\
  !*** ./src/prebid.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addApiMethod: () => (/* binding */ addApiMethod),
/* harmony export */   requestBids: () => (/* binding */ requestBids),
/* harmony export */   startAuction: () => (/* binding */ startAuction)
/* harmony export */ });
/* unused harmony exports syncOrtb2, validateOrtbFields, adUnitSetupChecks, checkAdUnitSetup, executeCallbacks, resetQueSetup */
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _secureCreatives_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./secureCreatives.js */ "./src/secureCreatives.js");
/* harmony import */ var _userSync_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./userSync.js */ "./src/userSync.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _targeting_filters_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./targeting/filters.js */ "./src/targeting/filters.js");
/* harmony import */ var _targeting_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./targeting.js */ "./src/targeting.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _debugging_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./debugging.js */ "./src/debugging.js");
/* harmony import */ var _devtoolsMcp_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./devtoolsMcp.js */ "./src/devtoolsMcp.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _consentHandler_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _adRendering_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./adRendering.js */ "./src/adRendering.js");
/* harmony import */ var _utils_reducers_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./utils/reducers.js */ "./src/utils/reducers.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./video.js */ "./src/video.js");
/* harmony import */ var _banner_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./banner.js */ "./src/banner.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _utils_prerendering_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./utils/prerendering.js */ "./src/utils/prerendering.js");
/* harmony import */ var _adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _fpd_normalize_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./fpd/normalize.js */ "./src/fpd/normalize.js");
/* harmony import */ var _audio_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./audio.js */ "./src/audio.js");
/* harmony import */ var _utils_wrapsInBids_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./utils/wrapsInBids.js */ "./src/utils/wrapsInBids.js");
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");
/* harmony import */ var _utils_yield_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./utils/yield.js */ "./src/utils/yield.js");
/** @module pbjs */
































const pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)();
const {
  triggerUserSyncs,
  removeUserSyncs
} = _userSync_js__WEBPACK_IMPORTED_MODULE_6__.userSync;

/* private variables */
const {
  REQUEST_BIDS,
  SET_TARGETING
} = _constants_js__WEBPACK_IMPORTED_MODULE_16__.EVENTS;

// initialize existing debugging sessions if present
(0,_debugging_js__WEBPACK_IMPORTED_MODULE_12__.loadSession)();

// load the DevTools MCP module on demand when debugging is turned on
(0,_devtoolsMcp_js__WEBPACK_IMPORTED_MODULE_13__.initDevtoolsMcp)();
pbjsInstance.bidderSettings = pbjsInstance.bidderSettings || {};
pbjsInstance.libLoaded = true;
// version auto generated from build
pbjsInstance.version = "v11.40.0-pre";
(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("Prebid.js v11.40.0-pre loaded");

// create adUnit array
pbjsInstance.adUnits = pbjsInstance.adUnits || [];
pbjsInstance.pageViewIdPerBidder = pbjsInstance.pageViewIdPerBidder || new Map();
function validateSizes(sizes, targLength) {
  let cleanSizes = [];
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(sizes) && (targLength ? sizes.length === targLength : sizes.length > 0)) {
    // check if an array of arrays or array of numbers
    if (sizes.every(sz => (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArrayOfNums)(sz, 2))) {
      cleanSizes = sizes;
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArrayOfNums)(sizes, 2)) {
      cleanSizes.push(sizes);
    }
  }
  return cleanSizes;
}

// synchronize fields between mediaTypes[mediaType] and ortb2Imp[mediaType]
function syncOrtb2(adUnit, mediaType) {
  const ortb2Imp = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, `ortb2Imp.${mediaType}`);
  const mediaTypes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, `mediaTypes.${mediaType}`);
  if (!ortb2Imp && !mediaTypes) {
    // omitting sync due to not present mediaType
    return;
  }
  const fields = {
    [_mediaTypes_js__WEBPACK_IMPORTED_MODULE_26__.VIDEO]:  true && _video_js__WEBPACK_IMPORTED_MODULE_24__.ORTB_VIDEO_PARAMS,
    [_mediaTypes_js__WEBPACK_IMPORTED_MODULE_26__.BANNER]: _banner_js__WEBPACK_IMPORTED_MODULE_25__.ORTB_BANNER_PARAMS
  }[mediaType];
  if (!fields) {
    return;
  }
  [...fields].forEach(([key, validator]) => {
    const mediaTypesFieldValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, `mediaTypes.${mediaType}.${key}`);
    const ortbFieldValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, `ortb2Imp.${mediaType}.${key}`);
    if (mediaTypesFieldValue === undefined && ortbFieldValue === undefined) {
      // omitting the params if it's not defined on either of sides
    } else if (mediaTypesFieldValue === undefined) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(adUnit, `mediaTypes.${mediaType}.${key}`, ortbFieldValue);
    } else if (ortbFieldValue === undefined) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(adUnit, `ortb2Imp.${mediaType}.${key}`, mediaTypesFieldValue);
    } else if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepEqual)(mediaTypesFieldValue, ortbFieldValue)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`adUnit ${adUnit.code}: specifies conflicting ortb2Imp.${mediaType}.${key} and mediaTypes.${mediaType}.${key}, the latter will be ignored`, adUnit);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(adUnit, `mediaTypes.${mediaType}.${key}`, ortbFieldValue);
    }
  });
}
function validateBannerMediaType(adUnit) {
  const validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  const banner = validatedAdUnit.mediaTypes.banner;
  const bannerSizes = banner.sizes == null ? null : validateSizes(banner.sizes);
  const format = adUnit.ortb2Imp?.banner?.format ?? banner?.format;
  let formatSizes;
  if (format != null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(validatedAdUnit, 'ortb2Imp.banner.format', format);
    banner.format = format;
    try {
      formatSizes = format.filter(({
        w,
        h,
        wratio,
        hratio
      }) => {
        if ((w ?? h) != null && (wratio ?? hratio) != null) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Ad unit banner.format specifies both w/h and wratio/hratio`, adUnit);
          return false;
        }
        return w != null && h != null || wratio != null && hratio != null;
      }).map(({
        w,
        h,
        wratio,
        hratio
      }) => [w ?? wratio, h ?? hratio]);
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Invalid format definition on ad unit ${adUnit.code}`, format);
    }
    if (formatSizes != null && bannerSizes != null && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepEqual)(bannerSizes, formatSizes)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Ad unit ${adUnit.code} has conflicting sizes and format definitions`, adUnit);
    }
  }
  const sizes = formatSizes ?? bannerSizes ?? [];
  const expdir = adUnit.ortb2Imp?.banner?.expdir ?? banner.expdir;
  if (expdir != null) {
    banner.expdir = expdir;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(validatedAdUnit, 'ortb2Imp.banner.expdir', expdir);
  }
  if (sizes.length > 0) {
    banner.sizes = sizes;
    // Deprecation Warning: This property will be deprecated in next release in favor of adUnit.mediaTypes.banner.sizes
    validatedAdUnit.sizes = sizes;
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Detected a mediaTypes.banner object without a proper sizes field.  Please ensure the sizes are listed like: [[300, 250], ...].  Removing invalid mediaTypes.banner object from request.');
    delete validatedAdUnit.mediaTypes.banner;
  }
  validateOrtbFields(validatedAdUnit, 'banner');
  syncOrtb2(validatedAdUnit, 'banner');
  return validatedAdUnit;
}
function validateAudioMediaType(adUnit) {
  const validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  validateOrtbFields(validatedAdUnit, 'audio');
  syncOrtb2(validatedAdUnit, 'audio');
  return validatedAdUnit;
}
function validateVideoMediaType(adUnit) {
  const validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  const video = validatedAdUnit.mediaTypes.video;
  if (video.playerSize) {
    const tarPlayerSizeLen = typeof video.playerSize[0] === 'number' ? 2 : 1;
    const videoSizes = validateSizes(video.playerSize, tarPlayerSizeLen);
    if (videoSizes.length > 0) {
      if (tarPlayerSizeLen === 2) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Transforming video.playerSize from [640,480] to [[640,480]] so it\'s in the proper format.');
      }
      video.playerSize = videoSizes;
      // Deprecation Warning: This property will be deprecated in next release in favor of adUnit.mediaTypes.video.playerSize
      validatedAdUnit.sizes = videoSizes;
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Detected incorrect configuration of mediaTypes.video.playerSize.  Please specify only one set of dimensions in a format like: [[640, 480]]. Removing invalid mediaTypes.video.playerSize property from request.');
      delete validatedAdUnit.mediaTypes.video.playerSize;
    }
  }
  validateOrtbFields(validatedAdUnit, 'video');
  syncOrtb2(validatedAdUnit, 'video');
  return validatedAdUnit;
}
function validateOrtbFields(adUnit, type, onInvalidParam) {
  const mediaTypes = adUnit?.mediaTypes || {};
  const params = mediaTypes[type];
  const ORTB_PARAMS = (type => {
    if (type === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_26__.BANNER) {
      return _banner_js__WEBPACK_IMPORTED_MODULE_25__.ORTB_BANNER_PARAMS;
    }
    if ( true && type === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_26__.AUDIO) {
      return _audio_js__WEBPACK_IMPORTED_MODULE_30__.ORTB_AUDIO_PARAMS;
    }
    if ( true && type === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_26__.VIDEO) {
      return _video_js__WEBPACK_IMPORTED_MODULE_24__.ORTB_VIDEO_PARAMS;
    }
  })(type);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(params)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`validateOrtb${type}Fields: ${type}Params must be an object.`);
    return;
  }
  if (ORTB_PARAMS != null && params != null) {
    Object.entries(params).forEach(([key, value]) => {
      if (!ORTB_PARAMS.has(key)) {
        return;
      }
      const isValid = ORTB_PARAMS.get(key)(value);
      if (!isValid) {
        if (typeof onInvalidParam === 'function') {
          onInvalidParam(key, value, adUnit);
        } else {
          delete params[key];
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Invalid prop in adUnit "${adUnit.code}": Invalid value for mediaTypes.${type}.${key} ORTB property. The property has been removed.`);
        }
      }
    });
  }
}
function validateNativeMediaType(adUnit) {
  function err(msg) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Error in adUnit "${adUnit.code}": ${msg}. Removing native request from ad unit`, adUnit);
    delete validatedAdUnit.mediaTypes.native;
    return validatedAdUnit;
  }
  function checkDeprecated(onDeprecated) {
    for (const key of ['types']) {
      if (native.hasOwnProperty(key)) {
        const res = onDeprecated(key);
        if (res) return res;
      }
    }
  }
  const validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  const native = validatedAdUnit.mediaTypes.native;
  // if native assets are specified in OpenRTB format, remove legacy assets and print a warn.
  if (native.ortb) {
    if (native.ortb.assets?.some(asset => !(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(asset.id) || asset.id < 0 || asset.id % 1 !== 0)) {
      return err('native asset ID must be a nonnegative integer');
    }
    if (checkDeprecated(key => err(`ORTB native requests cannot specify "${key}"`))) {
      return validatedAdUnit;
    }
    const legacyNativeKeys = Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_16__.NATIVE_KEYS).filter(key => _constants_js__WEBPACK_IMPORTED_MODULE_16__.NATIVE_KEYS[key].includes('hb_native_'));
    const nativeKeys = Object.keys(native);
    const intersection = nativeKeys.filter(nativeKey => legacyNativeKeys.includes(nativeKey));
    if (intersection.length > 0) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`when using native OpenRTB format, you cannot use legacy native properties. Deleting ${intersection} keys from request.`);
      intersection.forEach(legacyKey => delete validatedAdUnit.mediaTypes.native[legacyKey]);
    }
  } else {
    checkDeprecated(key => (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`mediaTypes.native.${key} is deprecated, consider using native ORTB instead`, adUnit));
  }
  if (native.image && native.image.sizes && !Array.isArray(native.image.sizes)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Please use an array of sizes for native.image.sizes field.  Removing invalid mediaTypes.native.image.sizes property from request.');
    delete validatedAdUnit.mediaTypes.native.image.sizes;
  }
  if (native.image && native.image.aspect_ratios && !Array.isArray(native.image.aspect_ratios)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Please use an array of sizes for native.image.aspect_ratios field.  Removing invalid mediaTypes.native.image.aspect_ratios property from request.');
    delete validatedAdUnit.mediaTypes.native.image.aspect_ratios;
  }
  if (native.icon && native.icon.sizes && !Array.isArray(native.icon.sizes)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Please use an array of sizes for native.icon.sizes field.  Removing invalid mediaTypes.native.icon.sizes property from request.');
    delete validatedAdUnit.mediaTypes.native.icon.sizes;
  }
  return validatedAdUnit;
}
function validateAdUnitPos(adUnit, mediaType) {
  const pos = adUnit?.mediaTypes?.[mediaType]?.pos;
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(pos) || isNaN(pos) || !isFinite(pos)) {
    const warning = `Value of property 'pos' on ad unit ${adUnit.code} should be of type: Number`;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(warning);
    delete adUnit.mediaTypes[mediaType].pos;
  }
  return adUnit;
}
function validateAdUnit(adUnitDef) {
  const msg = msg => `adUnit.code '${adUnit.code}' ${msg}`;
  const adUnit = adUnitDef;
  const mediaTypes = adUnit.mediaTypes;
  const bids = adUnit.bids;
  if (bids != null && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(bids)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(msg(`defines 'adUnit.bids' that is not an array. Removing adUnit from auction`));
    return null;
  }
  if (bids == null && adUnit.ortb2Imp == null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(msg(`has no 'adUnit.bids' and no 'adUnit.ortb2Imp'. Removing adUnit from auction`));
    return null;
  }
  if (!mediaTypes || Object.keys(mediaTypes).length === 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(msg(`does not define a 'mediaTypes' object.  This is a required field for the auction, so this adUnit has been removed.`));
    return null;
  }
  if (adUnit.ortb2Imp != null && (bids == null || bids.length === 0)) {
    adUnit.bids = [{
      bidder: null
    }]; // the 'null' bidder is treated as an s2s-only placeholder by adapterManager
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)(msg(`defines 'adUnit.ortb2Imp' with no 'adUnit.bids'; it will be seen only by S2S adapters`));
  }
  return adUnit;
}
const adUnitSetupChecks = {
  validateAdUnit,
  validateBannerMediaType,
  validateSizes
};
if (true) {
  Object.assign(adUnitSetupChecks, {
    validateNativeMediaType
  });
}
if (true) {
  Object.assign(adUnitSetupChecks, {
    validateVideoMediaType
  });
}
if (true) {
  Object.assign(adUnitSetupChecks, {
    validateAudioMediaType
  });
}
const checkAdUnitSetup = (0,_hook_js__WEBPACK_IMPORTED_MODULE_11__.hook)('sync', function (adUnits) {
  const validatedAdUnits = [];
  adUnits.forEach(adUnitDef => {
    const adUnit = validateAdUnit(adUnitDef);
    if (adUnit == null) return;
    const mediaTypes = adUnit.mediaTypes;
    let validatedBanner, validatedVideo, validatedNative, validatedAudio;
    if (mediaTypes.banner) {
      validatedBanner = validateBannerMediaType(adUnit);
      if (mediaTypes.banner.hasOwnProperty('pos')) validatedBanner = validateAdUnitPos(validatedBanner, 'banner');
    }
    if ( true && mediaTypes.video) {
      validatedVideo = validatedBanner ? validateVideoMediaType(validatedBanner) : validateVideoMediaType(adUnit);
      if (mediaTypes.video.hasOwnProperty('pos')) validatedVideo = validateAdUnitPos(validatedVideo, 'video');
    }
    if ( true && mediaTypes.native) {
      validatedNative = validatedVideo ? validateNativeMediaType(validatedVideo) : validatedBanner ? validateNativeMediaType(validatedBanner) : validateNativeMediaType(adUnit);
    }
    if ( true && mediaTypes.audio) {
      validatedAudio = validatedNative ? validateAudioMediaType(validatedNative) : validateAudioMediaType(adUnit);
    }
    const validatedAdUnit = Object.assign({}, validatedBanner, validatedVideo, validatedNative, validatedAudio);
    validatedAdUnits.push(validatedAdUnit);
  });
  return validatedAdUnits;
}, 'checkAdUnitSetup');
function fillAdUnitDefaults(adUnits) {
  if (true) {
    adUnits.forEach(au => (0,_video_js__WEBPACK_IMPORTED_MODULE_24__.fillVideoDefaults)(au));
  }
  if (true) {
    adUnits.forEach(au => (0,_audio_js__WEBPACK_IMPORTED_MODULE_30__.fillAudioDefaults)(au));
  }
}
function logInvocation(name, fn) {
  return function (...args) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(`Invoking ${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_32__.getGlobalVarName)()}.${name}`, args);
    return fn.apply(this, args);
  };
}
function addApiMethod(name, method, log = true) {
  (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)()[name] = log ? logInvocation(name, method) : method;
}

/// ///////////////////////////////
//                              //
//    Start Public APIs         //
//                              //
/// ///////////////////////////////

// Allow publishers who enable user sync override to trigger their sync
addApiMethod('triggerUserSyncs', triggerUserSyncs);

// Allow publishers to clean up sync iframes, e.g. on navigation in a single page application
addApiMethod('removeUserSyncs', removeUserSyncs);

/**
 * Return a query string with all available targeting parameters for the given ad unit.
 *
 * @param adUnitCode ad unit code to target
 */
function getAdserverTargetingForAdUnitCodeStr(adUnitCode) {
  if (adUnitCode) {
    const res = getAdserverTargetingForAdUnitCode(adUnitCode);
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.transformAdServerTargetingObj)(res);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('Need to call getAdserverTargetingForAdUnitCodeStr with adunitCode');
  }
}
addApiMethod('getAdserverTargetingForAdUnitCodeStr', getAdserverTargetingForAdUnitCodeStr);

/**
 * Return the highest cpm, unused bid for the given ad unit.
 * @param adUnitCode
 */
function getHighestUnusedBidResponseForAdUnitCode(adUnitCode) {
  if (adUnitCode) {
    const bid = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getAllBidsForAdUnitCode(adUnitCode).filter(_targeting_filters_js__WEBPACK_IMPORTED_MODULE_9__.isBidUsable);
    return bid.length ? bid.reduce(_utils_reducers_js__WEBPACK_IMPORTED_MODULE_23__.getHighestCpm) : null;
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('Need to call getHighestUnusedBidResponseForAdUnitCode with adunitCode');
  }
}
addApiMethod('getHighestUnusedBidResponseForAdUnitCode', getHighestUnusedBidResponseForAdUnitCode);

/**
 * Returns targeting key-value pairs available at this moment for a given ad unit.
 * @param adUnitCode adUnitCode to get the bid responses for
 */
function getAdserverTargetingForAdUnitCode(adUnitCode) {
  return getAdserverTargeting(adUnitCode)[adUnitCode];
}
addApiMethod('getAdserverTargetingForAdUnitCode', getAdserverTargetingForAdUnitCode);

/**
 * returns all ad server targeting, optionally scoped to the given ad unit(s).
 * @return Map of adUnitCodes to targeting key-value pairs
 */
function getAdserverTargeting(adUnitCode) {
  return _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.getAllTargeting(adUnitCode);
}
addApiMethod('getAdserverTargeting', getAdserverTargeting);
function getConsentMetadata() {
  return _consentHandler_js__WEBPACK_IMPORTED_MODULE_21__.allConsent.getConsentMeta();
}
addApiMethod('getConsentMetadata', getConsentMetadata);
function getBids(type) {
  const responses = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager[type]().filter(bid => _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getAdUnitCodes().includes(bid.adUnitCode));

  // find the last auction id to get responses for most recent auction only
  const currentAuctionId = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getLastAuctionId();
  return responses.map(bid => bid.adUnitCode).filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques).map(adUnitCode => responses.filter(bid => bid.auctionId === currentAuctionId && bid.adUnitCode === adUnitCode)).filter(bids => bids && bids[0] && bids[0].adUnitCode).map(bids => {
    return {
      [bids[0].adUnitCode]: (0,_utils_wrapsInBids_js__WEBPACK_IMPORTED_MODULE_31__.wrapInBids)(bids)
    };
  }).reduce((a, b) => Object.assign(a, b), {});
}

/**
 * @returns the bids requests involved in an auction but not bid on
 */
function getNoBids() {
  return getBids('getNoBids');
}
addApiMethod('getNoBids', getNoBids);

/**
 * @returns the bids requests involved in an auction but not bid on or the specified adUnitCode
 */
function getNoBidsForAdUnitCode(adUnitCode) {
  const bids = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getNoBids().filter(bid => bid.adUnitCode === adUnitCode);
  return (0,_utils_wrapsInBids_js__WEBPACK_IMPORTED_MODULE_31__.wrapInBids)(bids);
}
addApiMethod('getNoBidsForAdUnitCode', getNoBidsForAdUnitCode);

/**
 * @return a map from ad unit code to all bids received for that ad unit code.
 */
function getBidResponses() {
  return getBids('getBidsReceived');
}
addApiMethod('getBidResponses', getBidResponses);

/**
 * Returns bids received for the specified ad unit.
 * @param adUnitCode ad unit code
 */
function getBidResponsesForAdUnitCode(adUnitCode) {
  const bids = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getBidsReceived().filter(bid => bid.adUnitCode === adUnitCode);
  return (0,_utils_wrapsInBids_js__WEBPACK_IMPORTED_MODULE_31__.wrapInBids)(bids);
}
addApiMethod('getBidResponsesForAdUnitCode', getBidResponsesForAdUnitCode);

/**
 * Set query string targeting on one or more GPT ad units.
 * @param adUnit a single `adUnit.code` or multiple.
 */
function setTargetingForGPTAsync(adUnit) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isGptPubadsDefined)()) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('window.googletag is not defined on the page');
    return;
  }
  _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.setTargetingForGPT(adUnit);
}
addApiMethod('setTargetingForGPTAsync', setTargetingForGPTAsync);

/**
 * Set query string targeting on all AST (AppNexus Seller Tag) ad units. Note that this function has to be called after all ad units on page are defined. For working example code, see [Using Prebid.js with AppNexus Publisher Ad Server](http://prebid.org/dev-docs/examples/use-prebid-with-appnexus-ad-server.html).
 * @param adUnitCodes adUnitCode or array of adUnitCodes
 */
function setTargetingForAst(adUnitCodes) {
  if (!_targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.isApntagDefined()) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('window.apntag is not defined on the page');
    return;
  }
  _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.setTargetingForAst(adUnitCodes);
  _events_js__WEBPACK_IMPORTED_MODULE_17__.emit(SET_TARGETING, _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.getAllTargeting());
}
addApiMethod('setTargetingForAst', setTargetingForAst);
/**
 * This function will render the ad (based on params) in the given iframe document passed through.
 * Note that doc SHOULD NOT be the parent document page as we can't doc.write() asynchronously
 * @param  doc document
 * @param  id adId of the bid to render
 * @param options
 */
function renderAd(doc, id, options) {
  (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_22__.renderAdDirect)(doc, id, options);
}
addApiMethod('renderAd', renderAd);

/**
 * Remove adUnit from the $$PREBID_GLOBAL$$ configuration, if there are no addUnitCode(s) it will remove all
 * @param adUnitCode the adUnitCode(s) to remove
 * @alias module:pbjs.removeAdUnit
 */
function removeAdUnit(adUnitCode) {
  if (!adUnitCode) {
    pbjsInstance.adUnits = [];
    return;
  }
  let adUnitCodes;
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(adUnitCode)) {
    adUnitCodes = adUnitCode;
  } else {
    adUnitCodes = [adUnitCode];
  }
  adUnitCodes.forEach(adUnitCode => {
    for (let i = pbjsInstance.adUnits.length - 1; i >= 0; i--) {
      if (pbjsInstance.adUnits[i].code === adUnitCode) {
        pbjsInstance.adUnits.splice(i, 1);
      }
    }
  });
}
addApiMethod('removeAdUnit', removeAdUnit);
const requestBids = function () {
  function filterAdUnits(adUnits, adUnitCodes) {
    if (adUnitCodes != null && !Array.isArray(adUnitCodes)) {
      adUnitCodes = [adUnitCodes];
    }
    if (adUnitCodes == null || Array.isArray(adUnitCodes) && adUnitCodes.length === 0) {
      return {
        included: adUnits,
        excluded: [],
        adUnitCodes: adUnits.map(au => au.code).filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques)
      };
    } else {
      adUnitCodes = adUnitCodes.filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques);
      return Object.assign({
        adUnitCodes
      }, adUnits.reduce(({
        included,
        excluded
      }, adUnit) => {
        (adUnitCodes.includes(adUnit.code) ? included : excluded).push(adUnit);
        return {
          included,
          excluded
        };
      }, {
        included: [],
        excluded: []
      }));
    }
  }
  const delegate = (0,_hook_js__WEBPACK_IMPORTED_MODULE_11__.hook)('async', function (reqBidOptions) {
    let {
      bidsBackHandler,
      timeout,
      adUnits,
      adUnitCodes,
      labels,
      auctionId,
      ttlBuffer,
      ortb2,
      metrics,
      defer
    } = reqBidOptions ?? {};
    const cbTimeout = timeout || _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('bidderTimeout');
    ({
      included: adUnits,
      adUnitCodes
    } = filterAdUnits(adUnits, adUnitCodes));
    let ortb2Fragments = {
      global: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)({}, _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getAnyConfig('ortb2') || {}, ortb2 || {}),
      bidder: Object.fromEntries(Object.entries(_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getBidderConfig()).map(([bidder, cfg]) => [bidder, (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(cfg.ortb2)]).filter(([_, ortb2]) => ortb2 != null))
    };
    ortb2Fragments = (0,_fpd_normalize_js__WEBPACK_IMPORTED_MODULE_29__.normalizeFPD)(ortb2Fragments);
    (0,_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_20__.enrichFPD)(_utils_promise_js__WEBPACK_IMPORTED_MODULE_19__.PbPromise.resolve(ortb2Fragments.global)).then(global => {
      ortb2Fragments.global = global;
      return startAuction({
        bidsBackHandler,
        timeout: cbTimeout,
        adUnits,
        adUnitCodes,
        labels,
        auctionId,
        ttlBuffer,
        ortb2Fragments,
        metrics,
        defer
      });
    });
  }, 'requestBids');
  return (0,_hook_js__WEBPACK_IMPORTED_MODULE_11__.wrapHook)(delegate, logInvocation('requestBids', (0,_utils_prerendering_js__WEBPACK_IMPORTED_MODULE_27__.delayIfPrerendering)(() => !_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('allowPrerendering'), function requestBids(options = {}) {
    // unlike the main body of `delegate`, this runs before any other hook has a chance to;
    // it's also not restricted in its return value in the way `async` hooks are.

    // if the request does not specify adUnits, clone the global adUnit array;
    // otherwise, if the caller goes on to use addAdUnits/removeAdUnits, any asynchronous logic
    // in any hook might see their effects.
    const adUnits = options.adUnits || pbjsInstance.adUnits;
    options.adUnits = Array.isArray(adUnits) ? adUnits.slice() : [adUnits];
    const metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_18__.newMetrics)();
    metrics.checkpoint('requestBids');
    const {
      included,
      excluded,
      adUnitCodes
    } = filterAdUnits(adUnits, options.adUnitCodes);
    _events_js__WEBPACK_IMPORTED_MODULE_17__.emit(REQUEST_BIDS, Object.assign(options, {
      adUnits: included,
      adUnitCodes
    }));

    // ad units that were filtered out are re-included here, then filtered out again in `delegate`
    // this is to avoid breaking requestBids hook that expect all ad units in the request (such as priceFloors)

    const req = Object.assign({}, options, {
      adUnits: options.adUnits.slice().concat(excluded),
      // because of this double filtering logic, it's not clear
      // what it means for an event handler to modify adUnitCodes - so don't allow it
      adUnitCodes,
      metrics,
      defer: (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_19__.defer)({
        promiseFactory: r => new Promise(r)
      })
    });
    delegate.call(this, req);
    return req.defer.promise;
  })));
}();
addApiMethod('requestBids', requestBids, false);
const startAuction = (0,_hook_js__WEBPACK_IMPORTED_MODULE_11__.hook)('async', function ({
  bidsBackHandler,
  timeout: cbTimeout,
  adUnits: adUnitDefs,
  ttlBuffer,
  adUnitCodes,
  labels,
  auctionId,
  ortb2Fragments,
  metrics,
  defer
} = {}) {
  const s2sBidders = (0,_adapterManager_js__WEBPACK_IMPORTED_MODULE_15__.getS2SBidderSet)(_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('s2sConfig') || []);
  fillAdUnitDefaults(adUnitDefs);
  const adUnits = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_18__.useMetrics)(metrics).measureTime('requestBids.validate', () => checkAdUnitSetup(adUnitDefs));
  function auctionDone(bids, timedOut, auctionId) {
    if (typeof bidsBackHandler === 'function') {
      try {
        bidsBackHandler(bids, timedOut, auctionId);
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error executing bidsBackHandler', null, e);
      }
    }
    defer.resolve({
      bids,
      timedOut,
      auctionId
    });
  }
  const tids = {};
  /*
   * for a given adunit which supports a set of mediaTypes
   * and a given bidder which supports a set of mediaTypes
   * a bidder is eligible to participate on the adunit
   * if it supports at least one of the mediaTypes on the adunit
   */
  adUnits.forEach(adUnit => {
    // get the adunit's mediaTypes, defaulting to banner if mediaTypes isn't present
    const adUnitMediaTypes = Object.keys(adUnit.mediaTypes || {
      'banner': 'banner'
    });

    // get the bidder's mediaTypes
    const allBidders = adUnit.bids.map(bid => bid.bidder).filter(Boolean);
    const bidderRegistry = _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].bidderRegistry;
    const bidders = allBidders.filter(bidder => !s2sBidders.has(bidder));
    adUnit.adUnitId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)();
    const tid = adUnit.ortb2Imp?.ext?.tid;
    if (tid) {
      if (tids.hasOwnProperty(adUnit.code)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Multiple distinct ortb2Imp.ext.tid were provided for twin ad units '${adUnit.code}'`);
      } else {
        tids[adUnit.code] = tid;
      }
    }
    if (ttlBuffer != null && !adUnit.hasOwnProperty('ttlBuffer')) {
      adUnit.ttlBuffer = ttlBuffer;
    }
    bidders.forEach(bidder => {
      const adapter = bidderRegistry[bidder];
      const spec = adapter && adapter.getSpec && adapter.getSpec();
      // banner is default if not specified in spec
      const bidderMediaTypes = spec && spec.supportedMediaTypes || ['banner'];

      // check if the bidder's mediaTypes are not in the adUnit's mediaTypes
      const bidderEligible = adUnitMediaTypes.some(type => bidderMediaTypes.includes(type));
      if (!bidderEligible) {
        // drop the bidder from the ad unit if it's not compatible
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.unsupportedBidderMessage)(adUnit, bidder));
        adUnit.bids = adUnit.bids.filter(bid => bid.bidder !== bidder);
      }
    });
  });
  if (!adUnits || adUnits.length === 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('No adUnits configured. No bids requested.');
    auctionDone();
  } else {
    adUnits.forEach(au => {
      const tid = au.ortb2Imp?.ext?.tid || tids[au.code] || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)();
      if (!tids.hasOwnProperty(au.code)) {
        tids[au.code] = tid;
      }
      au.transactionId = tid;
    });
    const auction = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.createAuction({
      adUnits,
      adUnitCodes,
      callback: auctionDone,
      cbTimeout,
      labels,
      auctionId,
      ortb2Fragments,
      metrics
    });
    const adUnitsLen = adUnits.length;
    if (adUnitsLen > 15) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(`Current auction ${auction.getAuctionId()} contains ${adUnitsLen} adUnits.`, adUnits);
    }
    adUnitCodes.forEach(code => _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.setLatestAuctionForAdUnit(code, auction.getAuctionId()));
    auction.callBids();
  }
}, 'startAuction');
function executeCallbacks(fn, reqBidsConfigObj) {
  runAll(_storageManager_js__WEBPACK_IMPORTED_MODULE_14__.storageCallbacks);
  runAll(enableAnalyticsCallbacks);
  fn.call(this, reqBidsConfigObj);
  function runAll(queue) {
    let queued;
    while (queued = queue.shift()) {
      queued();
    }
  }
}

// This hook will execute all storage callbacks which were registered before gdpr enforcement hook was added. Some bidders, user id modules use storage functions when module is parsed but gdpr enforcement hook is not added at that stage as setConfig callbacks are yet to be called. Hence for such calls we execute all the stored callbacks just before requestBids. At this hook point we will know for sure that tcfControl module is added or not
requestBids.before(executeCallbacks, 49);

/**
 * Add ad unit(s)
 * @param adUnits
 */
function addAdUnits(adUnits) {
  pbjsInstance.adUnits.push(...(Array.isArray(adUnits) ? adUnits : [adUnits]));
}
addApiMethod('addAdUnits', addAdUnits);
const eventIdValidators = {
  bidWon(id) {
    const adUnitCodes = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getBidsRequested().map(bidSet => bidSet.bids.map(bid => bid.adUnitCode)).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten).filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques);
    if (!adUnitCodes.includes(id)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('The "' + id + '" placement is not defined.');
      return;
    }
    return true;
  }
};
function validateEventId(event, id) {
  return eventIdValidators.hasOwnProperty(event) && eventIdValidators[event](id);
}

/**
 * @param event the name of the event
 * @param handler a callback to set on event
 * @param id an identifier in the context of the event
 *
 * This API call allows you to register a callback to handle a Prebid.js event.
 * An optional `id` parameter provides more finely-grained event callback registration.
 * This makes it possible to register callback events for a specific item in the
 * event context. For example, `bidWon` events will accept an `id` for ad unit code.
 * `bidWon` callbacks registered with an ad unit code id will be called when a bid
 * for that ad unit code wins the auction. Without an `id` this method registers the
 * callback for every `bidWon` event.
 *
 * Currently `bidWon` is the only event that accepts an `id` parameter.
 */
function onEvent(event, handler, id) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFn)(handler)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('The event handler provided is not a function and was not set on event "' + event + '".');
    return;
  }
  if (id && !validateEventId(event, id)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('The id provided is not valid for event "' + event + '" and no handler was set.');
    return;
  }
  _events_js__WEBPACK_IMPORTED_MODULE_17__.on(event, handler, id);
}
addApiMethod('onEvent', onEvent);

/**
 * @param event the name of the event
 * @param handler a callback to remove from the event
 * @param id an identifier in the context of the event (see `$$PREBID_GLOBAL$$.onEvent`)
 */
function offEvent(event, handler, id) {
  if (id && !validateEventId(event, id)) {
    return;
  }
  _events_js__WEBPACK_IMPORTED_MODULE_17__.off(event, handler, id);
}
addApiMethod('offEvent', offEvent);

/**
 * Return a copy of all events emitted
 */
function getEvents() {
  return _events_js__WEBPACK_IMPORTED_MODULE_17__.getEvents();
}
addApiMethod('getEvents', getEvents);
function registerBidAdapter(bidderAdaptor, bidderCode, spec) {
  try {
    const bidder = spec ? (0,_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_28__.newBidder)(spec) : bidderAdaptor();
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].registerBidAdapter(bidder, bidderCode);
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error registering bidder adapter : ' + e.message);
  }
}
addApiMethod('registerBidAdapter', registerBidAdapter);
function registerAnalyticsAdapter(options) {
  try {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].registerAnalyticsAdapter(options);
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error registering analytics adapter : ' + e.message);
  }
}
addApiMethod('registerAnalyticsAdapter', registerAnalyticsAdapter);
const enableAnalyticsCallbacks = [];
const enableAnalyticsCb = (0,_hook_js__WEBPACK_IMPORTED_MODULE_11__.hook)('async', function (config) {
  if (config && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(config)) {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].enableAnalytics(config);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_32__.getGlobalVarName)()}.enableAnalytics should be called with option {}`);
  }
}, 'enableAnalyticsCb');
function enableAnalytics(config) {
  enableAnalyticsCallbacks.push(enableAnalyticsCb.bind(this, config));
}
addApiMethod('enableAnalytics', enableAnalytics);

/**
 * Define an alias for a bid adapter.
 */
function aliasBidder(bidderCode, alias, options) {
  if (bidderCode && alias) {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].aliasBidAdapter(bidderCode, alias, options);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('bidderCode and alias must be passed as arguments', `${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_32__.getGlobalVarName)()}.aliasBidder`);
  }
}
addApiMethod('aliasBidder', aliasBidder);
pbjsInstance.aliasRegistry = _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].aliasRegistry;
_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('aliasRegistry', config => {
  if (config.aliasRegistry === 'private') delete pbjsInstance.aliasRegistry;
});

/**
 * @return All bids that have been rendered. Useful for [troubleshooting your integration](http://prebid.org/dev-docs/prebid-troubleshooting-guide.html).
 */
function getAllWinningBids() {
  return _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getAllWinningBids();
}
addApiMethod('getAllWinningBids', getAllWinningBids);

/**
 * @return Bids that have won their respective auctions but have not been rendered yet.
 */
function getAllPrebidWinningBids() {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('getAllPrebidWinningBids may be removed or renamed in a future version. This function returns bids that have won in prebid and have had targeting set but have not (yet?) won in the ad server. It excludes bids that have been rendered.');
  return _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getBidsReceived().filter(bid => bid.status === _constants_js__WEBPACK_IMPORTED_MODULE_16__.BID_STATUS.BID_TARGETING_SET);
}
addApiMethod('getAllPrebidWinningBids', getAllPrebidWinningBids);

/**
 * Get highest cpm bids for all adUnits, or highest cpm bid object for the given adUnit
 * @param adUnitCode - ad unit code
 */
function getHighestCpmBids(adUnitCode) {
  return _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.getWinningBids(adUnitCode);
}
addApiMethod('getHighestCpmBids', getHighestCpmBids);

/**
 * Clear all auctions (and their bids) from the bid cache.
 */
function clearAllAuctions() {
  _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.clearAllAuctions();
}
addApiMethod('clearAllAuctions', clearAllAuctions);
function findBidByAdId(adId) {
  if (!adId) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('adId is required');
  } else {
    const candidates = _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getBidsReceived().filter(bid => bid.adId === adId);
    if (!candidates.length) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Could not find ad matching adId '${adId}'`);
    } else {
      return candidates[0];
    }
  }
  return null;
}
function markAsUsed(bid, fireEvents = true) {
  if (fireEvents) {
    (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_22__.markWinningBid)(bid);
  } else {
    _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.addWinningBid(bid);
  }
  (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_22__.markBidAsRendered)(bid);
}
/**
 * @return the bid response matching the given adId, or null if no such bid exists.
 */
function getBidResponseByAdId(adId, options) {
  const bid = findBidByAdId(adId);
  if (bid != null && options?.markAsUsed) {
    markAsUsed(bid, true);
  }
  return bid;
}
addApiMethod('getBidResponseByAdId', getBidResponseByAdId);

/**
 * Mark the winning bid as used, should only be used in conjunction with video
 */
function markWinningBidAsUsed({
  adId,
  adUnitCode,
  analytics = false,
  events = false
}) {
  let bid;
  if (adUnitCode && adId == null) {
    bid = _targeting_js__WEBPACK_IMPORTED_MODULE_10__.targeting.getWinningBids(adUnitCode)[0];
  } else if (adId) {
    bid = findBidByAdId(adId);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Improper use of markWinningBidAsUsed. It needs an adUnitCode or an adId to function.');
  }
  if (bid != null) {
    markAsUsed(bid, analytics || events);
  }
}
if (true) {
  addApiMethod('markWinningBidAsUsed', markWinningBidAsUsed);
}
addApiMethod('getConfig', _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getAnyConfig);
addApiMethod('readConfig', _config_js__WEBPACK_IMPORTED_MODULE_7__.config.readAnyConfig);
addApiMethod('mergeConfig', _config_js__WEBPACK_IMPORTED_MODULE_7__.config.mergeConfig);
addApiMethod('mergeBidderConfig', _config_js__WEBPACK_IMPORTED_MODULE_7__.config.mergeBidderConfig);
addApiMethod('setConfig', _config_js__WEBPACK_IMPORTED_MODULE_7__.config.setConfig);
addApiMethod('setBidderConfig', _config_js__WEBPACK_IMPORTED_MODULE_7__.config.setBidderConfig);
pbjsInstance.que.push(() => (0,_secureCreatives_js__WEBPACK_IMPORTED_MODULE_5__.listenMessagesFromCreative)());
let queSetupComplete;
function resetQueSetup() {
  queSetupComplete = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_19__.defer)();
}
resetQueSetup();

/**
 * This queue lets users load Prebid asynchronously, but run functions the same way regardless of whether it gets loaded
 * before or after their script executes. For example, given the code:
 *
 * <script src="url/to/Prebid.js" async></script>
 * <script>
 *   var pbjs = pbjs || {};
 *   pbjs.cmd = pbjs.cmd || [];
 *   pbjs.cmd.push(functionToExecuteOncePrebidLoads);
 * </script>
 *
 * If the page's script runs before prebid loads, then their function gets added to the queue, and executed
 * by prebid once it's done loading. If it runs after prebid loads, then this monkey-patch causes their
 * function to execute immediately.
 *
 * @param  {function} command A function which takes no arguments. This is guaranteed to run exactly once, and only after
 *                            the Prebid script has been fully loaded.
 * @alias module:pbjs.cmd.push
 * @alias module:pbjs.que.push
 */
function quePush(command) {
  queSetupComplete.promise.then(() => {
    if (typeof command === 'function') {
      try {
        command.call();
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error processing command :', e.message, e.stack);
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Commands written into ${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_32__.getGlobalVarName)()}.cmd.push must be wrapped in a function`);
    }
  });
}
function runCommand(cmd) {
  if (typeof cmd.called === 'undefined') {
    try {
      cmd.call();
      cmd.called = true;
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error processing command :', 'prebid.js', e);
    }
  }
}
function _processQueue(queue, cb) {
  (0,_utils_yield_js__WEBPACK_IMPORTED_MODULE_33__.yieldAll)(() => (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)().yield ?? true, queue.map(cmd => () => runCommand(cmd)), cb);
}

/**
 * Process the command queue, effectively booting up Prebid.
 * Bundles generated by the build automatically include a call to this; NPM consumers
 * should call this after loading all modules and before using other APIs.
 */
const processQueue = (0,_utils_prerendering_js__WEBPACK_IMPORTED_MODULE_27__.delayIfPrerendering)(() => pbjsInstance.delayPrerendering, async function () {
  pbjsInstance.que.push = pbjsInstance.cmd.push = quePush;
  (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_22__.insertLocatorFrame)();
  _hook_js__WEBPACK_IMPORTED_MODULE_11__.hook.ready();
  _processQueue(pbjsInstance.que, () => {
    _processQueue(pbjsInstance.cmd, () => {
      queSetupComplete.resolve();
    });
  });
});
addApiMethod('processQueue', processQueue, false);

/**
 * Manually trigger billing for a winning bid, idendified either by ad ID or ad unit code.
 * Used in conjunction with `adUnit.deferBilling`.
 */
function triggerBilling({
  adId,
  adUnitCode
}) {
  _auctionManager_js__WEBPACK_IMPORTED_MODULE_8__.auctionManager.getAllWinningBids().filter(bid => bid.adId === adId || adId == null && bid.adUnitCode === adUnitCode).forEach(bid => {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_15__["default"].triggerBilling(bid);
    (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_22__.renderIfDeferred)(bid);
  });
}
addApiMethod('triggerBilling', triggerBilling);

/**
 * Refreshes the previously generated page view ID. Can be used to instruct bidders
 * that use page view ID to consider future auctions as part of a new page load.
 */
function refreshPageViewId() {
  for (const key of pbjsInstance.pageViewIdPerBidder.keys()) {
    pbjsInstance.pageViewIdPerBidder.set(key, (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)());
  }
}
addApiMethod('refreshPageViewId', refreshPageViewId);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (pbjsInstance);

/***/ },

/***/ "./src/prebidGlobal.js"
/*!*****************************!*\
  !*** ./src/prebidGlobal.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobal: () => (/* binding */ getGlobal),
/* harmony export */   registerModule: () => (/* binding */ registerModule)
/* harmony export */ });
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");

// if the global already exists in global document scope, use it, if not, create the object
const scope = !(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_0__.shouldDefineGlobal)() ? {} : window;
const global = scope[(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalVarName)()] = scope[(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalVarName)()] || {};
global.cmd = global.cmd || [];
global.que = global.que || [];
global.installedModules = global.installedModules || [];

// create a pbjs global pointer
if (scope === window) {
  scope._pbjsGlobals = scope._pbjsGlobals || [];
  scope._pbjsGlobals.push((0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalVarName)());
}
function getGlobal() {
  return global;
}
function registerModule(name) {
  global.installedModules.push(name);
}

/***/ },

/***/ "./src/refererDetection.js"
/*!*********************************!*\
  !*** ./src/refererDetection.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRefererInfo: () => (/* binding */ getRefererInfo),
/* harmony export */   parseDomain: () => (/* binding */ parseDomain)
/* harmony export */ });
/* unused harmony exports ensureProtocol, detectReferer, cacheWithLocation */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/**
 * The referer detection module attempts to gather referer information from the current page that prebid.js resides in.
 * The information that it tries to collect includes:
 * The detected top url in the nav bar,
 * Whether it was able to reach the top most window (if for example it was embedded in several iframes),
 * The number of iframes it was embedded in if applicable (by default max ten iframes),
 * A list of the domains of each embedded window if applicable.
 * Canonical URL which refers to an HTML link element, with the attribute of rel="canonical", found in the <head> element of your webpage
 */




/**
 * Prepend a URL with the page's protocol (http/https), if necessary.
 */
function ensureProtocol(url, win = window) {
  if (!url) return url;
  if (/\w+:\/\//.exec(url)) {
    // url already has protocol
    return url;
  }
  let windowProto = win.location.protocol;
  try {
    windowProto = win.top.location.protocol;
  } catch (e) {}
  if (/^\/\//.exec(url)) {
    // url uses relative protocol ("//example.com")
    return windowProto + url;
  } else {
    return `${windowProto}//${url}`;
  }
}

/**
 * Extract the domain portion from a URL.
 * @param url - The URL to extract the domain from.
 * @param options - Options for parsing the domain.
 * @param options.noLeadingWww - If true, remove 'www.' appearing at the beginning of the domain.
 * @param options.noPort - If true, do not include the ':[port]' portion.
 * @return The extracted domain or undefined if the URL is invalid.
 */
function parseDomain(url, {
  noLeadingWww = false,
  noPort = false
} = {}) {
  let target;
  try {
    target = new URL(ensureProtocol(url));
  } catch (e) {
    return;
  }
  target = noPort ? target.hostname : target.host;
  if (noLeadingWww && target.startsWith('www.')) {
    target = target.substring(4);
  }
  return target;
}

/**
 * This function returns canonical URL which refers to an HTML link element, with the attribute of rel="canonical", found in the <head> element of your webpage
 *
 * @param {Object} doc document
 * @returns {string|null}
 */
function getCanonicalUrl(doc) {
  try {
    const element = doc.querySelector("link[rel='canonical']");
    if (element !== null) {
      return element.href;
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}
/**
 * @param {Window} win Window
 * @returns {Function}
 */
function detectReferer(win) {
  /**
   * This function would return a read-only array of hostnames for all the parent frames.
   * win.location.ancestorOrigins is only supported in webkit browsers. For non-webkit browsers it will return undefined.
   *
   * @param {Window} win Window object
   * @returns {(undefined|Array)} Ancestor origins or undefined
   */
  function getAncestorOrigins(win) {
    try {
      if (!win.location.ancestorOrigins) {
        return;
      }
      return win.location.ancestorOrigins;
    } catch (e) {
      // Ignore error
    }
  }

  // TODO: the meaning of "reachedTop" seems to be intentionally ambiguous - best to leave them out of
  // the typedef for now. (for example, unit tests enforce that "reachedTop" should be false in some situations where we
  // happily provide a location for the top).

  /**
   * Walk up the windows to get the origin stack and best available referrer, canonical URL, etc.
   *
   * @returns An object containing referer information.
   */
  function refererInfo() {
    const stack = [];
    const ancestors = getAncestorOrigins(win);
    const maxNestedIframes = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('maxNestedIframes');
    let currentWindow;
    let bestLocation;
    let bestCanonicalUrl;
    let reachedTop = false;
    let level = 0;
    let valuesFromAmp = false;
    let inAmpFrame = false;
    let hasTopLocation = false;
    do {
      const previousWindow = currentWindow;
      const wasInAmpFrame = inAmpFrame;
      let currentLocation;
      let crossOrigin = false;
      let foundLocation = null;
      inAmpFrame = false;
      currentWindow = currentWindow ? currentWindow.parent : win;
      try {
        currentLocation = currentWindow.location.href || null;
      } catch (e) {
        crossOrigin = true;
      }
      if (crossOrigin) {
        if (wasInAmpFrame) {
          const context = previousWindow.context;
          try {
            foundLocation = context.sourceUrl;
            bestLocation = foundLocation;
            hasTopLocation = true;
            valuesFromAmp = true;
            if (currentWindow === win.top) {
              reachedTop = true;
            }
            if (context.canonicalUrl) {
              bestCanonicalUrl = context.canonicalUrl;
            }
          } catch (e) {/* Do nothing */}
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Trying to access cross domain iframe. Continuing without referrer and location');
          try {
            // the referrer to an iframe is the parent window
            const referrer = previousWindow.document.referrer;
            if (referrer) {
              foundLocation = referrer;
              if (currentWindow === win.top) {
                reachedTop = true;
              }
            }
          } catch (e) {/* Do nothing */}
          if (!foundLocation && ancestors && ancestors[level - 1]) {
            foundLocation = ancestors[level - 1];
            if (currentWindow === win.top) {
              hasTopLocation = true;
            }
          }
          if (foundLocation && !valuesFromAmp) {
            bestLocation = foundLocation;
          }
        }
      } else {
        if (currentLocation) {
          foundLocation = currentLocation;
          bestLocation = foundLocation;
          valuesFromAmp = false;
          if (currentWindow === win.top) {
            reachedTop = true;
            const canonicalUrl = getCanonicalUrl(currentWindow.document);
            if (canonicalUrl) {
              bestCanonicalUrl = canonicalUrl;
            }
          }
        }
        if (currentWindow.context && currentWindow.context.sourceUrl) {
          inAmpFrame = true;
        }
      }
      stack.push(foundLocation);
      level++;
    } while (currentWindow !== win.top && level < maxNestedIframes);
    stack.reverse();
    let ref;
    try {
      ref = win.top.document.referrer;
    } catch (e) {}
    const location = reachedTop || hasTopLocation ? bestLocation : null;
    const canonicalUrl = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('pageUrl') || bestCanonicalUrl || null;
    let page = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('pageUrl') || location || ensureProtocol(canonicalUrl, win);
    if (location && location.indexOf('?') > -1 && page.indexOf('?') === -1) {
      page = `${page}${location.substring(location.indexOf('?'))}`;
    }
    return {
      /**
       * True if the top window is accessible.
       */
      reachedTop,
      isAmp: valuesFromAmp,
      /**
       * number of steps between window.self and window.top
       */
      numIframes: level - 1,
      /**
       * our best guess at the location for each frame, in the direction top -> self.
       */
      stack,
      /**
       * of the top-most frame for which we could guess the location. Outside of cross-origin scenarios, this is equivalent to `location`.
       */
      topmostLocation: bestLocation || null,
      /**
       * the browser's location, or null if not available (due to cross-origin restrictions)
       */
      location,
      /**
       * the site's canonical URL as set by the publisher, through setConfig({pageUrl}) or <link rel="canonical" />
       */
      canonicalUrl,
      /**
       * the best candidate for the current page URL: `canonicalUrl`, falling back to `location`
       */
      page,
      /**
       * the domain portion of `page`
       */
      domain: parseDomain(page) || null,
      /**
       * the referrer (document.referrer) to the current page, or null if not available (due to cross-origin restrictions)
       */
      ref: ref || null,
      // TODO: the "legacy" refererInfo object is provided here, for now, to accommodate
      // adapters that decided to just send it verbatim to their backend.
      legacy: {
        reachedTop,
        isAmp: valuesFromAmp,
        numIframes: level - 1,
        stack,
        referer: bestLocation || null,
        canonicalUrl
      }
    };
  }
  return refererInfo;
}

// cache result of fn (= referer info) as long as:
// - we are the top window
// - canonical URL tag and window location have not changed
function cacheWithLocation(fn, win = window) {
  if (win.top !== win) return fn;
  let canonical, href, value;
  return function () {
    const newCanonical = getCanonicalUrl(win.document);
    const newHref = win.location.href;
    if (canonical !== newCanonical || newHref !== href) {
      canonical = newCanonical;
      href = newHref;
      value = fn();
    }
    return value;
  };
}
const getRefererInfo = cacheWithLocation(detectReferer(window));

/***/ },

/***/ "./src/secureCreatives.js"
/*!********************************!*\
  !*** ./src/secureCreatives.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   listenMessagesFromCreative: () => (/* binding */ listenMessagesFromCreative)
/* harmony export */ });
/* unused harmony exports getReplier, receiveMessage, resizeAnchor, resizeRemoteCreative */
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _adRendering_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adRendering.js */ "./src/adRendering.js");
/* harmony import */ var _creativeRenderers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./creativeRenderers.js */ "./src/creativeRenderers.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _utils_adUnits_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/adUnits.js */ "./src/utils/adUnits.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/gptTargeting.js */ "./src/utils/gptTargeting.js");
/* Secure Creatives
  Provides support for rendering creatives into cross domain iframes such as SafeFrame to prevent
   access to a publisher page from creative payloads.
 */










const {
  REQUEST,
  RESPONSE,
  NATIVE,
  EVENT
} = _constants_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGES;
const HANDLER_MAP = {
  [REQUEST]: handleRenderRequest,
  [EVENT]: handleEventRequest
};
if (true) {
  Object.assign(HANDLER_MAP, {
    [NATIVE]: handleNativeRequest
  });
}
function listenMessagesFromCreative() {
  window.addEventListener('message', function (ev) {
    receiveMessage(ev);
  }, false);
}
function getReplier(ev) {
  if (ev.origin == null && ev.ports.length === 0) {
    return function () {
      const msg = 'Cannot post message to a frame with null origin. Please update creatives to use MessageChannel, see https://github.com/prebid/Prebid.js/issues/7870';
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(msg);
      throw new Error(msg);
    };
  } else if (ev.ports.length > 0) {
    return function (message) {
      ev.ports[0].postMessage(JSON.stringify(message));
    };
  } else {
    return function (message) {
      ev.source.postMessage(JSON.stringify(message), ev.origin);
    };
  }
}
function ensureAdId(adId, reply) {
  return function (data, ...args) {
    return reply(Object.assign({}, data, {
      adId
    }), ...args);
  };
}
function receiveMessage(ev, cb) {
  var key = ev.message ? 'message' : 'data';
  var data;
  try {
    data = JSON.parse(ev[key]);
  } catch (e) {
    return;
  }
  if (data && data.adId && data.message && HANDLER_MAP.hasOwnProperty(data.message)) {
    HANDLER_MAP[data.message](ensureAdId(data.adId, getReplier(ev)), data, _auctionManager_js__WEBPACK_IMPORTED_MODULE_7__.auctionManager.findBidByAdId(data.adId));
    cb && cb();
  }
}
function getResizer(adId, bidResponse) {
  // in some situations adId !== bidResponse.adId
  // the first is the one that was requested and is tied to the element
  // the second is the one that is being rendered (sometimes different, e.g. in some paapi setups)
  return function (width, height) {
    resizeRemoteCreative({
      ...bidResponse,
      width,
      height,
      adId
    });
  };
}
function handleRenderRequest(reply, message, bidResponse) {
  (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_3__.handleRender)({
    renderFn(adData) {
      reply(Object.assign({
        message: RESPONSE,
        renderer: (0,_creativeRenderers_js__WEBPACK_IMPORTED_MODULE_4__.getCreativeRendererSource)(bidResponse),
        rendererVersion: _creativeRenderers_js__WEBPACK_IMPORTED_MODULE_4__.PUC_MIN_VERSION
      }, adData));
    },
    resizeFn: getResizer(message.adId, bidResponse),
    options: message.options,
    adId: message.adId,
    bidResponse
  });
}
function handleNativeRequest(reply, data, adObject) {
  // handle this script from native template in an ad server
  // window.parent.postMessage(JSON.stringify({
  //   message: 'Prebid Native',
  //   adId: '%%PATTERN:hb_adid%%'
  // }), '*');
  if (adObject == null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(`Cannot find ad for x-origin event request: '${data.adId}'`);
    return;
  }
  switch (data.action) {
    case 'assetRequest':
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_3__.deferRendering)(adObject, () => reply((0,_native_js__WEBPACK_IMPORTED_MODULE_0__.getAssetMessage)(data, adObject)));
      break;
    case 'allAssetRequest':
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_3__.deferRendering)(adObject, () => reply((0,_native_js__WEBPACK_IMPORTED_MODULE_0__.getAllAssetsMessage)(data, adObject)));
      break;
    default:
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_3__.handleNativeMessage)(data, adObject, {
        resizeFn: getResizer(data.adId, adObject)
      });
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_3__.markWinner)(adObject);
  }
}
function handleEventRequest(reply, data, adObject) {
  if (adObject == null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(`Cannot find ad '${data.adId}' for x-origin event request`);
    return;
  }
  if (adObject.status !== _constants_js__WEBPACK_IMPORTED_MODULE_1__.BID_STATUS.RENDERED) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)(`Received x-origin event request without corresponding render request for ad '${adObject.adId}'`);
    return;
  }
  return (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_3__.handleCreativeEvent)(data, adObject);
}
function getDimension(value) {
  return value ? value + 'px' : '100%';
}
function resizeAnchor(ins, width, height) {
  /**
   * Special handling for google anchor ads
   * For anchors, the element to resize is an <ins> element that is an ancestor of the creative iframe
   * On desktop this is sized to the creative dimensions;
   * on mobile one dimension is fixed to 100%.
   */
  return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_5__.PbPromise((resolve, reject) => {
    let tryCounter = 10;
    // wait until GPT has set dimensions on the ins, otherwise our changes will be overridden
    const resizer = setInterval(() => {
      let done = false;
      Object.entries({
        width,
        height
      }).forEach(([dimension, newValue]) => {
        if (/\d+px/.test(ins.style[dimension])) {
          ins.style[dimension] = getDimension(newValue);
          done = true;
        }
      });
      if (done || tryCounter-- === 0) {
        clearInterval(resizer);
        done ? resolve() : reject(new Error('Could not resize anchor'));
      }
    }, 50);
  });
}
function resizeRemoteCreative({
  instl,
  element,
  adId,
  adUnitCode,
  width,
  height
}) {
  // do not resize interstitials - the creative frame takes the full screen and sizing of the ad should
  // be handled within it.
  if (instl) return;
  function resize(element) {
    if (element) {
      const elementStyle = element.style;
      elementStyle.width = getDimension(width);
      elementStyle.height = getDimension(height);
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(`Unable to locate matching page element for adUnitCode ${adUnitCode}.  Can't resize it to ad's dimensions.  Please review setup.`);
    }
  }

  // not select element that gets removed after dfp render
  const iframe = getElementByAdUnit('iframe:not([style*="display: none"])');
  resize(iframe);
  const anchorIns = iframe?.closest('ins[data-anchor-status]');
  anchorIns ? resizeAnchor(anchorIns, width, height) : resize(iframe?.parentElement);
  function getElementByAdUnit(elmType) {
    const id = getElementIdBasedOnAdServer(adId, adUnitCode);
    const parentDivEle = id == null ? (0,_utils_adUnits_js__WEBPACK_IMPORTED_MODULE_6__.getAdUnitElement)({
      element,
      adUnitCode
    }) : document.getElementById(id);
    return parentDivEle && parentDivEle.querySelector(elmType);
  }
  function getElementIdBasedOnAdServer(adId, adUnitCode) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isGptPubadsDefined)()) {
      const dfpId = getDfpElementId(adId);
      if (dfpId) {
        return dfpId;
      }
    }
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isApnGetTagDefined)()) {
      const apnId = getAstElementId(adUnitCode);
      if (apnId) {
        return apnId;
      }
    }
  }
  function getDfpElementId(adId) {
    const dfpId = (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_8__.findSlotElementIdByAdId)(adId);
    if (dfpId) {
      return dfpId;
    }
    const slot = window.googletag.pubads().getSlots().find(slot => {
      return (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_8__.getSlotTargetingKeys)(slot).find(key => {
        return (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_8__.getSlotTargeting)(slot, key).includes(adId);
      });
    });
    return slot ? slot.getSlotElementId() : null;
  }
  function getAstElementId(adUnitCode) {
    const astTag = window.apntag.getTag(adUnitCode);
    return astTag && astTag.targetId;
  }
}

/***/ },

/***/ "./src/standaloneModuleLoader.js"
/*!***************************************!*\
  !*** ./src/standaloneModuleLoader.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   standaloneModuleLoader: () => (/* binding */ standaloneModuleLoader)
/* harmony export */ });
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _adloader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./adloader.js */ "./src/adloader.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");







/**
 * Build a loader for a module that can be bundled separately and pulled in on
 * demand (a "standalone" bundle). The returned function, on its first call:
 *   - resolves immediately if the module is already compiled into this build;
 *   - otherwise loads `<distUrlBase><bundle>`. That bundle hands control back by
 *     replacing the `installProp` sentinel on the global with an install
 *     function, which is then called with `deps`.
 *
 * The load is attempted at most once. The check runs in a 0-delay timeout to
 * give `installedModules` time to be populated (so a compiled-in module is not
 * loaded - and installed - a second time).
 *
 * Options: `moduleName` (installedModules entry / loader moduleCode),
 * `installProp` (global property used for the sentinel handshake), `bundle`
 * (standalone bundle file name, served from the dist URL base), `deps`
 * (passed to the module's install()), and the `alreadyInstalled` / `script`
 * test seams.
 */
function standaloneModuleLoader({
  moduleName,
  installProp,
  bundle,
  deps,
  alreadyInstalled = () => (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)().installedModules.includes(moduleName),
  script = url => new _utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise((resolve, reject) => {
    (0,_adloader_js__WEBPACK_IMPORTED_MODULE_2__.loadExternalScript)(url, _activities_modules_js__WEBPACK_IMPORTED_MODULE_4__.MODULE_TYPE_PREBID, moduleName, {
      success: resolve,
      error: reject
    });
  })
} = {}) {
  let loading = null;
  return function () {
    if (loading == null) {
      loading = new _utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise((resolve, reject) => {
        // run this in a 0-delay timeout to give installedModules time to be populated
        setTimeout(() => {
          if (alreadyInstalled()) {
            resolve();
          } else {
            const url = `${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_5__.getDistUrlBase)()}${bundle}`;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)(`${moduleName} module not installed, loading it from "${url}"...`);
            (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)()[installProp] = true;
            script(url).then(() => {
              (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)()[installProp](deps);
            }).then(resolve, reject);
          }
        });
      });
    }
    return loading;
  };
}

/***/ },

/***/ "./src/storageManager.js"
/*!*******************************!*\
  !*** ./src/storageManager.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STORAGE_TYPE_COOKIES: () => (/* binding */ STORAGE_TYPE_COOKIES),
/* harmony export */   STORAGE_TYPE_LOCALSTORAGE: () => (/* binding */ STORAGE_TYPE_LOCALSTORAGE),
/* harmony export */   canSetCookie: () => (/* binding */ canSetCookie),
/* harmony export */   discloseStorageUse: () => (/* binding */ discloseStorageUse),
/* harmony export */   getCoreStorageManager: () => (/* binding */ getCoreStorageManager),
/* harmony export */   getStorageManager: () => (/* binding */ getStorageManager),
/* harmony export */   storageCallbacks: () => (/* binding */ storageCallbacks)
/* harmony export */ });
/* unused harmony exports newStorageManager, deviceAccessRule, storageAllowedRule, resetData */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_params_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./activities/activityParams.js */ "./src/activities/activityParams.js");










const STORAGE_TYPE_LOCALSTORAGE = 'html5';
const STORAGE_TYPE_COOKIES = 'cookie';
let storageCallbacks = [];

/* eslint-disable no-restricted-properties */

/*
 *  Storage manager constructor. Consumers should prefer one of `getStorageManager` or `getCoreStorageManager`.
 */
function newStorageManager({
  moduleName,
  moduleType,
  advertiseKeys = true
} = {}, {
  isAllowed = _activities_rules_js__WEBPACK_IMPORTED_MODULE_3__.isActivityAllowed
} = {}) {
  function isValid(cb, storageType, storageKey, isWrite) {
    let mod = moduleName;
    const curBidder = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getCurrentBidder();
    if (curBidder && moduleType === _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER && _adapterManager_js__WEBPACK_IMPORTED_MODULE_8__["default"].aliasRegistry[curBidder] === moduleName) {
      mod = curBidder;
    }
    const params = {
      [_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_TYPE]: storageType,
      [_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_WRITE]: isWrite
    };
    if (advertiseKeys && storageKey != null) {
      params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_KEY] = storageKey;
    }
    const result = {
      valid: isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_ACCESS_DEVICE, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_9__.activityParams)(moduleType, mod, params))
    };
    return cb(result);
  }
  function schedule(operation, storageType, storageKey, isWrite, done) {
    if (done && typeof done === 'function') {
      storageCallbacks.push(function () {
        let result = isValid(operation, storageType, storageKey, isWrite);
        done(result);
      });
    } else {
      return isValid(operation, storageType, storageKey, isWrite);
    }
  }

  /**
   * @param {string} key
   * @param {string} value
   * @param {string} [expires='']
   * @param {string} [sameSite='/']
   * @param {string} [domain] domain (e.g., 'example.com' or 'subdomain.example.com').
   * If not specified, defaults to the host portion of the current document location.
   * If a domain is specified, subdomains are always included.
   * Domain must match the domain of the JavaScript origin. Setting cookies to foreign domains will be silently ignored.
   * @param {function} [done]
   */
  const setCookie = function (key, value, expires, sameSite, domain, done) {
    let cb = function (result) {
      if (result && result.valid) {
        const domainPortion = domain && domain !== '' ? ` ;domain=${encodeURIComponent(domain)}` : '';
        const expiresPortion = expires && expires !== '' ? ` ;expires=${expires}` : '';
        const isNone = sameSite?.toLowerCase() === 'none';
        const secure = isNone ? '; Secure' : '';
        document.cookie = `${key}=${encodeURIComponent(value)}${expiresPortion}; path=/${domainPortion}${sameSite ? `; SameSite=${sameSite}` : ''}${secure}`;
      }
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, key, true, done);
  };

  /**
   * @param {string} name
   * @param {function} [done]
   * @returns {(string|null)}
   */
  const getCookie = function (name, done) {
    let cb = function (result) {
      if (result && result.valid) {
        let m = window.document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]*)\\s*(;|$)');
        return m ? decodeURIComponent(m[2]) : null;
      }
      return null;
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, name, false, done);
  };

  /**
   * @param {function} [done]
   * @returns {boolean}
   */
  const cookiesAreEnabled = function (done) {
    let cb = function (result) {
      if (result && result.valid) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.checkCookieSupport)() && canSetCookie();
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, null, false, done);
  };
  function storageMethods(name) {
    const capName = name.charAt(0).toUpperCase() + name.substring(1);
    const backend = () => window[name];
    const hasStorage = function (done) {
      let cb = function (result) {
        if (result && result.valid) {
          try {
            return !!backend();
          } catch (e) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`${name} api disabled`);
          }
        }
        return false;
      };
      return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, null, false, done);
    };
    return {
      [`has${capName}`]: hasStorage,
      [`${name}IsEnabled`](done) {
        let cb = function (result) {
          if (result && result.valid) {
            try {
              backend().setItem('prebid.cookieTest', '1');
              return backend().getItem('prebid.cookieTest') === '1';
            } catch (error) {} finally {
              try {
                backend().removeItem('prebid.cookieTest');
              } catch (error) {}
            }
          }
          return false;
        };
        return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, null, false, done);
      },
      [`setDataIn${capName}`](key, value, done) {
        let cb = function (result) {
          if (result && result.valid && hasStorage()) {
            backend().setItem(key, value);
          }
        };
        return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, key, true, done);
      },
      [`getDataFrom${capName}`](key, done) {
        let cb = function (result) {
          if (result && result.valid && hasStorage()) {
            return backend().getItem(key);
          }
          return null;
        };
        return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, key, false, done);
      },
      [`removeDataFrom${capName}`](key, done) {
        let cb = function (result) {
          if (result && result.valid && hasStorage()) {
            backend().removeItem(key);
          }
        };
        return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, key, true, done);
      }
    };
  }

  /**
   * Returns all cookie values from the jar whose names contain the `keyLike`
   * Needs to exist in `utils.js` as it follows the StorageHandler interface defined in live-connect-js. If that module were to be removed, this function can go as well.
   * @param {string} keyLike
   * @param {function} [done]
   * @returns {string[]}
   */
  const findSimilarCookies = function (keyLike, done) {
    let cb = function (result) {
      if (result && result.valid) {
        const all = [];
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasDeviceAccess)()) {
          const cookies = document.cookie.split(';');
          while (cookies.length) {
            const cookie = cookies.pop();
            let separatorIndex = cookie.indexOf('=');
            separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;
            const cookieName = decodeURIComponent(cookie.slice(0, separatorIndex).replace(/^\s+/, ''));
            if (cookieName.indexOf(keyLike) >= 0) {
              all.push(decodeURIComponent(cookie.slice(separatorIndex + 1)));
            }
          }
        }
        return all;
      }
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, keyLike, false, done);
  };
  return {
    setCookie,
    getCookie,
    cookiesAreEnabled,
    ...storageMethods('localStorage'),
    ...storageMethods('sessionStorage'),
    findSimilarCookies
  };
}

/**
 * Get a storage manager for a particular module.
 *
 * Either bidderCode or a combination of moduleType + moduleName must be provided. The former is a shorthand
 *  for `{moduleType: 'bidder', moduleName: bidderCode}`.
 *
 */
function getStorageManager({
  moduleType,
  moduleName,
  bidderCode
} = {}) {
  function err() {
    throw new Error(`Invalid invocation for getStorageManager: must set either bidderCode, or moduleType + moduleName`);
  }
  if (bidderCode) {
    if (moduleType && moduleType !== _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER || moduleName) err();
    moduleType = _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER;
    moduleName = bidderCode;
  } else if (!moduleName || !moduleType) {
    err();
  }
  return newStorageManager({
    moduleType,
    moduleName
  });
}

/**
 * Get a storage manager for "core" (vendorless, or first-party) modules. Shorthand for `getStorageManager({moduleName, moduleType: 'core'})`.
 *
 * @param {string} moduleName Module name
 */
function getCoreStorageManager(moduleName) {
  return newStorageManager({
    moduleName: moduleName,
    moduleType: _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_PREBID
  });
}
const canSetCookie = (() => {
  const testStorageMgr = getCoreStorageManager('storage');
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.memoize)(function (domain, storageMgr = testStorageMgr) {
    const expirationDate = new Date((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.timestamp)() + 10 * 1000).toUTCString();
    const cookieName = `_rdc${Date.now()}`;
    const cookieValue = 'writeable';
    storageMgr.setCookie(cookieName, cookieValue, expirationDate, 'Lax', domain);
    const value = storageMgr.getCookie(cookieName);
    if (value === cookieValue) {
      storageMgr.setCookie(cookieName, '', 'Thu, 01 Jan 1970 00:00:01 GMT', undefined, domain);
      return true;
    } else {
      return false;
    }
  });
})();

/**
 * Block all access to storage when deviceAccess = false
 */
function deviceAccessRule() {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasDeviceAccess)()) {
    return {
      allow: false
    };
  }
}
(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_3__.registerActivityControl)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_ACCESS_DEVICE, 'deviceAccess config', deviceAccessRule);

/**
 * Block all access to request credentials when deviceAccess = false
 */
(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_3__.registerActivityControl)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_ACCESS_REQUEST_CREDENTIALS, 'deviceAccess config', deviceAccessRule);

/**
 * By default, deny bidders accessDevice unless they enable it through bidderSettings
 *
 * // TODO: for backwards compat, the check is done on the adapter - rather than bidder's code.
 */
function storageAllowedRule(params, bs = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__.bidderSettings) {
  if (params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_TYPE] !== _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER) return;
  let allow = bs.get(params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_ADAPTER_CODE], 'storageAllowed');
  if (!allow || allow === true) {
    allow = !!allow;
  } else {
    const storageType = params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_TYPE];
    allow = Array.isArray(allow) ? allow.some(e => e === storageType) : allow === storageType;
  }
  if (!allow) {
    return {
      allow
    };
  }
}
(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_3__.registerActivityControl)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_ACCESS_DEVICE, 'bidderSettings.*.storageAllowed', storageAllowedRule);
function resetData() {
  storageCallbacks = [];
}

/**
 * First party storage use disclosure. Follows the same format as
 * https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/Vendor%20Device%20Storage%20%26%20Operational%20Disclosures.md
 * except that `domain` is omitted.
 */

/**
 * Disclose first party storage use.
 */
const discloseStorageUse = (0,_hook_js__WEBPACK_IMPORTED_MODULE_7__.hook)('sync', (moduleName, disclosure) => {});

/***/ },

/***/ "./src/targeting.js"
/*!**************************!*\
  !*** ./src/targeting.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   targeting: () => (/* binding */ targeting)
/* harmony export */ });
/* unused harmony exports TARGETING_KEYS_ARR, getHighestCpmBidsFromBidPool, sortByDealAndPriceBucketOrDesirability, getGPTSlotsForAdUnits, getAdUnitBidLimitMap, newTargeting */
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _utils_reducers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/reducers.js */ "./src/utils/reducers.js");
/* harmony import */ var _targeting_lock_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./targeting/lock.js */ "./src/targeting/lock.js");
/* harmony import */ var _targeting_filters_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./targeting/filters.js */ "./src/targeting/filters.js");
/* harmony import */ var _utils_desirability_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/desirability.js */ "./src/utils/desirability.js");
/* harmony import */ var _utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/gptTargeting.js */ "./src/utils/gptTargeting.js");












var pbTargetingKeys = [];
const MAX_DFP_KEYLENGTH = 20;
const CFG_ALLOW_TARGETING_KEYS = `targetingControls.allowTargetingKeys`;
const CFG_ADD_TARGETING_KEYS = `targetingControls.addTargetingKeys`;
const TARGETING_KEY_CONFIGURATION_ERROR_MSG = `Only one of "${CFG_ALLOW_TARGETING_KEYS}" or "${CFG_ADD_TARGETING_KEYS}" can be set`;
const TARGETING_KEYS_ARR = Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS).map(key => _constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS[key]);

// If two bids are found for same adUnitCode, we will use the highest one to take part in auction
// This can happen in case of concurrent auctions
// If adUnitBidLimit is set above 0 return top N number of bids
const getHighestCpmBidsFromBidPool = (0,_hook_js__WEBPACK_IMPORTED_MODULE_5__.hook)('sync', function (bidsReceived, winReducer, adUnitBidLimit = 0, hasModified = false, winSorter = _utils_desirability_js__WEBPACK_IMPORTED_MODULE_12__.sortByHighestDesirability) {
  if (!hasModified) {
    const bids = [];
    const dealPrioritization = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('sendBidsControl.dealPrioritization');
    // bucket by adUnitcode
    const buckets = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.groupBy)(bidsReceived, 'adUnitCode');
    // filter top bid for each bucket by bidder
    Object.keys(buckets).forEach(bucketKey => {
      let bucketBids = [];
      const bidsByBidder = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.groupBy)(buckets[bucketKey], 'bidderCode');
      Object.keys(bidsByBidder).forEach(key => {
        bucketBids.push(bidsByBidder[key].reduce(winReducer));
      });
      // if adUnitBidLimit is set, pass top N number bids
      const bidLimit = typeof adUnitBidLimit === 'object' ? adUnitBidLimit[bucketKey] : adUnitBidLimit;
      if (bidLimit) {
        bucketBids = dealPrioritization ? bucketBids.sort(sortByDealAndPriceBucketOrDesirability(true)) : bucketBids.sort(winSorter);
        bids.push(...bucketBids.slice(0, bidLimit));
      } else {
        bucketBids = bucketBids.sort(winSorter);
        bids.push(...bucketBids);
      }
    });
    return bids;
  }
  return bidsReceived;
});

/**
 * A descending sort function that will sort the list of objects based on the following two dimensions:
 *  - bids with a deal are sorted before bids w/o a deal
 *  - then sort bids in each grouping based on the hb_pb value
 * eg: the following list of bids would be sorted like:
 *  [{
 *    "hb_adid": "vwx",
 *    "hb_pb": "28",
 *    "hb_deal": "7747"
 *  }, {
 *    "hb_adid": "jkl",
 *    "hb_pb": "10",
 *    "hb_deal": "9234"
 *  }, {
 *    "hb_adid": "stu",
 *    "hb_pb": "50"
 *  }, {
 *    "hb_adid": "def",
 *    "hb_pb": "2"
 *  }]
 */
function sortByDealAndPriceBucketOrDesirability(useDesirability = false) {
  return function (a, b) {
    if (a.adserverTargeting.hb_deal !== undefined && b.adserverTargeting.hb_deal === undefined) {
      return -1;
    }
    if (a.adserverTargeting.hb_deal === undefined && b.adserverTargeting.hb_deal !== undefined) {
      return 1;
    }

    // assuming both values either have a deal or don't have a deal - sort by the hb_pb param
    if (useDesirability) {
      if (b.desirability && a.desirability) {
        return b.desirability - a.desirability;
      }
      return b.cpm - a.cpm;
    }
    return b.adserverTargeting.hb_pb - a.adserverTargeting.hb_pb;
  };
}

/**
 * Return a map where each code in `adUnitCodes` maps to a list of GPT slots that match it.
 *
 * @param adUnitCodes
 * @param getSlots
 */
function getGPTSlotsForAdUnits(adUnitCodes, getSlots = () => window.googletag.pubads().getSlots()) {
  return getSlots().reduce((auToSlots, slot) => {
    Object.keys(auToSlots).filter((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isAdUnitCodeMatchingSlot)(slot)).forEach(au => auToSlots[au].push(slot));
    return auToSlots;
  }, Object.fromEntries(adUnitCodes.map(au => [au, []])));
}
/* *
  * Returns a map of adUnitCodes to their bid limits. If sendAllBids is disabled, all adUnits will have a bid limit of 0.
  * If sendAllBids is enabled, the bid limit for each adUnit will be determined by the following precedence:
  * 1. The bidLimit property of the adUnit object
  * 2. The bidLimit parameter passed to this function
  * 3. The global sendBidsControl.bidLimit config property
  *
  * @param adUnitCodes
  * @param bidLimit
  */
function getAdUnitBidLimitMap(adUnitCodes, bidLimit) {
  if (!_config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('enableSendAllBids')) return 0;
  const bidLimitConfigValue = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('sendBidsControl.bidLimit');
  const adUnitCodesSet = new Set(adUnitCodes);
  const result = {};
  for (const au of _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__.auctionManager.getAdUnits()) {
    if (adUnitCodesSet.has(au.code)) {
      result[au.code] = au?.bidLimit || bidLimit || bidLimitConfigValue;
    }
  }
  return result;
}
const DEFAULT_HB_VER = '1.17.2';
function newTargeting(auctionManager) {
  const latestAuctionForAdUnit = {};
  function getBidSlots(bid) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isGptPubadsDefined)() || bid?.adId == null) return [];
    return window.googletag.pubads().getSlots().filter(slot => (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_13__.slotHasTargetedAdId)(slot, bid.adId));
  }
  const targeting = {
    setLatestAuctionForAdUnit(adUnitCode, auctionId) {
      latestAuctionForAdUnit[adUnitCode] = auctionId;
    },
    resetPresetTargetingAST(adUnitCode) {
      const adUnitCodes = getAdUnitCodes(adUnitCode);
      adUnitCodes.forEach(function (unit) {
        const astTag = window.apntag.getTag(unit);
        if (astTag && astTag.keywords) {
          const currentKeywords = Object.keys(astTag.keywords);
          const newKeywords = {};
          currentKeywords.forEach(key => {
            if (!pbTargetingKeys.includes(key.toLowerCase())) {
              newKeywords[key] = astTag.keywords[key];
            }
          });
          window.apntag.modifyTag(unit, {
            keywords: newKeywords
          });
        }
      });
    },
    /**
     * Returns all ad server targeting for all ad units.
     * @param adUnitCode
     * @param bidLimit
     * @param bidsReceived - The received bids, defaulting to the result of getBidsReceived().
     * @param [winReducer = getHighestDesirability] - reducer method
     * @param [winSorter = sortByHighestDesirability] - sorter method
     * @return targeting
     */
    getAllTargeting(adUnitCode, bidLimit, bidsReceived, winReducer = _utils_reducers_js__WEBPACK_IMPORTED_MODULE_9__.getHighestDesirability, winSorter = _utils_desirability_js__WEBPACK_IMPORTED_MODULE_12__.sortByHighestDesirability) {
      return computeAllTargeting(adUnitCode, bidLimit, bidsReceived, winReducer, winSorter).flatTargeting;
    },
    updateGPTTargeting(targeting, operation, postUpdate, targetedAdIdsByAdUnit = {}) {
      const resetMap = Object.fromEntries(pbTargetingKeys.map(key => [key, null]));
      Object.entries(getGPTSlotsForAdUnits(Object.keys(targeting))).forEach(([targetId, slots]) => {
        slots.forEach(slot => {
          // now set new targeting keys
          Object.keys(targeting[targetId]).forEach(key => {
            let value = targeting[targetId][key];
            if (typeof value === 'string' && value.indexOf(',') !== -1) {
              // due to the check the array will be formed only if string has ',' else plain string will be assigned as value
              value = value.split(',');
            }
            targeting[targetId][key] = value;
          });
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logMessage)(`Attempting to ${operation} targeting-map for slot: ${slot.getSlotElementId()} with targeting-map:`, targeting[targetId]);
          (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_13__.updateSlotTargetingFromMap)(slot, Object.assign({}, resetMap, targeting[targetId]));
          if (operation === 'set') {
            (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_13__.recordSlotTargeting)(slot, targetedAdIdsByAdUnit[targetId] ?? []);
          }
          if (postUpdate != null) postUpdate(targeting[targetId]);
        });
      });
    },
    presetGPTTargeting(adUnits) {
      if (_config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.presetGPTTargeting') !== false && (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isGptPubadsDefined)()) {
        targeting.updateGPTTargeting(targeting.getAllTargeting(adUnits, 0, []), 'pre-set');
      }
    },
    setTargetingForGPT: (0,_hook_js__WEBPACK_IMPORTED_MODULE_5__.hook)('sync', function (adUnit) {
      const {
        flatTargeting: targetingSet,
        targetedAdIdsByAdUnit
      } = computeAllTargeting(adUnit);
      targeting.updateGPTTargeting(targetingSet, 'set', targetingData => _targeting_lock_js__WEBPACK_IMPORTED_MODULE_10__.lock.lock(targetingData), targetedAdIdsByAdUnit);
      Object.keys(targetingSet).forEach(adUnitCode => {
        Object.keys(targetingSet[adUnitCode]).forEach(targetingKey => {
          if (targetingKey === _constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS.AD_ID) {
            auctionManager.setStatusForBids(targetingSet[adUnitCode][targetingKey], _constants_js__WEBPACK_IMPORTED_MODULE_3__.BID_STATUS.BID_TARGETING_SET);
          }
        });
      });
      targeting.targetingDone(targetingSet);

      // emit event
      _events_js__WEBPACK_IMPORTED_MODULE_4__.emit(_constants_js__WEBPACK_IMPORTED_MODULE_3__.EVENTS.SET_TARGETING, targetingSet);
    }, 'setTargetingForGPT'),
    targetingDone: (0,_hook_js__WEBPACK_IMPORTED_MODULE_5__.hook)('sync', function (targetingSet) {
      return targetingSet;
    }, 'targetingDone'),
    /**
     * Returns top bids for a given adUnit or set of adUnits.
     * @param  adUnitCode adUnitCode or array of adUnitCodes
     * @param  bids - The received bids, defaulting to the result of getBidsReceived().
     * @param  [winReducer = getHighestCpm] - reducer method
     * @param  [winSorter = sortByHighestDesirability] - sorter method
     * @return An array of winning bids.
     */
    getWinningBids(adUnitCode, bids, winReducer = _utils_reducers_js__WEBPACK_IMPORTED_MODULE_9__.getHighestCpm, winSorter = _utils_desirability_js__WEBPACK_IMPORTED_MODULE_12__.sortByHighestDesirability) {
      const bidsReceived = bids || getBidsReceived(winReducer, winSorter);
      const adUnitCodes = getAdUnitCodes(adUnitCode);
      return bidsReceived.filter(bid => adUnitCodes.includes(bid.adUnitCode)).filter(bid => _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__.bidderSettings.get(bid.bidderCode, 'allowZeroCpmBids') === true ? bid.cpm >= 0 : bid.cpm > 0).map(bid => bid.adUnitCode).filter(_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniques).map(adUnitCode => bidsReceived.filter(bid => bid.adUnitCode === adUnitCode ? bid : null).reduce(_utils_reducers_js__WEBPACK_IMPORTED_MODULE_9__.getHighestCpm));
    },
    /**
     * @param  adUnitCodes adUnitCode or array of adUnitCodes
     * Sets targeting for AST
     */
    setTargetingForAst(adUnitCodes) {
      const astTargeting = targeting.getAllTargeting(adUnitCodes);
      try {
        targeting.resetPresetTargetingAST(adUnitCodes);
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logError)('unable to reset targeting for AST' + e);
      }
      Object.keys(astTargeting).forEach(targetId => {
        _targeting_lock_js__WEBPACK_IMPORTED_MODULE_10__.lock.lock(astTargeting[targetId]);
        Object.keys(astTargeting[targetId]).forEach(key => {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logMessage)(`Attempting to set targeting for targetId: ${targetId} key: ${key} value: ${astTargeting[targetId][key]}`);
          // setKeywords supports string and array as value
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isStr)(astTargeting[targetId][key]) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isArray)(astTargeting[targetId][key])) {
            const keywordsObj = {};
            const regex = /pt[0-9]/;
            if (key.search(regex) < 0) {
              keywordsObj[key.toUpperCase()] = astTargeting[targetId][key];
            } else {
              // pt${n} keys should not be uppercased
              keywordsObj[key] = astTargeting[targetId][key];
            }
            window.apntag.setKeywords(targetId, keywordsObj, {
              overrideKeyValue: true
            });
          }
        });
      });
    },
    isApntagDefined() {
      if (window.apntag && (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isFn)(window.apntag.setKeywords)) {
        return true;
      }
    }
  };
  _events_js__WEBPACK_IMPORTED_MODULE_4__.on(_constants_js__WEBPACK_IMPORTED_MODULE_3__.EVENTS.AUCTION_INIT, ({
    adUnitCodes
  }) => {
    targeting.presetGPTTargeting(adUnitCodes);
  });
  _events_js__WEBPACK_IMPORTED_MODULE_4__.on(_constants_js__WEBPACK_IMPORTED_MODULE_3__.EVENTS.BID_WON, bid => {
    const slots = getBidSlots(bid);
    if (slots.length > 0) {
      slots.forEach(slot => _targeting_lock_js__WEBPACK_IMPORTED_MODULE_10__.lock.unlock(slot));
      targeting.presetGPTTargeting([bid.adUnitCode]);
    }
  });
  function getBidsIncludedInBidderTargeting(bids) {
    const alwaysIncludeDeals = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.alwaysIncludeDeals');
    const enableSendAllBids = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('enableSendAllBids');
    return bids.filter(bid => enableSendAllBids || alwaysIncludeDeals && bid.dealId);
  }
  function addBidsToTargeting(includedBids) {
    const standardKeys = TARGETING_KEYS_ARR.slice();
    const allowSendAllBidsTargetingKeys = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.allowSendAllBidsTargetingKeys');
    const alwaysIncludeDeals = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.alwaysIncludeDeals');
    const allowedSendAllBidTargeting = allowSendAllBidsTargetingKeys ? allowSendAllBidsTargetingKeys.map(key => _constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS[key]) : standardKeys;
    return includedBids.reduce((result, bid) => {
      const targetingValue = getTargetingMap(bid, standardKeys.filter(key => typeof bid.adserverTargeting[key] !== 'undefined' && (alwaysIncludeDeals || allowedSendAllBidTargeting.indexOf(key) !== -1)));
      if (targetingValue) {
        result.push({
          [bid.adUnitCode]: targetingValue
        });
      }
      return result;
    }, []);
  }

  /**
   * Returns filtered ad server targeting for custom and allowed keys.
   * @param targeting
   * @param allowedKeys
   * @return filtered targeting
   */
  function getAllowedTargetingKeyValues(targeting, allowedKeys) {
    const defaultKeyring = Object.assign({}, _constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS);
    const defaultKeys = Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS);
    const keyDispositions = {};
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logInfo)(`allowTargetingKeys - allowed keys [ ${allowedKeys.map(k => defaultKeyring[k]).join(', ')} ]`);
    targeting.forEach(adUnit => {
      const adUnitCode = Object.keys(adUnit)[0];
      const keyring = adUnit[adUnitCode];
      const keys = keyring.filter(kvPair => {
        const key = Object.keys(kvPair)[0];
        // check if key is in default keys, if not, it's custom, we won't remove it.
        const isCustom = defaultKeys.filter(defaultKey => key.indexOf(defaultKeyring[defaultKey]) === 0).length === 0;
        // check if key explicitly allowed, if not, we'll remove it.
        const found = isCustom || allowedKeys.find(allowedKey => {
          const allowedKeyName = defaultKeyring[allowedKey];
          // we're looking to see if the key exactly starts with one of our default keys.
          // (which hopefully means it's not custom)
          const found = key.indexOf(allowedKeyName) === 0;
          return found;
        });
        keyDispositions[key] = !found;
        return found;
      });
      adUnit[adUnitCode] = keys;
    });
    const removedKeys = Object.keys(keyDispositions).filter(d => keyDispositions[d]);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logInfo)(`allowTargetingKeys - removed keys [ ${removedKeys.join(', ')} ]`);
    // remove any empty targeting objects, as they're unnecessary.
    const filteredTargeting = targeting.filter(adUnit => {
      const adUnitCode = Object.keys(adUnit)[0];
      const keyring = adUnit[adUnitCode];
      return keyring.length > 0;
    });
    return filteredTargeting;
  }
  function updatePBTargetingKeys(adUnitCode) {
    Object.keys(adUnitCode).forEach(key => {
      adUnitCode[key].forEach(targetKey => {
        const targetKeys = Object.keys(targetKey);
        if (pbTargetingKeys.indexOf(targetKeys[0]) === -1) {
          pbTargetingKeys = targetKeys.concat(pbTargetingKeys);
        }
      });
    });
  }
  function collectTargetedAdIdsByAdUnit(bids) {
    const targetedAdIdsByAdUnit = {};
    bids.forEach(bid => {
      if (bid?.adId == null || bid.adId === '') return;
      if (targetedAdIdsByAdUnit[bid.adUnitCode] == null) {
        targetedAdIdsByAdUnit[bid.adUnitCode] = new Set();
      }
      targetedAdIdsByAdUnit[bid.adUnitCode].add(String(bid.adId));
    });
    return targetedAdIdsByAdUnit;
  }
  function getTargetingLevels(bidsSorted, customKeysByUnit, adUnitCodes) {
    const winners = targeting.getWinningBids(adUnitCodes, bidsSorted);
    const includedBids = getBidsIncludedInBidderTargeting(bidsSorted);
    const targetedAdIdsByAdUnit = collectTargetedAdIdsByAdUnit(winners.concat(includedBids));
    const useAllBidsCustomTargeting = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.allBidsCustomTargeting') === true;
    const targetingLevels = getWinningBidTargeting(winners).concat(addBidsToTargeting(includedBids)).concat(getAdUnitTargeting(adUnitCodes)).concat(getVersionTargeting(adUnitCodes));
    if (useAllBidsCustomTargeting) {
      targetingLevels.push(...getCustomBidTargeting(bidsSorted, customKeysByUnit));
    }
    targetingLevels.forEach(adUnitCode => {
      updatePBTargetingKeys(adUnitCode);
    });
    return {
      targeting: targetingLevels,
      targetedAdIdsByAdUnit
    };
  }

  /**
   * Computes ad server targeting for all ad units, along with the set of ad ids (per ad unit)
   * that were included in that targeting - so they can be recorded onto their GPT slots by
   * `updateGPTTargeting` without relying on shared/mutable state between the two calls.
   * @param adUnitCode
   * @param bidLimit
   * @param bidsReceived - The received bids, defaulting to the result of getBidsReceived().
   * @param [winReducer = getHighestDesirability] - reducer method
   * @param [winSorter = sortByHighestDesirability] - sorter method
   */
  function computeAllTargeting(adUnitCode, bidLimit, bidsReceived, winReducer = _utils_reducers_js__WEBPACK_IMPORTED_MODULE_9__.getHighestDesirability, winSorter = _utils_desirability_js__WEBPACK_IMPORTED_MODULE_12__.sortByHighestDesirability) {
    bidsReceived ||= getBidsReceived(winReducer, winSorter);
    const adUnitCodes = getAdUnitCodes(adUnitCode);
    const adUnitBidLimit = getAdUnitBidLimitMap(adUnitCodes, bidLimit);
    const {
      customKeysByUnit,
      filteredBids
    } = getfilteredBidsAndCustomKeys(adUnitCodes, bidsReceived);
    const bidsSorted = getHighestCpmBidsFromBidPool(filteredBids, winReducer, adUnitBidLimit, undefined, winSorter);
    let {
      targeting,
      targetedAdIdsByAdUnit
    } = getTargetingLevels(bidsSorted, customKeysByUnit, adUnitCodes);
    const defaultKeys = Object.keys(Object.assign({}, _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_TARGETING_KEYS));
    let allowedKeys = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig(CFG_ALLOW_TARGETING_KEYS);
    const addedKeys = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig(CFG_ADD_TARGETING_KEYS);
    if (addedKeys != null && allowedKeys != null) {
      throw new Error(TARGETING_KEY_CONFIGURATION_ERROR_MSG);
    } else if (addedKeys != null) {
      allowedKeys = defaultKeys.concat(addedKeys);
    } else {
      allowedKeys = allowedKeys || defaultKeys;
    }
    if (Array.isArray(allowedKeys) && allowedKeys.length > 0) {
      targeting = getAllowedTargetingKeyValues(targeting, allowedKeys);
    }
    let flatTargeting = flattenTargeting(targeting);
    const auctionKeysThreshold = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.auctionKeyMaxChars');
    if (auctionKeysThreshold) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logInfo)(`Detected 'targetingControls.auctionKeyMaxChars' was active for this auction; set with a limit of ${auctionKeysThreshold} characters.  Running checks on auction keys...`);
      flatTargeting = filterTargetingKeys(flatTargeting, auctionKeysThreshold);
    }
    adUnitCodes.forEach(code => {
      // make sure at least there is a entry per adUnit code in the targetingSet so receivers of SET_TARGETING call's can know what ad units are being invoked
      if (!flatTargeting[code]) {
        flatTargeting[code] = {};
      }
      // do not send just "hb_ver"
      if (Object.keys(flatTargeting[code]).length === 1 && flatTargeting[code][_constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS.VERSION] != null) {
        delete flatTargeting[code][_constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS.VERSION];
      }
    });
    return {
      flatTargeting,
      targetedAdIdsByAdUnit
    };
  }
  function getfilteredBidsAndCustomKeys(adUnitCodes, bidsReceived) {
    const filteredBids = [];
    const customKeysByUnit = {};
    const alwaysIncludeDeals = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.alwaysIncludeDeals');
    const bidTargetingExclusion = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('bidTargetingExclusion');
    const initiallyFilteredBids = bidsReceived.filter(bid => {
      const adUnitIsEligible = adUnitCodes.includes(bid.adUnitCode);
      const cpmAllowed = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__.bidderSettings.get(bid.bidderCode, 'allowZeroCpmBids') === true ? bid.cpm >= 0 : bid.cpm > 0;
      const isPreferredDeal = alwaysIncludeDeals && bid.dealId;
      return adUnitIsEligible && (isPreferredDeal || cpmAllowed);
    });
    initiallyFilteredBids.forEach(bid => {
      let notExcludedByConfig = true;
      if (typeof bidTargetingExclusion === 'function') {
        try {
          notExcludedByConfig = bidTargetingExclusion(bid, initiallyFilteredBids);
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logWarn)(`Error in bidTargetingExclusion function - excluding bid ${bid.bidderCode} [${bid.adUnitCode}]`);
          notExcludedByConfig = false;
        }
      }
      if (notExcludedByConfig) {
        filteredBids.push(bid);
        Object.keys(bid.adserverTargeting).filter(getCustomKeys()).forEach(key => {
          const truncKey = key.substring(0, MAX_DFP_KEYLENGTH);
          const data = customKeysByUnit[bid.adUnitCode] || {};
          const value = [bid.adserverTargeting[key]];
          if (data[truncKey]) {
            data[truncKey] = data[truncKey].concat(value).filter(_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniques);
          } else {
            data[truncKey] = value;
          }
          customKeysByUnit[bid.adUnitCode] = data;
        });
      }
    });
    return {
      filteredBids,
      customKeysByUnit
    };
  }

  // warn about conflicting configuration
  _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls', function (config) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__["default"])(config, CFG_ALLOW_TARGETING_KEYS) != null && (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__["default"])(config, CFG_ADD_TARGETING_KEYS) != null) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logError)(TARGETING_KEY_CONFIGURATION_ERROR_MSG);
    }
  });

  // create an encoded string variant based on the keypairs of the provided object
  //  - note this will encode the characters between the keys (ie = and &)
  function convertKeysToQueryForm(keyMap) {
    return Object.keys(keyMap).reduce(function (queryString, key) {
      const encodedKeyPair = `${key}%3d${encodeURIComponent(keyMap[key])}%26`;
      queryString += encodedKeyPair;
      return queryString;
    }, '');
  }
  function filterTargetingKeys(targeting, auctionKeysThreshold) {
    // read each targeting.adUnit object and sort the adUnits into a list of adUnitCodes based on priorization setting (eg CPM)
    const targetingCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.deepClone)(targeting);
    const targetingMap = Object.keys(targetingCopy).map(adUnitCode => {
      return {
        adUnitCode,
        adserverTargeting: targetingCopy[adUnitCode]
      };
    }).sort(sortByDealAndPriceBucketOrDesirability());

    // iterate through the targeting based on above list and transform the keys into the query-equivalent and count characters
    return targetingMap.reduce(function (accMap, currMap, index, arr) {
      let adUnitQueryString = convertKeysToQueryForm(currMap.adserverTargeting);

      // for the last adUnit - trim last encoded ampersand from the converted query string
      if (index + 1 === arr.length) {
        adUnitQueryString = adUnitQueryString.slice(0, -3);
      }

      // if under running threshold add to result
      const code = currMap.adUnitCode;
      const querySize = adUnitQueryString.length;
      if (querySize <= auctionKeysThreshold) {
        auctionKeysThreshold -= querySize;
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logInfo)(`AdUnit '${code}' auction keys comprised of ${querySize} characters.  Deducted from running threshold; new limit is ${auctionKeysThreshold}`, targetingCopy[code]);
        accMap[code] = targetingCopy[code];
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logWarn)(`The following keys for adUnitCode '${code}' exceeded the current limit of the 'auctionKeyMaxChars' setting.\nThe key-set size was ${querySize}, the current allotted amount was ${auctionKeysThreshold}.\n`, targetingCopy[code]);
      }
      if (index + 1 === arr.length && Object.keys(accMap).length === 0) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logError)('No auction targeting keys were permitted due to the setting in setConfig(targetingControls.auctionKeyMaxChars).  Please review setup and consider adjusting.');
      }
      return accMap;
    }, {});
  }

  /**
   * Converts targeting array and flattens to make it easily iteratable
   * e.g: Sample input to this function
   * ```
   * [
   *    {
   *      "div-gpt-ad-1460505748561-0": [{"hb_bidder": ["appnexusAst"]}]
   *    },
   *    {
   *      "div-gpt-ad-1460505748561-0": [{"hb_bidder_appnexusAs": ["appnexusAst", "other"]}]
   *    }
   * ]
   * ```
   * Resulting array
   * ```
   * {
   *  "div-gpt-ad-1460505748561-0": {
   *    "hb_bidder": "appnexusAst",
   *    "hb_bidder_appnexusAs": "appnexusAst,other"
   *  }
   * }
   * ```
   *
   * @param targeting
   * @return targeting
   */
  function flattenTargeting(targeting) {
    return targeting.map(targeting => {
      return {
        [Object.keys(targeting)[0]]: targeting[Object.keys(targeting)[0]].map(target => {
          return {
            [Object.keys(target)[0]]: target[Object.keys(target)[0]].join(',')
          };
        }).reduce((p, c) => Object.assign(c, p), {})
      };
    }).reduce(function (accumulator, targeting) {
      var key = Object.keys(targeting)[0];
      accumulator[key] = Object.assign({}, accumulator[key], targeting[key]);
      return accumulator;
    }, {});
  }

  /**
   * normlizes input to a `adUnit.code` array
   * @param  adUnitCode
   * @return AdUnit code array
   */
  function getAdUnitCodes(adUnitCode) {
    if (typeof adUnitCode === 'string') {
      return [adUnitCode];
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isArray)(adUnitCode)) {
      return adUnitCode;
    }
    return auctionManager.getAdUnitCodes() || [];
  }
  function getBidsReceived(winReducer = _utils_reducers_js__WEBPACK_IMPORTED_MODULE_9__.getOldestHighestCpmBid, winSorter = undefined) {
    const bidsReceived = auctionManager.getBidsReceived().reduce((bids, bid) => {
      const bidCacheEnabled = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('useBidCache');
      const filterFunction = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('bidCacheFilterFunction');
      const isBidFromLastAuction = latestAuctionForAdUnit[bid.adUnitCode] === bid.auctionId;
      const filterFunctionResult = bidCacheEnabled && !isBidFromLastAuction && typeof filterFunction === 'function' ? !!filterFunction(bid) : true;
      const cacheFilter = bidCacheEnabled || isBidFromLastAuction;
      const bidFilter = cacheFilter && filterFunctionResult;
      if (bidFilter && (0,_targeting_filters_js__WEBPACK_IMPORTED_MODULE_11__.isBidUsable)(bid)) {
        bid.latestTargetedAuctionId = latestAuctionForAdUnit[bid.adUnitCode];
        bids.push(bid);
      }
      return bids;
    }, []);
    return getHighestCpmBidsFromBidPool(bidsReceived, winReducer, undefined, undefined, winSorter);
  }

  /**
   * Get targeting key value pairs for winning bids.
   * @param winners winning bids
   * @return winning bids targeting
   */
  function getWinningBidTargeting(winners) {
    const standardKeys = getStandardKeys();
    return winners.map(winner => {
      return {
        [winner.adUnitCode]: Object.keys(winner.adserverTargeting).filter(key => typeof winner.sendStandardTargeting === 'undefined' || winner.sendStandardTargeting || standardKeys.indexOf(key) === -1).reduce((acc, key) => {
          const targetingValue = [winner.adserverTargeting[key]];
          const targeting = {
            [key.substring(0, MAX_DFP_KEYLENGTH)]: targetingValue
          };
          if (key === _constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS.DEAL) {
            const bidderCodeTargetingKey = `${key}_${winner.bidderCode}`.substring(0, MAX_DFP_KEYLENGTH);
            const bidderCodeTargeting = {
              [bidderCodeTargetingKey]: targetingValue
            };
            return [...acc, targeting, bidderCodeTargeting];
          }
          return [...acc, targeting];
        }, [])
      };
    });
  }
  function getStandardKeys() {
    return auctionManager.getStandardBidderAdServerTargeting() // in case using a custom standard key set
    .map(targeting => targeting.key).concat(TARGETING_KEYS_ARR).filter(_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniques); // standard keys defined in the library.
  }
  function getCustomKeys() {
    const standardKeys = getStandardKeys();
    return function (key) {
      return standardKeys.indexOf(key) === -1;
    };
  }

  /**
   * Get custom targeting key value pairs for bids.
   * @param {Array<Object>} bidsSorted code array
   * @param {Object} customKeysByUnit code array
   * @return bids with custom targeting defined in bidderSettings
   */
  function getCustomBidTargeting(bidsSorted, customKeysByUnit) {
    return bidsSorted.reduce((acc, bid) => {
      const newBid = Object.assign({}, bid);
      const customKeysForUnit = customKeysByUnit[newBid.adUnitCode];
      const targeting = [];
      if (customKeysForUnit) {
        Object.keys(customKeysForUnit).forEach(key => {
          if (key && customKeysForUnit[key]) targeting.push({
            [key]: customKeysForUnit[key]
          });
        });
      }
      acc.push({
        [newBid.adUnitCode]: targeting
      });
      return acc;
    }, []);
  }
  function getTargetingMap(bid, keys) {
    return keys.reduce((targeting, key) => {
      const value = bid.adserverTargeting[key];
      if (value) {
        targeting.push({
          [`${key}_${bid.bidderCode}`.substring(0, MAX_DFP_KEYLENGTH)]: [bid.adserverTargeting[key]]
        });
      }
      return targeting;
    }, []);
  }
  function getVersionTargeting(adUnitCodes) {
    let version = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('targetingControls.version');
    if (version === false) return [];
    return adUnitCodes.map(au => ({
      [au]: [{
        [_constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETING_KEYS.VERSION]: [version ?? DEFAULT_HB_VER]
      }]
    }));
  }
  function getAdUnitTargeting(adUnitCodes) {
    function getTargetingObj(adUnit) {
      return adUnit?.[_constants_js__WEBPACK_IMPORTED_MODULE_3__.JSON_MAPPING.ADSERVER_TARGETING];
    }
    function getTargetingValues(adUnit) {
      const aut = getTargetingObj(adUnit);
      return Object.keys(aut).map(function (key) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isStr)(aut[key])) aut[key] = aut[key].split(',').map(s => s.trim());
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isArray)(aut[key])) aut[key] = [aut[key]];
        return {
          [key]: aut[key]
        };
      });
    }
    return auctionManager.getAdUnits().filter(adUnit => adUnitCodes.includes(adUnit.code) && getTargetingObj(adUnit)).reduce((result, adUnit) => {
      const targetingValues = getTargetingValues(adUnit);
      if (targetingValues) result.push({
        [adUnit.code]: targetingValues
      });
      return result;
    }, []);
  }
  return targeting;
}
const targeting = newTargeting(_auctionManager_js__WEBPACK_IMPORTED_MODULE_0__.auctionManager);

/***/ },

/***/ "./src/targeting/filters.js"
/*!**********************************!*\
  !*** ./src/targeting/filters.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bidFilters: () => (/* binding */ bidFilters),
/* harmony export */   isBidUsable: () => (/* binding */ isBidUsable)
/* harmony export */ });
/* harmony import */ var _bidTTL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../bidTTL.js */ "./src/bidTTL.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _lock_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lock.js */ "./src/targeting/lock.js");





// return unexpired bids
const isBidNotExpired = bid => bid.responseTimestamp + (0,_bidTTL_js__WEBPACK_IMPORTED_MODULE_0__.getBufferedTTL)(bid) * 1000 > (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.timestamp)();

// return bids whose status is not set. Winning bids can only have a status of `rendered`.
const isUnusedBid = bid => bid && (bid.status && ![_constants_js__WEBPACK_IMPORTED_MODULE_1__.BID_STATUS.RENDERED].includes(bid.status) || !bid.status);
const isBidNotLocked = bid => !_lock_js__WEBPACK_IMPORTED_MODULE_3__.lock.isLocked(bid.adserverTargeting);
const bidFilters = {
  isBidNotExpired,
  isUnusedBid,
  isBidNotLocked
};
function isBidUsable(bid) {
  return !Object.values(bidFilters).some(predicate => !predicate(bid));
}

/***/ },

/***/ "./src/targeting/lock.js"
/*!*******************************!*\
  !*** ./src/targeting/lock.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lock: () => (/* binding */ lock)
/* harmony export */ });
/* unused harmony export targetingLock */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ttlCollection.js */ "./src/utils/ttlCollection.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/gptTargeting.js */ "./src/utils/gptTargeting.js");




const DEFAULT_LOCK_TIMEOUT = 3000;
function targetingLock() {
  let timeout, keys;
  let locked = (0,_utils_ttlCollection_js__WEBPACK_IMPORTED_MODULE_1__.ttlCollection)({
    monotonic: true,
    ttl: () => timeout,
    slack: 0
  });
  _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('targetingControls', cfg => {
    ({
      lock: keys,
      lockTimeout: timeout = DEFAULT_LOCK_TIMEOUT
    } = cfg.targetingControls ?? {});
    if (keys != null && !Array.isArray(keys)) {
      keys = [keys];
    } else if (keys == null) {
      tearDownGpt();
    }
    locked.clear();
  });
  function unlock(slot) {
    keys?.forEach(key => (0,_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_3__.getSlotTargeting)(slot, key)?.forEach(locked.delete));
  }
  const [setupGpt, tearDownGpt] = (() => {
    let enabled = false;
    function onGptRender({
      slot
    }) {
      unlock(slot);
    }
    return [() => {
      if (keys != null && !enabled && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isGptPubadsDefined)()) {
        googletag.pubads().addEventListener?.('slotRenderEnded', onGptRender);
        enabled = true;
      }
    }, () => {
      if (enabled && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isGptPubadsDefined)()) {
        googletag.pubads().removeEventListener?.('slotRenderEnded', onGptRender);
        enabled = false;
      }
    }];
  })();
  return {
    isLocked(targeting) {
      return keys?.some(key => targeting[key] != null && locked.has(targeting[key])) ?? false;
    },
    lock(targeting) {
      setupGpt();
      keys?.forEach(key => targeting[key] != null && locked.add(targeting[key]));
    },
    unlock
  };
}
const lock = targetingLock();

/***/ },

/***/ "./src/userSync.js"
/*!*************************!*\
  !*** ./src/userSync.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   userSync: () => (/* binding */ userSync)
/* harmony export */ });
/* unused harmony exports USERSYNC_DEFAULT_CONFIG, browserSupportsUserSyncCookies, newUserSync */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_params_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./activities/activityParams.js */ "./src/activities/activityParams.js");








const USERSYNC_DEFAULT_CONFIG = {
  syncEnabled: true,
  filterSettings: {
    image: {
      bidders: '*',
      filter: 'include'
    }
  },
  syncsPerBidder: 5,
  syncDelay: 3000,
  auctionDelay: 500,
  usePoliteSync: false
};

// Set userSync default values
_config_js__WEBPACK_IMPORTED_MODULE_2__.config.setDefaults({
  'userSync': (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(USERSYNC_DEFAULT_CONFIG)
});
const storage = (0,_storageManager_js__WEBPACK_IMPORTED_MODULE_3__.getCoreStorageManager)('usersync');
function browserSupportsUserSyncCookies() {
  return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isSafariBrowser)() && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFirefoxBrowser)() && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isChromeIOSBrowser)() && storage.cookiesAreEnabled();
}

/**
 * Factory function which creates a new UserSyncPool.
 *
 * @param {} deps Configuration options and dependencies which the
 *   UserSync object needs in order to behave properly.
 */
function newUserSync(deps) {
  const publicApi = {};
  // A queue of user syncs for each adapter
  // Let getDefaultQueue() set the defaults
  let queue = getDefaultQueue();

  // Whether or not user syncs have been trigger on this page load for a specific bidder
  const hasFiredBidder = new Set();
  // How many bids for each adapter
  let numAdapterBids = {};

  // for now - default both to false in case filterSettings config is absent/misconfigured
  const permittedPixels = {
    image: true,
    iframe: false
  };

  // Use what is in config by default
  let usConfig = deps.config;
  // Update if it's (re)set
  _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('userSync', conf => {
    // Added this logic for https://github.com/prebid/Prebid.js/issues/4864
    // if userSync.filterSettings does not contain image/all configs, merge in default image config to ensure image pixels are fired
    if (conf.userSync) {
      const fs = conf.userSync.filterSettings;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(fs)) {
        if (!fs.image && !fs.all) {
          conf.userSync.filterSettings.image = {
            bidders: '*',
            filter: 'include'
          };
        }
      }
    }
    usConfig = Object.assign(usConfig, conf.userSync);
  });
  deps.regRule(_activities_activities_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_SYNC_USER, 'userSync config', params => {
    if (!usConfig.syncEnabled) {
      return {
        allow: false,
        reason: 'syncs are disabled'
      };
    }
    if (params[_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_TYPE] === _activities_modules_js__WEBPACK_IMPORTED_MODULE_7__.MODULE_TYPE_BIDDER) {
      const syncType = params[_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_SYNC_TYPE];
      const bidder = params[_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_NAME];
      if (!publicApi.canBidderRegisterSync(syncType, bidder)) {
        return {
          allow: false,
          reason: `${syncType} syncs are not enabled for ${bidder}`
        };
      }
    }
  });

  /**
   * @function getDefaultQueue
   * @summary Returns the default empty queue
   * @private
   * @return {object} A queue with no syncs
   */
  function getDefaultQueue() {
    return {
      image: [],
      iframe: []
    };
  }

  /**
   * @function fireSyncs
   * @summary Trigger all user syncs in the queue
   * @private
   */
  function fireSyncs() {
    if (!usConfig.syncEnabled || !deps.browserSupportsCookies) {
      return;
    }
    try {
      // Iframe syncs
      loadIframes();
      // Image pixels
      fireImagePixels();
    } catch (e) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Error firing user syncs', e);
    }
    // Reset the user sync queue
    queue = getDefaultQueue();
  }
  function forEachFire(queue, fn) {
    // Randomize the order of the pixels before firing
    // This is to avoid giving any bidder who has registered multiple syncs
    // any preferential treatment and balancing them out
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.shuffle)(queue).forEach(fn);
  }

  /**
   * @function fireImagePixels
   * @summary Loops through user sync pixels and fires each one
   * @private
   */
  function fireImagePixels() {
    if (!permittedPixels.image) {
      return;
    }
    forEachFire(queue.image, sync => {
      const [bidderName, trackingPixelUrl] = sync;
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`Invoking image pixel user sync for bidder: ${bidderName}`);
      if (usConfig.usePoliteSync) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.politeTriggerPixel)(trackingPixelUrl);
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.triggerPixel)(trackingPixelUrl);
      }
    });
  }

  /**
   * @function loadIframes
   * @summary Loops through iframe syncs and loads an iframe element into the page
   * @private
   */
  function loadIframes() {
    if (!permittedPixels.iframe) {
      return;
    }
    forEachFire(queue.iframe, sync => {
      const [bidderName, iframeUrl, onCleanup] = sync;
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`Invoking iframe user sync for bidder: ${bidderName}`);
      if (usConfig.usePoliteSync) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.politeInsertUserSyncIframe)(iframeUrl, undefined, undefined, onCleanup);
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.insertUserSyncIframe)(iframeUrl, undefined, undefined, onCleanup);
      }
      // for a bidder, if iframe sync is present then remove image pixel
      removeImagePixelsForBidder(queue, bidderName);
    });
  }
  function removeImagePixelsForBidder(queue, iframeSyncBidderName) {
    queue.image = queue.image.filter(imageSync => {
      const imageSyncBidderName = imageSync[0];
      return imageSyncBidderName !== iframeSyncBidderName;
    });
  }

  /**
   * @function incrementAdapterBids
   * @summary Increment the count of user syncs queue for the adapter
   * @private
   * @param {object} numAdapterBids The object contain counts for all adapters
   * @param {string} bidder The name of the bidder adding a sync
   * @returns {object} The updated version of numAdapterBids
   */
  function incrementAdapterBids(numAdapterBids, bidder) {
    if (!numAdapterBids[bidder]) {
      numAdapterBids[bidder] = 1;
    } else {
      numAdapterBids[bidder] += 1;
    }
    return numAdapterBids;
  }

  /**
   * @function registerSync
   * @summary Add sync for this bidder to a queue to be fired later
   * @public
   * @param {string} type The type of the sync including image, iframe
   * @param {string} bidder The name of the adapter. e.g. "rubicon"
   * @param {string} url Either the pixel url or iframe url depending on the type
   * @param {function} [onCleanup] releases work associated with an iframe when it is removed
   * @example <caption>Using Image Sync</caption>
   * // registerSync(type, adapter, pixelUrl)
   * userSync.registerSync('image', 'rubicon', 'http://example.com/pixel')
   */
  publicApi.registerSync = (type, bidder, url, onCleanup) => {
    if (hasFiredBidder.has(bidder)) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`already fired syncs for "${bidder}", ignoring registerSync call`);
    }
    if (!usConfig.syncEnabled || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(queue[type])) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`User sync type "${type}" not supported`);
    }
    if (!bidder) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Bidder is required for registering sync`);
    }
    if (usConfig.syncsPerBidder !== 0 && Number(numAdapterBids[bidder]) >= usConfig.syncsPerBidder) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Number of user syncs exceeded for "${bidder}"`);
    }
    if (deps.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_SYNC_USER, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_8__.activityParams)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_7__.MODULE_TYPE_BIDDER, bidder, {
      [_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_SYNC_TYPE]: type,
      [_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_SYNC_URL]: url
    }))) {
      // the bidder's pixel has passed all checks and is allowed to register
      queue[type].push([bidder, url, onCleanup]);
      numAdapterBids = incrementAdapterBids(numAdapterBids, bidder);
    }
  };

  /**
   * Mark a bidder as done with its user syncs - no more will be accepted from them in this session.
   * @param {string} bidderCode
   */
  publicApi.bidderDone = hasFiredBidder.add.bind(hasFiredBidder);

  /**
   * @function shouldBidderBeBlocked
   * @summary Check filterSettings logic to determine if the bidder should be prevented from registering their userSync tracker
   * @private
   * @param {string} type The type of the sync; either image or iframe
   * @param {string} bidder The name of the adapter. e.g. "rubicon"
   * @returns {boolean} true => bidder is not allowed to register; false => bidder can register
   */
  function shouldBidderBeBlocked(type, bidder) {
    const filterConfig = usConfig.filterSettings;

    // apply the filter check if the config object is there (eg filterSettings.iframe exists) and if the config object is properly setup
    if (isFilterConfigValid(filterConfig, type)) {
      permittedPixels[type] = true;
      const activeConfig = filterConfig.all ? filterConfig.all : filterConfig[type];
      const biddersToFilter = activeConfig.bidders === '*' ? [bidder] : activeConfig.bidders;
      const filterType = activeConfig.filter || 'include'; // set default if undefined

      // return true if the bidder is either: not part of the include (ie outside the whitelist) or part of the exclude (ie inside the blacklist)
      const checkForFiltering = {
        'include': (bidders, bidder) => !bidders.includes(bidder),
        'exclude': (bidders, bidder) => bidders.includes(bidder)
      };
      return checkForFiltering[filterType](biddersToFilter, bidder);
    }
    return !permittedPixels[type];
  }

  /**
   * @function isFilterConfigValid
   * @summary Check if the filterSettings object in the userSync config is setup properly
   * @private
   * @param {object} filterConfig sub-config object taken from filterSettings
   * @param {string} type The type of the sync; either image or iframe
   * @returns {boolean} true => config is setup correctly, false => setup incorrectly or filterConfig[type] is not present
   */
  function isFilterConfigValid(filterConfig, type) {
    if (filterConfig.all && filterConfig[type]) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Detected presence of the "filterSettings.all" and "filterSettings.${type}" in userSync config.  You cannot mix "all" with "iframe/image" configs; they are mutually exclusive.`);
      return false;
    }
    const activeConfig = filterConfig.all ? filterConfig.all : filterConfig[type];
    const activeConfigName = filterConfig.all ? 'all' : type;

    // if current pixel type isn't part of the config's logic, skip rest of the config checks...
    // we return false to skip subsequent filter checks in shouldBidderBeBlocked() function
    if (!activeConfig) {
      return false;
    }
    const filterField = activeConfig.filter;
    const biddersField = activeConfig.bidders;
    if (filterField && filterField !== 'include' && filterField !== 'exclude') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`UserSync "filterSettings.${activeConfigName}.filter" setting '${filterField}' is not a valid option; use either 'include' or 'exclude'.`);
      return false;
    }
    if (biddersField !== '*' && !(Array.isArray(biddersField) && biddersField.length > 0 && biddersField.every(bidderInList => (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(bidderInList) && bidderInList !== '*'))) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Detected an invalid setup in userSync "filterSettings.${activeConfigName}.bidders"; use either '*' (to represent all bidders) or an array of bidders.`);
      return false;
    }
    return true;
  }

  /**
   * @function syncUsers
   * @summary Trigger all the user syncs based on publisher-defined timeout
   * @public
   * @param {number} timeout The delay in ms before syncing data - default 0
   */
  publicApi.syncUsers = (timeout = 0) => {
    if (timeout) {
      return setTimeout(fireSyncs, Number(timeout));
    }
    fireSyncs();
  };

  /**
   * @function triggerUserSyncs
   * @summary A `syncUsers` wrapper for determining if enableOverride has been turned on
   * @public
   */
  publicApi.triggerUserSyncs = () => {
    if (usConfig.enableOverride) {
      publicApi.syncUsers();
    }
  };
  publicApi.removeUserSyncs = () => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.removeUserSyncIframes)();
  publicApi.canBidderRegisterSync = (type, bidder) => {
    if (usConfig.filterSettings) {
      if (shouldBidderBeBlocked(type, bidder)) {
        return false;
      }
    }
    return true;
  };
  return publicApi;
}
const userSync = newUserSync(Object.defineProperties({
  config: _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('userSync'),
  isAllowed: _activities_rules_js__WEBPACK_IMPORTED_MODULE_4__.isActivityAllowed,
  regRule: _activities_rules_js__WEBPACK_IMPORTED_MODULE_4__.registerActivityControl
}, {
  browserSupportsCookies: {
    get: function () {
      // call storage lazily to give time for consent data to be available
      return browserSupportsUserSyncCookies();
    }
  }
}));

/**
 * @typedef {Object} UserSyncConfig
 *
 * @property {boolean} enableOverride
 * @property {boolean} syncEnabled
 * @property {number} syncsPerBidder
 * @property {string[]} enabledBidders
 * @property {Object} filterSettings
 */

/***/ },

/***/ "./src/utils.js"
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _each: () => (/* binding */ _each),
/* harmony export */   _map: () => (/* binding */ _map),
/* harmony export */   binarySearch: () => (/* binding */ binarySearch),
/* harmony export */   buildUrl: () => (/* binding */ buildUrl),
/* harmony export */   canAccessWindowTop: () => (/* binding */ canAccessWindowTop),
/* harmony export */   checkCookieSupport: () => (/* binding */ checkCookieSupport),
/* harmony export */   cleanObj: () => (/* binding */ cleanObj),
/* harmony export */   compareCodeAndSlot: () => (/* binding */ compareCodeAndSlot),
/* harmony export */   compressDataWithGZip: () => (/* binding */ compressDataWithGZip),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   convertObjectToArray: () => (/* binding */ convertObjectToArray),
/* harmony export */   createIframe: () => (/* binding */ createIframe),
/* harmony export */   createInvisibleIframe: () => (/* binding */ createInvisibleIframe),
/* harmony export */   createTrackPixelHtml: () => (/* binding */ createTrackPixelHtml),
/* harmony export */   cyrb53Hash: () => (/* binding */ cyrb53Hash),
/* harmony export */   debugTurnedOn: () => (/* binding */ debugTurnedOn),
/* harmony export */   deepAccess: () => (/* reexport safe */ dlv_index_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   deepClone: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.deepClone),
/* harmony export */   deepEqual: () => (/* binding */ deepEqual),
/* harmony export */   deepSetValue: () => (/* reexport safe */ dset__WEBPACK_IMPORTED_MODULE_6__.dset),
/* harmony export */   delayExecution: () => (/* binding */ delayExecution),
/* harmony export */   encodeMacroURI: () => (/* binding */ encodeMacroURI),
/* harmony export */   extractDomainFromHost: () => (/* binding */ extractDomainFromHost),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   formatQS: () => (/* binding */ formatQS),
/* harmony export */   generateUUID: () => (/* binding */ generateUUID),
/* harmony export */   getBidIdParameter: () => (/* binding */ getBidIdParameter),
/* harmony export */   getBidRequest: () => (/* binding */ getBidRequest),
/* harmony export */   getBidderCodes: () => (/* binding */ getBidderCodes),
/* harmony export */   getDefinedParams: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.getDefinedParams),
/* harmony export */   getDocument: () => (/* binding */ getDocument),
/* harmony export */   getDomLoadingDuration: () => (/* binding */ getDomLoadingDuration),
/* harmony export */   getFallbackWindow: () => (/* binding */ getFallbackWindow),
/* harmony export */   getParameterByName: () => (/* binding */ getParameterByName),
/* harmony export */   getPerformanceNow: () => (/* binding */ getPerformanceNow),
/* harmony export */   getPrebidInternal: () => (/* binding */ getPrebidInternal),
/* harmony export */   getSafeframeGeometry: () => (/* binding */ getSafeframeGeometry),
/* harmony export */   getScreenOrientation: () => (/* reexport safe */ _utils_winDimensions_js__WEBPACK_IMPORTED_MODULE_7__.getScreenOrientation),
/* harmony export */   getUniqueIdentifierStr: () => (/* binding */ getUniqueIdentifierStr),
/* harmony export */   getUnixTimestampFromNow: () => (/* binding */ getUnixTimestampFromNow),
/* harmony export */   getUserConfiguredParams: () => (/* binding */ getUserConfiguredParams),
/* harmony export */   getValue: () => (/* binding */ getValue),
/* harmony export */   getWinDimensions: () => (/* reexport safe */ _utils_winDimensions_js__WEBPACK_IMPORTED_MODULE_7__.getWinDimensions),
/* harmony export */   getWindowLocation: () => (/* binding */ getWindowLocation),
/* harmony export */   getWindowSelf: () => (/* binding */ getWindowSelf),
/* harmony export */   getWindowTop: () => (/* binding */ getWindowTop),
/* harmony export */   groupBy: () => (/* binding */ groupBy),
/* harmony export */   hasDeviceAccess: () => (/* binding */ hasDeviceAccess),
/* harmony export */   hasNonSerializableProperty: () => (/* binding */ hasNonSerializableProperty),
/* harmony export */   inIframe: () => (/* binding */ inIframe),
/* harmony export */   insertElement: () => (/* binding */ insertElement),
/* harmony export */   insertHtmlIntoIframe: () => (/* binding */ insertHtmlIntoIframe),
/* harmony export */   insertUserSyncIframe: () => (/* binding */ insertUserSyncIframe),
/* harmony export */   internal: () => (/* binding */ internal),
/* harmony export */   isAdUnitCodeMatchingSlot: () => (/* binding */ isAdUnitCodeMatchingSlot),
/* harmony export */   isApnGetTagDefined: () => (/* binding */ isApnGetTagDefined),
/* harmony export */   isArray: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isArray),
/* harmony export */   isArrayOfNums: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isArrayOfNums),
/* harmony export */   isBoolean: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isBoolean),
/* harmony export */   isChromeIOSBrowser: () => (/* binding */ isChromeIOSBrowser),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   isEmptyStr: () => (/* binding */ isEmptyStr),
/* harmony export */   isFirefoxBrowser: () => (/* binding */ isFirefoxBrowser),
/* harmony export */   isFn: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn),
/* harmony export */   isGptPubadsDefined: () => (/* binding */ isGptPubadsDefined),
/* harmony export */   isGzipCompressionSupported: () => (/* binding */ isGzipCompressionSupported),
/* harmony export */   isInteger: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isInteger),
/* harmony export */   isNumber: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isNumber),
/* harmony export */   isPlainObject: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject),
/* harmony export */   isSafariBrowser: () => (/* binding */ isSafariBrowser),
/* harmony export */   isSafeFrameWindow: () => (/* binding */ isSafeFrameWindow),
/* harmony export */   isStr: () => (/* reexport safe */ _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isStr),
/* harmony export */   isValidMediaTypes: () => (/* binding */ isValidMediaTypes),
/* harmony export */   logError: () => (/* binding */ logError),
/* harmony export */   logInfo: () => (/* binding */ logInfo),
/* harmony export */   logMessage: () => (/* binding */ logMessage),
/* harmony export */   logWarn: () => (/* binding */ logWarn),
/* harmony export */   memoize: () => (/* binding */ memoize),
/* harmony export */   mergeDeep: () => (/* binding */ mergeDeep),
/* harmony export */   parseGPTSingleSizeArray: () => (/* binding */ parseGPTSingleSizeArray),
/* harmony export */   parseGPTSingleSizeArrayToRtbSize: () => (/* binding */ parseGPTSingleSizeArrayToRtbSize),
/* harmony export */   parseQS: () => (/* binding */ parseQS),
/* harmony export */   parseQueryStringParameters: () => (/* binding */ parseQueryStringParameters),
/* harmony export */   parseSizesInput: () => (/* binding */ parseSizesInput),
/* harmony export */   parseUrl: () => (/* binding */ parseUrl),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   politeInsertUserSyncIframe: () => (/* binding */ politeInsertUserSyncIframe),
/* harmony export */   politeTriggerPixel: () => (/* binding */ politeTriggerPixel),
/* harmony export */   prefixLog: () => (/* binding */ prefixLog),
/* harmony export */   removeUserSyncIframes: () => (/* binding */ removeUserSyncIframes),
/* harmony export */   replaceAuctionPrice: () => (/* binding */ replaceAuctionPrice),
/* harmony export */   replaceClickThrough: () => (/* binding */ replaceClickThrough),
/* harmony export */   replaceMacros: () => (/* binding */ replaceMacros),
/* harmony export */   resetWinDimensions: () => (/* reexport safe */ _utils_winDimensions_js__WEBPACK_IMPORTED_MODULE_7__.resetWinDimensions),
/* harmony export */   runBackgroundTask: () => (/* binding */ runBackgroundTask),
/* harmony export */   safeJSONEncode: () => (/* binding */ safeJSONEncode),
/* harmony export */   safeJSONParse: () => (/* binding */ safeJSONParse),
/* harmony export */   setOnAny: () => (/* binding */ setOnAny),
/* harmony export */   setScriptAttributes: () => (/* binding */ setScriptAttributes),
/* harmony export */   shuffle: () => (/* binding */ shuffle),
/* harmony export */   sizeTupleToRtbSize: () => (/* binding */ sizeTupleToRtbSize),
/* harmony export */   sizeTupleToSizeString: () => (/* binding */ sizeTupleToSizeString),
/* harmony export */   sizesToSizeTuples: () => (/* binding */ sizesToSizeTuples),
/* harmony export */   sortByHighestCpm: () => (/* binding */ sortByHighestCpm),
/* harmony export */   timestamp: () => (/* binding */ timestamp),
/* harmony export */   transformAdServerTargetingObj: () => (/* binding */ transformAdServerTargetingObj),
/* harmony export */   triggerNurlWithCpm: () => (/* binding */ triggerNurlWithCpm),
/* harmony export */   triggerPixel: () => (/* binding */ triggerPixel),
/* harmony export */   uniques: () => (/* binding */ uniques),
/* harmony export */   unsupportedBidderMessage: () => (/* binding */ unsupportedBidderMessage),
/* harmony export */   waitForElementToLoad: () => (/* binding */ waitForElementToLoad)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var dlv_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dlv/index.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/objects.js */ "./src/utils/objects.js");
/* harmony import */ var _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/logging.js */ "./src/utils/logging.js");
/* harmony import */ var _utils_debug_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/debug.js */ "./src/utils/debug.js");
/* harmony import */ var dset__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dset */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _utils_winDimensions_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/winDimensions.js */ "./src/utils/winDimensions.js");











// many tests stub out these methods, which does not work if we use `export from` - hence the roundabout rebinding
const logInfo = _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__.logInfo;
const logWarn = _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__.logWarn;
const logError = _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__.logError;
const logMessage = _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__.logMessage;
const prefixLog = _utils_logging_js__WEBPACK_IMPORTED_MODULE_4__.prefixLog;
const debugTurnedOn = _utils_debug_js__WEBPACK_IMPORTED_MODULE_5__.debugTurnedOn;

// this allows stubbing of utility functions that are used internally by other utility functions
const internal = {
  checkCookieSupport,
  getWindowSelf,
  getWindowTop,
  canAccessWindowTop,
  getWindowLocation,
  insertUserSyncIframe,
  insertElement,
  isFn: _utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn,
  triggerPixel,
  logError,
  logWarn,
  logMessage,
  logInfo,
  parseQS,
  formatQS,
  deepEqual,
  runBackgroundTask
};
const prebidInternal = {};
/**
 * Returns object that is used as internal prebid namespace
 */
function getPrebidInternal() {
  return prebidInternal;
}

/* utility method to get incremental integer starting from 1 */
var getIncrementalInteger = function () {
  var count = 0;
  return function () {
    count++;
    return count;
  };
}();

// generate a random string (to be used as a dynamic JSONP callback)
function getUniqueIdentifierStr() {
  return getIncrementalInteger() + Math.random().toString(16).substring(2);
}

/**
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 * https://gist.github.com/jed/982883 via node-uuid
 */
function generateUUID(placeholder) {
  return placeholder ? (placeholder ^ _getRandomData() >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

/**
 * Returns random data using the Crypto API if available and Math.random if not
 * Method is from https://gist.github.com/jed/982883 like generateUUID, direct link https://gist.github.com/jed/982883#gistcomment-45104
 */
function _getRandomData() {
  if (window && window.crypto && window.crypto.getRandomValues) {
    return window.crypto.getRandomValues(new Uint8Array(1))[0] % 16;
  } else {
    return Math.random() * 16;
  }
}
function getBidIdParameter(key, paramsObj) {
  return paramsObj?.[key] || '';
}

// parse a query string object passed in bid params
// bid params should be an object such as {key: "value", key1 : "value1"}
// aliases to formatQS
function parseQueryStringParameters(queryObj) {
  let result = '';
  for (var k in queryObj) {
    if (queryObj.hasOwnProperty(k)) {
      result += k + '=' + encodeURIComponent(queryObj[k]) + '&';
    }
  }
  result = result.replace(/&$/, '');
  return result;
}

// transform an AdServer targeting bids into a query string to send to the adserver
function transformAdServerTargetingObj(targeting) {
  // we expect to receive targeting for a single slot at a time
  if (targeting && Object.getOwnPropertyNames(targeting).length > 0) {
    return Object.keys(targeting).map(key => `${key}=${encodeURIComponent(targeting[key])}`).join('&');
  } else {
    return '';
  }
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of width, height tuples `[[300, 250]]` or '[[300,250], [970,90]]'
 */
function sizesToSizeTuples(sizes) {
  if (typeof sizes === 'string') {
    // multiple sizes will be comma-separated
    return sizes.split(/\s*,\s*/).map(sz => sz.match(/^(\d+)x(\d+)$/i)).filter(match => match).map(([_, w, h]) => [parseInt(w, 10), parseInt(h, 10)]);
  } else if (Array.isArray(sizes)) {
    if (isValidGPTSingleSize(sizes)) {
      return [sizes];
    }
    return sizes.filter(isValidGPTSingleSize);
  }
  return [];
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of sizes `["300x250"]` or '['300x250', '970x90']'
 * @param  {(Array.<number[]>|Array.<number>)} sizeObj Input array or double array [300,250] or [[300,250], [728,90]]
 * @return {Array.<string>}  Array of strings like `["300x250"]` or `["300x250", "728x90"]`
 */
function parseSizesInput(sizeObj) {
  return sizesToSizeTuples(sizeObj).map(sizeTupleToSizeString);
}
function sizeTupleToSizeString(size) {
  return size[0] + 'x' + size[1];
}

// Parse a GPT style single size array, (i.e [300, 250])
// into an AppNexus style string, (i.e. 300x250)
function parseGPTSingleSizeArray(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return sizeTupleToSizeString(singleSize);
  }
}
function sizeTupleToRtbSize(size) {
  return {
    w: size[0],
    h: size[1]
  };
}

// Parse a GPT style single size array, (i.e [300, 250])
// into OpenRTB-compatible (imp.banner.w/h, imp.banner.format.w/h, imp.video.w/h) object(i.e. {w:300, h:250})
function parseGPTSingleSizeArrayToRtbSize(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return sizeTupleToRtbSize(singleSize);
  }
}
function isValidGPTSingleSize(singleSize) {
  // if we aren't exactly 2 items in this array, it is invalid
  return (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(singleSize) && singleSize.length === 2 && !isNaN(singleSize[0]) && !isNaN(singleSize[1]);
}
function getWindowTop() {
  return window.top;
}
function getWindowSelf() {
  return window.self;
}
function getWindowLocation() {
  return window.location;
}
function getDocument() {
  return document;
}
function canAccessWindowTop() {
  try {
    if (internal.getWindowTop().location.href) {
      return true;
    }
  } catch (e) {
    return false;
  }
}

/**
 * Returns the window to use for fingerprinting reads: win if provided, otherwise top or self.
 * @param {Window} [win]
 * @returns {Window}
 */
function getFallbackWindow(win) {
  if (win) {
    return win;
  }
  return canAccessWindowTop() ? internal.getWindowTop() : internal.getWindowSelf();
}
const createIframe = (() => {
  const DEFAULTS = {
    border: '0px',
    hspace: '0',
    vspace: '0',
    marginWidth: '0',
    marginHeight: '0',
    scrolling: 'no',
    frameBorder: '0',
    allowtransparency: 'true'
  };
  return (doc, attrs, style = {}) => {
    const f = doc.createElement('iframe');
    Object.assign(f, Object.assign({}, DEFAULTS, attrs));
    Object.assign(f.style, style);
    return f;
  };
})();
function createInvisibleIframe() {
  return createIframe(document, {
    id: getUniqueIdentifierStr(),
    width: 0,
    height: 0,
    src: 'about:blank'
  }, {
    display: 'none',
    height: '0px',
    width: '0px',
    border: '0px'
  });
}

/*
 *   Check if a given parameter name exists in query string
 *   and if it does return the value
 */
function getParameterByName(name) {
  return parseQS(getWindowLocation().search)[name] || '';
}

/**
 * Return if the object is "empty";
 * this includes falsey, no keys, or no items at indices
 * @param {*} object object to test
 * @return {Boolean} if object is empty
 */
function isEmpty(object) {
  if (!object) return true;
  if ((0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(object) || (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(object)) {
    return !(object.length > 0);
  }
  return Object.keys(object).length <= 0;
}

/**
 * Return if string is empty, null, or undefined
 * @param str string to test
 * @returns {boolean} if string is empty
 */
function isEmptyStr(str) {
  return (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(str) && (!str || str.length === 0);
}

/**
 * Iterate object with the function
 * falls back to es5 `forEach`
 * @param {Array|Object} object
 * @param {Function} fn - The function to execute for each element. It receives three arguments: value, key, and the original object.
 * @returns {void}
 */
function _each(object, fn) {
  if ((0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(object?.forEach)) return object.forEach(fn, this);
  Object.entries(object || {}).forEach(([k, v]) => fn.call(this, v, k));
}
function contains(a, obj) {
  return (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(a?.includes) && a.includes(obj);
}

/**
 * Map an array or object into another array
 * given a function
 * @param {Array|Object} object
 * @param {Function} callback - The function to execute for each element. It receives three arguments: value, key, and the original object.
 * @return {Array}
 */
function _map(object, callback) {
  if ((0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(object?.map)) return object.map(callback);
  return Object.entries(object || {}).map(([k, v]) => callback(v, k, object));
}

/*
* Inserts an element(elm) as targets child, by default as first child
* @param {HTMLElement} elm
* @param {HTMLElement} [doc]
* @param {HTMLElement} [target]
* @param {Boolean} [asLastChildChild]
* @return {HTML Element}
*/
function insertElement(elm, doc, target, asLastChildChild) {
  doc = doc || document;
  let parentEl;
  if (target) {
    parentEl = doc.getElementsByTagName(target);
  } else {
    parentEl = doc.getElementsByTagName('head');
  }
  try {
    parentEl = parentEl.length ? parentEl : doc.getElementsByTagName('body');
    if (parentEl.length) {
      parentEl = parentEl[0];
      const insertBeforeEl = asLastChildChild ? null : parentEl.firstChild;
      return parentEl.insertBefore(elm, insertBeforeEl);
    }
  } catch (e) {}
}

/**
 * Returns a promise that completes when the given element triggers a 'load' or 'error' DOM event, or when
 * `timeout` milliseconds have elapsed.
 *
 * @param {HTMLElement} element
 * @param {Number} [timeout]
 * @returns {Promise}
 */
function waitForElementToLoad(element, timeout) {
  let timer = null;
  return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.PbPromise(resolve => {
    const onLoad = function () {
      element.removeEventListener('load', onLoad);
      element.removeEventListener('error', onLoad);
      if (timer != null) {
        window.clearTimeout(timer);
      }
      resolve();
    };
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onLoad);
    if (timeout != null) {
      timer = window.setTimeout(onLoad, timeout);
    }
  });
}

/**
 * Fires a fire-and-forget request for `url` on the background task queue (a keepalive fetch, falling
 * back to an image pixel) for cookie sync and similar best-effort pixels.
 * @param {string} url URL string to request
 * @param {string} [credentials='include'] fetch credentials mode (e.g. `'include'`, `'omit'`); pass
 *   `'omit'` for a cookieless request — the image fallback (which cannot omit cookies) is then skipped.
 */

function politeTriggerPixel(url, credentials = 'include') {
  const triggerSync = () => {
    if (window.fetch && window.Request) {
      try {
        const request = new Request(url, {
          method: 'GET',
          mode: 'no-cors',
          credentials,
          keepalive: true
        });
        window.fetch(request).catch(() => {
          if (credentials !== 'omit') triggerPixel(url);
        });
        return;
      } catch (e) {}
    }
    if (credentials !== 'omit') triggerPixel(url);
  };
  runBackgroundTask(triggerSync);
}
function politeInsertUserSyncIframe(url, done, timeout, onCleanup) {
  runBackgroundTask(() => insertUserSyncIframe(url, done, timeout, onCleanup));
}
function triggerPixel(url, done, timeout) {
  const img = new Image();
  if (done && internal.isFn(done)) {
    waitForElementToLoad(img, timeout).then(done);
  }
  img.src = url;
}

/**
 * Run a task at low priority when supported by the browser, or immediately as fallback.
 * @param {function} task
 */
function runBackgroundTask(task) {
  const scheduler = window.scheduler;
  if (scheduler?.postTask) {
    scheduler.postTask(task, {
      priority: 'background'
    }).catch(() => task());
    return;
  }
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => task(), {
      timeout: 2000
    });
    return;
  }
  task();
}

/**
 * Inserts an empty iframe with the specified `html`, primarily used for tracking purposes
 * (though could be for other purposes)
 * @param {string} htmlCode snippet of HTML code used for tracking purposes
 */
function insertHtmlIntoIframe(htmlCode) {
  if (!htmlCode) {
    return;
  }
  const iframe = createInvisibleIframe();
  internal.insertElement(iframe, document, 'body');
  (doc => {
    doc.open();
    doc.write(htmlCode);
    doc.close();
  })(iframe.contentWindow.document);
}

/**
 * The sync iframes inserted by this instance, tracked by element reference so that several Prebid
 * instances running on the same page do not remove each other's. Each iframe may have an associated
 * callback that releases work owned by its consumer before the iframe is removed.
 */
const OWN_SYNC_IFRAMES = new WeakMap();

/**
 * Inserts empty iframe with the specified `url` for cookie sync
 * @param  {string} url URL to be requested
 * @param  {function} [done] an optional exit callback, used when this usersync pixel is added during an async process
 * @param  {Number} [timeout] an optional timeout in milliseconds for the iframe to load before calling `done`
 * @param  {function} [onCleanup] called when the iframe is removed by `removeUserSyncIframes`
 */
function insertUserSyncIframe(url, done, timeout, onCleanup) {
  if (!url) return;
  const iframe = createIframe(document, {
    sandbox: 'allow-scripts allow-same-origin',
    src: url
  }, {
    width: '0px',
    height: '0px',
    display: 'none'
  });
  OWN_SYNC_IFRAMES.set(iframe, internal.isFn(onCleanup) ? onCleanup : null);
  if (done && internal.isFn(done)) {
    waitForElementToLoad(iframe, timeout).then(done);
  }
  internal.insertElement(iframe, document, 'html', true);
}

/**
 * Removes the user sync iframes that were inserted by this Prebid instance; iframes belonging to
 * other instances running on the same page are left alone.
 * @return {Number} the number of iframes that were removed
 */
function removeUserSyncIframes() {
  const iframes = Array.from(document.querySelectorAll('iframe')).filter(iframe => OWN_SYNC_IFRAMES.has(iframe));
  iframes.forEach(iframe => {
    const onCleanup = OWN_SYNC_IFRAMES.get(iframe);
    OWN_SYNC_IFRAMES.delete(iframe);
    try {
      onCleanup?.();
    } catch (error) {
      logError('Error cleaning up user sync iframe', error);
    }
    iframe.parentNode?.removeChild(iframe);
  });
  return iframes.length;
}

/**
 * Creates a snippet of HTML that retrieves the specified `url`
 * @param  {string} url URL to be requested
 * @param encode
 * @return {string}     HTML snippet that contains the img src = set to `url`
 */
function createTrackPixelHtml(url, encode = encodeURI) {
  if (!url) {
    return '';
  }
  const escapedUrl = encode(url);
  let img = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
  img += '<img src="' + escapedUrl + '"></div>';
  return img;
}
;

// The encodeMacroURI implementation below was written by a bot (Claude Code).

// A macro name bypasses encodeURI, since its braces are emitted literally, so it is escaped against
// this set instead. Of these, only the double quote can close the attribute value that
// createTrackPixelHtml writes; the rest are escaped because an encoded URL is not guaranteed to end
// up in a double-quoted attribute - in an unquoted one, whitespace and the backtick end the value
// and `<` and `>` delimit the tag - and because none of them belong in a URI in the first place.
// The whitespace is spelled out rather than written `\s`, which also matches non-ASCII whitespace:
// that is left alone, so a macro name is passed through byte-for-byte where escaping is not needed.
const HTML_UNSAFE_CHARS = /["<>`\t\n\v\f\r ]/g;

// Characters encodeURI and encodeURIComponent encode differently. A macro name containing any of
// them is not recognised as a macro, so its braces stay percent-encoded like the rest of the URL.
// Matched with matchAll, which works on a copy; exec would advance lastIndex on this shared object
// and carry the offset over into the next call.
const MACRO = /\$\{([^}#$&+,/:;=?@]+)\}/g;

/**
 * encodeURI, but preserves macros of the form '${MACRO}' (e.g. '${AUCTION_PRICE}')
 *
 * A macro's braces are emitted literally so that downstream substitution can find them. The macro
 * name is otherwise passed through unchanged, except for the characters in HTML_UNSAFE_CHARS.
 * @param url
 * @return {string}
 */
function encodeMacroURI(url) {
  let encoded = '';
  let from = 0;
  for (const match of url.matchAll(MACRO)) {
    encoded += encodeURI(url.slice(from, match.index)) + '${' + match[1].replace(HTML_UNSAFE_CHARS, encodeURIComponent) + '}';
    from = match.index + match[0].length;
  }
  return encoded + encodeURI(url.slice(from));
}
function uniques(value, index, arry) {
  return arry.indexOf(value) === index;
}
function flatten(a, b) {
  return a.concat(b);
}
function getBidRequest(id, bidderRequests) {
  if (!id) {
    return;
  }
  return bidderRequests.flatMap(br => br.bids).find(bid => ['bidId', 'adId', 'bid_id'].some(prop => bid[prop] === id));
}
function getValue(obj, key) {
  return obj[key];
}
function getBidderCodes(adUnits) {
  // this could memoize adUnits
  return adUnits.map(unit => unit.bids.map(bid => bid.bidder).reduce(flatten, [])).reduce(flatten, []).filter(bidder => typeof bidder !== 'undefined').filter(uniques);
}
function isGptPubadsDefined() {
  if (window.googletag && (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(window.googletag.pubads) && (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(window.googletag.pubads().getSlots)) {
    return true;
  }
}
function isApnGetTagDefined() {
  if (window.apntag && (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(window.apntag.getTag)) {
    return true;
  }
}
const sortByHighestCpm = (a, b) => {
  return b.cpm - a.cpm;
};

/**
 * Fisher–Yates shuffle
 * http://stackoverflow.com/a/6274398
 * https://bost.ocks.org/mike/shuffle/
 * istanbul ignore next
 */
function shuffle(array) {
  let counter = array.length;

  // while there are elements in the array
  while (counter > 0) {
    // pick a random index
    const index = Math.floor(Math.random() * counter);

    // decrease counter by 1
    counter--;

    // and swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function inIframe() {
  try {
    return internal.getWindowSelf() !== internal.getWindowTop();
  } catch (e) {
    return true;
  }
}

/**
 * https://iabtechlab.com/wp-content/uploads/2016/03/SafeFrames_v1.1_final.pdf
 */
function isSafeFrameWindow() {
  if (!inIframe()) {
    return false;
  }
  const ws = internal.getWindowSelf();
  return !!(ws.$sf && ws.$sf.ext);
}

/**
 * Returns the result of calling the function $sf.ext.geom() if it exists
 * @see https://iabtechlab.com/wp-content/uploads/2016/03/SafeFrames_v1.1_final.pdf — 5.4 Function $sf.ext.geom
 * @returns {Object | undefined} geometric information about the container
 */
function getSafeframeGeometry() {
  try {
    const ws = getWindowSelf();
    return typeof ws.$sf.ext.geom === 'function' ? ws.$sf.ext.geom() : undefined;
  } catch (e) {
    logError('Error getting SafeFrame geometry', e);
    return undefined;
  }
}
function isSafariBrowser() {
  return /^((?!chrome|chromium|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
function isFirefoxBrowser() {
  return /firefox|fxios/i.test(navigator.userAgent);
}
function isChromeIOSBrowser() {
  return /crios|crmo/i.test(navigator.userAgent);
}
function replaceMacros(str, subs) {
  if (!str) return;
  return Object.entries(subs).reduce((str, [key, val]) => {
    return str.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), val || '');
  }, str);
}
function replaceAuctionPrice(str, cpm) {
  return replaceMacros(str, {
    AUCTION_PRICE: cpm
  });
}
function replaceClickThrough(str, clicktag) {
  if (!str || !clicktag || typeof clicktag !== 'string') return;
  return str.replace(/\${CLICKTHROUGH}/g, clicktag);
}
function timestamp() {
  return new Date().getTime();
}

/**
 * The returned value represents the time elapsed since the time origin. @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
 * @returns {number}
 */
function getPerformanceNow() {
  return window.performance && window.performance.now && window.performance.now() || 0;
}

/**
 * Returns the difference between `timing.domLoading` and `timing.navigationStart`.
 * This function uses the deprecated `Performance.timing` API and should be removed in future.
 * It has not been updated yet because it is still used in some modules.
 * @deprecated
 * @param {Window} w The window object used to perform the api call. default to window.self
 * @returns {number}
 */
function getDomLoadingDuration(w) {
  let domLoadingDuration = -1;
  w = w || getWindowSelf();
  const performance = w.performance;
  if (w.performance?.timing) {
    if (w.performance.timing.navigationStart > 0) {
      const val = performance.timing.domLoading - performance.timing.navigationStart;
      if (val > 0) {
        domLoadingDuration = val;
      }
    }
  }
  return domLoadingDuration;
}

/**
 * When the deviceAccess flag config option is false, no cookies should be read or set
 * @returns {boolean}
 */
function hasDeviceAccess() {
  return _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('deviceAccess') !== false;
}

/**
 * @returns {(boolean|undefined)}
 */
function checkCookieSupport() {
  // eslint-disable-next-line no-restricted-properties
  if (window.navigator.cookieEnabled || !!document.cookie.length) {
    return true;
  }
}

/**
 * Given a function, return a function which only executes the original after
 * it's been called numRequiredCalls times.
 *
 * Note that the arguments from the previous calls will *not* be forwarded to the original function.
 * Only the final call's arguments matter.
 *
 * @param {function} func The function which should be executed, once the returned function has been executed
 *   numRequiredCalls times.
 * @param {number} numRequiredCalls The number of times which the returned function needs to be called before
 *   func is.
 */
function delayExecution(func, numRequiredCalls) {
  if (numRequiredCalls < 1) {
    throw new Error(`numRequiredCalls must be a positive number. Got ${numRequiredCalls}`);
  }
  let numCalls = 0;
  return function () {
    numCalls++;
    if (numCalls === numRequiredCalls) {
      func.apply(this, arguments);
    }
  };
}

/**
 * https://stackoverflow.com/a/34890276/428704
 * @param {Array} xs
 * @param {string} key
 * @returns {Object} {${key_value}: ${groupByArray}, key_value: {groupByArray}}
 */
function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

/**
 * Validates an adunit's `mediaTypes` parameter
 * @param mediaTypes mediaTypes parameter to validate
 * @return If object is valid
 */
function isValidMediaTypes(mediaTypes) {
  const SUPPORTED_MEDIA_TYPES = ['banner', 'native', 'video', 'audio'];
  const SUPPORTED_STREAM_TYPES = ['instream', 'outstream'];
  const types = Object.keys(mediaTypes);
  if (!types.every(type => SUPPORTED_MEDIA_TYPES.includes(type))) {
    return false;
  }
  if ( true && mediaTypes.video && mediaTypes.video.context) {
    return SUPPORTED_STREAM_TYPES.includes(mediaTypes.video.context);
  }
  return true;
}

/**
 * Returns user configured bidder params from adunit
 * @param {Object} adUnits
 * @param {string} adUnitCode code
 * @param {string} bidder code
 * @return {Array} user configured param for the given bidder adunit configuration
 */
function getUserConfiguredParams(adUnits, adUnitCode, bidder) {
  return adUnits.filter(adUnit => adUnit.code === adUnitCode).flatMap(adUnit => adUnit.bids).filter(bidderData => bidderData.bidder === bidder).map(bidderData => bidderData.params || {});
}
const compareCodeAndSlot = (slot, adUnitCode) => slot.getAdUnitPath() === adUnitCode || slot.getSlotElementId() === adUnitCode;

/**
 * Returns filter function to match adUnitCode in slot
 * @param slot GoogleTag slot
 * @return filter function
 */
function isAdUnitCodeMatchingSlot(slot) {
  const customGptSlotMatching = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('customGptSlotMatching');
  const match = (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(customGptSlotMatching) && customGptSlotMatching(slot);
  return (0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(match) ? match : adUnitCode => compareCodeAndSlot(slot, adUnitCode);
}

/**
 * Constructs warning message for when unsupported bidders are dropped from an adunit
 * @param {Object} adUnit ad unit from which the bidder is being dropped
 * @param {string} bidder bidder code that is not compatible with the adUnit
 * @return {string} warning message to display when condition is met
 */
function unsupportedBidderMessage(adUnit, bidder) {
  const mediaType = Object.keys(adUnit.mediaTypes || {
    'banner': 'banner'
  }).join(', ');
  return `
    ${adUnit.code} is a ${mediaType} ad unit
    containing bidders that don't support ${mediaType}: ${bidder}.
    This bidder won't fetch demand.
  `;
}

/**
 * Returns a new object with undefined properties removed from given object
 * @param obj the object to clean
 */
function cleanObj(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => typeof v !== 'undefined'));
}

/**
 * Create a new object with selected properties.  Also allows property renaming and transform functions.
 * @param obj the original object
 * @param properties An array of desired properties
 */
function pick(obj, properties) {
  if (typeof obj !== 'object') {
    return {};
  }
  return properties.reduce((newObj, prop, i) => {
    if (typeof prop === 'function') {
      return newObj;
    }
    let newProp = prop;
    const match = prop.match(/^(.+?)\sas\s(.+?)$/i);
    if (match) {
      prop = match[1];
      newProp = match[2];
    }
    let value = obj[prop];
    if (typeof properties[i + 1] === 'function') {
      value = properties[i + 1](value, newObj);
    }
    if (typeof value !== 'undefined') {
      newObj[newProp] = value;
    }
    return newObj;
  }, {});
}
function parseQS(query) {
  return !query ? {} : query.replace(/^\?/, '').split('&').reduce((acc, criteria) => {
    let [k, v] = criteria.split('=');
    if (/\[\]$/.test(k)) {
      k = k.replace('[]', '');
      acc[k] = acc[k] || [];
      acc[k].push(v);
    } else {
      acc[k] = v || '';
    }
    return acc;
  }, {});
}
function formatQS(query) {
  return Object.keys(query).map(k => Array.isArray(query[k]) ? query[k].map(v => `${k}[]=${v}`).join('&') : `${k}=${query[k]}`).join('&');
}
function parseUrl(url, options) {
  const parsed = document.createElement('a');
  if (options && 'noDecodeWholeURL' in options && options.noDecodeWholeURL) {
    parsed.href = url;
  } else {
    parsed.href = decodeURIComponent(url);
  }
  // in window.location 'search' is string, not object
  const qsAsString = options && 'decodeSearchAsString' in options && options.decodeSearchAsString;
  return {
    href: parsed.href,
    protocol: (parsed.protocol || '').replace(/:$/, ''),
    hostname: parsed.hostname,
    port: +parsed.port,
    pathname: parsed.pathname.replace(/^(?!\/)/, '/'),
    search: qsAsString ? parsed.search : internal.parseQS(parsed.search || ''),
    hash: (parsed.hash || '').replace(/^#/, ''),
    host: parsed.host || window.location.host
  };
}
function buildUrl(obj) {
  return (obj.protocol || 'http') + '://' + (obj.host || obj.hostname + (obj.port ? `:${obj.port}` : '')) + (obj.pathname || '') + (obj.search ? `?${internal.formatQS(obj.search || '')}` : '') + (obj.hash ? `#${obj.hash}` : '');
}

/**
 * This function deeply compares two objects checking for their equivalence.
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Object} [options] - Options for comparison.
 * @param {boolean} [options.checkTypes=false] - If set, two objects with identical properties but different constructors will *not* be considered equivalent.
 * @returns {boolean} - Returns `true` if the objects are equivalent, `false` otherwise.
 */
function deepEqual(obj1, obj2, {
  checkTypes = false
} = {}) {
  // Quick reference check
  if (obj1 === obj2) return true;

  // If either is null or not an object, do a direct equality check
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  // Cache the Array checks
  const isArr1 = Array.isArray(obj1);
  const isArr2 = Array.isArray(obj2);
  // Special case: both are arrays
  if (isArr1 && isArr2) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i], {
        checkTypes
      })) {
        return false;
      }
    }
    return true;
  } else if (isArr1 || isArr2) {
    return false;
  }

  // If we’re checking types, compare constructors (e.g., plain object vs. Date)
  if (checkTypes && obj1.constructor !== obj2.constructor) {
    return false;
  }

  // Compare object keys. Cache keys for both to avoid repeated calls.
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    // If `obj2` doesn't have this key or sub-values aren't equal, bail out.
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }
    if (!deepEqual(obj1[key], obj2[key], {
      checkTypes
    })) {
      return false;
    }
  }
  return true;
}
function mergeDeep(target, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (!(0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(source)) {
      continue;
    }
    mergeDeepHelper(target, source);
  }
  return target;
}
function mergeDeepHelper(target, source) {
  // quick check
  if (!(0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(target) || !(0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(source)) {
    return;
  }
  const keys = Object.keys(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === '__proto__' || key === 'constructor') {
      continue;
    }
    const val = source[key];
    if ((0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(val)) {
      if (!(0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(target[key])) {
        target[key] = {};
      }
      mergeDeepHelper(target[key], val);
    } else if (Array.isArray(val)) {
      if (!Array.isArray(target[key])) {
        target[key] = [...val];
      } else {
        // deduplicate
        val.forEach(obj => {
          if (!target[key].some(item => deepEqual(item, obj))) {
            target[key].push(obj);
          }
        });
      }
    } else {
      // direct assignment
      target[key] = val;
    }
  }
}

/**
 * returns a hash of a string using a fast algorithm
 * source: https://stackoverflow.com/a/52171480/845390
 * @param str
 * @param seed (optional)
 * @returns {string}
 */
function cyrb53Hash(str, seed = 0) {
  // IE doesn't support imul
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill
  const imul = function (opA, opB) {
    if ((0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isFn)(Math.imul)) {
      return Math.imul(opA, opB);
    } else {
      opB |= 0; // ensure that opB is an integer. opA will automatically be coerced.
      // floating points give us 53 bits of precision to work with plus 1 sign bit
      // automatically handled for our convenience:
      // 1. 0x003fffff /*opA & 0x000fffff*/ * 0x7fffffff /*opB*/ = 0x1fffff7fc00001
      //    0x1fffff7fc00001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
      var result = (opA & 0x003fffff) * opB;
      // 2. We can remove an integer coersion from the statement above because:
      //    0x1fffff7fc00001 + 0xffc00000 = 0x1fffffff800001
      //    0x1fffffff800001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
      if (opA & 0xffc00000) result += (opA & 0xffc00000) * opB | 0;
      return result | 0;
    }
  };
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = imul(h1 ^ ch, 2654435761);
    h2 = imul(h2 ^ ch, 1597334677);
  }
  h1 = imul(h1 ^ h1 >>> 16, 2246822507) ^ imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = imul(h2 ^ h2 >>> 16, 2246822507) ^ imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
}

/**
 * returns the result of `JSON.parse(data)`, or undefined if that throws an error.
 * @param data
 * @returns {any}
 */
function safeJSONParse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {}
}
function safeJSONEncode(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return '';
  }
}

/**
 * Returns a memoized version of `fn`.
 *
 * @param fn
 * @param key cache key generator, invoked with the same arguments passed to `fn`.
 *        By default, the first argument is used as key.
 * @return {*}
 */
function memoize(fn, key = function (arg) {
  return arg;
}) {
  const cache = new Map();
  const memoized = function () {
    const cacheKey = key.apply(this, arguments);
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, fn.apply(this, arguments));
    }
    return cache.get(cacheKey);
  };
  memoized.clear = cache.clear.bind(cache);
  return memoized;
}

/**
 * Returns a Unix timestamp for given time value and unit.
 * @param {number} timeValue numeric value, defaults to 0 (which means now)
 * @param {string} timeUnit defaults to days (or 'd'), use 'm' for minutes. Any parameter that isn't 'd' or 'm' will return Date.now().
 * @returns {number}
 */
function getUnixTimestampFromNow(timeValue = 0, timeUnit = 'd') {
  const acceptableUnits = ['m', 'd'];
  if (acceptableUnits.indexOf(timeUnit) < 0) {
    return Date.now();
  }
  const millisecondsOffset = timeUnit === 'm' ? timeValue * 60 * 1000 : timeValue * 24 * 60 * 60 * 1000;
  return Date.now() + (timeValue && timeValue > 0 ? millisecondsOffset : 0);
}

/**
 * Converts given object into an array, so {key: 1, anotherKey: 'fred', third: ['fred']} is turned
 * into [{key: 1}, {anotherKey: 'fred'}, {third: ['fred']}]
 * @param {Object} obj the object
 * @returns {Array}
 */
function convertObjectToArray(obj) {
  return Object.keys(obj).map(key => {
    return {
      [key]: obj[key]
    };
  });
}

/**
 * Sets dataset attributes on a script
 * @param {HTMLScriptElement} script
 * @param {object} attributes
 */
function setScriptAttributes(script, attributes) {
  Object.entries(attributes).forEach(([k, v]) => script.setAttribute(k, v));
}

/**
 * Perform a binary search for `el` on an ordered array `arr`.
 *
 * @returns the lowest nonnegative integer I that satisfies:
 *   key(arr[i]) >= key(el) for each i between I and arr.length
 *
 *   (if one or more matches are found for `el`, returns the index of the first;
 *   if the element is not found, return the index of the first element that's greater;
 *   if no greater element exists, return `arr.length`)
 */
function binarySearch(arr, el, key = el => el) {
  let left = 0;
  let right = arr.length && arr.length - 1;
  const target = key(el);
  while (right - left > 1) {
    const middle = left + Math.round((right - left) / 2);
    if (target > key(arr[middle])) {
      left = middle;
    } else {
      right = middle;
    }
  }
  while (arr.length > left && target > key(arr[left])) {
    left++;
  }
  return left;
}

/**
 * Checks if an object has non-serializable properties.
 * Non-serializable properties are functions and RegExp objects.
 *
 * @param {Object} obj - The object to check.
 * @param {Set} checkedObjects - A set of properties that have already been checked.
 * @returns {boolean} - Returns true if the object has non-serializable properties, false otherwise.
 */
function hasNonSerializableProperty(obj, checkedObjects = new Set()) {
  for (const key in obj) {
    const value = obj[key];
    const type = typeof value;
    if (value === undefined || type === 'function' || type === 'symbol' || value instanceof RegExp || value instanceof Map || value instanceof Set || value instanceof Date || value !== null && type === 'object' && Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
      return true;
    }
    if (value !== null && type === 'object' && value.constructor === Object) {
      if (checkedObjects.has(value)) {
        // circular reference, means we have a non-serializable property
        return true;
      }
      checkedObjects.add(value);
      if (hasNonSerializableProperty(value, checkedObjects)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns the value of a nested property in an array of objects.
 *
 * @param {Array} collection - Array of objects.
 * @param {String} key - Key of nested property.
 * @returns {any|undefined} - Value of nested property.
 */
function setOnAny(collection, key) {
  for (let i = 0, result; i < collection.length; i++) {
    result = (0,dlv_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(collection[i], key);
    if (result) {
      return result;
    }
  }
  return undefined;
}
function extractDomainFromHost(pageHost) {
  let domain = null;
  try {
    const domains = /[-\w]+\.([-\w]+|[-\w]{3,}|[-\w]{1,3}\.[-\w]{2})$/i.exec(pageHost);
    if (domains != null && domains.length > 0) {
      domain = domains[0];
      for (let i = 1; i < domains.length; i++) {
        if (domains[i].length > domain.length) {
          domain = domains[i];
        }
      }
    }
  } catch (e) {
    domain = null;
  }
  return domain;
}
function triggerNurlWithCpm(bid, cpm) {
  if ((0,_utils_objects_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(bid.nurl) && bid.nurl !== '') {
    bid.nurl = bid.nurl.replace(/\${AUCTION_PRICE}/, cpm);
    politeTriggerPixel(bid.nurl);
  }
}

// To ensure that isGzipCompressionSupported() doesn’t become an overhead, we have used memoization to cache the result after the first execution.
// This way, even if the function is called multiple times, it will only perform the actual check once and return the cached result in subsequent calls.
const isGzipCompressionSupported = function () {
  let cachedResult; // Store the result

  return function () {
    if (cachedResult !== undefined) {
      return cachedResult; // Return cached result if already computed
    }
    try {
      if (typeof window.CompressionStream === 'undefined') {
        cachedResult = false;
      } else {
        (() => new window.CompressionStream('gzip'))();
        cachedResult = true;
      }
    } catch (error) {
      cachedResult = false;
    }
    return cachedResult;
  };
}();

// Make sure to use isGzipCompressionSupported before calling this function
async function compressDataWithGZip(data) {
  if (typeof data !== 'string') {
    // TextEncoder (below) expects a string
    data = JSON.stringify(data);
  }
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const compressedStream = new Blob([encodedData]).stream().pipeThrough(new window.CompressionStream('gzip'));
  const compressedBlob = await new Response(compressedStream).blob();
  const compressedArrayBuffer = await compressedBlob.arrayBuffer();
  return new Uint8Array(compressedArrayBuffer);
}

/***/ },

/***/ "./src/utils/adUnits.js"
/*!******************************!*\
  !*** ./src/utils/adUnits.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdUnitElement: () => (/* binding */ getAdUnitElement)
/* harmony export */ });
function getAdUnitElement(target) {
  if (target.element != null) {
    return target.element;
  }
  const id = target.adUnitCode ?? target.code;
  if (id) {
    return document.getElementById(id);
  }
  return null;
}

/***/ },

/***/ "./src/utils/cachedApiWrapper.js"
/*!***************************************!*\
  !*** ./src/utils/cachedApiWrapper.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CachedApiWrapper: () => (/* binding */ CachedApiWrapper)
/* harmony export */ });
function CachedApiWrapper(getTarget, props) {
  const wrapper = {};
  let data = {};
  const children = [];
  Object.entries(props).forEach(([key, value]) => {
    if (value != null && typeof value === 'object') {
      const child = new CachedApiWrapper(() => getTarget()?.[key], value);
      wrapper[key] = child.obj;
      children.push(child.reset);
    } else if (value === true) {
      Object.defineProperty(wrapper, key, {
        get() {
          if (!data.hasOwnProperty(key)) {
            data[key] = getTarget()?.[key];
          }
          return data[key];
        }
      });
    }
  });
  this.obj = wrapper;
  this.reset = function () {
    children.forEach(reset => reset());
    data = {};
  };
}

/***/ },

/***/ "./src/utils/cpm.js"
/*!**************************!*\
  !*** ./src/utils/cpm.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustCpm: () => (/* binding */ adjustCpm),
/* harmony export */   getBidAdjustmentFn: () => (/* binding */ getBidAdjustmentFn)
/* harmony export */ });
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");




/**
 * Resolve a bidder-scoped hook (`bidCpmAdjustment`, `bidDesirabilityAdjustment`, …) using the same
 * precedence as publisher settings: `getOwn(bidderCode)` wins, otherwise adapter vs bidder depending on
 * `adjustAlternateBids` on the adapter scope.
 */
function getBidAdjustmentFn(bid, bs, key, bidRequest) {
  const adapterCode = bid?.adapterCode;
  const bidderCode = bid?.bidderCode || bidRequest?.bidder;
  const adjustAlternateBids = bs.get(bid?.adapterCode, 'adjustAlternateBids');
  return bs.getOwn(bidderCode, key) || bs.get(adjustAlternateBids ? adapterCode : bidderCode, key);
}
function adjustCpm(cpm, bidResponse, bidRequest, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__.auctionManager.index,
  bs = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__.bidderSettings
} = {}) {
  bidRequest = bidRequest || index.getBidRequest(bidResponse);
  const bidCpmAdjustment = getBidAdjustmentFn(bidResponse, bs, 'bidCpmAdjustment', bidRequest);
  if (bidCpmAdjustment && typeof bidCpmAdjustment === 'function') {
    try {
      return bidCpmAdjustment(cpm, Object.assign({}, bidResponse), bidRequest);
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)('Error during bid adjustment', e);
    }
  }
  return cpm;
}

/***/ },

/***/ "./src/utils/debug.js"
/*!****************************!*\
  !*** ./src/utils/debug.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debugTurnedOn: () => (/* binding */ debugTurnedOn)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

function debugTurnedOn() {
  return !!_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('debug');
}

/***/ },

/***/ "./src/utils/desirability.js"
/*!***********************************!*\
  !*** ./src/utils/desirability.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustDesirability: () => (/* binding */ adjustDesirability),
/* harmony export */   sortByHighestDesirability: () => (/* binding */ sortByHighestDesirability)
/* harmony export */ });
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _cpm_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cpm.js */ "./src/utils/cpm.js");



function adjustDesirability(bid, bidRequest, deps = {}) {
  const bs = deps.bs ?? _bidderSettings_js__WEBPACK_IMPORTED_MODULE_0__.bidderSettings;
  const bidCopy = Object.assign({}, bid);
  const adjustedCpm = bid.cpm;
  const bidDesirabilityAdjustment = (0,_cpm_js__WEBPACK_IMPORTED_MODULE_2__.getBidAdjustmentFn)(bid, bs, 'bidDesirabilityAdjustment', bidRequest);
  if (typeof bidDesirabilityAdjustment !== 'function') {
    return adjustedCpm;
  }
  try {
    return bidDesirabilityAdjustment(adjustedCpm, bidCopy, bidRequest);
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error during bid desirability adjustment', e);
    return adjustedCpm;
  }
}

/** Compare bids that already carry `.desirability` (e.g. after `adjustBids` in the auction). Higher wins. */
function sortByHighestDesirability(a, b) {
  if (b.desirability && a.desirability) {
    return b.desirability - a.desirability;
  }
  return b.cpm - a.cpm;
}

/***/ },

/***/ "./src/utils/focusTimeout.js"
/*!***********************************!*\
  !*** ./src/utils/focusTimeout.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setFocusTimeout: () => (/* binding */ setFocusTimeout)
/* harmony export */ });
/* unused harmony export reset */
let outOfFocusStart = null; // enforce null otherwise it could be undefined and the callback wouldn't execute
let timeOutOfFocus = 0;
let suspendedTimeouts = [];
function trackTimeOutOfFocus() {
  if (document.hidden) {
    outOfFocusStart = Date.now();
  } else {
    timeOutOfFocus += Date.now() - (outOfFocusStart ?? 0); // when the page is loaded in hidden state outOfFocusStart is undefined, which results in timeoutOffset being NaN
    outOfFocusStart = null;
    suspendedTimeouts.forEach(({
      callback,
      startTime,
      setTimerId
    }) => setTimerId(setFocusTimeout(callback, timeOutOfFocus - startTime)()));
    suspendedTimeouts = [];
  }
}
document.addEventListener('visibilitychange', trackTimeOutOfFocus);
function reset() {
  outOfFocusStart = null;
  timeOutOfFocus = 0;
  suspendedTimeouts = [];
  document.removeEventListener('visibilitychange', trackTimeOutOfFocus);
  document.addEventListener('visibilitychange', trackTimeOutOfFocus);
}

/**
 * Wraps native setTimeout function in order to count time only when page is focused
 *
 * @param {function(void): void} [callback] - A function that will be invoked after passed time
 * @param {number} [milliseconds] - Minimum duration (in milliseconds) that the callback will be executed after
 * @returns {function(): number} - Getter function for current timer id
 */
function setFocusTimeout(callback, milliseconds) {
  const startTime = timeOutOfFocus;
  let timerId = setTimeout(() => {
    if (timeOutOfFocus === startTime && outOfFocusStart == null) {
      callback();
    } else if (outOfFocusStart != null) {
      // case when timeout ended during page is out of focus
      suspendedTimeouts.push({
        callback,
        startTime,
        setTimerId(newId) {
          timerId = newId;
        }
      });
    } else {
      timerId = setFocusTimeout(callback, timeOutOfFocus - startTime)();
    }
  }, milliseconds);
  return () => timerId;
}

/***/ },

/***/ "./src/utils/gptTargeting.js"
/*!***********************************!*\
  !*** ./src/utils/gptTargeting.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findSlotElementIdByAdId: () => (/* binding */ findSlotElementIdByAdId),
/* harmony export */   getSlotTargeting: () => (/* binding */ getSlotTargeting),
/* harmony export */   getSlotTargetingKeys: () => (/* binding */ getSlotTargetingKeys),
/* harmony export */   recordSlotTargeting: () => (/* binding */ recordSlotTargeting),
/* harmony export */   setPageTargeting: () => (/* binding */ setPageTargeting),
/* harmony export */   slotHasTargetedAdId: () => (/* binding */ slotHasTargetedAdId),
/* harmony export */   updateSlotTargetingFromMap: () => (/* binding */ updateSlotTargetingFromMap)
/* harmony export */ });
/* unused harmony exports getPageTargetingMap, getSlotTargetingMap, getPageTargetingKeys, getPageTargeting, setSlotTargeting */
// shim for the deprecation of GPT setTargeting / getTargeting methods

const targetedAdIdsBySlot = new WeakMap();
function recordSlotTargeting(slot, adIds = []) {
  const recorded = new Set();
  Array.from(adIds).forEach(adId => {
    if (adId) recorded.add(String(adId));
  });
  targetedAdIdsBySlot.set(slot, recorded);
}
function slotHasTargetedAdId(slot, adId) {
  return targetedAdIdsBySlot.get(slot)?.has(adId) ?? false;
}
function findSlotElementIdByAdId(adId, getSlots = () => window.googletag.pubads().getSlots()) {
  if (adId == null) return null;
  const slot = getSlots().find(s => slotHasTargetedAdId(s, adId));
  return slot?.getSlotElementId?.() ?? null;
}

/**
 * The new config API on gpt and Slot we assume with the hasConfigApi typeguard.
 */

/**
 * Typeguard to check if the target has the new GPT config API (getConfig/setConfig).
 */
function hasConfigApi(target) {
  // look for getConfig still, as setConfig was there before the deprecation
  return typeof target.getConfig === 'function';
}
function getTargetingConfig(target) {
  return target.getConfig('targeting').targeting ?? {};
}
function updateSlotTargetingFromMap(slot, targeting) {
  if (hasConfigApi(slot)) {
    slot.setConfig({
      targeting
    });
  } else {
    slot.updateTargetingFromMap(targeting);
  }
}
function getPageTargetingMap(gpt = googletag) {
  if (hasConfigApi(gpt)) return getTargetingConfig(gpt);
  const pubads = gpt.pubads();
  return Object.fromEntries(pubads.getTargetingKeys().map(key => [key, pubads.getTargeting(key)]));
}
function getSlotTargetingMap(slot) {
  if (hasConfigApi(slot)) return getTargetingConfig(slot);
  return Object.fromEntries(slot.getTargetingKeys().map(key => [key, slot.getTargeting(key)]));
}
function getPageTargetingKeys(gpt = googletag) {
  if (hasConfigApi(gpt)) return Object.keys(getTargetingConfig(gpt));
  return gpt.pubads().getTargetingKeys();
}
function getPageTargeting(key, gpt = googletag) {
  if (hasConfigApi(gpt)) return getTargetingConfig(gpt)[key] ?? [];
  return gpt.pubads().getTargeting(key);
}
function setPageTargeting(key, value, gpt = googletag) {
  if (hasConfigApi(gpt)) {
    gpt.setConfig({
      targeting: {
        [key]: value
      }
    });
  } else {
    gpt.pubads().setTargeting(key, value);
  }
}
function setSlotTargeting(slot, key, value) {
  if (hasConfigApi(slot)) {
    slot.setConfig({
      targeting: {
        [key]: value
      }
    });
  } else {
    slot.setTargeting(key, value);
  }
}
function getSlotTargeting(slot, key) {
  if (hasConfigApi(slot)) return getTargetingConfig(slot)[key] ?? [];
  return slot.getTargeting(key);
}
function getSlotTargetingKeys(slot) {
  if (hasConfigApi(slot)) return Object.keys(getTargetingConfig(slot));
  return slot.getTargetingKeys();
}

/***/ },

/***/ "./src/utils/ipUtils.js"
/*!******************************!*\
  !*** ./src/utils/ipUtils.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scrubIPv4: () => (/* binding */ scrubIPv4),
/* harmony export */   scrubIPv6: () => (/* binding */ scrubIPv6)
/* harmony export */ });
function scrubIPv4(ip) {
  if (!ip) {
    return null;
  }
  const ones = 24;
  const ipParts = ip.split('.').map(Number);
  if (ipParts.length !== 4) {
    return null;
  }
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const n = Math.max(0, Math.min(8, ones - i * 8));
    mask.push(0xff << 8 - n & 0xff);
  }
  const maskedIP = ipParts.map((part, i) => part & mask[i]);
  return maskedIP.join('.');
}
function scrubIPv6(ip) {
  if (!ip) {
    return null;
  }
  const ones = 64;
  let ipParts = ip.split(':').map(part => parseInt(part, 16));
  ipParts = ipParts.map(part => isNaN(part) ? 0 : part);
  while (ipParts.length < 8) {
    ipParts.push(0);
  }
  if (ipParts.length !== 8) {
    return null;
  }
  const mask = [];
  for (let i = 0; i < 8; i++) {
    const n = Math.max(0, Math.min(16, ones - i * 16));
    mask.push(0xffff << 16 - n & 0xffff);
  }
  const maskedIP = ipParts.map((part, i) => part & mask[i]);
  return maskedIP.map(part => part.toString(16)).join(':');
}

/***/ },

/***/ "./src/utils/logging.js"
/*!******************************!*\
  !*** ./src/utils/logging.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _setEventEmitter: () => (/* binding */ _setEventEmitter),
/* harmony export */   logError: () => (/* binding */ logError),
/* harmony export */   logInfo: () => (/* binding */ logInfo),
/* harmony export */   logMessage: () => (/* binding */ logMessage),
/* harmony export */   logWarn: () => (/* binding */ logWarn),
/* harmony export */   prefixLog: () => (/* binding */ prefixLog)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debug.js */ "./src/utils/debug.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");



const LEVELS = {
  'log': 'MESSAGE',
  'info': 'INFO',
  'warn': 'WARNING',
  'error': 'ERROR'
};
let eventEmitter;
function _setEventEmitter(emitFn) {
  // called from events.js - this hoop is to avoid circular imports
  eventEmitter = emitFn;
}
const emitEvent = (event, ...args) => {
  if (eventEmitter != null) {
    eventEmitter(event, ...args);
  }
};
function makeLogger(level, emit = false) {
  const logFn = window.console?.[level];
  const prefix = `${LEVELS[level]}:`;
  return function (...args) {
    if (typeof logFn === 'function' && (0,_debug_js__WEBPACK_IMPORTED_MODULE_1__.debugTurnedOn)()) {
      logFn.apply(console, decorateLog(args, prefix));
    }
    if (emit) {
      emitEvent(_constants_js__WEBPACK_IMPORTED_MODULE_2__.EVENTS.AUCTION_DEBUG, {
        type: LEVELS[level],
        arguments: args
      });
    }
  };
}
/**
 * Wrappers to console.(log | info | warn | error). Takes N arguments, the same as the native methods
 */
const logMessage = makeLogger('log');
const logInfo = makeLogger('info');
const logWarn = makeLogger('warn', true);
const logError = makeLogger('error', true);
function prefixLog(prefix) {
  function decorate(fn) {
    return function (...args) {
      fn(prefix, ...args);
    };
  }
  return {
    logError: decorate(logError),
    logWarn: decorate(logWarn),
    logMessage: decorate(logMessage),
    logInfo: decorate(logInfo)
  };
}
function decorateLog(args, prefix) {
  args = [].slice.call(args);
  const bidder = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getCurrentBidder();
  prefix && args.unshift(prefix);
  if (bidder) {
    args.unshift(label('#aaa'));
  }
  args.unshift(label('#3b88c3'));
  args.unshift('%cPrebid' + (bidder ? `%c${bidder}` : ''));
  return args;
  function label(color) {
    return `display: inline-block; color: #fff; background: ${color}; padding: 1px 4px; border-radius: 3px;`;
  }
}

/***/ },

/***/ "./src/utils/objects.js"
/*!******************************!*\
  !*** ./src/utils/objects.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deepClone: () => (/* binding */ deepClone),
/* harmony export */   getDefinedParams: () => (/* binding */ getDefinedParams),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isArrayOfNums: () => (/* binding */ isArrayOfNums),
/* harmony export */   isBoolean: () => (/* binding */ isBoolean),
/* harmony export */   isFn: () => (/* binding */ isFn),
/* harmony export */   isInteger: () => (/* binding */ isInteger),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isStr: () => (/* binding */ isStr)
/* harmony export */ });
/* harmony import */ var klona_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! klona/json */ "../../node_modules/klona/json/index.mjs");

function deepClone(obj) {
  return (0,klona_json__WEBPACK_IMPORTED_MODULE_0__.klona)(obj) || {};
}

/**
 * Build an object consisting of only defined parameters to avoid creating an
 * object with defined keys and undefined values.
 * @param object The object to pick defined params out of
 * @param params An array of strings representing properties to look for in the object
 * @returns An object containing all the specified values that are defined
 */
function getDefinedParams(object, params) {
  return params.filter(param => object[param]).reduce((bid, param) => Object.assign(bid, {
    [param]: object[param]
  }), {});
}
const toString = Object.prototype.toString;

/**
 * Return if the object is of the
 * given type.
 */
function isFn(object) {
  return typeof object === 'function';
}
function isStr(object) {
  return typeof object === 'string';
}
const isArray = Array.isArray.bind(Array);
function isNumber(object) {
  return typeof object === 'number';
}
function isPlainObject(object) {
  return toString.call(object) === '[object Object]';
}
function isBoolean(object) {
  return typeof object === 'boolean';
}

/**
 * Checks input is integer or not
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
const isInteger = Number.isInteger.bind(Number);
function isArrayOfNums(val, size) {
  return isArray(val) && (size ? val.length === size : true) && val.every(v => isInteger(v));
}

/***/ },

/***/ "./src/utils/perfMetrics.js"
/*!**********************************!*\
  !*** ./src/utils/perfMetrics.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   newMetrics: () => (/* binding */ newMetrics),
/* harmony export */   timedAuctionHook: () => (/* binding */ timedAuctionHook),
/* harmony export */   useMetrics: () => (/* binding */ useMetrics)
/* harmony export */ });
/* unused harmony exports CONFIG_TOGGLE, metricsFactory, hookTimer, timedBidResponseHook */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

const CONFIG_TOGGLE = 'performanceMetrics';
const getTime = window.performance && window.performance.now ? () => window.performance.now() : () => Date.now();
const NODES = new WeakMap();

/**
 * A function that, when called, stops a time measure and saves it as a metric.
 */

function wrapFn(fn, before, after) {
  return function (...args) {
    before && before();
    try {
      return fn.apply(this, args);
    } finally {
      after && after();
    }
  };
}
function metricsFactory({
  now = getTime,
  mkNode = makeNode,
  mkTimer = makeTimer,
  mkRenamer = rename => rename,
  nodes = NODES
} = {}) {
  return function newMetrics() {
    function makeMetrics(self, rename = n => ({
      forEach(fn) {
        fn(n);
      }
    })) {
      rename = mkRenamer(rename);
      function accessor(slot) {
        return function (name) {
          return self.dfWalk({
            visit(edge, node) {
              const obj = node[slot];
              if (obj.hasOwnProperty(name)) {
                return obj[name];
              }
            }
          });
        };
      }
      const getTimestamp = accessor('timestamps');

      /**
       * Register a metric.
       *
       * @param name metric name
       * @param value metric valiue
       */
      function setMetric(name, value) {
        const names = rename(name);
        self.dfWalk({
          follow(inEdge, outEdge) {
            return outEdge.propagate && (!inEdge || !inEdge.stopPropagation);
          },
          visit(edge, node) {
            names.forEach(name => {
              if (edge == null) {
                node.metrics[name] = value;
              } else {
                if (!node.groups.hasOwnProperty(name)) {
                  node.groups[name] = [];
                }
                node.groups[name].push(value);
              }
            });
          }
        });
      }

      /**
       * Mark the current time as a checkpoint with the given name, to be referenced later
       * by `timeSince` or `timeBetween`.
       *
       * @param name checkpoint name
       */
      function checkpoint(name) {
        self.timestamps[name] = now();
      }

      /**
       * Get the tame passed since `checkpoint`, and optionally save it as a metric.
       *
       * @param checkpoint checkpoint name
       * @param metric The name of the metric to save. Optional.
       * @return The time in milliseconds between now and the checkpoint, or `null` if the checkpoint is not found.
       */
      function timeSince(checkpoint, metric) {
        const ts = getTimestamp(checkpoint);
        const elapsed = ts != null ? now() - ts : null;
        if (metric != null) {
          setMetric(metric, elapsed);
        }
        return elapsed;
      }

      /**
       * Get the time passed between `startCheckpoint` and `endCheckpoint`, optionally saving it as a metric.
       *
       * @param startCheckpoint - The name of the starting checkpoint.
       * @param endCheckpoint - The name of the ending checkpoint.
       * @param metric - The name of the metric to save.
       * @return The time in milliseconds between `startCheckpoint` and `endCheckpoint`, or `null` if either checkpoint is not found.
       */
      function timeBetween(startCheckpoint, endCheckpoint, metric) {
        const start = getTimestamp(startCheckpoint);
        const end = getTimestamp(endCheckpoint);
        const elapsed = start != null && end != null ? end - start : null;
        if (metric != null) {
          setMetric(metric, elapsed);
        }
        return elapsed;
      }

      /**
       * Start measuring a time metric with the given name.
       *
       * @param name metric name
       */
      function startTiming(name) {
        return mkTimer(now, val => setMetric(name, val));
      }

      /**
       * Run fn and measure the time spent in it.
       *
       * @param name the name to use for the measured time metric
       * @param fn the function to run
       * @return the return value of `fn`
       */
      function measureTime(name, fn) {
        return startTiming(name).stopAfter(fn)();
      }

      /**
       * Convenience method for measuring time spent in a `.before` or `.after` hook.
       *
       * @param name - The metric name.
       * @param next - The hook's `next` (first) argument.
       * @param fn   - A function that will be run immediately; it takes `next`, where both `next` and
       *               `next.bail` automatically call `stopTiming` before continuing with the original hook.
       * @return The return value of `fn`.
       */
      function measureHookTime(name, next, fn) {
        const stopTiming = startTiming(name);
        return fn(function (orig) {
          const next = stopTiming.stopBefore(orig);
          next.bail = orig.bail && stopTiming.stopBefore(orig.bail);
          next.stopTiming = stopTiming;
          next.untimed = orig;
          return next;
        }(next));
      }

      /**
       * Get all registered metrics.
       */
      function getMetrics() {
        const result = {};
        self.dfWalk({
          visit(edge, node) {
            const addMetric = (name, value) => {
              if (!Object.prototype.hasOwnProperty.call(result, name)) {
                result[name] = value;
              }
            };
            Object.entries(node.metrics).forEach(([name, value]) => addMetric(name, value));
            if (!edge || edge.includeGroups) {
              Object.entries(node.groups).forEach(([name, value]) => addMetric(name, value));
            }
          }
        });
        return result;
      }
      /**
       * Create and return a new metrics object that starts as a view on all metrics registered here,
       * and - by default - also propagates all new metrics here.
       *
       * Propagated metrics are grouped together, and intended for repeated operations. For example, with the following:
       *
       * ```
       * const metrics = newMetrics();
       * const requests = metrics.measureTime('buildRequests', buildRequests)
       * requests.forEach((req) => {
       *   const requestMetrics = metrics.fork();
       *   requestMetrics.measureTime('processRequest', () => processRequest(req);
       * })
       * ```
       *
       * if `buildRequests` takes 10ms and returns 3 objects, which respectively take 100, 200, and 300ms in `processRequest`, then
       * the final `metrics.getMetrics()` would be:
       *
       * ```
       * {
       *    buildRequests: 10,
       *    processRequest: [100, 200, 300]
       * }
       * ```
       *
       * while the inner `requestMetrics.getMetrics()` would be:
       *
       * ```
       * {
       *   buildRequests: 10,
       *   processRequest: 100 // or 200 for the 2nd loop, etc
       * }
       * ```
       */
      function fork({
        propagate = true,
        stopPropagation = false,
        includeGroups = false
      } = {}) {
        return makeMetrics(mkNode([[self, {
          propagate,
          stopPropagation,
          includeGroups
        }]]), rename);
      }

      /**
       * Join `otherMetrics` with these; all metrics from `otherMetrics` will (by default) be propagated here,
       * and all metrics from here will be included in `otherMetrics`.
       */
      function join(otherMetrics, {
        propagate = true,
        stopPropagation = false,
        includeGroups = false
      } = {}) {
        const other = nodes.get(otherMetrics);
        if (other != null) {
          other.addParent(self, {
            propagate,
            stopPropagation,
            includeGroups
          });
        }
      }

      /**
       * @return a version of these metrics with the same propagation rules, but:
       *  - all metrics are renamed according to `renameFn`, or
       *  - without these metrics' rename rule (if `renameFn` is omitted).
       */
      function renameWith(renameFn) {
        return makeMetrics(self, renameFn);
      }

      /**
       * @return a new metrics object that uses the same propagation and renaming rules as this one.
       */
      function newMetrics() {
        return makeMetrics(self.newSibling(), rename);
      }
      const metrics = {
        startTiming,
        measureTime,
        measureHookTime,
        checkpoint,
        timeSince,
        timeBetween,
        setMetric,
        getMetrics,
        fork,
        join,
        newMetrics,
        renameWith,
        toJSON() {
          return getMetrics();
        }
      };
      nodes.set(metrics, self);
      return metrics;
    }
    return makeMetrics(mkNode([]));
  };
}
function makeTimer(now, cb) {
  const start = now();
  let done = false;
  function stopTiming() {
    if (!done) {
      cb(now() - start);
      done = true;
    }
  }
  stopTiming.stopBefore = fn => wrapFn(fn, stopTiming);
  stopTiming.stopAfter = fn => wrapFn(fn, null, stopTiming);
  return stopTiming;
}
function makeNode(parents) {
  return {
    metrics: {},
    timestamps: {},
    groups: {},
    addParent(node, edge) {
      parents.push([node, edge]);
    },
    newSibling() {
      return makeNode(parents.slice());
    },
    dfWalk({
      visit,
      follow = () => true,
      visited = new Set(),
      inEdge
    } = {}) {
      let res;
      if (!visited.has(this)) {
        visited.add(this);
        res = visit(inEdge, this);
        if (res != null) return res;
        for (const [parent, outEdge] of parents) {
          if (follow(inEdge, outEdge)) {
            res = parent.dfWalk({
              visit,
              follow,
              visited,
              inEdge: outEdge
            });
            if (res != null) return res;
          }
        }
      }
    }
  };
}
const nullMetrics = (() => {
  const nop = function () {};
  const empty = () => ({});
  const none = {
    forEach: nop
  };
  const nullTimer = () => null;
  nullTimer.stopBefore = fn => fn;
  nullTimer.stopAfter = fn => fn;
  const nullNode = Object.defineProperties({
    dfWalk: nop,
    newSibling: () => nullNode,
    addParent: nop
  }, Object.fromEntries(['metrics', 'timestamps', 'groups'].map(prop => [prop, {
    get: empty
  }])));
  return metricsFactory({
    now: () => 0,
    mkNode: () => nullNode,
    mkRenamer: () => () => none,
    mkTimer: () => nullTimer,
    nodes: {
      get: nop,
      set: nop
    }
  })();
})();
let enabled = true;
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig(CONFIG_TOGGLE, cfg => {
  enabled = !!cfg[CONFIG_TOGGLE];
});

/**
 * convenience fallback function for metrics that may be undefined, especially during tests.
 */
function useMetrics(metrics) {
  return enabled && metrics || nullMetrics;
}
const newMetrics = (() => {
  const makeMetrics = metricsFactory();
  return function () {
    return enabled ? makeMetrics() : nullMetrics;
  };
})();
function hookTimer(prefix, getMetrics) {
  return function (name, hookFn) {
    return (next, ...args) => {
      return useMetrics(getMetrics.apply(this, args)).measureHookTime(prefix + name, next, next => {
        return hookFn.call(this, next, ...args);
      });
    };
  };
}
const timedAuctionHook = hookTimer('requestBids.', req => req.metrics);
const timedBidResponseHook = hookTimer('addBidResponse.', (_, bid) => bid.metrics);

/***/ },

/***/ "./src/utils/prerendering.js"
/*!***********************************!*\
  !*** ./src/utils/prerendering.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   delayIfPrerendering: () => (/* binding */ delayIfPrerendering)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");

/**
 * Returns a wrapper around fn that delays execution until the page if activated, if it was prerendered and isDelayEnabled returns true.
 * https://developer.chrome.com/docs/web-platform/prerender-pages
 */
function delayIfPrerendering(isDelayEnabled, fn) {
  return (...args) => {
    if (document.prerendering && isDelayEnabled()) {
      return new Promise(resolve => {
        document.addEventListener('prerenderingchange', () => {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)(`Auctions were suspended while page was prerendering`);
          resolve(fn.apply(this, args));
        }, {
          once: true
        });
      });
    } else {
      return Promise.resolve(fn.apply(this, args));
    }
  };
}

/***/ },

/***/ "./src/utils/promise.js"
/*!******************************!*\
  !*** ./src/utils/promise.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PbPromise: () => (/* binding */ PbPromise),
/* harmony export */   defer: () => (/* binding */ defer),
/* harmony export */   urgentDelay: () => (/* binding */ urgentDelay)
/* harmony export */ });
/* unused harmony exports pbSetTimeout, delay */
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../prebidGlobal.js */ "./src/prebidGlobal.js");


const pbSetTimeout = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)().setTimeout ?? ( false ? 0 : setTimeout);
const PbPromise = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)().Promise ?? ( false ? 0 : Promise);
function delay(delayMs = 0) {
  return new PbPromise(resolve => {
    pbSetTimeout(resolve, delayMs);
  });
}

/**
 * Like `delay`, but asks for high priority scheduling, so that the continuation is dispatched ahead
 * of ordinary timers and network callbacks once the main thread frees up. Use this where a timeout
 * is meant to act as an upper bound: plain timers queue behind work that is already pending, which
 * on a busy page can put them arbitrarily far past their deadline.
 *
 * This is not a real time guarantee. Nothing in JS preempts a running task, so a single long task
 * still pushes the continuation past `delayMs`; what this bounds is the wait by the longest blocking
 * task rather than by the whole backlog of ready work.
 */
function urgentDelay(delayMs = 0) {
  const scheduler = window.scheduler;
  if (typeof scheduler?.postTask === 'function') {
    try {
      return PbPromise.resolve(scheduler.postTask(() => {}, {
        priority: 'user-blocking',
        delay: delayMs
      })
      // a task can only be aborted through a signal, which is not used here; resolve regardless so
      // that callers racing against this never stall on a rejection
      ).catch(() => {});
    } catch (e) {
      // options rejected by this implementation of postTask; fall back to a timer
    }
  }
  return delay(delayMs);
}
/**
 * @returns a {promise, resolve, reject} trio where `promise` is resolved by calling `resolve` or `reject`.
 */
function defer({
  promiseFactory = resolver => new PbPromise(resolver)
} = {}) {
  function invoker(delegate) {
    return val => delegate(val);
  }
  let resolveFn, rejectFn;
  return {
    promise: promiseFactory((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    }),
    resolve: invoker(resolveFn),
    reject: invoker(rejectFn)
  };
}

/***/ },

/***/ "./src/utils/reducers.js"
/*!*******************************!*\
  !*** ./src/utils/reducers.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHighestCpm: () => (/* binding */ getHighestCpm),
/* harmony export */   getHighestDesirability: () => (/* binding */ getHighestDesirability),
/* harmony export */   getOldestHighestCpmBid: () => (/* binding */ getOldestHighestCpmBid)
/* harmony export */ });
/* unused harmony exports simpleCompare, keyCompare, reverseCompare, tiebreakCompare, minimum, maximum, getLatestHighestCpmBid */
function simpleCompare(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
function keyCompare(key = item => item) {
  return (a, b) => simpleCompare(key(a), key(b));
}
function reverseCompare(compare = simpleCompare) {
  return (a, b) => -compare(a, b) || 0;
}
function tiebreakCompare(...compares) {
  return function (a, b) {
    for (const cmp of compares) {
      const val = cmp(a, b);
      if (val !== 0) return val;
    }
    return 0;
  };
}
function minimum(compare = simpleCompare) {
  return (min, item) => compare(item, min) < 0 ? item : min;
}
function maximum(compare = simpleCompare) {
  return minimum(reverseCompare(compare));
}
const cpmCompare = keyCompare(bid => bid.cpm);
const timestampCompare = keyCompare(bid => bid.responseTimestamp);

// This function will get highest cpm value bid, in case of tie it will return the bid with lowest timeToRespond
const getHighestCpm = maximum(tiebreakCompare(cpmCompare, reverseCompare(keyCompare(bid => bid.timeToRespond))));
const bidDesirabilityCompare = keyCompare(bid => bid.desirability);

// This function will get highest bid by `.desirability` (publisher `bidDesirabilityAdjustment` when set, else mirrors cpm via `adjustBids`);
// ties use lowest `timeToRespond`, matching {@link getHighestCpm}.
const getHighestDesirability = maximum(tiebreakCompare(bidDesirabilityCompare, reverseCompare(keyCompare(bid => bid.timeToRespond))));

// This function will get the oldest highest cpm value bid, in case of tie it will return the bid which came in first
// Use case for tie: https://github.com/prebid/Prebid.js/issues/2448
const getOldestHighestCpmBid = maximum(tiebreakCompare(cpmCompare, reverseCompare(timestampCompare)));

// This function will get the latest highest cpm value bid, in case of tie it will return the bid which came in last
// Use case for tie: https://github.com/prebid/Prebid.js/issues/2539
const getLatestHighestCpmBid = maximum(tiebreakCompare(cpmCompare, timestampCompare));

/***/ },

/***/ "./src/utils/ttlCollection.js"
/*!************************************!*\
  !*** ./src/utils/ttlCollection.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ttlCollection: () => (/* binding */ ttlCollection)
/* harmony export */ });
/* harmony import */ var _promise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./promise.js */ "./src/utils/promise.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _focusTimeout_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./focusTimeout.js */ "./src/utils/focusTimeout.js");



/**
 * Create a set-like collection that automatically forgets items after a certain time.
 */
function ttlCollection({
  startTime = _utils_js__WEBPACK_IMPORTED_MODULE_1__.timestamp,
  ttl = () => null,
  monotonic = false,
  slack = 5000
} = {}) {
  const items = new Map();
  const callbacks = [];
  const pendingPurge = [];
  const markForPurge = monotonic ? entry => pendingPurge.push(entry) : entry => pendingPurge.splice((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.binarySearch)(pendingPurge, entry, el => el.expiry), 0, entry);
  let nextPurge, task;
  function reschedulePurge() {
    task && clearTimeout(task());
    if (pendingPurge.length > 0) {
      const now = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.timestamp)();
      nextPurge = Math.max(now, pendingPurge[0].expiry + slack);
      task = (0,_focusTimeout_js__WEBPACK_IMPORTED_MODULE_2__.setFocusTimeout)(() => {
        const now = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.timestamp)();
        let cnt = 0;
        for (const entry of pendingPurge) {
          if (entry.expiry > now) break;
          callbacks.forEach(cb => {
            try {
              cb(entry.item);
            } catch (e) {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(e);
            }
          });
          items.delete(entry.item);
          cnt++;
        }
        pendingPurge.splice(0, cnt);
        task = null;
        reschedulePurge();
      }, nextPurge - now);
    } else {
      task = null;
    }
  }
  function mkEntry(item) {
    const values = {};
    const thisCohort = currentCohort;
    let expiry;
    function update() {
      if (thisCohort === currentCohort && values.start != null && values.delta != null) {
        expiry = values.start + values.delta;
        markForPurge(entry);
        if (task == null || nextPurge > expiry + slack) {
          reschedulePurge();
        }
      }
    }
    const [init, refresh] = Object.entries({
      start: startTime,
      delta: ttl
    }).map(([field, getter]) => {
      let currentCall;
      return function () {
        const thisCall = currentCall = {};
        _promise_js__WEBPACK_IMPORTED_MODULE_0__.PbPromise.resolve(getter(item)).then(val => {
          if (thisCall === currentCall) {
            values[field] = val;
            update();
          }
        });
      };
    });
    const entry = {
      item,
      refresh,
      get expiry() {
        return expiry;
      }
    };
    init();
    refresh();
    return entry;
  }
  let currentCohort = {};
  return {
    [Symbol.iterator]: () => items.keys(),
    /**
     * Add an item to this collection.
     * @param item
     */
    add(item) {
      !items.has(item) && items.set(item, mkEntry(item));
    },
    has(item) {
      return items.has(item);
    },
    delete(item) {
      const toBeDeleted = items.get(item);
      if (toBeDeleted) {
        for (let i = 0; i < pendingPurge.length && pendingPurge[i].expiry <= toBeDeleted.expiry; i++) {
          if (pendingPurge[i] === toBeDeleted) {
            pendingPurge.splice(i, 1);
            break;
          }
        }
      }
      return items.delete(item);
    },
    /**
     * Clear this collection.
     */
    clear() {
      pendingPurge.length = 0;
      reschedulePurge();
      items.clear();
      currentCohort = {};
    },
    /**
     * @returns {[]} all the items in this collection, in insertion order.
     */
    toArray() {
      return Array.from(items.keys());
    },
    /**
     * Refresh the TTL for each item in this collection.
     */
    refresh() {
      pendingPurge.length = 0;
      reschedulePurge();
      for (const entry of items.values()) {
        entry.refresh();
      }
    },
    /**
     * Register a callback to be run when an item has expired and is about to be
     * removed the from the collection.
     * @param cb a callback that takes the expired item as argument
     * @return an unregistration function.
     */
    onExpiry(cb) {
      callbacks.push(cb);
      return () => {
        const idx = callbacks.indexOf(cb);
        if (idx >= 0) {
          callbacks.splice(idx, 1);
        }
      };
    }
  };
}

/***/ },

/***/ "./src/utils/untrustedJson.js"
/*!************************************!*\
  !*** ./src/utils/untrustedJson.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseUntrustedJSON: () => (/* binding */ parseUntrustedJSON)
/* harmony export */ });
/* harmony import */ var _logging_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logging.js */ "./src/utils/logging.js");
/**
 * JSON parsing for the text core turns into objects on an adapter's behalf: a bidder's HTTP
 * response body, Prebid Server's auction and cookie-sync bodies, and a native `adm` document
 * carried as a string inside any of them, which the outer parse cannot see into.
 *
 * What sits outside is text an adapter parses for itself - its own endpoint, or its own `adm`
 * handling. There are dozens of those, in vendor helpers under `libraries/` and in adapters
 * directly; they own that choice and can call this.
 *
 * `JSON.parse` is not itself unsafe: a `"__proto__"` key in the text becomes an ordinary own
 * property rather than changing the object's prototype. The exposure is downstream, in code that
 * folds a response into an object of its own. Two shapes of recursive merge, two routes:
 *
 *   target[key] = value                  assignment. `target.__proto__ = value` reaches the
 *                                        prototype, because the name resolves to the inherited
 *                                        setter. The name is what matters, so removing it works.
 *
 *   target[key] = target[key] || {}      the left side is a *read*, which walks the prototype
 *   merge(target[key], source[key])      chain, so for any inherited name that line copies the
 *                                        shared object onto `target` - `constructor` resolves to
 *                                        the `Object` function, `hasOwnProperty` to that method.
 *                                        The descent on the next line then assigns into it.
 *
 * Removed here: `__proto__`, which carries the first route; and `constructor` whenever it holds an
 * object, which carries the second one to `Object` itself, where a write lands on `Object.keys` or
 * `Object.assign` and breaks the page. A `constructor` holding anything that is not an object -
 * a string, a number, a boolean, `null` - is kept: a merge cannot recurse into it.
 *
 * The rest of the second route is not filtered here. Dropping every name that appears on
 * `Object.prototype` takes legitimate response fields called `toString` or `valueOf` with it, and
 * makes which fields survive depend on what other scripts on the page have added to
 * `Object.prototype`. What closes that route is the merge rather than the parse: skip the two names
 * outright, and test each value's type before recursing so that an inherited method is replaced
 * rather than merged into. `mergeDeep` in src/utils.js does both.
 *
 * Why a walk after parsing rather than a `JSON.parse` reviver, which would be one pass and would
 * never let the key land: the reviver's internalization is recursive, so supplying one imposes a
 * nesting limit an order of magnitude below what plain `JSON.parse` accepts. The depth is
 * attacker-chosen, and the `RangeError` would surface at the call sites as "that body was not
 * JSON", handing the raw body on as a string. The walk below is iterative for the same reason.
 *
 * `safeJSONParse` in src/utils.js is a different function with a different contract. Check which
 * one you want rather than picking by name.
 */


const PROTO_KEY = '__proto__';
const CONSTRUCTOR_KEY = 'constructor';

/**
 * Captured at module load, which precedes any response.
 *
 * A guard that reads `Object.keys` or `Object.prototype.hasOwnProperty.call` at call time depends
 * on globals that the merges above can overwrite - `constructor` reaches the first, `hasOwnProperty`
 * the second. It would then throw rather than strip, and both callers read a throw as "that body
 * was not JSON", or as a bid that could not be built. One such response would cost every later
 * one: the bidder body handed on as raw text, the server auction and its user syncs dropped, a
 * native bid skipped.
 *
 * The array methods used below are not captured. What keeps them out of reach is this guard's own
 * removal of object-valued `constructor`, not anything about the language: in sloppy mode - a
 * publisher's inline `<script>`, which is the merge this exists to backstop - a merge over
 * `{"constructor":{"prototype":{"pop":1}}}` does replace `Array.prototype.pop`. Text this guard
 * never sees can still do that, and the walk below would then throw on every later body.
 */
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ownKeys = Object.keys;

/**
 * Deletes those keys wherever they appear, in place.
 *
 * Iterative, so that response nesting cannot overflow the stack, and over own keys only: walking
 * inherited keys would visit whatever the page has put on `Object.prototype` - including, when
 * that value is an object, itself, without end.
 *
 * Unconditional. A pre-check on the raw text is possible - it has to match every `\uXXXX` spelling
 * of each key, not just the literal one - and it is not worth the second thing to get right: the
 * walk costs a fraction of the parse it follows.
 */
function stripGadgetKeys(root) {
  let protos = 0;
  let constructors = 0;
  const pending = [root];
  while (pending.length) {
    const node = pending.pop();
    if (hasOwn(node, PROTO_KEY)) {
      delete node[PROTO_KEY];
      protos++;
    }
    if (hasOwn(node, CONSTRUCTOR_KEY)) {
      const value = node[CONSTRUCTOR_KEY];
      if (value !== null && typeof value === 'object') {
        // When it is the gadget shape, the whole key goes, siblings of `prototype` included - the
        // key is what a merge follows, so keeping a pruned version of it would not be safer.
        delete node[CONSTRUCTOR_KEY];
        constructors++;
      }
    }
    ownKeys(node).forEach(key => {
      const value = node[key];
      if (value !== null && typeof value === 'object') {
        pending.push(value);
      }
    });
  }
  if (protos || constructors) {
    // Once per parse, not once per key: a hostile payload can carry thousands, and the point is to
    // leave something for a bidder debugging a missing field, not to narrate an attack. Note
    // `logWarn` also emits an AUCTION_DEBUG event, so this is visible to analytics, not only to a
    // console with debug on.
    (0,_logging_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('Removed keys from a response that could let a recursive merge reach Object.prototype:' + (protos ? ` ${PROTO_KEY} (${protos})` : '') + (constructors ? ` ${CONSTRUCTOR_KEY} (${constructors})` : ''));
  }
  return root;
}

/**
 * Parses JSON that came from outside the page.
 *
 * Throws what `JSON.parse` throws on text that is not JSON, so a caller's existing handling of an
 * unparseable body is unchanged. Text that parses always yields a value.
 */
function parseUntrustedJSON(text) {
  const parsed = JSON.parse(text);
  return parsed !== null && typeof parsed === 'object' ? stripGadgetKeys(parsed) : parsed;
}

/***/ },

/***/ "./src/utils/winDimensions.js"
/*!************************************!*\
  !*** ./src/utils/winDimensions.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getScreenOrientation: () => (/* binding */ getScreenOrientation),
/* harmony export */   getWinDimensions: () => (/* binding */ getWinDimensions),
/* harmony export */   resetWinDimensions: () => (/* binding */ resetWinDimensions)
/* harmony export */ });
/* unused harmony export internal */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _cachedApiWrapper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cachedApiWrapper.js */ "./src/utils/cachedApiWrapper.js");


const CHECK_INTERVAL_MS = 20;
const winDimensions = new _cachedApiWrapper_js__WEBPACK_IMPORTED_MODULE_1__.CachedApiWrapper(() => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.canAccessWindowTop)() ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.internal.getWindowTop() : _utils_js__WEBPACK_IMPORTED_MODULE_0__.internal.getWindowSelf(), {
  innerHeight: true,
  innerWidth: true,
  screen: {
    width: true,
    height: true
  },
  visualViewport: {
    width: true,
    height: true
  },
  document: {
    documentElement: {
      clientWidth: true,
      clientHeight: true,
      scrollTop: true,
      scrollLeft: true
    },
    body: {
      scrollTop: true,
      scrollLeft: true,
      clientWidth: true,
      clientHeight: true
    }
  }
});
const internal = {
  winDimensions
};
const getWinDimensions = (() => {
  let lastCheckTimestamp;
  return function () {
    if (!lastCheckTimestamp || Date.now() - lastCheckTimestamp > CHECK_INTERVAL_MS) {
      internal.winDimensions.reset();
      lastCheckTimestamp = Date.now();
    }
    return internal.winDimensions.obj;
  };
})();
function resetWinDimensions() {
  internal.winDimensions.reset();
}
function getScreenOrientation(win) {
  const fallbackWin = win ?? ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.canAccessWindowTop)() ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.internal.getWindowTop() : _utils_js__WEBPACK_IMPORTED_MODULE_0__.internal.getWindowSelf());
  const screenData = fallbackWin?.screen ?? _utils_js__WEBPACK_IMPORTED_MODULE_0__.internal.getWindowSelf()?.screen ?? window?.screen;
  const width = Number(screenData?.width);
  const height = Number(screenData?.height);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return;
  }
  return height >= width ? 'portrait' : 'landscape';
}

/***/ },

/***/ "./src/utils/wrapsInBids.js"
/*!**********************************!*\
  !*** ./src/utils/wrapsInBids.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wrapInBids: () => (/* binding */ wrapInBids)
/* harmony export */ });
function wrapInBids(arr) {
  const wrapped = arr.slice();
  wrapped.bids = wrapped;
  return wrapped;
}

/***/ },

/***/ "./src/utils/xml.js"
/*!**************************!*\
  !*** ./src/utils/xml.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attributeValue: () => (/* binding */ attributeValue),
/* harmony export */   cdata: () => (/* binding */ cdata)
/* harmony export */ });
// This module, and the calls to it in videoCache and vastXmlBuilder, were written by a bot
// (Claude Code).

/**
 * Helpers for placing untrusted text into XML that is built by string concatenation.
 *
 * Element and attribute names in the documents Prebid generates are literals, so the values
 * interpolated between them are the only place a document's structure can be altered.
 */

/**
 * Wraps text in a CDATA section.
 *
 * A CDATA section ends at the first ']]>', so text containing that sequence is split across two
 * sections. A parser reading the result back sees the original text, including the ']]>'.
 */
function cdata(text) {
  return `<![CDATA[${String(text).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

/**
 * Escapes text for use as a double-quoted XML attribute value.
 *
 * Expects raw text: this replaces '&' with an entity reference, so applying it to its own output
 * would escape the ampersands it just produced.
 */
function attributeValue(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

/***/ },

/***/ "./src/utils/yield.js"
/*!****************************!*\
  !*** ./src/utils/yield.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   yieldAll: () => (/* binding */ yieldAll),
/* harmony export */   yieldsIf: () => (/* binding */ yieldsIf)
/* harmony export */ });
/* unused harmony exports pbYield, serialize */
/* harmony import */ var _promise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./promise.js */ "./src/utils/promise.js");

function doYield() {
  const scheduler = window.scheduler;
  return typeof scheduler?.yield === 'function' ? scheduler.yield() : _promise_js__WEBPACK_IMPORTED_MODULE_0__.PbPromise.resolve();
}

/**
 * Runs `cb`, after yielding the main thread if `shouldYield` returns true.
 */
function pbYield(shouldYield, cb) {
  if (shouldYield()) {
    doYield().then(cb);
  } else {
    cb();
  }
}

/**
 * Returns a wrapper around `fn` that yields the main thread if `shouldYield` returns true.
 */
function yieldsIf(shouldYield, fn) {
  return function (...args) {
    pbYield(shouldYield, () => {
      fn.apply(this, args);
    });
  };
}

/**
 * Runs each function in `fns`, yielding the main thread in between each one if `shouldYield` returns true.
 * Runs `cb` after all functions have been run.
 */
function yieldAll(shouldYield, fns, cb) {
  serialize(fns.map(fn => cb => {
    pbYield(shouldYield, () => {
      fn();
      cb();
    });
  }), cb);
}
function serialize(fns, cb) {
  let i = 0;
  function next() {
    if (fns.length > i) {
      i += 1;
      fns[i - 1](next);
    } else if (typeof cb === 'function') {
      cb();
    }
  }
  next();
}

/***/ },

/***/ "./src/video.js"
/*!**********************!*\
  !*** ./src/video.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ORTB_VIDEO_PARAMS: () => (/* binding */ ORTB_VIDEO_PARAMS),
/* harmony export */   OUTSTREAM: () => (/* binding */ OUTSTREAM),
/* harmony export */   fillVideoDefaults: () => (/* binding */ fillVideoDefaults),
/* harmony export */   isValidVideoBid: () => (/* binding */ isValidVideoBid)
/* harmony export */ });
/* unused harmony exports INSTREAM, checkVideoBidSetup */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils/objects.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _buildOptions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./buildOptions.js */ "./src/buildOptions.js");





const OUTSTREAM = 'outstream';
const INSTREAM = 'instream';
const ORTB_PARAMS = [['mimes', value => Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string')], ['minduration', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['maxduration', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['startdelay', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['maxseq', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['poddur', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['protocols', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['w', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['h', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['podid', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr], ['podseq', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['rqddurs', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['placement', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger],
// deprecated, see plcmt
['plcmt', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['linearity', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['skip', value => [1, 0].includes(value)], ['skipmin', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['skipafter', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['sequence', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger],
// deprecated
['slotinpod', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['mincpmpersec', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber], ['battr', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['maxextended', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['minbitrate', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['maxbitrate', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['boxingallowed', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['playbackmethod', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['playbackend', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['delivery', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['pos', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isInteger], ['api', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['companiontype', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums], ['poddedupe', _utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums]];

/**
 * List of OpenRTB 2.x video object properties with simple validators.
 * Not included: `companionad`, `durfloors`, `ext`
 * reference: https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md
 */
const ORTB_VIDEO_PARAMS = new Map(ORTB_PARAMS);
function hasRenderer(subject) {
  return !!(subject?.renderer || subject?.safeRenderer);
}
function fillVideoDefaults(adUnit) {
  const video = adUnit?.mediaTypes?.video;
  if (video != null) {
    if (video.plcmt == null) {
      if (video.context === OUTSTREAM || [2, 3, 4].includes(video.placement)) {
        video.plcmt = 4;
      } else if (video.playbackmethod?.some?.(method => [2, 6].includes(method))) {
        video.plcmt = 2;
      }
    }
    const playerSize = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums)(video.playerSize, 2) ? video.playerSize : Array.isArray(video.playerSize) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArrayOfNums)(video.playerSize[0]) ? video.playerSize[0] : null;
    const size = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(video.w) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(video.h) ? [video.w, video.h] : null;
    let conflict = false;
    if (playerSize == null) {
      if (size != null) {
        if (video.playerSize != null) {
          conflict = true;
        } else {
          video.playerSize = [size];
        }
      }
    } else {
      ['w', 'h'].forEach((prop, i) => {
        if (video[prop] != null && video[prop] !== playerSize[i]) {
          conflict = true;
        } else {
          video[prop] = playerSize[i];
        }
      });
    }
    if (conflict) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Ad unit "${adUnit.code} has conflicting playerSize and w/h`, adUnit);
    }
  }
}

/**
 * Validate that the assets required for video context are present on the bid
 */
function isValidVideoBid(bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_4__.auctionManager.index
} = {}) {
  const videoMediaType = index.getMediaTypes(bid)?.video;
  const context = videoMediaType && videoMediaType?.context;
  const useCacheKey = videoMediaType && videoMediaType?.useCacheKey;
  const adUnit = index.getAdUnit(bid);

  // if context not defined assume default 'instream' for video bids
  // instream bids require a vast url or vast xml content
  return checkVideoBidSetup(bid, adUnit, videoMediaType, context, useCacheKey);
}
const checkVideoBidSetup = (0,_hook_js__WEBPACK_IMPORTED_MODULE_3__.hook)('sync', function (bid, adUnit, videoMediaType, context, useCacheKey) {
  if (videoMediaType && (useCacheKey || context !== OUTSTREAM)) {
    // xml-only video bids require a prebid cache url
    const {
      url,
      useLocal,
      allowVastXmlOnly
    } = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('cache') || {};
    if (!url && !useLocal && bid.vastXml && !bid.vastUrl) {
      if (allowVastXmlOnly === true) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`This bid contains only vastXml, and caching is disabled. Proceeding because cache.allowVastXmlOnly is enabled.`);
        return true;
      }
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`
        This bid contains only vastXml and will not work when a prebid cache url is not specified.
        Try enabling either prebid cache with ${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_5__.getGlobalVarName)()}.setConfig({ cache: {url: "..."} });
        or local cache with ${(0,_buildOptions_js__WEBPACK_IMPORTED_MODULE_5__.getGlobalVarName)()}.setConfig({ cache: { useLocal: true }});
      `);
      return false;
    }
    return !!(bid.vastUrl || bid.vastXml);
  }

  // outstream bids require a renderer on the bid or pub-defined on adunit
  if (context === OUTSTREAM && !useCacheKey) {
    return hasRenderer(bid) || hasRenderer(adUnit) || hasRenderer(videoMediaType);
  }
  return true;
}, 'checkVideoBidSetup');

/***/ },

/***/ "./src/videoCache.js"
/*!***************************!*\
  !*** ./src/videoCache.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleVideoBidCaching: () => (/* binding */ handleVideoBidCaching)
/* harmony export */ });
/* unused harmony exports vastLocalCache, store, getCacheUrl, storeLocally, updateVast, _internal, storeBatch, batchingCache, batchAndStore, callPrebidCache */
/* harmony import */ var _ajax_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajax.js */ "./src/ajax.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_xml_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/xml.js */ "./src/utils/xml.js");
/* harmony import */ var _auction_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auction.js */ "./src/auction.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./video.js */ "./src/video.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/**
 * This module interacts with the server used to cache video ad content to be restored later.
 * At a high level, the expected workflow goes like this:
 *
 *   - Request video ads from Bidders
 *   - Generate IDs for each valid bid, and cache the key/value pair on the server.
 *   - Return these IDs so that publishers can use them to fetch the bids later.
 *
 * This trickery helps integrate with ad servers, which set character limits on request params.
 */











/**
 * Might be useful to be configurable in the future
 * Depending on publisher needs
 */
// TODO: we have a `ttlBuffer` setting
const ttlBufferInSeconds = 15;
const vastLocalCache = new Map();

/**
 * VAST Trackers interface for video cache
 */

/**
 * Function which wraps a URI that serves VAST XML, so that it can be loaded.
 *
 * @param uri The URI where the VAST content can be found.
 * @param trackers VAST trackers object containing impression, error, and trackingEvents
 * @return A VAST URL which loads XML from the given URI.
 */
function wrapURI(uri, trackers) {
  // Build Impression tags
  const impressions = trackers?.impression?.length ? trackers.impression.map(trk => `<Impression>${(0,_utils_xml_js__WEBPACK_IMPORTED_MODULE_4__.cdata)(trk)}</Impression>`).join('') : '';

  // Build Error tags
  const errors = trackers?.error?.length ? trackers.error.map(trk => `<Error>${(0,_utils_xml_js__WEBPACK_IMPORTED_MODULE_4__.cdata)(trk)}</Error>`).join('') : '';

  // Build TrackingEvents for Linear creative
  let trackingEventsXml = '';
  if (trackers?.trackingEvents?.length) {
    const trackingTags = trackers.trackingEvents.map(({
      event,
      url
    }) => `<Tracking event="${(0,_utils_xml_js__WEBPACK_IMPORTED_MODULE_4__.attributeValue)(event)}">${(0,_utils_xml_js__WEBPACK_IMPORTED_MODULE_4__.cdata)(url)}</Tracking>`).join('');
    trackingEventsXml = `<Creative><Linear><TrackingEvents>${trackingTags}</TrackingEvents></Linear></Creative>`;
  }
  return '<VAST version="3.0">' + '<Ad>' + '<Wrapper>' + '<AdSystem>prebid.org wrapper</AdSystem>' + '<VASTAdTagURI>' + (0,_utils_xml_js__WEBPACK_IMPORTED_MODULE_4__.cdata)(uri) + '</VASTAdTagURI>' + impressions + errors + '<Creatives>' + trackingEventsXml + '</Creatives>' + '</Wrapper>' + '</Ad>' + '</VAST>';
}
/**
 * Wraps a bid in the format expected by the prebid-server endpoints, or returns null if
 * the bid can't be converted cleanly.
 *
 * @return {Object|null} - The payload to be sent to the prebid-server endpoints, or null if the bid can't be converted cleanly.
 */
function toStorageRequest(bid, {
  index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index
} = {}) {
  const vastValue = bid.vastXml;
  const auction = index.getAuction(bid);
  const ttlWithBuffer = Number(bid.ttl) + ttlBufferInSeconds;
  const payload = {
    type: 'xml',
    value: vastValue,
    ttlseconds: ttlWithBuffer
  };
  if (_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.vasttrack')) {
    payload.bidder = bid.bidder;
    payload.bidid = bid.requestId;
    payload.aid = bid.auctionId;
  }
  if (auction != null) {
    payload.timestamp = auction.getAuctionStart();
  }
  if (typeof bid.customCacheKey === 'string' && bid.customCacheKey !== '') {
    payload.key = bid.customCacheKey;
  }
  return payload;
}
/**
 * A function which bridges the APIs between the videoCacheStoreCallback and our ajax function's API.
 *
 * @param done A callback to the "store" function.
 */
function shimStorageCallback(done) {
  return {
    success: function (responseBody) {
      let ids;
      try {
        ids = JSON.parse(responseBody).responses;
      } catch (e) {
        done(e, []);
        return;
      }
      if (ids) {
        done(null, ids);
      } else {
        done(new Error("The cache server didn't respond with a responses property."), []);
      }
    },
    error: function (statusText, responseBody) {
      done(new Error(`Error storing video ad in the cache: ${statusText}: ${JSON.stringify(responseBody)}`), []);
    }
  };
}

/**
 * If the given bid is for a Video ad, generate a unique ID and cache it somewhere server-side.
 *
 * @param bids A list of bid objects which should be cached.
 * @param done An optional callback which should be executed after
 * @param getAjax
 * the data has been stored in the cache.
 */
function store(bids, done, getAjax = timeout => (0,_ajax_js__WEBPACK_IMPORTED_MODULE_0__.qualifiedAjaxBuilder)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_PREBID, 'cache', timeout)) {
  const requestData = {
    puts: bids.map(bid => toStorageRequest(bid))
  };
  const ajax = getAjax(_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.timeout'));
  ajax(_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.url'), shimStorageCallback(done), JSON.stringify(requestData), {
    contentType: 'text/plain',
    withCredentials: true
  });
}
function getCacheUrl(cacheUrl, id) {
  return `${cacheUrl}?uuid=${id}`;
}
const storeLocally = bid => {
  const vastXml = bid.vastXml;
  const bidVastUrl = URL.createObjectURL(new Blob([vastXml], {
    type: 'text/xml'
  }));
  assignVastUrlAndCacheId(bid, bidVastUrl);
  vastLocalCache.set(bid.videoCacheKey, bidVastUrl);
};

/**
 * Handles cache/local-cache flow for a video bid before adding it to auction.
 * Returns `true` when caller should continue normal addBid flow, `false` when processing is deferred or bid is invalid.
 */
function handleVideoBidCaching({
  bidResponse,
  auctionInstance,
  afterBidAdded,
  videoMediaType
}) {
  updateVast(bidResponse);
  const context = videoMediaType && videoMediaType?.context;
  const useCacheKey = videoMediaType && videoMediaType?.useCacheKey;
  const {
    useLocal,
    url: cacheUrl,
    ignoreBidderCacheKey
  } = _config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache') || {};
  const shouldUseCache = (useLocal || cacheUrl) && (useCacheKey || context !== _video_js__WEBPACK_IMPORTED_MODULE_7__.OUTSTREAM);
  const shouldStoreBid = !bidResponse.videoCacheKey || ignoreBidderCacheKey;
  if (shouldUseCache && shouldStoreBid) {
    callPrebidCache(auctionInstance, bidResponse, afterBidAdded, videoMediaType);
    return;
  }
  if (shouldUseCache && !shouldStoreBid && !bidResponse.vastUrl) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('videoCacheKey specified but not required vastUrl for video bid');
    return;
  }
  (0,_auction_js__WEBPACK_IMPORTED_MODULE_5__.addBidToAuction)(auctionInstance, bidResponse);
  afterBidAdded();
}
const updateVast = (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('sync', function (bidResponse) {
  if (!bidResponse.vastXml && bidResponse.vastUrl) {
    bidResponse.vastXml = wrapURI(bidResponse.vastUrl, bidResponse.vastTrackers);
  }
}, 'updateVast');
const assignVastUrlAndCacheId = (bid, vastUrl, videoCacheKey) => {
  bid.videoCacheKey = videoCacheKey || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.generateUUID)();
  if (!bid.vastUrl) {
    bid.vastUrl = vastUrl;
  }
};
const _internal = {
  store
};
function storeBatch(batch) {
  const bids = batch.map(entry => entry.bidResponse);
  function err(msg) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)(`Failed to save to the video cache: ${msg}. Video bids will be discarded:`, bids);
  }
  const cacheUrl = _config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.url');
  _internal.store(bids, function (error, cacheIds) {
    if (error) {
      err(error);
    } else if (batch.length !== cacheIds.length) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)(`expected ${batch.length} cache IDs, got ${cacheIds.length} instead`);
    } else {
      cacheIds.forEach((cacheId, i) => {
        const {
          auctionInstance,
          bidResponse,
          afterBidAdded
        } = batch[i];
        if (cacheId.uuid === '') {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)(`Supplied video cache key was already in use by Prebid Cache; caching attempt was rejected. Video bid must be discarded.`);
        } else {
          bidResponse.cacheUrl = cacheUrl;
          assignVastUrlAndCacheId(bidResponse, getCacheUrl(cacheUrl, cacheId.uuid), cacheId.uuid);
          (0,_auction_js__WEBPACK_IMPORTED_MODULE_5__.addBidToAuction)(auctionInstance, bidResponse);
          afterBidAdded();
        }
      });
    }
  });
}
let batchSize, batchTimeout, cleanupHandler;
if (true) {
  _config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache', ({
    cache
  }) => {
    batchSize = typeof cache.batchSize === 'number' && cache.batchSize > 0 ? cache.batchSize : 1;
    batchTimeout = typeof cache.batchTimeout === 'number' && cache.batchTimeout > 0 ? cache.batchTimeout : 0;

    // removing blobs that are not going to be used
    if (cache.useLocal && !cleanupHandler) {
      cleanupHandler = _auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.onExpiry(auction => {
        auction.getBidsReceived().forEach(bid => {
          const vastUrl = vastLocalCache.get(bid.videoCacheKey);
          if (vastUrl && vastUrl.startsWith('blob')) {
            URL.revokeObjectURL(vastUrl);
          }
          vastLocalCache.delete(bid.videoCacheKey);
        });
      });
    }
  });
}
const batchingCache = (timeout = setTimeout, cache = storeBatch) => {
  let batches = [[]];
  let debouncing = false;
  const noTimeout = cb => cb();
  return function (auctionInstance, bidResponse, afterBidAdded) {
    const batchFunc = batchTimeout > 0 ? timeout : noTimeout;
    if (batches[batches.length - 1].length >= batchSize) {
      batches.push([]);
    }
    batches[batches.length - 1].push({
      auctionInstance,
      bidResponse,
      afterBidAdded
    });
    if (!debouncing) {
      debouncing = true;
      batchFunc(() => {
        batches.forEach(cache);
        batches = [[]];
        debouncing = false;
      }, batchTimeout);
    }
  };
};
const batchAndStore = batchingCache();
const callPrebidCache = (0,_hook_js__WEBPACK_IMPORTED_MODULE_6__.hook)('async', function (auctionInstance, bidResponse, afterBidAdded, videoMediaType) {
  if (_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.useLocal')) {
    storeLocally(bidResponse);
    (0,_auction_js__WEBPACK_IMPORTED_MODULE_5__.addBidToAuction)(auctionInstance, bidResponse);
    afterBidAdded();
  } else {
    batchAndStore(auctionInstance, bidResponse, afterBidAdded);
  }
}, 'callPrebidCache');

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["fpdUtils"],{

/***/ "./libraries/fpdUtils/ortbMap.js"
/*!***************************************!*\
  !*** ./libraries/fpdUtils/ortbMap.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ORTB_MAP: () => (/* binding */ ORTB_MAP)
/* harmony export */ });
/**
 * Data type map
 */
const TYPES = {
  string: 'string',
  object: 'object',
  number: 'number'
};

/**
 * Template to define what ortb2 attributes should be validated
 * Accepted fields:
 * -- invalid - {Boolean} if true, field is not valid
 * -- type - {String} valid data type of field
 * -- isArray - {Boolean} if true, field must be an array
 * -- childType - {String} used in conjuction with isArray: true, defines valid type of array indices
 * -- children - {Object} defines child properties needed to be validated (used only if type: object)
 * -- required - {Array} array of strings defining any required properties for object (used only if type: object)
 * -- optoutApplies - {Boolean} if true, optout logic will filter if applicable (currently only applies to user object)
 */
const ORTB_MAP = {
  imp: {
    invalid: true
  },
  cur: {
    type: TYPES.object,
    isArray: true,
    childType: TYPES.string
  },
  device: {
    type: TYPES.object,
    children: {
      w: {
        type: TYPES.number
      },
      h: {
        type: TYPES.number
      }
    }
  },
  site: {
    type: TYPES.object,
    children: {
      name: {
        type: TYPES.string
      },
      domain: {
        type: TYPES.string
      },
      page: {
        type: TYPES.string
      },
      ref: {
        type: TYPES.string
      },
      keywords: {
        type: TYPES.string
      },
      search: {
        type: TYPES.string
      },
      cat: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.string
      },
      sectioncat: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.string
      },
      pagecat: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.string
      },
      content: {
        type: TYPES.object,
        isArray: false,
        children: {
          data: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.object,
            required: ['name', 'segment'],
            children: {
              segment: {
                type: TYPES.object,
                isArray: true,
                childType: TYPES.object,
                required: ['id'],
                children: {
                  id: {
                    type: TYPES.string
                  }
                }
              },
              name: {
                type: TYPES.string
              },
              ext: {
                type: TYPES.object
              }
            }
          }
        }
      },
      publisher: {
        type: TYPES.object,
        isArray: false,
        children: {
          id: {
            type: TYPES.string
          },
          name: {
            type: TYPES.string
          },
          cat: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.string
          },
          domain: {
            type: TYPES.string
          },
          ext: {
            type: TYPES.object,
            isArray: false
          }
        }
      }
    }
  },
  user: {
    type: TYPES.object,
    children: {
      yob: {
        type: TYPES.number,
        optoutApplies: true
      },
      gender: {
        type: TYPES.string,
        optoutApplies: true
      },
      keywords: {
        type: TYPES.string
      },
      data: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.object,
        required: ['name', 'segment'],
        children: {
          segment: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.object,
            required: ['id'],
            children: {
              id: {
                type: TYPES.string
              }
            }
          },
          name: {
            type: TYPES.string
          },
          ext: {
            type: TYPES.object
          }
        }
      }
    }
  },
  bcat: {
    type: TYPES.object,
    isArray: true,
    childType: TYPES.string
  },
  badv: {
    type: TYPES.object,
    isArray: true,
    childType: TYPES.string
  },
  source: {
    type: TYPES.object,
    children: {
      ext: {
        type: TYPES.object,
        isArray: false
      },
      schain: {
        type: TYPES.object,
        children: {
          complete: {
            type: TYPES.number
          },
          ver: {
            type: TYPES.string
          },
          nodes: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.object,
            required: ['asi', 'sid', 'hp'],
            children: {
              asi: {
                type: TYPES.string
              },
              sid: {
                type: TYPES.string
              },
              hp: {
                type: TYPES.number
              },
              rid: {
                type: TYPES.string
              },
              name: {
                type: TYPES.string
              },
              domain: {
                type: TYPES.string
              },
              ext: {
                type: TYPES.object
              }
            }
          },
          ext: {
            type: TYPES.object
          }
        },
        required: ['complete', 'nodes', 'ver']
      }
    }
  }
};

/***/ },

/***/ "./libraries/fpdUtils/pubcidOptout.js"
/*!********************************************!*\
  !*** ./libraries/fpdUtils/pubcidOptout.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasPubcidOptout: () => (/* binding */ hasPubcidOptout)
/* harmony export */ });
/* unused harmony export PUBCID_OPTOUT_KEY */
const PUBCID_OPTOUT_KEY = '_pubcid_optout';
function hasPubcidOptout(storage) {
  return Boolean(storage.cookiesAreEnabled() && storage.getCookie(PUBCID_OPTOUT_KEY) || storage.hasLocalStorage() && storage.getDataFromLocalStorage(PUBCID_OPTOUT_KEY));
}

/***/ },

/***/ "./libraries/fpdUtils/validateFpd.js"
/*!*******************************************!*\
  !*** ./libraries/fpdUtils/validateFpd.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fpdValidator: () => (/* binding */ fpdValidator)
/* harmony export */ });
/* harmony import */ var _ortbMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ortbMap.js */ "./libraries/fpdUtils/ortbMap.js");


/**
 * Utility functions the validator depends on. These are expected to be the
 * corresponding exports from `src/utils.js`, injected by the caller so that
 * this library stays decoupled from core.
 */

/**
 * Build an ortb2 first-party-data validator.
 * @param deps utility functions from `src/utils.js`
 * @param deps.logWarn warning logger
 * @param deps.isNumber number type guard
 * @param deps.isEmpty empty-value check
 * @param deps.deepAccess dotted-path accessor
 * @param deps.deepClone deep clone (used only when `filter` is false)
 * @param options validator options
 * @param options.filter whether invalid data is removed (controls warning wording and whether the input is modified)
 * @returns `validateFpd` and `filterArrayData` bound to the injected utilities
 */
function fpdValidator({
  logWarn,
  isNumber,
  isEmpty,
  deepAccess,
  deepClone
}, {
  filter = true
} = {}) {
  const label = filter ? 'Filtered' : 'Invalid';
  function isEmptyData(data) {
    let check = true;
    if (typeof data === 'object' && !isEmpty(data)) {
      check = false;
    } else if (typeof data !== 'object' && (isNumber(data) || data)) {
      check = false;
    }
    return check;
  }
  function getRequiredData(obj, required, parent, i) {
    let check = true;
    required.forEach(key => {
      if (!obj[key] || isEmptyData(obj[key])) {
        check = false;
        logWarn(`${label} ${parent}[] value at index ${i} in ortb2 data: missing required property ${key}`);
      }
    });
    return check;
  }
  function typeValidation(data, mapping) {
    let check = false;
    switch (mapping.type) {
      case 'string':
        if (typeof data === 'string') check = true;
        break;
      case 'number':
        if (typeof data === 'number' && isFinite(data)) check = true;
        break;
      case 'object':
        if (typeof data === 'object') {
          if (Array.isArray(data) && mapping.isArray || !Array.isArray(data) && !mapping.isArray) check = true;
        }
        break;
    }
    return check;
  }
  function filterArrayData(arr, child, path, parent, optout = false) {
    arr = arr.filter((index, i) => {
      const check = typeValidation(index, {
        type: child.type,
        isArray: child.isArray
      });
      if (check && Array.isArray(index) === Boolean(child.isArray)) {
        return true;
      }
      logWarn(`${label} ${parent}[] value at index ${i} in ortb2 data: expected type ${child.type}`);
      return false;
    }).filter((index, i) => {
      let requiredCheck = true;
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path);
      if (mapping && mapping.required) requiredCheck = getRequiredData(index, mapping.required, parent, i);
      if (requiredCheck) return true;
      return false;
    }).reduce((result, value, i) => {
      let typeBool = false;
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path);
      switch (child.type) {
        case 'string':
          result.push(value);
          typeBool = true;
          break;
        case 'object':
          if (mapping && mapping.children) {
            const validObject = validate(value, path + '.children.', parent + '.', optout);
            if (Object.keys(validObject).length) {
              const requiredCheck = getRequiredData(validObject, mapping.required, parent, i);
              if (requiredCheck) {
                result.push(validObject);
                typeBool = true;
              }
            }
          } else {
            result.push(value);
            typeBool = true;
          }
          break;
      }
      if (!typeBool) logWarn(`${label} ${parent}[] value at index ${i}  in ortb2 data: expected type ${child.type}`);
      return result;
    }, []);
    return arr;
  }
  function validate(fpd, path = '', parent = '', optout = false) {
    if (!fpd) return {};
    const validObject = Object.assign({}, Object.keys(fpd).filter(key => {
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path + key);
      if (!mapping || !mapping.invalid) return key;
      logWarn(`${label} ${parent}${key} property in ortb2 data: invalid property`);
      return false;
    }).filter(key => {
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path + key);
      const typeBool = mapping ? typeValidation(fpd[key], {
        type: mapping.type,
        isArray: mapping.isArray
      }) : true;
      if (typeBool || !mapping) return key;
      logWarn(`${label} ${parent}${key} property in ortb2 data: expected type ${mapping.isArray ? 'array' : mapping.type}`);
      return false;
    }).reduce((result, key) => {
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path + key);
      if (mapping) {
        if (mapping.optoutApplies && optout) {
          logWarn(`${label} ${parent}${key} data: pubcid optout found`);
          return result;
        }
        const modified = mapping.type === 'object' && !mapping.isArray ? validate(fpd[key], path + key + '.children.', parent + key + '.', optout) : mapping.isArray && mapping.childType ? filterArrayData(fpd[key], {
          type: mapping.childType,
          isArray: mapping.childisArray
        }, path + key, parent + key, optout) : fpd[key];
        !isEmptyData(modified) ? result[key] = modified : logWarn(`${label} ${parent}${key} property in ortb2 data: empty data found`);
      } else {
        result[key] = fpd[key];
      }
      return result;
    }, {}));
    return validObject;
  }

  /**
   * Validate ortb2 first-party data.
   * When `filter` is true, returns a copy with invalid data removed.
   * When `filter` is false, the input is left untouched (validation runs against a
   * clone purely to emit warnings) and the original object is returned unchanged.
   * @throws when `filter` is false but no `deepClone` was provided, as the input
   * cannot be inspected without risking mutation.
   */
  function validateFpd(fpd, path = '', parent = '', optout = false) {
    if (!filter) {
      if (deepClone == null) {
        throw new Error('fpdValidator: a deepClone dependency is required when filter is false');
      }
      validate(deepClone(fpd), path, parent, optout);
      return fpd;
    }
    return validate(fpd, path, parent, optout);
  }
  return {
    validateFpd,
    filterArrayData
  };
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["viewport"],{

/***/ "./libraries/viewport/viewport.js"
/*!****************************************!*\
  !*** ./libraries/viewport/viewport.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewportSize: () => (/* binding */ getViewportSize)
/* harmony export */ });
/* unused harmony export getViewportCoordinates */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/winDimensions.js");

function getViewportCoordinates() {
  try {
    const win = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.getWindowTop)();
    const {
      scrollY: top,
      scrollX: left
    } = win;
    const {
      height: innerHeight,
      width: innerWidth
    } = getViewportSize();
    return {
      top,
      right: left + innerWidth,
      bottom: top + innerHeight,
      left
    };
  } catch (e) {
    return {};
  }
}
function getViewportSize() {
  const windowDimensions = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.getWinDimensions)();
  try {
    const innerHeight = windowDimensions.innerHeight || windowDimensions.document.documentElement.clientHeight || windowDimensions.document.body.clientHeight || 0;
    const innerWidth = windowDimensions.innerWidth || windowDimensions.document.documentElement.clientWidth || windowDimensions.document.body.clientWidth || 0;
    return {
      width: innerWidth,
      height: innerHeight
    };
  } catch (e) {
    return {};
  }
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["creative-renderer-safe"],{

/***/ "./creative-renderers/safe.js"
/*!************************************!*\
  !*** ./creative-renderers/safe.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RENDERER: () => (/* binding */ RENDERER)
/* harmony export */ });
// this file is autogenerated, see creative/README.md
const RENDERER = "/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\n/******/ \t// The require scope\n/******/ \tconst __webpack_require__ = {};\n/******/ \t\n/************************************************************************/\n/******/ \t/* webpack/runtime/define property getters */\n/******/ \t(() => {\n/******/ \t\t// define getter/value functions for harmony exports\n/******/ \t\t__webpack_require__.d = (exports, definition) => {\n/******/ \t\t\tif(Array.isArray(definition)) {\n/******/ \t\t\t\tvar i = 0;\n/******/ \t\t\t\twhile(i < definition.length) {\n/******/ \t\t\t\t\tvar key = definition[i++];\n/******/ \t\t\t\t\tvar binding = definition[i++];\n/******/ \t\t\t\t\tif(!__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\t\tif(binding === 0) {\n/******/ \t\t\t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, value: definition[i++] });\n/******/ \t\t\t\t\t\t} else {\n/******/ \t\t\t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: binding });\n/******/ \t\t\t\t\t\t}\n/******/ \t\t\t\t\t} else if(binding === 0) { i++; }\n/******/ \t\t\t\t}\n/******/ \t\t\t} else {\n/******/ \t\t\t\tfor(var key in definition) {\n/******/ \t\t\t\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n/******/ \t\t\t\t\t}\n/******/ \t\t\t\t}\n/******/ \t\t\t}\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\n/******/ \t(() => {\n/******/ \t\t__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/make namespace object */\n/******/ \t(() => {\n/******/ \t\t// define __esModule on exports\n/******/ \t\t__webpack_require__.r = (exports) => {\n/******/ \t\t\tif(Symbol.toStringTag) {\n/******/ \t\t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t\t}\n/******/ \t\t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/************************************************************************/\nlet __webpack_exports__ = {};\n/*!*********************************************!*\\\n  !*** ./creative/renderers/safe/renderer.js ***!\n  \\*********************************************/\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   render: () => (/* binding */ render)\n/* harmony export */ });\n/**\n * SafeRenderer (creative): builds an empty same-origin iframe, injects\n * `<script src=\"safeRenderer.url\">`, then calls `iframe.contentWindow.pbRenderInFrame(payload)`\n * after that script loads.\n *\n * The remote script must assign `window.pbRenderInFrame` as a function.\n * `payload` is `{ config: safeRenderer.config, ...renderingData }`: `renderingData` carries bid-oriented fields passed through the creative pipeline\n * that may matter to an external renderer—for example `ad`, `adId`, `adUrl`, `vastXml`, `vastUrl`, `mediaType`, sizes, `instl`.\n * `payload.config` mirrors `safeRenderer.config` from that payload; before the creative runs, Core may populate it from a static\n * `safeRenderer.config` (e.g. set on the bid by the bidder adapter) or by calling the publisher’s `safeRenderer.getConfig(bidResponse)` once at render preparation.\n *\n */\nfunction render(data, {\n  mkFrame\n}, win) {\n  const {\n    safeRenderer,\n    ...renderingData\n  } = data;\n  const width = data.width;\n  const height = data.height;\n  const instl = data.instl;\n  if (height == null) {\n    const body = win.document && win.document.body;\n    const parent = body && body.parentElement;\n    if (body && body.style) body.style.height = '100%';\n    if (parent && parent.style) parent.style.height = '100%';\n  }\n  const doc = win.document;\n  const attrs = {\n    width: width != null ? width : '100%',\n    height: height != null ? height : '100%'\n  };\n  if (instl && win.frameElement) {\n    const style = win.frameElement.style;\n    style.width = width ? String(width) + 'px' : '100vw';\n    style.height = height ? String(height) + 'px' : '100vh';\n  }\n  if (typeof safeRenderer.url !== 'string' || safeRenderer.url === '') {\n    return Promise.reject(new Error('Prebid SafeRenderer: missing data.safeRenderer.url'));\n  }\n\n  // Prebid will wait for it to resolve before firing AD_RENDER_SUCCEEDED.\n  return new Promise(function (resolve, reject) {\n    const frame = mkFrame(doc, {\n      width: attrs.width,\n      height: attrs.height\n    });\n    frame.onload = function () {\n      try {\n        const cw = frame.contentWindow;\n        const idoc = cw.document;\n        const script = idoc.createElement('script');\n        script.src = safeRenderer.url;\n        script.onload = function () {\n          try {\n            const fn = cw.pbRenderInFrame;\n            if (typeof fn !== 'function') {\n              throw new Error('Prebid SafeRenderer: safeRenderer.url script must define window.pbRenderInFrame as a function.');\n            }\n            fn.call(cw, {\n              config: safeRenderer.config,\n              ...renderingData\n            });\n            resolve();\n          } catch (e) {\n            reject(e);\n          }\n        };\n        script.onerror = function () {\n          reject(new Error('Prebid SafeRenderer: failed to load script from safeRenderer.url'));\n        };\n        (idoc.head || idoc.body).appendChild(script);\n      } catch (e) {\n        reject(e);\n      }\n    };\n    frame.onerror = function () {\n      reject(new Error('Prebid SafeRenderer: iframe failed to load'));\n    };\n    doc.body.appendChild(frame);\n  });\n}\nwindow.render = render;\n/******/ })()\n;\n"

/***/ }

}]);
"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["creative-renderer-display"],{

/***/ "./creative-renderers/display.js"
/*!***************************************!*\
  !*** ./creative-renderers/display.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RENDERER: () => (/* binding */ RENDERER)
/* harmony export */ });
// this file is autogenerated, see creative/README.md
const RENDERER = "/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\n/******/ \tvar __webpack_modules__ = ({\n\n/***/ \"./creative/constants.js\"\n/*!*******************************!*\\\n  !*** ./creative/constants.js ***!\n  \\*******************************/\n(__unused_webpack_module, __webpack_exports__, __webpack_require__) {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BROWSER_INTERVENTION: () => (/* binding */ BROWSER_INTERVENTION),\n/* harmony export */   ERROR_EXCEPTION: () => (/* binding */ ERROR_EXCEPTION),\n/* harmony export */   EVENT_AD_RENDER_FAILED: () => (/* binding */ EVENT_AD_RENDER_FAILED),\n/* harmony export */   EVENT_AD_RENDER_SUCCEEDED: () => (/* binding */ EVENT_AD_RENDER_SUCCEEDED),\n/* harmony export */   MESSAGE_EVENT: () => (/* binding */ MESSAGE_EVENT),\n/* harmony export */   MESSAGE_REQUEST: () => (/* binding */ MESSAGE_REQUEST),\n/* harmony export */   MESSAGE_RESPONSE: () => (/* binding */ MESSAGE_RESPONSE),\n/* harmony export */   PB_LOCATOR: () => (/* reexport safe */ _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.PB_LOCATOR)\n/* harmony export */ });\n/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/constants.js */ \"./src/constants.js\");\n// eslint-disable-next-line prebid/validate-imports\n\n\n// eslint-disable-next-line prebid/validate-imports\n\nconst MESSAGE_REQUEST = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.REQUEST;\nconst MESSAGE_RESPONSE = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.RESPONSE;\nconst MESSAGE_EVENT = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.EVENT;\nconst EVENT_AD_RENDER_FAILED = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.EVENTS.AD_RENDER_FAILED;\nconst EVENT_AD_RENDER_SUCCEEDED = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.EVENTS.AD_RENDER_SUCCEEDED;\nconst ERROR_EXCEPTION = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.EXCEPTION;\nconst BROWSER_INTERVENTION = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.EVENTS.BROWSER_INTERVENTION;\n\n/***/ },\n\n/***/ \"./creative/renderers/display/constants.js\"\n/*!*************************************************!*\\\n  !*** ./creative/renderers/display/constants.js ***!\n  \\*************************************************/\n(__unused_webpack_module, __webpack_exports__, __webpack_require__) {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_NO_AD: () => (/* binding */ ERROR_NO_AD)\n/* harmony export */ });\n/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/constants.js */ \"./src/constants.js\");\n// eslint-disable-next-line prebid/validate-imports\n\nconst ERROR_NO_AD = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.NO_AD;\n\n/***/ },\n\n/***/ \"./creative/reporting.js\"\n/*!*******************************!*\\\n  !*** ./creative/reporting.js ***!\n  \\*******************************/\n(__unused_webpack_module, __webpack_exports__, __webpack_require__) {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   registerReportingObserver: () => (/* binding */ registerReportingObserver)\n/* harmony export */ });\nfunction registerReportingObserver(callback, types, document) {\n  const view = document?.defaultView || window;\n  if ('ReportingObserver' in view) {\n    try {\n      const observer = new view.ReportingObserver(reports => {\n        callback(reports[0]);\n      }, {\n        buffered: true,\n        types\n      });\n      observer.observe();\n    } catch (e) {}\n  }\n}\n\n/***/ },\n\n/***/ \"./src/constants.js\"\n/*!**************************!*\\\n  !*** ./src/constants.js ***!\n  \\**************************/\n(__unused_webpack_module, __webpack_exports__, __webpack_require__) {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AD_RENDER_FAILED_REASON: () => (/* binding */ AD_RENDER_FAILED_REASON),\n/* harmony export */   BID_STATUS: () => (/* binding */ BID_STATUS),\n/* harmony export */   DEBUG_MODE: () => (/* binding */ DEBUG_MODE),\n/* harmony export */   DEFAULT_TARGETING_KEYS: () => (/* binding */ DEFAULT_TARGETING_KEYS),\n/* harmony export */   EVENTS: () => (/* binding */ EVENTS),\n/* harmony export */   EVENT_ID_PATHS: () => (/* binding */ EVENT_ID_PATHS),\n/* harmony export */   GRANULARITY_OPTIONS: () => (/* binding */ GRANULARITY_OPTIONS),\n/* harmony export */   JSON_MAPPING: () => (/* binding */ JSON_MAPPING),\n/* harmony export */   MESSAGES: () => (/* binding */ MESSAGES),\n/* harmony export */   NATIVE_ASSET_TYPES: () => (/* binding */ NATIVE_ASSET_TYPES),\n/* harmony export */   NATIVE_IMAGE_TYPES: () => (/* binding */ NATIVE_IMAGE_TYPES),\n/* harmony export */   NATIVE_KEYS: () => (/* binding */ NATIVE_KEYS),\n/* harmony export */   NATIVE_KEYS_THAT_ARE_NOT_ASSETS: () => (/* binding */ NATIVE_KEYS_THAT_ARE_NOT_ASSETS),\n/* harmony export */   PB_LOCATOR: () => (/* binding */ PB_LOCATOR),\n/* harmony export */   PREBID_NATIVE_DATA_KEYS_TO_ORTB: () => (/* binding */ PREBID_NATIVE_DATA_KEYS_TO_ORTB),\n/* harmony export */   REJECTION_REASON: () => (/* binding */ REJECTION_REASON),\n/* harmony export */   S2S: () => (/* binding */ S2S),\n/* harmony export */   STATUS: () => (/* binding */ STATUS),\n/* harmony export */   TARGETING_KEYS: () => (/* binding */ TARGETING_KEYS)\n/* harmony export */ });\nconst JSON_MAPPING = {\n  PL_CODE: 'code',\n  PL_SIZE: 'sizes',\n  PL_BIDS: 'bids',\n  BD_BIDDER: 'bidder',\n  BD_ID: 'paramsd',\n  BD_PL_ID: 'placementId',\n  ADSERVER_TARGETING: 'adserverTargeting',\n  BD_SETTING_STANDARD: 'standard'\n};\nconst DEBUG_MODE = 'pbjs_debug';\nconst STATUS = {\n  GOOD: 1\n};\nconst EVENTS = {\n  AUCTION_INIT: 'auctionInit',\n  AUCTION_TIMEOUT: 'auctionTimeout',\n  AUCTION_END: 'auctionEnd',\n  BID_ADJUSTMENT: 'bidAdjustment',\n  BID_TIMEOUT: 'bidTimeout',\n  BID_REQUESTED: 'bidRequested',\n  BID_RESPONSE: 'bidResponse',\n  BID_ACCEPTED: 'bidAccepted',\n  BID_REJECTED: 'bidRejected',\n  NO_BID: 'noBid',\n  BID_WON: 'bidWon',\n  BIDDER_DONE: 'bidderDone',\n  BIDDER_ERROR: 'bidderError',\n  SET_TARGETING: 'setTargeting',\n  BEFORE_REQUEST_BIDS: 'beforeRequestBids',\n  BEFORE_BIDDER_HTTP: 'beforeBidderHttp',\n  REQUEST_BIDS: 'requestBids',\n  AD_RENDER_FAILED: 'adRenderFailed',\n  AD_RENDER_SUCCEEDED: 'adRenderSucceeded',\n  TCF2_ENFORCEMENT: 'tcf2Enforcement',\n  AUCTION_DEBUG: 'auctionDebug',\n  BID_VIEWABLE: 'bidViewable',\n  STALE_RENDER: 'staleRender',\n  EXPIRED_RENDER: 'expiredRender',\n  BILLABLE_EVENT: 'billableEvent',\n  PBS_ANALYTICS: 'pbsAnalytics',\n  BEFORE_PBS_HTTP: 'beforePBSHttp',\n  BROWSI_INIT: 'browsiInit',\n  BROWSI_DATA: 'browsiData',\n  BROWSER_INTERVENTION: 'browserIntervention'\n};\nconst AD_RENDER_FAILED_REASON = {\n  PREVENT_WRITING_ON_MAIN_DOCUMENT: 'preventWritingOnMainDocument',\n  NO_AD: 'noAd',\n  EXCEPTION: 'exception',\n  CANNOT_FIND_AD: 'cannotFindAd',\n  MISSING_DOC_OR_ADID: 'missingDocOrAdid'\n};\nconst EVENT_ID_PATHS = {\n  bidWon: 'adUnitCode'\n};\nconst GRANULARITY_OPTIONS = {\n  LOW: 'low',\n  MEDIUM: 'medium',\n  HIGH: 'high',\n  AUTO: 'auto',\n  DENSE: 'dense',\n  CUSTOM: 'custom'\n};\nconst TARGETING_KEYS = {\n  BIDDER: 'hb_bidder',\n  AD_ID: 'hb_adid',\n  PRICE_BUCKET: 'hb_pb',\n  SIZE: 'hb_size',\n  DEAL: 'hb_deal',\n  SOURCE: 'hb_source',\n  FORMAT: 'hb_format',\n  UUID: 'hb_uuid',\n  CACHE_ID: 'hb_cache_id',\n  CACHE_HOST: 'hb_cache_host',\n  ADOMAIN: 'hb_adomain',\n  ACAT: 'hb_acat',\n  CRID: 'hb_crid',\n  DSP: 'hb_dsp',\n  VERSION: 'hb_ver'\n};\nconst DEFAULT_TARGETING_KEYS = {\n  BIDDER: 'hb_bidder',\n  AD_ID: 'hb_adid',\n  PRICE_BUCKET: 'hb_pb',\n  SIZE: 'hb_size',\n  DEAL: 'hb_deal',\n  FORMAT: 'hb_format',\n  UUID: 'hb_uuid',\n  CACHE_HOST: 'hb_cache_host',\n  VERSION: 'hb_ver'\n};\nconst NATIVE_KEYS = {\n  title: 'hb_native_title',\n  body: 'hb_native_body',\n  body2: 'hb_native_body2',\n  privacyLink: 'hb_native_privacy',\n  privacyIcon: 'hb_native_privicon',\n  sponsoredBy: 'hb_native_brand',\n  image: 'hb_native_image',\n  icon: 'hb_native_icon',\n  clickUrl: 'hb_native_linkurl',\n  displayUrl: 'hb_native_displayurl',\n  cta: 'hb_native_cta',\n  rating: 'hb_native_rating',\n  address: 'hb_native_address',\n  downloads: 'hb_native_downloads',\n  likes: 'hb_native_likes',\n  phone: 'hb_native_phone',\n  price: 'hb_native_price',\n  salePrice: 'hb_native_saleprice',\n  rendererUrl: 'hb_renderer_url',\n  adTemplate: 'hb_adTemplate'\n};\nconst S2S = {\n  SRC: 's2s',\n  DEFAULT_ENDPOINT: 'https://prebid.adnxs.com/pbs/v1/openrtb2/auction',\n  SYNCED_BIDDERS_KEY: 'pbjsSyncs'\n};\nconst BID_STATUS = {\n  BID_TARGETING_SET: 'targetingSet',\n  RENDERED: 'rendered',\n  BID_REJECTED: 'bidRejected'\n};\nconst REJECTION_REASON = {\n  INVALID: 'Bid has missing or invalid properties',\n  INVALID_REQUEST_ID: 'Invalid request ID',\n  BIDDER_DISALLOWED: 'Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes',\n  FLOOR_NOT_MET: 'Bid does not meet price floor',\n  CANNOT_CONVERT_CURRENCY: 'Unable to convert currency',\n  DSA_REQUIRED: 'Bid does not provide required DSA transparency info',\n  DSA_MISMATCH: 'Bid indicates inappropriate DSA rendering method',\n  PRICE_TOO_HIGH: 'Bid price exceeds maximum value'\n};\nconst PREBID_NATIVE_DATA_KEYS_TO_ORTB = {\n  body: 'desc',\n  body2: 'desc2',\n  sponsoredBy: 'sponsored',\n  cta: 'ctatext',\n  rating: 'rating',\n  address: 'address',\n  downloads: 'downloads',\n  likes: 'likes',\n  phone: 'phone',\n  price: 'price',\n  salePrice: 'saleprice',\n  displayUrl: 'displayurl'\n};\nconst NATIVE_ASSET_TYPES = {\n  sponsored: 1,\n  desc: 2,\n  rating: 3,\n  likes: 4,\n  downloads: 5,\n  price: 6,\n  saleprice: 7,\n  phone: 8,\n  address: 9,\n  desc2: 10,\n  displayurl: 11,\n  ctatext: 12\n};\nconst NATIVE_IMAGE_TYPES = {\n  ICON: 1,\n  MAIN: 3\n};\nconst NATIVE_KEYS_THAT_ARE_NOT_ASSETS = ['privacyIcon', 'clickUrl', 'adTemplate', 'rendererUrl', 'type'];\nconst MESSAGES = {\n  REQUEST: 'Prebid Request',\n  RESPONSE: 'Prebid Response',\n  NATIVE: 'Prebid Native',\n  EVENT: 'Prebid Event',\n  INTERVENTION: 'Prebid Intervention'\n};\nconst PB_LOCATOR = '__pb_locator__';\n\n/***/ }\n\n/******/ \t});\n/************************************************************************/\n/******/ \t// The module cache\n/******/ \tconst __webpack_module_cache__ = {};\n/******/ \t\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/ \t\t// Check if module is in cache\n/******/ \t\tconst cachedModule = __webpack_module_cache__[moduleId];\n/******/ \t\tif (cachedModule !== undefined) {\n/******/ \t\t\treturn cachedModule.exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tconst module = __webpack_module_cache__[moduleId] = {\n/******/ \t\t\t// no module.id needed\n/******/ \t\t\t// no module.loaded needed\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/ \t\n/******/ \t\t// Execute the module function\n/******/ \t\tif (!(moduleId in __webpack_modules__)) {\n/******/ \t\t\tdelete __webpack_module_cache__[moduleId];\n/******/ \t\t\tconst e = new Error(\"Cannot find module '\" + moduleId + \"'\");\n/******/ \t\t\te.code = 'MODULE_NOT_FOUND';\n/******/ \t\t\tthrow e;\n/******/ \t\t}\n/******/ \t\t__webpack_modules__[moduleId](module, module.exports, __webpack_require__);\n/******/ \t\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/ \t\n/************************************************************************/\n/******/ \t/* webpack/runtime/define property getters */\n/******/ \t(() => {\n/******/ \t\t// define getter/value functions for harmony exports\n/******/ \t\t__webpack_require__.d = (exports, definition) => {\n/******/ \t\t\tif(Array.isArray(definition)) {\n/******/ \t\t\t\tvar i = 0;\n/******/ \t\t\t\twhile(i < definition.length) {\n/******/ \t\t\t\t\tvar key = definition[i++];\n/******/ \t\t\t\t\tvar binding = definition[i++];\n/******/ \t\t\t\t\tif(!__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\t\tif(binding === 0) {\n/******/ \t\t\t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, value: definition[i++] });\n/******/ \t\t\t\t\t\t} else {\n/******/ \t\t\t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: binding });\n/******/ \t\t\t\t\t\t}\n/******/ \t\t\t\t\t} else if(binding === 0) { i++; }\n/******/ \t\t\t\t}\n/******/ \t\t\t} else {\n/******/ \t\t\t\tfor(var key in definition) {\n/******/ \t\t\t\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n/******/ \t\t\t\t\t}\n/******/ \t\t\t\t}\n/******/ \t\t\t}\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\n/******/ \t(() => {\n/******/ \t\t__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/make namespace object */\n/******/ \t(() => {\n/******/ \t\t// define __esModule on exports\n/******/ \t\t__webpack_require__.r = (exports) => {\n/******/ \t\t\tif(Symbol.toStringTag) {\n/******/ \t\t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t\t}\n/******/ \t\t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/************************************************************************/\nlet __webpack_exports__ = {};\n// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.\n(() => {\n/*!************************************************!*\\\n  !*** ./creative/renderers/display/renderer.js ***!\n  \\************************************************/\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   render: () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var _reporting_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../reporting.js */ \"./creative/reporting.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants.js */ \"./creative/constants.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ \"./creative/renderers/display/constants.js\");\n\n\n\nfunction render({\n  ad,\n  adUrl,\n  width,\n  height,\n  instl\n}, {\n  mkFrame,\n  sendMessage\n}, win) {\n  (0,_reporting_js__WEBPACK_IMPORTED_MODULE_0__.registerReportingObserver)(report => {\n    sendMessage(_constants_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_EVENT, {\n      event: _constants_js__WEBPACK_IMPORTED_MODULE_1__.BROWSER_INTERVENTION,\n      intervention: report\n    });\n  }, ['intervention']);\n  if (!ad && !adUrl) {\n    const err = new Error('Missing ad markup or URL');\n    err.reason = _constants_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_NO_AD;\n    throw err;\n  } else {\n    if (height == null) {\n      const body = win.document?.body;\n      [body, body?.parentElement].filter(elm => elm?.style != null).forEach(elm => {\n        elm.style.height = '100%';\n      });\n    }\n    const doc = win.document;\n    const attrs = {\n      width: width ?? '100%',\n      height: height ?? '100%'\n    };\n    if (adUrl && !ad) {\n      attrs.src = adUrl;\n    } else {\n      attrs.srcdoc = ad;\n    }\n    doc.body.appendChild(mkFrame(doc, attrs));\n    if (instl && win.frameElement) {\n      // interstitials are rendered in a nested iframe that needs to be sized\n      const style = win.frameElement.style;\n      style.width = width ? `${width}px` : '100vw';\n      style.height = height ? `${height}px` : '100vh';\n      const container = win.parent?.document?.querySelector('div#creative');\n      const box = win.parent?.document?.querySelector('div#ad_position_box');\n      const containerStyle = container && win.parent?.getComputedStyle?.(container);\n      const boxStyle = box && win.parent?.getComputedStyle?.(box);\n      if (container?.parentElement === box && containerStyle?.marginTop && containerStyle?.marginTop !== '0px' && boxStyle && boxStyle?.alignItems === 'flex-start') {\n        // GAME_MANUAL_INTERSTITIAL uses different styling on mobile, which doesn't work with our resizing;\n        // this resets it to the same style used on desktop\n        container.style.marginTop = '0px';\n        box.style.alignItems = 'center';\n      }\n    }\n  }\n}\nwindow.render = render;\n})();\n\n/******/ })()\n;\n"

/***/ }

}]);
"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagement"],{

/***/ "./libraries/consentManagement/cmUtils.js"
/*!************************************************!*\
  !*** ./libraries/consentManagement/cmUtils.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configParser: () => (/* binding */ configParser)
/* harmony export */ });
/* unused harmony exports consentManagementHook, lookupConsentData */
/* harmony import */ var _src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");





function consentManagementHook(name, loadConsentData) {
  const SEEN = new WeakSet();
  return (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_0__.timedAuctionHook)(name, function requestBidsHook(fn, reqBidsConfigObj) {
    return loadConsentData().then(({
      consentData,
      error
    }) => {
      if (error && (!consentData || !SEEN.has(error))) {
        SEEN.add(error);
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(error.message, ...(error.args || []));
      }
      fn.call(this, reqBidsConfigObj);
    }).catch(error => {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`${error?.message} Canceling auction as per consentManagement config.`, ...(error?.args || []));
      fn.stopTiming();
      if (typeof reqBidsConfigObj.bidsBackHandler === 'function') {
        reqBidsConfigObj.bidsBackHandler();
      } else {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error executing bidsBackHandler');
      }
    });
  });
}

/**
 *
 * @typedef {Function} CmpLookupFn CMP lookup function. Should set up communication and keep consent data updated
 *   through consent data handlers' `setConsentData`.
 * @param {SetProvisionalConsent} setProvisionalConsent optionally, the function can call this with provisional consent
 *   data, which will be used if the lookup times out before "proper" consent data can be retrieved.
 * @returns {Promise<{void}>} a promise that resolves when the auction should be continued, or rejects if it should be canceled.
 *
 * @typedef {Function} SetProvisionalConsent
 * @param {*} provisionalConsent
 * @returns {void}
 */

/**
 * Look up consent data from CMP or config.
 *
 * @param {Object} options
 * @param {String} options.name e.g. 'GPP'. Used only for log messages.
 * @param {ConsentHandler} options.consentDataHandler consent data handler object (from src/consentHandler)
 * @param {CmpLookupFn} options.setupCmp
 * @param {Number?} options.cmpTimeout timeout (in ms) after which the auction should continue without consent data.
 * @param {Number?} options.actionTimeout timeout (in ms) from when provisional consent is available to when the auction should continue with it
 * @param {() => {}} options.getNullConsent consent data to use on timeout
 * @returns {Promise<{error: Error, consentData: {}}>}
 */
function lookupConsentData({
  name,
  consentDataHandler,
  setupCmp,
  cmpTimeout,
  actionTimeout,
  getNullConsent
}) {
  consentDataHandler.enable();
  let timeoutHandle;
  return new Promise((resolve, reject) => {
    let provisionalConsent;
    let cmpLoaded = false;
    function setProvisionalConsent(consentData) {
      provisionalConsent = consentData;
      if (!cmpLoaded) {
        cmpLoaded = true;
        actionTimeout != null && resetTimeout(actionTimeout);
      }
    }
    function resetTimeout(timeout) {
      if (timeoutHandle != null) clearTimeout(timeoutHandle);
      if (timeout != null) {
        timeoutHandle = setTimeout(() => {
          const consentData = consentDataHandler.getConsentData() ?? (cmpLoaded ? provisionalConsent : getNullConsent());
          const message = `timeout waiting for ${cmpLoaded ? 'user action on CMP' : 'CMP to load'}`;
          consentDataHandler.setConsentData(consentData);
          resolve({
            consentData,
            error: new Error(`${name} ${message}`)
          });
        }, timeout);
      } else {
        timeoutHandle = null;
      }
    }
    setupCmp(setProvisionalConsent).then(() => resolve({
      consentData: consentDataHandler.getConsentData()
    }), reject);
    cmpTimeout != null && resetTimeout(cmpTimeout);
  }).finally(() => {
    timeoutHandle && clearTimeout(timeoutHandle);
  }).catch(e => {
    consentDataHandler.error(e);
    throw e;
  });
}
function configParser({
  namespace,
  displayName,
  consentDataHandler,
  parseConsentData,
  getNullConsent,
  cmpHandlers,
  cmpEventCleanup,
  DEFAULT_CMP = 'iab',
  DEFAULT_CONSENT_TIMEOUT = 10000
} = {}) {
  function msg(message) {
    return `consentManagement.${namespace} ${message}`;
  }
  let requestBidsHook, cdLoader, staticConsentData;
  function attachActivityParams(next, params) {
    return next(Object.assign({
      [`${namespace}Consent`]: consentDataHandler.getConsentData()
    }, params));
  }
  function loadConsentData() {
    return cdLoader().then(({
      error
    }) => ({
      error,
      consentData: consentDataHandler.getConsentData()
    }));
  }
  function activate() {
    if (requestBidsHook == null) {
      requestBidsHook = consentManagementHook(namespace, () => cdLoader());
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('requestBids').before(requestBidsHook, 50);
      _src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.buildActivityParams.before(attachActivityParams);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(`${displayName} consentManagement module has been activated...`);
    }
  }
  function reset() {
    if (requestBidsHook != null) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('requestBids').getHooks({
        hook: requestBidsHook
      }).remove();
      _src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.buildActivityParams.getHooks({
        hook: attachActivityParams
      }).remove();
      requestBidsHook = null;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(`${displayName} consentManagement module has been deactivated...`);
    }
  }
  function resetConsentDataHandler() {
    reset();
    // Call module-specific CMP event cleanup if provided
    if (typeof cmpEventCleanup === 'function') {
      try {
        cmpEventCleanup();
      } catch (e) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Error during CMP event cleanup for ${displayName}:`, e);
      }
    }
  }
  return function getConsentConfig(config) {
    const cmConfig = config?.[namespace];
    if (!cmConfig || typeof cmConfig !== 'object') {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(msg(`config not defined, exiting consent manager module`));
      reset();
      return {};
    }

    // Check if module is explicitly disabled
    if (cmConfig?.enabled === false) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(msg(`config enabled is set to false, disabling consent manager module`));
      resetConsentDataHandler();
      return {};
    }
    let cmpHandler;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isStr)(cmConfig.cmpApi)) {
      cmpHandler = cmConfig.cmpApi;
    } else {
      cmpHandler = DEFAULT_CMP;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(msg(`config did not specify cmp.  Using system default setting (${DEFAULT_CMP}).`));
    }
    let cmpTimeout;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNumber)(cmConfig.timeout)) {
      cmpTimeout = cmConfig.timeout;
    } else {
      cmpTimeout = DEFAULT_CONSENT_TIMEOUT;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(msg(`config did not specify timeout.  Using system default setting (${DEFAULT_CONSENT_TIMEOUT}).`));
    }
    const actionTimeout = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNumber)(cmConfig.actionTimeout) ? cmConfig.actionTimeout : null;
    let setupCmp;
    if (cmpHandler === 'static') {
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(cmConfig.consentData)) {
        staticConsentData = cmConfig.consentData;
        cmpTimeout = null;
        setupCmp = () => new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise(resolve => resolve(consentDataHandler.setConsentData(parseConsentData(staticConsentData))));
      } else {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(msg(`config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.`));
      }
    } else if (!cmpHandlers.hasOwnProperty(cmpHandler)) {
      consentDataHandler.setConsentData(null);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`${displayName} CMP framework (${cmpHandler}) is not a supported framework.  Aborting consentManagement module and resuming auction.`);
      setupCmp = () => _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.resolve();
    } else {
      setupCmp = cmpHandlers[cmpHandler];
    }
    const lookup = () => lookupConsentData({
      name: displayName,
      consentDataHandler,
      setupCmp,
      cmpTimeout,
      actionTimeout,
      getNullConsent
    });
    cdLoader = (() => {
      let cd;
      return function () {
        if (cd == null) {
          cd = lookup().catch(err => {
            cd = null;
            throw err;
          });
        }
        return cd;
      };
    })();
    activate();
    return {
      cmpHandler,
      cmpTimeout,
      actionTimeout,
      staticConsentData,
      loadConsentData,
      requestBidsHook
    };
  };
}

/***/ },

/***/ "./libraries/consentManagement/consentUtils.js"
/*!*****************************************************!*\
  !*** ./libraries/consentManagement/consentUtils.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PURPOSE_DECLARATION: () => (/* binding */ DEFAULT_PURPOSE_DECLARATION),
/* harmony export */   NO_PURPOSE_DECLARATION: () => (/* binding */ NO_PURPOSE_DECLARATION),
/* harmony export */   TCF_CMP_VERSION: () => (/* binding */ TCF_CMP_VERSION),
/* harmony export */   getConsent: () => (/* binding */ getConsent),
/* harmony export */   setDefaultPurposeDeclaration: () => (/* binding */ setDefaultPurposeDeclaration),
/* harmony export */   setGvlLegalBasisMapping: () => (/* binding */ setGvlLegalBasisMapping)
/* harmony export */ });
/* unused harmony exports getPurposeDeclarations, getAcceptableFlags, hasVendorPurposeConsent */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/consentHandler.js */ "./src/consentHandler.js");


const TCF_CMP_VERSION = 2;
const DEFAULT_PURPOSE_DECLARATION = {
  purposes: [1, 2, 4, 7],
  legIntPurposes: [],
  flexiblePurposes: [2],
  specialFeatures: [1]
};
const NO_PURPOSE_DECLARATION = {
  purposes: [],
  legIntPurposes: [],
  flexiblePurposes: [],
  specialFeatures: []
};
const PUBLISHER_LI_PURPOSES = [2, 7, 9, 10];
const CONSENT_PATHS = {
  purpose: false,
  feature: 'specialFeatureOptins'
};
let gvlLegalBasisMapping = {};
let defaultPurposeDeclaration = NO_PURPOSE_DECLARATION;
function setGvlLegalBasisMapping(mapping) {
  gvlLegalBasisMapping = mapping;
}
function setDefaultPurposeDeclaration(declaration) {
  defaultPurposeDeclaration = declaration;
}
function getPurposeDeclarations(gvlId) {
  if (gvlId == null) return defaultPurposeDeclaration;
  let declaration = gvlLegalBasisMapping?.[gvlId] ?? _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.GVL_PURPOSES[gvlId];
  if (declaration == null) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`No purpose declarations found for GVL ID ${gvlId}. You may set one using setConfig({gvlLegalBasisMapping}). Falling back to ${JSON.stringify(defaultPurposeDeclaration)}`);
    return defaultPurposeDeclaration;
  }
  return declaration;
}
function getAcceptableFlags(consentData, type, purpose, gvlid, purposeDeclarations = getPurposeDeclarations) {
  let acceptConsent, acceptLI;
  if (gvlid === _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID) {
    acceptConsent = true;
    acceptLI = type === 'feature' ? false : PUBLISHER_LI_PURPOSES.includes(purpose);
  } else {
    const {
      purposes,
      legIntPurposes,
      flexiblePurposes,
      specialFeatures
    } = purposeDeclarations(gvlid);
    acceptLI = type === 'feature' ? false : legIntPurposes.includes(purpose) || flexiblePurposes.includes(purpose);
    acceptConsent = type === 'feature' ? specialFeatures.includes(purpose) : acceptLI || purposes.includes(purpose);
  }
  // https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#tcdata
  //  0 - Not Allowed
  //  1 - Require Consent
  //  2 - Require Legitimate Interest
  const restriction = type === 'feature' ? null : consentData.vendorData?.publisher?.restrictions?.[purpose]?.[gvlid];
  if (restriction === 0) {
    acceptConsent = acceptLI = false;
  } else if (restriction === 1) {
    acceptLI = false;
  } else if (restriction === 2) {
    acceptConsent = false;
  }
  return {
    acceptConsent,
    acceptLI
  };
}
function getConsentOrLI(consentData, path, id, acceptConsent, acceptLI) {
  const data = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(consentData, `vendorData.${path}`);
  return acceptConsent && !!data?.consents?.[id] || acceptLI && !!data?.legitimateInterests?.[id];
}
function getConsent(consentData, type, purposeNo, gvlId) {
  const {
    acceptConsent,
    acceptLI
  } = getAcceptableFlags(consentData, type, purposeNo, gvlId);
  let purpose;
  if (CONSENT_PATHS[type] !== false) {
    purpose = acceptConsent && !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(consentData, `vendorData.${CONSENT_PATHS[type]}.${purposeNo}`);
  } else {
    purpose = getConsentOrLI(consentData, gvlId === _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID ? 'publisher' : 'purpose', purposeNo, acceptConsent, acceptLI);
  }
  return {
    purpose,
    vendor: getConsentOrLI(consentData, 'vendor', gvlId, acceptConsent, acceptLI)
  };
}
function hasVendorPurposeConsent(consentData, purposeNo, gvlId) {
  if (!consentData?.gdprApplies) {
    return true;
  }
  const {
    purpose,
    vendor
  } = getConsent(consentData, 'purpose', purposeNo, gvlId);
  return purpose && vendor;
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["cmp"],{

/***/ "./libraries/cmp/cmpClient.js"
/*!************************************!*\
  !*** ./libraries/cmp/cmpClient.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MODE_CALLBACK: () => (/* binding */ MODE_CALLBACK),
/* harmony export */   cmpClient: () => (/* binding */ cmpClient)
/* harmony export */ });
/* unused harmony exports MODE_MIXED, MODE_RETURN */
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");


/**
 * @typedef {function} CMPClient
 *
 * @param {{}} params CMP parameters. Currently this is a subset of {command, callback, parameter, version}.
 * @param {boolean} once if true, discard cross-frame event listeners once a reply message is received.
 * @returns {Promise<*>} a promise to the API's "result" - see the `mode` argument to `cmpClient` on how that's determined.
 * @property {boolean} isDirect true if the CMP is directly accessible (no postMessage required)
 * @property {() => void} close close the client; currently, this just stops listening for cross-frame messages.
 */

const MODE_MIXED = 0;
const MODE_RETURN = 1;
const MODE_CALLBACK = 2;

/**
 * Returns a client function that can interface with a CMP regardless of where it's located.
 *
 * @param {object} obj
 * @param obj.apiName name of the CMP api, e.g. "__gpp"
 * @param [obj.apiVersion] CMP API version
 * @param [obj.apiArgs] names of the arguments taken by the api function, in order.
 * @param [obj.callbackArgs] names of the cross-frame response payload properties that should be passed as callback arguments, in order
 * @param [obj.mode] controls the callbacks passed to the underlying API, and how the promises returned by the client are resolved.
 *
 * The client behaves differently when it's provided a `callback` argument vs when it's not - for short, let's name these
 * cases "subscriptions" and "one-shot calls" respectively:
 *
 * With `mode: MODE_MIXED` (the default), promises returned on subscriptions are resolved to undefined when the callback
 * is first run (that is, the promise resolves when the CMP replies, but what it replies with is discarded and
 * left for the callback to deal with). For one-shot calls, the returned promise is resolved to the API's
 * return value when it's directly accessible, or with the result from the first (and, presumably, the only)
 * cross-frame reply when it's not;
 *
 * With `mode: MODE_RETURN`, the returned promise always resolves to the API's return value - which is taken to be undefined
 * when cross-frame;
 *
 * With `mode: MODE_CALLBACK`, the underlying API is expected to never directly return anything significant; instead,
 * it should always accept a callback and - for one-shot calls - invoke it only once with the result. The client will
 * automatically generate an appropriate callback for one-shot calls and use the result it's given to resolve
 * the returned promise. Subscriptions are treated in the same way as MODE_MIXED.
 *
 * @param win
 * @returns {CMPClient} CMP invocation function (or null if no CMP was found).
 */
function cmpClient({
  apiName,
  apiVersion,
  apiArgs = ['command', 'callback', 'parameter', 'version'],
  callbackArgs = ['returnValue', 'success'],
  mode = MODE_MIXED
}, win = window) {
  const cmpCallbacks = {};
  const callName = `${apiName}Call`;
  const cmpDataPkgName = `${apiName}Return`;
  function handleMessage(event) {
    const json = typeof event.data === 'string' && event.data.includes(cmpDataPkgName) ? JSON.parse(event.data) : event.data;
    if (json?.[cmpDataPkgName]?.callId) {
      const payload = json[cmpDataPkgName];
      if (cmpCallbacks.hasOwnProperty(payload.callId)) {
        cmpCallbacks[payload.callId](...callbackArgs.map(name => payload[name]));
      }
    }
  }
  function findCMP() {
    let f = win;
    let cmpFrame;
    let isDirect = false;
    while (f != null) {
      try {
        if (typeof f[apiName] === 'function') {
          cmpFrame = f;
          isDirect = true;
          break;
        }
      } catch (e) {}

      // need separate try/catch blocks due to the exception errors thrown when trying to check for a frame that doesn't exist in 3rd party env
      try {
        if (f.frames[`${apiName}Locator`]) {
          cmpFrame = f;
          break;
        }
      } catch (e) {}
      if (f === win.top) break;
      f = f.parent;
    }
    return [cmpFrame, isDirect];
  }
  const [cmpFrame, isDirect] = findCMP();
  if (!cmpFrame) {
    return;
  }
  function resolveParams(params) {
    params = Object.assign({
      version: apiVersion
    }, params);
    return apiArgs.map(arg => [arg, params[arg]]);
  }
  function wrapCallback(callback, resolve, reject, preamble) {
    const haveCb = typeof callback === 'function';
    return function (result, success) {
      preamble && preamble();
      if (mode !== MODE_RETURN) {
        const resolver = success == null || success ? resolve : reject;
        resolver(haveCb ? undefined : result);
      }
      haveCb && callback.apply(this, arguments);
    };
  }
  let client;
  if (isDirect) {
    client = function invokeCMPDirect(params = {}) {
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__.PbPromise((resolve, reject) => {
        const ret = cmpFrame[apiName](...resolveParams({
          ...params,
          callback: params.callback || mode === MODE_CALLBACK ? wrapCallback(params.callback, resolve, reject) : undefined
        }).map(([_, val]) => val));
        if (mode === MODE_RETURN || params.callback == null && mode === MODE_MIXED) {
          resolve(ret);
        }
      });
    };
  } else {
    win.addEventListener('message', handleMessage, false);
    client = function invokeCMPFrame(params, once = false) {
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__.PbPromise((resolve, reject) => {
        // call CMP via postMessage
        const callId = Math.random().toString();
        const msg = {
          [callName]: {
            ...Object.fromEntries(resolveParams(params).filter(([param]) => param !== 'callback')),
            callId: callId
          }
        };
        cmpCallbacks[callId] = wrapCallback(params?.callback, resolve, reject, (once || params?.callback == null) && (() => {
          delete cmpCallbacks[callId];
        }));
        cmpFrame.postMessage(msg, '*');
        if (mode === MODE_RETURN) resolve();
      });
    };
  }
  return Object.assign(client, {
    isDirect,
    close() {
      !isDirect && win.removeEventListener('message', handleMessage);
    }
  });
}

/***/ },

/***/ "./libraries/cmp/cmpEventUtils.js"
/*!****************************************!*\
  !*** ./libraries/cmp/cmpEventUtils.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCmpEventManager: () => (/* binding */ createCmpEventManager)
/* harmony export */ });
/* unused harmony exports BaseCmpEventManager, TcfCmpEventManager, GppCmpEventManager */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/**
 * Shared utilities for CMP event listener management
 * Used by TCF and GPP consent management modules
 */


/**
 * Base CMP event manager implementation
 */
class BaseCmpEventManager {
  cmpApi = null;
  listenerId = undefined;
  setCmpApi(cmpApi) {
    this.cmpApi = cmpApi;
  }
  getCmpApi() {
    return this.cmpApi;
  }
  setCmpListenerId(listenerId) {
    this.listenerId = listenerId;
  }
  getCmpListenerId() {
    return this.listenerId;
  }
  resetCmpApis() {
    this.cmpApi = null;
    this.listenerId = undefined;
  }

  /**
   * Helper method to get base removal parameters
   * Can be used by subclasses that need to remove event listeners
   */
  getRemoveListenerParams() {
    const cmpApi = this.getCmpApi();
    const listenerId = this.getCmpListenerId();

    // Comprehensive validation for all possible failure scenarios
    if (cmpApi && typeof cmpApi === 'function' && listenerId !== undefined && listenerId !== null) {
      return {
        command: "removeEventListener",
        callback: () => this.resetCmpApis(),
        parameter: listenerId
      };
    }
    return null;
  }

  /**
   * Abstract method - each subclass implements its own removal logic
   */
}

/**
 * TCF-specific CMP event manager
 */
class TcfCmpEventManager extends BaseCmpEventManager {
  constructor(getConsentData) {
    super();
    this.getConsentData = getConsentData || (() => null);
  }
  removeCmpEventListener() {
    const params = this.getRemoveListenerParams();
    if (params) {
      const consentData = this.getConsentData();
      params.apiVersion = consentData?.apiVersion || 2;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)('Removing TCF CMP event listener');
      this.getCmpApi()(params);
    }
  }
}

/**
 * GPP-specific CMP event manager
 * GPP doesn't require event listener removal, so this is empty
 */
class GppCmpEventManager extends BaseCmpEventManager {
  removeCmpEventListener() {
    const params = this.getRemoveListenerParams();
    if (params) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)('Removing GPP CMP event listener');
      this.getCmpApi()(params);
    }
  }
}

/**
 * Factory function to create appropriate CMP event manager
 */
function createCmpEventManager(type, getConsentData) {
  switch (type) {
    case 'tcf':
      return new TcfCmpEventManager(getConsentData);
    case 'gpp':
      return new GppCmpEventManager();
    default:
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`Unknown CMP type: ${type}`);
      return null;
  }
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["mspa"],{

/***/ "./libraries/mspa/activityControls.js"
/*!********************************************!*\
  !*** ./libraries/mspa/activityControls.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRules: () => (/* binding */ getRules),
/* harmony export */   setupRules: () => (/* binding */ setupRules)
/* harmony export */ });
/* unused harmony exports isBasicConsentDenied, sensitiveNoticeIs, isConsentDenied, isTransmitUfpdConsentDenied, isTransmitGeoConsentDenied, mspaRule */
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");





/**
 * These options live under the GPP consent module's configuration, so they only mean anything to a
 * publisher who has included that module: the augmentation is meant to apply only then.
 * @augmentationOptional
 */

// default interpretation for MSPA consent(s):
// https://docs.prebid.org/features/mspa-usnat.html

const SENSITIVE_DATA_GEO = 7;
function isApplicable(val) {
  return val != null && val !== 0;
}
function isBasicConsentDenied(cd) {
  // service provider mode is always consent denied
  return ['MspaServiceProviderMode', 'Gpc'].some(prop => cd[prop] === 1) ||
  // you cannot consent to what you were not notified of
  cd.PersonalDataConsents === 2 ||
  // minors 13+ who have not given consent
  cd.KnownChildSensitiveDataConsents[0] === 1 ||
  // minors 16+ who have not given consent (added in usnat version 2)
  cd.KnownChildSensitiveDataConsents[2] === 1 ||
  // minors under 13 cannot consent
  isApplicable(cd.KnownChildSensitiveDataConsents[1]) ||
  // covered cannot be zero
  cd.MspaCoveredTransaction === 0;
}
function sensitiveNoticeIs(cd, value) {
  return ['SensitiveDataProcessingOptOutNotice', 'SensitiveDataLimitUseNotice'].some(prop => cd[prop] === value);
}
function isConsentDenied(cd) {
  return isBasicConsentDenied(cd) || ['Sale', 'Sharing', 'TargetedAdvertising'].some(scope => {
    const oo = cd[`${scope}OptOut`];
    const notice = cd[`${scope}OptOutNotice`];
    // user opted out
    return oo === 1 ||
    // opt-out notice was not given
    notice === 2 ||
    // do not trust CMP if it signals opt-in but no opt-out notice was given
    oo === 2 && notice === 0;
  }) ||
  // no sharing notice was given ...
  cd.SharingNotice === 2 ||
  // ... or the CMP says it was not applicable, while also claiming it got consent
  cd.SharingOptOut === 2 && cd.SharingNotice === 0;
}
const isTransmitUfpdConsentDenied = (() => {
  const sensitiveFlags = (() => {
    // deny anything that smells like: genetic, biometric, state/national ID, financial, union membership,
    // personal communication data, status as victim of crime (version 2), status as transgender/nonbinary (version 2)
    const cannotBeInScope = [6, 7, 9, 10, 12, 14, 16].map(el => el - 1);
    // require consent for everything else (except geo, which is treated separately)
    const allExceptGeo = Array.from(Array(16).keys()).filter(el => el !== SENSITIVE_DATA_GEO);
    const mustHaveConsent = allExceptGeo.filter(el => !cannotBeInScope.includes(el));
    return Object.fromEntries(Object.entries({
      1: 12,
      2: 16
    }).map(([version, cardinality]) => {
      const isInVersion = el => el < cardinality;
      return [version, {
        cannotBeInScope: cannotBeInScope.filter(isInVersion),
        allExceptGeo: allExceptGeo.filter(isInVersion),
        mustHaveConsent: mustHaveConsent.filter(isInVersion)
      }];
    }));
  })();
  return function (cd) {
    const {
      cannotBeInScope,
      mustHaveConsent,
      allExceptGeo
    } = sensitiveFlags[cd.Version];
    return isConsentDenied(cd) ||
    // no notice about sensitive data was given
    sensitiveNoticeIs(cd, 2) ||
    // extra-sensitive data is applicable
    cannotBeInScope.some(i => isApplicable(cd.SensitiveDataProcessing[i])) ||
    // user opted out for not-as-sensitive data
    mustHaveConsent.some(i => cd.SensitiveDataProcessing[i] === 1) ||
    // CMP says it has consent, but did not give notice about it
    sensitiveNoticeIs(cd, 0) && allExceptGeo.some(i => cd.SensitiveDataProcessing[i] === 2);
  };
})();
function isTransmitGeoConsentDenied(cd) {
  const geoConsent = cd.SensitiveDataProcessing[SENSITIVE_DATA_GEO];
  return geoConsent === 1 || isBasicConsentDenied(cd) ||
  // no sensitive data notice was given
  sensitiveNoticeIs(cd, 2) ||
  // do not trust CMP if it says it has consent for geo but didn't show a sensitive data notice
  sensitiveNoticeIs(cd, 0) && geoConsent === 2;
}
const CONSENT_RULES = {
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_SYNC_USER]: isConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_ENRICH_EIDS]: isConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_TRANSMIT_EIDS]: isConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_ENRICH_UFPD]: isConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_TRANSMIT_UFPD]: isTransmitUfpdConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_TRANSMIT_PRECISE_GEO]: isTransmitGeoConsentDenied
};
function mspaRule(sids, getConsent, denies, applicableSids = () => _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.getConsentData()?.applicableSections) {
  return function () {
    if (applicableSids().some(sid => sids.includes(sid))) {
      const consent = getConsent();
      if (consent == null) {
        return {
          allow: false,
          reason: 'consent data not available'
        };
      }
      if (![1, 2].includes(consent.Version)) {
        return {
          allow: false,
          reason: `unsupported consent specification version "${consent.Version}"`
        };
      }
      if (denies(consent)) {
        return {
          allow: false
        };
      }
    }
  };
}
function flatSection(subsections) {
  if (!Array.isArray(subsections)) return subsections;
  return subsections.reduceRight((subsection, consent) => {
    return Object.assign(consent, subsection);
  }, {});
}
function getRules(restrictActivities) {
  return Object.assign(Object.fromEntries((restrictActivities ?? []).map(activity => [activity, isConsentDenied])), CONSENT_RULES);
}
function setupRules(api, sids, rules = CONSENT_RULES, normalizeConsent = c => c, registerRule = _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_0__.registerActivityControl, getConsentData = () => _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.getConsentData()) {
  const unreg = [];
  const ruleName = `MSPA (GPP '${api}' for section${sids.length > 1 ? 's' : ''} ${sids.join(', ')})`;
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logInfo)(`Enabling activity controls for ${ruleName}`);
  Object.entries(rules).forEach(([activity, denies]) => {
    unreg.push(registerRule(activity, ruleName, mspaRule(sids, () => normalizeConsent(flatSection(getConsentData()?.parsedSections?.[api])), denies, () => getConsentData()?.applicableSections || [])));
  });
  return () => unreg.forEach(ur => ur());
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gptUtils"],{

/***/ "./libraries/gptUtils/gptUtils.js"
/*!****************************************!*\
  !*** ./libraries/gptUtils/gptUtils.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSegments: () => (/* binding */ getSegments),
/* harmony export */   getSignals: () => (/* binding */ getSignals),
/* harmony export */   taxonomies: () => (/* binding */ taxonomies)
/* harmony export */ });
/* unused harmony exports clearSlotInfoCache, isSlotMatchingAdUnitCode, setKeyValue, setKeyValueOn, getGptSlotForAdUnitCode, getGptSlotInfoForAdUnitCode, subscribeToGamEvent, subscribeToGamSlotRenderEndedEvent */
/* harmony import */ var _src_fpd_oneClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/fpd/oneClient.js */ "./src/fpd/oneClient.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/gptTargeting.js */ "./src/utils/gptTargeting.js");



const slotInfoCache = new Map();
function clearSlotInfoCache() {
  slotInfoCache.clear();
}

/**
 * Returns filter function to match adUnitCode in slot
 * @param {string} adUnitCode AdUnit code
 * @return {function} filter function
 */
function isSlotMatchingAdUnitCode(adUnitCode) {
  return slot => {
    const match = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isAdUnitCodeMatchingSlot)(slot);
    return match(adUnitCode);
  };
}

/**
 * @summary Export a k-v pair to GAM
 */
function setKeyValue(key, value) {
  if (!key || typeof key !== 'string') return false;
  window.googletag = window.googletag || {
    cmd: []
  };
  setKeyValueOn(key, value, window.googletag);
}
function setKeyValueOn(key, value, gpt = window.googletag) {
  gpt.cmd = gpt.cmd || [];
  gpt.cmd.push(() => {
    (0,_src_utils_gptTargeting_js__WEBPACK_IMPORTED_MODULE_3__.setPageTargeting)(key, value, gpt);
  });
}

/**
 * @summary Uses the adUnit's code in order to find a matching gpt slot object on the page
 */
function getGptSlotForAdUnitCode(adUnitCode) {
  let matchingSlot;
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isGptPubadsDefined)()) {
    // find the first matching gpt slot on the page
    matchingSlot = window.googletag.pubads().getSlots().find(slot => {
      const match = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isAdUnitCodeMatchingSlot)(slot);
      return match(adUnitCode);
    });
  }
  return matchingSlot;
}

/**
 * @summary Uses the adUnit's code in order to find a matching gptSlot on the page
 */
function getGptSlotInfoForAdUnitCode(adUnitCode) {
  if (slotInfoCache.has(adUnitCode)) {
    return slotInfoCache.get(adUnitCode);
  }
  const matchingSlot = getGptSlotForAdUnitCode(adUnitCode);
  let info = {};
  if (matchingSlot) {
    info = {
      gptSlot: matchingSlot.getAdUnitPath(),
      divId: matchingSlot.getSlotElementId()
    };
  }
  !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(info) && slotInfoCache.set(adUnitCode, info);
  return info;
}
const taxonomies = ['IAB_AUDIENCE_1_1', 'IAB_CONTENT_2_2'];
function getSignals(fpd) {
  const signals = Object.entries({
    [taxonomies[0]]: getSegments(fpd, ['user.data'], 4),
    [taxonomies[1]]: getSegments(fpd, _src_fpd_oneClient_js__WEBPACK_IMPORTED_MODULE_0__.CLIENT_SECTIONS.map(section => `${section}.content.data`), 6)
  }).map(([taxonomy, values]) => values.length ? {
    taxonomy,
    values
  } : null).filter(ob => ob);
  return signals;
}
function getSegments(fpd, sections, segtax) {
  return sections.flatMap(section => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fpd, section) || []).filter(datum => datum.ext?.segtax === segtax).flatMap(datum => datum.segment?.map(seg => seg.id)).filter(ob => ob).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques);
}

/**
 * Add an event listener on the given GAM event.
 * If GPT Pubads isn't defined, window.googletag is set to a new object.
 * @param {String} event
 * @param {Function} callback
 */
function subscribeToGamEvent(event, callback) {
  const register = () => window.googletag.pubads().addEventListener(event, callback);
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isGptPubadsDefined)()) {
    register();
    return;
  }
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.cmd.push(register);
}

/**
 * @typedef {Object} Slot
 * @property {function(String): (String|null)} get
 * @property {function(): String} getAdUnitPath
 * @property {function(): String[]} getAttributeKeys
 * @property {function(): String[]} getCategoryExclusions
 * @property {function(String): String} getSlotElementId
 * @property {function(): String[]} getTargeting
 * @property {function(): String[]} getTargetingKeys
 * @see {@link https://developers.google.com/publisher-tag/reference#googletag.Slot GPT official docs}
 */

/**
 * @typedef {Object} SlotRenderEndedEvent
 * @property {(String|null)} advertiserId
 * @property {(String|null)} campaignId
 * @property {(String[]|null)} companyIds
 * @property {(Number|null)} creativeId
 * @property {(Number|null)} creativeTemplateId
 * @property {(Boolean)} isBackfill
 * @property {(Boolean)} isEmpty
 * @property {(Number[]|null)} labelIds
 * @property {(Number|null)} lineItemId
 * @property {(String)} serviceName
 * @property {(string|Number[]|null)} size
 * @property {(Slot)} slot
 * @property {(Boolean)} slotContentChanged
 * @property {(Number|null)} sourceAgnosticCreativeId
 * @property {(Number|null)} sourceAgnosticLineItemId
 * @property {(Number[]|null)} yieldGroupIds
 * @see {@link https://developers.google.com/publisher-tag/reference#googletag.events.SlotRenderEndedEvent GPT official docs}
 */

/**
 * @callback SlotRenderEndedEventCallback
 * @param {SlotRenderEndedEvent} event
 * @returns {void}
 */

/**
 * Add an event listener on the GAM event 'slotRenderEnded'.
 * @param {SlotRenderEndedEventCallback} callback
 */
function subscribeToGamSlotRenderEndedEvent(callback) {
  subscribeToGamEvent('slotRenderEnded', callback);
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["percentInView"],{

/***/ "./libraries/percentInView/percentInView.js"
/*!**************************************************!*\
  !*** ./libraries/percentInView/percentInView.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewability: () => (/* binding */ getViewability),
/* harmony export */   isViewabilityMeasurable: () => (/* binding */ isViewabilityMeasurable)
/* harmony export */ });
/* unused harmony exports getViewportOffset, getBoundingBox, dep, intersections, viewportIntersections, mkIntersectionHook, mkPrewarmHook, percentInView */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/winDimensions.js");
/* harmony import */ var _boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../boundingClientRect/boundingClientRect.js */ "./libraries/boundingClientRect/boundingClientRect.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/prebid.js */ "./src/prebid.js");
/* harmony import */ var _src_utils_adUnits_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/utils/adUnits.js */ "./src/utils/adUnits.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../src/config.js */ "./src/config.js");








/**
 * Whether viewability may be measured with an intersection observer. Doing so means waiting for the
 * observer to deliver, and so yielding the main thread; otherwise measurements are taken from the
 * element's bounding rect instead.
 *
 * Follows `auctionOptions.viewabilityMeasurement` where it is set, and whether the main thread may be
 * yielded at all otherwise.
 */
function observerAllowed() {
  const measurement = _src_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('auctionOptions')?.viewabilityMeasurement;
  return measurement == null ? (0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__.getGlobal)().yield ?? true : measurement === 'observer';
}

/**
 * return the offset between the given window's viewport and the top window's.
 */
function getViewportOffset(win = window) {
  let x = 0;
  let y = 0;
  try {
    while (win?.frameElement != null) {
      const rect = (0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(win.frameElement);
      x += rect.left;
      y += rect.top;
      win = win.parent;
    }
  } catch (e) {
    // offset cannot be calculated as some parents are cross-frame
    // fallback to 0,0
    x = 0;
    y = 0;
  }
  return {
    x,
    y
  };
}
function applySize(bbox, {
  w,
  h
}) {
  let {
    width,
    height,
    left,
    top,
    right,
    bottom,
    x,
    y
  } = bbox;
  if ((width === 0 || height === 0) && w && h) {
    width = w;
    height = h;
    right = left + w;
    bottom = top + h;
  }
  return {
    width,
    height,
    left,
    top,
    right,
    bottom,
    x,
    y
  };
}
function getBoundingBox(element, {
  w,
  h
} = {}) {
  return applySize((0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(element), {
    w,
    h
  });
}
function getIntersectionOfRects(rects) {
  const bbox = {
    left: rects[0].left,
    right: rects[0].right,
    top: rects[0].top,
    bottom: rects[0].bottom
  };
  for (let i = 1; i < rects.length; ++i) {
    bbox.left = Math.max(bbox.left, rects[i].left);
    bbox.right = Math.min(bbox.right, rects[i].right);
    if (bbox.left >= bbox.right) {
      return null;
    }
    bbox.top = Math.max(bbox.top, rects[i].top);
    bbox.bottom = Math.min(bbox.bottom, rects[i].bottom);
    if (bbox.top >= bbox.bottom) {
      return null;
    }
  }
  bbox.width = bbox.right - bbox.left;
  bbox.height = bbox.bottom - bbox.top;
  return bbox;
}

/**
 * Percentage of the given bounding box that lies within the top window's viewport,
 * and within each of `clipRects`.
 *
 * `elementBoundingBox` is taken relative to `win`'s viewport, and is modified in place.
 * `clipRects` are in top window coordinates.
 */
function percentInViewOfBox(elementBoundingBox, win, clipRects = []) {
  // when in an iframe, the bounding box is relative to the iframe's viewport
  // since we are intersecting it with the top window's viewport, attempt to
  // compensate for the offset between them

  const offset = getViewportOffset(win);
  elementBoundingBox.left += offset.x;
  elementBoundingBox.right += offset.x;
  elementBoundingBox.top += offset.y;
  elementBoundingBox.bottom += offset.y;
  const dims = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.getWinDimensions)();

  // Obtain the intersection of the element, the viewport, and everything that clips the element
  const elementInViewBoundingBox = getIntersectionOfRects([{
    left: 0,
    top: 0,
    right: dims.document.documentElement.clientWidth,
    bottom: dims.document.documentElement.clientHeight
  }, elementBoundingBox, ...clipRects]);
  let elementInViewArea, elementTotalArea;
  if (elementInViewBoundingBox !== null) {
    // Some or all of the element is in view
    elementInViewArea = elementInViewBoundingBox.width * elementInViewBoundingBox.height;
    elementTotalArea = elementBoundingBox.width * elementBoundingBox.height;
    return elementInViewArea / elementTotalArea * 100;
  }

  // No overlap between element and the viewport; therefore, the element
  // lies completely out of view
  return 0;
}

/**
 * Whether an ancestor with the given style contains an element positioned as `position`, and can
 * therefore clip it. Out of flow elements are laid out against something further up the tree, and
 * are not clipped by the ancestors they skip over.
 */
function contains(style, position) {
  if (position !== 'absolute' && position !== 'fixed') {
    return true;
  }
  return position === 'absolute' && style.position !== 'static' || style.transform !== 'none' || style.perspective !== 'none' || style.filter !== 'none' || /transform|perspective|filter/.test(style.willChange) || /paint|layout|strict|content/.test(style.contain);
}

/**
 * Rectangles that clip the given element, in top window coordinates: the boxes of its
 * scrolling or overflow-hidden ancestors, and of every frame that contains it.
 *
 * Returns null if the element or one of its ancestors is styled so that nothing renders.
 *
 * Clipping is approximated: the boxes include the ancestors' borders rather than stopping at their
 * padding edge.
 */
function getClipRects(element) {
  const rects = [];
  let el = element;
  let win = element?.ownerDocument?.defaultView;
  try {
    while (el != null && win != null) {
      const {
        x,
        y
      } = getViewportOffset(win);
      let node = el;
      // how the subtree being walked is positioned, which decides which ancestors can clip it
      let position;
      while (node != null) {
        const style = getComputedStyle(node);
        // an ancestor that is transparent or hidden hides the element regardless of positioning
        if (style.visibility === 'hidden' || style.opacity === '0') {
          return null;
        }
        if (node === el) {
          position = style.position;
        } else if (contains(style, position)) {
          if (style.overflow !== 'visible') {
            const rect = (0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(node);
            rects.push({
              left: rect.left + x,
              top: rect.top + y,
              right: rect.right + x,
              bottom: rect.bottom + y
            });
          }
          // from here up it is this ancestor that carries the element, so its own positioning
          // decides which of the remaining ancestors can clip it
          position = style.position;
        }
        node = node.parentElement;
      }
      // nothing can render outside the frame that contains it
      const frame = win.frameElement;
      if (frame == null) break;
      win = frame.ownerDocument?.defaultView;
      const offset = getViewportOffset(win);
      const rect = (0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(frame);
      rects.push({
        left: rect.left + offset.x,
        top: rect.top + offset.y,
        right: rect.right + offset.x,
        bottom: rect.bottom + offset.y
      });
      el = frame;
    }
  } catch (e) {
    // some ancestors are cross-frame and cannot be inspected; clip against those we could reach
  }
  return rects;
}

/**
 * Percentage of `box` - a bounding box for `element`, in the coordinates of `element`'s viewport -
 * that lies within the top window's viewport, accounting for everything that clips or hides
 * `element`.
 *
 * `box` is passed in rather than measured so that a caller that already has the element's rect does
 * not force a layout for it; the ancestors that clip it are still inspected.
 */
const percentInViewOfElementBox = (element, box) => {
  const clipRects = getClipRects(element);
  return clipRects == null ? 0 : percentInViewOfBox(box, element?.ownerDocument?.defaultView, clipRects);
};
const percentInViewStatic = (element, {
  w,
  h
} = {}) => percentInViewOfElementBox(element, getBoundingBox(element, {
  w,
  h
}));
const dep = {
  // for stubbing in tests, see test/mocks/percentInView.js
  getElement: element => element
};

/**
 * A wrapper around an IntersectionObserver that keeps track of the latest IntersectionEntry that was observed
 * for each observed element.
 *
 * @param mkObserver
 */
function intersections(mkObserver) {
  const intersections = new WeakMap();
  // resolvers waiting on the first entry for an element, keyed by that element.
  // only elements that someone is actually waiting on appear here; they are dropped
  // as soon as they are woken, so a page that is merely scrolling allocates nothing.
  const waiting = new WeakMap();
  function observerCallback(entries) {
    entries.forEach(entry => {
      if ((intersections.get(entry.target)?.time ?? -1) < entry.time) {
        intersections.set(entry.target, entry);
        const resolvers = waiting.get(entry.target);
        if (resolvers != null) {
          waiting.delete(entry.target);
          resolvers.forEach(resolve => resolve(entry));
        }
      }
    });
  }
  let obs = null;
  try {
    obs = mkObserver(observerCallback);
  } catch (e) {
    // IntersectionObserver not supported
  }
  function waitFor(element) {
    return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise(resolve => {
      const resolvers = waiting.get(element);
      if (resolvers == null) {
        waiting.set(element, [resolve]);
      } else {
        resolvers.push(resolve);
      }
    });
  }
  /**
   * Observe the given element; returns a promise to the first available intersection observed for it.
   */
  async function observe(element) {
    element = dep.getElement(element);
    if (element == null || obs == null) {
      return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.resolve(getIntersection(element));
    }
    if (!intersections.has(element)) {
      obs.observe(element);
      intersections.set(element, null);
    }
    // a null entry marks an element that is being observed but has not been reported on yet; wait
    // for it, so that observing the same element again does not resolve the second caller with
    // nothing to measure
    return getIntersection(element) ?? waitFor(element);
  }

  /**
   * Return the latest intersection that was observed for the given element.
   */
  function getIntersection(element) {
    return intersections.get(element);
  }
  return {
    observe,
    getIntersection
  };
}
const viewportIntersections = intersections(callback => new IntersectionObserver(callback, {
  // update percentInView when visibility varies by 1%
  threshold: Array.from({
    length: 101
  }, (e, i) => i / 100)
}));
function mkIntersectionHook(intersections = viewportIntersections) {
  return function (next, request) {
    if (!observerAllowed()) {
      // measurements will not consult the observer, so there is nothing to wait for
      next.call(this, request);
      return;
    }
    _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.race([_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.allSettled((request.adUnits ?? []).map(adUnit => intersections.observe((0,_src_utils_adUnits_js__WEBPACK_IMPORTED_MODULE_5__.getAdUnitElement)(adUnit)))),
    // according to MDN, with threshold 0 "the callback will be run as soon as the target element intersects or touches the boundary of the root, even if no pixels are yet visible"
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // However, browsers appear to run it even when the element is outside the DOM
    // just to be sure, cap the amount of time we wait for intersections.
    //
    // the cap only holds as an upper bound with high priority scheduling: an ordinary timer is
    // queued behind all other ready work, so on a busy page it comes due well past its deadline -
    // which is when bounding the wait matters most.
    //
    // the first observation for an element arrives as a queued task, rather than with the
    // rendering lifecycle that carries later updates, so it needs well under a millisecond of free
    // main thread; 20ms leaves margin for a moderately busy one. Much less would be
    // counterproductive: a user-blocking task outruns the observer, so the wait would end before
    // any entry had arrived.
    (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.urgentDelay)(20)]).then(() => next.call(this, request));
  };
}

/**
 * Begin observing ad unit elements as soon as bids are requested, rather than when the auction
 * starts, so that entries are already available by the time `mkIntersectionHook` needs them and it
 * does not have to wait. The hooks that run in between are asynchronous (consent, price floors,
 * currency, user ids), which gives the observer the main thread time it needs to deliver.
 */
function mkPrewarmHook(intersections = viewportIntersections) {
  return function (next, request) {
    if (observerAllowed()) {
      (request?.adUnits ?? []).forEach(adUnit => {
        // deliberately not waited on; this only needs to get the observation started
        intersections.observe((0,_src_utils_adUnits_js__WEBPACK_IMPORTED_MODULE_5__.getAdUnitElement)(adUnit)).catch(() => {
          // the element cannot be observed, so percentInView measures the DOM directly instead
        });
      });
    }
    next.call(this, request);
  };
}
_src_prebid_js__WEBPACK_IMPORTED_MODULE_4__.startAuction.before(mkIntersectionHook());
// ahead of the asynchronous requestBids hooks (all of which are priority 50 or lower), so that their
// main thread time is available to the observer
_src_prebid_js__WEBPACK_IMPORTED_MODULE_4__.requestBids.before(mkPrewarmHook(), 100);
function percentInView(element, {
  w,
  h
} = {}) {
  if (!observerAllowed()) {
    return percentInViewStatic(element, {
      w,
      h
    });
  }
  const intersection = viewportIntersections.getIntersection(element);
  if (intersection == null) {
    viewportIntersections.observe(element);
    return percentInViewStatic(element, {
      w,
      h
    });
  } else {
    const bbox = intersection.boundingClientRect;
    const adjusted = applySize(bbox, {
      w,
      h
    });
    if (adjusted.width !== bbox.width || adjusted.height !== bbox.height) {
      // the element has collapsed, so the observer's ratio describes a rect of no area;
      // recompute from the w/h override, reusing the position the observer already
      // reported to avoid forcing a layout for a rect we have on hand. The observer's ratio is
      // what accounts for clipping, and it is being discarded here, so the clipping ancestors
      // have to be walked as they are for any other measurement taken from the DOM
      return percentInViewStatic(element, {
        w,
        h
      });
    }
    if (bbox.width === 0 || bbox.height === 0) {
      // an element with no area renders nothing, but intersection observers report a ratio
      // of 1 for a zero-area target that touches the viewport, which would read as fully in view
      return 0;
    }
    return intersection.isIntersecting ? intersection.intersectionRatio * 100 : 0;
  }
}

/**
 * Checks if viewability can be measured for an element
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} True if viewability is measurable
 */
function isViewabilityMeasurable(element) {
  return !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.inIframe)() && element !== null;
}

/**
 * Gets the viewability percentage of an element
 * @param {HTMLElement} element - DOM element to measure
 * @param {Window} topWin - Top window object
 * @param {Object} size - Size object with width and height
 * @returns {number|string} Viewability percentage or 0 if not visible
 */
function getViewability(element, topWin, size) {
  return topWin.document.visibilityState === 'visible' ? percentInView(element, size) : 0;
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["boundingClientRect"],{

/***/ "./libraries/boundingClientRect/boundingClientRect.js"
/*!************************************************************!*\
  !*** ./libraries/boundingClientRect/boundingClientRect.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBoundingClientRect: () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* unused harmony export clearCache */
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/prebid.js */ "./src/prebid.js");

const cache = new Map();
_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.startAuction.before((next, auctionConfig) => {
  clearCache();
  next(auctionConfig);
});
function clearCache() {
  cache.clear();
}
function getBoundingClientRect(element) {
  let clientRect;
  if (cache.has(element)) {
    clientRect = cache.get(element);
  } else {
    // eslint-disable-next-line no-restricted-properties
    clientRect = element.getBoundingClientRect();
    cache.set(element, clientRect);
  }
  return clientRect;
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["metadata"],{

/***/ "./libraries/metadata/metadata.js"
/*!****************************************!*\
  !*** ./libraries/metadata/metadata.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   metadata: () => (/* binding */ metadata)
/* harmony export */ });
/* unused harmony export metadataRepository */
function metadataRepository() {
  const components = {};
  const disclosures = {};
  const componentsByModule = {};
  const repo = {
    register(moduleName, data) {
      if (Array.isArray(data.components)) {
        if (!componentsByModule.hasOwnProperty(moduleName)) {
          componentsByModule[moduleName] = [];
        }
        data.components.forEach(component => {
          if (!components.hasOwnProperty(component.componentType)) {
            components[component.componentType] = {};
          }
          components[component.componentType][component.componentName] = component;
          componentsByModule[moduleName].push([component.componentType, component.componentName]);
        });
      }
      if (data.disclosures) {
        Object.assign(disclosures, data.disclosures);
      }
    },
    getMetadata(componentType, componentName) {
      return components?.[componentType]?.[componentName];
    },
    getStorageDisclosure(disclosureURL) {
      return disclosures?.[disclosureURL];
    },
    getModuleMetadata(moduleName) {
      const components = (componentsByModule[moduleName] ?? []).map(([componentType, componentName]) => repo.getMetadata(componentType, componentName));
      if (components.length === 0) return null;
      const disclosures = Object.fromEntries(components.filter(({
        disclosureURL
      }) => disclosureURL != null).map(({
        disclosureURL
      }) => [disclosureURL, repo.getStorageDisclosure(disclosureURL)]));
      return {
        disclosures,
        components
      };
    }
  };
  return repo;
}
const metadata = metadataRepository();

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["storageDisclosure"],{

/***/ "./libraries/storageDisclosure/summary.js"
/*!************************************************!*\
  !*** ./libraries/storageDisclosure/summary.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStorageDisclosureSummary: () => (/* binding */ getStorageDisclosureSummary)
/* harmony export */ });
// NOTE: this file is used both by the build system and Prebid runtime; the former
// needs the ".mjs" extension, but precompilation transforms this into a "normal" .js

function getStorageDisclosureSummary(moduleNames, getModuleMetadata) {
  const summary = {};
  moduleNames.forEach(moduleName => {
    const disclosure = getModuleMetadata(moduleName)?.disclosures;
    if (!disclosure) return;
    Object.entries(disclosure).forEach(([url, {
      disclosures: identifiers
    }]) => {
      if (summary.hasOwnProperty(url)) {
        summary[url].forEach(({
          disclosedBy
        }) => disclosedBy.push(moduleName));
      } else if (identifiers?.length > 0) {
        summary[url] = identifiers.map(identifier => ({
          disclosedIn: url,
          disclosedBy: [moduleName],
          ...identifier
        }));
      }
    });
  });
  return [].concat(...Object.values(summary));
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["purposeDeclarations"],{

/***/ "./libraries/purposeDeclarations/validate.js"
/*!***************************************************!*\
  !*** ./libraries/purposeDeclarations/validate.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validatePurposeDeclarations: () => (/* binding */ validatePurposeDeclarations)
/* harmony export */ });
// NOTE: this file is used both by the build system and Prebid runtime; the former
// needs the ".mjs" extension, but precompilation transforms this into a "normal" .js

function validatePurposeDeclarations({
  purposes,
  legIntPurposes,
  flexiblePurposes
}) {
  const bothBases = purposes.concat(legIntPurposes).filter(purpose => purposes.includes(purpose) && legIntPurposes.includes(purpose));
  if (bothBases.length > 0) {
    return `declares both consent and LI for purposes ${bothBases.join(', ')}`;
  }
  const noBasis = flexiblePurposes.filter(purpose => !purposes.includes(purpose) && !legIntPurposes.includes(purpose));
  if (noBasis.length > 0) {
    return `declares purposes ${noBasis.join(', ')} as flexible, but no legal basis for them`;
  }
}

/***/ }

}]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementGpp"],{

/***/ "./modules/consentManagementGpp.js"
/*!*****************************************!*\
  !*** ./modules/consentManagementGpp.js ***!
  \*****************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports consentConfig, GPPClient, toConsentData, resetConsentData, removeCmpListener, setConsentConfig, enrichFPDHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libraries/cmp/cmpClient.js */ "./libraries/cmp/cmpClient.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libraries/consentManagement/cmUtils.js */ "./libraries/consentManagement/cmUtils.js");
/* harmony import */ var _libraries_cmp_cmpEventUtils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libraries/cmp/cmpEventUtils.js */ "./libraries/cmp/cmpEventUtils.js");

/**
 * This module adds GPP consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GPP supported adapters to read/pass this information to
 * their system and for various other features/modules in Prebid.js.
 */









let consentConfig = {};

// CMP event manager instance for GPP
let gppCmpEventManager = null;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

class GPPError {
  constructor(message, arg) {
    this.message = message;
    this.args = arg == null ? [] : [arg];
  }
}
class GPPClient {
  apiVersion = '1.1';
  static get(mkCmp = _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_7__.cmpClient) {
    if (this.INST == null) {
      const cmp = mkCmp({
        apiName: '__gpp',
        apiArgs: ['command', 'callback', 'parameter'],
        // do not pass version - not clear what it's for (or what we should use),
        mode: _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_7__.MODE_CALLBACK
      });
      if (cmp == null) {
        throw new GPPError('GPP CMP not found');
      }
      this.INST = new this(cmp);
    }
    return this.INST;
  }
  #resolve;
  #reject;
  #pending = [];
  initialized = false;
  constructor(cmp) {
    this.cmp = cmp;
    [this.#resolve, this.#reject] = ['resolve', 'reject'].map(slot => result => {
      while (this.#pending.length) {
        this.#pending.pop()[slot](result);
      }
    });
  }

  /**
   * initialize this client - update consent data if already available,
   * and set up event listeners to also update on CMP changes
   *
   * @param pingData
   * @returns {Promise<{}>} a promise to GPP consent data
   */
  init(pingData) {
    const ready = this.updateWhenReady(pingData);
    if (!this.initialized) {
      if (pingData.gppVersion !== this.apiVersion) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Unrecognized GPP CMP version: ${pingData.apiVersion}. Continuing using GPP API version ${this.apiVersion}...`);
      }
      this.initialized = true;

      // Initialize CMP event manager and set CMP API
      if (!gppCmpEventManager) {
        gppCmpEventManager = (0,_libraries_cmp_cmpEventUtils_js__WEBPACK_IMPORTED_MODULE_10__.createCmpEventManager)('gpp');
      }
      gppCmpEventManager.setCmpApi(this.cmp);
      this.cmp({
        command: 'addEventListener',
        callback: (event, success) => {
          if (success != null && !success) {
            this.#reject(new GPPError('Received error response from CMP', event));
          } else if (event?.pingData?.cmpStatus === 'error') {
            this.#reject(new GPPError('CMP status is "error"; please check CMP setup', event));
          } else if (this.isCMPReady(event?.pingData || {}) && ['sectionChange', 'signalStatus'].includes(event?.eventName)) {
            this.#resolve(this.updateConsent(event.pingData));
          }
          // NOTE: according to https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md,
          // > [signalStatus] Event is called whenever the display status of the CMP changes (e.g. the CMP shows the consent layer).
          //
          // however, from real world testing, at least some CMPs only trigger 'cmpDisplayStatus'
          // other CMPs may do something else yet; here we just look for 'signalStatus: not ready' on any event
          // to decide if consent data is likely to change
          if (_src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gppDataHandler.getConsentData() != null && event?.pingData != null && !this.isCMPReady(event.pingData)) {
            _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gppDataHandler.setConsentData(null);
          }
          if (event?.listenerId !== null && event?.listenerId !== undefined) {
            gppCmpEventManager?.setCmpListenerId(event?.listenerId);
          }
        }
      });
    }
    return ready;
  }
  refresh() {
    return this.cmp({
      command: 'ping'
    }).then(this.init.bind(this));
  }

  /**
   * Retrieve and store GPP consent data.
   *
   * @param pingData
   * @returns {Promise<{}>} a promise to GPP consent data
   */
  updateConsent(pingData) {
    return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_8__.PbPromise(resolve => {
      if (pingData == null || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(pingData)) {
        throw new GPPError('Received empty response from CMP', pingData);
      }
      const consentData = parseConsentData(pingData);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Retrieved GPP consent from CMP:', consentData);
      _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gppDataHandler.setConsentData(consentData);
      resolve(consentData);
    });
  }

  /**
   * Return a promise to GPP consent data, to be retrieved the next time the CMP signals it's ready.
   *
   * @returns {Promise<{}>}
   */
  nextUpdate() {
    const def = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_8__.defer)();
    this.#pending.push(def);
    return def.promise;
  }

  /**
   * Return a promise to GPP consent data, to be retrieved immediately if the CMP is ready according to `pingData`,
   * or as soon as it signals that it's ready otherwise.
   *
   * @param pingData
   * @returns {Promise<{}>}
   */
  updateWhenReady(pingData) {
    return this.isCMPReady(pingData) ? this.updateConsent(pingData) : this.nextUpdate();
  }
  isCMPReady(pingData) {
    return pingData.signalStatus === 'ready';
  }
}
function lookupIabConsent() {
  return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_8__.PbPromise(resolve => resolve(GPPClient.get().refresh()));
}

// add new CMPs here, with their dedicated lookup function
const cmpCallMap = {
  'iab': lookupIabConsent
};
function parseConsentData(cmpData) {
  if (cmpData?.applicableSections != null && !Array.isArray(cmpData.applicableSections) || cmpData?.gppString != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(cmpData.gppString) || cmpData?.parsedSections != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(cmpData.parsedSections)) {
    throw new GPPError('CMP returned unexpected value during lookup process.', cmpData);
  }
  ['usnatv1', 'uscav1'].forEach(section => {
    if (cmpData?.parsedSections?.[section]) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Received invalid section from cmp: '${section}'. Some functionality may not work as expected`, cmpData);
    }
  });
  return toConsentData(cmpData);
}
function toConsentData(gppData = {}) {
  return {
    gppString: gppData?.gppString,
    applicableSections: gppData?.applicableSections || [],
    parsedSections: gppData?.parsedSections || {},
    gppData: gppData
  };
}

/**
 * Simply resets the module's consentData variable back to undefined, mainly for testing purposes
 */
function resetConsentData() {
  consentConfig = {};
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gppDataHandler.reset();
  GPPClient.INST = null;
}
function removeCmpListener() {
  // Clean up CMP event listeners before resetting
  if (gppCmpEventManager) {
    gppCmpEventManager.removeCmpEventListener();
    gppCmpEventManager = null;
  }
  resetConsentData();
}
const parseConfig = (0,_libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_9__.configParser)({
  namespace: 'gpp',
  displayName: 'GPP',
  consentDataHandler: _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gppDataHandler,
  parseConsentData,
  getNullConsent: () => toConsentData(null),
  cmpHandlers: cmpCallMap,
  cmpEventCleanup: removeCmpListener
});
function setConsentConfig(config) {
  consentConfig = parseConfig(config);
  return consentConfig.loadConsentData?.()?.catch?.(() => null);
}
_src_config_js__WEBPACK_IMPORTED_MODULE_4__.config.getConfig('consentManagement', config => setConsentConfig(config.consentManagement));
function enrichFPDHook(next, fpd) {
  return next(fpd.then(ortb2 => {
    const consent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gppDataHandler.getConsentData();
    if (consent) {
      if (Array.isArray(consent.applicableSections)) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortb2, 'regs.gpp_sid', consent.applicableSections);
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortb2, 'regs.gpp', consent.gppString);
    }
    return ortb2;
  }));
}
_src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_6__.enrichFPD.before(enrichFPDHook);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('consentManagementGpp');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","consentManagement","cmp"], () => (__webpack_exec__("./modules/consentManagementGpp.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementTcf"],{

/***/ "./modules/consentManagementTcf.js"
/*!*****************************************!*\
  !*** ./modules/consentManagementTcf.js ***!
  \*****************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports consentConfig, gdprScope, tcfCmpEventManager, resetConsentData, removeCmpListener, setConsentConfig, enrichFPDHook, setOrtbAdditionalConsent */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/pbjsORTB.js */ "./src/pbjsORTB.js");
/* harmony import */ var _src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libraries/cmp/cmpClient.js */ "./libraries/cmp/cmpClient.js");
/* harmony import */ var _libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libraries/consentManagement/cmUtils.js */ "./libraries/consentManagement/cmUtils.js");
/* harmony import */ var _libraries_cmp_cmpEventUtils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libraries/cmp/cmpEventUtils.js */ "./libraries/cmp/cmpEventUtils.js");
/* harmony import */ var _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../libraries/consentManagement/consentUtils.js */ "./libraries/consentManagement/consentUtils.js");

/**
 * This module adds GDPR consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GDPR supported adapters to read/pass this information to
 * their system.
 */










let consentConfig = {};
let gdprScope;
let dsaPlatform;
const CMP_VERSION = _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_11__.TCF_CMP_VERSION;

// add new CMPs here, with their dedicated lookup function
const cmpCallMap = {
  'iab': lookupIabConsent
};

// CMP event manager instance for TCF
let tcfCmpEventManager = null;
/**
 * This function handles interacting with an IAB compliant CMP to obtain the consent information of the user.
 */
function lookupIabConsent(setProvisionalConsent) {
  return new Promise((resolve, reject) => {
    function cmpResponseCallback(tcfData, success) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Received a response from CMP', tcfData);
      if (success) {
        try {
          setProvisionalConsent(parseConsentData(tcfData));
        } catch (e) {}
        if (tcfData.gdprApplies === false || tcfData.eventStatus === 'tcloaded' || tcfData.eventStatus === 'useractioncomplete') {
          try {
            if (tcfData.listenerId !== null && tcfData.listenerId !== undefined) {
              tcfCmpEventManager?.setCmpListenerId(tcfData.listenerId);
            }
            _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler.setConsentData(parseConsentData(tcfData));
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      } else {
        reject(Error('CMP unable to register callback function.  Please check CMP setup.'));
      }
    }
    const cmp = (0,_libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_8__.cmpClient)({
      apiName: '__tcfapi',
      apiVersion: CMP_VERSION,
      apiArgs: ['command', 'version', 'callback', 'parameter']
    });
    if (!cmp) {
      reject(new Error('TCF2 CMP not found.'));
    }
    if (cmp.isDirect) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Detected CMP API is directly accessible, calling it now...');
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Detected CMP is outside the current iframe where Prebid.js is located, calling it now...');
    }

    // Initialize CMP event manager and set CMP API
    if (!tcfCmpEventManager) {
      tcfCmpEventManager = (0,_libraries_cmp_cmpEventUtils_js__WEBPACK_IMPORTED_MODULE_10__.createCmpEventManager)('tcf', () => _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler.getConsentData());
    }
    tcfCmpEventManager.setCmpApi(cmp);
    cmp({
      command: 'addEventListener',
      callback: cmpResponseCallback
    });
  });
}
function parseConsentData(consentObject) {
  function checkData() {
    // if CMP does not respond with a gdprApplies boolean, use defaultGdprScope (gdprScope)
    const gdprApplies = consentObject && typeof consentObject.gdprApplies === 'boolean' ? consentObject.gdprApplies : gdprScope;
    const tcString = consentObject && consentObject.tcString;
    return !!(typeof gdprApplies !== 'boolean' || gdprApplies === true && (!tcString || !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(tcString)));
  }
  if (checkData()) {
    throw Object.assign(new Error(`CMP returned unexpected value during lookup process.`), {
      args: [consentObject]
    });
  } else {
    return toConsentData(consentObject);
  }
}
function toConsentData(cmpConsentObject) {
  const consentData = {
    consentString: cmpConsentObject ? cmpConsentObject.tcString : undefined,
    vendorData: cmpConsentObject || undefined,
    gdprApplies: cmpConsentObject && typeof cmpConsentObject.gdprApplies === 'boolean' ? cmpConsentObject.gdprApplies : gdprScope,
    apiVersion: CMP_VERSION
  };
  if (cmpConsentObject && cmpConsentObject.addtlConsent && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(cmpConsentObject.addtlConsent)) {
    consentData.addtlConsent = cmpConsentObject.addtlConsent;
  }
  return consentData;
}

/**
 * Simply resets the module's consentData variable back to undefined, mainly for testing purposes
 */
function resetConsentData() {
  consentConfig = {};
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler.reset();
}
function removeCmpListener() {
  // Clean up CMP event listeners before resetting
  if (tcfCmpEventManager) {
    tcfCmpEventManager.removeCmpEventListener();
    tcfCmpEventManager = null;
  }
  resetConsentData();
}
const parseConfig = (0,_libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_9__.configParser)({
  namespace: 'gdpr',
  displayName: 'TCF',
  consentDataHandler: _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler,
  cmpHandlers: cmpCallMap,
  parseConsentData,
  getNullConsent: () => toConsentData(null),
  cmpEventCleanup: removeCmpListener
});

/**
 * A configuration function that initializes some module variables, as well as add a hook into the requestBids function
 */
function setConsentConfig(config) {
  // if `config.gdpr`, `config.usp` or `config.gpp` exist, assume new config format.
  // else for backward compatability, just use `config`
  const tcfConfig = config && (config.gdpr || config.usp || config.gpp ? config.gdpr : config);
  if (tcfConfig?.consentData?.getTCData != null) {
    tcfConfig.consentData = tcfConfig.consentData.getTCData;
  }
  gdprScope = tcfConfig?.defaultGdprScope === true;
  dsaPlatform = !!tcfConfig?.dsaPlatform;
  consentConfig = parseConfig({
    gdpr: tcfConfig
  });
  return consentConfig.loadConsentData?.()?.catch?.(() => null);
}
_src_config_js__WEBPACK_IMPORTED_MODULE_4__.config.getConfig('consentManagement', config => setConsentConfig(config.consentManagement));
function enrichFPDHook(next, fpd) {
  return next(fpd.then(ortb2 => {
    const consent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler.getConsentData();
    if (consent) {
      if (typeof consent.gdprApplies === 'boolean') {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortb2, 'regs.ext.gdpr', consent.gdprApplies ? 1 : 0);
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortb2, 'user.ext.consent', consent.consentString);
    }
    if (dsaPlatform) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortb2, 'regs.ext.dsa.dsarequired', 3);
    }
    return ortb2;
  }));
}
_src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_7__.enrichFPD.before(enrichFPDHook);
function setOrtbAdditionalConsent(ortbRequest, bidderRequest) {
  // this is not a standardized name for addtlConsent, so keep this as an ORTB library processor rather than an FPD enrichment
  const addtl = bidderRequest.gdprConsent?.addtlConsent;
  if (addtl && typeof addtl === 'string') {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(ortbRequest, 'user.ext.ConsentedProvidersSettings.consented_providers', addtl);
  }
}
(0,_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_6__.registerOrtbProcessor)({
  type: _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_6__.REQUEST,
  name: 'gdprAddtlConsent',
  fn: setOrtbAdditionalConsent
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('consentManagementTcf');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","consentManagement","cmp"], () => (__webpack_exec__("./modules/consentManagementTcf.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["debugging"],{

/***/ "./modules/debugging/bidInterceptor.js"
/*!*********************************************!*\
  !*** ./modules/debugging/bidInterceptor.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makebidInterceptor: () => (/* binding */ makebidInterceptor)
/* harmony export */ });
/* harmony import */ var _responses_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./responses.js */ "./modules/debugging/responses.js");


/**
 * @typedef {Number|String|boolean|null|undefined} Scalar
 */

function makebidInterceptor({
  utils,
  BANNER,
  NATIVE,
  VIDEO,
  Renderer
}) {
  const {
    deepAccess,
    deepClone,
    delayExecution,
    hasNonSerializableProperty,
    mergeDeep
  } = utils;
  const responseResolvers = (0,_responses_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    Renderer,
    BANNER,
    NATIVE,
    VIDEO
  });
  function BidInterceptor(opts = {}) {
    ({
      setTimeout: this.setTimeout = window.setTimeout.bind(window)
    } = opts);
    this.logger = opts.logger;
    this.rules = [];
  }
  Object.assign(BidInterceptor.prototype, {
    DEFAULT_RULE_OPTIONS: {
      delay: 0
    },
    serializeConfig(ruleDefs) {
      const isSerializable = (ruleDef, i) => {
        const serializable = !hasNonSerializableProperty(ruleDef);
        if (!serializable && !deepAccess(ruleDef, 'options.suppressWarnings')) {
          this.logger.logWarn(`Bid interceptor rule definition #${i + 1} contains non-serializable properties and will be lost after a refresh. Rule definition: `, ruleDef);
        }
        return serializable;
      };
      return ruleDefs.filter(isSerializable);
    },
    updateConfig(config) {
      this.rules = (config.intercept || []).map((ruleDef, i) => this.rule(ruleDef, i + 1));
    },
    /**
     * @typedef {Object} RuleOptions
     * @property {Number} [delay=0] delay between bid interception and mocking of response (to simulate network delay)
     * @property {boolean} [suppressWarnings=false] if enabled, do not warn about unserializable rules
     *
     * @typedef {Object} Rule
     * @property {Number} no rule number (used only as an identifier for logging)
     * @property {function({}, {}): boolean} match a predicate function that tests a bid against this rule
     * @property {ReplacerFn} replacer generator function for mock bid responses
     * @property {RuleOptions} options
     */

    /**
     * @param {{}} ruleDef
     * @param {Number} ruleNo
     * @returns {Rule}
     */
    rule(ruleDef, ruleNo) {
      return {
        no: ruleNo,
        match: this.matcher(ruleDef.when, ruleNo),
        replace: this.replacer(ruleDef.then, ruleNo),
        options: Object.assign({}, this.DEFAULT_RULE_OPTIONS, ruleDef.options)
      };
    },
    /**
     * @typedef {Function} MatchPredicate
     * @param {*} candidate a bid to match, or a portion of it if used inside an ObjectMather.
     * e.g. matcher((bid, bidRequest) => ....) or matcher({property: (property, bidRequest) => ...})
     * @param {*} bidRequest the request `candidate` belongs to
     * @returns {boolean}
     *
     */

    /**
     * @param {*} matchDef matcher definition
     * @param {Number} ruleNo
     * @returns {MatchPredicate} a predicate function that matches a bid against the given `matchDef`
     */
    matcher(matchDef, ruleNo) {
      if (typeof matchDef === 'function') {
        return matchDef;
      }
      if (typeof matchDef !== 'object') {
        this.logger.logError(`Invalid 'when' definition for debug bid interceptor (in rule #${ruleNo})`);
        return () => false;
      }
      function matches(candidate, {
        ref = matchDef,
        args = []
      }) {
        return Object.entries(ref).map(([key, val]) => {
          const cVal = candidate[key];
          if (val instanceof RegExp) {
            return val.exec(cVal) != null;
          }
          if (typeof val === 'function') {
            return !!val(cVal, ...args);
          }
          if (typeof val === 'object') {
            return matches(cVal, {
              ref: val,
              args
            });
          }
          return cVal === val;
        }).every(i => i);
      }
      return (candidate, ...args) => matches(candidate, {
        args
      });
    },
    /**
     * @typedef {Function} ReplacerFn
     * @param {*} bid a bid that was intercepted
     * @param {*} bidRequest the request `bid` belongs to
     * @returns {*} the response to mock for `bid`, or a portion of it if used inside an ObjectReplacer.
     * e.g. replacer((bid, bidRequest) => mockResponse) or replacer({property: (bid, bidRequest) => mockProperty})
     *
     */

    /**
     * @param {*} replDef replacer definition
     * @param ruleNo
     * @return {ReplacerFn}
     */
    replacer(replDef, ruleNo) {
      if (replDef === null) {
        return () => null;
      }
      replDef = replDef || {};
      let replFn;
      if (typeof replDef === 'function') {
        replFn = ({
          args
        }) => replDef(...args);
      } else if (typeof replDef !== 'object') {
        this.logger.logError(`Invalid 'then' definition for debug bid interceptor (in rule #${ruleNo})`);
        replFn = () => ({});
      } else {
        replFn = ({
          args,
          ref = replDef
        }) => {
          const result = Array.isArray(ref) ? [] : {};
          Object.entries(ref).forEach(([key, val]) => {
            if (typeof val === 'function') {
              result[key] = val(...args);
            } else if (val != null && typeof val === 'object') {
              result[key] = replFn({
                args,
                ref: val
              });
            } else {
              result[key] = val;
            }
          });
          return result;
        };
      }
      return (bid, ...args) => {
        const response = this.responseDefaults(bid);
        mergeDeep(response, replFn({
          args: [bid, ...args]
        }));
        const resolver = responseResolvers[response.mediaType];
        resolver && resolver(bid, response);
        response.isDebug = true;
        return response;
      };
    },
    responseDefaults(bid) {
      const response = {
        requestId: bid.bidId,
        cpm: 3.5764,
        currency: 'EUR',
        ttl: 360,
        creativeId: 'mock-creative-id',
        netRevenue: false,
        meta: {}
      };
      if (!bid.mediaType) {
        response.mediaType = Object.keys(bid.mediaTypes ?? {})[0] ?? BANNER;
      }
      let size;
      if (response.mediaType === BANNER) {
        size = bid.mediaTypes?.banner?.sizes?.[0] ?? [300, 250];
      } else if (response.mediaType === VIDEO) {
        size = bid.mediaTypes?.video?.playerSize?.[0] ?? [600, 500];
      }
      if (Array.isArray(size)) {
        [response.width, response.height] = size;
      }
      return response;
    },
    /**
     * Match a candidate bid against all registered rules.
     *
     * @param {{}} candidate
     * @param args
     * @returns {Rule|undefined} the first matching rule, or undefined if no match was found.
     */
    match(candidate, ...args) {
      return this.rules.find(rule => rule.match(candidate, ...args));
    },
    /**
     * Match a set of bids against all registered rules.
     *
     * @param bids
     * @param bidRequest
     * @returns {[{bid: *, rule: Rule}[], *[]]} a 2-tuple for matching bids (decorated with the matching rule) and
     * non-matching bids.
     */
    matchAll(bids, bidRequest) {
      const [matches, remainder] = [[], []];
      bids.forEach(bid => {
        const rule = this.match(bid, bidRequest);
        if (rule != null) {
          matches.push({
            rule: rule,
            bid: bid
          });
        } else {
          remainder.push(bid);
        }
      });
      return [matches, remainder];
    },
    /**
     * Run a set of bids against all registered rules, filter out those that match,
     * and generate mock responses for them.
     *
     * {{}[]} bids?
     * {*} bidRequest
     * {function(*)} addBid called once for each mock response
     * {function()} done called once after all mock responses have been run through `addBid`
     * returns {{bids: {}[], bidRequest: {}} remaining bids that did not match any rule (this applies also to
     * bidRequest.bids)
     */
    intercept({
      bids,
      bidRequest,
      addBid,
      done
    }) {
      if (bids == null) {
        bids = bidRequest.bids;
      }
      const [matches, remainder] = this.matchAll(bids, bidRequest);
      if (matches.length > 0) {
        const callDone = delayExecution(done, matches.length);
        matches.forEach(match => {
          const mockResponse = match.rule.replace(match.bid, bidRequest);
          const delay = match.rule.options.delay;
          this.logger.logMessage(`Intercepted bid request (matching rule #${match.rule.no}), mocking response in ${delay}ms. Request, response:`, match.bid, mockResponse);
          this.setTimeout(() => {
            mockResponse && addBid(mockResponse, match.bid);
            callDone();
          }, delay);
        });
        bidRequest = deepClone(bidRequest);
        bids = bidRequest.bids = remainder;
      } else {
        this.setTimeout(done, 0);
      }
      return {
        bids,
        bidRequest
      };
    }
  });
  return BidInterceptor;
}

/***/ },

/***/ "./modules/debugging/debugging.js"
/*!****************************************!*\
  !*** ./modules/debugging/debugging.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   install: () => (/* binding */ install)
/* harmony export */ });
/* unused harmony exports disableDebugging, getConfig, sessionLoader, makeBidderBidInterceptor */
/* harmony import */ var _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bidInterceptor.js */ "./modules/debugging/bidInterceptor.js");
/* harmony import */ var _pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pbsInterceptor.js */ "./modules/debugging/pbsInterceptor.js");
/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./legacy.js */ "./modules/debugging/legacy.js");
/* harmony import */ var _fpdValidation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fpdValidation.js */ "./modules/debugging/fpdValidation.js");





/**
 * @typedef {import('./debuggingModule.d.ts').DebugModuleConfiguration} DebugModuleConfiguration
 */

const interceptorHooks = [];
let bidInterceptor;
let enabled = false;

/**
 * @param {DebugModuleConfiguration} debugConfig Configuration of the debug module
 */
function enableDebugging(debugConfig, {
  fromSession = false,
  config,
  hook,
  logger
}) {
  config.setConfig({
    debug: true
  });
  bidInterceptor.updateConfig(debugConfig);
  resetHooks(true);
  // also enable "legacy" overrides
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_2__.removeHooks)({
    hook
  });
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_2__.addHooks)(debugConfig, {
    hook,
    logger
  });
  if (!enabled) {
    enabled = true;
    logger.logMessage(`Debug overrides enabled${fromSession ? ' from session' : ''}`);
  }
}
function disableDebugging({
  hook,
  logger
}) {
  bidInterceptor.updateConfig({});
  resetHooks(false);
  // also disable "legacy" overrides
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_2__.removeHooks)({
    hook
  });
  if (enabled) {
    enabled = false;
    logger.logMessage('Debug overrides disabled');
  }
}

// eslint-disable-next-line no-restricted-properties
function saveDebuggingConfig(debugConfig, {
  sessionStorage = window.sessionStorage,
  DEBUG_KEY,
  utils
} = {}) {
  const {
    deepClone
  } = utils;
  if (!debugConfig.enabled) {
    try {
      sessionStorage.removeItem(DEBUG_KEY);
    } catch (e) {}
  } else {
    if (debugConfig.intercept) {
      debugConfig = deepClone(debugConfig);
      debugConfig.intercept = bidInterceptor.serializeConfig(debugConfig.intercept);
    }
    try {
      sessionStorage.setItem(DEBUG_KEY, JSON.stringify(debugConfig));
    } catch (e) {}
  }
}

// eslint-disable-next-line no-restricted-properties
function getConfig(debugging, {
  getStorage = () => window.sessionStorage,
  DEBUG_KEY,
  config,
  hook,
  logger,
  utils
} = {}) {
  if (debugging == null) return;
  let sessionStorage;
  try {
    sessionStorage = getStorage();
  } catch (e) {
    logger.logError(`sessionStorage is not available: debugging configuration will not persist on page reload`, e);
  }
  if (sessionStorage != null) {
    saveDebuggingConfig(debugging, {
      sessionStorage,
      DEBUG_KEY,
      utils
    });
  }
  if (!debugging.enabled) {
    disableDebugging({
      hook,
      logger
    });
  } else {
    enableDebugging(debugging, {
      config,
      hook,
      logger
    });
  }
}
function sessionLoader({
  DEBUG_KEY,
  storage,
  config,
  hook,
  logger
}) {
  let overrides;
  try {
    // eslint-disable-next-line no-restricted-properties
    storage = storage || window.sessionStorage;
    overrides = JSON.parse(storage.getItem(DEBUG_KEY));
  } catch (e) {}
  if (overrides) {
    enableDebugging(overrides, {
      fromSession: true,
      config,
      hook,
      logger
    });
  }
}
function resetHooks(enable) {
  interceptorHooks.forEach(([getHookFn, interceptor]) => {
    getHookFn().getHooks({
      hook: interceptor
    }).remove();
  });
  if (enable) {
    interceptorHooks.forEach(([getHookFn, interceptor]) => {
      getHookFn().before(interceptor);
    });
  }
}
function registerBidInterceptor(getHookFn, interceptor) {
  const interceptBids = (...args) => bidInterceptor.intercept(...args);
  interceptorHooks.push([getHookFn, function (next, ...args) {
    interceptor(next, interceptBids, ...args);
  }]);
}
function makeBidderBidInterceptor({
  utils
}) {
  const {
    delayExecution
  } = utils;
  return function bidderBidInterceptor(next, interceptBids, spec, bids, bidRequest, ajax, wrapCallback, cbs) {
    const done = delayExecution(cbs.onCompletion, 2);
    ({
      bids,
      bidRequest
    } = interceptBids({
      bids,
      bidRequest,
      addBid: wrapCallback(cbs.onBid),
      done
    }));
    if (bids.length === 0) {
      cbs.onResponse?.({}); // trigger onResponse so that the bidder may be marked as "timely" if necessary
      done();
    } else {
      next(spec, bids, bidRequest, ajax, wrapCallback, {
        ...cbs,
        onCompletion: done
      });
    }
  };
}
function install({
  DEBUG_KEY,
  config,
  hook,
  createBid,
  logger,
  utils,
  BANNER,
  NATIVE,
  VIDEO,
  Renderer,
  getPubcidOptout = () => false
}) {
  (0,_fpdValidation_js__WEBPACK_IMPORTED_MODULE_3__.configureFpdValidation)({
    getOptout: getPubcidOptout,
    utils,
    logger
  });
  const BidInterceptor = (0,_bidInterceptor_js__WEBPACK_IMPORTED_MODULE_0__.makebidInterceptor)({
    utils,
    BANNER,
    NATIVE,
    VIDEO,
    Renderer
  });
  bidInterceptor = new BidInterceptor({
    logger
  });
  const pbsBidInterceptor = (0,_pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_1__.makePbsInterceptor)({
    createBid,
    utils
  });
  registerBidInterceptor(() => hook.get('processBidderRequests'), makeBidderBidInterceptor({
    utils
  }));
  registerBidInterceptor(() => hook.get('processPBSRequest'), pbsBidInterceptor);
  hook.get('startAuction').before(_fpdValidation_js__WEBPACK_IMPORTED_MODULE_3__.startAuctionFpdValidationHook);
  sessionLoader({
    DEBUG_KEY,
    config,
    hook,
    logger
  });
  config.getConfig('debugging', ({
    debugging
  }) => getConfig(debugging, {
    DEBUG_KEY,
    config,
    hook,
    logger,
    utils
  }), {
    init: true
  });
}

/***/ },

/***/ "./modules/debugging/fpdValidation.js"
/*!********************************************!*\
  !*** ./modules/debugging/fpdValidation.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configureFpdValidation: () => (/* binding */ configureFpdValidation),
/* harmony export */   startAuctionFpdValidationHook: () => (/* binding */ startAuctionFpdValidationHook)
/* harmony export */ });
/* unused harmony exports validateOrtb2ForDebug, validateOrtb2Fragments */
/* harmony import */ var _libraries_fpdUtils_validateFpd_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libraries/fpdUtils/validateFpd.js */ "./libraries/fpdUtils/validateFpd.js");
// eslint-disable-next-line prebid/validate-imports

let getPubcidOptout = () => false;
let warn;
let validateFpd;
function configureFpdValidation({
  getOptout,
  utils,
  logger
} = {}) {
  if (getOptout) {
    getPubcidOptout = getOptout;
  }
  if (utils && logger) {
    warn = logger.logWarn;
    const {
      isNumber,
      isEmpty,
      deepAccess,
      deepClone
    } = utils;
    // debugging inspects the data without altering it, so validate against a clone and
    // report invalid data as "Invalid" rather than "Filtered"
    ({
      validateFpd
    } = (0,_libraries_fpdUtils_validateFpd_js__WEBPACK_IMPORTED_MODULE_0__.fpdValidator)({
      logWarn: logger.logWarn,
      isNumber,
      isEmpty,
      deepAccess,
      deepClone
    }, {
      filter: false
    }));
  }
}
function validateOrtb2ForDebug(ortb2) {
  if (ortb2 == null || validateFpd == null) return ortb2;
  return validateFpd(ortb2, '', '', getPubcidOptout());
}
function validateOrtb2Fragments(ortb2Fragments) {
  if (ortb2Fragments == null) return;
  validateOrtb2ForDebug(ortb2Fragments.global);
  Object.values(ortb2Fragments.bidder || {}).forEach(ortb2 => {
    validateOrtb2ForDebug(ortb2);
  });
}
function startAuctionFpdValidationHook(next, req) {
  // FPD validation is a debugging aid; never let it break the auction.
  try {
    validateOrtb2Fragments(req.ortb2Fragments);
  } catch (e) {
    warn('Error validating ortb2 first-party data', e);
  }
  next.call(this, req);
}

/***/ },

/***/ "./modules/debugging/index.js"
/*!************************************!*\
  !*** ./modules/debugging/index.js ***!
  \************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/config.js */ "./src/config.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");
/* harmony import */ var _debugging_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./debugging.js */ "./modules/debugging/debugging.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_bidfactory_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _src_debugging_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../src/debugging.js */ "./src/debugging.js");
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../src/mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _src_Renderer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../src/Renderer.js */ "./src/Renderer.js");

/* eslint prebid/validate-imports: 0 */










(0,_debugging_js__WEBPACK_IMPORTED_MODULE_3__.install)({
  DEBUG_KEY: _src_debugging_js__WEBPACK_IMPORTED_MODULE_6__.DEBUG_KEY,
  config: _src_config_js__WEBPACK_IMPORTED_MODULE_1__.config,
  hook: _src_hook_js__WEBPACK_IMPORTED_MODULE_2__.hook,
  createBid: _src_bidfactory_js__WEBPACK_IMPORTED_MODULE_5__.createBid,
  logger: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.prefixLog)('DEBUG:'),
  utils: _src_utils_js__WEBPACK_IMPORTED_MODULE_4__,
  BANNER: _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_7__.BANNER,
  NATIVE: _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_7__.NATIVE,
  VIDEO: _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_7__.VIDEO,
  Renderer: _src_Renderer_js__WEBPACK_IMPORTED_MODULE_8__.Renderer,
  getPubcidOptout: _src_debugging_js__WEBPACK_IMPORTED_MODULE_6__.getPubcidOptout
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('debugging');

/***/ },

/***/ "./modules/debugging/legacy.js"
/*!*************************************!*\
  !*** ./modules/debugging/legacy.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addHooks: () => (/* binding */ addHooks),
/* harmony export */   removeHooks: () => (/* binding */ removeHooks)
/* harmony export */ });
/* unused harmony exports addBidResponseBound, addBidderRequestsBound, bidExcluded, bidderExcluded, applyBidOverrides, addBidResponseHook, addBidderRequestsHook */
let addBidResponseBound;
let addBidderRequestsBound;
function addHooks(overrides, {
  hook,
  logger
}) {
  addBidResponseBound = addBidResponseHook.bind({
    overrides,
    logger
  });
  hook.get('addBidResponse').before(addBidResponseBound, 5);
  addBidderRequestsBound = addBidderRequestsHook.bind({
    overrides,
    logger
  });
  hook.get('addBidderRequests').before(addBidderRequestsBound, 5);
}
function removeHooks({
  hook
}) {
  hook.get('addBidResponse').getHooks({
    hook: addBidResponseBound
  }).remove();
  hook.get('addBidderRequests').getHooks({
    hook: addBidderRequestsBound
  }).remove();
}

/**
 * @param {{bidder:string, adUnitCode:string}} overrideObj
 * @param {string} bidderCode
 * @param {string} adUnitCode
 * @returns {boolean}
 */
function bidExcluded(overrideObj, bidderCode, adUnitCode) {
  if (overrideObj.bidder && overrideObj.bidder !== bidderCode) {
    return true;
  }
  if (overrideObj.adUnitCode && overrideObj.adUnitCode !== adUnitCode) {
    return true;
  }
  return false;
}

/**
 * @param {string[]} bidders
 * @param {string} bidderCode
 * @returns {boolean}
 */
function bidderExcluded(bidders, bidderCode) {
  return Array.isArray(bidders) && bidders.indexOf(bidderCode) === -1;
}

/**
 * @param {Object} overrideObj
 * @param {Object} bidObj
 * @param {Object} bidType
 * @returns {Object} bidObj with overridden properties
 */
function applyBidOverrides(overrideObj, bidObj, bidType, logger) {
  return Object.keys(overrideObj).filter(key => ['adUnitCode', 'bidder'].indexOf(key) === -1).reduce(function (result, key) {
    logger.logMessage(`bidder overrides changed '${result.adUnitCode}/${result.bidderCode}' ${bidType}.${key} from '${result[key]}.js' to '${overrideObj[key]}'`);
    result[key] = overrideObj[key];
    result.isDebug = true;
    return result;
  }, bidObj);
}
function addBidResponseHook(next, adUnitCode, bid, reject) {
  const {
    overrides,
    logger
  } = this;
  if (bidderExcluded(overrides.bidders, bid.bidderCode)) {
    logger.logWarn(`bidder '${bid.bidderCode}' excluded from auction by bidder overrides`);
    return;
  }
  if (Array.isArray(overrides.bids)) {
    overrides.bids.forEach(function (overrideBid) {
      if (!bidExcluded(overrideBid, bid.bidderCode, adUnitCode)) {
        applyBidOverrides(overrideBid, bid, 'bidder', logger);
      }
    });
  }
  next(adUnitCode, bid, reject);
}
function addBidderRequestsHook(next, bidderRequests) {
  const {
    overrides,
    logger
  } = this;
  const includedBidderRequests = bidderRequests.filter(function (bidderRequest) {
    if (bidderExcluded(overrides.bidders, bidderRequest.bidderCode)) {
      logger.logWarn(`bidRequest '${bidderRequest.bidderCode}' excluded from auction by bidder overrides`);
      return false;
    }
    return true;
  });
  if (Array.isArray(overrides.bidRequests)) {
    includedBidderRequests.forEach(function (bidderRequest) {
      overrides.bidRequests.forEach(function (overrideBid) {
        bidderRequest.bids.forEach(function (bid) {
          if (!bidExcluded(overrideBid, bidderRequest.bidderCode, bid.adUnitCode)) {
            applyBidOverrides(overrideBid, bid, 'bidRequest', logger);
          }
        });
      });
    });
  }
  next(includedBidderRequests);
}

/***/ },

/***/ "./modules/debugging/pbsInterceptor.js"
/*!*********************************************!*\
  !*** ./modules/debugging/pbsInterceptor.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makePbsInterceptor: () => (/* binding */ makePbsInterceptor)
/* harmony export */ });
function makePbsInterceptor({
  createBid,
  utils
}) {
  const {
    deepClone,
    delayExecution
  } = utils;
  return function pbsBidInterceptor(next, interceptBids, s2sBidRequest, bidRequests, ajax, {
    onResponse,
    onError,
    onBid
  }) {
    let responseArgs;
    const done = delayExecution(() => onResponse(...responseArgs), bidRequests.length + 1);
    function signalResponse(...args) {
      responseArgs = args;
      done();
    }
    function addBid(bid, bidRequest) {
      onBid({
        adUnit: bidRequest.adUnitCode,
        bid: Object.assign(createBid(bidRequest), {
          requestBidder: bidRequest.bidder
        }, bid)
      });
    }
    bidRequests = bidRequests.map(req => interceptBids({
      bidRequest: req,
      addBid,
      done
    }).bidRequest).filter(req => req.bids.length > 0);
    if (bidRequests.length > 0) {
      const bidIds = new Set();
      bidRequests.forEach(req => req.bids.forEach(bid => bidIds.add(bid.bidId)));
      s2sBidRequest = deepClone(s2sBidRequest);
      s2sBidRequest.ad_units.forEach(unit => {
        unit.bids = unit.bids.filter(bid => bidIds.has(bid.bid_id));
      });
      s2sBidRequest.ad_units = s2sBidRequest.ad_units.filter(unit => unit.bids.length > 0);
      next(s2sBidRequest, bidRequests, ajax, {
        onResponse: signalResponse,
        onError,
        onBid
      });
    } else {
      signalResponse(true, []);
    }
  };
}

/***/ },

/***/ "./modules/debugging/responses.js"
/*!****************************************!*\
  !*** ./modules/debugging/responses.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__.dn(__WEBPACK_DEFAULT_EXPORT__);
const ORTB_NATIVE_ASSET_TYPES = ['img', 'video', 'link', 'data', 'title'];
function getSlotDivid(adUnitCode) {
  const slot = window.googletag?.pubads?.()?.getSlots?.()?.find?.(slot => {
    return slot.getAdUnitPath() === adUnitCode || slot.getSlotElementId() === adUnitCode;
  });
  return slot?.getSlotElementId();
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__({
  Renderer,
  BANNER,
  NATIVE,
  VIDEO
}) {
  return {
    [BANNER]: (bid, bidResponse) => {
      if (!bidResponse.hasOwnProperty('ad') && !bidResponse.hasOwnProperty('adUrl')) {
        let [size, repeat] = (bidResponse.width ?? bidResponse.wratio) < (bidResponse.height ?? bidResponse.hratio) ? [bidResponse.width, 'repeat-y'] : [bidResponse.height, 'repeat-x'];
        size = size == null ? '100%' : `${size}px`;
        bidResponse.ad = `<html><body><div style="display: inline-block; height: ${bidResponse.height == null ? '100%' : bidResponse.height + 'px'}; width: ${bidResponse.width == null ? '100%' : bidResponse.width + 'px'}; background-image: url(https://vcdn.adnxs.com/p/creative-image/27/c0/52/67/27c05267-5a6d-4874-834e-18e218493c32.png); background-size: ${size}; background-repeat: ${repeat}"></div></body></html>`;
      }
    },
    [VIDEO]: (bid, bidResponse) => {
      if (!bidResponse.hasOwnProperty('vastXml') && !bidResponse.hasOwnProperty('vastUrl')) {
        bidResponse.vastXml = '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"><Ad><InLine><AdSystem>GDFP</AdSystem><AdTitle>Demo</AdTitle><Description><![CDATA[Demo]]></Description><Creatives><Creative><Linear ><Duration>00:00:11</Duration><VideoClicks><ClickThrough><![CDATA[https://prebid.org/]]></ClickThrough></VideoClicks><MediaFiles><MediaFile delivery="progressive" width="640" height="360" type="video/mp4" scalable="true" maintainAspectRatio="true"><![CDATA[https://s3.amazonaws.com/files.prebid.org/creatives/PrebidLogo.mp4]]></MediaFile></MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>';
        bidResponse.renderer = Renderer.install({
          url: 'https://cdn.jwplayer.com/libraries/l5MchIxB.js'
        });
        bidResponse.renderer.setRender(function (bid, doc) {
          const parentId = getSlotDivid(bid.adUnitCode) ?? bid.adUnitCode;
          const div = doc.createElement('div');
          div.id = `${parentId}-video-player`;
          doc.getElementById(parentId).appendChild(div);
          const player = window.jwplayer(div.id).setup({
            debug: true,
            width: bidResponse.width,
            height: bidResponse.height,
            advertising: {
              client: 'vast',
              outstream: true,
              endstate: 'close'
            }
          });
          player.on('ready', async function () {
            if (bid.vastUrl) {
              player.loadAdTag(bid.vastUrl);
            } else {
              player.loadAdXml(bid.vastXml);
            }
          });
        });
      }
    },
    [NATIVE]: (bid, bidResponse) => {
      if (!bidResponse.hasOwnProperty('native')) {
        bidResponse.native = {
          ortb: {
            link: {
              url: 'https://www.link.example',
              clicktrackers: ['https://impression.example']
            },
            assets: bid.nativeOrtbRequest.assets.map(mapDefaultNativeOrtbAsset)
          }
        };
      }
    }
  };
  function mapDefaultNativeOrtbAsset(asset) {
    const assetType = ORTB_NATIVE_ASSET_TYPES.find(type => asset.hasOwnProperty(type));
    switch (assetType) {
      case 'img':
        return {
          ...asset,
          img: {
            type: 3,
            w: 600,
            h: 500,
            url: 'https://vcdn.adnxs.com/p/creative-image/27/c0/52/67/27c05267-5a6d-4874-834e-18e218493c32.png'
          }
        };
      case 'video':
        return {
          ...asset,
          video: {
            vasttag: '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"><Ad><InLine><AdSystem>GDFP</AdSystem><AdTitle>Demo</AdTitle><Description><![CDATA[Demo]]></Description><Creatives><Creative><Linear ><Duration>00:00:11</Duration><VideoClicks><ClickThrough><![CDATA[https://prebid.org/]]></ClickThrough></VideoClicks><MediaFiles><MediaFile delivery="progressive" width="640" height="360" type="video/mp4" scalable="true" maintainAspectRatio="true"><![CDATA[https://s3.amazonaws.com/files.prebid.org/creatives/PrebidLogo.mp4]]></MediaFile></MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>'
          }
        };
      case 'data':
        {
          return {
            ...asset,
            data: {
              value: '5 stars'
            }
          };
        }
      case 'title':
        {
          return {
            ...asset,
            title: {
              text: 'Prebid Native Example'
            }
          };
        }
    }
  }
}

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display"], () => (__webpack_exec__("./modules/debugging/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gppControl_usnat"],{

/***/ "./modules/gppControl_usnat.js"
/*!*************************************!*\
  !*** ./modules/gppControl_usnat.js ***!
  \*************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libraries/mspa/activityControls.js */ "./libraries/mspa/activityControls.js");



let unregister = null;
_src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('consentManagement', cfg => {
  if (cfg?.consentManagement?.gpp != null) {
    if (unregister != null) unregister();
    unregister = (0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__.setupRules)('usnat', [7], (0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__.getRules)(cfg.consentManagement.gpp.mspa?.restrictActivities));
  }
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('gppControl_usnat');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","mspa"], () => (__webpack_exec__("./modules/gppControl_usnat.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gppControl_usstates"],{

/***/ "./modules/gppControl_usstates.js"
/*!****************************************!*\
  !*** ./modules/gppControl_usstates.js ***!
  \****************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports normalizer, NORMALIZATIONS, DEFAULT_SID_MAPPING, getSections */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libraries/mspa/activityControls.js */ "./libraries/mspa/activityControls.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");




const FIELDS = {
  Version: 0,
  Gpc: 0,
  SharingNotice: 0,
  SaleOptOutNotice: 0,
  SharingOptOutNotice: 0,
  TargetedAdvertisingOptOutNotice: 0,
  SensitiveDataProcessingOptOutNotice: 0,
  SensitiveDataLimitUseNotice: 0,
  SaleOptOut: 0,
  SharingOptOut: 0,
  TargetedAdvertisingOptOut: 0,
  SensitiveDataProcessing: 12,
  KnownChildSensitiveDataConsents: 2,
  PersonalDataConsents: 0,
  MspaCoveredTransaction: 0,
  MspaOptOutOptionMode: 0,
  MspaServiceProviderMode: 0
};

/**
 * Generate a normalization function for converting US state strings to the usnat format.
 *
 * Scalar fields are copied over if they exist in the input (state) data, or set to null otherwise.
 * List fields are also copied, but forced to the "correct" length (by truncating or padding with nulls);
 * additionally, elements within them can be moved around using the `move` argument.
 */
function normalizer({
  nullify = [],
  move = {},
  fn
}, fields = FIELDS) {
  move = Object.fromEntries(Object.entries(move).map(([k, map]) => [k, Object.fromEntries(Object.entries(map).map(([k, v]) => [k, Array.isArray(v) ? v : [v]]).map(([k, v]) => [k - 1, v.map(el => el - 1)]))]));
  return function (cd) {
    const norm = Object.fromEntries(Object.entries(fields).map(([field, len]) => {
      let val = null;
      if (len > 0) {
        val = Array(len).fill(null);
        if (Array.isArray(cd[field])) {
          const remap = move[field] || {};
          const done = [];
          cd[field].forEach((el, i) => {
            const [dest, moved] = remap.hasOwnProperty(i) ? [remap[i], true] : [[i], false];
            dest.forEach(d => {
              if (d < len && !done.includes(d)) {
                val[d] = el;
                moved && done.push(d);
              }
            });
          });
        }
      } else if (cd[field] != null) {
        val = Array.isArray(cd[field]) ? null : cd[field];
      }
      return [field, val];
    }));
    nullify.forEach(path => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(norm, path, null));
    fn && fn(cd, norm);
    return norm;
  };
}
function scalarMinorsAreChildren(original, normalized) {
  normalized.KnownChildSensitiveDataConsents = original.KnownChildSensitiveDataConsents === 0 ? [0, 0] : [1, 1];
}
const NORMALIZATIONS = {
  // normalization rules - convert state consent into usnat consent
  // https://docs.prebid.org/features/mspa-usnat.html
  7: consent => consent,
  8: normalizer({
    move: {
      SensitiveDataProcessing: {
        1: 9,
        2: 10,
        3: 8,
        4: [1, 2],
        5: 12,
        8: 3,
        9: 4
      }
    },
    fn(original, normalized) {
      if (original.KnownChildSensitiveDataConsents.some(el => el !== 0)) {
        normalized.KnownChildSensitiveDataConsents = [1, 1];
      }
    }
  }),
  9: normalizer({
    fn: scalarMinorsAreChildren
  }),
  10: normalizer({
    fn: scalarMinorsAreChildren
  }),
  11: normalizer({
    move: {
      SensitiveDataProcessing: {
        3: 4,
        4: 5,
        5: 3
      }
    },
    fn: scalarMinorsAreChildren
  }),
  12: normalizer({
    fn(original, normalized) {
      const cc = original.KnownChildSensitiveDataConsents;
      let repl;
      if (!cc.some(el => el !== 0)) {
        repl = [0, 0];
      } else if (cc[1] === 2 && cc[2] === 2) {
        repl = [2, 1];
      } else {
        repl = [1, 1];
      }
      normalized.KnownChildSensitiveDataConsents = repl;
    }
  })
};
const DEFAULT_SID_MAPPING = {
  8: 'usca',
  9: 'usva',
  10: 'usco',
  11: 'usut',
  12: 'usct'
};
const getSections = (() => {
  const allSIDs = Object.keys(DEFAULT_SID_MAPPING).map(Number);
  return function ({
    sections = {},
    sids = allSIDs
  } = {}) {
    return sids.map(sid => {
      const logger = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.prefixLog)(`Cannot set up MSPA controls for SID ${sid}:`);
      const ov = sections[sid] || {};
      const normalizeAs = ov.normalizeAs || sid;
      if (!NORMALIZATIONS.hasOwnProperty(normalizeAs)) {
        logger.logError(`no normalization rules are known for SID ${normalizeAs}`);
        return null;
      }
      const api = ov.name || DEFAULT_SID_MAPPING[sid];
      if (typeof api !== 'string') {
        logger.logError(`cannot determine GPP section name`);
        return null;
      }
      return [api, [sid], NORMALIZATIONS[normalizeAs]];
    }).filter(el => el != null);
  };
})();
const handles = [];

// re-exported so that the declaration below is part of a consumer's program: declaration emit
// keeps this, but drops the value import above, whose bindings no type refers to

_src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('consentManagement', cfg => {
  const gppConf = cfg.consentManagement?.gpp;
  if (gppConf) {
    while (handles.length) {
      handles.pop()();
    }
    getSections(gppConf?.mspa || {}).forEach(([api, sids, normalize]) => handles.push((0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__.setupRules)(api, sids, (0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__.getRules)(gppConf.mspa?.restrictActivities), normalize)));
  }
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('gppControl_usstates');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","mspa"], () => (__webpack_exec__("./modules/gppControl_usstates.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gptPreAuction"],{

/***/ "./modules/gptPreAuction.js"
/*!**********************************!*\
  !*** ./modules/gptPreAuction.js ***!
  \**********************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports _currentConfig, getSegments, getSignals, getSignalsArrayByAuctionsIds, getSignalsIntersection, getAuctionsIdsFromTargeting, appendGptSlots, makeBidRequestsHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libraries/gptUtils/gptUtils.js */ "./libraries/gptUtils/gptUtils.js");
/* harmony import */ var _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/constants.js */ "./src/constants.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");







const MODULE_NAME = 'GPT Pre-Auction';
let _currentConfig = {};
let hooksAdded = false;
function getSegments(fpd, sections, segtax) {
  return (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__.getSegments)(fpd, sections, segtax);
}
function getSignals(fpd) {
  return (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__.getSignals)(fpd);
}
function getSignalsArrayByAuctionsIds(auctionIds, index = _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index) {
  const signals = auctionIds.map(auctionId => index.getAuction({
    auctionId
  })?.getFPD()?.global).map(getSignals).filter(fpd => fpd);
  return signals;
}
function getSignalsIntersection(signals) {
  const result = {};
  _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__.taxonomies.forEach(taxonomy => {
    const allValues = signals.flatMap(x => x).filter(x => x.taxonomy === taxonomy).map(x => x.values);
    result[taxonomy] = allValues.length ? allValues.reduce((commonElements, subArray) => {
      return commonElements.filter(element => subArray.includes(element));
    }) : [];
    result[taxonomy] = {
      values: result[taxonomy]
    };
  });
  return result;
}
function getAuctionsIdsFromTargeting(targeting, am = _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager) {
  return Object.values(targeting).flatMap(x => Object.entries(x)).filter(entry => entry[0] === _src_constants_js__WEBPACK_IMPORTED_MODULE_4__.TARGETING_KEYS.AD_ID || entry[0].startsWith(_src_constants_js__WEBPACK_IMPORTED_MODULE_4__.TARGETING_KEYS.AD_ID + '_')).flatMap(entry => entry[1]).map(adId => am.findBidByAdId(adId)?.auctionId).filter(id => id != null).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniques);
}
const appendGptSlots = adUnits => {
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.isGptPubadsDefined)()) {
    return;
  }
  const adUnitMap = adUnits.reduce((acc, adUnit) => {
    acc[adUnit.code] = acc[adUnit.code] || [];
    acc[adUnit.code].push(adUnit);
    return acc;
  }, {});
  const adUnitPaths = {};
  window.googletag.pubads().getSlots().forEach(slot => {
    const matchingAdUnitCode = Object.keys(adUnitMap).find((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.isAdUnitCodeMatchingSlot)(slot));
    if (matchingAdUnitCode) {
      const path = adUnitPaths[matchingAdUnitCode] = slot.getAdUnitPath();
      const adserver = {
        name: 'gam',
        adslot: sanitizeSlotPath(path)
      };
      adUnitMap[matchingAdUnitCode].forEach(adUnit => {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_8__.dset)(adUnit, 'ortb2Imp.ext.data.adserver', Object.assign({}, adUnit.ortb2Imp?.ext?.data?.adserver, adserver));
      });
    }
  });
  return adUnitPaths;
};
const sanitizeSlotPath = path => {
  const gptConfig = _src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gptPreAuction') || {};
  if (gptConfig.mcmEnabled) {
    return path.replace(/(^\/\d*),\d*\//, '$1/');
  }
  return path;
};
const defaultPreAuction = (adUnit, adServerAdSlot, adUnitPath) => {
  // confirm that GPT is set up
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.isGptPubadsDefined)()) {
    return;
  }

  // find all GPT slots with this name
  var gptSlots = window.googletag.pubads().getSlots().filter(slot => slot.getAdUnitPath() === adUnitPath);
  if (gptSlots.length === 0) {
    return; // should never happen
  }
  if (gptSlots.length === 1) {
    return adServerAdSlot;
  }

  // else the adunit code must be div id. append it.
  return `${adServerAdSlot}#${adUnit.code}`;
};
const makeBidRequestsHook = (fn, adUnits, ...args) => {
  const adUnitPaths = appendGptSlots(adUnits);
  const {
    useDefaultPreAuction,
    customPreAuction
  } = _currentConfig;
  adUnits.forEach(adUnit => {
    // init the ortb2Imp if not done yet
    adUnit.ortb2Imp = adUnit.ortb2Imp || {};
    adUnit.ortb2Imp.ext = adUnit.ortb2Imp.ext || {};
    adUnit.ortb2Imp.ext.data = adUnit.ortb2Imp.ext.data || {};
    const context = adUnit.ortb2Imp.ext;
    const adserverSlot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_7__["default"])(context, 'data.adserver.adslot');

    // @todo: check if should have precedence over customPreAuction and defaultPreAuction
    if (context.gpid) return;
    let result;
    if (customPreAuction) {
      result = customPreAuction(adUnit, adserverSlot, adUnitPaths?.[adUnit.code]);
    } else if (useDefaultPreAuction) {
      result = defaultPreAuction(adUnit, adserverSlot, adUnitPaths?.[adUnit.code]);
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.logWarn)('Neither customPreAuction, defaultPreAuction and gpid were specified');
    }
    if (result) {
      context.gpid = result;
    }
  });
  return fn.call(undefined, adUnits, ...args);
};
const setPpsConfigFromTargetingSet = (next, targetingSet) => {
  // set gpt config
  const auctionsIds = getAuctionsIdsFromTargeting(targetingSet);
  const signals = getSignalsIntersection(getSignalsArrayByAuctionsIds(auctionsIds));
  window.googletag.setConfig && window.googletag.setConfig({
    pps: {
      taxonomies: signals
    }
  });
  next(targetingSet);
};
const handleSetGptConfig = moduleConfig => {
  _currentConfig = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.pick)(moduleConfig, ['enabled', enabled => enabled !== false, 'customPreAuction', customPreAuction => typeof customPreAuction === 'function' && customPreAuction, 'useDefaultPreAuction', useDefaultPreAuction => useDefaultPreAuction ?? true]);
  if (_currentConfig.enabled) {
    if (!hooksAdded) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('makeBidRequests').before(makeBidRequestsHook);
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('targetingDone').after(setPpsConfigFromTargetingSet);
      hooksAdded = true;
    }
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.logInfo)(`${MODULE_NAME}: Turning off module`);
    _currentConfig = {};
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('makeBidRequests').getHooks({
      hook: makeBidRequestsHook
    }).remove();
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('targetingDone').getHooks({
      hook: setPpsConfigFromTargetingSet
    }).remove();
    hooksAdded = false;
  }
};
_src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gptPreAuction', config => handleSetGptConfig(config.gptPreAuction));
handleSetGptConfig({});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('gptPreAuction');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","gptUtils"], () => (__webpack_exec__("./modules/gptPreAuction.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["impactifyBidAdapter"],{

/***/ "./modules/impactifyBidAdapter.js"
/*!****************************************!*\
  !*** ./modules/impactifyBidAdapter.js ***!
  \****************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports STORAGE, STORAGE_KEY, spec */
/* harmony import */ var _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/winDimensions.js");
/* harmony import */ var _src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_ajax_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/ajax.js */ "./src/ajax.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _libraries_percentInView_percentInView_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../libraries/percentInView/percentInView.js */ "./libraries/percentInView/percentInView.js");











/**
 * @typedef {import('../src/adapters/bidderFactory.js').BidRequest} BidRequest
 * @typedef {import('../src/adapters/bidderFactory.js').Bid} Bid
 * @typedef {import('../src/adapters/bidderFactory.js').ServerResponse} ServerResponse
 * @typedef {import('../src/adapters/bidderFactory.js').SyncOptions} SyncOptions
 * @typedef {import('../src/adapters/bidderFactory.js').UserSync} UserSync
 */

const BIDDER_CODE = 'impactify';
const BIDDER_ALIAS = ['imp'];
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_VIDEO_WIDTH = 640;
const DEFAULT_VIDEO_HEIGHT = 360;
const ORIGIN = 'https://sonic.impactify.media';
const LOGGER_URI = 'https://logger.impactify.media';
const AUCTION_URI = '/bidder';
const COOKIE_SYNC_URI = '/static/cookie_sync.html';
const GVL_ID = 606;
const GET_CONFIG = _src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig;
const STORAGE = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_10__.getStorageManager)({
  gvlid: GVL_ID,
  bidderCode: BIDDER_CODE
});
const STORAGE_KEY = '_im_str';
const VIDEO_PARAMS = ['minduration', 'maxduration', 'api', 'mimes', 'placement', 'plcmt', 'protocols', 'playbackmethod', 'pos', 'startdelay', 'skip', 'skipmin', 'skipafter', 'minbitrate', 'maxbitrate'];

/**
 * Helpers object
 * @type {Object}
 */
const helpers = {
  getExtParamsFromBid(bid) {
    const ext = {
      impactify: {
        appId: bid.params.appId
      }
    };
    const render = {};
    if (typeof bid.params.format === 'string') {
      ext.impactify.format = bid.params.format;
    }
    if (typeof bid.params.style === 'string') {
      ext.impactify.style = bid.params.style;
    }
    if (typeof bid.params.size === 'string') {
      ext.impactify.size = bid.params.size;
    }
    const viewability = this.getViewability(bid);
    ext.impactify.viewability = viewability;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.isPlainObject)(bid.params.render)) {
      if (typeof bid.params.render.top === 'number') {
        render.top = bid.params.render.top;
      }
      if (typeof bid.params.render.bottom === 'number') {
        render.bottom = bid.params.render.bottom;
      }
      if (typeof bid.params.render.align === 'string') {
        render.align = bid.params.render.align;
      }
      if (typeof bid.params.render.container === 'string') {
        render.container = bid.params.render.container;
      }
      if (typeof bid.params.render.expandAd === 'boolean') {
        render.expandAd = bid.params.render.expandAd;
      }
      if (typeof bid.params.render.location === 'string') {
        render.location = bid.params.render.location;
      }
      if (typeof bid.params.render.onAdEventName === 'string') {
        render.onAdEventName = bid.params.render.onAdEventName;
      }
      if (typeof bid.params.render.onNoAdEventName === 'string') {
        render.onNoAdEventName = bid.params.render.onNoAdEventName;
      }
      if (Object.keys(render).length > 0) {
        ext.impactify.render = render;
      }
    }
    return ext;
  },
  pickDefined(obj, keys) {
    return keys.reduce((acc, key) => {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  },
  getViewability(bid) {
    try {
      let elementSize;
      if (bid.mediaTypes?.banner?.sizes?.[0]) {
        elementSize = bid.mediaTypes?.banner?.sizes?.[0];
      }
      if (bid.mediaTypes?.video?.playerSize?.[0]) {
        elementSize = bid.mediaTypes?.video?.playerSize?.[0];
      }
      if (!elementSize) {
        elementSize = [0, 0];
      }
      const size = {
        w: elementSize[0],
        h: elementSize[1]
      };
      const element = document.getElementById(bid.adUnitCode);
      if (!element) return;
      const viewabilityAmount = (0,_libraries_percentInView_percentInView_js__WEBPACK_IMPORTED_MODULE_11__.isViewabilityMeasurable)(element) ? (0,_libraries_percentInView_percentInView_js__WEBPACK_IMPORTED_MODULE_11__.getViewability)(element, (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.getWindowTop)(), size) : 'na';
      return isNaN(viewabilityAmount) ? viewabilityAmount : Math.round(viewabilityAmount);
    } catch (e) {
      return 'na';
    }
  },
  getDeviceType() {
    // OpenRTB Device type
    if (/ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())) {
      return 5;
    }
    if (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase())) {
      return 4;
    }
    return 2;
  },
  createOrtbImpBannerObj(bid, bannerObj) {
    const format = [];
    const sizes = bannerObj?.sizes;
    if (Array.isArray(sizes)) {
      sizes.forEach(size => {
        if (Array.isArray(size) && size.length >= 2) {
          format.push({
            w: size[0],
            h: size[1]
          });
        }
      });
    }
    return {
      id: 'banner-' + (bid?.bidId || ''),
      format
    };
  },
  createOrtbImpVideoObj(bid) {
    const video = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video');
    if (!video) return;
    const playerSize = video.playerSize || bid.sizes?.[0];
    const resolvedPlayerSize = playerSize && playerSize.length === 2 ? playerSize : [DEFAULT_VIDEO_WIDTH, DEFAULT_VIDEO_HEIGHT];
    return {
      playerSize: resolvedPlayerSize,
      context: video.context === 'instream' ? 'instream' : 'outstream',
      ...helpers.pickDefined(video, VIDEO_PARAMS)
    };
  },
  getFloor(bid) {
    try {
      const floorInfo = bid.getFloor({
        currency: DEFAULT_CURRENCY,
        mediaType: '*',
        size: '*'
      });
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.isPlainObject)(floorInfo) && floorInfo.currency === DEFAULT_CURRENCY && !isNaN(parseFloat(floorInfo.floor))) {
        return parseFloat(floorInfo.floor);
      }
    } catch (e) {}
    return null;
  },
  getImStrFromLocalStorage() {
    return STORAGE.localStorageIsEnabled(false) ? STORAGE.getDataFromLocalStorage(STORAGE_KEY, false) : '';
  }
};

/**
 * Create an OpenRTB formated object from prebid payload
 * @param validBidRequests
 * @param bidderRequest
 * @returns {{cur: string[], validBidRequests, id, source: {tid}, imp: *[]}}
 */
function createOpenRtbRequest(validBidRequests, bidderRequest) {
  // Create request and set imp bids inside
  const request = {
    id: bidderRequest?.bidderRequestId,
    validBidRequests,
    cur: [DEFAULT_CURRENCY],
    tmax: Math.max(bidderRequest?.timeout || 400, 400),
    imp: [],
    source: {
      tid: bidderRequest?.ortb2?.source?.tid
    },
    ext: {
      impactify: {
        integration: 'pbjs',
        storage: helpers.getImStrFromLocalStorage()
      }
    }
  };

  // Get the url parameters
  const queryString = window?.location?.search;
  const urlParams = new URLSearchParams(queryString);
  const checkPrebid = urlParams.get('_checkPrebid');

  // Force impactify debugging parameter if present
  if (checkPrebid != null) {
    request.test = Number(checkPrebid);
  }

  // Set SChain in request
  const schain = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequests, '0.ortb2.source.ext.schain');
  if (schain) request.source.ext = {
    schain: schain
  };

  // Set Eids
  const eids = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequests, '0.userIdAsEids');
  if (eids && eids.length) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'user.ext.eids', eids);
  }

  // Set device/user/site
  if (!request.device) request.device = {};
  if (!request.site) request.site = {};
  request.device = {
    w: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.getWinDimensions)().innerWidth,
    h: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.getWinDimensions)().innerHeight,
    devicetype: helpers.getDeviceType(),
    ua: navigator?.userAgent,
    js: 1,
    dnt: 0,
    language: (navigator?.language || navigator?.userLanguage || '').split('-')[0] || 'en'
  };
  const pageUrl = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'refererInfo.page');
  const accountId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequests?.[0], 'params.accountId');
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'site.page', pageUrl);
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'site.publisher.id', accountId);

  // Handle privacy settings for GDPR/CCPA/COPPA
  let gdprApplies = 0;
  if (bidderRequest?.gdprConsent) {
    if (typeof bidderRequest.gdprConsent.gdprApplies === 'boolean') gdprApplies = bidderRequest.gdprConsent.gdprApplies ? 1 : 0;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'user.ext.consent', bidderRequest.gdprConsent.consentString);
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'regs.ext.gdpr', gdprApplies);
  if (GET_CONFIG('coppa') === true) (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'regs.coppa', 1);
  if (bidderRequest?.uspConsent) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'regs.ext.us_privacy', bidderRequest.uspConsent);
  }

  // Create imps with bids
  validBidRequests.forEach(bid => {
    const bannerObj = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid.mediaTypes, `banner`);
    const videoObj = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid.mediaTypes, `video`);
    const imp = {
      id: bid.bidId,
      bidfloor: bid.params.bidfloor ? bid.params.bidfloor : 0,
      ext: helpers.getExtParamsFromBid(bid)
    };
    if (bannerObj) {
      imp.banner = {
        ...helpers.createOrtbImpBannerObj(bid, bannerObj)
      };
    }
    if (videoObj) {
      imp.video = {
        ...helpers.createOrtbImpVideoObj(bid)
      };
    }
    if (typeof bid.getFloor === 'function') {
      const floor = helpers.getFloor(bid);
      if (floor) {
        imp.bidfloor = floor;
      }
    }
    request.imp.push(imp);
  });
  return request;
}

/**
 * Export BidderSpec type object and register it to Prebid
 * @type {{supportedMediaTypes: string[], interpretResponse: ((function(ServerResponse, *): Bid[])|*), code: string, aliases: string[], getUserSyncs: ((function(SyncOptions, ServerResponse[], *, *): UserSync[])|*), buildRequests: (function(*, *): {method: string, data: string, url}), onTimeout: (function(*): boolean), gvlid: number, isBidRequestValid: ((function(BidRequest): (boolean))|*), onBidWon: (function(*): boolean)}}
 */
const spec = {
  code: BIDDER_CODE,
  gvlid: GVL_ID,
  supportedMediaTypes: ['video', 'banner'],
  aliases: BIDDER_ALIAS,
  storageAllowed: true,
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function (bid) {
    if (typeof bid.params.style !== 'string' || !bid.params.style) {
      return false;
    }
    return true;
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {Array} validBidRequests - an array of bids
   * @param {Object} bidderRequest - the bidding request
   * @return {Object} Info describing the request to the server.
   */
  buildRequests: function (validBidRequests, bidderRequest) {
    // Create a clean openRTB request
    const request = createOpenRtbRequest(validBidRequests, bidderRequest);
    const options = {};
    return {
      method: 'POST',
      url: ORIGIN + AUCTION_URI,
      data: JSON.stringify(request),
      options
    };
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function (serverResponse, bidRequest) {
    const serverBody = serverResponse.body;
    let bidResponses = [];
    if (!serverBody) {
      return bidResponses;
    }
    if (!serverBody.seatbid || !serverBody.seatbid.length) {
      return [];
    }
    let ortbRequest = {};
    try {
      ortbRequest = JSON.parse(bidRequest?.data || '{}');
    } catch (e) {}
    const impMap = {};
    (ortbRequest.imp || []).forEach(imp => {
      impMap[imp.id] = imp;
    });
    serverBody.seatbid.forEach(seatbid => {
      if (seatbid?.bid?.length) {
        bidResponses.push(...seatbid.bid.filter(bid => bid.price > 0).map(bid => {
          const isPlayer = impMap[bid.impid]?.ext?.impactify?.format === 'player';
          const isVideo = !!impMap[bid.impid]?.video;
          let mediaType;
          if (bid?.mtype === 2) {
            mediaType = 'video';
          } else if (bid?.mtype === 1) {
            mediaType = 'banner';
          } else if (isPlayer || isVideo) {
            mediaType = 'video';
          } else {
            mediaType = 'banner';
          }
          return {
            id: bid.id,
            requestId: bid.impid,
            cpm: bid.price,
            currency: serverBody.cur || DEFAULT_CURRENCY,
            netRevenue: true,
            width: bid.w || 0,
            height: bid.h || 0,
            ttl: 300,
            creativeId: bid.crid || 0,
            mediaType: mediaType,
            meta: {
              advertiserDomains: bid.adomain && bid.adomain.length ? bid.adomain : []
            },
            ...(isPlayer ? {
              vastUrl: bid.ext?.vast_url,
              vastXml: bid.adm
            } : {
              ad: bid.adm
            })
          };
        }));
      }
    });
    return bidResponses;
  },
  /**
   * Register the user sync pixels which should be dropped after the auction.
   *
   * @param {SyncOptions} syncOptions Which user syncs are allowed?
   * @param {ServerResponse[]} serverResponses List of server's responses.
   * @return {UserSync[]} The user syncs which should be dropped.
   */
  getUserSyncs: function (syncOptions, serverResponses, gdprConsent, uspConsent) {
    if (!serverResponses || serverResponses.length === 0) {
      return [];
    }
    if (!syncOptions.iframeEnabled) {
      return [];
    }
    let params = '';
    if (gdprConsent && typeof gdprConsent.consentString === 'string') {
      if (typeof gdprConsent.gdprApplies === 'boolean') {
        params += `?gdpr=${Number(gdprConsent.gdprApplies)}&gdpr_consent=${gdprConsent.consentString}`;
      } else {
        params += `?gdpr_consent=${gdprConsent.consentString}`;
      }
    }
    if (uspConsent) {
      params += `${params ? '&' : '?'}us_privacy=${encodeURIComponent(uspConsent)}`;
    }
    if (document?.location?.search?.match(/pbs_debug=true/)) params += `&pbs_debug=true`;
    return [{
      type: 'iframe',
      url: ORIGIN + COOKIE_SYNC_URI + params
    }];
  },
  /**
   * Register bidder specific code, which will execute if a bid from this bidder won the auction
   * @param {Object} bid The bid that won the auction
   */
  onBidWon: function (bid) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_9__.noCredsAjax)(`${LOGGER_URI}/prebid/won`, null, JSON.stringify(bid), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  },
  /**
   * Register bidder specific code, which will execute if bidder timed out after an auction
   * @param {Object} data Containing timeout specific data
   */
  onTimeout: function (data) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_9__.noCredsAjax)(`${LOGGER_URI}/prebid/timeout`, null, JSON.stringify(data[0]), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  }
};
(0,_src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_7__.registerBidder)(spec);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.registerModule)('impactifyBidAdapter');
Object.assign(_src_consentHandler_js__WEBPACK_IMPORTED_MODULE_0__.GVL_PURPOSES, {
  "606": {
    "purposes": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "legIntPurposes": [],
    "flexiblePurposes": [2, 7, 8, 9, 10],
    "specialFeatures": []
  }
});

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","percentInView","boundingClientRect"], () => (__webpack_exec__("./modules/impactifyBidAdapter.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["storageControl"],{

/***/ "./modules/storageControl.js"
/*!***********************************!*\
  !*** ./modules/storageControl.js ***!
  \***********************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports ENFORCE_STRICT, ENFORCE_ALIAS, ENFORCE_OFF, getDisclosures, checkDisclosure, storageControlRule, deactivate, dynamicDisclosureCollector */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libraries/metadata/metadata.js */ "./libraries/metadata/metadata.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/prebid.js */ "./src/prebid.js");
/* harmony import */ var _libraries_storageDisclosure_summary_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libraries/storageDisclosure/summary.js */ "./libraries/storageDisclosure/summary.js");









// @ts-expect-error the ts compiler is confused by build-time renaming of summary.mjs to summary.js, reassure it



const ENFORCE_STRICT = 'strict';
const ENFORCE_ALIAS = 'allowAliases';
const ENFORCE_OFF = 'off';
let enforcement;
function escapeRegExp(string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
function matches(params, disclosure) {
  if (!['cookie', 'web'].includes(disclosure.type) || disclosure.type === 'cookie' && params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_STORAGE_TYPE] !== _src_storageManager_js__WEBPACK_IMPORTED_MODULE_4__.STORAGE_TYPE_COOKIES || disclosure.type === 'web' && params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_STORAGE_TYPE] !== _src_storageManager_js__WEBPACK_IMPORTED_MODULE_4__.STORAGE_TYPE_LOCALSTORAGE) return false;
  const pattern = new RegExp(`^${disclosure.identifier.split('*').map(escapeRegExp).join('.*?')}$`);
  return pattern.test(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_STORAGE_KEY]);
}
function getDisclosures(params, meta = _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_2__.metadata) {
  const matchingDisclosures = [];
  const disclosureURLs = {};
  const data = meta.getMetadata(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT_TYPE], params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT_NAME]);
  if (!data) return null;
  disclosureURLs[params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT_NAME]] = data.disclosureURL;
  if (data.aliasOf) {
    const parent = meta.getMetadata(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT_TYPE], data.aliasOf);
    if (parent) {
      disclosureURLs[data.aliasOf] = parent.disclosureURL;
    }
  }
  Object.entries(disclosureURLs).forEach(([componentName, disclosureURL]) => {
    meta.getStorageDisclosure(disclosureURL)?.disclosures?.filter(disclosure => matches(params, disclosure))?.forEach(disclosure => {
      matchingDisclosures.push({
        [_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT_NAME]: componentName,
        disclosureURL,
        disclosure
      });
    });
  });
  return {
    matches: matchingDisclosures,
    disclosureURLs
  };
}
function checkDisclosure(params, getMatchingDisclosures = getDisclosures) {
  let disclosed = false;
  let parent = false;
  let reason = null;
  const key = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_STORAGE_KEY];
  const component = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT];
  if (key) {
    const disclosures = getMatchingDisclosures(params);
    if (disclosures == null) {
      reason = `Cannot determine if storage key "${key}" is disclosed by "${component}" because the necessary metadata is missing - was it included in the build?`;
    } else {
      const {
        disclosureURLs,
        matches
      } = disclosures;
      const moduleName = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_COMPONENT_NAME];
      for (const {
        componentName
      } of matches) {
        if (componentName === moduleName) {
          disclosed = true;
        } else {
          parent = true;
          reason = `Storage key "${key}" is disclosed by module "${componentName}", but not by "${moduleName}" itself (the latter is an alias of the former)`;
        }
        if (disclosed || parent) break;
      }
      if (!disclosed && !parent) {
        reason = `Storage key "${key}" (for ${params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_PARAM_STORAGE_TYPE]} storage) is not disclosed by "${component}"`;
        if (disclosureURLs[moduleName]) {
          reason += ` @ ${disclosureURLs[moduleName]}`;
        } else {
          reason += ` - no disclosure URL was provided, or it could not be retrieved`;
        }
      }
    }
  } else {
    disclosed = null;
  }
  return {
    disclosed,
    parent,
    reason
  };
}
function storageControlRule(getEnforcement = () => enforcement, check = checkDisclosure) {
  return function (params) {
    const {
      disclosed,
      parent,
      reason
    } = check(params);
    if (disclosed === null) return;
    if (!disclosed) {
      const enforcement = getEnforcement() ?? ENFORCE_STRICT;
      if (enforcement === ENFORCE_STRICT || enforcement === ENFORCE_ALIAS && !parent) return {
        allow: false,
        reason
      };
      if (reason) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)('storageControl:', reason);
      }
    }
  };
}
const rule = (0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_6__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_7__.ACTIVITY_ACCESS_DEVICE, 'storageControl', storageControlRule());
function deactivate() {
  // turn off this module; should only be used in testing
  rule();
}
_src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('storageControl', cfg => {
  enforcement = cfg?.storageControl?.enforcement ?? ENFORCE_STRICT;
});
function dynamicDisclosureCollector() {
  const disclosures = {};
  function mergeDisclosures(left, right) {
    const merged = {
      ...left,
      purposes: (left.purposes ?? []).concat(right.purposes ?? []).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.uniques)
    };
    if (left.type === 'cookie') {
      if (left.maxAgeSeconds != null || right.maxAgeSeconds != null) {
        merged.maxAgeSeconds = (left.maxAgeSeconds ?? 0) > (right.maxAgeSeconds ?? 0) ? left.maxAgeSeconds : right.maxAgeSeconds;
      }
      if (left.cookieRefresh != null || right.cookieRefresh != null) {
        merged.cookieRefresh = left.cookieRefresh || right.cookieRefresh;
      }
    }
    return merged;
  }
  return {
    hook(next, moduleName, disclosure) {
      const key = `${disclosure.type}::${disclosure.identifier}`;
      if (!disclosures.hasOwnProperty(key)) {
        disclosures[key] = {
          disclosedBy: [],
          ...disclosure
        };
      }
      Object.assign(disclosures[key], mergeDisclosures(disclosures[key], disclosure));
      if (!disclosures[key].disclosedBy.includes(moduleName)) {
        disclosures[key].disclosedBy.push(moduleName);
      }
      next(moduleName, disclosure);
    },
    getDisclosures() {
      return Object.values(disclosures);
    }
  };
}
const {
  hook: discloseStorageHook,
  getDisclosures: dynamicDisclosures
} = dynamicDisclosureCollector();
_src_storageManager_js__WEBPACK_IMPORTED_MODULE_4__.discloseStorageUse.before(discloseStorageHook);
function disclosureSummarizer(getDynamicDisclosures = dynamicDisclosures, getSummary = () => (0,_libraries_storageDisclosure_summary_js__WEBPACK_IMPORTED_MODULE_9__.getStorageDisclosureSummary)((0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)().installedModules, _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_2__.metadata.getModuleMetadata)) {
  return function () {
    return [].concat(getDynamicDisclosures().map(disclosure => ({
      disclosedIn: null,
      ...disclosure
    })), getSummary());
  };
}
const getStorageUseDisclosures = disclosureSummarizer();
(0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_8__.addApiMethod)('getStorageUseDisclosures', getStorageUseDisclosures);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('storageControl');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","metadata","storageDisclosure"], () => (__webpack_exec__("./modules/storageControl.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["tcfControl"],{

/***/ "./modules/tcfControl.js"
/*!*******************************!*\
  !*** ./modules/tcfControl.js ***!
  \*******************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* unused harmony exports STRICT_STORAGE_ENFORCEMENT, ACTIVE_RULES, getGvlid, getGvlidFromAnalyticsAdapter, shouldEnforce, validateRules, accessDeviceRule, syncUserRule, enrichEidsRule, fetchBidsRule, reportAnalyticsRule, ufpdRule, accessRequestCredentialsRule, transmitEidsRule, transmitPreciseGeoRule, setEnforcementConfig, uninstall */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _src_events_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/events.js */ "./src/events.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/constants.js */ "./src/constants.js");
/* harmony import */ var _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _libraries_purposeDeclarations_validate_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../libraries/purposeDeclarations/validate.js */ "./libraries/purposeDeclarations/validate.js");
/* harmony import */ var _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../libraries/consentManagement/consentUtils.js */ "./libraries/consentManagement/consentUtils.js");

/**
 * This module gives publishers extra set of features to enforce individual purposes of TCF v2
 */











// @ts-expect-error the ts compiler is confused by build-time renaming of validate.mjs to validate.js



const STRICT_STORAGE_ENFORCEMENT = 'strictStorageEnforcement';
const ACTIVE_RULES = {
  purpose: {},
  feature: {}
};
const CONFIGURABLE_RULES = {
  storage: {
    type: 'purpose',
    default: {
      purpose: 'storage',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: []
    },
    id: 1
  },
  basicAds: {
    type: 'purpose',
    id: 2,
    default: {
      purpose: 'basicAds',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: [],
      deferS2Sbidders: false
    }
  },
  personalizedAds: {
    type: 'purpose',
    id: 4,
    default: {
      purpose: 'personalizedAds',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: [],
      eidsRequireP4Consent: false
    }
  },
  measurement: {
    type: 'purpose',
    id: 7,
    default: {
      purpose: 'measurement',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: []
    }
  },
  transmitPreciseGeo: {
    type: 'feature',
    id: 1,
    default: {
      purpose: 'transmitPreciseGeo',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: []
    }
  }
};
const storageBlocked = new Set();
const biddersBlocked = new Set();
const analyticsBlocked = new Set();
const ufpdBlocked = new Set();
const eidsBlocked = new Set();
const geoBlocked = new Set();
let hooksAdded = false;
let strictStorageEnforcement = false;
const GVLID_LOOKUP_PRIORITY = [_src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_BIDDER, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_UID, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_ANALYTICS, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_RTD];
const RULE_NAME = 'TCF2';
const RULE_HANDLES = [];
_src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gvlLegalBasisMapping', cfg => {
  // validate now to give warnings regardless of whether the mapping will actually be used
  const mapping = cfg.gvlLegalBasisMapping ?? {};
  Object.entries(mapping).forEach(([key, value]) => {
    value = Object.assign({}, _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.NO_PURPOSE_DECLARATION, value);
    const errorMessage = (0,_libraries_purposeDeclarations_validate_js__WEBPACK_IMPORTED_MODULE_12__.validatePurposeDeclarations)(value);
    if (errorMessage != null) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`gvlLegalBasisMapping for GVL ID ${key} is invalid: ${errorMessage}; assuming no legal basis for any purpose`, value);
      value = _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.NO_PURPOSE_DECLARATION;
    }
    mapping[key] = value;
  });
  (0,_libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.setGvlLegalBasisMapping)(mapping);
});

/**
 * Retrieve a module's GVL ID.
 */
function getGvlid(moduleType, moduleName, fallbackFn) {
  if (moduleName) {
    // Check user defined GVL Mapping in pbjs.setConfig()
    const gvlMapping = _src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gvlMapping');

    // Return GVL ID from user defined gvlMapping
    if (gvlMapping && gvlMapping[moduleName]) {
      return gvlMapping[moduleName];
    } else if (moduleType === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_PREBID) {
      return _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.VENDORLESS_GVLID;
    } else {
      let {
        gvlid,
        modules
      } = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.GDPR_GVLIDS.get(moduleName);
      if (gvlid == null && Object.keys(modules).length > 0) {
        // this behavior is for backwards compatibility; if multiple modules with the same
        // name declare different GVL IDs, pick the bidder's first, then userId, then analytics
        for (const type of GVLID_LOOKUP_PRIORITY) {
          if (modules.hasOwnProperty(type)) {
            gvlid = modules[type];
            if (type !== moduleType) {
              (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Multiple GVL IDs found for module '${moduleName}'; using the ${type} module's ID (${String(gvlid)}) instead of the ${moduleType}'s ID (${String(modules[moduleType])})`);
            }
            break;
          }
        }
      }
      if (gvlid == null && fallbackFn) {
        gvlid = fallbackFn();
      }
      return gvlid || null;
    }
  }
  return null;
}

/**
 * Retrieve GVL IDs that are dynamically set on analytics adapters.
 */
function getGvlidFromAnalyticsAdapter(code, config) {
  const adapter = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAnalyticsAdapter(code);
  return (gvlid => {
    if (typeof gvlid !== 'function') return gvlid;
    try {
      return gvlid.call(adapter.adapter, config);
    } catch (e) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Error invoking ${code} adapter.gvlid()`, e);
    }
  })(adapter?.adapter?.gvlid);
}
function shouldEnforce(consentData, purpose, name) {
  if (consentData == null && _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler.enabled) {
    // there is no consent data, but the GDPR module has been installed and configured
    // NOTE: this check is not foolproof, as when Prebid first loads, enforcement hooks have not been attached yet
    // This piece of code would not run at all, and `gdprDataHandler.enabled` would be false, until the first
    // `setConfig({consentManagement})`
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Attempting operation that requires purpose ${purpose} consent while consent data is not available${name ? ` (module: ${name})` : ''}. Assuming no consent was given.`);
    return true;
  }
  return consentData && consentData.gdprApplies;
}

/**
 * This function takes in a rule and consentData and validates against the consentData provided. Depending on what it returns,
 * the caller may decide to suppress a TCF-sensitive activity.
 * @param {Object} rule - enforcement rules set in config
 * @param {Object} consentData - gdpr consent data
 * @param {string=} currentModule - Bidder code of the current module
 * @param {number=} gvlId - GVL ID for the module
 * @returns {boolean}
 */
function validateRules(rule, consentData, currentModule, gvlId, params = {}) {
  const ruleOptions = CONFIGURABLE_RULES[rule.purpose];

  // return 'true' if vendor present in 'vendorExceptions'
  if ((rule.vendorExceptions || []).includes(currentModule)) {
    return true;
  }
  const deferToS2S = params['isS2S'] && rule.purpose === 'basicAds' && rule.deferS2Sbidders && !gvlId;
  const useVendorsLegalBasis = !deferToS2S && rule.enforceVendor && !(rule.softVendorExceptions || []).includes(currentModule);
  const {
    purpose,
    vendor
  } = (0,_libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.getConsent)(consentData, ruleOptions.type, ruleOptions.id, useVendorsLegalBasis ? gvlId : null);
  return (!rule.enforcePurpose || purpose) && (!useVendorsLegalBasis || gvlId === _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.VENDORLESS_GVLID || vendor);
}
function gdprRule(purposeNo, checkConsent, blocked = null, gvlidFallback = () => null) {
  return function (params) {
    const consentData = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_5__.gdprDataHandler.getConsentData();
    const modName = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__.ACTIVITY_PARAM_COMPONENT_NAME];
    if (shouldEnforce(consentData, purposeNo, modName)) {
      const gvlid = getGvlid(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__.ACTIVITY_PARAM_COMPONENT_TYPE], modName, gvlidFallback(params));
      const allow = !!checkConsent(consentData, modName, gvlid, params);
      if (!allow) {
        blocked && blocked.add(modName);
        return {
          allow
        };
      }
    }
  };
}
function singlePurposeGdprRule(purposeNo, blocked = null, gvlidFallback = () => null) {
  return gdprRule(purposeNo, (cd, modName, gvlid, params) => !!validateRules(ACTIVE_RULES.purpose[purposeNo], cd, modName, gvlid, params), blocked, gvlidFallback);
}
function exceptPrebidModules(ruleFn) {
  return function (params) {
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__.ACTIVITY_PARAM_COMPONENT_TYPE] === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_PREBID) {
      // TODO: this special case is for the PBS adapter (componentType is 'prebid')
      // we should check for generic purpose 2 consent & vendor consent based on the PBS vendor's GVL ID;
      // that is, however, a breaking change and skipped for now
      return;
    }
    return ruleFn(params);
  };
}
const accessDeviceRule = (rule => {
  return function (params) {
    // for vendorless (core) storage, do not enforce rules unless strictStorageEnforcement is set
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__.ACTIVITY_PARAM_COMPONENT_TYPE] === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_PREBID && !strictStorageEnforcement) return;
    return rule(params);
  };
})(singlePurposeGdprRule(1, storageBlocked));
const syncUserRule = singlePurposeGdprRule(1, storageBlocked);
const enrichEidsRule = singlePurposeGdprRule(1, storageBlocked);
const fetchBidsRule = exceptPrebidModules(singlePurposeGdprRule(2, biddersBlocked));
const reportAnalyticsRule = singlePurposeGdprRule(7, analyticsBlocked, params => getGvlidFromAnalyticsAdapter(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__.ACTIVITY_PARAM_COMPONENT_NAME], params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_9__.ACTIVITY_PARAM_ANL_CONFIG]));
const ufpdRule = singlePurposeGdprRule(4, ufpdBlocked);
const accessRequestCredentialsRule = singlePurposeGdprRule(1, storageBlocked);
const transmitEidsRule = exceptPrebidModules((() => {
  // Transmit EID special case:
  // by default, legal basis or vendor exceptions for any purpose between 2 and 10
  // (but disregarding enforcePurpose and enforceVendor config) is enough to allow EIDs through
  function check2to10Consent(consentData, modName, gvlId) {
    for (let pno = 2; pno <= 10; pno++) {
      if (ACTIVE_RULES.purpose[pno]?.vendorExceptions?.includes(modName)) {
        return true;
      }
      const {
        purpose,
        vendor
      } = (0,_libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.getConsent)(consentData, 'purpose', pno, gvlId);
      if (purpose && (vendor || ACTIVE_RULES.purpose[pno]?.softVendorExceptions?.includes(modName))) {
        return true;
      }
    }
    return false;
  }
  const defaultBehavior = gdprRule('2-10', check2to10Consent, eidsBlocked);
  const p4Behavior = singlePurposeGdprRule(4, eidsBlocked);
  return function (...args) {
    const fn = ACTIVE_RULES.purpose[4]?.eidsRequireP4Consent ? p4Behavior : defaultBehavior;
    return fn.apply(this, args);
  };
})());
const transmitPreciseGeoRule = gdprRule('Special Feature 1', (cd, modName, gvlId) => validateRules(ACTIVE_RULES.feature[1], cd, modName, gvlId), geoBlocked);

/**
 * Compiles the TCF2.0 enforcement results into an object, which is emitted as an event payload to "tcf2Enforcement" event.
 */
function emitTCF2FinalResults() {
  // remove null and duplicate values
  const formatSet = function (st) {
    return Array.from(st.keys()).filter(el => el != null);
  };
  const tcf2FinalResults = {
    storageBlocked: formatSet(storageBlocked),
    biddersBlocked: formatSet(biddersBlocked),
    analyticsBlocked: formatSet(analyticsBlocked),
    ufpdBlocked: formatSet(ufpdBlocked),
    eidsBlocked: formatSet(eidsBlocked),
    geoBlocked: formatSet(geoBlocked)
  };
  _src_events_js__WEBPACK_IMPORTED_MODULE_6__.emit(_src_constants_js__WEBPACK_IMPORTED_MODULE_7__.EVENTS.TCF2_ENFORCEMENT, tcf2FinalResults);
  [storageBlocked, biddersBlocked, analyticsBlocked, ufpdBlocked, eidsBlocked, geoBlocked].forEach(el => el.clear());
}
_src_events_js__WEBPACK_IMPORTED_MODULE_6__.on(_src_constants_js__WEBPACK_IMPORTED_MODULE_7__.EVENTS.AUCTION_END, emitTCF2FinalResults);

/**
 * These options live under the TCF consent module's configuration, so they only mean anything to a
 * publisher who has included that module: the augmentation is meant to apply only then.
 * @augmentationOptional
 */

/**
 * A configuration function that initializes some module variables, as well as adds hooks
 * @param {Object} config - GDPR enforcement config object
 */
function setEnforcementConfig(config) {
  let rules = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config, 'gdpr.rules');
  if (!rules) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('TCF2: enforcing P1, P2, P4, P7 and SP1 by default');
  }
  rules = Object.fromEntries((rules || []).map(r => [r.purpose, r]));
  strictStorageEnforcement = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config, STRICT_STORAGE_ENFORCEMENT);
  (0,_libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.setDefaultPurposeDeclaration)(Object.assign({}, _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.NO_PURPOSE_DECLARATION, config?.gdpr?.defaultLegalBasis ?? _libraries_consentManagement_consentUtils_js__WEBPACK_IMPORTED_MODULE_13__.DEFAULT_PURPOSE_DECLARATION));
  Object.entries(CONFIGURABLE_RULES).forEach(([name, opts]) => {
    ACTIVE_RULES[opts.type][opts.id] = rules[name] ?? opts.default;
  });
  if (!hooksAdded) {
    if (ACTIVE_RULES.purpose[1] != null) {
      hooksAdded = true;
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ACCESS_DEVICE, RULE_NAME, accessDeviceRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_SYNC_USER, RULE_NAME, syncUserRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ENRICH_EIDS, RULE_NAME, enrichEidsRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ACCESS_REQUEST_CREDENTIALS, RULE_NAME, accessRequestCredentialsRule));
    }
    if (ACTIVE_RULES.purpose[2] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_FETCH_BIDS, RULE_NAME, fetchBidsRule));
    }
    if (ACTIVE_RULES.purpose[4] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_TRANSMIT_UFPD, RULE_NAME, ufpdRule), (0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ENRICH_UFPD, RULE_NAME, ufpdRule));
    }
    if (ACTIVE_RULES.purpose[7] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_REPORT_ANALYTICS, RULE_NAME, reportAnalyticsRule));
    }
    if (ACTIVE_RULES.feature[1] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_TRANSMIT_PRECISE_GEO, RULE_NAME, transmitPreciseGeoRule));
    }
    RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_TRANSMIT_EIDS, RULE_NAME, transmitEidsRule));
  }
}
function uninstall() {
  while (RULE_HANDLES.length) RULE_HANDLES.pop()();
  hooksAdded = false;
}
_src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('consentManagement', config => setEnforcementConfig(config.consentManagement));
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('tcfControl');

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","consentManagement","purposeDeclarations"], () => (__webpack_exec__("./modules/tcfControl.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["impactifyBidAdapter.metadata"],{

/***/ "./metadata/modules/impactifyBidAdapter.js"
/*!*************************************************!*\
  !*** ./metadata/modules/impactifyBidAdapter.js ***!
  \*************************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libraries/metadata/metadata.js */ "./libraries/metadata/metadata.js");

_libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_0__.metadata.register("impactifyBidAdapter", {"disclosures":{"https://ad.impactify.io/tcfvendors.json":{"timestamp":"2026-10-03T16:05:06.506Z","disclosures":[{"identifier":"_im*","type":"web","purposes":[3,4,7,10]}]}},"components":[{"componentType":"bidder","componentName":"impactify","disclosureURL":"https://ad.impactify.io/tcfvendors.json"},{"componentType":"bidder","componentName":"imp","aliasOf":"impactify","disclosureURL":null}]})

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","metadata"], () => (__webpack_exec__("./metadata/modules/impactifyBidAdapter.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["debugging.metadata"],{

/***/ "./metadata/modules/debugging.js"
/*!***************************************!*\
  !*** ./metadata/modules/debugging.js ***!
  \***************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libraries/metadata/metadata.js */ "./libraries/metadata/metadata.js");

_libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_0__.metadata.register("debugging", {"disclosures":{"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/debugging.json":{"timestamp":"2026-10-03T16:04:33.184Z","disclosures":[{"identifier":"__*_debugging__","type":"web","purposes":[1]}]}},"components":[{"componentType":"prebid","componentName":"debugging","disclosureURL":"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/debugging.json"}]})

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","metadata"], () => (__webpack_exec__("./metadata/modules/debugging.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["prebid-core.metadata"],{

/***/ "./metadata/modules/prebid-core.js"
/*!*****************************************!*\
  !*** ./metadata/modules/prebid-core.js ***!
  \*****************************************/
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libraries/metadata/metadata.js */ "./libraries/metadata/metadata.js");

_libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_0__.metadata.register("prebid-core", {"disclosures":{"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/probes.json":{"timestamp":"2026-10-03T16:04:33.182Z","disclosures":[{"identifier":"_rdc*","type":"cookie","maxAgeSeconds":10,"cookieRefresh":false,"purposes":[1]},{"identifier":"prebid.cookieTest","type":"web","purposes":[1]}]},"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/debugging.json":{"timestamp":"2026-10-03T16:04:33.182Z","disclosures":[{"identifier":"__*_debugging__","type":"web","purposes":[1]}]}},"components":[{"componentType":"prebid","componentName":"fpdEnrichment","disclosureURL":"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/probes.json"},{"componentType":"prebid","componentName":"storage","disclosureURL":"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/probes.json"},{"componentType":"prebid","componentName":"debugging","disclosureURL":"https://cdn.jsdelivr.net/gh/prebid/Prebid.js/metadata/disclosures/prebid/debugging.json"}]})

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","fpdUtils","viewport","creative-renderer-safe","creative-renderer-display","metadata"], () => (__webpack_exec__("./metadata/modules/prebid-core.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);

})()
 
   pbjs.processQueue();
 
} else {
 try {
  if(window.pbjs.getConfig('debug')) {
    console.warn('Attempted to load a copy of Prebid.js that clashes with the existing \'pbjs\' instance. Load aborted.');
  }
 } catch (e) {}
}
//# sourceMappingURL=prebid.js.map
