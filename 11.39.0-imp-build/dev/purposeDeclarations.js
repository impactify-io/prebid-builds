"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["purposeDeclarations"],{

/***/ "./libraries/purposeDeclarations/validate.js"
/*!***************************************************!*\
  !*** ./libraries/purposeDeclarations/validate.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validatePurposeDeclarations: () => (/* binding */ validatePurposeDeclarations)
/* harmony export */ });
// NOTE: this file is used both by the build system and Prebid runtime; the former
// needs the ".mjs" extension, but precompilation transforms this into a "normal" .js

function validatePurposeDeclarations({
  purposes,
  legIntPurposes,
  flexiblePurposes
}) {
  const bothBases = purposes.concat(legIntPurposes).filter(purpose => purposes.includes(purpose) && legIntPurposes.includes(purpose));
  if (bothBases.length > 0) {
    return `declares both consent and LI for purposes ${bothBases.join(', ')}`;
  }
  const noBasis = flexiblePurposes.filter(purpose => !purposes.includes(purpose) && !legIntPurposes.includes(purpose));
  if (noBasis.length > 0) {
    return `declares purposes ${noBasis.join(', ')} as flexible, but no legal basis for them`;
  }
}

/***/ }

}]);
//# sourceMappingURL=purposeDeclarations.js.map