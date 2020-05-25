<template>
  <svg
    v-if="toNode"
    class="link"
  >
    <circle
      :cx="startPos.x"
      :cy="startPos.y"
      r="4"
    />

    <path
      :d="points"
      stroke="blue"
      strokeWidth="3"
      fill="none"
    />

    <circle
      :cx="endPos.x"
      :cy="endPos.y"
      r="4"
    />
  </svg>
</template>

<script lang="ts">
import {
  defineComponent, computed, PropType,
} from '@vue/composition-api';
import store from '@/store';
import { INode, ILink } from '@/types/graph';
import getLinkPosition from './utils/getLinkPosition';
import generatePath from './utils/generatePath';

export default defineComponent({
  name: 'Link',

  props: {
    link: {
      type: Object as PropType<ILink>,
      required: true,
    },

    fromNode: {
      type: Object as PropType<INode>,
      required: true,
    },

    toNode: {
      type: Object as PropType<INode>,
      default: null,
    },
  },

  setup (props) {
    const startPos = computed(() => getLinkPosition(props.fromNode, props.link.from.portId));
    const endPos = computed(() => getLinkPosition(props.toNode, props.link.from.portId));

    const points = computed(() => generatePath(store.state.graph.grid.pfGrid, startPos.value, endPos.value));

    return {
      startPos,
      endPos,

      points,
    };
  },
});
</script>

<style lang="scss">
.link {
  cursor: pointer;
  left: 0;
  overflow: visible;
  position: absolute;
  right: 0;
}
</style>
