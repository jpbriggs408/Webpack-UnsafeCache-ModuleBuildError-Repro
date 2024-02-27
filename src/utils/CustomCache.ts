"use strict"

const fs = require('fs');

const fileSystemAwareCache = new Proxy({},{
    get(target, key, receiver) {
        const entry = Reflect.get(target, key, receiver);
        if (entry && fs.existsSync(entry.path)) {
            console.log("Entry exists", entry, entry.path);
            return entry;
        }

        Reflect.deleteProperty(target, key);
        return undefined;
    },
  
    set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver);
      }
});

export default fileSystemAwareCache;