/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./creative/constants.js":
/*!*******************************!*\
  !*** ./creative/constants.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BROWSER_INTERVENTION: () => (/* binding */ BROWSER_INTERVENTION),
/* harmony export */   ERROR_EXCEPTION: () => (/* binding */ ERROR_EXCEPTION),
/* harmony export */   EVENT_AD_RENDER_FAILED: () => (/* binding */ EVENT_AD_RENDER_FAILED),
/* harmony export */   EVENT_AD_RENDER_SUCCEEDED: () => (/* binding */ EVENT_AD_RENDER_SUCCEEDED),
/* harmony export */   MESSAGE_EVENT: () => (/* binding */ MESSAGE_EVENT),
/* harmony export */   MESSAGE_REQUEST: () => (/* binding */ MESSAGE_REQUEST),
/* harmony export */   MESSAGE_RESPONSE: () => (/* binding */ MESSAGE_RESPONSE),
/* harmony export */   PB_LOCATOR: () => (/* reexport safe */ _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.PB_LOCATOR)
/* harmony export */ });
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/constants.js */ "./src/constants.js");
// eslint-disable-next-line prebid/validate-imports


// eslint-disable-next-line prebid/validate-imports

const MESSAGE_REQUEST = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.REQUEST;
const MESSAGE_RESPONSE = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.RESPONSE;
const MESSAGE_EVENT = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.EVENT;
const EVENT_AD_RENDER_FAILED = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.EVENTS.AD_RENDER_FAILED;
const EVENT_AD_RENDER_SUCCEEDED = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.EVENTS.AD_RENDER_SUCCEEDED;
const ERROR_EXCEPTION = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.EXCEPTION;
const BROWSER_INTERVENTION = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.EVENTS.BROWSER_INTERVENTION;


/***/ }),

/***/ "./creative/renderers/display/constants.js":
/*!*************************************************!*\
  !*** ./creative/renderers/display/constants.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_NO_AD: () => (/* binding */ ERROR_NO_AD)
/* harmony export */ });
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/constants.js */ "./src/constants.js");
// eslint-disable-next-line prebid/validate-imports

const ERROR_NO_AD = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.NO_AD;


/***/ }),

/***/ "./creative/reporting.js":
/*!*******************************!*\
  !*** ./creative/reporting.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerReportingObserver: () => (/* binding */ registerReportingObserver)
/* harmony export */ });
function registerReportingObserver(callback, types, document) {
  const view = (document === null || document === void 0 ? void 0 : document.defaultView) || window;
  if ('ReportingObserver' in view) {
    try {
      const observer = new view.ReportingObserver(reports => {
        callback(reports[0]);
      }, {
        buffered: true,
        types
      });
      observer.observe();
    } catch (e) {}
  }
}


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
  PAAPI_ERROR: 'paapiError',
  BEFORE_PBS_HTTP: 'beforePBSHttp',
  BROWSI_INIT: 'browsiInit',
  BROWSI_DATA: 'browsiData',
  BROWSER_INTERVENTION: 'browserIntervention'
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
  DSP: 'hb_dsp',
  VERSION: 'hb_ver'
};
const DEFAULT_TARGETING_KEYS = {
  BIDDER: 'hb_bidder',
  AD_ID: 'hb_adid',
  PRICE_BUCKET: 'hb_pb',
  SIZE: 'hb_size',
  DEAL: 'hb_deal',
  FORMAT: 'hb_format',
  UUID: 'hb_uuid',
  CACHE_HOST: 'hb_cache_host',
  VERSION: 'hb_ver'
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
const NATIVE_KEYS_THAT_ARE_NOT_ASSETS = ['privacyIcon', 'clickUrl', 'adTemplate', 'rendererUrl', 'type'];
const MESSAGES = {
  REQUEST: 'Prebid Request',
  RESPONSE: 'Prebid Response',
  NATIVE: 'Prebid Native',
  EVENT: 'Prebid Event',
  INTERVENTION: 'Prebid Intervention'
};
const PB_LOCATOR = '__pb_locator__';


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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./creative/renderers/display/renderer.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _reporting_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../reporting.js */ "./creative/reporting.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants.js */ "./creative/constants.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./creative/renderers/display/constants.js");



function render(_ref, _ref2, win) {
  let {
    ad,
    adUrl,
    width,
    height,
    instl
  } = _ref;
  let {
    mkFrame,
    sendMessage
  } = _ref2;
  (0,_reporting_js__WEBPACK_IMPORTED_MODULE_0__.registerReportingObserver)(report => {
    sendMessage(_constants_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_EVENT, {
      event: _constants_js__WEBPACK_IMPORTED_MODULE_1__.BROWSER_INTERVENTION,
      intervention: report
    });
  }, ['intervention']);
  if (!ad && !adUrl) {
    const err = new Error('Missing ad markup or URL');
    err.reason = _constants_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_NO_AD;
    throw err;
  } else {
    if (height == null) {
      var _win$document;
      const body = (_win$document = win.document) === null || _win$document === void 0 ? void 0 : _win$document.body;
      [body, body === null || body === void 0 ? void 0 : body.parentElement].filter(elm => (elm === null || elm === void 0 ? void 0 : elm.style) != null).forEach(elm => {
        elm.style.height = '100%';
      });
    }
    const doc = win.document;
    const attrs = {
      width: width !== null && width !== void 0 ? width : '100%',
      height: height !== null && height !== void 0 ? height : '100%'
    };
    if (adUrl && !ad) {
      attrs.src = adUrl;
    } else {
      attrs.srcdoc = ad;
    }
    doc.body.appendChild(mkFrame(doc, attrs));
    if (instl && win.frameElement) {
      // interstitials are rendered in a nested iframe that needs to be sized
      const style = win.frameElement.style;
      style.width = width ? "".concat(width, "px") : '100vw';
      style.height = height ? "".concat(height, "px") : '100vh';
    }
  }
}
window.render = render;

})();

/******/ })()
;