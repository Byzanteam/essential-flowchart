import { createStore } from '../../../helper';

describe('deleteSelected', () => {
  it('delete node', () => {
    const node = {
      id: 'node1',
    };

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [node],
        selected: {
          type: 'node',
          id: node.id,
        },
      },
    });

    store.dispatch('deleteSelected');

    expect(store.state.graph.nodes[node.id]).toBeUndefined();
  });

  it('delete link', () => {
    const nodes = [
      {
        id: 'node1',
      },
      {
        id: 'node2',
      },
    ];

    const links = [
      {
        id: 'link1',
        from: {
          nodeId: 'node1',
          portId: '1',
        },
        to: {
          nodeId: 'node2',
          portId: '1',
        },
      },
    ];

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: nodes,
        graphLinkAttrs: links,
        selected: {
          type: 'link',
          id: 'link1',
        },
      },
    });

    const removeLinkId = 'link1';

    store.dispatch('deleteSelected');

    expect(store.state.graph.links[removeLinkId]).toBeUndefined();
  });
});
