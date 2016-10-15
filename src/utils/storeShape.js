import { PropTypes } from 'react'

export default PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  replaceReducer: PropTypes.func.isRequired,
  registerReducer: PropTypes.func.isRequired,
  unRegisterReducer: PropTypes.func.isRequired,
})
