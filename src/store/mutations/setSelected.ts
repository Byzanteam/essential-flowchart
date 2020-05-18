import { IState, ISelectable } from '@/types';

// TODO
export default function (state: IState, item: ISelectable | null) {
  if (item) {
    state.selected = {
      // @ts-ignore
      type: isNode(item) ? 'node' : 'link',
      id: item.id,
    };
  } else {
    state.selected = null;
  }
}
