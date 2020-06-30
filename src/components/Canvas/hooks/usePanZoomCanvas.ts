import { Ref } from '@vue/composition-api';
import emitter from '@/emitter';
import { CANVAS_PAN } from '@/emitter/events';
import { PanZoom, Transform } from 'panzoom';
import { IOffset } from '@/types';

export default function usePanZoomCanvas (scale: Ref<number>, offset: Ref<IOffset>) {
  function onCanvasZoom (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();
    // num.toFixed(2) ?
    scale.value = transform.scale;

    // for zoom, convert x and y to integer
    offset.value = {
      x: Math.ceil(transform.x),
      y: Math.ceil(transform.y),
    };
  }

  function onCanvasPan (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();

    emitter.emit(CANVAS_PAN, {
      x: transform.x,
      y: transform.y,
    });
  }

  function onCanvasPanEnd (panZoom: PanZoom) {
    const transform: Transform = panZoom.getTransform();
    // for pan, x and y are already integer
    offset.value = {
      x: transform.x,
      y: transform.y,
    };
  }

  return {
    onCanvasZoom,
    onCanvasPan,
    onCanvasPanEnd,
  };
}
