import { createStore } from '../../../helper';

describe('addNode', () => {
  it('basic', () => {
    const store = createStore({});

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {
        1: {
          id: '1',
          direction: 'top',
        },
      },
    };

    store.dispatch('addNode', node);

    expect(store.state.graph.nodes['1']).toEqual({
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {
        1: {
          id: '1',
          direction: 'top',
        },
      },
    });
  });
});
