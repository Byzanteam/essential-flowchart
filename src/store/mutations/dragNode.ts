import { IState, IPosition } from '@/types';

export default function dragNode (state: IState, { nodeId, to }: { nodeId: string; to: IPosition }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    node.x = to.x;
    node.y = to.y;
  }
}
