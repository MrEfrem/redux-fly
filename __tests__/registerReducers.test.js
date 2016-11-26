import registerReducers from '../src/registerReducers'
import { createStore } from 'redux'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import React, { PropTypes } from 'react'
import enhanceStore from '../src/enhanceStore'

test('Test invalid signature', () => {
  expect(registerReducers).toThrowError('Reducers must be non empty plain object or function')
  expect(registerReducers.bind(this, 123)).toThrowError('Reducers must be non empty plain object or function')
})

test('Test invalid reducers returned from function', () => {
  const Component = () => <div/>
  const ExtendedComponent1 = registerReducers(() => 123)(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1/>
  )).toThrowError('Reducers must be non empty plain object')
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

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath="ui component"/>
  )).toThrowError('Redux store must be created')

  const store = createStore(() => ({}))
  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent1 reduxMountPath="ui component"/>
    </Provider>
  )).toThrowError('Redux store must be enhanced with redux-fly')
})

test('Test reducers as function with provide enhanced redux store', () => {
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

test('Test reducers as object with provide enhanced redux store', () => {
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

test('Test reducers as object with provide is pure redux store', () => {
  const store = createStore(null, enhanceStore)
  const Component = (undefined, { store }) => (
    <div>
      <span>{JSON.stringify(store.getState())}</span>
      <span>{typeof store.registerReducers}</span>
    </div>
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
    <Provider store={store}>
      <ExtendedComponent/>
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test calculated mountPath with passed reduxMountPath', () => {
  const store = createStore(null, enhanceStore)
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
    <Provider store={store}>
      <ExtendedComponent reduxMountPath=" my first   component" />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test is valid re-register of reducer', () => {
  const store = createStore(null, enhanceStore)
  const Component = () => <div/>
  const ExtendedComponent = registerReducers({
    'ui component': () => ({})
  })(Component)

  renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
})

test('Test is invalid to register of reducer in same mounting path', () => {
  const store = createStore(null, enhanceStore)
  const Component = ({ children }) => <div>{children}</div>
  Component.propTypes = {
    children: PropTypes.element
  }
  const ExtendedComponent = registerReducers({
    'ui component': () => ({})
  })(Component)

  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent>
        <ExtendedComponent/>
      </ExtendedComponent>
    </Provider>
  )).toThrowError('Mount path "ui component" already busy')
})

test('Test is valid to register of reducer after register of reducer', () => {
  const store = createStore(null, enhanceStore)
  const Component = ({ children }) => <div>{children || 'Last reducer'}</div>
  Component.propTypes = {
    children: PropTypes.element
  }
  const ExtendedComponent = registerReducers({
    'ui component': () => ({})
  })(Component)

  const ExtendedComponent1 = registerReducers({
    'ui component1': () => ({})
  })(Component)

  expect(renderer.create(
    <Provider store={store}>
      <ExtendedComponent>
        <ExtendedComponent1/>
      </ExtendedComponent>
    </Provider>
  )).toMatchSnapshot()
})

test('Test is invalid to set the mountPath for reused component which contains in other reused component (reduxMountPath + mountPath)', () => {
  const store = createStore(null, enhanceStore)
  const Component = ({ children }) => <div>{children || 'Last reducer'}</div>
  Component.propTypes = {
    children: PropTypes.element
  }
  const ExtendedComponent = registerReducers({
    reducer1: () => ({})
  })(Component)

  const ExtendedComponent1 = registerReducers({
    reducer2: () => ({})
  })(Component)

  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component">
        <ExtendedComponent1/>
      </ExtendedComponent>
    </Provider>
  )).toThrowError('Mount path "reducer2" must be contain "ui component"')
})

test('Test is invalid to set the mountPath for reused component which contains in other reused component (reduxMountPath + reduxMountPath)', () => {
  const store = createStore(null, enhanceStore)
  const Component = ({ children }) => <div>{children || 'Last reducer'}</div>
  Component.propTypes = {
    children: PropTypes.element
  }
  const ExtendedComponent = registerReducers({
    reducer1: () => ({})
  })(Component)

  const ExtendedComponent1 = registerReducers({
    reducer2: () => ({})
  })(Component)

  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component">
        <ExtendedComponent1 reduxMountPath="todo list"/>
      </ExtendedComponent>
    </Provider>
  )).toThrowError('Mount path "todo list reducer2" must be contain "ui component"')
})

test('Test is valid to set the mountPath for reused component which contains in other reused component', () => {
  const store = createStore(null, enhanceStore)
  const Component = ({ children, reduxMountPath }) => <div>{children ? React.cloneElement(children, { reduxMountPath }) : 'Last reducer'}</div>
  Component.propTypes = {
    children: PropTypes.element,
    reduxMountPath: PropTypes.string
  }
  const ExtendedComponent = registerReducers({
    reducer1: () => ({})
  })(Component)

  const ExtendedComponent1 = registerReducers({
    reducer2: () => ({})
  })(Component)

  expect(renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component">
        <ExtendedComponent1/>
      </ExtendedComponent>
    </Provider>
  )).toMatchSnapshot()
})
