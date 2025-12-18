"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["cmp"],{

/***/ "./libraries/cmp/cmpClient.js":
/*!************************************!*\
  !*** ./libraries/cmp/cmpClient.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MODE_CALLBACK: () => (/* binding */ MODE_CALLBACK),
/* harmony export */   cmpClient: () => (/* binding */ cmpClient)
/* harmony export */ });
/* unused harmony exports MODE_MIXED, MODE_RETURN */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


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
function cmpClient(_ref) {
  let {
    apiName,
    apiVersion,
    apiArgs = ['command', 'callback', 'parameter', 'version'],
    callbackArgs = ['returnValue', 'success'],
    mode = MODE_MIXED
  } = _ref;
  let win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  const cmpCallbacks = {};
  const callName = "".concat(apiName, "Call");
  const cmpDataPkgName = "".concat(apiName, "Return");
  function handleMessage(event) {
    var _json$cmpDataPkgName;
    const json = typeof event.data === 'string' && event.data.includes(cmpDataPkgName) ? JSON.parse(event.data) : event.data;
    if (json !== null && json !== void 0 && (_json$cmpDataPkgName = json[cmpDataPkgName]) !== null && _json$cmpDataPkgName !== void 0 && _json$cmpDataPkgName.callId) {
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
    client = function invokeCMPDirect() {
      let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.PbPromise((resolve, reject) => {
        const ret = cmpFrame[apiName](...resolveParams(_objectSpread(_objectSpread({}, params), {}, {
          callback: params.callback || mode === MODE_CALLBACK ? wrapCallback(params.callback, resolve, reject) : undefined
        })).map(_ref2 => {
          let [_, val] = _ref2;
          return val;
        }));
        if (mode === MODE_RETURN || params.callback == null && mode === MODE_MIXED) {
          resolve(ret);
        }
      });
    };
  } else {
    win.addEventListener('message', handleMessage, false);
    client = function invokeCMPFrame(params) {
      let once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.PbPromise((resolve, reject) => {
        // call CMP via postMessage
        const callId = Math.random().toString();
        const msg = {
          [callName]: _objectSpread(_objectSpread({}, Object.fromEntries(resolveParams(params).filter(_ref3 => {
            let [param] = _ref3;
            return param !== 'callback';
          }))), {}, {
            callId: callId
          })
        };
        cmpCallbacks[callId] = wrapCallback(params === null || params === void 0 ? void 0 : params.callback, resolve, reject, (once || (params === null || params === void 0 ? void 0 : params.callback) == null) && (() => {
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


/***/ }),

/***/ "./libraries/cmp/cmpEventUtils.js":
/*!****************************************!*\
  !*** ./libraries/cmp/cmpEventUtils.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCmpEventManager: () => (/* binding */ createCmpEventManager)
/* harmony export */ });
/* unused harmony exports BaseCmpEventManager, TcfCmpEventManager, GppCmpEventManager */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");

/**
 * Shared utilities for CMP event listener management
 * Used by TCF and GPP consent management modules
 */


/**
 * Base CMP event manager implementation
 */
class BaseCmpEventManager {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "cmpApi", null);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "listenerId", undefined);
  }
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
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "getConsentData", void 0);
    this.getConsentData = getConsentData || (() => null);
  }
  removeCmpEventListener() {
    const params = this.getRemoveListenerParams();
    if (params) {
      const consentData = this.getConsentData();
      params.apiVersion = (consentData === null || consentData === void 0 ? void 0 : consentData.apiVersion) || 2;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Removing TCF CMP event listener');
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
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Removing GPP CMP event listener');
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
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)("Unknown CMP type: ".concat(type));
      return null;
  }
}


/***/ })

}]);
//# sourceMappingURL=cmp.js.map