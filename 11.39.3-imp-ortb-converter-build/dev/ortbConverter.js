"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["ortbConverter"],{

/***/ "./libraries/ortbConverter/converter.js"
/*!**********************************************!*\
  !*** ./libraries/ortbConverter/converter.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ortbConverter: () => (/* binding */ ortbConverter)
/* harmony export */ });
/* unused harmony export defaultProcessors */
/* harmony import */ var _lib_composer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/composer.js */ "./libraries/ortbConverter/lib/composer.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _processors_default_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processors/default.js */ "./libraries/ortbConverter/processors/default.js");
/* harmony import */ var _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/pbjsORTB.js */ "./src/pbjsORTB.js");
/* harmony import */ var _lib_mergeProcessors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/mergeProcessors.js */ "./libraries/ortbConverter/lib/mergeProcessors.js");





function ortbConverter({
  context: defaultContext = {},
  processors = defaultProcessors,
  overrides = {},
  imp,
  request,
  bidResponse,
  response
} = {}) {
  const REQ_CTX = new WeakMap();
  function builder(slot, wrapperFn, builderFn, errorHandler) {
    let build;
    return function (...args) {
      if (build == null) {
        build = function () {
          let delegate = builderFn.bind(this, (0,_lib_composer_js__WEBPACK_IMPORTED_MODULE_0__.compose)(processors()[slot] || {}, overrides[slot] || {}));
          if (wrapperFn) {
            delegate = wrapperFn.bind(this, delegate);
          }
          return function (...args) {
            try {
              return delegate.apply(this, args);
            } catch (e) {
              errorHandler.call(this, e, ...args);
            }
          };
        }();
      }
      return build.apply(this, args);
    };
  }
  const buildImp = builder(_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.IMP, imp, function (process, bidRequest, context) {
    const imp = {};
    process(imp, bidRequest, context);
    return imp;
  }, function (error, bidRequest, context) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error while converting bidRequest to ORTB imp; request skipped.', {
      error,
      bidRequest,
      context
    });
  });
  const buildRequest = builder(_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.REQUEST, request, function (process, imps, bidderRequest, context) {
    const ortbRequest = {
      imp: imps
    };
    process(ortbRequest, bidderRequest, context);
    return ortbRequest;
  }, function (error, imps, bidderRequest, context) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error while converting to ORTB request', {
      error,
      imps,
      bidderRequest,
      context
    });
    throw error;
  });
  const buildBidResponse = builder(_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.BID_RESPONSE, bidResponse, function (process, bid, context) {
    const bidResponse = {};
    process(bidResponse, bid, context);
    return bidResponse;
  }, function (error, bid, context) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error while converting ORTB seatbid.bid to bidResponse; bid skipped.', {
      error,
      bid,
      context
    });
  });
  const buildResponse = builder(_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.RESPONSE, response, function (process, bidResponses, ortbResponse, context) {
    const response = {
      bids: bidResponses
    };
    process(response, ortbResponse, context);
    return response;
  }, function (error, bidResponses, ortbResponse, context) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error while converting from ORTB response', {
      error,
      bidResponses,
      ortbResponse,
      context
    });
    throw error;
  });
  return {
    toORTB({
      bidderRequest,
      bidRequests,
      context = {}
    }) {
      bidRequests = bidRequests || bidderRequest.bids;
      const ctx = {
        req: Object.assign({
          bidRequests
        }, defaultContext, context),
        imp: {}
      };
      ctx.req.impContext = ctx.imp;
      const imps = bidRequests.map(bidRequest => {
        const impContext = Object.assign({
          bidderRequest,
          reqContext: ctx.req
        }, defaultContext, context);
        const result = buildImp(bidRequest, impContext);
        if (result != null) {
          if (result.hasOwnProperty('id')) {
            Object.assign(impContext, {
              bidRequest,
              imp: result
            });
            ctx.imp[result.id] = impContext;
            return result;
          }
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Converted ORTB imp does not specify an id, ignoring bid request', bidRequest, result);
        }
        return undefined;
      }).filter(Boolean);
      const request = buildRequest(imps, bidderRequest, ctx.req);
      ctx.req.bidderRequest = bidderRequest;
      if (request != null) {
        REQ_CTX.set(request, ctx);
      }
      return request;
    },
    fromORTB({
      request,
      response
    }) {
      const ctx = REQ_CTX.get(request);
      if (ctx == null) {
        throw new Error('ortbRequest passed to `fromORTB` must be the same object returned by `toORTB`');
      }
      function augmentContext(ctx, extraParams = {}) {
        return Object.assign(ctx, {
          ortbRequest: request
        }, extraParams);
      }
      const impsById = Object.fromEntries((request.imp || []).map(imp => [imp.id, imp]));
      const bidResponses = (response?.seatbid || []).flatMap(seatbid => (seatbid.bid || []).map(bid => {
        if (impsById.hasOwnProperty(bid.impid) && ctx.imp.hasOwnProperty(bid.impid)) {
          return buildBidResponse(bid, augmentContext(ctx.imp[bid.impid], {
            imp: impsById[bid.impid],
            seatbid,
            ortbResponse: response
          }));
        }
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('ORTB response seatbid[].bid[].impid does not match any imp in request; ignoring bid', bid);
        return undefined;
      })).filter(Boolean);
      return buildResponse(bidResponses, response, augmentContext(ctx.req));
    }
  };
}
const defaultProcessors = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.memoize)(() => (0,_lib_mergeProcessors_js__WEBPACK_IMPORTED_MODULE_4__.mergeProcessors)(_processors_default_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_PROCESSORS, (0,_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.getProcessors)(_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT)));

/***/ },

/***/ "./libraries/ortbConverter/lib/composer.js"
/*!*************************************************!*\
  !*** ./libraries/ortbConverter/lib/composer.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compose: () => (/* binding */ compose)
/* harmony export */ });
const SORTED = new WeakMap();

/**
 * @typedef {Object} Component
 * A component function, that can be composed with other compatible functions into one.
 * Compatible functions take the same arguments; return values are ignored.
 *
 * @property {function} fn the component function;
 * @property {number} priority determines the order in which this function will run when composed with others.
 */

/**
 *
 * @param {Object.<string, Component>} components - An object where keys are component names and values are components to compose.
 * @param {Object.<string, (function|boolean)>} overrides - A map from component names to functions that should override those components.
 * Override functions are replacements, except that they get the original function they are overriding as their first argument. If the override
 * is `false`, the component is disabled.
 *
 * @return {function} - A function that will run all components in order of priority, with functions from `overrides` taking
 * precedence over components that match names.
 */
function compose(components, overrides = {}) {
  if (!SORTED.has(components)) {
    const sorted = Object.entries(components);
    sorted.sort((a, b) => {
      a = a[1].priority || 0;
      b = b[1].priority || 0;
      return a === b ? 0 : a > b ? -1 : 1;
    });
    SORTED.set(components, sorted.map(([name, cmp]) => [name, cmp.fn]));
  }
  const fns = SORTED.get(components).filter(([name]) => !overrides.hasOwnProperty(name) || overrides[name]).map(function ([name, fn]) {
    return overrides.hasOwnProperty(name) ? overrides[name].bind(this, fn) : fn;
  });
  return function () {
    const args = Array.from(arguments);
    fns.forEach(fn => {
      fn.apply(this, args);
    });
  };
}

/***/ },

/***/ "./libraries/ortbConverter/lib/mergeProcessors.js"
/*!********************************************************!*\
  !*** ./libraries/ortbConverter/lib/mergeProcessors.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeProcessors: () => (/* binding */ mergeProcessors)
/* harmony export */ });
/* harmony import */ var _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/pbjsORTB.js */ "./src/pbjsORTB.js");

function mergeProcessors(...processors) {
  const left = processors.shift();
  const right = processors.length > 1 ? mergeProcessors(...processors) : processors[0];
  return Object.fromEntries(_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_0__.PROCESSOR_TYPES.map(type => [type, Object.assign({}, left[type], right[type])]));
}

/***/ },

/***/ "./libraries/ortbConverter/processors/audio.js"
/*!*****************************************************!*\
  !*** ./libraries/ortbConverter/processors/audio.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillAudioImp: () => (/* binding */ fillAudioImp),
/* harmony export */   fillAudioResponse: () => (/* binding */ fillAudioResponse)
/* harmony export */ });
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_audio_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/audio.js */ "./src/audio.js");



function fillAudioImp(imp, bidRequest, context) {
  if (context.mediaType && context.mediaType !== _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.AUDIO) return;
  const audioParams = bidRequest?.mediaTypes?.audio;
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(audioParams)) {
    const audio = Object.fromEntries(
    // Parameters that share the same name & semantics between pbjs adUnits and imp.audio
    Object.entries(audioParams).filter(([name]) => _src_audio_js__WEBPACK_IMPORTED_MODULE_2__.ORTB_AUDIO_PARAMS.has(name)));
    imp.audio = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)(audio, imp.audio);
  }
}
function fillAudioResponse(bidResponse, seatbid) {
  if (bidResponse.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.AUDIO) {
    if (seatbid.adm) {
      bidResponse.vastXml = seatbid.adm;
    }
    if (seatbid.nurl) {
      bidResponse.vastUrl = seatbid.nurl;
    }
  }
}

/***/ },

/***/ "./libraries/ortbConverter/processors/banner.js"
/*!******************************************************!*\
  !*** ./libraries/ortbConverter/processors/banner.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bannerResponseProcessor: () => (/* binding */ bannerResponseProcessor),
/* harmony export */   fillBannerImp: () => (/* binding */ fillBannerImp)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/mediaTypes.js */ "./src/mediaTypes.js");



/**
 * fill in a request `imp` with banner parameters from `bidRequest`.
 */
function fillBannerImp(imp, bidRequest, context) {
  if (context.mediaType && context.mediaType !== _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER) return;
  const bannerParams = bidRequest?.mediaTypes?.banner;
  if (bannerParams) {
    const banner = {
      topframe: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.inIframe)() === true ? 0 : 1
    };
    if (bannerParams.sizes && bidRequest.ortb2Imp?.banner?.format == null) {
      banner.format = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.sizesToSizeTuples)(bannerParams.sizes).map(_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.sizeTupleToRtbSize);
    }
    if (bannerParams.hasOwnProperty('pos')) {
      banner.pos = bannerParams.pos;
    }
    imp.banner = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(banner, imp.banner);
  }
}
function bannerResponseProcessor({
  createPixel = url => (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.createTrackPixelHtml)(decodeURIComponent(url), _src_utils_js__WEBPACK_IMPORTED_MODULE_0__.encodeMacroURI)
} = {}) {
  return function fillBannerResponse(bidResponse, bid) {
    if (bidResponse.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER) {
      if (bid.adm && bid.nurl) {
        bidResponse.ad = createPixel(bid.nurl) + bid.adm;
      } else if (bid.adm) {
        bidResponse.ad = bid.adm;
      } else if (bid.nurl) {
        bidResponse.adUrl = bid.nurl;
      }
    }
  };
}

/***/ },

/***/ "./libraries/ortbConverter/processors/default.js"
/*!*******************************************************!*\
  !*** ./libraries/ortbConverter/processors/default.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PROCESSORS: () => (/* binding */ DEFAULT_PROCESSORS)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _banner_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./banner.js */ "./libraries/ortbConverter/processors/banner.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./video.js */ "./libraries/ortbConverter/processors/video.js");
/* harmony import */ var _mediaType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mediaType.js */ "./libraries/ortbConverter/processors/mediaType.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./native.js */ "./libraries/ortbConverter/processors/native.js");
/* harmony import */ var _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../src/pbjsORTB.js */ "./src/pbjsORTB.js");
/* harmony import */ var _src_fpd_oneClient_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../src/fpd/oneClient.js */ "./src/fpd/oneClient.js");
/* harmony import */ var _audio_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./audio.js */ "./libraries/ortbConverter/processors/audio.js");








const DEFAULT_PROCESSORS = {
  [_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.REQUEST]: {
    fpd: {
      // sets initial request to bidderRequest.ortb2
      priority: 99,
      fn(ortbRequest, bidderRequest) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(ortbRequest, bidderRequest.ortb2);
      }
    },
    onlyOneClient: {
      // make sure only one of 'dooh', 'app', 'site' is set in request
      priority: -99,
      fn: (0,_src_fpd_oneClient_js__WEBPACK_IMPORTED_MODULE_6__.clientSectionChecker)('ORTB request')
    },
    props: {
      // sets request properties id, tmax, test
      fn(ortbRequest, bidderRequest) {
        Object.assign(ortbRequest, {
          id: ortbRequest.id || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateUUID)(),
          test: ortbRequest.test || 0
        });
        const timeout = parseInt(bidderRequest.timeout, 10);
        if (!isNaN(timeout)) {
          ortbRequest.tmax = timeout;
        }
      }
    }
  },
  [_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.IMP]: {
    fpd: {
      // sets initial imp to bidRequest.ortb2Imp
      priority: 99,
      fn(imp, bidRequest) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(imp, bidRequest.ortb2Imp);
      }
    },
    id: {
      // sets imp.id
      fn(imp, bidRequest) {
        imp.id = bidRequest.bidId;
      }
    },
    banner: {
      // populates imp.banner
      fn: _banner_js__WEBPACK_IMPORTED_MODULE_1__.fillBannerImp
    },
    secure: {
      // should set imp.secure to 1 unless publisher has set it
      fn(imp, bidRequest) {
        imp.secure = imp.secure ?? 1;
      }
    }
  },
  [_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.BID_RESPONSE]: {
    mediaType: {
      // sets bidResponse.mediaType from context.mediaType, falling back to seatbid.bid[].mtype
      priority: 99,
      fn: _mediaType_js__WEBPACK_IMPORTED_MODULE_3__.setResponseMediaType
    },
    banner: {
      // sets banner response attributes if bidResponse.mediaType === BANNER
      fn: (0,_banner_js__WEBPACK_IMPORTED_MODULE_1__.bannerResponseProcessor)()
    },
    props: {
      // sets base bidResponse properties common to all types of bids
      fn(bidResponse, bid, context) {
        Object.entries({
          requestId: context.bidRequest?.bidId,
          seatBidId: bid.id,
          cpm: bid.price,
          currency: context.ortbResponse.cur || context.currency,
          width: bid.w,
          height: bid.h,
          wratio: bid.wratio,
          hratio: bid.hratio,
          dealId: bid.dealid,
          creative_id: bid.crid,
          creativeId: bid.crid,
          burl: bid.burl,
          ttl: bid.exp || context.ttl,
          netRevenue: context.netRevenue,
          duration: bid.dur
        }).filter(([k, v]) => typeof v !== 'undefined').forEach(([k, v]) => {
          bidResponse[k] = v;
        });
        if (!bidResponse.meta) {
          bidResponse.meta = {};
        }
        if (bid.adomain) {
          bidResponse.meta.advertiserDomains = bid.adomain;
        }
        if (bid.ext?.dsa) {
          bidResponse.meta.dsa = bid.ext.dsa;
        }
        if (bid.cat) {
          bidResponse.meta.primaryCatId = bid.cat[0];
          bidResponse.meta.secondaryCatIds = bid.cat.slice(1);
        }
        if (bid.attr) {
          bidResponse.meta.attr = bid.attr;
        }
        if (bid.ext?.eventtrackers) {
          bidResponse.eventtrackers = (bidResponse.eventtrackers ?? []).concat(bid.ext.eventtrackers);
        }
        if (bid.cattax) {
          bidResponse.meta.cattax = bid.cattax;
        }
      }
    }
  }
};
if (true) {
  DEFAULT_PROCESSORS[_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.IMP].native = {
    // populates imp.native
    fn: _native_js__WEBPACK_IMPORTED_MODULE_4__.fillNativeImp
  };
  DEFAULT_PROCESSORS[_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.BID_RESPONSE].native = {
    // populates bidResponse.native if bidResponse.mediaType === NATIVE
    fn: _native_js__WEBPACK_IMPORTED_MODULE_4__.fillNativeResponse
  };
}
if (true) {
  DEFAULT_PROCESSORS[_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.IMP].video = {
    // populates imp.video
    fn: _video_js__WEBPACK_IMPORTED_MODULE_2__.fillVideoImp
  };
  DEFAULT_PROCESSORS[_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.BID_RESPONSE].video = {
    // sets video response attributes if bidResponse.mediaType === VIDEO
    fn: _video_js__WEBPACK_IMPORTED_MODULE_2__.fillVideoResponse
  };
}
if (true) {
  DEFAULT_PROCESSORS[_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.IMP].audio = {
    // populates imp.audio
    fn: _audio_js__WEBPACK_IMPORTED_MODULE_7__.fillAudioImp
  };
  DEFAULT_PROCESSORS[_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_5__.BID_RESPONSE].audio = {
    // sets video response attributes if bidResponse.mediaType === AUDIO
    fn: _audio_js__WEBPACK_IMPORTED_MODULE_7__.fillAudioResponse
  };
}

/***/ },

/***/ "./libraries/ortbConverter/processors/mediaType.js"
/*!*********************************************************!*\
  !*** ./libraries/ortbConverter/processors/mediaType.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setResponseMediaType: () => (/* binding */ setResponseMediaType)
/* harmony export */ });
/* unused harmony export ORTB_MTYPES */
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/mediaTypes.js */ "./src/mediaTypes.js");

const ORTB_MTYPES = {
  1: _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.BANNER,
  2: _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.VIDEO,
  4: _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_0__.NATIVE
};

/**
 * Sets response mediaType, using ORTB 2.6 `seatbid.bid[].mtype`.
 *
 * Note that this will throw away bids if there is no `mtype` in the response.
 */
function setResponseMediaType(bidResponse, bid, context) {
  if (bidResponse.mediaType) return;
  const mediaType = context.mediaType;
  if (!mediaType && !ORTB_MTYPES.hasOwnProperty(bid.mtype)) {
    throw new Error('Cannot determine mediaType for response');
  }
  bidResponse.mediaType = mediaType || ORTB_MTYPES[bid.mtype];
}

/***/ },

/***/ "./libraries/ortbConverter/processors/native.js"
/*!******************************************************!*\
  !*** ./libraries/ortbConverter/processors/native.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillNativeImp: () => (/* binding */ fillNativeImp),
/* harmony export */   fillNativeResponse: () => (/* binding */ fillNativeResponse)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/utils.js */ "./src/utils/objects.js");
/* harmony import */ var _src_utils_untrustedJson_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/utils/untrustedJson.js */ "./src/utils/untrustedJson.js");
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../src/mediaTypes.js */ "./src/mediaTypes.js");



function fillNativeImp(imp, bidRequest, context) {
  if (context.mediaType && context.mediaType !== _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE) return;
  let nativeReq = bidRequest.nativeOrtbRequest;
  if (nativeReq) {
    nativeReq = Object.assign({}, context.nativeRequest, nativeReq);
    if (nativeReq.assets?.length) {
      imp.native = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({}, {
        request: JSON.stringify(nativeReq),
        ver: nativeReq.ver
      }, imp.native);
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('mediaTypes.native is set, but no assets were specified. Native request skipped.', bidRequest);
    }
  }
}
function fillNativeResponse(bidResponse, bid) {
  if (bidResponse.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__.NATIVE) {
    let ortb;
    if (typeof bid.adm === 'string') {
      // `adm` travels through the response body as a string, so the guard applied when that body
      // was parsed could not see inside it. Parsing it produces a second object from the same
      // untrusted source, which an adapter or a `bidResponse` override may merge.
      ortb = (0,_src_utils_untrustedJson_js__WEBPACK_IMPORTED_MODULE_2__.parseUntrustedJSON)(bid.adm);
    } else {
      ortb = bid.adm;
    }
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(ortb) && Array.isArray(ortb.assets)) {
      bidResponse.native = {
        ortb
      };
    } else {
      throw new Error('ORTB native response contained no assets');
    }
  }
}

/***/ },

/***/ "./libraries/ortbConverter/processors/video.js"
/*!*****************************************************!*\
  !*** ./libraries/ortbConverter/processors/video.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillVideoImp: () => (/* binding */ fillVideoImp),
/* harmony export */   fillVideoResponse: () => (/* binding */ fillVideoResponse)
/* harmony export */ });
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _src_video_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/video.js */ "./src/video.js");



function fillVideoImp(imp, bidRequest, context) {
  if (context.mediaType && context.mediaType !== _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO) return;
  const videoParams = bidRequest?.mediaTypes?.video;
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(videoParams)) {
    const video = Object.fromEntries(
    // Parameters that share the same name & semantics between pbjs adUnits and imp.video
    Object.entries(videoParams).filter(([name]) => _src_video_js__WEBPACK_IMPORTED_MODULE_2__.ORTB_VIDEO_PARAMS.has(name)));
    if (videoParams.playerSize) {
      const format = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.sizesToSizeTuples)(videoParams.playerSize).map(_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.sizeTupleToRtbSize);
      if (format.length > 1) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)('video request specifies more than one playerSize; all but the first will be ignored');
      }
      Object.assign(video, format[0]);
    }
    imp.video = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(video, imp.video);
  }
}
function fillVideoResponse(bidResponse, seatbid, context) {
  if (bidResponse.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO) {
    if (context?.imp?.video?.w && context?.imp?.video?.h) {
      [bidResponse.playerWidth, bidResponse.playerHeight] = [context.imp.video.w, context.imp.video.h];
    }
    if (seatbid.adm) {
      bidResponse.vastXml = seatbid.adm;
    }
    if (seatbid.nurl) {
      bidResponse.vastUrl = seatbid.nurl;
    }
  }
}

/***/ }

}]);
//# sourceMappingURL=ortbConverter.js.map