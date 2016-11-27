// @flow
import { checkMountPath } from './checks'
/**
 * Trimmed and collapsed spaces in mounting path
 */
export const normalizeMountPath = (path: any): string => {
  checkMountPath(path)
  return path.trim().replace(/\s{2,}/g,' ')
}
