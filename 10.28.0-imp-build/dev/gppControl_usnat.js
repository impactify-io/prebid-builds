"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gppControl_usnat"],{

/***/ "./modules/gppControl_usnat.js":
/*!*************************************!*\
  !*** ./modules/gppControl_usnat.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libraries/mspa/activityControls.js */ "./libraries/mspa/activityControls.js");



let setupDone = false;
_src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('consentManagement', cfg => {
  var _cfg$consentManagemen;
  if ((cfg === null || cfg === void 0 || (_cfg$consentManagemen = cfg.consentManagement) === null || _cfg$consentManagemen === void 0 ? void 0 : _cfg$consentManagemen.gpp) != null && !setupDone) {
    (0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_2__.setupRules)('usnat', [7]);
    setupDone = true;
  }
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.registerModule)('gppControl_usnat');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["mspa","chunk-core","viewport","dnt","creative-renderer-display"], () => (__webpack_exec__("./modules/gppControl_usnat.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gppControl_usnat.js.map