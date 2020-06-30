<template>
  <div
    ref="canvasRef"
    class="canvas__outer"
    @click="onCanvasClick"
  >
    <PanZoom
      :x="offset.x"
      :y="offset.y"
      :zoom="scale"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      @pan="onCanvasPan"
      @panend="onCanvasPanEnd"
      @zoom="onCanvasZoom"
    >
      <div
        class="canvas"
      >
        <slot />
      </div>
    </PanZoom>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';
import { IPosition } from '@/types';
import emitter from '@/emitter';
import { CLICK_CANVAS } from '@/emitter/events';
import { useConfig } from '@/utils/config';
import useCanvasContext from './hooks/useCanvasContext';
import usePanZoomCanvas from './hooks/usePanZoomCanvas';
import PanZoomComponent from './PanZoom.vue';

export default defineComponent({
  name: 'Canvas',

  components: {
    PanZoom: PanZoomComponent,
  },

  setup () {
    const { canvasInnerRef, canvasRef } = useCanvasContext();

    const {
      scale, offset, minZoom, maxZoom,
    } = useConfig();

    const onCanvasClick = (event: MouseEvent) => {
      emitter.emit(CLICK_CANVAS, event);
    };

    function getPosition (clientX: number, clientY: number): IPosition | null {
      if (canvasInnerRef.value) {
        const canvasRect = canvasInnerRef.value.getBoundingClientRect();
        return {
          x: Math.round((clientX - canvasRect.left) / scale.value),
          y: Math.round((clientY - canvasRect.top) / scale.value),
        };
      }
      return null;
    }

    return {
      canvasInnerRef,
      canvasRef,

      scale,
      offset,
      minZoom,
      maxZoom,
      ...usePanZoomCanvas(scale, offset),
      onCanvasClick,

      getPosition,
    };
  },
});
</script>

<style lang="scss">
.canvas {
  box-sizing: content-box;
  position: relative;
  cursor: move;
  width: 2000px;
  height: 2000px;

  &__outer {
    overflow: hidden;
    width: 100%;
  }
}
</style>
