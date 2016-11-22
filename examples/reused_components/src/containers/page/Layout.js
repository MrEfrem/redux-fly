//@flow
import React from 'react'
import LeftFrame from './LeftFrame'
import RightFrame from './RightFrame'
import Footer from './Footer'

const style = {
  leftFrame: {
    position: 'absolute',
    width: '50%',
    height: '80%',
    borderRight: '1px solid black',
    textAlign: 'center'
  },
  rightFrame: {
    position: 'absolute',
    left: '50%',
    width: '50%',
    height: '80%',
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    bottom: 0,
    borderTop: '1px solid black',
    overflow: 'scroll'
  }
}

const Layout = () => (
  <div>
    <div style={style.leftFrame}><LeftFrame/></div>
    <div style={style.rightFrame}><RightFrame/></div>
    <div style={style.footer}><Footer/></div>
  </div>
)

export default Layout
