import { Ref } from '@vue/composition-api';
import emitter from '@/emitter';
import { NODE_POSITION_CHANGE } from '@/emitter/events';
import {
  INode, IPosition, IGetters, IMutations,
} from '@/types';

export default function useDragNode (node: Ref<INode>, getters: Ref<IGetters>, mutations: Ref<IMutations>) {
  let draggingNodePosition: IPosition | null = null;

  function onNodeDragStart (e: MouseEvent) {
    e.stopPropagation(); // prevent canvas move

    draggingNodePosition = getters.value.getNodePosition(node.value);
  }

  function onNodeDragging (left: number, top: number) {
    const payload = {
      node: node.value,
      position: {
        x: left,
        y: top,
      },
      prevPosition: draggingNodePosition as IPosition,
    };
    if (mutations.value && mutations.value.updateNodePosition) {
      mutations.value.updateNodePosition(payload);
    }
    emitter.emit(NODE_POSITION_CHANGE, payload);
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
    if (mutations.value && mutations.value.setNodePosition) {
      mutations.value.setNodePosition(payload);
    }
    draggingNodePosition = null;
  }

  return {
    onNodeDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}
