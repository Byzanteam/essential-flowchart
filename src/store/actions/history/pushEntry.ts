import {
  FlowchartContext,
  IMutation,
} from '@/types';

export default function ({ commit }: FlowchartContext, mutations: IMutation[] | IMutation) {
  if (!Array.isArray(mutations)) {
    // eslint-disable-next-line no-param-reassign
    mutations = [mutations];
  }

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
