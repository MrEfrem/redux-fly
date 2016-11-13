import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './Counter'
import './index.css'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import { enhanceStore } from 'redux-fly'

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const store = createStore(null, composeEnhancers(enhanceStore))

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Component/>
    </Provider>,
    document.getElementById('root')
  )
}

render(Counter)

if (module.hot) {
  module.hot.accept('./Counter', () => {
    render(require('./Counter').default)
  })
}

