// @flow
import isPlainObject from 'lodash/isPlainObject'
import { MOUNT_PATH, UUID, NEW_STATE } from './consts'
import getStateByMountPath from './getState'
import { mutateState } from './createBoundedReducer'

/**
 * Update state
 * @param  {string} uuid
 * @param  {string} mountPath
 * @param  {function} dispatch
 * @param  {function} getState
 * @param  {string} actionPrefix
 * @return {
 *   @param {Object | Function} new state
 *   @param {actionType} custom action type
 *   @param  {boolean} batch updates (true - save in batch)
 *   @return {void}
 * )
 */

export default (uuid: string, mountPath: string, dispatch: Function, getState: Function, actionPrefix: string, batchUpdate: Object) =>
(newState: Object | Function, actionType: any, batch: ?Boolean) => {
  // Commit batch update
  if (newState === null && typeof actionType === 'string' && actionType.length && typeof batch === 'boolean' && batch) {
    if (!Object.keys(batchUpdate).length) {
      throw new Error('Batch update is empty')
    }
    dispatch({
      type: `${actionPrefix}${actionType}`,
      [MOUNT_PATH]: mountPath,
      [NEW_STATE]: batchUpdate,
      [UUID]: uuid
    })
    batchUpdate = {}
    return
  }

  if ((typeof newState !== 'object' && typeof newState !== 'function') ||
    (process.env.NODE_ENV !== 'production' && typeof newState !== 'function' && !isPlainObject(newState))
  ) {
    throw new Error('New state must be plain object or function')
  }

  if (typeof actionType === 'boolean' && actionType && typeof batch === 'undefined') {
    batch = actionType
    actionType = undefined
  }

  if (!batch && (typeof actionType !== 'string' || !actionType.length)) {
    throw new Error('Action type must be not empty string')
  }

  if (batch && typeof batch !== 'boolean') {
    throw new Error('Batch must be boolean')
  }

  if (!batch && Object.keys(batchUpdate).length) {
    throw new Error('Found uncommitted batch update')
  }

  // If first batch update in current transaction then preserve last state
  // for calculate in batch mode
  if (batch && !Object.keys(batchUpdate).length) {
    batchUpdate = getStateByMountPath(mountPath)(getState()) || {}
  }

  let _newState
  if (typeof newState === 'function') {
    if (batch) { // If batch then pass batch calculated state
      _newState = newState(batchUpdate)
    } else { // Else pass last state
      _newState = newState(getStateByMountPath(mountPath)(getState()))
    }
  } else {
    _newState = newState
  }

  if (typeof _newState !== 'object' || !Object.keys(_newState).length || (process.env.NODE_ENV !== 'production' && !isPlainObject(_newState))) {
    throw new Error('New state must be non empty plain object')
  }

  if (batch) {
    batchUpdate = mutateState(batchUpdate, _newState)
  } else {
    dispatch({
      type: `${actionPrefix}${actionType}`,
      [MOUNT_PATH]: mountPath,
      [NEW_STATE]: _newState,
      [UUID]: uuid
    })
  }
}
