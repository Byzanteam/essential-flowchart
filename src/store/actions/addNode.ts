import {
  FlowchartContext, INodeInput,
} from '@/types';

export default function (context: FlowchartContext, node: INodeInput) {
  const mutations = [{
    type: 'addNode',
    node: { ...node },
  }];

  context.dispatch('historyPushEntry', mutations);
}
