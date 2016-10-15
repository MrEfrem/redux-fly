import * as checks from '../src/checks'

test('Test checkPreloadedState', () => {
  expect(checks.checkPreloadedState).toThrow()
  expect(checks.checkPreloadedState.bind(this, {}))
})

test('Test checkOptions', () => {
  expect(checks.checkOptions).toThrow()
  expect(checks.checkOptions.bind(this, {}))
})

test('Test checkMountPath', () => {
  expect(checks.checkMountPath).toThrow()
  expect(checks.checkMountPath.bind(this, '')).toThrow()
  expect(checks.checkMountPath.bind(this, ' ')).toThrow()
  expect(checks.checkMountPath.bind(this, 'ui'))
})
