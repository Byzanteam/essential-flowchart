import {
  IState, INode, INodeAttrs, PortDirection,
} from '@/types';
import { ActionContext } from 'vuex';

export default function (context: ActionContext<IState, IState>, nodeAttrs: INodeAttrs) {
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

  context.commit('addNode', node);
}
