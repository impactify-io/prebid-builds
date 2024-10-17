/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/debugging/bidInterceptor.js":
/*!*********************************************!*\
  !*** ./modules/debugging/bidInterceptor.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BidInterceptor": function() { return /* binding */ BidInterceptor; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./node_modules/dlv/index.js");





/**
 * @typedef {Number|String|boolean|null|undefined} Scalar
 */

function BidInterceptor() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$setTimeout = opts.setTimeout;
  this.setTimeout = _opts$setTimeout === void 0 ? window.setTimeout.bind(window) : _opts$setTimeout;
  this.logger = opts.logger;
  this.rules = [];
}
Object.assign(BidInterceptor.prototype, {
  DEFAULT_RULE_OPTIONS: {
    delay: 0
  },
  serializeConfig: function serializeConfig(ruleDefs) {
    var _this = this;
    var isSerializable = function isSerializable(ruleDef, i) {
      var serializable = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(ruleDef, JSON.parse(JSON.stringify(ruleDef)), {
        checkTypes: true
      });
      if (!serializable && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ruleDef, 'options.suppressWarnings')) {
        _this.logger.logWarn("Bid interceptor rule definition #".concat(i + 1, " is not serializable and will be lost after a refresh. Rule definition: "), ruleDef);
      }
      return serializable;
    };
    return ruleDefs.filter(isSerializable);
  },
  updateConfig: function updateConfig(config) {
    var _this2 = this;
    this.rules = (config.intercept || []).map(function (ruleDef, i) {
      return _this2.rule(ruleDef, i + 1);
    });
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
  rule: function rule(ruleDef, ruleNo) {
    return {
      no: ruleNo,
      match: this.matcher(ruleDef.when, ruleNo),
      replace: this.replacer(ruleDef.then || {}, ruleNo),
      options: Object.assign({}, this.DEFAULT_RULE_OPTIONS, ruleDef.options)
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
  matcher: function matcher(matchDef, ruleNo) {
    if (typeof matchDef === 'function') {
      return matchDef;
    }
    if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(matchDef) !== 'object') {
      this.logger.logError("Invalid 'when' definition for debug bid interceptor (in rule #".concat(ruleNo, ")"));
      return function () {
        return false;
      };
    }
    function matches(candidate, _ref) {
      var _ref$ref = _ref.ref,
        ref = _ref$ref === void 0 ? matchDef : _ref$ref,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? [] : _ref$args;
      return Object.entries(ref).map(function (_ref2) {
        var _ref3 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref2, 2),
          key = _ref3[0],
          val = _ref3[1];
        var cVal = candidate[key];
        if (val instanceof RegExp) {
          return val.exec(cVal) != null;
        }
        if (typeof val === 'function') {
          return !!val.apply(void 0, [cVal].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__["default"])(args)));
        }
        if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(val) === 'object') {
          return matches(cVal, {
            ref: val,
            args: args
          });
        }
        return cVal === val;
      }).every(function (i) {
        return i;
      });
    }
    return function (candidate) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return matches(candidate, {
        args: args
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
  replacer: function replacer(replDef, ruleNo) {
    var _this3 = this;
    var _replFn;
    if (typeof replDef === 'function') {
      _replFn = function replFn(_ref4) {
        var args = _ref4.args;
        return replDef.apply(void 0, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__["default"])(args));
      };
    } else if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(replDef) !== 'object') {
      this.logger.logError("Invalid 'then' definition for debug bid interceptor (in rule #".concat(ruleNo, ")"));
      _replFn = function replFn() {
        return {};
      };
    } else {
      _replFn = function replFn(_ref5) {
        var args = _ref5.args,
          _ref5$ref = _ref5.ref,
          ref = _ref5$ref === void 0 ? replDef : _ref5$ref;
        var result = Array.isArray(ref) ? [] : {};
        Object.entries(ref).forEach(function (_ref6) {
          var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref6, 2),
            key = _ref7[0],
            val = _ref7[1];
          if (typeof val === 'function') {
            result[key] = val.apply(void 0, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__["default"])(args));
          } else if (val != null && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(val) === 'object') {
            result[key] = _replFn({
              args: args,
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
      var response = _this3.responseDefaults(bid);
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(response, _replFn({
        args: [bid].concat(args)
      }));
      if (!response.hasOwnProperty('ad') && !response.hasOwnProperty('adUrl')) {
        response.ad = _this3.defaultAd(bid, response);
      }
      response.isDebug = true;
      return response;
    };
  },
  responseDefaults: function responseDefaults(bid) {
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
  defaultAd: function defaultAd(bid, bidResponse) {
    return "<html><head><style>#ad {width: ".concat(bidResponse.width, "px;height: ").concat(bidResponse.height, "px;background-color: #f6f6ae;color: #85144b;padding: 5px;text-align: center;display: flex;flex-direction: column;align-items: center;justify-content: center;}#bidder {font-family: monospace;font-weight: normal;}#title {font-size: x-large;font-weight: bold;margin-bottom: 5px;}#body {font-size: large;margin-top: 5px;}</style></head><body><div id=\"ad\"><div id=\"title\">Mock ad: <span id=\"bidder\">").concat(bid.bidder, "</span></div><div id=\"body\">").concat(bidResponse.width, "x").concat(bidResponse.height, "</div></div></body></html>");
  },
  /**
   * Match a candidate bid against all registered rules.
   *
   * @param {{}} candidate
   * @param args
   * @returns {Rule|undefined} the first matching rule, or undefined if no match was found.
   */
  match: function match(candidate) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return this.rules.find(function (rule) {
      return rule.match.apply(rule, [candidate].concat(args));
    });
  },
  /**
   * Match a set of bids against all registered rules.
   *
   * @param bids
   * @param bidRequest
   * @returns {[{bid: *, rule: Rule}[], *[]]} a 2-tuple for matching bids (decorated with the matching rule) and
   * non-matching bids.
   */
  matchAll: function matchAll(bids, bidRequest) {
    var _this4 = this;
    var matches = [],
      remainder = [];
    bids.forEach(function (bid) {
      var rule = _this4.match(bid, bidRequest);
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
   * @param {function()} done called once after all mock responses have been run through `addBid`
   * @returns {{bids: {}[], bidRequest: {}} remaining bids that did not match any rule (this applies also to
   * bidRequest.bids)
   */
  intercept: function intercept(_ref8) {
    var _this5 = this;
    var bids = _ref8.bids,
      bidRequest = _ref8.bidRequest,
      addBid = _ref8.addBid,
      done = _ref8.done;
    if (bids == null) {
      bids = bidRequest.bids;
    }
    var _this$matchAll = this.matchAll(bids, bidRequest),
      _this$matchAll2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_this$matchAll, 2),
      matches = _this$matchAll2[0],
      remainder = _this$matchAll2[1];
    if (matches.length > 0) {
      var callDone = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.delayExecution)(done, matches.length);
      matches.forEach(function (match) {
        var mockResponse = match.rule.replace(match.bid, bidRequest);
        var delay = match.rule.options.delay;
        _this5.logger.logMessage("Intercepted bid request (matching rule #".concat(match.rule.no, "), mocking response in ").concat(delay, "ms. Request, response:"), match.bid, mockResponse);
        _this5.setTimeout(function () {
          addBid(mockResponse, match.bid);
          callDone();
        }, delay);
      });
      bidRequest = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepClone)(bidRequest);
      bids = bidRequest.bids = remainder;
    } else {
      this.setTimeout(done, 0);
    }
    return {
      bids: bids,
      bidRequest: bidRequest
    };
  }
});

/***/ }),

/***/ "./modules/debugging/debugging.js":
/*!****************************************!*\
  !*** ./modules/debugging/debugging.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "install": function() { return /* binding */ install; }
/* harmony export */ });
/* unused harmony exports disableDebugging, getConfig, sessionLoader, bidderBidInterceptor */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./bidInterceptor.js */ "./modules/debugging/bidInterceptor.js");
/* harmony import */ var _pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pbsInterceptor.js */ "./modules/debugging/pbsInterceptor.js");
/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legacy.js */ "./modules/debugging/legacy.js");


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }




var interceptorHooks = [];
var bidInterceptor;
var enabled = false;
function enableDebugging(debugConfig, _ref) {
  var _ref$fromSession = _ref.fromSession,
    fromSession = _ref$fromSession === void 0 ? false : _ref$fromSession,
    config = _ref.config,
    hook = _ref.hook,
    logger = _ref.logger;
  config.setConfig({
    debug: true
  });
  bidInterceptor.updateConfig(debugConfig);
  resetHooks(true);
  // also enable "legacy" overrides
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.removeHooks)({
    hook: hook
  });
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.addHooks)(debugConfig, {
    hook: hook,
    logger: logger
  });
  if (!enabled) {
    enabled = true;
    logger.logMessage("Debug overrides enabled".concat(fromSession ? ' from session' : ''));
  }
}
function disableDebugging(_ref2) {
  var hook = _ref2.hook,
    logger = _ref2.logger;
  bidInterceptor.updateConfig({});
  resetHooks(false);
  // also disable "legacy" overrides
  (0,_legacy_js__WEBPACK_IMPORTED_MODULE_1__.removeHooks)({
    hook: hook
  });
  if (enabled) {
    enabled = false;
    logger.logMessage('Debug overrides disabled');
  }
}
function saveDebuggingConfig(debugConfig) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref3$sessionStorage = _ref3.sessionStorage,
    sessionStorage = _ref3$sessionStorage === void 0 ? window.sessionStorage : _ref3$sessionStorage,
    DEBUG_KEY = _ref3.DEBUG_KEY;
  if (!debugConfig.enabled) {
    try {
      sessionStorage.removeItem(DEBUG_KEY);
    } catch (e) {}
  } else {
    if (debugConfig.intercept) {
      debugConfig = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.deepClone)(debugConfig);
      debugConfig.intercept = bidInterceptor.serializeConfig(debugConfig.intercept);
    }
    try {
      sessionStorage.setItem(DEBUG_KEY, JSON.stringify(debugConfig));
    } catch (e) {}
  }
}
function getConfig(debugging) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref4$getStorage = _ref4.getStorage,
    getStorage = _ref4$getStorage === void 0 ? function () {
      return window.sessionStorage;
    } : _ref4$getStorage,
    DEBUG_KEY = _ref4.DEBUG_KEY,
    config = _ref4.config,
    hook = _ref4.hook,
    logger = _ref4.logger;
  if (debugging == null) return;
  var sessionStorage;
  try {
    sessionStorage = getStorage();
  } catch (e) {
    logger.logError("sessionStorage is not available: debugging configuration will not persist on page reload", e);
  }
  if (sessionStorage != null) {
    saveDebuggingConfig(debugging, {
      sessionStorage: sessionStorage,
      DEBUG_KEY: DEBUG_KEY
    });
  }
  if (!debugging.enabled) {
    disableDebugging({
      hook: hook,
      logger: logger
    });
  } else {
    enableDebugging(debugging, {
      config: config,
      hook: hook,
      logger: logger
    });
  }
}
function sessionLoader(_ref5) {
  var DEBUG_KEY = _ref5.DEBUG_KEY,
    storage = _ref5.storage,
    config = _ref5.config,
    hook = _ref5.hook,
    logger = _ref5.logger;
  var overrides;
  try {
    storage = storage || window.sessionStorage;
    overrides = JSON.parse(storage.getItem(DEBUG_KEY));
  } catch (e) {}
  if (overrides) {
    enableDebugging(overrides, {
      fromSession: true,
      config: config,
      hook: hook,
      logger: logger
    });
  }
}
function resetHooks(enable) {
  interceptorHooks.forEach(function (_ref6) {
    var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref6, 2),
      getHookFn = _ref7[0],
      interceptor = _ref7[1];
    getHookFn().getHooks({
      hook: interceptor
    }).remove();
  });
  if (enable) {
    interceptorHooks.forEach(function (_ref8) {
      var _ref9 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref8, 2),
        getHookFn = _ref9[0],
        interceptor = _ref9[1];
      getHookFn().before(interceptor);
    });
  }
}
function registerBidInterceptor(getHookFn, interceptor) {
  var interceptBids = function interceptBids() {
    var _bidInterceptor;
    return (_bidInterceptor = bidInterceptor).intercept.apply(_bidInterceptor, arguments);
  };
  interceptorHooks.push([getHookFn, function (next) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    interceptor.apply(void 0, [next, interceptBids].concat(args));
  }]);
}
function bidderBidInterceptor(next, interceptBids, spec, bids, bidRequest, ajax, wrapCallback, cbs) {
  var done = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.delayExecution)(cbs.onCompletion, 2);
  var _interceptBids = interceptBids({
    bids: bids,
    bidRequest: bidRequest,
    addBid: cbs.onBid,
    done: done
  });
  bids = _interceptBids.bids;
  bidRequest = _interceptBids.bidRequest;
  if (bids.length === 0) {
    done();
  } else {
    next(spec, bids, bidRequest, ajax, wrapCallback, _objectSpread(_objectSpread({}, cbs), {}, {
      onCompletion: done
    }));
  }
}
function install(_ref10) {
  var DEBUG_KEY = _ref10.DEBUG_KEY,
    config = _ref10.config,
    hook = _ref10.hook,
    createBid = _ref10.createBid,
    logger = _ref10.logger;
  bidInterceptor = new _bidInterceptor_js__WEBPACK_IMPORTED_MODULE_4__.BidInterceptor({
    logger: logger
  });
  var pbsBidInterceptor = (0,_pbsInterceptor_js__WEBPACK_IMPORTED_MODULE_5__.makePbsInterceptor)({
    createBid: createBid
  });
  registerBidInterceptor(function () {
    return hook.get('processBidderRequests');
  }, bidderBidInterceptor);
  registerBidInterceptor(function () {
    return hook.get('processPBSRequest');
  }, pbsBidInterceptor);
  sessionLoader({
    DEBUG_KEY: DEBUG_KEY,
    config: config,
    hook: hook,
    logger: logger
  });
  config.getConfig('debugging', function (_ref11) {
    var debugging = _ref11.debugging;
    return getConfig(debugging, {
      DEBUG_KEY: DEBUG_KEY,
      config: config,
      hook: hook,
      logger: logger
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addHooks": function() { return /* binding */ addHooks; },
/* harmony export */   "removeHooks": function() { return /* binding */ removeHooks; }
/* harmony export */ });
/* unused harmony exports addBidResponseBound, addBidderRequestsBound, bidExcluded, bidderExcluded, applyBidOverrides, addBidResponseHook, addBidderRequestsHook */
var addBidResponseBound;
var addBidderRequestsBound;
function addHooks(overrides, _ref) {
  var hook = _ref.hook,
    logger = _ref.logger;
  addBidResponseBound = addBidResponseHook.bind({
    overrides: overrides,
    logger: logger
  });
  hook.get('addBidResponse').before(addBidResponseBound, 5);
  addBidderRequestsBound = addBidderRequestsHook.bind({
    overrides: overrides,
    logger: logger
  });
  hook.get('addBidderRequests').before(addBidderRequestsBound, 5);
}
function removeHooks(_ref2) {
  var hook = _ref2.hook;
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
  return Object.keys(overrideObj).filter(function (key) {
    return ['adUnitCode', 'bidder'].indexOf(key) === -1;
  }).reduce(function (result, key) {
    logger.logMessage("bidder overrides changed '".concat(result.adUnitCode, "/").concat(result.bidderCode, "' ").concat(bidType, ".").concat(key, " from '").concat(result[key], ".js' to '").concat(overrideObj[key], "'"));
    result[key] = overrideObj[key];
    result.isDebug = true;
    return result;
  }, bidObj);
}
function addBidResponseHook(next, adUnitCode, bid, reject) {
  var overrides = this.overrides,
    logger = this.logger;
  if (bidderExcluded(overrides.bidders, bid.bidderCode)) {
    logger.logWarn("bidder '".concat(bid.bidderCode, "' excluded from auction by bidder overrides"));
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
  var overrides = this.overrides,
    logger = this.logger;
  var includedBidderRequests = bidderRequests.filter(function (bidderRequest) {
    if (bidderExcluded(overrides.bidders, bidderRequest.bidderCode)) {
      logger.logWarn("bidRequest '".concat(bidderRequest.bidderCode, "' excluded from auction by bidder overrides"));
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makePbsInterceptor": function() { return /* binding */ makePbsInterceptor; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/constants.json */ "./src/constants.json");



function makePbsInterceptor(_ref) {
  var createBid = _ref.createBid;
  return function pbsBidInterceptor(next, interceptBids, s2sBidRequest, bidRequests, ajax, _ref2) {
    var onResponse = _ref2.onResponse,
      onError = _ref2.onError,
      onBid = _ref2.onBid;
    var responseArgs;
    var done = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.delayExecution)(function () {
      return onResponse.apply(void 0, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__["default"])(responseArgs));
    }, bidRequests.length + 1);
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
        bid: Object.assign(createBid(_src_constants_json__WEBPACK_IMPORTED_MODULE_2__.STATUS.GOOD, bidRequest), bid)
      });
    }
    bidRequests = bidRequests.map(function (req) {
      return interceptBids({
        bidRequest: req,
        addBid: addBid,
        done: done
      }).bidRequest;
    }).filter(function (req) {
      return req.bids.length > 0;
    });
    if (bidRequests.length > 0) {
      var bidIds = new Set();
      bidRequests.forEach(function (req) {
        return req.bids.forEach(function (bid) {
          return bidIds.add(bid.bidId);
        });
      });
      s2sBidRequest = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepClone)(s2sBidRequest);
      s2sBidRequest.ad_units.forEach(function (unit) {
        unit.bids = unit.bids.filter(function (bid) {
          return bidIds.has(bid.bid_id);
        });
      });
      s2sBidRequest.ad_units = s2sBidRequest.ad_units.filter(function (unit) {
        return unit.bids.length > 0;
      });
      next(s2sBidRequest, bidRequests, ajax, {
        onResponse: signalResponse,
        onError: onError,
        onBid: onBid
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "config": function() { return /* binding */ config; }
/* harmony export */ });
/* unused harmony exports RANDOM, newConfig */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cpmBucketManager.js */ "./src/cpmBucketManager.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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





var DEFAULT_DEBUG = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)(_constants_json__WEBPACK_IMPORTED_MODULE_2__.DEBUG_MODE).toUpperCase() === 'TRUE';
var DEFAULT_BIDDER_TIMEOUT = 3000;
var DEFAULT_ENABLE_SEND_ALL_BIDS = true;
var DEFAULT_DISABLE_AJAX_TIMEOUT = false;
var DEFAULT_BID_CACHE = false;
var DEFAULT_DEVICE_ACCESS = true;
var DEFAULT_MAX_NESTED_IFRAMES = 10;
var DEFAULT_TIMEOUTBUFFER = 400;
var RANDOM = 'random';
var FIXED = 'fixed';
var VALID_ORDERS = {};
VALID_ORDERS[RANDOM] = true;
VALID_ORDERS[FIXED] = true;
var DEFAULT_BIDDER_SEQUENCE = RANDOM;
var GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};
var ALL_TOPICS = '*';
function newConfig() {
  var listeners = [];
  var defaults;
  var config;
  var bidderConfig;
  var currBidder = null;
  function resetConfig() {
    defaults = {};
    function getProp(name) {
      return props[name].val;
    }
    function setProp(name, val) {
      props[name].val = val;
    }
    var props = {
      publisherDomain: {
        set: function set(val) {
          if (val != null) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('publisherDomain is deprecated and has no effect since v7 - use pageUrl instead');
          }
          setProp('publisherDomain', val);
        }
      },
      priceGranularity: {
        val: GRANULARITY_OPTIONS.MEDIUM,
        set: function set(val) {
          if (validatePriceGranularity(val)) {
            if (typeof val === 'string') {
              setProp('priceGranularity', hasGranularity(val) ? val : GRANULARITY_OPTIONS.MEDIUM);
            } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
              setProp('customPriceBucket', val);
              setProp('priceGranularity', GRANULARITY_OPTIONS.CUSTOM);
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('Using custom price granularity');
            }
          }
        }
      },
      customPriceBucket: {
        val: {},
        set: function set() {}
      },
      mediaTypePriceGranularity: {
        val: {},
        set: function set(val) {
          val != null && setProp('mediaTypePriceGranularity', Object.keys(val).reduce(function (aggregate, item) {
            if (validatePriceGranularity(val[item])) {
              if (typeof val === 'string') {
                aggregate[item] = hasGranularity(val[item]) ? val[item] : getProp('priceGranularity');
              } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
                aggregate[item] = val[item];
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Using custom price granularity for ".concat(item));
              }
            } else {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Invalid price granularity for media type: ".concat(item));
            }
            return aggregate;
          }, {}));
        }
      },
      bidderSequence: {
        val: DEFAULT_BIDDER_SEQUENCE,
        set: function set(val) {
          if (VALID_ORDERS[val]) {
            setProp('bidderSequence', val);
          } else {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Invalid order: ".concat(val, ". Bidder Sequence was not set."));
          }
        }
      },
      auctionOptions: {
        val: {},
        set: function set(val) {
          if (validateauctionOptions(val)) {
            setProp('auctionOptions', val);
          }
        }
      }
    };
    var newConfig = {
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
      // timeout buffer to adjust for bidder CDN latency
      timeoutBuffer: DEFAULT_TIMEOUTBUFFER,
      disableAjaxTimeout: DEFAULT_DISABLE_AJAX_TIMEOUT,
      // default max nested iframes for referer detection
      maxNestedIframes: DEFAULT_MAX_NESTED_IFRAMES
    };
    Object.defineProperties(newConfig, Object.fromEntries(Object.entries(props).map(function (_ref) {
      var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, 2),
        k = _ref2[0],
        def = _ref2[1];
      return [k, Object.assign({
        get: getProp.bind(null, k),
        set: setProp.bind(null, k),
        enumerable: true
      }, def)];
    })));
    if (config) {
      callSubscribers(Object.keys(config).reduce(function (memo, topic) {
        if (config[topic] !== newConfig[topic]) {
          memo[topic] = newConfig[topic] || {};
        }
        return memo;
      }, {}));
    }
    config = newConfig;
    bidderConfig = {};
    function hasGranularity(val) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.find)(Object.keys(GRANULARITY_OPTIONS), function (option) {
        return val === GRANULARITY_OPTIONS[option];
      });
    }
    function validatePriceGranularity(val) {
      if (!val) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Prebid Error: no value passed to `setPriceGranularity()`');
        return false;
      }
      if (typeof val === 'string') {
        if (!hasGranularity(val)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.');
        }
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
        if (!(0,_cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_5__.isValidPriceConfig)(val)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Invalid custom price value passed to `setPriceGranularity()`');
          return false;
        }
      }
      return true;
    }
    function validateauctionOptions(val) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Auction Options must be an object');
        return false;
      }
      for (var _i = 0, _Object$keys = Object.keys(val); _i < _Object$keys.length; _i++) {
        var k = _Object$keys[_i];
        if (k !== 'secondaryBidders' && k !== 'suppressStaleRender') {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options given an incorrect param: ".concat(k));
          return false;
        }
        if (k === 'secondaryBidders') {
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options ".concat(k, " must be of type Array"));
            return false;
          } else if (!val[k].every(_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options ".concat(k, " must be only string"));
            return false;
          }
        } else if (k === 'suppressStaleRender') {
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean)(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options ".concat(k, " must be of type boolean"));
            return false;
          }
        }
      }
      return true;
    }
  }

  /**
   * Returns base config with bidder overrides (if there is currently a bidder)
   * @private
   */
  function _getConfig() {
    if (currBidder && bidderConfig && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(bidderConfig[currBidder])) {
      var currBidderConfig = bidderConfig[currBidder];
      var configTopicSet = new Set(Object.keys(config).concat(Object.keys(currBidderConfig)));
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.arrayFrom)(configTopicSet).reduce(function (memo, topic) {
        if (typeof currBidderConfig[topic] === 'undefined') {
          memo[topic] = config[topic];
        } else if (typeof config[topic] === 'undefined') {
          memo[topic] = currBidderConfig[topic];
        } else {
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(currBidderConfig[topic])) {
            memo[topic] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)({}, config[topic], currBidderConfig[topic]);
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
    var conf = _getConfig();
    Object.defineProperty(conf, 'ortb2', {
      get: function get() {
        throw new Error('invalid access to \'orbt2\' config - use request parameters instead');
      }
    });
    return conf;
  }
  var _map = [_getConfig, _getRestrictedConfig].map(function (accessor) {
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
          var option = arguments.length <= 0 ? undefined : arguments[0];
          return option ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(accessor(), option) : _getConfig();
        }
        return subscribe.apply(void 0, arguments);
      };
    }),
    _map2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_map, 2),
    getAnyConfig = _map2[0],
    getConfig = _map2[1];
  var _map3 = [getConfig, getAnyConfig].map(function (wrapee) {
      /*
       * Like getConfig, except that it returns a deepClone of the result.
       */
      return function readConfig() {
        var res = wrapee.apply(void 0, arguments);
        if (res && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__["default"])(res) === 'object') {
          res = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(res);
        }
        return res;
      };
    }),
    _map4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_map3, 2),
    readConfig = _map4[0],
    readAnyConfig = _map4[1];

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
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(options)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('setConfig options must be an object');
      return;
    }
    var topics = Object.keys(options);
    var topicalConfig = {};
    topics.forEach(function (topic) {
      var option = options[topic];
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(defaults[topic]) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(option)) {
        option = Object.assign({}, defaults[topic], option);
      }
      try {
        topicalConfig[topic] = config[topic] = option;
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Cannot set config for property ".concat(topic, " : "), e);
      }
    });
    callSubscribers(topicalConfig);
  }

  /**
   * Sets configuration defaults which setConfig values can be applied on top of
   * @param {object} options
   */
  function setDefaults(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(defaults)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('defaults must be an object');
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
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = listener;
    if (typeof topic !== 'string') {
      // first param should be callback function in this case,
      // meaning it gets called for any config change
      callback = topic;
      topic = ALL_TOPICS;
      options = listener || {};
    }
    if (typeof callback !== 'function') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('listener must be a function');
      return;
    }
    var nl = {
      topic: topic,
      callback: callback
    };
    listeners.push(nl);
    if (options.init) {
      if (topic === ALL_TOPICS) {
        callback(getConfig());
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        callback((0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, topic, getConfig(topic)));
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
    var TOPICS = Object.keys(options);

    // call subscribers of a specific topic, passing only that configuration
    listeners.filter(function (listener) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(TOPICS, listener.topic);
    }).forEach(function (listener) {
      listener.callback((0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, listener.topic, options[listener.topic]));
    });

    // call subscribers that didn't give a topic, passing everything that was set
    listeners.filter(function (listener) {
      return listener.topic === ALL_TOPICS;
    }).forEach(function (listener) {
      return listener.callback(options);
    });
  }
  function setBidderConfig(config) {
    var mergeFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    try {
      check(config);
      config.bidders.forEach(function (bidder) {
        if (!bidderConfig[bidder]) {
          bidderConfig[bidder] = {};
        }
        Object.keys(config.config).forEach(function (topic) {
          var option = config.config[topic];
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(option)) {
            var func = mergeFlag ? _utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep : Object.assign;
            bidderConfig[bidder][topic] = func({}, bidderConfig[bidder][topic] || {}, option);
          } else {
            bidderConfig[bidder][topic] = option;
          }
        });
      });
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(e);
    }
    function check(obj) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(obj)) {
        throw 'setBidderConfig bidder options must be an object';
      }
      if (!(Array.isArray(obj.bidders) && obj.bidders.length)) {
        throw 'setBidderConfig bidder options must contain a bidders list with at least 1 bidder';
      }
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(obj.config)) {
        throw 'setBidderConfig bidder options must contain a config object';
      }
    }
  }
  function mergeConfig(obj) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(obj)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('mergeConfig input must be an object');
      return;
    }
    var mergedConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)(_getConfig(), obj);
    setConfig(_objectSpread({}, mergedConfig));
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
          return runWithBidder(bidder, cb.bind.apply(cb, [this].concat(args)));
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('config.callbackWithBidder callback is not a function');
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
    getCurrentBidder: getCurrentBidder,
    resetBidder: resetBidder,
    getConfig: getConfig,
    getAnyConfig: getAnyConfig,
    readConfig: readConfig,
    readAnyConfig: readAnyConfig,
    setConfig: setConfig,
    mergeConfig: mergeConfig,
    setDefaults: setDefaults,
    resetConfig: resetConfig,
    runWithBidder: runWithBidder,
    callbackWithBidder: callbackWithBidder,
    setBidderConfig: setBidderConfig,
    getBidderConfig: getBidderConfig,
    mergeBidderConfig: mergeBidderConfig
  };
}

/**
 * Set a `cache.url` if we should use prebid-cache to store video bids before adding bids to the auction.
 * This must be set if you want to use the dfpAdServerVideo module.
 */
var config = newConfig();

/***/ }),

/***/ "./src/cpmBucketManager.js":
/*!*********************************!*\
  !*** ./src/cpmBucketManager.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isValidPriceConfig": function() { return /* binding */ isValidPriceConfig; }
/* harmony export */ });
/* unused harmony export getPriceBucketString */
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");



var _defaultPrecision = 2;
var _lgPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.5
  }]
};
var _mgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.1
  }]
};
var _hgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.01
  }]
};
var _densePriceConfig = {
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
var _autoPriceConfig = {
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
  var granularityMultiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var cpmFloat = parseFloat(cpm);
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
  var cpmStr = '';
  if (!isValidPriceConfig(config)) {
    return cpmStr;
  }
  var cap = config.buckets.reduce(function (prev, curr) {
    if (prev.max > curr.max) {
      return prev;
    }
    return curr;
  }, {
    'max': 0
  });
  var bucketFloor = 0;
  var bucket = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_0__.find)(config.buckets, function (bucket) {
    if (cpm > cap.max * granularityMultiplier) {
      // cpm exceeds cap, just return the cap.
      var precision = bucket.precision;
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
  var isValid = true;
  config.buckets.forEach(function (bucket) {
    if (!bucket.max || !bucket.increment) {
      isValid = false;
    }
  });
  return isValid;
}
function getCpmTarget(cpm, bucket, granularityMultiplier) {
  var precision = typeof bucket.precision !== 'undefined' ? bucket.precision : _defaultPrecision;
  var increment = bucket.increment * granularityMultiplier;
  var bucketMin = bucket.min * granularityMultiplier;
  var roundingFunction = Math.floor;
  var customRoundingFunction = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('cpmRoundingFunction');
  if (typeof customRoundingFunction === 'function') {
    roundingFunction = customRoundingFunction;
  }

  // start increments at the bucket min and then add bucket min back to arrive at the correct rounding
  // note - we're padding the values to avoid using decimals in the math prior to flooring
  // this is done as JS can return values slightly below the expected mark which would skew the price bucket target
  //   (eg 4.01 / 0.01 = 400.99999999999994)
  // min precison should be 2 to move decimal place over.
  var pow = Math.pow(10, precision + 2);
  var cpmToRound = (cpm * pow - bucketMin * pow) / (increment * pow);
  var cpmTarget;
  var invalidRounding;
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayFrom": function() { return /* binding */ arrayFrom; },
/* harmony export */   "find": function() { return /* binding */ find; },
/* harmony export */   "includes": function() { return /* binding */ includes; }
/* harmony export */ });
/* unused harmony export findIndex */
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGlobal": function() { return /* binding */ getGlobal; }
/* harmony export */ });
/* unused harmony export registerModule */
// if $$PREBID_GLOBAL$$ already exists in global document scope, use it, if not, create the object
// global defination should happen BEFORE imports to avoid global undefined errors.
/* global $$DEFINE_PREBID_GLOBAL$$ */
var scope =  false ? 0 : window;
var global = scope.pbjs = scope.pbjs || {};
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deepClone": function() { return /* binding */ deepClone; },
/* harmony export */   "deepEqual": function() { return /* binding */ deepEqual; },
/* harmony export */   "delayExecution": function() { return /* binding */ delayExecution; },
/* harmony export */   "getParameterByName": function() { return /* binding */ getParameterByName; },
/* harmony export */   "isArray": function() { return /* binding */ isArray; },
/* harmony export */   "isBoolean": function() { return /* binding */ isBoolean; },
/* harmony export */   "isEmpty": function() { return /* binding */ isEmpty; },
/* harmony export */   "isPlainObject": function() { return /* binding */ isPlainObject; },
/* harmony export */   "isStr": function() { return /* binding */ isStr; },
/* harmony export */   "logError": function() { return /* binding */ logError; },
/* harmony export */   "logMessage": function() { return /* binding */ logMessage; },
/* harmony export */   "logWarn": function() { return /* binding */ logWarn; },
/* harmony export */   "mergeDeep": function() { return /* binding */ mergeDeep; }
/* harmony export */ });
/* unused harmony exports _setEventEmitter, internal, getPrebidInternal, getUniqueIdentifierStr, generateUUID, getBidIdParameter, parseQueryStringParameters, transformAdServerTargetingObj, parseSizesInput, parseGPTSingleSizeArray, parseGPTSingleSizeArrayToRtbSize, getWindowTop, getWindowSelf, getWindowLocation, logInfo, prefixLog, hasConsoleLogger, debugTurnedOn, createIframe, createInvisibleIframe, isA, isFn, isNumber, isEmptyStr, _each, contains, _map, insertElement, waitForElementToLoad, triggerPixel, callBurl, insertHtmlIntoIframe, insertUserSyncIframe, createTrackPixelHtml, createTrackPixelIframeHtml, uniques, flatten, getBidRequest, getValue, getBidderCodes, isGptPubadsDefined, isApnGetTagDefined, shuffle, inIframe, isSafariBrowser, replaceMacros, replaceAuctionPrice, replaceClickThrough, timestamp, getPerformanceNow, hasDeviceAccess, checkCookieSupport, groupBy, getDefinedParams, isValidMediaTypes, getUserConfiguredParams, getDNT, compareCodeAndSlot, isAdUnitCodeMatchingSlot, unsupportedBidderMessage, isInteger, cleanObj, pick, isArrayOfNums, parseQS, formatQS, parseUrl, buildUrl, cyrb53Hash, safeJSONParse, memoize, setScriptAttributes, binarySearch */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var just_clone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! just-clone */ "./node_modules/just-clone/index.js");
/* harmony import */ var just_clone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(just_clone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");












var tStr = 'String';
var tFn = 'Function';
var tNumb = 'Number';
var tObject = 'Object';
var tBoolean = 'Boolean';
var toString = Object.prototype.toString;
var consoleExists = Boolean(window.console);
var consoleLogExists = Boolean(consoleExists && window.console.log);
var consoleInfoExists = Boolean(consoleExists && window.console.info);
var consoleWarnExists = Boolean(consoleExists && window.console.warn);
var consoleErrorExists = Boolean(consoleExists && window.console.error);
var eventEmitter;
var pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
function _setEventEmitter(emitFn) {
  // called from events.js - this hoop is to avoid circular imports
  eventEmitter = emitFn;
}
function emitEvent() {
  if (eventEmitter != null) {
    eventEmitter.apply(void 0, arguments);
  }
}

// this allows stubbing of utility functions that are used internally by other utility functions
var internal = {
  checkCookieSupport: checkCookieSupport,
  createTrackPixelIframeHtml: createTrackPixelIframeHtml,
  getWindowSelf: getWindowSelf,
  getWindowTop: getWindowTop,
  getWindowLocation: getWindowLocation,
  insertUserSyncIframe: insertUserSyncIframe,
  insertElement: insertElement,
  isFn: isFn,
  triggerPixel: triggerPixel,
  logError: logError,
  logWarn: logWarn,
  logMessage: logMessage,
  logInfo: logInfo,
  parseQS: parseQS,
  formatQS: formatQS,
  deepEqual: deepEqual
};
var prebidInternal = {};
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
  return (paramsObj === null || paramsObj === void 0 ? void 0 : paramsObj[key]) || '';
}

// parse a query string object passed in bid params
// bid params should be an object such as {key: "value", key1 : "value1"}
// aliases to formatQS
function parseQueryStringParameters(queryObj) {
  var result = '';
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
    return Object.keys(targeting).map(function (key) {
      return "".concat(key, "=").concat(encodeURIComponent(targeting[key]));
    }).join('&');
  } else {
    return '';
  }
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of sizes `["300x250"]` or '['300x250', '970x90']'
 * @param  {(Array.<number[]>|Array.<number>)} sizeObj Input array or double array [300,250] or [[300,250], [728,90]]
 * @return {Array.<string>}  Array of strings like `["300x250"]` or `["300x250", "728x90"]`
 */
function parseSizesInput(sizeObj) {
  if (typeof sizeObj === 'string') {
    // multiple sizes will be comma-separated
    return sizeObj.split(',').filter(function (sz) {
      return sz.match(/^(\d)+x(\d)+$/i);
    });
  } else if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(sizeObj) === 'object') {
    if (sizeObj.length === 2 && typeof sizeObj[0] === 'number' && typeof sizeObj[1] === 'number') {
      return [parseGPTSingleSizeArray(sizeObj)];
    } else {
      return sizeObj.map(parseGPTSingleSizeArray);
    }
  }
  return [];
}

// Parse a GPT style single size array, (i.e [300, 250])
// into an AppNexus style string, (i.e. 300x250)
function parseGPTSingleSizeArray(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return singleSize[0] + 'x' + singleSize[1];
  }
}

// Parse a GPT style single size array, (i.e [300, 250])
// into OpenRTB-compatible (imp.banner.w/h, imp.banner.format.w/h, imp.video.w/h) object(i.e. {w:300, h:250})
function parseGPTSingleSizeArrayToRtbSize(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return {
      w: singleSize[0],
      h: singleSize[1]
    };
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
  emitEvent(_constants_json__WEBPACK_IMPORTED_MODULE_3__.EVENTS.AUCTION_DEBUG, {
    type: 'WARNING',
    arguments: arguments
  });
}
function logError() {
  if (debugTurnedOn() && consoleErrorExists) {
    // eslint-disable-next-line no-console
    console.error.apply(console, decorateLog(arguments, 'ERROR:'));
  }
  emitEvent(_constants_json__WEBPACK_IMPORTED_MODULE_3__.EVENTS.AUCTION_DEBUG, {
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
      fn.apply(void 0, [prefix].concat(args));
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
  var bidder = _config_js__WEBPACK_IMPORTED_MODULE_4__.config.getCurrentBidder();
  prefix && args.unshift(prefix);
  if (bidder) {
    args.unshift(label('#aaa'));
  }
  args.unshift(label('#3b88c3'));
  args.unshift('%cPrebid' + (bidder ? "%c".concat(bidder) : ''));
  return args;
  function label(color) {
    return "display: inline-block; color: #fff; background: ".concat(color, "; padding: 1px 4px; border-radius: 3px;");
  }
}
function hasConsoleLogger() {
  return consoleLogExists;
}
function debugTurnedOn() {
  return !!_config_js__WEBPACK_IMPORTED_MODULE_4__.config.getConfig('debug');
}
var createIframe = function () {
  var DEFAULTS = {
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
    var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var f = doc.createElement('iframe');
    Object.assign(f, Object.assign({}, DEFAULTS, attrs));
    Object.assign(f.style, style);
    return f;
  };
}();
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
var isArray = Array.isArray.bind(Array);
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
 * @param {Function(value, key, object)} fn
 */
function _each(object, fn) {
  var _this = this;
  if (isFn(object === null || object === void 0 ? void 0 : object.forEach)) return object.forEach(fn, this);
  Object.entries(object || {}).forEach(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];
    return fn.call(_this, v, k);
  });
}
function contains(a, obj) {
  return isFn(a === null || a === void 0 ? void 0 : a.includes) && a.includes(obj);
}

/**
 * Map an array or object into another array
 * given a function
 * @param {Array|Object} object
 * @param {Function(value, key, object)} callback
 * @return {Array}
 */
function _map(object, callback) {
  if (isFn(object === null || object === void 0 ? void 0 : object.map)) return object.map(callback);
  return Object.entries(object || {}).map(function (_ref3) {
    var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_ref3, 2),
      k = _ref4[0],
      v = _ref4[1];
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
  var parentEl;
  if (target) {
    parentEl = doc.getElementsByTagName(target);
  } else {
    parentEl = doc.getElementsByTagName('head');
  }
  try {
    parentEl = parentEl.length ? parentEl : doc.getElementsByTagName('body');
    if (parentEl.length) {
      parentEl = parentEl[0];
      var insertBeforeEl = asLastChildChild ? null : parentEl.firstChild;
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
  var timer = null;
  return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__.GreedyPromise(function (resolve) {
    var onLoad = function onLoad() {
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
  var img = new Image();
  if (done && internal.isFn(done)) {
    waitForElementToLoad(img, timeout).then(done);
  }
  img.src = url;
}
function callBurl(_ref5) {
  var source = _ref5.source,
    burl = _ref5.burl;
  if (source === _constants_json__WEBPACK_IMPORTED_MODULE_3__.S2S.SRC && burl) {
    internal.triggerPixel(burl);
  }
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
  var iframe = createInvisibleIframe();
  internal.insertElement(iframe, document, 'body');
  (function (doc) {
    doc.open();
    doc.write(htmlCode);
    doc.close();
  })(iframe.contentWindow.document);
}

/**
 * Inserts empty iframe with the specified `url` for cookie sync
 * @param  {string} url URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 * @param  {function} [done] an optional exit callback, used when this usersync pixel is added during an async process
 * @param  {Number} [timeout] an optional timeout in milliseconds for the iframe to load before calling `done`
 */
function insertUserSyncIframe(url, done, timeout) {
  var iframeHtml = internal.createTrackPixelIframeHtml(url, false, 'allow-scripts allow-same-origin');
  var div = document.createElement('div');
  div.innerHTML = iframeHtml;
  var iframe = div.firstChild;
  if (done && internal.isFn(done)) {
    waitForElementToLoad(iframe, timeout).then(done);
  }
  internal.insertElement(iframe, document, 'html', true);
}

/**
 * Creates a snippet of HTML that retrieves the specified `url`
 * @param  {string} url URL to be requested
 * @return {string}     HTML snippet that contains the img src = set to `url`
 */
function createTrackPixelHtml(url) {
  if (!url) {
    return '';
  }
  var escapedUrl = encodeURI(url);
  var img = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
  img += '<img src="' + escapedUrl + '"></div>';
  return img;
}
;

/**
 * Creates a snippet of Iframe HTML that retrieves the specified `url`
 * @param  {string} url plain URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 * @param  {string} sandbox string if provided the sandbox attribute will be included with the given value
 * @return {string}     HTML snippet that contains the iframe src = set to `url`
 */
function createTrackPixelIframeHtml(url) {
  var encodeUri = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var sandbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (!url) {
    return '';
  }
  if (encodeUri) {
    url = encodeURI(url);
  }
  if (sandbox) {
    sandbox = "sandbox=\"".concat(sandbox, "\"");
  }
  return "<iframe ".concat(sandbox, " id=\"").concat(getUniqueIdentifierStr(), "\"\n      frameborder=\"0\"\n      allowtransparency=\"true\"\n      marginheight=\"0\" marginwidth=\"0\"\n      width=\"0\" hspace=\"0\" vspace=\"0\" height=\"0\"\n      style=\"height:0px;width:0px;display:none;\"\n      scrolling=\"no\"\n      src=\"").concat(url, "\">\n    </iframe>");
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
  return bidderRequests.flatMap(function (br) {
    return br.bids;
  }).find(function (bid) {
    return ['bidId', 'adId', 'bid_id'].some(function (prop) {
      return bid[prop] === id;
    });
  });
}
function getValue(obj, key) {
  return obj[key];
}
function getBidderCodes() {
  var adUnits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pbjsInstance.adUnits;
  // this could memoize adUnits
  return adUnits.map(function (unit) {
    return unit.bids.map(function (bid) {
      return bid.bidder;
    }).reduce(flatten, []);
  }).reduce(flatten, []).filter(function (bidder) {
    return typeof bidder !== 'undefined';
  }).filter(uniques);
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

/**
 * Fisher–Yates shuffle
 * http://stackoverflow.com/a/6274398
 * https://bost.ocks.org/mike/shuffle/
 * istanbul ignore next
 */
function shuffle(array) {
  var counter = array.length;

  // while there are elements in the array
  while (counter > 0) {
    // pick a random index
    var index = Math.floor(Math.random() * counter);

    // decrease counter by 1
    counter--;

    // and swap the last element with it
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function deepClone(obj) {
  return just_clone__WEBPACK_IMPORTED_MODULE_0___default()(obj);
}
function inIframe() {
  try {
    return internal.getWindowSelf() !== internal.getWindowTop();
  } catch (e) {
    return true;
  }
}
function isSafariBrowser() {
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
function replaceMacros(str, subs) {
  if (!str) return;
  return Object.entries(subs).reduce(function (str, _ref6) {
    var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_ref6, 2),
      key = _ref7[0],
      val = _ref7[1];
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
 * When the deviceAccess flag config option is false, no cookies should be read or set
 * @returns {boolean}
 */
function hasDeviceAccess() {
  return _config_js__WEBPACK_IMPORTED_MODULE_4__.config.getConfig('deviceAccess') !== false;
}

/**
 * @returns {(boolean|undefined)}
 */
function checkCookieSupport() {
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
    throw new Error("numRequiredCalls must be a positive number. Got ".concat(numRequiredCalls));
  }
  var numCalls = 0;
  return function () {
    numCalls++;
    if (numCalls === numRequiredCalls) {
      func.apply(this, arguments);
    }
  };
}

/**
 * https://stackoverflow.com/a/34890276/428704
 * @export
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
  return params.filter(function (param) {
    return object[param];
  }).reduce(function (bid, param) {
    return Object.assign(bid, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, param, object[param]));
  }, {});
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
  var SUPPORTED_MEDIA_TYPES = ['banner', 'native', 'video'];
  var SUPPORTED_STREAM_TYPES = ['instream', 'outstream', 'adpod'];
  var types = Object.keys(mediaTypes);
  if (!types.every(function (type) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_8__.includes)(SUPPORTED_MEDIA_TYPES, type);
  })) {
    return false;
  }
  if ( true && mediaTypes.video && mediaTypes.video.context) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_8__.includes)(SUPPORTED_STREAM_TYPES, mediaTypes.video.context);
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
  return adUnits.filter(function (adUnit) {
    return adUnit.code === adUnitCode;
  }).flatMap(function (adUnit) {
    return adUnit.bids;
  }).filter(function (bidderData) {
    return bidderData.bidder === bidder;
  }).map(function (bidderData) {
    return bidderData.params || {};
  });
}

/**
 * Returns Do Not Track state
 */
function getDNT() {
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1' || navigator.doNotTrack === 'yes';
}
var compareCodeAndSlot = function compareCodeAndSlot(slot, adUnitCode) {
  return slot.getAdUnitPath() === adUnitCode || slot.getSlotElementId() === adUnitCode;
};

/**
 * Returns filter function to match adUnitCode in slot
 * @param {Object} slot GoogleTag slot
 * @return {function} filter function
 */
function isAdUnitCodeMatchingSlot(slot) {
  return function (adUnitCode) {
    return compareCodeAndSlot(slot, adUnitCode);
  };
}

/**
 * Constructs warning message for when unsupported bidders are dropped from an adunit
 * @param {Object} adUnit ad unit from which the bidder is being dropped
 * @param {string} bidder bidder code that is not compatible with the adUnit
 * @return {string} warning message to display when condition is met
 */
function unsupportedBidderMessage(adUnit, bidder) {
  var mediaType = Object.keys(adUnit.mediaTypes || {
    'banner': 'banner'
  }).join(', ');
  return "\n    ".concat(adUnit.code, " is a ").concat(mediaType, " ad unit\n    containing bidders that don't support ").concat(mediaType, ": ").concat(bidder, ".\n    This bidder won't fetch demand.\n  ");
}

/**
 * Checks input is integer or not
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value
 */
var isInteger = Number.isInteger.bind(Number);

/**
 * Returns a new object with undefined properties removed from given object
 * @param obj the object to clean
 */
function cleanObj(obj) {
  return Object.fromEntries(Object.entries(obj).filter(function (_ref8) {
    var _ref9 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_ref8, 2),
      _ = _ref9[0],
      v = _ref9[1];
    return typeof v !== 'undefined';
  }));
}

/**
 * Create a new object with selected properties.  Also allows property renaming and transform functions.
 * @param obj the original object
 * @param properties An array of desired properties
 */
function pick(obj, properties) {
  if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(obj) !== 'object') {
    return {};
  }
  return properties.reduce(function (newObj, prop, i) {
    if (typeof prop === 'function') {
      return newObj;
    }
    var newProp = prop;
    var match = prop.match(/^(.+?)\sas\s(.+?)$/i);
    if (match) {
      prop = match[1];
      newProp = match[2];
    }
    var value = obj[prop];
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
  return isArray(val) && (size ? val.length === size : true) && val.every(function (v) {
    return isInteger(v);
  });
}
function parseQS(query) {
  return !query ? {} : query.replace(/^\?/, '').split('&').reduce(function (acc, criteria) {
    var _criteria$split = criteria.split('='),
      _criteria$split2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_criteria$split, 2),
      k = _criteria$split2[0],
      v = _criteria$split2[1];
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
  return Object.keys(query).map(function (k) {
    return Array.isArray(query[k]) ? query[k].map(function (v) {
      return "".concat(k, "[]=").concat(v);
    }).join('&') : "".concat(k, "=").concat(query[k]);
  }).join('&');
}
function parseUrl(url, options) {
  var parsed = document.createElement('a');
  if (options && 'noDecodeWholeURL' in options && options.noDecodeWholeURL) {
    parsed.href = url;
  } else {
    parsed.href = decodeURIComponent(url);
  }
  // in window.location 'search' is string, not object
  var qsAsString = options && 'decodeSearchAsString' in options && options.decodeSearchAsString;
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
  return (obj.protocol || 'http') + '://' + (obj.host || obj.hostname + (obj.port ? ":".concat(obj.port) : '')) + (obj.pathname || '') + (obj.search ? "?".concat(internal.formatQS(obj.search || '')) : '') + (obj.hash ? "#".concat(obj.hash) : '');
}

/**
 * This function deeply compares two objects checking for their equivalence.
 * @param {Object} obj1
 * @param {Object} obj2
 * @param checkTypes {boolean} if set, two objects with identical properties but different constructors will *not*
 * be considered equivalent.
 * @returns {boolean}
 */
function deepEqual(obj1, obj2) {
  var _ref10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref10$checkTypes = _ref10.checkTypes,
    checkTypes = _ref10$checkTypes === void 0 ? false : _ref10$checkTypes;
  if (obj1 === obj2) return true;else if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(obj1) === 'object' && obj1 !== null && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(obj2) === 'object' && obj2 !== null && (!checkTypes || obj1.constructor === obj2.constructor)) {
    var props1 = Object.keys(obj1);
    if (props1.length !== Object.keys(obj2).length) return false;
    for (var _i = 0, _props = props1; _i < _props.length; _i++) {
      var prop = _props[_i];
      if (obj2.hasOwnProperty(prop)) {
        if (!deepEqual(obj1[prop], obj2[prop], {
          checkTypes: checkTypes
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
  var source = sources.shift();
  if (isPlainObject(target) && isPlainObject(source)) {
    var _loop = function _loop(key) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Object.assign(target, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, {}));
        mergeDeep(target[key], source[key]);
      } else if (isArray(source[key])) {
        if (!target[key]) {
          Object.assign(target, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_9__["default"])(source[key])));
        } else if (isArray(target[key])) {
          source[key].forEach(function (obj) {
            var addItFlag = 1;
            for (var i = 0; i < target[key].length; i++) {
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
        Object.assign(target, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, source[key]));
      }
    };
    for (var key in source) {
      _loop(key);
    }
  }
  return mergeDeep.apply(void 0, [target].concat(sources));
}

/**
 * returns a hash of a string using a fast algorithm
 * source: https://stackoverflow.com/a/52171480/845390
 * @param str
 * @param seed (optional)
 * @returns {string}
 */
function cyrb53Hash(str) {
  var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // IE doesn't support imul
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill
  var imul = function imul(opA, opB) {
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
  var h1 = 0xdeadbeef ^ seed;
  var h2 = 0x41c6ce57 ^ seed;
  for (var i = 0, ch; i < str.length; i++) {
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

/**
 * Returns a memoized version of `fn`.
 *
 * @param fn
 * @param key cache key generator, invoked with the same arguments passed to `fn`.
 *        By default, the first argument is used as key.
 * @return {function(): any}
 */
function memoize(fn) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (arg) {
    return arg;
  };
  var cache = new Map();
  var memoized = function memoized() {
    var cacheKey = key.apply(this, arguments);
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, fn.apply(this, arguments));
    }
    return cache.get(cacheKey);
  };
  memoized.clear = cache.clear.bind(cache);
  return memoized;
}

/**
 * Sets dataset attributes on a script
 * @param {Script} script
 * @param {object} attributes
 */
function setScriptAttributes(script, attributes) {
  Object.entries(attributes).forEach(function (_ref11) {
    var _ref12 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_ref11, 2),
      k = _ref12[0],
      v = _ref12[1];
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
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (el) {
    return el;
  };
  var left = 0;
  var right = arr.length && arr.length - 1;
  var target = key(el);
  while (right - left > 1) {
    var middle = left + Math.round((right - left) / 2);
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

/***/ }),

/***/ "./src/utils/promise.js":
/*!******************************!*\
  !*** ./src/utils/promise.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GreedyPromise": function() { return /* binding */ GreedyPromise; }
/* harmony export */ });
/* unused harmony export defer */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldGet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldSet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js");





function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }
function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }
var SUCCESS = 0;
var FAIL = 1;

/**
 * A version of Promise that runs callbacks synchronously when it can (i.e. after it's been fulfilled or rejected).
 */
var _result = /*#__PURE__*/new WeakMap();
var _callbacks = /*#__PURE__*/new WeakMap();
var GreedyPromise = /*#__PURE__*/function () {
  function GreedyPromise(resolver) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, GreedyPromise);
    _classPrivateFieldInitSpec(this, _result, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _callbacks, {
      writable: true,
      value: void 0
    });
    if (typeof resolver !== 'function') {
      throw new Error('resolver not a function');
    }
    var result = [];
    var callbacks = [];
    var _map = [SUCCESS, FAIL].map(function (type) {
        return function (value) {
          if (type === SUCCESS && typeof (value === null || value === void 0 ? void 0 : value.then) === 'function') {
            value.then(resolve, reject);
          } else if (!result.length) {
            result.push(type, value);
            while (callbacks.length) {
              callbacks.shift()();
            }
          }
        };
      }),
      _map2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_map, 2),
      resolve = _map2[0],
      reject = _map2[1];
    try {
      resolver(resolve, reject);
    } catch (e) {
      reject(e);
    }
    (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_2__["default"])(this, _result, result);
    (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_2__["default"])(this, _callbacks, callbacks);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(GreedyPromise, [{
    key: "then",
    value: function then(onSuccess, onError) {
      var _this = this;
      var result = (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_4__["default"])(this, _result);
      return new this.constructor(function (resolve, reject) {
        var continuation = function continuation() {
          var value = result[1];
          var _ref = result[0] === SUCCESS ? [onSuccess, resolve] : [onError, reject],
            _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, 2),
            handler = _ref2[0],
            resolveFn = _ref2[1];
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
        result.length ? continuation() : (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_4__["default"])(_this, _callbacks).push(continuation);
      });
    }
  }, {
    key: "catch",
    value: function _catch(onError) {
      return this.then(null, onError);
    }
  }, {
    key: "finally",
    value: function _finally(onFinally) {
      var _this2 = this;
      var val;
      return this.then(function (v) {
        val = v;
        return onFinally();
      }, function (e) {
        val = _this2.constructor.reject(e);
        return onFinally();
      }).then(function () {
        return val;
      });
    }
  }], [{
    key: "timeout",
    value:
    /**
     * Convenience wrapper for setTimeout; takes care of returning an already fulfilled GreedyPromise when the delay is zero.
     *
     * @param {Number} delayMs delay in milliseconds
     * @returns {GreedyPromise} a promise that resolves (to undefined) in `delayMs` milliseconds
     */
    function timeout() {
      var delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return new GreedyPromise(function (resolve) {
        delayMs === 0 ? resolve() : setTimeout(resolve, delayMs);
      });
    }
  }, {
    key: "race",
    value: function race(promises) {
      var _this3 = this;
      return new this(function (resolve, reject) {
        _classStaticPrivateMethodGet(_this3, GreedyPromise, _collect).call(_this3, promises, function (success, result) {
          return success ? resolve(result) : reject(result);
        });
      });
    }
  }, {
    key: "all",
    value: function all(promises) {
      var _this4 = this;
      return new this(function (resolve, reject) {
        var res = [];
        _classStaticPrivateMethodGet(_this4, GreedyPromise, _collect).call(_this4, promises, function (success, val, i) {
          return success ? res[i] = val : reject(val);
        }, function () {
          return resolve(res);
        });
      });
    }
  }, {
    key: "allSettled",
    value: function allSettled(promises) {
      var _this5 = this;
      return new this(function (resolve) {
        var res = [];
        _classStaticPrivateMethodGet(_this5, GreedyPromise, _collect).call(_this5, promises, function (success, val, i) {
          return res[i] = success ? {
            status: 'fulfilled',
            value: val
          } : {
            status: 'rejected',
            reason: val
          };
        }, function () {
          return resolve(res);
        });
      });
    }
  }, {
    key: "resolve",
    value: function resolve(value) {
      return new this(function (resolve) {
        return resolve(value);
      });
    }
  }, {
    key: "reject",
    value: function reject(error) {
      return new this(function (resolve, reject) {
        return reject(error);
      });
    }
  }]);
  return GreedyPromise;
}();

/**
 * @returns a {promise, resolve, reject} trio where `promise` is resolved by calling `resolve` or `reject`.
 */
function _collect(promises, collector, done) {
  var _this6 = this;
  var cnt = promises.length;
  function clt() {
    collector.apply(this, arguments);
    if (--cnt <= 0 && done) done();
  }
  promises.length === 0 && done ? done() : promises.forEach(function (p, i) {
    return _this6.resolve(p).then(function (val) {
      return clt(true, val, i);
    }, function (err) {
      return clt(false, err, i);
    });
  });
}
function defer() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref3$promiseFactory = _ref3.promiseFactory,
    promiseFactory = _ref3$promiseFactory === void 0 ? function (resolver) {
      return new GreedyPromise(resolver);
    } : _ref3$promiseFactory;
  function invoker(delegate) {
    return function (val) {
      return delegate(val);
    };
  }
  var resolveFn, rejectFn;
  return {
    promise: promiseFactory(function (resolve, reject) {
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ dlv; }
/* harmony export */ });
function dlv(obj, key, def, p, undef) {
	key = key.split ? key.split('.') : key;
	for (p = 0; p < key.length; p++) {
		obj = obj ? obj[key[p]] : undef;
	}
	return obj === undef ? def : obj;
}


/***/ }),

/***/ "./node_modules/just-clone/index.js":
/*!******************************************!*\
  !*** ./node_modules/just-clone/index.js ***!
  \******************************************/
/***/ (function(module) {

module.exports = clone;

/*
  Identical to `just-extend(true, {}, obj1)`

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}  
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    // include prototype properties
    var value = obj[key];
    if (value && typeof value == 'object') {
      result[key] = clone(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorGet.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorGet.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classApplyDescriptorGet; }
/* harmony export */ });
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorSet.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorSet.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classApplyDescriptorSet; }
/* harmony export */ });
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classCallCheck; }
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classExtractFieldDescriptor; }
/* harmony export */ });
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classPrivateFieldGet; }
/* harmony export */ });
/* harmony import */ var _classApplyDescriptorGet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classApplyDescriptorGet.js */ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorGet.js");
/* harmony import */ var _classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classExtractFieldDescriptor.js */ "./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js");


function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = (0,_classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(receiver, privateMap, "get");
  return (0,_classApplyDescriptorGet_js__WEBPACK_IMPORTED_MODULE_1__["default"])(receiver, descriptor);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classPrivateFieldSet; }
/* harmony export */ });
/* harmony import */ var _classApplyDescriptorSet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classApplyDescriptorSet.js */ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorSet.js");
/* harmony import */ var _classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classExtractFieldDescriptor.js */ "./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js");


function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = (0,_classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(receiver, privateMap, "set");
  (0,_classApplyDescriptorSet_js__WEBPACK_IMPORTED_MODULE_1__["default"])(receiver, descriptor, value);
  return value;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _createClass; }
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./src/constants.json":
/*!****************************!*\
  !*** ./src/constants.json ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"DEBUG_MODE":"pbjs_debug","STATUS":{"GOOD":1},"EVENTS":{"AUCTION_DEBUG":"auctionDebug"},"S2S":{"SRC":"s2s"}}');

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*****************************************!*\
  !*** ./modules/debugging/standalone.js ***!
  \*****************************************/
/* harmony import */ var _debugging_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debugging.js */ "./modules/debugging/debugging.js");

window._pbjsGlobals.forEach(function (name) {
  if (window[name] && window[name]._installDebugging === true) {
    window[name]._installDebugging = _debugging_js__WEBPACK_IMPORTED_MODULE_0__.install;
  }
});
}();
/******/ })()
;
//# sourceMappingURL=debugging-standalone.js.map