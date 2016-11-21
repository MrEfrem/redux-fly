# Redux-fly
The purpose of library to provide simple API for:
* Reducers registration at any time to any place in store of Redux. It provides opportunity for encapsulation of reducer logic, code splitting and creation of reused components.
* Creation and controlling of component state which is saved in store of Redux.

[![Build Status](https://travis-ci.org/MrEfrem/redux-fly.svg?branch=master)](https://travis-ci.org/MrEfrem/redux-fly)

```javascript
import React from 'react'
import { createReducer, getState } from 'redux-fly'

const mountPath = 'filters modal'

// Public actions
const OPEN_MODAL = 'OPEN-MODAL'
const CLOSE_MODAL = 'CLOSE-MODAL'

// To open a modal is public action creator
export const openModal = () => ({
  type: OPEN_MODAL
})
// To close a modal is public action creator
export const closeModal = () => ({
  type: CLOSE_MODAL
})

// Check is opened modal
export const isOpened = (mountPath, state) => getState(mountPath)(state).opened

const Modal = ({ reduxState: { opened }, children, reduxSetState }) => (
  <div style={{ display: opened ? 'block' : 'none' }}>
    <a onClick={() => reduxSetState('CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
  </div>
);

export default createReducer({
  mountPath,
  initialState: ({
    opened: false
  }),
  listenActions: { // Listen public actions
    [OPEN_MODAL]: (state, action) => ({ open: true }),
    [CLOSE_MODAL]: (state, action) => ({ open: false })
  }
})(Modal);
```

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

## Examples
* [Counter](examples/counter). Example to use `redux-fly` component state.
* [Async](examples/async). Example to use of mix canonical reducer and `redux-fly` component state.
* [Universal](examples/universal). Example to use `redux-fly` component state and provide the universal rendering.
* [Reused components](examples/reused_components). Example to use `redux-fly` component state for creation reused components and providing of API for interaction between they.
