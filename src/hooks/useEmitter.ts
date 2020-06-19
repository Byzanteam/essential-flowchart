import { Handler } from 'mitt';
import { onMounted, onUnmounted } from '@vue/composition-api';
import emitter from '@/emitter';

export default function useEmitter (handler: Handler) {
  onMounted(() => emitter.on('*', handler));
  onUnmounted(() => emitter.off('*', handler));
}
