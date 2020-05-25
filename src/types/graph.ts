import Pathfinding from 'pathfinding';

import { Id, IPosition, IOffset } from './generics';

export enum PortDirection {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export interface INodePort {
  id: Id;
  direction: PortDirection;
  position?: IPosition;
}

// A node of a graph
export interface INode {
  id: Id;

  x: number;
  y: number;
  width: number;
  height: number;
  ports: {
    [portId: string]: INodePort;
  };
}

export interface ILinkPort {
  nodeId: Id;
  portId: Id;
}

// A link of a graph
export interface ILink {
  id: Id;
  from: ILinkPort;
  to: ILinkPort;
}

// grid
export interface IGrid {
  width: number;
  height: number;

  offset: IOffset;
  pfGrid: Pathfinding.Grid;
}

export interface IGraph {
  offset: IOffset;

  nodes: {
    [id: string]: INode;
  };
  links: {
    [id: string]: ILink;
  };

  grid: IGrid;
  scale?: number;
}
