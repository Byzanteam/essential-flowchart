import {
  FlowchartContext, INodeInput,
} from '@/types';

export default function addNode ({ dispatch }: FlowchartContext, node: INodeInput) {
  const mutations = [{
    type: 'addNode',
    node: { ...node },
  }];

  dispatch('historyPushEntry', mutations);
}
