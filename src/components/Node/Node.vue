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
    @dragging="onNodeDragging"
    @dragstop="onNodeDragStop"
  >
    <node-inner :node="node" />

    <Port
      v-for="port in node.ports"
      :key="port.direction"
      :node="node"
      :port="port"
    />
  </vue-draggable-resizable>
</template>

<script lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable';
import { defineComponent, PropType } from '@vue/composition-api';
import store from '@/store';
import { INode } from '@/types/graph';
import NodeInner from './NodeInner.vue';
import Port from '../Port/Port.vue';

export default defineComponent({
  name: 'Node',

  components: {
    VueDraggableResizable,
    NodeInner,
    Port,
  },

  props: {
    node: {
      type: Object as PropType<INode>,
      required: true,
    },
  },

  setup (props) {
    const { node } = props;

    const onNodeDragging = (left: number, top: number) => {
      store.commit('dragNode', {
        nodeId: node.id,
        position: {
          x: left,
          y: top,
        },
      });
    };

    const onNodeDragStop = (left: number, top: number) => {
      store.dispatch('dragNodeStop', {
        id: node.id,
        position: {
          x: left,
          y: top,
        },
      });
    };

    return {
      onNodeDragging,
      onNodeDragStop,
    };
  },
});
</script>

<style lang="scss">
.node {
  display: inline-block;
  position: absolute;
}
</style>
