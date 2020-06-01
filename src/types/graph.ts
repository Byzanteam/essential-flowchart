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

export enum LinkType {
  New,
  Created,
}

// A link of a graph
export interface ILinkInput {
  id: Id;
  from: ILinkPort;
  to: ILinkPort;
}
export interface ILink {
  id: Id;
  type: LinkType;
  from: ILinkPort;
  to: ILinkPort;
}
export interface INewLink {
  id: Id;
  type: LinkType.New;
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
    [id: string]: INewLink | ILink;
  };

  grid: IGrid;
  scale?: number;
}
