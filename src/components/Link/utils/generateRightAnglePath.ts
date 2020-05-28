import { IPosition, Point2D } from '@/types';

export default function generateRightAnglePath (
  startPos: IPosition,
  endPos: IPosition,
): Point2D[] {
  const width = Math.abs(startPos.x - endPos.x);
  const height = Math.abs(startPos.y - endPos.y);
  const leftToRight = startPos.x < endPos.x;
  const topToBottom = startPos.y < endPos.y;
  const isHorizontal = width > height;

  let start: IPosition;
  let end: IPosition;

  if (isHorizontal) {
    start = leftToRight ? startPos : endPos;
    end = leftToRight ? endPos : startPos;
  } else {
    start = topToBottom ? startPos : endPos;
    end = topToBottom ? endPos : startPos;
  }

  const vertex: Point2D = isHorizontal ? [start.x, end.y] : [end.x, start.y];

  return [
    [start.x, start.y],
    vertex,
    [end.x, end.y],
  ];
}
