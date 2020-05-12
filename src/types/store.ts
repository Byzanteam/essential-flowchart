import { Store } from 'vuex';
import { IGraph, INode, ILink } from './graph';

interface IHistoryEntry {
  action: string;
  payload: any;
}

interface ISelectedOrHovered {
  type: 'node' | 'link';
  id: string;
}

export type ISelectable = INode | ILink;

export interface IState {
  history: IHistoryEntry[];
  graph: IGraph;
  selected: ISelectedOrHovered | null;
}

export type FlowChartStore = Store<IState>;
