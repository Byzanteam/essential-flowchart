import { FlowchartContext, Id, IPosition } from '@/types';
import { autoGridExpansions } from '@/utils/grid';

export default function dragNode (
  { state, commit }: FlowchartContext,
  { id, position, prevPosition }: { id: Id; position: IPosition; prevPosition: IPosition },
) {
  const node = state.graph.nodes[id];

  if (!node) return;

  autoGridExpansions(state.graph.grid, node, state.graph.scale).forEach(expansion => {
    commit('expandGrid', expansion);
  });

  commit('updateNodePosition', { node, position, prevPosition });
}
