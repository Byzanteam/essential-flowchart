import * as Pathfinding from 'pathfinding';
import {
  Point,
  IConfig,
  IGrid,
  IOffset,
  INode,
  INodeInput,
  INodePort,
  PortDirection,
} from '@/types';
import { GRID_PADDING, GRID_EXPANSION_STEP, SCALE_FACTOR } from '@/utils/constants';

type Line = [Point, Point];

interface ICustomGrid extends Pathfinding.Grid {
  nodes: Array<Array<Pathfinding.Node>>;
  getWallHeight (x: number, y: number): number;
}

class CustomGrid extends Pathfinding.Grid implements ICustomGrid {
  nodes: Array<Array<Pathfinding.Node>>

  constructor (width: number, height: number) {
    super(width, height);
    this.nodes = (this as ICustomGrid).nodes;
  }

  getWallHeight (x: number, y: number): number {
    /**
     * node.walkable maybe 0, true or positive-number
     * 0, true will be walkable
     */
    const { walkable } = this.nodes[y][x];
    return typeof walkable === 'boolean' ? 0 : walkable;
  }

  setWalkableAt (x: number, y: number, walkable: boolean) {
    const oldWallHeight = this.getWallHeight(x, y);
    const deltaHeight = walkable ? -1 : 1;
    // @ts-ignore
    this.nodes[y][x].walkable = Math.max(oldWallHeight + deltaHeight, 0);
  }

  isWalkableAt (x: number, y: number) {
    return this.isInside(x, y) && !this.getWallHeight(x, y);
  }

  clone () {
    const { width } = this,
          { height } = this,
          thisNodes = this.nodes,
          newGrid = new CustomGrid(width, height);

    newGrid.nodes = Array.from({ length: height }).map((_i, i) => Array.from({ length: width }).map((_j, j): Pathfinding.Node => ({
      x: j,
      y: i,
      walkable: thisNodes[i][j].walkable,
    })));
    return newGrid;
  }
}

export function buildEmptyGrid (
  width: number,
  height: number,
  offset: IOffset = { x: 0, y: 0 },
): IGrid {
  // prevent vuex to observing pfGrid
  const pfGrid: Pathfinding.Grid = Object.freeze(
    new CustomGrid(width / SCALE_FACTOR, height / SCALE_FACTOR),
  );

  return {
    width,
    height,
    offset,
    pfGrid,
  };
}

// mark the line between two points walkable/blocked
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

// mark the port of node walkable/blocked
function markPort (
  grid: Pathfinding.Grid,
  gridOffset: IOffset,
  port: INodePort,
  walkable: boolean,
  { nodePadding }: { nodePadding: number },
) {
  const { direction, position } = port;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let { x, y } = position!;

  x = Math.ceil((x + gridOffset.x) / SCALE_FACTOR);
  y = Math.ceil((y + gridOffset.y) / SCALE_FACTOR);

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

function groupBy<T> (collection: Array<T>, criteria: (item: T) => string): Record<string, T[]> {
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

function nextDots (start: number, length: number, portGap: number): number[] {
  let current = Math.ceil(start);
  const dots = [];

  for (let i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + portGap;
  }

  return dots;
}

// calc port position
function updatePorts (node: INodeInput, { portGap }: { portGap: number }): INode {
  const { x, y } = node;

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

// top left                                                            top right
// +-------------------------------+ +---+ +-------------------------------+
// |                               ^ ^   ^ ^                               |
// |                               | |   | |                               |
// |   origin (x, y)               | |   | |                               |
// |         ·                     |d|   |d|                     ·         |
// |                                +     +                                |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |<---------                                                   --------->+
//           d+                                                 +d
// |<---------                                                   --------->+
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                   +                                   |
// |         ·                        |d|                        ·         |
// |                                  | |                                  |
// |                                  | |                                  |
// |                                  v v                                  |
// +----------------------------------+ +----------------------------------+
// bottom left                                                           bottom right

// mark node walkable/blocked
export function markNodeWalkable (
  grid: Pathfinding.Grid,
  gridOffset: IOffset,
  node: INodeInput,
  walkable: boolean,
  { nodePadding, portGap }: IConfig,
): INode {
  const updatedNode = updatePorts(node, { portGap });

  const { x: offsetX, y: offsetY } = gridOffset;

  let {
    x,
    y,
    width,
    height,
  } = node;

  x = Math.ceil((x + offsetX - nodePadding) / SCALE_FACTOR); // grid x
  y = Math.ceil((y + offsetY - nodePadding) / SCALE_FACTOR); // grid y
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
        port => markPort(grid, gridOffset, port, walkable, { nodePadding }),
      );
    },
  ];

  if (walkable) steps.reverse();
  steps.forEach(step => step());

  return updatedNode;
}

export const pathFinder = Pathfinding.JumpPointFinder({
  heuristic: Pathfinding.Heuristic.manhattan,
  diagonalMovement: Pathfinding.DiagonalMovement.Never,
});

export function autoGridExpansions (grid: IGrid, node: INodeInput, scale: number): IOffset[] {
  const {
    offset: gridOffset, width, height,
  } = grid;

  // whether expand to the left
  const negativeX: boolean = (node.x / scale) < GRID_PADDING - gridOffset.x;
  // whether expand to the top
  const negativeY: boolean = (node.y / scale) < GRID_PADDING - gridOffset.y;
  // whether expand to the right
  const positiveX: boolean = width - gridOffset.x - GRID_PADDING < (node.x / scale);
  // whether expand to the bottom
  const positiveY: boolean = height - gridOffset.y - GRID_PADDING < (node.y / scale);

  return [
    {
      x: negativeX ? -GRID_EXPANSION_STEP : 0,
      y: negativeY ? -GRID_EXPANSION_STEP : 0,
    },
    {
      x: positiveX ? GRID_EXPANSION_STEP : 0,
      y: positiveY ? GRID_EXPANSION_STEP : 0,
    },
  ];
}
