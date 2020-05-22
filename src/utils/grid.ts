import * as Pathfinding from 'pathfinding';
import {
  IGrid,
  INode,
  INodePort,
  PortDirection,
} from '@/types';

type Point = [number, number];
type Line = [Point, Point];

export const SCALE_FACTOR = 5;
const defaultOffset = SCALE_FACTOR;
const defaultGap = SCALE_FACTOR * 2;

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

function markLine (
  grid: Pathfinding.Grid,
  [[startX, startY], [endX, endY]]: Line,
  walkable: boolean,
) {
  // @ts-ignore
  const points = Pathfinding.Util.interpolate(startX, startY, endX, endY);

  points.forEach(([x, y]: [number, number]) => {
    grid.setWalkableAt(x, y, walkable);
  });
}

function markPort (
  grid: Pathfinding.Grid,
  port: INodePort,
  walkable: boolean,
) {
  const { direction, position } = port;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let { x, y } = position!;

  x = Math.ceil(x / SCALE_FACTOR);
  y = Math.ceil(y / SCALE_FACTOR);

  grid.setWalkableAt(x, y, !walkable);

  // eslint-disable-next-line default-case
  switch (direction) {
    case PortDirection.TOP:
      grid.setWalkableAt(x, y + 1, walkable);
      markLine(grid, [[x - 1, y - 1], [x - 1, y - defaultOffset / SCALE_FACTOR]], walkable);
      markLine(grid, [[x + 1, y - 1], [x + 1, y - defaultOffset / SCALE_FACTOR]], walkable);
      break;

    case PortDirection.RIGHT:
      grid.setWalkableAt(x - 1, y, walkable);
      markLine(grid, [[x + 1, y + 1], [x + defaultOffset / SCALE_FACTOR, y + 1]], walkable);
      markLine(grid, [[x + 1, y - 1], [x + defaultOffset / SCALE_FACTOR, y - 1]], walkable);
      break;

    case PortDirection.BOTTOM:
      grid.setWalkableAt(x, y - 1, walkable);
      markLine(grid, [[x - 1, y + 1], [x - 1, y + defaultOffset / SCALE_FACTOR]], walkable);
      markLine(grid, [[x + 1, y + 1], [x + 1, y + defaultOffset / SCALE_FACTOR]], walkable);
      break;

    case PortDirection.LEFT:
      grid.setWalkableAt(x + 1, y, walkable);
      markLine(grid, [[x - 1, y - 1], [x - defaultOffset / SCALE_FACTOR, y - 1]], walkable);
      markLine(grid, [[x - 1, y + 1], [x - defaultOffset / SCALE_FACTOR, y + 1]], walkable);
      break;
  }
}

function groupBy<Item> (collection: Array<Item>, criteria: (item: Item) => string): Record<string, Item[]> {
  return collection.reduce((obj, item) => {
    const key = criteria(item);

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = [item];
    } else {
      obj[key].push(item);
    }

    return obj;
  }, {} as Record<string, Item[]>);
}

function nextDots (start: number, length: number): number[] {
  let current = Math.ceil(start);
  const dots = [];

  for (let i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + defaultGap;
  }

  return dots;
}

function updatePorts (node: INode): INode {
  const {
    x, y, width, height,
  } = node;

  const groupedPorts = groupBy(
    Object.values(node.ports),
    port => port.direction,
  );

  const updatedPorts = Object.entries(groupedPorts).reduce((acc, [direction, ports]) => {
    const { length } = ports;
    const portsLength = 3 * length + defaultGap * (length - 1);
    let dots: number[];

    // eslint-disable-next-line default-case
    switch (direction) {
      case PortDirection.TOP:
        dots = nextDots(x + (width - portsLength) / 2, length);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y } };
        });
        break;

      case PortDirection.RIGHT:
        dots = nextDots(y + (height - portsLength) / 2, length);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: x + width, y: dots[index] } };
        });
        break;

      case PortDirection.BOTTOM:
        dots = nextDots(x + (width - portsLength) / 2, length);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y: y + height } };
        });
        break;

      case PortDirection.LEFT:
        dots = nextDots(y + (height - portsLength) / 2, length);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x, y: dots[index] } };
        });
        break;
    }

    return acc;
  }, {} as Record<string, INodePort>);

  return {
    ...node,
    ports: updatedPorts,
  };
}

//
//
// Step one: draw rectangle
//     (x, y)                       (x + width, y)
//       ^---------------------------->+
//       |          (width)            |
//       |                             |
//       |(height)                     |
//       |                             |
//       |                             |
//       <-----------------------------v
// (x, y + height)                   (x + width, y + height)
//

// step two: draw ports
//
//                 ^ ^     ^ ^
//                 | |     | |
//                 | |     | |
//     (x, y)      | |     | |      (x + width, y)
//       ^-------->+ +-----+ +-------->+
//       |          +       +          |
//       |                             |
//       |                             v  (12px)
// <-----+                             ------->
//        +                           +
// <-----+                             ------->
//       ^                             |
//       |                             |
//       |                             |
//       |          +      +           |
//       <---------+ +<---+ +----------v
// (x, y + height) | |    | |        (x + width, y + height)
//                 | |    | |
//                 | |    | |
//                 v v    v v
//

export function markNodeWalkable (
  grid: Pathfinding.Grid,
  node: INode,
  walkable: boolean,
): INode {
  const updatedNode = updatePorts(node);

  let {
    x,
    y,
    width,
    height,
  } = node;

  x = Math.ceil(x / SCALE_FACTOR);
  y = Math.ceil(y / SCALE_FACTOR);
  width = Math.ceil(width / SCALE_FACTOR);
  height = Math.ceil(height / SCALE_FACTOR);

  const topLeft: [number, number] = [x, y];
  const topRight: [number, number] = [x + width, y];
  const bottomRight: [number, number] = [x + width, y + height];
  const bottomLeft: [number, number] = [x, y + height];

  const lines: Record<PortDirection, Line> = {
    [PortDirection.TOP]: [topLeft, topRight],
    [PortDirection.RIGHT]: [topRight, bottomRight],
    [PortDirection.BOTTOM]: [bottomRight, bottomLeft],
    [PortDirection.LEFT]: [bottomLeft, topLeft],
  };

  // mark rectangle
  Object.values(lines).forEach(line => markLine(grid, line, walkable));

  // mark ports
  Object.values(updatedNode.ports).forEach(
    port => markPort(grid, port, walkable),
  );

  return updatedNode;
}

export const pathFinder = new Pathfinding.BiAStarFinder({
  heuristic: Pathfinding.Heuristic.manhattan,
  diagonalMovement: Pathfinding.DiagonalMovement.Never,
});
