import { Ref } from '@vue/composition-api';
import emitter from '@/emitter';
import { CANVAS_PAN, ZOOM_CHANGE, OFFSET_CHANGE } from '@/emitter/events';
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

    emitter.emit(ZOOM_CHANGE, transform.scale);
    emitter.emit(OFFSET_CHANGE, offset.value);
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

    emitter.emit(OFFSET_CHANGE, offset.value);
  }

  return {
    onCanvasZoom,
    onCanvasPan,
    onCanvasPanEnd,
  };
}
