# Redux-fly
The purpose of library to provide simple API for:
* Reducers registration at any time to any place in store of Redux. It provides opportunity for encapsulation of reducer logic, code splitting and creation of reused components.
* Creation and controlling of component state which is saved in store of Redux.

[![Build Status](https://travis-ci.org/MrEfrem/redux-fly.svg?branch=master)](https://travis-ci.org/MrEfrem/redux-fly)

```javascript
const Modal = ({ reduxState: { text, open }, reduxSetState }) => (
  <div style={{ display: open ? 'block' : 'none' }}>
    <p>{text}</p>    
    <button onClick={() => reduxSetState('CLOSE-MODAL', { open: false })}>Close</button>
  </div>
)

const EnhancedWelcome = createReducer({
  mountPath: 'modal',
  initialState: ({ text = 'Hello world!' }) => ({
    open: false,
    text
  }),
  listenActions: {
    'OPEN-MODAL': (state, action) => ({ open: true }),
    'CLOSE-MODAL': (state, action) => ({ open: false })
  }
})(Modal)
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
