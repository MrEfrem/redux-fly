// @flow
import React from 'react'
import { checkMountPath, checkPreloadedState, checkOptions } from './checks'
import createRegisterReducer from './createRegisterReducer'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'
import { PROP_MOUNT_PATH } from './consts'

/**
 * Check listenActions
 * @param  {Object} listenActions
 * @return {void}
 */
const checkListenActions = (listenActions) => {
  if (listenActions && !isPlainObject(listenActions)) {
    throw new Error('ListenActions must be plain object')
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
    throw new Error('Option connectToStore must be boolean')
  }
  if (typeof options.persist !== 'boolean') {
    throw new Error('Option persist must be boolean')
  }
  if (process.env.NODE_ENV !== 'production') {
    const undefinedOptions = Object.keys(options).reduce((prev, next) => {
      if (!defaultOptions.includes(next)) {
        prev = `${prev}, `
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
  if (typeof mountPath !== 'undefined') {
    checkMountPath(mountPath)
    mountPath = mountPath.trim()
  }

  if (typeof preloadedState !== 'function') {
    checkPreloadedState(preloadedState)
  }

  if (typeof listenActions !== 'function') {
    checkListenActions(listenActions)
  }

  checkOptions(options)

  const defaultOptions = {
    connectToStore: true,
    persist: false,
  }
  const _options = {
    ...defaultOptions,
    ...options
  }
  checkDetailOptions(Object.keys(defaultOptions), _options)

  return (WrappedComponent: any) => {
    // Transferred some parameters is functions
    return class CreateReducer extends React.Component {
      WrappedComponent: any

      componentWillMount() {
        let { [PROP_MOUNT_PATH]: propMountPath } = this.props
        if (typeof mountPath === 'undefined' && typeof propMountPath === 'undefined') {
          throw new Error('Mount path must be defined')
        }
        if (typeof mountPath !== 'undefined' && typeof propMountPath !== 'undefined') {
          throw new Error('Many mount path passed')
        }
        let realMountPath = mountPath ? mountPath : propMountPath.trim()
        let _preloadedState = preloadedState
        if (typeof _preloadedState === 'function') {
          _preloadedState = _preloadedState(this.props, realMountPath)
          checkPreloadedState(_preloadedState)
        }

        let _listenActions = listenActions
        if (typeof _listenActions === 'function') {
          _listenActions = _listenActions(this.props, realMountPath)
          checkListenActions(_listenActions)
        }

        this.WrappedComponent = createRegisterReducer(realMountPath, _preloadedState, _listenActions,
          options, WrappedComponent)
      }

      componentWillUnmount() {
        this.WrappedComponent = null
      }

      render() {
        const WrappedComponent = this.WrappedComponent
        return <WrappedComponent {...this.props} />
      }
    }
  }
}
