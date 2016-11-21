//@flow
import React, { PropTypes } from 'react'
import Modal, { OPEN_MODAL, CLOSE_MODAL, isOpened } from '../../components/Modal'
import { connect } from 'react-redux'
import { openModal as rightOpenModal, closeModal as rightCloseModal, isOpenedModal as rightIsOpenedModal } from './RightFrame'
import { compose, getContext } from 'recompose'

const modalMountPath = 'leftFrame modal'
const modalActionPrefix = `${modalMountPath}/`

// Check is opened modal
export const isOpenedModal = (state: Object) => isOpened(modalMountPath, state)

// To open a modal is action creator
export const openModal = () => ({
  type: `${modalActionPrefix}${OPEN_MODAL}`
})
// To close a modal is action creator
export const closeModal = () => ({
  type: `${modalActionPrefix}${CLOSE_MODAL}`
})

// To toggle opened a right frame modal
const toggleRight = (dispatch, store) => {
  if (rightIsOpenedModal(store.getState())) {
    dispatch(rightCloseModal())
  } else {
    dispatch(rightOpenModal())
  }
}

const LeftFrame = ({ dispatch, store }: { dispatch: Function, store: Object }) => (
  <div style={{ position: 'relative' }}>
    <h1>Left frame</h1>
    <button onClick={() => dispatch({ type: `${modalActionPrefix}${OPEN_MODAL}` })}>
      Open
    </button>
    <br/><br/>
    <button onClick={() => dispatch(rightOpenModal())}>
      Open right
    </button>
    <button
      style={{ marginLeft: '10px'}}
      onClick={() => dispatch(rightCloseModal())}
    >
      Close right
    </button>
    <button
      style={{ marginLeft: '10px'}}
      onClick={() => toggleRight(dispatch, store)}
    >
      Toggle right
    </button>
    <Modal reduxMountPath={modalMountPath}/>
  </div>
)

export default compose(
  connect(),
  getContext({
    store: PropTypes.object.isRequired
  })
)(LeftFrame)
