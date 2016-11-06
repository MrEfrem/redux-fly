import enhanceStore from '../src/enhanceStore'
import { createStore } from 'redux'

test('Test invalid signature', () => {
  expect(enhanceStore).toThrowError('Create store must be function')
  expect(enhanceStore.bind(this, 123)).toThrowError('Create store must be function')
  expect(createStore.bind(this, 123, enhanceStore)).toThrowError('The reducers must be non empty object')
  expect(createStore.bind(this, null, 123, enhanceStore)).toThrowError('Preloaded state must be plain object')
  expect(createStore.bind(this, null, null, 123)).toThrow()
  expect(createStore.bind(this, { ui: 123 }, enhanceStore)).toThrowError('Reducers must be functions')
})

test('Test createStore to match snapshot', () => {
  const store = createStore(null, enhanceStore)
  expect(store).toMatchSnapshot()
})

test('Test invalid signature registerReducers', () => {
  const store = createStore(null, enhanceStore)
  expect(store.registerReducers).toThrowError('The reducers must be non empty object')
  expect(store.registerReducers.bind(store, {})).toThrowError('The reducers must be non empty object')
  expect(store.registerReducers.bind(store, { ui: 123 })).toThrowError('Reducers must be functions')
  expect(store.registerReducers.bind(store, { ui: () => {} })).toThrow()
})

test('Test registerReducers', () => {
  const store = createStore(null, null, enhanceStore)
  const initialState1 = { text: 'My first todo' }
  const initialState2 = { text: 'My second todo' }
  const reducer1 = (state = initialState1, action) => {
    if (action.type === 'UPDATE-COMPONENT') {
      return { ...state, text: action.text }
    }
    return state
  }
  const reducer2 = (state = initialState2, action) => {
    if (action.type === 'UPDATE-TODO-LIST') {
      return { ...state, text: action.text }
    }
    return state
  }
  store.registerReducers({ ' ui  ': reducer1 })
  expect(store.getState().ui).toBe(initialState1)
  expect(store.registerReducers({ ui: reducer1 })).toBeUndefined()
  expect(store.registerReducers.bind(store, { 'ui   component ': reducer1 })).toThrowError('Reducer mount path "ui" already busy')
  store.dispatch({ type: 'UPDATE-COMPONENT', text: 'My first updated todo 1' })
  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"text\":\"My first updated todo 1\"}}')

  store.registerReducers({ '  todo list ': reducer2 })
  expect(store.registerReducers({ 'todo list': reducer2 })).toBeUndefined()
  expect(store.registerReducers.bind(store, { 'todo    ': reducer2 })).toThrowError('Reducer mount path "todo list" already busy')

  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"text\":\"My first updated todo 1\"},\"todo\":{\"list\":{\"text\":\"My second todo\"}}}')

  store.dispatch({ type: 'UPDATE-COMPONENT', text: 'My first updated todo 2' })
  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"text\":\"My first updated todo 2\"},\"todo\":{\"list\":{\"text\":\"My second todo\"}}}')

  store.dispatch({ type: 'UPDATE-TODO-LIST', text: 'My second updated todo' })
  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"text\":\"My first updated todo 2\"},\"todo\":{\"list\":{\"text\":\"My second updated todo\"}}}')
})

test('Test createStore with preloadedState', () => {
  const preloadedState = { ui: { todo: { text: 'My second todo' } } }
  const store = createStore(null, preloadedState, enhanceStore)
  const initialState = { text: 'My first todo' }
  const reducer = (state = initialState) => state
  store.registerReducers({
    'ui todo': reducer
  })
  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"todo\":{\"text\":\"My second todo\"}}}')
})

test('Test createStore with preloadedState and reducer', () => {
  const preloadedState = { ui: { todo: { text: 'My second todo' } } }
  const initialState = { text: 'My first todo' }
  const reducer = { 'ui todo': (state = initialState) => state }
  const store = createStore(reducer, preloadedState, enhanceStore)
  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"todo\":{\"text\":\"My second todo\"}}}')
})
