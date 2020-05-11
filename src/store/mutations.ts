
import { IState, INode } from '@/types';

export default {
  addNode (state: IState, node: INode) {
    state.graph.nodes[node.id] = node;
  },
};
