import Vue from 'vue';

import { IState, INodeInput } from '@/types';
import emitter from '@/emitter';
import { ADD_NODE } from '@/emitter/events';
import { calcPortPosition } from '@/utils/graph';

import { registerRevertFunc } from '@/utils/history';

export default function addNode (state: IState, { node }: { node: INodeInput }) {
  const { nodes } = state.graph;

  const ports = calcPortPosition(
    Object.values(node.ports),
    {
      x: node.x, y: node.y, width: node.width, height: node.height,
    },
    state.config.portGap,
  );

  Vue.set(nodes, node.id, {
    ...node,
    ports,
  });

  emitter.emit(ADD_NODE, state.graph.nodes[node.id]);
}

registerRevertFunc('addNode', mutation => ({
  ...mutation,
  type: 'removeNode',
}));
