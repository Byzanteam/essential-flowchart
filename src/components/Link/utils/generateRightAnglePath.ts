import { IPosition, Point2D, IVector } from '@/types';

/** ************************************
 * Start higher than End
 * Start      F          A
 * ----------------------
 * |                    |
 * |E                   |D
 * |                    |
 * ---------------------- End
 * B          C
 ******************************
 * A          F          Start
 * ----------------------
 * |                    |
 * |D                   |E
 * |                    |
 * ---------------------- B
 * End        C
 *
 **************************************
 * Start lower than End
 * B          C          End
 * ----------------------
 * |                    |
 * |E                   |D
 * |                    |
 * ---------------------- A
 * Start      F
 *
 **************************************
 *
 * End        C          B
 * ----------------------
 * |                    |
 * |D                   |E
 * |                    |
 * ---------------------- Start
 * A          F
 *
 **************************************
 * vectorS: OStrat -> Start
 * vectorE: End -> OEnd
 *
 *    1        2              3
 *  Start    OStart    OStart - Start
 *    |        |
 *  OStart   Start     Start - OStart
 *                            4
 **************************************
 */

const VectorModulus = (vector: IVector): number => Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));

const Vector = (p1: IPosition, p2: IPosition): IVector => [p2.x - p1.x, p2.y - p1.y];

// 判断向量是否平行，0向量与任意向量平行
const isParallel = (v1: IVector, v2: IVector): boolean => v1[0] * v2[1] === v1[1] * v2[0];

// 判断向量是否异向, 0向量与任意向量都不异向
const isReverseDirection = (v1: IVector, v2: IVector): boolean => isParallel(v1, v2)
    && VectorModulus(v1) > 0
    && VectorModulus(v2) > 0
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
        // PF, PC 不可能单独存在
        PFC: [IPosition, IPosition] = [PF, PC],
        // PE, PD 不能单独存在
        PED: [IPosition, IPosition] = [PE, PD],
        vectorS: IVector = Vector(originalStart, start),
        vectorE: IVector = Vector(end, originalEnd),
        // vector:  Start -> PB
        S_PB: IVector = Vector(start, PB),
        // vector:  Start -> PA
        S_PA: IVector = Vector(start, PA),
        PB_E: IVector = Vector(PB, end),
        PA_E: IVector = Vector(PA, end);
  let allowedPoints = [PA, PB, PFC, PED];
  // 开始点的限制
  if (isReverseDirection(S_PA, vectorS)) {
    allowedPoints = [PB, PED];
  } else if (isReverseDirection(S_PB, vectorS)) {
    allowedPoints = [PA, PFC];
  }

  // 结束点的限制
  if (isReverseDirection(PA_E, vectorE)) {
    allowedPoints = allowedPoints.filter(point => [PB, PFC].includes(point));
  } else if (isReverseDirection(PB_E, vectorE)) {
    allowedPoints = allowedPoints.filter(point => [PA, PED].includes(point));
  }
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
