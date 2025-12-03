"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["storageDisclosure"],{

/***/ "./libraries/storageDisclosure/summary.js":
/*!************************************************!*\
  !*** ./libraries/storageDisclosure/summary.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStorageDisclosureSummary: () => (/* binding */ getStorageDisclosureSummary)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/esm/defineProperty.js");

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// NOTE: this file is used both by the build system and Prebid runtime; the former
// needs the ".mjs" extension, but precompilation transforms this into a "normal" .js

function getStorageDisclosureSummary(moduleNames, getModuleMetadata) {
  const summary = {};
  moduleNames.forEach(moduleName => {
    var _getModuleMetadata;
    const disclosure = (_getModuleMetadata = getModuleMetadata(moduleName)) === null || _getModuleMetadata === void 0 ? void 0 : _getModuleMetadata.disclosures;
    if (!disclosure) return;
    Object.entries(disclosure).forEach(_ref => {
      let [url, {
        disclosures: identifiers
      }] = _ref;
      if (summary.hasOwnProperty(url)) {
        summary[url].forEach(_ref2 => {
          let {
            disclosedBy
          } = _ref2;
          return disclosedBy.push(moduleName);
        });
      } else if ((identifiers === null || identifiers === void 0 ? void 0 : identifiers.length) > 0) {
        summary[url] = identifiers.map(identifier => _objectSpread({
          disclosedIn: url,
          disclosedBy: [moduleName]
        }, identifier));
      }
    });
  });
  return [].concat(...Object.values(summary));
}


/***/ })

}]);
//# sourceMappingURL=storageDisclosure.js.map