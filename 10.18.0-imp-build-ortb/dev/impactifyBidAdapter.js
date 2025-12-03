"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["impactifyBidAdapter"],{

/***/ "./modules/impactifyBidAdapter.js":
/*!****************************************!*\
  !*** ./modules/impactifyBidAdapter.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports STORAGE, STORAGE_KEY, spec */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _libraries_ortbConverter_converter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libraries/ortbConverter/converter.js */ "./libraries/ortbConverter/converter.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _src_ajax_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/ajax.js */ "./src/ajax.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");



 // adjust path if needed





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
const ORIGIN = 'https://sonic.impactify.media';
const LOGGER_URI = 'https://logger.impactify.media';
const AUCTION_URI = '/bidder';
const COOKIE_SYNC_URI = '/static/cookie_sync.html';
const GVL_ID = 606;
const STORAGE = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_5__.getStorageManager)({
  gvlid: GVL_ID,
  bidderCode: BIDDER_CODE
});
const STORAGE_KEY = '_im_str';

/**
 * Helpers object
 * @type {Object}
 */
const helpers = {
  getExtParamsFromBid(bid) {
    const ext = {
      impactify: {
        appId: bid.params.appId
      }
    };
    if (typeof bid.params.format === 'string') {
      ext.impactify.format = bid.params.format;
    }
    if (typeof bid.params.style === 'string') {
      ext.impactify.style = bid.params.style;
    }
    if (typeof bid.params.container === 'string') {
      ext.impactify.container = bid.params.container;
    }
    if (typeof bid.params.size === 'string') {
      ext.impactify.size = bid.params.size;
    }
    return ext;
  },
  getImStrFromLocalStorage() {
    return STORAGE.localStorageIsEnabled(false) ? STORAGE.getDataFromLocalStorage(STORAGE_KEY, false) : '';
  }
};
const converter = (0,_libraries_ortbConverter_converter_js__WEBPACK_IMPORTED_MODULE_1__.ortbConverter)({
  context: {
    netRevenue: true,
    ttl: 300
  },
  imp(buildImp, bidRequest, context) {
    const imp = buildImp(bidRequest, context);
    const bidderExt = helpers.getExtParamsFromBid(bidRequest);
    if (bidderExt) {
      const currentExt = imp.ext || {};
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(imp, 'ext', Object.assign({}, currentExt, bidderExt));
    }
    const paramFloor = bidRequest.params && bidRequest.params.bidfloor;
    if (paramFloor != null && !isNaN(paramFloor) && !('bidfloor' in imp)) {
      imp.bidfloor = parseFloat(paramFloor);
      if (!imp.bidfloorcur) {
        imp.bidfloorcur = DEFAULT_CURRENCY;
      }
    }
    return imp;
  },
  request(buildRequest, imps, bidderRequest, context) {
    const request = buildRequest(imps, bidderRequest, context);
    if (!request.cur || !request.cur.length) {
      request.cur = [DEFAULT_CURRENCY];
    }
    const tid = bidderRequest && bidderRequest.ortb2 && bidderRequest.ortb2.source && bidderRequest.ortb2.source.tid;
    if (tid) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(request, 'source.tid', tid);
    }
    try {
      const queryString = window.location.search || '';
      const urlParams = new URLSearchParams(queryString);
      const checkPrebid = urlParams.get('_checkPrebid');
      if (checkPrebid != null) {
        request.test = Number(checkPrebid);
      }
    } catch (e) {}
    return request;
  },
  bidResponse(buildBidResponse, bid, context) {
    const bidResponse = buildBidResponse(bid, context);
    if (bid.hash) {
      bidResponse.hash = bid.hash;
    }
    if (bid.expiry) {
      bidResponse.expiry = bid.expiry;
    }
    return bidResponse;
  }
});

/**
 * Export BidderSpec type object and register it to Prebid
 * @type {{supportedMediaTypes: string[], interpretResponse: ((function(ServerResponse, *): Bid[])|*), code: string, aliases: string[], getUserSyncs: ((function(SyncOptions, ServerResponse[], *, *): UserSync[])|*), buildRequests: (function(*, *): {method: string, data: Object, url: string, options?: Object}), onTimeout: (function(*): boolean), gvlid: number, isBidRequestValid: ((function(BidRequest): (boolean))|*), onBidWon: (function(*): boolean), storageAllowed: boolean}}
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
    if (typeof bid.params.appId !== 'string' || !bid.params.appId) {
      return false;
    }
    if (typeof bid.params.format !== 'string' || typeof bid.params.style !== 'string' || !bid.params.format || !bid.params.style) {
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
   * @param {Array} validBidRequests - an array of bids
   * @param {Object} bidderRequest - the bidding request
   * @return {Object} Info describing the request to the server.
   */
  buildRequests: function (validBidRequests, bidderRequest) {
    // Use ORTB converter to build a canonical OpenRTB request
    const ortbRequest = converter.toORTB({
      bidRequests: validBidRequests,
      bidderRequest,
      context: {
        currency: DEFAULT_CURRENCY
      }
    });
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
      data: ortbRequest,
      options
    };
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @param {Object} bidRequest The object returned by buildRequests.
   * @return {Bid[]} An array of bids which were nested inside the server response.
   */
  interpretResponse: function (serverResponse, bidRequest) {
    const serverBody = serverResponse && serverResponse.body;
    if (!serverBody) {
      return [];
    }

    // Use ORTB converter to translate ORTB response into Prebid bidResponses
    const result = converter.fromORTB({
      response: serverBody,
      request: bidRequest.data
    });
    const bids = result && result.bids ? result.bids : [];

    // Fallback: ensure currency is set when possible
    if (serverBody.cur) {
      bids.forEach(b => {
        if (!b.currency) {
          b.currency = serverBody.cur;
        }
      });
    }
    return bids;
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
   * @param {Object} bid The bid that won the auction
   */
  onBidWon: function (bid) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_4__.ajax)("".concat(LOGGER_URI, "/prebid/won"), null, JSON.stringify(bid), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  },
  /**
   * Register bidder specific code, which will execute if bidder timed out after an auction
   * @param {Object} data Containing timeout specific data
   */
  onTimeout: function (data) {
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_4__.ajax)("".concat(LOGGER_URI, "/prebid/timeout"), null, JSON.stringify(data[0]), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  }
};
(0,_src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_3__.registerBidder)(spec);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('impactifyBidAdapter');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","ortbConverter","viewport","dnt","creative-renderer-display"], () => (__webpack_exec__("./modules/impactifyBidAdapter.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=impactifyBidAdapter.js.map