// @flow
import isPlainObject from 'lodash/isPlainObject'
import { MOUNT_PATH, UUID, BATCH, PROCESS_BATCH, NEW_STATE } from './consts'

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
export default (uuid: string, mountPath: string, dispatch: Function, getState: Function, actionPrefix: string) => (newState: Object | Function, actionType: string, batch: ?Boolean) => {
  if (!arguments.length) {
    // Process batch actions
    dispatch({
      type: PROCESS_BATCH,
      [MOUNT_PATH]: mountPath,
      [UUID]: uuid
    })
    return
  }
  if ((typeof newState !== 'object' && typeof newState !== 'function') || (process.env.NODE_ENV !== 'production' && !isPlainObject(newState))) {
    throw new Error('New state must be plain object or function')
  }
  if (typeof actionType !== 'string' || !actionType.length) {
    throw new Error('Action type must be not empty string')
  }

  if (batch && typeof batch !== 'boolean') {
    throw new Error('Batch must be boolean')
  }

  let _newState
  if (typeof newState === 'function') {
    _newState = newState(getState())
  } else {
    _newState = newState
  }

  if (typeof _newState !== 'object' || !Object.keys(_newState).length || (process.env.NODE_ENV !== 'production' && !isPlainObject(_newState))) {
    throw new Error('New state must be non empty plain object')
  }

  dispatch({
    type: `${actionPrefix}${actionType}`,
    [MOUNT_PATH]: mountPath,
    [NEW_STATE]: _newState,
    [UUID]: uuid,
    [BATCH]: batch ? true : false
  })
}
