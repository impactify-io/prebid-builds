"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["storageControl"],{

/***/ "./modules/storageControl.js":
/*!***********************************!*\
  !*** ./modules/storageControl.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports ENFORCE_STRICT, ENFORCE_ALIAS, ENFORCE_OFF, getDisclosures, checkDisclosure, storageControlRule, dynamicDisclosureCollector */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libraries/metadata/metadata.js */ "./libraries/metadata/metadata.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/prebid.js */ "./src/prebid.js");
/* harmony import */ var _libraries_storageDisclosure_summary_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libraries/storageDisclosure/summary.js */ "./libraries/storageDisclosure/summary.js");

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }









// @ts-expect-error the ts compiler is confused by build-time renaming of summary.mjs to summary.js, reassure it
// eslint-disable-next-line prebid/validate-imports


const ENFORCE_STRICT = 'strict';
const ENFORCE_ALIAS = 'allowAliases';
const ENFORCE_OFF = 'off';
let enforcement;
function escapeRegExp(string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
function matches(params, disclosure) {
  if (!['cookie', 'web'].includes(disclosure.type) || disclosure.type === 'cookie' && params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_TYPE] !== _src_storageManager_js__WEBPACK_IMPORTED_MODULE_5__.STORAGE_TYPE_COOKIES || disclosure.type === 'web' && params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_TYPE] !== _src_storageManager_js__WEBPACK_IMPORTED_MODULE_5__.STORAGE_TYPE_LOCALSTORAGE) return false;
  const pattern = new RegExp("^".concat(disclosure.identifier.split('*').map(escapeRegExp).join('.*?'), "$"));
  return pattern.test(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_KEY]);
}
function getDisclosures(params) {
  let meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_3__.metadata;
  const matchingDisclosures = [];
  const disclosureURLs = {};
  const data = meta.getMetadata(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_TYPE], params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_NAME]);
  if (!data) return null;
  disclosureURLs[params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_NAME]] = data.disclosureURL;
  if (data.aliasOf) {
    const parent = meta.getMetadata(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_TYPE], data.aliasOf);
    if (parent) {
      disclosureURLs[data.aliasOf] = parent.disclosureURL;
    }
  }
  Object.entries(disclosureURLs).forEach(_ref => {
    var _meta$getStorageDiscl;
    let [componentName, disclosureURL] = _ref;
    (_meta$getStorageDiscl = meta.getStorageDisclosure(disclosureURL)) === null || _meta$getStorageDiscl === void 0 || (_meta$getStorageDiscl = _meta$getStorageDiscl.disclosures) === null || _meta$getStorageDiscl === void 0 || (_meta$getStorageDiscl = _meta$getStorageDiscl.filter(disclosure => matches(params, disclosure))) === null || _meta$getStorageDiscl === void 0 || _meta$getStorageDiscl.forEach(disclosure => {
      matchingDisclosures.push({
        [_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_NAME]: componentName,
        disclosureURL,
        disclosure
      });
    });
  });
  return {
    matches: matchingDisclosures,
    disclosureURLs
  };
}
function checkDisclosure(params) {
  let getMatchingDisclosures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDisclosures;
  let disclosed = false;
  let parent = false;
  let reason = null;
  const key = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_KEY];
  const component = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT];
  if (key) {
    const disclosures = getMatchingDisclosures(params);
    if (disclosures == null) {
      reason = "Cannot determine if storage key \"".concat(key, "\" is disclosed by \"").concat(component, "\" because the necessary metadata is missing - was it included in the build?");
    } else {
      const {
        disclosureURLs,
        matches
      } = disclosures;
      const moduleName = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_NAME];
      for (const {
        componentName
      } of matches) {
        if (componentName === moduleName) {
          disclosed = true;
        } else {
          parent = true;
          reason = "Storage key \"".concat(key, "\" is disclosed by module \"").concat(componentName, "\", but not by \"").concat(moduleName, "\" itself (the latter is an alias of the former)");
        }
        if (disclosed || parent) break;
      }
      if (!disclosed && !parent) {
        reason = "Storage key \"".concat(key, "\" (for ").concat(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_STORAGE_TYPE], " storage) is not disclosed by \"").concat(component, "\"");
        if (disclosureURLs[moduleName]) {
          reason += " @ ".concat(disclosureURLs[moduleName]);
        } else {
          reason += " - no disclosure URL was provided, or it could not be retrieved";
        }
      }
    }
  } else {
    disclosed = null;
  }
  return {
    disclosed,
    parent,
    reason
  };
}
function storageControlRule() {
  let getEnforcement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : () => enforcement;
  let check = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : checkDisclosure;
  return function (params) {
    const {
      disclosed,
      parent,
      reason
    } = check(params);
    if (disclosed === null) return;
    if (!disclosed) {
      const enforcement = getEnforcement();
      if (enforcement === ENFORCE_STRICT || enforcement === ENFORCE_ALIAS && !parent) return {
        allow: false,
        reason
      };
      if (reason) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.logWarn)('storageControl:', reason);
      }
    }
  };
}
(0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_7__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_8__.ACTIVITY_ACCESS_DEVICE, 'storageControl', storageControlRule());
_src_config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('storageControl', cfg => {
  var _cfg$storageControl$e, _cfg$storageControl;
  enforcement = (_cfg$storageControl$e = cfg === null || cfg === void 0 || (_cfg$storageControl = cfg.storageControl) === null || _cfg$storageControl === void 0 ? void 0 : _cfg$storageControl.enforcement) !== null && _cfg$storageControl$e !== void 0 ? _cfg$storageControl$e : ENFORCE_OFF;
});
function dynamicDisclosureCollector() {
  const disclosures = {};
  function mergeDisclosures(left, right) {
    var _left$purposes, _right$purposes;
    const merged = _objectSpread(_objectSpread({}, left), {}, {
      purposes: ((_left$purposes = left.purposes) !== null && _left$purposes !== void 0 ? _left$purposes : []).concat((_right$purposes = right.purposes) !== null && _right$purposes !== void 0 ? _right$purposes : []).filter(_src_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniques)
    });
    if (left.type === 'cookie') {
      if (left.maxAgeSeconds != null || right.maxAgeSeconds != null) {
        var _left$maxAgeSeconds, _right$maxAgeSeconds;
        merged.maxAgeSeconds = ((_left$maxAgeSeconds = left.maxAgeSeconds) !== null && _left$maxAgeSeconds !== void 0 ? _left$maxAgeSeconds : 0) > ((_right$maxAgeSeconds = right.maxAgeSeconds) !== null && _right$maxAgeSeconds !== void 0 ? _right$maxAgeSeconds : 0) ? left.maxAgeSeconds : right.maxAgeSeconds;
      }
      if (left.cookieRefresh != null || right.cookieRefresh != null) {
        merged.cookieRefresh = left.cookieRefresh || right.cookieRefresh;
      }
    }
    return merged;
  }
  return {
    hook(next, moduleName, disclosure) {
      const key = "".concat(disclosure.type, "::").concat(disclosure.identifier);
      if (!disclosures.hasOwnProperty(key)) {
        disclosures[key] = _objectSpread({
          disclosedBy: []
        }, disclosure);
      }
      Object.assign(disclosures[key], mergeDisclosures(disclosures[key], disclosure));
      if (!disclosures[key].disclosedBy.includes(moduleName)) {
        disclosures[key].disclosedBy.push(moduleName);
      }
      next(moduleName, disclosure);
    },
    getDisclosures() {
      return Object.values(disclosures);
    }
  };
}
const {
  hook: discloseStorageHook,
  getDisclosures: dynamicDisclosures
} = dynamicDisclosureCollector();
_src_storageManager_js__WEBPACK_IMPORTED_MODULE_5__.discloseStorageUse.before(discloseStorageHook);
function disclosureSummarizer() {
  let getDynamicDisclosures = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : dynamicDisclosures;
  let getSummary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => (0,_libraries_storageDisclosure_summary_js__WEBPACK_IMPORTED_MODULE_10__.getStorageDisclosureSummary)((0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.getGlobal)().installedModules, _libraries_metadata_metadata_js__WEBPACK_IMPORTED_MODULE_3__.metadata.getModuleMetadata);
  return function () {
    return [].concat(getDynamicDisclosures().map(disclosure => _objectSpread({
      disclosedIn: null
    }, disclosure)), getSummary());
  };
}
const getStorageUseDisclosures = disclosureSummarizer();
(0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_9__.addApiMethod)('getStorageUseDisclosures', getStorageUseDisclosures);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.registerModule)('storageControl');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["metadata","storageDisclosure","chunk-core","viewport","dnt","creative-renderer-display"], () => (__webpack_exec__("./modules/storageControl.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=storageControl.js.map