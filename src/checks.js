import isPlainObject from 'lodash/isPlainObject'

/**
 * Check mountPath
 * @param  {string} path
 * @return {void}
 */
export const checkMountPath = (path) => {
  if (typeof path !== 'string' || !path.length) {
    throw new Error('Mount path must be string')
  }
}

/**
 * Check initialState
 * @param  {Object} initialState
 * @return {void}
 */
export const checkInitialState = (initialState) => {
  if (!isPlainObject(initialState)) {
    throw new Error('InitialState must be plain object')
  }
}

/**
 * Check listenActions
 * @param  {Object} listenActions
 * @return {void}
 */
export const checkListenActions = (listenActions) => {
  if (listenActions && !isPlainObject(listenActions)) {
    throw new Error('ListenActions must be plain object')
  }
}

/**
 * Check options
 * @param  {Object} options
 * @return {void}
 */
export const checkOptions = (options) => {
  if (!isPlainObject(options)) {
    throw new Error('Options must be plain object ')
  }
}

/**
 * Check properties of an object options
 * @param  {Object}  options
 * @return {void}
 */
export const checkDetailOptions = (options) => {
  if (typeof options.connectToStore !== 'boolean') {
    throw new Error('connectToStore property of an object options must be boolean')
  }
  if (typeof options.unregisterInUnmount !== 'boolean') {
    throw new Error('Property unregisterInUnmount in third parameter shall be boolean')
  }
}
