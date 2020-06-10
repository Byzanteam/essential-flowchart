<template>
  <div class="pan-zoom">
    <div
      ref="sceneRef"
      class="pan-zoom__scene"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, watch,
  Ref,
} from '@vue/composition-api';
import panZoom, { PanZoom } from 'panzoom';

export default defineComponent({
  name: 'PanZoom',

  props: {
    x: {
      type: Number,
      default: 0,
    },

    y: {
      type: Number,
      default: 0,
    },

    zoom: {
      type: Number,
      default: 1,
    },

    minZoom: {
      type: Number,
      default: undefined,
    },

    maxZoom: {
      type: Number,
      default: undefined,
    },
  },

  setup (props, { emit }) {
    const sceneRef: Ref<HTMLElement | null> = ref(null);

    const bindEvents = (instance: PanZoom) => {
      instance.on('panstart', (ins: PanZoom) => {
        emit('panstart', ins);
      });

      instance.on('pan', (ins: PanZoom) => {
        emit('pan', ins);
      });

      instance.on('panend', (ins: PanZoom) => {
        emit('panend', ins);
      });

      instance.on('zoom', (ins: PanZoom) => {
        emit('zoom', ins);
      });

      // https://github.com/anvaka/panzoom/issues/177
      instance.on('zoomend', (ins: PanZoom) => {
        emit('zoomend', ins);
      });

      instance.on('transform', (ins: PanZoom) => {
        emit('transform', ins);
      });
    };

    onMounted(() => {
      if (sceneRef.value) {
        // https://github.com/anvaka/panzoom
        const panZoomInstance: PanZoom = panZoom(sceneRef.value, {
          bounds: true,
          minZoom: props.minZoom,
          maxZoom: props.maxZoom,
        });

        panZoomInstance.zoomTo(props.x, props.y, props.zoom);
        panZoomInstance.moveTo(props.x, props.y);
        bindEvents(panZoomInstance);

        watch(() => props.zoom, zoom => {
          panZoomInstance.zoomAbs(props.x, props.y, zoom);
        }, { lazy: true });
      }
    });

    return {
      sceneRef,
    };
  },
});
</script>

<style lang="scss">
.pan-zoom {
  outline: none;
}
</style>
