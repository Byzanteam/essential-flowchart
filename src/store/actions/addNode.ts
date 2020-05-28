import {
  FlowchartContext, INodeInput,
} from '@/types';

import { autoGridExpansions } from '@/utils/grid';

export default function addNode ({ state, commit, dispatch }: FlowchartContext, node: INodeInput) {
  autoGridExpansions(state.graph.grid, node).forEach(expansion => {
    commit('expandGrid', expansion);
  });

  const mutations = [{
    type: 'addNode',
    node: { ...node },
  }];

  dispatch('historyPushEntry', mutations);
}
