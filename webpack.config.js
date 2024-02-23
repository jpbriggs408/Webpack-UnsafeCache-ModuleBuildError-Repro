#!/usr/bin/env node
'use strict';

const path = require('path');

const MeowMeowUnsafeCachePlugin = require('./src/utils/MeowMeowUnsafeCachePlugin.js');
const ParsePlugin = require("./node_modules/enhanced-resolve/lib/ParsePlugin.js");

const plugins = [];
const unsafeCacheSingleton = {};
const source = 'resolve';
const resolveOptions = {};

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
    plugins,
    unsafeCache: false,
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
