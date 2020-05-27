import {
  Id,
  IPosition,
  IState,
  FlowchartStore,
  INode,
  ILink,
} from '@/types';

// [x, y, width, height];
type BoundingRect = [number, number, number, number];
interface IRectangle {
  width: number;
  height: number;
}
type Point = [number, number];
type Padding = [number, number];

const defaultLinePadding = [20, 20];

function getBoundingRect (
  position: IPosition,
  prevPosition: IPosition,
  { width, height }: IRectangle,
  padding?: Padding,
): BoundingRect {
  const [x, y] = padding || [0, 0];

  return [
    Math.min(position.x, prevPosition.x) - x,
    Math.min(position.y, prevPosition.y) - y,

    width + Math.abs(position.x - prevPosition.x) + 2 * x,
    height + Math.abs(position.y - prevPosition.y) + 2 * y,
  ];
}

function getPaddingLineBoundingRect (
  startPoint: Point,
  endPoint: Point,
  padding?: Padding,
): BoundingRect {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  const [x, y] = padding || defaultLinePadding;

  let length: number;

  // is horizontal
  if (y1 === y2) {
    length = Math.abs(x1 - x2);

    return [
      Math.min(x1, x2),
      y1 - length / 2,

      length,
      1 + 2 * y,
    ];
  }

  // is vertical

  length = Math.abs(y1 - y2);

  return [
    Math.min(y1, y2),
    x1 - length / 2,

    1 + 2 * x,
    length,
  ];
}

function getMovingBoundingRect ({
  position,
  prevPosition,
  node,
}: {
  position: IPosition;
  prevPosition: IPosition;
  node: INode;
}): BoundingRect {
  // TODO: padding
  return getBoundingRect(position, prevPosition, node, [12, 12]);
}

function isIntersectant (
  [x1, y1, width1, height1]: BoundingRect,
  [x2, y2, width2, height2]: BoundingRect,
): boolean {
  return x1 < x2 + width2
    && x1 + width1 > x2
    && y1 < y2 + height2
    && height1 + y1 > y2;
}

export default function reactiveLinks (store: FlowchartStore) {
  store.subscribe((mutation, state: IState) => {
    if (mutation.type === 'updateNodePosition') {
      const movingBoundingRect = getMovingBoundingRect(mutation.payload);

      const nodeId: Id = mutation.payload.node.id;

      Object.values(state.graph.links).forEach((link: ILink) => {
        if (link.from.nodeId === nodeId) return;
        if (link.to.nodeId === nodeId) return;

        const linkPath = state.linkPath[link.id];

        if (!linkPath) return;

        let found = false;
        const [first, ...rest] = linkPath;

        rest.reduce((prevPoint: Point, point: Point): Point => {
          if (found) return point;

          const linkBoundingRect = getPaddingLineBoundingRect(prevPoint, point);

          if (!isIntersectant(movingBoundingRect, linkBoundingRect)) return point;

          found = true;
          store.commit('touchLink', { linkId: link.id });

          return point;
        }, first);
      });
    }
  });
}
