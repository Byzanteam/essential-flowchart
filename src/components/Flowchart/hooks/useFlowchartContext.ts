import { ref, Ref } from '@vue/composition-api';
import { IPosition } from '@/types';

export interface ICanvasComponent {
  getPosition(clientX: number, clientY: number): IPosition | null;
}

export default function useFlowchartContext () {
  const canvasRef: Ref<null | ICanvasComponent> = ref(null);

  return {
    canvasRef,
  };
}
