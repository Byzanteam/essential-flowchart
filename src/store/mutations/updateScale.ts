import { IState } from '@/types';

export default function updateScale (state: IState, { scale }: { scale: number }) {
  state.graph.scale = scale;
}
