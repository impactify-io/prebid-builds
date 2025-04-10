"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementGpp"],{

/***/ "./modules/consentManagementGpp.js":
/*!*****************************************!*\
  !*** ./modules/consentManagementGpp.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports consentConfig, GPPClient, toConsentData, resetConsentData, setConsentConfig, enrichFPDHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libraries/cmp/cmpClient.js */ "./libraries/cmp/cmpClient.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libraries/consentManagement/cmUtils.js */ "./libraries/consentManagement/cmUtils.js");

/**
 * This module adds GPP consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GPP supported adapters to read/pass this information to
 * their system and for various other features/modules in Prebid.js.
 */







let consentConfig = {};
class GPPError {
  constructor(message, arg) {
    this.message = message;
    this.args = arg == null ? [] : [arg];
  }
}
class GPPClient {
  apiVersion = '1.1';
  static INST;
  static get() {
    let mkCmp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_0__.cmpClient;
    if (this.INST == null) {
      const cmp = mkCmp({
        apiName: '__gpp',
        apiArgs: ['command', 'callback', 'parameter'],
        // do not pass version - not clear what it's for (or what we should use),
        mode: _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_0__.MODE_CALLBACK
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
          if (_src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.getConsentData() != null && event?.pingData != null && !this.isCMPReady(event.pingData)) {
            _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.setConsentData(null);
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
    return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise(resolve => {
      if (pingData == null || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(pingData)) {
        throw new GPPError('Received empty response from CMP', pingData);
      }
      const consentData = parseConsentData(pingData);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)('Retrieved GPP consent from CMP:', consentData);
      _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.setConsentData(consentData);
      resolve(consentData);
    });
  }

  /**
   * Return a promise to GPP consent data, to be retrieved the next time the CMP signals it's ready.
   *
   * @returns {Promise<{}>}
   */
  nextUpdate() {
    const def = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.defer)();
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
  return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise(resolve => resolve(GPPClient.get().refresh()));
}

// add new CMPs here, with their dedicated lookup function
const cmpCallMap = {
  'iab': lookupIabConsent
};
function parseConsentData(cmpData) {
  if (cmpData?.applicableSections != null && !Array.isArray(cmpData.applicableSections) || cmpData?.gppString != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(cmpData.gppString) || cmpData?.parsedSections != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(cmpData.parsedSections)) {
    throw new GPPError('CMP returned unexpected value during lookup process.', cmpData);
  }
  ['usnatv1', 'uscav1'].forEach(section => {
    if (cmpData?.parsedSections?.[section]) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`Received invalid section from cmp: '${section}'. Some functionality may not work as expected`, cmpData);
    }
  });
  return toConsentData(cmpData);
}
function toConsentData() {
  let gppData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.reset();
  GPPClient.INST = null;
}
const parseConfig = (0,_libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_4__.configParser)({
  namespace: 'gpp',
  displayName: 'GPP',
  consentDataHandler: _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler,
  parseConsentData,
  getNullConsent: () => toConsentData(null),
  cmpHandlers: cmpCallMap
});
function setConsentConfig(config) {
  consentConfig = parseConfig(config);
  return consentConfig.loadConsentData?.()?.catch?.(() => null);
}
_src_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('consentManagement', config => setConsentConfig(config.consentManagement));
function enrichFPDHook(next, fpd) {
  return next(fpd.then(ortb2 => {
    const consent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.getConsentData();
    if (consent) {
      if (Array.isArray(consent.applicableSections)) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.dset)(ortb2, 'regs.gpp_sid', consent.applicableSections);
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.dset)(ortb2, 'regs.gpp', consent.gppString);
    }
    return ortb2;
  }));
}
_src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_7__.enrichFPD.before(enrichFPDHook);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_8__.registerModule)('consentManagementGpp');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["consentManagement","cmp","chunk-core","viewport","greedy","creative-renderer-display"], () => (__webpack_exec__("./modules/consentManagementGpp.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=consentManagementGpp.js.map