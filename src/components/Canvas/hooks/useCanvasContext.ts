import {
  reactive, ref, Ref, onMounted, provide,
} from '@vue/composition-api';
import { ICanvasContext } from '@/types';

export const CanvasContextSymbol = Symbol('canvasContext');

export default function useCanvasContext () {
  const canvasRef: Ref<null | HTMLElement> = ref(null);
  const canvasInnerRef: Ref<null | HTMLElement> = ref(null);

  const context = reactive({
    offsetX: 0,
    offsetY: 0,
  });

  onMounted(() => {
    if (canvasRef.value) {
      const rect = canvasRef.value.getBoundingClientRect();
      context.offsetX = rect.left;
      context.offsetY = rect.top;
    }
  });

  provide<ICanvasContext>(CanvasContextSymbol, context);

  return {
    canvasRef,
    canvasInnerRef,
  };
}
