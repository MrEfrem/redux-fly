//@flow
import React from 'react'
import { createReducer, getState } from 'redux-fly'

// Public actions (other components might control)
export const PUBLIC_OPEN_MODAL = 'PUBLIC-OPEN-MODAL'
export const PUBLIC_CLOSE_MODAL = 'PUBLIC-CLOSE-MODAL'

// Private action (other components might listen)
export const PRIVATE_CLOSE_MODAL = '@@PRIVATE-CLOSE-MODAL'

// Check is opened modal (other components might check)
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

type PropsType = { reduxState: Object, children: any, reduxSetState: Function, dispatch: Function, reduxActionPrefix: string }
const Modal = ({ reduxState: { opened }, children = 'Hi, I is modal', reduxSetState, dispatch, reduxActionPrefix }: PropsType) => (
  <div style={style.container(opened)}>
    <a style={style.linkClose} onClick={() => reduxSetState('PRIVATE-CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
    <button style={style.buttonClose} onClick={() => dispatch({ type: `${reduxActionPrefix}${PUBLIC_CLOSE_MODAL}` })}>
      Close by public action
    </button>
  </div>
)

export default createReducer({
  initialState: {
    opened: false
  },
  listenActions: (props, actionPrefix) => ({ // Listen public actions
    [`${actionPrefix}${PUBLIC_OPEN_MODAL}`]: () => ({ // Listen action to open a modal
      opened: true
    }),
    [`${actionPrefix}${PUBLIC_CLOSE_MODAL}`]: () => ({ // Listen action to close a modal
      opened: false
    })
  })
})(Modal)
