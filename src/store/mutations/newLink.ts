import Vue from 'vue';

import { IState, ILink } from '@/types';

// create a new link
export default function newLink (state: IState, { link }: { link: ILink }) {
  Vue.set(state.graph.links, link.id, link);
}
