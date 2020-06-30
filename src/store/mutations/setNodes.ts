import Vue from 'vue';

import { IState, INodeInput } from '@/types';

export default function setNodes (state: IState, nodes: Record<string, INodeInput>) {
  Object.entries(nodes).forEach(([id, node]) => {
    Vue.set(state.graph.nodes, id, node);
  });
}
