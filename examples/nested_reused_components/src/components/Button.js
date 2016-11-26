//@flow
import React from 'react'
import { createReducer } from 'redux-fly'

type PropsType = { reduxState: Object, reduxSetState: Function }
const Modal = ({ reduxState: { clicks }, reduxSetState }: PropsType) => (
  <div>
    <br/>
    <button onClick={() => reduxSetState('CLICK', (state) => ({ clicks: state.clicks + 1 }))}>
      Clicks {clicks}
    </button>
  </div>
)

export default createReducer({
  initialState: {
    clicks: 0
  }
})(Modal)
