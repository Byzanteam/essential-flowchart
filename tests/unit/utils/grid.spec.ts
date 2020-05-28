import { PortDirection } from '@/types';
import { buildEmptyGrid, markNodeWalkable } from '@/utils/grid';

describe('clean walkable', () => {
  it('works', () => {
    const grid = buildEmptyGrid(500, 500);
    const node = {
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
    };

    markNodeWalkable(grid.pfGrid, grid.offset, node, false, {});
    markNodeWalkable(grid.pfGrid, grid.offset, node, true, {});

    // @ts-ignore
    grid.pfGrid.nodes.forEach(row => {
      // @ts-ignore
      row.forEach(item => {
        expect(item.walkable).toEqual(true);
      });
    });
  });
});
