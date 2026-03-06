"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gptPreAuction"],{

/***/ "./modules/gptPreAuction.js":
/*!**********************************!*\
  !*** ./modules/gptPreAuction.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports _currentConfig, getSegments, getSignals, getSignalsArrayByAuctionsIds, getSignalsIntersection, getAuctionsIdsFromTargeting, appendGptSlots, makeBidRequestsHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libraries/gptUtils/gptUtils.js */ "./libraries/gptUtils/gptUtils.js");
/* harmony import */ var _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/constants.js */ "./src/constants.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/utils.js */ "../../node_modules/dlv/index.js");
var _this = undefined;







const MODULE_NAME = 'GPT Pre-Auction';
let _currentConfig = {};
let hooksAdded = false;
function getSegments(fpd, sections, segtax) {
  return (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__.getSegments)(fpd, sections, segtax);
}
function getSignals(fpd) {
  return (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__.getSignals)(fpd);
}
function getSignalsArrayByAuctionsIds(auctionIds) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager.index;
  const signals = auctionIds.map(auctionId => {
    var _index$getAuction;
    return (_index$getAuction = index.getAuction({
      auctionId
    })) === null || _index$getAuction === void 0 || (_index$getAuction = _index$getAuction.getFPD()) === null || _index$getAuction === void 0 ? void 0 : _index$getAuction.global;
  }).map(getSignals).filter(fpd => fpd);
  return signals;
}
function getSignalsIntersection(signals) {
  const result = {};
  _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_1__.taxonomies.forEach(taxonomy => {
    const allValues = signals.flatMap(x => x).filter(x => x.taxonomy === taxonomy).map(x => x.values);
    result[taxonomy] = allValues.length ? allValues.reduce((commonElements, subArray) => {
      return commonElements.filter(element => subArray.includes(element));
    }) : [];
    result[taxonomy] = {
      values: result[taxonomy]
    };
  });
  return result;
}
function getAuctionsIdsFromTargeting(targeting) {
  let am = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_2__.auctionManager;
  return Object.values(targeting).flatMap(x => Object.entries(x)).filter(entry => entry[0] === _src_constants_js__WEBPACK_IMPORTED_MODULE_4__.TARGETING_KEYS.AD_ID || entry[0].startsWith(_src_constants_js__WEBPACK_IMPORTED_MODULE_4__.TARGETING_KEYS.AD_ID + '_')).flatMap(entry => entry[1]).map(adId => {
    var _am$findBidByAdId;
    return (_am$findBidByAdId = am.findBidByAdId(adId)) === null || _am$findBidByAdId === void 0 ? void 0 : _am$findBidByAdId.auctionId;
  }).filter(id => id != null).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniques);
}
const appendGptSlots = adUnits => {
  const {
    customGptSlotMatching
  } = _currentConfig;
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.isGptPubadsDefined)()) {
    return;
  }
  const adUnitMap = adUnits.reduce((acc, adUnit) => {
    acc[adUnit.code] = acc[adUnit.code] || [];
    acc[adUnit.code].push(adUnit);
    return acc;
  }, {});
  const adUnitPaths = {};
  window.googletag.pubads().getSlots().forEach(slot => {
    const matchingAdUnitCode = Object.keys(adUnitMap).find(customGptSlotMatching ? customGptSlotMatching(slot) : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.isAdUnitCodeMatchingSlot)(slot));
    if (matchingAdUnitCode) {
      const path = adUnitPaths[matchingAdUnitCode] = slot.getAdUnitPath();
      const adserver = {
        name: 'gam',
        adslot: sanitizeSlotPath(path)
      };
      adUnitMap[matchingAdUnitCode].forEach(adUnit => {
        var _adUnit$ortb2Imp;
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_7__.dset)(adUnit, 'ortb2Imp.ext.data.adserver', Object.assign({}, (_adUnit$ortb2Imp = adUnit.ortb2Imp) === null || _adUnit$ortb2Imp === void 0 || (_adUnit$ortb2Imp = _adUnit$ortb2Imp.ext) === null || _adUnit$ortb2Imp === void 0 || (_adUnit$ortb2Imp = _adUnit$ortb2Imp.data) === null || _adUnit$ortb2Imp === void 0 ? void 0 : _adUnit$ortb2Imp.adserver, adserver));
      });
    }
  });
  return adUnitPaths;
};
const sanitizeSlotPath = path => {
  const gptConfig = _src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gptPreAuction') || {};
  if (gptConfig.mcmEnabled) {
    return path.replace(/(^\/\d*),\d*\//, '$1/');
  }
  return path;
};
const defaultPreAuction = (adUnit, adServerAdSlot, adUnitPath) => {
  // confirm that GPT is set up
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.isGptPubadsDefined)()) {
    return;
  }

  // find all GPT slots with this name
  var gptSlots = window.googletag.pubads().getSlots().filter(slot => slot.getAdUnitPath() === adUnitPath);
  if (gptSlots.length === 0) {
    return; // should never happen
  }
  if (gptSlots.length === 1) {
    return adServerAdSlot;
  }

  // else the adunit code must be div id. append it.
  return "".concat(adServerAdSlot, "#").concat(adUnit.code);
};
const makeBidRequestsHook = function (fn, adUnits) {
  const adUnitPaths = appendGptSlots(adUnits);
  const {
    useDefaultPreAuction,
    customPreAuction
  } = _currentConfig;
  adUnits.forEach(adUnit => {
    // init the ortb2Imp if not done yet
    adUnit.ortb2Imp = adUnit.ortb2Imp || {};
    adUnit.ortb2Imp.ext = adUnit.ortb2Imp.ext || {};
    adUnit.ortb2Imp.ext.data = adUnit.ortb2Imp.ext.data || {};
    const context = adUnit.ortb2Imp.ext;
    const adserverSlot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_8__["default"])(context, 'data.adserver.adslot');

    // @todo: check if should have precedence over customPreAuction and defaultPreAuction
    if (context.gpid) return;
    let result;
    if (customPreAuction) {
      result = customPreAuction(adUnit, adserverSlot, adUnitPaths === null || adUnitPaths === void 0 ? void 0 : adUnitPaths[adUnit.code]);
    } else if (useDefaultPreAuction) {
      result = defaultPreAuction(adUnit, adserverSlot, adUnitPaths === null || adUnitPaths === void 0 ? void 0 : adUnitPaths[adUnit.code]);
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.logWarn)('Neither customPreAuction, defaultPreAuction and gpid were specified');
    }
    if (result) {
      context.gpid = result;
    }
  });
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  return fn.call(_this, adUnits, ...args);
};
const setPpsConfigFromTargetingSet = (next, targetingSet) => {
  // set gpt config
  const auctionsIds = getAuctionsIdsFromTargeting(targetingSet);
  const signals = getSignalsIntersection(getSignalsArrayByAuctionsIds(auctionsIds));
  window.googletag.setConfig && window.googletag.setConfig({
    pps: {
      taxonomies: signals
    }
  });
  next(targetingSet);
};
const handleSetGptConfig = moduleConfig => {
  _currentConfig = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.pick)(moduleConfig, ['enabled', enabled => enabled !== false, 'customGptSlotMatching', customGptSlotMatching => typeof customGptSlotMatching === 'function' && customGptSlotMatching, 'customPreAuction', customPreAuction => typeof customPreAuction === 'function' && customPreAuction, 'useDefaultPreAuction', useDefaultPreAuction => useDefaultPreAuction !== null && useDefaultPreAuction !== void 0 ? useDefaultPreAuction : true]);
  if (_currentConfig.enabled) {
    if (!hooksAdded) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('makeBidRequests').before(makeBidRequestsHook);
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('targetingDone').after(setPpsConfigFromTargetingSet);
      hooksAdded = true;
    }
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.logInfo)("".concat(MODULE_NAME, ": Turning off module"));
    _currentConfig = {};
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('makeBidRequests').getHooks({
      hook: makeBidRequestsHook
    }).remove();
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('targetingDone').getHooks({
      hook: setPpsConfigFromTargetingSet
    }).remove();
    hooksAdded = false;
  }
};
_src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gptPreAuction', config => handleSetGptConfig(config.gptPreAuction));
handleSetGptConfig({});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('gptPreAuction');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["gptUtils","chunk-core","viewport","dnt","creative-renderer-display"], () => (__webpack_exec__("./modules/gptPreAuction.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gptPreAuction.js.map