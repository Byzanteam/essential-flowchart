import Vuex, { Store, MutationTree, ActionTree } from 'vuex';
import allMutations from '@/store/mutations';
import allActions from '@/store/actions';
import { IState } from '@/types';

const defaultGridDimension: [number, number] = [100, 100];

interface IStateAttrs {
  gridDimension?: [number, number];
}

interface ICreateStoreObject<T> {
  stateAttrs?: IStateAttrs;
  mutations?: MutationTree<T>;
  actions?: ActionTree<T, T>;
}

// eslint-disable-next-line import/prefer-default-export
export function createStore (
  {
    stateAttrs,
    mutations,
    actions,
  }: ICreateStoreObject<IState>,
): Store<IState> {
  const [width, height] = (
    stateAttrs && stateAttrs.gridDimension
  ) || defaultGridDimension;

  const store = new Vuex.Store({
    state: {
      history: [],
      graph: {
        offset: [0, 0],

        nodes: {},
        links: [],
        grid: {
          origin: [0, 0],

          width,
          height,

          maxtrix: [[]],
        },
      },
    } as IState,
    mutations: mutations || allMutations,
    actions: actions || allActions,
  });

  return store;
}
