import * as actions from '../src/actions'

test('Verify Defined UPDATE_STATE', () => {
  expect(typeof actions.UPDATE_STATE).toBe('string')
  expect(actions.UPDATE_STATE.length).toBeGreaterThan(0)
})
