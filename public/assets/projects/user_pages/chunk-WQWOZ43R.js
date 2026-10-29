import {
  init_cf_utils,
  uuidv4
} from "./chunk-VVEAJADP.js";
import {
  __commonJS,
  __esm,
  __export,
  __toESM,
  define_process_default,
  init_define_process
} from "./chunk-RFSPGZ3L.js";

// projects/user_pages/app/javascript/lander/utils/error_with_cause.ts
var CFErrorWithCause, getErrorCause, _stackWithCauses, CFstackWithCauses;
var init_error_with_cause = __esm({
  "projects/user_pages/app/javascript/lander/utils/error_with_cause.ts"() {
    init_define_process();
    CFErrorWithCause = class _CFErrorWithCause extends Error {
      constructor(message, options) {
        super(message);
        const cause = options?.cause ?? null;
        this.name = _CFErrorWithCause.name;
        if (cause) {
          this.cause = cause;
        }
        this.message = message;
      }
    };
    getErrorCause = (err) => {
      if (!err || typeof err !== "object" || !("cause" in err)) {
        return;
      }
      if (typeof err.cause === "function") {
        const causeResult = err.cause();
        return causeResult instanceof Error ? causeResult : void 0;
      } else {
        return err.cause instanceof Error ? err.cause : void 0;
      }
    };
    _stackWithCauses = (err, seen) => {
      if (!(err instanceof Error)) return "";
      const stack = err.stack || "";
      if (seen.has(err)) {
        return stack + "\ncauses have become circular...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        return stack + "\ncaused by: " + _stackWithCauses(cause, seen);
      } else {
        return stack;
      }
    };
    CFstackWithCauses = (err) => _stackWithCauses(err, /* @__PURE__ */ new Set());
    globalThis.CFErrorWithCause = CFErrorWithCause;
    globalThis.CFstackWithCauses = CFstackWithCauses;
  }
});

// projects/user_pages/app/javascript/lander/utils/path.ts
function pathJoin(...args) {
  if (args.length === 0) return "";
  const firstNotEmptyIndex = args.findIndex((arg) => arg?.length > 0);
  if (firstNotEmptyIndex === -1) return "";
  let result = args[firstNotEmptyIndex];
  for (let i = firstNotEmptyIndex + 1; i < args.length; i++) {
    const part = args[i] ?? "";
    if (part.length === 0) continue;
    let startChar = 0;
    while (startChar < part.length - 1 && part[startChar] === "/") {
      startChar += 1;
    }
    const shouldAddSlash = result.length > 0 && result[result.length - 1] !== "/";
    result += (shouldAddSlash ? "/" : "") + part.slice(startChar);
  }
  return result;
}
var init_path = __esm({
  "projects/user_pages/app/javascript/lander/utils/path.ts"() {
    init_define_process();
  }
});

// projects/user_pages/app/javascript/lander/utils/fetcher.ts
var fetcher_exports = {};
__export(fetcher_exports, {
  CFFetch: () => CFFetch,
  CFFetcherError: () => CFFetcherError,
  CFFetcherErrorTypes: () => CFFetcherErrorTypes,
  FetcherResponseErrorType: () => FetcherResponseErrorType,
  MANUALLY_ABORTED: () => MANUALLY_ABORTED,
  default: () => Fetcher,
  isBackendError: () => isBackendError,
  isFetcherError: () => isFetcherError,
  isResponseError: () => isResponseError
});
function isResponseError(response) {
  return response.fetcherErrorType != void 0;
}
function isFetcherError(response) {
  return response.fetcherErrorType == 0 /* Internal */;
}
function isBackendError(response) {
  return response.fetcherErrorType == 1 /* Backend */;
}
var CFFetcherErrorTypes, CFFetcherError, FetcherRequestDefaultOptions, FetcherResponseErrorType, MANUALLY_ABORTED, Fetcher, CFFetch;
var init_fetcher = __esm({
  "projects/user_pages/app/javascript/lander/utils/fetcher.ts"() {
    init_define_process();
    init_cf_utils();
    init_error_with_cause();
    init_path();
    CFFetcherErrorTypes = {
      NETWORK_ERROR: "NETWORK_ERROR",
      SERVER_ERROR: "SERVER_ERROR",
      // Every attempt was cut off by our own timeout timer. Distinct from
      // NETWORK_ERROR (the request failed on its own) and from MANUALLY_ABORTED
      // (something cancelled us deliberately).
      TIMEOUT_ERROR: "TIMEOUT_ERROR"
    };
    globalThis.CFFetcherErrorTypes = CFFetcherErrorTypes;
    CFFetcherError = class extends CFErrorWithCause {
      constructor(type, options) {
        super(type, options);
        this.name = "CFFetcherError";
        this.type = type;
      }
    };
    globalThis.CFFetcherError = CFFetcherError;
    FetcherRequestDefaultOptions = {
      retries: 1,
      timeoutMS: -1,
      timeoutAfterRetrial: 1e3,
      shouldCaptureServerError: false,
      convertThrowToErrorResponse: false,
      onlyOneInflightRequest: false,
      simulateNetworkError: false,
      canAbort: true,
      retryServerErrors: false,
      retryTimeouts: false
    };
    FetcherResponseErrorType = /* @__PURE__ */ ((FetcherResponseErrorType2) => {
      FetcherResponseErrorType2[FetcherResponseErrorType2["Internal"] = 0] = "Internal";
      FetcherResponseErrorType2[FetcherResponseErrorType2["Backend"] = 1] = "Backend";
      return FetcherResponseErrorType2;
    })(FetcherResponseErrorType || {});
    MANUALLY_ABORTED = "Manually aborted";
    Fetcher = class {
      constructor(options) {
        this.options = options || {};
        this.inflightRequests = {};
      }
      /*
       * This fetch call is an extension of original fetch which only fires
       * api with a loading state before and after the call.
       * Can also debounce greater or less than 500ms if required.
       * The fetch request returns the JSON promise and is abortable
       */
      async fetch(url, init, requestOptions) {
        const { callbackData, customEvent, ...enhancedFetchOptions } = {
          ...FetcherRequestDefaultOptions,
          ...this.options?.requestOptions ?? {},
          ...requestOptions ?? {}
        };
        const { onlyOneInflightRequest, canAbort } = enhancedFetchOptions;
        if (this.loading && onlyOneInflightRequest) {
          if (canAbort) {
            this.abort();
          } else {
            return { fetcherErrorType: 0 /* Internal */, error: "Another request is in progress" };
          }
        }
        const requestId = uuidv4();
        enhancedFetchOptions.requestId = requestId;
        this.inflightRequests[requestId] = {
          manuallyAborted: false,
          abortController: new AbortController()
        };
        let response;
        this.url = url;
        const { headers, method, credentials } = this.options ?? {};
        init = {
          ...{ method, credentials },
          ...init ?? {},
          headers: {
            ...headers,
            ...init.headers
          }
        };
        this.setLoading(true, callbackData, customEvent);
        try {
          if (enhancedFetchOptions?.simulateNetworkError) {
            throw new Error("Network Error");
          }
          response = await this.enhancedFetch(url, init, enhancedFetchOptions);
          this.setLoading(false, callbackData, customEvent);
          if (this.options.debug) {
            console.log("[Fetch Request Completed]", response);
          }
          return response;
        } catch (error) {
          this.setLoading(false, error, customEvent);
          let err = error;
          const inflightRequest = this.inflightRequests[requestId];
          if (inflightRequest.manuallyAborted) {
            err = MANUALLY_ABORTED;
          } else if (this.options.debug) {
            console.log("[Error During Fetch]", error);
          }
          if (enhancedFetchOptions.convertThrowToErrorResponse) {
            return { fetcherErrorType: 0 /* Internal */, error: err };
          } else {
            throw err;
          }
        } finally {
          delete this.inflightRequests[requestId];
        }
      }
      async toJSON(response) {
        if (isResponseError(response)) {
          return response;
        } else {
          try {
            if (response.ok) {
              return await response.json();
            } else if ([400, 422].includes(response.status)) {
              return { fetcherErrorType: 1 /* Backend */, error: await response.json() };
            } else {
              throw new CFFetcherError(CFFetcherErrorTypes.SERVER_ERROR, {
                cause: new Error(
                  `Invalid response from server
  Status: ${response.status}
  Body: ${await response.text()}`
                )
              });
            }
          } catch (error) {
            if (this.options.requestOptions.convertThrowToErrorResponse) {
              return { fetcherErrorType: 0 /* Internal */, error };
            } else {
              throw error;
            }
          }
        }
      }
      async post(url, data, requestOptions, init) {
        const response = await this.fetch(
          url,
          {
            method: "POST",
            body: JSON.stringify(data),
            ...init ?? {}
          },
          requestOptions
        );
        return await this.toJSON(response);
      }
      async get(url, data, requestOptions, init) {
        let fullUrl = url;
        const queryParams = Object.entries(data ?? {}).filter(([, v]) => !!v).map(([k, v]) => `${k}=${v}`).join("&");
        if (queryParams) {
          fullUrl = `${fullUrl}?${queryParams}`;
        }
        const response = await this.fetch(
          fullUrl,
          {
            method: "GET",
            ...init ?? {}
          },
          requestOptions
        );
        return this.toJSON(response);
      }
      async enhancedFetch(url, init, opts) {
        const {
          retries,
          timeoutMS,
          timeoutAfterRetrial,
          shouldCaptureServerError,
          retryServerErrors,
          retryTimeouts,
          requestId
        } = opts;
        let lastErr;
        for (let i = 0; i < retries; i++) {
          try {
            if (i > 0) {
              await new Promise((resolve) => setTimeout(resolve, timeoutAfterRetrial));
            }
            if (shouldCaptureServerError) {
              return await this.fetchWithTimeout(url, init, timeoutMS, requestId).then((response) => {
                if (response.status >= 500) {
                  throw new CFFetcherError(CFFetcherErrorTypes.SERVER_ERROR);
                }
                return response;
              });
            } else {
              return await this.fetchWithTimeout(url, init, timeoutMS, requestId);
            }
          } catch (err) {
            if (err instanceof CFFetcherError && err.type == CFFetcherErrorTypes.SERVER_ERROR && !retryServerErrors) {
              throw err;
            }
            if (err instanceof CFFetcherError && err.type == CFFetcherErrorTypes.TIMEOUT_ERROR && !retryTimeouts) {
              throw err;
            }
            if (this.inflightRequests[requestId]?.manuallyAborted) {
              throw err;
            }
            lastErr = err;
          }
        }
        if (lastErr instanceof CFFetcherError) throw lastErr;
        throw new CFFetcherError(CFFetcherErrorTypes.NETWORK_ERROR, { cause: lastErr });
      }
      fetchWithTimeout(url, init, timeoutDuration = 1e3, requestId) {
        const inflightRequest = this.inflightRequests[requestId];
        const abortController = new AbortController();
        if (inflightRequest) {
          if (inflightRequest.manuallyAborted) abortController.abort();
          inflightRequest.abortController = abortController;
        }
        let timedOut = false;
        let timeoutId;
        if (timeoutDuration > 0) {
          timeoutId = setTimeout(() => {
            timedOut = true;
            abortController.abort();
          }, timeoutDuration);
        }
        const finalUrl = url.startsWith("http") || url.startsWith("https") ? url : pathJoin(this.options.pathPrefix, url);
        return fetch(finalUrl, { ...init, signal: abortController.signal }).catch((error) => {
          if (timedOut) throw new CFFetcherError(CFFetcherErrorTypes.TIMEOUT_ERROR, { cause: error });
          throw error;
        }).finally(() => clearTimeout(timeoutId));
      }
      abort(requestId) {
        const requestsToAborts = requestId ? [requestId] : Object.keys(this.inflightRequests) ?? [];
        requestsToAborts.forEach((key) => {
          const inflightRequest = this.inflightRequests[key];
          if (!inflightRequest) return;
          if (!inflightRequest?.manuallyAborted) {
            if (this.options.debug) {
              console.log(`[Aborting Request][RequestID=${key}]`, this.url);
            }
            inflightRequest.abortController.abort();
            inflightRequest.manuallyAborted = true;
          }
        });
      }
      setLoading(isLoading, details, customName) {
        let loadingEvent;
        const startEvent = customName && customName + "Started" || "CFFetchStarted";
        const endEvent = customName && customName + "Finished" || "CFFetchFinished";
        if (isLoading && !this.loading) {
          if (this.options.debug) {
            console.log("[Loading Started]", startEvent);
          }
          this.loading = true;
          loadingEvent = new CustomEvent(startEvent, {
            detail: details
          });
        } else if (!isLoading && this.loading) {
          if (this.options.debug) {
            console.log("[Loading Finished/Aborted]", endEvent);
          }
          this.loading = false;
          loadingEvent = new CustomEvent(endEvent, {
            detail: details
          });
        }
        if (loadingEvent) {
          document.dispatchEvent(loadingEvent);
        }
      }
    };
    globalThis.CFFetcher = globalThis.CFFetcher || Fetcher;
    CFFetch = async (url, data, requestOptions) => {
      const fetcher = new Fetcher();
      return await fetcher.fetch(url, data, requestOptions);
    };
    globalThis.CFFetch = CFFetch;
  }
});

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
    init_define_process();
  }
});

// (disabled):buffer
var require_buffer = __commonJS({
  "(disabled):buffer"() {
    init_define_process();
  }
});

// node_modules/js-sha256/src/sha256.js
var require_sha256 = __commonJS({
  "node_modules/js-sha256/src/sha256.js"(exports, module) {
    init_define_process();
    (function() {
      "use strict";
      var ERROR = "input is invalid type";
      var WINDOW = typeof window === "object";
      var root = WINDOW ? window : {};
      if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof define_process_default === "object" && define_process_default.versions && define_process_default.versions.node && define_process_default.type != "renderer";
      if (NODE_JS) {
        root = window;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === "object" && module.exports;
      var AMD = typeof define === "function" && define.amd;
      var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [-2147483648, 8388608, 32768, 128];
      var SHIFT = [24, 16, 8, 0];
      var K = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ];
      var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];
      var blocks = [];
      if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var createOutputMethod = function(outputType, is224) {
        return function(message) {
          return new Sha256(is224, true).update(message)[outputType]();
        };
      };
      var createMethod = function(is224) {
        var method = createOutputMethod("hex", is224);
        if (NODE_JS) {
          method = nodeWrap(method, is224);
        }
        method.create = function() {
          return new Sha256(is224);
        };
        method.update = function(message) {
          return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type, is224);
        }
        return method;
      };
      var nodeWrap = function(method, is224) {
        var crypto = require_crypto();
        var Buffer = require_buffer().Buffer;
        var algorithm = is224 ? "sha224" : "sha256";
        var bufferFrom;
        if (Buffer.from && !root.JS_SHA256_NO_BUFFER_FROM) {
          bufferFrom = Buffer.from;
        } else {
          bufferFrom = function(message) {
            return new Buffer(message);
          };
        }
        var nodeMethod = function(message) {
          if (typeof message === "string") {
            return crypto.createHash(algorithm).update(message, "utf8").digest("hex");
          } else {
            if (message === null || message === void 0) {
              throw new Error(ERROR);
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            }
          }
          if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer) {
            return crypto.createHash(algorithm).update(bufferFrom(message)).digest("hex");
          } else {
            return method(message);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType, is224) {
        return function(key, message) {
          return new HmacSha256(key, is224, true).update(message)[outputType]();
        };
      };
      var createHmacMethod = function(is224) {
        var method = createHmacOutputMethod("hex", is224);
        method.create = function(key) {
          return new HmacSha256(key, is224);
        };
        method.update = function(key, message) {
          return method.create(key).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
      };
      function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (is224) {
          this.h0 = 3238371032;
          this.h1 = 914150663;
          this.h2 = 812702999;
          this.h3 = 4144912697;
          this.h4 = 4290775857;
          this.h5 = 1750603025;
          this.h6 = 1694076839;
          this.h7 = 3204075428;
        } else {
          this.h0 = 1779033703;
          this.h1 = 3144134277;
          this.h2 = 1013904242;
          this.h3 = 2773480762;
          this.h4 = 1359893119;
          this.h5 = 2600822924;
          this.h6 = 528734635;
          this.h7 = 1541459225;
        }
        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
      }
      Sha256.prototype.update = function(message) {
        if (this.finalized) {
          return;
        }
        var notString, type = typeof message;
        if (type !== "string") {
          if (type === "object") {
            if (message === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
          notString = true;
        }
        var code, index = 0, i, length = message.length, blocks2 = this.blocks;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = this.block;
            this.block = blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (notString) {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 128) {
                blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 2048) {
                blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.block = blocks2[16];
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Sha256.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[16] = this.block;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        this.block = blocks2[16];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = this.block;
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks2[15] = this.bytes << 3;
        this.hash();
      };
      Sha256.prototype.hash = function() {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks2 = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
        for (j = 16; j < 64; ++j) {
          t1 = blocks2[j - 15];
          s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
          t1 = blocks2[j - 2];
          s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
          blocks2[j] = blocks2[j - 16] + s0 + blocks2[j - 7] + s1 << 0;
        }
        bc = b & c;
        for (j = 0; j < 64; j += 4) {
          if (this.first) {
            if (this.is224) {
              ab = 300032;
              t1 = blocks2[0] - 1413257819;
              h = t1 - 150054599 << 0;
              d = t1 + 24177077 << 0;
            } else {
              ab = 704751109;
              t1 = blocks2[0] - 210244248;
              h = t1 - 1521486534 << 0;
              d = t1 + 143694565 << 0;
            }
            this.first = false;
          } else {
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ab = a & b;
            maj = ab ^ a & c ^ bc;
            ch = e & f ^ ~e & g;
            t1 = h + s1 + ch + K[j] + blocks2[j];
            t2 = s0 + maj;
            h = d + t1 << 0;
            d = t1 + t2 << 0;
          }
          s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
          s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
          da = d & a;
          maj = da ^ d & b ^ ab;
          ch = h & e ^ ~h & f;
          t1 = g + s1 + ch + K[j + 1] + blocks2[j + 1];
          t2 = s0 + maj;
          g = c + t1 << 0;
          c = t1 + t2 << 0;
          s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
          s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
          cd = c & d;
          maj = cd ^ c & a ^ da;
          ch = g & h ^ ~g & e;
          t1 = f + s1 + ch + K[j + 2] + blocks2[j + 2];
          t2 = s0 + maj;
          f = b + t1 << 0;
          b = t1 + t2 << 0;
          s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
          s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
          bc = b & c;
          maj = bc ^ b & d ^ cd;
          ch = f & g ^ ~f & h;
          t1 = e + s1 + ch + K[j + 3] + blocks2[j + 3];
          t2 = s0 + maj;
          e = a + t1 << 0;
          a = t1 + t2 << 0;
          this.chromeBugWorkAround = true;
        }
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
      };
      Sha256.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
        if (!this.is224) {
          hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
        }
        return hex;
      };
      Sha256.prototype.toString = Sha256.prototype.hex;
      Sha256.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var arr = [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 & 255
        ];
        if (!this.is224) {
          arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
        }
        return arr;
      };
      Sha256.prototype.array = Sha256.prototype.digest;
      Sha256.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
          dataView.setUint32(28, this.h7);
        }
        return buffer;
      };
      function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === "string") {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key = bytes;
        } else {
          if (type === "object") {
            if (key === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
              key = new Uint8Array(key);
            } else if (!Array.isArray(key)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
        }
        if (key.length > 64) {
          key = new Sha256(is224, true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Sha256.call(this, is224, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacSha256.prototype = new Sha256();
      HmacSha256.prototype.finalize = function() {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Sha256.call(this, this.is224, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Sha256.prototype.finalize.call(this);
        }
      };
      var exports2 = createMethod();
      exports2.sha256 = exports2;
      exports2.sha224 = createMethod(true);
      exports2.sha256.hmac = createHmacMethod();
      exports2.sha224.hmac = createHmacMethod(true);
      if (COMMON_JS) {
        module.exports = exports2;
      } else {
        root.sha256 = exports2.sha256;
        root.sha224 = exports2.sha224;
        if (AMD) {
          define(function() {
            return exports2;
          });
        }
      }
    })();
  }
});

// projects/user_pages/app/javascript/lander/nonce.ts
function requestNonceOnce(timeoutMs) {
  const win = window;
  return new Promise((resolve) => {
    win.__cfSdkNonce = null;
    const script = document.createElement("script");
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      document.removeEventListener("cf-sdk-nonce", onNonce);
      script.remove();
      resolve(value);
    };
    const onNonce = () => finish(win.__cfSdkNonce || null);
    const timer = setTimeout(() => finish(null), timeoutMs);
    document.addEventListener("cf-sdk-nonce", onNonce);
    script.src = NONCE_PATH;
    script.async = true;
    script.onerror = () => finish(null);
    document.head.appendChild(script);
  });
}
async function fetchCheckoutNonce() {
  const win = window;
  if (!win.__cfSdkHmacSha256) {
    win.__cfSdkHmacSha256 = (key, data) => import_js_sha256.sha256.hmac(key, data);
  }
  const elapsed = () => typeof performance !== "undefined" ? performance.now() : Date.now();
  const startedAt = elapsed();
  for (let attempt = 0; attempt < NONCE_MAX_ATTEMPTS; attempt++) {
    const remaining = NONCE_TOTAL_BUDGET_MS - (elapsed() - startedAt);
    if (remaining <= 0) break;
    const nonce = await requestNonceOnce(remaining / (NONCE_MAX_ATTEMPTS - attempt));
    if (nonce) return nonce;
  }
  return null;
}
function checkoutNonceParams(nonce) {
  if (!nonce) return {};
  return {
    sdk_challenge: nonce.challenge,
    sdk_ts: String(nonce.ts),
    sdk_server_sig: nonce.server_sig,
    sdk_client_sig: nonce.client_sig
  };
}
var import_js_sha256, NONCE_PATH, NONCE_TOTAL_BUDGET_MS, NONCE_MAX_ATTEMPTS;
var init_nonce = __esm({
  "projects/user_pages/app/javascript/lander/nonce.ts"() {
    init_define_process();
    import_js_sha256 = __toESM(require_sha256());
    NONCE_PATH = "/_cf/nonce";
    NONCE_TOTAL_BUDGET_MS = 12e3;
    NONCE_MAX_ATTEMPTS = 2;
  }
});

export {
  CFErrorWithCause,
  CFstackWithCauses,
  init_error_with_cause,
  CFFetcherErrorTypes,
  CFFetcherError,
  isResponseError,
  isFetcherError,
  isBackendError,
  MANUALLY_ABORTED,
  Fetcher,
  CFFetch,
  fetcher_exports,
  init_fetcher,
  fetchCheckoutNonce,
  checkoutNonceParams,
  init_nonce
};
/*! Bundled license information:

js-sha256/src/sha256.js:
  (**
   * [js-sha256]{@link https://github.com/emn178/js-sha256}
   *
   * @version 0.11.1
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2025
   * @license MIT
   *)
*/
//# sourceMappingURL=chunk-WQWOZ43R.js.map
