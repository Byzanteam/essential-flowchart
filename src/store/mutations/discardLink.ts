import Vue from 'vue';

import { IState, ILink } from '@/types';

// discard a new link
export default function discardLink (state: IState, { link }: { link: ILink }) {
  Vue.delete(state.graph.links, link.id);
}
