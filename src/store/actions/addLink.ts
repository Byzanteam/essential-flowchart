import { FlowChartContext, ILink, ILinkAttrs } from '@/types';

export default function addLink (context: FlowChartContext, linkAttrs: ILinkAttrs) {
  const { id, from, to } = linkAttrs;

  const node: ILink = {
    id,

    from: {
      ...from,
    },
    to: {
      ...to,
    },
  };

  const mutations = [{
    type: 'addLink',
    node,
  }];

  context.commit('historyPushEntry', mutations);
}
