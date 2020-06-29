import {
  Id, FlowchartStore, IGraph, IOffset, IRect, IGrid, PortDirection, INodePort,
} from '@/types';
import { GRID_PADDING, DEFAULT_GIRD_WIDTH, DEFAULT_GRID_HEIGHT } from '@/utils/constants';
import { buildEmptyGrid } from './grid';

type Port = {
  id: Id;
  direction: PortDirection;
}

function groupBy<T> (collection: Array<T>, criteria: (item: T) => string): Record<string, T[]> {
  return collection.reduce((obj, item) => {
    const key = criteria(item);

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = [item];
    } else {
      obj[key].push(item);
    }

    return obj;
  }, {} as Record<string, T[]>);
}

function nextDots (start: number, length: number, portGap: number): number[] {
  let current = Math.ceil(start);
  const dots = [];

  for (let i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + portGap;
  }

  return dots;
}

export function calcPortPosition (ports: Port[], nodeRect: IRect, portGap: number): {
  [id: string]: INodePort;
} {
  const {
    x, y, width, height,
  } = nodeRect;

  const groupedPorts = groupBy(ports, port => port.direction);

  // eslint-disable-next-line no-shadow
  return Object.entries(groupedPorts).reduce((acc, [direction, ports]) => {
    const { length } = ports;
    const portsLength = 3 * length + portGap * (length - 1);
    let dots: number[];

    // eslint-disable-next-line default-case
    switch (direction) {
      case PortDirection.TOP:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y } };
        });
        break;

      case PortDirection.RIGHT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: x + width, y: dots[index] } };
        });
        break;

      case PortDirection.BOTTOM:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y: y + height } };
        });
        break;

      case PortDirection.LEFT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x, y: dots[index] } };
        });
        break;
    }

    return acc;
  }, {} as Record<string, INodePort>);
}

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
    x: Math.min(minX, 0),
    y: Math.min(minY, 0),
    width: minX > 0 ? maxX : maxX - minX,
    height: minY > 0 ? maxY : maxY - minY,
  };
}

function getGridOffset (gridRect: IRect): IOffset {
  return {
    x: Math.abs(Math.min(gridRect.x - GRID_PADDING, 0)),
    y: Math.abs(Math.min(gridRect.y - GRID_PADDING, 0)),
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
