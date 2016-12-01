//@flow
import React from 'react'
import Modal, { createActionOpenModal } from '../../components/Modal'
import { connect } from 'react-redux'

const modalMountPath = 'rightFrame modal'

const RightFrame = ({ dispatch }: { dispatch: Function }) => (
  <div style={{ position: 'relative' }}>
    <h1>Right frame</h1>
    <button onClick={() => dispatch(createActionOpenModal(modalMountPath))}>
      Open
    </button>
    <Modal reduxMountPath={modalMountPath} />
  </div>
)

export default connect()(RightFrame)
