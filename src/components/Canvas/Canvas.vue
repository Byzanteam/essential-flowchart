<template>
  <div class="canvas">
    <PanZoom>
      <div
        :style="canvasStyleObj"
        class="canvas__inner"
      >
        <slot />
      </div>
    </PanZoom>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive, ref, computed,
  Ref,
} from '@vue/composition-api';

import { useStore } from '@/hooks/store';
import PanZoom from './PanZoom.vue';

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

  components: {
    PanZoom,
  },

  setup () {
    const { size, canvasRef } = useSize();
    const store = useStore();

    // const gridOffset = computed(() => store.state.graph.grid.offset);

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
.canvas {
  background-color: purple;
  overflow: hidden;
  width: 100%;

  &__inner {
    cursor: move;
    position: relative;
  }
}
</style>
