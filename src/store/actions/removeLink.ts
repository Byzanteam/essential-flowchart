import { FlowchartContext, Id } from '@/types';

export default function removeLink (context: FlowchartContext, linkId: Id) {
  const { links } = context.state.graph;
  if (!links.length) return;

  const link = links[linkId];

  if (!link) return;

  const mutations = [{
    type: 'removeLink',
    link: {
      ...link,
    },
  }];

  context.dispatch('historyPushEntry', mutations);
}
