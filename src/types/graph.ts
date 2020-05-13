import Pathfinding from 'pathfinding';

import { ID, Offset } from './generics';

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

  ports: INodePort[];
}

// port
enum PortDirection {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

interface IPortAttrs {
  nodeId: ID;
  direction: PortDirection;
}

interface INodePort {
  id: ID;
  node: INode;
  direction: PortDirection;
}

// link
interface ILinkAttrs {
  from: IPortAttrs;
  to: IPortAttrs;
}

export interface ILink {
  id: string;
  from: {
    nodeId: string;
  };
  to: {
    nodeId: string;
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
  links: ILink[];

  grid: IGrid;
  scale?: number;
}
