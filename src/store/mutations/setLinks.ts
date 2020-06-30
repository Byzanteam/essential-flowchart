import Vue from 'vue';

import { IState, ILink } from '@/types';

export default function addLink (state: IState, links: Record<string, ILink>) {
  Object.entries(links).forEach(([id, link]) => {
    Vue.set(state.graph.links, id, link);
  });
}
