// @flow
/**
 * Trimmed and collapsed spaces in mounting path
 */
export const normalizeMountPath = (path: any): string => {
  if (typeof path !== 'string') {
    throw new Error('Mounting path must be string')
  }
  return path.trim().replace(/\s{2,}/g,' ')
}
