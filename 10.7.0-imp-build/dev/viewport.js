"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["viewport"],{

/***/ "./libraries/viewport/viewport.js":
/*!****************************************!*\
  !*** ./libraries/viewport/viewport.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewportSize: () => (/* binding */ getViewportSize)
/* harmony export */ });
/* unused harmony export getViewportCoordinates */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");

function getViewportCoordinates() {
  try {
    const win = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.getWindowTop)();
    const {
      scrollY: top,
      scrollX: left
    } = win;
    const {
      height: innerHeight,
      width: innerWidth
    } = getViewportSize();
    return {
      top,
      right: left + innerWidth,
      bottom: top + innerHeight,
      left
    };
  } catch (e) {
    return {};
  }
}
function getViewportSize() {
  const windowDimensions = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.getWinDimensions)();
  try {
    const innerHeight = windowDimensions.innerHeight || windowDimensions.document.documentElement.clientHeight || windowDimensions.document.body.clientHeight || 0;
    const innerWidth = windowDimensions.innerWidth || windowDimensions.document.documentElement.clientWidth || windowDimensions.document.body.clientWidth || 0;
    return {
      width: innerWidth,
      height: innerHeight
    };
  } catch (e) {
    return {};
  }
}


/***/ })

}]);
//# sourceMappingURL=viewport.js.map