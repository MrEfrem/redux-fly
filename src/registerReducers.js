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
    throw new Error('Reducers must be non empty plain object or function')
  }
  return (WrappedComponent: any) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape,
        reduxMountPaths: PropTypes.arrayOf(PropTypes.string),
        lastReduxMountPath: PropTypes.string
      }

      static childContextTypes = {
        reduxMountPaths: PropTypes.arrayOf(PropTypes.string),
        lastReduxMountPath: PropTypes.string
      }

      getChildContext = () => ({
        reduxMountPaths: this.reduxMountPaths,
        lastReduxMountPath: this.lastReduxMountPath
      });

      store: ?Object
      reduxMountPaths: any
      lastReduxMountPath: ?string

      constructor(props: any, context: any) {
        super(props, context)
        let { store } = context
        this.reduxMountPaths = context.reduxMountPaths || []
        this.lastReduxMountPath = context.lastReduxMountPath || ''
        this.store = null

        const { reduxMountPath: propMountPath } = props

        if (typeof propMountPath !== 'undefined') {
          checkMountPath(propMountPath)
        }

        const _reducers = typeof reducers === 'function' ? reducers(props) : reducers

        if (typeof _reducers !== 'object') {
          throw new Error('Reducers must be non empty plain object')
        }

        let _normReducers = {}
        Object.keys(_reducers).forEach(key => {
          const normalizedMountPath = normalizeMountPath(`${propMountPath || ''} ${key || ''}`)
          if (this.reduxMountPaths.some(path =>
            ((path.indexOf(normalizedMountPath) === 0 && !((path.substr(normalizedMountPath.length)[0] || '').trim())) ||
              (normalizedMountPath.indexOf(path) === 0 && !((normalizedMountPath.substr(path.length)[0] || '').trim()))))
          ) {
            throw new Error(`Mount path "${normalizedMountPath}" already busy`)
          }
          if (this.lastReduxMountPath && normalizedMountPath.indexOf(this.lastReduxMountPath) === -1) {
            throw new Error(`Mount path "${normalizedMountPath}" must be contain "${this.lastReduxMountPath}"`)
          }
          this.reduxMountPaths.push(normalizedMountPath)
          _normReducers[normalizedMountPath] = _reducers[key]
        })

        if (typeof propMountPath !== 'undefined') {
          if (typeof store === 'undefined') {
            throw new Error('Redux store must be created')
          }
          if (typeof store.registerReducers !== 'function') {
            throw new Error('Redux store must be enhanced with redux-fly')
          }
          this.lastReduxMountPath = normalizeMountPath(propMountPath)
        }

        if (typeof store === 'undefined' || typeof store.registerReducers !== 'function') {
          const composeEnhancers =
            process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
          store = createStore(null, composeEnhancers(enhanceStore))
          this.store = store
        }

        // Registration reducers
        store.registerReducers(_normReducers)
      }

      componentWillUnmount() {
        this.store = null
        this.reduxMountPaths = null
        this.lastReduxMountPath = null
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
