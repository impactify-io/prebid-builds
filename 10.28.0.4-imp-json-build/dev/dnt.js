"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["dnt"],{

/***/ "./libraries/dnt/index.js":
/*!********************************!*\
  !*** ./libraries/dnt/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDNT: () => (/* binding */ getDNT)
/* harmony export */ });
function _getDNT(win) {
  var _win$navigator$doNotT, _win$navigator$doNotT2;
  return win.navigator.doNotTrack === '1' || win.doNotTrack === '1' || win.navigator.msDoNotTrack === '1' || ((_win$navigator$doNotT = win.navigator.doNotTrack) === null || _win$navigator$doNotT === void 0 || (_win$navigator$doNotT2 = _win$navigator$doNotT.toLowerCase) === null || _win$navigator$doNotT2 === void 0 ? void 0 : _win$navigator$doNotT2.call(_win$navigator$doNotT)) === 'yes';
}
function getDNT() {
  let win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  try {
    return _getDNT(win) || win !== win.top && _getDNT(win.top);
  } catch (e) {
    return false;
  }
}


/***/ })

}]);
//# sourceMappingURL=dnt.js.map