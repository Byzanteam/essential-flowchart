import { PortDirection } from '@/types';
import { createStore } from '../../../helper';

describe('addNode', () => {
  it('add a new node to the graph', () => {
    const store = createStore({});

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {},
    };

    store.commit('addNode', { node });

    expect(store.state.graph.nodes['1']).toEqual({
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {},
    });
  });

  it('add a new node to the grid matrix', () => {
    const store = createStore({
      stateAttrs: {
        gridDimension: [500, 500],
      },
    });

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 40,
      ports: {
        1: {
          id: '1',
          direction: PortDirection.TOP,
          position: {
            x: 150,
            y: 100,
          },
        },
        2: {
          id: '2',
          direction: PortDirection.RIGHT,
          position: {
            x: 200,
            y: 120,
          },
        },
        3: {
          id: '3',
          direction: PortDirection.BOTTOM,
          position: {
            x: 150,
            y: 140,
          },
        },
        4: {
          id: '4',
          direction: PortDirection.LEFT,
          position: {
            x: 100,
            y: 120,
          },
        },
      },
    };

    store.commit('addNode', { node });

    const { pfGrid } = store.state.graph.grid;

    const blockedNodes = [
      [100, 100],
    ];

    blockedNodes.forEach(([x, y]) => {
      // TODO: scale_factor
      expect(pfGrid.isWalkableAt(x / 5, y / 5)).toEqual(false);
    });

    const walkableNodes = [
      // top
      [150, 100],
      [150, 90],
      // right
      [200, 120],
      [210, 120],
      // bottom
      [150, 140],
      [150, 150],
      // left
      [100, 120],
      [90, 120],
    ];

    walkableNodes.forEach(([x, y]) => {
      // TODO: scale_factor
      expect(pfGrid.isWalkableAt(x / 5, y / 5)).toEqual(true);
    });
  });
});
