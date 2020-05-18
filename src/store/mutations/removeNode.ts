import Vue from 'vue';

import { IState, INode } from '@/types';
import { markWalkable } from '@/Utils/grid';
import { registerRevertFunc } from '@/utils/history';

export default function removeNode (state: IState, { node }: { node: INode }) {
  const { pfGrid } = state.graph.grid;
  markWalkable(
    pfGrid,
    [node.x, node.y, node.width, node.height],
    true,
  );

  Vue.delete(state.graph.nodes, node.id);
}

registerRevertFunc('removeNode', mutation => ({
  ...mutation,
  type: 'addNode',
}));
