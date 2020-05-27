import { FlowchartContext, Id, IPosition } from '@/types';

export default function drawLink ({ commit, state }: FlowchartContext, { linkId, toPosition }: { linkId: Id; toPosition: IPosition }) {
  const link = state.graph.links[linkId];

  commit('updateLink', {
    ...link,
    to: {
      nodeId: null,
      portId: null,
      position: toPosition,
    },
  });
}
