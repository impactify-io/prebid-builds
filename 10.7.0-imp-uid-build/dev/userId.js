"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["userId"],{

/***/ "./modules/userId/eids.js":
/*!********************************!*\
  !*** ./modules/userId/eids.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EID_CONFIG: () => (/* binding */ EID_CONFIG),
/* harmony export */   getEids: () => (/* binding */ getEids)
/* harmony export */ });
/* unused harmony export createEidsArray */
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");

const EID_CONFIG = new Map();

// this function will create an eid object for the given UserId sub-module
function createEidObject(userIdData, subModuleKey, eidConf) {
  if (eidConf && userIdData) {
    const eid = {};
    eid.source = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getSource']) ? eidConf['getSource'](userIdData) : eidConf['source'];
    const value = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getValue']) ? eidConf['getValue'](userIdData) : userIdData;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isStr)(value)) {
      const uid = {
        id: value,
        atype: eidConf['atype']
      };
      // getUidExt
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getUidExt'])) {
        const uidExt = eidConf['getUidExt'](userIdData);
        if (uidExt) {
          uid.ext = uidExt;
        }
      }
      eid.uids = [uid];
      if (eidConf['inserter'] || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getInserter'])) {
        const inserter = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getInserter']) ? eidConf['getInserter'](userIdData) : eidConf['inserter'];
        if (inserter != null) {
          eid.inserter = inserter;
        }
      }
      if (eidConf['matcher'] || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getMatcher'])) {
        const matcher = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getMatcher']) ? eidConf['getMatcher'](userIdData) : eidConf['matcher'];
        if (matcher != null) {
          eid.matcher = matcher;
        }
      }
      if (eidConf['mm'] != null) {
        eid.mm = eidConf['mm'];
      }
      // getEidExt
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFn)(eidConf['getEidExt'])) {
        const eidExt = eidConf['getEidExt'](userIdData);
        if (eidExt) {
          eid.ext = eidExt;
        }
      }
      return eid;
    }
  }
  return null;
}
function createEidsArray(bidRequestUserId) {
  let eidConfigs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EID_CONFIG;
  const allEids = {};
  function collect(eid) {
    const key = JSON.stringify([eid.source?.toLowerCase(), ...Object.keys(eid).filter(k => !['uids', 'source'].includes(k)).sort().map(k => eid[k])]);
    if (allEids.hasOwnProperty(key)) {
      allEids[key].uids.push(...eid.uids);
    } else {
      allEids[key] = eid;
    }
  }
  Object.entries(bidRequestUserId).forEach(_ref => {
    let [name, values] = _ref;
    values = Array.isArray(values) ? values : [values];
    const eidConf = eidConfigs.get(name);
    let eids;
    if (name === 'pubProvidedId') {
      eids = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.deepClone)(values);
    } else if (typeof eidConf === 'function') {
      try {
        eids = eidConf(values);
        if (!Array.isArray(eids)) {
          eids = [eids];
        }
        eids.forEach(eid => {
          eid.uids = eid.uids.filter(_ref2 => {
            let {
              id
            } = _ref2;
            return (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isStr)(id);
          });
        });
        eids = eids.filter(_ref3 => {
          let {
            uids
          } = _ref3;
          return uids?.length > 0;
        });
      } catch (e) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(`Could not generate EID for "${name}"`, e);
      }
    } else {
      eids = values.map(value => createEidObject(value, name, eidConf));
    }
    if (Array.isArray(eids)) {
      eids.filter(eid => eid != null).forEach(collect);
    }
  });
  return Object.values(allEids);
}
function getEids(priorityMap) {
  const eidConfigs = new Map();
  const idValues = {};
  Object.entries(priorityMap).forEach(_ref4 => {
    let [key, getActiveModule] = _ref4;
    const submodule = getActiveModule();
    if (submodule) {
      idValues[key] = submodule.idObj[key];
      let eidConf = submodule.submodule.eids?.[key];
      if (typeof eidConf === 'function') {
        // if eid config is given as a function, append the active module configuration to its args
        eidConf = (orig => function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return orig(...args, submodule.config);
        })(eidConf);
      }
      eidConfigs.set(key, eidConf);
    }
  });
  return createEidsArray(idValues, eidConfigs);
}


/***/ }),

/***/ "./modules/userId/index.js":
/*!*********************************!*\
  !*** ./modules/userId/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports PBJS_USER_ID_OPTOUT_NAME, coreStorage, dep, syncDelay, auctionDelay, setSubmoduleRegistry, setStoredValue, COOKIE_SUFFIXES, HTML5_SUFFIXES, deleteStoredValue, enrichEids, addIdData, startAuctionHook, getConsentHash, getValidSubmoduleConfigs, generateSubmoduleContainers, requestDataDeletion, attachIdSystem, init, resetUserIds */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../src/config.js */ "./src/config.js");
/* harmony import */ var _src_events_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../src/events.js */ "./src/events.js");
/* harmony import */ var _src_prebid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/prebid.js */ "./src/prebid.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../src/adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _src_constants_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../src/constants.js */ "./src/constants.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");
/* harmony import */ var _eids_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./eids.js */ "./modules/userId/eids.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../src/utils.js */ "../../node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_adserver_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../src/adserver.js */ "./src/adserver.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _src_fpd_rootDomain_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../src/fpd/rootDomain.js */ "./src/fpd/rootDomain.js");
/* harmony import */ var _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../src/consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../src/activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _src_activities_activities_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../src/activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _src_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../src/activities/activityParams.js */ "./src/activities/activityParams.js");
/* harmony import */ var _src_userSync_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../src/userSync.js */ "./src/userSync.js");
/* harmony import */ var _src_activities_params_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../src/activities/params.js */ "./src/activities/params.js");

/**
 * This module adds User ID support to prebid.js
 * @module modules/userId
 */





















const MODULE_NAME = 'User ID';
const COOKIE = _src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.STORAGE_TYPE_COOKIES;
const LOCAL_STORAGE = _src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.STORAGE_TYPE_LOCALSTORAGE;
const PBJS_USER_ID_OPTOUT_NAME = '_pbjs_id_optout';
const coreStorage = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.getCoreStorageManager)('userId');
const dep = {
  isAllowed: _src_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__.isActivityAllowed
};
let submodules = [];
let initializedSubmodules;
let configRegistry = [];
let idPriority = {};
let submoduleRegistry = [];
let timeoutID;
let syncDelay;
let auctionDelay;
let ppidSource;
let configListener;
const uidMetrics = (() => {
  let metrics;
  return () => {
    if (metrics == null) {
      metrics = (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_3__.newMetrics)();
    }
    return metrics;
  };
})();
function submoduleMetrics(moduleName) {
  return uidMetrics().fork().renameWith(n => [`userId.mod.${n}`, `userId.mods.${moduleName}.${n}`]);
}
function setSubmoduleRegistry(submodules) {
  submoduleRegistry = submodules;
  updateEIDConfig(submodules);
}
function cookieSetter(submodule, storageMgr) {
  storageMgr = storageMgr || submodule.storageMgr;
  const domainOverride = typeof submodule.submodule.domainOverride === 'function' ? submodule.submodule.domainOverride() : null;
  const name = submodule.config.storage.name;
  return function setCookie(suffix, value, expiration) {
    storageMgr.setCookie(name + (suffix || ''), value, expiration, 'Lax', domainOverride);
  };
}
function setValueInCookie(submodule, valueStr, expiresStr) {
  const storage = submodule.config.storage;
  const setCookie = cookieSetter(submodule);
  setCookie(null, valueStr, expiresStr);
  setCookie('_cst', getConsentHash(), expiresStr);
  if (typeof storage.refreshInSeconds === 'number') {
    setCookie('_last', new Date().toUTCString(), expiresStr);
  }
}
function setValueInLocalStorage(submodule, valueStr, expiresStr) {
  const storage = submodule.config.storage;
  const mgr = submodule.storageMgr;
  mgr.setDataInLocalStorage(`${storage.name}_exp`, expiresStr);
  mgr.setDataInLocalStorage(`${storage.name}_cst`, getConsentHash());
  mgr.setDataInLocalStorage(storage.name, encodeURIComponent(valueStr));
  if (typeof storage.refreshInSeconds === 'number') {
    mgr.setDataInLocalStorage(`${storage.name}_last`, new Date().toUTCString());
  }
}
function setStoredValue(submodule, value) {
  const storage = submodule.config.storage;
  try {
    const expiresStr = new Date(Date.now() + storage.expires * (60 * 60 * 24 * 1000)).toUTCString();
    const valueStr = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(value) ? JSON.stringify(value) : value;
    submodule.enabledStorageTypes.forEach(storageType => {
      switch (storageType) {
        case COOKIE:
          setValueInCookie(submodule, valueStr, expiresStr);
          break;
        case LOCAL_STORAGE:
          setValueInLocalStorage(submodule, valueStr, expiresStr);
          break;
      }
    });
  } catch (error) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(error);
  }
}
const COOKIE_SUFFIXES = ['', '_last', '_cst'];
function deleteValueFromCookie(submodule) {
  const setCookie = cookieSetter(submodule, coreStorage);
  const expiry = new Date(Date.now() - 1000 * 60 * 60 * 24).toUTCString();
  COOKIE_SUFFIXES.forEach(suffix => {
    try {
      setCookie(suffix, '', expiry);
    } catch (e) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(e);
    }
  });
}
const HTML5_SUFFIXES = ['', '_last', '_exp', '_cst'];
function deleteValueFromLocalStorage(submodule) {
  HTML5_SUFFIXES.forEach(suffix => {
    try {
      coreStorage.removeDataFromLocalStorage(submodule.config.storage.name + suffix);
    } catch (e) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(e);
    }
  });
}
function deleteStoredValue(submodule) {
  populateEnabledStorageTypes(submodule);
  submodule.enabledStorageTypes.forEach(storageType => {
    switch (storageType) {
      case COOKIE:
        deleteValueFromCookie(submodule);
        break;
      case LOCAL_STORAGE:
        deleteValueFromLocalStorage(submodule);
        break;
    }
  });
}
function getValueFromCookie(submodule, storedKey) {
  return submodule.storageMgr.getCookie(storedKey);
}
function getValueFromLocalStorage(submodule, storedKey) {
  const mgr = submodule.storageMgr;
  const storage = submodule.config.storage;
  const storedValueExp = mgr.getDataFromLocalStorage(`${storage.name}_exp`);

  // empty string means no expiration set
  if (storedValueExp === '') {
    return mgr.getDataFromLocalStorage(storedKey);
  } else if (storedValueExp && new Date(storedValueExp).getTime() - Date.now() > 0) {
    return decodeURIComponent(mgr.getDataFromLocalStorage(storedKey));
  }
}
function getStoredValue(submodule) {
  let key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  const storage = submodule.config.storage;
  const storedKey = key ? `${storage.name}_${key}` : storage.name;
  let storedValue;
  try {
    submodule.enabledStorageTypes.find(storageType => {
      switch (storageType) {
        case COOKIE:
          storedValue = getValueFromCookie(submodule, storedKey);
          break;
        case LOCAL_STORAGE:
          storedValue = getValueFromLocalStorage(submodule, storedKey);
          break;
      }
      return !!storedValue;
    });

    // support storing a string or a stringified object
    if (typeof storedValue === 'string' && storedValue.trim().charAt(0) === '{') {
      storedValue = JSON.parse(storedValue);
    }
  } catch (e) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(e);
  }
  return storedValue;
}
function processSubmoduleCallbacks(submodules, cb, priorityMaps) {
  cb = uidMetrics().fork().startTiming('userId.callbacks.total').stopBefore(cb);
  const done = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.delayExecution)(() => {
    clearTimeout(timeoutID);
    cb();
  }, submodules.length);
  submodules.forEach(function (submodule) {
    const moduleDone = submoduleMetrics(submodule.submodule.name).startTiming('callback').stopBefore(done);
    function callbackCompleted(idObj) {
      // if valid, id data should be saved to cookie/html storage
      if (idObj) {
        if (submodule.config.storage) {
          setStoredValue(submodule, idObj);
        }
        // cache decoded value (this is copied to every adUnit bid)
        submodule.idObj = submodule.submodule.decode(idObj, submodule.config);
        priorityMaps.refresh();
        updatePPID(priorityMaps);
      } else {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME}: ${submodule.submodule.name} - request id responded with an empty value`);
      }
      moduleDone();
    }
    try {
      submodule.callback(callbackCompleted, getStoredValue.bind(null, submodule));
    } catch (e) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(`Error in userID module '${submodule.submodule.name}':`, e);
      moduleDone();
    }
    // clear callback, this prop is used to test if all submodule callbacks are complete below
    submodule.callback = undefined;
  });
}
function getIds(priorityMap) {
  return Object.fromEntries(Object.entries(priorityMap).map(_ref => {
    let [key, getActiveModule] = _ref;
    return [key, getActiveModule()?.idObj?.[key]];
  }).filter(_ref2 => {
    let [_, value] = _ref2;
    return value != null;
  }));
}
function getPrimaryIds(submodule) {
  if (submodule.primaryIds) return submodule.primaryIds;
  const ids = Object.keys(submodule.eids ?? {});
  if (ids.length > 1) {
    throw new Error(`ID submodule ${submodule.name} can provide multiple IDs, but does not specify 'primaryIds'`);
  }
  return ids;
}

/**
 * Given a collection of items, where each item maps to any number of IDs (getKeys) and an ID module (getIdMod),
 * return a map from ID key to all items that map to that ID key, in order of priority (highest priority first).
 *
 */
function orderByPriority(items, getKeys, getIdMod) {
  const tally = {};
  items.forEach(item => {
    const module = getIdMod(item);
    const primaryIds = getPrimaryIds(module);
    getKeys(item).forEach(key => {
      const keyItems = tally[key] = tally[key] ?? [];
      const keyPriority = idPriority[key]?.indexOf(module.name) ?? (primaryIds.includes(key) ? 0 : -1);
      const pos = keyItems.findIndex(_ref3 => {
        let [priority] = _ref3;
        return priority < keyPriority;
      });
      keyItems.splice(pos === -1 ? keyItems.length : pos, 0, [keyPriority, item]);
    });
  });
  return Object.fromEntries(Object.entries(tally).map(_ref4 => {
    let [key, items] = _ref4;
    return [key, items.map(_ref5 => {
      let [_, item] = _ref5;
      return item;
    })];
  }));
}
function mkPriorityMaps() {
  const map = {
    submodules: [],
    global: {},
    bidder: {},
    combined: {},
    /**
     * @param {SubmoduleContainer[]} addtlModules
     */
    refresh() {
      let addtlModules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const refreshing = new Set(addtlModules.map(mod => mod.submodule));
      map.submodules = map.submodules.filter(mod => !refreshing.has(mod.submodule)).concat(addtlModules);
      update();
    }
  };
  function update() {
    const modulesById = orderByPriority(map.submodules, submod => Object.keys(submod.idObj ?? {}), submod => submod.submodule);
    const global = {};
    const bidder = {};
    function activeModuleGetter(key, useGlobals, modules) {
      return function () {
        for (const {
          allowed,
          bidders,
          module
        } of modules) {
          if (!dep.isAllowed(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_ENRICH_EIDS, (0,_src_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_7__.activityParams)(_src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_UID, module?.config?.name, {
            init: false
          }))) {
            continue;
          }
          const value = module.idObj?.[key];
          if (value != null) {
            if (allowed) {
              return module;
            } else if (useGlobals) {
              // value != null, allowed = false, useGlobals = true:
              // this module has the preferred ID but it cannot be used (because it's restricted to only some bidders
              // and we are calculating global IDs).
              // since we don't (yet) have a way to express "global except for these bidders" in FPD,
              // do not keep looking for alternative IDs in other (lower priority) modules; the ID will be provided only
              // to the bidders this module is configured for.
              const listModules = modules => modules.map(mod => mod.module.submodule.name).join(', ');
              (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)(`userID modules ${listModules(modules)} provide the same ID ('${key}'); ${module.submodule.name} is the preferred source, but it's configured only for some bidders, unlike ${listModules(modules.filter(mod => mod.bidders == null))}. Other bidders will not see the "${key}" ID.`);
              return null;
            } else if (bidders == null) {
              // value != null, allowed = false, useGlobals = false, bidders == null:
              // this module has the preferred ID but it should not be used because it's not bidder-restricted and
              // we are calculating bidder-specific ids. Do not keep looking in other lower priority modules, as the ID
              // will be set globally.
              return null;
            }
          }
        }
        return null;
      };
    }
    Object.entries(modulesById).forEach(_ref6 => {
      let [key, modules] = _ref6;
      let allNonGlobal = true;
      const bidderFilters = new Set();
      modules = modules.map(module => {
        let bidders = null;
        if (Array.isArray(module.config.bidders) && module.config.bidders.length > 0) {
          bidders = module.config.bidders;
          bidders.forEach(bidder => bidderFilters.add(bidder));
        } else {
          allNonGlobal = false;
        }
        return {
          module,
          bidders
        };
      });
      if (!allNonGlobal) {
        global[key] = activeModuleGetter(key, true, modules.map(_ref7 => {
          let {
            bidders,
            module
          } = _ref7;
          return {
            allowed: bidders == null,
            bidders,
            module
          };
        }));
      }
      bidderFilters.forEach(bidderCode => {
        bidder[bidderCode] = bidder[bidderCode] ?? {};
        bidder[bidderCode][key] = activeModuleGetter(key, false, modules.map(_ref8 => {
          let {
            bidders,
            module
          } = _ref8;
          return {
            allowed: bidders?.includes(bidderCode),
            bidders,
            module
          };
        }));
      });
    });
    const combined = Object.values(bidder).concat([global]).reduce((combo, map) => Object.assign(combo, map), {});
    Object.assign(map, {
      global,
      bidder,
      combined
    });
  }
  return map;
}
function enrichEids(ortb2Fragments) {
  const {
    global: globalFpd,
    bidder: bidderFpd
  } = ortb2Fragments;
  const {
    global: globalMods,
    bidder: bidderMods
  } = initializedSubmodules;
  const globalEids = (0,_eids_js__WEBPACK_IMPORTED_MODULE_9__.getEids)(globalMods);
  if (globalEids.length > 0) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_10__.dset)(globalFpd, 'user.ext.eids', (globalFpd.user?.ext?.eids ?? []).concat(globalEids));
  }
  Object.entries(bidderMods).forEach(_ref9 => {
    let [bidder, moduleMap] = _ref9;
    const bidderEids = (0,_eids_js__WEBPACK_IMPORTED_MODULE_9__.getEids)(moduleMap);
    if (bidderEids.length > 0) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_10__.dset)(bidderFpd, `${bidder}.user.ext.eids`, (bidderFpd[bidder]?.user?.ext?.eids ?? []).concat(bidderEids));
    }
  });
  return ortb2Fragments;
}
function addIdData(_ref0) {
  let {
    ortb2Fragments
  } = _ref0;
  ortb2Fragments = ortb2Fragments ?? {
    global: {},
    bidder: {}
  };
  enrichEids(ortb2Fragments);
}
const INIT_CANCELED = {};
function idSystemInitializer() {
  let {
    mkDelay = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.delay
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const startInit = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.defer)();
  const startCallbacks = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.defer)();
  let cancel;
  let initialized = false;
  let initMetrics;
  function cancelAndTry(promise) {
    initMetrics = uidMetrics().fork();
    if (cancel != null) {
      cancel.reject(INIT_CANCELED);
    }
    cancel = (0,_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.defer)();
    return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.PbPromise.race([promise, cancel.promise]).finally(initMetrics.startTiming('userId.total'));
  }

  // grab a reference to global vars so that the promise chains remain isolated;
  // multiple calls to `init` (from tests) might otherwise cause them to interfere with each other
  const initModules = initializedSubmodules;
  const allModules = submodules;
  function checkRefs(fn) {
    // unfortunately tests have their own global state that needs to be guarded, so even if we keep ours tidy,
    // we cannot let things like submodule callbacks run (they pollute things like the global `server` XHR mock)
    return function () {
      if (initModules === initializedSubmodules && allModules === submodules) {
        return fn(...arguments);
      }
    };
  }
  function timeConsent() {
    return _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_12__.allConsent.promise.finally(initMetrics.startTiming('userId.init.consent'));
  }
  let done = cancelAndTry(_src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.PbPromise.all([_src_hook_js__WEBPACK_IMPORTED_MODULE_13__.ready, startInit.promise]).then(timeConsent).then(checkRefs(() => {
    initSubmodules(initModules, allModules);
  })).then(() => startCallbacks.promise.finally(initMetrics.startTiming('userId.callbacks.pending'))).then(checkRefs(() => {
    const modWithCb = initModules.submodules.filter(item => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFn)(item.callback));
    if (modWithCb.length) {
      return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.PbPromise(resolve => processSubmoduleCallbacks(modWithCb, resolve, initModules));
    }
  })));

  /**
   * with `ready` = true, starts initialization; with `refresh` = true, reinitialize submodules (optionally
   * filtered by `submoduleNames`).
   */
  return function () {
    let {
      refresh = false,
      submoduleNames = null,
      ready = false
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (ready && !initialized) {
      initialized = true;
      startInit.resolve();
      // submodule callbacks should run immediately if `auctionDelay` > 0, or `syncDelay` ms after the
      // auction ends otherwise
      if (auctionDelay > 0) {
        startCallbacks.resolve();
      } else {
        _src_events_js__WEBPACK_IMPORTED_MODULE_14__.on(_src_constants_js__WEBPACK_IMPORTED_MODULE_15__.EVENTS.AUCTION_END, function auctionEndHandler() {
          _src_events_js__WEBPACK_IMPORTED_MODULE_14__.off(_src_constants_js__WEBPACK_IMPORTED_MODULE_15__.EVENTS.AUCTION_END, auctionEndHandler);
          mkDelay(syncDelay).then(startCallbacks.resolve);
        });
      }
    }
    if (refresh && initialized) {
      done = cancelAndTry(done.catch(() => null).then(timeConsent) // fetch again in case a refresh was forced before this was resolved
      .then(checkRefs(() => {
        const cbModules = initSubmodules(initModules, allModules.filter(sm => submoduleNames == null || submoduleNames.includes(sm.submodule.name)), true).filter(sm => {
          return sm.callback != null;
        });
        if (cbModules.length) {
          return new _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.PbPromise(resolve => processSubmoduleCallbacks(cbModules, resolve, initModules));
        }
      })));
    }
    return done;
  };
}
let initIdSystem;
function getPPID() {
  let eids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserIdsAsEids() || [];
  // userSync.ppid should be one of the 'source' values in getUserIdsAsEids() eg pubcid.org or id5-sync.com
  const matchingUserId = ppidSource && eids.find(userID => userID.source === ppidSource);
  if (matchingUserId && typeof matchingUserId?.uids?.[0]?.id === 'string') {
    const ppidValue = matchingUserId.uids[0].id.replace(/[\W_]/g, '');
    if (ppidValue.length >= 32 && ppidValue.length <= 150) {
      return ppidValue;
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)(`User ID - Googletag Publisher Provided ID for ${ppidSource} is not between 32 and 150 characters - ${ppidValue}`);
    }
  }
}

/**
 * Hook is executed before adapters, but after consentManagement. Consent data is requied because
 * this module requires GDPR consent with Purpose #1 to save data locally.
 * The two main actions handled by the hook are:
 * 1. check gdpr consentData and handle submodule initialization.
 * 2. append user id data (loaded from cookied/html or from the getId method) to bids to be accessed in adapters.
 * @param {Object} reqBidsConfigObj required; This is the same param that's used in pbjs.requestBids.
 * @param {function} fn required; The next function in the chain, used by hook.ts
 */
const startAuctionHook = (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_3__.timedAuctionHook)('userId', function requestBidsHook(fn, reqBidsConfigObj) {
  let {
    mkDelay = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.delay,
    getIds = getUserIdsAsync
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.PbPromise.race([getIds().catch(() => null), mkDelay(auctionDelay)]).then(() => {
    addIdData(reqBidsConfigObj);
    uidMetrics().join((0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_3__.useMetrics)(reqBidsConfigObj.metrics), {
      propagate: false,
      includeGroups: true
    });
    // calling fn allows prebid to continue processing
    fn.call(this, reqBidsConfigObj);
  });
});

/**
 * Alias bid requests' `userIdAsEids` to `ortb2.user.ext.eids`
 * Do this lazily (instead of attaching a copy) so that it also shows EIDs added after the userId module runs (e.g. from RTD modules)
 */
function aliasEidsHook(next, bidderRequests) {
  bidderRequests.forEach(bidderRequest => {
    bidderRequest.bids.forEach(bid => Object.defineProperty(bid, 'userIdAsEids', {
      configurable: true,
      get() {
        return bidderRequest.ortb2.user?.ext?.eids;
      }
    }));
  });
  next(bidderRequests);
}

/**
 * Is startAuctionHook added
 * @returns {boolean}
 */
function addedStartAuctionHook() {
  return !!_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.startAuction.getHooks({
    hook: startAuctionHook
  }).length;
}

/**
 * This function will be exposed in global-name-space so that userIds stored by Prebid UserId module can be used by external codes as well.
 * Simple use case will be passing these UserIds to A9 wrapper solution
 */
function getUserIds() {
  return getIds(initializedSubmodules.combined);
}

/**
 * This function will be exposed in global-name-space so that userIds stored by Prebid UserId module can be used by external codes as well.
 * Simple use case will be passing these UserIds to A9 wrapper solution
 */
function getUserIdsAsEids() {
  return (0,_eids_js__WEBPACK_IMPORTED_MODULE_9__.getEids)(initializedSubmodules.combined);
}

/**
 * This function will be exposed in global-name-space so that userIds stored by Prebid UserId module can be used by external codes as well.
 * Simple use case will be passing these UserIds to A9 wrapper solution
 */

function getUserIdsAsEidBySource(sourceName) {
  return getUserIdsAsEids().filter(eid => eid.source === sourceName)[0];
}

/**
 * This function will be exposed in global-name-space so that userIds for a source can be exposed
 * Sample use case is exposing this function to ESP
 */
function getEncryptedEidsForSource(source, encrypt, customFunction) {
  return retryOnCancel().then(() => {
    const eidsSignals = {};
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFn)(customFunction)) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME} - Getting encrypted signal from custom function : ${customFunction.name} & source : ${source} `);
      // Publishers are expected to define a common function which will be proxy for signal function.
      const customSignals = customFunction(source);
      eidsSignals[source] = customSignals ? encryptSignals(customSignals) : null; // by default encrypt using base64 to avoid JSON errors
    } else {
      // initialize signal with eids by default
      const eid = getUserIdsAsEidBySource(source);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME} - Getting encrypted signal for eids :${JSON.stringify(eid)}`);
      if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.isEmpty)(eid)) {
        eidsSignals[eid.source] = encrypt === true ? encryptSignals(eid) : eid.uids[0].id; // If encryption is enabled append version (1||) and encrypt entire object
      }
    }
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME} - Fetching encrypted eids: ${eidsSignals[source]}`);
    return eidsSignals[source];
  });
}
function encryptSignals(signals) {
  let version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  let encryptedSig = '';
  switch (version) {
    case 1:
      // Base64 Encryption
      encryptedSig = typeof signals === 'object' ? window.btoa(JSON.stringify(signals)) : window.btoa(signals); // Test encryption. To be replaced with better algo
      break;
    default:
      break;
  }
  return `${version}||${encryptedSig}`;
}

/**
 * This function will be exposed in the global-name-space so that publisher can register the signals-ESP.
 */
function registerSignalSources() {
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.isGptPubadsDefined)()) {
    return;
  }
  const providers = window.googletag.secureSignalProviders = window.googletag.secureSignalProviders || [];
  const existingIds = new Set(providers.map(p => 'id' in p ? p.id : p.networkCode));
  const encryptedSignalSources = _src_config_js__WEBPACK_IMPORTED_MODULE_16__.config.getConfig('userSync.encryptedSignalSources');
  if (encryptedSignalSources) {
    const registerDelay = encryptedSignalSources.registerDelay || 0;
    setTimeout(() => {
      encryptedSignalSources['sources'] && encryptedSignalSources['sources'].forEach(_ref1 => {
        let {
          source,
          encrypt,
          customFunc
        } = _ref1;
        source.forEach(src => {
          if (!existingIds.has(src)) {
            providers.push({
              id: src,
              collectorFunction: () => getEncryptedEidsForSource(src, encrypt, customFunc)
            });
            existingIds.add(src);
          }
        });
      });
    }, registerDelay);
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)(`${MODULE_NAME} - ESP : encryptedSignalSources config not defined under userSync Object`);
  }
}
function retryOnCancel(initParams) {
  return initIdSystem(initParams).then(() => getUserIds(), e => {
    if (e === INIT_CANCELED) {
      // there's a pending refresh - because GreedyPromise runs this synchronously, we are now in the middle
      // of canceling the previous init, before the refresh logic has had a chance to run.
      // Use a "normal" Promise to clear the stack and let it complete (or this will just recurse infinitely)
      return Promise.resolve().then(getUserIdsAsync);
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)('Error initializing userId', e);
      return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.PbPromise.reject(e);
    }
  });
}

/**
 * Force (re)initialization of ID submodules.
 *
 * This will force a refresh of the specified ID submodules regardless of `auctionDelay` / `syncDelay` settings, and
 * return a promise that resolves to the same value as `getUserIds()` when the refresh is complete.
 * If a refresh is already in progress, it will be canceled (rejecting promises returned by previous calls to `refreshUserIds`).
 *
 * submoduleNames submodules to refresh. If omitted, refresh all submodules.
 * callback called when the refresh is complete
 */
function refreshUserIds() {
  let {
    submoduleNames
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let callback = arguments.length > 1 ? arguments[1] : undefined;
  return retryOnCancel({
    refresh: true,
    submoduleNames
  }).then(userIds => {
    if (callback && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFn)(callback)) {
      callback();
    }
    return userIds;
  });
}

/**
 * @returns a promise that resolves to the same value as `getUserIds()`, but only once all ID submodules have completed
 * initialization. This can also be used to synchronize calls to other ID accessors, e.g.
 *
 * ```
 * pbjs.getUserIdsAsync().then(() => {
 *   const eids = pbjs.getUserIdsAsEids(); // guaranteed to be completely initialized at this point
 * });
 * ```
 */

function getUserIdsAsync() {
  return retryOnCancel();
}
function getConsentHash() {
  // transform decimal string into base64 to save some space on cookies
  let hash = Number(_src_consentHandler_js__WEBPACK_IMPORTED_MODULE_12__.allConsent.hash);
  const bytes = [];
  while (hash > 0) {
    bytes.push(String.fromCharCode(hash & 255));
    hash = hash >>> 8;
  }
  return btoa(bytes.join(''));
}
function consentChanged(submodule) {
  const storedConsent = getStoredValue(submodule, 'cst');
  return !storedConsent || storedConsent !== getConsentHash();
}
function populateSubmoduleId(submodule, forceRefresh) {
  const consentData = _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_12__.allConsent.getConsentData();

  // There are two submodule configuration types to handle: storage or value
  // 1. storage: retrieve user id data from cookie/html storage or with the submodule's getId method
  // 2. value: pass directly to bids
  if (submodule.config.storage) {
    let storedId = getStoredValue(submodule);
    let response;
    let refreshNeeded = false;
    if (typeof submodule.config.storage.refreshInSeconds === 'number') {
      const storedDate = new Date(getStoredValue(submodule, 'last'));
      refreshNeeded = storedDate && Date.now() - storedDate.getTime() > submodule.config.storage.refreshInSeconds * 1000;
    }
    if (!storedId || refreshNeeded || forceRefresh || consentChanged(submodule)) {
      const extendedConfig = Object.assign({
        enabledStorageTypes: submodule.enabledStorageTypes
      }, submodule.config);

      // No id previously saved, or a refresh is needed, or consent has changed. Request a new id from the submodule.
      response = submodule.submodule.getId(extendedConfig, consentData, storedId);
    } else if (typeof submodule.submodule.extendId === 'function') {
      // If the id exists already, give submodule a chance to decide additional actions that need to be taken
      response = submodule.submodule.extendId(submodule.config, consentData, storedId);
    }
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(response)) {
      if (response.id) {
        // A getId/extendId result assumed to be valid user id data, which should be saved to users local storage or cookies
        setStoredValue(submodule, response.id);
        storedId = response.id;
      }
      if (typeof response.callback === 'function') {
        // Save async callback to be invoked after auction
        submodule.callback = response.callback;
      }
    }
    if (storedId) {
      // cache decoded value (this is copied to every adUnit bid)
      submodule.idObj = submodule.submodule.decode(storedId, submodule.config);
    }
  } else if (submodule.config.value) {
    // cache decoded value (this is copied to every adUnit bid)
    submodule.idObj = submodule.config.value;
  } else {
    const response = submodule.submodule.getId(submodule.config, consentData);
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(response)) {
      if (typeof response.callback === 'function') {
        submodule.callback = response.callback;
      }
      if (response.id) {
        submodule.idObj = submodule.submodule.decode(response.id, submodule.config);
      }
    }
  }
}
function updatePPID(priorityMaps) {
  const eids = (0,_eids_js__WEBPACK_IMPORTED_MODULE_9__.getEids)(priorityMaps.combined);
  if (eids.length && ppidSource) {
    const ppid = getPPID(eids);
    if (ppid) {
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.isGptPubadsDefined)()) {
        window.googletag.pubads().setPublisherProvidedId(ppid);
      } else {
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];
        window.googletag.cmd.push(function () {
          window.googletag.pubads().setPublisherProvidedId(ppid);
        });
      }
    }
  }
}
function initSubmodules(priorityMaps, submodules) {
  let forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return uidMetrics().fork().measureTime('userId.init.modules', function () {
    if (!submodules.length) return []; // to simplify log messages from here on
    submodules.forEach(submod => populateEnabledStorageTypes(submod));

    /**
     * filter out submodules that:
     *
     *  - cannot use the storage they've been set up with (storage not available / not allowed / disabled)
     *  - are not allowed to perform the `enrichEids` activity
     */
    submodules = submodules.filter(submod => {
      return (!submod.config.storage || canUseStorage(submod)) && dep.isAllowed(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_ENRICH_EIDS, (0,_src_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_7__.activityParams)(_src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_UID, submod.config.name));
    });
    if (!submodules.length) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)(`${MODULE_NAME} - no ID module configured`);
      return [];
    }
    const initialized = submodules.reduce((carry, submodule) => {
      return submoduleMetrics(submodule.submodule.name).measureTime('init', () => {
        try {
          populateSubmoduleId(submodule, forceRefresh);
          carry.push(submodule);
        } catch (e) {
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(`Error in userID module '${submodule.submodule.name}':`, e);
        }
        return carry;
      });
    }, []);
    priorityMaps.refresh(initialized);
    updatePPID(priorityMaps);
    return initialized;
  });
}
function getConfiguredStorageTypes(config) {
  return config?.storage?.type?.trim().split(/\s*&\s*/) || [];
}
function hasValidStorageTypes(config) {
  const storageTypes = getConfiguredStorageTypes(config);
  return storageTypes.every(storageType => ALL_STORAGE_TYPES.has(storageType));
}

/**
 * list of submodule configurations with valid 'storage' or 'value' obj definitions
 * storage config: contains values for storing/retrieving User ID data in browser storage
 * value config: object properties that are copied to bids (without saving to storage)
 */
function getValidSubmoduleConfigs(configRegistry) {
  function err(msg) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)(`Invalid userSync.userId config: ${msg}`, ...args);
  }
  if (!Array.isArray(configRegistry)) {
    if (configRegistry != null) {
      err('must be an array', configRegistry);
    }
    return [];
  }
  return configRegistry.filter(config => {
    if (!config?.name) {
      return err('must specify "name"', config);
    } else if (config.storage) {
      if (!config.storage.name || !config.storage.type) {
        return err('must specify "storage.name" and "storage.type"', config);
      } else if (!hasValidStorageTypes(config)) {
        return err('invalid "storage.type"', config);
      }
      ['expires', 'refreshInSeconds'].forEach(param => {
        let value = config.storage[param];
        if (value != null && typeof value !== 'number') {
          value = Number(value);
          if (isNaN(value)) {
            err(`storage.${param} must be a number and will be ignored`, config);
            delete config.storage[param];
          } else {
            config.storage[param] = value;
          }
        }
      });
    }
    return true;
  });
}
const ALL_STORAGE_TYPES = new Set([LOCAL_STORAGE, COOKIE]);
function canUseLocalStorage(submodule) {
  if (!submodule.storageMgr.localStorageIsEnabled()) {
    return false;
  }
  if (coreStorage.getDataFromLocalStorage(PBJS_USER_ID_OPTOUT_NAME)) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME} - opt-out localStorage found, storage disabled`);
    return false;
  }
  return true;
}
function canUseCookies(submodule) {
  if (!submodule.storageMgr.cookiesAreEnabled()) {
    return false;
  }
  if (coreStorage.getCookie(PBJS_USER_ID_OPTOUT_NAME)) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME} - opt-out cookie found, storage disabled`);
    return false;
  }
  return true;
}
const STORAGE_PURPOSES = [1, 2, 3, 4, 7];
function populateEnabledStorageTypes(submodule) {
  if (submodule.enabledStorageTypes) {
    return;
  }
  const storageTypes = getConfiguredStorageTypes(submodule.config);
  submodule.enabledStorageTypes = storageTypes.filter(type => {
    switch (type) {
      case LOCAL_STORAGE:
        HTML5_SUFFIXES.forEach(suffix => {
          (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.discloseStorageUse)('userId', {
            type: 'web',
            identifier: submodule.config.storage.name + suffix,
            purposes: STORAGE_PURPOSES
          });
        });
        return canUseLocalStorage(submodule);
      case COOKIE:
        COOKIE_SUFFIXES.forEach(suffix => {
          (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.discloseStorageUse)('userId', {
            type: 'cookie',
            identifier: submodule.config.storage.name + suffix,
            purposes: STORAGE_PURPOSES,
            maxAgeSeconds: (submodule.config.storage.expires ?? 0) * 24 * 60 * 60,
            cookieRefresh: true
          });
        });
        return canUseCookies(submodule);
    }
    return false;
  });
}
function canUseStorage(submodule) {
  return !!submodule.enabledStorageTypes.length;
}
function updateEIDConfig(submodules) {
  _eids_js__WEBPACK_IMPORTED_MODULE_9__.EID_CONFIG.clear();
  Object.entries(orderByPriority(submodules, mod => Object.keys(mod.eids || {}), mod => mod)).forEach(_ref10 => {
    let [key, submodules] = _ref10;
    return _eids_js__WEBPACK_IMPORTED_MODULE_9__.EID_CONFIG.set(key, submodules[0].eids[key]);
  });
}
function generateSubmoduleContainers(options, configs) {
  let prevSubmodules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : submodules;
  let registry = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : submoduleRegistry;
  const {
    autoRefresh,
    retainConfig
  } = options;
  return registry.reduce((acc, submodule) => {
    const {
      name,
      aliasName
    } = submodule;
    const matchesName = query => [name, aliasName].some(value => value?.toLowerCase() === query.toLowerCase());
    const submoduleConfig = configs.find(configItem => matchesName(configItem.name));
    if (!submoduleConfig) {
      if (!retainConfig) return acc;
      const previousSubmodule = prevSubmodules.find(prevSubmodules => matchesName(prevSubmodules.config.name));
      return previousSubmodule ? [...acc, previousSubmodule] : acc;
    }
    const newSubmoduleContainer = {
      submodule,
      config: {
        ...submoduleConfig,
        name: submodule.name
      },
      callback: undefined,
      idObj: undefined,
      storageMgr: (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.newStorageManager)({
        moduleType: _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_UID,
        moduleName: submoduleConfig.name,
        // since this manager is only using keys provided directly by the publisher,
        // turn off storageControl checks
        advertiseKeys: false
      })
    };
    if (autoRefresh) {
      const previousSubmodule = prevSubmodules.find(prevSubmodules => matchesName(prevSubmodules.config.name));
      newSubmoduleContainer.refreshIds = !previousSubmodule || !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.deepEqual)(newSubmoduleContainer.config, previousSubmodule.config);
    }
    return [...acc, newSubmoduleContainer];
  }, []);
}
/**
 * update submodules by validating against existing configs and storage types
 */
function updateSubmodules() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  updateEIDConfig(submoduleRegistry);
  const configs = getValidSubmoduleConfigs(configRegistry);
  if (!configs.length) {
    return;
  }
  const updatedContainers = generateSubmoduleContainers(options, configs);
  submodules.splice(0, submodules.length);
  submodules.push(...updatedContainers);
  if (submodules.length) {
    if (!addedStartAuctionHook()) {
      _src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.startAuction.before(startAuctionHook, 100); // use higher priority than dataController / rtd
      _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_17__["default"].callDataDeletionRequest.before(requestDataDeletion);
      _src_adserver_js__WEBPACK_IMPORTED_MODULE_18__.getPPID.after(next => next(getPPID()));
    }
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)(`${MODULE_NAME} - usersync config updated for ${submodules.length} submodules: `, submodules.map(a => a.submodule.name));
  }
}

/**
 * This function will update the idPriority according to the provided configuration
 */
function updateIdPriority(idPriorityConfig, submodules) {
  if (idPriorityConfig) {
    const result = {};
    const aliasToName = new Map(submodules.map(s => s.aliasName ? [s.aliasName, s.name] : []));
    Object.keys(idPriorityConfig).forEach(key => {
      const priority = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(idPriorityConfig[key]) ? [...idPriorityConfig[key]].reverse() : [];
      result[key] = priority.map(s => aliasToName.has(s) ? aliasToName.get(s) : s);
    });
    idPriority = result;
  } else {
    idPriority = {};
  }
  initializedSubmodules.refresh();
  updateEIDConfig(submodules);
}
function requestDataDeletion(next) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)('UserID: received data deletion request; deleting all stored IDs...');
  submodules.forEach(submodule => {
    if (typeof submodule.submodule.onDataDeletionRequest === 'function') {
      try {
        submodule.submodule.onDataDeletionRequest(submodule.config, submodule.idObj, ...args);
      } catch (e) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)(`Error calling onDataDeletionRequest for ID submodule ${submodule.submodule.name}`, e);
      }
    }
    deleteStoredValue(submodule);
  });
  next.apply(this, args);
}

/**
 * enable submodule in User ID
 */
function attachIdSystem(submodule) {
  submodule.findRootDomain = _src_fpd_rootDomain_js__WEBPACK_IMPORTED_MODULE_19__.findRootDomain;
  if (!(submoduleRegistry || []).find(i => i.name === submodule.name)) {
    submoduleRegistry.push(submodule);
    _src_consentHandler_js__WEBPACK_IMPORTED_MODULE_12__.GDPR_GVLIDS.register(_src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_UID, submodule.name, submodule.gvlid);
    updateSubmodules();
    // TODO: a test case wants this to work even if called after init (the setConfig({userId}))
    // so we trigger a refresh. But is that even possible outside of tests?
    initIdSystem({
      refresh: true,
      submoduleNames: [submodule.name]
    });
  }
}
function normalizePromise(fn) {
  // for public methods that return promises, make sure we return a "normal" one - to avoid
  // exposing confusing stack traces
  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return Promise.resolve(fn.apply(this, args));
  };
}
const enforceStorageTypeRule = (userIdsConfig, enforceStorageType) => {
  return params => {
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_20__.ACTIVITY_PARAM_COMPONENT_TYPE] !== _src_activities_modules_js__WEBPACK_IMPORTED_MODULE_8__.MODULE_TYPE_UID || !params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_20__.ACTIVITY_PARAM_STORAGE_WRITE]) return;
    const matchesName = query => params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_20__.ACTIVITY_PARAM_COMPONENT_NAME]?.toLowerCase() === query?.toLowerCase();
    const submoduleConfig = userIdsConfig.find(configItem => matchesName(configItem.name));
    if (!submoduleConfig || !submoduleConfig.storage) return;
    if (params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_20__.ACTIVITY_PARAM_STORAGE_TYPE] !== submoduleConfig.storage.type) {
      const reason = `${submoduleConfig.name} attempts to store data in ${params[_src_activities_params_js__WEBPACK_IMPORTED_MODULE_20__.ACTIVITY_PARAM_STORAGE_TYPE]} while configuration allows ${submoduleConfig.storage.type}.`;
      if (enforceStorageType) {
        return {
          allow: false,
          reason
        };
      } else {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)(reason);
      }
    }
  };
};

/**
 * test browser support for storage config types (local storage or cookie), initializes submodules but consentManagement is required,
 * so a callback is added to fire after the consentManagement module.
 * @param {{getConfig:function}} config
 */
function init(config) {
  let {
    mkDelay = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_11__.delay
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ppidSource = undefined;
  submodules = [];
  configRegistry = [];
  initializedSubmodules = mkPriorityMaps();
  initIdSystem = idSystemInitializer({
    mkDelay
  });
  if (configListener != null) {
    configListener();
  }
  submoduleRegistry = [];
  let unregisterEnforceStorageTypeRule;

  // listen for config userSyncs to be set
  configListener = config.getConfig('userSync', conf => {
    // Note: support for 'usersync' was dropped as part of Prebid.js 4.0
    const userSync = conf.userSync;
    if (userSync) {
      ppidSource = userSync.ppid;
      if (userSync.userIds) {
        const {
          autoRefresh = false,
          retainConfig = true,
          enforceStorageType
        } = userSync;
        configRegistry = userSync.userIds;
        syncDelay = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(userSync.syncDelay) ? userSync.syncDelay : _src_userSync_js__WEBPACK_IMPORTED_MODULE_21__.USERSYNC_DEFAULT_CONFIG.syncDelay;
        auctionDelay = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(userSync.auctionDelay) ? userSync.auctionDelay : _src_userSync_js__WEBPACK_IMPORTED_MODULE_21__.USERSYNC_DEFAULT_CONFIG.auctionDelay;
        updateSubmodules({
          retainConfig,
          autoRefresh
        });
        unregisterEnforceStorageTypeRule?.();
        unregisterEnforceStorageTypeRule = (0,_src_activities_rules_js__WEBPACK_IMPORTED_MODULE_2__.registerActivityControl)(_src_activities_activities_js__WEBPACK_IMPORTED_MODULE_6__.ACTIVITY_ACCESS_DEVICE, 'enforceStorageTypeRule', enforceStorageTypeRule(submodules.map(_ref11 => {
          let {
            config
          } = _ref11;
          return config;
        }), enforceStorageType));
        updateIdPriority(userSync.idPriority, submoduleRegistry);
        initIdSystem({
          ready: true
        });
        const submodulesToRefresh = submodules.filter(item => item.refreshIds);
        if (submodulesToRefresh.length) {
          refreshUserIds({
            submoduleNames: submodulesToRefresh.map(item => item.submodule.name)
          });
        }
      }
    }
  });
  _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_17__["default"].makeBidRequests.after(aliasEidsHook);

  // exposing getUserIds function in global-name-space so that userIds stored in Prebid can be used by external codes.
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('getUserIds', getUserIds);
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('getUserIdsAsEids', getUserIdsAsEids);
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('getEncryptedEidsForSource', normalizePromise(getEncryptedEidsForSource));
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('registerSignalSources', registerSignalSources);
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('refreshUserIds', normalizePromise(refreshUserIds));
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('getUserIdsAsync', normalizePromise(getUserIdsAsync));
  (0,_src_prebid_js__WEBPACK_IMPORTED_MODULE_0__.addApiMethod)('getUserIdsAsEidBySource', getUserIdsAsEidBySource);
}
function resetUserIds() {
  _src_config_js__WEBPACK_IMPORTED_MODULE_16__.config.setConfig({
    userSync: {}
  });
  init(_src_config_js__WEBPACK_IMPORTED_MODULE_16__.config);
}

// init config update listener to start the application
init(_src_config_js__WEBPACK_IMPORTED_MODULE_16__.config);
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_13__.module)('userId', attachIdSystem, {
  postInstallAllowed: true
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_22__.registerModule)('userId');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["chunk-core","viewport","creative-renderer-display"], () => (__webpack_exec__("./modules/userId/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=userId.js.map