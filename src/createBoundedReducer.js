// @flow
import { RESET_STATE, MOUNT_PATH, NEW_STATE } from './consts'

/**
 * Create reducer bounded on mountPath
 * @param {string} mountPath
 * @param {Object} initialState
 * @param {Function} listenActions
 * @param {string} actionPrefix
 * @param {Object} props
 * @return {Function}
 *   @param {Object = initialState} state
 *   @param {Object} action
 *   @return {Object} new state
 */
export default (mountPath: string, initialState: Object, listenActions: ?Function, actionPrefix: string, props: Object) =>
  (state: Object = initialState, action: Object) => {
    const resetState = `${actionPrefix}/${RESET_STATE}`
    if (typeof action[MOUNT_PATH] !== 'undefined' && action[MOUNT_PATH] === mountPath && typeof action[NEW_STATE] !== 'undefined') {
      // Action is reset state
      if (action.type === resetState) {
        return { ...action[NEW_STATE] }
      }
      // Action dispatched by setReduxState
      return {
        ...state,
        ...action[NEW_STATE]
      }
    }
    if (listenActions) {
      const newState = listenActions(state, action, props, actionPrefix)
      if (typeof newState !== 'object') {
        throw new Error('ListenActions should return an object')
      }
      return newState
    }
    return state
  }
