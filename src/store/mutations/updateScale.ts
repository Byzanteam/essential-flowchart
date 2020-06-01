import { IState } from '@/types';

export default function updateScale (state: IState, scale: number) {
  state.graph.scale = scale;
}
