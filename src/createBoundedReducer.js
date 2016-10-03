import { UPDATE_STATE, RESET_STATE } from './actions'

// Create reducer bounded on instance
export default (instance, initialState, listenActions) =>
  (state = initialState, action) => {
    if ((action.instance && typeof action.instance === 'string' && action.instance === instance &&
      [UPDATE_STATE, RESET_STATE].indexOf(action.type) !== -1) || // Owner actions
      ([UPDATE_STATE, RESET_STATE].indexOf(action.type) === -1 &&
      action.type in listenActions) // Other actions
    ) {
      const reducerMap = {
        [UPDATE_STATE]: (state1, action1) => ({
          ...state1,
          ...action1.newState,
        }),
        [RESET_STATE]: () => ({
          ...initialState,
        }),
        ...listenActions,
      }
      const reducer = reducerMap[action.type]
      return reducer ? reducer(state, action) : state
    }
    return state
  }
