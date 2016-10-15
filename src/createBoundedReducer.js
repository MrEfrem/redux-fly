import { RESET_STATE, MOUNT_PATH, UUID } from './consts'

// Create reducer bounded on mountPath
export default (uuid, mountPath, preloadedState, listenActions) =>
  (state = preloadedState, action) => {
    if ((typeof action[MOUNT_PATH] !== 'undefined' && action[MOUNT_PATH].trim() === mountPath &&
      (typeof action.newState !== 'undefined' && typeof action[UUID] !== 'undefined' && action[UUID] === uuid || action.type === RESET_STATE)) ||
      action.type in listenActions
    ) {
      const reducerMap = {
        [RESET_STATE]: () => ({
          ...preloadedState,
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
