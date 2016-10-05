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
 * @param  {Array}  default options
 * @param  {Object}  options
 * @return {void}
 */
export const checkDetailOptions = (defaultOptions, options) => {
  if (typeof options.connectToStore !== 'boolean') {
    throw new Error('Option connectToStore must be boolean')
  }
  if (typeof options.unregisterInUnmount !== 'boolean') {
    throw new Error('Option unregisterInUnmount must be boolean')
  }
  const undefinedOptions = Object.keys(options).reduce((prev, next) => {
    if (!defaultOptions.includes(next)) {
      prev = `${prev}, `
    }
    return prev
  }, '').slice(0, -2)
  if (undefinedOptions) {
    throw new Error(`Undefined options: ${undefinedOptions}`)
  }
}
