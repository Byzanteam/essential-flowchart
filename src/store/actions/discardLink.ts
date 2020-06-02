import { FlowchartContext } from '@/types';

export default function discardLink ({ state, commit }: FlowchartContext) {
  const { newLink } = state;
  if (!newLink) return;

  commit('discardLink');

  commit('deleteLinkPath', { linkId: newLink.id });
}
