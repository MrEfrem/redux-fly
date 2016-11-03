// @flow
import React from 'react'
import { checkMountPath } from './utils/checks'
import createRegisterReducer from './createRegisterReducer'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'
import { normalizeMountPath } from './utils/normalize'

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
  mountPath?: string | Function,
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
  if (mountPath && typeof mountPath !== 'function') {
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
      RegisterReducer: any
      propMountPath: ?string

      props: {
        reduxMountPath: string,
        reduxPersist: boolean
      }

      constructor(props: any) {
        super(props)

        let { reduxMountPath: propMountPath, reduxPersist: propPersist, reduxActionPrefix: propActionPrefix } = props

        if (typeof propMountPath !== 'undefined') {
          if (process.env.NODE_ENV !== 'production' && typeof mountPath === 'string') {
            warning('Ignoring reduxMountPath because mountPath pass as string')
          }
          checkMountPath(propMountPath)
        }

        let originalMountPath = null
        let realMountPath = null
        if (typeof mountPath === 'function') {
          if (!propMountPath) {
            throw new Error('Mount path must be passed in props')
          }
          originalMountPath = propMountPath
          realMountPath = mountPath(normalizeMountPath(propMountPath))
          checkMountPath(realMountPath)
        } else {
          if (!mountPath && !propMountPath) {
            throw new Error('Mount path must be defined')
          }
          if (mountPath) {
            realMountPath = mountPath
          } else {
            realMountPath = propMountPath
          }
          originalMountPath = realMountPath
        }
        realMountPath = normalizeMountPath(realMountPath)
        originalMountPath = normalizeMountPath(originalMountPath)

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
          options.actionPrefix = `${originalMountPath}/`
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

        this.RegisterReducer = createRegisterReducer(originalMountPath, realMountPath, _initialState, _listenActions,
          options, WrappedComponent)
      }

      componentWillUnmount() {
        this.RegisterReducer = null
      }

      render() {
        const RegisterReducer = this.RegisterReducer
        return <RegisterReducer {...this.props} />
      }
    }
}
