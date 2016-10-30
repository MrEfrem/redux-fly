import createReducer from '../src/createReducer'
import renderer from 'react-test-renderer'
import React, { PropTypes } from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'
import flyEnhancedStore from '../src/createStore'
import { mount } from 'enzyme'
import { RESET_STATE } from '../src/consts'

test('Test invalid signature with mount path', () => {
  expect(createReducer).toThrowError('Invalid parameters')
  expect(createReducer.bind(this, 10)).toThrowError('Mount path must be string')
  expect(createReducer.bind(this, 'ui component')).toThrowError('PreloadedState must be plain object')
  expect(createReducer.bind(this, 'ui component', {}, 123)).toThrowError('ListenActions must be plain object')
  expect(createReducer.bind(this, 'ui component', {}, null, null)).toThrowError('Options must be plain object')
  expect(createReducer.bind(this, 'ui component', {}, null, { connectToStore: null })).toThrowError('ConnectToStore must be boolean')
  expect(createReducer.bind(this, 'ui component', {}, null, { persist: null })).toThrowError('Persist must be boolean')
  expect(createReducer.bind(this, 'ui component', {}, null, { actionPrefix: 123 })).toThrowError('ActionPrefix must be non empty string')
})

test('Test invalid signature without mount path', () => {
  expect(createReducer.bind(this, {}, 123)).toThrowError('ListenActions must be plain object')
  expect(createReducer.bind(this, {}, null, 123)).toThrowError('Options must be plain object')
  expect(createReducer.bind(this, {}, null, { connectToStore: null })).toThrowError('ConnectToStore must be boolean')
  expect(createReducer.bind(this, {}, null, { persist: null })).toThrowError('Persist must be boolean')
  expect(createReducer.bind(this, {}, null, { actionPrefix: 123 })).toThrowError('ActionPrefix must be non empty string')
})

test('Test invalid init component', () => {
  const Component = () => <div/>

  const ExtendedComponent1 = createReducer({})(Component)

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

test('Test valid init component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>
      <span>{typeof props.setReduxState}</span>
      <span>{typeof props.resetReduxState}</span>
      <span>{props.reduxMountedPath}</span>
      <span>{JSON.stringify(props.reduxState)}</span>
      <span>{props.persist}</span>
      <span>{props.actionPrefix}</span>
    </div>
  )
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
    persist: PropTypes.string.isRequired,
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div><span>function</span><span>function</span><span>ui component</span>' +
      '<span>{\"text\":\"My first todo\"}</span><span>false</span><span>ui component/</span></div>')
})

test('Test passed mount path in Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{props.reduxMountedPath}</div>
  )
  Component.propTypes = {
    reduxMountedPath: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer({ text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui component" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div>ui component</div>')
})

test('Test passed mount path in createReducer and Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{props.reduxMountedPath}</div>
  )
  Component.propTypes = {
    reduxMountedPath: PropTypes.string.isRequired,
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxMountPath="ui other-component" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div>ui other-component</div>')
})

test('Test passed persist in createReducer', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{props.persist}</div>
  )
  Component.propTypes = {
    persist: PropTypes.string.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' }, null, { persist: true })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
  expect(component.html()).
    toBe('<div>true</div>')
})

test('Test passed persist in Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{props.persist}</div>
  )
  Component.propTypes = {
    persist: PropTypes.string.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxPersist={true} />
    </Provider>
  )
  expect(component.html()).
    toBe('<div>true</div>')
})

test('Test passed persist in createReducer and Component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{props.persist}</div>
  )
  Component.propTypes = {
    persist: PropTypes.string.isRequired
  }
  const ExtendedComponent = createReducer('ui component', { text: 'My first todo' }, null, { persist: true })(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxPersist={false} />
    </Provider>
  )
  expect(component.html()).
    toBe('<div>false</div>')
})

test('Test preloadedState is function', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{JSON.stringify(props.reduxState)}</div>
  )
  Component.propTypes = {
    reduxState: PropTypes.object.isRequired,
  }
  const ExtendedComponent = createReducer('ui component', (props, mountPath) => ({ text: props.text, mountPath }))(Component)

  let component = mount(
    <Provider store={store}>
      <ExtendedComponent text="My first todo" />
    </Provider>
  )
  expect(component.html()).
    toBe('<div>{\"text\":\"My first todo\",\"mountPath\":\"ui component\"}</div>')
})

test('Test listenActions', () => {
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
        <div>{JSON.stringify(props.reduxState)}</div>
      )
    }
  }
  Component.propTypes = {
    reduxMountedPath: PropTypes.string.isRequired,
    reduxState: PropTypes.object.isRequired,
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
    toBe('<div>{\"text\":\"My second todo\",\"mountPath\":\"ui component\"}</div>')
})

test('Test listenActions is function', () => {
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
        <div>{JSON.stringify(props.reduxState)}</div>
      )
    }
  }
  Component.propTypes = {
    reduxState: PropTypes.object.isRequired,
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
    toBe('<div>{\"text\":\"My second todo\",\"mountPath\":\"ui component\"}</div>')
})

test('Test connectToStore: false', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = (props) => (
    <div>{JSON.stringify(props.reduxState)}</div>
  )
  Component.propTypes = {
    reduxState: PropTypes.object
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
    toBe('<div></div>')
})

test('Test reset state (persist = false) after unmounting component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState } = this.props
      setReduxState('update_todo', {
        text: 'My second todo',
      })
    }

    render() { return null }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
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
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My second todo"}}}')

  component.unmount()
  expect(JSON.stringify(store.getState())).toBe('{"ui":{"component":{"text":"My first todo"}}}')
})

test('Test preserved state (persist = true) after unmounting component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState } = this.props
      setReduxState( 'update_todo', {
        text: 'My second todo',
      })
    }

    render() { return null }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
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
      expect(action.type).toBe('ui component/update_todo')
    }
  }
  const store = createStore(null, null, compose(applyMiddleware(middleware), flyEnhancedStore))

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState, resetReduxState } = this.props
      setReduxState('update_todo', {
        text: 'My second todo',
      })
      actionType = 'reset'
      resetReduxState()
    }

    render() {
      return <div>{this.props.actionPrefix}</div>
    }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
    )
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )

  expect(component.html()).toBe('<div>ui component/</div>')
})

test('Test filled actionPrefix in createReducer', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = ({ actionPrefix }) => {
    return <div>{actionPrefix}</div>
  }
  Component.propTypes = {
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
      null,
      {
        actionPrefix: 'reducer-prefix/'
      }
    )
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )

  expect(component.html()).toBe('<div>reducer-prefix/</div>')
})

test('Test filled actionPrefix in component', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = ({ actionPrefix }) => {
    return <div>{actionPrefix}</div>
  }
  Component.propTypes = {
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer('ui component', { text: 'My first todo' })
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxActionPrefix="component-prefix/"/>
    </Provider>
  )

  expect(component.html()).toBe('<div>component-prefix/</div>')
})

test('Test filled actionPrefix in component and createReducer', () => {
  const store = createStore(null, null, flyEnhancedStore)

  const Component = ({ actionPrefix }) => {
    return <div>{actionPrefix}</div>
  }
  Component.propTypes = {
    actionPrefix: PropTypes.string.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
      null,
      {
        actionPrefix: 'reducer-prefix/'
      }
    )
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent reduxActionPrefix="component-prefix/"/>
    </Provider>
  )

  expect(component.html()).toBe('<div>component-prefix/</div>')
})

test('Test resetReduxState', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState } = this.props
      setReduxState('update_todo', {
        text: 'My second todo',
      })
    }

    handleClick = () => {
      const { resetReduxState } = this.props
      resetReduxState()
    }

    render() {
      const { props } = this
      return (
        <div>
          <span>{JSON.stringify(props.reduxState)}</span>
          <a id="a" onClick={this.handleClick}>Reset redux state</a>
        </div>
      )
    }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
    resetReduxState: PropTypes.func.isRequired,
    reduxState: PropTypes.object.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
    )
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )

  expect(component.html()).
    toBe('<div><span>{\"text\":\"My second todo\"}</span><a id=\"a\">Reset redux state</a></div>')

  component.find('#a').simulate('click')

  expect(component.html()).
    toBe('<div><span>{\"text\":\"My first todo\"}</span><a id=\"a\">Reset redux state</a></div>')
})

test('Test signature setReduxState', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState } = this.props
      expect(setReduxState).toThrowError('Action type must be non empty string')
      expect(setReduxState.bind(this, 'increment')).toThrowError('New state must be plain object or function')
      expect(setReduxState.bind(this, 'increment', 1)).toThrowError('New state must be plain object or function')
      expect(setReduxState.bind(this, 'increment', () => 123)).toThrowError('New state must be non empty plain object')
    }

    render() { return null }
  }
  Component.propTypes = {
    setReduxState: PropTypes.func.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
    )
  )(Component)

  mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )
})

test('Test setReduxState', () => {
  const store = createStore(null, null, flyEnhancedStore)
  let numRender = 0
  class Component extends React.Component {
    componentDidMount() {
      const { setReduxState, reduxState } = this.props
      setReduxState('update_todo', { text: 'My second todo' })
      setReduxState('increment', ({ num }) => ({
        num: ++num
      }))
      setReduxState('update_todo', { text: 'My third todo' })
      setReduxState('increment', ({ num }) => {
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
    setReduxState: PropTypes.func.isRequired,
    reduxState: PropTypes.object.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo', num: 1 }
    )
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )

  expect(component.html()).
    toBe('<div>{\"text\":\"My third todo\",\"num\":4}</div>')

  expect(numRender).toBe(2)
})

test('Test replace native state to redux state', () => {
  const store = createStore(null, null, flyEnhancedStore)

  class Component extends React.Component {
    constructor(props) {
      super(props)
      this.state = props.reduxState
      this.setState = props.setReduxState.bind(this, 'todo')
    }
    componentDidMount() {
      this.setState({ text: 'My second todo'})
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
    setReduxState: PropTypes.func.isRequired,
  }
  const ExtendedComponent = compose(
    createReducer(
      'ui component',
      { text: 'My first todo' },
    )
  )(Component)

  const component = mount(
    <Provider store={store}>
      <ExtendedComponent />
    </Provider>
  )

  expect(component.html()).toBe('<div>{\"text\":\"My second todo\"}</div>')
})
