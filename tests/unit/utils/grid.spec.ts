import { PortDirection } from '@/types';
import { buildEmptyGrid, markNodeWalkable } from '@/utils/grid';
import { buildConfig } from '@/utils/config';

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

    markNodeWalkable(grid.pfGrid, grid.offset, node, false, buildConfig({}));

    // @ts-ignore
    const hasWall = grid.pfGrid.nodes.some(row => row.some(item => (typeof item.walkable === 'boolean'
      ? false
      : item.walkable > 0)));
    expect(hasWall).toEqual(true);

    markNodeWalkable(grid.pfGrid, grid.offset, node, true, buildConfig({}));

    // @ts-ignore
    grid.pfGrid.nodes.forEach(row => {
      // @ts-ignore
      row.forEach(item => {
        if (typeof item.walkable === 'boolean') {
          expect(item.walkable).toEqual(true);
        } else {
          expect(item.walkable).toEqual(0);
        }
      });
    });
  });
});
