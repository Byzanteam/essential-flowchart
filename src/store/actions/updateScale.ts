import { FlowchartContext } from '@/types';
import { clamp } from '@/utils/shared';

export default function updateScale ({ state, commit }: FlowchartContext, scale: number) {
  const { minZoom, maxZoom } = state.config;

  commit({
    type: 'updateScale',
    scale: clamp(scale, minZoom, maxZoom),
  });
}
