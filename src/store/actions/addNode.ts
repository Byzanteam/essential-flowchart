import {
  FlowChartContext, INode, INodeAttrs, PortDirection,
} from '@/types';

export function buildNodeFromAttrs (nodeAttrs: INodeAttrs) {
  const [x, y, width, height] = nodeAttrs.rect;

  return {
    id: nodeAttrs.id,

    x,
    y,
    width,
    height,

    // TODO: left and right port
    ports: {
      top: {
        direction: PortDirection.TOP,
      },
      bottom: {
        direction: PortDirection.BOTTOM,
      },
    },
  };
}

export default function (context: FlowChartContext, nodeAttrs: INodeAttrs) {
  const node: INode = buildNodeFromAttrs(nodeAttrs);

  const mutations = [{
    type: 'addNode',
    node,
  }];

  context.dispatch('historyPushEntry', mutations);
}
