import Vue from 'vue';

import { IState, Id } from '@/types';

export default function deleteLinkPath (state: IState, { linkId }: { linkId: Id }) {
  Vue.delete(state.linkPath, linkId);
}
