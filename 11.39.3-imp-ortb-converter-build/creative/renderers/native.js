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

/***/ "./creative/renderers/native/constants.js"
/*!************************************************!*\
  !*** ./creative/renderers/native/constants.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_CLICK: () => (/* binding */ ACTION_CLICK),
/* harmony export */   ACTION_IMP: () => (/* binding */ ACTION_IMP),
/* harmony export */   ACTION_RESIZE: () => (/* binding */ ACTION_RESIZE),
/* harmony export */   MESSAGE_NATIVE: () => (/* binding */ MESSAGE_NATIVE),
/* harmony export */   ORTB_ASSETS: () => (/* binding */ ORTB_ASSETS)
/* harmony export */ });
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/constants.js */ "./src/constants.js");
// eslint-disable-next-line prebid/validate-imports

const MESSAGE_NATIVE = _src_constants_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.NATIVE;
const ACTION_RESIZE = 'resizeNativeHeight';
const ACTION_CLICK = 'click';
const ACTION_IMP = 'fireNativeImpressionTrackers';
const ORTB_ASSETS = {
  title: 'text',
  data: 'value',
  img: 'url',
  video: 'vasttag'
};

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
/*!***********************************************!*\
  !*** ./creative/renderers/native/renderer.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdMarkup: () => (/* binding */ getAdMarkup),
/* harmony export */   getReplacer: () => (/* binding */ getReplacer),
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _reporting_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../reporting.js */ "./creative/reporting.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants.js */ "./creative/constants.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./creative/renderers/native/constants.js");



function getReplacer(adId, {
  assets = [],
  ortb,
  nativeKeys = {}
}) {
  const assetValues = Object.fromEntries(assets.map(({
    key,
    value
  }) => [key, value]));
  let repl = Object.fromEntries(Object.entries(nativeKeys).flatMap(([name, key]) => {
    const value = assetValues.hasOwnProperty(name) ? assetValues[name] : undefined;
    return [[`##${key}##`, value], [`${key}:${adId}`, value]];
  }));
  if (ortb) {
    Object.assign(repl, {
      '##hb_native_linkurl##': ortb.link?.url,
      '##hb_native_privacy##': ortb.privacy
    }, Object.fromEntries((ortb.assets || []).flatMap(asset => {
      const type = Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_2__.ORTB_ASSETS).find(type => asset[type]);
      return [type && [`##hb_native_asset_id_${asset.id}##`, asset[type][_constants_js__WEBPACK_IMPORTED_MODULE_2__.ORTB_ASSETS[type]]], asset.link?.url && [`##hb_native_asset_link_id_${asset.id}##`, asset.link.url]].filter(e => e);
    })));
  }
  repl = Object.entries(repl).concat([[/##hb_native_asset_(link_)?id_\d+##/g]]);
  return function (template) {
    return repl.reduce((text, [pattern, value]) => text.replaceAll(pattern, value || ''), template);
  };
}
function loadScript(url, doc) {
  return new Promise((resolve, reject) => {
    const script = doc.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    doc.body.appendChild(script);
  });
}
function getRenderFrames(node) {
  return Array.from(node.querySelectorAll('iframe[srcdoc*="render"]'));
}
function getInnerHTML(node) {
  const clone = node.cloneNode(true);
  getRenderFrames(clone).forEach(node => node.parentNode.removeChild(node));
  return clone.innerHTML;
}
function getAdMarkup(adId, nativeData, replacer, win, load = loadScript) {
  const {
    rendererUrl,
    assets,
    ortb,
    adTemplate
  } = nativeData;
  const doc = win.document;
  if (rendererUrl) {
    return load(rendererUrl, doc).then(() => {
      if (typeof win.renderAd !== 'function') {
        throw new Error(`Renderer from '${rendererUrl}' does not define renderAd()`);
      }
      const payload = assets || [];
      payload.ortb = ortb;
      return win.renderAd(payload);
    });
  } else {
    return Promise.resolve(replacer(adTemplate ?? getInnerHTML(doc.body)));
  }
}
function render({
  adId,
  native
}, {
  sendMessage
}, win, getMarkup = getAdMarkup) {
  (0,_reporting_js__WEBPACK_IMPORTED_MODULE_0__.registerReportingObserver)(report => {
    sendMessage(_constants_js__WEBPACK_IMPORTED_MODULE_1__.MESSAGE_EVENT, {
      event: _constants_js__WEBPACK_IMPORTED_MODULE_1__.BROWSER_INTERVENTION,
      intervention: report
    });
  }, ['intervention']);
  const {
    head,
    body
  } = win.document;
  const resize = () => {
    // force redraw - for some reason this is needed to get the right dimensions
    body.style.display = 'none';
    body.style.display = 'block';
    sendMessage(_constants_js__WEBPACK_IMPORTED_MODULE_2__.MESSAGE_NATIVE, {
      action: _constants_js__WEBPACK_IMPORTED_MODULE_2__.ACTION_RESIZE,
      height: body.offsetHeight || win.document.documentElement.scrollHeight,
      width: body.offsetWidth
    });
  };
  function replaceMarkup(target, markup) {
    // do not remove the rendering logic if it's embedded in this window; things will break otherwise
    const renderFrames = getRenderFrames(target);
    Array.from(target.childNodes).filter(node => !renderFrames.includes(node)).forEach(node => target.removeChild(node));
    target.insertAdjacentHTML('afterbegin', markup);
  }
  const replacer = getReplacer(adId, native);
  replaceMarkup(head, replacer(getInnerHTML(head)));
  return getMarkup(adId, native, replacer, win).then(markup => {
    replaceMarkup(body, markup);
    if (typeof win.postRenderAd === 'function') {
      win.postRenderAd({
        adId,
        ...native
      });
    }
    win.document.querySelectorAll('.pb-click').forEach(el => {
      const assetId = el.getAttribute('hb_native_asset_id');
      el.addEventListener('click', () => sendMessage(_constants_js__WEBPACK_IMPORTED_MODULE_2__.MESSAGE_NATIVE, {
        action: _constants_js__WEBPACK_IMPORTED_MODULE_2__.ACTION_CLICK,
        assetId
      }));
    });
    sendMessage(_constants_js__WEBPACK_IMPORTED_MODULE_2__.MESSAGE_NATIVE, {
      action: _constants_js__WEBPACK_IMPORTED_MODULE_2__.ACTION_IMP
    });
    win.document.readyState === 'complete' ? resize() : win.onload = resize;
  });
}
window.render = render;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUV5TixNQUFNLEVBQUVyTixxREFBVUE7SUFBQyxDQUFDLENBQUM7SUFDbkRvTSxHQUFHLENBQUMzTCxRQUFRLENBQUMrTixVQUFVLEtBQUssVUFBVSxHQUFHdEIsTUFBTSxDQUFDLENBQUMsR0FBR2QsR0FBRyxDQUFDbkIsTUFBTSxHQUFHaUMsTUFBTTtFQUN6RSxDQUFDLENBQUM7QUFDSjtBQUVBdE0sTUFBTSxDQUFDOEwsTUFBTSxHQUFHQSxNQUFNLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vY3JlYXRpdmUvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uLi8uLi9jcmVhdGl2ZS9yZW5kZXJlcnMvbmF0aXZlL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vY3JlYXRpdmUvcmVwb3J0aW5nLmpzIiwid2VicGFjazovLy8uLi8uLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uLi8uLi9jcmVhdGl2ZS9yZW5kZXJlcnMvbmF0aXZlL3JlbmRlcmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmViaWQvdmFsaWRhdGUtaW1wb3J0c1xuaW1wb3J0IHsgQURfUkVOREVSX0ZBSUxFRF9SRUFTT04sIEVWRU5UUywgTUVTU0FHRVMgfSBmcm9tICcuLi9zcmMvY29uc3RhbnRzLmpzJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWJpZC92YWxpZGF0ZS1pbXBvcnRzXG5leHBvcnQgeyBQQl9MT0NBVE9SIH0gZnJvbSAnLi4vc3JjL2NvbnN0YW50cy5qcyc7XG5leHBvcnQgY29uc3QgTUVTU0FHRV9SRVFVRVNUID0gTUVTU0FHRVMuUkVRVUVTVDtcbmV4cG9ydCBjb25zdCBNRVNTQUdFX1JFU1BPTlNFID0gTUVTU0FHRVMuUkVTUE9OU0U7XG5leHBvcnQgY29uc3QgTUVTU0FHRV9FVkVOVCA9IE1FU1NBR0VTLkVWRU5UO1xuZXhwb3J0IGNvbnN0IEVWRU5UX0FEX1JFTkRFUl9GQUlMRUQgPSBFVkVOVFMuQURfUkVOREVSX0ZBSUxFRDtcbmV4cG9ydCBjb25zdCBFVkVOVF9BRF9SRU5ERVJfU1VDQ0VFREVEID0gRVZFTlRTLkFEX1JFTkRFUl9TVUNDRUVERUQ7XG5leHBvcnQgY29uc3QgRVJST1JfRVhDRVBUSU9OID0gQURfUkVOREVSX0ZBSUxFRF9SRUFTT04uRVhDRVBUSU9OO1xuZXhwb3J0IGNvbnN0IEJST1dTRVJfSU5URVJWRU5USU9OID0gRVZFTlRTLkJST1dTRVJfSU5URVJWRU5USU9OO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWJpZC92YWxpZGF0ZS1pbXBvcnRzXG5pbXBvcnQgeyBNRVNTQUdFUyB9IGZyb20gJy4uLy4uLy4uL3NyYy9jb25zdGFudHMuanMnO1xuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9OQVRJVkUgPSBNRVNTQUdFUy5OQVRJVkU7XG5leHBvcnQgY29uc3QgQUNUSU9OX1JFU0laRSA9ICdyZXNpemVOYXRpdmVIZWlnaHQnO1xuZXhwb3J0IGNvbnN0IEFDVElPTl9DTElDSyA9ICdjbGljayc7XG5leHBvcnQgY29uc3QgQUNUSU9OX0lNUCA9ICdmaXJlTmF0aXZlSW1wcmVzc2lvblRyYWNrZXJzJztcblxuZXhwb3J0IGNvbnN0IE9SVEJfQVNTRVRTID0ge1xuICB0aXRsZTogJ3RleHQnLFxuICBkYXRhOiAndmFsdWUnLFxuICBpbWc6ICd1cmwnLFxuICB2aWRlbzogJ3Zhc3R0YWcnXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyUmVwb3J0aW5nT2JzZXJ2ZXIoY2FsbGJhY2ssIHR5cGVzLCBkb2N1bWVudCkge1xuICBjb25zdCB2aWV3ID0gZG9jdW1lbnQ/LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgaWYgKCdSZXBvcnRpbmdPYnNlcnZlcicgaW4gdmlldykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyB2aWV3LlJlcG9ydGluZ09ic2VydmVyKChyZXBvcnRzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKHJlcG9ydHNbMF0pO1xuICAgICAgfSwgeyBidWZmZXJlZDogdHJ1ZSwgdHlwZXMgfSk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IEpTT05fTUFQUElORyA9IHtcbiAgUExfQ09ERTogJ2NvZGUnLFxuICBQTF9TSVpFOiAnc2l6ZXMnLFxuICBQTF9CSURTOiAnYmlkcycsXG4gIEJEX0JJRERFUjogJ2JpZGRlcicsXG4gIEJEX0lEOiAncGFyYW1zZCcsXG4gIEJEX1BMX0lEOiAncGxhY2VtZW50SWQnLFxuICBBRFNFUlZFUl9UQVJHRVRJTkc6ICdhZHNlcnZlclRhcmdldGluZycsXG4gIEJEX1NFVFRJTkdfU1RBTkRBUkQ6ICdzdGFuZGFyZCdcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBERUJVR19NT0RFID0gJ3BianNfZGVidWcnO1xuXG5leHBvcnQgY29uc3QgU1RBVFVTID0ge1xuICBHT09EOiAxXG59O1xuXG5leHBvcnQgY29uc3QgRVZFTlRTID0ge1xuICBBVUNUSU9OX0lOSVQ6ICdhdWN0aW9uSW5pdCcsXG4gIEFVQ1RJT05fVElNRU9VVDogJ2F1Y3Rpb25UaW1lb3V0JyxcbiAgQVVDVElPTl9FTkQ6ICdhdWN0aW9uRW5kJyxcbiAgQklEX0FESlVTVE1FTlQ6ICdiaWRBZGp1c3RtZW50JyxcbiAgQklEX1RJTUVPVVQ6ICdiaWRUaW1lb3V0JyxcbiAgQklEX1JFUVVFU1RFRDogJ2JpZFJlcXVlc3RlZCcsXG4gIEJJRF9SRVNQT05TRTogJ2JpZFJlc3BvbnNlJyxcbiAgQklEX0FDQ0VQVEVEOiAnYmlkQWNjZXB0ZWQnLFxuICBCSURfUkVKRUNURUQ6ICdiaWRSZWplY3RlZCcsXG4gIE5PX0JJRDogJ25vQmlkJyxcbiAgQklEX1dPTjogJ2JpZFdvbicsXG4gIEJJRERFUl9ET05FOiAnYmlkZGVyRG9uZScsXG4gIEJJRERFUl9FUlJPUjogJ2JpZGRlckVycm9yJyxcbiAgU0VUX1RBUkdFVElORzogJ3NldFRhcmdldGluZycsXG4gIEJFRk9SRV9SRVFVRVNUX0JJRFM6ICdiZWZvcmVSZXF1ZXN0QmlkcycsXG4gIEJFRk9SRV9CSURERVJfSFRUUDogJ2JlZm9yZUJpZGRlckh0dHAnLFxuICBSRVFVRVNUX0JJRFM6ICdyZXF1ZXN0QmlkcycsXG4gIEFEX1JFTkRFUl9GQUlMRUQ6ICdhZFJlbmRlckZhaWxlZCcsXG4gIEFEX1JFTkRFUl9TVUNDRUVERUQ6ICdhZFJlbmRlclN1Y2NlZWRlZCcsXG4gIFRDRjJfRU5GT1JDRU1FTlQ6ICd0Y2YyRW5mb3JjZW1lbnQnLFxuICBBVUNUSU9OX0RFQlVHOiAnYXVjdGlvbkRlYnVnJyxcbiAgQklEX1ZJRVdBQkxFOiAnYmlkVmlld2FibGUnLFxuICBTVEFMRV9SRU5ERVI6ICdzdGFsZVJlbmRlcicsXG4gIEVYUElSRURfUkVOREVSOiAnZXhwaXJlZFJlbmRlcicsXG4gIEJJTExBQkxFX0VWRU5UOiAnYmlsbGFibGVFdmVudCcsXG4gIFBCU19BTkFMWVRJQ1M6ICdwYnNBbmFseXRpY3MnLFxuICBCRUZPUkVfUEJTX0hUVFA6ICdiZWZvcmVQQlNIdHRwJyxcbiAgQlJPV1NJX0lOSVQ6ICdicm93c2lJbml0JyxcbiAgQlJPV1NJX0RBVEE6ICdicm93c2lEYXRhJyxcbiAgQlJPV1NFUl9JTlRFUlZFTlRJT046ICdicm93c2VySW50ZXJ2ZW50aW9uJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IEFEX1JFTkRFUl9GQUlMRURfUkVBU09OID0ge1xuICBQUkVWRU5UX1dSSVRJTkdfT05fTUFJTl9ET0NVTUVOVDogJ3ByZXZlbnRXcml0aW5nT25NYWluRG9jdW1lbnQnLFxuICBOT19BRDogJ25vQWQnLFxuICBFWENFUFRJT046ICdleGNlcHRpb24nLFxuICBDQU5OT1RfRklORF9BRDogJ2Nhbm5vdEZpbmRBZCcsXG4gIE1JU1NJTkdfRE9DX09SX0FESUQ6ICdtaXNzaW5nRG9jT3JBZGlkJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IEVWRU5UX0lEX1BBVEhTID0ge1xuICBiaWRXb246ICdhZFVuaXRDb2RlJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IEdSQU5VTEFSSVRZX09QVElPTlMgPSB7XG4gIExPVzogJ2xvdycsXG4gIE1FRElVTTogJ21lZGl1bScsXG4gIEhJR0g6ICdoaWdoJyxcbiAgQVVUTzogJ2F1dG8nLFxuICBERU5TRTogJ2RlbnNlJyxcbiAgQ1VTVE9NOiAnY3VzdG9tJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFRBUkdFVElOR19LRVlTID0ge1xuICBCSURERVI6ICdoYl9iaWRkZXInLFxuICBBRF9JRDogJ2hiX2FkaWQnLFxuICBQUklDRV9CVUNLRVQ6ICdoYl9wYicsXG4gIFNJWkU6ICdoYl9zaXplJyxcbiAgREVBTDogJ2hiX2RlYWwnLFxuICBTT1VSQ0U6ICdoYl9zb3VyY2UnLFxuICBGT1JNQVQ6ICdoYl9mb3JtYXQnLFxuICBVVUlEOiAnaGJfdXVpZCcsXG4gIENBQ0hFX0lEOiAnaGJfY2FjaGVfaWQnLFxuICBDQUNIRV9IT1NUOiAnaGJfY2FjaGVfaG9zdCcsXG4gIEFET01BSU46ICdoYl9hZG9tYWluJyxcbiAgQUNBVDogJ2hiX2FjYXQnLFxuICBDUklEOiAnaGJfY3JpZCcsXG4gIERTUDogJ2hiX2RzcCcsXG4gIFZFUlNJT046ICdoYl92ZXInXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9UQVJHRVRJTkdfS0VZUyA9IHtcbiAgQklEREVSOiAnaGJfYmlkZGVyJyxcbiAgQURfSUQ6ICdoYl9hZGlkJyxcbiAgUFJJQ0VfQlVDS0VUOiAnaGJfcGInLFxuICBTSVpFOiAnaGJfc2l6ZScsXG4gIERFQUw6ICdoYl9kZWFsJyxcbiAgRk9STUFUOiAnaGJfZm9ybWF0JyxcbiAgVVVJRDogJ2hiX3V1aWQnLFxuICBDQUNIRV9IT1NUOiAnaGJfY2FjaGVfaG9zdCcsXG4gIFZFUlNJT046ICdoYl92ZXInXG59O1xuXG5leHBvcnQgY29uc3QgTkFUSVZFX0tFWVMgPSB7XG4gIHRpdGxlOiAnaGJfbmF0aXZlX3RpdGxlJyxcbiAgYm9keTogJ2hiX25hdGl2ZV9ib2R5JyxcbiAgYm9keTI6ICdoYl9uYXRpdmVfYm9keTInLFxuICBwcml2YWN5TGluazogJ2hiX25hdGl2ZV9wcml2YWN5JyxcbiAgcHJpdmFjeUljb246ICdoYl9uYXRpdmVfcHJpdmljb24nLFxuICBzcG9uc29yZWRCeTogJ2hiX25hdGl2ZV9icmFuZCcsXG4gIGltYWdlOiAnaGJfbmF0aXZlX2ltYWdlJyxcbiAgaWNvbjogJ2hiX25hdGl2ZV9pY29uJyxcbiAgY2xpY2tVcmw6ICdoYl9uYXRpdmVfbGlua3VybCcsXG4gIGRpc3BsYXlVcmw6ICdoYl9uYXRpdmVfZGlzcGxheXVybCcsXG4gIGN0YTogJ2hiX25hdGl2ZV9jdGEnLFxuICByYXRpbmc6ICdoYl9uYXRpdmVfcmF0aW5nJyxcbiAgYWRkcmVzczogJ2hiX25hdGl2ZV9hZGRyZXNzJyxcbiAgZG93bmxvYWRzOiAnaGJfbmF0aXZlX2Rvd25sb2FkcycsXG4gIGxpa2VzOiAnaGJfbmF0aXZlX2xpa2VzJyxcbiAgcGhvbmU6ICdoYl9uYXRpdmVfcGhvbmUnLFxuICBwcmljZTogJ2hiX25hdGl2ZV9wcmljZScsXG4gIHNhbGVQcmljZTogJ2hiX25hdGl2ZV9zYWxlcHJpY2UnLFxuICByZW5kZXJlclVybDogJ2hiX3JlbmRlcmVyX3VybCcsXG4gIGFkVGVtcGxhdGU6ICdoYl9hZFRlbXBsYXRlJ1xufTtcblxuZXhwb3J0IGNvbnN0IFMyUyA9IHtcbiAgU1JDOiAnczJzJyxcbiAgREVGQVVMVF9FTkRQT0lOVDogJ2h0dHBzOi8vcHJlYmlkLmFkbnhzLmNvbS9wYnMvdjEvb3BlbnJ0YjIvYXVjdGlvbicsXG4gIFNZTkNFRF9CSURERVJTX0tFWTogJ3BianNTeW5jcydcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBCSURfU1RBVFVTID0ge1xuICBCSURfVEFSR0VUSU5HX1NFVDogJ3RhcmdldGluZ1NldCcsXG4gIFJFTkRFUkVEOiAncmVuZGVyZWQnLFxuICBCSURfUkVKRUNURUQ6ICdiaWRSZWplY3RlZCdcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBSRUpFQ1RJT05fUkVBU09OID0ge1xuICBJTlZBTElEOiAnQmlkIGhhcyBtaXNzaW5nIG9yIGludmFsaWQgcHJvcGVydGllcycsXG4gIElOVkFMSURfUkVRVUVTVF9JRDogJ0ludmFsaWQgcmVxdWVzdCBJRCcsXG4gIEJJRERFUl9ESVNBTExPV0VEOiAnQmlkZGVyIGNvZGUgaXMgbm90IGFsbG93ZWQgYnkgYWxsb3dlZEFsdGVybmF0ZUJpZGRlckNvZGVzIC8gYWxsb3dVbmtub3duQmlkZGVyQ29kZXMnLFxuICBGTE9PUl9OT1RfTUVUOiAnQmlkIGRvZXMgbm90IG1lZXQgcHJpY2UgZmxvb3InLFxuICBDQU5OT1RfQ09OVkVSVF9DVVJSRU5DWTogJ1VuYWJsZSB0byBjb252ZXJ0IGN1cnJlbmN5JyxcbiAgRFNBX1JFUVVJUkVEOiAnQmlkIGRvZXMgbm90IHByb3ZpZGUgcmVxdWlyZWQgRFNBIHRyYW5zcGFyZW5jeSBpbmZvJyxcbiAgRFNBX01JU01BVENIOiAnQmlkIGluZGljYXRlcyBpbmFwcHJvcHJpYXRlIERTQSByZW5kZXJpbmcgbWV0aG9kJyxcbiAgUFJJQ0VfVE9PX0hJR0g6ICdCaWQgcHJpY2UgZXhjZWVkcyBtYXhpbXVtIHZhbHVlJ1xufTtcblxuZXhwb3J0IGNvbnN0IFBSRUJJRF9OQVRJVkVfREFUQV9LRVlTX1RPX09SVEIgPSB7XG4gIGJvZHk6ICdkZXNjJyxcbiAgYm9keTI6ICdkZXNjMicsXG4gIHNwb25zb3JlZEJ5OiAnc3BvbnNvcmVkJyxcbiAgY3RhOiAnY3RhdGV4dCcsXG4gIHJhdGluZzogJ3JhdGluZycsXG4gIGFkZHJlc3M6ICdhZGRyZXNzJyxcbiAgZG93bmxvYWRzOiAnZG93bmxvYWRzJyxcbiAgbGlrZXM6ICdsaWtlcycsXG4gIHBob25lOiAncGhvbmUnLFxuICBwcmljZTogJ3ByaWNlJyxcbiAgc2FsZVByaWNlOiAnc2FsZXByaWNlJyxcbiAgZGlzcGxheVVybDogJ2Rpc3BsYXl1cmwnXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgTkFUSVZFX0FTU0VUX1RZUEVTID0ge1xuICBzcG9uc29yZWQ6IDEsXG4gIGRlc2M6IDIsXG4gIHJhdGluZzogMyxcbiAgbGlrZXM6IDQsXG4gIGRvd25sb2FkczogNSxcbiAgcHJpY2U6IDYsXG4gIHNhbGVwcmljZTogNyxcbiAgcGhvbmU6IDgsXG4gIGFkZHJlc3M6IDksXG4gIGRlc2MyOiAxMCxcbiAgZGlzcGxheXVybDogMTEsXG4gIGN0YXRleHQ6IDEyXG59O1xuXG5leHBvcnQgY29uc3QgTkFUSVZFX0lNQUdFX1RZUEVTID0ge1xuICBJQ09OOiAxLFxuICBNQUlOOiAzXG59O1xuXG5leHBvcnQgY29uc3QgTkFUSVZFX0tFWVNfVEhBVF9BUkVfTk9UX0FTU0VUUyA9IFtcbiAgJ3ByaXZhY3lJY29uJyxcbiAgJ2NsaWNrVXJsJyxcbiAgJ2FkVGVtcGxhdGUnLFxuICAncmVuZGVyZXJVcmwnLFxuICAndHlwZSdcbl0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBNRVNTQUdFUyA9IHtcbiAgUkVRVUVTVDogJ1ByZWJpZCBSZXF1ZXN0JyxcbiAgUkVTUE9OU0U6ICdQcmViaWQgUmVzcG9uc2UnLFxuICBOQVRJVkU6ICdQcmViaWQgTmF0aXZlJyxcbiAgRVZFTlQ6ICdQcmViaWQgRXZlbnQnLFxuICBJTlRFUlZFTlRJT046ICdQcmViaWQgSW50ZXJ2ZW50aW9uJ1xufTtcblxuZXhwb3J0IGNvbnN0IFBCX0xPQ0FUT1IgPSAnX19wYl9sb2NhdG9yX18nO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHJlZ2lzdGVyUmVwb3J0aW5nT2JzZXJ2ZXIgfSBmcm9tICcuLi8uLi9yZXBvcnRpbmcuanMnO1xuaW1wb3J0IHsgQlJPV1NFUl9JTlRFUlZFTlRJT04sIE1FU1NBR0VfRVZFTlQgfSBmcm9tICcuLi8uLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgQUNUSU9OX0NMSUNLLCBBQ1RJT05fSU1QLCBBQ1RJT05fUkVTSVpFLCBNRVNTQUdFX05BVElWRSwgT1JUQl9BU1NFVFMgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXBsYWNlcihhZElkLCB7IGFzc2V0cyA9IFtdLCBvcnRiLCBuYXRpdmVLZXlzID0ge30gfSkge1xuICBjb25zdCBhc3NldFZhbHVlcyA9IE9iamVjdC5mcm9tRW50cmllcygoYXNzZXRzKS5tYXAoKHsga2V5LCB2YWx1ZSB9KSA9PiBba2V5LCB2YWx1ZV0pKTtcbiAgbGV0IHJlcGwgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMobmF0aXZlS2V5cykuZmxhdE1hcCgoW25hbWUsIGtleV0pID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXNzZXRWYWx1ZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBhc3NldFZhbHVlc1tuYW1lXSA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIFtgIyMke2tleX0jI2AsIHZhbHVlXSxcbiAgICAgICAgW2Ake2tleX06JHthZElkfWAsIHZhbHVlXVxuICAgICAgXTtcbiAgICB9KVxuICApO1xuICBpZiAob3J0Yikge1xuICAgIE9iamVjdC5hc3NpZ24ocmVwbCxcbiAgICAgIHtcbiAgICAgICAgJyMjaGJfbmF0aXZlX2xpbmt1cmwjIyc6IG9ydGIubGluaz8udXJsLFxuICAgICAgICAnIyNoYl9uYXRpdmVfcHJpdmFjeSMjJzogb3J0Yi5wcml2YWN5XG4gICAgICB9LFxuICAgICAgT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICAob3J0Yi5hc3NldHMgfHwgW10pLmZsYXRNYXAoYXNzZXQgPT4ge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBPYmplY3Qua2V5cyhPUlRCX0FTU0VUUykuZmluZCh0eXBlID0+IGFzc2V0W3R5cGVdKTtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdHlwZSAmJiBbYCMjaGJfbmF0aXZlX2Fzc2V0X2lkXyR7YXNzZXQuaWR9IyNgLCBhc3NldFt0eXBlXVtPUlRCX0FTU0VUU1t0eXBlXV1dLFxuICAgICAgICAgICAgYXNzZXQubGluaz8udXJsICYmIFtgIyNoYl9uYXRpdmVfYXNzZXRfbGlua19pZF8ke2Fzc2V0LmlkfSMjYCwgYXNzZXQubGluay51cmxdXG4gICAgICAgICAgXS5maWx0ZXIoZSA9PiBlKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApO1xuICB9XG4gIHJlcGwgPSBPYmplY3QuZW50cmllcyhyZXBsKS5jb25jYXQoW1svIyNoYl9uYXRpdmVfYXNzZXRfKGxpbmtfKT9pZF9cXGQrIyMvZ11dKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgcmV0dXJuIHJlcGwucmVkdWNlKCh0ZXh0LCBbcGF0dGVybiwgdmFsdWVdKSA9PiB0ZXh0LnJlcGxhY2VBbGwocGF0dGVybiwgdmFsdWUgfHwgJycpLCB0ZW1wbGF0ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxvYWRTY3JpcHQodXJsLCBkb2MpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0Lm9ubG9hZCA9IHJlc29sdmU7XG4gICAgc2NyaXB0Lm9uZXJyb3IgPSByZWplY3Q7XG4gICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICBkb2MuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVuZGVyRnJhbWVzKG5vZGUpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdpZnJhbWVbc3JjZG9jKj1cInJlbmRlclwiXScpKTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5uZXJIVE1MKG5vZGUpIHtcbiAgY29uc3QgY2xvbmUgPSBub2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgZ2V0UmVuZGVyRnJhbWVzKGNsb25lKS5mb3JFYWNoKG5vZGUgPT4gbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpKTtcbiAgcmV0dXJuIGNsb25lLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkTWFya3VwKGFkSWQsIG5hdGl2ZURhdGEsIHJlcGxhY2VyLCB3aW4sIGxvYWQgPSBsb2FkU2NyaXB0KSB7XG4gIGNvbnN0IHsgcmVuZGVyZXJVcmwsIGFzc2V0cywgb3J0YiwgYWRUZW1wbGF0ZSB9ID0gbmF0aXZlRGF0YTtcbiAgY29uc3QgZG9jID0gd2luLmRvY3VtZW50O1xuICBpZiAocmVuZGVyZXJVcmwpIHtcbiAgICByZXR1cm4gbG9hZChyZW5kZXJlclVybCwgZG9jKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygd2luLnJlbmRlckFkICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVuZGVyZXIgZnJvbSAnJHtyZW5kZXJlclVybH0nIGRvZXMgbm90IGRlZmluZSByZW5kZXJBZCgpYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBwYXlsb2FkID0gYXNzZXRzIHx8IFtdO1xuICAgICAgcGF5bG9hZC5vcnRiID0gb3J0YjtcbiAgICAgIHJldHVybiB3aW4ucmVuZGVyQWQocGF5bG9hZCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXBsYWNlcihhZFRlbXBsYXRlID8/IGdldElubmVySFRNTChkb2MuYm9keSkpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKHsgYWRJZCwgbmF0aXZlIH0sIHsgc2VuZE1lc3NhZ2UgfSwgd2luLCBnZXRNYXJrdXAgPSBnZXRBZE1hcmt1cCkge1xuICByZWdpc3RlclJlcG9ydGluZ09ic2VydmVyKChyZXBvcnQpID0+IHtcbiAgICBzZW5kTWVzc2FnZShNRVNTQUdFX0VWRU5ULCB7XG4gICAgICBldmVudDogQlJPV1NFUl9JTlRFUlZFTlRJT04sXG4gICAgICBpbnRlcnZlbnRpb246IHJlcG9ydFxuICAgIH0pO1xuICB9LCBbJ2ludGVydmVudGlvbiddKTtcbiAgY29uc3QgeyBoZWFkLCBib2R5IH0gPSB3aW4uZG9jdW1lbnQ7XG4gIGNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcbiAgICAvLyBmb3JjZSByZWRyYXcgLSBmb3Igc29tZSByZWFzb24gdGhpcyBpcyBuZWVkZWQgdG8gZ2V0IHRoZSByaWdodCBkaW1lbnNpb25zXG4gICAgYm9keS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGJvZHkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgc2VuZE1lc3NhZ2UoTUVTU0FHRV9OQVRJVkUsIHtcbiAgICAgIGFjdGlvbjogQUNUSU9OX1JFU0laRSxcbiAgICAgIGhlaWdodDogYm9keS5vZmZzZXRIZWlnaHQgfHwgd2luLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsXG4gICAgICB3aWR0aDogYm9keS5vZmZzZXRXaWR0aFxuICAgIH0pO1xuICB9O1xuICBmdW5jdGlvbiByZXBsYWNlTWFya3VwKHRhcmdldCwgbWFya3VwKSB7XG4gICAgLy8gZG8gbm90IHJlbW92ZSB0aGUgcmVuZGVyaW5nIGxvZ2ljIGlmIGl0J3MgZW1iZWRkZWQgaW4gdGhpcyB3aW5kb3c7IHRoaW5ncyB3aWxsIGJyZWFrIG90aGVyd2lzZVxuICAgIGNvbnN0IHJlbmRlckZyYW1lcyA9IGdldFJlbmRlckZyYW1lcyh0YXJnZXQpO1xuICAgIEFycmF5LmZyb20odGFyZ2V0LmNoaWxkTm9kZXMpLmZpbHRlcihub2RlID0+ICFyZW5kZXJGcmFtZXMuaW5jbHVkZXMobm9kZSkpLmZvckVhY2gobm9kZSA9PiB0YXJnZXQucmVtb3ZlQ2hpbGQobm9kZSkpO1xuICAgIHRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBtYXJrdXApO1xuICB9XG4gIGNvbnN0IHJlcGxhY2VyID0gZ2V0UmVwbGFjZXIoYWRJZCwgbmF0aXZlKTtcbiAgcmVwbGFjZU1hcmt1cChoZWFkLCByZXBsYWNlcihnZXRJbm5lckhUTUwoaGVhZCkpKTtcbiAgcmV0dXJuIGdldE1hcmt1cChhZElkLCBuYXRpdmUsIHJlcGxhY2VyLCB3aW4pLnRoZW4obWFya3VwID0+IHtcbiAgICByZXBsYWNlTWFya3VwKGJvZHksIG1hcmt1cCk7XG4gICAgaWYgKHR5cGVvZiB3aW4ucG9zdFJlbmRlckFkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB3aW4ucG9zdFJlbmRlckFkKHsgYWRJZCwgLi4ubmF0aXZlIH0pO1xuICAgIH1cbiAgICB3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBiLWNsaWNrJykuZm9yRWFjaChlbCA9PiB7XG4gICAgICBjb25zdCBhc3NldElkID0gZWwuZ2V0QXR0cmlidXRlKCdoYl9uYXRpdmVfYXNzZXRfaWQnKTtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZE1lc3NhZ2UoTUVTU0FHRV9OQVRJVkUsIHsgYWN0aW9uOiBBQ1RJT05fQ0xJQ0ssIGFzc2V0SWQgfSkpO1xuICAgIH0pO1xuICAgIHNlbmRNZXNzYWdlKE1FU1NBR0VfTkFUSVZFLCB7IGFjdGlvbjogQUNUSU9OX0lNUCB9KTtcbiAgICB3aW4uZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyA/IHJlc2l6ZSgpIDogd2luLm9ubG9hZCA9IHJlc2l6ZTtcbiAgfSk7XG59XG5cbndpbmRvdy5yZW5kZXIgPSByZW5kZXI7XG4iXSwibmFtZXMiOlsiQURfUkVOREVSX0ZBSUxFRF9SRUFTT04iLCJFVkVOVFMiLCJNRVNTQUdFUyIsIlBCX0xPQ0FUT1IiLCJNRVNTQUdFX1JFUVVFU1QiLCJSRVFVRVNUIiwiTUVTU0FHRV9SRVNQT05TRSIsIlJFU1BPTlNFIiwiTUVTU0FHRV9FVkVOVCIsIkVWRU5UIiwiRVZFTlRfQURfUkVOREVSX0ZBSUxFRCIsIkFEX1JFTkRFUl9GQUlMRUQiLCJFVkVOVF9BRF9SRU5ERVJfU1VDQ0VFREVEIiwiQURfUkVOREVSX1NVQ0NFRURFRCIsIkVSUk9SX0VYQ0VQVElPTiIsIkVYQ0VQVElPTiIsIkJST1dTRVJfSU5URVJWRU5USU9OIiwiTUVTU0FHRV9OQVRJVkUiLCJOQVRJVkUiLCJBQ1RJT05fUkVTSVpFIiwiQUNUSU9OX0NMSUNLIiwiQUNUSU9OX0lNUCIsIk9SVEJfQVNTRVRTIiwidGl0bGUiLCJkYXRhIiwiaW1nIiwidmlkZW8iLCJyZWdpc3RlclJlcG9ydGluZ09ic2VydmVyIiwiY2FsbGJhY2siLCJ0eXBlcyIsImRvY3VtZW50IiwidmlldyIsImRlZmF1bHRWaWV3Iiwid2luZG93Iiwib2JzZXJ2ZXIiLCJSZXBvcnRpbmdPYnNlcnZlciIsInJlcG9ydHMiLCJidWZmZXJlZCIsIm9ic2VydmUiLCJlIiwiSlNPTl9NQVBQSU5HIiwiUExfQ09ERSIsIlBMX1NJWkUiLCJQTF9CSURTIiwiQkRfQklEREVSIiwiQkRfSUQiLCJCRF9QTF9JRCIsIkFEU0VSVkVSX1RBUkdFVElORyIsIkJEX1NFVFRJTkdfU1RBTkRBUkQiLCJERUJVR19NT0RFIiwiU1RBVFVTIiwiR09PRCIsIkFVQ1RJT05fSU5JVCIsIkFVQ1RJT05fVElNRU9VVCIsIkFVQ1RJT05fRU5EIiwiQklEX0FESlVTVE1FTlQiLCJCSURfVElNRU9VVCIsIkJJRF9SRVFVRVNURUQiLCJCSURfUkVTUE9OU0UiLCJCSURfQUNDRVBURUQiLCJCSURfUkVKRUNURUQiLCJOT19CSUQiLCJCSURfV09OIiwiQklEREVSX0RPTkUiLCJCSURERVJfRVJST1IiLCJTRVRfVEFSR0VUSU5HIiwiQkVGT1JFX1JFUVVFU1RfQklEUyIsIkJFRk9SRV9CSURERVJfSFRUUCIsIlJFUVVFU1RfQklEUyIsIlRDRjJfRU5GT1JDRU1FTlQiLCJBVUNUSU9OX0RFQlVHIiwiQklEX1ZJRVdBQkxFIiwiU1RBTEVfUkVOREVSIiwiRVhQSVJFRF9SRU5ERVIiLCJCSUxMQUJMRV9FVkVOVCIsIlBCU19BTkFMWVRJQ1MiLCJCRUZPUkVfUEJTX0hUVFAiLCJCUk9XU0lfSU5JVCIsIkJST1dTSV9EQVRBIiwiUFJFVkVOVF9XUklUSU5HX09OX01BSU5fRE9DVU1FTlQiLCJOT19BRCIsIkNBTk5PVF9GSU5EX0FEIiwiTUlTU0lOR19ET0NfT1JfQURJRCIsIkVWRU5UX0lEX1BBVEhTIiwiYmlkV29uIiwiR1JBTlVMQVJJVFlfT1BUSU9OUyIsIkxPVyIsIk1FRElVTSIsIkhJR0giLCJBVVRPIiwiREVOU0UiLCJDVVNUT00iLCJUQVJHRVRJTkdfS0VZUyIsIkJJRERFUiIsIkFEX0lEIiwiUFJJQ0VfQlVDS0VUIiwiU0laRSIsIkRFQUwiLCJTT1VSQ0UiLCJGT1JNQVQiLCJVVUlEIiwiQ0FDSEVfSUQiLCJDQUNIRV9IT1NUIiwiQURPTUFJTiIsIkFDQVQiLCJDUklEIiwiRFNQIiwiVkVSU0lPTiIsIkRFRkFVTFRfVEFSR0VUSU5HX0tFWVMiLCJOQVRJVkVfS0VZUyIsImJvZHkiLCJib2R5MiIsInByaXZhY3lMaW5rIiwicHJpdmFjeUljb24iLCJzcG9uc29yZWRCeSIsImltYWdlIiwiaWNvbiIsImNsaWNrVXJsIiwiZGlzcGxheVVybCIsImN0YSIsInJhdGluZyIsImFkZHJlc3MiLCJkb3dubG9hZHMiLCJsaWtlcyIsInBob25lIiwicHJpY2UiLCJzYWxlUHJpY2UiLCJyZW5kZXJlclVybCIsImFkVGVtcGxhdGUiLCJTMlMiLCJTUkMiLCJERUZBVUxUX0VORFBPSU5UIiwiU1lOQ0VEX0JJRERFUlNfS0VZIiwiQklEX1NUQVRVUyIsIkJJRF9UQVJHRVRJTkdfU0VUIiwiUkVOREVSRUQiLCJSRUpFQ1RJT05fUkVBU09OIiwiSU5WQUxJRCIsIklOVkFMSURfUkVRVUVTVF9JRCIsIkJJRERFUl9ESVNBTExPV0VEIiwiRkxPT1JfTk9UX01FVCIsIkNBTk5PVF9DT05WRVJUX0NVUlJFTkNZIiwiRFNBX1JFUVVJUkVEIiwiRFNBX01JU01BVENIIiwiUFJJQ0VfVE9PX0hJR0giLCJQUkVCSURfTkFUSVZFX0RBVEFfS0VZU19UT19PUlRCIiwiTkFUSVZFX0FTU0VUX1RZUEVTIiwic3BvbnNvcmVkIiwiZGVzYyIsInNhbGVwcmljZSIsImRlc2MyIiwiZGlzcGxheXVybCIsImN0YXRleHQiLCJOQVRJVkVfSU1BR0VfVFlQRVMiLCJJQ09OIiwiTUFJTiIsIk5BVElWRV9LRVlTX1RIQVRfQVJFX05PVF9BU1NFVFMiLCJJTlRFUlZFTlRJT04iLCJnZXRSZXBsYWNlciIsImFkSWQiLCJhc3NldHMiLCJvcnRiIiwibmF0aXZlS2V5cyIsImFzc2V0VmFsdWVzIiwiT2JqZWN0IiwiZnJvbUVudHJpZXMiLCJtYXAiLCJrZXkiLCJ2YWx1ZSIsInJlcGwiLCJlbnRyaWVzIiwiZmxhdE1hcCIsIm5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsInVuZGVmaW5lZCIsImFzc2lnbiIsImxpbmsiLCJ1cmwiLCJwcml2YWN5IiwiYXNzZXQiLCJ0eXBlIiwia2V5cyIsImZpbmQiLCJpZCIsImZpbHRlciIsImNvbmNhdCIsInRlbXBsYXRlIiwicmVkdWNlIiwidGV4dCIsInBhdHRlcm4iLCJyZXBsYWNlQWxsIiwibG9hZFNjcmlwdCIsImRvYyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic2NyaXB0IiwiY3JlYXRlRWxlbWVudCIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzcmMiLCJhcHBlbmRDaGlsZCIsImdldFJlbmRlckZyYW1lcyIsIm5vZGUiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiZ2V0SW5uZXJIVE1MIiwiY2xvbmUiLCJjbG9uZU5vZGUiLCJmb3JFYWNoIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwiaW5uZXJIVE1MIiwiZ2V0QWRNYXJrdXAiLCJuYXRpdmVEYXRhIiwicmVwbGFjZXIiLCJ3aW4iLCJsb2FkIiwidGhlbiIsInJlbmRlckFkIiwiRXJyb3IiLCJwYXlsb2FkIiwicmVuZGVyIiwibmF0aXZlIiwic2VuZE1lc3NhZ2UiLCJnZXRNYXJrdXAiLCJyZXBvcnQiLCJldmVudCIsImludGVydmVudGlvbiIsImhlYWQiLCJyZXNpemUiLCJzdHlsZSIsImRpc3BsYXkiLCJhY3Rpb24iLCJoZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJkb2N1bWVudEVsZW1lbnQiLCJzY3JvbGxIZWlnaHQiLCJ3aWR0aCIsIm9mZnNldFdpZHRoIiwicmVwbGFjZU1hcmt1cCIsInRhcmdldCIsIm1hcmt1cCIsInJlbmRlckZyYW1lcyIsImNoaWxkTm9kZXMiLCJpbmNsdWRlcyIsImluc2VydEFkamFjZW50SFRNTCIsInBvc3RSZW5kZXJBZCIsImVsIiwiYXNzZXRJZCIsImdldEF0dHJpYnV0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWFkeVN0YXRlIl0sInNvdXJjZVJvb3QiOiIifQ==