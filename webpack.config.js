#!/usr/bin/env node
'use strict';

const path = require('path');
const customCache = require('.src/utils/CustomCache');

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
    unsafeCache: customCache,
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
