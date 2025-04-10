"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gptPreAuction"],{

/***/ "./modules/gptPreAuction.js":
/*!**********************************!*\
  !*** ./modules/gptPreAuction.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports _currentConfig, getSegments, getSignals, getSignalsArrayByAuctionsIds, getSignalsIntersection, getAuctionsIdsFromTargeting, appendGptSlots, appendPbAdSlot, makeBidRequestsHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libraries/gptUtils/gptUtils.js */ "./libraries/gptUtils/gptUtils.js");
/* harmony import */ var _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/constants.js */ "./src/constants.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_polyfill_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
var _this = undefined;








const MODULE_NAME = 'GPT Pre-Auction';
let _currentConfig = {};
let hooksAdded = false;
function getSegments(fpd, sections, segtax) {
  return (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_0__.getSegments)(fpd, sections, segtax);
}
function getSignals(fpd) {
  return (0,_libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_0__.getSignals)(fpd);
}
function getSignalsArrayByAuctionsIds(auctionIds) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_1__.auctionManager.index;
  const signals = auctionIds.map(auctionId => index.getAuction({
    auctionId
  })?.getFPD()?.global).map(getSignals).filter(fpd => fpd);
  return signals;
}
function getSignalsIntersection(signals) {
  const result = {};
  _libraries_gptUtils_gptUtils_js__WEBPACK_IMPORTED_MODULE_0__.taxonomies.forEach(taxonomy => {
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
  let am = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _src_auctionManager_js__WEBPACK_IMPORTED_MODULE_1__.auctionManager;
  return Object.values(targeting).flatMap(x => Object.entries(x)).filter(entry => entry[0] === _src_constants_js__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS.AD_ID || entry[0].startsWith(_src_constants_js__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS.AD_ID + '_')).flatMap(entry => entry[1]).map(adId => am.findBidByAdId(adId)?.auctionId).filter(id => id != null).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.uniques);
}
const appendGptSlots = adUnits => {
  const {
    customGptSlotMatching
  } = _currentConfig;
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isGptPubadsDefined)()) {
    return;
  }
  const adUnitMap = adUnits.reduce((acc, adUnit) => {
    acc[adUnit.code] = acc[adUnit.code] || [];
    acc[adUnit.code].push(adUnit);
    return acc;
  }, {});
  const adUnitPaths = {};
  window.googletag.pubads().getSlots().forEach(slot => {
    const matchingAdUnitCode = (0,_src_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.find)(Object.keys(adUnitMap), customGptSlotMatching ? customGptSlotMatching(slot) : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isAdUnitCodeMatchingSlot)(slot));
    if (matchingAdUnitCode) {
      const path = adUnitPaths[matchingAdUnitCode] = slot.getAdUnitPath();
      const adserver = {
        name: 'gam',
        adslot: sanitizeSlotPath(path)
      };
      adUnitMap[matchingAdUnitCode].forEach(adUnit => {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.dset)(adUnit, 'ortb2Imp.ext.data.adserver', Object.assign({}, adUnit.ortb2Imp?.ext?.data?.adserver, adserver));
      });
    }
  });
  return adUnitPaths;
};
const sanitizeSlotPath = path => {
  const gptConfig = _src_config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('gptPreAuction') || {};
  if (gptConfig.mcmEnabled) {
    return path.replace(/(^\/\d*),\d*\//, '$1/');
  }
  return path;
};
const defaultPreAuction = (adUnit, adServerAdSlot, adUnitPath) => {
  const context = adUnit.ortb2Imp.ext.data;

  // use pbadslot if supplied
  if (context.pbadslot) {
    return context.pbadslot;
  }

  // confirm that GPT is set up
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.isGptPubadsDefined)()) {
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
  return `${adServerAdSlot}#${adUnit.code}`;
};
const appendPbAdSlot = adUnit => {
  const context = adUnit.ortb2Imp.ext.data;
  const {
    customPbAdSlot
  } = _currentConfig;

  // use context.pbAdSlot if set (if someone set it already, it will take precedence over others)
  if (context.pbadslot) {
    return;
  }
  if (customPbAdSlot) {
    context.pbadslot = customPbAdSlot(adUnit.code, (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_7__["default"])(context, 'adserver.adslot'));
    return;
  }

  // use data attribute 'data-adslotid' if set
  try {
    const adUnitCodeDiv = document.getElementById(adUnit.code);
    if (adUnitCodeDiv.dataset.adslotid) {
      context.pbadslot = adUnitCodeDiv.dataset.adslotid;
      return;
    }
  } catch (e) {}
  // banner adUnit, use GPT adunit if defined
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_7__["default"])(context, 'adserver.adslot')) {
    context.pbadslot = context.adserver.adslot;
    return;
  }
  context.pbadslot = adUnit.code;
  return true;
};
function warnDeprecation(adUnit) {
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)(`pbadslot is deprecated and will soon be removed, use gpid instead`, adUnit);
}
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
    // if neither new confs set do old stuff
    if (!customPreAuction && !useDefaultPreAuction) {
      warnDeprecation(adUnit);
      const usedAdUnitCode = appendPbAdSlot(adUnit);
      // gpid should be set to itself if already set, or to what pbadslot was (as long as it was not adUnit code)
      if (!context.gpid && !usedAdUnitCode) {
        context.gpid = context.data.pbadslot;
      }
    } else {
      if (context.data?.pbadslot) {
        warnDeprecation(adUnit);
      }
      let adserverSlot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_7__["default"])(context, 'data.adserver.adslot');
      let result;
      if (customPreAuction) {
        result = customPreAuction(adUnit, adserverSlot, adUnitPaths?.[adUnit.code]);
      } else if (useDefaultPreAuction) {
        result = defaultPreAuction(adUnit, adserverSlot, adUnitPaths?.[adUnit.code]);
      }
      if (result) {
        context.gpid = context.data.pbadslot = result;
      }
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
  _currentConfig = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.pick)(moduleConfig, ['enabled', enabled => enabled !== false, 'customGptSlotMatching', customGptSlotMatching => typeof customGptSlotMatching === 'function' && customGptSlotMatching, 'customPbAdSlot', customPbAdSlot => typeof customPbAdSlot === 'function' && customPbAdSlot, 'customPreAuction', customPreAuction => typeof customPreAuction === 'function' && customPreAuction, 'useDefaultPreAuction', useDefaultPreAuction => useDefaultPreAuction ?? true]);
  if (_currentConfig.enabled) {
    if (!hooksAdded) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_8__.getHook)('makeBidRequests').before(makeBidRequestsHook);
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_8__.getHook)('targetingDone').after(setPpsConfigFromTargetingSet);
      hooksAdded = true;
    }
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logInfo)(`${MODULE_NAME}: Turning off module`);
    _currentConfig = {};
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_8__.getHook)('makeBidRequests').getHooks({
      hook: makeBidRequestsHook
    }).remove();
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_8__.getHook)('targetingDone').getHooks({
      hook: setPpsConfigFromTargetingSet
    }).remove();
    hooksAdded = false;
  }
};
_src_config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('gptPreAuction', config => handleSetGptConfig(config.gptPreAuction));
handleSetGptConfig({});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_9__.registerModule)('gptPreAuction');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["gptUtils","chunk-core","viewport","greedy","creative-renderer-display"], () => (__webpack_exec__("./modules/gptPreAuction.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gptPreAuction.js.map