import createBoundedReducer from '../src/createBoundedReducer'
import { UUID, RESET_STATE, NEW_STATE } from '../src/consts'

test('Test no match action', () => {
  const preloadedState = {
    text: 'My first todo'
  }
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')(undefined,
    { type: 'TEST_ACTION' }
  )).toBe(preloadedState)

  const text = 'My second todo'
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')({ text },
    { type: 'TEST_ACTION' }
  ).text).toBe(text)

  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')(undefined,
    { type: 'MEGA_UPDATE', [NEW_STATE]: text }
  ).text).toBe(preloadedState.text)

  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')(undefined,
    { type: 'MEGA_UPDATE', [NEW_STATE]: text, [UUID]: 'OTHER_RANDOM_UUID' }
  ).text).toBe(preloadedState.text)

  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')({ test: 'Second todo!' },
    { type: RESET_STATE }
  ).test).not.toBe(preloadedState.text)

  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')({ test: 'Second todo!' },
    { type: RESET_STATE, [UUID]: 'OTHER_RANDOM_UUID' }
  ).test).not.toBe(preloadedState.text)
})

test('Test match action', () => {
  const preloadedState = {
    text: 'My first todo'
  }
  const newState = {
    text: 'My second todo'
  }

  // Test reset state
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')({ test: 'Second todo!' },
    { type: RESET_STATE, [UUID]: 'RANDOM_UUID' }
  )).not.toBe(preloadedState)
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')(undefined,
    { type: RESET_STATE, [UUID]: 'RANDOM_UUID' }
  ).text).toBe(preloadedState.text)

  // Test update state
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')(undefined,
    { type: 'MEGA_UPDATE', [NEW_STATE]: newState, [UUID]: 'RANDOM_UUID' }
  ).text).toBe(newState.text)
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {}, 'ui todo')({ ...preloadedState },
    { type: 'MEGA_UPDATE', [NEW_STATE]: newState, [UUID]: 'RANDOM_UUID' }
  ).text).toBe(newState.text)
})

test('Test subscribe to actions', () => {
  const preloadedState = {
    text: 'My first todo!'
  }
  const newText = 'My third todo'
  const ACTION = 'OTHER_ACTION'
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {
    [ACTION]: (state, action) => ({ text: action.text })
  }, 'ui todo')(undefined,
    { type: ACTION, text: newText }
  ).text).toBe(newText)
  expect(createBoundedReducer('RANDOM_UUID', preloadedState, {
    [ACTION]: (state, action) => ({ text: action.text })
  }, 'ui todo')({ ...preloadedState },
    { type: ACTION, text: newText }
  ).text).toBe(newText)
})
