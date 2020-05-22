import Vue from 'vue';

import { IState, INode } from '@/types';
import { markNodeWalkable } from '@/utils/grid';

import { registerRevertFunc } from '@/utils/history';

export default function addNode (state: IState, { node }: { node: INode }) {
  const { pfGrid } = state.graph.grid;
  const updatedNode = markNodeWalkable(pfGrid, node, false);

  Vue.set(state.graph.nodes, node.id, updatedNode);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
