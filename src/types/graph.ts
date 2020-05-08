import { IPosition } from './generics';

export interface INode {
  id: string;
  position: IPosition;
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

export interface IGraph {
  offset: IPosition;
  nodes: {
    [id: string]: INode;
  };
  scale?: number;
}
