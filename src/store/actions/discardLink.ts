import { FlowchartContext, Id } from '@/types';

export default function discardLink (
  { state, commit }: FlowchartContext,
  { linkId }: { linkId: Id },
) {
  const link = state.graph.links[linkId];
  if (!link) return;

  commit('discardLink', {
    link: {
      ...link,
    },
  });
}
