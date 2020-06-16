import { PortDirection } from '@/types';
import CustomGrid from '@/utils/customGrid';
import { markNodeWalkable } from '@/utils/grid';
import { buildConfig } from '@/utils/config';

describe('CustomGrid', () => {
  let grid: CustomGrid;
  const testNode = {
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

  beforeEach(() => {
    grid = new CustomGrid(200, 200);
  });

  it('all nodes walkable should be boolean true after init', () => {
    const allWalkableBeTrue = grid.nodes.every(row => row.every(item => (typeof item.walkable === 'boolean') && item.walkable));
    expect(allWalkableBeTrue).toEqual(true);
  });

  it('getWallHeight should return 0 if walkable is true or 0', () => {
    grid.setWalkableAt(1, 1, true);
    markNodeWalkable(grid, { x: 0, y: 0 }, testNode, false, buildConfig({}));
    grid.nodes.forEach((row, ri) => {
      row.forEach((node, rj) => {
        // @ts-ignore
        if (node.walkable === true || node.walkable === 0) {
          expect(grid.getWallHeight(rj, ri)).toEqual(0);
        } else {
          expect(typeof grid.getWallHeight(rj, ri) === 'number').toEqual(true);
          expect(grid.getWallHeight(rj, ri) > 0).toEqual(true);
        }
      });
    });
  });

  it('setWalkableAt update node.walkable to number', () => {
    const node = grid.nodes[0][0];
    expect(typeof node.walkable).toEqual('boolean');
    grid.setWalkableAt(0, 0, true);
    expect(typeof node.walkable).toEqual('number');
    grid.setWalkableAt(0, 0, false);
    expect(typeof node.walkable).toEqual('number');
  });

  it('setWalkableAt to false increase node.walkable or true to decrease', () => {
    const node = grid.nodes[0][0];
    grid.setWalkableAt(0, 0, true);
    expect(node.walkable).toEqual(0);
    grid.setWalkableAt(0, 0, true);
    expect(node.walkable).toEqual(0);
    grid.setWalkableAt(0, 0, false);
    expect(node.walkable).toEqual(1);
    grid.setWalkableAt(0, 0, false);
    expect(node.walkable).toEqual(2);
    grid.setWalkableAt(0, 0, true);
    expect(node.walkable).toEqual(1);
    grid.setWalkableAt(0, 0, true);
    expect(node.walkable).toEqual(0);
  });

  it('isWalkableAt should return true if node.walkable is true or 0', () => {
    expect(grid.isWalkableAt(0, 0)).toEqual(true);
    grid.setWalkableAt(0, 0, true);
    expect(grid.isWalkableAt(0, 0)).toEqual(true);
    grid.setWalkableAt(0, 0, false);
    expect(grid.isWalkableAt(0, 0)).toEqual(false);
    grid.setWalkableAt(0, 0, false);
    expect(grid.isWalkableAt(0, 0)).toEqual(false);
    grid.setWalkableAt(0, 0, true);
    expect(grid.isWalkableAt(0, 0)).toEqual(false);
    grid.setWalkableAt(0, 0, true);
    expect(grid.isWalkableAt(0, 0)).toEqual(true);
  });
});
