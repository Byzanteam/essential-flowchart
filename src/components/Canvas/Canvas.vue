<template>
  <div ref="canvasRef">
    <div class="canvas__inner">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive, ref,
  Ref,
} from '@vue/composition-api';

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

    return {
      canvasRef,
      size,
    };
  },
});
</script>

<style lang="scss">
.canvas__inner {
  background-color: red;
  cursor: move;
  height: 10000px;
  position: relative;
  width: 10000px;
}
</style>
