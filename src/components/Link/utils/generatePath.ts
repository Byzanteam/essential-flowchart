import PF from 'pathfinding';
import { Point, IPosition, IGrid } from '@/types';
import { pathFinder, SCALE_FACTOR } from '@/utils/grid';

import generateRightAnglePath from './generateRightAnglePath';

function scalePath (path: Point[]): Point[] {
  return path.map(([x, y]) => [x * SCALE_FACTOR, y * SCALE_FACTOR]);
}

export default function generatePath (
  grid: IGrid,
  startPos: IPosition,
  endPos: IPosition,
  _version?: number,
): Point[] {
  const gridOffset = grid.offset;
  const scaledStartPos = {
    x: Math.ceil((startPos.x + gridOffset.x) / SCALE_FACTOR),
    y: Math.ceil((startPos.y + gridOffset.y) / SCALE_FACTOR),
  };
  const scaledEndPos = {
    x: Math.ceil((endPos.x + gridOffset.x) / SCALE_FACTOR),
    y: Math.ceil((endPos.y + gridOffset.y) / SCALE_FACTOR),
  };

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

    if (!path.length) return scalePath(generateRightAnglePath(scaledStartPos, scaledEndPos));

    return scalePath(path);
  } catch (e) {
    return scalePath(generateRightAnglePath(scaledStartPos, scaledEndPos));
  }
}
