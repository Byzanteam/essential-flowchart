import PF from 'pathfinding';
import store from '@/store';
import { IPosition } from '@/types';
import { SCALE_FACTOR } from '@/utils/grid';

const finder = PF.JumpPointFinder({
  heuristic: PF.Heuristic.manhattan,
  diagonalMovement: PF.DiagonalMovement.Never,
});

function generatePath (grid: PF.Grid, startPos: IPosition, endPos: IPosition): string {
  const gridOffset = store.state.graph.grid.offset;
  const startPosScaled = { x: Math.ceil((startPos.x + gridOffset.x) / SCALE_FACTOR), y: Math.ceil((startPos.y + gridOffset.y) / SCALE_FACTOR) };
  const endPosScaled = { x: Math.ceil((endPos.x + gridOffset.x) / SCALE_FACTOR), y: Math.ceil((endPos.y + gridOffset.y) / SCALE_FACTOR) };

  const path = PF.Util.compressPath(
    finder.findPath(
      startPosScaled.x,
      startPosScaled.y,
      endPosScaled.x,
      endPosScaled.y,
      grid.clone(),
    ),
  );

  // TODO: another path
  if (!path.length) return '';

  const [first, ...rest] = path;
  let d = `M${first[0] * SCALE_FACTOR - gridOffset.x} ${first[1] * SCALE_FACTOR - gridOffset.y}`;
  rest.forEach(([x, y]) => {
    d += ` L${x * SCALE_FACTOR - gridOffset.x} ${y * SCALE_FACTOR - gridOffset.y}`;
  });
  return d;
}

export default generatePath;
