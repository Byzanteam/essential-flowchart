import addNode from '@/store/mutations/addNode';
import { createStore } from '../helper';

describe('addNode', () => {
  it('add a new node to the graph', () => {
    const store = createStore({
      stateAttrs: {
        gridDimension: [100, 100],
      },
      mutations: {
        addNode,
      },
    });

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: [],
    };

    addNode(store.state, node);

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
