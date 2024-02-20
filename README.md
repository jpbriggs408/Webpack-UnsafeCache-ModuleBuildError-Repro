# Webpack Issue Reproduction

This repository contains a minimal setup to reproduce an issue encountered with Webpack's `unsafeCache` feature not correctly resolving file extensions dynamically from `.jsx` to `.tsx` in a development environment using Webpack Dev Server.

## Issue Description

The development server fails to recognize dynamic file renames/extension changes, leading to module resolution errors.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Initial Setup

`npm install` installs necessary dependencies
`npm start` runs the development server

The app is served at `http://localhost:8080` by default

### Reproducing the Issue

1. The initial setup includes a `src/index.jsx` file importing `src/App.jsx`.
2. When `src/App.jsx` is changed to `src/App.tsx`, the dev server fails.

![image](https://github.com/jpbriggs408/Webpack-UnsafeCache-ModuleBuildError-Repro/assets/8880358/dc82f43b-ac1f-4814-94ad-04f49210b4ef)
