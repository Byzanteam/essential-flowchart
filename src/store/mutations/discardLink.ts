import { IState } from '@/types';

// discard a new link
export default function discardLink (state: IState) {
  state.newLink = null;
}
