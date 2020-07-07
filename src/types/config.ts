import { IOffset, IPosition } from './generics';
import { INode, INodePort, PortDirection } from './graph';


/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IGetters {
  getNodePosition: (node: any) => IPosition;
  getNodeSize: (node: any) => { height: number; width: number };
  getNodePorts: (node: any) => Record<string, any>;
  getNodePort: (node: any, portId: string) => any;
  getPortPosition: (node: any, port: any) => IPosition;
  getPortDirection: (port: any) => PortDirection;
  getNode: (nodes: any, nodeId: string) => any;
  getFromNodeIdOfLink: (link: any) => string;
  getToNodeIdOfLink: (link: any) => string;
  getFromPortIdOfLink: (link: any) => string;
  getToPortIdOfLink: (link: any) => string;
  getDraftPortOfLink: (link: any) => Pick<INodePort, 'position'>;
  isDraftLink: (link: any) => boolean;
  getLinkIdentifier: (link: any) => string;
  getNodeIdentifier: (node: any) => string;
  getPortIdentifier: (port: any) => string;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface INodePositionChangeEvent {
  node: INode;
  position: IPosition;
  prevPosition: IPosition;
}

export interface IMutations {
  // draging
  updateNodePosition: (event: INodePositionChangeEvent) => void;
  // dragend
  setNodePosition: (event: INodePositionChangeEvent) => void;
}

export interface IConfig {
  nodePadding: number;
  minZoom: number;
  maxZoom: number;
  readonly: boolean;
  offset: IOffset;
  scale: number;
  getters: IGetters;
  mutations: IMutations;
}

export interface IConfigInput extends Partial<Omit<IConfig, 'getters' | 'mutations'>> {
  getters?: Partial<IGetters>;
  mutations?: Partial<IMutations>;
}
