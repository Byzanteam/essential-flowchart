import { IState, IPosition, INode } from '@/types';
import { ActionContext } from 'vuex';

export function addNode (context: ActionContext<IState, IState>, { id, position }: { id: string; position: IPosition }) {
  const node: INode = {
    id,
    position,
  };

  context.commit('addNode', node);
}

export default {
  addNode,
};
