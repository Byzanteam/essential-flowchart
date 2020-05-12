import { removeNode } from '@/store/actions';
import { INode } from '@/types';
import { createStore } from '../helper';

describe('moveNode', () => {
  it('basic', () => {
    const node: INode = {
      id: 'node1',
      x: 200,
      y: 100,
      width: 100,
      height: 100,
      ports: [],
    };

    const store = createStore({
      state: {
        history: [],
        graph: {
          nodes: {
            [node.id]: node,
          },
        } as any,
      },
      actions: {
        removeNode,
      },
    });

    store.dispatch('removeNode', node.id);

    expect(store.state.graph.nodes[node.id]).toBeUndefined();
  });
});
