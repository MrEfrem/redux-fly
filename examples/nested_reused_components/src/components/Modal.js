//@flow
import React from 'react'
import { createReducer } from 'redux-fly'
import Button from './Button'

// Public actions (other components might control)
export const PUBLIC_OPEN_MODAL = 'PUBLIC-OPEN-MODAL'

const style = {
  container: (opened) => ({
    display: opened ? 'block' : 'none',
    position: 'absolute',
    left: '100px',
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

export default createReducer({
  mountPath: 'main',
  initialState: {
    opened: false
  },
  listenActions: (props, actionPrefix) => ({ // Listen public actions
    [`${actionPrefix}${PUBLIC_OPEN_MODAL}`]: () => ({ // Listen action to open a modal
      opened: true
    })
  })
})(Modal)
