// @flow
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import storeShape from './utils/storeShape'
import createBoundedReducer from './createBoundedReducer'
import setReduxState from './setReduxState'
import { RESET_STATE, MOUNT_PATH } from './consts'
import getState from './getState'

/**
 * Create/registration/mount reducer
 * @param  {string} originalMountPath
 * @param  {string} mountPath
 * @param  {Object} initialState
 * @param  {Object} listenActions (optional)
 * @param  {Object} options
 * @param  {Component} WrappedComponent
 * @return {Component} new component
 */
export default function createRegisterReducer(originalMountPath: string, mountPath: string, initialState: Object, listenActions?: Object, options: Object,
  WrappedComponent: any
) {
  const { connectToStore, persist, actionPrefix } = options
  let ChildComponent = WrappedComponent
  if (connectToStore) {
    ChildComponent = connect((state) =>
      ({ reduxState: getState(mountPath)(state) })
    )(WrappedComponent)
  }
  return class RegisterReducer extends React.Component {
    static contextTypes = {
      store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape
    }

    setReduxState: any
    resetReduxState: any

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
        [mountPath]: createBoundedReducer(mountPath, initialState, listenActions || {}, actionPrefix),
      })
      // Binding setReduxState with redux store
      this.setReduxState = setReduxState(mountPath, store.dispatch, store.getState, actionPrefix)
      // Action creator RESET redux state
      this.resetReduxState = () => store.dispatch({
        type: `${actionPrefix}${RESET_STATE}`,
        [MOUNT_PATH]: mountPath
      })
    }

    componentWillUnmount() {
      // If component isn't persist then RESET redux state
      if (!persist) {
        this.resetReduxState()
      }
      this.setReduxState = null
      this.resetReduxState = null
    }

    render() {
      let Component = (
        <ChildComponent
          {...this.props}
          setReduxState={this.setReduxState}
          resetReduxState={this.resetReduxState}
          reduxMountPath={originalMountPath}
        />
      )
      if (process.env.NODE_ENV === 'test') {
        Component = React.cloneElement(Component, {
          persist: persist.toString(),
          actionPrefix
        })
      }
      return Component
    }
  }
}
