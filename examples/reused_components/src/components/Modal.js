//@flow
import React from 'react'
import { createReducer, getState } from 'redux-fly'

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

type PropsType = { reduxState: Object, children: any, reduxSetState: Function, dispatch: Function, reduxActionPrefix: string }
const Modal = ({ reduxState: { opened }, children = 'Hi, I is modal', reduxSetState, dispatch, reduxActionPrefix }: PropsType) => (
  <div style={style.container(opened)}>
    <a style={style.linkClose} onClick={() => reduxSetState('PRIVATE-CLOSE-MODAL', { opened: false })}>&times;</a>
    {children}
    <button style={style.buttonClose} onClick={() => dispatch({ type: `${reduxActionPrefix}/PUBLIC-CLOSE-MODAL` })}>
      Close by public action
    </button>
  </div>
)

// Type of window closing action (other components might listen in reducers)
export const actionPrivateCloseModal = (actionPrefix: string) => `${actionPrefix}/@PRIVATE-CLOSE-MODAL`

// To open a modal is public action creator (other components might control the state)
export const createActionOpenModal = (actionPrefix: string) => ({ type: `${actionPrefix}/PUBLIC-OPEN-MODAL` })

// To close a modal is public action creator (other components might control the state)
export const createActionCloseModal = (actionPrefix: string) => ({ type: `${actionPrefix}/PUBLIC-CLOSE-MODAL` })

// Check is opened modal (other components might check)
export const isOpened = (mountPath: string, allState: Object) => {
  const state = getState(mountPath)(allState)
  if (state) {
    return state.opened
  } else {
    throw new Error(`Mounting path ${mountPath} isn't valid`)
  }
}

export default createReducer({
  initialState: {
    opened: false
  },
  listenActions: (state, action, props, actionPrefix) => { // Listen public actions
    switch (action.type) {
      case createActionOpenModal(actionPrefix).type: // Listen action to open a modal
        return { opened: true }
      case createActionCloseModal(actionPrefix).type: // Listen action to close a modal
        return { opened: false }
      default:
        return state
    }
  }
})(Modal)
