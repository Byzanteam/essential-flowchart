import { IState, FlowChartStore } from '@/types';
import { MutationPayload } from 'vuex';

const historyPlugin = (store: FlowChartStore) => {
  store.subscribe((mutation: MutationPayload, state: IState) => {
    state.history.push({ mutation });
  });
};

export default [
  historyPlugin,
];