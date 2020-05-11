import { addNode } from '@/store/actions';
import { createStore } from '../helper';

describe('actions', () => {
  it('addNode', () => {
    const store = createStore({
      state: {
        history: [],
        graph: {
          nodes: {},
        } as any,
      },
      actions: {
        addNode,
      },
    });

    const node = {
      id: '1',
      rect: [100, 100, 100, 100],
    };

    store.dispatch('addNode', node);

    expect(store.state.graph.nodes['1']).toEqual({
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: [],
    });
  });
});
