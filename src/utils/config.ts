import { IConfigInput, IConfig, ILinkPipelinePhase } from '@/types';
import {
  DEFAULT_NODE_PADDING, DEFAULT_PORT_GAP, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM,
} from '@/utils/constants';
import generateLinkId from '@/pipelines/generateLinkId';
import distinctFromNodeAndToNode from '@/pipelines/distinctFromNodeAndToNode';

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

function validateLinkPipeline (linkPipeline: ILinkPipelinePhase[]) {
  if (!Array.isArray(linkPipeline)) throw new Error('');
}

// eslint-disable-next-line import/prefer-default-export
export function buildConfig (
  {
    nodePadding = DEFAULT_NODE_PADDING,
    portGap = DEFAULT_PORT_GAP,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
    linkPipeline = [generateLinkId, distinctFromNodeAndToNode],
    readonly = false,
  }: IConfigInput,
): IConfig {
  // OPTIMIZE: skip validate default value
  validateNodePadding(nodePadding);
  validatePortGap(portGap);
  validateZoom(minZoom);
  validateZoom(maxZoom);
  validateLinkPipeline(linkPipeline);

  return {
    nodePadding,
    portGap,
    minZoom,
    maxZoom,
    linkPipeline,
    readonly,
  };
}
