import { IState, INode } from '@/types';

export default function (state: IState, node: INode) {
  state.graph.nodes[node.id] = node;
}
