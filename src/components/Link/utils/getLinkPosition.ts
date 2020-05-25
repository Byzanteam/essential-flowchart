import { INode, Id, IPosition } from '@/types';

export default function getLinkPosition (node: INode, portId: Id): IPosition {
  const port = node.ports[portId];

  return {
    x: port.position ? port.position.x : node.x,
    y: port.position ? port.position.y : node.y,
  };
}
