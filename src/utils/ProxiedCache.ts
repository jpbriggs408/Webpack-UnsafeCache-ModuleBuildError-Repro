"use strict"

// This is a duplicate of the unsafe cache object that was working with Webpack 4.

import * as fs from 'fs';

const realUnsafeCache = {};

type PathContainingObject = {
    path: string;
};

const unsafeCacheHandler = {
  get(cache: Record<string, PathContainingObject>, key: string) {
    const cachedValue = cache[key];
    if (cachedValue && cachedValue.path && !fs.existsSync(cachedValue.path)) {
      delete cache[key];
      return undefined;
    }
    return cachedValue;
  },
};
const proxiedCache = new Proxy(realUnsafeCache, unsafeCacheHandler);

export default proxiedCache;