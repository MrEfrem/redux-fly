# Redux-fly
[![Build Status](https://travis-ci.org/MrEfrem/redux-fly.svg?branch=master)](https://travis-ci.org/MrEfrem/redux-fly)

## Purposes
Library provides simple API for:
* Gradual registration of reducer.
* Manage React component state stored in Redux.
* Interact between components through API Redux: dispatch actions, state selectors.
* Creation of the reused components which can placement of a state in the common Redux store or create incapsulated Redux store.

## Installation
React-fly requires **React 15.x**, **Redux 3.x** and **React Redux 4.x**.
```
npm install --save redux-fly
```

This assumes that you’re using npm package manager with a module bundler like Webpack or Browserify to consume CommonJS modules.

If you don’t yet use npm or a modern module bundler, and would rather prefer a single-file UMD build that makes ReduxFly available as a global object, you can grab a pre-built versions: [full](https://unpkg.com/redux-fly/dist/redux-fly.js) and
 [minified](https://unpkg.com/redux-fly/dist/redux-fly.min.js).

## Documentation
* [API](docs/API.md#api)
  * [`createReducer(config)`](docs/API.md#createreducerconfig)
  * [`enhanceStore`](docs/API.md#enhancestore)
  * [`getState(mountPath)(state)`](docs/API.md#getstatemountpathstate)
  * [`registerReducers(reducers)`](docs/API.md#registerreducersreducers)
