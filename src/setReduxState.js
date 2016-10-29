// @flow
import isPlainObject from 'lodash/isPlainObject'
import { UUID, NEW_STATE } from './consts'
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
 *   @param {actionType} custom action type
 *   @param {Object | Function | undefined} new state
 *   @return {void}
 * )
 */
export default (uuid: string, mountPath: string, dispatch: Function, getState: Function, actionPrefix: string, batchUpdate: Object) =>
(actionType: string, newState?: Object | Function) => {
  if (typeof actionType !== 'string' || !actionType.length) {
    throw new Error('Action type must be non empty string')
  }

  if ((typeof newState !== 'undefined' && typeof newState !== 'object' && typeof newState !== 'function') &&
    (process.env.NODE_ENV === 'production' || process.env.NODE_ENV !== 'production' && !isPlainObject(newState))
  ) {
    throw new Error('New state must be plain object or function')
  }

  if (batchUpdate.type && batchUpdate.type !== actionType) {
    throw new Error('Found not sent batch')
  }

  if (typeof newState === 'undefined') {
    // Start new batch and loose stored changes if new action type isn't equal
    if (!batchUpdate.type) {
      batchUpdate = {
        type: actionType,
        state: null
      }
      return
    } else if (batchUpdate.state) { // Dispatch batch if not empty
      dispatch({
        type: `${actionPrefix}${batchUpdate.type}`,
        [NEW_STATE]: batchUpdate.state,
        [UUID]: uuid
      })
      batchUpdate = {}
      return
    }
  }

  let _newState
  if (typeof newState === 'function') {
    if (batchUpdate.type) { // If batch then pass calculated state from batch
      _newState = newState(batchUpdate.state || getStateByMountPath(mountPath)(getState()))
    } else { // Else pass last state
      _newState = newState(getStateByMountPath(mountPath)(getState()))
    }
  } else {
    _newState = newState
  }

  if (typeof _newState !== 'object' || !Object.keys(_newState).length || (process.env.NODE_ENV !== 'production' && !isPlainObject(_newState))) {
    throw new Error('New state must be non empty plain object')
  }

  if (batchUpdate.type && typeof batchUpdate.state !== 'undefined') {
    // If batch then save new calculated state
    batchUpdate.state = mutateState(batchUpdate.state, _newState)
  } else {
    // Else dispatch calculated state
    dispatch({
      type: `${actionPrefix}${actionType}`,
      [NEW_STATE]: _newState,
      [UUID]: uuid
    })
  }
}
