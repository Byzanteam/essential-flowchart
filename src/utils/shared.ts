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

export function checkIntersect (rectA: IRect, rectB: IRect): boolean {
  return rectA.x < rectB.x + rectB.width
    && rectA.x + rectA.width > rectB.x
    && rectA.y < rectB.y + rectB.height
    && rectA.y + rectA.height > rectB.y;
}

export function groupBy<T> (collection: Array<T>, criteria: (item: T) => string): Record<string, T[]> {
  return collection.reduce((obj, item) => {
    const key = criteria(item);

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = [item];
    } else {
      obj[key].push(item);
    }

    return obj;
  }, {} as Record<string, T[]>);
}
