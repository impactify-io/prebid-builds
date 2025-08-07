"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["uid1Eids"],{

/***/ "./libraries/uid1Eids/uid1Eids.js":
/*!****************************************!*\
  !*** ./libraries/uid1Eids/uid1Eids.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UID1_EIDS: () => (/* binding */ UID1_EIDS)
/* harmony export */ });
const UID1_EIDS = {
  'tdid': {
    source: 'adserver.org',
    atype: 1,
    getValue: function (data) {
      if (data.id) {
        return data.id;
      } else {
        return data;
      }
    },
    getUidExt: function (data) {
      return {
        ...{
          rtiPartner: 'TDID'
        },
        ...data.ext
      };
    }
  }
};


/***/ })

}]);
//# sourceMappingURL=uid1Eids.js.map