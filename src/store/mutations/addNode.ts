import Vue from 'vue';

import { IState, INode, FlowChartStore } from '@/types';
import { markNodeWalkable, isInsideGrid } from '@/utils/grid';

import { registerRevertFunc } from '@/utils/history';

export default function addNode (this: FlowChartStore, state: IState, { node }: { node: INode }) {
  let {
    // eslint-disable-next-line prefer-const
    pfGrid, offset: gridOffset, width, height,
  } = state.graph.grid;
  // node not inside grid, expand grid
  if (!isInsideGrid(pfGrid, gridOffset, node.x, node.y)) {
    if (
      (node.x < 0 && (Math.abs(node.x) > gridOffset.x))
      || (node.y < 0 && (Math.abs(node.y) > gridOffset.y))
    ) {
      this.commit('expandGrid', -500);
    } else if (
      (node.x > 0 && node.x > (width - gridOffset.x))
      || (node.y > 0 && node.y > (height - gridOffset.y))
    ) {
      this.commit('expandGrid', 500);
    }
  }

  gridOffset = state.graph.grid.offset;

  markNodeWalkable(
    pfGrid,
    [node.x + gridOffset.x, node.y + gridOffset.y, node.width, node.height],
    false,
  );

  Vue.set(state.graph.nodes, node.id, node);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
