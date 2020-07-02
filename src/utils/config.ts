import { inject, toRefs } from '@vue/composition-api';
import { IConfigInput, IConfig } from '@/types';
import {
  DEFAULT_NODE_PADDING, DEFAULT_PORT_GAP, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM,
} from '@/utils/constants';

function isNonNegativeInteger (input: number): boolean {
  return Number.isInteger(input) && input > 0;
}

function validateNodePadding (nodePadding: number) {
  if (!isNonNegativeInteger(nodePadding)) {
    throw new Error(`nodePadding must be a positive integer, but got ${JSON.stringify(nodePadding)}.`);
  }
}

function validatePortGap (portGap: number) {
  if (!isNonNegativeInteger(portGap)) {
    throw new Error(`portGap must be a positive integer, but got ${JSON.stringify(portGap)}.`);
  }
}

function validateZoom (zoom: number) {
  if (typeof zoom !== 'number' || Number.isNaN(zoom) || zoom < 0) {
    throw new Error(`zoom must be a positive number, but got ${JSON.stringify(zoom)}.`);
  }
}

// eslint-disable-next-line import/prefer-default-export
export function buildConfig (
  {
    offset = { x: 0, y: 0 },
    scale = 1,
    nodePadding = DEFAULT_NODE_PADDING,
    portGap = DEFAULT_PORT_GAP,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
    readonly = false,
  }: IConfigInput = {},
): IConfig {
  // OPTIMIZE: skip validate default value
  validateNodePadding(nodePadding);
  validatePortGap(portGap);
  validateZoom(minZoom);
  validateZoom(maxZoom);

  return {
    offset,
    scale,
    nodePadding,
    portGap,
    minZoom,
    maxZoom,
    readonly,
  };
}

export const DEFAULT_CONFIG = buildConfig();

export const ConfigSymbol = Symbol('config');

export function useConfig () {
  const config = inject<IConfig>(ConfigSymbol, DEFAULT_CONFIG);

  // @ts-ignore
  return toRefs(config);
}
