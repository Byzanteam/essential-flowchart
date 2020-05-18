import { FlowChartContext } from '@/types';
import { getEntry, revertMutation } from '@/utils/history';

export default function ({ state, commit }: FlowChartContext) {
  const entry = getEntry(state, -1);
  if (!entry) return;

  [...entry.mutations].reverse().forEach(mutation => commit(revertMutation(mutation)));

  commit('historyAlterVersion', { delta: -1 });
}
