import { IState, INewLink } from '@/types';

// create a new link
export default function newLink (state: IState, { link }: { link: INewLink }) {
  state.newLink = link;
}
