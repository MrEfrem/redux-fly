//@flow
import React, { PropTypes } from 'react'
import Modal, { createActionOpenModal, createActionCloseModal, actionPrivateCloseModal, isOpened } from '../../components/Modal'
import { connect } from 'react-redux'
import { openModal as rightOpenModal, closeModal as rightCloseModal, isOpenedModal as rightIsOpenedModal } from './RightFrame'
import { compose, getContext } from 'recompose'

const modalMountPath = 'leftFrame modal'

// Check is opened modal
export const isOpenedModal = (state: Object) => isOpened(modalMountPath, state)

// To open a modal is action
export const openModal = createActionOpenModal(modalMountPath)

// To close a modal is action
export const closeModal = createActionCloseModal(modalMountPath)

// Listen private action close modal
export const privateCloseModal = actionPrivateCloseModal(modalMountPath)

// To toggle opened a right frame modal
const toggleRight = (dispatch, store) => {
  if (rightIsOpenedModal(store.getState())) {
    dispatch(rightCloseModal)
  } else {
    dispatch(rightOpenModal)
  }
}

const LeftFrame = ({ dispatch, store }: { dispatch: Function, store: Object }) => (
  <div style={{ position: 'relative' }}>
    <h1>Left frame</h1>
    <button onClick={() => dispatch(openModal)}>
      Open
    </button>
    <br/><br/>
    <button onClick={() => dispatch(rightOpenModal)}>
      Open right
    </button>
    <button
      style={{ marginLeft: '10px'}}
      onClick={() => dispatch(rightCloseModal)}
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
