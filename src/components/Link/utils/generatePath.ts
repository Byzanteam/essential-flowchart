import PF from 'pathfinding';
import {
  Point, IPosition,
  PortDirection,
  IGrid, INodePort,
} from '@/types';
import { pathFinder, SCALE_FACTOR } from '@/utils/grid';

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

// TODO:
const PADDING = 10;
function getPaddingPoint ({ position, direction }: NodePort): IPosition {
  switch (direction) {
    case PortDirection.TOP:
      return { ...position, y: position.y - PADDING };
      break;

    case PortDirection.RIGHT:
      return { ...position, x: position.x + PADDING };
      break;

    case PortDirection.BOTTOM:
      return { ...position, y: position.y + PADDING };
      break;

    case PortDirection.LEFT:
      return { ...position, x: position.x - PADDING };
      break;

    default:
      return { ...position };
  }
}

function fallbackPath (startPort: NodePort, endPort: NodePort): Point[] {
  const scaledStartPos = scalePosition(getPaddingPoint(startPort));
  const scaledEndPos = scalePosition(getPaddingPoint(endPort));

  return scalePath([
    [startPort.position.x, startPort.position.y],
    ...generateRightAnglePath(scaledStartPos, scaledEndPos),
    [endPort.position.x, endPort.position.y],
  ]);
}

export default function generatePath (
  grid: IGrid,
  startPort: NodePort,
  endPort: NodePort,
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

    if (!path.length) return fallbackPath(startPort, endPort);

    return scalePath(path);
  } catch (e) {
    return fallbackPath(startPort, endPort);
  }
}
