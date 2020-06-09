<template>
  <div
    ref="canvasRef"
    class="canvas__outer"
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
        class="canvas"
        :style="{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          paddingLeft: `${Math.abs(gridOffset.x * scale)}px`, // left expansion
          paddingTop: `${Math.abs(gridOffset.y * scale)}px`, // top expansion
          left: `${-gridOffset.x * scale}px`,
          top: `${-gridOffset.y * scale}px`,
        }"
      >
        <div
          :style="{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }"
          class="canvas__inner"
        >
          <slot />
        </div>
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

    const gridOffset = computed(() => store.state.graph.grid.offset);
    const scale = computed(() => store.state.graph.scale);
    const offset = computed(() => store.state.graph.offset);

    const canvasSize = computed(() => ({
      width: store.state.graph.grid.width - gridOffset.value.x,
      height: store.state.graph.grid.height - gridOffset.value.y,
    }));

    return {
      canvasRef,
      canvasSize,

      scale,
      offset,
      gridOffset,
      ...usePanZoomCanvas(store),
    };
  },
});
</script>

<style lang="scss">
.canvas {
  box-sizing: content-box;
  position: relative;

  &__outer {
    overflow: hidden;
    width: 100%;
  }

  &__inner {
    cursor: move;
    position: relative;
  }
}
</style>
