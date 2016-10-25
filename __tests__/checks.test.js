import * as checks from '../src/utils/checks'

test('Test checkMountPath', () => {
  expect(checks.checkMountPath).toThrow()
  expect(checks.checkMountPath.bind(this, '')).toThrow()
  expect(checks.checkMountPath.bind(this, ' ')).toThrow()
  expect(checks.checkMountPath.bind(this, 'ui'))
})
