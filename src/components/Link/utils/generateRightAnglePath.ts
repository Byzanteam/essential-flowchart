import { IPosition, Point2D, IVector } from '@/types';

/**
 * Start      F          A
 * ----------------------
 * |                    |
 * |E                   |D
 * |                    |
 * ---------------------- End
 * B          C
 *
 * A: A.x = End.x, A.y = Start.y
 * B: B.x = Start.x, B.y = End.y
 * C: midpoint of B and End
 * D: midpoint of A and End
 * E: midpoint of B and Start
 * F: midpoint of A and Start
 *
 * when a path from Start to End,
 * so that next point can be A, F(FC), E(ED), B.
 * but if start with a direction(originalStart -> Start),
 * and the direction is reverse to Start -> A,
 * so that next point can not be A, F(FC)。
 * and same on End side
 */

// convert two point to a vector
export const Vector = (p1: IPosition, p2: IPosition): IVector => [p2.x - p1.x, p2.y - p1.y];
// get vector magnitude(length)
const VectorMagnitude = (vector: IVector): number => Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));
// is vector1 and vector2 parallel
const isParallel = (v1: IVector, v2: IVector): boolean => v1[0] * v2[1] === v1[1] * v2[0];
// is vector1 and vector2 with reverse direction
export const isReverseDirection = (v1: IVector, v2: IVector): boolean => isParallel(v1, v2)
    && VectorMagnitude(v1) > 0
    && VectorMagnitude(v2) > 0
    && v1[0] * v2[0] + v1[1] * v2[1] < 0;

export default function generateRightAnglePath (
  start: IPosition,
  end: IPosition,
  originalStart: IPosition,
  originalEnd: IPosition,
): Point2D[] {
  const { x: sx, y: sy } = start,
        { x: ex, y: ey } = end,
        PA: IPosition = { x: ex, y: sy },
        PB: IPosition = { x: sx, y: ey },
        PC: IPosition = { x: (sx + ex) / 2, y: ey },
        PD: IPosition = { x: ex, y: (sy + ey) / 2 },
        PE: IPosition = { x: sx, y: (sy + ey) / 2 },
        PF: IPosition = { x: (sx + ex) / 2, y: sy },
        // PF and PC can not stand alone
        PFC: [IPosition, IPosition] = [PF, PC],
        // PE and PD can not stand alone
        PED: [IPosition, IPosition] = [PE, PD],
        // originalStart -> Start
        vectorS: IVector = Vector(originalStart, start),
        // End -> originalEnd, can be zero vector if end === originalEnd
        vectorE: IVector = Vector(end, originalEnd),
        // vector:  Start -> PB
        S_PB: IVector = Vector(start, PB),
        // vector:  Start -> PA
        S_PA: IVector = Vector(start, PA),
        // PB -> End
        PB_E: IVector = Vector(PB, end),
        // PA -> End
        PA_E: IVector = Vector(PA, end);

  // possible next points after Start
  let allowedPoints = [PA, PB, PFC, PED];

  // limit by start point and start direction
  if (isReverseDirection(S_PA, vectorS)) {
    allowedPoints = [PB, PED];
  } else if (isReverseDirection(S_PB, vectorS)) {
    allowedPoints = [PA, PFC];
  }

  // limit about end point and end direction
  if (isReverseDirection(PA_E, vectorE)) {
    allowedPoints = allowedPoints.filter(point => [PB, PFC].includes(point));
  } else if (isReverseDirection(PB_E, vectorE)) {
    allowedPoints = allowedPoints.filter(point => [PA, PED].includes(point));
  }
  // if next point has multiple choices, choose the first choice
  // TODO: Optimization choose strategy
  const path: IPosition | [IPosition, IPosition] = allowedPoints[0];
  const pathPoints: Point2D[] = Array.isArray(path)
    ? path.map(position => [position.x, position.y])
    : [[path.x, path.y]];
  return [
    [sx, sy],
    ...pathPoints,
    [ex, ey],
  ];
}
