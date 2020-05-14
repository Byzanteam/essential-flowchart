import * as Pathfinding from 'pathfinding';

import { IGrid } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function buildEmptyGrid (width: number, height: number): IGrid {
  // prevent vuex to observing pfGrid
  const pfGrid: Pathfinding.Grid = Object.freeze(
    new Pathfinding.Grid(width, height),
  );

  return {
    width,
    height,

    pfGrid,
  };
}
