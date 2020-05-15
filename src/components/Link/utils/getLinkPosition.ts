import { INode, Position, PortDirection } from '@/types';

export default function getLinkPosition (node: INode, portDir: PortDirection): Position {
  const port = node.ports[portDir];

  return [
    port.position ? port.position.x : node.x,
    port.position ? port.position.y : node.y,
  ];
}
