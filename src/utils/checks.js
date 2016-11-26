// @flow
/**
 * Check mounting path
 * @param  {string} path
 * @return {void}
 */
export const checkMountPath = (path: any) => {
  if (typeof path !== 'string' || !path.trim().length) {
    throw new Error('Mounting path must be string')
  }
}
