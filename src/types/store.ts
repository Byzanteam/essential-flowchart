import { Store, ActionContext, Payload } from 'vuex';
import {
  IGraph,
  INode,
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

export type ISelectable = INode | ILink;

export interface IState {
  history: IHistory;
  graph: IGraph;
  linkVersions: {
    [linkId: string]: number;
  };
  linkPath: {
    [linkId: string]: Point[];
  };
  selected: ISelectedOrHovered | null;
  mousePosition: IPosition | null;
}

export interface IStateAttrs {
  nodes: INode[];
  links: ILink[];
}

export type FlowchartContext = ActionContext<IState, IState>;

export type FlowchartStore = Store<IState>;
