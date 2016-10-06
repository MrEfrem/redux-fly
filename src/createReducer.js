import React from 'react'
import { checkMountPath, checkInitialState, checkOptions } from './checks'
import createRegisterReducer from './createRegisterReducer'
import { checkListenActions, checkDetailOptions } from './checks/createReducer'

/**
 * Create/mount reducer
 * @param  {string} mountPath
 * @param  {Object} initialState
 * @param  {Object} listenActions
 * @param  {Object} options
 * @return {
 *   @param {Object} wrapped React component
 *   @return {Object} React component
 * }
 */
export default (
  mountPath,
  initialState,
  listenActions,
  options = {}
) => {
  let needWrapped = false

  if (typeof mountPath !== 'function') {
    checkMountPath(mountPath)
  } else {
    needWrapped = true
  }

  if (typeof initialState !== 'function') {
    checkInitialState(initialState)
  } else {
    needWrapped = true
  }

  if (typeof listenActions !== 'function') {
    checkListenActions(listenActions)
  } else {
    needWrapped = true
  }

  checkOptions(options)

  const defaultOptions = {
    connectToStore: true,
    unregisterInUnmount: false,
  }
  const _options = {
    ...defaultOptions,
    ...options
  }
  checkDetailOptions(Object.keys(defaultOptions), _options)

  return (WrappedComponent) => {
    // Not transferred parameters is functions
    if (!needWrapped) {
      return createRegisterReducer(mountPath, initialState, listenActions, options,
        WrappedComponent)
    }

    // Transferred some parameters is functions
    return class CreateReducer extends React.Component {
      componentWillMount() {
        let _mountPath = mountPath
        if (typeof _mountPath === 'function') {
          _mountPath = _mountPath(this.props)
          checkMountPath(_mountPath)
        }

        let _initialState = initialState
        if (typeof _initialState === 'function') {
          _initialState = _initialState(this.props)
          checkInitialState(_initialState)
        }

        let _listenActions = listenActions
        if (typeof _listenActions === 'function') {
          _listenActions = _listenActions(this.props)
          checkListenActions(_listenActions)
        }

        this.WrappedComponent = createRegisterReducer(_mountPath, _initialState, _listenActions,
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
