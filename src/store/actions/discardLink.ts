import {
  FlowchartContext, Id,
  LinkType,
} from '@/types';

export default function discardLink (
  { state, commit }: FlowchartContext,
  { linkId }: { linkId: Id },
) {
  const link = state.graph.links[linkId];
  if (!link) return;
  if (link.type !== LinkType.New) return;

  commit('discardLink', {
    link: {
      ...link,
    },
  });

  commit('deleteLinkPath', { linkId });
}
