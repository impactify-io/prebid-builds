"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gptPreAuction"],{

/***/ "./modules/gptPreAuction.js":
/*!**********************************!*\
  !*** ./modules/gptPreAuction.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports _currentConfig, appendGptSlots, appendPbAdSlot, makeBidRequestsHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_polyfill_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/polyfill.js */ "./src/polyfill.js");
var _this = undefined;





var MODULE_NAME = 'GPT Pre-Auction';
var _currentConfig = {};
var hooksAdded = false;
var appendGptSlots = function appendGptSlots(adUnits) {
  var _currentConfig2 = _currentConfig,
    customGptSlotMatching = _currentConfig2.customGptSlotMatching;
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isGptPubadsDefined)()) {
    return;
  }
  var adUnitMap = adUnits.reduce(function (acc, adUnit) {
    acc[adUnit.code] = acc[adUnit.code] || [];
    acc[adUnit.code].push(adUnit);
    return acc;
  }, {});
  window.googletag.pubads().getSlots().forEach(function (slot) {
    var matchingAdUnitCode = (0,_src_polyfill_js__WEBPACK_IMPORTED_MODULE_1__.find)(Object.keys(adUnitMap), customGptSlotMatching ? customGptSlotMatching(slot) : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isAdUnitCodeMatchingSlot)(slot));
    if (matchingAdUnitCode) {
      var adserver = {
        name: 'gam',
        adslot: sanitizeSlotPath(slot.getAdUnitPath())
      };
      adUnitMap[matchingAdUnitCode].forEach(function (adUnit) {
        var _adUnit$ortb2Imp, _adUnit$ortb2Imp$ext, _adUnit$ortb2Imp$ext$;
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.dset)(adUnit, 'ortb2Imp.ext.data.adserver', Object.assign({}, (_adUnit$ortb2Imp = adUnit.ortb2Imp) === null || _adUnit$ortb2Imp === void 0 ? void 0 : (_adUnit$ortb2Imp$ext = _adUnit$ortb2Imp.ext) === null || _adUnit$ortb2Imp$ext === void 0 ? void 0 : (_adUnit$ortb2Imp$ext$ = _adUnit$ortb2Imp$ext.data) === null || _adUnit$ortb2Imp$ext$ === void 0 ? void 0 : _adUnit$ortb2Imp$ext$.adserver, adserver));
      });
    }
  });
};
var sanitizeSlotPath = function sanitizeSlotPath(path) {
  var gptConfig = _src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gptPreAuction') || {};
  if (gptConfig.mcmEnabled) {
    return path.replace(/(^\/\d*),\d*\//, '$1/');
  }
  return path;
};
var defaultPreAuction = function defaultPreAuction(adUnit, adServerAdSlot) {
  var context = adUnit.ortb2Imp.ext.data;

  // use pbadslot if supplied
  if (context.pbadslot) {
    return context.pbadslot;
  }

  // confirm that GPT is set up
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isGptPubadsDefined)()) {
    return;
  }

  // find all GPT slots with this name
  var gptSlots = window.googletag.pubads().getSlots().filter(function (slot) {
    return slot.getAdUnitPath() === adServerAdSlot;
  });
  if (gptSlots.length === 0) {
    return; // should never happen
  }

  if (gptSlots.length === 1) {
    return adServerAdSlot;
  }

  // else the adunit code must be div id. append it.
  return "".concat(adServerAdSlot, "#").concat(adUnit.code);
};
var appendPbAdSlot = function appendPbAdSlot(adUnit) {
  var context = adUnit.ortb2Imp.ext.data;
  var _currentConfig3 = _currentConfig,
    customPbAdSlot = _currentConfig3.customPbAdSlot;

  // use context.pbAdSlot if set (if someone set it already, it will take precedence over others)
  if (context.pbadslot) {
    return;
  }
  if (customPbAdSlot) {
    context.pbadslot = customPbAdSlot(adUnit.code, (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(context, 'adserver.adslot'));
    return;
  }

  // use data attribute 'data-adslotid' if set
  try {
    var adUnitCodeDiv = document.getElementById(adUnit.code);
    if (adUnitCodeDiv.dataset.adslotid) {
      context.pbadslot = adUnitCodeDiv.dataset.adslotid;
      return;
    }
  } catch (e) {}
  // banner adUnit, use GPT adunit if defined
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(context, 'adserver.adslot')) {
    context.pbadslot = context.adserver.adslot;
    return;
  }
  context.pbadslot = adUnit.code;
  return true;
};
var makeBidRequestsHook = function makeBidRequestsHook(fn, adUnits) {
  appendGptSlots(adUnits);
  var _currentConfig4 = _currentConfig,
    useDefaultPreAuction = _currentConfig4.useDefaultPreAuction,
    customPreAuction = _currentConfig4.customPreAuction;
  adUnits.forEach(function (adUnit) {
    // init the ortb2Imp if not done yet
    adUnit.ortb2Imp = adUnit.ortb2Imp || {};
    adUnit.ortb2Imp.ext = adUnit.ortb2Imp.ext || {};
    adUnit.ortb2Imp.ext.data = adUnit.ortb2Imp.ext.data || {};
    var context = adUnit.ortb2Imp.ext;

    // if neither new confs set do old stuff
    if (!customPreAuction && !useDefaultPreAuction) {
      var usedAdUnitCode = appendPbAdSlot(adUnit);
      // gpid should be set to itself if already set, or to what pbadslot was (as long as it was not adUnit code)
      if (!context.gpid && !usedAdUnitCode) {
        context.gpid = context.data.pbadslot;
      }
    } else {
      var adserverSlot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(context, 'data.adserver.adslot');
      var result;
      if (customPreAuction) {
        result = customPreAuction(adUnit, adserverSlot);
      } else if (useDefaultPreAuction) {
        result = defaultPreAuction(adUnit, adserverSlot);
      }
      if (result) {
        context.gpid = context.data.pbadslot = result;
      }
    }
  });
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  return fn.call.apply(fn, [_this, adUnits].concat(args));
};
var handleSetGptConfig = function handleSetGptConfig(moduleConfig) {
  _currentConfig = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.pick)(moduleConfig, ['enabled', function (enabled) {
    return enabled !== false;
  }, 'customGptSlotMatching', function (customGptSlotMatching) {
    return typeof customGptSlotMatching === 'function' && customGptSlotMatching;
  }, 'customPbAdSlot', function (customPbAdSlot) {
    return typeof customPbAdSlot === 'function' && customPbAdSlot;
  }, 'customPreAuction', function (customPreAuction) {
    return typeof customPreAuction === 'function' && customPreAuction;
  }, 'useDefaultPreAuction', function (useDefaultPreAuction) {
    return useDefaultPreAuction === true;
  }]);
  if (_currentConfig.enabled) {
    if (!hooksAdded) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('makeBidRequests').before(makeBidRequestsHook);
      hooksAdded = true;
    }
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)("".concat(MODULE_NAME, ": Turning off module"));
    _currentConfig = {};
    (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.getHook)('makeBidRequests').getHooks({
      hook: makeBidRequestsHook
    }).remove();
    hooksAdded = false;
  }
};
_src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('gptPreAuction', function (config) {
  return handleSetGptConfig(config.gptPreAuction);
});
handleSetGptConfig({});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__.registerModule)('gptPreAuction');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["creative-renderer-display"], function() { return __webpack_exec__("./modules/gptPreAuction.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gptPreAuction.js.map