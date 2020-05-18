import { FlowChartContext, ID, Position } from '@/types';

export default function dragNodeStop ({ dispatch, state }: FlowChartContext, { id, position }: { id: ID; position: Position }) {
  const node = state.graph.nodes[id];

  if (!node) return;

  const mutations = [{
    type: 'dragNodeStop',
    nodeId: node.id,
    from: [node.x, node.y],
    to: [...position],
  }];

  dispatch('historyPushEntry', mutations);
}
