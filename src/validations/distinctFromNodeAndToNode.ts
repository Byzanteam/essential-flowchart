import { INewLink, ILink, IGraph } from '@/types';

export default function distinctFromNodeAndToNode (
  link: INewLink | ILink,
  _graph: IGraph,
): boolean {
  const { from, to } = link;

  return from.nodeId !== to.nodeId;
}
