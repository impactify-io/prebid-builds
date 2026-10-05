/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	const __webpack_require__ = {};
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
/*!*********************************************!*\
  !*** ./creative/renderers/safe/renderer.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/**
 * SafeRenderer (creative): builds an empty same-origin iframe, injects
 * `<script src="safeRenderer.url">`, then calls `iframe.contentWindow.pbRenderInFrame(payload)`
 * after that script loads.
 *
 * The remote script must assign `window.pbRenderInFrame` as a function.
 * `payload` is `{ config: safeRenderer.config, ...renderingData }`: `renderingData` carries bid-oriented fields passed through the creative pipeline
 * that may matter to an external renderer—for example `ad`, `adId`, `adUrl`, `vastXml`, `vastUrl`, `mediaType`, sizes, `instl`.
 * `payload.config` mirrors `safeRenderer.config` from that payload; before the creative runs, Core may populate it from a static
 * `safeRenderer.config` (e.g. set on the bid by the bidder adapter) or by calling the publisher’s `safeRenderer.getConfig(bidResponse)` once at render preparation.
 *
 */
function render(data, {
  mkFrame
}, win) {
  const {
    safeRenderer,
    ...renderingData
  } = data;
  const width = data.width;
  const height = data.height;
  const instl = data.instl;
  if (height == null) {
    const body = win.document && win.document.body;
    const parent = body && body.parentElement;
    if (body && body.style) body.style.height = '100%';
    if (parent && parent.style) parent.style.height = '100%';
  }
  const doc = win.document;
  const attrs = {
    width: width != null ? width : '100%',
    height: height != null ? height : '100%'
  };
  if (instl && win.frameElement) {
    const style = win.frameElement.style;
    style.width = width ? String(width) + 'px' : '100vw';
    style.height = height ? String(height) + 'px' : '100vh';
  }
  if (typeof safeRenderer.url !== 'string' || safeRenderer.url === '') {
    return Promise.reject(new Error('Prebid SafeRenderer: missing data.safeRenderer.url'));
  }

  // Prebid will wait for it to resolve before firing AD_RENDER_SUCCEEDED.
  return new Promise(function (resolve, reject) {
    const frame = mkFrame(doc, {
      width: attrs.width,
      height: attrs.height
    });
    frame.onload = function () {
      try {
        const cw = frame.contentWindow;
        const idoc = cw.document;
        const script = idoc.createElement('script');
        script.src = safeRenderer.url;
        script.onload = function () {
          try {
            const fn = cw.pbRenderInFrame;
            if (typeof fn !== 'function') {
              throw new Error('Prebid SafeRenderer: safeRenderer.url script must define window.pbRenderInFrame as a function.');
            }
            fn.call(cw, {
              config: safeRenderer.config,
              ...renderingData
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        script.onerror = function () {
          reject(new Error('Prebid SafeRenderer: failed to load script from safeRenderer.url'));
        };
        (idoc.head || idoc.body).appendChild(script);
      } catch (e) {
        reject(e);
      }
    };
    frame.onerror = function () {
      reject(new Error('Prebid SafeRenderer: iframe failed to load'));
    };
    doc.body.appendChild(frame);
  });
}
window.render = render;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO0VBQzdCLENBQUMsQ0FBQztBQUNKO0FBRUFnQixNQUFNLENBQUN2QyxNQUFNLEdBQUdBLE1BQU0sQyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uLi8uLi9jcmVhdGl2ZS9yZW5kZXJlcnMvc2FmZS9yZW5kZXJlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxuY29uc3QgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qKlxuICogU2FmZVJlbmRlcmVyIChjcmVhdGl2ZSk6IGJ1aWxkcyBhbiBlbXB0eSBzYW1lLW9yaWdpbiBpZnJhbWUsIGluamVjdHNcbiAqIGA8c2NyaXB0IHNyYz1cInNhZmVSZW5kZXJlci51cmxcIj5gLCB0aGVuIGNhbGxzIGBpZnJhbWUuY29udGVudFdpbmRvdy5wYlJlbmRlckluRnJhbWUocGF5bG9hZClgXG4gKiBhZnRlciB0aGF0IHNjcmlwdCBsb2Fkcy5cbiAqXG4gKiBUaGUgcmVtb3RlIHNjcmlwdCBtdXN0IGFzc2lnbiBgd2luZG93LnBiUmVuZGVySW5GcmFtZWAgYXMgYSBmdW5jdGlvbi5cbiAqIGBwYXlsb2FkYCBpcyBgeyBjb25maWc6IHNhZmVSZW5kZXJlci5jb25maWcsIC4uLnJlbmRlcmluZ0RhdGEgfWA6IGByZW5kZXJpbmdEYXRhYCBjYXJyaWVzIGJpZC1vcmllbnRlZCBmaWVsZHMgcGFzc2VkIHRocm91Z2ggdGhlIGNyZWF0aXZlIHBpcGVsaW5lXG4gKiB0aGF0IG1heSBtYXR0ZXIgdG8gYW4gZXh0ZXJuYWwgcmVuZGVyZXLigJRmb3IgZXhhbXBsZSBgYWRgLCBgYWRJZGAsIGBhZFVybGAsIGB2YXN0WG1sYCwgYHZhc3RVcmxgLCBgbWVkaWFUeXBlYCwgc2l6ZXMsIGBpbnN0bGAuXG4gKiBgcGF5bG9hZC5jb25maWdgIG1pcnJvcnMgYHNhZmVSZW5kZXJlci5jb25maWdgIGZyb20gdGhhdCBwYXlsb2FkOyBiZWZvcmUgdGhlIGNyZWF0aXZlIHJ1bnMsIENvcmUgbWF5IHBvcHVsYXRlIGl0IGZyb20gYSBzdGF0aWNcbiAqIGBzYWZlUmVuZGVyZXIuY29uZmlnYCAoZS5nLiBzZXQgb24gdGhlIGJpZCBieSB0aGUgYmlkZGVyIGFkYXB0ZXIpIG9yIGJ5IGNhbGxpbmcgdGhlIHB1Ymxpc2hlcuKAmXMgYHNhZmVSZW5kZXJlci5nZXRDb25maWcoYmlkUmVzcG9uc2UpYCBvbmNlIGF0IHJlbmRlciBwcmVwYXJhdGlvbi5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZGF0YSwgeyBta0ZyYW1lIH0sIHdpbikge1xuICBjb25zdCB7IHNhZmVSZW5kZXJlciwgLi4ucmVuZGVyaW5nRGF0YSB9ID0gZGF0YTtcblxuICBjb25zdCB3aWR0aCA9IGRhdGEud2lkdGg7XG4gIGNvbnN0IGhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICBjb25zdCBpbnN0bCA9IGRhdGEuaW5zdGw7XG5cbiAgaWYgKGhlaWdodCA9PSBudWxsKSB7XG4gICAgY29uc3QgYm9keSA9IHdpbi5kb2N1bWVudCAmJiB3aW4uZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCBwYXJlbnQgPSBib2R5ICYmIGJvZHkucGFyZW50RWxlbWVudDtcbiAgICBpZiAoYm9keSAmJiBib2R5LnN0eWxlKSBib2R5LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC5zdHlsZSkgcGFyZW50LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgfVxuXG4gIGNvbnN0IGRvYyA9IHdpbi5kb2N1bWVudDtcbiAgY29uc3QgYXR0cnMgPSB7XG4gICAgd2lkdGg6IHdpZHRoICE9IG51bGwgPyB3aWR0aCA6ICcxMDAlJyxcbiAgICBoZWlnaHQ6IGhlaWdodCAhPSBudWxsID8gaGVpZ2h0IDogJzEwMCUnXG4gIH07XG5cbiAgaWYgKGluc3RsICYmIHdpbi5mcmFtZUVsZW1lbnQpIHtcbiAgICBjb25zdCBzdHlsZSA9IHdpbi5mcmFtZUVsZW1lbnQuc3R5bGU7XG4gICAgc3R5bGUud2lkdGggPSB3aWR0aCA/IFN0cmluZyh3aWR0aCkgKyAncHgnIDogJzEwMHZ3JztcbiAgICBzdHlsZS5oZWlnaHQgPSBoZWlnaHQgPyBTdHJpbmcoaGVpZ2h0KSArICdweCcgOiAnMTAwdmgnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzYWZlUmVuZGVyZXIudXJsICE9PSAnc3RyaW5nJyB8fCBzYWZlUmVuZGVyZXIudXJsID09PSAnJykge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1ByZWJpZCBTYWZlUmVuZGVyZXI6IG1pc3NpbmcgZGF0YS5zYWZlUmVuZGVyZXIudXJsJykpO1xuICB9XG5cbiAgLy8gUHJlYmlkIHdpbGwgd2FpdCBmb3IgaXQgdG8gcmVzb2x2ZSBiZWZvcmUgZmlyaW5nIEFEX1JFTkRFUl9TVUNDRUVERUQuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgY29uc3QgZnJhbWUgPSBta0ZyYW1lKGRvYywge1xuICAgICAgd2lkdGg6IGF0dHJzLndpZHRoLFxuICAgICAgaGVpZ2h0OiBhdHRycy5oZWlnaHRcbiAgICB9KTtcbiAgICBmcmFtZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjdyA9IGZyYW1lLmNvbnRlbnRXaW5kb3c7XG4gICAgICAgIGNvbnN0IGlkb2MgPSBjdy5kb2N1bWVudDtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gaWRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0LnNyYyA9IHNhZmVSZW5kZXJlci51cmw7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZuID0gY3cucGJSZW5kZXJJbkZyYW1lO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ1ByZWJpZCBTYWZlUmVuZGVyZXI6IHNhZmVSZW5kZXJlci51cmwgc2NyaXB0IG11c3QgZGVmaW5lIHdpbmRvdy5wYlJlbmRlckluRnJhbWUgYXMgYSBmdW5jdGlvbi4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbi5jYWxsKGN3LCB7IGNvbmZpZzogc2FmZVJlbmRlcmVyLmNvbmZpZywgLi4ucmVuZGVyaW5nRGF0YSB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZWplY3QoXG4gICAgICAgICAgICBuZXcgRXJyb3IoJ1ByZWJpZCBTYWZlUmVuZGVyZXI6IGZhaWxlZCB0byBsb2FkIHNjcmlwdCBmcm9tIHNhZmVSZW5kZXJlci51cmwnKVxuICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIChpZG9jLmhlYWQgfHwgaWRvYy5ib2R5KS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmcmFtZS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcignUHJlYmlkIFNhZmVSZW5kZXJlcjogaWZyYW1lIGZhaWxlZCB0byBsb2FkJykpO1xuICAgIH07XG4gICAgZG9jLmJvZHkuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuICB9KTtcbn1cblxud2luZG93LnJlbmRlciA9IHJlbmRlcjtcbiJdLCJuYW1lcyI6WyJyZW5kZXIiLCJkYXRhIiwibWtGcmFtZSIsIndpbiIsInNhZmVSZW5kZXJlciIsInJlbmRlcmluZ0RhdGEiLCJ3aWR0aCIsImhlaWdodCIsImluc3RsIiwiYm9keSIsImRvY3VtZW50IiwicGFyZW50IiwicGFyZW50RWxlbWVudCIsInN0eWxlIiwiZG9jIiwiYXR0cnMiLCJmcmFtZUVsZW1lbnQiLCJTdHJpbmciLCJ1cmwiLCJQcm9taXNlIiwicmVqZWN0IiwiRXJyb3IiLCJyZXNvbHZlIiwiZnJhbWUiLCJvbmxvYWQiLCJjdyIsImNvbnRlbnRXaW5kb3ciLCJpZG9jIiwic2NyaXB0IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsImZuIiwicGJSZW5kZXJJbkZyYW1lIiwiY2FsbCIsImNvbmZpZyIsImUiLCJvbmVycm9yIiwiaGVhZCIsImFwcGVuZENoaWxkIiwid2luZG93Il0sInNvdXJjZVJvb3QiOiIifQ==