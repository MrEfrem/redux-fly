//@flow
import React from 'react'
import Modal, { createActionOpenModal } from '../../components/Modal'
import { connect } from 'react-redux'

const modalMountPath = 'leftFrame modal'

const LeftFrame = ({ dispatch }: { dispatch: Function }) => (
  <div style={{ position: 'relative' }}>
    <h1>Left frame</h1>
    <button onClick={() => dispatch(createActionOpenModal(modalMountPath))}>
      Open
    </button>
    <Modal reduxMountPath={modalMountPath} />
  </div>
)

export default connect()(LeftFrame)
