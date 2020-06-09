import { IState, IOffset, FlowchartStore } from '@/types';
import { buildEmptyGrid, markNodeWalkable } from '@/utils/grid';

export default function expandGrid (this: FlowchartStore, state: IState, expansion: IOffset) {
  if (expansion.x === 0 && expansion.y === 0) return;

  const prevOffset: IOffset = state.graph.grid.offset;
  let { width, height } = state.graph.grid;

  const negativeX = expansion.x < 0;
  const negativeY = expansion.y < 0;

  width += Math.abs(expansion.x);
  height += Math.abs(expansion.y);

  const offset = {
    x: negativeX ? prevOffset.x + Math.abs(expansion.x) : prevOffset.x,
    y: negativeY ? prevOffset.y + Math.abs(expansion.y) : prevOffset.y,
  };

  const newGrid = buildEmptyGrid(width, height, offset);

  this.commit({
    type: 'updateGrid',
    grid: newGrid,
  });

  Object.values(state.graph.nodes).forEach(node => {
    markNodeWalkable(newGrid.pfGrid, offset, node, false, state.config);
  });
}
