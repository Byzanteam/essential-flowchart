import Pathfinding from 'pathfinding';

import { Id, IPosition, IOffset } from './generics';

export enum PortDirection {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export type Point = [number, number];

export interface INodePortInput {
  id: Id;
  direction: PortDirection;
}

export type INodePort = INodePortInput & {
  position: IPosition;
}

// A node of a graph
interface IBasicNode {
  id: Id;

  x: number;
  y: number;
  width: number;
  height: number;
}
export type INode = IBasicNode & {
  ports: {
    [portId: string]: INodePort;
  };
}

export type INodeInput = IBasicNode & {
  ports: {
    [portId: string]: INodePortInput;
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
  to: Partial<ILinkPort>;
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
