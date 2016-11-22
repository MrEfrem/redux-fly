//@flow
import React, { PropTypes } from 'react'
import Modal, { PUBLIC_OPEN_MODAL, PUBLIC_CLOSE_MODAL, PRIVATE_CLOSE_MODAL, isOpened } from '../../components/Modal'
import { connect } from 'react-redux'
import { openModal as leftOpenModal, closeModal as leftCloseModal, isOpenedModal as leftIsOpenedModal } from './LeftFrame'
import { compose, getContext } from 'recompose'

const modalMountPath = 'rightFrame modal'
const modalActionPrefix = 'right-frame/'

// Check is opened modal
export const isOpenedModal = (state: Object) => isOpened(modalMountPath, state)

// To open a modal is action creator
export const openModal = () => ({
  type: `${modalActionPrefix}${PUBLIC_OPEN_MODAL}`
})

// To close a modal is action creator
export const closeModal = () => ({
  type: `${modalActionPrefix}${PUBLIC_CLOSE_MODAL}`
})

// Listen private action
export const privateCloseModal = `${modalActionPrefix}${PRIVATE_CLOSE_MODAL}`

// To toggle opened a right frame modal
const toggleLeft = (dispatch, store) => {
  if (leftIsOpenedModal(store.getState())) {
    dispatch(leftCloseModal())
  } else {
    dispatch(leftOpenModal())
  }
}

const RightFrame = ({ dispatch, store }: { dispatch: Function, store: Object }) => (
  <div style={{ position: 'relative' }}>
    <h1>Right frame</h1>
    <button onClick={() => dispatch({ type: `${modalActionPrefix}${PUBLIC_OPEN_MODAL}` })}>
      Open
    </button>
    <br/><br/>
    <button onClick={() => dispatch(leftOpenModal())}>
      Open left
    </button>
    <button
      style={{ marginLeft: '10px'}}
      onClick={() => dispatch(leftCloseModal())}
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
