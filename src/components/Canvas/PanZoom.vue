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

const DEFAULT_OPTIONS = {
  bounds: true,
  minZoom: 0.5,
  maxZoom: 1.5,
};

export default defineComponent({
  name: 'PanZoom',

  props: {
    options: {
      type: Object,
      default: () => ({}),
    },

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
  },

  setup (props, { emit }) {
    const sceneRef: Ref<HTMLElement | null> = ref(null);

    let panZoomInstance: PanZoom | null = null;

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
        const finalOptions = {
          ...DEFAULT_OPTIONS,
          ...props.options,
        };

        panZoomInstance = panZoom(sceneRef.value, finalOptions);
        panZoomInstance.zoomAbs(props.x, props.y, props.zoom);
        bindEvents(panZoomInstance);

        watch(() => props.zoom, zoom => {
          if (panZoomInstance) {
            const { x, y }  = panZoomInstance.getTransform();
            panZoomInstance.zoomAbs(x, y, zoom);
          }
        }, { lazy: true });
      }
    });

    return {
      sceneRef,
    };
  },
});
</script>
