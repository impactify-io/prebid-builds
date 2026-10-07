/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/devtoolsMcp/devtoolsMcp.js"
/*!********************************************!*\
  !*** ./modules/devtoolsMcp/devtoolsMcp.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPrebidDevTools: () => (/* binding */ getPrebidDevTools),
/* harmony export */   install: () => (/* binding */ install),
/* harmony export */   installPrebidDevTools: () => (/* binding */ installPrebidDevTools),
/* harmony export */   makeDevTools: () => (/* binding */ makeDevTools)
/* harmony export */ });
const TOOL_GROUP_NAME = 'Prebid.js DevTools';

/**
 * What this module reads from `src/auctionManager`. Spelled out rather than taken from the module
 * itself, which has no type declarations: naming it here would leave `DevToolsDeps` untypable for
 * anyone outside this repository.
 */

/**
 * Every runtime dependency this module needs is injected through this interface
 * so that the core logic performs no direct imports of Prebid internals. The
 * `./index.ts` entry point resolves these from `src` and calls `install`.
 */

/**
 * The runnable logic behind each tool, built from injected dependencies by
 * `makeDevTools`. `install` registers one of these per Prebid instance in the
 * `__prebidDevToolsMcp` array on the page (see `DevToolsWindow`) so the tools
 * can resolve it at run time rather than closing over a specific instance's
 * dependencies. Each handler returns rows keyed by field; the aggregation layer
 * tags every row with the source instance id.
 */

/**
 * A Prebid instance registered on the page: an identifier (its global variable
 * name, or a synthetic `unnamed-<n>` when the build defines no global) and the
 * handlers that read from it.
 */

/**
 * The single global this module adds to the page. The `__prebidDevToolsMcp`
 * array tracks the registered Prebid instances and doubles as the flag for
 * whether the discovery listener has been installed (its presence means yes).
 */

const UNNAMED_INSTANCE_PREFIX = 'unnamed-';
function compactObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}
function sanitize(value) {
  if (value == null || typeof value !== 'object') return value;
  try {
    return JSON.parse(JSON.stringify(value, (key, val) => typeof val === 'function' ? '[Function]' : val));
  } catch (e) {
    return String(value);
  }
}
function summarizeRequest(bidRequest, bidderRequest) {
  return compactObject({
    auctionId: bidderRequest.auctionId || bidRequest.auctionId,
    bidderRequestId: bidderRequest.bidderRequestId,
    bidderCode: bidderRequest.bidderCode || bidRequest.bidder,
    adUnitCode: bidRequest.adUnitCode,
    bidId: bidRequest.bidId,
    transactionId: bidRequest.transactionId,
    src: bidderRequest.src,
    start: bidderRequest.start,
    timeout: bidderRequest.timeout,
    mediaTypes: sanitize(bidRequest.mediaTypes),
    sizes: sanitize(bidRequest.sizes),
    floorData: sanitize(bidRequest.floorData),
    ortb2Imp: sanitize(bidRequest.ortb2Imp)
  });
}
function tool(name, description, inputSchema, execute) {
  return {
    name,
    description,
    inputSchema,
    execute
  };
}

/**
 * Build the DevTools MCP handlers from injected dependencies. All helpers close
 * over `deps`, so there are no direct imports of Prebid internals.
 */
function makeDevTools(deps) {
  const {
    auctionManager,
    getGlobal,
    getBufferedTTL,
    getEffectiveMinBidCacheTTL,
    isBidUsable
  } = deps;
  function getAuctions() {
    return auctionManager.getAuctions().map(auction => auction.getProperties());
  }
  function summarizeBid(bid) {
    const effectiveMinCacheTTL = getEffectiveMinBidCacheTTL(bid);
    const bufferedTTL = typeof bid.ttl === 'number' ? getBufferedTTL(bid) : undefined;
    const responseTimestamp = bid.responseTimestamp;
    const expiresAt = typeof bufferedTTL === 'number' && typeof responseTimestamp === 'number' ? responseTimestamp + bufferedTTL * 1000 : undefined;
    const cacheExpiresAt = typeof effectiveMinCacheTTL === 'number' && typeof responseTimestamp === 'number' ? responseTimestamp + Math.max(effectiveMinCacheTTL, bid.ttl || 0) * 1000 : undefined;
    return compactObject({
      auctionId: bid.auctionId,
      adUnitCode: bid.adUnitCode,
      bidder: bid.bidder || bid.bidderCode,
      adapterCode: bid.adapterCode,
      requestId: bid.requestId,
      cpm: bid.cpm,
      currency: bid.currency,
      mediaType: bid.mediaType,
      source: bid.source,
      status: bid.status,
      width: bid.width,
      height: bid.height,
      ttl: bid.ttl,
      ttlBuffer: bid.ttlBuffer,
      bufferedTTL,
      effectiveMinCacheTTL,
      responseTimestamp,
      expiresAt,
      cacheExpiresAt,
      timeToExpire: expiresAt == null ? undefined : expiresAt - Date.now(),
      timeToCacheExpire: cacheExpiresAt == null ? undefined : cacheExpiresAt - Date.now(),
      usableForTargeting: isBidUsable(bid),
      floorData: sanitize(bid.floorData),
      dealId: bid.dealId,
      metrics: bid.metrics && bid.metrics.getMetrics ? bid.metrics.getMetrics() : undefined,
      rejectionReason: bid.rejectionReason
    });
  }
  function auctionSnapshot({
    auctionId
  } = {}) {
    auctionId = typeof auctionId === 'string' ? auctionId : undefined;
    return getAuctions().filter(auction => auctionId == null || auction.auctionId === auctionId).map(auction => {
      const requests = auction.bidderRequests.flatMap(bidderRequest => bidderRequest.bids.map(bidRequest => summarizeRequest(bidRequest, bidderRequest)));
      const bidsReceived = auction.bidsReceived.map(summarizeBid);
      const noBids = auction.noBids.map(bid => summarizeRequest(bid, auction.bidderRequests.find(br => br.bidderRequestId === bid.bidderRequestId) || {}));
      const bidsRejected = auction.bidsRejected.map(summarizeBid);
      const winningBids = auction.winningBids.map(summarizeBid);
      return compactObject({
        auctionId: auction.auctionId,
        status: auction.auctionStatus,
        startedAt: auction.timestamp,
        endedAt: auction.auctionEnd,
        timeout: auction.timeout,
        duration: auction.auctionEnd != null && auction.timestamp != null ? auction.auctionEnd - auction.timestamp : undefined,
        labels: auction.labels,
        adUnitCodes: auction.adUnitCodes,
        counts: {
          adUnits: auction.adUnits.length,
          bidderRequests: auction.bidderRequests.length,
          bidRequests: requests.length,
          bidsReceived: bidsReceived.length,
          noBids: noBids.length,
          bidsRejected: bidsRejected.length,
          winningBids: winningBids.length,
          seatNonBids: auction.seatNonBids.length
        },
        eligibleBidRequests: requests,
        bidsReceived,
        noBids,
        bidsRejected,
        winningBids,
        seatNonBids: sanitize(auction.seatNonBids),
        metrics: auction.metrics && auction.metrics.getMetrics ? auction.metrics.getMetrics() : undefined
      });
    });
  }
  function eventSnapshot({
    auctionId,
    eventType
  } = {}) {
    auctionId = typeof auctionId === 'string' ? auctionId : undefined;
    eventType = typeof eventType === 'string' ? eventType : undefined;
    let records = getGlobal().getEvents();
    if (auctionId != null) records = records.filter(record => record.args?.auctionId === auctionId || record.id === auctionId);
    if (eventType != null) records = records.filter(record => record.eventType === eventType);
    // `limit` is intentionally not applied here; the aggregation layer applies
    // it across the combined history of all instances.
    return records.map(record => compactObject({
      eventType: record.eventType,
      id: record.id,
      elapsedTime: record.elapsedTime,
      sequence: record.sequence,
      args: sanitize(record.args)
    }));
  }
  function summarySnapshot() {
    const pbjs = getGlobal();
    const auctions = auctionSnapshot();
    const events = pbjs.getEvents();
    const bids = auctions.flatMap(auction => auction.bidsReceived);
    const noBids = auctions.flatMap(auction => auction.noBids);
    return {
      version: pbjs.version,
      installedModules: pbjs.installedModules.slice(),
      config: sanitize(pbjs.getConfig()),
      counts: {
        auctions: auctions.length,
        events: events.length,
        adUnits: auctionManager.getAdUnitCodes().length,
        bidRequests: auctions.reduce((sum, auction) => sum + auction.counts.bidRequests, 0),
        bidsReceived: bids.length,
        winningBids: auctionManager.getAllWinningBids().length,
        noBids: auctionManager.getNoBids().length
      },
      byBidder: auctions.flatMap(auction => auction.winningBids).reduce((acc, bid) => {
        const bidder = bid.bidder || 'unknown';
        acc[bidder] = acc[bidder] || {
          bids: 0,
          wins: 0,
          noBids: 0
        };
        acc[bidder].wins++;
        return acc;
      }, noBids.reduce((acc, bid) => {
        const bidder = bid.bidderCode || 'unknown';
        acc[bidder] = acc[bidder] || {
          bids: 0,
          wins: 0,
          noBids: 0
        };
        acc[bidder].noBids++;
        return acc;
      }, bids.reduce((acc, bid) => {
        const bidder = bid.bidder || 'unknown';
        acc[bidder] = acc[bidder] || {
          bids: 0,
          wins: 0,
          noBids: 0
        };
        acc[bidder].bids++;
        return acc;
      }, {}))),
      latestAuction: auctions[auctions.length - 1]
    };
  }
  return {
    summary: summarySnapshot,
    auctions: auctionSnapshot,
    events: eventSnapshot
  };
}

/**
 * Build the tool group. Each tool's `execute` is a thin indirection: it looks
 * up the handlers published on the page by `install` and delegates to them, so
 * the registered tools are not bound to any single Prebid instance.
 */
/**
 * Aggregations across every registered Prebid instance. Each is a pure function
 * of the registration list so the tool wiring in `getPrebidDevTools` stays
 * terse. All accept an optional `instance` filter and tag every returned row
 * with the source instance id.
 */

/** Select the registrations to read from, honouring an optional `instance` filter. */
function selectInstances(registrations, instance) {
  const id = typeof instance === 'string' ? instance : undefined;
  return id == null ? registrations : registrations.filter(registration => registration.instance === id);
}

/** One summary per instance (simple concatenation), each tagged with its instance. */
function aggregateSummary(registrations, {
  instance
} = {}) {
  return selectInstances(registrations, instance).map(({
    instance: id,
    handlers
  }) => ({
    instance: id,
    ...handlers.summary()
  }));
}

/** Flattened list of auction snapshots across all instances, each tagged with its instance. */
function aggregateAuctions(registrations, {
  instance,
  ...filters
} = {}) {
  return selectInstances(registrations, instance).flatMap(({
    instance: id,
    handlers
  }) => handlers.auctions(filters).map(auction => ({
    instance: id,
    ...auction
  })));
}

/**
 * The `limit` most recent events across the selected instances, ordered
 * chronologically by `elapsedTime` and each tagged with its instance. The limit
 * is applied to the combined history rather than to each instance individually.
 */
function aggregateEvents(registrations, {
  instance,
  limit,
  ...filters
} = {}) {
  const max = typeof limit === 'number' ? Math.max(0, Math.floor(limit)) : 100;
  if (max === 0) return [];
  return selectInstances(registrations, instance).flatMap(({
    instance: id,
    handlers
  }) => handlers.events(filters).map(event => ({
    instance: id,
    ...event
  }))).sort((a, b) => (a.elapsedTime ?? 0) - (b.elapsedTime ?? 0)).slice(-max);
}
const INSTANCE_FILTER = {
  type: 'string',
  description: 'Optional Prebid instance id to filter to. Matches the `instance` field present on every result; when omitted, all instances are included.'
};
function getPrebidDevTools(win = window) {
  const registrations = () => win.__prebidDevToolsMcp ?? [];
  return {
    name: TOOL_GROUP_NAME,
    description: 'Inspect Prebid.js auctions, bid eligibility, TTL, floors, event timing, modules, and runtime configuration.',
    tools: [tool('summary', 'Summarize each Prebid.js instance on the page: runtime, latest auction, installed modules, cache TTL settings, and bidder win/bid counts. Returns one summary per instance, tagged with its instance id.', {
      type: 'object',
      properties: {
        instance: INSTANCE_FILTER
      },
      additionalProperties: false
    }, args => aggregateSummary(registrations(), args)), tool('auctions', 'Return auction-level detail across all Prebid.js instances, including eligible requests, received bids, no-bids, rejected bids, winning bids, TTL/cache expiry, floors, and metrics. Each row is tagged with its instance id.', {
      type: 'object',
      properties: {
        instance: INSTANCE_FILTER,
        auctionId: {
          type: 'string',
          description: 'Optional auction id to inspect. When omitted, all tracked auctions are returned.'
        }
      },
      additionalProperties: false
    }, args => aggregateAuctions(registrations(), args)), tool('events', 'Return Prebid event history with event timing across all Prebid.js instances. Optionally filter by auctionId or eventType and limit the number of records; the limit selects the most recent records across the combined history. Each row is tagged with its instance id.', {
      type: 'object',
      properties: {
        instance: INSTANCE_FILTER,
        auctionId: {
          type: 'string',
          description: 'Optional auction id filter.'
        },
        eventType: {
          type: 'string',
          description: 'Optional Prebid event type filter, such as auctionInit, auctionEnd, bidResponse, or bidWon.'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of the most recent event records to return from the combined history. Use 0 to return no records.',
          default: 100,
          minimum: 0
        }
      },
      additionalProperties: false
    }, args => aggregateEvents(registrations(), args))]
  };
}
function installPrebidDevTools(win = window) {
  // The `__prebidDevToolsMcp` array both tracks registered Prebid instances and
  // marks that the discovery listener has been installed (its presence means
  // yes). The first instance to load creates it and registers the single
  // listener; later instances are no-ops here. There is a single, un-namespaced
  // set of tools regardless of how many Prebid instances are present.
  if (win.__prebidDevToolsMcp != null) return;
  win.__prebidDevToolsMcp = [];
  win.addEventListener('devtoolstooldiscovery', event => {
    const discoveryEvent = event;
    if (discoveryEvent && typeof discoveryEvent.respondWith === 'function') {
      discoveryEvent.respondWith(getPrebidDevTools(win));
    }
  });
}

/**
 * Register this instance's handlers on the page and ensure the discovery
 * listener is installed. Every Prebid instance that loads devtoolsMcp appends a
 * registration to the `__prebidDevToolsMcp` array, and the tools aggregate
 * results across all of them. The instance id is the Prebid global variable
 * name when the build defines a global, otherwise a synthetic `unnamed-<n>`.
 */
function install(deps, win = window) {
  installPrebidDevTools(win);
  const registrations = win.__prebidDevToolsMcp;
  const unnamedCount = registrations.filter(registration => registration.instance.startsWith(UNNAMED_INSTANCE_PREFIX)).length;
  const instance = deps.shouldDefineGlobal() ? deps.getGlobalVarName() : `${UNNAMED_INSTANCE_PREFIX}${unnamedCount}`;
  registrations.push({
    instance,
    handlers: makeDevTools(deps)
  });
  return registrations;
}//# sourceMappingURL=devtoolsMcp.js.map


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./modules/devtoolsMcp/standalone.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _devtoolsMcp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./devtoolsMcp.js */ "./modules/devtoolsMcp/devtoolsMcp.js");

window._pbjsGlobals.forEach(name => {
  if (window[name] && window[name]._installDevtoolsMcp === true) {
    window[name]._installDevtoolsMcp = _devtoolsMcp_js__WEBPACK_IMPORTED_MODULE_0__.install;
  }
});//# sourceMappingURL=standalone.js.map

})();

/******/ })()
;
//# sourceMappingURL=devtoolsMcp-standalone.js.map