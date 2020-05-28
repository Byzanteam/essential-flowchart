import {
  Id,
  Point,
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

function getBoundingRect (
  position: IPosition,
  prevPosition: IPosition,
  { width, height }: IRectangle,
): BoundingRect {
  return [
    Math.min(position.x, prevPosition.x),
    Math.min(position.y, prevPosition.y),

    width + Math.abs(position.x - prevPosition.x),
    height + Math.abs(position.y - prevPosition.y),
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
  return getBoundingRect(position, prevPosition, node);
}

// detect whether the line is intersectant with the node
function isIntersectant (
  [x1, y1, width1, height1]: BoundingRect,
  [[x3, y3], [x4, y4]]: [Point, Point],
): boolean {
  const x2 = Math.min(x3, x4);
  const y2 = Math.min(y3, y4);
  const width2 = Math.abs(x3 - x4);
  const height2 = Math.abs(y3 - y4);

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

        let intersectant = false;
        const [first, ...rest] = linkPath;

        // check each segment of the line
        rest.reduce((prevPoint: Point, point: Point): Point => {
          if (intersectant) return point;

          if (!isIntersectant(movingBoundingRect, [prevPoint, point])) return point;

          intersectant = true;
          store.commit('touchLink', { linkId: link.id });

          return point;
        }, first);
      });
    }
  });
}
