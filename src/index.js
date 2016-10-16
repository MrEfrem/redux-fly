// @flow
export { default as createStore } from './createStore'
export { default as registerReducers } from './registerReducers'
export { default as createReducer } from './createReducer'
export { default as getState } from './getState'

import { RESET_STATE, MOUNT_PATH } from './consts'
export const consts = { RESET_STATE, MOUNT_PATH }
