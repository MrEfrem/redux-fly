// @flow
import React, { PropTypes } from 'react'
import { checkMountPath } from './utils/checks'
import createRegisterReducer from './createRegisterReducer'
import isPlainObject from 'lodash/isPlainObject'
import { normalizeMountPath } from './utils/normalize'
import storeShape from './utils/storeShape'
import { createStore, compose } from 'redux'
import enhanceStore from './enhanceStore'
import { Provider } from 'react-redux'

/**
 * Check initialState
 * @param  {Object} initialState
 * @return {void}
 */
const checkInitialState = (initialState: any) => {
  if (!isPlainObject(initialState)) {
    throw new Error('InitialState must be plain object')
  }
}

/**
 * Check listenActions
 */
const checkListenActions = (listenActions) => {
  if (!isPlainObject(listenActions)) {
    throw new Error('ListenActions must be plain object')
  }
}

/**
 * Check persist
 */
const checkPersist = (persist) => {
  if (typeof persist !== 'boolean') {
    throw new Error('Persist must be boolean')
  }
}

/**
 * Check action prefix
 */
const checkActionPrefix = (actionPrefix) => {
  if (typeof actionPrefix !== 'string' || !actionPrefix.length) {
    throw new Error('ActionPrefix must be non empty string')
  }
}

/**
 * Create reducer
 * @param {Object} config
 * @return {Function}
 *   @param {Component} WrappedComponent
 *   @return {Component} new component
 */
type ParamsType = {
  mountPath?: string,
  initialState: Object | Function,
  listenActions?: Object | Function,
  connectToStore: boolean,
  persist: boolean,
  actionPrefix?: string
}
export default ({
  mountPath,
  initialState,
  listenActions,
  connectToStore = true,
  persist = true,
  actionPrefix
}: ParamsType = {}) => {
  if (mountPath) {
    checkMountPath(mountPath)
  }
  if (typeof initialState !== 'function') {
    checkInitialState(initialState)
  }
  if (listenActions && typeof listenActions !== 'function') {
    checkListenActions(listenActions)
  }
  if (typeof connectToStore !== 'boolean') {
    throw new Error('ConnectToStore must be boolean')
  }
  checkPersist(persist)
  if (actionPrefix) {
    checkActionPrefix(actionPrefix)
  }

  return (WrappedComponent: any) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape
      }

      RegisterReducer: any
      propMountPath: ?string
      store: ?Object

      props: {
        reduxMountPath: string,
        reduxPersist: boolean
      }

      constructor(props: any, context: any) {
        super(props, context)

        if (!isPlainObject(context.store)) {
          const composeEnhancers =
            process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
          this.store = createStore(null, composeEnhancers(enhanceStore))
        }

        let { reduxMountPath: propMountPath, reduxPersist: propPersist, reduxActionPrefix: propActionPrefix } = props

        if (typeof propMountPath !== 'undefined') {
          checkMountPath(propMountPath)
        }

        if (!mountPath && !propMountPath) {
          throw new Error('Mount path must be defined')
        }
        const realMountPath = normalizeMountPath(`${propMountPath || ''} ${mountPath || ''}`)

        const options = {
          connectToStore,
          persist,
          actionPrefix,
        }
        // Priority actionPrefix from props
        if (typeof propActionPrefix !== 'undefined') {
          checkActionPrefix(propActionPrefix)
          options.actionPrefix = propActionPrefix
        }

        // Default value for action prefix contain mount path
        if (!options.actionPrefix) {
          options.actionPrefix = `${realMountPath}/`
        }

        // Priority persist from props
        if (typeof propPersist !== 'undefined') {
          checkPersist(propPersist)
          options.persist = propPersist
        }

        let _initialState = initialState
        if (typeof _initialState === 'function') {
          _initialState = _initialState(props)
          checkInitialState(_initialState)
        }

        let _listenActions = listenActions
        if (typeof _listenActions === 'function') {
          _listenActions = _listenActions(props, options.actionPrefix)
          checkListenActions(_listenActions)
        }

        this.RegisterReducer = createRegisterReducer(realMountPath, _initialState, _listenActions,
          options, WrappedComponent)
      }

      componentWillUnmount() {
        this.RegisterReducer = null
        this.store = null
      }

      render() {
        const RegisterReducer = this.RegisterReducer
        if (this.store) {
          return (
            <Provider store={this.store}>
              <RegisterReducer {...this.props} />
            </Provider>
          )
        }
        return <RegisterReducer {...this.props} />
      }
    }
}
