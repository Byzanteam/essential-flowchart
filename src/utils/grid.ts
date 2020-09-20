import * as Pathfinding from 'pathfinding';
import {
  Point, IPosition,
  PortDirection,
  INodePort, IRect,
} from '@/types';
import { SCALE_FACTOR } from '@/utils/constants';

type Line = [Point, Point];

function setMatrixWalkable (matrix: number[][], pos: IPosition, walkable: boolean) {
  const height = matrix.length;
  const width = matrix[0].length;

  const x = Math.min(Math.max(pos.x, 0), width - 1);
  const y = Math.min(Math.max(pos.y, 0), height - 1);

  matrix[y][x] = walkable ? 0 : 1;
}

// mark the line between two points walkable/blocked
function markLine (
  matrix: number[][],
  [[startX, startY], [endX, endY]]: Line,
  walkable: boolean,
) {
  // @ts-ignore
  const points = Pathfinding.Util.interpolate(startX, startY, endX, endY);

  points.forEach(([x, y]: Point) => setMatrixWalkable(matrix, { x, y }, walkable));
}

// mark the port of node walkable/blocked
function markPort (
  matrix: number[][],
  gridRect: IRect,
  nodeRect: IRect,
  port: INodePort,
  walkable: boolean,
) {
  const { direction, position } = port;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let { x, y } = position!;

  x = Math.ceil((x - gridRect.x) / SCALE_FACTOR);
  y = Math.ceil((y - gridRect.y) / SCALE_FACTOR);

  // eslint-disable-next-line default-case
  switch (direction) {
    case PortDirection.TOP:
      setMatrixWalkable(matrix, { x, y: y + 1 }, walkable);
      setMatrixWalkable(matrix, { x, y: nodeRect.y }, !walkable);

      markLine(matrix, [[x - 1, y], [x - 1, nodeRect.y - 1]], walkable);
      markLine(matrix, [[x + 1, y], [x + 1, nodeRect.y - 1]], walkable);
      break;

    case PortDirection.RIGHT:
      setMatrixWalkable(matrix, { x: x - 1, y }, walkable);
      setMatrixWalkable(matrix, { x: nodeRect.x + nodeRect.width, y }, !walkable);

      markLine(matrix, [[x, y - 1], [nodeRect.x + nodeRect.width - 1, y - 1]], walkable);
      markLine(matrix, [[x, y + 1], [nodeRect.x + nodeRect.width - 1, y + 1]], walkable);
      break;

    case PortDirection.BOTTOM:
      setMatrixWalkable(matrix, { x, y: y - 1 }, walkable);
      setMatrixWalkable(matrix, { x, y: nodeRect.y + nodeRect.height }, !walkable);

      markLine(matrix, [[x + 1, y], [x + 1, nodeRect.y + nodeRect.height - 1]], walkable);
      markLine(matrix, [[x - 1, y], [x - 1, nodeRect.y + nodeRect.height - 1]], walkable);
      break;

    case PortDirection.LEFT:
      setMatrixWalkable(matrix, { x: x + 1, y }, walkable);
      setMatrixWalkable(matrix, { x: nodeRect.x, y }, !walkable);

      markLine(matrix, [[x, y + 1], [nodeRect.x - 1, y + 1]], walkable);
      markLine(matrix, [[x, y - 1], [nodeRect.x - 1, y - 1]], walkable);
      break;
  }
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
export function markNodeWalkable ({
  matrix,
  nodeRect,
  nodePorts,
  walkable,
  gridRect,
  nodePadding,
}: {
  matrix: number[][];
  gridRect: IRect;
  nodeRect: IRect;
  nodePorts: Array<INodePort>;
  walkable: boolean;
  nodePadding: number;
}) {
  let {
    x, y, width, height,
  } = nodeRect;

  x = Math.ceil((x - nodePadding - gridRect.x) / SCALE_FACTOR); // grid x
  y = Math.ceil((y - nodePadding - gridRect.y) / SCALE_FACTOR); // grid y
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

  const nodeRectInGrid: IRect = {
    x,
    y,
    width,
    height,
  };

  const steps: Function[] = [
    () => {
      // mark rectangle
      Object.values(lines).forEach(line => markLine(matrix, line, walkable));
    },

    () => {
      // mark ports
      nodePorts.forEach(
        port => markPort(
          matrix,
          gridRect,
          nodeRectInGrid,
          port,
          walkable,
        ),
      );
    },
  ];

  if (walkable) steps.reverse();
  steps.forEach(step => step());
}

export const pathFinder = Pathfinding.JumpPointFinder({
  heuristic: Pathfinding.Heuristic.manhattan,
  diagonalMovement: Pathfinding.DiagonalMovement.Never,
});
