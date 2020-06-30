import Vue from 'vue';

import { IState, INodeInput } from '@/types';
import emitter from '@/emitter';
import { ADD_NODE } from '@/emitter/events';

import { registerRevertFunc } from '@/utils/history';

export default function addNode (state: IState, { node }: { node: INodeInput }) {
  const { nodes } = state.graph;

  Vue.set(nodes, node.id, node);

  emitter.emit(ADD_NODE, state.graph.nodes[node.id]);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
