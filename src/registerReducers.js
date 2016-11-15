// @flow
import React, { PropTypes } from 'react'
import storeShape from './utils/storeShape'
import enhanceStore from './enhanceStore'
import { createStore, compose } from 'redux'
import { checkMountPath } from './utils/checks'
import { normalizeMountPath } from './utils/normalize'
import { Provider } from 'react-redux'

/**
 * Function registers reducers in Redux store.
 * @param {Object | function} reducers
 * @return {Function}
 *   @param {Component} WrappedComponent
 *   @return {Component} new component
 */
export default (
  reducers: Function | Object,
) => {
  if (typeof reducers !== 'function' && typeof reducers !== 'object') {
    throw new Error('Reducers must be object or function')
  }
  return (WrappedComponent: any) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape
      }

      store: ?Object

      constructor(props: any, context: any) {
        super(props, context)

        let { store } = context
        this.store = null
        if (typeof store === 'undefined') {
          const composeEnhancers =
            process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
          store = createStore(null, composeEnhancers(enhanceStore))
          this.store = store
        } else {
          if (typeof store.registerReducers !== 'function') {
            throw new Error('Redux store must be enhanced with redux-fly')
          }
        }

        const { reduxMountPath: propMountPath } = props

        if (typeof propMountPath !== 'undefined') {
          checkMountPath(propMountPath)
        }

        const _reducers = typeof reducers === 'function' ? reducers(props) : reducers

        if (typeof _reducers !== 'object') {
          throw new Error('Reducers must be object')
        }

        let _normReducers = {}
        Object.keys(_reducers).forEach(key => {
          _normReducers[normalizeMountPath(`${propMountPath || ''} ${key || ''}`)] = _reducers[key]
        })

        // Registration reducers
        store.registerReducers(_normReducers)
      }

      componentWillUnmount() {
        this.store = null
      }

      render() {
        if (this.store) {
          return (
            <Provider store={this.store}>
              <WrappedComponent {...this.props} />
            </Provider>
          )
        }
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
}
