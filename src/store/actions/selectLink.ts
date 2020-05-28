import { FlowchartContext, Id } from '@/types';

export default function selectNode ({ state, dispatch }: FlowchartContext, linkId: Id) {
  if (state.selected && state.selected.id === linkId) return;

  const mutation = {
    type: 'updateSelected',
    selected: {
      type: 'link',
      id: linkId,
    },
  };

  dispatch('historyPushEntry', mutation);
}
