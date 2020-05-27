import Vue from 'vue';

import { IState, Id } from '@/types';

export default function touchLink (state: IState, { linkId }: { linkId: Id }) {
  Vue.set(state.linkVersions, linkId, Date.now());
}
