import { Store } from 'vuex';
import { IGraph } from './graph';

export interface IState {
  history: any[];
  graph: IGraph;
}

export type FlowChartStore = Store<IState>;
