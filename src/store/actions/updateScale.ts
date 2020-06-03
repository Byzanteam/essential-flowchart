import { FlowchartStore } from '@/types';
import { clamp } from '@/utils/shared';

export default function updateScale ({ state, commit }: FlowchartStore, scale: number) {
  const { minZoom, maxZoom } = state.config;

  commit({
    type: 'updateScale',
    scale: clamp(scale, minZoom, maxZoom),
  });
}
