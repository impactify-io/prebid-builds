"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["percentInView"],{

/***/ "./libraries/percentInView/percentInView.js"
/*!**************************************************!*\
  !*** ./libraries/percentInView/percentInView.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewability: () => (/* binding */ getViewability),
/* harmony export */   isViewabilityMeasurable: () => (/* binding */ isViewabilityMeasurable)
/* harmony export */ });
/* unused harmony exports getViewportOffset, getBoundingBox, intersections, viewportIntersections, mkIntersectionHook, percentInView */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/winDimensions.js");
/* harmony import */ var _boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../boundingClientRect/boundingClientRect.js */ "./libraries/boundingClientRect/boundingClientRect.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/prebid.js */ "./src/prebid.js");
/* harmony import */ var _src_utils_adUnits_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/utils/adUnits.js */ "./src/utils/adUnits.js");






/**
 * return the offset between the given window's viewport and the top window's.
 */
function getViewportOffset() {
  let win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  let x = 0;
  let y = 0;
  try {
    while (win?.frameElement != null) {
      const rect = (0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(win.frameElement);
      x += rect.left;
      y += rect.top;
      win = win.parent;
    }
  } catch (e) {
    // offset cannot be calculated as some parents are cross-frame
    // fallback to 0,0
    x = 0;
    y = 0;
  }
  return {
    x,
    y
  };
}
function applySize(bbox, _ref) {
  let {
    w,
    h
  } = _ref;
  let {
    width,
    height,
    left,
    top,
    right,
    bottom,
    x,
    y
  } = bbox;
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
function getBoundingBox(element) {
  let {
    w,
    h
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return applySize((0,_boundingClientRect_boundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__.getBoundingClientRect)(element), {
    w,
    h
  });
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
const percentInViewStatic = function (element) {
  let {
    w,
    h
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const elementBoundingBox = getBoundingBox(element, {
    w,
    h
  });

  // when in an iframe, the bounding box is relative to the iframe's viewport
  // since we are intersecting it with the top window's viewport, attempt to
  // compensate for the offset between them

  const offset = getViewportOffset(element?.ownerDocument?.defaultView);
  elementBoundingBox.left += offset.x;
  elementBoundingBox.right += offset.x;
  elementBoundingBox.top += offset.y;
  elementBoundingBox.bottom += offset.y;
  const dims = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.getWinDimensions)();

  // Obtain the intersection of the element and the viewport
  const elementInViewBoundingBox = getIntersectionOfRects([{
    left: 0,
    top: 0,
    right: dims.document.documentElement.clientWidth,
    bottom: dims.document.documentElement.clientHeight
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
 * A wrapper around an IntersectionObserver that keeps track of the latest IntersectionEntry that was observed
 * for each observed element.
 *
 * @param mkObserver
 */
function intersections(mkObserver) {
  const intersections = new WeakMap();
  let next = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.defer)();
  function observerCallback(entries) {
    entries.forEach(entry => {
      if ((intersections.get(entry.target)?.time ?? -1) < entry.time) {
        intersections.set(entry.target, entry);
        next.resolve();
        next = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.defer)();
      }
    });
  }
  let obs = null;
  try {
    obs = mkObserver(observerCallback);
  } catch (e) {
    // IntersectionObserver not supported
  }
  async function waitFor(element) {
    const intersection = getIntersection(element);
    if (intersection != null) {
      return intersection;
    } else {
      return next.promise.then(() => waitFor(element));
    }
  }
  /**
   * Observe the given element; returns a promise to the first available intersection observed for it.
   */
  async function observe(element) {
    if (obs != null && !intersections.has(element)) {
      obs.observe(element);
      intersections.set(element, null);
      return waitFor(element);
    } else {
      return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.resolve(getIntersection(element));
    }
  }

  /**
   * Return the latest intersection that was observed for the given element.
   */
  function getIntersection(element) {
    return intersections.get(element);
  }
  return {
    observe,
    getIntersection
  };
}
const viewportIntersections = intersections(callback => new IntersectionObserver(callback, {
  // update percentInView when visibility varies by 1%
  threshold: Array.from({
    length: 101
  }, (e, i) => i / 100)
}));
function mkIntersectionHook() {
  let intersections = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : viewportIntersections;
  return function (next, request) {
    _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.race([_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.PbPromise.allSettled((request.adUnits ?? []).map(adUnit => intersections.observe((0,_src_utils_adUnits_js__WEBPACK_IMPORTED_MODULE_5__.getAdUnitElement)(adUnit)))),
    // according to MDN, with threshold 0 "the callback will be run as soon as the target element intersects or touches the boundary of the root, even if no pixels are yet visible"
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // However, browsers appear to run it even when the element is outside the DOM
    // just to be sure, cap the amount of time we wait for intersections
    (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.delay)(20)]).then(() => next.call(this, request));
  };
}
_src_prebid_js__WEBPACK_IMPORTED_MODULE_4__.startAuction.before(mkIntersectionHook());
function percentInView(element) {
  let {
    w,
    h
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const intersection = viewportIntersections.getIntersection(element);
  if (intersection == null) {
    viewportIntersections.observe(element);
    return percentInViewStatic(element, {
      w,
      h
    });
  } else {
    const adjusted = applySize(intersection.boundingClientRect, {
      w,
      h
    });
    if (adjusted.width !== intersection.boundingClientRect.width || adjusted.height !== intersection.boundingClientRect.height) {
      // use w/h override
      return percentInViewStatic(element, {
        w,
        h
      });
    }
    return intersection.isIntersecting ? intersection.intersectionRatio * 100 : 0;
  }
}

/**
 * Checks if viewability can be measured for an element
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} True if viewability is measurable
 */
function isViewabilityMeasurable(element) {
  return !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.inIframe)() && element !== null;
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


/***/ }

}]);
//# sourceMappingURL=percentInView.js.map