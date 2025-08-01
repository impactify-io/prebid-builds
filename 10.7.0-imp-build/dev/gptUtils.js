"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gptUtils"],{

/***/ "./libraries/gptUtils/gptUtils.js":
/*!****************************************!*\
  !*** ./libraries/gptUtils/gptUtils.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGptSlotInfoForAdUnitCode: () => (/* binding */ getGptSlotInfoForAdUnitCode),
/* harmony export */   getSegments: () => (/* binding */ getSegments),
/* harmony export */   getSignals: () => (/* binding */ getSignals),
/* harmony export */   taxonomies: () => (/* binding */ taxonomies)
/* harmony export */ });
/* unused harmony exports clearSlotInfoCache, isSlotMatchingAdUnitCode, setKeyValue, getGptSlotForAdUnitCode, subscribeToGamEvent, subscribeToGamSlotRenderEndedEvent */
/* harmony import */ var _src_fpd_oneClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/fpd/oneClient.js */ "./src/fpd/oneClient.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/utils.js */ "../../node_modules/dlv/index.js");


const slotInfoCache = new Map();
function clearSlotInfoCache() {
  slotInfoCache.clear();
}

/**
 * Returns filter function to match adUnitCode in slot
 * @param {string} adUnitCode AdUnit code
 * @return {function} filter function
 */
function isSlotMatchingAdUnitCode(adUnitCode) {
  return slot => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.compareCodeAndSlot)(slot, adUnitCode);
}

/**
 * @summary Export a k-v pair to GAM
 */
function setKeyValue(key, value) {
  if (!key || typeof key !== 'string') return false;
  window.googletag = window.googletag || {
    cmd: []
  };
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.cmd.push(() => {
    window.googletag.pubads().setTargeting(key, value);
  });
}

/**
 * @summary Uses the adUnit's code in order to find a matching gpt slot object on the page
 */
function getGptSlotForAdUnitCode(adUnitCode) {
  let matchingSlot;
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isGptPubadsDefined)()) {
    // find the first matching gpt slot on the page
    matchingSlot = window.googletag.pubads().getSlots().find(isSlotMatchingAdUnitCode(adUnitCode));
  }
  return matchingSlot;
}

/**
 * @summary Uses the adUnit's code in order to find a matching gptSlot on the page
 */
function getGptSlotInfoForAdUnitCode(adUnitCode) {
  if (slotInfoCache.has(adUnitCode)) {
    return slotInfoCache.get(adUnitCode);
  }
  const matchingSlot = getGptSlotForAdUnitCode(adUnitCode);
  let info = {};
  if (matchingSlot) {
    info = {
      gptSlot: matchingSlot.getAdUnitPath(),
      divId: matchingSlot.getSlotElementId()
    };
  }
  !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(info) && slotInfoCache.set(adUnitCode, info);
  return info;
}
const taxonomies = ['IAB_AUDIENCE_1_1', 'IAB_CONTENT_2_2'];
function getSignals(fpd) {
  const signals = Object.entries({
    [taxonomies[0]]: getSegments(fpd, ['user.data'], 4),
    [taxonomies[1]]: getSegments(fpd, _src_fpd_oneClient_js__WEBPACK_IMPORTED_MODULE_1__.CLIENT_SECTIONS.map(section => `${section}.content.data`), 6)
  }).map(_ref => {
    let [taxonomy, values] = _ref;
    return values.length ? {
      taxonomy,
      values
    } : null;
  }).filter(ob => ob);
  return signals;
}
function getSegments(fpd, sections, segtax) {
  return sections.flatMap(section => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fpd, section) || []).filter(datum => datum.ext?.segtax === segtax).flatMap(datum => datum.segment?.map(seg => seg.id)).filter(ob => ob).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.uniques);
}

/**
 * Add an event listener on the given GAM event.
 * If GPT Pubads isn't defined, window.googletag is set to a new object.
 * @param {String} event
 * @param {Function} callback
 */
function subscribeToGamEvent(event, callback) {
  const register = () => window.googletag.pubads().addEventListener(event, callback);
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isGptPubadsDefined)()) {
    register();
    return;
  }
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.cmd.push(register);
}

/**
 * @typedef {Object} Slot
 * @property {function(String): (String|null)} get
 * @property {function(): String} getAdUnitPath
 * @property {function(): String[]} getAttributeKeys
 * @property {function(): String[]} getCategoryExclusions
 * @property {function(String): String} getSlotElementId
 * @property {function(): String[]} getTargeting
 * @property {function(): String[]} getTargetingKeys
 * @see {@link https://developers.google.com/publisher-tag/reference#googletag.Slot GPT official docs}
 */

/**
 * @typedef {Object} SlotRenderEndedEvent
 * @property {(String|null)} advertiserId
 * @property {(String|null)} campaignId
 * @property {(String[]|null)} companyIds
 * @property {(Number|null)} creativeId
 * @property {(Number|null)} creativeTemplateId
 * @property {(Boolean)} isBackfill
 * @property {(Boolean)} isEmpty
 * @property {(Number[]|null)} labelIds
 * @property {(Number|null)} lineItemId
 * @property {(String)} serviceName
 * @property {(string|Number[]|null)} size
 * @property {(Slot)} slot
 * @property {(Boolean)} slotContentChanged
 * @property {(Number|null)} sourceAgnosticCreativeId
 * @property {(Number|null)} sourceAgnosticLineItemId
 * @property {(Number[]|null)} yieldGroupIds
 * @see {@link https://developers.google.com/publisher-tag/reference#googletag.events.SlotRenderEndedEvent GPT official docs}
 */

/**
 * @callback SlotRenderEndedEventCallback
 * @param {SlotRenderEndedEvent} event
 * @returns {void}
 */

/**
 * Add an event listener on the GAM event 'slotRenderEnded'.
 * @param {SlotRenderEndedEventCallback} callback
 */
function subscribeToGamSlotRenderEndedEvent(callback) {
  subscribeToGamEvent('slotRenderEnded', callback);
}


/***/ })

}]);
//# sourceMappingURL=gptUtils.js.map