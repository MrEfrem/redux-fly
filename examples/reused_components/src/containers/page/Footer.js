//@flow
import React from 'react'
import { createReducer } from 'redux-fly'
import { openModal as leftOpenModal, closeModal as leftCloseModal, privateCloseModal as leftPrivateCloseModal } from './LeftFrame'
import { openModal as rightOpenModal, closeModal as rightCloseModal, privateCloseModal as rightPrivateCloseModal } from './RightFrame'

const Footer = ({ reduxState: { logs } }: { reduxState: { logs: Object[] } }) => (
  <ul>
    {logs.sort((a, b) => Number(a.timestamp) > Number(b.timestamp) ? -1 : 1).map((log, key) => (
      <li key={key} style={{ color: key === 0 ? 'blue' : 'black' }}>
        [{(new Date(log.timestamp)).toISOString().substr(0, 19).replace('T', ' ')}]:&nbsp;{log.description}
      </li>
    ))}
  </ul>
)

const saveLog = (description, state) => ({ logs: [...state.logs, { description, timestamp: Date.now() }] })
export default createReducer({
  mountPath: 'footer',
  initialState: {
    logs: []
  },
  listenActions: (state, action) => { // Listen public actions
    switch (action.type) {
      case leftOpenModal.type:
        return saveLog('Left frame open modal (public action)', state)
      case leftCloseModal.type:
        return saveLog('Left frame close modal (public action)', state)
      case leftPrivateCloseModal:
        return saveLog('Left frame close modal (private action)', state)
      case rightOpenModal.type:
        return saveLog('Right frame open modal (public action)', state)
      case rightCloseModal.type:
        return saveLog('Right frame close modal (public action)', state)
      case rightPrivateCloseModal:
        return saveLog('Right frame close modal (private action)', state)
      default:
        return state
    }
  }
})(Footer)
