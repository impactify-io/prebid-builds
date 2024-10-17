"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagementGpp"],{

/***/ "./modules/consentManagementGpp.js":
/*!*****************************************!*\
  !*** ./modules/consentManagementGpp.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports userCMP, consentTimeout, GPPClient, lookupIabConsent, requestBidsHook, storeConsentData, resetConsentData, setConsentConfig, enrichFPDHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/fpd/enrichment.js */ "./src/fpd/enrichment.js");
/* harmony import */ var _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libraries/cmp/cmpClient.js */ "./libraries/cmp/cmpClient.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libraries/consentManagement/cmUtils.js */ "./libraries/consentManagement/cmUtils.js");

/**
 * This module adds GPP consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GPP supported adapters to read/pass this information to
 * their system and for various other features/modules in Prebid.js.
 */









const DEFAULT_CMP = 'iab';
const DEFAULT_CONSENT_TIMEOUT = 10000;
let userCMP;
let consentTimeout;
let staticConsentData;
let consentData;
let addedConsentHook = false;
function pipeCallbacks(fn, _ref) {
  let {
    onSuccess,
    onError
  } = _ref;
  new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__.GreedyPromise(resolve => resolve(fn())).then(onSuccess, err => {
    if (err instanceof GPPError) {
      onError(err.message, ...err.args);
    } else {
      onError(`GPP error:`, err);
    }
  });
}
function lookupStaticConsentData(callbacks) {
  return pipeCallbacks(() => processCmpData(staticConsentData), callbacks);
}
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
    let mkCmp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_1__.cmpClient;
    if (this.INST == null) {
      const cmp = mkCmp({
        apiName: '__gpp',
        apiArgs: ['command', 'callback', 'parameter'],
        // do not pass version - not clear what it's for (or what we should use),
        mode: _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_1__.MODE_CALLBACK
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
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)(`Unrecognized GPP CMP version: ${pingData.apiVersion}. Continuing using GPP API version ${this.apiVersion}...`);
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
          if (consentData != null && event?.pingData != null && !this.isCMPReady(event.pingData)) {
            consentData = null;
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
    return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__.GreedyPromise(resolve => {
      if (pingData == null || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isEmpty)(pingData)) {
        throw new GPPError('Received empty response from CMP', pingData);
      }
      const consentData = processCmpData(pingData);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('Retrieved GPP consent from CMP:', consentData);
      resolve(consentData);
    });
  }

  /**
   * Return a promise to GPP consent data, to be retrieved the next time the CMP signals it's ready.
   *
   * @returns {Promise<{}>}
   */
  nextUpdate() {
    const def = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_0__.defer)();
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

/**
 * This function handles interacting with an IAB compliant CMP to obtain the consent information of the user.
 * Given the async nature of the CMP's API, we pass in acting success/error callback functions to exit this function
 * based on the appropriate result.
 * @param {Object} options - An object containing the callbacks.
 * @param {function(Object): void} options.onSuccess - Acts as a success callback when CMP returns a value; pass along consentObject from CMP.
 * @param {function(string, ...Object?): void} options.onError - Acts as an error callback while interacting with CMP; pass along an error message (string) and any extra error arguments (purely for logging).
 * @param {function(): Object} [mkCmp=cmpClient] - A function to create the CMP client. Defaults to `cmpClient`.
 */
function lookupIabConsent(_ref2) {
  let {
    onSuccess,
    onError
  } = _ref2;
  let mkCmp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _libraries_cmp_cmpClient_js__WEBPACK_IMPORTED_MODULE_1__.cmpClient;
  pipeCallbacks(() => GPPClient.get(mkCmp).refresh(), {
    onSuccess,
    onError
  });
}

// add new CMPs here, with their dedicated lookup function
const cmpCallMap = {
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
  let isDone = false;
  let timer = null;
  function done(consentData, shouldCancelAuction, errMsg) {
    if (timer != null) {
      clearTimeout(timer);
    }
    isDone = true;
    _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__.gppDataHandler.setConsentData(consentData);
    if (typeof cb === 'function') {
      for (var _len = arguments.length, extraArgs = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        extraArgs[_key - 3] = arguments[_key];
      }
      cb(shouldCancelAuction, errMsg, ...extraArgs);
    }
  }
  if (!cmpCallMap.hasOwnProperty(userCMP)) {
    done(null, false, `GPP CMP framework (${userCMP}) is not a supported framework.  Aborting consentManagement module and resuming auction.`);
    return;
  }
  const callbacks = {
    onSuccess: data => done(data, false),
    onError: function (msg) {
      for (var _len2 = arguments.length, extraArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        extraArgs[_key2 - 1] = arguments[_key2];
      }
      done(null, true, msg, ...extraArgs);
    }
  };
  cmpCallMap[userCMP](callbacks);
  if (!isDone) {
    const onTimeout = () => {
      const continueToAuction = data => {
        done(data, false, 'GPP CMP did not load, continuing auction...');
      };
      pipeCallbacks(() => processCmpData(consentData), {
        onSuccess: continueToAuction,
        onError: () => continueToAuction(storeConsentData())
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
 * If consentManagement module is enabled (ie included in setConfig), this hook function will attempt to fetch the
 * user's encoded consent string from the supported CMP.  Once obtained, the module will store this
 * data as part of a gppConsent object which gets transferred to adapterManager's gppDataHandler object.
 * This information is later added into the bidRequest object for any supported adapters to read/pass along to their system.
 * @param {object} reqBidsConfigObj required; This is the same param that's used in pbjs.requestBids.
 * @param {function} fn required; The next function in the chain, used by hook.js
 */
const requestBidsHook = (0,_libraries_consentManagement_cmUtils_js__WEBPACK_IMPORTED_MODULE_4__.consentManagementHook)('gpp', () => consentData, loadConsentData);
function processCmpData(consentData) {
  if (consentData?.applicableSections != null && !Array.isArray(consentData.applicableSections) || consentData?.gppString != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isStr)(consentData.gppString) || consentData?.parsedSections != null && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(consentData.parsedSections)) {
    throw new GPPError('CMP returned unexpected value during lookup process.', consentData);
  }
  ['usnatv1', 'uscav1'].forEach(section => {
    if (consentData?.parsedSections?.[section]) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)(`Received invalid section from cmp: '${section}'. Some functionality may not work as expected`, consentData);
    }
  });
  return storeConsentData(consentData);
}

/**
 * Stores CMP data locally in module to make information available in adaptermanager.js for later in the auction
 * @param {{}} gppData the result of calling a CMP's `getGPPData` (or equivalent)
 */
function storeConsentData() {
  let gppData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  consentData = {
    gppString: gppData?.gppString,
    applicableSections: gppData?.applicableSections || [],
    parsedSections: gppData?.parsedSections || {},
    gppData: gppData
  };
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__.gppDataHandler.setConsentData(gppData);
  return consentData;
}

/**
 * Simply resets the module's consentData variable back to undefined, mainly for testing purposes
 */
function resetConsentData() {
  consentData = undefined;
  userCMP = undefined;
  consentTimeout = undefined;
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__.gppDataHandler.reset();
  GPPClient.INST = null;
}

/**
 * A configuration function that initializes some module variables, as well as add a hook into the requestBids function
 * @param {{cmp:string, timeout:number, defaultGdprScope:boolean}} config required; consentManagement module config settings; cmp (string), timeout (int))
 */
function setConsentConfig(config) {
  config = config && config.gpp;
  if (!config || typeof config !== 'object') {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)('consentManagement.gpp config not defined, exiting consent manager module');
    return;
  }
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isStr)(config.cmpApi)) {
    userCMP = config.cmpApi;
  } else {
    userCMP = DEFAULT_CMP;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`consentManagement.gpp config did not specify cmp.  Using system default setting (${DEFAULT_CMP}).`);
  }
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNumber)(config.timeout)) {
    consentTimeout = config.timeout;
  } else {
    consentTimeout = DEFAULT_CONSENT_TIMEOUT;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`consentManagement.gpp config did not specify timeout.  Using system default setting (${DEFAULT_CONSENT_TIMEOUT}).`);
  }
  if (userCMP === 'static') {
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(config.consentData)) {
      staticConsentData = config.consentData;
      consentTimeout = 0;
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(`consentManagement.gpp config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.`);
    }
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('consentManagement.gpp module has been activated...');
  if (!addedConsentHook) {
    (0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__.getGlobal)().requestBids.before(requestBidsHook, 50);
    _src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.buildActivityParams.before((next, params) => {
      return next(Object.assign({
        gppConsent: _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__.gppDataHandler.getConsentData()
      }, params));
    });
  }
  addedConsentHook = true;
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__.gppDataHandler.enable();
  loadConsentData(); // immediately look up consent data to make it available without requiring an auction
}
_src_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('consentManagement', config => setConsentConfig(config.consentManagement));
function enrichFPDHook(next, fpd) {
  return next(fpd.then(ortb2 => {
    const consent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_3__.gppDataHandler.getConsentData();
    if (consent) {
      if (Array.isArray(consent.applicableSections)) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_8__.dset)(ortb2, 'regs.gpp_sid', consent.applicableSections);
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_8__.dset)(ortb2, 'regs.gpp', consent.gppString);
    }
    return ortb2;
  }));
}
_src_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_9__.enrichFPD.before(enrichFPDHook);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__.registerModule)('consentManagementGpp');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["cmp","consentManagement","chunk-core","creative-renderer-display"], () => (__webpack_exec__("./modules/consentManagementGpp.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=consentManagementGpp.js.map