import { computed } from '@vue/composition-api';

import { FlowchartStore, IGraph } from '@/types';
import { buildGraph } from '@/utils/graph';

export default function useGraph (graph: IGraph, store: FlowchartStore) {
  buildGraph(graph, store);
  const nodes = computed(() => store.state.graph.nodes);
  const links = computed(() => store.state.graph.links);

  return {
    nodes,
    links,
  };
}
