import { Ref } from '@vue/composition-api';
import emitter from '@/emitter';
import { NODE_POSITION_CHANGE } from '@/emitter/events';
import { INode, IPosition, IGetters } from '@/types';

export default function useDragNode (node: Ref<INode>, getters: Ref<IGetters>) {
  let draggingNodePosition: IPosition | null = null;

  function onNodeDragStart (e: MouseEvent) {
    e.stopPropagation(); // prevent canvas move

    draggingNodePosition = getters.value.getNodePosition(node.value);
  }

  function onNodeDragging (left: number, top: number) {
    emitter.emit(NODE_POSITION_CHANGE, {
      node: node.value,
      position: {
        x: left,
        y: top,
      },
      prevPosition: {
        ...draggingNodePosition,
      },
    });
  }

  function onNodeDragStop (left: number, top: number) {
    emitter.emit(NODE_POSITION_CHANGE, {
      node: node.value,
      position: {
        x: left,
        y: top,
      },
      prevPosition: {
        ...draggingNodePosition,
      },
    });

    draggingNodePosition = null;
  }

  return {
    onNodeDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}
