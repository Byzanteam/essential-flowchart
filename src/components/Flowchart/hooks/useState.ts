import { FlowchartStore, IGraph } from '@/types';
import { buildGraph } from '@/utils/graph';

export default function useGraph (graph: IGraph, store: FlowchartStore) {
  buildGraph(graph, store);
  store.commit('setNodes', graph);
  store.commit('setLinks', graph);
}
