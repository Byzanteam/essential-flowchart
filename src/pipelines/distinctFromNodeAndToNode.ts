import {
  INewLink, ILink,
} from '@/types';

function distinctFromNodeAndToNode (link: INewLink): INewLink | null;
function distinctFromNodeAndToNode (link: ILink): ILink | null;
function distinctFromNodeAndToNode (link: INewLink | ILink): INewLink | ILink | null {
  const { from, to } = link;

  if (!from) return link;
  if (!to) return link;

  if (from.nodeId === to.nodeId) return null;

  return link;
}

export default distinctFromNodeAndToNode;
