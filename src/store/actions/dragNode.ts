import { FlowChartContext, Id, IPosition } from '@/types';
import { isInsideGrid } from '@/utils/grid';

export default function dragNode (
  { state, commit }: FlowChartContext,
  { id, position, prevPosition }: { id: Id; position: IPosition; prevPosition: IPosition },
) {
  const node = state.graph.nodes[id];

  if (!node) return;

  const {
    pfGrid, offset: gridOffset, width, height,
  } = state.graph.grid;

  // node not inside grid, expand grid
  if (!isInsideGrid(pfGrid, gridOffset, position.x, position.y)) {
    if (
      (position.x < 0 && (Math.abs(position.x) > gridOffset.x))
      || (position.y < 0 && (Math.abs(position.y) > gridOffset.y))
    ) {
      commit('expandGrid', { x: -500, y: -500 });
    } else if (
      (position.x > 0 && position.x > (width - gridOffset.x))
      || (position.y > 0 && position.y > (height - gridOffset.y))
    ) {
      commit('expandGrid', { x: 500, y: 500 });
    }
  }

  commit('updateNodePosition', { node, position, prevPosition });
}
