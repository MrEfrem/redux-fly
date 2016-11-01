import registerReducers from '../src/registerReducers'
import { createStore } from 'redux'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import React from 'react'
import flyEnhancedStore from '../src/createStore'

test('Test invalid signature', () => {
  expect(registerReducers).toThrowError('Reducers must be plain object or function')
  expect(registerReducers.bind(this, 123)).toThrowError('Reducers must be plain object or function')
})

test('Test invalid redux store', () => {
  const Component = () => <div/>

  const ExtendedComponent1 = registerReducers({})(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1/>
  )).toThrowError('Redux store must be created')

  const store = createStore(() => ({}))
  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent1/>
    </Provider>
  )).toThrowError('Redux store must be enhanced with redux-fly')
})

test('Test reducers as function', () => {
  const Component = () => <div/>
  const store = createStore(null, null, flyEnhancedStore)

  const ExtendedComponent1 = registerReducers((props) => {
    expect(props.text).toBe('My first todo')
  })(Component)

  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent1 text="My first todo"/>
    </Provider>
  )).toThrow()

  const ExtendedComponent2 = registerReducers(() => {
    return {
      ' ui   component ': () => ({
        text: 'My second todo'
      }),
      'greeting': () => ({ descr: 'Hello world!' })
    }
  })(Component)

  renderer.create(
    <Provider store={store}>
      <ExtendedComponent2/>
    </Provider>
  )

  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"component\":{\"text\":\"My second todo\"}},\"greeting\":{\"descr\":\"Hello world!\"}}')
})

test('Test reducers as object', () => {
  const Component = () => <div/>
  const store = createStore(null, null, flyEnhancedStore)

  const ExtendedComponent = registerReducers({
    'ui component': () => ({
      text: 'My second todo'
    }),
    'greeting': () => ({ descr: 'Hello world!' })
  })(Component)

  renderer.create(
    <Provider store={store}>
      <ExtendedComponent/>
    </Provider>
  )

  expect(JSON.stringify(store.getState())).toBe('{\"ui\":{\"component\":{\"text\":\"My second todo\"}},\"greeting\":{\"descr\":\"Hello world!\"}}')
})
