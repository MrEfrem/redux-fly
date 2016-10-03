/**
 * Find state through mountPath
 * @param  {string} mountPath
 * @return {
    * @param {string} common state
    * @return finded state
    * function
    * }
 */
export default (mountPath) => (state) => {
  const keys = mountPath.split(' ')
  return keys.reduce((prev, next) => {
    if (prev && prev[next]) {
      return prev[next]
    }
  }, state)
}
