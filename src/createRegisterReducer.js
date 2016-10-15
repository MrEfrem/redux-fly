import React from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE, MOUNT_PATH, PROP_MOUNT_PATH } from './consts'
import getState from './getState'
import genUUIDv4 from './genUUIDv4'

/**
 * Create/mount reducer
 * @param  {string} mountPath
 * @param  {Object} preloadedState
 * @param  {Object} listenActions
 * @param  {Object} options
 * @param {Object} wrapped React component
 * @return {Object} React component
 */
export default function createRegisterReducer(mountPath, preloadedState, listenActions, options,
  WrappedComponent
) {
  const { connectToStore, persist } = options
  let ChildComponent = WrappedComponent
  if (connectToStore) {
    ChildComponent = connect((state) =>
      ({ reduxState: getState(mountPath)(state) })
    )(WrappedComponent)
  }
  return class RegisterReducer extends React.Component {
    static contextTypes = {
      store: storeShape,
    }

    componentWillMount() {
      const { [PROP_MOUNT_PATH]: propMountPath } = this.props
      if (typeof mountPath === 'undefined' && typeof propMountPath === 'undefined') {
        throw new Error('Mount path must be defined')
      }
      if (typeof mountPath !== 'undefined' && typeof propMountPath !== 'undefined') {
        throw new Error('Many mount path passed')
      }
      this.realMountPath = mountPath ? mountPath : propMountPath.trim()
      const { store } = this.context
      this.uuid = genUUIDv4
      this.reducer = {
        [this.realMountPath]: createBoundedReducer(this.uuid, this.realMountPath, preloadedState, listenActions || {}),
      }
      // Registration of created reducer
      store.registerReducers(this.reducer, { replaceIfMatch: true })
      // Binding setReduxState with redux store
      this.setReduxState = setReduxState(this.uuid, this.realMountPath, store.dispatch, store.getState)
    }

    componentWillUnmount() {
      if (!persist) {
        const { store } = this.context
        store.dispatch({
          type: RESET_STATE,
          [MOUNT_PATH]: this.realMountPath
        })
        store.unregisterReducers(this.reducer)
      }
      this.uuid = null
      this.reducer = null
      this.setReduxState = null
      this.realMountPath = null
    }

    render() {
      return (
        <ChildComponent
          {...this.props}
          setReduxState={this.setReduxState}
          reduxMountedPath={this.realMountPath}
        />
      )
    }
  }
}
