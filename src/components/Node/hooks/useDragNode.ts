import { Ref } from '@vue/composition-api';
import emitter from '@/emitter';
import { NODE_POSITION_CHANGE, MOVE_NODE, CLICK_NODE } from '@/emitter/events';
import {
  INode, IPosition, IGetters,
} from '@/types';

export default function useDragNode (node: Ref<INode>, getters: Ref<IGetters>) {
  let draggingNodePosition: IPosition | null = null;
  let moved = false;

  function onNodeDragStart (e: MouseEvent) {
    e.stopPropagation(); // prevent canvas move

    draggingNodePosition = getters.value.getNodePosition(node.value);
  }

  function onNodeDragging (left: number, top: number) {
    moved = true;
    const payload = {
      node: node.value,
      position: {
        x: left,
        y: top,
      },
      prevPosition: draggingNodePosition as IPosition,
    };
    emitter.emit(MOVE_NODE, payload);
  }

  function onNodeDragStop (left: number, top: number) {
    const payload = {
      node: node.value,
      position: {
        x: left,
        y: top,
      },
      prevPosition: draggingNodePosition as IPosition,
    };
    if (moved) {
      emitter.emit(NODE_POSITION_CHANGE, payload);
    } else {
      emitter.emit(CLICK_NODE, { node: node.value });
    }
    moved = false;
    draggingNodePosition = null;
  }

  return {
    onNodeDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}
