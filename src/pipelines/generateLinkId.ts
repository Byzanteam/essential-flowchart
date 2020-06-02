import { ILink } from '@/types';

// https://gist.github.com/6174/6062387
function generateUuid (): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function generateLinkId (link: ILink): ILink {
  const { id } = link;

  if (!id) link.id = generateUuid();

  return link;
}
