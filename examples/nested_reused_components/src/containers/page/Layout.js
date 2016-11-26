//@flow
import React from 'react'
import LeftFrame from './LeftFrame'
import RightFrame from './RightFrame'

const style = {
  leftFrame: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    borderRight: '1px solid black',
    textAlign: 'center'
  },
  rightFrame: {
    position: 'absolute',
    left: '50%',
    width: '50%',
    height: '100%',
    textAlign: 'center'
  }
}

const Layout = () => (
  <div>
    <div style={style.leftFrame}><LeftFrame/></div>
    <div style={style.rightFrame}><RightFrame/></div>
  </div>
)

export default Layout
