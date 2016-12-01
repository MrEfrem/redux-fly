// @flow
import isPlainObject from 'lodash/isPlainObject'
import { MOUNT_PATH, NEW_STATE } from './consts'
import getStateByMountPath from './getState'

/**
 * Update state
 * @param  {string} mountPath
 * @param  {Function} dispatch
 * @param  {Function} getState
 * @param  {string} actionPrefix
 * @return {Function}
 *   @param {string} actionType
 *   @param {Object | Function} newState
 *   @return {void}
 */
export default (mountPath: string, dispatch: Function, getState: Function, actionPrefix: string) =>
(actionType: string, newState: Object | Function) => {
  if (typeof actionType !== 'string' || !actionType.length) {
    throw new Error('ActionType must be non empty string')
  }
  if ((typeof newState !== 'object' && typeof newState !== 'function') ||
    (typeof newState === 'object' && (!Object.keys(newState).length || (process.env.NODE_ENV !== 'production' && !isPlainObject(newState))))
  ) {
    throw new Error('NewState must be non empty plain object or function')
  }

  let _newState = newState
  if (typeof newState === 'function') {
    // Pass last state as param in newState
    _newState = newState(getStateByMountPath(mountPath)(getState()))
    if (typeof _newState !== 'object' || !Object.keys(_newState).length || (process.env.NODE_ENV !== 'production' && !isPlainObject(_newState))) {
      throw new Error('New state returned from function must be non empty plain object')
    }
  }

  // Else dispatch calculated state
  dispatch({
    type: `${actionPrefix}/@${actionType}`,
    [NEW_STATE]: _newState,
    [MOUNT_PATH]: mountPath
  })
}
