// @ts-nocheck
import { PortDirection } from '@/types';
import { buildGraph } from '@/utils/graph';

import { createStore } from '../../helper';

describe('buildState', () => {
  it('works', () => {
    const store = createStore({});

    buildGraph({
      nodes: {
        1: {
          id: '1',
          x: 20,
          y: 20,
          width: 100,
          height: 50,
          ports: {
            1: {
              id: '1',
              direction: PortDirection.BOTTOM,
            },
            2: {
              id: '2',
              direction: PortDirection.RIGHT,
            },
          },
        },
        2: {
          id: '2',
          x: 20,
          y: 20,
          width: 200,
          height: 100,
          ports: {
            1: {
              id: '1',
              direction: PortDirection.TOP,
            },
            2: {
              id: '2',
              direction: PortDirection.RIGHT,
            },
          },
        },
      },
      links: {
        1: {
          id: '1',
          from: {
            nodeId: '1',
            portId: '1',
          },
          to: {
            nodeId: '2',
            portId: '1',
          },
        },
        2: {
          id: '2',
          from: {
            nodeId: '1',
            portId: '2',
          },
          to: {
            nodeId: '2',
            portId: '2',
          },
        },
      },
    }, store);

    expect(store.state.history.currentVersion).toEqual(0);

    expect(Object.values(store.state.graph.nodes).length).toEqual(2);
    expect(Object.values(store.state.graph.links).length).toEqual(2);

    expect(store.state.graph.nodes['1'].x).toEqual(20);
    expect(store.state.graph.nodes['1'].y).toEqual(20);

    expect(store.state.graph.links['1'].from.nodeId).toEqual('1');
    expect(store.state.graph.links['1'].to.nodeId).toEqual('2');
  });
});
