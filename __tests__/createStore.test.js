import createStore from '../src/createStore'
import { createStore as baseCreateStore } from 'redux'

test('Test createStore', () => {
  const store = createStore(baseCreateStore)(() => {})
  expect(store).toMatchSnapshot()
})
