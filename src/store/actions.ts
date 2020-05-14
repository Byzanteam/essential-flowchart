import { ActionContext } from 'vuex';

import { IState, Position } from '@/types';

import addNode from './actions/addNode';

type ctx = ActionContext<IState, IState>;

export function removeNode ({ commit }: ctx, id: string) {
  commit('removeNode', id);
}

export function dragNodeStop ({ commit }: ctx, { id, position }: { id: string; position: Position }) {
  commit('dragNodeStop', { nodeId: id, position });
}

export function deleteSelected ({ commit, state }: ctx) {
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
  addNode,
  removeNode,
  dragNodeStop,
  deleteSelected,
};
