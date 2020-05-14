import { IState, IHistoryEntry } from '@/types';

export default function (
  state: IState,
  { entry }: { entry: IHistoryEntry },
) {
  const deleteCount = state.history.entries.length - state.history.currentVersion;

  // fork at currentVersion
  if (deleteCount !== 0) {
    state.history.entries.splice(state.history.currentVersion, deleteCount);
  }

  state.history.currentVersion += 1;
  state.history.entries.push(entry);
}
