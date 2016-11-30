import { enhanceStore } from 'redux-fly'
import { createStore } from 'redux'
import fs from 'fs'
import React from 'react'
import ReactDOM from 'react-dom/server'
import serialize from 'serialize-javascript'
import { Provider } from 'react-redux'
import config from '../config'
import qs from 'qs'
import { fetchCounter } from './api'

const getTemplate = (markup, preloadedState) =>
  fs.readFileSync(config.resolve('src/index.html'), 'utf-8')
    .replace(
      '<div id="root"></div>', [
        `<div id="root">${markup}</div>`,
        `<script>window.__PRELOADED_STATE__=${serialize(preloadedState)};</script>`,
        `<script src="/public/${config.webpack.fileName}?nocache=${Math.random()}"></script>`
      ].join('')
    )

export default function* () { // eslint-disable-line
  // Query our mock API asynchronously
  const apiResult = yield fetchCounter()

  // Read the counter from the request, if provided
  const params = qs.parse(this.query)
  const counter = parseInt(params.counter, 10) || apiResult || 0

  // Compile an initial state
  const initialState = { counter: { value: counter } }

  // Create a new Redux store instance
  const store = createStore(() => {}, initialState, enhanceStore)

  // Delete the App component cache for live editing
  delete require.cache[require.resolve('../src/App')]

  // Require App component from disk
  const App = require('../src/App').default

  // Render the component to a string
  const markup = ReactDOM.renderToString(
    <Provider store={store}>
      <App/>
    </Provider>
  )

  // Grab the initial state from our Redux store
  const finalState = store.getState()

  // Send the rendered page back to the client
  this.body = getTemplate(markup, finalState)
}
