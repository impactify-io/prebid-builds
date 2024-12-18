/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/debugging/bidInterceptor.js":
/*!*********************************************!*\
  !*** ./modules/debugging/bidInterceptor.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BidInterceptor: () => (/* binding */ BidInterceptor)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./node_modules/dlv/index.js");


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
   * @param {BidRequest} bidRequest the request `candidate` belongs to
   * @returns {boolean}
   *
   * @typedef {{[key]: Scalar|RegExp|MatchPredicate|ObjectMatcher}} ObjectMatcher
   */

  /**
   * @param {MatchPredicate|ObjectMatcher} matchDef matcher definition
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
   * @param {BidRequest} bidRequest the request `bid` belongs to
   * @returns {*} the response to mock for `bid`, or a portion of it if used inside an ObjectReplacer.
   * e.g. replacer((bid, bidRequest) => mockResponse) or replacer({property: (bid, bidRequest) => mockProperty})
   *
   * @typedef {{[key]: ReplacerFn|ObjectReplacer|*}} ObjectReplacer
   */

  /**
   * @param {ReplacerFn|ObjectReplacer} replDef replacer definition
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
      if (!response.hasOwnProperty('ad') && !response.hasOwnProperty('adUrl')) {
        response.ad = _this.defaultAd(bid, response);
      }
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
    return {
      requestId: bid.bidId,
      cpm: 3.5764,
      currency: 'EUR',
      width: 300,
      height: 250,
      ttl: 360,
      creativeId: 'mock-creative-id',
      netRevenue: false,
      meta: {}
    };
  },
  defaultAd(bid, bidResponse) {
    return `<html><head><style>#ad {width: ${bidResponse.width}px;height: ${bidResponse.height}px;background-color: #f6f6ae;color: #85144b;padding: 5px;text-align: center;display: flex;flex-direction: column;align-items: center;justify-content: center;}#bidder {font-family: monospace;font-weight: normal;}#title {font-size: x-large;font-weight: bold;margin-bottom: 5px;}#body {font-size: large;margin-top: 5px;}</style></head><body><div id="ad"><div id="title">Mock ad: <span id="bidder">${bid.bidder}</span></div><div id="body">${bidResponse.width}x${bidResponse.height}</div></div></body></html>`;
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
   * @param {{}[]} bids?
   * @param {BidRequest} bidRequest
   * @param {function(*)} addBid called once for each mock response
   * @param addPaapiConfig called once for each mock PAAPI config
   * @param {function()} done called once after all mock responses have been run through `addBid`
   * @returns {{bids: {}[], bidRequest: {}} remaining bids that did not match any rule (this applies also to
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
      bidRequest = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepClone)(bidRequest);
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bidderBidInterceptor: () => (/* binding */ bidderBidInterceptor),
/* harmony export */   disableDebugging: () => (/* binding */ disableDebugging),
/* harmony export */   getConfig: () => (/* binding */ getConfig),
/* harmony export */   install: () => (/* binding */ install),
/* harmony export */   sessionLoader: () => (/* binding */ sessionLoader)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bidInterceptor.js */ "./modules/debugging/bidInterceptor.js");
/* harmony import */ var _pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pbsInterceptor.js */ "./modules/debugging/pbsInterceptor.js");
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

// eslint-disable-next-line prebid/no-global
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

// eslint-disable-next-line prebid/no-global
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
    // eslint-disable-next-line prebid/no-global
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
  const done = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.delayExecution)(cbs.onCompletion, 2);
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
    // eslint-disable-next-line no-unused-expressions
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
  bidInterceptor = new _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_2__.BidInterceptor({
    logger
  });
  const pbsBidInterceptor = (0,_pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_3__.makePbsInterceptor)({
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

/***/ "./modules/debugging/legacy.js":
/*!*************************************!*\
  !*** ./modules/debugging/legacy.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBidResponseBound: () => (/* binding */ addBidResponseBound),
/* harmony export */   addBidResponseHook: () => (/* binding */ addBidResponseHook),
/* harmony export */   addBidderRequestsBound: () => (/* binding */ addBidderRequestsBound),
/* harmony export */   addBidderRequestsHook: () => (/* binding */ addBidderRequestsHook),
/* harmony export */   addHooks: () => (/* binding */ addHooks),
/* harmony export */   applyBidOverrides: () => (/* binding */ applyBidOverrides),
/* harmony export */   bidExcluded: () => (/* binding */ bidExcluded),
/* harmony export */   bidderExcluded: () => (/* binding */ bidderExcluded),
/* harmony export */   removeHooks: () => (/* binding */ removeHooks)
/* harmony export */ });
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makePbsInterceptor: () => (/* binding */ makePbsInterceptor)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/constants.js */ "./src/constants.js");


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
        bid: Object.assign(createBid(_src_constants_js__WEBPACK_IMPORTED_MODULE_1__.STATUS.GOOD, bidRequest), bid)
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
      s2sBidRequest = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepClone)(s2sBidRequest);
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

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RANDOM: () => (/* binding */ RANDOM),
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   newConfig: () => (/* binding */ newConfig)
/* harmony export */ });
/* harmony import */ var _cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cpmBucketManager.js */ "./src/cpmBucketManager.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/*
 * Module for getting and setting Prebid configuration.
*/

/**
 * @typedef {Object} MediaTypePriceGranularity
 *
 * @property {(string|Object)} [banner]
 * @property {(string|Object)} [native]
 * @property {(string|Object)} [video]
 * @property {(string|Object)} [video-instream]
 * @property {(string|Object)} [video-outstream]
 */





const DEFAULT_DEBUG = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getParameterByName)(_constants_js__WEBPACK_IMPORTED_MODULE_1__.DEBUG_MODE).toUpperCase() === 'TRUE';
const DEFAULT_BIDDER_TIMEOUT = 3000;
const DEFAULT_ENABLE_SEND_ALL_BIDS = true;
const DEFAULT_DISABLE_AJAX_TIMEOUT = false;
const DEFAULT_BID_CACHE = false;
const DEFAULT_DEVICE_ACCESS = true;
const DEFAULT_MAX_NESTED_IFRAMES = 10;
const DEFAULT_MAXBID_VALUE = 5000;
const DEFAULT_IFRAMES_CONFIG = {};
const RANDOM = 'random';
const FIXED = 'fixed';
const VALID_ORDERS = {};
VALID_ORDERS[RANDOM] = true;
VALID_ORDERS[FIXED] = true;
const DEFAULT_BIDDER_SEQUENCE = RANDOM;
const GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};
const ALL_TOPICS = '*';
function attachProperties(config) {
  let useDefaultValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const values = useDefaultValues ? {
    priceGranularity: GRANULARITY_OPTIONS.MEDIUM,
    customPriceBucket: {},
    mediaTypePriceGranularity: {},
    bidderSequence: DEFAULT_BIDDER_SEQUENCE,
    auctionOptions: {}
  } : {};
  function getProp(name) {
    return values[name];
  }
  function setProp(name, val) {
    if (!values.hasOwnProperty(name)) {
      Object.defineProperty(config, name, {
        enumerable: true
      });
    }
    values[name] = val;
  }
  const props = {
    publisherDomain: {
      set(val) {
        if (val != null) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('publisherDomain is deprecated and has no effect since v7 - use pageUrl instead');
        }
        setProp('publisherDomain', val);
      }
    },
    priceGranularity: {
      set(val) {
        if (validatePriceGranularity(val)) {
          if (typeof val === 'string') {
            setProp('priceGranularity', hasGranularity(val) ? val : GRANULARITY_OPTIONS.MEDIUM);
          } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(val)) {
            setProp('customPriceBucket', val);
            setProp('priceGranularity', GRANULARITY_OPTIONS.CUSTOM);
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)('Using custom price granularity');
          }
        }
      }
    },
    customPriceBucket: {},
    mediaTypePriceGranularity: {
      set(val) {
        val != null && setProp('mediaTypePriceGranularity', Object.keys(val).reduce((aggregate, item) => {
          if (validatePriceGranularity(val[item])) {
            if (typeof val === 'string') {
              aggregate[item] = hasGranularity(val[item]) ? val[item] : getProp('priceGranularity');
            } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(val)) {
              aggregate[item] = val[item];
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)(`Using custom price granularity for ${item}`);
            }
          } else {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Invalid price granularity for media type: ${item}`);
          }
          return aggregate;
        }, {}));
      }
    },
    bidderSequence: {
      set(val) {
        if (VALID_ORDERS[val]) {
          setProp('bidderSequence', val);
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Invalid order: ${val}. Bidder Sequence was not set.`);
        }
      }
    },
    auctionOptions: {
      set(val) {
        if (validateauctionOptions(val)) {
          setProp('auctionOptions', val);
        }
      }
    }
  };
  Object.defineProperties(config, Object.fromEntries(Object.entries(props).map(_ref => {
    let [k, def] = _ref;
    return [k, Object.assign({
      get: getProp.bind(null, k),
      set: setProp.bind(null, k),
      enumerable: values.hasOwnProperty(k),
      configurable: !values.hasOwnProperty(k)
    }, def)];
  })));
  return config;
  function hasGranularity(val) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.find)(Object.keys(GRANULARITY_OPTIONS), option => val === GRANULARITY_OPTIONS[option]);
  }
  function validatePriceGranularity(val) {
    if (!val) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Prebid Error: no value passed to `setPriceGranularity()`');
      return false;
    }
    if (typeof val === 'string') {
      if (!hasGranularity(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.');
      }
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(val)) {
      if (!(0,_cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_3__.isValidPriceConfig)(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Invalid custom price value passed to `setPriceGranularity()`');
        return false;
      }
    }
    return true;
  }
  function validateauctionOptions(val) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(val)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('Auction Options must be an object');
      return false;
    }
    for (let k of Object.keys(val)) {
      if (k !== 'secondaryBidders' && k !== 'suppressStaleRender' && k !== 'suppressExpiredRender') {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Auction Options given an incorrect param: ${k}`);
        return false;
      }
      if (k === 'secondaryBidders') {
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isArray)(val[k])) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Auction Options ${k} must be of type Array`);
          return false;
        } else if (!val[k].every(_utils_js__WEBPACK_IMPORTED_MODULE_0__.isStr)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Auction Options ${k} must be only string`);
          return false;
        }
      } else if (k === 'suppressStaleRender' || k === 'suppressExpiredRender') {
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBoolean)(val[k])) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Auction Options ${k} must be of type boolean`);
          return false;
        }
      }
    }
    return true;
  }
}
function newConfig() {
  let listeners = [];
  let defaults;
  let config;
  let bidderConfig;
  let currBidder = null;
  function resetConfig() {
    defaults = {};
    let newConfig = attachProperties({
      // `debug` is equivalent to legacy `pbjs.logging` property
      debug: DEFAULT_DEBUG,
      bidderTimeout: DEFAULT_BIDDER_TIMEOUT,
      enableSendAllBids: DEFAULT_ENABLE_SEND_ALL_BIDS,
      useBidCache: DEFAULT_BID_CACHE,
      /**
       * deviceAccess set to false will disable setCookie, getCookie, hasLocalStorage
       * @type {boolean}
       */
      deviceAccess: DEFAULT_DEVICE_ACCESS,
      disableAjaxTimeout: DEFAULT_DISABLE_AJAX_TIMEOUT,
      // default max nested iframes for referer detection
      maxNestedIframes: DEFAULT_MAX_NESTED_IFRAMES,
      // default max bid
      maxBid: DEFAULT_MAXBID_VALUE,
      userSync: {
        topics: DEFAULT_IFRAMES_CONFIG
      }
    });
    if (config) {
      callSubscribers(Object.keys(config).reduce((memo, topic) => {
        if (config[topic] !== newConfig[topic]) {
          memo[topic] = newConfig[topic] || {};
        }
        return memo;
      }, {}));
    }
    config = newConfig;
    bidderConfig = {};
  }

  /**
   * Returns base config with bidder overrides (if there is currently a bidder)
   * @private
   */
  function _getConfig() {
    if (currBidder && bidderConfig && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(bidderConfig[currBidder])) {
      let currBidderConfig = bidderConfig[currBidder];
      const configTopicSet = new Set(Object.keys(config).concat(Object.keys(currBidderConfig)));
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.arrayFrom)(configTopicSet).reduce((memo, topic) => {
        if (typeof currBidderConfig[topic] === 'undefined') {
          memo[topic] = config[topic];
        } else if (typeof config[topic] === 'undefined') {
          memo[topic] = currBidderConfig[topic];
        } else {
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(currBidderConfig[topic])) {
            memo[topic] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({}, config[topic], currBidderConfig[topic]);
          } else {
            memo[topic] = currBidderConfig[topic];
          }
        }
        return memo;
      }, {});
    }
    return Object.assign({}, config);
  }
  function _getRestrictedConfig() {
    // This causes reading 'ortb2' to throw an error; with prebid 7, that will almost
    // always be the incorrect way to access FPD configuration (https://github.com/prebid/Prebid.js/issues/7651)
    // code that needs the ortb2 config should explicitly use `getAnyConfig`
    // TODO: this is meant as a temporary tripwire to catch inadvertent use of `getConfig('ortb')` as we transition.
    // It should be removed once the risk of that happening is low enough.
    const conf = _getConfig();
    Object.defineProperty(conf, 'ortb2', {
      get: function () {
        throw new Error('invalid access to \'orbt2\' config - use request parameters instead');
      }
    });
    return conf;
  }
  const [getAnyConfig, getConfig] = [_getConfig, _getRestrictedConfig].map(accessor => {
    /*
     * Returns configuration object if called without parameters,
     * or single configuration property if given a string matching a configuration
     * property name.  Allows deep access e.g. getConfig('currency.adServerCurrency')
     *
     * If called with callback parameter, or a string and a callback parameter,
     * subscribes to configuration updates. See `subscribe` function for usage.
     */
    return function getConfig() {
      if (arguments.length <= 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'function') {
        const option = arguments.length <= 0 ? undefined : arguments[0];
        return option ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(accessor(), option) : _getConfig();
      }
      return subscribe(...arguments);
    };
  });
  const [readConfig, readAnyConfig] = [getConfig, getAnyConfig].map(wrapee => {
    /*
     * Like getConfig, except that it returns a deepClone of the result.
     */
    return function readConfig() {
      let res = wrapee(...arguments);
      if (res && typeof res === 'object') {
        res = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepClone)(res);
      }
      return res;
    };
  });

  /**
   * Internal API for modules (such as prebid-server) that might need access to all bidder config
   */
  function getBidderConfig() {
    return bidderConfig;
  }

  /*
   * Sets configuration given an object containing key-value pairs and calls
   * listeners that were added by the `subscribe` function
   */
  function setConfig(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(options)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('setConfig options must be an object');
      return;
    }
    let topics = Object.keys(options);
    let topicalConfig = {};
    topics.forEach(topic => {
      let option = options[topic];
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(defaults[topic]) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(option)) {
        option = Object.assign({}, defaults[topic], option);
      }
      try {
        topicalConfig[topic] = config[topic] = option;
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)(`Cannot set config for property ${topic} : `, e);
      }
    });
    callSubscribers(topicalConfig);
  }

  /**
   * Sets configuration defaults which setConfig values can be applied on top of
   * @param {object} options
   */
  function setDefaults(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(defaults)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('defaults must be an object');
      return;
    }
    Object.assign(defaults, options);
    // Add default values to config as well
    Object.assign(config, options);
  }

  /*
   * Adds a function to a set of listeners that are invoked whenever `setConfig`
   * is called. The subscribed function will be passed the options object that
   * was used in the `setConfig` call. Topics can be subscribed to to only get
   * updates when specific properties are updated by passing a topic string as
   * the first parameter.
   *
   * If `options.init` is true, the listener will be immediately called with the current options.
   *
   * Returns an `unsubscribe` function for removing the subscriber from the
   * set of listeners
   *
   * Example use:
   * // subscribe to all configuration changes
   * subscribe((config) => console.log('config set:', config));
   *
   * // subscribe to only 'logging' changes
   * subscribe('logging', (config) => console.log('logging set:', config));
   *
   * // unsubscribe
   * const unsubscribe = subscribe(...);
   * unsubscribe(); // no longer listening
   *
   */
  function subscribe(topic, listener) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let callback = listener;
    if (typeof topic !== 'string') {
      // first param should be callback function in this case,
      // meaning it gets called for any config change
      callback = topic;
      topic = ALL_TOPICS;
      options = listener || {};
    }
    if (typeof callback !== 'function') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('listener must be a function');
      return;
    }
    const nl = {
      topic,
      callback
    };
    listeners.push(nl);
    if (options.init) {
      if (topic === ALL_TOPICS) {
        callback(getConfig());
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        callback({
          [topic]: getConfig(topic)
        });
      }
    }

    // save and call this function to remove the listener
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(nl), 1);
    };
  }

  /*
   * Calls listeners that were added by the `subscribe` function
   */
  function callSubscribers(options) {
    const TOPICS = Object.keys(options);

    // call subscribers of a specific topic, passing only that configuration
    listeners.filter(listener => (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.includes)(TOPICS, listener.topic)).forEach(listener => {
      listener.callback({
        [listener.topic]: options[listener.topic]
      });
    });

    // call subscribers that didn't give a topic, passing everything that was set
    listeners.filter(listener => listener.topic === ALL_TOPICS).forEach(listener => listener.callback(options));
  }
  function setBidderConfig(config) {
    let mergeFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    try {
      check(config);
      config.bidders.forEach(bidder => {
        if (!bidderConfig[bidder]) {
          bidderConfig[bidder] = attachProperties({}, false);
        }
        Object.keys(config.config).forEach(topic => {
          let option = config.config[topic];
          const currentConfig = bidderConfig[bidder][topic];
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(option) && (currentConfig == null || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(currentConfig))) {
            const func = mergeFlag ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep : Object.assign;
            bidderConfig[bidder][topic] = func({}, currentConfig || {}, option);
          } else {
            bidderConfig[bidder][topic] = option;
          }
        });
      });
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(e);
    }
    function check(obj) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj)) {
        throw 'setBidderConfig bidder options must be an object';
      }
      if (!(Array.isArray(obj.bidders) && obj.bidders.length)) {
        throw 'setBidderConfig bidder options must contain a bidders list with at least 1 bidder';
      }
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj.config)) {
        throw 'setBidderConfig bidder options must contain a config object';
      }
    }
  }
  function mergeConfig(obj) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('mergeConfig input must be an object');
      return;
    }
    const mergedConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(_getConfig(), obj);
    setConfig({
      ...mergedConfig
    });
    return mergedConfig;
  }
  function mergeBidderConfig(obj) {
    return setBidderConfig(obj, true);
  }

  /**
   * Internal functions for core to execute some synchronous code while having an active bidder set.
   */
  function runWithBidder(bidder, fn) {
    currBidder = bidder;
    try {
      return fn();
    } finally {
      resetBidder();
    }
  }
  function callbackWithBidder(bidder) {
    return function (cb) {
      return function () {
        if (typeof cb === 'function') {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return runWithBidder(bidder, cb.bind(this, ...args));
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('config.callbackWithBidder callback is not a function');
        }
      };
    };
  }
  function getCurrentBidder() {
    return currBidder;
  }
  function resetBidder() {
    currBidder = null;
  }
  resetConfig();
  return {
    getCurrentBidder,
    resetBidder,
    getConfig,
    getAnyConfig,
    readConfig,
    readAnyConfig,
    setConfig,
    mergeConfig,
    setDefaults,
    resetConfig,
    runWithBidder,
    callbackWithBidder,
    setBidderConfig,
    getBidderConfig,
    mergeBidderConfig
  };
}

/**
 * Set a `cache.url` if we should use prebid-cache to store video bids before adding bids to the auction.
 * This must be set if you want to use the dfpAdServerVideo module.
 */
const config = newConfig();

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AD_RENDER_FAILED_REASON: () => (/* binding */ AD_RENDER_FAILED_REASON),
/* harmony export */   BID_STATUS: () => (/* binding */ BID_STATUS),
/* harmony export */   DEBUG_MODE: () => (/* binding */ DEBUG_MODE),
/* harmony export */   DEFAULT_TARGETING_KEYS: () => (/* binding */ DEFAULT_TARGETING_KEYS),
/* harmony export */   EVENTS: () => (/* binding */ EVENTS),
/* harmony export */   EVENT_ID_PATHS: () => (/* binding */ EVENT_ID_PATHS),
/* harmony export */   GRANULARITY_OPTIONS: () => (/* binding */ GRANULARITY_OPTIONS),
/* harmony export */   JSON_MAPPING: () => (/* binding */ JSON_MAPPING),
/* harmony export */   MESSAGES: () => (/* binding */ MESSAGES),
/* harmony export */   NATIVE_ASSET_TYPES: () => (/* binding */ NATIVE_ASSET_TYPES),
/* harmony export */   NATIVE_IMAGE_TYPES: () => (/* binding */ NATIVE_IMAGE_TYPES),
/* harmony export */   NATIVE_KEYS: () => (/* binding */ NATIVE_KEYS),
/* harmony export */   NATIVE_KEYS_THAT_ARE_NOT_ASSETS: () => (/* binding */ NATIVE_KEYS_THAT_ARE_NOT_ASSETS),
/* harmony export */   PB_LOCATOR: () => (/* binding */ PB_LOCATOR),
/* harmony export */   PREBID_NATIVE_DATA_KEYS_TO_ORTB: () => (/* binding */ PREBID_NATIVE_DATA_KEYS_TO_ORTB),
/* harmony export */   REJECTION_REASON: () => (/* binding */ REJECTION_REASON),
/* harmony export */   S2S: () => (/* binding */ S2S),
/* harmony export */   STATUS: () => (/* binding */ STATUS),
/* harmony export */   TARGETING_KEYS: () => (/* binding */ TARGETING_KEYS)
/* harmony export */ });
const JSON_MAPPING = {
  PL_CODE: 'code',
  PL_SIZE: 'sizes',
  PL_BIDS: 'bids',
  BD_BIDDER: 'bidder',
  BD_ID: 'paramsd',
  BD_PL_ID: 'placementId',
  ADSERVER_TARGETING: 'adserverTargeting',
  BD_SETTING_STANDARD: 'standard'
};
const DEBUG_MODE = 'pbjs_debug';
const STATUS = {
  GOOD: 1
};
const EVENTS = {
  AUCTION_INIT: 'auctionInit',
  AUCTION_TIMEOUT: 'auctionTimeout',
  AUCTION_END: 'auctionEnd',
  BID_ADJUSTMENT: 'bidAdjustment',
  BID_TIMEOUT: 'bidTimeout',
  BID_REQUESTED: 'bidRequested',
  BID_RESPONSE: 'bidResponse',
  BID_REJECTED: 'bidRejected',
  NO_BID: 'noBid',
  SEAT_NON_BID: 'seatNonBid',
  BID_WON: 'bidWon',
  BIDDER_DONE: 'bidderDone',
  BIDDER_ERROR: 'bidderError',
  SET_TARGETING: 'setTargeting',
  BEFORE_REQUEST_BIDS: 'beforeRequestBids',
  BEFORE_BIDDER_HTTP: 'beforeBidderHttp',
  REQUEST_BIDS: 'requestBids',
  ADD_AD_UNITS: 'addAdUnits',
  AD_RENDER_FAILED: 'adRenderFailed',
  AD_RENDER_SUCCEEDED: 'adRenderSucceeded',
  TCF2_ENFORCEMENT: 'tcf2Enforcement',
  AUCTION_DEBUG: 'auctionDebug',
  BID_VIEWABLE: 'bidViewable',
  STALE_RENDER: 'staleRender',
  EXPIRED_RENDER: 'expiredRender',
  BILLABLE_EVENT: 'billableEvent',
  BID_ACCEPTED: 'bidAccepted',
  RUN_PAAPI_AUCTION: 'paapiRunAuction',
  PBS_ANALYTICS: 'pbsAnalytics',
  PAAPI_BID: 'paapiBid',
  PAAPI_NO_BID: 'paapiNoBid',
  PAAPI_ERROR: 'paapiError'
};
const AD_RENDER_FAILED_REASON = {
  PREVENT_WRITING_ON_MAIN_DOCUMENT: 'preventWritingOnMainDocument',
  NO_AD: 'noAd',
  EXCEPTION: 'exception',
  CANNOT_FIND_AD: 'cannotFindAd',
  MISSING_DOC_OR_ADID: 'missingDocOrAdid'
};
const EVENT_ID_PATHS = {
  bidWon: 'adUnitCode'
};
const GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};
const TARGETING_KEYS = {
  BIDDER: 'hb_bidder',
  AD_ID: 'hb_adid',
  PRICE_BUCKET: 'hb_pb',
  SIZE: 'hb_size',
  DEAL: 'hb_deal',
  SOURCE: 'hb_source',
  FORMAT: 'hb_format',
  UUID: 'hb_uuid',
  CACHE_ID: 'hb_cache_id',
  CACHE_HOST: 'hb_cache_host',
  ADOMAIN: 'hb_adomain',
  ACAT: 'hb_acat',
  CRID: 'hb_crid',
  DSP: 'hb_dsp'
};
const DEFAULT_TARGETING_KEYS = {
  BIDDER: 'hb_bidder',
  AD_ID: 'hb_adid',
  PRICE_BUCKET: 'hb_pb',
  SIZE: 'hb_size',
  DEAL: 'hb_deal',
  FORMAT: 'hb_format',
  UUID: 'hb_uuid',
  CACHE_HOST: 'hb_cache_host'
};
const NATIVE_KEYS = {
  title: 'hb_native_title',
  body: 'hb_native_body',
  body2: 'hb_native_body2',
  privacyLink: 'hb_native_privacy',
  privacyIcon: 'hb_native_privicon',
  sponsoredBy: 'hb_native_brand',
  image: 'hb_native_image',
  icon: 'hb_native_icon',
  clickUrl: 'hb_native_linkurl',
  displayUrl: 'hb_native_displayurl',
  cta: 'hb_native_cta',
  rating: 'hb_native_rating',
  address: 'hb_native_address',
  downloads: 'hb_native_downloads',
  likes: 'hb_native_likes',
  phone: 'hb_native_phone',
  price: 'hb_native_price',
  salePrice: 'hb_native_saleprice',
  rendererUrl: 'hb_renderer_url',
  adTemplate: 'hb_adTemplate'
};
const S2S = {
  SRC: 's2s',
  DEFAULT_ENDPOINT: 'https://prebid.adnxs.com/pbs/v1/openrtb2/auction',
  SYNCED_BIDDERS_KEY: 'pbjsSyncs'
};
const BID_STATUS = {
  BID_TARGETING_SET: 'targetingSet',
  RENDERED: 'rendered',
  BID_REJECTED: 'bidRejected'
};
const REJECTION_REASON = {
  INVALID: 'Bid has missing or invalid properties',
  INVALID_REQUEST_ID: 'Invalid request ID',
  BIDDER_DISALLOWED: 'Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes',
  FLOOR_NOT_MET: 'Bid does not meet price floor',
  CANNOT_CONVERT_CURRENCY: 'Unable to convert currency',
  DSA_REQUIRED: 'Bid does not provide required DSA transparency info',
  DSA_MISMATCH: 'Bid indicates inappropriate DSA rendering method',
  PRICE_TOO_HIGH: 'Bid price exceeds maximum value'
};
const PREBID_NATIVE_DATA_KEYS_TO_ORTB = {
  body: 'desc',
  body2: 'desc2',
  sponsoredBy: 'sponsored',
  cta: 'ctatext',
  rating: 'rating',
  address: 'address',
  downloads: 'downloads',
  likes: 'likes',
  phone: 'phone',
  price: 'price',
  salePrice: 'saleprice',
  displayUrl: 'displayurl'
};
const NATIVE_ASSET_TYPES = {
  sponsored: 1,
  desc: 2,
  rating: 3,
  likes: 4,
  downloads: 5,
  price: 6,
  saleprice: 7,
  phone: 8,
  address: 9,
  desc2: 10,
  displayurl: 11,
  ctatext: 12
};
const NATIVE_IMAGE_TYPES = {
  ICON: 1,
  MAIN: 3
};
const NATIVE_KEYS_THAT_ARE_NOT_ASSETS = ['privacyIcon', 'clickUrl', 'sendTargetingKeys', 'adTemplate', 'rendererUrl', 'type'];
const MESSAGES = {
  REQUEST: 'Prebid Request',
  RESPONSE: 'Prebid Response',
  NATIVE: 'Prebid Native',
  EVENT: 'Prebid Event'
};
const PB_LOCATOR = '__pb_locator__';

/***/ }),

/***/ "./src/cpmBucketManager.js":
/*!*********************************!*\
  !*** ./src/cpmBucketManager.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPriceBucketString: () => (/* binding */ getPriceBucketString),
/* harmony export */   isValidPriceConfig: () => (/* binding */ isValidPriceConfig)
/* harmony export */ });
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");



const _defaultPrecision = 2;
const _lgPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.5
  }]
};
const _mgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.1
  }]
};
const _hgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.01
  }]
};
const _densePriceConfig = {
  'buckets': [{
    'max': 3,
    'increment': 0.01
  }, {
    'max': 8,
    'increment': 0.05
  }, {
    'max': 20,
    'increment': 0.5
  }]
};
const _autoPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.05
  }, {
    'max': 10,
    'increment': 0.1
  }, {
    'max': 20,
    'increment': 0.5
  }]
};
function getPriceBucketString(cpm, customConfig) {
  let granularityMultiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  let cpmFloat = parseFloat(cpm);
  if (isNaN(cpmFloat)) {
    cpmFloat = '';
  }
  return {
    low: cpmFloat === '' ? '' : getCpmStringValue(cpm, _lgPriceConfig, granularityMultiplier),
    med: cpmFloat === '' ? '' : getCpmStringValue(cpm, _mgPriceConfig, granularityMultiplier),
    high: cpmFloat === '' ? '' : getCpmStringValue(cpm, _hgPriceConfig, granularityMultiplier),
    auto: cpmFloat === '' ? '' : getCpmStringValue(cpm, _autoPriceConfig, granularityMultiplier),
    dense: cpmFloat === '' ? '' : getCpmStringValue(cpm, _densePriceConfig, granularityMultiplier),
    custom: cpmFloat === '' ? '' : getCpmStringValue(cpm, customConfig, granularityMultiplier)
  };
}
function getCpmStringValue(cpm, config, granularityMultiplier) {
  let cpmStr = '';
  if (!isValidPriceConfig(config)) {
    return cpmStr;
  }
  const cap = config.buckets.reduce((prev, curr) => {
    if (prev.max > curr.max) {
      return prev;
    }
    return curr;
  }, {
    'max': 0
  });
  let bucketFloor = 0;
  let bucket = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_0__.find)(config.buckets, bucket => {
    if (cpm > cap.max * granularityMultiplier) {
      // cpm exceeds cap, just return the cap.
      let precision = bucket.precision;
      if (typeof precision === 'undefined') {
        precision = _defaultPrecision;
      }
      cpmStr = (bucket.max * granularityMultiplier).toFixed(precision);
    } else if (cpm <= bucket.max * granularityMultiplier && cpm >= bucketFloor * granularityMultiplier) {
      bucket.min = bucketFloor;
      return bucket;
    } else {
      bucketFloor = bucket.max;
    }
  });
  if (bucket) {
    cpmStr = getCpmTarget(cpm, bucket, granularityMultiplier);
  }
  return cpmStr;
}
function isValidPriceConfig(config) {
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(config) || !config.buckets || !Array.isArray(config.buckets)) {
    return false;
  }
  let isValid = true;
  config.buckets.forEach(bucket => {
    if (!bucket.max || !bucket.increment) {
      isValid = false;
    }
  });
  return isValid;
}
function getCpmTarget(cpm, bucket, granularityMultiplier) {
  const precision = typeof bucket.precision !== 'undefined' ? bucket.precision : _defaultPrecision;
  const increment = bucket.increment * granularityMultiplier;
  const bucketMin = bucket.min * granularityMultiplier;
  let roundingFunction = Math.floor;
  let customRoundingFunction = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('cpmRoundingFunction');
  if (typeof customRoundingFunction === 'function') {
    roundingFunction = customRoundingFunction;
  }

  // start increments at the bucket min and then add bucket min back to arrive at the correct rounding
  // note - we're padding the values to avoid using decimals in the math prior to flooring
  // this is done as JS can return values slightly below the expected mark which would skew the price bucket target
  //   (eg 4.01 / 0.01 = 400.99999999999994)
  // min precison should be 2 to move decimal place over.
  let pow = Math.pow(10, precision + 2);
  let cpmToRound = (cpm * pow - bucketMin * pow) / (increment * pow);
  let cpmTarget;
  let invalidRounding;
  // It is likely that we will be passed {cpmRoundingFunction: roundingFunction()}
  // rather than the expected {cpmRoundingFunction: roundingFunction}. Default back to floor in that case
  try {
    cpmTarget = roundingFunction(cpmToRound) * increment + bucketMin;
  } catch (err) {
    invalidRounding = true;
  }
  if (invalidRounding || typeof cpmTarget !== 'number') {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Invalid rounding function passed in config');
    cpmTarget = Math.floor(cpmToRound) * increment + bucketMin;
  }
  // force to 10 decimal places to deal with imprecise decimal/binary conversions
  //    (for example 0.1 * 3 = 0.30000000000000004)

  cpmTarget = Number(cpmTarget.toFixed(10));
  return cpmTarget.toFixed(precision);
}


/***/ }),

/***/ "./src/polyfill.js":
/*!*************************!*\
  !*** ./src/polyfill.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayFrom: () => (/* binding */ arrayFrom),
/* harmony export */   find: () => (/* binding */ find),
/* harmony export */   findIndex: () => (/* binding */ findIndex),
/* harmony export */   includes: () => (/* binding */ includes)
/* harmony export */ });
// These stubs are here to help transition away from core-js polyfills for browsers we are no longer supporting.
// You should not need these for new code; use stock JS instead!

function includes(target, elem, start) {
  return target && target.includes(elem, start) || false;
}
function arrayFrom() {
  return Array.from.apply(Array, arguments);
}
function find(arr, pred, thisArg) {
  return arr && arr.find(pred, thisArg);
}
function findIndex(arr, pred, thisArg) {
  return arr && arr.findIndex(pred, thisArg);
}

/***/ }),

/***/ "./src/prebidGlobal.js":
/*!*****************************!*\
  !*** ./src/prebidGlobal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobal: () => (/* binding */ getGlobal),
/* harmony export */   registerModule: () => (/* binding */ registerModule)
/* harmony export */ });
// if $$PREBID_GLOBAL$$ already exists in global document scope, use it, if not, create the object
// global defination should happen BEFORE imports to avoid global undefined errors.
/* global $$DEFINE_PREBID_GLOBAL$$ */
const scope =  false ? 0 : window;
const global = scope.pbjs = scope.pbjs || {};
global.cmd = global.cmd || [];
global.que = global.que || [];

// create a pbjs global pointer
if (scope === window) {
  scope._pbjsGlobals = scope._pbjsGlobals || [];
  scope._pbjsGlobals.push("pbjs");
}
function getGlobal() {
  return global;
}
function registerModule(name) {
  global.installedModules.push(name);
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _each: () => (/* binding */ _each),
/* harmony export */   _map: () => (/* binding */ _map),
/* harmony export */   _setEventEmitter: () => (/* binding */ _setEventEmitter),
/* harmony export */   binarySearch: () => (/* binding */ binarySearch),
/* harmony export */   buildUrl: () => (/* binding */ buildUrl),
/* harmony export */   canAccessWindowTop: () => (/* binding */ canAccessWindowTop),
/* harmony export */   checkCookieSupport: () => (/* binding */ checkCookieSupport),
/* harmony export */   cleanObj: () => (/* binding */ cleanObj),
/* harmony export */   compareCodeAndSlot: () => (/* binding */ compareCodeAndSlot),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   convertObjectToArray: () => (/* binding */ convertObjectToArray),
/* harmony export */   createIframe: () => (/* binding */ createIframe),
/* harmony export */   createInvisibleIframe: () => (/* binding */ createInvisibleIframe),
/* harmony export */   createTrackPixelHtml: () => (/* binding */ createTrackPixelHtml),
/* harmony export */   createTrackPixelIframeHtml: () => (/* binding */ createTrackPixelIframeHtml),
/* harmony export */   cyrb53Hash: () => (/* binding */ cyrb53Hash),
/* harmony export */   debugTurnedOn: () => (/* binding */ debugTurnedOn),
/* harmony export */   deepAccess: () => (/* reexport safe */ dlv_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   deepClone: () => (/* binding */ deepClone),
/* harmony export */   deepEqual: () => (/* binding */ deepEqual),
/* harmony export */   deepSetValue: () => (/* reexport safe */ dset__WEBPACK_IMPORTED_MODULE_2__.dset),
/* harmony export */   delayExecution: () => (/* binding */ delayExecution),
/* harmony export */   encodeMacroURI: () => (/* binding */ encodeMacroURI),
/* harmony export */   extractDomainFromHost: () => (/* binding */ extractDomainFromHost),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   formatQS: () => (/* binding */ formatQS),
/* harmony export */   generateUUID: () => (/* binding */ generateUUID),
/* harmony export */   getBidIdParameter: () => (/* binding */ getBidIdParameter),
/* harmony export */   getBidRequest: () => (/* binding */ getBidRequest),
/* harmony export */   getBidderCodes: () => (/* binding */ getBidderCodes),
/* harmony export */   getDNT: () => (/* binding */ getDNT),
/* harmony export */   getDefinedParams: () => (/* binding */ getDefinedParams),
/* harmony export */   getDomLoadingDuration: () => (/* binding */ getDomLoadingDuration),
/* harmony export */   getParameterByName: () => (/* binding */ getParameterByName),
/* harmony export */   getPerformanceNow: () => (/* binding */ getPerformanceNow),
/* harmony export */   getPrebidInternal: () => (/* binding */ getPrebidInternal),
/* harmony export */   getSafeframeGeometry: () => (/* binding */ getSafeframeGeometry),
/* harmony export */   getUniqueIdentifierStr: () => (/* binding */ getUniqueIdentifierStr),
/* harmony export */   getUnixTimestampFromNow: () => (/* binding */ getUnixTimestampFromNow),
/* harmony export */   getUserConfiguredParams: () => (/* binding */ getUserConfiguredParams),
/* harmony export */   getValue: () => (/* binding */ getValue),
/* harmony export */   getWindowLocation: () => (/* binding */ getWindowLocation),
/* harmony export */   getWindowSelf: () => (/* binding */ getWindowSelf),
/* harmony export */   getWindowTop: () => (/* binding */ getWindowTop),
/* harmony export */   groupBy: () => (/* binding */ groupBy),
/* harmony export */   hasConsoleLogger: () => (/* binding */ hasConsoleLogger),
/* harmony export */   hasDeviceAccess: () => (/* binding */ hasDeviceAccess),
/* harmony export */   hasNonSerializableProperty: () => (/* binding */ hasNonSerializableProperty),
/* harmony export */   inIframe: () => (/* binding */ inIframe),
/* harmony export */   insertElement: () => (/* binding */ insertElement),
/* harmony export */   insertHtmlIntoIframe: () => (/* binding */ insertHtmlIntoIframe),
/* harmony export */   insertUserSyncIframe: () => (/* binding */ insertUserSyncIframe),
/* harmony export */   internal: () => (/* binding */ internal),
/* harmony export */   isA: () => (/* binding */ isA),
/* harmony export */   isAdUnitCodeMatchingSlot: () => (/* binding */ isAdUnitCodeMatchingSlot),
/* harmony export */   isApnGetTagDefined: () => (/* binding */ isApnGetTagDefined),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isArrayOfNums: () => (/* binding */ isArrayOfNums),
/* harmony export */   isBoolean: () => (/* binding */ isBoolean),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   isEmptyStr: () => (/* binding */ isEmptyStr),
/* harmony export */   isFn: () => (/* binding */ isFn),
/* harmony export */   isGptPubadsDefined: () => (/* binding */ isGptPubadsDefined),
/* harmony export */   isInteger: () => (/* binding */ isInteger),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isSafariBrowser: () => (/* binding */ isSafariBrowser),
/* harmony export */   isSafeFrameWindow: () => (/* binding */ isSafeFrameWindow),
/* harmony export */   isStr: () => (/* binding */ isStr),
/* harmony export */   isValidMediaTypes: () => (/* binding */ isValidMediaTypes),
/* harmony export */   logError: () => (/* binding */ logError),
/* harmony export */   logInfo: () => (/* binding */ logInfo),
/* harmony export */   logMessage: () => (/* binding */ logMessage),
/* harmony export */   logWarn: () => (/* binding */ logWarn),
/* harmony export */   memoize: () => (/* binding */ memoize),
/* harmony export */   mergeDeep: () => (/* binding */ mergeDeep),
/* harmony export */   parseGPTSingleSizeArray: () => (/* binding */ parseGPTSingleSizeArray),
/* harmony export */   parseGPTSingleSizeArrayToRtbSize: () => (/* binding */ parseGPTSingleSizeArrayToRtbSize),
/* harmony export */   parseQS: () => (/* binding */ parseQS),
/* harmony export */   parseQueryStringParameters: () => (/* binding */ parseQueryStringParameters),
/* harmony export */   parseSizesInput: () => (/* binding */ parseSizesInput),
/* harmony export */   parseUrl: () => (/* binding */ parseUrl),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   prefixLog: () => (/* binding */ prefixLog),
/* harmony export */   replaceAuctionPrice: () => (/* binding */ replaceAuctionPrice),
/* harmony export */   replaceClickThrough: () => (/* binding */ replaceClickThrough),
/* harmony export */   replaceMacros: () => (/* binding */ replaceMacros),
/* harmony export */   safeJSONEncode: () => (/* binding */ safeJSONEncode),
/* harmony export */   safeJSONParse: () => (/* binding */ safeJSONParse),
/* harmony export */   setOnAny: () => (/* binding */ setOnAny),
/* harmony export */   setScriptAttributes: () => (/* binding */ setScriptAttributes),
/* harmony export */   shuffle: () => (/* binding */ shuffle),
/* harmony export */   sizeTupleToRtbSize: () => (/* binding */ sizeTupleToRtbSize),
/* harmony export */   sizeTupleToSizeString: () => (/* binding */ sizeTupleToSizeString),
/* harmony export */   sizesToSizeTuples: () => (/* binding */ sizesToSizeTuples),
/* harmony export */   sortByHighestCpm: () => (/* binding */ sortByHighestCpm),
/* harmony export */   timestamp: () => (/* binding */ timestamp),
/* harmony export */   transformAdServerTargetingObj: () => (/* binding */ transformAdServerTargetingObj),
/* harmony export */   triggerNurlWithCpm: () => (/* binding */ triggerNurlWithCpm),
/* harmony export */   triggerPixel: () => (/* binding */ triggerPixel),
/* harmony export */   uniques: () => (/* binding */ uniques),
/* harmony export */   unsupportedBidderMessage: () => (/* binding */ unsupportedBidderMessage),
/* harmony export */   waitForElementToLoad: () => (/* binding */ waitForElementToLoad)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var klona_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! klona/json */ "./node_modules/klona/json/index.mjs");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var dlv_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dlv/index.js */ "./node_modules/dlv/index.js");
/* harmony import */ var dset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dset */ "./node_modules/dset/dist/index.mjs");









var tStr = 'String';
var tFn = 'Function';
var tNumb = 'Number';
var tObject = 'Object';
var tBoolean = 'Boolean';
var toString = Object.prototype.toString;
let consoleExists = Boolean(window.console);
let consoleLogExists = Boolean(consoleExists && window.console.log);
let consoleInfoExists = Boolean(consoleExists && window.console.info);
let consoleWarnExists = Boolean(consoleExists && window.console.warn);
let consoleErrorExists = Boolean(consoleExists && window.console.error);
let eventEmitter;
const pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_3__.getGlobal)();
function _setEventEmitter(emitFn) {
  // called from events.js - this hoop is to avoid circular imports
  eventEmitter = emitFn;
}
function emitEvent() {
  if (eventEmitter != null) {
    eventEmitter(...arguments);
  }
}

// this allows stubbing of utility functions that are used internally by other utility functions
const internal = {
  checkCookieSupport,
  createTrackPixelIframeHtml,
  getWindowSelf,
  getWindowTop,
  canAccessWindowTop,
  getWindowLocation,
  insertUserSyncIframe,
  insertElement,
  isFn,
  triggerPixel,
  logError,
  logWarn,
  logMessage,
  logInfo,
  parseQS,
  formatQS,
  deepEqual
};
let prebidInternal = {};
/**
 * Returns object that is used as internal prebid namespace
 */
function getPrebidInternal() {
  return prebidInternal;
}

/* utility method to get incremental integer starting from 1 */
var getIncrementalInteger = function () {
  var count = 0;
  return function () {
    count++;
    return count;
  };
}();

// generate a random string (to be used as a dynamic JSONP callback)
function getUniqueIdentifierStr() {
  return getIncrementalInteger() + Math.random().toString(16).substr(2);
}

/**
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 * https://gist.github.com/jed/982883 via node-uuid
 */
function generateUUID(placeholder) {
  return placeholder ? (placeholder ^ _getRandomData() >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

/**
 * Returns random data using the Crypto API if available and Math.random if not
 * Method is from https://gist.github.com/jed/982883 like generateUUID, direct link https://gist.github.com/jed/982883#gistcomment-45104
 */
function _getRandomData() {
  if (window && window.crypto && window.crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(1))[0] % 16;
  } else {
    return Math.random() * 16;
  }
}
function getBidIdParameter(key, paramsObj) {
  return paramsObj?.[key] || '';
}

// parse a query string object passed in bid params
// bid params should be an object such as {key: "value", key1 : "value1"}
// aliases to formatQS
function parseQueryStringParameters(queryObj) {
  let result = '';
  for (var k in queryObj) {
    if (queryObj.hasOwnProperty(k)) {
      result += k + '=' + encodeURIComponent(queryObj[k]) + '&';
    }
  }
  result = result.replace(/&$/, '');
  return result;
}

// transform an AdServer targeting bids into a query string to send to the adserver
function transformAdServerTargetingObj(targeting) {
  // we expect to receive targeting for a single slot at a time
  if (targeting && Object.getOwnPropertyNames(targeting).length > 0) {
    return Object.keys(targeting).map(key => `${key}=${encodeURIComponent(targeting[key])}`).join('&');
  } else {
    return '';
  }
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of width, height tuples `[[300, 250]]` or '[[300,250], [970,90]]'
 */
function sizesToSizeTuples(sizes) {
  if (typeof sizes === 'string') {
    // multiple sizes will be comma-separated
    return sizes.split(/\s*,\s*/).map(sz => sz.match(/^(\d+)x(\d+)$/i)).filter(match => match).map(_ref => {
      let [_, w, h] = _ref;
      return [parseInt(w, 10), parseInt(h, 10)];
    });
  } else if (Array.isArray(sizes)) {
    if (isValidGPTSingleSize(sizes)) {
      return [sizes];
    }
    return sizes.filter(isValidGPTSingleSize);
  }
  return [];
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of sizes `["300x250"]` or '['300x250', '970x90']'
 * @param  {(Array.<number[]>|Array.<number>)} sizeObj Input array or double array [300,250] or [[300,250], [728,90]]
 * @return {Array.<string>}  Array of strings like `["300x250"]` or `["300x250", "728x90"]`
 */
function parseSizesInput(sizeObj) {
  return sizesToSizeTuples(sizeObj).map(sizeTupleToSizeString);
}
function sizeTupleToSizeString(size) {
  return size[0] + 'x' + size[1];
}

// Parse a GPT style single size array, (i.e [300, 250])
// into an AppNexus style string, (i.e. 300x250)
function parseGPTSingleSizeArray(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return sizeTupleToSizeString(singleSize);
  }
}
function sizeTupleToRtbSize(size) {
  return {
    w: size[0],
    h: size[1]
  };
}

// Parse a GPT style single size array, (i.e [300, 250])
// into OpenRTB-compatible (imp.banner.w/h, imp.banner.format.w/h, imp.video.w/h) object(i.e. {w:300, h:250})
function parseGPTSingleSizeArrayToRtbSize(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return sizeTupleToRtbSize(singleSize);
  }
}
function isValidGPTSingleSize(singleSize) {
  // if we aren't exactly 2 items in this array, it is invalid
  return isArray(singleSize) && singleSize.length === 2 && !isNaN(singleSize[0]) && !isNaN(singleSize[1]);
}
function getWindowTop() {
  return window.top;
}
function getWindowSelf() {
  return window.self;
}
function getWindowLocation() {
  return window.location;
}
function canAccessWindowTop() {
  try {
    if (internal.getWindowTop().location.href) {
      return true;
    }
  } catch (e) {
    return false;
  }
}

/**
 * Wrappers to console.(log | info | warn | error). Takes N arguments, the same as the native methods
 */
function logMessage() {
  if (debugTurnedOn() && consoleLogExists) {
    // eslint-disable-next-line no-console
    console.log.apply(console, decorateLog(arguments, 'MESSAGE:'));
  }
}
function logInfo() {
  if (debugTurnedOn() && consoleInfoExists) {
    // eslint-disable-next-line no-console
    console.info.apply(console, decorateLog(arguments, 'INFO:'));
  }
}
function logWarn() {
  if (debugTurnedOn() && consoleWarnExists) {
    // eslint-disable-next-line no-console
    console.warn.apply(console, decorateLog(arguments, 'WARNING:'));
  }
  emitEvent(_constants_js__WEBPACK_IMPORTED_MODULE_4__.EVENTS.AUCTION_DEBUG, {
    type: 'WARNING',
    arguments: arguments
  });
}
function logError() {
  if (debugTurnedOn() && consoleErrorExists) {
    // eslint-disable-next-line no-console
    console.error.apply(console, decorateLog(arguments, 'ERROR:'));
  }
  emitEvent(_constants_js__WEBPACK_IMPORTED_MODULE_4__.EVENTS.AUCTION_DEBUG, {
    type: 'ERROR',
    arguments: arguments
  });
}
function prefixLog(prefix) {
  function decorate(fn) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      fn(prefix, ...args);
    };
  }
  return {
    logError: decorate(logError),
    logWarn: decorate(logWarn),
    logMessage: decorate(logMessage),
    logInfo: decorate(logInfo)
  };
}
function decorateLog(args, prefix) {
  args = [].slice.call(args);
  let bidder = _config_js__WEBPACK_IMPORTED_MODULE_5__.config.getCurrentBidder();
  prefix && args.unshift(prefix);
  if (bidder) {
    args.unshift(label('#aaa'));
  }
  args.unshift(label('#3b88c3'));
  args.unshift('%cPrebid' + (bidder ? `%c${bidder}` : ''));
  return args;
  function label(color) {
    return `display: inline-block; color: #fff; background: ${color}; padding: 1px 4px; border-radius: 3px;`;
  }
}
function hasConsoleLogger() {
  return consoleLogExists;
}
function debugTurnedOn() {
  return !!_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('debug');
}
const createIframe = (() => {
  const DEFAULTS = {
    border: '0px',
    hspace: '0',
    vspace: '0',
    marginWidth: '0',
    marginHeight: '0',
    scrolling: 'no',
    frameBorder: '0',
    allowtransparency: 'true'
  };
  return function (doc, attrs) {
    let style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const f = doc.createElement('iframe');
    Object.assign(f, Object.assign({}, DEFAULTS, attrs));
    Object.assign(f.style, style);
    return f;
  };
})();
function createInvisibleIframe() {
  return createIframe(document, {
    id: getUniqueIdentifierStr(),
    width: 0,
    height: 0,
    src: 'about:blank'
  }, {
    display: 'none',
    height: '0px',
    width: '0px',
    border: '0px'
  });
}

/*
 *   Check if a given parameter name exists in query string
 *   and if it does return the value
 */
function getParameterByName(name) {
  return parseQS(getWindowLocation().search)[name] || '';
}

/**
 * Return if the object is of the
 * given type.
 * @param {*} object to test
 * @param {String} _t type string (e.g., Array)
 * @return {Boolean} if object is of type _t
 */
function isA(object, _t) {
  return toString.call(object) === '[object ' + _t + ']';
}
function isFn(object) {
  return isA(object, tFn);
}
function isStr(object) {
  return isA(object, tStr);
}
const isArray = Array.isArray.bind(Array);
function isNumber(object) {
  return isA(object, tNumb);
}
function isPlainObject(object) {
  return isA(object, tObject);
}
function isBoolean(object) {
  return isA(object, tBoolean);
}

/**
 * Return if the object is "empty";
 * this includes falsey, no keys, or no items at indices
 * @param {*} object object to test
 * @return {Boolean} if object is empty
 */
function isEmpty(object) {
  if (!object) return true;
  if (isArray(object) || isStr(object)) {
    return !(object.length > 0);
  }
  return Object.keys(object).length <= 0;
}

/**
 * Return if string is empty, null, or undefined
 * @param str string to test
 * @returns {boolean} if string is empty
 */
function isEmptyStr(str) {
  return isStr(str) && (!str || str.length === 0);
}

/**
 * Iterate object with the function
 * falls back to es5 `forEach`
 * @param {Array|Object} object
 * @param {Function} fn - The function to execute for each element. It receives three arguments: value, key, and the original object.
 * @returns {void}
 */
function _each(object, fn) {
  if (isFn(object?.forEach)) return object.forEach(fn, this);
  Object.entries(object || {}).forEach(_ref2 => {
    let [k, v] = _ref2;
    return fn.call(this, v, k);
  });
}
function contains(a, obj) {
  return isFn(a?.includes) && a.includes(obj);
}

/**
 * Map an array or object into another array
 * given a function
 * @param {Array|Object} object
 * @param {Function} callback - The function to execute for each element. It receives three arguments: value, key, and the original object.
 * @return {Array}
 */
function _map(object, callback) {
  if (isFn(object?.map)) return object.map(callback);
  return Object.entries(object || {}).map(_ref3 => {
    let [k, v] = _ref3;
    return callback(v, k, object);
  });
}

/*
* Inserts an element(elm) as targets child, by default as first child
* @param {HTMLElement} elm
* @param {HTMLElement} [doc]
* @param {HTMLElement} [target]
* @param {Boolean} [asLastChildChild]
* @return {HTML Element}
*/
function insertElement(elm, doc, target, asLastChildChild) {
  doc = doc || document;
  let parentEl;
  if (target) {
    parentEl = doc.getElementsByTagName(target);
  } else {
    parentEl = doc.getElementsByTagName('head');
  }
  try {
    parentEl = parentEl.length ? parentEl : doc.getElementsByTagName('body');
    if (parentEl.length) {
      parentEl = parentEl[0];
      let insertBeforeEl = asLastChildChild ? null : parentEl.firstChild;
      return parentEl.insertBefore(elm, insertBeforeEl);
    }
  } catch (e) {}
}

/**
 * Returns a promise that completes when the given element triggers a 'load' or 'error' DOM event, or when
 * `timeout` milliseconds have elapsed.
 *
 * @param {HTMLElement} element
 * @param {Number} [timeout]
 * @returns {Promise}
 */
function waitForElementToLoad(element, timeout) {
  let timer = null;
  return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__.GreedyPromise(resolve => {
    const onLoad = function () {
      element.removeEventListener('load', onLoad);
      element.removeEventListener('error', onLoad);
      if (timer != null) {
        window.clearTimeout(timer);
      }
      resolve();
    };
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onLoad);
    if (timeout != null) {
      timer = window.setTimeout(onLoad, timeout);
    }
  });
}

/**
 * Inserts an image pixel with the specified `url` for cookie sync
 * @param {string} url URL string of the image pixel to load
 * @param  {function} [done] an optional exit callback, used when this usersync pixel is added during an async process
 * @param  {Number} [timeout] an optional timeout in milliseconds for the image to load before calling `done`
 */
function triggerPixel(url, done, timeout) {
  const img = new Image();
  if (done && internal.isFn(done)) {
    waitForElementToLoad(img, timeout).then(done);
  }
  img.src = url;
}

/**
 * Inserts an empty iframe with the specified `html`, primarily used for tracking purposes
 * (though could be for other purposes)
 * @param {string} htmlCode snippet of HTML code used for tracking purposes
 */
function insertHtmlIntoIframe(htmlCode) {
  if (!htmlCode) {
    return;
  }
  const iframe = createInvisibleIframe();
  internal.insertElement(iframe, document, 'body');
  (doc => {
    doc.open();
    doc.write(htmlCode);
    doc.close();
  })(iframe.contentWindow.document);
}

/**
 * Inserts empty iframe with the specified `url` for cookie sync
 * @param  {string} url URL to be requested
 * @param  {function} [done] an optional exit callback, used when this usersync pixel is added during an async process
 * @param  {Number} [timeout] an optional timeout in milliseconds for the iframe to load before calling `done`
 */
function insertUserSyncIframe(url, done, timeout) {
  let iframeHtml = internal.createTrackPixelIframeHtml(url, false, 'allow-scripts allow-same-origin');
  let div = document.createElement('div');
  div.innerHTML = iframeHtml;
  let iframe = div.firstChild;
  if (done && internal.isFn(done)) {
    waitForElementToLoad(iframe, timeout).then(done);
  }
  internal.insertElement(iframe, document, 'html', true);
}

/**
 * Creates a snippet of HTML that retrieves the specified `url`
 * @param  {string} url URL to be requested
 * @param encode
 * @return {string}     HTML snippet that contains the img src = set to `url`
 */
function createTrackPixelHtml(url) {
  let encode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : encodeURI;
  if (!url) {
    return '';
  }
  let escapedUrl = encode(url);
  let img = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
  img += '<img src="' + escapedUrl + '"></div>';
  return img;
}
;

/**
 * encodeURI, but preserves macros of the form '${MACRO}' (e.g. '${AUCTION_PRICE}')
 * @param url
 * @return {string}
 */
function encodeMacroURI(url) {
  const macros = Array.from(url.matchAll(/\$({[^}]+})/g)).map(match => match[1]);
  return macros.reduce((str, macro) => {
    return str.replace('$' + encodeURIComponent(macro), '$' + macro);
  }, encodeURI(url));
}

/**
 * Creates a snippet of Iframe HTML that retrieves the specified `url`
 * @param  {string} url plain URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 * @param  {string} sandbox string if provided the sandbox attribute will be included with the given value
 * @return {string}     HTML snippet that contains the iframe src = set to `url`
 */
function createTrackPixelIframeHtml(url) {
  let encodeUri = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let sandbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (!url) {
    return '';
  }
  if (encodeUri) {
    url = encodeURI(url);
  }
  if (sandbox) {
    sandbox = `sandbox="${sandbox}"`;
  }
  return `<iframe ${sandbox} id="${getUniqueIdentifierStr()}"
      frameborder="0"
      allowtransparency="true"
      marginheight="0" marginwidth="0"
      width="0" hspace="0" vspace="0" height="0"
      style="height:0px;width:0px;display:none;"
      scrolling="no"
      src="${url}">
    </iframe>`;
}
function uniques(value, index, arry) {
  return arry.indexOf(value) === index;
}
function flatten(a, b) {
  return a.concat(b);
}
function getBidRequest(id, bidderRequests) {
  if (!id) {
    return;
  }
  return bidderRequests.flatMap(br => br.bids).find(bid => ['bidId', 'adId', 'bid_id'].some(prop => bid[prop] === id));
}
function getValue(obj, key) {
  return obj[key];
}
function getBidderCodes() {
  let adUnits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pbjsInstance.adUnits;
  // this could memoize adUnits
  return adUnits.map(unit => unit.bids.map(bid => bid.bidder).reduce(flatten, [])).reduce(flatten, []).filter(bidder => typeof bidder !== 'undefined').filter(uniques);
}
function isGptPubadsDefined() {
  if (window.googletag && isFn(window.googletag.pubads) && isFn(window.googletag.pubads().getSlots)) {
    return true;
  }
}
function isApnGetTagDefined() {
  if (window.apntag && isFn(window.apntag.getTag)) {
    return true;
  }
}
const sortByHighestCpm = (a, b) => {
  return b.cpm - a.cpm;
};

/**
 * Fisher–Yates shuffle
 * http://stackoverflow.com/a/6274398
 * https://bost.ocks.org/mike/shuffle/
 * istanbul ignore next
 */
function shuffle(array) {
  let counter = array.length;

  // while there are elements in the array
  while (counter > 0) {
    // pick a random index
    let index = Math.floor(Math.random() * counter);

    // decrease counter by 1
    counter--;

    // and swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function deepClone(obj) {
  return (0,klona_json__WEBPACK_IMPORTED_MODULE_0__.klona)(obj) || {};
}
function inIframe() {
  try {
    return internal.getWindowSelf() !== internal.getWindowTop();
  } catch (e) {
    return true;
  }
}

/**
 * https://iabtechlab.com/wp-content/uploads/2016/03/SafeFrames_v1.1_final.pdf
 */
function isSafeFrameWindow() {
  if (!inIframe()) {
    return false;
  }
  const ws = internal.getWindowSelf();
  return !!(ws.$sf && ws.$sf.ext);
}

/**
 * Returns the result of calling the function $sf.ext.geom() if it exists
 * @see https://iabtechlab.com/wp-content/uploads/2016/03/SafeFrames_v1.1_final.pdf — 5.4 Function $sf.ext.geom
 * @returns {Object | undefined} geometric information about the container
 */
function getSafeframeGeometry() {
  try {
    const ws = getWindowSelf();
    return typeof ws.$sf.ext.geom === 'function' ? ws.$sf.ext.geom() : undefined;
  } catch (e) {
    logError('Error getting SafeFrame geometry', e);
    return undefined;
  }
}
function isSafariBrowser() {
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
function replaceMacros(str, subs) {
  if (!str) return;
  return Object.entries(subs).reduce((str, _ref4) => {
    let [key, val] = _ref4;
    return str.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), val || '');
  }, str);
}
function replaceAuctionPrice(str, cpm) {
  return replaceMacros(str, {
    AUCTION_PRICE: cpm
  });
}
function replaceClickThrough(str, clicktag) {
  if (!str || !clicktag || typeof clicktag !== 'string') return;
  return str.replace(/\${CLICKTHROUGH}/g, clicktag);
}
function timestamp() {
  return new Date().getTime();
}

/**
 * The returned value represents the time elapsed since the time origin. @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
 * @returns {number}
 */
function getPerformanceNow() {
  return window.performance && window.performance.now && window.performance.now() || 0;
}

/**
 * Retuns the difference between `timing.domLoading` and `timing.navigationStart`.
 * This function uses the deprecated `Performance.timing` API and should be removed in future.
 * It has not been updated yet because it is still used in some modules.
 * @deprecated
 * @param {Window} w The window object used to perform the api call. default to window.self
 * @returns {number}
 */
function getDomLoadingDuration(w) {
  let domLoadingDuration = -1;
  w = w || getWindowSelf();
  const performance = w.performance;
  if (w.performance?.timing) {
    if (w.performance.timing.navigationStart > 0) {
      const val = performance.timing.domLoading - performance.timing.navigationStart;
      if (val > 0) {
        domLoadingDuration = val;
      }
    }
  }
  return domLoadingDuration;
}

/**
 * When the deviceAccess flag config option is false, no cookies should be read or set
 * @returns {boolean}
 */
function hasDeviceAccess() {
  return _config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('deviceAccess') !== false;
}

/**
 * @returns {(boolean|undefined)}
 */
function checkCookieSupport() {
  // eslint-disable-next-line prebid/no-member
  if (window.navigator.cookieEnabled || !!document.cookie.length) {
    return true;
  }
}

/**
 * Given a function, return a function which only executes the original after
 * it's been called numRequiredCalls times.
 *
 * Note that the arguments from the previous calls will *not* be forwarded to the original function.
 * Only the final call's arguments matter.
 *
 * @param {function} func The function which should be executed, once the returned function has been executed
 *   numRequiredCalls times.
 * @param {number} numRequiredCalls The number of times which the returned function needs to be called before
 *   func is.
 */
function delayExecution(func, numRequiredCalls) {
  if (numRequiredCalls < 1) {
    throw new Error(`numRequiredCalls must be a positive number. Got ${numRequiredCalls}`);
  }
  let numCalls = 0;
  return function () {
    numCalls++;
    if (numCalls === numRequiredCalls) {
      func.apply(this, arguments);
    }
  };
}

/**
 * https://stackoverflow.com/a/34890276/428704
 * @param {Array} xs
 * @param {string} key
 * @returns {Object} {${key_value}: ${groupByArray}, key_value: {groupByArray}}
 */
function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

/**
 * Build an object consisting of only defined parameters to avoid creating an
 * object with defined keys and undefined values.
 * @param {Object} object The object to pick defined params out of
 * @param {string[]} params An array of strings representing properties to look for in the object
 * @returns {Object} An object containing all the specified values that are defined
 */
function getDefinedParams(object, params) {
  return params.filter(param => object[param]).reduce((bid, param) => Object.assign(bid, {
    [param]: object[param]
  }), {});
}

/**
 * @typedef {Object} MediaTypes
 * @property {Object} banner banner configuration
 * @property {Object} native native configuration
 * @property {Object} video video configuration
 */

/**
 * Validates an adunit's `mediaTypes` parameter
 * @param {MediaTypes} mediaTypes mediaTypes parameter to validate
 * @return {boolean} If object is valid
 */
function isValidMediaTypes(mediaTypes) {
  const SUPPORTED_MEDIA_TYPES = ['banner', 'native', 'video'];
  const SUPPORTED_STREAM_TYPES = ['instream', 'outstream', 'adpod'];
  const types = Object.keys(mediaTypes);
  if (!types.every(type => (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_7__.includes)(SUPPORTED_MEDIA_TYPES, type))) {
    return false;
  }
  if ( true && mediaTypes.video && mediaTypes.video.context) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_7__.includes)(SUPPORTED_STREAM_TYPES, mediaTypes.video.context);
  }
  return true;
}

/**
 * Returns user configured bidder params from adunit
 * @param {Object} adUnits
 * @param {string} adUnitCode code
 * @param {string} bidder code
 * @return {Array} user configured param for the given bidder adunit configuration
 */
function getUserConfiguredParams(adUnits, adUnitCode, bidder) {
  return adUnits.filter(adUnit => adUnit.code === adUnitCode).flatMap(adUnit => adUnit.bids).filter(bidderData => bidderData.bidder === bidder).map(bidderData => bidderData.params || {});
}

/**
 * Returns Do Not Track state
 */
function getDNT() {
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1' || navigator.doNotTrack === 'yes';
}
const compareCodeAndSlot = (slot, adUnitCode) => slot.getAdUnitPath() === adUnitCode || slot.getSlotElementId() === adUnitCode;

/**
 * Returns filter function to match adUnitCode in slot
 * @param {Object} slot GoogleTag slot
 * @return {function} filter function
 */
function isAdUnitCodeMatchingSlot(slot) {
  return adUnitCode => compareCodeAndSlot(slot, adUnitCode);
}

/**
 * Constructs warning message for when unsupported bidders are dropped from an adunit
 * @param {Object} adUnit ad unit from which the bidder is being dropped
 * @param {string} bidder bidder code that is not compatible with the adUnit
 * @return {string} warning message to display when condition is met
 */
function unsupportedBidderMessage(adUnit, bidder) {
  const mediaType = Object.keys(adUnit.mediaTypes || {
    'banner': 'banner'
  }).join(', ');
  return `
    ${adUnit.code} is a ${mediaType} ad unit
    containing bidders that don't support ${mediaType}: ${bidder}.
    This bidder won't fetch demand.
  `;
}

/**
 * Checks input is integer or not
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value
 */
const isInteger = Number.isInteger.bind(Number);

/**
 * Returns a new object with undefined properties removed from given object
 * @param obj the object to clean
 */
function cleanObj(obj) {
  return Object.fromEntries(Object.entries(obj).filter(_ref5 => {
    let [_, v] = _ref5;
    return typeof v !== 'undefined';
  }));
}

/**
 * Create a new object with selected properties.  Also allows property renaming and transform functions.
 * @param obj the original object
 * @param properties An array of desired properties
 */
function pick(obj, properties) {
  if (typeof obj !== 'object') {
    return {};
  }
  return properties.reduce((newObj, prop, i) => {
    if (typeof prop === 'function') {
      return newObj;
    }
    let newProp = prop;
    let match = prop.match(/^(.+?)\sas\s(.+?)$/i);
    if (match) {
      prop = match[1];
      newProp = match[2];
    }
    let value = obj[prop];
    if (typeof properties[i + 1] === 'function') {
      value = properties[i + 1](value, newObj);
    }
    if (typeof value !== 'undefined') {
      newObj[newProp] = value;
    }
    return newObj;
  }, {});
}
function isArrayOfNums(val, size) {
  return isArray(val) && (size ? val.length === size : true) && val.every(v => isInteger(v));
}
function parseQS(query) {
  return !query ? {} : query.replace(/^\?/, '').split('&').reduce((acc, criteria) => {
    let [k, v] = criteria.split('=');
    if (/\[\]$/.test(k)) {
      k = k.replace('[]', '');
      acc[k] = acc[k] || [];
      acc[k].push(v);
    } else {
      acc[k] = v || '';
    }
    return acc;
  }, {});
}
function formatQS(query) {
  return Object.keys(query).map(k => Array.isArray(query[k]) ? query[k].map(v => `${k}[]=${v}`).join('&') : `${k}=${query[k]}`).join('&');
}
function parseUrl(url, options) {
  let parsed = document.createElement('a');
  if (options && 'noDecodeWholeURL' in options && options.noDecodeWholeURL) {
    parsed.href = url;
  } else {
    parsed.href = decodeURIComponent(url);
  }
  // in window.location 'search' is string, not object
  let qsAsString = options && 'decodeSearchAsString' in options && options.decodeSearchAsString;
  return {
    href: parsed.href,
    protocol: (parsed.protocol || '').replace(/:$/, ''),
    hostname: parsed.hostname,
    port: +parsed.port,
    pathname: parsed.pathname.replace(/^(?!\/)/, '/'),
    search: qsAsString ? parsed.search : internal.parseQS(parsed.search || ''),
    hash: (parsed.hash || '').replace(/^#/, ''),
    host: parsed.host || window.location.host
  };
}
function buildUrl(obj) {
  return (obj.protocol || 'http') + '://' + (obj.host || obj.hostname + (obj.port ? `:${obj.port}` : '')) + (obj.pathname || '') + (obj.search ? `?${internal.formatQS(obj.search || '')}` : '') + (obj.hash ? `#${obj.hash}` : '');
}

/**
 * This function deeply compares two objects checking for their equivalence.
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Object} [options] - Options for comparison.
 * @param {boolean} [options.checkTypes=false] - If set, two objects with identical properties but different constructors will *not* be considered equivalent.
 * @returns {boolean} - Returns `true` if the objects are equivalent, `false` otherwise.
 */
function deepEqual(obj1, obj2) {
  let {
    checkTypes = false
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (obj1 === obj2) return true;else if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null && (!checkTypes || obj1.constructor === obj2.constructor)) {
    const props1 = Object.keys(obj1);
    if (props1.length !== Object.keys(obj2).length) return false;
    for (let prop of props1) {
      if (obj2.hasOwnProperty(prop)) {
        if (!deepEqual(obj1[prop], obj2[prop], {
          checkTypes
        })) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
function mergeDeep(target) {
  for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }
  if (!sources.length) return target;
  const source = sources.shift();
  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else if (isArray(source[key])) {
        if (!target[key]) {
          Object.assign(target, {
            [key]: [...source[key]]
          });
        } else if (isArray(target[key])) {
          source[key].forEach(obj => {
            let addItFlag = 1;
            for (let i = 0; i < target[key].length; i++) {
              if (deepEqual(target[key][i], obj)) {
                addItFlag = 0;
                break;
              }
            }
            if (addItFlag) {
              target[key].push(obj);
            }
          });
        }
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

/**
 * returns a hash of a string using a fast algorithm
 * source: https://stackoverflow.com/a/52171480/845390
 * @param str
 * @param seed (optional)
 * @returns {string}
 */
function cyrb53Hash(str) {
  let seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // IE doesn't support imul
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill
  let imul = function (opA, opB) {
    if (isFn(Math.imul)) {
      return Math.imul(opA, opB);
    } else {
      opB |= 0; // ensure that opB is an integer. opA will automatically be coerced.
      // floating points give us 53 bits of precision to work with plus 1 sign bit
      // automatically handled for our convienence:
      // 1. 0x003fffff /*opA & 0x000fffff*/ * 0x7fffffff /*opB*/ = 0x1fffff7fc00001
      //    0x1fffff7fc00001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
      var result = (opA & 0x003fffff) * opB;
      // 2. We can remove an integer coersion from the statement above because:
      //    0x1fffff7fc00001 + 0xffc00000 = 0x1fffffff800001
      //    0x1fffffff800001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
      if (opA & 0xffc00000) result += (opA & 0xffc00000) * opB | 0;
      return result | 0;
    }
  };
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = imul(h1 ^ ch, 2654435761);
    h2 = imul(h2 ^ ch, 1597334677);
  }
  h1 = imul(h1 ^ h1 >>> 16, 2246822507) ^ imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = imul(h2 ^ h2 >>> 16, 2246822507) ^ imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
}

/**
 * returns the result of `JSON.parse(data)`, or undefined if that throws an error.
 * @param data
 * @returns {any}
 */
function safeJSONParse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {}
}
function safeJSONEncode(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return '';
  }
}

/**
 * Returns a memoized version of `fn`.
 *
 * @param fn
 * @param key cache key generator, invoked with the same arguments passed to `fn`.
 *        By default, the first argument is used as key.
 * @return {function(): any}
 */
function memoize(fn) {
  let key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (arg) {
    return arg;
  };
  const cache = new Map();
  const memoized = function () {
    const cacheKey = key.apply(this, arguments);
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, fn.apply(this, arguments));
    }
    return cache.get(cacheKey);
  };
  memoized.clear = cache.clear.bind(cache);
  return memoized;
}

/**
 * Returns a Unix timestamp for given time value and unit.
 * @param {number} timeValue numeric value, defaults to 0 (which means now)
 * @param {string} timeUnit defaults to days (or 'd'), use 'm' for minutes. Any parameter that isn't 'd' or 'm' will return Date.now().
 * @returns {number}
 */
function getUnixTimestampFromNow() {
  let timeValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let timeUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'd';
  const acceptableUnits = ['m', 'd'];
  if (acceptableUnits.indexOf(timeUnit) < 0) {
    return Date.now();
  }
  const multiplication = timeValue / (timeUnit === 'm' ? 1440 : 1);
  return Date.now() + (timeValue && timeValue > 0 ? 1000 * 60 * 60 * 24 * multiplication : 0);
}

/**
 * Converts given object into an array, so {key: 1, anotherKey: 'fred', third: ['fred']} is turned
 * into [{key: 1}, {anotherKey: 'fred'}, {third: ['fred']}]
 * @param {Object} obj the object
 * @returns {Array}
 */
function convertObjectToArray(obj) {
  return Object.keys(obj).map(key => {
    return {
      [key]: obj[key]
    };
  });
}

/**
 * Sets dataset attributes on a script
 * @param {HTMLScriptElement} script
 * @param {object} attributes
 */
function setScriptAttributes(script, attributes) {
  Object.entries(attributes).forEach(_ref6 => {
    let [k, v] = _ref6;
    return script.setAttribute(k, v);
  });
}

/**
 * Perform a binary search for `el` on an ordered array `arr`.
 *
 * @returns the lowest nonnegative integer I that satisfies:
 *   key(arr[i]) >= key(el) for each i between I and arr.length
 *
 *   (if one or more matches are found for `el`, returns the index of the first;
 *   if the element is not found, return the index of the first element that's greater;
 *   if no greater element exists, return `arr.length`)
 */
function binarySearch(arr, el) {
  let key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : el => el;
  let left = 0;
  let right = arr.length && arr.length - 1;
  const target = key(el);
  while (right - left > 1) {
    const middle = left + Math.round((right - left) / 2);
    if (target > key(arr[middle])) {
      left = middle;
    } else {
      right = middle;
    }
  }
  while (arr.length > left && target > key(arr[left])) {
    left++;
  }
  return left;
}

/**
 * Checks if an object has non-serializable properties.
 * Non-serializable properties are functions and RegExp objects.
 *
 * @param {Object} obj - The object to check.
 * @param {Set} checkedObjects - A set of properties that have already been checked.
 * @returns {boolean} - Returns true if the object has non-serializable properties, false otherwise.
 */
function hasNonSerializableProperty(obj) {
  let checkedObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
  for (const key in obj) {
    const value = obj[key];
    const type = typeof value;
    if (value === undefined || type === 'function' || type === 'symbol' || value instanceof RegExp || value instanceof Map || value instanceof Set || value instanceof Date || value !== null && type === 'object' && value.hasOwnProperty('toJSON')) {
      return true;
    }
    if (value !== null && type === 'object' && value.constructor === Object) {
      if (checkedObjects.has(value)) {
        // circular reference, means we have a non-serializable property
        return true;
      }
      checkedObjects.add(value);
      if (hasNonSerializableProperty(value, checkedObjects)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns the value of a nested property in an array of objects.
 *
 * @param {Array} collection - Array of objects.
 * @param {String} key - Key of nested property.
 * @returns {any, undefined} - Value of nested property.
 */
function setOnAny(collection, key) {
  for (let i = 0, result; i < collection.length; i++) {
    result = (0,dlv_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(collection[i], key);
    if (result) {
      return result;
    }
  }
  return undefined;
}
function extractDomainFromHost(pageHost) {
  let domain = null;
  try {
    let domains = /[-\w]+\.([-\w]+|[-\w]{3,}|[-\w]{1,3}\.[-\w]{2})$/i.exec(pageHost);
    if (domains != null && domains.length > 0) {
      domain = domains[0];
      for (let i = 1; i < domains.length; i++) {
        if (domains[i].length > domain.length) {
          domain = domains[i];
        }
      }
    }
  } catch (e) {
    domain = null;
  }
  return domain;
}
function triggerNurlWithCpm(bid, cpm) {
  if (isStr(bid.nurl) && bid.nurl !== '') {
    bid.nurl = bid.nurl.replace(/\${AUCTION_PRICE}/, cpm);
    triggerPixel(bid.nurl);
  }
}

/***/ }),

/***/ "./src/utils/promise.js":
/*!******************************!*\
  !*** ./src/utils/promise.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GreedyPromise: () => (/* binding */ GreedyPromise),
/* harmony export */   defer: () => (/* binding */ defer)
/* harmony export */ });
const SUCCESS = 0;
const FAIL = 1;

/**
 * A version of Promise that runs callbacks synchronously when it can (i.e. after it's been fulfilled or rejected).
 */
class GreedyPromise {
  #result;
  #callbacks;

  /**
   * Convenience wrapper for setTimeout; takes care of returning an already fulfilled GreedyPromise when the delay is zero.
   *
   * @param {Number} delayMs delay in milliseconds
   * @returns {GreedyPromise} a promise that resolves (to undefined) in `delayMs` milliseconds
   */
  static timeout() {
    let delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new GreedyPromise(resolve => {
      delayMs === 0 ? resolve() : setTimeout(resolve, delayMs);
    });
  }
  constructor(resolver) {
    if (typeof resolver !== 'function') {
      throw new Error('resolver not a function');
    }
    const result = [];
    const callbacks = [];
    let [resolve, reject] = [SUCCESS, FAIL].map(type => {
      return function (value) {
        if (type === SUCCESS && typeof value?.then === 'function') {
          value.then(resolve, reject);
        } else if (!result.length) {
          result.push(type, value);
          while (callbacks.length) callbacks.shift()();
        }
      };
    });
    try {
      resolver(resolve, reject);
    } catch (e) {
      reject(e);
    }
    this.#result = result;
    this.#callbacks = callbacks;
  }
  then(onSuccess, onError) {
    const result = this.#result;
    return new this.constructor((resolve, reject) => {
      const continuation = () => {
        let value = result[1];
        let [handler, resolveFn] = result[0] === SUCCESS ? [onSuccess, resolve] : [onError, reject];
        if (typeof handler === 'function') {
          try {
            value = handler(value);
          } catch (e) {
            reject(e);
            return;
          }
          resolveFn = resolve;
        }
        resolveFn(value);
      };
      result.length ? continuation() : this.#callbacks.push(continuation);
    });
  }
  catch(onError) {
    return this.then(null, onError);
  }
  finally(onFinally) {
    let val;
    return this.then(v => {
      val = v;
      return onFinally();
    }, e => {
      val = this.constructor.reject(e);
      return onFinally();
    }).then(() => val);
  }
  static #collect(promises, collector, done) {
    let cnt = promises.length;
    function clt() {
      collector.apply(this, arguments);
      if (--cnt <= 0 && done) done();
    }
    promises.length === 0 && done ? done() : promises.forEach((p, i) => this.resolve(p).then(val => clt(true, val, i), err => clt(false, err, i)));
  }
  static race(promises) {
    return new this((resolve, reject) => {
      this.#collect(promises, (success, result) => success ? resolve(result) : reject(result));
    });
  }
  static all(promises) {
    return new this((resolve, reject) => {
      let res = [];
      this.#collect(promises, (success, val, i) => success ? res[i] = val : reject(val), () => resolve(res));
    });
  }
  static allSettled(promises) {
    return new this(resolve => {
      let res = [];
      this.#collect(promises, (success, val, i) => res[i] = success ? {
        status: 'fulfilled',
        value: val
      } : {
        status: 'rejected',
        reason: val
      }, () => resolve(res));
    });
  }
  static resolve(value) {
    return new this(resolve => resolve(value));
  }
  static reject(error) {
    return new this((resolve, reject) => reject(error));
  }
}

/**
 * @returns a {promise, resolve, reject} trio where `promise` is resolved by calling `resolve` or `reject`.
 */
function defer() {
  let {
    promiseFactory = resolver => new GreedyPromise(resolver)
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  function invoker(delegate) {
    return val => delegate(val);
  }
  let resolveFn, rejectFn;
  return {
    promise: promiseFactory((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    }),
    resolve: invoker(resolveFn),
    reject: invoker(rejectFn)
  };
}

/***/ }),

/***/ "./node_modules/dlv/index.js":
/*!***********************************!*\
  !*** ./node_modules/dlv/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dlv)
/* harmony export */ });
function dlv(obj, key, def, p, undef) {
	key = key.split ? key.split('.') : key;
	for (p = 0; p < key.length; p++) {
		obj = obj ? obj[key[p]] : undef;
	}
	return obj === undef ? def : obj;
}


/***/ }),

/***/ "./node_modules/dset/dist/index.mjs":
/*!******************************************!*\
  !*** ./node_modules/dset/dist/index.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dset: () => (/* binding */ dset)
/* harmony export */ });
function dset(obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, l=keys.length, t=obj, x, k;
	while (i < l) {
		k = ''+keys[i++];
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') break;
		t = t[k] = (i === l) ? val : (typeof(x=t[k])===typeof(keys)) ? x : (keys[i]*0 !== 0 || !!~(''+keys[i]).indexOf('.')) ? {} : [];
	}
}


/***/ }),

/***/ "./node_modules/klona/json/index.mjs":
/*!*******************************************!*\
  !*** ./node_modules/klona/json/index.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   klona: () => (/* binding */ klona)
/* harmony export */ });
function klona(val) {
	var k, out, tmp;

	if (Array.isArray(val)) {
		out = Array(k=val.length);
		while (k--) out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;
		return out;
	}

	if (Object.prototype.toString.call(val) === '[object Object]') {
		out = {}; // null
		for (k in val) {
			if (k === '__proto__') {
				Object.defineProperty(out, k, {
					value: klona(val[k]),
					configurable: true,
					enumerable: true,
					writable: true,
				});
			} else {
				out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;
			}
		}
		return out;
	}

	return val;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./modules/debugging/standalone.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _debugging_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debugging.js */ "./modules/debugging/debugging.js");

window._pbjsGlobals.forEach(name => {
  if (window[name] && window[name]._installDebugging === true) {
    window[name]._installDebugging = _debugging_js__WEBPACK_IMPORTED_MODULE_0__.install;
  }
});
/******/ })()
;
//# sourceMappingURL=debugging-standalone.js.map