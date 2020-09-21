import PF from 'pathfinding';
import {
  Point, IPosition,
  PortDirection,
  INodePort, INode, IRect, IConfig,
} from '@/types';
import { pathFinder, markNodeWalkable } from '@/utils/grid';
import { SCALE_FACTOR, GRID_PADDING } from '@/utils/constants';
import { checkIntersect } from '@/utils/shared';
import generateRightAnglePath from './generateRightAnglePath';

type NodePort = Pick<INodePort, 'position'> & Partial<Omit<INodePort, 'position'>>;

function twistPath (start: Point, end: Point): Point[] {
  const [sx, sy] = start,
        [ex, ey] = end,
        deltaX = Math.abs(sx - ex),
        deltaY = Math.abs(sy - ey),
        mdx = Math.ceil((sx + ex) / 2),
        mdy = Math.ceil((sy + ey) / 2);
  // line of start to end is parallel to the coordinate axis
  if (deltaX * deltaY === 0) return [start, end];
  if (Math.min(deltaX, deltaY) < 2) return [start, [sx, ey], end];
  if (deltaX > deltaY) {
    return [start, [mdx, sy], [mdx, ey], end];
  }
  return [start, [sx, mdy], [ex, mdy], end];
}

function tweakFirstSegment (path: Point[], dest: Point): Point[] {
  const [x, y] = dest;
  const [first, second, ...rest] = path;
  const newSecond = [...second] as Point;

  if (first[0] === second[0]) {
    newSecond[0] = x;
  } else {
    newSecond[1] = y;
  }

  return [dest, newSecond, ...rest];
}

function tweakPath (path: Point[], startPos: IPosition, endPos: IPosition): Point[] {
  if (path.length < 2) return path;

  const { x: sx, y: sy } = startPos,
        { x: ex, y: ey } = endPos;

  // connect directly
  if (path.length === 2) {
    return twistPath([sx, sy], [ex, ey]);
  }

  return tweakFirstSegment(
    tweakFirstSegment(path, [sx, sy]).reverse(),
    [ex, ey],
  ).reverse();
}

function scalePath (path: Point[], startPos: IPosition, endPos: IPosition, gridRect?: IRect): Point[] {
  const scaledPath = path.map(point => {
    const [x, y] = point;
    const scalePoint: Point = gridRect
      ? [x * SCALE_FACTOR + gridRect.x, y * SCALE_FACTOR + gridRect.y]
      : [x * SCALE_FACTOR, y * SCALE_FACTOR];

    return scalePoint;
  });
  return tweakPath(PF.Util.compressPath(scaledPath) as Point[], startPos, endPos);
}

function scalePosition (position: IPosition): IPosition {
  return {
    x: Math.ceil(position.x / SCALE_FACTOR),
    y: Math.ceil(position.y / SCALE_FACTOR),
  };
}

function getPaddingPoint ({ position, direction }: NodePort, nodePadding: number): IPosition {
  switch (direction) {
    case PortDirection.TOP:
      return { ...position, y: position.y - nodePadding };

    case PortDirection.RIGHT:
      return { ...position, x: position.x + nodePadding };

    case PortDirection.BOTTOM:
      return { ...position, y: position.y + nodePadding };

    case PortDirection.LEFT:
      return { ...position, x: position.x - nodePadding };

    default:
      return { ...position };
  }
}

function fallbackPath (startPort: NodePort, endPort: NodePort, nodePadding: number): Point[] {
  const scaledStartPos = scalePosition(getPaddingPoint(startPort, nodePadding));
  const scaledEndPos = scalePosition(getPaddingPoint(endPort, nodePadding));

  const originalStartPos = scalePosition(startPort.position);
  const originalEndPos = scalePosition(endPort.position);

  const path: Point[] = [
    [originalStartPos.x, originalStartPos.y],
    ...generateRightAnglePath(scaledStartPos, scaledEndPos, originalStartPos, originalEndPos),
    [originalEndPos.x, originalEndPos.y],
  ];

  const compressedPath: Point[] = [];

  path.reduce((prev, point) => {
    if (!prev) {
      compressedPath.push(point);
    } else if (prev[0] !== point[0] || prev[1] !== point[1]) {
      compressedPath.push(point);
    }

    return point;
  });

  return scalePath(compressedPath, startPort.position, endPort.position);
}

function buildGrid (
  pos1: IPosition,
  pos2: IPosition,
  nodes: INode[],
  config: Pick<IConfig, 'nodePadding' | 'getters'>,
) {
  const width = Math.abs(pos1.x - pos2.x) + GRID_PADDING * 2,
        height = Math.abs(pos1.y - pos2.y) + GRID_PADDING * 2;

  const gridRect: IRect = {
    x: Math.min(pos1.x, pos2.x) - GRID_PADDING,
    y: Math.min(pos1.y, pos2.y) - GRID_PADDING,
    width,
    height,
  };

  const matrix: number[][] = [];
  const adjustedWidth = Math.ceil(width / (SCALE_FACTOR));
  const adjustedHeight = Math.ceil(height / (SCALE_FACTOR));

  // empty matrix
  for (let i = 0; i < adjustedHeight; i += 1) {
    matrix.push(new Array(adjustedWidth).fill(0));
  }

  // mark intersectant nodes blocked
  nodes.forEach(node => {
    const nodeRect = {
      ...config.getters.getNodeSize(node),
      ...config.getters.getNodePosition(node),
    };
    const nodePorts = Object.values(config.getters.getNodePorts(node))
      .map(port => ({
        direction: config.getters.getPortDirection(port),
        position: config.getters.getPortPosition(node, port),
      }));
    const intersectant = checkIntersect(gridRect, nodeRect);

    if (intersectant) {
      markNodeWalkable({
        matrix,
        gridRect,
        nodeRect,
        nodePorts,
        walkable: false, // blocked
        nodePadding: config.nodePadding,
      });
    }
  });

  const pfGrid = new PF.Grid(matrix);

  return {
    gridRect,
    pfGrid,
  };
}


/**
 * 1. construct a rect by `startPos` and `endPos`, with grid padding
 * 2. get `gridRect`, build a empty matrix
 * 3. calculate the nodes that intersect the grid rect, mark this node blocked in matrix
 * 4. instantiate PF.Grid with matrix and find path
 */
export default function generatePath (
  startPort: NodePort,
  endPort: NodePort,
  nodes: INode[],
  config: Pick<IConfig, 'nodePadding' | 'getters'>,
): Point[] {
  const startPos = startPort.position;
  const endPos = endPort.position;

  const { pfGrid, gridRect } = buildGrid(
    startPos,
    endPos,
    nodes,
    config,
  );

  const scaledStartPos = scalePosition({
    x: startPos.x - gridRect.x,
    y: startPos.y - gridRect.y,
  });
  const scaledEndPos = scalePosition({
    x: endPos.x - gridRect.x,
    y: endPos.y - gridRect.y,
  });

  try {
    const path = PF.Util.compressPath(
      pathFinder.findPath(
        scaledStartPos.x,
        scaledStartPos.y,
        scaledEndPos.x,
        scaledEndPos.y,
        pfGrid,
      ),
    ) as Point[];

    if (!path.length) return fallbackPath(startPort, endPort, config.nodePadding);

    return scalePath(path, startPos, endPos, gridRect);
  } catch (e) {
    return fallbackPath(startPort, endPort, config.nodePadding);
  }
}
