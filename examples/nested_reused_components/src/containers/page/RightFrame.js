//@flow
import React from 'react'
import Modal, { PUBLIC_OPEN_MODAL } from '../../components/Modal'
import { connect } from 'react-redux'

const modalMountPath = 'rightFrame modal'
const modalActionPrefix = `${modalMountPath}/`

const RightFrame = ({ dispatch }: { dispatch: Function }) => (
  <div style={{ position: 'relative' }}>
    <h1>Right frame</h1>
    <button onClick={() => dispatch({ type: `${modalActionPrefix}${PUBLIC_OPEN_MODAL}` })}>
      Open
    </button>
    <Modal reduxMountPath={modalMountPath}/>
  </div>
)

export default connect()(RightFrame)
