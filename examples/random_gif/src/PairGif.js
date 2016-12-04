import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RandomGif from './RandomGif'

const gifStyle = { float: 'left', marginRight: '20px' }
const needGetGifAction = 'pairGifs/NEED-GET-GIF'

const PairGif = ({ randomGifActionPrefix, dispatch }) => (
  <div>
    <RandomGif
      reduxMountPath="pairGifs first"
      style={gifStyle}
      reduxActionPrefix={randomGifActionPrefix}
      needGetGifAction={needGetGifAction}
    />
    <RandomGif
      reduxMountPath="pairGifs second"
      reduxActionPrefix={randomGifActionPrefix}
      needGetGifAction={needGetGifAction}
    />
    <div style={{ clear: 'both' }}>
      <button onClick={() => dispatch({ type: needGetGifAction })}>
        Get all gifs
      </button>
    </div>
  </div>
)

PairGif.propTypes = {
  randomGifActionPrefix: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect()(PairGif)
