import { Store, ActionContext, Payload } from 'vuex';
import {
  IGraph,
  ILink,
  Point,
} from './graph';
import { IPosition } from './generics';

export interface IMutation extends Payload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export interface IHistoryEntry {
  mutations: IMutation[];
}

export interface IHistory {
  currentVersion: number; // one-based
  entries: IHistoryEntry[];
}

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
}

export type IConfigInput = Partial<IConfig>;

export interface IState {
  history: IHistory;
  graph: IGraph;
  linkVersions: {
    [linkId: string]: number;
  };
  linkPath: {
    [linkId: string]: Point[];
  };
  mousePosition: IPosition | null;
  config: IConfig;
}

export type FlowchartContext = ActionContext<IState, IState>;

export type FlowchartStore = Store<IState>;
