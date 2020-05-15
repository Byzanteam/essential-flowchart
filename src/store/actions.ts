import { FlowChartContext, Position } from '@/types';

import addNode from './actions/addNode';
import removeNode from './actions/removeNode';

import historyActions from './actions/history';

function dragNodeStop ({ commit }: FlowChartContext, { id, position }: { id: string; position: Position }) {
  commit('dragNodeStop', { nodeId: id, position });
}

function deleteSelected ({ commit, state }: FlowChartContext) {
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

export default {
  ...historyActions,
  addNode,
  removeNode,
  dragNodeStop,
  deleteSelected,
};
