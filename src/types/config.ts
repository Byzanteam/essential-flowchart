import { IOffset } from './generics';

export interface IConfig {
  nodePadding: number;
  portGap: number;
  minZoom: number;
  maxZoom: number;
  readonly: boolean;
  offset: IOffset;
  scale: number;
}

export type IConfigInput = Partial<IConfig>;
