import Vue from 'vue';

import { IState, ILink } from '@/types';
import emitter from '@/emitter';
import { registerRevertFunc } from '@/utils/history';

export default function (state: IState, { link }: { link: ILink }) {
  Vue.delete(state.graph.links, link.id);

  emitter.emit('remove-link', link);
}

registerRevertFunc('removeLink', mutation => ({
  ...mutation,
  type: 'addLink',
}));
