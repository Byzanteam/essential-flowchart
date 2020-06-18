import Vue from 'vue';

import { IState, INode } from '@/types';
import emitter from '@/emitter';
import { markNodeWalkable } from '@/utils/grid';
import { registerRevertFunc } from '@/utils/history';

export default function removeNode (state: IState, { node }: { node: INode }) {
  const { pfGrid, offset } = state.graph.grid;
  markNodeWalkable(pfGrid, offset, node, true, state.config);

  Vue.delete(state.graph.nodes, node.id);

  emitter.emit('remove-node', node);
}

registerRevertFunc('removeNode', mutation => ({
  ...mutation,
  type: 'addNode',
}));
