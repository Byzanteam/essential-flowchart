import { IPosition, Point2D } from '@/types';

export default function generateRightAnglePath (
  startPos: IPosition,
  endPos: IPosition,
): Point2D[] {
  const width = Math.abs(startPos.x - endPos.x);
  const height = Math.abs(startPos.y - endPos.y);
  const isHorizontal = width > height;

  const vertex: Point2D = isHorizontal ? [endPos.x, startPos.y] : [startPos.x, endPos.y];

  return [
    [startPos.x, startPos.y],
    vertex,
    [endPos.x, endPos.y],
  ];
}
