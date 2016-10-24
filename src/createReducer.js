// @flow
import React from 'react'
import { checkMountPath, checkPreloadedState, checkOptions } from './utils/checks'
import createRegisterReducer from './createRegisterReducer'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'
import { normalizeMountPath } from './utils/normalize'

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
  if (typeof options.actionPrefix !== 'string') {
    throw new Error('ActionPrefix must be string')
  }
  if (['production', 'test'].indexOf(process.env.NODE_ENV) === -1) {
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
 * @param  {string} mountPath
 * @param  {Object} preloadedState
 * @param  {Object} listenActions
 * @param  {Object} options
 * @return {
 *   @param {Object} wrapped React component
 *   @return {Object} React component
 * }
 */
export default (
  mountPath?: string,
  preloadedState: Function | Object,
  listenActions?: Function | Object,
  options: Object = {}
) => {
  if (mountPath || mountPath !== null) {
    checkMountPath(mountPath)
  }

  if (typeof preloadedState !== 'function') {
    checkPreloadedState(preloadedState)
  }

  if (listenActions && typeof listenActions !== 'function') {
    checkListenActions(listenActions)
  }

  checkOptions(options)

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
    // Transferred some parameters is functions
    class CreateReducer extends React.Component {
      RegisterReducer: any
      propMountPath: ?string

      props: {
        reduxMountPath: string,
        reduxPersist: boolean
      }

      constructor(props: any) {
        super(props)

        let { reduxMountPath: propMountPath, reduxPersist: propPersist } = props
        // Mount path must be passed in props or options
        if (!mountPath && !propMountPath) {
          throw new Error('Mount path must be defined')
        }

        let realMountPath = mountPath
        // Priority mount path from props
        if (typeof propMountPath !== 'undefined') {
          checkMountPath(propMountPath)
          realMountPath = propMountPath
        }
        realMountPath = normalizeMountPath(realMountPath)

        // Priority persist from props
        if (typeof propPersist !== 'undefined') {
          checkPersist(propPersist)
          _options.persist = propPersist
        }

        // Preloaded state is function
        let _preloadedState = preloadedState
        if (typeof _preloadedState === 'function') {
          _preloadedState = _preloadedState(props, realMountPath)
          checkPreloadedState(_preloadedState)
        }

        // Listen actions is function
        let _listenActions = listenActions
        if (typeof _listenActions === 'function') {
          _listenActions = _listenActions(props, realMountPath)
          checkListenActions(_listenActions)
        }

        this.RegisterReducer = createRegisterReducer(realMountPath, _preloadedState, _listenActions,
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
