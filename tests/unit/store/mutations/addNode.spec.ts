import addNode from '@/store/mutations/addNode';
import { createStore } from '../../../helper';

describe('addNode', () => {
  it('add a new node to the graph', () => {
    const store = createStore({
      mutations: {
        addNode,
      },
    });

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {}, // TODO: port
    };

    addNode(store.state, { node });

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
      mutations: {
        addNode,
      },
    });

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 40,
      ports: {}, // TODO: port
    };

    addNode(store.state, { node });

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
