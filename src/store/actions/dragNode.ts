import { FlowChartContext, Id, IPosition } from '@/types';
import { markNodeWalkable, isInsideGrid } from '@/utils/grid';

export default function dragNode ({ dispatch, state, commit }: FlowChartContext, { id, position, prevPosition }: { id: Id; position: IPosition; prevPosition: IPosition }) {
  const node = state.graph.nodes[id];

  if (!node) return;

  const {
    pfGrid, offset: gridOffset, width, height,
  } = state.graph.grid;

  markNodeWalkable(
    state.graph.grid.pfGrid,
    state.graph.grid.offset,
    {
      ...node,
      x: prevPosition.x,
      y: prevPosition.y,
    },
    true,
  );

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

  markNodeWalkable(
    pfGrid,
    state.graph.grid.offset,
    {
      ...node,
      ...position,
    },
    false,
  );

  const mutations = [{
    type: 'dragNode',
    nodeId: node.id,
    from: {
      x: prevPosition.x,
      y: prevPosition.y,
    },
    to: { ...position },
  }];

  dispatch('historyPushEntry', mutations);
}
