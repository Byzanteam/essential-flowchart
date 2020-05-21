import Pathfinding from 'pathfinding';

import { Id, Offset, IPosition } from './generics';

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
  id: Id;
  rect: NodeRect;
}

export interface INode {
  id: Id;

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
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

interface IPortAttrs {
  nodeId: Id;
  direction: PortDirection;
}

export interface INodePort {
  // nodeId: Id; TODO: 需要时添加回来
  direction: PortDirection;
  position?: IPosition;
}

// link
export interface ILinkAttrs {
  id: Id;
  from: IPortAttrs;
  to: IPortAttrs;
}

export interface ILink {
  id: Id;
  from: {
    nodeId: Id;
    direction: PortDirection;
  };
  to: {
    nodeId: Id;
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
