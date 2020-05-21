import { FlowChartContext, ILink } from '@/types';

export default function addLink (context: FlowChartContext, link: ILink) {
  const mutations = [{
    type: 'addLink',
    link: { ...link },
  }];

  context.dispatch('historyPushEntry', mutations);
}
