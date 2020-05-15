// TODO: use uuid
export type ID = string;

type x = number;
type y = number;

export type Position = [x, y];

export interface IPosition {
  x: number;
  y: number;
}

type offsetLeft = number;
type offsetTop = number;

export type Offset = [offsetLeft, offsetTop];
