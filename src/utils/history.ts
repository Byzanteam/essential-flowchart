import {
  IState,
  IMutation,
  IHistoryEntry,
} from '@/types';

type MutationType = string;
interface IRevertFunc {
  (mutation: IMutation): IMutation;
}
type Delta = 1 | -1;

const reverses: {[type: string]: IRevertFunc} = {};

export function registerRevertFunc (type: MutationType, revertFunc: IRevertFunc) {
  reverses[type] = revertFunc;
}

function revert (mutation: IMutation): IMutation {
  const revertFunc = reverses[mutation.type];

  if (!revertFunc) throw new Error(`${mutation.type} is an irreversible mutation`);

  return revertFunc(mutation);
}

export function revertMutation (mutation: IMutation): IMutation {
  return revert(mutation);
}

export function getEntry ({ history }: IState, delta: Delta): IHistoryEntry | null {
  const nextVersion = history.currentVersion + delta;

  // the state is newest
  if (nextVersion > history.entries.length) return null;

  // the state is oldest
  if (nextVersion < 0) return null;

  return history.entries[nextVersion];
}
