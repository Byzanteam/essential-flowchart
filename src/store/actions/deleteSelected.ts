import { FlowChartContext } from '@/types';

export default function ({ commit, state }: FlowChartContext) {
  const { selected } = state;
  if (selected) {
    if (selected.type === 'link') {
      commit('removeLink', selected.id);
    } else if (selected.type === 'node') {
      commit('removeNode', selected.id);
    }
    commit('setSelected', null);
  }
}
