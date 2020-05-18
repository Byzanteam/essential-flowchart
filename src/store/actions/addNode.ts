import {
  FlowChartContext, INode, INodeAttrs, PortDirection,
} from '@/types';

export default function (context: FlowChartContext, nodeAttrs: INodeAttrs) {
  const [x, y, width, height] = nodeAttrs.rect;

  const node: INode = {
    id: nodeAttrs.id,

    x,
    y,
    width,
    height,

    ports: {
      top: {
        direction: PortDirection.Top,
      },
      bottom: {
        direction: PortDirection.Bottom,
      },
    },
  };

  const mutations = [{
    type: 'addNode',
    node,
  }];

  context.commit('historyPushEntry', mutations);
}
