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

function tweakPath (path: Point[], startPos: IPosition, endPos: IPosition): Point[] {
  const { x: sx, y: sy } = startPos,
        { x: ex, y: ey } = endPos,
        [first, second] = path.slice(0, 2),
        [lastSecond, last] = path.slice(-2),
        rest = path.length > 4 ? path.slice(2, path.length - 2) : [],
        tweakStart = second.slice(0) as Point,
        // if path.length is 3, then tweakEnd = tweakStart
        tweakEnd = path.length > 3 ? lastSecond.slice(0) as Point : tweakStart;
  // directly connected end to end
  if (path.length < 3) {
    return path;
  }
  // tweak start segment by startPort
  // vertical direction
  if (second[0] === first[0]) {
    tweakStart[0] = sx;
  } else {
    tweakStart[1] = sy;
  }
  // tweak end segment by endPort
  if (lastSecond[0] === last[0]) {
    tweakEnd[0] = ex;
  } else {
    tweakEnd[1] = ey;
  }
  if (path.length === 3) {
    return [[sx, sy], tweakStart, [ex, ey]];
  }
  return [[sx, sy], tweakStart, ...rest, tweakEnd, [ex, ey]];
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

  return scalePath([
    [originalStartPos.x, originalStartPos.y],
    ...generateRightAnglePath(scaledStartPos, scaledEndPos, originalStartPos, originalEndPos),
    [originalEndPos.x, originalEndPos.y],
  ], startPort.position, endPort.position);
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
