/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/dlv/index.js":
/*!***********************************!*\
  !*** ./node_modules/dlv/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./node_modules/fun-hooks/no-eval/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fun-hooks/no-eval/index.js ***!
  \*************************************************/
/***/ ((module) => {

/*
* @license MIT
* Fun Hooks v0.9.10
* (c) @snapwich
*/
create.SYNC = 1;
create.ASYNC = 2;
create.QUEUE = 4;

var packageName = "fun-hooks";

function hasProxy() {
  return !!(typeof Proxy === "function" && Proxy.revocable);
}

var defaults = Object.freeze({
  useProxy: true,
  ready: 0
});

var hookableMap = new WeakMap();

// detect incorrectly implemented reduce and if found use polyfill
// https://github.com/prebid/Prebid.js/issues/3576
// polyfill from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
var reduce =
  [1]
    .reduce(function(a, b, c) {
      return [a, b, c];
    }, 2)
    .toString() === "2,1,0"
    ? Array.prototype.reduce
    : function(callback, initial) {
        var o = Object(this);
        var len = o.length >>> 0;
        var k = 0;
        var value;
        if (initial) {
          value = initial;
        } else {
          while (k < len && !(k in o)) {
            k++;
          }
          value = o[k++];
        }
        while (k < len) {
          if (k in o) {
            value = callback(value, o[k], k, o);
          }
          k++;
        }
        return value;
      };

function rest(args, skip) {
  return Array.prototype.slice.call(args, skip);
}

var assign =
  Object.assign ||
  function assign(target) {
    return reduce.call(
      rest(arguments, 1),
      function(target, obj) {
        if (obj) {
          Object.keys(obj).forEach(function(prop) {
            target[prop] = obj[prop];
          });
        }
        return target;
      },
      target
    );
  };

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

  config = assign({}, defaults, config);

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
      props = Object.getOwnPropertyNames(obj);
      walk = false;
    }
    var objHooks = {};
    var doNotHook = ["constructor"];
    do {
      props = props.filter(function(prop) {
        return (
          typeof obj[prop] === "function" &&
          !(doNotHook.indexOf(prop) !== -1) &&
          !prop.match(/^_/)
        );
      });
      props.forEach(function(prop) {
        var parts = prop.split(":");
        var name = parts[0];
        var type = parts[1] || "sync";
        if (!objHooks[name]) {
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
    return reduce.call(
      parts,
      function(memo, part, i) {
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
      },
      hooks
    );
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
          assign(hooks, {
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
    var hookedFn;
    var handlers = {
      get: function(target, prop) {
        return hookable[prop] || Reflect.get.apply(Reflect, arguments);
      }
    };

    if (!ready) {
      postReady.push(setTrap);
    }

    if (config.useProxy && hasProxy()) {
      hookedFn = new Proxy(fn, handlers);
    } else {
      hookedFn = function() {
        return handlers.apply
          ? handlers.apply(fn, this, rest(arguments))
          : fn.apply(this, arguments);
      };
      assign(hookedFn, hookable);
    }

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
            if (order[curr]) {
              var args = rest(arguments);
              next.bail = bail;
              args.unshift(next);
              return order[curr++].apply(thisArg, args);
            }
            if (type === "sync") {
              result = value;
            } else if (callback) {
              callback.apply(null, arguments);
            }
          }
          order[targetIndex] = function() {
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


/***/ }),

/***/ "./node_modules/dset/dist/index.mjs":
/*!******************************************!*\
  !*** ./node_modules/dset/dist/index.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./node_modules/klona/json/index.mjs":
/*!*******************************************!*\
  !*** ./node_modules/klona/json/index.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
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
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
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
/******/ 					var r = fn();
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
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
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
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
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
/******/ 		var chunkLoadingGlobal = self["pbjsChunk"] = self["pbjsChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["chunk-core","creative-renderer-display"], () => (__webpack_require__("./src/prebid.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=prebid-core.js.map