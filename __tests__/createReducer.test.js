import createReducer from '../src/createReducer'
import renderer from 'react-test-renderer'
import React, { PropTypes } from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'
import enhanceStore from '../src/enhanceStore'
import { mount } from 'enzyme'
import { RESET_STATE } from '../src/consts'

test('Test invalid signature', () => {
  expect(createReducer).toThrowError('InitialState must be plain object')
  expect(createReducer.bind(this, { mountPath: 10, initialState: {} })).toThrowError('Mount path must be string')
  expect(createReducer.bind(this, { mountPath: 'ui component' })).toThrowError('InitialState must be plain object')
  expect(createReducer.bind(this, { mountPath: 'ui component', initialState: {}, listenActions: 123 })).toThrowError('ListenActions must be plain object')
  expect(createReducer.bind(this, { mountPath: 'ui component', initialState: {}, connectToStore: null })).toThrowError('ConnectToStore must be boolean')
  expect(createReducer.bind(this, { mountPath: 'ui component', initialState: {}, persist: null })).toThrowError('Persist must be boolean')
  expect(createReducer.bind(this, { mountPath: 'ui component', initialState: {}, actionPrefix: 123 })).toThrowError('ActionPrefix must be non empty string')
})

test('Test invalid init component', () => {
  const Component = () => <div/>

  const ExtendedComponent1 = createReducer({ initialState: {} })(Component)

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1/>
  )).toThrowError('Mount path must be defined')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath={['ui component']} />
  )).toThrowError('Mount path must be string')

  expect(renderer.create.bind(renderer,
    <ExtendedComponent1 reduxMountPath="ui component" reduxPersist="true" />
  )).toThrowError('Persist must be boolean')

  const ExtendedComponent2 = createReducer({ mountPath: 'ui component', initialState: () => undefined })(Component)
  expect(renderer.create.bind(renderer,
    <ExtendedComponent2/>
  )).toThrowError('InitialState must be plain object')


  const ExtendedComponent3 = createReducer({ mountPath: 'ui component', initialState: {}, listenActions: () => undefined })(Component)
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

test('Test valid init component without provide redux store', () => {
  const Component = (props) => (
    <div>
      <span>{typeof props.reduxSetState}</span>
      <span>{typeof props.reduxResetState}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist}</span>
      <span>{props.actionPrefix}</span>
    </div>
  )
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
    reduxResetState: PropTypes.func.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.string.isRequired,
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({ mountPath: 'ui component', initialState: { text: 'My first todo' } })(Component)

  const component = renderer.create(<ExtendedComponent />)
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test valid init component with provide redux store', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.reduxSetState}</span>
      <span>{typeof props.reduxResetState}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist}</span>
      <span>{props.actionPrefix}</span>
    </div>
  )
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
    reduxResetState: PropTypes.func.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.string.isRequired,
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({ mountPath: 'ui component', initialState: { text: 'My first todo' } })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test passed mount path in Component', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{props.reduxMountPath}</div>
  )
  Component.propTypes = {
    reduxMountPath: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({ initialState: { text: 'My first todo' } })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component" />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test passed mount path in createReducer and in Component', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{props.reduxMountPath}</div>
  )
  Component.propTypes = {
    reduxMountPath: PropTypes.string.isRequired,
  }
  const initialState = { text: 'My first todo' }
  const ExtendedComponent = createReducer({ mountPath: 'state', initialState })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui other-component" />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
  expect(store.getState().ui['other-component'].state).toBe(initialState)
})

test('Test passed persist in createReducer', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{props.persist}</div>
  )
  Component.propTypes = {
    persist: PropTypes.string.isRequired
  }
  const ExtendedComponent = createReducer({ mountPath: 'ui component', initialState: { text: 'My first todo' }, persist: false })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test passed persist in Component', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{props.persist}</div>
  )
  Component.propTypes = {
    persist: PropTypes.string.isRequired
  }
  const ExtendedComponent = createReducer({ mountPath: 'ui component', initialState: { text: 'My first todo' } })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxPersist={false} />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test passed persist in createReducer and Component', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{props.persist}</div>
  )
  Component.propTypes = {
    persist: PropTypes.string.isRequired
  }
  const ExtendedComponent = createReducer({ mountPath: 'ui component', initialState: { text: 'My first todo' }, persist: true })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxPersist={false} />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test initialState is function', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{JSON.stringify(props.reduxState)}</div>
  )
  Component.propTypes = {
    reduxState: PropTypes.object.isRequired,
  }
  const ExtendedComponent = createReducer({ mountPath: 'ui component', initialState: (props) => ({ text: props.text }) })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent text="My first todo" />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test listenActions', () => {
  const store = createStore(null, enhanceStore)
  const UPDATE_TODO = 'UPDATE_TODO'

  class Component extends React.Component {
    componentDidMount() {
      const { dispatch } = this.props
      dispatch({ type: `ui component/${UPDATE_TODO}`, text: 'My second todo' })
    }
    render() {
      const { props } = this
      return (
        <div>{JSON.stringify(props.reduxState)}</div>
      )
    }
  }
  Component.propTypes = {
    reduxState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  const ExtendedComponent = compose(
    createReducer({
      mountPath: 'ui component',
      initialState: { text: 'My first todo' },
      listenActions: { [`ui component/${UPDATE_TODO}`]: (state, action) => ({ text: action.text }) }
    }),
    connect(),
  )(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test listenActions is function', () => {
  const store = createStore(null, enhanceStore)
  const UPDATE_TODO = 'UPDATE_TODO'

  class Component extends React.Component {
    componentDidMount() {
      const { dispatch, text } = this.props
      dispatch({ type: `ui component/${UPDATE_TODO}`, text })
    }
    render() {
      const { props } = this
      return (
        <div>{JSON.stringify(props.reduxState)}</div>
      )
    }
  }
  Component.propTypes = {
    reduxState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
  }
  const ExtendedComponent = compose(
    createReducer({
      mountPath: 'ui component',
      initialState: { text: 'My first todo' },
      listenActions: (props, actionPrefix) =>
        ({ [`${actionPrefix}${UPDATE_TODO}`]: (state, action) => ({ text: action.text, num: props.num }) })
    }),
    connect(),
  )(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent text="My second todo" num="10" />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test connectToStore: false', () => {
  const store = createStore(null, enhanceStore)

  const Component = (props) => (
    <div>{JSON.stringify(props.reduxState)}</div>
  )
  Component.propTypes = {
    reduxState: PropTypes.object
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' },
    connectToStore: false
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test reset state (persist = false) after unmounting component', async () => {
  const store = createStore(null, enhanceStore)

  class Component extends React.Component {
    componentDidMount() {
      const { reduxSetState } = this.props
      reduxSetState('UPDATE-TODO', {
        text: 'My second todo',
      })
    }

    render() { return null }
  }
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component5555',
    initialState: { text: 'My first todo' },
    persist: false
  })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component5555":{"text":"My second todo"}}}')

  component.unmount()
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component5555":{"text":"My first todo"}}}')
})

test('Test preserved state (persist = true) after unmounting component', () => {
  const store = createStore(null, enhanceStore)

  class Component extends React.Component {
    componentDidMount() {
      const { reduxSetState } = this.props
      reduxSetState( 'UPDATE-TODO', {
        text: 'My second todo',
      })
    }

    render() { return null }
  }
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' }
  })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My second todo"}}}')

  component.unmount()
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My second todo"}}}')
})

test('Test empty (default) actionPrefix', () => {
  let actionType = null
  const middleware = () => () => (action) => {
    if (actionType === 'reset') {
      expect(action.type).toBe(`ui component/${RESET_STATE}`)
    } else {
      expect(action.type).toBe('ui component/@@UPDATE-TODO')
    }
  }
  const store = createStore(null, compose(applyMiddleware(middleware), enhanceStore))

  class Component extends React.Component {
    componentDidMount() {
      const { reduxSetState, reduxResetState } = this.props
      reduxSetState('UPDATE-TODO', {
        text: 'My second todo',
      })
      actionType = 'reset'
      reduxResetState()
    }

    render() {
      return <div>{this.props.actionPrefix}</div>
    }
  }
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
    reduxResetState: PropTypes.func.isRequired,
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' }
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test filled actionPrefix in createReducer', () => {
  const store = createStore(null, enhanceStore)

  const Component = ({ actionPrefix }) => {
    return <div>{actionPrefix}</div>
  }
  Component.propTypes = {
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' },
    actionPrefix: 'reducer-prefix/'
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test filled actionPrefix in component', () => {
  const store = createStore(null, enhanceStore)

  const Component = ({ actionPrefix }) => {
    return <div>{actionPrefix}</div>
  }
  Component.propTypes = {
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' }
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxActionPrefix="component-prefix/"/>
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test filled actionPrefix in component and createReducer', () => {
  const store = createStore(null, enhanceStore)

  const Component = ({ actionPrefix }) => {
    return <div>{actionPrefix}</div>
  }
  Component.propTypes = {
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' },
    actionPrefix: 'reducer-prefix/'
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxActionPrefix="component-prefix/"/>
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})

test('Test reduxResetState', () => {
  const store = createStore(null, enhanceStore)

  class Component extends React.Component {
    componentDidMount() {
      const { reduxSetState } = this.props
      reduxSetState('UPDATE-TODO', {
        text: 'My second todo',
      })
    }

    onClick = () => {
      const { reduxResetState } = this.props
      reduxResetState()
    }

    render() {
      const { props } = this
      return (
        <a onClick={this.onClick}>
          {JSON.stringify(props.reduxState)}
        </a>
      )
    }
  }
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
    reduxResetState: PropTypes.func.isRequired,
    reduxState: PropTypes.object.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' }
  })(Component)

  const tree = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  let component = tree.toJSON()
  expect(component).toMatchSnapshot()

  component.props.onClick()
  component = tree.toJSON()
  expect(component).toMatchSnapshot()
})

test('Test signature reduxSetState', () => {
  const store = createStore(null, enhanceStore)

  class Component extends React.Component {
    componentDidMount() {
      const { reduxSetState } = this.props
      expect(reduxSetState).toThrowError('Action type must be non empty string')
      expect(reduxSetState.bind(this, 'INCREMENT')).toThrowError('New state must be plain object or function')
      expect(reduxSetState.bind(this, 'INCREMENT', 1)).toThrowError('New state must be plain object or function')
      expect(reduxSetState.bind(this, 'INCREMENT', () => 123)).toThrowError('New state must be non empty plain object')
    }

    render() { return null }
  }
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo' }
  })(Component)

  renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
})

test('Test reduxSetState', () => {
  const store = createStore(null, enhanceStore)
  let numRender = 0
  class Component extends React.Component {
    componentDidMount() {
      const { reduxSetState, reduxState } = this.props
      reduxSetState('UPDATE-TODO', { text: 'My second todo' })
      reduxSetState('INCREMENT', ({ num }) => ({
        num: ++num
      }))
      reduxSetState('UPDATE-TODO', { text: 'My third todo' })
      reduxSetState('INCREMENT', ({ num }) => {
        expect(num).toBe(2)
        return {
          num: num * 2
        }
      })
      expect(reduxState.num).toBe(1)
      expect(reduxState.text).toBe('My first todo')
    }

    render() {
      const { props } = this
      numRender++
      return (
        <div>{JSON.stringify(props.reduxState)}</div>
      )
    }
  }
  Component.propTypes = {
    reduxSetState: PropTypes.func.isRequired,
    reduxState: PropTypes.object.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'ui component',
    initialState: { text: 'My first todo', num: 1 }
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
  expect(numRender).toBe(2)
})

test('Test replace native state to redux state', () => {
  const store = createStore(null, enhanceStore)

  class Component extends React.Component {
    constructor(props) {
      super(props)
      this.state = props.reduxState
      this.setState = props.reduxSetState.bind(this, 'UPDATE-TODO')
    }
    componentDidMount() {
      this.setState((state) => ({ num: state.num ? ++state.num : 1 }))
      this.setState({ text: 'My second todo'})
      this.setState({ text: 'My third todo'})
      this.setState((state) => ({ num: state.num / 4 }))
    }

    componentWillReceiveProps(nextProps) {
      if (this.state !== nextProps.reduxState) {
        this.state = nextProps.reduxState
      }
    }

    render() {
      return (
        <div>{JSON.stringify(this.state)}</div>
      )
    }
  }
  Component.propTypes = {
    reduxState: PropTypes.object.isRequired,
    reduxSetState: PropTypes.func.isRequired,
  }
  const ExtendedComponent = createReducer({
    mountPath: 'state',
    initialState: { text: 'My first todo' }
  })(Component)

  const component = renderer.create(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component" />
    </Provider>
  )
  expect(component.toJSON()).toMatchSnapshot()
})
