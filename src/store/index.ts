import Vue from 'vue';
import Vuex from 'vuex';
import { IState, FlowChartStore } from '@/types';
import mutations from './mutations';
import actions from './actions';
import plugins from './plugins';

Vue.use(Vuex);

const state: IState = {
  history: [],
  graph: { // TODO: init
    offset: [0, 0],
    nodes: {},
    links: {},
  },
  selected: null,
};

const store: FlowChartStore = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins,
});

export default store;
