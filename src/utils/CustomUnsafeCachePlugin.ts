"use strict";

import { Resolver } from 'enhanced-resolve';
import { ResolvePluginInstance } from 'webpack';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

type ResolveRequest = Parameters<Resolver["doResolve"]>[1];
type ResolveContext = Parameters<Resolver["doResolve"]>[3];
type targetType = ReturnType<Resolver["ensureHook"]>;

function getCacheId(type: string, request: ResolveRequest, withContext: boolean = false): string {
	return JSON.stringify({
		type,
		context: withContext ? request.context : "",
		path: request.path,
		query: request.query,
		fragment: request.fragment,
		request: request.request
	});
}

type PathContainingObject = {
  path: string;
};

class CustomUnsafeCachePlugin implements ResolvePluginInstance {
    private cache: Record<string, string>;
    private resolving: Set<string>;

    constructor(source: string, cache: Record<string, string> = {}) {
        this.cache = cache;
        this.resolving = new Set();
    }

    resolveUnsafe(
        resolver: Resolver,
        target: targetType,
        request: ResolveRequest,
        resolveContext: ResolveContext,
        callback: (error?: Error | null, result?: ResolveRequest | null) => void
    ) {
      if (!request.path || !request.request) {
        console.log("Malformed request: ", request.path, request.request);
        return callback();
      }

      const cacheKey = request.path + request.request;

      // Prevent infinite recursion by checking if we're already resolving this request
      if (this.resolving.has(cacheKey)) {
        return callback();
      }

      this.resolving.add(cacheKey);
      const cachedPath = this.cache[cacheKey];

      // Check if the cached file exists
      if (cachedPath) {
        if (!fs.existsSync(cachedPath)) {
          console.log("Cached file no longer exists, clearing cache for: ", cacheKey);
          delete this.cache[cacheKey]; // Clear the cache for this entry
        } else {
          console.log("Using cached path: ", cachedPath);
          const resolveRequest: ResolveRequest = {
            ...request,
            path: cachedPath
          };
          console.log(request.path);
          this.resolving.delete(cacheKey);
          return callback(null, resolveRequest);
        }
      }

      // Continue with the resolution process
      resolver.doResolve(target, request, null, resolveContext, (err, result) => {
          this.resolving.delete(cacheKey);
          console.log(err, result);
          if (!err && result && typeof result.path === 'string') {
            // Cache the resolved path
            console.log("Caching resolved path: ", cacheKey, result.path);
            this.cache[cacheKey] = result.path;
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
    }

    apply(resolver: Resolver): void {
        const target = resolver.ensureHook("resolve");
        resolver.getHook("resolve").tapAsync('CustomUnsafeCachePlugin', (request, resolveContext, callback) => {
            this.resolveUnsafe(
                resolver,
                target,
                request,
                resolveContext,
                callback
            );
        });
    }
}

module.exports = CustomUnsafeCachePlugin;
