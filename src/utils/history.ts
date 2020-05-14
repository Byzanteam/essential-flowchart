import { FlowChartStore, IMutation } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function push (store: FlowChartStore, mutations: IMutation[]) {
  mutations.forEach(mutation => {
    store.commit(mutation);
  });

  store.commit({
    type: 'pushHistoryEntry',
    entry: {
      mutations,
    },
  });
}
