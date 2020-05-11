import Vue from 'vue';
import Vuex, { Store, MutationPayload } from 'vuex';
import { IState } from '@/types';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

type FlowStore = Store<IState>;

const state: IState = {
  history: [],
  graph: { // TODO: init
    offset: {
      x: 0,
      y: 0,
    },
    nodes: {},
  },
};

// TODO: plugin
const historyPlugin = (store: FlowStore) => {
  // eslint-disable-next-line no-shadow
  store.subscribe((mutation: MutationPayload, state: IState) => {
    state.history.push({ mutation });
  });
};

const store: FlowStore = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [historyPlugin],
});

export default store;
