import PF from 'pathfinding';
import { IPosition, IGrid } from '@/types';
import { SCALE_FACTOR } from '@/utils/grid';

type Point = [number, number];

const finder = PF.JumpPointFinder({
  heuristic: PF.Heuristic.manhattan,
  diagonalMovement: PF.DiagonalMovement.Never,
});

export default function generatePath (
  grid: IGrid,
  startPos: IPosition,
  endPos: IPosition,
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

  return PF.Util.compressPath(
    finder.findPath(
      scaledStartPos.x,
      scaledStartPos.y,
      scaledEndPos.x,
      scaledEndPos.y,
      grid.pfGrid.clone(),
    ),
  ) as Point[];
}
