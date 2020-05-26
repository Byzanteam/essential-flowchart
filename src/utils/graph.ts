import { FlowchartStore, IStateAttrs } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function buildState (rawState: IStateAttrs, store: FlowchartStore) {
  const { nodes, links } = rawState;

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
