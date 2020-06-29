import PF from 'pathfinding';
import {
  Id, Point, IPosition,
  PortDirection, IConfig,
  INodePort, INode, IRect,
} from '@/types';
import { pathFinder } from '@/utils/grid';
import { SCALE_FACTOR } from '@/utils/constants';

import { checkIntersect } from '@/utils/shared';
import generateRightAnglePath from './generateRightAnglePath';

type NodePort = Pick<INodePort, 'position'> & Partial<Omit<INodePort, 'position'>>;
type Line = [Point, Point];
type Port = {
  id: Id;
  direction: PortDirection;
}

const MATRIX_PADDING = 50;

function tweakPath (path: Point[], startPos: IPosition, endPos: IPosition): Point[] {
  const { x: sx, y: sy } = startPos,
        { x: ex, y: ey } = endPos,
        [first, second] = path.slice(0, 2),
        [lastSecond, last] = path.slice(-2),
        rest = path.length > 4 ? path.slice(2, path.length - 2) : [],
        tweakStart = second.slice(0) as Point,
        // if path.length is 3, then tweakEnd = tweakStart
        tweakEnd = path.length > 3 ? lastSecond.slice(0) as Point : tweakStart;
  // directly connected end to end
  if (path.length < 3) {
    return path;
  }
  // tweak start segment by startPort
  // vertical direction
  if (second[0] === first[0]) {
    tweakStart[0] = sx;
  } else {
    tweakStart[1] = sy;
  }
  // tweak end segment by endPort
  if (lastSecond[0] === last[0]) {
    tweakEnd[0] = ex;
  } else {
    tweakEnd[1] = ey;
  }
  if (path.length === 3) {
    return [[sx, sy], tweakStart, [ex, ey]];
  }
  return [[sx, sy], tweakStart, ...rest, tweakEnd, [ex, ey]];
}

function scalePath (path: Point[], startPos: IPosition, endPos: IPosition, gridRect?: IRect): Point[] {
  const scaledPath = path.map(point => {
    const [x, y] = point;
    const scalePoint: Point = gridRect
      ? [x * SCALE_FACTOR + gridRect.x, y * SCALE_FACTOR + gridRect.y]
      : [x * SCALE_FACTOR, y * SCALE_FACTOR];

    return scalePoint;
  });
  return tweakPath(PF.Util.compressPath(scaledPath) as Point[], startPos, endPos);
}

function scalePosition (position: IPosition): IPosition {
  return {
    x: Math.ceil(position.x / SCALE_FACTOR),
    y: Math.ceil(position.y / SCALE_FACTOR),
  };
}

function getPaddingPoint ({ position, direction }: NodePort, config: IConfig): IPosition {
  switch (direction) {
    case PortDirection.TOP:
      return { ...position, y: position.y - config.nodePadding };

    case PortDirection.RIGHT:
      return { ...position, x: position.x + config.nodePadding };

    case PortDirection.BOTTOM:
      return { ...position, y: position.y + config.nodePadding };

    case PortDirection.LEFT:
      return { ...position, x: position.x - config.nodePadding };

    default:
      return { ...position };
  }
}

function fallbackPath (startPort: NodePort, endPort: NodePort, config: IConfig): Point[] {
  const scaledStartPos = scalePosition(getPaddingPoint(startPort, config));
  const scaledEndPos = scalePosition(getPaddingPoint(endPort, config));

  const originalStartPos = scalePosition(startPort.position);
  const originalEndPos = scalePosition(endPort.position);

  return scalePath([
    [originalStartPos.x, originalStartPos.y],
    ...generateRightAnglePath(scaledStartPos, scaledEndPos, originalStartPos, originalEndPos),
    [originalEndPos.x, originalEndPos.y],
  ], startPort.position, endPort.position);
}

function setMatrixWalkable (matrix: number[][], pos: IPosition, walkable: boolean) {
  const height = matrix.length;
  const width = matrix[0].length;

  const x = Math.min(Math.max(pos.x, 0), width - 1);
  const y = Math.min(Math.max(pos.y, 0), height - 1);

  matrix[y][x] = walkable ? 0 : 1;
}

function markLine (
  matrix: number[][],
  [[startX, startY], [endX, endY]]: Line,
  walkable: boolean,
) {
  // @ts-ignore
  const points = PF.Util.interpolate(startX, startY, endX, endY);

  points.forEach(([x, y]: Point) => setMatrixWalkable(matrix, { x, y }, walkable));
}

// mark the port of node walkable/blocked
function markPort (
  matrix: number[][],
  gridRect: IRect,
  port: INodePort,
  walkable: boolean,
  { nodePadding }: { nodePadding: number },
) {
  const { direction, position } = port;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let { x, y } = position!;

  x = Math.ceil((x - gridRect.x) / SCALE_FACTOR);
  y = Math.ceil((y - gridRect.y) / SCALE_FACTOR);

  const scaledNodePadding = nodePadding / SCALE_FACTOR;

  // eslint-disable-next-line default-case
  switch (direction) {
    case PortDirection.TOP:
      setMatrixWalkable(matrix, { x, y: y + 1 }, walkable);
      setMatrixWalkable(matrix, { x, y: y - scaledNodePadding }, !walkable);

      markLine(matrix, [[x - 1, y], [x - 1, y - scaledNodePadding + 1]], walkable);
      markLine(matrix, [[x + 1, y], [x + 1, y - scaledNodePadding + 1]], walkable);
      break;

    case PortDirection.RIGHT:
      setMatrixWalkable(matrix, { x: x - 1, y }, walkable);
      setMatrixWalkable(matrix, { x: x + scaledNodePadding, y }, !walkable);

      markLine(matrix, [[x, y - 1], [x + scaledNodePadding - 1, y - 1]], walkable);
      markLine(matrix, [[x, y + 1], [x + scaledNodePadding - 1, y + 1]], walkable);
      break;

    case PortDirection.BOTTOM:
      setMatrixWalkable(matrix, { x, y: y - 1 }, walkable);
      setMatrixWalkable(matrix, { x, y: y + scaledNodePadding }, !walkable);

      markLine(matrix, [[x + 1, y], [x + 1, y + scaledNodePadding - 1]], walkable);
      markLine(matrix, [[x - 1, y], [x - 1, y + scaledNodePadding - 1]], walkable);
      break;

    case PortDirection.LEFT:
      setMatrixWalkable(matrix, { x: x + 1, y }, walkable);
      setMatrixWalkable(matrix, { x: x - scaledNodePadding, y }, !walkable);

      markLine(matrix, [[x, y + 1], [x - scaledNodePadding + 1, y + 1]], walkable);
      markLine(matrix, [[x, y - 1], [x - scaledNodePadding + 1, y - 1]], walkable);
      break;
  }
}

function groupBy<T> (collection: Array<T>, criteria: (item: T) => string): Record<string, T[]> {
  return collection.reduce((obj, item) => {
    const key = criteria(item);

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = [item];
    } else {
      obj[key].push(item);
    }

    return obj;
  }, {} as Record<string, T[]>);
}

function nextDots (start: number, length: number, portGap: number): number[] {
  let current = Math.ceil(start);
  const dots = [];

  for (let i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + portGap;
  }

  return dots;
}

function calcPortPosition (ports: Port[], nodeRect: IRect, portGap: number): {
  [id: string]: INodePort;
} {
  const {
    x, y, width, height,
  } = nodeRect;

  const groupedPorts = groupBy(ports, port => port.direction);

  // eslint-disable-next-line no-shadow
  return Object.entries(groupedPorts).reduce((acc, [direction, ports]) => {
    const { length } = ports;
    const portsLength = 3 * length + portGap * (length - 1);
    let dots: number[];

    // eslint-disable-next-line default-case
    switch (direction) {
      case PortDirection.TOP:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y } };
        });
        break;

      case PortDirection.RIGHT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: x + width, y: dots[index] } };
        });
        break;

      case PortDirection.BOTTOM:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x: dots[index], y: y + height } };
        });
        break;

      case PortDirection.LEFT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach((port, index) => {
          acc[port.id] = { ...port, position: { x, y: dots[index] } };
        });
        break;
    }

    return acc;
  }, {} as Record<string, INodePort>);
}

// mark node walkable/blocked
export function markNodeWalkable ({
  matrix,
  nodeRect,
  nodePorts,
  walkable,
  gridRect,
  config: { nodePadding, portGap },
}: {
  matrix: number[][];
  gridRect: IRect;
  nodeRect: IRect;
  nodePorts: Port[];
  walkable: boolean;
  config: IConfig;
}) {
  let {
    x, y, width, height,
  } = nodeRect;

  const ports = calcPortPosition(nodePorts, nodeRect, portGap);

  x = Math.ceil((x - nodePadding - gridRect.x) / SCALE_FACTOR); // grid x
  y = Math.ceil((y - nodePadding - gridRect.y) / SCALE_FACTOR); // grid y
  width = Math.ceil((width + nodePadding * 2) / SCALE_FACTOR);
  height = Math.ceil((height + nodePadding * 2) / SCALE_FACTOR);

  const topLeft: Point = [x, y];
  const topRight: Point = [x + width, y];
  const bottomRight: Point = [x + width, y + height];
  const bottomLeft: Point = [x, y + height];

  const lines: Record<PortDirection, Line> = {
    [PortDirection.TOP]: [topLeft, topRight],
    [PortDirection.RIGHT]: [topRight, bottomRight],
    [PortDirection.BOTTOM]: [bottomRight, bottomLeft],
    [PortDirection.LEFT]: [bottomLeft, topLeft],
  };

  const steps: Function[] = [
    () => {
      // mark rectangle
      Object.values(lines).forEach(line => markLine(matrix, line, walkable));
    },

    () => {
      // mark ports
      Object.values(ports).forEach(
        port => markPort(matrix, gridRect, port, walkable, { nodePadding }),
      );
    },
  ];

  if (walkable) steps.reverse();
  steps.forEach(step => step());
}

function buildGrid (
  pos1: IPosition,
  pos2: IPosition,
  nodes: INode[],
  config: IConfig,
) {
  const width = Math.abs(pos1.x - pos2.x) + MATRIX_PADDING * 2,
        height = Math.abs(pos1.y - pos2.y) + MATRIX_PADDING * 2;

  const gridRect: IRect = {
    x: Math.min(pos1.x, pos2.x) - MATRIX_PADDING,
    y: Math.min(pos1.y, pos2.y) - MATRIX_PADDING,
    width,
    height,
  };

  const matrix: number[][] = [];
  const adjustedWidth = Math.ceil(width / (SCALE_FACTOR));
  const adjustedHeight = Math.ceil(height / (SCALE_FACTOR));

  // empty matrix
  for (let i = 0; i < adjustedHeight; i += 1) {
    matrix.push(new Array(adjustedWidth).fill(0));
  }

  // mark intersectant nodes blocked
  nodes.forEach(node => {
    const intersectant = checkIntersect(gridRect, {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
    });

    if (intersectant) {
      markNodeWalkable({
        matrix,
        gridRect,
        nodeRect: {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        },
        nodePorts: Object.values(node.ports),
        walkable: false, // blocked
        config,
      });
    }
  });

  const pfGrid = new PF.Grid(matrix);

  return {
    gridRect,
    pfGrid,
  };
}

export default function generatePath (
  startPort: NodePort,
  endPort: NodePort,
  nodes: INode[],
  config: IConfig,
  _version?: number,
): Point[] {
  const startPos = startPort.position;
  const endPos = endPort.position;

  const { pfGrid, gridRect } = buildGrid(
    startPos,
    endPos,
    nodes,
    config,
  );

  const scaledStartPos = scalePosition({
    x: startPos.x - gridRect.x,
    y: startPos.y - gridRect.y,
  });
  const scaledEndPos = scalePosition({
    x: endPos.x - gridRect.x,
    y: endPos.y - gridRect.y,
  });

  try {
    const path = PF.Util.compressPath(
      pathFinder.findPath(
        scaledStartPos.x,
        scaledStartPos.y,
        scaledEndPos.x,
        scaledEndPos.y,
        pfGrid.clone(),
      ),
    ) as Point[];

    if (!path.length) return fallbackPath(startPort, endPort, config);

    return scalePath(path, startPos, endPos, gridRect);
  } catch (e) {
    return fallbackPath(startPort, endPort, config);
  }
}
