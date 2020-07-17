import { inject } from '@vue/composition-api';
import { IPosition } from '@/types';

function defaultGetPosition (x = 0, y = 0) {
  return { x, y };
}

export default function () {
  return inject<(x: number, y: number) => IPosition>('getPosition', defaultGetPosition);
}
