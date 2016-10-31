// @flow
import { combineReducers } from 'redux'
import isPlainObject from 'lodash/isPlainObject'
import { normalizeMountPath } from './utils/normalize'

/**
 * Enhancer redux store for runtime management reducers.
 * @param Object createStore
 * @return Function
 *    @param reducer
 *    @param preloadedState
 *    @param enhancer
 *       @return Object:
 *          registerReducers Function
 *          unregisterReducers Function
 * If isn't passed reducer, but passed preloaderState, then preloadedState would uses
 * how default state for new registered reducers.
 */
const createStore = (createStore: Function) => (reducer?: Object, preloadedState?: Object, enhancer?: Function) => {
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
      if (isPlainObject(node) && node.__needRecreate) {
        node.__needRecreate = false
        const reducers1 = {}
        Object.keys(node).forEach(key => {
          if (key !== '__needRecreate') {
            const reducer = recreate(node[key])
            if (reducer) {
              reducers1[key] = reducer
            }
          }
        })
        if (!Object.keys(reducers1).length) {
          return null
        }
        return combineReducers(reducers1)
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

  // Add reducers in store
  function registerReducers(reducers1: Object) {
    if (!isPlainObject(reducers1) || Object.keys(reducers1).length === 0) {
      throw new Error('The reducers must be non empty object')
    }
    Object.keys(reducers1).forEach(key => {
      if (typeof reducers1[key] !== 'function') {
        throw new Error('Reducers must be functions')
      }
    })

    Object.keys(reducers1).forEach(key => {
      key = normalizeMountPath(key)
      rawReducersMap.forEach(key1 => {
        if ((key.indexOf(key1) === 0 || key1.indexOf(key) === 0) && key1 !== key) {
          throw new Error(`Reducer mount path "${key1}" already busy`)
        }
      })
      const keys = key.split(' ')
      let preloadedState1 = preloadedState
      const result: Object = keys.slice(0, -1).reduce((prev, next) => {
        if (typeof prev[next] === 'undefined') {
          prev[next] = {}
        }
        prev.__needRecreate = true
        if (preloadedState1) {
          preloadedState1 = preloadedState1[next]
        }
        return prev[next]
      }, rawReducers)
      const lastKey = keys.slice(-1)
      if (preloadedState1 && preloadedState1[lastKey]) {
        result[lastKey] = wrapperReducerPreloadedState(reducers1[key], preloadedState1[lastKey])
      } else {
        result[lastKey] = reducers1[key]
      }
      result.__needRecreate = true
      rawReducersMap.push(key)
    })
    recreateReducers()
  }

  // Delete reducers from store
  function unregisterReducers(reducers1: string | string[]) {
    if (typeof reducers1 !== 'string' && !Array.isArray(reducers1)) {
      throw new Error('The reducers must be string or Array')
    }
    if (typeof reducers1 === 'string') {
      reducers1 = [reducers1]
    }
    let needRecreate = false
    reducers1.forEach(key => {
      key = normalizeMountPath(key)
      // Let's look reducer path in registered paths
      const foundPath = rawReducersMap.filter(key1 => key === key1)
      if (foundPath.length) {
        needRecreate = true
        const keys = key.split(' ')
        const result: Object = keys.slice(0, -1).reduce((prev, next) => {
          if (typeof prev[next] === 'undefined') {
            prev[next] = {}
          }
          prev.__needRecreate = true
          return prev[next]
        }, rawReducers)
        delete result[keys.slice(-1)]
        if (Object.keys(result).some(key1 => key1 !== '__needRecreate')) {
          result.__needRecreate = true
        }
        rawReducersMap = rawReducersMap.filter(key1 => key1 !== key)
      }
    })
    if (needRecreate) {
      recreateReducers()
    }
  }

  return {
    ...store,
    registerReducers,
    unregisterReducers
  }
}

export default createStore
