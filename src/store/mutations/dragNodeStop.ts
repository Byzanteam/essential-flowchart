import { IState, ID, Position } from '@/types';

import { registerRevertFunc } from '@/utils/history';

export default function dragNodeStop (state: IState, { nodeId, to }: { nodeId: ID; to: Position }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    [node.x, node.y] = to;
  }
}

registerRevertFunc('dragNodeStop', mutation => ({
  ...mutation,
  to: [...mutation.from],
  from: [...mutation.to],
}));
