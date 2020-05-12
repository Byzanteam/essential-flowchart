import Vuex, { Store, MutationTree, ActionTree } from 'vuex';
import allMutations from '@/store/mutations';
import allActions from '@/store/actions';
import { IState } from '@/types';

interface ICreateStoreObject<T> {
  state: T;
  mutations?: MutationTree<T>;
  actions?: ActionTree<T, T>;
}

export function createStore ({ state, mutations, actions } : ICreateStoreObject<IState>) : Store<IState> {
  const store = new Vuex.Store({
    state,
    mutations: mutations || allMutations,
    actions: actions || allActions,
  });

  return store;
}
