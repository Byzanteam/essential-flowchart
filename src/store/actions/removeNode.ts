import { FlowChartContext, ID } from '@/types';

export default function removeNode (context: FlowChartContext, nodeId: ID) {
  const { nodes, links } = context.state.graph;

  const node = nodes[nodeId];
  if (!node) return;

  const mutations = [];

  // remove link
  Object.values(links).forEach(link => {
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
