import { Store } from 'vuex';
import { IGraph } from './graph';

interface IHistoryEntry {
  action: string;
  payload: any;
}

export interface IState {
  history: IHistoryEntry[];
  graph: IGraph;
}

export type FlowChartStore = Store<IState>;
