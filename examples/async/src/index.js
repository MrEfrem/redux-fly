import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { enhanceStore } from 'redux-fly'
import thunk from 'redux-thunk'

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const store = createStore(null, composeEnhancers(enhanceStore, applyMiddleware(thunk)))
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

render(App)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(require('./containers/App').default)
  })
}

