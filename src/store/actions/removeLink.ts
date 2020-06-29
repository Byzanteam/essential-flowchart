import { FlowchartContext, Id } from '@/types';

export default function removeLink (
  { state, dispatch }: FlowchartContext,
  linkId: Id,
) {
  const link = state.graph.links[linkId];
  if (!link) return;

  const mutation = {
    type: 'removeLink',
    link: {
      ...link,
    },
  };

  dispatch('historyPushEntry', mutation);
}
