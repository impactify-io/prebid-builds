"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["metadata"],{

/***/ "./libraries/metadata/metadata.js":
/*!****************************************!*\
  !*** ./libraries/metadata/metadata.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   metadata: () => (/* binding */ metadata)
/* harmony export */ });
/* unused harmony export metadataRepository */
function metadataRepository() {
  const components = {};
  const disclosures = {};
  const componentsByModule = {};
  const repo = {
    register(moduleName, data) {
      if (Array.isArray(data.components)) {
        if (!componentsByModule.hasOwnProperty(moduleName)) {
          componentsByModule[moduleName] = [];
        }
        data.components.forEach(component => {
          if (!components.hasOwnProperty(component.componentType)) {
            components[component.componentType] = {};
          }
          components[component.componentType][component.componentName] = component;
          componentsByModule[moduleName].push([component.componentType, component.componentName]);
        });
      }
      if (data.disclosures) {
        Object.assign(disclosures, data.disclosures);
      }
    },
    getMetadata(componentType, componentName) {
      var _components$component;
      return components === null || components === void 0 || (_components$component = components[componentType]) === null || _components$component === void 0 ? void 0 : _components$component[componentName];
    },
    getStorageDisclosure(disclosureURL) {
      return disclosures === null || disclosures === void 0 ? void 0 : disclosures[disclosureURL];
    },
    getModuleMetadata(moduleName) {
      var _componentsByModule$m;
      const components = ((_componentsByModule$m = componentsByModule[moduleName]) !== null && _componentsByModule$m !== void 0 ? _componentsByModule$m : []).map(_ref => {
        let [componentType, componentName] = _ref;
        return repo.getMetadata(componentType, componentName);
      });
      if (components.length === 0) return null;
      const disclosures = Object.fromEntries(components.filter(_ref2 => {
        let {
          disclosureURL
        } = _ref2;
        return disclosureURL != null;
      }).map(_ref3 => {
        let {
          disclosureURL
        } = _ref3;
        return [disclosureURL, repo.getStorageDisclosure(disclosureURL)];
      }));
      return {
        disclosures,
        components
      };
    }
  };
  return repo;
}
const metadata = metadataRepository();


/***/ })

}]);
//# sourceMappingURL=metadata.js.map