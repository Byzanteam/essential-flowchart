import fallbackPath, { isReverseDirection, Vector } from '@/components/Link/utils/generateRightAnglePath';
import { Point2D, IPosition } from '@/types/generics';

describe('fallbackPath', () => {
  const start: IPosition = {
    x: 20,
    y: 20,
  };

  const ends: IPosition[] = [
    // 右下角
    { x: 30, y: 30 },
    // 左下角
    { x: 10, y: 30 },
    // 右上角
    { x: 30, y: 10 },
    // 左上角
    { x: 10, y: 10 },
  ];

  const directions = [
    // to left
    [1, 0],
    // to right
    [-1, 0],
    // to bottom
    [0, 1],
    // to top
    [0, -1],
  ];

  const positionToPoint = (position: IPosition): Point2D => [position.x, position.y];

  /**
   * Start      F          A
   * ----------------------
   * |                    |
   * |E                   |D
   * |                    |
   * ---------------------- End
   * B          C
   */
  const getA = (startPos: IPosition, end: IPosition): IPosition => ({
    x: end.x,
    y: startPos.y,
  });
  const getB = (startPos: IPosition, end: IPosition): IPosition => ({
    x: startPos.x,
    y: end.y,
  });
  const getC = (startPos: IPosition, end: IPosition): IPosition => ({
    x: (end.x + startPos.x) / 2,
    y: end.y,
  });
  const getD = (startPos: IPosition, end: IPosition): IPosition => ({
    x: end.x,
    y: (startPos.y + end.y) / 2,
  });
  const getE = (startPos: IPosition, end: IPosition): IPosition => ({
    x: startPos.x,
    y: (startPos.y + end.y) / 2,
  });
  const getF = (startPos: IPosition, end: IPosition): IPosition => ({
    x: (startPos.x + end.x) / 2,
    y: startPos.y,
  });

  // 点与点之间用 ; 隔开，点的x与y用逗号隔开
  const pathToString = (points: Point2D[]): string => points.map((point: Point2D): string => `${point[0]},${point[1]}`).join(';');

  it('works with both start and end has no direction', () => {
    ends.forEach(end => {
      const path = fallbackPath(start, end, start, end);
      expect(pathToString(path)).toEqual(pathToString([
        positionToPoint(start),
        positionToPoint(getA(start, end)),
        positionToPoint(end),
      ]));
    });
  });

  it('works with start has direction and end has no direction', () => {
    ends.forEach(end => {
      directions.forEach(([dx, dy]) => {
        const originalStart: IPosition = { x: start.x - dx, y: start.y - dy },
              pointA = getA(start, end),
              path = fallbackPath(start, end, originalStart, end);
        if (isReverseDirection(Vector(start, pointA), [dx, dy])) {
          expect(pathToString(path)).toEqual(pathToString([
            positionToPoint(start),
            positionToPoint(getB(start, end)),
            positionToPoint(end),
          ]));
        } else {
          expect(pathToString(path)).toEqual(pathToString([
            positionToPoint(start),
            positionToPoint(getA(start, end)),
            positionToPoint(end),
          ]));
        }
      });
    });
  });

  it('works with end has direction and start has no direction', () => {
    ends.forEach(end => {
      directions.forEach(([dx, dy]) => {
        const originalEnd: IPosition = { x: end.x + dx, y: end.y + dy },
              pointA = getA(start, end),
              path = fallbackPath(start, end, start, originalEnd);
        if (isReverseDirection(Vector(pointA, end), [dx, dy])) {
          expect(pathToString(path)).toEqual(pathToString([
            positionToPoint(start),
            positionToPoint(getB(start, end)),
            positionToPoint(end),
          ]));
        } else {
          expect(pathToString(path)).toEqual(pathToString([
            positionToPoint(start),
            positionToPoint(getA(start, end)),
            positionToPoint(end),
          ]));
        }
      });
    });
  });

  it('works with both start and end has direction', () => {
    ends.forEach(end => {
      const pointA = getA(start, end),
            pointB = getB(start, end),
            pointC = getC(start, end),
            pointD = getD(start, end),
            pointE = getE(start, end),
            pointF = getF(start, end);
      // start direction
      directions.forEach(([sdx, sdy]) => {
        const originalStart: IPosition = { x: start.x - sdx, y: start.y - sdy };
        // end direction
        directions.forEach(([edx, edy]) => {
          const originalEnd: IPosition = { x: end.x + edx, y: end.y + edy },
                path = fallbackPath(start, end, originalStart, originalEnd);
          if (isReverseDirection(Vector(start, pointA), [sdx, sdy])) {
            if (isReverseDirection(Vector(pointB, end), [edx, edy])) {
              expect(pathToString(path)).toEqual(pathToString([
                positionToPoint(start),
                positionToPoint(pointE),
                positionToPoint(pointD),
                positionToPoint(end),
              ]));
            } else {
              expect(pathToString(path)).toEqual(pathToString([
                positionToPoint(start),
                positionToPoint(pointB),
                positionToPoint(end),
              ]));
            }
          } else if (isReverseDirection(Vector(start, pointB), [sdx, sdy])) {
            if (isReverseDirection(Vector(pointA, end), [edx, edy])) {
              expect(pathToString(path)).toEqual(pathToString([
                positionToPoint(start),
                positionToPoint(pointF),
                positionToPoint(pointC),
                positionToPoint(end),
              ]));
            } else {
              expect(pathToString(path)).toEqual(pathToString([
                positionToPoint(start),
                positionToPoint(pointA),
                positionToPoint(end),
              ]));
            }
          } else if (isReverseDirection(Vector(pointA, end), [edx, edy])) {
            expect(pathToString(path)).toEqual(pathToString([
              positionToPoint(start),
              positionToPoint(pointB),
              positionToPoint(end),
            ]));
          } else {
            expect(pathToString(path)).toEqual(pathToString([
              positionToPoint(start),
              positionToPoint(pointA),
              positionToPoint(end),
            ]));
          }
        });
      });
    });
  });
});
