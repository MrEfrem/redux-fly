## API
### `createReducer(config)`
Function creates and registers special reducer in Redux store, and provides simple API to manage of its state.

#### Arguments
* `config` (*Object*)
  * `[mountPath]`\(*string*): if argument is specified, it defines reducer mounting path. Argument consists from object keys separated by spaces.
  * `initialState`\(*Object*): it defines reducer initial state.
  * `initialState(props): Object`\(*Function*): it receives props and must return object described above.
  * `[listenActions(state, action, props, actionPrefix): Object]`\(*Function*): if argument is specified, it defines function - [reducer](http://redux.js.org/docs/basics/Reducers.html)
    which receives into arguments the previous state, action, props and actionPrefix and returns the next state.
  * `connectToStore = true`\(*boolean*): default argument defines connect to current registered reducer by library `react-redux` and state is transferred in `reduxState` prop.
    If argument specified to `false` then manual connect needed.
  * `persist = true`\(*boolean*): default argument defines need to keeps current reducer state in case of component is unmounted. If argument specified to `false` then reducer state to reset.
  * `[actionPrefix]`\(*string*): if argument is specified, it defines prefix for actions dispatched by `reduxSetState` and `reduxResetState` described below.

#### Props
It must be specified in case reused components creations.
* `[reduxMountPath]`\(*string*) if prop is specified, it also replaces `mountPath` argument if `mountPath` isn't specified. But if also argument `mountPath` is specified,
  then they concatenates: `reduxMountPath + mountPath`
* `[reduxPersist]`\(*boolean*) if prop is specified, it behaves just as `persist` argument. The prop replaces an argument.
* `[reduxActionPrefix]`\(*string*) if prop is specified, it behaves just as `actionPrefix` argument. The prop replaces an argument.

#### Returns
A React component class that injects into your component an Redux state through prop `reduxState`, injects `reduxSetState`, `reduxResetState` functions for state change:
* `reduxSetState(actionType, newState)`\(*Function*): it dispatches Redux action with the `action prefix + actionType` type and the `newState` property. `newState` merge with current
  state through `Object.assign` and new object always returns.
* `reduxResetState()`\(*Function*): it dispatches Redux action with the `action prefix + reset action type` type and the `newState` property. `newState` replaces current state and new
  object always returns.
* `reduxPersist`\(*boolean*) it contains calculated `reduxPersist`.
* `reduxActionPrefix`\(*string*) it contains calculated `reduxActionPrefix`.
* `dispatch`\(*Function*) it is [dispatch](http://redux.js.org/docs/api/Store.html#dispatch) function of Redux store.

#### Remarks
* Mounting path is required and must be transferred through argument and(or) prop.
* If action prefix isn't transferred through argument and prop, then action prefix will be filled to mounting path.
* If prop `reduxMountPath` isn't specified and redux store isn't created and isn't provides to components, then Redux store is automatic created with
support [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension). But if prop `reduxMountPath` is specified and redux
store isn't created and isn't provides to components, then will throwing error, because prop `reduxMountPath` means mount point for state of reused component.

#### Example
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { enhanceStore, createReducer } from 'redux-fly';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(() => {}, composeEnhancers(enhanceStore));

const Welcome = ({ reduxState: { text }, reduxSetState, reduxResetState }) => (
  <div>
    <h1>{text}</h1>
    <input value={text} onChange={(e) => reduxSetState('CHANGE-TEXT', { text: e.target.value })} />
    <button onClick={() => reduxResetState()}>Reset</button>
  </div>
)

const EnhancedWelcome = createReducer({
  mountPath: 'welcome',
  initialState: {
    text: 'Hello world!'
  }
})(Welcome)

ReactDOM.render(
  <Provider store={store}>
    <EnhancedWelcome/>
  </Provider>
, document.getElementById('root'));
```

### `enhanceStore`
Function enhance an object of Redux store with the `registerReducers` method for gradual registration of reducer at any nesting level of Redux store.

#### `store.registerReducers(reducers)`
* `reducers`\(*Object*)
  * `key`\(*string*): it defines reducer mounting path. Argument consist from object keys separated by spaces.
  * `value`\(*Function*): it defines reducer.

#### Example
Creation of enhanced store:
```javascript
import { createStore } from 'redux';
import { enhanceStore } from 'redux-fly';

const store = createStore(() => {}, enhanceStore);
```
<br/>
Creation of enhanced store with preloaded state received from server or saved in any storage:
```javascript
const store = createStore(() => {}, window.__INITIAL_STATE__, enhanceStore);
```
<br/>
Creation of enhanced store and reducers registration:
```javascript
const reducers = {
  'ui component': (state, action) => { ... },
  'ui todo list': (state, action) => { ... }
}
const store = createStore(reducers, enhanceStore);
```
<br/>
Creation of enhanced store and reducers registration with preloaded state:
```javascript
const store = createStore(reducers, window.__INITIAL_STATE__, enhanceStore);
```

<br/>
Creation of enhanced store and registration of reducers later:
```javascript
import { createStore } from 'redux';
import { enhanceStore } from 'redux-fly';

const store = createStore(() => {}, enhanceStore);
...
const reducer = (state, action) => { ... };
store.registerReducers({ 'ui component': reducer });
```

### `getState(mountPath)(state)`
Function to extract part of Redux state through mounting path.

#### Arguments
* `mountPath`\(*string*): it defines path of mounting Redux component state.
* `state`\(*Object*): it defines Redux state.

#### Example

Not reused component:
##### Menu component
```javascript
import { getState } from 'redux';

const boundedGetState = getState('ui menu');

export const isOpened = (state) => boundedGetState(state).opened;
export const isCollapsed = (state) => boundedGetState(state).collapsed;
```

##### Any component
```javascript
import React, { PropTypes } from 'react';
import getContext from 'recompose/getContext'
import { isOpened as menuIsOpened, isCollapsed as menuIsCollapsed } from './Menu';

class SideBar extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { store } = this.props;
    if (menuIsOpened(store.getState())) {
      ...
    }
    if (menuIsCollapsed(store.getState())) {
      ...
    }
  }
  ...
}
export default getContext({ store: PropTypes.object.isRequired })(SideBar)
```
<br/>
Reused component:
##### Modal component
```javascript
import React from 'react';
import { getState } from 'redux';

export const isOpened = (mountPath, state) => getState(mountPath)(state).opened;
```

##### Any component
```javascript
import React, { PropTypes } from 'react';
import getContext from 'recompose/getContext'
import { isOpened as modalIsOpened } from './Modal';

class Component extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { store } = this.props;
    if (modalIsOpened('ui component', store.getState())) {
      ...
    }
  }
  ...
}
export default getContext({ store: PropTypes.object.isRequired })(Component)
```

### `registerReducers(reducers)`
Function registers reducers in Redux store.

#### Arguments
* `reducers`\(*Object*)
  * `key`\(*string*): it defines reducer mounting path. Argument consist from object keys separated by spaces.
  * `value`\(*Function*): it defines reducer.
* `reducers(props): Object`\(*Function*): it defines function which receives props and function must return an object described above.

#### Props
It must be specified in case reused components creations.
* `[reduxMountPath]`\(*string*) if prop is specified, then it concatenates with all keys in `reducers` argument: `reduxMountPath + key`

#### Returns
A React component class that register the passed reducers in Redux store.

#### Remarks
* Function must be call two times. The first time with its arguments described above, and a second time, with the component: `registerReducers(reducers)(MyComponent)`.
* Function does not modify the passed React component. It returns a new component that you should use instead.
* If prop `reduxMountPath` isn't specified and redux store isn't created and isn't provides to components, then Redux store is automatic created with
support [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension). But if prop `reduxMountPath` is specified and redux
store isn't created and isn't provides to components, then will throwing error, because prop `reduxMountPath` means mount point for state of reused component.

#### Example

##### Todo reducer
```javascript
export default (state, action) => { ... }
```

##### Not reused component.
```javascript
import React, { PropTypes } from 'react';
import { registerReducers } from 'redux-fly';
import { connect } from 'react-redux';
import { compose } from 'redux';
import todoReducer from './reducer';

const Component = ({ todo }) => { ... };
Component.propTypes = {
  todo: PropTypes.object.isRequired,
}

export default compose(
  registerReducers({ 'ui todo': todoReducer }),
  connect(state => ({ todo: state.ui.todo }))
)(Component)
```

##### Reused component.
```javascript
import { getState, registerReducers } from 'redux-fly';
...
export default compose(
  registerReducers(props => ({ todo: todoReducer })),
  connect((state, ownProps) => ({ todo: getState(`${ownProps.reduxMountPath} todo`)(state) }))
)(Component)
```
