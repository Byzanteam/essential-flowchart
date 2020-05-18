import { createStore } from '../helper';

describe.skip('dragNodeStop', () => {
  it('basic', () => {
    const node = {
      id: 'node1',
    };

    const moveTo = [500, 300];

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [node],
      },
    });

    store.dispatch('dragNodeStop', { id: node.id, position: moveTo });

    const { x, y } = store.state.graph.nodes[node.id];

    expect(x).toEqual(moveTo[0]);
    expect(y).toEqual(moveTo[1]);
  });
});
