import React from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE, MOUNT_PATH, UUID } from './consts'
import getState from './getState'
import genUUIDv4 from './genUUIDv4'

/**
 * Create/mount reducer
 * @param  {string} mountPath
 * @param  {Object} initialState
 * @param  {Object} listenActions
 * @param  {Object} options
 * @param {Object} wrapped React component
 * @return {void}
 */
export default function createRegisterReducer(mountPath, initialState, listenActions, options,
  WrappedComponent
) {
  const { connectToStore, unregisterInUnmount } = options
  let ChildComponent = WrappedComponent
  if (connectToStore) {
    ChildComponent = connect(getState(mountPath))(WrappedComponent)
  }
  return class RegisterReducer extends React.Component {
    static contextTypes = {
      store: storeShape,
    }

    constructor(props) {
      super(props)
      this.unmounted = false
    }

    componentWillMount() {
      if (unregisterInUnmount && this.unmounted || !this.unmounted) {
        const { store } = this.context
        this.uuid = genUUIDv4
        this.reducer = {
          [mountPath]: createBoundedReducer(this.uuid, mountPath, initialState, listenActions || {}),
        }
        // Registration of created reducer
        store.registerReducers(this.reducer)
        // Binding setReduxState with redux store
        this.setReduxState = setReduxState(this.uuid, mountPath, store.dispatch, store.getState)
      }
    }

    componentWillUnmount() {
      if (unregisterInUnmount) {
        const { store } = this.context
        store.dispatch({
          type: RESET_STATE,
          [MOUNT_PATH]: mountPath,
          [UUID]: this.uuid,
        })
        store.unregisterReducers(this.reducer)
        this.uuid = null
        this.reducer = null
        this.setReduxState = null
      }
      this.unmounted = true
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
