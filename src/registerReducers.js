// @flow
import React from 'react'
import storeShape from './utils/storeShape'

/**
 * Register reducers
 * @param  {Object|function|undefined} reducers
 * @return {Object} React component
 */
export default (
  reducers: ?(Function | Object),
) =>
  (WrappedComponent: any) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: storeShape,
      }

      constructor(props: any, context: any) {
        super(props, context)

        const { store } = context
        if (typeof store !== 'object') {
          throw new Error('Redux store must be created')
        }
        if (typeof store.registerReducers !== 'function' || typeof store.unregisterReducers !== 'function') {
          throw new Error('Redux store must be enhanced with redux-fly')
        }
        if (typeof reducers !== 'undefined') {
          // Registration reducers
          store.registerReducers(typeof reducers === 'function' ? reducers(props) : reducers)
        }
      }

      render() {
        const { store } = this.context
        return (
          <WrappedComponent {...this.props} unregisterReducers={store.unregisterReducers} />
        )
      }
    }
