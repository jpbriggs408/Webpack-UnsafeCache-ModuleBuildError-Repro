const path = require('path');
const MeowMeowUnsafeCachePlugin = require('./src/utils/MeowMeowUnsafeCachePlugin.js');

const plugins = [];
const unsafeCacheSingleton = {};
const source = 'resolve';

plugins.push(
    new MeowMeowUnsafeCachePlugin(
      source,
      ()=>true,
      unsafeCacheSingleton,
      false,
      `new-${source}`
    )
  );

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
    unsafeCache: false,
    plugins
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
