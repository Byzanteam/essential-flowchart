/* eslint-disable @typescript-eslint/no-empty-function */

import { IRect } from '@/types';

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

export function checkIntersect (rectA: IRect, rectB: IRect): boolean {
  return rectA.x < rectB.x + rectB.width
    && rectA.x + rectA.width > rectB.x
    && rectA.y < rectB.y + rectB.height
    && rectA.y + rectA.height > rectB.y;
}
