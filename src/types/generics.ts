export type Id = string;

export interface IPosition {
  x: number;
  y: number;
}

export interface IOffset {
  x: number;
  y: number;
}

export type Point2D = [number, number];

export interface IRect {
  left: number;
  top: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}
