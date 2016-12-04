//@flow
import React from 'react'
import { createReducer } from 'redux-fly'
import Button from './Button'

const style = {
  container: (opened) => ({
    display: opened ? 'block' : 'none',
    position: 'absolute',
    left: 'calc(50% - 130px)',
    top: '150px',
    width: '200px',
    height: '200px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    padding: '30px',
    zIndex: 1,
  }),
  linkClose: {
    position: 'absolute',
    right: '8px',
    top: '-5px',
    color: '#aaa',
    fontSize: '2rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  buttonClose: {
    marginTop: '2rem'
  }
}

type PropsType = { reduxState: Object, children: any, reduxSetState: Function, reduxMountPath: string }
const Modal = ({ reduxState: { opened }, children = 'Hi, I is modal', reduxSetState, reduxMountPath }: PropsType) => (
  <div style={style.container(opened)}>
    <a style={style.linkClose} onClick={() => reduxSetState('PRIVATE-CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
    <Button reduxMountPath={`${reduxMountPath} button`}/>
  </div>
)

// Public actions (other components might control)
export const createActionOpenModal = (actionPrefix: string) => ({ type: `${actionPrefix}/PUBLIC-OPEN-MODAL` })

export default createReducer({
  mountPath: 'main',
  initialState: {
    opened: false
  },
  listenActions: (state, action, props, actionPrefix) => { // Listen public actions
    if (action.type === createActionOpenModal(actionPrefix).type) { // Listen action to open a modal
      return { opened: true }
    }
    return state
  }
})(Modal)
