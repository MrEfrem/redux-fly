# Redux-fly
The purpose of library to provide simple API for:
* Reducers registration at any time to any place in store of Redux. It provides opportunity for encapsulation of reducer logic, code splitting and creation of reused components.
* Creation and controlling of component state which is saved in store of Redux.

[![Build Status](https://travis-ci.org/MrEfrem/redux-fly.svg?branch=master)](https://travis-ci.org/MrEfrem/redux-fly)

#### Example of a modal window component which stores its state in Redux and interacts with other components through public actions and state selectors.
```javascript
import React, { PropTypes } from 'react';
import { createReducer, getState } from 'redux-fly';
import { MENU_OPEN } from './Menu';

// Type of window closing action (other components might listen)
export const PRIVATE_CLOSE_MODAL = 'filters modal/PRIVATE-CLOSE-MODAL';

// To open a modal is public action creator (other components might control)
export const openModal = () => ({
  type: 'PUBLIC-OPEN-MODAL'
});

// To close a modal is public action creator (other components might control)
export const closeModal = () => ({
  type: 'PUBLIC-CLOSE-MODAL'
});

// Check is opened modal (other components might check)
export const isOpened = (state) => getState('filters modal')(state).opened;


const Modal = ({ reduxState: { opened }, children, reduxSetState }) => (
  <div style={{ display: opened ? 'block' : 'none' }}>
    <a onClick={() => reduxSetState('PRIVATE-CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
  </div>
);

Modal.propTypes = {
  reduxState: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  reduxSetState: PropTypes.func.isRequired
};

export default createReducer({
  mountPath: 'filters modal', // Path for mounting component state in Redux
  initialState: ({
    opened: false
  }),
  listenActions: { // Listen public actions
    'PUBLIC-OPEN-MODAL': (state, action) => ({ opened: true }),
    'PUBLIC-CLOSE-MODAL': (state, action) => ({ opened: false })
    [MENU_OPEN]: (state, action) => ({ opened: false }) // Action of other component, for example is opening menu
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
* [Universal](examples/universal). Example to use `redux-fly` for creation of component state and showin how to implement the universal rendering.
* [Reused components](examples/reused_components). Example to use `redux-fly` for creation reused components and showin how to implement the interaction between components.
