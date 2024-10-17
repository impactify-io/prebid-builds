"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gppControl_usstates"],{

/***/ "./modules/gppControl_usstates.js":
/*!****************************************!*\
  !*** ./modules/gppControl_usstates.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports normalizer, NORMALIZATIONS, DEFAULT_SID_MAPPING, getSections */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libraries/mspa/activityControls.js */ "./libraries/mspa/activityControls.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");





var FIELDS = {
  Version: 0,
  Gpc: 0,
  SharingNotice: 0,
  SaleOptOutNotice: 0,
  SharingOptOutNotice: 0,
  TargetedAdvertisingOptOutNotice: 0,
  SensitiveDataProcessingOptOutNotice: 0,
  SensitiveDataLimitUseNotice: 0,
  SaleOptOut: 0,
  SharingOptOut: 0,
  TargetedAdvertisingOptOut: 0,
  SensitiveDataProcessing: 12,
  KnownChildSensitiveDataConsents: 2,
  PersonalDataConsents: 0,
  MspaCoveredTransaction: 0,
  MspaOptOutOptionMode: 0,
  MspaServiceProviderMode: 0
};

/**
 * Generate a normalization function for converting US state strings to the usnat format.
 *
 * Scalar fields are copied over if they exist in the input (state) data, or set to null otherwise.
 * List fields are also copied, but forced to the "correct" length (by truncating or padding with nulls);
 * additionally, elements within them can be moved around using the `move` argument.
 *
 * @param {Array[String]} nullify? list of fields to force to null
 * @param {{}} move? Map from list field name to an index remapping for elements within that field (using 1 as the first index).
 *       For example, {SensitiveDataProcessing: {1: 2, 2: [1, 3]}} means "rearrange SensitiveDataProcessing by moving
 *       the first element to the second position, and the second element to both the first and third position."
 * @param {({}, {}) => void} fn? an optional function to run once all the processing described above is complete;
 *       it's passed two arguments, the original (state) data, and its normalized (usnat) version.
 * @param fields
 * @returns {function({}): {}}
 */
function normalizer(_ref) {
  var _ref$nullify = _ref.nullify,
    nullify = _ref$nullify === void 0 ? [] : _ref$nullify,
    _ref$move = _ref.move,
    move = _ref$move === void 0 ? {} : _ref$move,
    fn = _ref.fn;
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FIELDS;
  move = Object.fromEntries(Object.entries(move).map(function (_ref2) {
    var _ref3 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref2, 2),
      k = _ref3[0],
      map = _ref3[1];
    return [k, Object.fromEntries(Object.entries(map).map(function (_ref4) {
      var _ref5 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref4, 2),
        k = _ref5[0],
        v = _ref5[1];
      return [k, Array.isArray(v) ? v : [v]];
    }).map(function (_ref6) {
      var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref6, 2),
        k = _ref7[0],
        v = _ref7[1];
      return [--k, v.map(function (el) {
        return --el;
      })];
    }))];
  }));
  return function (cd) {
    var norm = Object.fromEntries(Object.entries(fields).map(function (_ref8) {
      var _ref9 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref8, 2),
        field = _ref9[0],
        len = _ref9[1];
      var val = null;
      if (len > 0) {
        val = Array(len).fill(null);
        if (Array.isArray(cd[field])) {
          var remap = move[field] || {};
          var done = [];
          cd[field].forEach(function (el, i) {
            var _ref10 = remap.hasOwnProperty(i) ? [remap[i], true] : [[i], false],
              _ref11 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref10, 2),
              dest = _ref11[0],
              moved = _ref11[1];
            dest.forEach(function (d) {
              if (d < len && !done.includes(d)) {
                val[d] = el;
                moved && done.push(d);
              }
            });
          });
        }
      } else if (cd[field] != null) {
        val = Array.isArray(cd[field]) ? null : cd[field];
      }
      return [field, val];
    }));
    nullify.forEach(function (path) {
      return (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.dset)(norm, path, null);
    });
    fn && fn(cd, norm);
    return norm;
  };
}
function scalarMinorsAreChildren(original, normalized) {
  normalized.KnownChildSensitiveDataConsents = original.KnownChildSensitiveDataConsents === 0 ? [0, 0] : [1, 1];
}
var NORMALIZATIONS = {
  // normalization rules - convert state consent into usnat consent
  // https://docs.prebid.org/features/mspa-usnat.html
  7: function _(consent) {
    return consent;
  },
  8: normalizer({
    move: {
      SensitiveDataProcessing: {
        1: 9,
        2: 10,
        3: 8,
        4: [1, 2],
        5: 12,
        8: 3,
        9: 4
      }
    },
    fn: function fn(original, normalized) {
      if (original.KnownChildSensitiveDataConsents.some(function (el) {
        return el !== 0;
      })) {
        normalized.KnownChildSensitiveDataConsents = [1, 1];
      }
    }
  }),
  9: normalizer({
    fn: scalarMinorsAreChildren
  }),
  10: normalizer({
    fn: scalarMinorsAreChildren
  }),
  11: normalizer({
    move: {
      SensitiveDataProcessing: {
        3: 4,
        4: 5,
        5: 3
      }
    },
    fn: scalarMinorsAreChildren
  }),
  12: normalizer({
    fn: function fn(original, normalized) {
      var cc = original.KnownChildSensitiveDataConsents;
      var repl;
      if (!cc.some(function (el) {
        return el !== 0;
      })) {
        repl = [0, 0];
      } else if (cc[1] === 2 && cc[2] === 2) {
        repl = [2, 1];
      } else {
        repl = [1, 1];
      }
      normalized.KnownChildSensitiveDataConsents = repl;
    }
  })
};
var DEFAULT_SID_MAPPING = {
  8: 'usca',
  9: 'usva',
  10: 'usco',
  11: 'usut',
  12: 'usct'
};
var getSections = function () {
  var allSIDs = Object.keys(DEFAULT_SID_MAPPING).map(Number);
  return function () {
    var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref12$sections = _ref12.sections,
      sections = _ref12$sections === void 0 ? {} : _ref12$sections,
      _ref12$sids = _ref12.sids,
      sids = _ref12$sids === void 0 ? allSIDs : _ref12$sids;
    return sids.map(function (sid) {
      var logger = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.prefixLog)("Cannot set up MSPA controls for SID ".concat(sid, ":"));
      var ov = sections[sid] || {};
      var normalizeAs = ov.normalizeAs || sid;
      if (!NORMALIZATIONS.hasOwnProperty(normalizeAs)) {
        logger.logError("no normalization rules are known for SID ".concat(normalizeAs));
        return;
      }
      var api = ov.name || DEFAULT_SID_MAPPING[sid];
      if (typeof api !== 'string') {
        logger.logError("cannot determine GPP section name");
        return;
      }
      return [api, [sid], NORMALIZATIONS[normalizeAs]];
    }).filter(function (el) {
      return el != null;
    });
  };
}();
var handles = [];
_src_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('consentManagement', function (cfg) {
  var _cfg$consentManagemen;
  var gppConf = (_cfg$consentManagemen = cfg.consentManagement) === null || _cfg$consentManagemen === void 0 ? void 0 : _cfg$consentManagemen.gpp;
  if (gppConf) {
    while (handles.length) {
      handles.pop()();
    }
    getSections((gppConf === null || gppConf === void 0 ? void 0 : gppConf.mspa) || {}).forEach(function (_ref13) {
      var _ref14 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref13, 3),
        api = _ref14[0],
        sids = _ref14[1],
        normalize = _ref14[2];
      return handles.push((0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_4__.setupRules)(api, sids, normalize));
    });
  }
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__.registerModule)('gppControl_usstates');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["mspa","creative-renderer-display"], function() { return __webpack_exec__("./modules/gppControl_usstates.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gppControl_usstates.js.map