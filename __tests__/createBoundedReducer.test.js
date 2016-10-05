import createBoundedReducer from '../src/createBoundedReducer'
import { MOUNT_PATH, UUID } from '../src/consts'

test('Test no match action', () => {
  const initialState = {
    text: 'My first todo!'
  }
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', initialState, {})(undefined,
    { type: 'TEST_ACTION' }
  )).toBe(initialState)

  const text = 'My second todo'
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', initialState, {})({ text },
    { type: 'TEST_ACTION' }
  ).text).toBe(text)
})

test('Test match action', () => {
  const initialState = {
    text: 'My first todo!'
  }
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', initialState, {})(undefined,
    { type: 'MEGA_UPDATE' }
  )).toBe(initialState)

  const newState = { text: 'My second todo' }
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', initialState, {})(undefined,
    { type: 'MEGA_UPDATE', [MOUNT_PATH]: 'ui todo', newState }
  ).text).toBe(initialState.text)

  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', initialState, {})(undefined,
    { type: 'MEGA_UPDATE', [MOUNT_PATH]: 'ui todo', newState, [UUID]: 'RANDOM_UUID' }
  ).text).toBe(newState.text)
})

test('Test subscibe to actions', () => {
  const initialState = {
    text: 'My first todo!'
  }
  const newText = 'My third todo'
  const ACTION = 'OTHER_ACTION'
  expect(createBoundedReducer('RANDOM_UUID', 'ui todo', initialState, {
    [ACTION]: (state, action) => ({ text: action.text })
  })(undefined,
    { type: ACTION, text: newText }
  ).text).toBe(newText)
})
