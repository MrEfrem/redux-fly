import genUUID from '../src/genUUIDv4'

test('Test generating RFC4122 version 4 UUID', () => {
  expect(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/.test(genUUID())).toBeTruthy()
})
