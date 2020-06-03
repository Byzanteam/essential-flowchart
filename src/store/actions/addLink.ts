import { FlowchartContext, ILink } from '@/types';

export default function addLink (
  { commit, dispatch }: FlowchartContext,
  { link, history = true }: { link: ILink; history: boolean },
) {
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
