import mitt, { Handler } from 'mitt';
import { onMounted, onUnmounted } from '@vue/composition-api';

export const emitter: mitt.Emitter = mitt();

export default function useEmitter (handler: Handler) {
  onMounted(() => emitter.on('*', handler));
  onUnmounted(() => emitter.off('*', handler));
}
