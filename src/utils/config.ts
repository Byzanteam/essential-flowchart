import { IConfigInput, IConfig } from '@/types';

export const SCALE_FACTOR = 5;

const DEFAULT_NODE_PADDING = SCALE_FACTOR * 2;
const DEFAULT_PORT_GAP = SCALE_FACTOR * 2;
const DEFAULT_MIN_ZOOM = 0.5;
const DEFAULT_MAX_ZOOM = 1.5;

export function buildConfig (
  {
    nodePadding = DEFAULT_NODE_PADDING,
    portGap = DEFAULT_PORT_GAP,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
  }: IConfigInput,
): IConfig {
  return {
    nodePadding,
    portGap,
    minZoom,
    maxZoom,
  };
}
