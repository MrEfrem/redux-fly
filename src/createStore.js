import { combineReducers } from 'redux'
import isPlainObject from 'lodash/isPlainObject'
import { checkOptions } from './checks'
import { registerReducersCheckDetailOptions } from './checks/createStore'

const createStore = (createStore) => (reducer, initialState, enhancer) => {
  const store = createStore(reducer, initialState, enhancer)
  let reducers = {}
  let rawReducers = {}
  let rawReducersMap = []
  let preloadedState = null

  function setReducerPreloadedState(reducer, preloadedState) {
    return (state = preloadedState, action) => reducer(state, action)
  }

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
    store.replaceReducer(reducers)
  }

  // Set preloaded state for registerReducers
  function setPreloadedState(state) {
    preloadedState = state
  }

  // Add reducers in store
  function registerReducers(reducers1, options = {}) {
    if (!isPlainObject(reducers1) || Object.keys(reducers1).length === 0) {
      throw new Error('The reducers must be non empty object')
    }
    Object.keys(reducers1).forEach(key => {
      if (typeof key !== 'string') {
        throw new Error('Reducers mount paths must be strings')
      }
      if (!isPlainObject(reducers1[key])) {
        throw new Error('Reducers must be functions')
      }
    })
    checkOptions(options)
    const defaultOptions = {
      replaceReducers: false,
      replaceIfMatch: false
    }
    const _options = {
      ...defaultOptions,
      ...options
    }
    registerReducersCheckDetailOptions(Object.keys(defaultOptions), _options)

    const { replaceReducers, replaceIfMatch } = _options
    if (replaceReducers) {
      rawReducers = {}
    }
    Object.keys(reducers1).forEach(key => {
      key = key.trim()
      if (!replaceIfMatch) {
        // Let's look reducer path in registered paths
        const foundPath = rawReducersMap.filter(key1 => key.indexOf(key1) !== -1 && key !== key1)
        if (foundPath.length) {
          throw new Error(`Reducer mount path ${key} already busy: ${foundPath.join(', ')}`)
        }
      }
      const keys = key.split(' ')
      let preloadedState1 = preloadedState
      const result = keys.slice(0, -1).reduce((prev, next) => {
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
      if (preloadedState1[lastKey]) {
        result[lastKey] = setReducerPreloadedState(reducers1[key], preloadedState1[lastKey])
      } else {
        result[lastKey] = reducers1[key]
      }
      result.__needRecreate = true
      rawReducersMap.push(key)
    })
    recreateReducers()
  }

  // Delete reducers from store
  function unregisterReducers(reducers1) {
    if (typeof reducers1 !== 'string' && !isPlainObject(reducers1) && !Array.isArray(reducers1)) {
      throw new Error('The reducers must be string or object or Array')
    }
    if (typeof reducers1 === 'string') {
      reducers1 = [reducers1]
    }
    if (isPlainObject(reducers1)) {
      reducers1 = Object.keys(reducers1)
    }
    let needRecreate = false
    reducers1.forEach(key => {
      key = key.trim()
      // Let's look reducer path in registered paths
      const foundPath = rawReducersMap.filter(key1 => key === key1)
      if (foundPath.length) {
        needRecreate = true
        const keys = key.split(' ')
        const result = keys.slice(0, -1).reduce((prev, next) => {
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
        rawReducersMap = rawReducersMap.map(key1 => key1 !== key)
      }
    })
    if (needRecreate) {
      recreateReducers()

    }
  }

  return {
    ...store,
    registerReducers,
    unregisterReducers,
    setPreloadedState
  }
}

export default createStore
