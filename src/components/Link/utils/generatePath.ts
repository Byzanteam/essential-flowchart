import PF from 'pathfinding';
import {
  Point, IPosition,
  IConfig,
  IGrid,
} from '@/types';
import { pathFinder } from '@/utils/grid';
import { SCALE_FACTOR } from '@/utils/constants';

import generateRightAnglePath from './generateRightAnglePath';

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
function getPaddingPoint (position: IPosition, _config: IConfig): IPosition {
  return position;
  // switch (direction) {
  //   case PortDirection.TOP:
  //     return { ...position, y: position.y - config.nodePadding };
  //     break;

  //   case PortDirection.RIGHT:
  //     return { ...position, x: position.x + config.nodePadding };
  //     break;

  //   case PortDirection.BOTTOM:
  //     return { ...position, y: position.y + config.nodePadding };
  //     break;

  //   case PortDirection.LEFT:
  //     return { ...position, x: position.x - config.nodePadding };
  //     break;

  //   default:
  //     return { ...position };
  // }
}

function fallbackPath (startPos: IPosition, endPos: IPosition, config: IConfig): Point[] {
  const scaledStartPos = scalePosition(getPaddingPoint(startPos, config));
  const scaledEndPos = scalePosition(getPaddingPoint(endPos, config));

  const originalStartPos = scalePosition(startPos);
  const originalEndPos = scalePosition(endPos);

  return scalePath([
    [originalStartPos.x, originalStartPos.y],
    ...generateRightAnglePath(scaledStartPos, scaledEndPos),
    [originalEndPos.x, originalEndPos.y],
  ]);
}

export default function generatePath (
  grid: IGrid,
  startPos: IPosition,
  endPos: IPosition,
  config: IConfig,
  _version?: number,
): Point[] {
  const gridOffset = grid.offset;

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

    if (!path.length) return fallbackPath(startPos, endPos, config);

    return scalePath(path);
  } catch (e) {
    return fallbackPath(startPos, endPos, config);
  }
}
