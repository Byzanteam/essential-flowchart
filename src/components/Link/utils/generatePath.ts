import PF from 'pathfinding';
import { Position } from '@/types';

const finder = PF.JumpPointFinder({
  heuristic: PF.Heuristic.manhattan,
  diagonalMovement: PF.DiagonalMovement.Never,
});

function generatePath (grid: PF.Grid, startPos: Position, endPos: Position): string {
  // TODO: handle scale
  const startPosScaled = { x: Math.ceil(startPos[0]), y: Math.ceil(startPos[1]) };
  const endPosScaled = { x: Math.ceil(endPos[0]), y: Math.ceil(endPos[1]) };

  const path = PF.Util.compressPath(
    finder.findPath(
      startPosScaled.x,
      startPosScaled.y,
      endPosScaled.x,
      endPosScaled.y,
      grid,
    ),
  );

  if (!path.length) return '';

  const [first, ...rest] = path;
  let d = `M${first[0]} ${first[1]}`;
  rest.forEach(([x, y]) => {
    d += ` L${x} ${y}`;
  });
  return d;
}

export default generatePath;
