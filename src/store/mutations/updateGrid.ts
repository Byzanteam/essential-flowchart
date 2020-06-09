import { IState, IGrid } from '@/types';

export default function updateGrid (state: IState, { grid }: { grid: IGrid }) {
  state.graph.grid = grid;
}
