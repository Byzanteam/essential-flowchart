import PF from 'pathfinding';
import { IPosition, IGrid, Point2D } from '@/types';
import { pathFinder, SCALE_FACTOR } from '@/utils/grid';

import generateRightAnglePath from './generateRightAnglePath';

export default function generatePath (
  grid: IGrid,
  startPos: IPosition,
  endPos: IPosition,
  _version?: number,
): Point2D[] {
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
    ) as Point2D[];

    if (!path.length) return generateRightAnglePath(scaledStartPos, scaledEndPos);

    return path;
  } catch (e) {
    return generateRightAnglePath(scaledStartPos, scaledEndPos);
  }
}
