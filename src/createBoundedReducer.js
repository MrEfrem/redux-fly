// @flow
import { RESET_STATE, MOUNT_PATH, UUID, COMMIT_BATCH, NEW_STATE, ACTIONS } from './consts'
import { normalizeMountPath } from './utils/normalize'

// Create reducer bounded on mountPath
export default (uuid: string, mountPath: string, preloadedState: Object, listenActions: Object) =>
  (state: Object = preloadedState, action: Object) => {
    if ((typeof action[MOUNT_PATH] !== 'undefined' && normalizeMountPath(action[MOUNT_PATH]) === mountPath && typeof action[UUID] !== 'undefined' &&
      action[UUID] === uuid && (typeof action[NEW_STATE] !== 'undefined' || action.type === RESET_STATE || action.type === COMMIT_BATCH)) ||
      action.type in listenActions
    ) {
      const reducerMap = {
        [RESET_STATE]: () => ({
          ...preloadedState,
        }),
        [COMMIT_BATCH]: (state, action) =>
          action[ACTIONS].reduce((prev, next) => {
            if (typeof next[UUID] === 'undefined' || next[UUID] !== uuid) {
              throw new Error(`Incorrect ${UUID} ${next[UUID]}`)
            }
            return {
              ...prev,
              ...next[NEW_STATE],
            }
          }, state),
        ...listenActions,
      }
      const reducer = reducerMap[action.type]
      if (reducer) {
        return reducer(state, action)
      } else {
        return {
          ...state,
          ...action[NEW_STATE],
        }
      }
    }
    return state
  }
