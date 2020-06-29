import { IState, IPosition } from '@/types';

export default function updateMousePosition (state: IState, position: IPosition) {
  state.mousePosition = position;
}
