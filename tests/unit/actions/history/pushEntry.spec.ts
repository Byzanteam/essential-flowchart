import { createStore } from '../../helper';

describe('push', () => {
  it('commit mutations and record it', () => {
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
    ];

    store.dispatch('historyPushEntry', mutations);

    expect(Object.keys(store.state.graph.nodes).length).toEqual(1);

    expect(store.state.history.currentVersion).toEqual(1);
    const [{ mutations: [addNodeMutation] }] = store.state.history.entries;
    expect(addNodeMutation.type).toEqual('addNode');
  });

  it('multiple mutations', () => {
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

    expect(Object.keys(store.state.graph.nodes).length).toEqual(2);

    expect(store.state.history.currentVersion).toEqual(1);
    const [{ mutations: recordedMutations }] = store.state.history.entries;
    expect(recordedMutations.map(mutation => mutation.node.id)).toEqual(['1', '2']);
  });
});
