<template>
  <vue-draggable-resizable
    :x="node.x"
    :y="node.y"
    :z="50"
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
      v-for="(port, id) in node.ports"
      :key="id"
      :node="node"
      :port="port"
    />
  </vue-draggable-resizable>
</template>

<script lang="ts">
// @ts-ignore
import VueDraggableResizable from 'vue-draggable-resizable';
import {
  defineComponent, PropType,
} from '@vue/composition-api';
import store from '@/store';
import { IPosition, INode } from '@/types';
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
    let draggingNodePosition: IPosition | null = null;

    const onNodeDragging = (left: number, top: number) => {
      if (!draggingNodePosition) {
        draggingNodePosition = {
          x: props.node.x,
          y: props.node.y,
        };
      }

      store.dispatch('dragNode', {
        id: props.node.id,
        position: {
          x: left,
          y: top,
        },
        prevPosition: {
          x: props.node.x,
          y: props.node.y,
        },
      });
    };

    const onNodeDragStop = (left: number, top: number) => {
      store.dispatch('dragNodeStop', {
        id: props.node.id,
        position: {
          x: left,
          y: top,
        },
        prevPosition: { ...draggingNodePosition },
      });

      draggingNodePosition = null;
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
