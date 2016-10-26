// @flow
import { RESET_STATE, MOUNT_PATH, UUID, NEW_STATE } from './consts'
import { normalizeMountPath } from './utils/normalize'

export const mutateState = (prev: Object, next: Object) => {
  return {
    ...prev,
    ...next,
  }
}

// Create reducer bounded on mountPath
export default (uuid: string, mountPath: string, preloadedState: Object, listenActions: Object) =>
  (state: Object = preloadedState, action: Object) => {
    if ((typeof action[MOUNT_PATH] !== 'undefined' && normalizeMountPath(action[MOUNT_PATH]) === mountPath && typeof action[UUID] !== 'undefined' &&
      action[UUID] === uuid && (typeof action[NEW_STATE] !== 'undefined' || action.type === RESET_STATE)) ||
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
      }
      return mutateState(state, action[NEW_STATE])
    }
    return state
  }
