import { createStore } from '../helper';

describe('removeNode', () => {
  it('basic', () => {
    const nodeAttr = {
      id: 'node1',
    };

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [nodeAttr],
      },
    });

    store.dispatch('removeNode', nodeAttr.id);

    expect(store.state.graph.nodes[nodeAttr.id]).toBeUndefined();
  });

  it('remove connected links with the node', () => {
    const nodeIds = ['node1', 'node2'];

    const linkAttrs = [
      {
        id: 'link1',
        from: {
          nodeId: 'node1',
        },
        to: {
          nodeId: 'node2',
        },
      },
    ];

    const store = createStore({
      stateAttrs: {
        graphNodeIds: nodeIds,
        graphLinkAttrs: linkAttrs,
      },
    });

    const removeId = 'node1';

    store.dispatch('removeNode', removeId);

    expect(store.state.graph.nodes[removeId]).toBeUndefined();
    expect(store.state.graph.links).toEqual({});
  });
});
