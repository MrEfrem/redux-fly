// @flow
import { RESET_STATE, MOUNT_PATH, NEW_STATE } from './consts'

/**
 * Create reducer bounded on mountPath
 * @param {string} mountPath
 * @param {Object} initialState
 * @param {Object} listenActions
 * @param {string} actionPrefix
 * @return {Function}
 *   @param {Object = initialState} state
 *   @param {Object} action
 *   @return {Object} new state
 */
export default (mountPath: string, initialState: Object, listenActions: Object, actionPrefix: string) =>
  (state: Object = initialState, action: Object) => {
    const resetState = `${actionPrefix}/${RESET_STATE}`
    if ((typeof action[MOUNT_PATH] !== 'undefined' && action[MOUNT_PATH] === mountPath && typeof action[NEW_STATE] !== 'undefined') ||
      action.type in listenActions
    ) {
      // Action is reset state
      if (action.type === resetState) {
        return { ...action[NEW_STATE] }
      }
      // Action found in listenActions
      const reducer = listenActions[action.type]
      if (reducer) {
        return {
          ...state,
          ...reducer(state, action)
        }
      }
      // Action dispatched by setReduxState
      return {
        ...state,
        ...action[NEW_STATE]
      }
    }
    return state
  }
