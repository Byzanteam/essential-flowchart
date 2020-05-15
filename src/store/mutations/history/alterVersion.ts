import { IState } from '@/types';

type Delta = -1 | 1;

export default function (
  state: IState,
  { delta }: { delta: Delta },
) {
  state.history.currentVersion += delta;
}
