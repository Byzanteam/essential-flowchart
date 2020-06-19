import {
  FlowchartStore, IPosition, INodeInput, Id,
} from '@/types';

export default function useApi (store: FlowchartStore, instance: any) {
  function zoom (delta: number) {
    store.dispatch('updateScale', store.state.graph.scale + delta);
  }

  function zoomIn () {
    zoom(0.2);
  }

  function zoomOut () {
    zoom(-0.2);
  }

  function getPosition (clientX: number, clientY: number): IPosition | null {
    const { canvasRef } = instance;
    if (canvasRef.value) {
      return canvasRef.value.getPosition(clientX, clientY);
    }
    return null;
  }

  function addNode (node: INodeInput) {
    store.dispatch('addNode', node);
  }

  function removeNode (nodeId: Id) {
    store.dispatch('removeNode', nodeId);
  }

  function removeLink (linkId: Id) {
    store.dispatch('removeLink', linkId);
  }

  return {
    zoom,
    zoomIn,
    zoomOut,
    getPosition,

    addNode,
    removeNode,

    removeLink,
  };
}
