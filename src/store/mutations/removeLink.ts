import Vue from 'vue';

import { IState, ILink } from '@/types';
import emitter from '@/emitter';
import { REMOVE_LINK } from '@/emitter/events';
import { registerRevertFunc } from '@/utils/history';

export default function (state: IState, { link }: { link: ILink }) {
  Vue.delete(state.graph.links, link.id);

  emitter.emit(REMOVE_LINK, link);
}

registerRevertFunc('removeLink', mutation => ({
  ...mutation,
  type: 'addLink',
}));
