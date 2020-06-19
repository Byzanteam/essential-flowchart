// eslint-disable-next-line import/prefer-default-export
export function clamp (val: number, min: number, max: number): number {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

export function noop (): () => void {
  // eslint-disable-next-line
  return function () {};
}
