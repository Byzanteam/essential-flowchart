import { ILink } from '@/types';

export default function distinctFromNodeAndToNode (link: ILink): ILink | null {
  const { from, to } = link;

  if (from.nodeId === to.nodeId) return null;

  return link;
}
