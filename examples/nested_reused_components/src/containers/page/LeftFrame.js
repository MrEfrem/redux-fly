//@flow
import React from 'react'
import Modal, { PUBLIC_OPEN_MODAL } from '../../components/Modal'
import { connect } from 'react-redux'

const modalMountPath = 'leftFrame modal'
const modalActionPrefix = `${modalMountPath}/`

const LeftFrame = ({ dispatch }: { dispatch: Function }) => (
  <div style={{ position: 'relative' }}>
    <h1>Left frame</h1>
    <button onClick={() => dispatch({ type: `${modalActionPrefix}${PUBLIC_OPEN_MODAL}` })}>
      Open
    </button>
    <Modal reduxMountPath={modalMountPath}/>
  </div>
)

export default connect()(LeftFrame)
