import Vue from 'vue';
import {
  IState, INode, IPosition,
} from '@/types';

import { markNodeWalkable } from '@/utils/grid';
import { registerRevertFunc } from '@/utils/history';

export default function updateNodePosition (
  state: IState,
  { node, position, prevPosition }: { node: INode; position: IPosition; prevPosition: IPosition },
) {
  const { nodes, grid: { pfGrid } } = state.graph;

  // skip when dragNodeStop
  if (position.x === node.x && position.y === node.y) {
    Vue.set(nodes, node.id, node);
  } else {
    let updatedNode = markNodeWalkable(
      state.graph.grid.pfGrid,
      state.graph.grid.offset,
      {
        ...node,
        ...prevPosition,
      },
      true,
    );

    updatedNode = markNodeWalkable(
      pfGrid,
      state.graph.grid.offset,
      {
        ...updatedNode,
        ...position,
      },
      false,
    );

    Vue.set(nodes, updatedNode.id, updatedNode);
  }
}

registerRevertFunc('updateNodePosition', mutation => {
  const { prevPosition, position } = mutation;

  return {
    ...mutation,
    prevPosition: { ...position },
    position: { ...prevPosition },
  };
});