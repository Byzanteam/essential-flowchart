import { IState, INode, INodeAttrs } from '@/types';
import { ActionContext } from 'vuex';

export function addNode (context: ActionContext<IState, IState>, nodeAttrs: INodeAttrs) {
  const [x, y, width, height] = nodeAttrs.rect;

  const node: INode = {
    id: nodeAttrs.id,

    x,
    y,
    width,
    height,

    ports: [],
  };

  context.commit('addNode', node);
}

export default {
  addNode,
};
