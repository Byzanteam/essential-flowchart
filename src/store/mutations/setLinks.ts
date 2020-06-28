import Vue from 'vue';

import { IState, ILink } from '@/types';

export default function addLink (state: IState, links: Record<string, ILink>) {
  Object.entries(links).forEach(([key, link]) => {
    Vue.set(state.graph.links, key, link);
  });
}
