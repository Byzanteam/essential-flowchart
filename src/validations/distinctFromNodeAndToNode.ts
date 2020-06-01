import { ILink, IGraph } from '@/types';

export default function distinctFromNodeAndToNode (
  link: ILink,
  _graph: IGraph,
): boolean {
  const { from, to } = link;

  return from.nodeId !== to.nodeId;
}
