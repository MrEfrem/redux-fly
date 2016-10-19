import createBoundedReducer from '../src/createBoundedReducer'
import { MOUNT_PATH, UUID, RESET_STATE } from '../src/consts'

test('Test no match action', () => {
  const preloadedState = {
    text: 'My first todo!'
  }
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})(undefined,
    { type: 'TEST_ACTION' }
  )).toBe(preloadedState)

  const text = 'My second todo'
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})({ text },
    { type: 'TEST_ACTION' }
  ).text).toBe(text)

  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})(undefined,
    { type: 'MEGA_UPDATE', [MOUNT_PATH]: 'ui todo', newState: text }
  ).text).toBe(preloadedState.text)
})

test('Test match action', () => {
  const preloadedState = {
    text: 'My first todo!'
  }

  // Test RESET state
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})({ test: 'Second todo!' },
    { type: RESET_STATE, [MOUNT_PATH]: 'ui todo  ' }
  )).not.toBe(preloadedState)
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})(undefined,
    { type: RESET_STATE, [MOUNT_PATH]: '  ui   todo ' }
  ).text).toBe(preloadedState.text)
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})({ test: 'Second todo!' },
    { type: RESET_STATE, [MOUNT_PATH]: '  ui   todo ' }
  ).text).toBe(preloadedState.text)

  // Test UPDATE state
  const newState = { text: 'My second todo' }
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})(undefined,
    { type: 'MEGA_UPDATE', [MOUNT_PATH]: 'ui todo   ', newState, [UUID]: 'RANDOM_UUID' }
  ).text).toBe(newState.text)
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {})({ ...preloadedState },
    { type: 'MEGA_UPDATE', [MOUNT_PATH]: 'ui todo   ', newState, [UUID]: 'RANDOM_UUID' }
  ).text).toBe(newState.text)
})

test('Test subscribe to actions', () => {
  const preloadedState = {
    text: 'My first todo!'
  }
  const newText = 'My third todo'
  const ACTION = 'OTHER_ACTION'
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {
    [ACTION]: (state, action) => ({ text: action.text })
  })(undefined,
    { type: ACTION, text: newText }
  ).text).toBe(newText)
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', preloadedState, {
    [ACTION]: (state, action) => ({ text: action.text })
  })({ ...preloadedState },
    { type: ACTION, text: newText }
  ).text).toBe(newText)
})
