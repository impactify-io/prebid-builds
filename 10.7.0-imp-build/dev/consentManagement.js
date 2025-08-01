"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagement"],{

/***/ "./libraries/consentManagement/cmUtils.js":
/*!************************************************!*\
  !*** ./libraries/consentManagement/cmUtils.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configParser: () => (/* binding */ configParser)
/* harmony export */ });
/* unused harmony exports consentManagementHook, lookupConsentData */
/* harmony import */ var _src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");





function consentManagementHook(name, loadConsentData) {
  const SEEN = new WeakSet();
  return (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_0__.timedAuctionHook)(name, function requestBidsHook(fn, reqBidsConfigObj) {
    return loadConsentData().then(_ref => {
      let {
        consentData,
        error
      } = _ref;
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
function lookupConsentData(_ref2) {
  let {
    name,
    consentDataHandler,
    setupCmp,
    cmpTimeout,
    actionTimeout,
    getNullConsent
  } = _ref2;
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
    consentDataHandler.setConsentData(null);
    throw e;
  });
}
function configParser() {
  let {
    namespace,
    displayName,
    consentDataHandler,
    parseConsentData,
    getNullConsent,
    cmpHandlers,
    DEFAULT_CMP = 'iab',
    DEFAULT_CONSENT_TIMEOUT = 10000
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
    return cdLoader().then(_ref3 => {
      let {
        error
      } = _ref3;
      return {
        error,
        consentData: consentDataHandler.getConsentData()
      };
    });
  }
  function activate() {
    if (requestBidsHook == null) {
      requestBidsHook = consentManagementHook(namespace, () => cdLoader());
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_2__.getHook)('requestBids').before(requestBidsHook, 50);
      _src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.buildActivityParams.before(attachActivityParams);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(`${displayName} consentManagement module has been activated...`);
    }
  }
  function reset() {
    if (requestBidsHook != null) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_2__.getHook)('requestBids').getHooks({
        hook: requestBidsHook
      }).remove();
      _src_activities_params_js__WEBPACK_IMPORTED_MODULE_3__.buildActivityParams.getHooks({
        hook: attachActivityParams
      }).remove();
      requestBidsHook = null;
    }
  }
  return function getConsentConfig(config) {
    const cmConfig = config?.[namespace];
    if (!cmConfig || typeof cmConfig !== 'object') {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(msg(`config not defined, exiting consent manager module`));
      reset();
      return {};
    }
    let cmpHandler;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isStr)(cmConfig.cmpApi)) {
      cmpHandler = cmConfig.cmpApi;
    } else {
      cmpHandler = DEFAULT_CMP;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(msg(`config did not specify cmp.  Using system default setting (${DEFAULT_CMP}).`));
    }
    let cmpTimeout;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(cmConfig.timeout)) {
      cmpTimeout = cmConfig.timeout;
    } else {
      cmpTimeout = DEFAULT_CONSENT_TIMEOUT;
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)(msg(`config did not specify timeout.  Using system default setting (${DEFAULT_CONSENT_TIMEOUT}).`));
    }
    const actionTimeout = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(cmConfig.actionTimeout) ? cmConfig.actionTimeout : null;
    let setupCmp;
    if (cmpHandler === 'static') {
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(cmConfig.consentData)) {
        staticConsentData = cmConfig.consentData;
        cmpTimeout = null;
        setupCmp = () => new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_5__.PbPromise(resolve => resolve(consentDataHandler.setConsentData(parseConsentData(staticConsentData))));
      } else {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(msg(`config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.`));
      }
    } else if (!cmpHandlers.hasOwnProperty(cmpHandler)) {
      consentDataHandler.setConsentData(null);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)(`${displayName} CMP framework (${cmpHandler}) is not a supported framework.  Aborting consentManagement module and resuming auction.`);
      setupCmp = () => _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_5__.PbPromise.resolve();
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


/***/ })

}]);
//# sourceMappingURL=consentManagement.js.map