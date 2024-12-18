"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["mspa"],{

/***/ "./libraries/mspa/activityControls.js":
/*!********************************************!*\
  !*** ./libraries/mspa/activityControls.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupRules: () => (/* binding */ setupRules)
/* harmony export */ });
/* unused harmony exports isBasicConsentDenied, sensitiveNoticeIs, isConsentDenied, isTransmitUfpdConsentDenied, isTransmitGeoConsentDenied, mspaRule */
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/adapterManager.js */ "./src/consentHandler.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");





// default interpretation for MSPA consent(s):
// https://docs.prebid.org/features/mspa-usnat.html

const SENSITIVE_DATA_GEO = 7;
function isApplicable(val) {
  return val != null && val !== 0;
}
function isBasicConsentDenied(cd) {
  // service provider mode is always consent denied
  return ['MspaServiceProviderMode', 'Gpc'].some(prop => cd[prop] === 1) ||
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
  return ['SensitiveDataProcessingOptOutNotice', 'SensitiveDataLimitUseNotice'].some(prop => cd[prop] === value);
}
function isConsentDenied(cd) {
  return isBasicConsentDenied(cd) || ['Sale', 'Sharing', 'TargetedAdvertising'].some(scope => {
    const oo = cd[`${scope}OptOut`];
    const notice = cd[`${scope}OptOutNotice`];
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
const isTransmitUfpdConsentDenied = (() => {
  // deny anything that smells like: genetic, biometric, state/national ID, financial, union membership,
  // or personal communication data
  const cannotBeInScope = [6, 7, 9, 10, 12].map(el => --el);
  // require consent for everything else (except geo, which is treated separately)
  const allExceptGeo = Array.from(Array(12).keys()).filter(el => el !== SENSITIVE_DATA_GEO);
  const mustHaveConsent = allExceptGeo.filter(el => !cannotBeInScope.includes(el));
  return function (cd) {
    return isConsentDenied(cd) ||
    // no notice about sensitive data was given
    sensitiveNoticeIs(cd, 2) ||
    // extra-sensitive data is applicable
    cannotBeInScope.some(i => isApplicable(cd.SensitiveDataProcessing[i])) ||
    // user opted out for not-as-sensitive data
    mustHaveConsent.some(i => cd.SensitiveDataProcessing[i] === 1) ||
    // CMP says it has consent, but did not give notice about it
    sensitiveNoticeIs(cd, 0) && allExceptGeo.some(i => cd.SensitiveDataProcessing[i] === 2);
  };
})();
function isTransmitGeoConsentDenied(cd) {
  const geoConsent = cd.SensitiveDataProcessing[SENSITIVE_DATA_GEO];
  return geoConsent === 1 || isBasicConsentDenied(cd) ||
  // no sensitive data notice was given
  sensitiveNoticeIs(cd, 2) ||
  // do not trust CMP if it says it has consent for geo but didn't show a sensitive data notice
  sensitiveNoticeIs(cd, 0) && geoConsent === 2;
}
const CONSENT_RULES = {
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__.ACTIVITY_SYNC_USER]: isConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__.ACTIVITY_ENRICH_EIDS]: isConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__.ACTIVITY_ENRICH_UFPD]: isTransmitUfpdConsentDenied,
  [_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_0__.ACTIVITY_TRANSMIT_PRECISE_GEO]: isTransmitGeoConsentDenied
};
function mspaRule(sids, getConsent, denies) {
  let applicableSids = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : () => _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_1__.gppDataHandler.getConsentData()?.applicableSections;
  return function () {
    if (applicableSids().some(sid => sids.includes(sid))) {
      const consent = getConsent();
      if (consent == null) {
        return {
          allow: false,
          reason: 'consent data not available'
        };
      }
      if (consent.Version !== 1) {
        return {
          allow: false,
          reason: `unsupported consent specification version "${consent.Version}"`
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
  if (!Array.isArray(subsections)) return subsections;
  return subsections.reduceRight((subsection, consent) => {
    return Object.assign(consent, subsection);
  }, {});
}
function setupRules(api, sids) {
  let normalizeConsent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : c => c;
  let rules = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : CONSENT_RULES;
  let registerRule = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__.registerActivityControl;
  let getConsentData = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : () => _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_1__.gppDataHandler.getConsentData();
  const unreg = [];
  const ruleName = `MSPA (GPP '${api}' for section${sids.length > 1 ? 's' : ''} ${sids.join(', ')})`;
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__.logInfo)(`Enabling activity controls for ${ruleName}`);
  Object.entries(rules).forEach(_ref => {
    let [activity, denies] = _ref;
    unreg.push(registerRule(activity, ruleName, mspaRule(sids, () => normalizeConsent(flatSection(getConsentData()?.parsedSections?.[api])), denies, () => getConsentData()?.applicableSections || [])));
  });
  return () => unreg.forEach(ur => ur());
}

/***/ })

}]);
//# sourceMappingURL=mspa.js.map