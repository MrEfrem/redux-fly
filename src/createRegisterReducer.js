// @flow
import React from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE, MOUNT_PATH } from './consts'
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
export default function createRegisterReducer(mountPath: string, preloadedState: Object, listenActions?: Object, options: Object,
  WrappedComponent: any
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

    uuid: any
    reducer: ?Object
    setReduxState: any
    resetReduxState: any


    componentWillMount() {
      const { store } = this.context
      this.uuid = genUUIDv4()
      this.reducer = {
        [mountPath]: createBoundedReducer(this.uuid, mountPath, preloadedState, listenActions || {}),
      }
      // Registration of created reducer
      store.registerReducers(this.reducer)
      // Binding setReduxState with redux store
      this.setReduxState = setReduxState(this.uuid, mountPath, store.dispatch, store.getState)
      // Action creator RESET redux state
      this.resetReduxState = () => store.dispatch({
        type: RESET_STATE,
        [MOUNT_PATH]: mountPath
      })
    }

    componentWillUnmount() {
      // If component isn't persist then RESET redux state
      if (!persist) {
        this.resetReduxState()
      }
      this.reducer = null
      this.setReduxState = null
      this.uuid = null
      this.resetReduxState = null
    }

    render() {
      return (
        <ChildComponent
          {...this.props}
          setReduxState={this.setReduxState}
          resetReduxState={this.resetReduxState()}
          reduxMountedPath={mountPath}
        />
      )
    }
  }
}
