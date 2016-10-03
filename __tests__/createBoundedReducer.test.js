import createBoundedReducer from '../src/createBoundedReducer'
import { UPDATE_STATE } from '../src/actions'

test('Test no match action', () => {
  const initialState = {
    text: 'My first todo!'
  }
  expect(createBoundedReducer('ui todo', initialState, {})(undefined,
    { type: 'TEST_ACTION' }
  )).toBe(initialState)

  const text = 'My second todo'
  expect(createBoundedReducer('ui todo', initialState, {})({ text },
    { type: 'TEST_ACTION' }
  ).text).toBe(text)
})

test('Test UPDATE_STATE action', () => {
  const initialState = {
    text: 'My first todo!'
  }
  expect(createBoundedReducer('ui todo', initialState, {})(undefined,
    { type: UPDATE_STATE }
  )).toBe(initialState)

  const newState = { text: 'My second todo' }
  expect(createBoundedReducer('ui todo', initialState, {})(undefined,
    { type: UPDATE_STATE, instance: 'ui todo', newState }
  ).text).toBe(newState.text)
})

test('Test subscibe to actions', () => {
  const initialState = {
    text: 'My first todo!'
  }
  const newText = 'My third todo'
  const ACTION = 'OTHER_ACTION'
  expect(createBoundedReducer('ui todo', initialState, {
    [ACTION]: (state, action) => ({ text: action.text })
  })(undefined,
    { type: ACTION, text: newText }
  ).text).toBe(newText)
})
