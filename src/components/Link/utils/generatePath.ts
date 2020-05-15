import PF from 'pathfinding';
import { Position } from '@/types';
import { SCALE_FACTOR } from '@/utils/grid';

const finder = PF.JumpPointFinder({
  heuristic: PF.Heuristic.manhattan,
  diagonalMovement: PF.DiagonalMovement.Never,
});

function generatePath (grid: PF.Grid, startPos: Position, endPos: Position): string {
  const startPosScaled = { x: Math.ceil(startPos[0] / SCALE_FACTOR), y: Math.ceil(startPos[1] / SCALE_FACTOR) };
  const endPosScaled = { x: Math.ceil(endPos[0] / SCALE_FACTOR), y: Math.ceil(endPos[1] / SCALE_FACTOR) };

  const path = PF.Util.compressPath(
    finder.findPath(
      startPosScaled.x,
      startPosScaled.y,
      endPosScaled.x,
      endPosScaled.y,
      grid.clone(),
    ),
  );

  if (!path.length) return '';

  const [first, ...rest] = path;
  let d = `M${first[0] * SCALE_FACTOR} ${first[1] * SCALE_FACTOR}`;
  rest.forEach(([x, y]) => {
    d += ` L${x * SCALE_FACTOR} ${y * SCALE_FACTOR}`;
  });
  return d;
}

export default generatePath;
