import {
  IState, INode, INodeAttrs, IPosition,
} from '@/types';
import { ActionContext } from 'vuex';

type ctx = ActionContext<IState, IState>;

export function addNode ({ commit }: ctx, nodeAttrs: INodeAttrs) {
  const [x, y, width, height] = nodeAttrs.rect;

  const node: INode = {
    id: nodeAttrs.id,

    x,
    y,
    width,
    height,

    ports: [],
  };

  commit('addNode', node);
}

export function removeNode ({ commit }: ctx, id: string) {
  commit('removeNode', id);
}

export function dragNodeStop ({ commit }: ctx, { id, position }: { id: string; position: IPosition }) {
  commit('dragNodeStop', { nodeId: id, position });
}

export default {
  addNode,
  removeNode,
  dragNodeStop,
};
