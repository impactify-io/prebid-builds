"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["metadata"],{

/***/ "./libraries/metadata/metadata.js"
/*!****************************************!*\
  !*** ./libraries/metadata/metadata.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
      return components?.[componentType]?.[componentName];
    },
    getStorageDisclosure(disclosureURL) {
      return disclosures?.[disclosureURL];
    },
    getModuleMetadata(moduleName) {
      const components = (componentsByModule[moduleName] ?? []).map(([componentType, componentName]) => repo.getMetadata(componentType, componentName));
      if (components.length === 0) return null;
      const disclosures = Object.fromEntries(components.filter(({
        disclosureURL
      }) => disclosureURL != null).map(({
        disclosureURL
      }) => [disclosureURL, repo.getStorageDisclosure(disclosureURL)]));
      return {
        disclosures,
        components
      };
    }
  };
  return repo;
}
const metadata = metadataRepository();

/***/ }

}]);
//# sourceMappingURL=metadata.js.map