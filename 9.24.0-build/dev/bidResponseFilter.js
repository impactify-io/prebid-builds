"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["bidResponseFilter"],{

/***/ "./modules/bidResponseFilter/index.js":
/*!********************************************!*\
  !*** ./modules/bidResponseFilter/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports MODULE_NAME, BID_CATEGORY_REJECTION_REASON, BID_ADV_DOMAINS_REJECTION_REASON, BID_ATTR_REJECTION_REASON, reset, addBidResponseHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/config.js */ "./src/config.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");




const MODULE_NAME = 'bidResponseFilter';
const BID_CATEGORY_REJECTION_REASON = 'Category is not allowed';
const BID_ADV_DOMAINS_REJECTION_REASON = 'Adv domain is not allowed';
const BID_ATTR_REJECTION_REASON = 'Attr is not allowed';
let moduleConfig;
let enabled = false;
function init() {
  _src_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig(MODULE_NAME, cfg => {
    moduleConfig = cfg[MODULE_NAME];
    if (enabled && !moduleConfig) {
      reset();
    } else if (!enabled && moduleConfig) {
      enabled = true;
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_1__.getHook)('addBidResponse').before(addBidResponseHook);
    }
  });
}
function reset() {
  enabled = false;
  (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_1__.getHook)('addBidResponse').getHooks({
    hook: addBidResponseHook
  }).remove();
}
function addBidResponseHook(next, adUnitCode, bid, reject) {
  let index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index;
  const {
    bcat = [],
    badv = []
  } = index.getOrtb2(bid) || {};
  const battr = index.getBidRequest(bid)?.ortb2Imp[bid.mediaType]?.battr || index.getAdUnit(bid)?.ortb2Imp[bid.mediaType]?.battr || [];
  const catConfig = {
    enforce: true,
    blockUnknown: true,
    ...(moduleConfig?.cat || {})
  };
  const advConfig = {
    enforce: true,
    blockUnknown: true,
    ...(moduleConfig?.adv || {})
  };
  const attrConfig = {
    enforce: true,
    blockUnknown: true,
    ...(moduleConfig?.attr || {})
  };
  const {
    primaryCatId,
    secondaryCatIds = [],
    advertiserDomains = [],
    attr: metaAttr
  } = bid.meta || {};

  // checking if bid fulfills ortb2 fields rules
  if (catConfig.enforce && bcat.some(category => [primaryCatId, ...secondaryCatIds].includes(category)) || catConfig.blockUnknown && !primaryCatId) {
    reject(BID_CATEGORY_REJECTION_REASON);
  } else if (advConfig.enforce && badv.some(domain => advertiserDomains.includes(domain)) || advConfig.blockUnknown && !advertiserDomains.length) {
    reject(BID_ADV_DOMAINS_REJECTION_REASON);
  } else if (attrConfig.enforce && battr.includes(metaAttr) || attrConfig.blockUnknown && !metaAttr) {
    reject(BID_ATTR_REJECTION_REASON);
  } else {
    return next(adUnitCode, bid, reject);
  }
}
init();
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_3__.registerModule)('bidResponseFilter');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","creative-renderer-display"], () => (__webpack_exec__("./modules/bidResponseFilter/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=bidResponseFilter.js.map