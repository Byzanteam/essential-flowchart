import { computed } from '@vue/composition-api';
import emitter from '@/emitter';
import { PanZoom, Transform } from 'panzoom';
import { FlowchartStore } from '@/types';

export default function usePanZoomCanvas (store: FlowchartStore) {
  const minZoom = computed(() => store.state.config.minZoom);
  const maxZoom = computed(() => store.state.config.maxZoom);

  function onCanvasZoom (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();
    // num.toFixed(2) ?
    store.commit({
      type: 'updateScale',
      scale: transform.scale,
    });
    // for zoom, convert x and y to integer
    store.commit({
      type: 'updateOffset',
      offset: {
        x: Math.ceil(transform.x),
        y: Math.ceil(transform.y),
      },
    });
  }

  function onCanvasPan (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();

    emitter.emit('canvas-pan', {
      x: transform.x,
      y: transform.y,
    });
  }

  function onCanvasPanEnd (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();
    // for pan, x and y are already integer
    store.commit({
      type: 'updateOffset',
      offset: {
        x: transform.x,
        y: transform.y,
      },
    });
  }

  return {
    minZoom,
    maxZoom,

    onCanvasZoom,
    onCanvasPan,
    onCanvasPanEnd,
  };
}
