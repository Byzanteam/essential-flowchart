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
      position: { x: 100, y: 100 },
      dimension: { width: 200, height: 200 },
    };

    store.dispatch('addNode', node);

    expect(store.state.graph.nodes['1']).toEqual(node);
  });
});
