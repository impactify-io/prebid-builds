"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["gdprEnforcement"],{

/***/ "./modules/gdprEnforcement.js":
/*!************************************!*\
  !*** ./modules/gdprEnforcement.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports STRICT_STORAGE_ENFORCEMENT, ACTIVE_RULES, getGvlid, getGvlidFromAnalyticsAdapter, shouldEnforce, validateRules, accessDeviceRule, syncUserRule, enrichEidsRule, fetchBidsRule, reportAnalyticsRule, ufpdRule, transmitEidsRule, transmitPreciseGeoRule, setEnforcementConfig, uninstall */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _src_events_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/events.js */ "./src/events.js");
/* harmony import */ var _src_constants_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/constants.json */ "./src/constants.json");
/* harmony import */ var _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../src/activities/activities.js */ "./src/activities/activities.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * This module gives publishers extra set of features to enforce individual purposes of TCF v2
 */











var STRICT_STORAGE_ENFORCEMENT = 'strictStorageEnforcement';
var ACTIVE_RULES = {
  purpose: {},
  feature: {}
};
var CONSENT_PATHS = {
  purpose: 'purpose.consents',
  feature: 'specialFeatureOptins'
};
var CONFIGURABLE_RULES = {
  storage: {
    type: 'purpose',
    default: {
      purpose: 'storage',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: []
    },
    id: 1
  },
  basicAds: {
    type: 'purpose',
    id: 2,
    default: {
      purpose: 'basicAds',
      enforcePurpose: true,
      enforceVendor: true,
      vendorExceptions: []
    }
  },
  personalizedAds: {
    type: 'purpose',
    id: 4
  },
  measurement: {
    type: 'purpose',
    id: 7
  },
  transmitPreciseGeo: {
    type: 'feature',
    id: 1
  }
};
var storageBlocked = new Set();
var biddersBlocked = new Set();
var analyticsBlocked = new Set();
var ufpdBlocked = new Set();
var eidsBlocked = new Set();
var geoBlocked = new Set();
var hooksAdded = false;
var strictStorageEnforcement = false;
var GVLID_LOOKUP_PRIORITY = [_src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_BIDDER, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_UID, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_ANALYTICS, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_RTD];
var RULE_NAME = 'TCF2';
var RULE_HANDLES = [];

// in JS we do not have access to the GVL; assume that everyone declares legitimate interest for basic ads
var LI_PURPOSES = [2];

/**
 * Retrieve a module's GVL ID.
 */
function getGvlid(moduleType, moduleName, fallbackFn) {
  if (moduleName) {
    // Check user defined GVL Mapping in pbjs.setConfig()
    var gvlMapping = _src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('gvlMapping');

    // Return GVL ID from user defined gvlMapping
    if (gvlMapping && gvlMapping[moduleName]) {
      return gvlMapping[moduleName];
    } else if (moduleType === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_PREBID) {
      return moduleName === 'cdep' ? _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.FIRST_PARTY_GVLID : _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID;
    } else {
      var _GDPR_GVLIDS$get = _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.GDPR_GVLIDS.get(moduleName),
        gvlid = _GDPR_GVLIDS$get.gvlid,
        modules = _GDPR_GVLIDS$get.modules;
      if (gvlid == null && Object.keys(modules).length > 0) {
        // this behavior is for backwards compatibility; if multiple modules with the same
        // name declare different GVL IDs, pick the bidder's first, then userId, then analytics
        var _iterator = _createForOfIteratorHelper(GVLID_LOOKUP_PRIORITY),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var type = _step.value;
            if (modules.hasOwnProperty(type)) {
              gvlid = modules[type];
              if (type !== moduleType) {
                (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)("Multiple GVL IDs found for module '".concat(moduleName, "'; using the ").concat(type, " module's ID (").concat(gvlid, ") instead of the ").concat(moduleType, "'s ID (").concat(modules[moduleType], ")"));
              }
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      if (gvlid == null && fallbackFn) {
        gvlid = fallbackFn();
      }
      return gvlid || null;
    }
  }
  return null;
}

/**
 * Retrieve GVL IDs that are dynamically set on analytics adapters.
 */
function getGvlidFromAnalyticsAdapter(code, config) {
  var _adapter$adapter;
  var adapter = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAnalyticsAdapter(code);
  return function (gvlid) {
    if (typeof gvlid !== 'function') return gvlid;
    try {
      return gvlid.call(adapter.adapter, config);
    } catch (e) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("Error invoking ".concat(code, " adapter.gvlid()"), e);
    }
  }(adapter === null || adapter === void 0 ? void 0 : (_adapter$adapter = adapter.adapter) === null || _adapter$adapter === void 0 ? void 0 : _adapter$adapter.gvlid);
}
function shouldEnforce(consentData, purpose, name) {
  if (consentData == null && _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.gdprDataHandler.enabled) {
    // there is no consent data, but the GDPR module has been installed and configured
    // NOTE: this check is not foolproof, as when Prebid first loads, enforcement hooks have not been attached yet
    // This piece of code would not run at all, and `gdprDataHandler.enabled` would be false, until the first
    // `setConfig({consentManagement})`
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)("Attempting operation that requires purpose ".concat(purpose, " consent while consent data is not available").concat(name ? " (module: ".concat(name, ")") : '', ". Assuming no consent was given."));
    return true;
  }
  return consentData && consentData.gdprApplies;
}
function getConsent(consentData, type, id, gvlId) {
  var purpose = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, "vendorData.".concat(CONSENT_PATHS[type], ".").concat(id));
  var vendor = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, "vendorData.vendor.consents.".concat(gvlId));
  if (type === 'purpose' && LI_PURPOSES.includes(id)) {
    purpose || (purpose = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, "vendorData.purpose.legitimateInterests.".concat(id)));
    vendor || (vendor = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, "vendorData.vendor.legitimateInterests.".concat(gvlId)));
  }
  return {
    purpose: purpose,
    vendor: vendor
  };
}

/**
 * This function takes in a rule and consentData and validates against the consentData provided. Depending on what it returns,
 * the caller may decide to suppress a TCF-sensitive activity.
 * @param {Object} rule - enforcement rules set in config
 * @param {Object} consentData - gdpr consent data
 * @param {string=} currentModule - Bidder code of the current module
 * @param {number=} gvlId - GVL ID for the module
 * @returns {boolean}
 */
function validateRules(rule, consentData, currentModule, gvlId) {
  var ruleOptions = CONFIGURABLE_RULES[rule.purpose];

  // return 'true' if vendor present in 'vendorExceptions'
  if ((rule.vendorExceptions || []).includes(currentModule)) {
    return true;
  }
  var vendorConsentRequred = rule.enforceVendor && !(gvlId === _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID || (rule.softVendorExceptions || []).includes(currentModule));
  var _getConsent = getConsent(consentData, ruleOptions.type, ruleOptions.id, gvlId),
    purpose = _getConsent.purpose,
    vendor = _getConsent.vendor;
  var validation = (!rule.enforcePurpose || purpose) && (!vendorConsentRequred || vendor);
  if (gvlId === _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.FIRST_PARTY_GVLID) {
    validation = !rule.enforcePurpose || !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, "vendorData.publisher.consents.".concat(ruleOptions.id));
  }
  return validation;
}
function gdprRule(purposeNo, checkConsent) {
  var blocked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var gvlidFallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
    return null;
  };
  return function (params) {
    var consentData = _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.gdprDataHandler.getConsentData();
    var modName = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_NAME];
    if (shouldEnforce(consentData, purposeNo, modName)) {
      var gvlid = getGvlid(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_TYPE], modName, gvlidFallback(params));
      var allow = !!checkConsent(consentData, modName, gvlid);
      if (!allow) {
        blocked && blocked.add(modName);
        return {
          allow: allow
        };
      }
    }
  };
}
function singlePurposeGdprRule(purposeNo) {
  var blocked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var gvlidFallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return null;
  };
  return gdprRule(purposeNo, function (cd, modName, gvlid) {
    return !!validateRules(ACTIVE_RULES.purpose[purposeNo], cd, modName, gvlid);
  }, blocked, gvlidFallback);
}
function exceptPrebidModules(ruleFn) {
  return function (params) {
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_TYPE] === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_PREBID) {
      // TODO: this special case is for the PBS adapter (componentType is 'prebid')
      // we should check for generic purpose 2 consent & vendor consent based on the PBS vendor's GVL ID;
      // that is, however, a breaking change and skipped for now
      return;
    }
    return ruleFn(params);
  };
}
var accessDeviceRule = function (rule) {
  return function (params) {
    // for vendorless (core) storage, do not enforce rules unless strictStorageEnforcement is set
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_TYPE] === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_PREBID && !strictStorageEnforcement) return;
    return rule(params);
  };
}(singlePurposeGdprRule(1, storageBlocked));
var syncUserRule = singlePurposeGdprRule(1, storageBlocked);
var enrichEidsRule = singlePurposeGdprRule(1, storageBlocked);
var fetchBidsRule = exceptPrebidModules(singlePurposeGdprRule(2, biddersBlocked));
var reportAnalyticsRule = singlePurposeGdprRule(7, analyticsBlocked, function (params) {
  return getGvlidFromAnalyticsAdapter(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_NAME], params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_ANL_CONFIG]);
});
var ufpdRule = singlePurposeGdprRule(4, ufpdBlocked);
var transmitEidsRule = exceptPrebidModules(function () {
  // Transmit EID special case:
  // by default, legal basis or vendor exceptions for any purpose between 2 and 10
  // (but disregarding enforcePurpose and enforceVendor config) is enough to allow EIDs through
  function check2to10Consent(consentData, modName, gvlId) {
    for (var pno = 2; pno <= 10; pno++) {
      var _ACTIVE_RULES$purpose, _ACTIVE_RULES$purpose2, _ACTIVE_RULES$purpose3, _ACTIVE_RULES$purpose4;
      if ((_ACTIVE_RULES$purpose = ACTIVE_RULES.purpose[pno]) !== null && _ACTIVE_RULES$purpose !== void 0 && (_ACTIVE_RULES$purpose2 = _ACTIVE_RULES$purpose.vendorExceptions) !== null && _ACTIVE_RULES$purpose2 !== void 0 && _ACTIVE_RULES$purpose2.includes(modName)) {
        return true;
      }
      var _getConsent2 = getConsent(consentData, 'purpose', pno, gvlId),
        purpose = _getConsent2.purpose,
        vendor = _getConsent2.vendor;
      if (purpose && (vendor || (_ACTIVE_RULES$purpose3 = ACTIVE_RULES.purpose[pno]) !== null && _ACTIVE_RULES$purpose3 !== void 0 && (_ACTIVE_RULES$purpose4 = _ACTIVE_RULES$purpose3.softVendorExceptions) !== null && _ACTIVE_RULES$purpose4 !== void 0 && _ACTIVE_RULES$purpose4.includes(modName))) {
        return true;
      }
    }
    return false;
  }
  var defaultBehavior = gdprRule('2-10', check2to10Consent, eidsBlocked);
  var p4Behavior = singlePurposeGdprRule(4, eidsBlocked);
  return function () {
    var _ACTIVE_RULES$purpose5;
    var fn = (_ACTIVE_RULES$purpose5 = ACTIVE_RULES.purpose[4]) !== null && _ACTIVE_RULES$purpose5 !== void 0 && _ACTIVE_RULES$purpose5.eidsRequireP4Consent ? p4Behavior : defaultBehavior;
    return fn.apply(this, arguments);
  };
}());
var transmitPreciseGeoRule = gdprRule('Special Feature 1', function (cd, modName, gvlId) {
  return validateRules(ACTIVE_RULES.feature[1], cd, modName, gvlId);
}, geoBlocked);

/**
 * Compiles the TCF2.0 enforcement results into an object, which is emitted as an event payload to "tcf2Enforcement" event.
 */
function emitTCF2FinalResults() {
  // remove null and duplicate values
  var formatSet = function formatSet(st) {
    return Array.from(st.keys()).filter(function (el) {
      return el != null;
    });
  };
  var tcf2FinalResults = {
    storageBlocked: formatSet(storageBlocked),
    biddersBlocked: formatSet(biddersBlocked),
    analyticsBlocked: formatSet(analyticsBlocked),
    ufpdBlocked: formatSet(ufpdBlocked),
    eidsBlocked: formatSet(eidsBlocked),
    geoBlocked: formatSet(geoBlocked)
  };
  _src_events_js__WEBPACK_IMPORTED_MODULE_7__.emit(_src_constants_json__WEBPACK_IMPORTED_MODULE_8__.EVENTS.TCF2_ENFORCEMENT, tcf2FinalResults);
  [storageBlocked, biddersBlocked, analyticsBlocked, ufpdBlocked, eidsBlocked, geoBlocked].forEach(function (el) {
    return el.clear();
  });
}
_src_events_js__WEBPACK_IMPORTED_MODULE_7__.on(_src_constants_json__WEBPACK_IMPORTED_MODULE_8__.EVENTS.AUCTION_END, emitTCF2FinalResults);

/**
 * A configuration function that initializes some module variables, as well as adds hooks
 * @param {Object} config - GDPR enforcement config object
 */
function setEnforcementConfig(config) {
  var rules = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(config, 'gdpr.rules');
  if (!rules) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)('TCF2: enforcing P1 and P2 by default');
  }
  rules = Object.fromEntries((rules || []).map(function (r) {
    return [r.purpose, r];
  }));
  strictStorageEnforcement = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(config, STRICT_STORAGE_ENFORCEMENT);
  Object.entries(CONFIGURABLE_RULES).forEach(function (_ref) {
    var _rules$name;
    var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_9__["default"])(_ref, 2),
      name = _ref2[0],
      opts = _ref2[1];
    ACTIVE_RULES[opts.type][opts.id] = (_rules$name = rules[name]) !== null && _rules$name !== void 0 ? _rules$name : opts.default;
  });
  if (!hooksAdded) {
    if (ACTIVE_RULES.purpose[1] != null) {
      hooksAdded = true;
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ACCESS_DEVICE, RULE_NAME, accessDeviceRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_SYNC_USER, RULE_NAME, syncUserRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ENRICH_EIDS, RULE_NAME, enrichEidsRule));
    }
    if (ACTIVE_RULES.purpose[2] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_FETCH_BIDS, RULE_NAME, fetchBidsRule));
    }
    if (ACTIVE_RULES.purpose[4] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_TRANSMIT_UFPD, RULE_NAME, ufpdRule), (0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_ENRICH_UFPD, RULE_NAME, ufpdRule));
    }
    if (ACTIVE_RULES.purpose[7] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_REPORT_ANALYTICS, RULE_NAME, reportAnalyticsRule));
    }
    if (ACTIVE_RULES.feature[1] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_TRANSMIT_PRECISE_GEO, RULE_NAME, transmitPreciseGeoRule));
    }
    RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_11__.ACTIVITY_TRANSMIT_EIDS, RULE_NAME, transmitEidsRule));
  }
}
function uninstall() {
  while (RULE_HANDLES.length) {
    RULE_HANDLES.pop()();
  }
  hooksAdded = false;
}
_src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('consentManagement', function (config) {
  return setEnforcementConfig(config.consentManagement);
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_12__.registerModule)('gdprEnforcement');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["creative-renderer-display"], function() { return __webpack_exec__("./modules/gdprEnforcement.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=gdprEnforcement.js.map