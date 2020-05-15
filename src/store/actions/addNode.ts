import { FlowChartContext, INode, INodeAttrs } from '@/types';

export default function (context: FlowChartContext, nodeAttrs: INodeAttrs) {
  const [x, y, width, height] = nodeAttrs.rect;

  const node: INode = {
    id: nodeAttrs.id,

    x,
    y,
    width,
    height,

    ports: [],
  };

  context.commit({
    type: 'addNode',
    node,
  });
}
