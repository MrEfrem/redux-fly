// @flow
import React from 'react'
import storeShape from './utils/storeShape'

/**
 * Register reducers
 * @param  {Object|function|undefined} reducers
 * @param  {Object} options for store.registerReducers
 * @return {Object} React component
 */
export default (
  reducers: ?(Function | Object),
  options: Object,
) =>
  (WrappedComponent: any) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: storeShape,
      }

      componentWillMount() {
        const { store } = this.context
        if (typeof store.registerReducers !== 'function' || typeof store.unregisterReducers !== 'function') {
          throw new Error('Redux store must be enhanced with redux-fly')
        } else {
          if (typeof reducers !== 'undefined') {
            // Registration reducers
            store.registerReducers(typeof reducers === 'function' ? reducers(this.props) : reducers,
              options)
          }
        }
      }

      render() {
        const { store } = this.context
        return (
          <WrappedComponent {...this.props} unregisterReducers={store.unregisterReducers} />
        )
      }
    }
