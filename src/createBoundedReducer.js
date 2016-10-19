// @flow
import { RESET_STATE, MOUNT_PATH, UUID } from './consts'
import { normalizeMountPath } from './utils/normalize'

// Create reducer bounded on mountPath
export default (uuid: string, mountPath: string, preloadedState: Object, listenActions: Object) =>
  (state: Object = preloadedState, action: Object) => {
    if ((typeof action[MOUNT_PATH] !== 'undefined' && normalizeMountPath(action[MOUNT_PATH]) === mountPath &&
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
