import { IState, IPosition } from '@/types';
import { buildEmptyGrid, markNodeWalkable } from '@/utils/grid';

export default function expandGrid (state: IState, expansion: IPosition) {
  const prevOffset: IPosition = state.graph.grid.offset;
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
    markNodeWalkable(
      pfGrid,
      [node.x + offset.x, node.y + offset.y, node.width, node.height],
      false,
    );
  });
}
