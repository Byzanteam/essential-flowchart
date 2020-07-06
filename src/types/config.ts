import { IOffset, IPosition } from './generics';
import { INode, INodePort } from './graph';

export interface IGetters {
  getNodePosition: (node: any) => IPosition;
  getNodeSize: (node: any) => { height: number; width: number };
  getNodePorts: (node: any) => Record<string, INodePort>;
  getNode: (nodes: any, nodeId: string) => any;
  getStartPortOfLink: (nodes: any, link: any) => INodePort;
  getEndPortOfLink: (nodes: any, link: any) => INodePort | { position: IPosition };
}

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
