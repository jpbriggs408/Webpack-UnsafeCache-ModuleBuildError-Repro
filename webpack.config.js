const path = require('path');
const fs = require('fs');

const fileSystemAwareCache = new Proxy({},{
    get(target, key, receiver) {
        const entry = Reflect.get(target, key, receiver);
        if (entry && fs.existsSync(entry.path)) {
            return entry;
        }

        Reflect.deleteProperty(target, key);
        return undefined;
    },
  
    set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver);
      }
});

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    static: './dist',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    extensionAlias: {
      '.jsx': ['.tsx', '.jsx']
    },
    unsafeCache: fileSystemAwareCache,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
