import { FlowchartContext, Id, IPosition } from '@/types';

export default function dragNode (
  { state, commit }: FlowchartContext,
  { id, position, prevPosition }: { id: Id; position: IPosition; prevPosition: IPosition },
) {
  const node = state.graph.nodes[id];

  if (!node) return;

  commit('updateNodePosition', { node, position, prevPosition });
}
