// @flow
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE, MOUNT_PATH, UUID } from './consts'
import getState from './getState'
import genUUIDv4 from './genUUIDv4'

/**
 * Create and mount reducer
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
  const { connectToStore, persist, actionPrefix } = options
  let ChildComponent = WrappedComponent
  if (connectToStore) {
    ChildComponent = connect((state) =>
      ({ reduxState: getState(mountPath)(state) })
    )(WrappedComponent)
  }
  const uuid = genUUIDv4()
  return class RegisterReducer extends React.Component {
    static contextTypes = {
      store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape
    }

    reducer: ?Object
    setReduxState: any
    resetReduxState: any
    batchActions: any

    componentWillMount() {
      const { store } = this.context
      if (typeof store !== 'object') {
        throw new Error('Redux store must be created')
      }
      if (typeof store.registerReducers !== 'function') {
        throw new Error('Redux store must be enhanced with redux-fly')
      }
      this.reducer = {
        [mountPath]: createBoundedReducer(uuid, mountPath, preloadedState, listenActions || {}),
      }
      // Registration of created reducer
      store.registerReducers(this.reducer)
      // Binding setReduxState with redux store
      this.setReduxState = setReduxState(uuid, mountPath, store.dispatch, store.getState, actionPrefix)
      // Action creator RESET redux state
      this.resetReduxState = () => store.dispatch({
        type: RESET_STATE,
        [MOUNT_PATH]: mountPath,
        [UUID]: uuid
      })
    }

    componentWillUnmount() {
      // If component isn't persist then RESET redux state
      if (!persist) {
        this.resetReduxState()
      }
      this.reducer = null
      this.setReduxState = null
      this.resetReduxState = null
      this.batchActions = null
    }

    render() {
      return (
        <ChildComponent
          {...this.props}
          setReduxState={this.setReduxState}
          resetReduxState={this.resetReduxState}
          reduxMountedPath={mountPath}
          persist={process.env.NODE_ENV === 'test' ? persist : null}
        />
      )
    }
  }
}
