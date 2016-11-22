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

const saveLog = (description) => (state) => ({ logs: [...state.logs, { description, timestamp: Date.now() }] })
export default createReducer({
  mountPath: 'footer',
  initialState: {
    logs: []
  },
  listenActions: {
    [leftOpenModal().type]: saveLog('Left frame open modal (public action)'),
    [leftCloseModal().type]: saveLog('Left frame close modal (public action)'),
    [leftPrivateCloseModal]: saveLog('Left frame close modal (private action)'),
    [rightOpenModal().type]: saveLog('Right frame open modal (public action)'),
    [rightCloseModal().type]: saveLog('Right frame close modal (public action)'),
    [rightPrivateCloseModal]: saveLog('Right frame close modal (private action)'),
  }
})(Footer)
