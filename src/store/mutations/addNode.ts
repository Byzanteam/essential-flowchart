import Vue from 'vue';

import { IState, INodeInput, FlowchartStore } from '@/types';
import { markNodeWalkable, isInsideGrid } from '@/utils/grid';

import { registerRevertFunc } from '@/utils/history';

export default function addNode (this: FlowchartStore, state: IState, { node }: { node: INodeInput }) {
  const {
    pfGrid, offset: gridOffset, width, height,
  } = state.graph.grid;

  // node not inside grid, expand grid
  if (!isInsideGrid(pfGrid, gridOffset, node.x, node.y)) {
    if (
      (node.x < 0 && (Math.abs(node.x) > gridOffset.x))
      || (node.y < 0 && (Math.abs(node.y) > gridOffset.y))
    ) {
      this.commit('expandGrid', {
        x: -500,
        y: -500,
      });
    } else if (
      (node.x > 0 && node.x > (width - gridOffset.x))
      || (node.y > 0 && node.y > (height - gridOffset.y))
    ) {
      this.commit('expandGrid', {
        x: 500,
        y: 500,
      });
    }
  }

  const updatedNode = markNodeWalkable(
    pfGrid,
    state.graph.grid.offset,
    node,
    false,
    state.config,
  );

  Vue.set(state.graph.nodes, node.id, updatedNode);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
