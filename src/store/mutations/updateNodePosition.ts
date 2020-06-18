import Vue from 'vue';
import {
  IState, INode, IPosition,
} from '@/types';
import emitter from '@/emitter';
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
      state.config,
    );

    updatedNode = markNodeWalkable(
      pfGrid,
      state.graph.grid.offset,
      {
        ...updatedNode,
        ...position,
      },
      false,
      state.config,
    );

    Vue.set(nodes, updatedNode.id, updatedNode);

    emitter.emit('node-position-change', {
      node: updatedNode,
      position,
      prevPosition,
    });
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
