import Vue from 'vue';

import { IState, Id, Point } from '@/types';

export default function updateLinkPath (state: IState, { linkId, path }: { linkId: Id; path: Point[] }) {
  Vue.set(state.linkPath, linkId, path);
}
