import Pathfinding from 'pathfinding';

import { ID, Offset, IPosition } from './generics';

type x = number;
type y = number;
type width = number;
type height = number;

// node
export type NodeRect = [x, y, width, height];

/**
 * Represents the attributes of a node.
*/
export interface INodeAttrs {
  id: ID;
  rect: NodeRect;
}

export interface INode {
  id: ID;

  x: x;
  y: y;
  width: width;
  height: height;
  ports: {
    [direction: string]: INodePort;
  };
}

// port
export enum PortDirection {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

interface IPortAttrs {
  nodeId: ID;
  direction: PortDirection;
}

export interface INodePort {
  // nodeId: ID;
  direction: PortDirection;
  position?: IPosition;
}

// link
export interface ILinkAttrs {
  id: ID;
  from: IPortAttrs;
  to: IPortAttrs;
}

export interface ILink {
  id: ID;
  from: {
    nodeId: ID;
    direction: PortDirection;
  };
  to: {
    nodeId: ID;
    direction: PortDirection;
  };
}

// grid
export interface IGrid {
  width: width;
  height: height;

  pfGrid: Pathfinding.Grid;
}

export interface IGraph {
  offset: Offset;

  nodes: {
    [id: string]: INode;
  };
  links: {
    [id: string]: ILink;
  };

  grid: IGrid;
  scale?: number;
}
