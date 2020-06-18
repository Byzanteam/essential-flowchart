import { IState } from '@/types';
import emitter from '@/emitter';

export default function updateScale (state: IState, { scale }: { scale: number }) {
  const prevZoom = state.graph.scale;
  state.graph.scale = scale;

  emitter.emit('zoom-change', {
    prevZoom,
    zoom: scale,
  });
}
