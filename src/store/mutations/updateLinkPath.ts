import Vue from 'vue';

import { IState, Id } from '@/types';

type Point = [number, number];

export default function updateLinkPath (state: IState, { linkId, path }: { linkId: Id; path: Point[] }) {
  Vue.set(state.linkPath, linkId, path);
}
