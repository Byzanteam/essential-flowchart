import { Store, ActionContext, Payload } from 'vuex';
import {
  IGraph,
  INodeInput,
  INewLink,
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

export interface ISelectedOrHovered {
  type: 'node' | 'link';
  id: string;
}

export type SelectedOrHovered = ISelectedOrHovered | null;

export interface ILinkPipelinePhase {
  (link: INewLink, graph?: IGraph): INewLink | null;
  (link: ILink, graph?: IGraph): ILink | null;
}

export interface IConfig {
  nodePadding: number;
  portGap: number;
  linkPipeline: ILinkPipelinePhase[];
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
  newLink: INewLink | null;
  mousePosition: IPosition | null;
  config: IConfig;
  selected: SelectedOrHovered;
}

export interface IStateInput {
  nodes: INodeInput[];
  links: ILink[];
}

export type FlowchartContext = ActionContext<IState, IState>;

export type FlowchartStore = Store<IState>;
