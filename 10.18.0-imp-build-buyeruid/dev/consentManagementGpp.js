"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementGpp"],{

/***/ "./modules/consentManagementGpp.js":
/*!*****************************************!*\
  !*** ./modules/consentManagementGpp.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports consentConfig, GPPClient, toConsentData, resetConsentData, removeCmpListener, setConsentConfig, enrichFPDHook */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libraries/cmp/cmpClient.js */ "./libraries/cmp/cmpClient.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libraries/consentManagement/cmUtils.js */ "./libraries/consentManagement/cmUtils.js");
/* harmony import */ var _libraries_cmp_cmpEventUtils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../libraries/cmp/cmpEventUtils.js */ "./libraries/cmp/cmpEventUtils.js");

function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _toSetter(t, e, n) { e || (e = []); var r = e.length++; return Object.defineProperty({}, "_", { set: function (o) { e[r] = o, t.apply(n, e); } }); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

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
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "message", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "args", void 0);
    this.message = message;
    this.args = arg == null ? [] : [arg];
  }
}
var _resolve = /*#__PURE__*/new WeakMap();
var _reject = /*#__PURE__*/new WeakMap();
var _pending = /*#__PURE__*/new WeakMap();
class GPPClient {
  static get() {
    let mkCmp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_8__.cmpClient;
    if (this.INST == null) {
      const cmp = mkCmp({
        apiName: '__gpp',
        apiArgs: ['command', 'callback', 'parameter'],
        // do not pass version - not clear what it's for (or what we should use),
        mode: _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_8__.MODE_CALLBACK
      });
      if (cmp == null) {
        throw new GPPError('GPP CMP not found');
      }
      this.INST = new this(cmp);
    }
    return this.INST;
  }
  constructor(cmp) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "apiVersion", '1.1');
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "cmp", void 0);
    _classPrivateFieldInitSpec(this, _resolve, void 0);
    _classPrivateFieldInitSpec(this, _reject, void 0);
    _classPrivateFieldInitSpec(this, _pending, []);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "initialized", false);
    this.cmp = cmp;
    [_toSetter(_classPrivateFieldSet, [_resolve, this])._, _toSetter(_classPrivateFieldSet, [_reject, this])._] = ['resolve', 'reject'].map(slot => result => {
      while (_classPrivateFieldGet(_pending, this).length) {
        _classPrivateFieldGet(_pending, this).pop()[slot](result);
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
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("Unrecognized GPP CMP version: ".concat(pingData.apiVersion, ". Continuing using GPP API version ").concat(this.apiVersion, "..."));
      }
      this.initialized = true;

      // Initialize CMP event manager and set CMP API
      if (!gppCmpEventManager) {
        gppCmpEventManager = (0,_libraries_cmp_cmpEventUtils_js__WEBPACK_IMPORTED_MODULE_11__.createCmpEventManager)('gpp');
      }
      gppCmpEventManager.setCmpApi(this.cmp);
      this.cmp({
        command: 'addEventListener',
        callback: (event, success) => {
          var _event$pingData;
          if (success != null && !success) {
            _classPrivateFieldGet(_reject, this).call(this, new GPPError('Received error response from CMP', event));
          } else if ((event === null || event === void 0 || (_event$pingData = event.pingData) === null || _event$pingData === void 0 ? void 0 : _event$pingData.cmpStatus) === 'error') {
            _classPrivateFieldGet(_reject, this).call(this, new GPPError('CMP status is "error"; please check CMP setup', event));
          } else if (this.isCMPReady((event === null || event === void 0 ? void 0 : event.pingData) || {}) && ['sectionChange', 'signalStatus'].includes(event === null || event === void 0 ? void 0 : event.eventName)) {
            _classPrivateFieldGet(_resolve, this).call(this, this.updateConsent(event.pingData));
          }
          // NOTE: according to https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md,
          // > [signalStatus] Event is called whenever the display status of the CMP changes (e.g. the CMP shows the consent layer).
          //
          // however, from real world testing, at least some CMPs only trigger 'cmpDisplayStatus'
          // other CMPs may do something else yet; here we just look for 'signalStatus: not ready' on any event
          // to decide if consent data is likely to change
          if (_src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__.gppDataHandler.getConsentData() != null && (event === null || event === void 0 ? void 0 : event.pingData) != null && !this.isCMPReady(event.pingData)) {
            _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__.gppDataHandler.setConsentData(null);
          }
          if ((event === null || event === void 0 ? void 0 : event.listenerId) !== null && (event === null || event === void 0 ? void 0 : event.listenerId) !== undefined) {
            var _gppCmpEventManager;
            (_gppCmpEventManager = gppCmpEventManager) === null || _gppCmpEventManager === void 0 || _gppCmpEventManager.setCmpListenerId(event === null || event === void 0 ? void 0 : event.listenerId);
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
    return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_9__.PbPromise(resolve => {
      if (pingData == null || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isEmpty)(pingData)) {
        throw new GPPError('Received empty response from CMP', pingData);
      }
      const consentData = parseConsentData(pingData);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('Retrieved GPP consent from CMP:', consentData);
      _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__.gppDataHandler.setConsentData(consentData);
      resolve(consentData);
    });
  }

  /**
   * Return a promise to GPP consent data, to be retrieved the next time the CMP signals it's ready.
   *
   * @returns {Promise<{}>}
   */
  nextUpdate() {
    const def = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_9__.defer)();
    _classPrivateFieldGet(_pending, this).push(def);
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
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(GPPClient, "INST", void 0);
function lookupIabConsent() {
  return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_9__.PbPromise(resolve => resolve(GPPClient.get().refresh()));
}

// add new CMPs here, with their dedicated lookup function
const cmpCallMap = {
  'iab': lookupIabConsent
};
function parseConsentData(cmpData) {
  if ((cmpData === null || cmpData === void 0 ? void 0 : cmpData.applicableSections) != null && !Array.isArray(cmpData.applicableSections) || (cmpData === null || cmpData === void 0 ? void 0 : cmpData.gppString) != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isStr)(cmpData.gppString) || (cmpData === null || cmpData === void 0 ? void 0 : cmpData.parsedSections) != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(cmpData.parsedSections)) {
    throw new GPPError('CMP returned unexpected value during lookup process.', cmpData);
  }
  ['usnatv1', 'uscav1'].forEach(section => {
    var _cmpData$parsedSectio;
    if (cmpData !== null && cmpData !== void 0 && (_cmpData$parsedSectio = cmpData.parsedSections) !== null && _cmpData$parsedSectio !== void 0 && _cmpData$parsedSectio[section]) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("Received invalid section from cmp: '".concat(section, "'. Some functionality may not work as expected"), cmpData);
    }
  });
  return toConsentData(cmpData);
}
function toConsentData() {
  let gppData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    gppString: gppData === null || gppData === void 0 ? void 0 : gppData.gppString,
    applicableSections: (gppData === null || gppData === void 0 ? void 0 : gppData.applicableSections) || [],
    parsedSections: (gppData === null || gppData === void 0 ? void 0 : gppData.parsedSections) || {},
    gppData: gppData
  };
}

/**
 * Simply resets the module's consentData variable back to undefined, mainly for testing purposes
 */
function resetConsentData() {
  consentConfig = {};
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__.gppDataHandler.reset();
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
const parseConfig = (0,_libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_10__.configParser)({
  namespace: 'gpp',
  displayName: 'GPP',
  consentDataHandler: _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__.gppDataHandler,
  parseConsentData,
  getNullConsent: () => toConsentData(null),
  cmpHandlers: cmpCallMap,
  cmpEventCleanup: removeCmpListener
});
function setConsentConfig(config) {
  var _consentConfig$loadCo, _consentConfig, _consentConfig$loadCo2;
  consentConfig = parseConfig(config);
  return (_consentConfig$loadCo = (_consentConfig = consentConfig).loadConsentData) === null || _consentConfig$loadCo === void 0 || (_consentConfig$loadCo = _consentConfig$loadCo.call(_consentConfig)) === null || _consentConfig$loadCo === void 0 || (_consentConfig$loadCo2 = _consentConfig$loadCo.catch) === null || _consentConfig$loadCo2 === void 0 ? void 0 : _consentConfig$loadCo2.call(_consentConfig$loadCo, () => null);
}
_src_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('consentManagement', config => setConsentConfig(config.consentManagement));
function enrichFPDHook(next, fpd) {
  return next(fpd.then(ortb2 => {
    const consent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_6__.gppDataHandler.getConsentData();
    if (consent) {
      if (Array.isArray(consent.applicableSections)) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(ortb2, 'regs.gpp_sid', consent.applicableSections);
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(ortb2, 'regs.gpp', consent.gppString);
    }
    return ortb2;
  }));
}
_src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_7__.enrichFPD.before(enrichFPDHook);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.registerModule)('consentManagementGpp');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["cmp","consentManagement","chunk-core","viewport","dnt","creative-renderer-display"], () => (__webpack_exec__("./modules/consentManagementGpp.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=consentManagementGpp.js.map