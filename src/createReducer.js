// @flow
import React from 'react'
import { checkMountPath } from './utils/checks'
import createRegisterReducer from './createRegisterReducer'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'
import { normalizeMountPath } from './utils/normalize'

/**
 * Check preloadedState
 * @param  {Object} preloadedState
 * @return {void}
 */
const checkPreloadedState = (preloadedState: any) => {
  if (!isPlainObject(preloadedState)) {
    throw new Error('PreloadedState must be plain object')
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
 * Check options
 * @param  {Object} options
 * @return {void}
 */
const checkOptions = (options: any) => {
  if (typeof options !== 'undefined' && !isPlainObject(options)) {
    throw new Error('Options must be plain object ')
  }
}

/**
 * Check properties of an object options
 * @param  {Array}  default options
 * @param  {Object}  options
 * @return {void}
 */
const checkDetailOptions = (defaultOptions, options) => {
  if (typeof options.connectToStore !== 'boolean') {
    throw new Error('ConnectToStore must be boolean')
  }
  checkPersist(options.persist)
  if (options.actionPrefix) {
    checkActionPrefix(options.actionPrefix)
  }
  if (process.env.NODE_ENV !== 'production') {
    const undefinedOptions = Object.keys(options).reduce((prev, next) => {
      if (defaultOptions.indexOf(next) === -1) {
        prev = `${prev}${next}, `
      }
      return prev
    }, '').slice(0, -2)
    if (undefinedOptions) {
      warning(`Undefined options: ${undefinedOptions}`)
    }
  }
}

/**
 * Create/mount reducer
 * @param  {string | Function} mountPath
 * @param  {Function | Object} preloadedState
 * @param  {Function | Object} listenActions
 * @param  {Object} options
 * @return {
 *   @param {Object} wrapped React component
 *   @return {Object} React component
 * }
 */
export default (
  mountPath: any,
  preloadedState: any,
  listenActions: any,
  options: any
) => {
  if (mountPath && typeof mountPath !== 'function') {
    checkMountPath(mountPath)
  }

  if (typeof preloadedState !== 'function') {
    checkPreloadedState(preloadedState)
  }

  if (listenActions && typeof listenActions !== 'function') {
    checkListenActions(listenActions)
  }

  checkOptions(options)

  if (typeof options === 'undefined') {
    options = {}
  }
  const defaultOptions = {
    connectToStore: true,
    persist: false,
    actionPrefix: '',
  }
  const _options = {
    ...defaultOptions,
    ...options
  }
  checkDetailOptions(Object.keys(defaultOptions), _options)

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
          // Priority mountPath from props
          if (propMountPath) {
            realMountPath = propMountPath
          } else {
            realMountPath = mountPath
          }
          originalMountPath = realMountPath
        }
        realMountPath = normalizeMountPath(realMountPath)
        originalMountPath = normalizeMountPath(originalMountPath)

        // Priority actionPrefix from props
        if (typeof propActionPrefix !== 'undefined') {
          checkActionPrefix(propActionPrefix)
          _options.actionPrefix = propActionPrefix
        }

        // Default value for action prefix contain mount path
        if (!_options.actionPrefix) {
          _options.actionPrefix = `${originalMountPath}/`
        }

        // Priority persist from props
        if (typeof propPersist !== 'undefined') {
          checkPersist(propPersist)
          _options.persist = propPersist
        }

        let _preloadedState = preloadedState
        if (typeof _preloadedState === 'function') {
          _preloadedState = _preloadedState(props)
          checkPreloadedState(_preloadedState)
        }

        let _listenActions = listenActions
        if (typeof _listenActions === 'function') {
          _listenActions = _listenActions(props, _options.actionPrefix)
          checkListenActions(_listenActions)
        }

        this.RegisterReducer = createRegisterReducer(originalMountPath, realMountPath, _preloadedState, _listenActions,
          _options, WrappedComponent)
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
