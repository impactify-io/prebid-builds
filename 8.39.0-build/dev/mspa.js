"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["mspa"],{

/***/ "./libraries/mspa/activityControls.js":
/*!********************************************!*\
  !*** ./libraries/mspa/activityControls.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setupRules": function() { return /* binding */ setupRules; }
/* harmony export */ });
/* unused harmony exports isBasicConsentDenied, sensitiveNoticeIs, isConsentDenied, isTransmitUfpdConsentDenied, isTransmitGeoConsentDenied, mspaRule */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");


var _CONSENT_RULES;





// default interpretation for MSPA consent(s):
// https://docs.prebid.org/features/mspa-usnat.html

var SENSITIVE_DATA_GEO = 7;
function isApplicable(val) {
  return val != null && val !== 0;
}
function isBasicConsentDenied(cd) {
  // service provider mode is always consent denied
  return ['MspaServiceProviderMode', 'Gpc'].some(function (prop) {
    return cd[prop] === 1;
  }) ||
  // you cannot consent to what you were not notified of
  cd.PersonalDataConsents === 2 ||
  // minors 13+ who have not given consent
  cd.KnownChildSensitiveDataConsents[0] === 1 ||
  // minors under 13 cannot consent
  isApplicable(cd.KnownChildSensitiveDataConsents[1]) ||
  // covered cannot be zero
  cd.MspaCoveredTransaction === 0;
}
function sensitiveNoticeIs(cd, value) {
  return ['SensitiveDataProcessingOptOutNotice', 'SensitiveDataLimitUseNotice'].some(function (prop) {
    return cd[prop] === value;
  });
}
function isConsentDenied(cd) {
  return isBasicConsentDenied(cd) || ['Sale', 'Sharing', 'TargetedAdvertising'].some(function (scope) {
    var oo = cd["".concat(scope, "OptOut")];
    var notice = cd["".concat(scope, "OptOutNotice")];
    // user opted out
    return oo === 1 ||
    // opt-out notice was not given
    notice === 2 ||
    // do not trust CMP if it signals opt-in but no opt-out notice was given
    oo === 2 && notice === 0;
  }) ||
  // no sharing notice was given ...
  cd.SharingNotice === 2 ||
  // ... or the CMP says it was not applicable, while also claiming it got consent
  cd.SharingOptOut === 2 && cd.SharingNotice === 0;
}
var isTransmitUfpdConsentDenied = function () {
  // deny anything that smells like: genetic, biometric, state/national ID, financial, union membership,
  // or personal communication data
  var cannotBeInScope = [6, 7, 9, 10, 12].map(function (el) {
    return --el;
  });
  // require consent for everything else (except geo, which is treated separately)
  var allExceptGeo = Array.from(Array(12).keys()).filter(function (el) {
    return el !== SENSITIVE_DATA_GEO;
  });
  var mustHaveConsent = allExceptGeo.filter(function (el) {
    return !cannotBeInScope.includes(el);
  });
  return function (cd) {
    return isConsentDenied(cd) ||
    // no notice about sensitive data was given
    sensitiveNoticeIs(cd, 2) ||
    // extra-sensitive data is applicable
    cannotBeInScope.some(function (i) {
      return isApplicable(cd.SensitiveDataProcessing[i]);
    }) ||
    // user opted out for not-as-sensitive data
    mustHaveConsent.some(function (i) {
      return cd.SensitiveDataProcessing[i] === 1;
    }) ||
    // CMP says it has consent, but did not give notice about it
    sensitiveNoticeIs(cd, 0) && allExceptGeo.some(function (i) {
      return cd.SensitiveDataProcessing[i] === 2;
    });
  };
}();
function isTransmitGeoConsentDenied(cd) {
  var geoConsent = cd.SensitiveDataProcessing[SENSITIVE_DATA_GEO];
  return geoConsent === 1 || isBasicConsentDenied(cd) ||
  // no sensitive data notice was given
  sensitiveNoticeIs(cd, 2) ||
  // do not trust CMP if it says it has consent for geo but didn't show a sensitive data notice
  sensitiveNoticeIs(cd, 0) && geoConsent === 2;
}
var CONSENT_RULES = (_CONSENT_RULES = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_CONSENT_RULES, _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_SYNC_USER, isConsentDenied), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_CONSENT_RULES, _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_ENRICH_EIDS, isConsentDenied), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_CONSENT_RULES, _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_ENRICH_UFPD, isTransmitUfpdConsentDenied), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_CONSENT_RULES, _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_TRANSMIT_PRECISE_GEO, isTransmitGeoConsentDenied), _CONSENT_RULES);
function mspaRule(sids, getConsent, denies) {
  var applicableSids = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
    var _gppDataHandler$getCo;
    return (_gppDataHandler$getCo = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.getConsentData()) === null || _gppDataHandler$getCo === void 0 ? void 0 : _gppDataHandler$getCo.applicableSections;
  };
  return function () {
    if (applicableSids().some(function (sid) {
      return sids.includes(sid);
    })) {
      var consent = getConsent();
      if (consent == null) {
        return {
          allow: false,
          reason: 'consent data not available'
        };
      }
      if (denies(consent)) {
        return {
          allow: false
        };
      }
    }
  };
}
function flatSection(subsections) {
  if (subsections == null) return subsections;
  return subsections.reduceRight(function (subsection, consent) {
    return Object.assign(consent, subsection);
  }, {});
}
function setupRules(api, sids) {
  var normalizeConsent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (c) {
    return c;
  };
  var rules = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : CONSENT_RULES;
  var registerRule = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_3__.registerActivityControl;
  var getConsentData = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {
    return _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__.gppDataHandler.getConsentData();
  };
  var unreg = [];
  var ruleName = "MSPA (GPP '".concat(api, "' for section").concat(sids.length > 1 ? 's' : '', " ").concat(sids.join(', '), ")");
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Enabling activity controls for ".concat(ruleName));
  Object.entries(rules).forEach(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_ref, 2),
      activity = _ref2[0],
      denies = _ref2[1];
    unreg.push(registerRule(activity, ruleName, mspaRule(sids, function () {
      var _getConsentData, _getConsentData$parse;
      return normalizeConsent(flatSection((_getConsentData = getConsentData()) === null || _getConsentData === void 0 ? void 0 : (_getConsentData$parse = _getConsentData.parsedSections) === null || _getConsentData$parse === void 0 ? void 0 : _getConsentData$parse[api]));
    }, denies, function () {
      var _getConsentData2;
      return ((_getConsentData2 = getConsentData()) === null || _getConsentData2 === void 0 ? void 0 : _getConsentData2.applicableSections) || [];
    })));
  });
  return function () {
    return unreg.forEach(function (ur) {
      return ur();
    });
  };
}

/***/ })

}]);
//# sourceMappingURL=mspa.js.map