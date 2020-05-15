import { Store, ActionContext, Payload } from 'vuex';
import { IGraph, INode, ILink } from './graph';

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
  selected: ISelectedOrHovered | null;
}

export type FlowChartContext = ActionContext<IState, IState>;

export type FlowChartStore = Store<IState>;
