import Vue from 'vue';

import { IState, INewLink } from '@/types';

// create a new link
export default function newLink (state: IState, { link }: { link: INewLink }) {
  Vue.set(state.graph.links, link.id, link);
}
