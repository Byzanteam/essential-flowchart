import { FlowchartContext, ILink } from '@/types';
import validateLink from '@/validations/validateLink';

export default function newLink (
  { commit, state }: FlowchartContext,
  { link }: { link: ILink },
): boolean {
  const isValid = validateLink(link, state);

  if (isValid) {
    const mutation = {
      type: 'newLink',
      link: { ...link },
    };

    commit(mutation);
  }

  return isValid;
}
