// @flow
import React, { PropTypes } from 'react'
import isPlainObject from 'lodash/isPlainObject'
import { createStore, compose } from 'redux'
import { connect, Provider } from 'react-redux'
import { checkMountPath } from './utils/checks'
import { normalizeMountPath } from './utils/normalize'
import storeShape from './utils/storeShape'
import enhanceStore from './enhanceStore'
import createBoundedReducer from './createBoundedReducer'
import reduxSetState from './reduxSetState'
import { RESET_STATE, MOUNT_PATH, NEW_STATE } from './consts'
import getState from './getState'
import type { store as typeStore } from './types'

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
 * Function creates and registers special reducer in Redux store,
 * and provides simple API to manage of its state.
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

  return (WrappedComponent: ReactClass<*>) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape,
        reduxMountPaths: PropTypes.arrayOf(PropTypes.string),
        lastReduxMountPath: PropTypes.string
      }

      static childContextTypes = {
        reduxMountPaths: PropTypes.arrayOf(PropTypes.string),
        lastReduxMountPath: PropTypes.string
      }

      getChildContext = () => ({
        reduxMountPaths: this.reduxMountPaths,
        lastReduxMountPath: this.lastReduxMountPath
      });

      store: ?Object
      reduxSetState: ?Function
      reduxResetState: any
      ChildComponent: any
      persist: ?boolean
      actionPrefix: any
      reduxMountPaths: any
      dispatch: ?Function
      lastReduxMountPath: ?string

      props: {
        reduxMountPath: string,
        reduxPersist: boolean,
        reduxActionPrefix: string
      }

      constructor(props: any, context: any) {
        super(props, context)
        let { store }: { store: typeStore } = context
        this.reduxMountPaths = context.reduxMountPaths || []
        this.lastReduxMountPath = context.lastReduxMountPath || ''
        this.store = null

        let { reduxMountPath: propMountPath, reduxPersist: propPersist, reduxActionPrefix: propActionPrefix } = props

        if (typeof propMountPath !== 'undefined') {
          checkMountPath(propMountPath)
        }

        if (!mountPath && !propMountPath) {
          throw new Error('Mounting path must be defined')
        }
        const _mountPath = normalizeMountPath(`${propMountPath || ''} ${mountPath || ''}`)

        if (this.reduxMountPaths.some(path => path === _mountPath)) {
          throw new Error(`Mounting path "${_mountPath}" already busy`)
        }
        if (this.lastReduxMountPath && _mountPath.indexOf(this.lastReduxMountPath) === -1) {
          throw new Error(`Mounting path "${_mountPath}" must be contain "${this.lastReduxMountPath}"`)
        }
        this.reduxMountPaths.push(_mountPath)

        let _connectToStore = connectToStore
        this.actionPrefix = actionPrefix
        this.persist = persist

        // Priority actionPrefix from props
        if (typeof propActionPrefix !== 'undefined') {
          checkActionPrefix(propActionPrefix)
          this.actionPrefix = propActionPrefix
        }

        // Default value for action prefix contain mounting path
        if (!this.actionPrefix) {
          if (typeof propMountPath !== 'undefined') {
            this.actionPrefix = `${normalizeMountPath(propMountPath)}/`
          } else {
            this.actionPrefix = `${normalizeMountPath(mountPath)}/`
          }
        }

        // Priority persist from props
        if (typeof propPersist !== 'undefined') {
          checkPersist(propPersist)
          this.persist = propPersist
        }

        let _initialState = initialState
        if (typeof _initialState === 'function') {
          _initialState = _initialState(props)
          checkInitialState(_initialState)
        }

        let _listenActions = listenActions
        if (typeof _listenActions === 'function') {
          _listenActions = _listenActions(props, this.actionPrefix)
          checkListenActions(_listenActions)
        }

        if (typeof propMountPath !== 'undefined') {
          if (typeof store === 'undefined') {
            throw new Error('Redux store must be created')
          }
          if (typeof store.registerReducers !== 'function') {
            throw new Error('Redux store must be enhanced with redux-fly')
          }
          this.lastReduxMountPath = normalizeMountPath(propMountPath)
        }

        if (typeof store === 'undefined' || typeof store.registerReducers !== 'function') {
          const composeEnhancers =
            process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
          store = (createStore(() => {}, composeEnhancers(enhanceStore)): typeStore)
          this.store = store
        }

        this.dispatch = store.dispatch

        this.ChildComponent = WrappedComponent
        if (_connectToStore) {
          this.ChildComponent = connect((state) =>
            ({ reduxState: getState(_mountPath)(state) })
          )(WrappedComponent)
        }

        // Creation and registration reducer
        store.registerReducers({
          [_mountPath]: createBoundedReducer(_mountPath, _initialState, _listenActions || {}, this.actionPrefix),
        })
        // Binding reduxSetState with redux store
        this.reduxSetState = reduxSetState(_mountPath, store.dispatch, store.getState, this.actionPrefix)
        // Action creator RESET redux state
        this.reduxResetState = () => store.dispatch({
          type: `${this.actionPrefix}${RESET_STATE}`,
          [MOUNT_PATH]: _mountPath,
          [NEW_STATE]: (_initialState: Object),
        })
      }

      componentWillUnmount() {
        // If component isn't persist then RESET redux state
        if (!this.persist) {
          this.reduxResetState()
        }
        this.store = null
        this.ChildComponent = null
        this.reduxSetState = null
        this.actionPrefix = null
        this.reduxResetState = null
        this.persist = null
        this.reduxMountPaths = null
        this.dispatch = null
        this.lastReduxMountPath = null
      }

      render() {
        let ChildComponent = this.ChildComponent
        let Component = (
          <ChildComponent
            {...this.props}
            reduxSetState={this.reduxSetState}
            reduxResetState={this.reduxResetState}
            reduxActionPrefix={this.actionPrefix}
            reduxPersist={this.persist}
            dispatch={this.dispatch}
          />
        )

        if (this.store) {
          return (
            <Provider store={this.store}>
              {Component}
            </Provider>
          )
        }
        return Component
      }
    }
}
