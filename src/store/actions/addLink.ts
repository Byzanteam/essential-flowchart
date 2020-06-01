import { FlowchartContext, ILink } from '@/types';

export default function addLink (
  { commit, dispatch, state }: FlowchartContext,
  { link, history = true }: { link: ILink; history: boolean },
): boolean {
  const { validateLink } = state.config;
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
