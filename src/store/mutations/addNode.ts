import * as Pathfinding from 'pathfinding';

import { IState, INode, NodeRect } from '@/types';

const defaultOffset = 12;

enum Direction {
  Top,
  Right,
  Bottom,
  Left,
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
    case Direction.Top:
      lines = [
        [[startX, y], [midX - 1, y]],
        [[midX - 1, y + 1], [midX - 1, y - defaultOffset]],
        [[midX - 1, y + 1], [midX + 1, y + 1]],
        [[midX + 1, y + 1], [midX + 1, y - defaultOffset]],
        [[midX + 1, y], [endX, y]],
      ];
      break;

    case Direction.Bottom:
      lines = [
        [[startX, y], [midX + 1, y]],
        [[midX + 1, y - 1], [midX + 1, y + defaultOffset]],
        [[midX + 1, y - 1], [midX - 1, y - 1]],
        [[midX - 1, y - 1], [midX - 1, y + defaultOffset]],
        [[midX - 1, y], [endX, y]],
      ];
      break;

    case Direction.Right:
      lines = [
        [[x, startY], [x, midY - 1]],
        [[x - 1, midY - 1], [x + defaultOffset, midY - 1]],
        [[x - 1, midY - 1], [x - 1, midY + 1]],
        [[x - 1, midY + 1], [x + defaultOffset, midY + 1]],
        [[x, midY + 1], [x, endY]],
      ];
      break;

    case Direction.Left:
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

function markWalkable (
  grid: Pathfinding.Grid,
  [
    x,
    y,
    width,
    height,
  ]: NodeRect,
  walkable: boolean,
) {
  const topLeft: [number, number] = [x, y];
  const topRight: [number, number] = [x + width, y];
  const bottomRight: [number, number] = [x + width, y + height];
  const bottomLeft: [number, number] = [x, y + height];

  markWall(grid, topLeft, topRight, Direction.Top, walkable);
  markWall(grid, topRight, bottomRight, Direction.Right, walkable);
  markWall(grid, bottomRight, bottomLeft, Direction.Bottom, walkable);
  markWall(grid, bottomLeft, topLeft, Direction.Left, walkable);
}

export default function (state: IState, { node }: { node: INode }) {
  const { pfGrid } = state.graph.grid;
  markWalkable(
    pfGrid,
    [node.x, node.y, node.width, node.height],
    false,
  );

  state.graph.nodes[node.id] = node;
}
