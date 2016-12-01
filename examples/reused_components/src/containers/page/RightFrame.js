//@flow
import React, { PropTypes } from 'react'
import Modal, { createActionOpenModal, createActionCloseModal, actionPrivateCloseModal, isOpened } from '../../components/Modal'
import { connect } from 'react-redux'
import { openModal as leftOpenModal, closeModal as leftCloseModal, isOpenedModal as leftIsOpenedModal } from './LeftFrame'
import { compose, getContext } from 'recompose'

const modalMountPath = 'rightFrame modal'
const modalActionPrefix = 'right-frame'

// Check is opened modal
export const isOpenedModal = (state: Object) => isOpened(modalMountPath, state)

// To open a modal is action
export const openModal = createActionOpenModal(modalActionPrefix)

// To close a modal is action
export const closeModal = createActionCloseModal(modalActionPrefix)

// Listen private action
export const privateCloseModal = actionPrivateCloseModal(modalActionPrefix)

// To toggle opened a right frame modal
const toggleLeft = (dispatch, store) => {
  if (leftIsOpenedModal(store.getState())) {
    dispatch(leftCloseModal)
  } else {
    dispatch(leftOpenModal)
  }
}

const RightFrame = ({ dispatch, store }: { dispatch: Function, store: Object }) => (
  <div style={{ position: 'relative' }}>
    <h1>Right frame</h1>
    <button onClick={() => dispatch(openModal)}>
      Open
    </button>
    <br/><br/>
    <button onClick={() => dispatch(leftOpenModal)}>
      Open left
    </button>
    <button
      style={{ marginLeft: '10px'}}
      onClick={() => dispatch(leftCloseModal)}
    >
      Close left
    </button>
    <button
      style={{ marginLeft: '10px'}}
      onClick={() => toggleLeft(dispatch, store)}
    >
      Toggle left
    </button>
    <Modal reduxMountPath={modalMountPath} reduxActionPrefix={modalActionPrefix}/>
  </div>
)

export default compose(
  connect(),
  getContext({
    store: PropTypes.object.isRequired
  })
)(RightFrame)
