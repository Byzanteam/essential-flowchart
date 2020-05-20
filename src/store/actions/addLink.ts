import { FlowChartContext, ILink, ILinkAttrs } from '@/types';

export function buildLinkFromAttrs (linkAttrs: ILinkAttrs) {
  const { id, from, to } = linkAttrs;

  return {
    id,

    from: {
      ...from,
    },
    to: {
      ...to,
    },
  };
}

export default function addLink (context: FlowChartContext, linkAttrs: ILinkAttrs) {
  const node: ILink = buildLinkFromAttrs(linkAttrs);

  const mutations = [{
    type: 'addLink',
    node,
  }];

  context.dispatch('historyPushEntry', mutations);
}
