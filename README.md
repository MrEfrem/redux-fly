## Purposes
* Provides simple API for manage React component state stored in Redux.
* Provides simple API for interact between components through API Redux: dispatch actions, state selectors.
* Provides simple API for creation of the reused components which can placement of a state in the common Redux tree or create incapsulated state.
* Provides simple API for registration canonical reducers in React lifecycle.

## API
* `enhanceStore`

  Store enhancer. Extend store object with `registerReducers` method for gradual registration of the reducers.
  
  #### Example
  ```
  import { createStore } from 'redux';
  import { enhanceStore } from 'redux-fly';
    
  const store = createStore(null, enhanceStore);
  ```
  
* `createReducer`
* `getState(mountPath)(state)`

  Get component state by mount path.
  
  #### Arguments
  * `mountPath`\(*string*): Path of mounting redux component state.
  * `state`\(*Function*): All Redux state.
  
  #### Example
  
  Not reused component.
  ##### Menu
  ```
  import { getState } from 'redux';    
  
  const boundedGetState = getState('ui menu');
            
  export const isOpened = (state) => boundedGetState(state).opened;
  export const isCollapsed = (state) => boundedGetState(state).collapsed;
  ```
  
  ##### Any component
  ```
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
  ##### Modal
  ```
  import { getState } from 'redux';    
            
  export const isOpened = (mountPath, state) => getState(mountPath)(state).opened;
  ```
  
  ##### Any component
  ```
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
  
* `registerReducers(reducers)`
