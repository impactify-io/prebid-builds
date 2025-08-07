"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["utiqIdSystem"],{

/***/ "./modules/utiqIdSystem.js":
/*!*********************************!*\
  !*** ./modules/utiqIdSystem.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports storage, utiqIdSubmodule */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/activities/modules.js */ "./src/activities/modules.js");

/**
 * This module adds Utiq provided by Utiq SA/NV to the User ID module
 * The {@link module:modules/userId} module is required
 * @module modules/utiqIdSystem
 * @requires module:modules/userId
 */





/**
 * @typedef {import('../modules/userId/index.js').Submodule} Submodule
 */

const MODULE_NAME = 'utiqId';
const LOG_PREFIX = 'Utiq module';
const storage = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_0__.getStorageManager)({
  moduleType: _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_1__.MODULE_TYPE_UID,
  moduleName: MODULE_NAME
});

/**
 * Get the "atid" from html5 local storage to make it available to the UserId module.
 * @returns {{utiq: (*|string)}}
 */
function getUtiqFromStorage() {
  let utiqPass;
  const utiqPassStorage = JSON.parse(storage.getDataFromLocalStorage('utiqPass'));
  const netIdAdtechpass = storage.getDataFromLocalStorage('netid_utiq_adtechpass');
  if (netIdAdtechpass) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: Local storage netid_utiq_adtechpass: ${netIdAdtechpass}`);
    return {
      utiq: netIdAdtechpass
    };
  }
  if (utiqPassStorage && utiqPassStorage.connectId && Array.isArray(utiqPassStorage.connectId.idGraph) && utiqPassStorage.connectId.idGraph.length > 0) {
    utiqPass = utiqPassStorage.connectId.idGraph[0];
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: Local storage utiqPass: ${JSON.stringify(utiqPassStorage)}`);
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: Graph of utiqPass: ${JSON.stringify(utiqPass)}`);
  }
  return {
    utiq: utiqPass && utiqPass.atid ? utiqPass.atid : null
  };
}

/** @type {Submodule} */
const utiqIdSubmodule = {
  /**
   * Used to link submodule with config
   * @type {string}
   */
  name: MODULE_NAME,
  /**
   * Decodes the stored id value for passing to bid requests.
   * @function
   * @returns {{utiq: string} | null}
   */
  decode(bidId) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: Decoded ID value ${JSON.stringify(bidId)}`);
    return bidId.utiq ? bidId : null;
  },
  /**
   * Get the id from helper function and initiate a new user sync.
   * @param config
   * @returns {{callback: Function}|{id: {utiq: string}}}
   */
  getId: function (config) {
    const data = getUtiqFromStorage();
    if (data.utiq) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: Local storage ID value ${JSON.stringify(data)}`);
      return {
        id: {
          utiq: data.utiq
        }
      };
    } else {
      if (!config) {
        config = {};
      }
      if (!config.params) {
        config.params = {};
      }
      if (typeof config.params.maxDelayTime === 'undefined' || config.params.maxDelayTime === null) {
        config.params.maxDelayTime = 1000;
      }
      // Current delay and delay step in milliseconds
      let currentDelay = 0;
      const delayStep = 50;
      const result = callback => {
        const data = getUtiqFromStorage();
        if (!data.utiq) {
          if (currentDelay > config.params.maxDelayTime) {
            (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: No utiq value set after ${config.params.maxDelayTime} max allowed delay time`);
            callback(null);
          } else {
            currentDelay += delayStep;
            setTimeout(() => {
              result(callback);
            }, delayStep);
          }
        } else {
          const dataToReturn = {
            utiq: data.utiq
          };
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(`${LOG_PREFIX}: Returning ID value data of ${JSON.stringify(dataToReturn)}`);
          callback(dataToReturn);
        }
      };
      return {
        callback: result
      };
    }
  },
  eids: {
    'utiq': {
      source: 'utiq.com',
      atype: 1,
      getValue: function (data) {
        return data;
      }
    }
  }
};
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_3__.submodule)('userId', utiqIdSubmodule);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__.registerModule)('utiqIdSystem');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","viewport","creative-renderer-display"], () => (__webpack_exec__("./modules/utiqIdSystem.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=utiqIdSystem.js.map