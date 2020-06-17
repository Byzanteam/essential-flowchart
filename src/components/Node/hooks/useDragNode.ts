import { Ref } from '@vue/composition-api';

import { IPosition, INode, FlowchartStore } from '@/types';

export default function useDragNode (store: FlowchartStore, node: Ref<INode>) {
  let draggingNodePosition: IPosition | null = null;

  function onDragStart (e: MouseEvent) {
    if (store.state.readonly) return;
    e.stopPropagation(); // prevent canvas move

    draggingNodePosition = {
      x: node.value.x,
      y: node.value.y,
    };
  }

  function onNodeDragging (left: number, top: number) {
    if (store.state.readonly) return;
    store.dispatch('dragNode', {
      id: node.value.id,
      position: {
        x: left,
        y: top,
      },
      prevPosition: {
        x: node.value.x,
        y: node.value.y,
      },
    });
  }

  function onNodeDragStop (left: number, top: number) {
    if (store.state.readonly) return;
    store.dispatch('dragNodeStop', {
      id: node.value.id,
      position: {
        x: left,
        y: top,
      },
      prevPosition: { ...draggingNodePosition },
    });

    draggingNodePosition = null;
  }

  return {
    onDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}
