// @flow
import isPlainObject from 'lodash/isPlainObject'

/**
 * Check mountPath
 * @param  {string} path
 * @return {void}
 */
export const checkMountPath = (path: string) => {
  if (typeof path !== 'string' || !path.trim().length) {
    throw new Error('Mount path must be string')
  }
}

/**
 * Check preloadedState
 * @param  {Object} preloadedState
 * @return {void}
 */
export const checkPreloadedState = (preloadedState: Object) => {
  if (!isPlainObject(preloadedState)) {
    throw new Error('PreloadedState must be plain object')
  }
}

/**
 * Check options
 * @param  {Object} options
 * @return {void}
 */
export const checkOptions = (options: Object) => {
  if (!isPlainObject(options)) {
    throw new Error('Options must be plain object ')
  }
}
