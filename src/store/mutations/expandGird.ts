import { IState, IOffset } from '@/types';
import { buildEmptyGrid, markNodeWalkable } from '@/utils/grid';

export default function expandGrid (state: IState, expansion: IOffset) {
  if (expansion.x === 0 && expansion.y === 0) return;

  const prevOffset: IOffset = state.graph.grid.offset;
  let { width, height } = state.graph.grid;

  const negativeX = expansion.x < 0;
  const negativeY = expansion.y < 0;

  width += Math.abs(expansion.x);
  height += Math.abs(expansion.y);

  const { pfGrid } = buildEmptyGrid(width, height);
  const offset = {
    x: negativeX ? prevOffset.x + Math.abs(expansion.x) : prevOffset.x,
    y: negativeY ? prevOffset.y + Math.abs(expansion.y) : prevOffset.y,
  };

  state.graph.grid = {
    width,
    height,
    pfGrid,
    offset,
  };

  Object.values(state.graph.nodes).forEach(node => {
    markNodeWalkable(pfGrid, offset, node, false, state.config);
  });
}
