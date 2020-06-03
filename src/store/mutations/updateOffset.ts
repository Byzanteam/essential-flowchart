import { IState, IOffset } from '@/types';

export default function updateOffset (state: IState, { offset }: { offset: IOffset }) {
  state.graph.offset = offset;
}
