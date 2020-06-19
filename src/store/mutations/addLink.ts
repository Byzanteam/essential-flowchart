import Vue from 'vue';

import { IState, ILink } from '@/types';
import emitter from '@/emitter';
import { ADD_LINK } from '@/emitter/events';
import { registerRevertFunc } from '@/utils/history';

export default function addLink (state: IState, { link }: { link: ILink }) {
  Vue.set(state.graph.links, link.id, link);

  emitter.emit(ADD_LINK, link);
}

registerRevertFunc('addLink', mutation => ({
  ...mutation,
  type: 'removeLink',
}));
