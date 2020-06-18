import Vue from 'vue';

import { IState, INodeInput } from '@/types';
import emitter from '@/emitter';
import { markNodeWalkable } from '@/utils/grid';

import { registerRevertFunc } from '@/utils/history';

export default function addNode (state: IState, { node }: { node: INodeInput }) {
  const { pfGrid } = state.graph.grid;

  const updatedNode = markNodeWalkable(
    pfGrid,
    state.graph.grid.offset,
    node,
    false,
    state.config,
  );

  Vue.set(state.graph.nodes, node.id, updatedNode);

  emitter.emit('add-node', updatedNode);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
