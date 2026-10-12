"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["fpdUtils"],{

/***/ "./libraries/fpdUtils/ortbMap.js"
/*!***************************************!*\
  !*** ./libraries/fpdUtils/ortbMap.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ORTB_MAP: () => (/* binding */ ORTB_MAP)
/* harmony export */ });
/**
 * Data type map
 */
const TYPES = {
  string: 'string',
  object: 'object',
  number: 'number'
};

/**
 * Template to define what ortb2 attributes should be validated
 * Accepted fields:
 * -- invalid - {Boolean} if true, field is not valid
 * -- type - {String} valid data type of field
 * -- isArray - {Boolean} if true, field must be an array
 * -- childType - {String} used in conjuction with isArray: true, defines valid type of array indices
 * -- children - {Object} defines child properties needed to be validated (used only if type: object)
 * -- required - {Array} array of strings defining any required properties for object (used only if type: object)
 * -- optoutApplies - {Boolean} if true, optout logic will filter if applicable (currently only applies to user object)
 */
const ORTB_MAP = {
  imp: {
    invalid: true
  },
  cur: {
    type: TYPES.object,
    isArray: true,
    childType: TYPES.string
  },
  device: {
    type: TYPES.object,
    children: {
      w: {
        type: TYPES.number
      },
      h: {
        type: TYPES.number
      }
    }
  },
  site: {
    type: TYPES.object,
    children: {
      name: {
        type: TYPES.string
      },
      domain: {
        type: TYPES.string
      },
      page: {
        type: TYPES.string
      },
      ref: {
        type: TYPES.string
      },
      keywords: {
        type: TYPES.string
      },
      search: {
        type: TYPES.string
      },
      cat: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.string
      },
      sectioncat: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.string
      },
      pagecat: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.string
      },
      content: {
        type: TYPES.object,
        isArray: false,
        children: {
          data: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.object,
            required: ['name', 'segment'],
            children: {
              segment: {
                type: TYPES.object,
                isArray: true,
                childType: TYPES.object,
                required: ['id'],
                children: {
                  id: {
                    type: TYPES.string
                  }
                }
              },
              name: {
                type: TYPES.string
              },
              ext: {
                type: TYPES.object
              }
            }
          }
        }
      },
      publisher: {
        type: TYPES.object,
        isArray: false,
        children: {
          id: {
            type: TYPES.string
          },
          name: {
            type: TYPES.string
          },
          cat: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.string
          },
          domain: {
            type: TYPES.string
          },
          ext: {
            type: TYPES.object,
            isArray: false
          }
        }
      }
    }
  },
  user: {
    type: TYPES.object,
    children: {
      yob: {
        type: TYPES.number,
        optoutApplies: true
      },
      gender: {
        type: TYPES.string,
        optoutApplies: true
      },
      keywords: {
        type: TYPES.string
      },
      data: {
        type: TYPES.object,
        isArray: true,
        childType: TYPES.object,
        required: ['name', 'segment'],
        children: {
          segment: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.object,
            required: ['id'],
            children: {
              id: {
                type: TYPES.string
              }
            }
          },
          name: {
            type: TYPES.string
          },
          ext: {
            type: TYPES.object
          }
        }
      }
    }
  },
  bcat: {
    type: TYPES.object,
    isArray: true,
    childType: TYPES.string
  },
  badv: {
    type: TYPES.object,
    isArray: true,
    childType: TYPES.string
  },
  source: {
    type: TYPES.object,
    children: {
      ext: {
        type: TYPES.object,
        isArray: false
      },
      schain: {
        type: TYPES.object,
        children: {
          complete: {
            type: TYPES.number
          },
          ver: {
            type: TYPES.string
          },
          nodes: {
            type: TYPES.object,
            isArray: true,
            childType: TYPES.object,
            required: ['asi', 'sid', 'hp'],
            children: {
              asi: {
                type: TYPES.string
              },
              sid: {
                type: TYPES.string
              },
              hp: {
                type: TYPES.number
              },
              rid: {
                type: TYPES.string
              },
              name: {
                type: TYPES.string
              },
              domain: {
                type: TYPES.string
              },
              ext: {
                type: TYPES.object
              }
            }
          },
          ext: {
            type: TYPES.object
          }
        },
        required: ['complete', 'nodes', 'ver']
      }
    }
  }
};

/***/ },

/***/ "./libraries/fpdUtils/pubcidOptout.js"
/*!********************************************!*\
  !*** ./libraries/fpdUtils/pubcidOptout.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasPubcidOptout: () => (/* binding */ hasPubcidOptout)
/* harmony export */ });
/* unused harmony export PUBCID_OPTOUT_KEY */
const PUBCID_OPTOUT_KEY = '_pubcid_optout';
function hasPubcidOptout(storage) {
  return Boolean(storage.cookiesAreEnabled() && storage.getCookie(PUBCID_OPTOUT_KEY) || storage.hasLocalStorage() && storage.getDataFromLocalStorage(PUBCID_OPTOUT_KEY));
}

/***/ },

/***/ "./libraries/fpdUtils/validateFpd.js"
/*!*******************************************!*\
  !*** ./libraries/fpdUtils/validateFpd.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fpdValidator: () => (/* binding */ fpdValidator)
/* harmony export */ });
/* harmony import */ var _ortbMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ortbMap.js */ "./libraries/fpdUtils/ortbMap.js");


/**
 * Utility functions the validator depends on. These are expected to be the
 * corresponding exports from `src/utils.js`, injected by the caller so that
 * this library stays decoupled from core.
 */

/**
 * Build an ortb2 first-party-data validator.
 * @param deps utility functions from `src/utils.js`
 * @param deps.logWarn warning logger
 * @param deps.isNumber number type guard
 * @param deps.isEmpty empty-value check
 * @param deps.deepAccess dotted-path accessor
 * @param deps.deepClone deep clone (used only when `filter` is false)
 * @param options validator options
 * @param options.filter whether invalid data is removed (controls warning wording and whether the input is modified)
 * @returns `validateFpd` and `filterArrayData` bound to the injected utilities
 */
function fpdValidator({
  logWarn,
  isNumber,
  isEmpty,
  deepAccess,
  deepClone
}, {
  filter = true
} = {}) {
  const label = filter ? 'Filtered' : 'Invalid';
  function isEmptyData(data) {
    let check = true;
    if (typeof data === 'object' && !isEmpty(data)) {
      check = false;
    } else if (typeof data !== 'object' && (isNumber(data) || data)) {
      check = false;
    }
    return check;
  }
  function getRequiredData(obj, required, parent, i) {
    let check = true;
    required.forEach(key => {
      if (!obj[key] || isEmptyData(obj[key])) {
        check = false;
        logWarn(`${label} ${parent}[] value at index ${i} in ortb2 data: missing required property ${key}`);
      }
    });
    return check;
  }
  function typeValidation(data, mapping) {
    let check = false;
    switch (mapping.type) {
      case 'string':
        if (typeof data === 'string') check = true;
        break;
      case 'number':
        if (typeof data === 'number' && isFinite(data)) check = true;
        break;
      case 'object':
        if (typeof data === 'object') {
          if (Array.isArray(data) && mapping.isArray || !Array.isArray(data) && !mapping.isArray) check = true;
        }
        break;
    }
    return check;
  }
  function filterArrayData(arr, child, path, parent, optout = false) {
    arr = arr.filter((index, i) => {
      const check = typeValidation(index, {
        type: child.type,
        isArray: child.isArray
      });
      if (check && Array.isArray(index) === Boolean(child.isArray)) {
        return true;
      }
      logWarn(`${label} ${parent}[] value at index ${i} in ortb2 data: expected type ${child.type}`);
      return false;
    }).filter((index, i) => {
      let requiredCheck = true;
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path);
      if (mapping && mapping.required) requiredCheck = getRequiredData(index, mapping.required, parent, i);
      if (requiredCheck) return true;
      return false;
    }).reduce((result, value, i) => {
      let typeBool = false;
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path);
      switch (child.type) {
        case 'string':
          result.push(value);
          typeBool = true;
          break;
        case 'object':
          if (mapping && mapping.children) {
            const validObject = validate(value, path + '.children.', parent + '.', optout);
            if (Object.keys(validObject).length) {
              const requiredCheck = getRequiredData(validObject, mapping.required, parent, i);
              if (requiredCheck) {
                result.push(validObject);
                typeBool = true;
              }
            }
          } else {
            result.push(value);
            typeBool = true;
          }
          break;
      }
      if (!typeBool) logWarn(`${label} ${parent}[] value at index ${i}  in ortb2 data: expected type ${child.type}`);
      return result;
    }, []);
    return arr;
  }
  function validate(fpd, path = '', parent = '', optout = false) {
    if (!fpd) return {};
    const validObject = Object.assign({}, Object.keys(fpd).filter(key => {
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path + key);
      if (!mapping || !mapping.invalid) return key;
      logWarn(`${label} ${parent}${key} property in ortb2 data: invalid property`);
      return false;
    }).filter(key => {
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path + key);
      const typeBool = mapping ? typeValidation(fpd[key], {
        type: mapping.type,
        isArray: mapping.isArray
      }) : true;
      if (typeBool || !mapping) return key;
      logWarn(`${label} ${parent}${key} property in ortb2 data: expected type ${mapping.isArray ? 'array' : mapping.type}`);
      return false;
    }).reduce((result, key) => {
      const mapping = deepAccess(_ortbMap_js__WEBPACK_IMPORTED_MODULE_0__.ORTB_MAP, path + key);
      if (mapping) {
        if (mapping.optoutApplies && optout) {
          logWarn(`${label} ${parent}${key} data: pubcid optout found`);
          return result;
        }
        const modified = mapping.type === 'object' && !mapping.isArray ? validate(fpd[key], path + key + '.children.', parent + key + '.', optout) : mapping.isArray && mapping.childType ? filterArrayData(fpd[key], {
          type: mapping.childType,
          isArray: mapping.childisArray
        }, path + key, parent + key, optout) : fpd[key];
        !isEmptyData(modified) ? result[key] = modified : logWarn(`${label} ${parent}${key} property in ortb2 data: empty data found`);
      } else {
        result[key] = fpd[key];
      }
      return result;
    }, {}));
    return validObject;
  }

  /**
   * Validate ortb2 first-party data.
   * When `filter` is true, returns a copy with invalid data removed.
   * When `filter` is false, the input is left untouched (validation runs against a
   * clone purely to emit warnings) and the original object is returned unchanged.
   * @throws when `filter` is false but no `deepClone` was provided, as the input
   * cannot be inspected without risking mutation.
   */
  function validateFpd(fpd, path = '', parent = '', optout = false) {
    if (!filter) {
      if (deepClone == null) {
        throw new Error('fpdValidator: a deepClone dependency is required when filter is false');
      }
      validate(deepClone(fpd), path, parent, optout);
      return fpd;
    }
    return validate(fpd, path, parent, optout);
  }
  return {
    validateFpd,
    filterArrayData
  };
}

/***/ }

}]);
//# sourceMappingURL=fpdUtils.js.map