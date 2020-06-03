import Vue from 'vue';
import { IState, SelectedOrHovered } from '@/types';

export default function updateSelected (
  state: IState,
  { selected }: { selected: SelectedOrHovered },
) {
  Vue.set(state, 'selected', selected);
}
