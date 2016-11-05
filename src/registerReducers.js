// @flow
import React, { PropTypes } from 'react'
import isPlainObject from 'lodash/isPlainObject'
import storeShape from './utils/storeShape'

/**
 * Register reducers
 * @param {Object | function} reducers
 * @return {Function}
 *   @param {Component} WrappedComponent
 *   @return {Component} new component
 */
export default (
  reducers: Function | Object,
) => {
  if (typeof reducers !== 'function' && !isPlainObject(reducers)) {
    throw new Error('Reducers must be plain object or function')
  }
  return (WrappedComponent: any) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: process.env.NODE_ENV === 'test' ? PropTypes.object : storeShape
      }

      constructor(props: any, context: any) {
        super(props, context)

        const { store } = context
        if (typeof store !== 'object') {
          throw new Error('Redux store must be created')
        }
        if (typeof store.registerReducers !== 'function') {
          throw new Error('Redux store must be enhanced with redux-fly')
        }
        // Registration reducers
        store.registerReducers(typeof reducers === 'function' ? reducers(props) : reducers)
      }

      render() {
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
}
