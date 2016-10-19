// @flow
import isPlainObject from 'lodash/isPlainObject'
import { MOUNT_PATH, UUID } from './consts'

/**
 * Update state
 * @param  {string} uuid
 * @param  {string} mountPath
 * @param  {function} dispatch
 * @param  {function} getState
 * @return {
 *   @param {actionType} custom action type
 *   @param {Object | Function} new state
 *   @return {void}
 * )
 */
export default (uuid: string, mountPath: string, dispatch: Function, getState: Function) => (actionType: string, newState: Object | Function) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof actionType !== 'string' || !actionType.length) {
      throw new Error('Parameter actionType must be not empty string')
    }
    if (!isPlainObject(newState) && typeof newState !== 'function') {
      throw new Error('Parameter newState must be plain object or function')
    }
  }

  let _newState
  if (typeof newState === 'function') {
    _newState = newState(getState())
  } else {
    _newState = newState
  }

  if (process.env.NODE_ENV !== 'production') {
    if (!isPlainObject(_newState) || !Object.keys(_newState).length) {
      throw new Error('New state must be non empty plain object')
    }
  }

  dispatch({
    type: actionType,
    [MOUNT_PATH]: mountPath,
    newState: _newState,
    [UUID]: uuid,
  })
}
