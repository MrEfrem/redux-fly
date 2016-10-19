// @flow
/**
 * Trimmed and collapsed spaces in mount path
 */
export const normalizeMountPath = (path: any) => {
  if (typeof path !== 'string') {
    throw new Error('Mount path must be string')
  }
  return path.trim().replace(/\s{2,}/g,' ')
}
