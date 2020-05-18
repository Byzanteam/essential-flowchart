import { createStore } from '../../helper';

describe('undo', () => {
  it('undo mutation and update currentVersion', () => {
    const store = createStore({});

    const mutations = [
      {
        type: 'addNode',
        node: {
          id: '1',
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          ports: [],
        },
      },
      {
        type: 'addNode',
        node: {
          id: '2',
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          ports: [],
        },
      },
    ];

    store.dispatch('historyPushEntry', mutations);

    expect(store.state.history.currentVersion).toEqual(1);
    expect(Object.keys(store.state.graph.nodes).length).toEqual(2);

    store.dispatch('historyUndo');

    expect(store.state.history.currentVersion).toEqual(0);
    expect(Object.keys(store.state.graph.nodes).length).toEqual(0);

    // reach the oldest
    store.dispatch('historyUndo');
  });
});
