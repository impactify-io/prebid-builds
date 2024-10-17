"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["cmp"],{

/***/ "./libraries/cmp/cmpClient.js":
/*!************************************!*\
  !*** ./libraries/cmp/cmpClient.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MODE_CALLBACK": function() { return /* binding */ MODE_CALLBACK; },
/* harmony export */   "MODE_MIXED": function() { return /* binding */ MODE_MIXED; },
/* harmony export */   "MODE_RETURN": function() { return /* binding */ MODE_RETURN; },
/* harmony export */   "cmpClient": function() { return /* binding */ cmpClient; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }


/**
 * @typedef {function} CMPClient
 *
 * @param {{}} params CMP parameters. Currently this is a subset of {command, callback, parameter, version}.
 * @param {boolean} once if true, discard cross-frame event listeners once a reply message is received.
 * @returns {Promise<*>} a promise to the API's "result" - see the `mode` argument to `cmpClient` on how that's determined.
 * @property {boolean} isDirect true if the CMP is directly accessible (no postMessage required)
 * @property {() => void} close close the client; currently, this just stops listening for cross-frame messages.
 */

var MODE_MIXED = 0;
var MODE_RETURN = 1;
var MODE_CALLBACK = 2;

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
function cmpClient(_ref) {
  var apiName = _ref.apiName,
    apiVersion = _ref.apiVersion,
    _ref$apiArgs = _ref.apiArgs,
    apiArgs = _ref$apiArgs === void 0 ? ['command', 'callback', 'parameter', 'version'] : _ref$apiArgs,
    _ref$callbackArgs = _ref.callbackArgs,
    callbackArgs = _ref$callbackArgs === void 0 ? ['returnValue', 'success'] : _ref$callbackArgs,
    _ref$mode = _ref.mode,
    mode = _ref$mode === void 0 ? MODE_MIXED : _ref$mode;
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var cmpCallbacks = {};
  var callName = "".concat(apiName, "Call");
  var cmpDataPkgName = "".concat(apiName, "Return");
  function handleMessage(event) {
    var _json$cmpDataPkgName;
    var json = typeof event.data === 'string' && event.data.includes(cmpDataPkgName) ? JSON.parse(event.data) : event.data;
    if (json !== null && json !== void 0 && (_json$cmpDataPkgName = json[cmpDataPkgName]) !== null && _json$cmpDataPkgName !== void 0 && _json$cmpDataPkgName.callId) {
      var payload = json[cmpDataPkgName];
      if (cmpCallbacks.hasOwnProperty(payload.callId)) {
        cmpCallbacks[payload.callId].apply(cmpCallbacks, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__["default"])(callbackArgs.map(function (name) {
          return payload[name];
        })));
      }
    }
  }
  function findCMP() {
    var f = win;
    var cmpFrame;
    var isDirect = false;
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
        if (f.frames["".concat(apiName, "Locator")]) {
          cmpFrame = f;
          break;
        }
      } catch (e) {}
      if (f === win.top) break;
      f = f.parent;
    }
    return [cmpFrame, isDirect];
  }
  var _findCMP = findCMP(),
    _findCMP2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_findCMP, 2),
    cmpFrame = _findCMP2[0],
    isDirect = _findCMP2[1];
  if (!cmpFrame) {
    return;
  }
  function resolveParams(params) {
    params = Object.assign({
      version: apiVersion
    }, params);
    return apiArgs.map(function (arg) {
      return [arg, params[arg]];
    });
  }
  function wrapCallback(callback, resolve, reject, preamble) {
    var haveCb = typeof callback === 'function';
    return function (result, success) {
      preamble && preamble();
      if (mode !== MODE_RETURN) {
        var resolver = success == null || success ? resolve : reject;
        resolver(haveCb ? undefined : result);
      }
      haveCb && callback.apply(this, arguments);
    };
  }
  var client;
  if (isDirect) {
    client = function invokeCMPDirect() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise(function (resolve, reject) {
        var ret = cmpFrame[apiName].apply(cmpFrame, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__["default"])(resolveParams(_objectSpread(_objectSpread({}, params), {}, {
          callback: params.callback || mode === MODE_CALLBACK ? wrapCallback(params.callback, resolve, reject) : undefined
        })).map(function (_ref2) {
          var _ref3 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref2, 2),
            _ = _ref3[0],
            val = _ref3[1];
          return val;
        })));
        if (mode === MODE_RETURN || params.callback == null && mode === MODE_MIXED) {
          resolve(ret);
        }
      });
    };
  } else {
    win.addEventListener('message', handleMessage, false);
    client = function invokeCMPFrame(params) {
      var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise(function (resolve, reject) {
        // call CMP via postMessage
        var callId = Math.random().toString();
        var msg = (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, callName, _objectSpread(_objectSpread({}, Object.fromEntries(resolveParams(params).filter(function (_ref4) {
          var _ref5 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref4, 1),
            param = _ref5[0];
          return param !== 'callback';
        }))), {}, {
          callId: callId
        }));
        cmpCallbacks[callId] = wrapCallback(params === null || params === void 0 ? void 0 : params.callback, resolve, reject, (once || (params === null || params === void 0 ? void 0 : params.callback) == null) && function () {
          delete cmpCallbacks[callId];
        });
        cmpFrame.postMessage(msg, '*');
        if (mode === MODE_RETURN) resolve();
      });
    };
  }
  return Object.assign(client, {
    isDirect: isDirect,
    close: function close() {
      !isDirect && win.removeEventListener('message', handleMessage);
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=cmp.js.map