import { FlowchartStore, INode, ILink } from '@/types';
import { buildGraph } from '@/utils/graph';

export default function useGraph (
  nodes: Record<string, INode>,
  links: Record<string, ILink>,
  store: FlowchartStore,
) {
  buildGraph({
    nodes,
    links,
    offset: store.state.graph.offset,
    scale: store.state.graph.scale,
    grid: store.state.graph.grid,
  }, store);
  store.commit('setNodes', nodes);
  store.commit('setLinks', links);
}
