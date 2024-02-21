#!/usr/bin/env node
'use strict';

const path = require('path');

const CustomCachePlugin = require('./src/utils/CustomUnsafeCachePlugin');

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
    plugins: [new CustomCachePlugin()],
    // unsafeCache: true,
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
