import {
  Id,
  IPosition,
  IState,
  FlowchartStore,
  INode,
  ILink,
} from '@/types';

type BoundingBox = [number, number, number, number];
interface IRectangle {
  width: number;
  height: number;
}

type Padding = [number, number];

function getBoundingBox (
  position: IPosition,
  prevPosition: IPosition,
  { width, height }: IRectangle,
  padding?: Padding,
): BoundingBox {
  const [x, y] = padding || [0, 0];

  return [
    Math.min(position.x, prevPosition.x) - x,
    Math.min(position.y, prevPosition.y) - y,

    width + Math.abs(position.x - prevPosition.x) + 2 * x,
    height + Math.abs(position.y - prevPosition.y) + 2 * y,
  ];
}
function getMovingBoundingBox ({
  position,
  prevPosition,
  node,
}: {
  position: IPosition;
  prevPosition: IPosition;
  node: INode;
}): BoundingBox {
  // TODO: padding
  return getBoundingBox(position, prevPosition, node, [12, 12]);
}

function getLinkBoundingBox (link: ILink, state: IState): BoundingBox {
  const { nodes } = state.graph;

  const { from, to } = link;

  const { position: fromPosition } = nodes[from.nodeId].ports[from.portId];
  const { position: toPosition } = nodes[to.nodeId].ports[to.portId];

  return getBoundingBox(fromPosition!, toPosition!, { width: 0, height: 0 });
}

function isInCollision (
  [x1, y1, width1, height1]: BoundingBox,
  [x2, y2, width2, height2]: BoundingBox,
): boolean {
  return x1 < x2 + width2
    && x1 + width1 > x2
    && y1 < y2 + height2
    && height1 + y1 > y2;
}


export default function reactiveLinks (store: FlowchartStore) {
  store.subscribe((mutation, state: IState) => {
    if (mutation.type === 'updateNodePosition') {
      const movingBoundingBox = getMovingBoundingBox(mutation.payload);

      const nodeId: Id = mutation.payload.node.id;

      Object.values(state.graph.links).forEach((link: ILink) => {
        if (link.from.nodeId === nodeId) return;
        if (link.to.nodeId === nodeId) return;

        const linkBoundingBox = getLinkBoundingBox(link, state);

        if (isInCollision(movingBoundingBox, linkBoundingBox)) {
          store.commit('touchLink', { linkId: link.id });
        }
      });
    }
  });
}
