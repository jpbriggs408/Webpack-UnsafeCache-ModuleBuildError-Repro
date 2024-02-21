"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getCacheId(type, request, withContext) {
    if (withContext === void 0) { withContext = false; }
    return JSON.stringify({
        type: type,
        context: withContext ? request.context : "",
        path: request.path,
        query: request.query,
        fragment: request.fragment,
        request: request.request
    });
}
var CustomUnsafeCachePlugin = /** @class */ (function () {
    function CustomUnsafeCachePlugin(source, cache) {
        if (cache === void 0) { cache = {}; }
        this.cache = cache;
        this.resolving = new Set();
    }
    CustomUnsafeCachePlugin.prototype.resolveUnsafe = function (resolver, target, request, resolveContext, callback) {
        var _this = this;
        if (!request.path || !request.request) {
            console.log("Malformed request: ", request.path, request.request);
            return callback();
        }
        var cacheKey = request.path + request.request;
        // Prevent infinite recursion by checking if we're already resolving this request
        if (this.resolving.has(cacheKey)) {
            return callback();
        }
        this.resolving.add(cacheKey);
        var cachedPath = this.cache[cacheKey];
        // Check if the cached file exists
        if (cachedPath) {
            if (!fs.existsSync(cachedPath)) {
                console.log("Cached file no longer exists, clearing cache for: ", cacheKey);
                delete this.cache[cacheKey]; // Clear the cache for this entry
            }
            else {
                console.log("Using cached path: ", cachedPath);
                var resolveRequest = __assign(__assign({}, request), { path: cachedPath });
                console.log(request.path);
                this.resolving.delete(cacheKey);
                return callback(null, resolveRequest);
            }
        }
        // Continue with the resolution process
        resolver.doResolve(target, request, null, resolveContext, function (err, result) {
            _this.resolving.delete(cacheKey);
            console.log(err, result);
            if (!err && result && typeof result.path === 'string') {
                // Cache the resolved path
                console.log("Caching resolved path: ", cacheKey, result.path);
                _this.cache[cacheKey] = result.path;
            }
            callback(err, result);
        });
        // if (!request.path || !request.request) {
        //     console.log("Malformed request: ", request.path, request.request);
        //     return callback();
        // }
        // const parsedRequest = url.parse(request.request);
        // const importPath = path.resolve(request.path, parsedRequest.pathname || "");
        // const cacheKey = getCacheId("resolve", {...request, request: importPath }, request.context ? true : false);
        // // Check if the file exists in the cache and on disk
        // console.log(cacheKey);
        // console.log(this.cache[cacheKey]);
        // console.log(fs.existsSync(importPath));
        // if (this.cache[cacheKey]) {
        //     console.log("Using cached path: ", importPath, cacheKey, this.cache[cacheKey]);
        //     if (fs.existsSync(importPath)) {
        //         // If the file exists, return the cached request
        //         console.log("File exists", importPath);
        //         const resolveRequest: ResolveRequest = {
        //           ...request,
        //           path: this.cache[cacheKey]
        //         };
        //         return callback(null, resolveRequest);
        //     } else {
        //         // If the file doesn't exist, clear it from the cache and proceed with resolution
        //         delete this.cache[cacheKey];
        //         const message = `Cleared non-existent file from cache: ${importPath}`;
        //         console.log(message);
        //         resolver.doResolve(target, request, message, resolveContext, callback);
        //     }
        // } else {
        //   console.log("Cache miss: ", importPath);
        //   console.log("Cache key: ", cacheKey);
        //   console.log("Cache Entry: ", this.cache[cacheKey]);
        //   // If the file has not been cached yet, proceed with resolution
        //   resolver.doResolve(target, request, null, resolveContext, (err, result) => {
        //     if (!err && result && typeof result.path === 'string') {
        //       // Cache the resolved path
        //       console.log("Caching resolved path: ", cacheKey, result.path);
        //       this.cache[cacheKey] = result.path;
        //     }
        //     callback(err, result);
        //   });
        // }
    };
    CustomUnsafeCachePlugin.prototype.apply = function (resolver) {
        var _this = this;
        var target = resolver.ensureHook("resolve");
        resolver.getHook("resolve").tapAsync('CustomUnsafeCachePlugin', function (request, resolveContext, callback) {
            _this.resolveUnsafe(resolver, target, request, resolveContext, callback);
        });
    };
    return CustomUnsafeCachePlugin;
}());
module.exports = CustomUnsafeCachePlugin;
