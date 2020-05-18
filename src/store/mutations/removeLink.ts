import Vue from 'vue';

import { IState, ILink } from '@/types';

import { registerRevertFunc } from '@/utils/history';

export default function (state: IState, { link }: { link: ILink }) {
  Vue.delete(state.graph.links, link.id);
}

registerRevertFunc('removeLink', mutation => ({
  ...mutation,
  type: 'addLink',
}));
