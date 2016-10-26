// @flow
/**
 * Check mountPath
 * @param  {string} path
 * @return {void}
 */
export const checkMountPath = (path: any) => {
  if (typeof path !== 'string' || !path.trim().length) {
    throw new Error('Mount path must be string')
  }
}
