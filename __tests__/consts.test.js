import * as consts from '../src/consts'

test('Verify Defined CONSTS', () => {
  expect(consts).toMatchSnapshot()  
})
