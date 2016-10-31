import createStore from '../src/createStore'
import { createStore as baseCreateStore } from 'redux'

test('Test invalid signature', () => {
  expect(createStore(baseCreateStore).bind(this, 123)).toThrowError('The reducers must be non empty object')
  expect(createStore(baseCreateStore).bind(this, null, 123)).toThrowError('Preloaded state must be plain object')
  expect(createStore(baseCreateStore).bind(this, null, null, 123)).toThrow()
})

test('Test createStore to match snapshot', () => {
  const store = createStore(baseCreateStore)()
  expect(store).toMatchSnapshot()
})

test('Test invalid signature registerReducers', () => {
  const store = createStore(baseCreateStore)()
  expect(store.registerReducers).toThrowError('The reducers must be non empty object')
  expect(store.registerReducers.bind(store, {})).toThrowError('The reducers must be non empty object')
  expect(store.registerReducers.bind(store, { 'ui': 123 })).toThrowError('Reducers must be functions')
  expect(store.registerReducers.bind(store, { 'ui': () => {} })).toThrow()
})

test('Test registerReducers', () => {
  const store = createStore(baseCreateStore)()
  const preloadedState = { text: 'My first todo' }
  store.registerReducers({ 'ui': () => preloadedState })
  expect(store.getState().ui).toBe(preloadedState)
  expect(store.registerReducers({ 'ui': () => preloadedState })).toBeUndefined()
  expect(store.registerReducers.bind(store, { 'ui component': () => preloadedState })).toThrowError('Reducer mount path "ui" already busy')

  store.registerReducers({ 'todo list': () => preloadedState })
  expect(store.registerReducers({ 'todo list': () => preloadedState })).toBeUndefined()
  expect(store.registerReducers.bind(store, { 'todo': () => preloadedState })).toThrowError('Reducer mount path "todo list" already busy')

  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"text\":\"My first todo\"},\"todo\":{\"list\":{\"text\":\"My first todo\"}}}')
})
