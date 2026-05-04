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
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
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



function getReplacer(adId, _ref) {
  let {
    assets = [],
    ortb,
    nativeKeys = {}
  } = _ref;
  const assetValues = Object.fromEntries(assets.map(_ref2 => {
    let {
      key,
      value
    } = _ref2;
    return [key, value];
  }));
  let repl = Object.fromEntries(Object.entries(nativeKeys).flatMap(_ref3 => {
    let [name, key] = _ref3;
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
    return repl.reduce((text, _ref4) => {
      let [pattern, value] = _ref4;
      return text.replaceAll(pattern, value || '');
    }, template);
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
function getAdMarkup(adId, nativeData, replacer, win) {
  let load = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : loadScript;
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
function render(_ref5, _ref6, win) {
  let {
    adId,
    native
  } = _ref5;
  let {
    sendMessage
  } = _ref6;
  let getMarkup = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getAdMarkup;
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