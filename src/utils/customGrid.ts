import * as Pathfinding from 'pathfinding';

interface ICustomGrid extends Pathfinding.Grid {
  nodes: Array<Array<Pathfinding.Node>>;
  getWallHeight(x: number, y: number): number;
}

class CustomGrid extends Pathfinding.Grid implements ICustomGrid {
  nodes: Array<Array<Pathfinding.Node>>

  constructor (width: number, height: number) {
    super(width, height);
    this.nodes = (this as ICustomGrid).nodes;
  }

  getWallHeight (x: number, y: number): number {
    /**
     * node.walkable maybe 0, true or positive-number
     * 0, true will be walkable
     */
    const { walkable } = this.nodes[y][x];
    return typeof walkable === 'boolean' ? 0 : walkable;
  }

  setWalkableAt (x: number, y: number, walkable: boolean) {
    const oldWallHeight = this.getWallHeight(x, y);
    const deltaHeight = walkable ? -1 : 1;
    // @ts-ignore
    this.nodes[y][x].walkable = Math.max(oldWallHeight + deltaHeight, 0);
  }

  isWalkableAt (x: number, y: number) {
    return this.isInside(x, y) && !this.getWallHeight(x, y);
  }

  clone () {
    const { width, height } = this,
          thisNodes = this.nodes,
          newGrid = new CustomGrid(width, height);

    newGrid.nodes = Array.from({ length: height }).map((_i, i) => Array.from({ length: width }).map((_j, j): Pathfinding.Node => ({
      x: j,
      y: i,
      walkable: thisNodes[i][j].walkable,
    })));
    return newGrid;
  }
}
export {
  CustomGrid as default,
  CustomGrid,
};
