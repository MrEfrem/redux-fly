// @flow
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE, UUID } from './consts'
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

    setReduxState: any
    resetReduxState: any
    batchUpdate: any

    constructor(props: any, context: any) {
      super(props, context)

      const { store } = context
      if (typeof store !== 'object') {
        throw new Error('Redux store must be created')
      }
      if (typeof store.registerReducers !== 'function') {
        throw new Error('Redux store must be enhanced with redux-fly')
      }
      // Creation and registration reducer
      store.registerReducers({
        [mountPath]: createBoundedReducer(uuid, preloadedState, listenActions || {}, actionPrefix),
      })
      this.batchUpdate = {}
      // Binding setReduxState with redux store
      this.setReduxState = setReduxState(uuid, mountPath, store.dispatch, store.getState, actionPrefix, this.batchUpdate)
      // Action creator RESET redux state
      this.resetReduxState = () => store.dispatch({
        type: `${actionPrefix}${RESET_STATE}`,
        [UUID]: uuid
      })
    }

    componentWillUnmount() {
      // If component isn't persist then RESET redux state
      if (!persist) {
        this.resetReduxState()
      }
      this.setReduxState = null
      this.resetReduxState = null
      this.batchUpdate = null
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
