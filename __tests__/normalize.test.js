import { normalizeMountPath } from '../src/utils/normalize'

test('Test normalizeMountPath', () => {
  expect(normalizeMountPath).toThrow()
  expect(normalizeMountPath.bind(this, 1)).toThrow()
  expect(normalizeMountPath(' a  b    c d ')).toBe('a b c d')
})
