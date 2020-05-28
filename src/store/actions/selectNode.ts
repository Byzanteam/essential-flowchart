import { FlowchartContext, Id } from '@/types';

export default function selectNode ({ state, dispatch }: FlowchartContext, nodeId: Id) {
  if (state.selected && state.selected.id === nodeId) return;

  const mutation = {
    type: 'updateSelected',
    selected: {
      type: 'node',
      id: nodeId,
    },
  };

  dispatch('historyPushEntry', mutation);
}
