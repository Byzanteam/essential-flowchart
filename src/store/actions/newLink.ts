import { FlowchartContext, ILink } from '@/types';
import validateLink from '@/validations/validateLink';

export default function newLink (
  { commit, dispatch, state }: FlowchartContext,
  { link }: { link: ILink },
): boolean {
  const isValid = validateLink(link, state);

  if (isValid) {
    commit({
      type: 'newLink',
      link: { ...link },
    });
  } else {
    dispatch({
      type: 'dispatchLink',
      linkId: link.id,
    });
  }

  return isValid;
}
