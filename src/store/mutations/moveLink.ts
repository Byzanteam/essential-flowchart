import { IState, IPosition, Id } from '@/types';

export default function moveLink (state: IState, { linkId, toPosition }: { linkId: Id; toPosition: IPosition }) {
  const link = state.graph.links[linkId];

  if (link) {
    link.to = {
      position: toPosition,
    };
  }
}
