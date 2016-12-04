import createBoundedReducer from '../src/createBoundedReducer'
import { MOUNT_PATH, RESET_STATE, NEW_STATE } from '../src/consts'

const preloadedState = {
  text: 'My first todo'
}

test('Test listenActions returned an undefined', () => {
  expect(createBoundedReducer('ui todo', preloadedState, () => undefined, 'ui todo/', {}).bind(this, undefined,
    { type: 'TEST_ACTION' }
  )).toThrowError('ListenActions should return an object')
})

test('Test signature of listenActions', () => {
  expect(createBoundedReducer('ui todo', preloadedState, (...args) => {
    expect(args).toMatchSnapshot()
    return args[0]
  }, 'ui todo/', { num: 1 })(undefined,
    { type: 'TEST_ACTION' }
  ))
})

test('Test no match action', () => {
  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(undefined,
    { type: 'TEST_ACTION' }
  )).toBe(preloadedState)

  const text = 'My second todo'
  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})({ text },
    { type: 'TEST_ACTION' }
  ).text).toBe(text)

  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(undefined,
    { type: 'MEGA_UPDATE', [NEW_STATE]: text }
  ).text).toBe(preloadedState.text)

  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(undefined,
    { type: 'MEGA_UPDATE', [NEW_STATE]: text, [MOUNT_PATH]: 'todo list' }
  ).text).toBe(preloadedState.text)

  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(undefined,
    { type: 'ui todo/MEGA_UPDATE', [NEW_STATE]: text, [MOUNT_PATH]: 'todo list' }
  ).text).toBe(preloadedState.text)
})

test('Test match action', () => {
  const preloadedState = {
    text: 'My first todo'
  }
  const newState = {
    text: 'My second todo'
  }

  // Test reset state
  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(newState,
    { type: `ui todo/${RESET_STATE}`, [MOUNT_PATH]: 'ui todo', [NEW_STATE]: preloadedState }
  )).not.toBe(preloadedState)
  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(newState,
    { type: `ui todo/${RESET_STATE}`, [MOUNT_PATH]: 'ui todo', [NEW_STATE]: preloadedState }
  ).text).toBe(preloadedState.text)

  // Test update state
  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})(undefined,
    { type: 'MEGA_UPDATE', [NEW_STATE]: newState, [MOUNT_PATH]: 'ui todo' }
  ).text).toBe(newState.text)
  expect(createBoundedReducer('ui todo', preloadedState, undefined, 'ui todo/', {})({ ...preloadedState },
    { type: 'MEGA_UPDATE', [NEW_STATE]: newState, [MOUNT_PATH]: 'ui todo' }
  ).text).toBe(newState.text)
})

test('Test subscribe to actions', () => {
  const preloadedState = {
    text: 'My first todo!',
    num: 1
  }
  const newText = 'My third todo'
  const ACTION = 'OTHER_ACTION'

  expect(JSON.stringify(createBoundedReducer('RANDOM_UUID', preloadedState, (state, action) => {
    if (action.type === ACTION) {
      return { ...state, text: action.text }
    }
    return state
  }, 'ui todo', {})(undefined,
    { type: ACTION, text: newText }
  ))).toBe(JSON.stringify({ text: newText, num: 1 }))

  expect(JSON.stringify(createBoundedReducer('RANDOM_UUID', preloadedState, (state, action) => {
    if (action.type === ACTION) {
      return { ...state, text: action.text }
    }
    return state
  }, 'ui todo')({ ...preloadedState },
    { type: ACTION, text: newText }
  ))).toBe(JSON.stringify({ text: newText, num: 1 }))
})
