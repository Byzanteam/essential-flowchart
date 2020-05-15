import { IState, ILinkAttrs } from '@/types';

export default function (state: IState, linkAttrs: ILinkAttrs) {
  state.graph.links[linkAttrs.id] = linkAttrs;
}
