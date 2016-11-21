//@flow
import React from 'react'
import { createReducer, getState } from 'redux-fly'

// Public actions
export const OPEN_MODAL = 'OPEN-MODAL'
export const CLOSE_MODAL = 'CLOSE-MODAL'

// Check is opened modal
export const isOpened = (mountPath: string, state: Object) => getState(mountPath)(state).opened

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
  close: {
    position: 'absolute',
    right: '8px',
    top: '-5px',
    color: '#aaa',
    fontSize: '2rem',
    fontWeight: '700',
    cursor: 'pointer'
  }
}

type PropsType = { reduxState: Object, children: any, reduxSetState: Function }
const Modal = ({ reduxState: { opened }, children = 'Hi, I is modal', reduxSetState }: PropsType) => (
  <div style={style.container(opened)}>
    <a style={style.close} onClick={() => reduxSetState('CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
  </div>
)

export default createReducer({
  initialState: {
    opened: false
  },
  listenActions: (props, actionPrefix) => ({ // Listen public actions
    [`${actionPrefix}${OPEN_MODAL}`]: () => ({ // Listen action to open a modal
      opened: true
    }),
    [`${actionPrefix}${CLOSE_MODAL}`]: () => ({ // Listen action to close a modal
      opened: false
    })
  })
})(Modal)
