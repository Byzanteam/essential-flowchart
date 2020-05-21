import {
  FlowChartContext, INode,
} from '@/types';

export default function (context: FlowChartContext, node: INode) {
  const mutations = [{
    type: 'addNode',
    node: { ...node },
  }];

  context.dispatch('historyPushEntry', mutations);
}
