import createReducer from '../src/createReducer'
import renderer from 'react-test-renderer'
import React, { PropTypes } from 'react'
import { createStore, compose } from 'redux'
import { connect, Provider } from 'react-redux'
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

test('Test invalid init component', () => {
  const Component = () => <div/>

  const ExtendedComponent1 = createReducer(null, {})(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1/>
  )).toThrowError('Mount path must be defined')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath={['ui component']} />
  )).toThrowError('Mount path must be string')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath="ui component" />
  )).toThrowError('Redux store must be created')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath="ui component" reduxPersist="true" />
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
      <ExtendedComponent1 reduxMountPath="ui component" />
    </Provider>
  )).toThrowError('Redux store must be enhanced with redux-fly')
})

test('Test valid init component passed mount path in createReducer', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\"}</span><span>false</span></div>')
})

test('Test valid init component passed mount path in Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer(null, { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\"}</span><span>false</span></div>')
})

test('Test valid init component passed mount path in createReducer and Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui other-component" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui other-component</span><span>{\"text\":\"My first todo\"}</span><span>false</span></div>')
})

test('Test valid init component passed persist in createReducer', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' }, null, { persist: true })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\"}</span><span>true</span></div>')
})

test('Test valid init component passed persist in Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxPersist={true} />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\"}</span><span>true</span></div>')
})

test('Test valid init component passed persist in createReducer and Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' }, null, { persist: true })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxPersist={false} />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\"}</span><span>false</span></div>')
})

test('Test valid init component passed preloadedState is function', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = createReducer('ui component', (props, mountPath) => ({ text: props.text, mountPath }))(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent text="My first todo" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My first todo\",\"mountPath\":\"ui component\"}</span><span>false</span></div>')
})

test('Test valid init component passed listenActions', () => {
  const store = createStore(null, null, flyEnhancedStore)
  const UPDATE_TODO = 'UPDATE_TODO'

  class Component extends React.Component {
    componentDidMount() {
      const { dispatch, reduxMountedPath } = this.props
      dispatch({ type: UPDATE_TODO, text: 'My second todo', mountPath: reduxMountedPath })
    }
    render() {
      const { props } = this
      return (
        <div>
          <span>{typeof props.setReduxState}</span>
          <span>{typeof props.resetReduxState}</span>
          <span>{props.reduxMountedPath}</span>
          <span>{JSON.stringify(props.reduxState)}</span>
          <span>{props.persist.toString()}</span>
        </div>
      )
    }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
      { [UPDATE_TODO]: (state, action) => ({...state,  text: action.text, mountPath: action.mountPath }) }
    ),
    connect(),
  )(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My second todo\",\"mountPath\":\"ui component\"}</span><span>false</span></div>')
})

test('Test valid init component passed listenActions is function', () => {
  const store = createStore(null, null, flyEnhancedStore)
  const UPDATE_TODO = 'UPDATE_TODO'

  class Component extends React.Component {
    componentDidMount() {
      const { dispatch } = this.props
      dispatch({ type: UPDATE_TODO })
    }
    render() {
      const { props } = this
      return (
        <div>
          <span>{typeof props.setReduxState}</span>
          <span>{typeof props.resetReduxState}</span>
          <span>{props.reduxMountedPath}</span>
          <span>{JSON.stringify(props.reduxState)}</span>
          <span>{props.persist.toString()}</span>
        </div>
      )
    }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
      (props, mountPath) => ({ [UPDATE_TODO]: () => ({ text: props.text, mountPath }) })
    ),
    connect(),
  )(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent text="My second todo" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My second todo\",\"mountPath\":\"ui component\"}</span><span>false</span></div>')
})

test('Test valid init component without connectToStore', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist.toString()}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
      null,
      {
        connectToStore: false
      }
    )
  )(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span></span><span>false</span></div>')
})

test('Test reset state (persist = false) after unmounting component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState } = this.props
      setReduxState({
        text: 'My second todo',
      }, 'update_todo')
    }

    render() {
      const { props } = this
      return (
        <div>
          <span>{typeof props.setReduxState}</span>
          <span>{typeof props.resetReduxState}</span>
          <span>{props.reduxMountedPath}</span>
          <span>{JSON.stringify(props.reduxState)}</span>
          <span>{props.persist.toString()}</span>
        </div>
      )
    }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' }
    )
  )(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My second todo\"}</span><span>false</span></div>')
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My second todo"}}}')

  component.unmount()
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My first todo"}}}')
})

test('Test preserved state (persist = true) after unmounting component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState } = this.props
      setReduxState({
        text: 'My second todo',
      }, 'update_todo')
    }

    render() {
      const { props } = this
      return (
        <div>
          <span>{typeof props.setReduxState}</span>
          <span>{typeof props.resetReduxState}</span>
          <span>{props.reduxMountedPath}</span>
          <span>{JSON.stringify(props.reduxState)}</span>
          <span>{props.persist.toString()}</span>
        </div>
      )
    }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.bool.isRequired
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
      null,
      {
        persist: true
      }
    )
  )(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span><span>{\"text\":\"My second todo\"}</span><span>true</span></div>')
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My second todo"}}}')

  component.unmount()
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My second todo"}}}')
})
