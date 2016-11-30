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
    throw new Error('CreateStore must be function')
  }
  return (reducer: Object, preloadedState: ?Object, enhancer: ?Function) => {
    let store
    let combinedReducers = {}
    let rawReducers = {}
    let rawReducersMap = []

    if (preloadedState && !isPlainObject(preloadedState)) {
      throw new Error('PreloadedState must be plain object')
    }

    // Create store with middleware for process batch actions
    if (reducer && typeof reducer !== 'function') {
      registerReducers(reducer)
      store = createStore(combinedReducers, preloadedState, enhancer)
    } else {
      store = createStore(() => {}, undefined, enhancer)
    }

    // Recreate reducers tree and replace them in store
    function recreateReducers () {
      combinedReducers = {}
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
      combinedReducers = recreate(rawReducers)
      if (store) {
        store.replaceReducer(combinedReducers)
      }
    }

    // Wrap reducer for passed preloaded state
    function wrapperReducerPreloadedState(reducer, preloadedState) {
      return (state = preloadedState, action) => reducer(state, action)
    }

    /**
     * Add reducers in store
     * @param {Object} reducers
     * @return {void}
     */
    function registerReducers(reducers: Object) {
      if (!isPlainObject(reducers) || Object.keys(reducers).length === 0) {
        throw new Error('Reducers must be non empty plain object')
      }
      Object.keys(reducers).forEach(key => {
        if (typeof reducers[key] !== 'function') {
          throw new Error('Reducers has to contain functions')
        }
      })

      Object.keys(reducers).forEach(key => {
        const normalizedKey = normalizeMountPath(key)
        rawReducersMap.forEach(key1 => {
          if (((normalizedKey.indexOf(key1) === 0 && !((normalizedKey.substr(key1.length)[0] || '').trim())) ||
            (key1.indexOf(normalizedKey) === 0 && !((key1.substr(normalizedKey.length)[0] || '').trim())))
            && key1 !== normalizedKey
          ) {
            throw new Error(`Mounting path "${key1.length < normalizedKey.length ? key1 : normalizedKey}" already busy`)
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
          result[lastKey] = wrapperReducerPreloadedState(reducers[key], preloadedState1[lastKey])
        } else {
          result[lastKey] = reducers[key]
        }
        if (rawReducersMap.indexOf(normalizedKey) === -1) {
          rawReducersMap.push(normalizedKey)
        }
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
