"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["consentManagement"],{

/***/ "./libraries/consentManagement/cmUtils.js":
/*!************************************************!*\
  !*** ./libraries/consentManagement/cmUtils.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consentManagementHook: () => (/* binding */ consentManagementHook)
/* harmony export */ });
/* harmony import */ var _src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");


function consentManagementHook(name, getConsent, loadConsentData) {
  function loadIfMissing(cb) {
    if (getConsent()) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)('User consent information already known.  Pulling internally stored information...');
      // eslint-disable-next-line standard/no-callback-literal
      cb(false);
    } else {
      loadConsentData(cb);
    }
  }
  return (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_1__.timedAuctionHook)(name, function requestBidsHook(fn, reqBidsConfigObj) {
    loadIfMissing(function (shouldCancelAuction, errMsg) {
      if (errMsg) {
        let log = _src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn;
        if (shouldCancelAuction) {
          log = _src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError;
          errMsg = `${errMsg} Canceling auction as per consentManagement config.`;
        }
        for (var _len = arguments.length, extraArgs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          extraArgs[_key - 2] = arguments[_key];
        }
        log(errMsg, ...extraArgs);
      }
      if (shouldCancelAuction) {
        fn.stopTiming();
        if (typeof reqBidsConfigObj.bidsBackHandler === 'function') {
          reqBidsConfigObj.bidsBackHandler();
        } else {
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Error executing bidsBackHandler');
        }
      } else {
        fn.call(this, reqBidsConfigObj);
      }
    });
  });
}

/***/ })

}]);
//# sourceMappingURL=consentManagement.js.map