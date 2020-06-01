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
  defineComponent, ref, onMounted, Ref,
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
  },

  setup (props, { emit }) {
    const sceneRef: Ref<HTMLElement | null> = ref(null);

    let panZoomInstance = null;

    const bindEvents = (instance: PanZoom) => {
      instance.on('panstart', e => {
        emit('panstart', e);
      });

      instance.on('panend', e => {
        emit('panend', e);
      });

      instance.on('pan', e => {
        emit('pan', e);
      });

      instance.on('zoom', e => {
        emit('zoom', e);
      });

      instance.on('transform', e => {
        emit('transform', e);
      });

      instance.on('zoomend', e => {
        emit('zoomend', e);
      });
    };

    onMounted(() => {
      if (sceneRef.value) {
        const finalOptions = {
          ...DEFAULT_OPTIONS,
          ...props.options,
        };

        panZoomInstance = panZoom(sceneRef.value, finalOptions);
        emit('init', panZoomInstance);
        bindEvents(panZoomInstance);
      }
    });

    return {
      sceneRef,
    };
  },
});
</script>
