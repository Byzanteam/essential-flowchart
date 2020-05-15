import { IState, Position } from '@/types';

export default function (state: IState, { nodeId, position }: { nodeId: string; position: Position }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    [node.x, node.y] = position;
  }
}
