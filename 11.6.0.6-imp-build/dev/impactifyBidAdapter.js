"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["impactifyBidAdapter"],{

/***/ "./modules/impactifyBidAdapter.js"
/*!****************************************!*\
  !*** ./modules/impactifyBidAdapter.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports STORAGE, STORAGE_KEY, spec */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils/winDimensions.js");
/* harmony import */ var _src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_ajax_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/ajax.js */ "./src/ajax.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _libraries_percentInView_percentInView_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libraries/percentInView/percentInView.js */ "./libraries/percentInView/percentInView.js");










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
const ORIGIN = 'https://sonic-us-east.impactify.media/openrtb2/auction';
const LOGGER_URI = 'https://logger.impactify.media';
const AUCTION_URI = '';
const COOKIE_SYNC_URI = '/static/cookie_sync.html';
const GVL_ID = 606;
const GET_CONFIG = _src_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig;
const STORAGE = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_9__.getStorageManager)({
  gvlid: GVL_ID,
  bidderCode: BIDDER_CODE
});
const STORAGE_KEY = '_im_str';
const VIDEO_PARAMS = ['minduration', 'maxduration', 'api', 'mimes', 'placement', 'plcmt', 'protocols', 'playbackmethod', 'pos', 'startdelay', 'skip', 'skipmin', 'skipafter', 'minbitrate', 'maxbitrate'];

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
    const render = {};
    if (typeof bid.params.format === 'string') {
      ext.impactify.format = bid.params.format;
    }
    if (typeof bid.params.style === 'string') {
      ext.impactify.style = bid.params.style;
    }
    if (typeof bid.params.size === 'string') {
      ext.impactify.size = bid.params.size;
    }
    const viewability = this.getViewability(bid);
    ext.impactify.viewability = viewability;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(bid.params.render)) {
      if (typeof bid.params.render.top === 'number') {
        render.top = bid.params.render.top;
      }
      if (typeof bid.params.render.bottom === 'number') {
        render.bottom = bid.params.render.bottom;
      }
      if (typeof bid.params.render.align === 'string') {
        render.align = bid.params.render.align;
      }
      if (typeof bid.params.render.container === 'string') {
        render.container = bid.params.render.container;
      }
      if (typeof bid.params.render.expandAd === 'boolean') {
        render.expandAd = bid.params.render.expandAd;
      }
      if (typeof bid.params.render.location === 'string') {
        render.location = bid.params.render.location;
      }
      if (typeof bid.params.render.onAdEventName === 'string') {
        render.onAdEventName = bid.params.render.onAdEventName;
      }
      if (typeof bid.params.render.onNoAdEventName === 'string') {
        render.onNoAdEventName = bid.params.render.onNoAdEventName;
      }
      if (Object.keys(render).length > 0) {
        ext.impactify.render = render;
      }
    }
    return ext;
  },
  pickDefined(obj, keys) {
    return keys.reduce((acc, key) => {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  },
  getViewability(bid) {
    try {
      let elementSize;
      if (bid.mediaTypes?.banner?.sizes?.[0]) {
        elementSize = bid.mediaTypes?.banner?.sizes?.[0];
      }
      if (bid.mediaTypes?.video?.playerSize?.[0]) {
        elementSize = bid.mediaTypes?.video?.playerSize?.[0];
      }
      if (!elementSize) {
        elementSize = [0, 0];
      }
      const size = {
        w: elementSize[0],
        h: elementSize[1]
      };
      const element = document.getElementById(bid.adUnitCode);
      if (!element) return;
      const viewabilityAmount = (0,_libraries_percentInView_percentInView_js__WEBPACK_IMPORTED_MODULE_10__.isViewabilityMeasurable)(element) ? (0,_libraries_percentInView_percentInView_js__WEBPACK_IMPORTED_MODULE_10__.getViewability)(element, (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.getWindowTop)(), size) : 'na';
      return isNaN(viewabilityAmount) ? viewabilityAmount : Math.round(viewabilityAmount);
    } catch (e) {
      return 'na';
    }
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
  createOrtbImpBannerObj(bid, bannerObj) {
    const format = [];
    const sizes = bannerObj?.sizes;
    if (Array.isArray(sizes)) {
      sizes.forEach(size => {
        if (Array.isArray(size) && size.length >= 2) {
          format.push({
            w: size[0],
            h: size[1]
          });
        }
      });
    }
    return {
      id: 'banner-' + (bid?.bidId || ''),
      format
    };
  },
  createOrtbImpVideoObj(bid) {
    const video = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bid, 'mediaTypes.video');
    if (!video) return;
    const playerSize = video.playerSize || bid.sizes?.[0];
    const resolvedPlayerSize = playerSize && playerSize.length === 2 ? playerSize : [DEFAULT_VIDEO_WIDTH, DEFAULT_VIDEO_HEIGHT];
    return {
      playerSize: resolvedPlayerSize,
      context: video.context === 'instream' ? 'instream' : 'outstream',
      ...helpers.pickDefined(video, VIDEO_PARAMS)
    };
  },
  getFloor(bid) {
    try {
      const floorInfo = bid.getFloor({
        currency: DEFAULT_CURRENCY,
        mediaType: '*',
        size: '*'
      });
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(floorInfo) && floorInfo.currency === DEFAULT_CURRENCY && !isNaN(parseFloat(floorInfo.floor))) {
        return parseFloat(floorInfo.floor);
      }
    } catch (e) {}
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
  const request = {
    id: bidderRequest?.bidderRequestId,
    validBidRequests,
    cur: [DEFAULT_CURRENCY],
    imp: [],
    source: {
      tid: bidderRequest?.ortb2?.source?.tid
    },
    ext: {
      impactify: {
        integration: 'pbjs',
        storage: helpers.getImStrFromLocalStorage()
      }
    }
  };

  // Get the url parameters
  const queryString = window?.location?.search;
  const urlParams = new URLSearchParams(queryString);
  const checkPrebid = urlParams.get('_checkPrebid');

  // Force impactify debugging parameter if present
  if (checkPrebid != null) {
    request.test = Number(checkPrebid);
  }

  // Set SChain in request
  const schain = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(validBidRequests, '0.ortb2.source.ext.schain');
  if (schain) request.source.ext = {
    schain: schain
  };

  // Set Eids
  const eids = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(validBidRequests, '0.userIdAsEids');
  if (eids && eids.length) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'user.ext.eids', eids);
  }

  // Set device/user/site
  if (!request.device) request.device = {};
  if (!request.site) request.site = {};
  request.device = {
    w: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.getWinDimensions)().innerWidth,
    h: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.getWinDimensions)().innerHeight,
    devicetype: helpers.getDeviceType(),
    ua: navigator?.userAgent,
    js: 1,
    dnt: 0,
    language: (navigator?.language || navigator?.userLanguage || '').split('-')[0] || 'en'
  };
  const pageUrl = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bidderRequest, 'refererInfo.page');
  const accountId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(validBidRequests?.[0], 'params.accountId');
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'site.page', pageUrl);
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'site.publisher.id', accountId);

  // Handle privacy settings for GDPR/CCPA/COPPA
  let gdprApplies = 0;
  if (bidderRequest?.gdprConsent) {
    if (typeof bidderRequest.gdprConsent.gdprApplies === 'boolean') gdprApplies = bidderRequest.gdprConsent.gdprApplies ? 1 : 0;
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'user.ext.consent', bidderRequest.gdprConsent.consentString);
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'regs.ext.gdpr', gdprApplies);
  if (GET_CONFIG('coppa') === true) (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'regs.coppa', 1);
  if (bidderRequest?.uspConsent) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.dset)(request, 'regs.ext.us_privacy', bidderRequest.uspConsent);
  }

  // Create imps with bids
  validBidRequests.forEach(bid => {
    const bannerObj = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bid.mediaTypes, `banner`);
    const videoObj = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bid.mediaTypes, `video`);
    const imp = {
      id: bid.bidId,
      bidfloor: bid.params.bidfloor ? bid.params.bidfloor : 0,
      ext: helpers.getExtParamsFromBid(bid)
    };
    if (bannerObj) {
      imp.banner = {
        ...helpers.createOrtbImpBannerObj(bid, bannerObj)
      };
    }
    if (videoObj) {
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
    if (typeof bid.params.style !== 'string' || !bid.params.style) {
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
    // Create a clean openRTB request
    const request = createOpenRtbRequest(validBidRequests, bidderRequest);
    const options = {};
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
    let ortbRequest = {};
    try {
      ortbRequest = JSON.parse(bidRequest?.data || '{}');
    } catch (e) {}
    const impMap = {};
    (ortbRequest.imp || []).forEach(imp => {
      impMap[imp.id] = imp;
    });
    serverBody.seatbid.forEach(seatbid => {
      if (seatbid?.bid?.length) {
        bidResponses.push(...seatbid.bid.filter(bid => bid.price > 0).map(bid => {
          const isPlayer = impMap[bid.impid]?.ext?.impactify?.format === 'player';
          const isVideo = !!impMap[bid.impid]?.video;
          let mediaType;
          if (bid?.mtype === 2) {
            mediaType = 'video';
          } else if (bid?.mtype === 1) {
            mediaType = 'banner';
          } else if (isPlayer || isVideo) {
            mediaType = 'video';
          } else {
            mediaType = 'banner';
          }
          return {
            id: bid.id,
            requestId: bid.impid,
            cpm: bid.price,
            currency: serverBody.cur || DEFAULT_CURRENCY,
            netRevenue: true,
            width: bid.w || 0,
            height: bid.h || 0,
            ttl: 300,
            creativeId: bid.crid || 0,
            mediaType: mediaType,
            meta: {
              advertiserDomains: bid.adomain && bid.adomain.length ? bid.adomain : []
            },
            ...(isPlayer ? {
              vastUrl: bid.ext?.vast_url,
              vastXml: bid.adm
            } : {
              ad: bid.adm
            })
          };
        }));
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
    if (document?.location?.search?.match(/pbs_debug=true/)) params += `&pbs_debug=true`;
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
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_8__.ajax)(`${LOGGER_URI}/prebid/won`, null, JSON.stringify(bid), {
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
    (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_8__.ajax)(`${LOGGER_URI}/prebid/timeout`, null, JSON.stringify(data[0]), {
      method: 'POST',
      contentType: 'application/json'
    });
    return true;
  }
};
(0,_src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_6__.registerBidder)(spec);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('impactifyBidAdapter');


/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","viewport","creative-renderer-display","percentInView","boundingClientRect"], () => (__webpack_exec__("./modules/impactifyBidAdapter.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=impactifyBidAdapter.js.map