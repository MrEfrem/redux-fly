// @flow
import { RESET_STATE, UUID, NEW_STATE } from './consts'

// Create reducer bounded on mountPath
export default (uuid: string, preloadedState: Object, listenActions: Object, actionPrefix: string) =>
  (state: Object = preloadedState, action: Object) => {
    const resetState = `${actionPrefix}${RESET_STATE}`
    if (typeof action[UUID] !== 'undefined' && action[UUID] === uuid && (typeof action[NEW_STATE] !== 'undefined' || action.type === resetState) ||
      action.type in listenActions
    ) {
      const reducerMap = {
        [resetState]: () => ({
          ...preloadedState,
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
