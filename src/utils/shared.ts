/* eslint-disable @typescript-eslint/no-empty-function */

export function clamp (val: number, min: number, max: number): number {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

/**
 * Perform no operation.
 */
export function noop () {}
