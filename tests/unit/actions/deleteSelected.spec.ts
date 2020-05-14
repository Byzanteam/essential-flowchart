import { deleteSelected } from '@/store/actions';
import { createStore } from '../helper';

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
      actions: {
        deleteSelected,
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
        },
        to: {
          nodeId: 'node2',
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
      actions: {
        deleteSelected,
      },
    });

    const removeLinkId = 'link1';

    store.dispatch('deleteSelected');

    expect(store.state.graph.links[removeLinkId]).toBeUndefined();
  });
});
