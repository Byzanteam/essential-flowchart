import { IState } from '@/types';
import { clamp } from '@/utils/shared';

export default function updateScale (state: IState, scale: number) {
  const { minZoom, maxZoom } = state.config;
  state.graph.scale = clamp(scale, minZoom, maxZoom);
}
