import { IState, IPosition } from '@/types';

// TODO
export default function dragNodeStop (state: IState, { nodeId, position }: { nodeId: string; position: IPosition }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    node.x = position.x;
    node.y = position.y;
  }
}
