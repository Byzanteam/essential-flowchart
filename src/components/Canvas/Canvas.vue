<template>
  <div ref="canvasRef">
    <div class="canvas__inner" :style="canvasStyleObj">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

import useStore from '@/hooks/useStore';

import useSize from './hooks/useSize';

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
