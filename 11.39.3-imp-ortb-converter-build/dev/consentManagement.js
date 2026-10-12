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
//# sourceMappingURL=consentManagement.js.map