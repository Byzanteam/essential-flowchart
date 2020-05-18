import { FlowChartContext } from '@/types';

// TODO
export default function deleteSelected ({ dispatch, state }: FlowChartContext) {
  const { selected } = state;

  if (selected) {
    if (selected.type === 'link') {
      dispatch('removeLink', selected.id);
    } else if (selected.type === 'node') {
      dispatch('removeNode', selected.id);
    }

    dispatch('setSelected', null);
  }
}
