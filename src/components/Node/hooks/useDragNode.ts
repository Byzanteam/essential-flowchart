import { Ref } from '@vue/composition-api';

import { INode } from '@/types';

export default function useDragNode (_node: Ref<INode>) {
  // let draggingNodePosition: IPosition | null = null;

  function onNodeDragStart (e: MouseEvent) {
    e.stopPropagation(); // prevent canvas move

    // draggingNodePosition = {
    //   x: node.value.x,
    //   y: node.value.y,
    // };
  }

  function onNodeDragging (_left: number, _top: number) {
    // store.dispatch('dragNode', {
    //   id: node.value.id,
    //   position: {
    //     x: left,
    //     y: top,
    //   },
    //   prevPosition: {
    //     x: node.value.x,
    //     y: node.value.y,
    //   },
    // });
  }

  function onNodeDragStop (_left: number, _top: number) {
    // store.dispatch('dragNodeStop', {
    //   id: node.value.id,
    //   position: {
    //     x: left,
    //     y: top,
    //   },
    //   prevPosition: { ...draggingNodePosition },
    // });

    // draggingNodePosition = null;
  }

  return {
    onNodeDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}
