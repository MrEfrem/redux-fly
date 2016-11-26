//@flow
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import { enhanceStore } from 'redux-fly'
import Layout from './containers/page/Layout'

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

render(Layout)

if (module.hot) {
  (module: any).hot.accept('./containers/page/Layout', () => {
    render(require('./containers/page/Layout').default)
  })
}

