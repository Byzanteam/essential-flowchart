import { FlowChartContext, ID } from '@/types';

export default function removeNode (context: FlowChartContext, nodeId: ID) {
  const mutations = [];

  const { nodes, links } = context.state.graph;

  const node = nodes[nodeId];
  if (!node) return;

  // remove link
  Object.entries(links).forEach(entry => {
    const link = entry[1];

    if (link.from.nodeId === nodeId || link.to.nodeId === nodeId) {
      mutations.push({
        type: 'removeLink',
        link: {
          ...link,
        },
      });
    }
  });

  mutations.push({
    type: 'removeNode',
    node: {
      ...node,
    },
  });

  context.dispatch('historyPushEntry', mutations);
}
