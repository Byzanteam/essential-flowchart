import { IState, IGraph } from '@/types';

export default function (state: IState, graph: IGraph) {
  state.graph = graph;
}
