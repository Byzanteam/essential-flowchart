import { FlowchartContext, Id } from '@/types';

export default function selectNode ({ state, commit }: FlowchartContext, linkId: Id) {
  if (state.selected && state.selected.id === linkId) return;

  commit('updateSelected', {
    type: 'link',
    id: linkId,
  });
}
