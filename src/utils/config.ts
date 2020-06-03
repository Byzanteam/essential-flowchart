import { IConfigInput, IConfig, ILinkPipelinePhase } from '@/types';
import generateLinkId from '@/pipelines/generateLinkId';
import distinctFromNodeAndToNode from '@/pipelines/distinctFromNodeAndToNode';

export const SCALE_FACTOR = 5;

const DEFAULT_NODE_PADDING = SCALE_FACTOR * 2;
const DEFAULT_PORT_GAP = SCALE_FACTOR * 2;
const DEFAULT_MIN_ZOOM = 0.5;
const DEFAULT_MAX_ZOOM = 1.5;

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
  if (typeof zoom !== 'number' || zoom < 0) {
    throw new Error(`zoom must be a positive number, but got ${JSON.stringify(zoom)}.`);
  }
}

function validateLinkPipeline (linkPipeline: ILinkPipelinePhase[]) {
  if (!Array.isArray(linkPipeline)) throw new Error('');
}

export function buildConfig (
  {
    nodePadding = DEFAULT_NODE_PADDING,
    portGap = DEFAULT_PORT_GAP,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
    linkPipeline = [generateLinkId, distinctFromNodeAndToNode],
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
  };
}
