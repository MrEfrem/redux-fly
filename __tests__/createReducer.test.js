import createReducer from '../src/createReducer'
import renderer from 'react-test-renderer'
import React, { PropTypes } from 'react'
import { PROP_MOUNT_PATH, PROP_PERSIST } from '../src/consts'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import flyEnhancedStore from '../src/createStore'
import { mount } from 'enzyme'

test('Test invalid signature', () => {
  expect(createReducer).toThrowError('Mount path must be string')
  expect(createReducer.bind(this, null)).toThrowError('PreloadedState must be plain object')
  expect(createReducer.bind(this, {}, {})).toThrowError('Mount path must be string')
  expect(createReducer.bind(this, null, {}, 123)).toThrowError('ListenActions must be plain object')
  expect(createReducer.bind(this, null, {}, null, null)).toThrowError('Options must be plain object')
  expect(createReducer.bind(this, null, {}, null, { connectToStore: null })).toThrowError('ConnectToStore must be boolean')
  expect(createReducer.bind(this, null, {}, null, { persist: null })).toThrowError('Persist must be boolean')
  expect(createReducer.bind(this, null, {}, null, { actionPrefix: null })).toThrowError('ActionPrefix must be string')
})

test('Test valid signature', () => {
  expect(createReducer.bind(this, 'ui component', {}, { 'TEST_ACTION': () => ({}) }, {
    connectToStore: false,
    persist: true,
    actionPrefix: 'SUPER-PUPER/', })).not.toThrow()
})

test('Test invalid init component', () => {
  const Component = () => <div/>

  const ExtendedComponent1 = createReducer(null, {})(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1/>
  )).toThrowError('Mount path must be defined')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 {...{[PROP_MOUNT_PATH]: ['ui component']}} />
  )).toThrowError('Mount path must be string')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 {...{[PROP_MOUNT_PATH]: 'ui component'}} />
  )).toThrowError('Redux store must be created')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 {...{[PROP_MOUNT_PATH]: 'ui component'}} {...{[PROP_PERSIST]: 'true'}}/>
  )).toThrowError('Persist must be boolean')


  const ExtendedComponent2 = createReducer('ui component', () => undefined)(Component)
  expect(renderer.create.bind(renderer,
    <ExtendedComponent2/>
  )).toThrowError('PreloadedState must be plain object')


  const ExtendedComponent3 = createReducer('ui component', {}, () => undefined)(Component)
  expect(renderer.create.bind(renderer,
    <ExtendedComponent3/>
  )).toThrowError('ListenActions must be plain object')


  const store = createStore(() => ({}))
  expect(renderer.create.bind(renderer,
    <Provider store={store}>
      <ExtendedComponent1 {...{[PROP_MOUNT_PATH]: 'ui component'}} />
    </Provider>
  )).toThrowError('Redux store must be enhanced with redux-fly')
})

test('Test valid init component', () => {
  const props = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
  }
  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
    </div>
  )
  Component.propTypes = props
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  const store = createStore(null, null, flyEnhancedStore)
  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\"}</span></div>')
})
