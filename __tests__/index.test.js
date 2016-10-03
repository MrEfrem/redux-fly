import * as exports from '../src'

test('Test library exports', () => {
  expect(exports).toMatchSnapshot()
})
