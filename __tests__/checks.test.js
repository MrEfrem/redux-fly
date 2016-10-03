import * as checks from '../src/checks'

test('Test checkInitialState', () => {
  expect(checks.checkInitialState).toThrow()
  expect(checks.checkInitialState.bind(this, {}))
})

test('Test checkListenActions', () => {
  expect(checks.checkListenActions)
  expect(checks.checkListenActions.bind(this, true)).toThrow()
  expect(checks.checkListenActions.bind(this, {}))
})

test('Test checkOptions', () => {
  expect(checks.checkOptions).toThrow()
  expect(checks.checkOptions.bind(this, {}))
})

test('Test checkDetailOptions', () => {
  expect(checks.checkDetailOptions).toThrow()
  expect(checks.checkDetailOptions.bind(this, {})).toThrow()
  expect(checks.checkDetailOptions.bind(this, { rootReducerName: true })).toThrow()
  expect(checks.checkDetailOptions.bind(this, { rootReducerName: '' })).toThrow()
  expect(checks.checkDetailOptions.bind(this, { rootReducerName: 'ui', connectToStore: '' })).toThrow()
  expect(checks.checkDetailOptions.bind(this, { rootReducerName: 'ui', connectToStore: true }))

  expect(checks.checkDetailOptions.bind(this, { rootReducerName: 'ui' }, true))
})
