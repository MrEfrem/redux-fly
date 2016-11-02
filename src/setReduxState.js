// @flow
import isPlainObject from 'lodash/isPlainObject'
import { UUID, NEW_STATE } from './consts'
import getStateByMountPath from './getState'

/**
 * Update state
 * @param  {string} uuid
 * @param  {string} mountPath
 * @param  {Function} dispatch
 * @param  {Function} getState
 * @param  {string} actionPrefix
 * @return {Function}
 *   @param {string} actionType
 *   @param {Object | Function} newState
 *   @return {void}
 */
export default (uuid: string, mountPath: string, dispatch: Function, getState: Function, actionPrefix: string) =>
(actionType: string, newState: Object | Function) => {
  if (typeof actionType !== 'string' || !actionType.length) {
    throw new Error('Action type must be non empty string')
  }

  if ((typeof newState !== 'object' && typeof newState !== 'function') &&
    (process.env.NODE_ENV === 'production' || process.env.NODE_ENV !== 'production' && !isPlainObject(newState))
  ) {
    throw new Error('New state must be plain object or function')
  }

  let _newState
  if (typeof newState === 'function') {
    // Pass last state as param in newState
    _newState = newState(getStateByMountPath(mountPath)(getState()))
  } else {
    _newState = newState
  }

  if (typeof _newState !== 'object' || !Object.keys(_newState).length || (process.env.NODE_ENV !== 'production' && !isPlainObject(_newState))) {
    throw new Error('New state must be non empty plain object')
  }

  // Else dispatch calculated state
  dispatch({
    type: `${actionPrefix}${actionType}`,
    [NEW_STATE]: _newState,
    [UUID]: uuid
  })
}
