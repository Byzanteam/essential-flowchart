import PF from 'pathfinding';
import {
  Point, IPosition,
  PortDirection, IConfig,
  IGrid, INodePort,
} from '@/types';
import { pathFinder } from '@/utils/grid';
import { SCALE_FACTOR } from '@/utils/config';

import generateRightAnglePath from './generateRightAnglePath';

type NodePort = Pick<INodePort, 'position'> & Partial<Omit<INodePort, 'position'>>;

function scalePath (path: Point[]): Point[] {
  return path.map(([x, y]) => [x * SCALE_FACTOR, y * SCALE_FACTOR]);
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
      break;

    case PortDirection.RIGHT:
      return { ...position, x: position.x + config.nodePadding };
      break;

    case PortDirection.BOTTOM:
      return { ...position, y: position.y + config.nodePadding };
      break;

    case PortDirection.LEFT:
      return { ...position, x: position.x - config.nodePadding };
      break;

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
    ...generateRightAnglePath(scaledStartPos, scaledEndPos),
    [originalEndPos.x, originalEndPos.y],
  ]);
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

    return scalePath(path);
  } catch (e) {
    return fallbackPath(startPort, endPort, config);
  }
}
