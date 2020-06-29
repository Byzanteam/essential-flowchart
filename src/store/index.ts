import Vue from 'vue';
import Vuex from 'vuex';
import { IState, FlowchartStore } from '@/types';
import { buildConfig } from '@/utils/config';
import mutations from './mutations';
import actions from './actions';

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
  mousePosition: null,
  config: buildConfig({}),
};

const store: FlowchartStore = new Vuex.Store({
  state,
  mutations,
  actions,
});

export default store;
