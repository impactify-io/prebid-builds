"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gppControl_usstates"],{

/***/ "./modules/gppControl_usstates.js":
/*!****************************************!*\
  !*** ./modules/gppControl_usstates.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports normalizer, NORMALIZATIONS, DEFAULT_SID_MAPPING, getSections */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libraries/mspa/activityControls.js */ "./libraries/mspa/activityControls.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");




const FIELDS = {
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
  let {
    nullify = [],
    move = {},
    fn
  } = _ref;
  let fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FIELDS;
  move = Object.fromEntries(Object.entries(move).map(_ref2 => {
    let [k, map] = _ref2;
    return [k, Object.fromEntries(Object.entries(map).map(_ref3 => {
      let [k, v] = _ref3;
      return [k, Array.isArray(v) ? v : [v]];
    }).map(_ref4 => {
      let [k, v] = _ref4;
      return [--k, v.map(el => --el)];
    }))];
  }));
  return function (cd) {
    const norm = Object.fromEntries(Object.entries(fields).map(_ref5 => {
      let [field, len] = _ref5;
      let val = null;
      if (len > 0) {
        val = Array(len).fill(null);
        if (Array.isArray(cd[field])) {
          const remap = move[field] || {};
          const done = [];
          cd[field].forEach((el, i) => {
            const [dest, moved] = remap.hasOwnProperty(i) ? [remap[i], true] : [[i], false];
            dest.forEach(d => {
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
    nullify.forEach(path => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.dset)(norm, path, null));
    fn && fn(cd, norm);
    return norm;
  };
}
function scalarMinorsAreChildren(original, normalized) {
  normalized.KnownChildSensitiveDataConsents = original.KnownChildSensitiveDataConsents === 0 ? [0, 0] : [1, 1];
}
const NORMALIZATIONS = {
  // normalization rules - convert state consent into usnat consent
  // https://docs.prebid.org/features/mspa-usnat.html
  7: consent => consent,
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
    fn(original, normalized) {
      if (original.KnownChildSensitiveDataConsents.some(el => el !== 0)) {
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
    fn(original, normalized) {
      const cc = original.KnownChildSensitiveDataConsents;
      let repl;
      if (!cc.some(el => el !== 0)) {
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
const DEFAULT_SID_MAPPING = {
  8: 'usca',
  9: 'usva',
  10: 'usco',
  11: 'usut',
  12: 'usct'
};
const getSections = (() => {
  const allSIDs = Object.keys(DEFAULT_SID_MAPPING).map(Number);
  return function () {
    let {
      sections = {},
      sids = allSIDs
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return sids.map(sid => {
      const logger = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.prefixLog)(`Cannot set up MSPA controls for SID ${sid}:`);
      const ov = sections[sid] || {};
      const normalizeAs = ov.normalizeAs || sid;
      if (!NORMALIZATIONS.hasOwnProperty(normalizeAs)) {
        logger.logError(`no normalization rules are known for SID ${normalizeAs}`);
        return;
      }
      const api = ov.name || DEFAULT_SID_MAPPING[sid];
      if (typeof api !== 'string') {
        logger.logError(`cannot determine GPP section name`);
        return;
      }
      return [api, [sid], NORMALIZATIONS[normalizeAs]];
    }).filter(el => el != null);
  };
})();
const handles = [];
_src_config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('consentManagement', cfg => {
  const gppConf = cfg.consentManagement?.gpp;
  if (gppConf) {
    while (handles.length) {
      handles.pop()();
    }
    getSections(gppConf?.mspa || {}).forEach(_ref6 => {
      let [api, sids, normalize] = _ref6;
      return handles.push((0,_libraries_mspa_activityControls_js__WEBPACK_IMPORTED_MODULE_3__.setupRules)(api, sids, normalize));
    });
  }
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__.registerModule)('gppControl_usstates');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["mspa","chunk-core","creative-renderer-display"], () => (__webpack_exec__("./modules/gppControl_usstates.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gppControl_usstates.js.map