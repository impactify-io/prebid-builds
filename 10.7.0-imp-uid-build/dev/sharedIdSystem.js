"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["sharedIdSystem"],{

/***/ "./modules/sharedIdSystem.js":
/*!***********************************!*\
  !*** ./modules/sharedIdSystem.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports storage, sharedIdSystemSubmodule */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _libraries_domainOverrideToRootDomain_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libraries/domainOverrideToRootDomain/index.js */ "./libraries/domainOverrideToRootDomain/index.js");

/**
 * This module adds SharedId to the User ID module
 * The {@link module:modules/userId} module is required
 * @module modules/sharedIdSystem
 * @requires module:modules/userId
 */







const storage = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_0__.getStorageManager)({
  moduleType: _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_1__.MODULE_TYPE_UID,
  moduleName: 'sharedId'
});
const COOKIE = 'cookie';
const LOCAL_STORAGE = 'html5';
const OPTOUT_NAME = '_pubcid_optout';
const PUB_COMMON_ID = 'PublisherCommonId';
/**
 * Read a value either from cookie or local storage
 * @param {string} name Name of the item
 * @param {string} type storage type override
 * @returns {string|null} a string if item exists
 */
function readValue(name, type) {
  if (type === COOKIE) {
    return storage.getCookie(name);
  } else if (type === LOCAL_STORAGE) {
    if (storage.hasLocalStorage()) {
      const expValue = storage.getDataFromLocalStorage(`${name}_exp`);
      if (!expValue) {
        return storage.getDataFromLocalStorage(name);
      } else if (new Date(expValue).getTime() - Date.now() > 0) {
        return storage.getDataFromLocalStorage(name);
      }
    }
  }
}
function getIdCallback(pubcid, pixelUrl) {
  return function (callback, getStoredId) {
    if (pixelUrl) {
      queuePixelCallback(pixelUrl, pubcid, () => {
        callback(getStoredId() || pubcid);
      })();
    } else {
      callback(pubcid);
    }
  };
}
function queuePixelCallback(pixelUrl) {
  let id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let callback = arguments.length > 2 ? arguments[2] : undefined;
  if (!pixelUrl) {
    return;
  }

  // Use pubcid as a cache buster
  const urlInfo = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseUrl)(pixelUrl);
  urlInfo.search.id = encodeURIComponent('pubcid:' + id);
  const targetUrl = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.buildUrl)(urlInfo);
  return function () {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.triggerPixel)(targetUrl, callback);
  };
}
function hasOptedOut() {
  return !!(storage.cookiesAreEnabled() && readValue(OPTOUT_NAME, COOKIE) || storage.hasLocalStorage() && readValue(OPTOUT_NAME, LOCAL_STORAGE));
}
const sharedIdSystemSubmodule = {
  /**
   * used to link submodule with config
   * @type {string}
   */
  name: 'sharedId',
  aliasName: 'pubCommonId',
  gvlid: _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_3__.VENDORLESS_GVLID,
  disclosureURL: 'local://prebid/sharedId-optout.json',
  /**
   * decode the stored id value for passing to bid requests
   */
  decode(value, config) {
    if (hasOptedOut()) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('PubCommonId decode: Has opted-out');
      return undefined;
    }
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(' Decoded value PubCommonId ' + value);
    const idObj = {
      'pubcid': value
    };
    return idObj;
  },
  getId: function () {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let consentData = arguments.length > 1 ? arguments[1] : undefined;
    let storedId = arguments.length > 2 ? arguments[2] : undefined;
    if (hasOptedOut()) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('PubCommonId: Has opted-out');
      return;
    }
    if (consentData?.coppa) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('PubCommonId: IDs not provided for coppa requests, exiting PubCommonId');
      return;
    }
    const {
      params: {
        create = true,
        pixelUrl
      } = {}
    } = config;
    let newId = storedId;
    if (!newId) {
      try {
        if (typeof window[PUB_COMMON_ID] === 'object') {
          // If the page includes its own pubcid module, then save a copy of id.
          newId = window[PUB_COMMON_ID].getId();
        }
      } catch (e) {}
      if (!newId) newId = create && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.hasDeviceAccess)() ? (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.generateUUID)() : undefined;
    }
    return {
      id: newId,
      callback: getIdCallback(newId, pixelUrl)
    };
  },
  /**
   * performs action to extend an id.  There are generally two ways to extend the expiration time
   * of stored id: using pixelUrl or return the id and let main user id module write it again with
   * the new expiration time.
   *
   * PixelUrl, if defined, should point back to a first party domain endpoint.  On the server
   * side, there is either a plugin, or customized logic to read and write back the pubcid cookie.
   * The extendId function itself should return only the callback, and not the id itself to avoid
   * having the script-side overwriting server-side.  This applies to both pubcid and sharedid.
   *
   * On the other hand, if there is no pixelUrl, then the extendId should return storedId so that
   * its expiration time is updated.
   */
  extendId: function () {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let consentData = arguments.length > 1 ? arguments[1] : undefined;
    let storedId = arguments.length > 2 ? arguments[2] : undefined;
    if (hasOptedOut()) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('PubCommonId: Has opted-out');
      return {
        id: undefined
      };
    }
    if (consentData?.coppa) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)('PubCommonId: IDs not provided for coppa requests, exiting PubCommonId');
      return;
    }
    const {
      params: {
        extend = false,
        pixelUrl
      } = {}
    } = config;
    if (extend) {
      if (pixelUrl) {
        const callback = queuePixelCallback(pixelUrl, storedId);
        return {
          callback: callback
        };
      } else {
        return {
          id: storedId
        };
      }
    }
  },
  domainOverride: (0,_libraries_domainOverrideToRootDomain_index_js__WEBPACK_IMPORTED_MODULE_4__.domainOverrideToRootDomain)(storage, 'sharedId'),
  eids: {
    'pubcid'(values, config) {
      const eid = {
        source: 'pubcid.org',
        uids: values.map(id => ({
          id,
          atype: 1
        }))
      };
      if (config?.params?.inserter != null) {
        eid.inserter = config.params.inserter;
      }
      return eid;
    }
  }
};
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_5__.submodule)('userId', sharedIdSystemSubmodule);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_6__.registerModule)('sharedIdSystem');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["domainOverrideToRootDomain","chunk-core","viewport","creative-renderer-display"], () => (__webpack_exec__("./modules/sharedIdSystem.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=sharedIdSystem.js.map