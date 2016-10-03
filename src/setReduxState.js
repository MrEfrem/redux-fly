import warning from './utils/warning'
import isPlainObject from 'lodash/isPlainObject'
import { UPDATE_STATE } from './actions'

// Update state
export default (instance, dispatch, getState) => (newState) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!isPlainObject(newState) && typeof newState !== 'function') {
      warning('First parameter newState must be plain object or function')
    }
  }

  let _newState
  if (typeof newState === 'function') {
    _newState = newState(getState())
  } else {
    _newState = newState
  }

  if (process.env.NODE_ENV !== 'production') {
    if (!isPlainObject(_newState) || !Object.keys(_newState).length) {
      warning('New state must be non empty plain object')
    }
  }

  dispatch({
    type: UPDATE_STATE,
    instance,
    newState: _newState,
  })
}
