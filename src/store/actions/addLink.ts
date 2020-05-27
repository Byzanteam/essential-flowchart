import { FlowchartContext, ILink } from '@/types';

export default function addLink (
  { commit, dispatch, state }: FlowchartContext,
  { link, history = true, validateLink }: { link: ILink; history: boolean; validateLink?: Function },
) {
  let valid = true;

  if (validateLink) {
    valid = validateLink(link, state.graph);
  }

  if (valid) {
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

  return valid;
}
