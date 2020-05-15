import * as Pathfinding from 'pathfinding';
import { IGrid } from '@/types';

export const SCALE_FACTOR = 5;

// eslint-disable-next-line import/prefer-default-export
export function buildEmptyGrid (width: number, height: number): IGrid {
  // prevent vuex to observing pfGrid
  const pfGrid: Pathfinding.Grid = Object.freeze(
    new Pathfinding.Grid(width / SCALE_FACTOR, height / SCALE_FACTOR),
  );

  return {
    width,
    height,

    pfGrid,
  };
}
