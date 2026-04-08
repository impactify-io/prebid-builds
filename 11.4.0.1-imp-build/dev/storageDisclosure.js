"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["storageDisclosure"],{

/***/ "./libraries/storageDisclosure/summary.js"
/*!************************************************!*\
  !*** ./libraries/storageDisclosure/summary.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStorageDisclosureSummary: () => (/* binding */ getStorageDisclosureSummary)
/* harmony export */ });
// NOTE: this file is used both by the build system and Prebid runtime; the former
// needs the ".mjs" extension, but precompilation transforms this into a "normal" .js

function getStorageDisclosureSummary(moduleNames, getModuleMetadata) {
  const summary = {};
  moduleNames.forEach(moduleName => {
    const disclosure = getModuleMetadata(moduleName)?.disclosures;
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
      } else if (identifiers?.length > 0) {
        summary[url] = identifiers.map(identifier => ({
          disclosedIn: url,
          disclosedBy: [moduleName],
          ...identifier
        }));
      }
    });
  });
  return [].concat(...Object.values(summary));
}


/***/ }

}]);
//# sourceMappingURL=storageDisclosure.js.map