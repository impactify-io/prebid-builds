"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["percentInView"],{

/***/ "./libraries/percentInView/percentInView.js":
/*!**************************************************!*\
  !*** ./libraries/percentInView/percentInView.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewability: () => (/* binding */ getViewability),
/* harmony export */   isViewabilityMeasurable: () => (/* binding */ isViewabilityMeasurable)
/* harmony export */ });
/* unused harmony exports getBoundingBox, percentInView */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/winDimensions.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../boundingClientRect/boundingClientRect.js */ "./libraries/boundingClientRect/boundingClientRect.js");


function getBoundingBox(element) {
  let {
    w,
    h
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let {
    width,
    height,
    left,
    top,
    right,
    bottom,
    x,
    y
  } = (0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(element);
  if ((width === 0 || height === 0) && w && h) {
    width = w;
    height = h;
    right = left + w;
    bottom = top + h;
  }
  return {
    width,
    height,
    left,
    top,
    right,
    bottom,
    x,
    y
  };
}
function getIntersectionOfRects(rects) {
  const bbox = {
    left: rects[0].left,
    right: rects[0].right,
    top: rects[0].top,
    bottom: rects[0].bottom
  };
  for (let i = 1; i < rects.length; ++i) {
    bbox.left = Math.max(bbox.left, rects[i].left);
    bbox.right = Math.min(bbox.right, rects[i].right);
    if (bbox.left >= bbox.right) {
      return null;
    }
    bbox.top = Math.max(bbox.top, rects[i].top);
    bbox.bottom = Math.min(bbox.bottom, rects[i].bottom);
    if (bbox.top >= bbox.bottom) {
      return null;
    }
  }
  bbox.width = bbox.right - bbox.left;
  bbox.height = bbox.bottom - bbox.top;
  return bbox;
}
const percentInView = function (element) {
  let {
    w,
    h
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const elementBoundingBox = getBoundingBox(element, {
    w,
    h
  });
  const {
    innerHeight,
    innerWidth
  } = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.getWinDimensions)();

  // Obtain the intersection of the element and the viewport
  const elementInViewBoundingBox = getIntersectionOfRects([{
    left: 0,
    top: 0,
    right: innerWidth,
    bottom: innerHeight
  }, elementBoundingBox]);
  let elementInViewArea, elementTotalArea;
  if (elementInViewBoundingBox !== null) {
    // Some or all of the element is in view
    elementInViewArea = elementInViewBoundingBox.width * elementInViewBoundingBox.height;
    elementTotalArea = elementBoundingBox.width * elementBoundingBox.height;
    return elementInViewArea / elementTotalArea * 100;
  }

  // No overlap between element and the viewport; therefore, the element
  // lies completely out of view
  return 0;
};

/**
 * Checks if viewability can be measured for an element
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} True if viewability is measurable
 */
function isViewabilityMeasurable(element) {
  return !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.inIframe)() && element !== null;
}

/**
 * Gets the viewability percentage of an element
 * @param {HTMLElement} element - DOM element to measure
 * @param {Window} topWin - Top window object
 * @param {Object} size - Size object with width and height
 * @returns {number|string} Viewability percentage or 0 if not visible
 */
function getViewability(element, topWin, size) {
  return topWin.document.visibilityState === 'visible' ? percentInView(element, size) : 0;
}


/***/ })

}]);
//# sourceMappingURL=percentInView.js.map