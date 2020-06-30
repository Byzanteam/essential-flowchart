import {
  IState, IPosition, Id,
} from '@/types';
import emitter from '@/emitter';
import { NODE_POSITION_CHANGE } from '@/emitter/events';
import { registerRevertFunc } from '@/utils/history';

export default function updateNodePosition (
  state: IState,
  { id, position, prevPosition }: { id: Id; position: IPosition; prevPosition: IPosition },
) {
  const node = state.graph.nodes[id];

  if (node) {
    node.x = position.x;
    node.y = position.y;

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
