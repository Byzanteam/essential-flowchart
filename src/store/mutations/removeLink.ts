import Vue from 'vue';

import { IState, ILink } from '@/types';

export default function (state: IState, { link }: { link: ILink }) {
  Vue.delete(state.graph.links, link.id);
}
