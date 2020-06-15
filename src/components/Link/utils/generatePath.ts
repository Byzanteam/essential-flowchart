import PF from 'pathfinding';
import {
  Point, IPosition,
  PortDirection, IConfig,
  IGrid, INodePort, IOffset,
} from '@/types';
import { pathFinder } from '@/utils/grid';
import { SCALE_FACTOR } from '@/utils/constants';

import generateRightAnglePath from './generateRightAnglePath';

type NodePort = Pick<INodePort, 'position'> & Partial<Omit<INodePort, 'position'>>;

function tweakPath (path: Point[], startPort: NodePort, endPort: NodePort): Point[] {
  const { x: sx, y: sy } = startPort.position,
        { x: ex, y: ey } = endPort.position,
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

function scalePath (path: Point[], startPort: NodePort, endPort: NodePort, offset?: IOffset): Point[] {
  // reduce continuous same point
  const scaledPath = path.reduce((acc, point, index, arr) => {
    const [x, y] = point;
    const prev = arr[index - 1];
    // current point is same to prev point
    if (index !== 0 && (prev[0] === x && prev[1] === y)) {
      return acc;
    }
    const scalePoint: Point = offset
      ? [x * SCALE_FACTOR - offset.x, y * SCALE_FACTOR - offset.y]
      : [x * SCALE_FACTOR, y * SCALE_FACTOR];
    acc.push(scalePoint);
    return acc;
  }, [] as Point[]);
  return tweakPath(scaledPath, startPort, endPort);
}

function scalePosition (position: IPosition): IPosition {
  return {
    x: Math.ceil(position.x / SCALE_FACTOR),
    y: Math.ceil(position.y / SCALE_FACTOR),
  };
}

function getPaddingPoint ({ position, direction }: NodePort, config: IConfig): IPosition {
  switch (direction) {
    case PortDirection.TOP:
      return { ...position, y: position.y - config.nodePadding };

    case PortDirection.RIGHT:
      return { ...position, x: position.x + config.nodePadding };

    case PortDirection.BOTTOM:
      return { ...position, y: position.y + config.nodePadding };

    case PortDirection.LEFT:
      return { ...position, x: position.x - config.nodePadding };

    default:
      return { ...position };
  }
}

function fallbackPath (startPort: NodePort, endPort: NodePort, config: IConfig): Point[] {
  const scaledStartPos = scalePosition(getPaddingPoint(startPort, config));
  const scaledEndPos = scalePosition(getPaddingPoint(endPort, config));

  const originalStartPos = scalePosition(startPort.position);
  const originalEndPos = scalePosition(endPort.position);

  return scalePath([
    [originalStartPos.x, originalStartPos.y],
    ...generateRightAnglePath(scaledStartPos, scaledEndPos, originalStartPos, originalEndPos),
    [originalEndPos.x, originalEndPos.y],
  ], startPort, endPort);
}

export default function generatePath (
  grid: IGrid,
  startPort: NodePort,
  endPort: NodePort,
  config: IConfig,
  _version?: number,
): Point[] {
  const gridOffset = grid.offset;

  const startPos = startPort.position;
  const endPos = endPort.position;

  const scaledStartPos = scalePosition({
    x: startPos.x + gridOffset.x,
    y: startPos.y + gridOffset.y,
  });
  const scaledEndPos = scalePosition({
    x: endPos.x + gridOffset.x,
    y: endPos.y + gridOffset.y,
  });

  try {
    const path = PF.Util.compressPath(
      pathFinder.findPath(
        scaledStartPos.x,
        scaledStartPos.y,
        scaledEndPos.x,
        scaledEndPos.y,
        grid.pfGrid.clone(),
      ),
    ) as Point[];

    if (!path.length) return fallbackPath(startPort, endPort, config);

    return scalePath(path, startPort, endPort, gridOffset);
  } catch (e) {
    return fallbackPath(startPort, endPort, config);
  }
}
