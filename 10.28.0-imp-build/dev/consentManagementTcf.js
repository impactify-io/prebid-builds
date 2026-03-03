"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementTcf"],{

/***/ "./modules/consentManagementTcf.js":
/*!*****************************************!*\
  !*** ./modules/consentManagementTcf.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/**
 * This module adds GDPR consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GDPR supported adapters to read/pass this information to
 * their system.
 */









let consentConfig = {};
let gdprScope;
let dsaPlatform;
const CMP_VERSION = 2;

// add new CMPs here, with their dedicated lookup function
const cmpCallMap = {
  'iab': lookupIabConsent
};

// CMP event manager instance for TCF
let tcfCmpEventManager = null;

/**
 * @see https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
 * @see https://github.com/InteractiveAdvertisingBureau/iabtcf-es/tree/master/modules/core#iabtcfcore
 */

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
              var _tcfCmpEventManager;
              (_tcfCmpEventManager = tcfCmpEventManager) === null || _tcfCmpEventManager === void 0 || _tcfCmpEventManager.setCmpListenerId(tcfData.listenerId);
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
    throw Object.assign(new Error("CMP returned unexpected value during lookup process."), {
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
  var _tcfConfig$consentDat, _consentConfig$loadCo, _consentConfig, _consentConfig$loadCo2;
  // if `config.gdpr`, `config.usp` or `config.gpp` exist, assume new config format.
  // else for backward compatability, just use `config`
  const tcfConfig = config && (config.gdpr || config.usp || config.gpp ? config.gdpr : config);
  if ((tcfConfig === null || tcfConfig === void 0 || (_tcfConfig$consentDat = tcfConfig.consentData) === null || _tcfConfig$consentDat === void 0 ? void 0 : _tcfConfig$consentDat.getTCData) != null) {
    tcfConfig.consentData = tcfConfig.consentData.getTCData;
  }
  gdprScope = (tcfConfig === null || tcfConfig === void 0 ? void 0 : tcfConfig.defaultGdprScope) === true;
  dsaPlatform = !!(tcfConfig !== null && tcfConfig !== void 0 && tcfConfig.dsaPlatform);
  consentConfig = parseConfig({
    gdpr: tcfConfig
  });
  return (_consentConfig$loadCo = (_consentConfig = consentConfig).loadConsentData) === null || _consentConfig$loadCo === void 0 || (_consentConfig$loadCo = _consentConfig$loadCo.call(_consentConfig)) === null || _consentConfig$loadCo === void 0 || (_consentConfig$loadCo2 = _consentConfig$loadCo.catch) === null || _consentConfig$loadCo2 === void 0 ? void 0 : _consentConfig$loadCo2.call(_consentConfig$loadCo, () => null);
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
  var _bidderRequest$gdprCo;
  // this is not a standardized name for addtlConsent, so keep this as an ORTB library processor rather than an FPD enrichment
  const addtl = (_bidderRequest$gdprCo = bidderRequest.gdprConsent) === null || _bidderRequest$gdprCo === void 0 ? void 0 : _bidderRequest$gdprCo.addtlConsent;
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


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","cmp","consentManagement","viewport","dnt","creative-renderer-display"], () => (__webpack_exec__("./modules/consentManagementTcf.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=consentManagementTcf.js.map