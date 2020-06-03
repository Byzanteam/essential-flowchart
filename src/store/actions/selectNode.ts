import { FlowchartContext, Id } from '@/types';

export default function selectNode ({ state, commit }: FlowchartContext, nodeId: Id) {
  if (state.selected && state.selected.id === nodeId) return;

  commit('updateSelected', {
    selected: {
      type: 'node',
      id: nodeId,
    },
  });
}
