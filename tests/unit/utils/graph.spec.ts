import { PortDirection } from '@/types';
import { buildState } from '@/utils/graph';

import { createStore } from '../helper';

describe('buildState', () => {
  it('works', () => {
    const store = createStore({});

    buildState({
      nodes: [
        {
          id: '1',
          rect: [20, 20, 100, 50],
        },
        {
          id: '2',
          rect: [20, 20, 200, 100],
        },
      ],
      links: [
        {
          id: '1',
          from: {
            nodeId: '1',
            direction: 'bottom' as PortDirection,
          },
          to: {
            nodeId: '2',
            direction: 'top' as PortDirection,
          },
        },
        {
          id: '2',
          from: {
            nodeId: '1',
            direction: 'right' as PortDirection,
          },
          to: {
            nodeId: '2',
            direction: 'top' as PortDirection,
          },
        },
      ],
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
