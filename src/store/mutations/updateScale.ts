import { IState } from '@/types';
import emitter from '@/emitter';
import { ZOOM_CHANGE } from '@/emitter/events';

export default function updateScale (state: IState, { scale }: { scale: number }) {
  const prevZoom = state.graph.scale;
  state.graph.scale = scale;

  emitter.emit(ZOOM_CHANGE, {
    prevZoom,
    zoom: scale,
  });
}
