import { FlowChartContext, Id, IPosition } from '@/types';

export default function dragNodeStop ({ dispatch, state }: FlowChartContext, { id, position }: { id: Id; position: IPosition }) {
  const node = state.graph.nodes[id];

  if (!node) return;

  const mutations = [{
    type: 'dragNodeStop',
    nodeId: node.id,
    from: {
      x: node.x,
      y: node.y,
    },
    to: { ...position },
  }];

  dispatch('historyPushEntry', mutations);
}
