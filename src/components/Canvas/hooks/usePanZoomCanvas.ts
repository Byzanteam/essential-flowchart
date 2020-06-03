import { computed } from '@vue/composition-api';
import { PanZoom, Transform } from 'panzoom';
import { FlowchartStore } from '@/types';

export default function usePanZoomCanvas (store: FlowchartStore) {
  const minZoom = computed(() => store.state.config.minZoom);
  const maxZoom = computed(() => store.state.config.maxZoom);

  function onCanvasZoom (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();
    // num.toFixed(2) ?
    store.commit('updateScale', transform.scale);
    // for zoom, convert x and y to integer
    store.commit('updateOffset', {
      x: Math.ceil(transform.x),
      y: Math.ceil(transform.y),
    });
  }

  function onCanvasPanEnd (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();
    // for pan, x and y are already integer
    store.commit('updateOffset', {
      x: transform.x,
      y: transform.y,
    });
  }

  return {
    minZoom,
    maxZoom,

    onCanvasZoom,
    onCanvasPanEnd,
  };
}
