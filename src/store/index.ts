import Vue from 'vue';
import Vuex from 'vuex';
import { IState, FlowchartStore } from '@/types';
import { buildConfig } from '@/utils/config';
import mutations from './mutations';
import actions from './actions';
import reactiveLinks from './plugins/reactiveLinks';

Vue.use(Vuex);

const state: IState = {
  history: {
    currentVersion: 0,
    entries: [],
  },
  graph: {
    scale: 1,
    offset: {
      x: 0,
      y: 0,
    },
    nodes: {},
    links: {},
  },
  linkVersions: {},
  linkPath: {},
  mousePosition: null,
  config: buildConfig({}),
};

const store: FlowchartStore = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [reactiveLinks],
});

export default store;
