import { IConfigInput, IConfig } from '@/types';

export const SCALE_FACTOR = 5;

const DEFAULT_NODE_PADDING = SCALE_FACTOR * 2;
const DEFAULT_PORT_GAP = SCALE_FACTOR * 2;

export function buildConfig (
  {
    nodePadding = DEFAULT_NODE_PADDING,
    portGap = DEFAULT_PORT_GAP,
  }: IConfigInput,
): IConfig {
  return {
    nodePadding,
    portGap,
  };
}
