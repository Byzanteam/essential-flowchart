import { FlowchartContext, Id } from '@/types';

export default function removeLink (
  { state, dispatch, commit }: FlowchartContext,
  { linkId, history = true }: { linkId: Id; history: boolean },
) {
  const link = state.graph.links[linkId];
  if (!link) return;

  const mutation = {
    type: 'removeLink',
    link: {
      ...link,
    },
  };

  if (history) {
    dispatch('historyPushEntry', mutation);
  } else {
    commit(mutation);
  }
}
