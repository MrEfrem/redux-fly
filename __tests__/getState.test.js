import getState from '../src/getState'

test('Test invalid signature', () => {
  expect(getState).toThrowError('Mount path must be non empty string')
  expect(getState.bind(this, 123)).toThrowError('Mount path must be non empty string')
  expect(getState.bind(this, '')).toThrowError('Mount path must be non empty string')
  expect(getState('ui component')).toThrowError('State must be plain object')
  expect(getState('ui component').bind(this, 123)).toThrowError('State must be plain object')
})

test('Test valid signature', () => {
  const state = {
    ui: {
      component: {
        text: 'My first todo'
      }
    }
  }
  expect(getState('  ui  component    ')(state)).toBe(state.ui.component)
  expect(getState('ui')(state)).toBe(state.ui)
  expect(getState('ui component text')(state)).toBe(state.ui.component.text)

  expect(getState('ui   text')(state)).toBeUndefined()
  expect(getState('todo list')(state)).toBeUndefined()
})
