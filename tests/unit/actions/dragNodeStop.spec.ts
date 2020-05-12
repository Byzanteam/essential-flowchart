import { dragNodeStop } from '@/store/actions';
import { INode } from '@/types';
import { createStore } from '../helper';

describe('dragNodeStop', () => {
  it('basic', () => {
    const node: INode = {
      id: 'node1',
      x: 200,
      y: 100,
      width: 100,
      height: 100,
      ports: [],
    };

    const moveTo = { x: 500, y: 300 };

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
        dragNodeStop,
      },
    });

    store.dispatch('dragNodeStop', { id: node.id, position: moveTo });

    const { x, y } = store.state.graph.nodes[node.id];

    expect(x).toEqual(moveTo.x);
    expect(y).toEqual(moveTo.y);
  });
});
