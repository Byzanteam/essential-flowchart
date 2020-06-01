import { FlowchartContext, ILink } from '@/types';

export default function addLink (
  { commit, dispatch, state }: FlowchartContext,
  { link, history = true }: { link: ILink; history: boolean },
): boolean {
  const { validateLink } = state.config;
  let isValid = true;

  if (validateLink) {
    isValid = validateLink(link, state.graph);
  }

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
