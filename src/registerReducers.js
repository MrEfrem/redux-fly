import React from 'react'
import storeShape from './utils/storeShape'

/**
 * Register reducers
 * @param  {Object|function} reducers
 * @param  {Object} options for store.registerReducers
 * @return {Object} React component
 */
export default (
  reducers,
  options,
) =>
  (WrappedComponent) =>
    class CreateReducer extends React.Component {
      static contextTypes = {
        store: storeShape,
      }

      componentWillMount() {
        const { store } = this.context
        // Registration reducers
        store.registerReducers(typeof reducers === 'function' ? reducers(this.props) : reducers,
          options)
      }

      render() {
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
