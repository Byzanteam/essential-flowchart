import {
  IGraph,
  ILink,
} from './graph';
import { IOffset } from './generics';

export interface ILinkPipelinePhase {
  (link: ILink, graph?: IGraph): ILink | null;
}

export interface IConfig {
  nodePadding: number;
  portGap: number;
  minZoom: number;
  maxZoom: number;
  linkPipeline: ILinkPipelinePhase[];
  readonly: boolean;
  offset: IOffset;
  scale: number;
}

export type IConfigInput = Partial<IConfig>;
