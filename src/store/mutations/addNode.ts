import Vue from 'vue';

import { IState, INode } from '@/types';
import { markWalkable } from '@/utils/grid';

import { registerRevertFunc } from '@/utils/history';

export default function (state: IState, { node }: { node: INode }) {
  const { pfGrid } = state.graph.grid;
  markWalkable(
    pfGrid,
    [node.x, node.y, node.width, node.height],
    false,
  );

  Vue.set(state.graph.nodes, node.id, node);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
