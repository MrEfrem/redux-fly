// @flow
import { RESET_STATE, UUID, NEW_STATE } from './consts'

/**
 * Create reducer bounded on mountPath
 * @param {string} uuid
 * @param {Object} initialState
 * @param {Object} listenActions
 * @param {string} actionPrefix
 * @return {Function}
 *   @param {Object = initialState} state
 *   @param {Object} action
 *   @return {Object} new state
 */
export default (uuid: string, initialState: Object, listenActions: Object, actionPrefix: string) =>
  (state: Object = initialState, action: Object) => {
    const resetState = `${actionPrefix}${RESET_STATE}`
    if (typeof action[UUID] !== 'undefined' && action[UUID] === uuid && (typeof action[NEW_STATE] !== 'undefined' || action.type === resetState) ||
      action.type in listenActions
    ) {
      const reducerMap = {
        [resetState]: () => ({
          ...initialState,
        }),
        ...listenActions,
      }
      const reducer = reducerMap[action.type]
      if (reducer) {
        return reducer(state, action)
      }
      return {
        ...state,
        ...action[NEW_STATE]
      }
    }
    return state
  }
