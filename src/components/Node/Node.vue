<template>
  <vue-draggable-resizable
    :x="node.x"
    :y="node.y"
    :resizable="false"
    :grid="[1, 1]"
    axis="both"
    w="auto"
    h="auto"
    class="node"
    @dragstop="onNodeDragStop"
  >
    <node-inner :node="node" />
  </vue-draggable-resizable>
</template>

<script lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable';
import { defineComponent, PropType } from '@vue/composition-api';
import store from '@/store';
import { INode } from '@/types/graph';
import NodeInner from './NodeInner.vue';

export default defineComponent({
  name: 'Node',

  components: {
    VueDraggableResizable,
    NodeInner,
  },

  props: {
    node: {
      type: Object as PropType<INode>,
      required: true,
    },
  },

  setup (props) {
    const onNodeDragStop = (left: number, top: number) => {
      store.dispatch('dragNodeStop', {
        id: props.node.id,
        position: [left, top], // [x, y]
      });
    };

    return {
      onNodeDragStop,
    };
  },
});
</script>

<style lang="scss">
.node {
  display: inline-block;
}
</style>
