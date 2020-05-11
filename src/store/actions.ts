// eslint-disable-next-line import/no-cycle
import { IState } from '@/store';
import { IPosition } from '@/types/generics';
import { INode } from '@/types/graph';
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
