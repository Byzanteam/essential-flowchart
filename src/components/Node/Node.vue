<template>
  <vue-draggable-resizable
    :x="node.position.x"
    :y="node.position.y"
    :resizable="false"
    :grid="[1, 1]"
    axis="both"
    w="auto"
    h="auto"
    class="node"
  >
    <node-inner :node="node" />
  </vue-draggable-resizable>
</template>

<script lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable';
import { defineComponent, PropType } from '@vue/composition-api';
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
});
</script>

<style lang="scss">
.node {
  display: inline-block;
}
</style>
