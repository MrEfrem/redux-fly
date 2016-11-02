// @flow
import isPlainObject from 'lodash/isPlainObject'
import { normalizeMountPath } from './utils/normalize'

/**
 * Find state by mountPath
 * @param  {string} mountPath
 * @return {Function}
 *   @param {string} state
 *   @return {Object} finded state
 */
export default (mountPath: string) => {
  if (typeof mountPath !== 'string' || !mountPath.length) {
    throw new Error('Mount path must be non empty string')
  }
  return (state: Object) => {
    if (!isPlainObject(state)) {
      throw new Error('State must be plain object')
    }
    const keys = normalizeMountPath(mountPath).split(' ')
    return keys.reduce((prev, next) => {
      if (prev && prev[next]) {
        return prev[next]
      }
    }, state)
  }
}
