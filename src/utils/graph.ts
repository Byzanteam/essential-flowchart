import { FlowchartStore, IGraph } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function buildGraph (graph: IGraph, store: FlowchartStore) {
  const {
    nodes, links, scale, offset,
  } = graph;

  store.commit({
    type: 'updateScale',
    scale,
  });

  store.commit({
    type: 'updateOffset',
    offset,
  });

  // TODO: expand grid
  Object.values(nodes).forEach(node => {
    store.commit('addNode', {
      node: { ...node },
    });
  });

  Object.values(links).forEach(link => {
    store.commit('addLink', {
      link: { ...link },
    });
  });
}
