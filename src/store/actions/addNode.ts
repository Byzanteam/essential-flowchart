import {
  FlowchartContext, INode,
} from '@/types';

export default function (context: FlowchartContext, node: INode) {
  const mutations = [{
    type: 'addNode',
    node: { ...node },
  }];

  context.dispatch('historyPushEntry', mutations);
}
