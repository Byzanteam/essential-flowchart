import Vue from 'vue';
import {
  IState, INode, IPosition,
} from '@/types';
import emitter from '@/emitter';
import { NODE_POSITION_CHANGE } from '@/emitter/events';
import { registerRevertFunc } from '@/utils/history';
import { calcPortPosition } from '@/utils/graph';

export default function updateNodePosition (
  state: IState,
  { node, position, prevPosition }: { node: INode; position: IPosition; prevPosition: IPosition },
) {
  const { nodes } = state.graph;

  // skip when dragNodeStop
  if (position.x === node.x && position.y === node.y) {
    Vue.set(nodes, node.id, node);
  } else {
    const ports = calcPortPosition(
      Object.values(node.ports),
      {
        x: position.x, y: position.y, width: node.width, height: node.height,
      },
      state.config.portGap,
    );

    Vue.set(nodes, node.id, {
      ...node,
      ...position,
      ports,
    });

    emitter.emit(NODE_POSITION_CHANGE, {
      node,
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
