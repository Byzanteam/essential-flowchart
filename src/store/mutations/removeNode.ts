import Vue from 'vue';

import { IState, INode } from '@/types';
import emitter from '@/emitter';
import { REMOVE_NODE } from '@/emitter/events';
import { registerRevertFunc } from '@/utils/history';

export default function removeNode (state: IState, { node }: { node: INode }) {
  Vue.delete(state.graph.nodes, node.id);

  emitter.emit(REMOVE_NODE, node);
}

registerRevertFunc('removeNode', mutation => ({
  ...mutation,
  type: 'addNode',
}));
