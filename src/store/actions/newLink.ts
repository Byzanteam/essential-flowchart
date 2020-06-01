import { FlowchartContext, INewLink } from '@/types';
import validateLink from '@/validations/validateLink';

export default function newLink (
  { commit, dispatch, state }: FlowchartContext,
  { link }: { link: INewLink },
): boolean {
  const isValid = validateLink(link, state);

  if (isValid) {
    commit({
      type: 'newLink',
      link: { ...link },
    });
  } else {
    dispatch({
      type: 'discardLink',
      linkId: link.id,
    });
  }

  return isValid;
}
