## Purposes
* Library provides simple API for manage React component state stored in Redux.
* Library provides simple API for interact between components through API Redux: dispatch actions, state selectors.
* Library provides simple API for creation of the reused components which can placement of a state in the common Redux store or create incapsulated state.
* Library provides simple API for gradual registration of reducer at any nesting level of Redux store.

## API
### `createReducer(config)`
Function creates and registers special reducer in Redux store, and provides simple API to manage of its state.

#### Arguments
* `config` (*Object*)
  * `[mountPath]`\(*string*): if argument is specified, it defines reducer mounting path. Argument consist from object keys separated by spaces.
  * `initialState`\(*Object*): argument defines reducer initial state.
  * `initialState(props): Object`\(*Function*): function receives props and must return object described above.  
  * `[listenActions]`\(*Object*): if argument is specified, it defines listeners to actions.
    * `key`\(*string*): action type.
    * `value`\(*Function*): reducer.
  * `[listenActions(props, actionPrefix): Object]`\(*Function*): if argument is specified, it defines function which receives props and actionPrefix and must return object described above.  
  * `connectToStore = true`\(*boolean*): default argument defines connect to current registered reducer by library `react-redux` and state is transferred in `reduxState` prop. If argument specified to `false` then manual connect needed.
  * `persist = true`\(*boolean*): default argument defines need to keeps current reducer state in case of component is unmounted. If argument specified to `false` then reducer state to reset.  
  * `[actionPrefix]`\(*string*): if argument is specified, it defines prefix for actions dispatched by `setReduxState` and `resetReduxState` described below.
  
#### Props
Props must be specified in case reused components creations.
* `[reduxMountPath]`\(*string*) if prop is specified, it behaves just as `mountPath` argument. If also argument `mountPath` is specified, then they concatenates by rule: `reduxMountPath + mountPath`  
* `[reduxPersist]`\(*boolean*) if prop is specified, it behaves just as `persist` argument. The prop replaces an argument.
* `[reduxActionPrefix]`\(*string*) if prop is specified, it behaves just as `actionPrefix` argument. The prop replaces an argument.

#### Remarks
* Mounting path is required and must be transferred through argument and(or) prop.
* If action prefix isn't transferred through argument and prop, then action prefix will be filled to mounting path.
* If Redux store isn't created and isn't provides to components, then Redux store will be to automatic created.

### `enhanceStore`
Function enhance an object of Redux store with the `registerReducers` method for gradual registration of reducer at any nesting level of Redux store.
  
#### Example
Creation of enhanced store:
```javascript
import { createStore } from 'redux';
import { enhanceStore } from 'redux-fly';

const store = createStore(null, enhanceStore);
```  
<br/>
Creation of enhanced store with preloaded state received from server or saved in any storage:  
```javascript 
const store = createStore(null, window.__INITIAL_STATE__, enhanceStore);
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
  
### `getState(mountPath)(state)`
Function to extract part of Redux state through mounting path.

#### Arguments
* `mountPath`\(*string*): argument defines path of mounting Redux component state.
* `state`\(*Object*): argument defines Redux state.

#### Example

Not reused component.
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
Reused component.
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
  * `key`\(*string*): argument defines reducer mounting path. Argument consist from object keys separated by spaces.
  * `value`\(*Function*): argument defines reducer.
* `reducers(props): Object`\(*Function*): argument defines function which receives props and function must return an object described above.  

#### Returns
Function to return React component class that register the passed reducers in Redux store.

#### Remarks
* Function must be call two times. The first time with its arguments described above, and a second time, with the component: `registerReducers(reducers)(MyComponent)`.
* Function does not modify the passed React component. It returns a new component that you should use instead.

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
  connect(state => ({ todo: state.ui.todo })),
  registerReducers({ 'ui todo': todoReducer })  
)(Component)
```

##### Reused component.
```javascript
import { getState, registerReducers } from 'redux-fly';
...
export default compose(
  connect((state, ownProps) => ({ todo: getState(`${ownProps.reduxMountPath} todo`)(state) })),
  registerReducers(props => ({ [`${props.reduxMountPath} todo`]: todoReducer }))  
)(Component)
```
