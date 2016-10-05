import { RESET_STATE, MOUNT_PATH, UUID } from './consts'

// Create reducer bounded on mountPath
export default (uuid, mountPath, initialState, listenActions) =>
  (state = initialState, action) => {
    if ((action[MOUNT_PATH] && action[MOUNT_PATH] === mountPath && action[UUID] &&
      action[UUID] === uuid && typeof action.newState !== 'undefined') ||
      action.type in listenActions
    ) {
      const reducerMap = {
        [RESET_STATE]: () => ({
          ...initialState,
        }),
        ...listenActions,
      }
      const reducer = reducerMap[action.type]
      if (reducer) {
        return reducer(state, action)
      } else {
        return {
          ...state,
          ...action.newState,
        }
      }
    }
    return state
  }
