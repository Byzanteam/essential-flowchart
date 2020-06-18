import { Ref } from '@vue/composition-api';

import { IPosition, INode, FlowchartStore } from '@/types';

export default function useDragNode (store: FlowchartStore, node: Ref<INode>) {
  let draggingNodePosition: IPosition | null = null;

  function onDragStart (e: MouseEvent) {
    e.stopPropagation(); // prevent canvas move

    draggingNodePosition = {
      x: node.value.x,
      y: node.value.y,
    };
  }

  function onNodeDragging (left: number, top: number) {
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

  if (store.state.config.readonly) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onDragStart () {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onNodeDragging () {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onNodeDragStop () {},
    };
  }

  return {
    onDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}
