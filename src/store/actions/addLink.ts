import { FlowchartContext, ILink } from '@/types';

import validateLink from '@/validations/validateLink';

export default function addLink (
  { commit, dispatch, state }: FlowchartContext,
  { link, history = true }: { link: ILink; history: boolean },
): boolean {
  const isValid = validateLink(link, state);

  if (isValid) {
    const mutation = {
      type: 'addLink',
      link: { ...link },
    };

    if (history) {
      dispatch('historyPushEntry', mutation);
    } else {
      commit(mutation);
    }
  }

  return isValid;
}
