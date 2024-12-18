"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["tcfControl"],{

/***/ "./modules/tcfControl.js":
/*!*******************************!*\
  !*** ./modules/tcfControl.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports STRICT_STORAGE_ENFORCEMENT, ACTIVE_RULES, getGvlid, getGvlidFromAnalyticsAdapter, shouldEnforce, validateRules, accessDeviceRule, syncUserRule, enrichEidsRule, fetchBidsRule, reportAnalyticsRule, ufpdRule, transmitEidsRule, transmitPreciseGeoRule, setEnforcementConfig, uninstall */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _src_events_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/events.js */ "./src/events.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/constants.js */ "./src/constants.js");
/* harmony import */ var _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/activities/activities.js */ "./src/activities/activities.js");

/**
 * This module gives publishers extra set of features to enforce individual purposes of TCF v2
 */











const STRICT_STORAGE_ENFORCEMENT = 'strictStorageEnforcement';
const ACTIVE_RULES = {
  purpose: {},
  feature: {}
};
const CONSENT_PATHS = {
  purpose: false,
  feature: 'specialFeatureOptins'
};
const CONFIGURABLE_RULES = {
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
const storageBlocked = new Set();
const biddersBlocked = new Set();
const analyticsBlocked = new Set();
const ufpdBlocked = new Set();
const eidsBlocked = new Set();
const geoBlocked = new Set();
let hooksAdded = false;
let strictStorageEnforcement = false;
const GVLID_LOOKUP_PRIORITY = [_src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_BIDDER, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_UID, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_ANALYTICS, _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_RTD];
const RULE_NAME = 'TCF2';
const RULE_HANDLES = [];

// in JS we do not have access to the GVL; assume that everyone declares legitimate interest for basic ads
const LI_PURPOSES = [2];
const PUBLISHER_LI_PURPOSES = [2, 7, 9, 10];

/**
 * Retrieve a module's GVL ID.
 */
function getGvlid(moduleType, moduleName, fallbackFn) {
  if (moduleName) {
    // Check user defined GVL Mapping in pbjs.setConfig()
    const gvlMapping = _src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('gvlMapping');

    // Return GVL ID from user defined gvlMapping
    if (gvlMapping && gvlMapping[moduleName]) {
      return gvlMapping[moduleName];
    } else if (moduleType === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_PREBID) {
      return _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID;
    } else {
      let {
        gvlid,
        modules
      } = _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.GDPR_GVLIDS.get(moduleName);
      if (gvlid == null && Object.keys(modules).length > 0) {
        // this behavior is for backwards compatibility; if multiple modules with the same
        // name declare different GVL IDs, pick the bidder's first, then userId, then analytics
        for (const type of GVLID_LOOKUP_PRIORITY) {
          if (modules.hasOwnProperty(type)) {
            gvlid = modules[type];
            if (type !== moduleType) {
              (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)(`Multiple GVL IDs found for module '${moduleName}'; using the ${type} module's ID (${gvlid}) instead of the ${moduleType}'s ID (${modules[moduleType]})`);
            }
            break;
          }
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
  const adapter = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAnalyticsAdapter(code);
  return (gvlid => {
    if (typeof gvlid !== 'function') return gvlid;
    try {
      return gvlid.call(adapter.adapter, config);
    } catch (e) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)(`Error invoking ${code} adapter.gvlid()`, e);
    }
  })(adapter?.adapter?.gvlid);
}
function shouldEnforce(consentData, purpose, name) {
  if (consentData == null && _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.gdprDataHandler.enabled) {
    // there is no consent data, but the GDPR module has been installed and configured
    // NOTE: this check is not foolproof, as when Prebid first loads, enforcement hooks have not been attached yet
    // This piece of code would not run at all, and `gdprDataHandler.enabled` would be false, until the first
    // `setConfig({consentManagement})`
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)(`Attempting operation that requires purpose ${purpose} consent while consent data is not available${name ? ` (module: ${name})` : ''}. Assuming no consent was given.`);
    return true;
  }
  return consentData && consentData.gdprApplies;
}
function getConsentOrLI(consentData, path, id, acceptLI) {
  const data = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, `vendorData.${path}`);
  return !!data?.consents?.[id] || acceptLI && !!data?.legitimateInterests?.[id];
}
function getConsent(consentData, type, purposeNo, gvlId) {
  let purpose;
  if (CONSENT_PATHS[type] !== false) {
    purpose = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(consentData, `vendorData.${CONSENT_PATHS[type]}.${purposeNo}`);
  } else {
    const [path, liPurposes] = gvlId === _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID ? ['publisher', PUBLISHER_LI_PURPOSES] : ['purpose', LI_PURPOSES];
    purpose = getConsentOrLI(consentData, path, purposeNo, liPurposes.includes(purposeNo));
  }
  return {
    purpose,
    vendor: getConsentOrLI(consentData, 'vendor', gvlId, LI_PURPOSES.includes(purposeNo))
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
  const ruleOptions = CONFIGURABLE_RULES[rule.purpose];

  // return 'true' if vendor present in 'vendorExceptions'
  if ((rule.vendorExceptions || []).includes(currentModule)) {
    return true;
  }
  const vendorConsentRequred = rule.enforceVendor && !(gvlId === _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.VENDORLESS_GVLID || (rule.softVendorExceptions || []).includes(currentModule));
  const {
    purpose,
    vendor
  } = getConsent(consentData, ruleOptions.type, ruleOptions.id, gvlId);
  return (!rule.enforcePurpose || purpose) && (!vendorConsentRequred || vendor);
}
function gdprRule(purposeNo, checkConsent) {
  let blocked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let gvlidFallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : () => null;
  return function (params) {
    const consentData = _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_2__.gdprDataHandler.getConsentData();
    const modName = params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_NAME];
    if (shouldEnforce(consentData, purposeNo, modName)) {
      const gvlid = getGvlid(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_TYPE], modName, gvlidFallback(params));
      let allow = !!checkConsent(consentData, modName, gvlid);
      if (!allow) {
        blocked && blocked.add(modName);
        return {
          allow
        };
      }
    }
  };
}
function singlePurposeGdprRule(purposeNo) {
  let blocked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let gvlidFallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : () => null;
  return gdprRule(purposeNo, (cd, modName, gvlid) => !!validateRules(ACTIVE_RULES.purpose[purposeNo], cd, modName, gvlid), blocked, gvlidFallback);
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
const accessDeviceRule = (rule => {
  return function (params) {
    // for vendorless (core) storage, do not enforce rules unless strictStorageEnforcement is set
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_TYPE] === _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_TYPE_PREBID && !strictStorageEnforcement) return;
    return rule(params);
  };
})(singlePurposeGdprRule(1, storageBlocked));
const syncUserRule = singlePurposeGdprRule(1, storageBlocked);
const enrichEidsRule = singlePurposeGdprRule(1, storageBlocked);
const fetchBidsRule = exceptPrebidModules(singlePurposeGdprRule(2, biddersBlocked));
const reportAnalyticsRule = singlePurposeGdprRule(7, analyticsBlocked, params => getGvlidFromAnalyticsAdapter(params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_COMPONENT_NAME], params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_PARAM_ANL_CONFIG]));
const ufpdRule = singlePurposeGdprRule(4, ufpdBlocked);
const transmitEidsRule = exceptPrebidModules((() => {
  // Transmit EID special case:
  // by default, legal basis or vendor exceptions for any purpose between 2 and 10
  // (but disregarding enforcePurpose and enforceVendor config) is enough to allow EIDs through
  function check2to10Consent(consentData, modName, gvlId) {
    for (let pno = 2; pno <= 10; pno++) {
      if (ACTIVE_RULES.purpose[pno]?.vendorExceptions?.includes(modName)) {
        return true;
      }
      const {
        purpose,
        vendor
      } = getConsent(consentData, 'purpose', pno, gvlId);
      if (purpose && (vendor || ACTIVE_RULES.purpose[pno]?.softVendorExceptions?.includes(modName))) {
        return true;
      }
    }
    return false;
  }
  const defaultBehavior = gdprRule('2-10', check2to10Consent, eidsBlocked);
  const p4Behavior = singlePurposeGdprRule(4, eidsBlocked);
  return function () {
    const fn = ACTIVE_RULES.purpose[4]?.eidsRequireP4Consent ? p4Behavior : defaultBehavior;
    return fn.apply(this, arguments);
  };
})());
const transmitPreciseGeoRule = gdprRule('Special Feature 1', (cd, modName, gvlId) => validateRules(ACTIVE_RULES.feature[1], cd, modName, gvlId), geoBlocked);

/**
 * Compiles the TCF2.0 enforcement results into an object, which is emitted as an event payload to "tcf2Enforcement" event.
 */
function emitTCF2FinalResults() {
  // remove null and duplicate values
  const formatSet = function (st) {
    return Array.from(st.keys()).filter(el => el != null);
  };
  const tcf2FinalResults = {
    storageBlocked: formatSet(storageBlocked),
    biddersBlocked: formatSet(biddersBlocked),
    analyticsBlocked: formatSet(analyticsBlocked),
    ufpdBlocked: formatSet(ufpdBlocked),
    eidsBlocked: formatSet(eidsBlocked),
    geoBlocked: formatSet(geoBlocked)
  };
  _src_events_js__WEBPACK_IMPORTED_MODULE_7__.emit(_src_constants_js__WEBPACK_IMPORTED_MODULE_8__.EVENTS.TCF2_ENFORCEMENT, tcf2FinalResults);
  [storageBlocked, biddersBlocked, analyticsBlocked, ufpdBlocked, eidsBlocked, geoBlocked].forEach(el => el.clear());
}
_src_events_js__WEBPACK_IMPORTED_MODULE_7__.on(_src_constants_js__WEBPACK_IMPORTED_MODULE_8__.EVENTS.AUCTION_END, emitTCF2FinalResults);

/**
 * A configuration function that initializes some module variables, as well as adds hooks
 * @param {Object} config - GDPR enforcement config object
 */
function setEnforcementConfig(config) {
  let rules = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(config, 'gdpr.rules');
  if (!rules) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)('TCF2: enforcing P1 and P2 by default');
  }
  rules = Object.fromEntries((rules || []).map(r => [r.purpose, r]));
  strictStorageEnforcement = !!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"])(config, STRICT_STORAGE_ENFORCEMENT);
  Object.entries(CONFIGURABLE_RULES).forEach(_ref => {
    let [name, opts] = _ref;
    ACTIVE_RULES[opts.type][opts.id] = rules[name] ?? opts.default;
  });
  if (!hooksAdded) {
    if (ACTIVE_RULES.purpose[1] != null) {
      hooksAdded = true;
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_ACCESS_DEVICE, RULE_NAME, accessDeviceRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_SYNC_USER, RULE_NAME, syncUserRule));
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_ENRICH_EIDS, RULE_NAME, enrichEidsRule));
    }
    if (ACTIVE_RULES.purpose[2] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_FETCH_BIDS, RULE_NAME, fetchBidsRule));
    }
    if (ACTIVE_RULES.purpose[4] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_TRANSMIT_UFPD, RULE_NAME, ufpdRule), (0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_ENRICH_UFPD, RULE_NAME, ufpdRule));
    }
    if (ACTIVE_RULES.purpose[7] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_REPORT_ANALYTICS, RULE_NAME, reportAnalyticsRule));
    }
    if (ACTIVE_RULES.feature[1] != null) {
      RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_TRANSMIT_PRECISE_GEO, RULE_NAME, transmitPreciseGeoRule));
    }
    RULE_HANDLES.push((0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_9__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_10__.ACTIVITY_TRANSMIT_EIDS, RULE_NAME, transmitEidsRule));
  }
}
function uninstall() {
  while (RULE_HANDLES.length) RULE_HANDLES.pop()();
  hooksAdded = false;
}
_src_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('consentManagement', config => setEnforcementConfig(config.consentManagement));
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_11__.registerModule)('tcfControl');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","creative-renderer-display"], () => (__webpack_exec__("./modules/tcfControl.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=tcfControl.js.map