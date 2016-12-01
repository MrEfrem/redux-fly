# Redux-fly
The library is focused on to providing simple API for:
* Reducers registration at any time to any place in store of Redux.
* Simple creation and mutation of component state, similar to local state, which is stored in store of Redux.
* Creation of reused components which store own state in store of Redux.

[![Build Status](https://travis-ci.org/MrEfrem/redux-fly.svg?branch=master)](https://travis-ci.org/MrEfrem/redux-fly)

#### Example of container component creation which stores the state in store of Redux.
```javascript
// Root component
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { enhanceStore } from 'redux-fly';
import Counter from './Counter';

const store = createStore(() => {}, enhanceStore);

export default () => (
  <Provider store={store}>
    <Counter/>
  </Provider>
);

// Counter component
import React from 'react';
import { createReducer } from 'redux-fly';

const Counter = ({ reduxState: { counter }, reduxSetState }) => (
  <div>
    Clicked: {counter} times
    {' '}
    <button onClick={() => reduxSetState('INCREMENT', state => ({ counter: state.counter + 1 }))}>
      +
    </button>
  </div>
);

export default createReducer({
  mountPath: 'ui counter', // Reducer mounting path
  initialState: {
    counter: 0
  }
})(Counter);
```

#### Example of creation reused modal window component which stores the state in store of Redux.
```javascript
// Modal window component
import React from 'react';
import { createReducer, getState } from 'redux-fly';
import { MENU_OPEN } from './Menu'; // Action of other component

// Type of window closing action (other components might listen in reducers)
export const actionPrivateCloseModal = (actionPrefix) => `${actionPrefix}/@PRIVATE-CLOSE-MODAL`;

// To open a modal is public action creator (other components might control the state)
export const createActionOpenModal = (actionPrefix) => ({ type: `${actionPrefix}/PUBLIC-OPEN-MODAL` });

// To close a modal is public action creator (other components might control the state)
export const createActionCloseModal = (actionPrefix) => ({ type: `${actionPrefix}/PUBLIC-CLOSE-MODAL` });

// Check is opened modal (other components might check the state)
export const isOpened = (mountPath, allState) => {
  const state = getState(mountPath)(allState)
  if (state) {
    return state.opened
  } else {
    throw new Error(`Mounting path ${mountPath} isn't valid`)
  }
}

const Modal = ({ reduxState: { opened }, children, reduxSetState }) => (
  <div style={{ display: opened ? 'block' : 'none' }}>
    <a onClick={() => reduxSetState('PRIVATE-CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
  </div>
);

export default createReducer({
  initialState: ({
    opened: false
  }),
  listenActions: (props, actionPrefix) => ({ // Listen public actions
    [createActionOpenModal(actionPrefix).type]: (state, action) => ({ opened: true }),
    [createActionCloseModal(actionPrefix).type]: (state, action) => ({ opened: false })
    [MENU_OPEN]: (state, action) => ({ opened: false }) // Listen action of other component
  })
})(Modal);
```

#### Example of mounting canonical reducer.
```javascript
import React from 'react';
import { registerReducers } from 'redux-fly';
import { connect } from 'react-redux';
import { compose } from 'redux';
import reducer, { * as actionCreators } from './reducer';

const Counter = ({ counter, increment }) => (
  <div>
    Clicked: {counter} times
    {' '}
    <button onClick={() => increment()}>
      +
    </button>
  </div>
);

export default compose(
  registerReducers({
    'ui counter': reducer
  }),
  connect((state) => ({ counter: state.ui.counter.value }), actionCreators)
)(Counter);
```

Is more information and examples below.

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

## Examples ([view](https://mrefrem.github.io/))
All examples use [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) if it is installed in browser.
* [Counter](examples/counter). Example to use `redux-fly` component state.
* [Async](examples/async). Example to use of mix canonical reducer and `redux-fly` component state.
* [Universal](examples/universal). Example to use `redux-fly` for creation of component state and showin how to implement the universal rendering.
* [Reused components](examples/reused_components). Example to use `redux-fly` for creation reused components and showin how to implement the interaction between components.
* [Nested reused components](examples/nested_reused_components). Example to use `redux-fly` for creation nested reused in reused components.
