import {
  FlowchartStore, IGraph, IOffset, IRect, IGrid,
} from '@/types';
import { GRID_PADDING, DEFAULT_GIRD_WIDTH, DEFAULT_GRID_HEIGHT } from '@/utils/constants';
import { buildEmptyGrid } from './grid';

function getGridRect (graph: IGraph): IRect {
  const { nodes } = graph;

  let minX = 0; // min x of node
  let maxX = DEFAULT_GIRD_WIDTH; // max x of node
  let minY = 0; // min y of node
  let maxY = DEFAULT_GRID_HEIGHT; // max y of node

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

function getGridOffset (gridRect: IRect): IOffset {
  return {
    x: Math.abs(Math.min(gridRect.left - GRID_PADDING, 0)),
    y: Math.abs(Math.min(gridRect.top - GRID_PADDING, 0)),
  };
}

function setGrid (store: FlowchartStore, grid: IGrid) {
  store.commit({
    type: 'updateGrid',
    grid,
  });
}

function setGraph (store: FlowchartStore, graph: IGraph) {
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

// eslint-disable-next-line import/prefer-default-export
export function buildGraph (graph: IGraph, store: FlowchartStore) {
  const rect = getGridRect(graph);
  const gridOffset: IOffset = getGridOffset(rect);

  // add gap to grid size
  const grid = buildEmptyGrid(
    rect.width + 2 * GRID_PADDING,
    rect.height + 2 * GRID_PADDING,
    gridOffset,
  );

  setGrid(store, grid);
  setGraph(store, graph);
}
