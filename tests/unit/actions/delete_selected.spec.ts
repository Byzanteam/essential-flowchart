import { deleteSelected } from '@/store/actions';
import { INode, ILink } from '@/types';
import { createStore } from '../helper';

describe('deleteSelected', () => {
  it('delete node', () => {
    const node: INode = {
      id: 'node1',
      x: 200,
      y: 100,
      width: 100,
      height: 100,
      ports: [],
    };

    const store = createStore({
      state: {
        // @ts-ignore
        graph: {
          nodes: {
            [node.id]: node,
          },
          links: {},
        },
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
    const nodes: { [id: string]: INode } = {
      node1: {
        id: 'node1',
        x: 200,
        y: 100,
        width: 100,
        height: 100,
        ports: [],
      },
      node2: {
        id: 'node2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        ports: [],
      },
    };

    const links: { [id: string]: ILink } = {
      link1: {
        id: 'link1',
        from: {
          nodeId: 'node1',
        },
        to: {
          nodeId: 'node2',
        },
      },
    };

    const store = createStore({
      state: {
        // @ts-ignore
        graph: {
          nodes,
          links,
        },
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

    expect(store.state.graph.links[removeLinkId]).toBeUndefined;
  });
});
