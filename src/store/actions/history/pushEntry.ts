import {
  FlowChartContext,
  IMutation,
} from '@/types';

export default function ({ commit }: FlowChartContext, mutations: IMutation[]) {
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
