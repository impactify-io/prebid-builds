"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["unifiedIdSystem"],{

/***/ "./modules/unifiedIdSystem.js":
/*!************************************!*\
  !*** ./modules/unifiedIdSystem.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export unifiedIdSubmodule */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_ajax_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/ajax.js */ "./src/ajax.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _libraries_uid1Eids_uid1Eids_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libraries/uid1Eids/uid1Eids.js */ "./libraries/uid1Eids/uid1Eids.js");

/**
 * This module adds UnifiedId to the User ID module
 * The {@link module:modules/userId} module is required
 * @module modules/unifiedIdSystem
 * @requires module:modules/userId
 */






/**
 * @typedef {import('../modules/userId/index.js').Submodule} Submodule
 * @typedef {import('../modules/userId/index.js').SubmoduleConfig} SubmoduleConfig
 * @typedef {import('../modules/userId/index.js').IdResponse} IdResponse
 */

const MODULE_NAME = 'unifiedId';

/** @type {Submodule} */
const unifiedIdSubmodule = {
  /**
   * used to link submodule with config
   * @type {string}
   */
  name: MODULE_NAME,
  /**
   * required for the gdpr enforcement module
   */
  gvlid: 21,
  /**
   * decode the stored id value for passing to bid requests
   * @function
   * @param {{TDID:string}} value
   * @returns {{tdid:Object}}
   */
  decode(value) {
    return value && typeof value['TDID'] === 'string' ? {
      'tdid': value['TDID']
    } : undefined;
  },
  /**
   * performs action to obtain id and return a value in the callback's response argument
   * @function
   * @param {SubmoduleConfig} [config]
   * @returns {IdResponse|undefined}
   */
  getId(config) {
    const configParams = config && config.params || {};
    if (!configParams || typeof configParams.partner !== 'string' && typeof configParams.url !== 'string') {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('User ID - unifiedId submodule requires either partner or url to be defined');
      return;
    }
    // use protocol relative urls for http or https
    const url = configParams.url || `https://match.adsrvr.org/track/rid?ttd_pid=${configParams.partner}&fmt=json`;
    const resp = function (callback) {
      const callbacks = {
        success: response => {
          let responseObj;
          if (response) {
            try {
              responseObj = JSON.parse(response);
            } catch (error) {
              (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(error);
            }
          }
          callback(responseObj);
        },
        error: error => {
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)(`${MODULE_NAME}: ID fetch encountered an error`, error);
          callback();
        }
      };
      (0,_src_ajax_js__WEBPACK_IMPORTED_MODULE_1__.ajax)(url, callbacks, undefined, {
        method: 'GET',
        withCredentials: true
      });
    };
    return {
      callback: resp
    };
  },
  eids: {
    tdid: {
      ..._libraries_uid1Eids_uid1Eids_js__WEBPACK_IMPORTED_MODULE_2__.UID1_EIDS.tdid,
      mm: 4,
      inserter: 'adserver.org',
      matcher: 'adserver.org'
    }
  }
};
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_3__.submodule)('userId', unifiedIdSubmodule);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__.registerModule)('unifiedIdSystem');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["uid1Eids","chunk-core","viewport","creative-renderer-display"], () => (__webpack_exec__("./modules/unifiedIdSystem.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=unifiedIdSystem.js.map