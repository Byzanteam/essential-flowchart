import { IState, IPosition } from '@/types';

export default function updateMousePosition (state: IState, position: IPosition) {
  // TODO: expand grid
  state.mousePosition = position;
}
