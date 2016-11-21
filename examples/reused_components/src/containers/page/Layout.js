//@flow
import React from 'react'
import LeftFrame from './LeftFrame'
import RightFrame from './RightFrame'

const style = {
  leftFrame: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    borderRight: '1px solid black'
  },
  rightFrame: {
    position: 'absolute',
    left: '50%',
    width: '50%',
    height: '100%'
  }
}

const Layout = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={style.leftFrame}><LeftFrame/></div>
    <div style={style.rightFrame}><RightFrame/></div>
  </div>
)

export default Layout
