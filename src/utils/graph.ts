import { FlowchartStore, IGraph, IOffset } from '@/types';
import { buildEmptyGrid } from './grid';

const GRID_GAP = 100;
const DEFAULT_GIRD_WIDTH = 2000;
const DEFAULT_GRID_HEIGHT = 2000;

// 获取 grid 的最小尺寸
function getGridRect (graph: IGraph) {
  const { nodes } = graph;

  let minX = 0; // 节点的最小 x
  let maxX = DEFAULT_GIRD_WIDTH;
  let minY = 0; // 节点的最小 y
  let maxY = DEFAULT_GRID_HEIGHT;

  Object.values(nodes).forEach(node => {
    const { x, y } = node;

    // calc grid rect
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);

    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  return {
    left: Math.min(minX, 0),
    top: Math.min(minY, 0),
    right: maxX,
    bottom: maxY,
    width: minX > 0 ? maxX : maxX - minX,
    height: minY > 0 ? maxY : maxY - minY,
  };
}

// eslint-disable-next-line import/prefer-default-export
export function buildGraph (graph: IGraph, store: FlowchartStore) {
  const rect = getGridRect(graph);
  const gridOffset: IOffset = {
    x: Math.abs(Math.min(rect.left - GRID_GAP, 0)),
    y: Math.abs(Math.min(rect.top - GRID_GAP, 0)),
  };

  const grid = buildEmptyGrid(
    rect.width,
    rect.height,
    gridOffset,
  );

  store.commit({
    type: 'updateGrid',
    grid,
  });

  const {
    nodes, links, scale, offset,
  } = graph;

  store.commit({
    type: 'updateScale',
    scale,
  });

  store.commit({
    type: 'updateOffset',
    offset,
  });

  Object.values(nodes).forEach(node => {
    store.commit('addNode', {
      node: { ...node },
    });
  });

  Object.values(links).forEach(link => {
    store.commit('addLink', {
      link: { ...link },
    });
  });
}
