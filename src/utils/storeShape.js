// @flow
import { PropTypes } from 'react'

export default PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  replaceReducer: PropTypes.func.isRequired,
  registerReducers: PropTypes.func.isRequired
})
