import { PanZoom, Transform } from 'panzoom';
import { FlowchartStore, IOffset } from '@/types';

export default function usePanZoomCanvas (store: FlowchartStore, gridOffset: IOffset) {
  function onPanZoomInit (panZoom: PanZoom) {
    panZoom.zoomAbs(
      gridOffset.x, // initial x
      gridOffset.y, // initial y
      store.state.graph.scale, // initial scale
    );
  }

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
    onPanZoomInit,
    onCanvasZoom,
    onCanvasPanEnd,
  };
}
