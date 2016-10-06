import isPlainObject from 'lodash/isPlainObject'
import warning from '../utils/warning'

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
