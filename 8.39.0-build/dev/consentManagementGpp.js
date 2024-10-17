"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementGpp"],{

/***/ "./modules/consentManagementGpp.js":
/*!*****************************************!*\
  !*** ./modules/consentManagementGpp.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports userCMP, consentTimeout, GPPClient, lookupIabConsent, requestBidsHook, storeConsentData, resetConsentData, setConsentConfig, enrichFPDHook */
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "./node_modules/@babel/runtime/helpers/esm/get.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldGet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../src/utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../src/fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libraries/cmp/cmpClient.js */ "./libraries/cmp/cmpClient.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");












function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldDestructureSet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); return _classApplyDescriptorDestructureSet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorDestructureSet(receiver, descriptor) { if (descriptor.set) { if (!("__destrObj" in descriptor)) { descriptor.__destrObj = { set value(v) { descriptor.set.call(receiver, v); } }; } return descriptor.__destrObj; } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } return descriptor; } }

/**
 * This module adds GPP consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GPP supported adapters to read/pass this information to
 * their system and for various other features/modules in Prebid.js.
 */









var DEFAULT_CMP = 'iab';
var DEFAULT_CONSENT_TIMEOUT = 10000;
var userCMP;
var consentTimeout;
var staticConsentData;
var consentData;
var addedConsentHook = false;
function pipeCallbacks(fn, _ref) {
  var onSuccess = _ref.onSuccess,
    onError = _ref.onError;
  new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise(function (resolve) {
    return resolve(fn());
  }).then(onSuccess, function (err) {
    if (err instanceof GPPError) {
      onError.apply(void 0, [err.message].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__["default"])(err.args)));
    } else {
      onError("GPP error:", err);
    }
  });
}
function lookupStaticConsentData(callbacks) {
  return pipeCallbacks(function () {
    return processCmpData(staticConsentData);
  }, callbacks);
}
var GPP_10 = '1.0';
var GPP_11 = '1.1';
var GPPError = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__["default"])(function GPPError(message, arg) {
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_6__["default"])(this, GPPError);
  this.message = message;
  this.args = arg == null ? [] : [arg];
});
var _resolve = /*#__PURE__*/new WeakMap();
var _reject = /*#__PURE__*/new WeakMap();
var _pending = /*#__PURE__*/new WeakMap();
var GPPClient = /*#__PURE__*/function () {
  function GPPClient(cmpVersion, cmp) {
    var _this = this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_6__["default"])(this, GPPClient);
    _classPrivateFieldInitSpec(this, _resolve, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _reject, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _pending, {
      writable: true,
      value: []
    });
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "initialized", false);
    this.apiVersion = this.constructor.apiVersion;
    this.cmpVersion = cmp;
    this.cmp = cmp;
    var _map = [0, 1].map(function (slot) {
      return function (result) {
        while ((0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, _pending).length) {
          (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, _pending).pop()[slot](result);
        }
      };
    });
    var _map2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_map, 2);
    _classPrivateFieldDestructureSet(this, _resolve).value = _map2[0];
    _classPrivateFieldDestructureSet(this, _reject).value = _map2[1];
  }

  /**
   * initialize this client - update consent data if already available,
   * and set up event listeners to also update on CMP changes
   *
   * @param pingData
   * @returns {Promise<{}>} a promise to GPP consent data
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__["default"])(GPPClient, [{
    key: "init",
    value: function init(pingData) {
      var _this2 = this;
      var ready = this.updateWhenReady(pingData);
      if (!this.initialized) {
        this.initialized = true;
        this.cmp({
          command: 'addEventListener',
          callback: function callback(event, success) {
            var _event$pingData;
            if (success != null && !success) {
              (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(_this2, _reject).call(_this2, new GPPError('Received error response from CMP', event));
            } else if ((event === null || event === void 0 ? void 0 : (_event$pingData = event.pingData) === null || _event$pingData === void 0 ? void 0 : _event$pingData.cmpStatus) === 'error') {
              (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(_this2, _reject).call(_this2, new GPPError('CMP status is "error"; please check CMP setup', event));
            } else if (_this2.isCMPReady((event === null || event === void 0 ? void 0 : event.pingData) || {}) && _this2.events.includes(event === null || event === void 0 ? void 0 : event.eventName)) {
              (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(_this2, _resolve).call(_this2, _this2.updateConsent(event.pingData));
            }
          }
        });
      }
      return ready;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      return this.cmp({
        command: 'ping'
      }).then(this.updateWhenReady.bind(this));
    }

    /**
     * Retrieve and store GPP consent data.
     *
     * @param pingData
     * @returns {Promise<{}>} a promise to GPP consent data
     */
  }, {
    key: "updateConsent",
    value: function updateConsent(pingData) {
      return this.getGPPData(pingData).then(function (data) {
        if (data == null || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.isEmpty)(data)) {
          throw new GPPError('Received empty response from CMP', data);
        }
        return processCmpData(data);
      }).then(function (data) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logInfo)('Retrieved GPP consent from CMP:', data);
        return data;
      });
    }

    /**
     * Return a promise to GPP consent data, to be retrieved the next time the CMP signals it's ready.
     *
     * @returns {Promise<{}>}
     */
  }, {
    key: "nextUpdate",
    value: function nextUpdate() {
      var _this3 = this;
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise(function (resolve, reject) {
        (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(_this3, _pending).push([resolve, reject]);
      });
    }

    /**
     * Return a promise to GPP consent data, to be retrieved immediately if the CMP is ready according to `pingData`,
     * or as soon as it signals that it's ready otherwise.
     *
     * @param pingData
     * @returns {Promise<{}>}
     */
  }, {
    key: "updateWhenReady",
    value: function updateWhenReady(pingData) {
      return this.isCMPReady(pingData) ? this.updateConsent(pingData) : this.nextUpdate();
    }
  }], [{
    key: "register",
    value: function register(apiVersion) {
      var defaultVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.apiVersion = apiVersion;
      this.CLIENTS[apiVersion] = this;
      if (defaultVersion) {
        this.CLIENTS.default = this;
      }
    }
  }, {
    key: "init",
    value:
    /**
     * Ping the CMP to set up an appropriate client for it, and initialize it.
     *
     * @param mkCmp
     * @returns {Promise<[GPPClient,Promise<{}>]>} a promise to two objects:
     *  - a GPPClient that talks the best GPP dialect we know for the CMP's version;
     *  - a promise to GPP data.
     */
    function init() {
      var _this4 = this;
      var mkCmp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__.cmpClient;
      var inst = this.INST;
      if (!inst) {
        var err;
        var reset = function reset() {
          return err && (_this4.INST = null);
        };
        inst = this.INST = this.ping(mkCmp).catch(function (e) {
          err = true;
          reset();
          throw e;
        });
        reset();
      }
      return inst.then(function (_ref2) {
        var _ref3 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref2, 2),
          client = _ref3[0],
          pingData = _ref3[1];
        return [client, client.initialized ? client.refresh() : client.init(pingData)];
      });
    }

    /**
     * Ping the CMP to determine its version and set up a client appropriate for it.
     *
     * @param mkCmp
     * @returns {Promise<[GPPClient, {}]>} a promise to two objects:
     *  - a GPPClient that talks the best GPP dialect we know for the CMP's version;
     *  - the result from pinging the CMP.
     */
  }, {
    key: "ping",
    value: function ping() {
      var _this5 = this;
      var mkCmp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__.cmpClient;
      var cmpOptions = {
        apiName: '__gpp',
        apiArgs: ['command', 'callback', 'parameter'] // do not pass version - not clear what it's for (or what we should use)
      };

      // in 1.0, 'ping' should return pingData but ignore callback;
      // in 1.1 it should not return anything but run the callback
      // the following looks for either - but once the version is known, produce a client that knows whether the
      // rest of the interactions should pick return values or pass callbacks

      var probe = mkCmp(_objectSpread(_objectSpread({}, cmpOptions), {}, {
        mode: _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__.MODE_RETURN
      }));
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise(function (resolve, reject) {
        if (probe == null) {
          reject(new GPPError('GPP CMP not found'));
          return;
        }
        var done = false; // some CMPs do both return value and callbacks - avoid repeating log messages
        var pong = function pong(result, success) {
          if (done) return;
          if (success != null && !success) {
            reject(result);
            return;
          }
          if (result == null) return;
          done = true;
          var cmpVersion = result === null || result === void 0 ? void 0 : result.gppVersion;
          var Client = _this5.getClient(cmpVersion);
          if (cmpVersion !== Client.apiVersion) {
            (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logWarn)("Unrecognized GPP CMP version: ".concat(cmpVersion, ". Continuing using GPP API version ").concat(Client, "..."));
          } else {
            (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logInfo)("Using GPP version ".concat(cmpVersion));
          }
          var mode = Client.apiVersion === GPP_10 ? _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__.MODE_MIXED : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__.MODE_CALLBACK;
          var client = new Client(cmpVersion, mkCmp(_objectSpread(_objectSpread({}, cmpOptions), {}, {
            mode: mode
          })));
          resolve([client, result]);
        };
        probe({
          command: 'ping',
          callback: pong
        }).then(function (res) {
          return pong(res, true);
        }, reject);
      }).finally(function () {
        probe && probe.close();
      });
    }
  }, {
    key: "getClient",
    value: function getClient(cmpVersion) {
      return this.CLIENTS.hasOwnProperty(cmpVersion) ? this.CLIENTS[cmpVersion] : this.CLIENTS.default;
    }
  }]);
  return GPPClient;
}();

// eslint-disable-next-line no-unused-vars
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(GPPClient, "CLIENTS", {});
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(GPPClient, "INST", void 0);
var GPP10Client = /*#__PURE__*/function (_GPPClient) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_11__["default"])(GPP10Client, _GPPClient);
  var _super = _createSuper(GPP10Client);
  function GPP10Client() {
    var _this6;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_6__["default"])(this, GPP10Client);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this6 = _super.call.apply(_super, [this].concat(args));
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_12__["default"])(_this6), "events", ['sectionChange', 'cmpStatus']);
    return _this6;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__["default"])(GPP10Client, [{
    key: "isCMPReady",
    value: function isCMPReady(pingData) {
      return pingData.cmpStatus === 'loaded';
    }
  }, {
    key: "getGPPData",
    value: function getGPPData(pingData) {
      var _this7 = this;
      var parsedSections = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise.all((pingData.supportedAPIs || pingData.apiSupport || []).map(function (api) {
        return _this7.cmp({
          command: 'getSection',
          parameter: api
        }).catch(function (err) {
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logWarn)("Could not retrieve GPP section '".concat(api, "'"), err);
        }).then(function (section) {
          return [api, section];
        });
      })).then(function (sections) {
        // parse single section object into [core, gpc] to uniformize with 1.1 parsedSections
        return Object.fromEntries(sections.filter(function (_ref4) {
          var _ref5 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref4, 2),
            _ = _ref5[0],
            val = _ref5[1];
          return val != null;
        }).map(function (_ref6) {
          var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref6, 2),
            api = _ref7[0],
            section = _ref7[1];
          var subsections = [Object.fromEntries(Object.entries(section).filter(function (_ref8) {
            var _ref9 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref8, 1),
              k = _ref9[0];
            return k !== 'Gpc';
          }))];
          if (section.Gpc != null) {
            subsections.push({
              SubsectionType: 1,
              Gpc: section.Gpc
            });
          }
          return [api, subsections];
        }));
      });
      return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise.all([this.cmp({
        command: 'getGPPData'
      }), parsedSections]).then(function (_ref10) {
        var _ref11 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref10, 2),
          gppData = _ref11[0],
          parsedSections = _ref11[1];
        return Object.assign({}, gppData, {
          parsedSections: parsedSections
        });
      });
    }
  }]);
  return GPP10Client;
}(GPPClient); // eslint-disable-next-line no-unused-vars
(0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_13__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(GPP10Client), "register", GPP10Client).call(GPP10Client, GPP_10);
var GPP11Client = /*#__PURE__*/function (_GPPClient2) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_11__["default"])(GPP11Client, _GPPClient2);
  var _super2 = _createSuper(GPP11Client);
  function GPP11Client() {
    var _this8;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_6__["default"])(this, GPP11Client);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this8 = _super2.call.apply(_super2, [this].concat(args));
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_12__["default"])(_this8), "events", ['sectionChange', 'signalStatus']);
    return _this8;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__["default"])(GPP11Client, [{
    key: "isCMPReady",
    value: function isCMPReady(pingData) {
      return pingData.signalStatus === 'ready';
    }
  }, {
    key: "getGPPData",
    value: function getGPPData(pingData) {
      return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise.resolve(pingData);
    }
  }]);
  return GPP11Client;
}(GPPClient);
/**
 * This function handles interacting with an IAB compliant CMP to obtain the consent information of the user.
 * Given the async nature of the CMP's API, we pass in acting success/error callback functions to exit this function
 * based on the appropriate result.
 * @param {function({})} onSuccess acts as a success callback when CMP returns a value; pass along consentObjectfrom CMP
 * @param {function(string, ...{}?)} cmpError acts as an error callback while interacting with CMP; pass along an error message (string) and any extra error arguments (purely for logging)
 */
(0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_13__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(GPP11Client), "register", GPP11Client).call(GPP11Client, GPP_11, true);
function lookupIabConsent(_ref12) {
  var onSuccess = _ref12.onSuccess,
    onError = _ref12.onError;
  var mkCmp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_10__.cmpClient;
  pipeCallbacks(function () {
    return GPPClient.init(mkCmp).then(function (_ref13) {
      var _ref14 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref13, 2),
        client = _ref14[0],
        gppDataPm = _ref14[1];
      return gppDataPm;
    });
  }, {
    onSuccess: onSuccess,
    onError: onError
  });
}

// add new CMPs here, with their dedicated lookup function
var cmpCallMap = {
  'iab': lookupIabConsent,
  'static': lookupStaticConsentData
};

/**
 * Look up consent data and store it in the `consentData` global as well as `adapterManager.js`' gdprDataHandler.
 *
 * @param cb A callback that takes: a boolean that is true if the auction should be canceled; an error message and extra
 * error arguments that will be undefined if there's no error.
 */
function loadConsentData(cb) {
  var isDone = false;
  var timer = null;
  function done(consentData, shouldCancelAuction, errMsg) {
    if (timer != null) {
      clearTimeout(timer);
    }
    isDone = true;
    _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__.gppDataHandler.setConsentData(consentData);
    if (typeof cb === 'function') {
      for (var _len3 = arguments.length, extraArgs = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        extraArgs[_key3 - 3] = arguments[_key3];
      }
      cb.apply(void 0, [shouldCancelAuction, errMsg].concat(extraArgs));
    }
  }
  if (!cmpCallMap.hasOwnProperty(userCMP)) {
    done(null, false, "GPP CMP framework (".concat(userCMP, ") is not a supported framework.  Aborting consentManagement module and resuming auction."));
    return;
  }
  var callbacks = {
    onSuccess: function onSuccess(data) {
      return done(data, false);
    },
    onError: function onError(msg) {
      for (var _len4 = arguments.length, extraArgs = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        extraArgs[_key4 - 1] = arguments[_key4];
      }
      done.apply(void 0, [null, true, msg].concat(extraArgs));
    }
  };
  cmpCallMap[userCMP](callbacks);
  if (!isDone) {
    var onTimeout = function onTimeout() {
      var continueToAuction = function continueToAuction(data) {
        done(data, false, 'GPP CMP did not load, continuing auction...');
      };
      pipeCallbacks(function () {
        return processCmpData(consentData);
      }, {
        onSuccess: continueToAuction,
        onError: function onError() {
          return continueToAuction(storeConsentData());
        }
      });
    };
    if (consentTimeout === 0) {
      onTimeout();
    } else {
      timer = setTimeout(onTimeout, consentTimeout);
    }
  }
}

/**
 * Like `loadConsentData`, but cache and re-use previously loaded data.
 * @param cb
 */
function loadIfMissing(cb) {
  if (consentData) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logInfo)('User consent information already known.  Pulling internally stored information...');
    // eslint-disable-next-line standard/no-callback-literal
    cb(false);
  } else {
    loadConsentData(cb);
  }
}

/**
 * If consentManagement module is enabled (ie included in setConfig), this hook function will attempt to fetch the
 * user's encoded consent string from the supported CMP.  Once obtained, the module will store this
 * data as part of a gppConsent object which gets transferred to adapterManager's gppDataHandler object.
 * This information is later added into the bidRequest object for any supported adapters to read/pass along to their system.
 * @param {object} reqBidsConfigObj required; This is the same param that's used in pbjs.requestBids.
 * @param {function} fn required; The next function in the chain, used by hook.js
 */
var requestBidsHook = (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_15__.timedAuctionHook)('gpp', function requestBidsHook(fn, reqBidsConfigObj) {
  loadIfMissing(function (shouldCancelAuction, errMsg) {
    if (errMsg) {
      var log = _src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logWarn;
      if (shouldCancelAuction) {
        log = _src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logError;
        errMsg = "".concat(errMsg, " Canceling auction as per consentManagement config.");
      }
      for (var _len5 = arguments.length, extraArgs = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        extraArgs[_key5 - 2] = arguments[_key5];
      }
      log.apply(void 0, [errMsg].concat(extraArgs));
    }
    if (shouldCancelAuction) {
      fn.stopTiming();
      if (typeof reqBidsConfigObj.bidsBackHandler === 'function') {
        reqBidsConfigObj.bidsBackHandler();
      } else {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logError)('Error executing bidsBackHandler');
      }
    } else {
      fn.call(this, reqBidsConfigObj);
    }
  });
});
function processCmpData(consentData) {
  if ((consentData === null || consentData === void 0 ? void 0 : consentData.applicableSections) != null && !Array.isArray(consentData.applicableSections) || (consentData === null || consentData === void 0 ? void 0 : consentData.gppString) != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.isStr)(consentData.gppString) || (consentData === null || consentData === void 0 ? void 0 : consentData.parsedSections) != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.isPlainObject)(consentData.parsedSections)) {
    throw new GPPError('CMP returned unexpected value during lookup process.', consentData);
  }
  return storeConsentData(consentData);
}

/**
 * Stores CMP data locally in module to make information available in adaptermanager.js for later in the auction
 * @param {{}} gppData the result of calling a CMP's `getGPPData` (or equivalent)
 * @param {{}} sectionData map from GPP section name to the result of calling a CMP's `getSection` (or equivalent)
 */
function storeConsentData() {
  var gppData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  consentData = {
    gppString: gppData === null || gppData === void 0 ? void 0 : gppData.gppString,
    applicableSections: (gppData === null || gppData === void 0 ? void 0 : gppData.applicableSections) || [],
    parsedSections: (gppData === null || gppData === void 0 ? void 0 : gppData.parsedSections) || {},
    gppData: gppData
  };
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__.gppDataHandler.setConsentData(gppData);
  return consentData;
}

/**
 * Simply resets the module's consentData variable back to undefined, mainly for testing purposes
 */
function resetConsentData() {
  consentData = undefined;
  userCMP = undefined;
  consentTimeout = undefined;
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__.gppDataHandler.reset();
  GPPClient.INST = null;
}

/**
 * A configuration function that initializes some module variables, as well as add a hook into the requestBids function
 * @param {{cmp:string, timeout:number, defaultGdprScope:boolean}} config required; consentManagement module config settings; cmp (string), timeout (int))
 */
function setConsentConfig(config) {
  config = config && config.gpp;
  if (!config || (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_16__["default"])(config) !== 'object') {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logWarn)('consentManagement.gpp config not defined, exiting consent manager module');
    return;
  }
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.isStr)(config.cmpApi)) {
    userCMP = config.cmpApi;
  } else {
    userCMP = DEFAULT_CMP;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logInfo)("consentManagement.gpp config did not specify cmp.  Using system default setting (".concat(DEFAULT_CMP, ")."));
  }
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.isNumber)(config.timeout)) {
    consentTimeout = config.timeout;
  } else {
    consentTimeout = DEFAULT_CONSENT_TIMEOUT;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logInfo)("consentManagement.gpp config did not specify timeout.  Using system default setting (".concat(DEFAULT_CONSENT_TIMEOUT, ")."));
  }
  if (userCMP === 'static') {
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.isPlainObject)(config.consentData)) {
      staticConsentData = config.consentData;
      consentTimeout = 0;
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logError)("consentManagement.gpp config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.");
    }
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.logInfo)('consentManagement.gpp module has been activated...');
  if (!addedConsentHook) {
    (0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_17__.getGlobal)().requestBids.before(requestBidsHook, 50);
    _src_activities_params_js__WEBPACK_IMPORTED_MODULE_18__.buildActivityParams.before(function (next, params) {
      return next(Object.assign({
        gppConsent: _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__.gppDataHandler.getConsentData()
      }, params));
    });
  }
  addedConsentHook = true;
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__.gppDataHandler.enable();
  loadConsentData(); // immediately look up consent data to make it available without requiring an auction
}

_src_config_js__WEBPACK_IMPORTED_MODULE_19__.config.getConfig('consentManagement', function (config) {
  return setConsentConfig(config.consentManagement);
});
function enrichFPDHook(next, fpd) {
  return next(fpd.then(function (ortb2) {
    var consent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_14__.gppDataHandler.getConsentData();
    if (consent) {
      if (Array.isArray(consent.applicableSections)) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_20__.dset)(ortb2, 'regs.gpp_sid', consent.applicableSections);
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_20__.dset)(ortb2, 'regs.gpp', consent.gppString);
    }
    return ortb2;
  }));
}
_src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_21__.enrichFPD.before(enrichFPDHook);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_17__.registerModule)('consentManagementGpp');

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/get.js":
/*!********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/get.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _get; }
/* harmony export */ });
/* harmony import */ var _superPropBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./superPropBase.js */ "./node_modules/@babel/runtime/helpers/esm/superPropBase.js");

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = (0,_superPropBase_js__WEBPACK_IMPORTED_MODULE_0__["default"])(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/superPropBase.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/superPropBase.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _superPropBase; }
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object);
    if (object === null) break;
  }
  return object;
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["cmp","creative-renderer-display"], function() { return __webpack_exec__("./modules/consentManagementGpp.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=consentManagementGpp.js.map