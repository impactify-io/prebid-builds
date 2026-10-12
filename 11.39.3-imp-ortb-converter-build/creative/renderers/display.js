/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./creative/constants.js"
/*!*******************************!*\
  !*** ./creative/constants.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ },

/***/ "./creative/renderers/display/constants.js"
/*!*************************************************!*\
  !*** ./creative/renderers/display/constants.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_NO_AD: () => (/* binding */ ERROR_NO_AD)
/* harmony export */ });
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/constants.js */ "./src/constants.js");
// eslint-disable-next-line prebid/validate-imports

const ERROR_NO_AD = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.NO_AD;

/***/ },

/***/ "./creative/reporting.js"
/*!*******************************!*\
  !*** ./creative/reporting.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerReportingObserver: () => (/* binding */ registerReportingObserver)
/* harmony export */ });
function registerReportingObserver(callback, types, document) {
  const view = document?.defaultView || window;
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

/***/ },

/***/ "./src/constants.js"
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
  BID_ACCEPTED: 'bidAccepted',
  BID_REJECTED: 'bidRejected',
  NO_BID: 'noBid',
  BID_WON: 'bidWon',
  BIDDER_DONE: 'bidderDone',
  BIDDER_ERROR: 'bidderError',
  SET_TARGETING: 'setTargeting',
  BEFORE_REQUEST_BIDS: 'beforeRequestBids',
  BEFORE_BIDDER_HTTP: 'beforeBidderHttp',
  REQUEST_BIDS: 'requestBids',
  AD_RENDER_FAILED: 'adRenderFailed',
  AD_RENDER_SUCCEEDED: 'adRenderSucceeded',
  TCF2_ENFORCEMENT: 'tcf2Enforcement',
  AUCTION_DEBUG: 'auctionDebug',
  BID_VIEWABLE: 'bidViewable',
  STALE_RENDER: 'staleRender',
  EXPIRED_RENDER: 'expiredRender',
  BILLABLE_EVENT: 'billableEvent',
  PBS_ANALYTICS: 'pbsAnalytics',
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

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
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
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
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



function render({
  ad,
  adUrl,
  width,
  height,
  instl
}, {
  mkFrame,
  sendMessage
}, win) {
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
      const body = win.document?.body;
      [body, body?.parentElement].filter(elm => elm?.style != null).forEach(elm => {
        elm.style.height = '100%';
      });
    }
    const doc = win.document;
    const attrs = {
      width: width ?? '100%',
      height: height ?? '100%'
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
      style.width = width ? `${width}px` : '100vw';
      style.height = height ? `${height}px` : '100vh';
      const container = win.parent?.document?.querySelector('div#creative');
      const box = win.parent?.document?.querySelector('div#ad_position_box');
      const containerStyle = container && win.parent?.getComputedStyle?.(container);
      const boxStyle = box && win.parent?.getComputedStyle?.(box);
      if (container?.parentElement === box && containerStyle?.marginTop && containerStyle?.marginTop !== '0px' && boxStyle && boxStyle?.alignItems === 'flex-start') {
        // GAME_MANUAL_INTERSTITIAL uses different styling on mobile, which doesn't work with our resizing;
        // this resets it to the same style used on desktop
        container.style.marginTop = '0px';
        box.style.alignItems = 'center';
      }
    }
  }
}
window.render = render;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SyxHQUFHQSxLQUFLLEdBQUcsR0FBR0EsS0FBSyxJQUFJLEdBQUcsT0FBTztNQUM1Q2UsS0FBSyxDQUFDZCxNQUFNLEdBQUdBLE1BQU0sR0FBRyxHQUFHQSxNQUFNLElBQUksR0FBRyxPQUFPO01BRS9DLE1BQU1zQixTQUFTLEdBQUdsQixHQUFHLENBQUNtQixNQUFNLEVBQUU1SixRQUFRLEVBQUU2SixhQUFhLENBQUMsY0FBYyxDQUFDO01BQ3JFLE1BQU1DLEdBQUcsR0FBR3JCLEdBQUcsQ0FBQ21CLE1BQU0sRUFBRTVKLFFBQVEsRUFBRTZKLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztNQUN0RSxNQUFNRSxjQUFjLEdBQUdKLFNBQVMsSUFBSWxCLEdBQUcsQ0FBQ21CLE1BQU0sRUFBRUksZ0JBQWdCLEdBQUdMLFNBQVMsQ0FBQztNQUM3RSxNQUFNTSxRQUFRLEdBQUdILEdBQUcsSUFBSXJCLEdBQUcsQ0FBQ21CLE1BQU0sRUFBRUksZ0JBQWdCLEdBQUdGLEdBQUcsQ0FBQztNQUMzRCxJQUNFSCxTQUFTLEVBQUVYLGFBQWEsS0FBS2MsR0FBRyxJQUNoQ0MsY0FBYyxFQUFFRyxTQUFTLElBQUlILGNBQWMsRUFBRUcsU0FBUyxLQUFLLEtBQUssSUFDaEVELFFBQVEsSUFBSUEsUUFBUSxFQUFFRSxVQUFVLEtBQUssWUFBWSxFQUNqRDtRQUNBO1FBQ0E7UUFDQVIsU0FBUyxDQUFDUixLQUFLLENBQUNlLFNBQVMsR0FBRyxLQUFLO1FBQ2pDSixHQUFHLENBQUNYLEtBQUssQ0FBQ2dCLFVBQVUsR0FBRyxRQUFRO01BQ2pDO0lBQ0Y7RUFDRjtBQUNGO0FBRUFoSyxNQUFNLENBQUM4SCxNQUFNLEdBQUdBLE1BQU0sQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi8uLi9jcmVhdGl2ZS9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NyZWF0aXZlL3JlbmRlcmVycy9kaXNwbGF5L2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vY3JlYXRpdmUvcmVwb3J0aW5nLmpzIiwid2VicGFjazovLy8uLi8uLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uLi8uLi9jcmVhdGl2ZS9yZW5kZXJlcnMvZGlzcGxheS9yZW5kZXJlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlYmlkL3ZhbGlkYXRlLWltcG9ydHNcbmltcG9ydCB7IEFEX1JFTkRFUl9GQUlMRURfUkVBU09OLCBFVkVOVFMsIE1FU1NBR0VTIH0gZnJvbSAnLi4vc3JjL2NvbnN0YW50cy5qcyc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmViaWQvdmFsaWRhdGUtaW1wb3J0c1xuZXhwb3J0IHsgUEJfTE9DQVRPUiB9IGZyb20gJy4uL3NyYy9jb25zdGFudHMuanMnO1xuZXhwb3J0IGNvbnN0IE1FU1NBR0VfUkVRVUVTVCA9IE1FU1NBR0VTLlJFUVVFU1Q7XG5leHBvcnQgY29uc3QgTUVTU0FHRV9SRVNQT05TRSA9IE1FU1NBR0VTLlJFU1BPTlNFO1xuZXhwb3J0IGNvbnN0IE1FU1NBR0VfRVZFTlQgPSBNRVNTQUdFUy5FVkVOVDtcbmV4cG9ydCBjb25zdCBFVkVOVF9BRF9SRU5ERVJfRkFJTEVEID0gRVZFTlRTLkFEX1JFTkRFUl9GQUlMRUQ7XG5leHBvcnQgY29uc3QgRVZFTlRfQURfUkVOREVSX1NVQ0NFRURFRCA9IEVWRU5UUy5BRF9SRU5ERVJfU1VDQ0VFREVEO1xuZXhwb3J0IGNvbnN0IEVSUk9SX0VYQ0VQVElPTiA9IEFEX1JFTkRFUl9GQUlMRURfUkVBU09OLkVYQ0VQVElPTjtcbmV4cG9ydCBjb25zdCBCUk9XU0VSX0lOVEVSVkVOVElPTiA9IEVWRU5UUy5CUk9XU0VSX0lOVEVSVkVOVElPTjtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmViaWQvdmFsaWRhdGUtaW1wb3J0c1xuaW1wb3J0IHsgQURfUkVOREVSX0ZBSUxFRF9SRUFTT04gfSBmcm9tICcuLi8uLi8uLi9zcmMvY29uc3RhbnRzLmpzJztcblxuZXhwb3J0IGNvbnN0IEVSUk9SX05PX0FEID0gQURfUkVOREVSX0ZBSUxFRF9SRUFTT04uTk9fQUQ7XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJSZXBvcnRpbmdPYnNlcnZlcihjYWxsYmFjaywgdHlwZXMsIGRvY3VtZW50KSB7XG4gIGNvbnN0IHZpZXcgPSBkb2N1bWVudD8uZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICBpZiAoJ1JlcG9ydGluZ09ic2VydmVyJyBpbiB2aWV3KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IHZpZXcuUmVwb3J0aW5nT2JzZXJ2ZXIoKHJlcG9ydHMpID0+IHtcbiAgICAgICAgY2FsbGJhY2socmVwb3J0c1swXSk7XG4gICAgICB9LCB7IGJ1ZmZlcmVkOiB0cnVlLCB0eXBlcyB9KTtcbiAgICAgIG9ic2VydmVyLm9ic2VydmUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgSlNPTl9NQVBQSU5HID0ge1xuICBQTF9DT0RFOiAnY29kZScsXG4gIFBMX1NJWkU6ICdzaXplcycsXG4gIFBMX0JJRFM6ICdiaWRzJyxcbiAgQkRfQklEREVSOiAnYmlkZGVyJyxcbiAgQkRfSUQ6ICdwYXJhbXNkJyxcbiAgQkRfUExfSUQ6ICdwbGFjZW1lbnRJZCcsXG4gIEFEU0VSVkVSX1RBUkdFVElORzogJ2Fkc2VydmVyVGFyZ2V0aW5nJyxcbiAgQkRfU0VUVElOR19TVEFOREFSRDogJ3N0YW5kYXJkJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IERFQlVHX01PREUgPSAncGJqc19kZWJ1Zyc7XG5cbmV4cG9ydCBjb25zdCBTVEFUVVMgPSB7XG4gIEdPT0Q6IDFcbn07XG5cbmV4cG9ydCBjb25zdCBFVkVOVFMgPSB7XG4gIEFVQ1RJT05fSU5JVDogJ2F1Y3Rpb25Jbml0JyxcbiAgQVVDVElPTl9USU1FT1VUOiAnYXVjdGlvblRpbWVvdXQnLFxuICBBVUNUSU9OX0VORDogJ2F1Y3Rpb25FbmQnLFxuICBCSURfQURKVVNUTUVOVDogJ2JpZEFkanVzdG1lbnQnLFxuICBCSURfVElNRU9VVDogJ2JpZFRpbWVvdXQnLFxuICBCSURfUkVRVUVTVEVEOiAnYmlkUmVxdWVzdGVkJyxcbiAgQklEX1JFU1BPTlNFOiAnYmlkUmVzcG9uc2UnLFxuICBCSURfQUNDRVBURUQ6ICdiaWRBY2NlcHRlZCcsXG4gIEJJRF9SRUpFQ1RFRDogJ2JpZFJlamVjdGVkJyxcbiAgTk9fQklEOiAnbm9CaWQnLFxuICBCSURfV09OOiAnYmlkV29uJyxcbiAgQklEREVSX0RPTkU6ICdiaWRkZXJEb25lJyxcbiAgQklEREVSX0VSUk9SOiAnYmlkZGVyRXJyb3InLFxuICBTRVRfVEFSR0VUSU5HOiAnc2V0VGFyZ2V0aW5nJyxcbiAgQkVGT1JFX1JFUVVFU1RfQklEUzogJ2JlZm9yZVJlcXVlc3RCaWRzJyxcbiAgQkVGT1JFX0JJRERFUl9IVFRQOiAnYmVmb3JlQmlkZGVySHR0cCcsXG4gIFJFUVVFU1RfQklEUzogJ3JlcXVlc3RCaWRzJyxcbiAgQURfUkVOREVSX0ZBSUxFRDogJ2FkUmVuZGVyRmFpbGVkJyxcbiAgQURfUkVOREVSX1NVQ0NFRURFRDogJ2FkUmVuZGVyU3VjY2VlZGVkJyxcbiAgVENGMl9FTkZPUkNFTUVOVDogJ3RjZjJFbmZvcmNlbWVudCcsXG4gIEFVQ1RJT05fREVCVUc6ICdhdWN0aW9uRGVidWcnLFxuICBCSURfVklFV0FCTEU6ICdiaWRWaWV3YWJsZScsXG4gIFNUQUxFX1JFTkRFUjogJ3N0YWxlUmVuZGVyJyxcbiAgRVhQSVJFRF9SRU5ERVI6ICdleHBpcmVkUmVuZGVyJyxcbiAgQklMTEFCTEVfRVZFTlQ6ICdiaWxsYWJsZUV2ZW50JyxcbiAgUEJTX0FOQUxZVElDUzogJ3Bic0FuYWx5dGljcycsXG4gIEJFRk9SRV9QQlNfSFRUUDogJ2JlZm9yZVBCU0h0dHAnLFxuICBCUk9XU0lfSU5JVDogJ2Jyb3dzaUluaXQnLFxuICBCUk9XU0lfREFUQTogJ2Jyb3dzaURhdGEnLFxuICBCUk9XU0VSX0lOVEVSVkVOVElPTjogJ2Jyb3dzZXJJbnRlcnZlbnRpb24nXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgQURfUkVOREVSX0ZBSUxFRF9SRUFTT04gPSB7XG4gIFBSRVZFTlRfV1JJVElOR19PTl9NQUlOX0RPQ1VNRU5UOiAncHJldmVudFdyaXRpbmdPbk1haW5Eb2N1bWVudCcsXG4gIE5PX0FEOiAnbm9BZCcsXG4gIEVYQ0VQVElPTjogJ2V4Y2VwdGlvbicsXG4gIENBTk5PVF9GSU5EX0FEOiAnY2Fubm90RmluZEFkJyxcbiAgTUlTU0lOR19ET0NfT1JfQURJRDogJ21pc3NpbmdEb2NPckFkaWQnXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgRVZFTlRfSURfUEFUSFMgPSB7XG4gIGJpZFdvbjogJ2FkVW5pdENvZGUnXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgR1JBTlVMQVJJVFlfT1BUSU9OUyA9IHtcbiAgTE9XOiAnbG93JyxcbiAgTUVESVVNOiAnbWVkaXVtJyxcbiAgSElHSDogJ2hpZ2gnLFxuICBBVVRPOiAnYXV0bycsXG4gIERFTlNFOiAnZGVuc2UnLFxuICBDVVNUT006ICdjdXN0b20nXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgVEFSR0VUSU5HX0tFWVMgPSB7XG4gIEJJRERFUjogJ2hiX2JpZGRlcicsXG4gIEFEX0lEOiAnaGJfYWRpZCcsXG4gIFBSSUNFX0JVQ0tFVDogJ2hiX3BiJyxcbiAgU0laRTogJ2hiX3NpemUnLFxuICBERUFMOiAnaGJfZGVhbCcsXG4gIFNPVVJDRTogJ2hiX3NvdXJjZScsXG4gIEZPUk1BVDogJ2hiX2Zvcm1hdCcsXG4gIFVVSUQ6ICdoYl91dWlkJyxcbiAgQ0FDSEVfSUQ6ICdoYl9jYWNoZV9pZCcsXG4gIENBQ0hFX0hPU1Q6ICdoYl9jYWNoZV9ob3N0JyxcbiAgQURPTUFJTjogJ2hiX2Fkb21haW4nLFxuICBBQ0FUOiAnaGJfYWNhdCcsXG4gIENSSUQ6ICdoYl9jcmlkJyxcbiAgRFNQOiAnaGJfZHNwJyxcbiAgVkVSU0lPTjogJ2hiX3Zlcidcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RBUkdFVElOR19LRVlTID0ge1xuICBCSURERVI6ICdoYl9iaWRkZXInLFxuICBBRF9JRDogJ2hiX2FkaWQnLFxuICBQUklDRV9CVUNLRVQ6ICdoYl9wYicsXG4gIFNJWkU6ICdoYl9zaXplJyxcbiAgREVBTDogJ2hiX2RlYWwnLFxuICBGT1JNQVQ6ICdoYl9mb3JtYXQnLFxuICBVVUlEOiAnaGJfdXVpZCcsXG4gIENBQ0hFX0hPU1Q6ICdoYl9jYWNoZV9ob3N0JyxcbiAgVkVSU0lPTjogJ2hiX3Zlcidcbn07XG5cbmV4cG9ydCBjb25zdCBOQVRJVkVfS0VZUyA9IHtcbiAgdGl0bGU6ICdoYl9uYXRpdmVfdGl0bGUnLFxuICBib2R5OiAnaGJfbmF0aXZlX2JvZHknLFxuICBib2R5MjogJ2hiX25hdGl2ZV9ib2R5MicsXG4gIHByaXZhY3lMaW5rOiAnaGJfbmF0aXZlX3ByaXZhY3knLFxuICBwcml2YWN5SWNvbjogJ2hiX25hdGl2ZV9wcml2aWNvbicsXG4gIHNwb25zb3JlZEJ5OiAnaGJfbmF0aXZlX2JyYW5kJyxcbiAgaW1hZ2U6ICdoYl9uYXRpdmVfaW1hZ2UnLFxuICBpY29uOiAnaGJfbmF0aXZlX2ljb24nLFxuICBjbGlja1VybDogJ2hiX25hdGl2ZV9saW5rdXJsJyxcbiAgZGlzcGxheVVybDogJ2hiX25hdGl2ZV9kaXNwbGF5dXJsJyxcbiAgY3RhOiAnaGJfbmF0aXZlX2N0YScsXG4gIHJhdGluZzogJ2hiX25hdGl2ZV9yYXRpbmcnLFxuICBhZGRyZXNzOiAnaGJfbmF0aXZlX2FkZHJlc3MnLFxuICBkb3dubG9hZHM6ICdoYl9uYXRpdmVfZG93bmxvYWRzJyxcbiAgbGlrZXM6ICdoYl9uYXRpdmVfbGlrZXMnLFxuICBwaG9uZTogJ2hiX25hdGl2ZV9waG9uZScsXG4gIHByaWNlOiAnaGJfbmF0aXZlX3ByaWNlJyxcbiAgc2FsZVByaWNlOiAnaGJfbmF0aXZlX3NhbGVwcmljZScsXG4gIHJlbmRlcmVyVXJsOiAnaGJfcmVuZGVyZXJfdXJsJyxcbiAgYWRUZW1wbGF0ZTogJ2hiX2FkVGVtcGxhdGUnXG59O1xuXG5leHBvcnQgY29uc3QgUzJTID0ge1xuICBTUkM6ICdzMnMnLFxuICBERUZBVUxUX0VORFBPSU5UOiAnaHR0cHM6Ly9wcmViaWQuYWRueHMuY29tL3Bicy92MS9vcGVucnRiMi9hdWN0aW9uJyxcbiAgU1lOQ0VEX0JJRERFUlNfS0VZOiAncGJqc1N5bmNzJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IEJJRF9TVEFUVVMgPSB7XG4gIEJJRF9UQVJHRVRJTkdfU0VUOiAndGFyZ2V0aW5nU2V0JyxcbiAgUkVOREVSRUQ6ICdyZW5kZXJlZCcsXG4gIEJJRF9SRUpFQ1RFRDogJ2JpZFJlamVjdGVkJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFJFSkVDVElPTl9SRUFTT04gPSB7XG4gIElOVkFMSUQ6ICdCaWQgaGFzIG1pc3Npbmcgb3IgaW52YWxpZCBwcm9wZXJ0aWVzJyxcbiAgSU5WQUxJRF9SRVFVRVNUX0lEOiAnSW52YWxpZCByZXF1ZXN0IElEJyxcbiAgQklEREVSX0RJU0FMTE9XRUQ6ICdCaWRkZXIgY29kZSBpcyBub3QgYWxsb3dlZCBieSBhbGxvd2VkQWx0ZXJuYXRlQmlkZGVyQ29kZXMgLyBhbGxvd1Vua25vd25CaWRkZXJDb2RlcycsXG4gIEZMT09SX05PVF9NRVQ6ICdCaWQgZG9lcyBub3QgbWVldCBwcmljZSBmbG9vcicsXG4gIENBTk5PVF9DT05WRVJUX0NVUlJFTkNZOiAnVW5hYmxlIHRvIGNvbnZlcnQgY3VycmVuY3knLFxuICBEU0FfUkVRVUlSRUQ6ICdCaWQgZG9lcyBub3QgcHJvdmlkZSByZXF1aXJlZCBEU0EgdHJhbnNwYXJlbmN5IGluZm8nLFxuICBEU0FfTUlTTUFUQ0g6ICdCaWQgaW5kaWNhdGVzIGluYXBwcm9wcmlhdGUgRFNBIHJlbmRlcmluZyBtZXRob2QnLFxuICBQUklDRV9UT09fSElHSDogJ0JpZCBwcmljZSBleGNlZWRzIG1heGltdW0gdmFsdWUnXG59O1xuXG5leHBvcnQgY29uc3QgUFJFQklEX05BVElWRV9EQVRBX0tFWVNfVE9fT1JUQiA9IHtcbiAgYm9keTogJ2Rlc2MnLFxuICBib2R5MjogJ2Rlc2MyJyxcbiAgc3BvbnNvcmVkQnk6ICdzcG9uc29yZWQnLFxuICBjdGE6ICdjdGF0ZXh0JyxcbiAgcmF0aW5nOiAncmF0aW5nJyxcbiAgYWRkcmVzczogJ2FkZHJlc3MnLFxuICBkb3dubG9hZHM6ICdkb3dubG9hZHMnLFxuICBsaWtlczogJ2xpa2VzJyxcbiAgcGhvbmU6ICdwaG9uZScsXG4gIHByaWNlOiAncHJpY2UnLFxuICBzYWxlUHJpY2U6ICdzYWxlcHJpY2UnLFxuICBkaXNwbGF5VXJsOiAnZGlzcGxheXVybCdcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBOQVRJVkVfQVNTRVRfVFlQRVMgPSB7XG4gIHNwb25zb3JlZDogMSxcbiAgZGVzYzogMixcbiAgcmF0aW5nOiAzLFxuICBsaWtlczogNCxcbiAgZG93bmxvYWRzOiA1LFxuICBwcmljZTogNixcbiAgc2FsZXByaWNlOiA3LFxuICBwaG9uZTogOCxcbiAgYWRkcmVzczogOSxcbiAgZGVzYzI6IDEwLFxuICBkaXNwbGF5dXJsOiAxMSxcbiAgY3RhdGV4dDogMTJcbn07XG5cbmV4cG9ydCBjb25zdCBOQVRJVkVfSU1BR0VfVFlQRVMgPSB7XG4gIElDT046IDEsXG4gIE1BSU46IDNcbn07XG5cbmV4cG9ydCBjb25zdCBOQVRJVkVfS0VZU19USEFUX0FSRV9OT1RfQVNTRVRTID0gW1xuICAncHJpdmFjeUljb24nLFxuICAnY2xpY2tVcmwnLFxuICAnYWRUZW1wbGF0ZScsXG4gICdyZW5kZXJlclVybCcsXG4gICd0eXBlJ1xuXSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IE1FU1NBR0VTID0ge1xuICBSRVFVRVNUOiAnUHJlYmlkIFJlcXVlc3QnLFxuICBSRVNQT05TRTogJ1ByZWJpZCBSZXNwb25zZScsXG4gIE5BVElWRTogJ1ByZWJpZCBOYXRpdmUnLFxuICBFVkVOVDogJ1ByZWJpZCBFdmVudCcsXG4gIElOVEVSVkVOVElPTjogJ1ByZWJpZCBJbnRlcnZlbnRpb24nXG59O1xuXG5leHBvcnQgY29uc3QgUEJfTE9DQVRPUiA9ICdfX3BiX2xvY2F0b3JfXyc7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG5jb25zdCBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGNvbnN0IGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHRjb25zdCBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0Y29uc3QgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIvdmFsdWUgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGlmKEFycmF5LmlzQXJyYXkoZGVmaW5pdGlvbikpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0d2hpbGUoaSA8IGRlZmluaXRpb24ubGVuZ3RoKSB7XG5cdFx0XHR2YXIga2V5ID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0dmFyIGJpbmRpbmcgPSBkZWZpbml0aW9uW2krK107XG5cdFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0aWYoYmluZGluZyA9PT0gMCkge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IGRlZmluaXRpb25baSsrXSB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogYmluZGluZyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKGJpbmRpbmcgPT09IDApIHsgaSsrOyB9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYoU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcmVnaXN0ZXJSZXBvcnRpbmdPYnNlcnZlciB9IGZyb20gJy4uLy4uL3JlcG9ydGluZy5qcyc7XG5pbXBvcnQgeyBCUk9XU0VSX0lOVEVSVkVOVElPTiwgTUVTU0FHRV9FVkVOVCB9IGZyb20gJy4uLy4uL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBFUlJPUl9OT19BRCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcih7IGFkLCBhZFVybCwgd2lkdGgsIGhlaWdodCwgaW5zdGwgfSwgeyBta0ZyYW1lLCBzZW5kTWVzc2FnZSB9LCB3aW4pIHtcbiAgcmVnaXN0ZXJSZXBvcnRpbmdPYnNlcnZlcigocmVwb3J0KSA9PiB7XG4gICAgc2VuZE1lc3NhZ2UoTUVTU0FHRV9FVkVOVCwge1xuICAgICAgZXZlbnQ6IEJST1dTRVJfSU5URVJWRU5USU9OLFxuICAgICAgaW50ZXJ2ZW50aW9uOiByZXBvcnRcbiAgICB9KTtcbiAgfSwgWydpbnRlcnZlbnRpb24nXSk7XG5cbiAgaWYgKCFhZCAmJiAhYWRVcmwpIHtcbiAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ01pc3NpbmcgYWQgbWFya3VwIG9yIFVSTCcpO1xuICAgIGVyci5yZWFzb24gPSBFUlJPUl9OT19BRDtcbiAgICB0aHJvdyBlcnI7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGhlaWdodCA9PSBudWxsKSB7XG4gICAgICBjb25zdCBib2R5ID0gd2luLmRvY3VtZW50Py5ib2R5O1xuICAgICAgW2JvZHksIGJvZHk/LnBhcmVudEVsZW1lbnRdXG4gICAgICAgIC5maWx0ZXIoZWxtID0+IGVsbT8uc3R5bGUgIT0gbnVsbClcbiAgICAgICAgLmZvckVhY2goZWxtID0+IHtcbiAgICAgICAgICBlbG0uc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgZG9jID0gd2luLmRvY3VtZW50O1xuICAgIGNvbnN0IGF0dHJzID0geyB3aWR0aDogd2lkdGggPz8gJzEwMCUnLCBoZWlnaHQ6IGhlaWdodCA/PyAnMTAwJScgfTtcbiAgICBpZiAoYWRVcmwgJiYgIWFkKSB7XG4gICAgICBhdHRycy5zcmMgPSBhZFVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgYXR0cnMuc3JjZG9jID0gYWQ7XG4gICAgfVxuICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKG1rRnJhbWUoZG9jLCBhdHRycykpO1xuICAgIGlmIChpbnN0bCAmJiB3aW4uZnJhbWVFbGVtZW50KSB7XG4gICAgICAvLyBpbnRlcnN0aXRpYWxzIGFyZSByZW5kZXJlZCBpbiBhIG5lc3RlZCBpZnJhbWUgdGhhdCBuZWVkcyB0byBiZSBzaXplZFxuICAgICAgY29uc3Qgc3R5bGUgPSB3aW4uZnJhbWVFbGVtZW50LnN0eWxlO1xuICAgICAgc3R5bGUud2lkdGggPSB3aWR0aCA/IGAke3dpZHRofXB4YCA6ICcxMDB2dyc7XG4gICAgICBzdHlsZS5oZWlnaHQgPSBoZWlnaHQgPyBgJHtoZWlnaHR9cHhgIDogJzEwMHZoJztcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gd2luLnBhcmVudD8uZG9jdW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ2RpdiNjcmVhdGl2ZScpO1xuICAgICAgY29uc3QgYm94ID0gd2luLnBhcmVudD8uZG9jdW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ2RpdiNhZF9wb3NpdGlvbl9ib3gnKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclN0eWxlID0gY29udGFpbmVyICYmIHdpbi5wYXJlbnQ/LmdldENvbXB1dGVkU3R5bGU/Lihjb250YWluZXIpO1xuICAgICAgY29uc3QgYm94U3R5bGUgPSBib3ggJiYgd2luLnBhcmVudD8uZ2V0Q29tcHV0ZWRTdHlsZT8uKGJveCk7XG4gICAgICBpZiAoXG4gICAgICAgIGNvbnRhaW5lcj8ucGFyZW50RWxlbWVudCA9PT0gYm94ICYmXG4gICAgICAgIGNvbnRhaW5lclN0eWxlPy5tYXJnaW5Ub3AgJiYgY29udGFpbmVyU3R5bGU/Lm1hcmdpblRvcCAhPT0gJzBweCcgJiZcbiAgICAgICAgYm94U3R5bGUgJiYgYm94U3R5bGU/LmFsaWduSXRlbXMgPT09ICdmbGV4LXN0YXJ0J1xuICAgICAgKSB7XG4gICAgICAgIC8vIEdBTUVfTUFOVUFMX0lOVEVSU1RJVElBTCB1c2VzIGRpZmZlcmVudCBzdHlsaW5nIG9uIG1vYmlsZSwgd2hpY2ggZG9lc24ndCB3b3JrIHdpdGggb3VyIHJlc2l6aW5nO1xuICAgICAgICAvLyB0aGlzIHJlc2V0cyBpdCB0byB0aGUgc2FtZSBzdHlsZSB1c2VkIG9uIGRlc2t0b3BcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLm1hcmdpblRvcCA9ICcwcHgnO1xuICAgICAgICBib3guc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG53aW5kb3cucmVuZGVyID0gcmVuZGVyO1xuIl0sIm5hbWVzIjpbIkFEX1JFTkRFUl9GQUlMRURfUkVBU09OIiwiRVZFTlRTIiwiTUVTU0FHRVMiLCJQQl9MT0NBVE9SIiwiTUVTU0FHRV9SRVFVRVNUIiwiUkVRVUVTVCIsIk1FU1NBR0VfUkVTUE9OU0UiLCJSRVNQT05TRSIsIk1FU1NBR0VfRVZFTlQiLCJFVkVOVCIsIkVWRU5UX0FEX1JFTkRFUl9GQUlMRUQiLCJBRF9SRU5ERVJfRkFJTEVEIiwiRVZFTlRfQURfUkVOREVSX1NVQ0NFRURFRCIsIkFEX1JFTkRFUl9TVUNDRUVERUQiLCJFUlJPUl9FWENFUFRJT04iLCJFWENFUFRJT04iLCJCUk9XU0VSX0lOVEVSVkVOVElPTiIsIkVSUk9SX05PX0FEIiwiTk9fQUQiLCJyZWdpc3RlclJlcG9ydGluZ09ic2VydmVyIiwiY2FsbGJhY2siLCJ0eXBlcyIsImRvY3VtZW50IiwidmlldyIsImRlZmF1bHRWaWV3Iiwid2luZG93Iiwib2JzZXJ2ZXIiLCJSZXBvcnRpbmdPYnNlcnZlciIsInJlcG9ydHMiLCJidWZmZXJlZCIsIm9ic2VydmUiLCJlIiwiSlNPTl9NQVBQSU5HIiwiUExfQ09ERSIsIlBMX1NJWkUiLCJQTF9CSURTIiwiQkRfQklEREVSIiwiQkRfSUQiLCJCRF9QTF9JRCIsIkFEU0VSVkVSX1RBUkdFVElORyIsIkJEX1NFVFRJTkdfU1RBTkRBUkQiLCJERUJVR19NT0RFIiwiU1RBVFVTIiwiR09PRCIsIkFVQ1RJT05fSU5JVCIsIkFVQ1RJT05fVElNRU9VVCIsIkFVQ1RJT05fRU5EIiwiQklEX0FESlVTVE1FTlQiLCJCSURfVElNRU9VVCIsIkJJRF9SRVFVRVNURUQiLCJCSURfUkVTUE9OU0UiLCJCSURfQUNDRVBURUQiLCJCSURfUkVKRUNURUQiLCJOT19CSUQiLCJCSURfV09OIiwiQklEREVSX0RPTkUiLCJCSURERVJfRVJST1IiLCJTRVRfVEFSR0VUSU5HIiwiQkVGT1JFX1JFUVVFU1RfQklEUyIsIkJFRk9SRV9CSURERVJfSFRUUCIsIlJFUVVFU1RfQklEUyIsIlRDRjJfRU5GT1JDRU1FTlQiLCJBVUNUSU9OX0RFQlVHIiwiQklEX1ZJRVdBQkxFIiwiU1RBTEVfUkVOREVSIiwiRVhQSVJFRF9SRU5ERVIiLCJCSUxMQUJMRV9FVkVOVCIsIlBCU19BTkFMWVRJQ1MiLCJCRUZPUkVfUEJTX0hUVFAiLCJCUk9XU0lfSU5JVCIsIkJST1dTSV9EQVRBIiwiUFJFVkVOVF9XUklUSU5HX09OX01BSU5fRE9DVU1FTlQiLCJDQU5OT1RfRklORF9BRCIsIk1JU1NJTkdfRE9DX09SX0FESUQiLCJFVkVOVF9JRF9QQVRIUyIsImJpZFdvbiIsIkdSQU5VTEFSSVRZX09QVElPTlMiLCJMT1ciLCJNRURJVU0iLCJISUdIIiwiQVVUTyIsIkRFTlNFIiwiQ1VTVE9NIiwiVEFSR0VUSU5HX0tFWVMiLCJCSURERVIiLCJBRF9JRCIsIlBSSUNFX0JVQ0tFVCIsIlNJWkUiLCJERUFMIiwiU09VUkNFIiwiRk9STUFUIiwiVVVJRCIsIkNBQ0hFX0lEIiwiQ0FDSEVfSE9TVCIsIkFET01BSU4iLCJBQ0FUIiwiQ1JJRCIsIkRTUCIsIlZFUlNJT04iLCJERUZBVUxUX1RBUkdFVElOR19LRVlTIiwiTkFUSVZFX0tFWVMiLCJ0aXRsZSIsImJvZHkiLCJib2R5MiIsInByaXZhY3lMaW5rIiwicHJpdmFjeUljb24iLCJzcG9uc29yZWRCeSIsImltYWdlIiwiaWNvbiIsImNsaWNrVXJsIiwiZGlzcGxheVVybCIsImN0YSIsInJhdGluZyIsImFkZHJlc3MiLCJkb3dubG9hZHMiLCJsaWtlcyIsInBob25lIiwicHJpY2UiLCJzYWxlUHJpY2UiLCJyZW5kZXJlclVybCIsImFkVGVtcGxhdGUiLCJTMlMiLCJTUkMiLCJERUZBVUxUX0VORFBPSU5UIiwiU1lOQ0VEX0JJRERFUlNfS0VZIiwiQklEX1NUQVRVUyIsIkJJRF9UQVJHRVRJTkdfU0VUIiwiUkVOREVSRUQiLCJSRUpFQ1RJT05fUkVBU09OIiwiSU5WQUxJRCIsIklOVkFMSURfUkVRVUVTVF9JRCIsIkJJRERFUl9ESVNBTExPV0VEIiwiRkxPT1JfTk9UX01FVCIsIkNBTk5PVF9DT05WRVJUX0NVUlJFTkNZIiwiRFNBX1JFUVVJUkVEIiwiRFNBX01JU01BVENIIiwiUFJJQ0VfVE9PX0hJR0giLCJQUkVCSURfTkFUSVZFX0RBVEFfS0VZU19UT19PUlRCIiwiTkFUSVZFX0FTU0VUX1RZUEVTIiwic3BvbnNvcmVkIiwiZGVzYyIsInNhbGVwcmljZSIsImRlc2MyIiwiZGlzcGxheXVybCIsImN0YXRleHQiLCJOQVRJVkVfSU1BR0VfVFlQRVMiLCJJQ09OIiwiTUFJTiIsIk5BVElWRV9LRVlTX1RIQVRfQVJFX05PVF9BU1NFVFMiLCJOQVRJVkUiLCJJTlRFUlZFTlRJT04iLCJyZW5kZXIiLCJhZCIsImFkVXJsIiwid2lkdGgiLCJoZWlnaHQiLCJpbnN0bCIsIm1rRnJhbWUiLCJzZW5kTWVzc2FnZSIsIndpbiIsInJlcG9ydCIsImV2ZW50IiwiaW50ZXJ2ZW50aW9uIiwiZXJyIiwiRXJyb3IiLCJyZWFzb24iLCJwYXJlbnRFbGVtZW50IiwiZmlsdGVyIiwiZWxtIiwic3R5bGUiLCJmb3JFYWNoIiwiZG9jIiwiYXR0cnMiLCJzcmMiLCJzcmNkb2MiLCJhcHBlbmRDaGlsZCIsImZyYW1lRWxlbWVudCIsImNvbnRhaW5lciIsInBhcmVudCIsInF1ZXJ5U2VsZWN0b3IiLCJib3giLCJjb250YWluZXJTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJib3hTdHlsZSIsIm1hcmdpblRvcCIsImFsaWduSXRlbXMiXSwic291cmNlUm9vdCI6IiJ9