import {
  FlowchartContext,
  IMutation,
} from '@/types';

export default function ({ commit }: FlowchartContext, mutations: IMutation[]) {
  mutations.forEach(mutation => {
    commit(mutation);
  });

  commit({
    type: 'historyPushEntry',
    entry: {
      mutations,
    },
  });
}
