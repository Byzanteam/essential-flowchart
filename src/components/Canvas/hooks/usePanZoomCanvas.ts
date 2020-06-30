import { computed } from '@vue/composition-api';
import emitter from '@/emitter';
import { CANVAS_PAN } from '@/emitter/events';
import { PanZoom, Transform } from 'panzoom';

export default function usePanZoomCanvas () {
  const minZoom = computed(() => 0.5);
  const maxZoom = computed(() => 4);

  function onCanvasZoom (_panZoom: PanZoom) {
    // const transform: Transform = panZoom.getTransform();
    // num.toFixed(2) ?
    // store.commit({
    //   type: 'updateScale',
    //   scale: transform.scale,
    // });
    // for zoom, convert x and y to integer
    // store.commit({
    //   type: 'updateOffset',
    //   offset: {
    //     x: Math.ceil(transform.x),
    //     y: Math.ceil(transform.y),
    //   },
    // });
  }

  function onCanvasPan (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();

    emitter.emit(CANVAS_PAN, {
      x: transform.x,
      y: transform.y,
    });
  }

  function onCanvasPanEnd (_panZoom: PanZoom) {
    // const transform: Transform = panZoom.getTransform();
    // // for pan, x and y are already integer
    // store.commit({
    //   type: 'updateOffset',
    //   offset: {
    //     x: transform.x,
    //     y: transform.y,
    //   },
    // });
  }

  return {
    minZoom,
    maxZoom,

    onCanvasZoom,
    onCanvasPan,
    onCanvasPanEnd,
  };
}
