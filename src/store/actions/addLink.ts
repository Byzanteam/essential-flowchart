import { FlowchartContext, ILink } from '@/types';

export default function addLink (context: FlowchartContext, link: ILink) {
  const mutations = [{
    type: 'addLink',
    link: { ...link },
  }];

  context.dispatch('historyPushEntry', mutations);
}
