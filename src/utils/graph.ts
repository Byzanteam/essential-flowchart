import { FlowchartStore, IStateInput } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function buildState (rawState: IStateInput, store: FlowchartStore) {
  const { nodes, links, scale = 1 } = rawState;

  store.commit('updateScale', scale);

  // TODO: expand grid
  nodes.forEach(node => {
    store.commit('addNode', {
      node: { ...node },
    });
  });

  links.forEach(link => {
    store.commit('addLink', {
      link: { ...link },
    });
  });
}
