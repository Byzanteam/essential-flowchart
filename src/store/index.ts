import Vue from 'vue';
import Vuex from 'vuex';
import { IState, FlowChartStore } from '@/types';
import { buildEmptyGrid } from '@/utils/grid';
import mutations from './mutations';
import actions from './actions';
import plugins from './plugins';

const [defaultWidth, defaultHeight]: [number, number] = [1440, 900];

Vue.use(Vuex);

const state: IState = {
  history: {
    currentVersion: 0,
    entries: [],
  },
  graph: {
    offset: {
      x: 0,
      y: 0,
    },
    nodes: {},
    links: {},
    grid: {
      offset: {
        x: 0,
        y: 0,
      },
      ...buildEmptyGrid(defaultWidth, defaultHeight),
    },
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
