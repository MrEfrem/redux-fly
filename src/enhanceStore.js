// @flow
import { combineReducers } from 'redux'
import isPlainObject from 'lodash/isPlainObject'
import { normalizeMountPath } from './utils/normalize'

/**
 * Function enhance an object of Redux store with the `registerReducers` method for
 * gradual registration of reducer at any nesting level of Redux store.
 * If reducer isn't pass, but pass preloaderState, then preloadedState would uses
 * how default state for new reducers.
 * @param {Object} createStore
 * @return {Function}
 *   @param {Object} reducer (optional)
 *   @param {Object} preloadedState (optional)
 *   @param {Function} enhancer (optional)
 *   @return {Object}
 *     {Function} registerReducers,
 *     {Function} subscribe,
 *     {Function} dispatch,
 *     {Function} getState,
 *     {Function} replaceReducer
 */
const enhanceStore = (createStore: Function) => {
  if (typeof createStore !== 'function') {
    throw new Error('Create store must be function')
  }
  return (reducer?: Object, preloadedState?: Object, enhancer?: Function) => {
    let store
    let reducers = {}
    let rawReducers = {}
    let rawReducersMap = []

    if (preloadedState && !isPlainObject(preloadedState)) {
      throw new Error('Preloaded state must be plain object')
    }

    // Create store with middleware for process batch actions
    if (reducer) {
      registerReducers(reducer)
      store = createStore(reducers, preloadedState, enhancer)
    } else {
      store = createStore(() => ({}), undefined, enhancer)
    }

    // Recreate reducers tree and replace them in store
    function recreateReducers () {
      reducers = {}
      function recreate(node) {
        if (isPlainObject(node)) {
          const newReducers = {}
          Object.keys(node).forEach(key => {
            const reducer = recreate(node[key])
            if (reducer) {
              newReducers[key] = reducer
            }
          })
          return combineReducers(newReducers)
        } else {
          return node
        }
      }
      reducers = recreate(rawReducers)
      if (store) {
        store.replaceReducer(reducers)
      }
    }

    // Wrap reducer for passed preloaded state
    function wrapperReducerPreloadedState(reducer, preloadedState) {
      return (state = preloadedState, action) => reducer(state, action)
    }

    /**
     * Add reducers in store
     * @param {Object} newReducers
     * @return {void}
     */
    function registerReducers(newReducers: Object) {
      if (!isPlainObject(newReducers) || Object.keys(newReducers).length === 0) {
        throw new Error('The reducers must be non empty object')
      }
      Object.keys(newReducers).forEach(key => {
        if (typeof newReducers[key] !== 'function') {
          throw new Error('Reducers must be functions')
        }
      })

      Object.keys(newReducers).forEach(key => {
        const normalizedKey = normalizeMountPath(key)
        rawReducersMap.forEach(key1 => {
          if ((normalizedKey.indexOf(key1) === 0 || key1.indexOf(normalizedKey) === 0) && key1 !== normalizedKey) {
            throw new Error(`Reducer mount path "${key1}" already busy`)
          }
        })
        const keys = normalizedKey.split(' ')
        let preloadedState1 = preloadedState
        const result: Object = keys.slice(0, -1).reduce((prev, next) => {
          if (typeof prev[next] === 'undefined') {
            prev[next] = {}
          }
          if (preloadedState1) {
            preloadedState1 = preloadedState1[next]
          }
          return prev[next]
        }, rawReducers)
        const lastKey = keys.slice(-1)
        if (preloadedState1 && preloadedState1[lastKey]) {
          result[lastKey] = wrapperReducerPreloadedState(newReducers[key], preloadedState1[lastKey])
        } else {
          result[lastKey] = newReducers[key]
        }
        rawReducersMap.push(normalizedKey)
      })
      recreateReducers()
    }

    return {
      ...store,
      registerReducers
    }
  }
}

export default enhanceStore
