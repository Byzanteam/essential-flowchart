import {
  FlowchartStore, IGraph, IRect, PortDirection, INodePort, INodePortInput,
} from '@/types';
import { groupBy } from '@/utils/shared';

function nextDots (start: number, length: number, portGap: number): number[] {
  let current = Math.ceil(start);
  const dots = [];

  for (let i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + portGap;
  }

  return dots;
}

export function calcPortPosition (ports: INodePortInput[] | INodePort[], nodeRect: IRect, portGap: number): {
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

export function buildGraph (graph: IGraph, store: FlowchartStore) {
  setGraph(store, graph);
}
