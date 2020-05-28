import * as Pathfinding from 'pathfinding';
import {
  Point,
  IGrid,
  IOffset,
  INode,
  INodePort,
  PortDirection,
} from '@/types';

type Line = [Point, Point];
type IMarkNodeWalkableConfig = {
  nodePadding?: number;
  portGap?: number;
}

export const SCALE_FACTOR = 5;
const DEFAULT_NODE_PADDING = SCALE_FACTOR * 2;
const DEFAULT_PORT_GAP = SCALE_FACTOR * 2;

export function buildEmptyGrid (width: number, height: number): IGrid {
  // prevent vuex to observing pfGrid
  const pfGrid: Pathfinding.Grid = Object.freeze(
    new Pathfinding.Grid(width / SCALE_FACTOR, height / SCALE_FACTOR),
  );

  return {
    width,
    height,

    offset: {
      x: 0,
      y: 0,
    },
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

  points.forEach(([x, y]: Point) => {
    grid.setWalkableAt(x, y, walkable);
  });
}

function markPort (
  grid: Pathfinding.Grid,
  port: INodePort,
  walkable: boolean,
  { nodePadding }: { nodePadding: number },
) {
  const { direction, position } = port;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let { x, y } = position!;

  x = Math.ceil(x / SCALE_FACTOR);
  y = Math.ceil(y / SCALE_FACTOR);

  const scaledNodePadding = nodePadding / SCALE_FACTOR;

  // eslint-disable-next-line default-case
  switch (direction) {
    case PortDirection.TOP:
      grid.setWalkableAt(x, y + 1, walkable);
      grid.setWalkableAt(x, y - scaledNodePadding, !walkable);
      markLine(grid, [[x - 1, y], [x - 1, y - scaledNodePadding + 1]], walkable);
      markLine(grid, [[x + 1, y], [x + 1, y - scaledNodePadding + 1]], walkable);
      break;

    case PortDirection.RIGHT:
      grid.setWalkableAt(x - 1, y, walkable);
      grid.setWalkableAt(x + scaledNodePadding, y, !walkable);
      markLine(grid, [[x, y - 1], [x + scaledNodePadding - 1, y - 1]], walkable);
      markLine(grid, [[x, y + 1], [x + scaledNodePadding - 1, y + 1]], walkable);
      break;

    case PortDirection.BOTTOM:
      grid.setWalkableAt(x, y - 1, walkable);
      grid.setWalkableAt(x, y + scaledNodePadding, !walkable);
      markLine(grid, [[x + 1, y], [x + 1, y + scaledNodePadding - 1]], walkable);
      markLine(grid, [[x - 1, y], [x - 1, y + scaledNodePadding - 1]], walkable);
      break;

    case PortDirection.LEFT:
      grid.setWalkableAt(x + 1, y, walkable);
      grid.setWalkableAt(x - scaledNodePadding, y, !walkable);
      markLine(grid, [[x, y + 1], [x - scaledNodePadding + 1, y + 1]], walkable);
      markLine(grid, [[x, y - 1], [x - scaledNodePadding + 1, y - 1]], walkable);
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

function nextDots (start: number, length: number, portGap: number): number[] {
  let current = Math.ceil(start);
  const dots = [];

  for (let i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + portGap;
  }

  return dots;
}

function updatePorts (node: INode, gridOffset: IOffset, { portGap }: { portGap: number }): INode {
  const { x: offsetX, y: offsetY } = gridOffset;
  let { x, y } = node;

  x += offsetX;
  y += offsetY;

  const { width, height } = node;

  const groupedPorts = groupBy(
    Object.values(node.ports),
    port => port.direction,
  );

  const updatedPorts = Object.entries(groupedPorts).reduce((acc, [direction, ports]) => {
    const { length } = ports;
    const portsLength = 3 * length + portGap * (length - 1);
    let dots: number[];

    // eslint-disable-next-line default-case
    switch (direction) {
      case PortDirection.TOP:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y } };
        });
        break;

      case PortDirection.RIGHT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: x + width, y: dots[index] } };
        });
        break;

      case PortDirection.BOTTOM:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y: y + height } };
        });
        break;

      case PortDirection.LEFT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
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
// +-------------------------------+ +---+ +-------------------------------+
// |                               ^ ^   ^ ^                               |
// |                               | |   | |                               |
// |         (x, y)                | |   | |                               |
// |         ·                     | |   | |                     ·         |
// |                                +     +                                |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |<---------                                                   --------->+
//            +                                                 +
// |<---------                                                   --------->+
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                   +                                   |
// |         ·                        | |                        ·         |
// |                                  | |                                  |
// |                                  | |                                  |
// |                                  v v                                  |
// +----------------------------------+ +----------------------------------+
//

export function markNodeWalkable (
  grid: Pathfinding.Grid,
  gridOffset: IOffset,
  node: INode,
  walkable: boolean,
  { nodePadding = DEFAULT_NODE_PADDING, portGap = DEFAULT_PORT_GAP }: IMarkNodeWalkableConfig,
): INode {
  const updatedNode = updatePorts(node, gridOffset, { portGap });

  const { x: offsetX, y: offsetY } = gridOffset;

  let {
    x,
    y,
    width,
    height,
  } = node;

  x = Math.ceil((x + offsetX - nodePadding) / SCALE_FACTOR);
  y = Math.ceil((y + offsetY - nodePadding) / SCALE_FACTOR);
  width = Math.ceil((width + nodePadding * 2) / SCALE_FACTOR);
  height = Math.ceil((height + nodePadding * 2) / SCALE_FACTOR);

  const topLeft: Point = [x, y];
  const topRight: Point = [x + width, y];
  const bottomRight: Point = [x + width, y + height];
  const bottomLeft: Point = [x, y + height];

  const lines: Record<PortDirection, Line> = {
    [PortDirection.TOP]: [topLeft, topRight],
    [PortDirection.RIGHT]: [topRight, bottomRight],
    [PortDirection.BOTTOM]: [bottomRight, bottomLeft],
    [PortDirection.LEFT]: [bottomLeft, topLeft],
  };

  const steps: Function[] = [
    () => {
      // mark rectangle
      Object.values(lines).forEach(line => markLine(grid, line, walkable));
    },

    () => {
      // mark ports
      Object.values(updatedNode.ports).forEach(
        port => markPort(grid, port, walkable, { nodePadding }),
      );
    },
  ];

  if (walkable) steps.reverse();
  steps.forEach(step => step());

  return updatedNode;
}

export function isInsideGrid (grid: Pathfinding.Grid, gridOffset: IOffset, x: number, y: number) {
  return grid.isInside((x - gridOffset.x) / SCALE_FACTOR, (y - gridOffset.y) / SCALE_FACTOR);
}

export const pathFinder = Pathfinding.JumpPointFinder({
  heuristic: Pathfinding.Heuristic.manhattan,
  diagonalMovement: Pathfinding.DiagonalMovement.Never,
});
