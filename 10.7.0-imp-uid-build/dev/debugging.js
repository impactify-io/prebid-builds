"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["debugging"],{

/***/ "./modules/debugging/bidInterceptor.js":
/*!*********************************************!*\
  !*** ./modules/debugging/bidInterceptor.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BidInterceptor: () => (/* binding */ BidInterceptor)
/* harmony export */ });
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _responses_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./responses.js */ "./modules/debugging/responses.js");




/**
 * @typedef {Number|String|boolean|null|undefined} Scalar
 */

function BidInterceptor() {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  ({
    setTimeout: this.setTimeout = window.setTimeout.bind(window)
  } = opts);
  this.logger = opts.logger;
  this.rules = [];
}
Object.assign(BidInterceptor.prototype, {
  DEFAULT_RULE_OPTIONS: {
    delay: 0
  },
  serializeConfig(ruleDefs) {
    const isSerializable = (ruleDef, i) => {
      const serializable = !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasNonSerializableProperty)(ruleDef);
      if (!serializable && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ruleDef, 'options.suppressWarnings')) {
        this.logger.logWarn(`Bid interceptor rule definition #${i + 1} contains non-serializable properties and will be lost after a refresh. Rule definition: `, ruleDef);
      }
      return serializable;
    };
    return ruleDefs.filter(isSerializable);
  },
  updateConfig(config) {
    this.rules = (config.intercept || []).map((ruleDef, i) => this.rule(ruleDef, i + 1));
  },
  /**
   * @typedef {Object} RuleOptions
   * @property {Number} [delay=0] delay between bid interception and mocking of response (to simulate network delay)
   * @property {boolean} [suppressWarnings=false] if enabled, do not warn about unserializable rules
   *
   * @typedef {Object} Rule
   * @property {Number} no rule number (used only as an identifier for logging)
   * @property {function({}, {}): boolean} match a predicate function that tests a bid against this rule
   * @property {ReplacerFn} replacer generator function for mock bid responses
   * @property {RuleOptions} options
   */

  /**
   * @param {{}} ruleDef
   * @param {Number} ruleNo
   * @returns {Rule}
   */
  rule(ruleDef, ruleNo) {
    return {
      no: ruleNo,
      match: this.matcher(ruleDef.when, ruleNo),
      replace: this.replacer(ruleDef.then, ruleNo),
      options: Object.assign({}, this.DEFAULT_RULE_OPTIONS, ruleDef.options),
      paapi: this.paapiReplacer(ruleDef.paapi || [], ruleNo)
    };
  },
  /**
   * @typedef {Function} MatchPredicate
   * @param {*} candidate a bid to match, or a portion of it if used inside an ObjectMather.
   * e.g. matcher((bid, bidRequest) => ....) or matcher({property: (property, bidRequest) => ...})
   * @param {*} bidRequest the request `candidate` belongs to
   * @returns {boolean}
   *
   */

  /**
   * @param {*} matchDef matcher definition
   * @param {Number} ruleNo
   * @returns {MatchPredicate} a predicate function that matches a bid against the given `matchDef`
   */
  matcher(matchDef, ruleNo) {
    if (typeof matchDef === 'function') {
      return matchDef;
    }
    if (typeof matchDef !== 'object') {
      this.logger.logError(`Invalid 'when' definition for debug bid interceptor (in rule #${ruleNo})`);
      return () => false;
    }
    function matches(candidate, _ref) {
      let {
        ref = matchDef,
        args = []
      } = _ref;
      return Object.entries(ref).map(_ref2 => {
        let [key, val] = _ref2;
        const cVal = candidate[key];
        if (val instanceof RegExp) {
          return val.exec(cVal) != null;
        }
        if (typeof val === 'function') {
          return !!val(cVal, ...args);
        }
        if (typeof val === 'object') {
          return matches(cVal, {
            ref: val,
            args
          });
        }
        return cVal === val;
      }).every(i => i);
    }
    return function (candidate) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return matches(candidate, {
        args
      });
    };
  },
  /**
   * @typedef {Function} ReplacerFn
   * @param {*} bid a bid that was intercepted
   * @param {*} bidRequest the request `bid` belongs to
   * @returns {*} the response to mock for `bid`, or a portion of it if used inside an ObjectReplacer.
   * e.g. replacer((bid, bidRequest) => mockResponse) or replacer({property: (bid, bidRequest) => mockProperty})
   *
   */

  /**
   * @param {*} replDef replacer definition
   * @param ruleNo
   * @return {ReplacerFn}
   */
  replacer(replDef, ruleNo) {
    var _this = this;
    if (replDef === null) {
      return () => null;
    }
    replDef = replDef || {};
    let replFn;
    if (typeof replDef === 'function') {
      replFn = _ref3 => {
        let {
          args
        } = _ref3;
        return replDef(...args);
      };
    } else if (typeof replDef !== 'object') {
      this.logger.logError(`Invalid 'then' definition for debug bid interceptor (in rule #${ruleNo})`);
      replFn = () => ({});
    } else {
      replFn = _ref4 => {
        let {
          args,
          ref = replDef
        } = _ref4;
        const result = Array.isArray(ref) ? [] : {};
        Object.entries(ref).forEach(_ref5 => {
          let [key, val] = _ref5;
          if (typeof val === 'function') {
            result[key] = val(...args);
          } else if (val != null && typeof val === 'object') {
            result[key] = replFn({
              args,
              ref: val
            });
          } else {
            result[key] = val;
          }
        });
        return result;
      };
    }
    return function (bid) {
      const response = _this.responseDefaults(bid);
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(response, replFn({
        args: [bid, ...args]
      }));
      const resolver = _responses_js__WEBPACK_IMPORTED_MODULE_2__["default"][response.mediaType];
      resolver && resolver(bid, response);
      response.isDebug = true;
      return response;
    };
  },
  paapiReplacer(paapiDef, ruleNo) {
    function wrap() {
      let configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return configs.map(config => {
        return Object.keys(config).some(k => !['config', 'igb'].includes(k)) ? {
          config
        } : config;
      });
    }
    if (Array.isArray(paapiDef)) {
      return () => wrap(paapiDef);
    } else if (typeof paapiDef === 'function') {
      return function () {
        return wrap(paapiDef(...arguments));
      };
    } else {
      this.logger.logError(`Invalid 'paapi' definition for debug bid interceptor (in rule #${ruleNo})`);
    }
  },
  responseDefaults(bid) {
    const response = {
      requestId: bid.bidId,
      cpm: 3.5764,
      currency: 'EUR',
      ttl: 360,
      creativeId: 'mock-creative-id',
      netRevenue: false,
      meta: {}
    };
    if (!bid.mediaType) {
      response.mediaType = Object.keys(bid.mediaTypes ?? {})[0] ?? _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__.BANNER;
    }
    let size;
    if (response.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__.BANNER) {
      size = bid.mediaTypes?.banner?.sizes?.[0] ?? [300, 250];
    } else if (response.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__.VIDEO) {
      size = bid.mediaTypes?.video?.playerSize?.[0] ?? [600, 500];
    }
    if (Array.isArray(size)) {
      [response.width, response.height] = size;
    }
    return response;
  },
  /**
   * Match a candidate bid against all registered rules.
   *
   * @param {{}} candidate
   * @param args
   * @returns {Rule|undefined} the first matching rule, or undefined if no match was found.
   */
  match(candidate) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return this.rules.find(rule => rule.match(candidate, ...args));
  },
  /**
   * Match a set of bids against all registered rules.
   *
   * @param bids
   * @param bidRequest
   * @returns {[{bid: *, rule: Rule}[], *[]]} a 2-tuple for matching bids (decorated with the matching rule) and
   * non-matching bids.
   */
  matchAll(bids, bidRequest) {
    const [matches, remainder] = [[], []];
    bids.forEach(bid => {
      const rule = this.match(bid, bidRequest);
      if (rule != null) {
        matches.push({
          rule: rule,
          bid: bid
        });
      } else {
        remainder.push(bid);
      }
    });
    return [matches, remainder];
  },
  /**
   * Run a set of bids against all registered rules, filter out those that match,
   * and generate mock responses for them.
   *
   * {{}[]} bids?
   * {*} bidRequest
   * {function(*)} addBid called once for each mock response
   * addPaapiConfig called once for each mock PAAPI config
   * {function()} done called once after all mock responses have been run through `addBid`
   * returns {{bids: {}[], bidRequest: {}} remaining bids that did not match any rule (this applies also to
   * bidRequest.bids)
   */
  intercept(_ref6) {
    let {
      bids,
      bidRequest,
      addBid,
      addPaapiConfig,
      done
    } = _ref6;
    if (bids == null) {
      bids = bidRequest.bids;
    }
    const [matches, remainder] = this.matchAll(bids, bidRequest);
    if (matches.length > 0) {
      const callDone = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.delayExecution)(done, matches.length);
      matches.forEach(match => {
        const mockResponse = match.rule.replace(match.bid, bidRequest);
        const mockPaapi = match.rule.paapi(match.bid, bidRequest);
        const delay = match.rule.options.delay;
        this.logger.logMessage(`Intercepted bid request (matching rule #${match.rule.no}), mocking response in ${delay}ms. Request, response, PAAPI configs:`, match.bid, mockResponse, mockPaapi);
        this.setTimeout(() => {
          mockResponse && addBid(mockResponse, match.bid);
          mockPaapi.forEach(cfg => addPaapiConfig(cfg, match.bid, bidRequest));
          callDone();
        }, delay);
      });
      bidRequest = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(bidRequest);
      bids = bidRequest.bids = remainder;
    } else {
      this.setTimeout(done, 0);
    }
    return {
      bids,
      bidRequest
    };
  }
});


/***/ }),

/***/ "./modules/debugging/debugging.js":
/*!****************************************!*\
  !*** ./modules/debugging/debugging.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   install: () => (/* binding */ install)
/* harmony export */ });
/* unused harmony exports disableDebugging, getConfig, sessionLoader, bidderBidInterceptor */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bidInterceptor.js */ "./modules/debugging/bidInterceptor.js");
/* harmony import */ var _pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pbsInterceptor.js */ "./modules/debugging/pbsInterceptor.js");
/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./legacy.js */ "./modules/debugging/legacy.js");




const interceptorHooks = [];
let bidInterceptor;
let enabled = false;
function enableDebugging(debugConfig, _ref) {
  let {
    fromSession = false,
    config,
    hook,
    logger
  } = _ref;
  config.setConfig({
    debug: true
  });
  bidInterceptor.updateConfig(debugConfig);
  resetHooks(true);
  // also enable "legacy" overrides
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_0__.removeHooks)({
    hook
  });
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_0__.addHooks)(debugConfig, {
    hook,
    logger
  });
  if (!enabled) {
    enabled = true;
    logger.logMessage(`Debug overrides enabled${fromSession ? ' from session' : ''}`);
  }
}
function disableDebugging(_ref2) {
  let {
    hook,
    logger
  } = _ref2;
  bidInterceptor.updateConfig({});
  resetHooks(false);
  // also disable "legacy" overrides
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_0__.removeHooks)({
    hook
  });
  if (enabled) {
    enabled = false;
    logger.logMessage('Debug overrides disabled');
  }
}

// eslint-disable-next-line no-restricted-properties
function saveDebuggingConfig(debugConfig) {
  let {
    sessionStorage = window.sessionStorage,
    DEBUG_KEY
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!debugConfig.enabled) {
    try {
      sessionStorage.removeItem(DEBUG_KEY);
    } catch (e) {}
  } else {
    if (debugConfig.intercept) {
      debugConfig = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(debugConfig);
      debugConfig.intercept = bidInterceptor.serializeConfig(debugConfig.intercept);
    }
    try {
      sessionStorage.setItem(DEBUG_KEY, JSON.stringify(debugConfig));
    } catch (e) {}
  }
}

// eslint-disable-next-line no-restricted-properties
function getConfig(debugging) {
  let {
    getStorage = () => window.sessionStorage,
    DEBUG_KEY,
    config,
    hook,
    logger
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (debugging == null) return;
  let sessionStorage;
  try {
    sessionStorage = getStorage();
  } catch (e) {
    logger.logError(`sessionStorage is not available: debugging configuration will not persist on page reload`, e);
  }
  if (sessionStorage != null) {
    saveDebuggingConfig(debugging, {
      sessionStorage,
      DEBUG_KEY
    });
  }
  if (!debugging.enabled) {
    disableDebugging({
      hook,
      logger
    });
  } else {
    enableDebugging(debugging, {
      config,
      hook,
      logger
    });
  }
}
function sessionLoader(_ref3) {
  let {
    DEBUG_KEY,
    storage,
    config,
    hook,
    logger
  } = _ref3;
  let overrides;
  try {
    // eslint-disable-next-line no-restricted-properties
    storage = storage || window.sessionStorage;
    overrides = JSON.parse(storage.getItem(DEBUG_KEY));
  } catch (e) {}
  if (overrides) {
    enableDebugging(overrides, {
      fromSession: true,
      config,
      hook,
      logger
    });
  }
}
function resetHooks(enable) {
  interceptorHooks.forEach(_ref4 => {
    let [getHookFn, interceptor] = _ref4;
    getHookFn().getHooks({
      hook: interceptor
    }).remove();
  });
  if (enable) {
    interceptorHooks.forEach(_ref5 => {
      let [getHookFn, interceptor] = _ref5;
      getHookFn().before(interceptor);
    });
  }
}
function registerBidInterceptor(getHookFn, interceptor) {
  const interceptBids = function () {
    return bidInterceptor.intercept(...arguments);
  };
  interceptorHooks.push([getHookFn, function (next) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    interceptor(next, interceptBids, ...args);
  }]);
}
function bidderBidInterceptor(next, interceptBids, spec, bids, bidRequest, ajax, wrapCallback, cbs) {
  const done = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.delayExecution)(cbs.onCompletion, 2);
  ({
    bids,
    bidRequest
  } = interceptBids({
    bids,
    bidRequest,
    addBid: wrapCallback(cbs.onBid),
    addPaapiConfig: wrapCallback((config, bidRequest) => cbs.onPaapi({
      bidId: bidRequest.bidId,
      ...config
    })),
    done
  }));
  if (bids.length === 0) {
    cbs.onResponse?.({}); // trigger onResponse so that the bidder may be marked as "timely" if necessary
    done();
  } else {
    next(spec, bids, bidRequest, ajax, wrapCallback, {
      ...cbs,
      onCompletion: done
    });
  }
}
function install(_ref6) {
  let {
    DEBUG_KEY,
    config,
    hook,
    createBid,
    logger
  } = _ref6;
  bidInterceptor = new _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_3__.BidInterceptor({
    logger
  });
  const pbsBidInterceptor = (0,_pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_4__.makePbsInterceptor)({
    createBid
  });
  registerBidInterceptor(() => hook.get('processBidderRequests'), bidderBidInterceptor);
  registerBidInterceptor(() => hook.get('processPBSRequest'), pbsBidInterceptor);
  sessionLoader({
    DEBUG_KEY,
    config,
    hook,
    logger
  });
  config.getConfig('debugging', _ref7 => {
    let {
      debugging
    } = _ref7;
    return getConfig(debugging, {
      DEBUG_KEY,
      config,
      hook,
      logger
    });
  }, {
    init: true
  });
}


/***/ }),

/***/ "./modules/debugging/index.js":
/*!************************************!*\
  !*** ./modules/debugging/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/config.js */ "./src/config.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");
/* harmony import */ var _debugging_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debugging.js */ "./modules/debugging/debugging.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_bidfactory_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _src_debugging_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/debugging.js */ "./src/debugging.js");







(0,_debugging_js__WEBPACK_IMPORTED_MODULE_0__.install)({
  DEBUG_KEY: _src_debugging_js__WEBPACK_IMPORTED_MODULE_1__.DEBUG_KEY,
  config: _src_config_js__WEBPACK_IMPORTED_MODULE_2__.config,
  hook: _src_hook_js__WEBPACK_IMPORTED_MODULE_3__.hook,
  createBid: _src_bidfactory_js__WEBPACK_IMPORTED_MODULE_4__.createBid,
  logger: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.prefixLog)('DEBUG:')
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__.registerModule)('debugging');


/***/ }),

/***/ "./modules/debugging/legacy.js":
/*!*************************************!*\
  !*** ./modules/debugging/legacy.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addHooks: () => (/* binding */ addHooks),
/* harmony export */   removeHooks: () => (/* binding */ removeHooks)
/* harmony export */ });
/* unused harmony exports addBidResponseBound, addBidderRequestsBound, bidExcluded, bidderExcluded, applyBidOverrides, addBidResponseHook, addBidderRequestsHook */
let addBidResponseBound;
let addBidderRequestsBound;
function addHooks(overrides, _ref) {
  let {
    hook,
    logger
  } = _ref;
  addBidResponseBound = addBidResponseHook.bind({
    overrides,
    logger
  });
  hook.get('addBidResponse').before(addBidResponseBound, 5);
  addBidderRequestsBound = addBidderRequestsHook.bind({
    overrides,
    logger
  });
  hook.get('addBidderRequests').before(addBidderRequestsBound, 5);
}
function removeHooks(_ref2) {
  let {
    hook
  } = _ref2;
  hook.get('addBidResponse').getHooks({
    hook: addBidResponseBound
  }).remove();
  hook.get('addBidderRequests').getHooks({
    hook: addBidderRequestsBound
  }).remove();
}

/**
 * @param {{bidder:string, adUnitCode:string}} overrideObj
 * @param {string} bidderCode
 * @param {string} adUnitCode
 * @returns {boolean}
 */
function bidExcluded(overrideObj, bidderCode, adUnitCode) {
  if (overrideObj.bidder && overrideObj.bidder !== bidderCode) {
    return true;
  }
  if (overrideObj.adUnitCode && overrideObj.adUnitCode !== adUnitCode) {
    return true;
  }
  return false;
}

/**
 * @param {string[]} bidders
 * @param {string} bidderCode
 * @returns {boolean}
 */
function bidderExcluded(bidders, bidderCode) {
  return Array.isArray(bidders) && bidders.indexOf(bidderCode) === -1;
}

/**
 * @param {Object} overrideObj
 * @param {Object} bidObj
 * @param {Object} bidType
 * @returns {Object} bidObj with overridden properties
 */
function applyBidOverrides(overrideObj, bidObj, bidType, logger) {
  return Object.keys(overrideObj).filter(key => ['adUnitCode', 'bidder'].indexOf(key) === -1).reduce(function (result, key) {
    logger.logMessage(`bidder overrides changed '${result.adUnitCode}/${result.bidderCode}' ${bidType}.${key} from '${result[key]}.js' to '${overrideObj[key]}'`);
    result[key] = overrideObj[key];
    result.isDebug = true;
    return result;
  }, bidObj);
}
function addBidResponseHook(next, adUnitCode, bid, reject) {
  const {
    overrides,
    logger
  } = this;
  if (bidderExcluded(overrides.bidders, bid.bidderCode)) {
    logger.logWarn(`bidder '${bid.bidderCode}' excluded from auction by bidder overrides`);
    return;
  }
  if (Array.isArray(overrides.bids)) {
    overrides.bids.forEach(function (overrideBid) {
      if (!bidExcluded(overrideBid, bid.bidderCode, adUnitCode)) {
        applyBidOverrides(overrideBid, bid, 'bidder', logger);
      }
    });
  }
  next(adUnitCode, bid, reject);
}
function addBidderRequestsHook(next, bidderRequests) {
  const {
    overrides,
    logger
  } = this;
  const includedBidderRequests = bidderRequests.filter(function (bidderRequest) {
    if (bidderExcluded(overrides.bidders, bidderRequest.bidderCode)) {
      logger.logWarn(`bidRequest '${bidderRequest.bidderCode}' excluded from auction by bidder overrides`);
      return false;
    }
    return true;
  });
  if (Array.isArray(overrides.bidRequests)) {
    includedBidderRequests.forEach(function (bidderRequest) {
      overrides.bidRequests.forEach(function (overrideBid) {
        bidderRequest.bids.forEach(function (bid) {
          if (!bidExcluded(overrideBid, bidderRequest.bidderCode, bid.adUnitCode)) {
            applyBidOverrides(overrideBid, bid, 'bidRequest', logger);
          }
        });
      });
    });
  }
  next(includedBidderRequests);
}


/***/ }),

/***/ "./modules/debugging/pbsInterceptor.js":
/*!*********************************************!*\
  !*** ./modules/debugging/pbsInterceptor.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makePbsInterceptor: () => (/* binding */ makePbsInterceptor)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");

function makePbsInterceptor(_ref) {
  let {
    createBid
  } = _ref;
  return function pbsBidInterceptor(next, interceptBids, s2sBidRequest, bidRequests, ajax, _ref2) {
    let {
      onResponse,
      onError,
      onBid,
      onFledge
    } = _ref2;
    let responseArgs;
    const done = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.delayExecution)(() => onResponse(...responseArgs), bidRequests.length + 1);
    function signalResponse() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      responseArgs = args;
      done();
    }
    function addBid(bid, bidRequest) {
      onBid({
        adUnit: bidRequest.adUnitCode,
        bid: Object.assign(createBid(bidRequest), {
          requestBidder: bidRequest.bidder
        }, bid)
      });
    }
    bidRequests = bidRequests.map(req => interceptBids({
      bidRequest: req,
      addBid,
      addPaapiConfig(config, bidRequest, bidderRequest) {
        onFledge({
          adUnitCode: bidRequest.adUnitCode,
          ortb2: bidderRequest.ortb2,
          ortb2Imp: bidRequest.ortb2Imp,
          ...config
        });
      },
      done
    }).bidRequest).filter(req => req.bids.length > 0);
    if (bidRequests.length > 0) {
      const bidIds = new Set();
      bidRequests.forEach(req => req.bids.forEach(bid => bidIds.add(bid.bidId)));
      s2sBidRequest = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(s2sBidRequest);
      s2sBidRequest.ad_units.forEach(unit => {
        unit.bids = unit.bids.filter(bid => bidIds.has(bid.bid_id));
      });
      s2sBidRequest.ad_units = s2sBidRequest.ad_units.filter(unit => unit.bids.length > 0);
      next(s2sBidRequest, bidRequests, ajax, {
        onResponse: signalResponse,
        onError,
        onBid
      });
    } else {
      signalResponse(true, []);
    }
  };
}


/***/ }),

/***/ "./modules/debugging/responses.js":
/*!****************************************!*\
  !*** ./modules/debugging/responses.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _src_Renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../libraries/gptUtils/gptUtils.js */ "./libraries/gptUtils/gptUtils.js");



const ORTB_NATIVE_ASSET_TYPES = ['img', 'video', 'link', 'data', 'title'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  [_src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.BANNER]: (bid, bidResponse) => {
    if (!bidResponse.hasOwnProperty('ad') && !bidResponse.hasOwnProperty('adUrl')) {
      let [size, repeat] = (bidResponse.width ?? bidResponse.wratio) < (bidResponse.height ?? bidResponse.hratio) ? [bidResponse.width, 'repeat-y'] : [bidResponse.height, 'repeat-x'];
      size = size == null ? '100%' : `${size}px`;
      bidResponse.ad = `<html><body><div style="display: inline-block; height: ${bidResponse.height == null ? '100%' : bidResponse.height + 'px'}; width: ${bidResponse.width == null ? '100%' : bidResponse.width + 'px'}; background-image: url(https://vcdn.adnxs.com/p/creative-image/27/c0/52/67/27c05267-5a6d-4874-834e-18e218493c32.png); background-size: ${size}; background-repeat: ${repeat}"></div></body></html>`;
    }
  },
  [_src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.VIDEO]: (bid, bidResponse) => {
    if (!bidResponse.hasOwnProperty('vastXml') && !bidResponse.hasOwnProperty('vastUrl')) {
      bidResponse.vastXml = '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"><Ad><InLine><AdSystem>GDFP</AdSystem><AdTitle>Demo</AdTitle><Description><![CDATA[Demo]]></Description><Creatives><Creative><Linear ><Duration>00:00:11</Duration><VideoClicks><ClickThrough><![CDATA[https://prebid.org/]]></ClickThrough></VideoClicks><MediaFiles><MediaFile delivery="progressive" width="640" height="360" type="video/mp4" scalable="true" maintainAspectRatio="true"><![CDATA[https://s3.amazonaws.com/files.prebid.org/creatives/PrebidLogo.mp4]]></MediaFile></MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>';
      bidResponse.renderer = _src_Renderer_js__WEBPACK_IMPORTED_MODULE_1__.Renderer.install({
        url: 'https://cdn.jwplayer.com/libraries/l5MchIxB.js'
      });
      bidResponse.renderer.setRender(function (bid, doc) {
        const parentId = (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_2__.getGptSlotInfoForAdUnitCode)(bid.adUnitCode).divId ?? bid.adUnitCode;
        const div = doc.createElement('div');
        div.id = `${parentId}-video-player`;
        doc.getElementById(parentId).appendChild(div);
        const player = window.jwplayer(div.id).setup({
          debug: true,
          width: bidResponse.width,
          height: bidResponse.height,
          advertising: {
            client: 'vast',
            outstream: true,
            endstate: 'close'
          }
        });
        player.on('ready', async function () {
          if (bid.vastUrl) {
            player.loadAdTag(bid.vastUrl);
          } else {
            player.loadAdXml(bid.vastXml);
          }
        });
      });
    }
  },
  [_src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.NATIVE]: (bid, bidResponse) => {
    if (!bidResponse.hasOwnProperty('native')) {
      bidResponse.native = {
        ortb: {
          link: {
            url: 'https://www.link.example',
            clicktrackers: ['https://impression.example']
          },
          assets: bid.nativeOrtbRequest.assets.map(mapDefaultNativeOrtbAsset)
        }
      };
    }
  }
});
function mapDefaultNativeOrtbAsset(asset) {
  const assetType = ORTB_NATIVE_ASSET_TYPES.find(type => asset.hasOwnProperty(type));
  switch (assetType) {
    case 'img':
      return {
        ...asset,
        img: {
          type: 3,
          w: 600,
          h: 500,
          url: 'https://vcdn.adnxs.com/p/creative-image/27/c0/52/67/27c05267-5a6d-4874-834e-18e218493c32.png'
        }
      };
    case 'video':
      return {
        ...asset,
        video: {
          vasttag: '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"><Ad><InLine><AdSystem>GDFP</AdSystem><AdTitle>Demo</AdTitle><Description><![CDATA[Demo]]></Description><Creatives><Creative><Linear ><Duration>00:00:11</Duration><VideoClicks><ClickThrough><![CDATA[https://prebid.org/]]></ClickThrough></VideoClicks><MediaFiles><MediaFile delivery="progressive" width="640" height="360" type="video/mp4" scalable="true" maintainAspectRatio="true"><![CDATA[https://s3.amazonaws.com/files.prebid.org/creatives/PrebidLogo.mp4]]></MediaFile></MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>'
        }
      };
    case 'data':
      {
        return {
          ...asset,
          data: {
            value: '5 stars'
          }
        };
      }
    case 'title':
      {
        return {
          ...asset,
          title: {
            text: 'Prebid Native Example'
          }
        };
      }
  }
}


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["gptUtils","chunk-core","viewport","creative-renderer-display"], () => (__webpack_exec__("./modules/debugging/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=debugging.js.map