<template>
  <div class="canvas">
    <PanZoom
      @init="onPanZoomInit"
      @zoomend="onCanvasZoomEnd"
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
  reactive, ref, computed,
  Ref,
} from '@vue/composition-api';
import { PanZoom, Transform } from 'panzoom';

import { useStore } from '@/hooks/store';
import PanZoomComponent from './PanZoom.vue';

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
    const onPanZoomInit = (panZoom: PanZoom) => {
      panZoom.zoomAbs(
        gridOffset.x, // initial x
        gridOffset.y, // inital y
        store.state.graph.scale, // initial scale
      );
    };
    const onCanvasZoomEnd = (e: PanZoom) => {
      const transform: Transform = e.getTransform();
      store.commit('updateScale', transform.scale);
    };

    return {
      canvasRef,
      size,
      canvasStyleObj,

      onPanZoomInit,
      onCanvasZoomEnd,
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
