import { INode } from '@/types/graph';
// eslint-disable-next-line import/no-cycle
import { IState } from './index';

export default {
  addNode (state: IState, node: INode) {
    state.graph.nodes[node.id] = node;
  },
};
