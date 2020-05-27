import { FlowchartContext } from '@/types';

import { getEntry } from '@/utils/history';

export default function ({ state, commit }: FlowchartContext) {
  const entry = getEntry(state, 1);
  if (!entry) return;

  entry.mutations.forEach(mutation => commit(mutation));

  commit('historyAlterVersion', { delta: 1 });
}
