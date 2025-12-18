"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["boundingClientRect"],{

/***/ "./libraries/boundingClientRect/boundingClientRect.js":
/*!************************************************************!*\
  !*** ./libraries/boundingClientRect/boundingClientRect.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBoundingClientRect: () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* unused harmony export clearCache */
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/prebid.js */ "./src/prebid.js");

const cache = new Map();
_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.startAuction.before((next, auctionConfig) => {
  clearCache();
  next(auctionConfig);
});
function clearCache() {
  cache.clear();
}
function getBoundingClientRect(element) {
  let clientRect;
  if (cache.has(element)) {
    clientRect = cache.get(element);
  } else {
    // eslint-disable-next-line no-restricted-properties
    clientRect = element.getBoundingClientRect();
    cache.set(element, clientRect);
  }
  return clientRect;
}


/***/ })

}]);
//# sourceMappingURL=boundingClientRect.js.map