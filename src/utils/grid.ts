import * as Pathfinding from 'pathfinding';
import { NodeRect, IPosition } from '@/types';

export const SCALE_FACTOR = 5;

const defaultOffset = 5 / SCALE_FACTOR;

const enum Direction {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export function buildEmptyGrid (width: number, height: number) {
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

function markLine (
  grid: Pathfinding.Grid,
  [startX, startY]: [number, number],
  [endX, endY]: [number, number],
  walkable: boolean,
) {
  // @ts-ignore
  const points = Pathfinding.Util.interpolate(startX, startY, endX, endY);

  points.forEach(([x, y]: [number, number]) => {
    grid.setWalkableAt(x, y, walkable);
  });
}

//                 ^ ^
//                 | |
//                 | |
//     (x, y)      | |      (x + width, y)
//       ^-------->+ +-------->+
//       |         +->         |
//       |                     |
//       |                     v  (12px)
// <-----+^                   +------->
//        |                   |
// <-----++                   <------->
//       ^                     |
//       |                     |
//       |                     |
//       |         <-+         |
//       <---------+ +<--------v
// (x, y + height) | |       (x + width, y + height)
//                 | |
//                 | |
//                 v v

function markWall (
  grid: Pathfinding.Grid,
  [startX, startY]: [number, number],
  [endX, endY]: [number, number],
  direction: Direction,
  walkable: boolean,
) {
  let lines: Array<[[number, number], [number, number]]>;
  const midX = Math.ceil((startX + endX) / 2);
  const midY = Math.ceil((startY + endY) / 2);
  const x = startX;
  const y = startY;

  // eslint-disable-next-line default-case
  switch (direction) {
    case Direction.TOP:
      lines = [
        [[startX, y], [midX - 1, y]],
        [[midX - 1, y + 1], [midX - 1, y - defaultOffset]],
        [[midX - 1, y + 1], [midX + 1, y + 1]],
        [[midX + 1, y + 1], [midX + 1, y - defaultOffset]],
        [[midX + 1, y], [endX, y]],
      ];
      break;

    case Direction.BOTTOM:
      lines = [
        [[startX, y], [midX + 1, y]],
        [[midX + 1, y - 1], [midX + 1, y + defaultOffset]],
        [[midX + 1, y - 1], [midX - 1, y - 1]],
        [[midX - 1, y - 1], [midX - 1, y + defaultOffset]],
        [[midX - 1, y], [endX, y]],
      ];
      break;

    case Direction.RIGHT:
      lines = [
        [[x, startY], [x, midY - 1]],
        [[x - 1, midY - 1], [x + defaultOffset, midY - 1]],
        [[x - 1, midY - 1], [x - 1, midY + 1]],
        [[x - 1, midY + 1], [x + defaultOffset, midY + 1]],
        [[x, midY + 1], [x, endY]],
      ];
      break;

    case Direction.LEFT:
      lines = [
        [[x, startY], [x, midY + 1]],
        [[x + 1, midY + 1], [x - defaultOffset, midY + 1]],
        [[x + 1, midY + 1], [x + 1, midY - 1]],
        [[x + 1, midY - 1], [x - defaultOffset, midY - 1]],
        [[x, midY - 1], [x, endY]],
      ];
      break;
  }

  lines.forEach(([from, to]) => {
    markLine(grid, from, to, walkable);
  });
}

export function isInsideGrid (grid: Pathfinding.Grid, gridOffset: IPosition, x: number, y: number) {
  return grid.isInside((x - gridOffset.x) / SCALE_FACTOR, (y - gridOffset.y) / SCALE_FACTOR);
}

export function markNodeWalkable (
  grid: Pathfinding.Grid,
  [
    x,
    y,
    width,
    height,
  ]: NodeRect,
  walkable: boolean,
) {
  // TODO: optimize，不能为浮点数
  /* eslint-disable no-param-reassign */
  x = Math.ceil(x / SCALE_FACTOR);
  y = Math.ceil(y / SCALE_FACTOR);
  width = Math.ceil(width / SCALE_FACTOR);
  height = Math.ceil(height / SCALE_FACTOR);

  const topLeft: [number, number] = [x, y];
  const topRight: [number, number] = [x + width, y];
  const bottomRight: [number, number] = [x + width, y + height];
  const bottomLeft: [number, number] = [x, y + height];

  markWall(grid, topLeft, topRight, Direction.TOP, walkable);
  markWall(grid, topRight, bottomRight, Direction.RIGHT, walkable);
  markWall(grid, bottomRight, bottomLeft, Direction.BOTTOM, walkable);
  markWall(grid, bottomLeft, topLeft, Direction.LEFT, walkable);
}
