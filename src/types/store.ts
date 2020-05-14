import { Store, MutationPayload } from 'vuex';
import { IGraph, INode, ILink } from './graph';

export interface IHistoryEntry {
  mutations: MutationPayload[];
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

export type FlowChartStore = Store<IState>;
