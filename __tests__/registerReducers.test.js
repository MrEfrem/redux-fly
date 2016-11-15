import registerReducers from '../src/registerReducers'
import { createStore } from 'redux'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import React, { PropTypes } from 'react'
import enhanceStore from '../src/enhanceStore'

test('Test invalid signature', () => {
  expect(registerReducers).toThrowError('Reducers must be object or function')
  expect(registerReducers.bind(this, 123)).toThrowError('Reducers must be object or function')
})

test('Test invalid reducers returned from function', () => {
  const Component = () => <div/>
  const ExtendedComponent1 = registerReducers(() => 123)(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1/>
  )).toThrowError('Reducers must be object')
})

test('Test invalid prop reduxMountPath', () => {
  const Component = () => <div/>
  const ExtendedComponent1 = registerReducers({})(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath={123}/>
  )).toThrowError('Mount path must be string')
})

test('Test invalid redux store', () => {
  const Component = () => <div/>
  const ExtendedComponent1 = registerReducers({})(Component)

  const store = createStore(() => ({}))
  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent1/>
    </Provider>
  )).toThrowError('Redux store must be enhanced with redux-fly')
})

test('Test reducers as function', () => {
  const Component = () => <div/>
  const store = createStore(null, enhanceStore)

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
  const store = createStore(null, enhanceStore)

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

test('Test reducers as object without provide redux store', () => {
  const Component = (undefined, { store }) => (
    <div>{JSON.stringify(store.getState())}</div>
  )
  Component.contextTypes = {
    store: PropTypes.object.isRequired
  }
  const ExtendedComponent = registerReducers({
    'ui component': () => ({
      text: 'My second todo'
    }),
    'greeting': () => ({ descr: 'Hello world!' })
  })(Component)

  const component = renderer.create(
    <ExtendedComponent/>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test calculated mountPath with passed reduxMountPath', () => {
  const Component = (undefined, { store }) => (
    <div>{JSON.stringify(store.getState())}</div>
  )
  Component.contextTypes = {
    store: PropTypes.object.isRequired
  }
  const ExtendedComponent = registerReducers({
    'ui component': () => ({
      text: 'My second todo'
    }),
    'greeting': () => ({ descr: 'Hello world!' })
  })(Component)

  const component = renderer.create(
    <ExtendedComponent reduxMountPath=" my first   component" />
  )
  expect(component.toJSON()).toMatchSnapshot()
})
