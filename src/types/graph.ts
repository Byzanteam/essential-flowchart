import { Id, IPosition, IOffset } from './generics';

export interface ICanvasContext {
  offsetX: number;
  offsetY: number;
}

export enum PortDirection {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export type Point = [number, number];

export interface INodePortInput {
  direction: PortDirection;
}

export type INodePort = INodePortInput & {
  position: IPosition;
}

// A node of a graph
interface IBasicNode {
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
  from: ILinkPort;
  to: Partial<ILinkPort>;
}

export interface IDraftLink extends ILink {
  mousePosition?: IPosition;
}

export interface IGraph {
  offset: IOffset;

  nodes: {
    [id: string]: INode;
  };
  links: {
    [id: string]: ILink;
  };

  scale: number;
}

export type IVector = [number, number]
