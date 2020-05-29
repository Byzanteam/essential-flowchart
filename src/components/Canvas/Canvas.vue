<template>
  <div ref="canvasRef">
    <div class="canvas__inner" :style="canvasStyleObj">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive, ref, computed,
  Ref,
} from '@vue/composition-api';

import { useStore } from '@/hooks/store';

function useSize () {
  const canvasRef: Ref<null | HTMLElement> = ref(null);

  const size = reactive({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  });

  return {
    canvasRef,
    size,
  };
}

export default defineComponent({
  name: 'Canvas',

  setup () {
    const { size, canvasRef } = useSize();
    const store = useStore();

    const canvasStyleObj = computed(() => ({
      width: `${store.state.graph.grid.width}px`,
      height: `${store.state.graph.grid.height}px`,
    }));

    return {
      canvasRef,
      size,
      canvasStyleObj,
    };
  },
});
</script>

<style lang="scss">
.canvas__inner {
  background-color: purple;
  cursor: move;
  position: relative;
}
</style>
