import { IState, ILink } from '@/types';

export default function updateLink (state: IState, link: ILink) {
  state.graph.links[link.id] = link;
  // Vue.set(state.graph.links, link.id, link);
}
