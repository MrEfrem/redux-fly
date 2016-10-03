import React from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import { checkMountPath, checkInitialState, checkListenActions, checkOptions, checkDetailOptions }
  from './checks'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE } from './actions'
import getState from './getState'

/**
 * Create/mount reducer
 * @param  {string} mountPath
 * @param  {Object} initialState
 * @param  {Object} listenActions
 * @param  {Object} options
 * @return {function} HOC
 */
export default (
  mountPath,
  initialState,
  listenActions,
  options = {}
) => {
  checkMountPath(mountPath)
  checkInitialState(initialState)
  checkListenActions(listenActions)
  checkOptions(options)
  const _options = {
    connectToStore: true,
    unregisterInUnmount: false,
    ...options
  }
  checkDetailOptions(_options)

  const { connectToStore, unregisterInUnmount } = _options

  const reducer = {
    [mountPath]: createBoundedReducer(mountPath, initialState, listenActions || {}),
  }

  return (WrappedComponent) => {
    let ChildComponent = WrappedComponent
    if (connectToStore) {
      ChildComponent = connect(getState(mountPath))(WrappedComponent)
    }
    return class RegisterReducer extends React.Component {
      static contextTypes = {
        store: storeShape,
      }

      constructor(props, context) {
        super(props, context)
        const { store } = context
        // Binding setReduxState with redux store
        this.setReduxState = setReduxState(mountPath, store.dispatch, store.getState)
      }

      componentWillMount() {
        const { store } = this.context
        // Registration of created reducer
        store.registerReducers(reducer)
      }

      componentWillUnmount() {
        if (unregisterInUnmount) {
          const { store } = this.context
          store.dispatch({
            type: RESET_STATE,
            instance: mountPath,
          })
          store.unregisterReducers(reducer)
        }
      }

      render() {
        return (
          <ChildComponent
            {...this.props}
            setReduxState={this.setReduxState}
          />
        )
      }
    }
  }
}
