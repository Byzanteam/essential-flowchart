import Vue from 'vue';

import { IState, ILink } from '@/types';

import { registerRevertFunc } from '@/utils/history';

export default function addLink (state: IState, { link }: { link: ILink }) {
  Vue.set(state.graph.links, link.id, link);
}

registerRevertFunc('addLink', mutation => ({
  ...mutation,
  type: 'removeLink',
}));
