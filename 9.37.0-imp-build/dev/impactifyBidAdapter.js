"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["impactifyBidAdapter"],{

/***/ "./modules/impactifyBidAdapter.js":
/*!****************************************!*\
  !*** ./modules/impactifyBidAdapter.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports STORAGE, STORAGE_KEY, spec */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_ajax_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/ajax.js */ "./src/ajax.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");









/**
 * @typedef {import('../src/adapters/bidderFactory.js').BidRequest} BidRequest
 * @typedef {import('../src/adapters/bidderFactory.js').Bid} Bid
 * @typedef {import('../src/adapters/bidderFactory.js').ServerResponse} ServerResponse
 * @typedef {import('../src/adapters/bidderFactory.js').SyncOptions} SyncOptions
 * @typedef {import('../src/adapters/bidderFactory.js').UserSync} UserSync
 */

const BIDDER_CODE = 'impactify';
const BIDDER_ALIAS = ['imp'];
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_VIDEO_WIDTH = 640;
const DEFAULT_VIDEO_HEIGHT = 360;
const ORIGIN = 'https://dev-spark.impactify.media';
const LOGGER_URI = 'https://logger.impactify.media';
const LOGGER_JS_URI = 'https://log.impactify.it';
const AUCTION_URI = '/ortb/bid';
const COOKIE_SYNC_URI = '/static/cookie_sync.html';
const GVL_ID = 606;
const GET_CONFIG = _src_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig;
const STORAGE = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.getStorageManager)({
  gvlid: GVL_ID,
  bidderCode: BIDDER_CODE
});
const STORAGE_KEY = '_im_str';

/**
 * Helpers object
 * @type {{getExtParamsFromBid(*): {impactify: {appId}}, createOrtbImpVideoObj(*): {context: string, playerSize: [number,number], id: string, mimes: [string]}, getDeviceType(): (number), createOrtbImpBannerObj(*, *): {format: [], id: string}}}
 */
const helpers = {
  getExtParamsFromBid(bid) {
    let ext = {
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
  getDeviceType() {
    // OpenRTB Device type
    if (/ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())) {
      return 5;
    }
    if (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase())) {
      return 4;
    }
    return 2;
  },
  createOrtbImpBannerObj(bid, size) {
    let sizes = size.split('x');
    return {
      id: 'banner-' + bid.bidId,
      format: [{
        w: parseInt(sizes[0]),
        h: parseInt(sizes[1])
      }]
    };
  },
  createOrtbImpVideoObj(bid) {
    return {
      id: 'video-' + bid.bidId,
      playerSize: [DEFAULT_VIDEO_WIDTH, DEFAULT_VIDEO_HEIGHT],
      context: 'outstream',
      mimes: ['video/mp4']
    };
  },
  getFloor(bid) {
    const floorInfo = bid.getFloor({
      currency: DEFAULT_CURRENCY,
      mediaType: '*',
      size: '*'
    });
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(floorInfo) && floorInfo.currency === DEFAULT_CURRENCY && !isNaN(parseFloat(floorInfo.floor))) {
      return parseFloat(floorInfo.floor);
    }
    return null;
  },
  getImStrFromLocalStorage() {
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
  // Create request and set imp bids inside
  let request = {
    id: bidderRequest.bidderRequestId,
    validBidRequests,
    cur: [DEFAULT_CURRENCY],
    imp: [],
    source: {
      tid: bidderRequest.ortb2?.source?.tid
    }
  };

  // Get the url parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const checkPrebid = urlParams.get('_checkPrebid');

  // Force impactify debugging parameter if present
  if (checkPrebid != null) {
    request.test = Number(checkPrebid);
  }

  // Set SChain in request
  let schain = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequests, '0.schain');
  if (schain) request.source.ext = {
    schain: schain
  };

  // Set Eids
  let eids = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequests, '0.userIdAsEids');
  if (eids && eids.length) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'user.ext.eids', eids);
  }

  // Set device/user/site
  if (!request.device) request.device = {};
  if (!request.site) request.site = {};
  request.device = {
    w: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.getWinDimensions)().innerWidth,
    h: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.getWinDimensions)().innerHeight,
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
  let gdprApplies = 0;
  if (bidderRequest.gdprConsent) {
    if (typeof bidderRequest.gdprConsent.gdprApplies === 'boolean') gdprApplies = bidderRequest.gdprConsent.gdprApplies ? 1 : 0;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'user.ext.consent', bidderRequest.gdprConsent.consentString);
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'regs.ext.gdpr', gdprApplies);
  if (GET_CONFIG('coppa') == true) (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'regs.coppa', 1);
  if (bidderRequest.uspConsent) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'regs.ext.us_privacy', bidderRequest.uspConsent);
  }

  // Set buyer uid
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.dset)(request, 'user.buyeruid', (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.generateUUID)());

  // Create imps with bids
  validBidRequests.forEach(bid => {
    let bannerObj = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid.mediaTypes, `banner`);
    let imp = {
      id: bid.bidId,
      bidfloor: bid.params.bidfloor ? bid.params.bidfloor : 0,
      ext: helpers.getExtParamsFromBid(bid)
    };
    if (bannerObj && typeof imp.ext.impactify.size == 'string') {
      imp.banner = {
        ...helpers.createOrtbImpBannerObj(bid, imp.ext.impactify.size)
      };
    } else {
      imp.video = {
        ...helpers.createOrtbImpVideoObj(bid)
      };
    }
    if (typeof bid.getFloor === 'function') {
      const floor = helpers.getFloor(bid);
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
const spec = {
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
  isBidRequestValid: function (bid) {
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
  buildRequests: function (validBidRequests, bidderRequest) {
    // Create a clean openRTB request
    let request = createOpenRtbRequest(validBidRequests, bidderRequest);
    const imStr = helpers.getImStrFromLocalStorage();
    const options = {};
    if (imStr) {
      options.customHeaders = {
        'x-impact': imStr
      };
    }
    return {
      method: 'POST',
      url: ORIGIN + AUCTION_URI,
      data: JSON.stringify(request),
      options
    };
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function (serverResponse, bidRequest) {
    const serverBody = serverResponse.body;
    let bidResponses = [];
    if (!serverBody) {
      return bidResponses;
    }
    if (!serverBody.seatbid || !serverBody.seatbid.length) {
      return [];
    }
    serverBody.seatbid.forEach(seatbid => {
      if (seatbid.bid.length) {
        bidResponses = [...bidResponses, ...seatbid.bid.filter(bid => bid.price > 0).map(bid => ({
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
        }))];
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
  getUserSyncs: function (syncOptions, serverResponses, gdprConsent, uspConsent) {
    if (!serverResponses || serverResponses.length === 0) {
      return [];
    }
    if (!syncOptions.iframeEnabled) {
      return [];
    }
    let params = '';
    if (gdprConsent && typeof gdprConsent.consentString === 'string') {
      if (typeof gdprConsent.gdprApplies === 'boolean') {
        params += `?gdpr=${Number(gdprConsent.gdprApplies)}&gdpr_consent=${gdprConsent.consentString}`;
      } else {
        params += `?gdpr_consent=${gdprConsent.consentString}`;
      }
    }
    if (uspConsent) {
      params += `${params ? '&' : '?'}us_privacy=${encodeURIComponent(uspConsent)}`;
    }
    if (document.location.search.match(/pbs_debug=true/)) params += `&pbs_debug=true`;
    return [{
      type: 'iframe',
      url: ORIGIN + COOKIE_SYNC_URI + params
    }];
  },
  /**
   * Register bidder specific code, which will execute if a bid from this bidder won the auction
   * @param {Bid} The bid that won the auction
   */
  onBidWon: function (bid) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_5__.ajax)(`${LOGGER_URI}/prebid/won`, null, JSON.stringify(bid), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  },
  /**
   * Register bidder specific code, which will execute if bidder timed out after an auction
   * @param {data} Containing timeout specific data
   */
  onTimeout: function (data) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_5__.ajax)(`${LOGGER_URI}/prebid/timeout`, null, JSON.stringify(data[0]), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  },
  /**
   * Register bidder specific code, which will execute if the bid request failed
   * @param {*} param0
   */
  onBidderError: function (_ref) {
    let {
      error,
      bidderRequest
    } = _ref;
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_5__.ajax)(`${LOGGER_JS_URI}/logger`, null, JSON.stringify({
      error,
      bidderRequest
    }), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  }
};
(0,_src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_6__.registerBidder)(spec);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_7__.registerModule)('impactifyBidAdapter');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","viewport","greedy","creative-renderer-display"], () => (__webpack_exec__("./modules/impactifyBidAdapter.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=impactifyBidAdapter.js.map