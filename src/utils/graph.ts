import { FlowChartStore, IStateAttrs } from '@/types';

import { buildNodeFromAttrs } from '@/store/actions/addNode';
import { buildLinkFromAttrs } from '@/store/actions/addLink';

// eslint-disable-next-line import/prefer-default-export
export function buildState (rawState: IStateAttrs, store: FlowChartStore) {
  const { nodes, links } = rawState;

  nodes.forEach(nodeAttrs => {
    store.commit('addNode', {
      node: buildNodeFromAttrs(nodeAttrs),
    });
  });

  links.forEach(linkAttrs => {
    store.commit('addLink', {
      link: buildLinkFromAttrs(linkAttrs),
    });
  });
}
