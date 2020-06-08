<template>
  <div
    ref="canvasRef"
    class="canvas"
  >
    <PanZoom
      :x="offset.x"
      :y="offset.y"
      :zoom="scale"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
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
import useCanvasContext from './hooks/useCanvasContext';
import usePanZoomCanvas from './hooks/usePanZoomCanvas';
import PanZoomComponent from './PanZoom.vue';

export default defineComponent({
  name: 'Canvas',

  components: {
    PanZoom: PanZoomComponent,
  },

  setup () {
    const { canvasRef } = useCanvasContext();
    const store = useStore();

    const canvasStyleObj = computed(() => ({
      width: `${store.state.graph.grid.width}px`,
      height: `${store.state.graph.grid.height}px`,
    }));

    const scale = computed(() => store.state.graph.scale);
    const offset = computed(() => store.state.graph.offset);

    return {
      canvasRef,
      canvasStyleObj,
      scale,
      offset,
      ...usePanZoomCanvas(store),
    };
  },
});
</script>

<style lang="scss">
.canvas {
  overflow: hidden;
  width: 100%;

  &__inner {
    cursor: move;
    position: relative;
  }
}
</style>
