import { INode, IPosition, PortDirection } from '@/types';

export default function getLinkPosition (node: INode, portDir: PortDirection): IPosition {
  const port = node.ports[portDir];

  return {
    x: port.position ? port.position.x : node.x,
    y: port.position ? port.position.y : node.y,
  };
}
