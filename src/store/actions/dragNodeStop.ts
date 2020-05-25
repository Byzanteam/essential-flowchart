import { FlowChartContext, Id, IPosition } from '@/types';

export default function dragNodeStop (
  { dispatch, state }: FlowChartContext,
  { id, position, prevPosition }: { id: Id; position: IPosition; prevPosition: IPosition },
) {
  const node = state.graph.nodes[id];

  if (!node) return;

  const mutations = [{
    type: 'updateNodePosition',
    node,
    position,
    prevPosition,
  }];

  dispatch('historyPushEntry', mutations);
}
