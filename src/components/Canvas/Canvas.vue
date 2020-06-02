<template>
  <div class="canvas">
    <PanZoom
      @init="onPanZoomInit"
      @panend="onCanvasPanEnd"
      @zoom="onCanvasZoom"
    >
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
  computed,
} from '@vue/composition-api';
import useStore from '@/hooks/useStore';
import useSize from './hooks/useSize';
import usePanZoomCanvas from './hooks/usePanZoomCanvas';
import PanZoomComponent from './PanZoom.vue';

export default defineComponent({
  name: 'Canvas',

  components: {
    PanZoom: PanZoomComponent,
  },

  setup () {
    const { size, canvasRef } = useSize();
    const store = useStore();

    const canvasStyleObj = computed(() => ({
      width: `${store.state.graph.grid.width}px`,
      height: `${store.state.graph.grid.height}px`,
    }));

    const gridOffset = store.state.graph.grid.offset;

    return {
      canvasRef,
      size,
      canvasStyleObj,

      ...usePanZoomCanvas(store, gridOffset),
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
    background-color: rgba(green, 0.5);
    cursor: move;
    position: relative;
  }
}
</style>
