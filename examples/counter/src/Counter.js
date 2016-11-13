import React, { PropTypes } from 'react'
import { createReducer } from 'redux-fly'

const increment = reduxSetState => reduxSetState('INCREMENT',
  state => ({ counter: state.counter + 1 }))

const decrement = reduxSetState => reduxSetState('DECREMENT',
  state => ({ counter: state.counter - 1 }))

const incrementIfOdd = (counter, reduxSetState) => {
  if (counter % 2 !== 0) {
    increment(reduxSetState)
  }
}

const incrementAsync = reduxSetState => {
  setTimeout(() => increment(reduxSetState), 1000)
}

const Counter = ({ reduxState: { counter }, reduxSetState }) => (
  <p>
    Clicked: {counter} times
    {' '}
    <button onClick={() => increment(reduxSetState)}>
      +
    </button>
    {' '}
    <button onClick={() => decrement(reduxSetState)}>
      -
    </button>
    {' '}
    <button onClick={() => incrementIfOdd(counter, reduxSetState)}>
      Increment if odd
    </button>
    {' '}
    <button onClick={() => incrementAsync(reduxSetState)}>
      Increment async
    </button>
  </p>
)

Counter.propTypes = {
  reduxState: PropTypes.object.isRequired,
  reduxSetState: PropTypes.func.isRequired
}

export default createReducer({
  mountPath: 'counter',
  initialState: {
    counter: 0
  }
})(Counter)
