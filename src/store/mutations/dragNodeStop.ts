import { IState, Id, IPosition } from '@/types';
import { registerRevertFunc } from '@/utils/history';

export default function dragNodeStop (state: IState, { nodeId, to }: { nodeId: Id; to: IPosition }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    node.x = to.x;
    node.y = to.y;
  }
}

registerRevertFunc('dragNodeStop', mutation => ({
  ...mutation,
  to: { ...mutation.from },
  from: { ...mutation.to },
}));
