import { PortDirection } from '@/types';
import { pathFinder } from '@/utils/grid';
import { SCALE_FACTOR } from '@/utils/config';
import { createStore } from '../../../helper';

describe('addNode', () => {
  it('basic', () => {
    const store = createStore({});

    const node = {
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {
        1: {
          id: '1',
          direction: 'top',
        },
      },
    };

    store.dispatch('addNode', node);

    expect(store.state.graph.nodes['1']).toEqual({
      id: '1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      ports: {
        1: {
          id: '1',
          direction: 'top',
          position: {
            x: 150,
            y: 100,
          },
        },
      },
    });
  });

  it('add a new node to the grid matrix supporting multiple ports', () => {
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
        },
        2: {
          id: '2',
          direction: PortDirection.TOP,
        },
        3: {
          id: '3',
          direction: PortDirection.RIGHT,
        },
        4: {
          id: '4',
          direction: PortDirection.RIGHT,
        },
        5: {
          id: '5',
          direction: PortDirection.BOTTOM,
        },
        6: {
          id: '6',
          direction: PortDirection.BOTTOM,
        },
        7: {
          id: '7',
          direction: PortDirection.BOTTOM,
        },
        8: {
          id: '8',
          direction: PortDirection.LEFT,
        },
        9: {
          id: '9',
          direction: PortDirection.LEFT,
        },
      },
    };

    store.dispatch('addNode', node);

    const { pfGrid } = store.state.graph.grid;

    const walkableNodes = [
      // top
      [143, 100],
      [155, 100],
      // right
      [200, 113],
      [200, 125],
      // bottom
      [137, 140],
      [149, 140],
      [161, 140],
      // left
      [100, 113],
      [100, 125],
    ];

    walkableNodes.forEach(([x, y]) => {
      // TODO: scale_factor
      expect(pfGrid.isWalkableAt(Math.ceil(x / SCALE_FACTOR), Math.ceil(y / SCALE_FACTOR))).toEqual(true);
      expect(pathFinder.findPath(
        0,
        0,
        Math.ceil(x / SCALE_FACTOR),
        Math.ceil(y / SCALE_FACTOR),
        pfGrid.clone(),
      ).length > 0).toEqual(true);
    });

    expect(pathFinder.findPath(
      0,
      0,
      Math.ceil(150 / SCALE_FACTOR),
      Math.ceil(120 / SCALE_FACTOR),
      pfGrid.clone(),
    ).length === 0).toEqual(true);
  });
});
