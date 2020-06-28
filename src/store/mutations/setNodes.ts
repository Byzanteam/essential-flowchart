import Vue from 'vue';

import { IState, INodeInput } from '@/types';
import { markNodeWalkable } from '@/utils/grid';

export default function setNodes (state: IState, nodes: Record<string, INodeInput>) {
  const { pfGrid } = state.graph.grid;

  Object.entries(nodes).forEach(([key, node]) => {
    Vue.set(state.graph.nodes, key, markNodeWalkable(
      pfGrid,
      state.graph.grid.offset,
      node,
      false,
      state.config,
    ));
  });
}
