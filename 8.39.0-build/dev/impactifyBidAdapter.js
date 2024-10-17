"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["impactifyBidAdapter"],{

/***/ "./modules/impactifyBidAdapter.js":
/*!****************************************!*\
  !*** ./modules/impactifyBidAdapter.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports STORAGE, STORAGE_KEY, spec */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_ajax_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/ajax.js */ "./src/ajax.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");





function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }







/**
 * @typedef {import('../src/adapters/bidderFactory.js').BidRequest} BidRequest
 * @typedef {import('../src/adapters/bidderFactory.js').Bid} Bid
 * @typedef {import('../src/adapters/bidderFactory.js').ServerResponse} ServerResponse
 * @typedef {import('../src/adapters/bidderFactory.js').SyncOptions} SyncOptions
 * @typedef {import('../src/adapters/bidderFactory.js').UserSync} UserSync
 */

var BIDDER_CODE = 'impactify';
var BIDDER_ALIAS = ['imp'];
var DEFAULT_CURRENCY = 'USD';
var DEFAULT_VIDEO_WIDTH = 640;
var DEFAULT_VIDEO_HEIGHT = 360;
var ORIGIN = 'https://sonic.impactify.media';
var LOGGER_URI = 'https://logger.impactify.media';
var AUCTION_URI = '/bidder';
var COOKIE_SYNC_URI = '/static/cookie_sync.html';
var GVL_ID = 606;
var GET_CONFIG = _src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig;
var STORAGE = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_2__.getStorageManager)({
  gvlid: GVL_ID,
  bidderCode: BIDDER_CODE
});
var STORAGE_KEY = '_im_str';

/**
 * Helpers object
 * @type {{getExtParamsFromBid(*): {impactify: {appId}}, createOrtbImpVideoObj(*): {context: string, playerSize: [number,number], id: string, mimes: [string]}, getDeviceType(): (number), createOrtbImpBannerObj(*, *): {format: [], id: string}}}
 */
var helpers = {
  getExtParamsFromBid: function getExtParamsFromBid(bid) {
    var ext = {
      impactify: {
        appId: bid.params.appId
      }
    };
    if (typeof bid.params.format == 'string') {
      ext.impactify.format = bid.params.format;
    }
    if (typeof bid.params.style == 'string') {
      ext.impactify.style = bid.params.style;
    }
    if (typeof bid.params.container == 'string') {
      ext.impactify.container = bid.params.container;
    }
    if (typeof bid.params.size == 'string') {
      ext.impactify.size = bid.params.size;
    }
    return ext;
  },
  getDeviceType: function getDeviceType() {
    // OpenRTB Device type
    if (/ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())) {
      return 5;
    }
    if (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase())) {
      return 4;
    }
    return 2;
  },
  createOrtbImpBannerObj: function createOrtbImpBannerObj(bid, size) {
    var sizes = size.split('x');
    return {
      id: 'banner-' + bid.bidId,
      format: [{
        w: parseInt(sizes[0]),
        h: parseInt(sizes[1])
      }]
    };
  },
  createOrtbImpVideoObj: function createOrtbImpVideoObj(bid) {
    return {
      id: 'video-' + bid.bidId,
      playerSize: [DEFAULT_VIDEO_WIDTH, DEFAULT_VIDEO_HEIGHT],
      context: 'outstream',
      mimes: ['video/mp4']
    };
  },
  getFloor: function getFloor(bid) {
    var floorInfo = bid.getFloor({
      currency: DEFAULT_CURRENCY,
      mediaType: '*',
      size: '*'
    });
    if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3__["default"])(floorInfo) === 'object' && floorInfo.currency === DEFAULT_CURRENCY && !isNaN(parseFloat(floorInfo.floor))) {
      return parseFloat(floorInfo.floor);
    }
    return null;
  },
  getImStrFromLocalStorage: function getImStrFromLocalStorage() {
    return STORAGE.localStorageIsEnabled(false) ? STORAGE.getDataFromLocalStorage(STORAGE_KEY, false) : '';
  }
};

/**
 * Create an OpenRTB formated object from prebid payload
 * @param validBidRequests
 * @param bidderRequest
 * @returns {{cur: string[], validBidRequests, id, source: {tid}, imp: *[]}}
 */
function createOpenRtbRequest(validBidRequests, bidderRequest) {
  var _bidderRequest$ortb, _bidderRequest$ortb$s, _bidderRequest$ortb2, _bidderRequest$ortb2$;
  // Create request and set imp bids inside
  var request = {
    id: bidderRequest.bidderRequestId,
    validBidRequests: validBidRequests,
    cur: [DEFAULT_CURRENCY],
    imp: [],
    source: {
      tid: (_bidderRequest$ortb = bidderRequest.ortb2) === null || _bidderRequest$ortb === void 0 ? void 0 : (_bidderRequest$ortb$s = _bidderRequest$ortb.source) === null || _bidderRequest$ortb$s === void 0 ? void 0 : _bidderRequest$ortb$s.tid
    }
  };

  // Get the url parameters
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var checkPrebid = urlParams.get('_checkPrebid');

  // Force impactify debugging parameter if present
  if (checkPrebid != null) {
    request.test = Number(checkPrebid);
  }

  // Set SChain in request
  var schain = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(validBidRequests, '0.schain');
  if (schain) request.source.ext = {
    schain: schain
  };

  // Set Eids
  var eids = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(validBidRequests, '0.userIdAsEids');
  if (eids && eids.length) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'user.ext.eids', eids);
  }

  // Set device/user/site
  if (!request.device) request.device = {};
  if (!request.site) request.site = {};
  request.device = {
    w: window.innerWidth,
    h: window.innerHeight,
    devicetype: helpers.getDeviceType(),
    ua: navigator.userAgent,
    js: 1,
    dnt: navigator.doNotTrack == 'yes' || navigator.doNotTrack == '1' || navigator.msDoNotTrack == '1' ? 1 : 0,
    language: (navigator.language || navigator.userLanguage || '').split('-')[0] || 'en'
  };
  request.site = {
    page: bidderRequest.refererInfo.page
  };

  // Handle privacy settings for GDPR/CCPA/COPPA
  var gdprApplies = 0;
  if (bidderRequest.gdprConsent) {
    if (typeof bidderRequest.gdprConsent.gdprApplies === 'boolean') gdprApplies = bidderRequest.gdprConsent.gdprApplies ? 1 : 0;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'user.ext.consent', bidderRequest.gdprConsent.consentString);
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.ext.gdpr', gdprApplies);

  // Fetch GPP Consent from bidderRequest
  if (bidderRequest && bidderRequest.gppConsent && bidderRequest.gppConsent.gppString) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.gpp', bidderRequest.gppConsent.gppString);
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.gpp_sid', bidderRequest.gppConsent.applicableSections);
  } else if (bidderRequest && bidderRequest.ortb2 && bidderRequest.ortb2.regs && bidderRequest.ortb2.regs.gpp) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.gpp', bidderRequest.ortb2.regs.gpp);
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.gpp_sid', bidderRequest.ortb2.regs.gpp_sid);
  }
  // Fetch coppa compliance from bidderRequest
  if (bidderRequest !== null && bidderRequest !== void 0 && (_bidderRequest$ortb2 = bidderRequest.ortb2) !== null && _bidderRequest$ortb2 !== void 0 && (_bidderRequest$ortb2$ = _bidderRequest$ortb2.regs) !== null && _bidderRequest$ortb2$ !== void 0 && _bidderRequest$ortb2$.coppa) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.coppa', 1);
  }
  // Fetch uspConsent from bidderRequest
  if (bidderRequest !== null && bidderRequest !== void 0 && bidderRequest.uspConsent) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'regs.ext.us_privacy', bidderRequest.uspConsent);
  }

  // Set buyer uid
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(request, 'user.buyeruid', (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.generateUUID)());

  // Create imps with bids
  validBidRequests.forEach(function (bid) {
    var bannerObj = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(bid.mediaTypes, "banner");
    var imp = {
      id: bid.bidId,
      bidfloor: bid.params.bidfloor ? bid.params.bidfloor : 0,
      ext: helpers.getExtParamsFromBid(bid)
    };
    if (bannerObj && typeof imp.ext.impactify.size == 'string') {
      imp.banner = _objectSpread({}, helpers.createOrtbImpBannerObj(bid, imp.ext.impactify.size));
    } else {
      imp.video = _objectSpread({}, helpers.createOrtbImpVideoObj(bid));
    }
    if (typeof bid.getFloor === 'function') {
      var floor = helpers.getFloor(bid);
      if (floor) {
        imp.bidfloor = floor;
      }
    }
    request.imp.push(imp);
  });
  return request;
}

/**
 * Export BidderSpec type object and register it to Prebid
 * @type {{supportedMediaTypes: string[], interpretResponse: ((function(ServerResponse, *): Bid[])|*), code: string, aliases: string[], getUserSyncs: ((function(SyncOptions, ServerResponse[], *, *): UserSync[])|*), buildRequests: (function(*, *): {method: string, data: string, url}), onTimeout: (function(*): boolean), gvlid: number, isBidRequestValid: ((function(BidRequest): (boolean))|*), onBidWon: (function(*): boolean)}}
 */
var spec = {
  code: BIDDER_CODE,
  gvlid: GVL_ID,
  supportedMediaTypes: ['video', 'banner'],
  aliases: BIDDER_ALIAS,
  storageAllowed: true,
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function isBidRequestValid(bid) {
    if (typeof bid.params.appId != 'string' || !bid.params.appId) {
      return false;
    }
    if (typeof bid.params.format != 'string' || typeof bid.params.style != 'string' || !bid.params.format || !bid.params.style) {
      return false;
    }
    if (bid.params.format !== 'screen' && bid.params.format !== 'display') {
      return false;
    }
    if (bid.params.style !== 'inline' && bid.params.style !== 'impact' && bid.params.style !== 'static') {
      return false;
    }
    return true;
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @param {bidderRequest} - the bidding request
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function buildRequests(validBidRequests, bidderRequest) {
    // Create a clean openRTB request
    var request = createOpenRtbRequest(validBidRequests, bidderRequest);
    var imStr = helpers.getImStrFromLocalStorage();
    var options = {};
    if (imStr) {
      options.customHeaders = {
        'x-impact': imStr
      };
    }
    return {
      method: 'POST',
      url: ORIGIN + AUCTION_URI,
      data: JSON.stringify(request),
      options: options
    };
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function interpretResponse(serverResponse, bidRequest) {
    var serverBody = serverResponse.body;
    var bidResponses = [];
    if (!serverBody) {
      return bidResponses;
    }
    if (!serverBody.seatbid || !serverBody.seatbid.length) {
      return [];
    }
    serverBody.seatbid.forEach(function (seatbid) {
      if (seatbid.bid.length) {
        bidResponses = [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_7__["default"])(bidResponses), (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_7__["default"])(seatbid.bid.filter(function (bid) {
          return bid.price > 0;
        }).map(function (bid) {
          return {
            id: bid.id,
            requestId: bid.impid,
            cpm: bid.price,
            currency: serverBody.cur,
            netRevenue: true,
            ad: bid.adm,
            width: bid.w || 0,
            height: bid.h || 0,
            ttl: 300,
            creativeId: bid.crid || 0,
            hash: bid.hash,
            expiry: bid.expiry,
            meta: {
              advertiserDomains: bid.adomain && bid.adomain.length ? bid.adomain : []
            }
          };
        })));
      }
    });
    return bidResponses;
  },
  /**
   * Register the user sync pixels which should be dropped after the auction.
   *
   * @param {SyncOptions} syncOptions Which user syncs are allowed?
   * @param {ServerResponse[]} serverResponses List of server's responses.
   * @return {UserSync[]} The user syncs which should be dropped.
   */
  getUserSyncs: function getUserSyncs(syncOptions, serverResponses, gdprConsent, uspConsent) {
    if (!serverResponses || serverResponses.length === 0) {
      return [];
    }
    if (!syncOptions.iframeEnabled) {
      return [];
    }
    var params = '';
    if (gdprConsent && typeof gdprConsent.consentString === 'string') {
      if (typeof gdprConsent.gdprApplies === 'boolean') {
        params += "?gdpr=".concat(Number(gdprConsent.gdprApplies), "&gdpr_consent=").concat(gdprConsent.consentString);
      } else {
        params += "?gdpr_consent=".concat(gdprConsent.consentString);
      }
    }
    if (uspConsent) {
      params += "".concat(params ? '&' : '?', "us_privacy=").concat(encodeURIComponent(uspConsent));
    }
    if (document.location.search.match(/pbs_debug=true/)) params += "&pbs_debug=true";
    return [{
      type: 'iframe',
      url: ORIGIN + COOKIE_SYNC_URI + params
    }];
  },
  /**
   * Register bidder specific code, which will execute if a bid from this bidder won the auction
   * @param {Bid} The bid that won the auction
   */
  onBidWon: function onBidWon(bid) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_8__.ajax)("".concat(LOGGER_URI, "/prebid/won"), null, JSON.stringify(bid), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  },
  /**
   * Register bidder specific code, which will execute if bidder timed out after an auction
   * @param {data} Containing timeout specific data
   */
  onTimeout: function onTimeout(data) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_8__.ajax)("".concat(LOGGER_URI, "/prebid/timeout"), null, JSON.stringify(data[0]), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  }
};
(0,_src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_9__.registerBidder)(spec);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_10__.registerModule)('impactifyBidAdapter');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["creative-renderer-display"], function() { return __webpack_exec__("./modules/impactifyBidAdapter.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=impactifyBidAdapter.js.map