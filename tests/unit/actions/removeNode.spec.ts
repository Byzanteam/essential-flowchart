import { removeNode } from '@/store/actions';
import { INode, ILink } from '@/types';
import { createStore } from '../helper';

describe('moveNode', () => {
  it('basic', () => {
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
        history: [],
        graph: {
          nodes: {
            [node.id]: node,
          },
        } as any,
      },
      actions: {
        removeNode,
      },
    });

    store.dispatch('removeNode', node.id);

    expect(store.state.graph.nodes[node.id]).toBeUndefined();
  });

  it('remove connected links with the node ', () => {
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
        history: [],
        graph: {
          nodes,
          links,
        } as any,
      },
      actions: {
        removeNode,
      },
    });

    const removeId = 'node1';

    store.dispatch('removeNode', removeId);

    expect(store.state.graph.nodes[removeId]).toBeUndefined();
    expect(store.state.graph.links).toEqual({});
  });
});
