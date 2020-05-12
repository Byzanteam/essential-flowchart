import { Matrix } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function buildEmptyMatrix (width: number, height: number): Matrix {
  const matrix = [];

  for (let i = 0; i < height; i += 1) {
    matrix.push(new Array(width).fill(0));
  }

  return matrix;
}
