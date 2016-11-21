import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './Counter'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import { enhanceStore } from 'redux-fly'

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const store = createStore(null, composeEnhancers(enhanceStore))
const target = document.getElementById('root')
const render = (Component) => {
  try {
    ReactDOM.render(
      <Provider store={store}>
        <Component/>
      </Provider>,
      target
    )
  } catch (err) {
    const RedBox = require('redbox-react').default
    ReactDOM.render(<RedBox error={err} />, target)
  }
}

render(Counter)

if (module.hot) {
  module.hot.accept('./Counter', () => {
    render(require('./Counter').default)
  })
}

