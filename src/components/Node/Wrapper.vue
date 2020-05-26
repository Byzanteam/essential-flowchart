<template>
  <vue-draggable-resizable
    :onDragStart="onDragStart"
    :x="node.x"
    :y="node.y"
    :z="50"
    :resizable="false"
    :grid="[1, 1]"
    axis="both"
    w="auto"
    h="auto"
    class="node-wrapper"
    @dragging="onNodeDragging"
    @dragstop="onNodeDragStop"
  >
    <component
      :is="nodeComponent"
      :node="node"
    />

    <PortWrapperComponent
      v-for="(port, id) in node.ports"
      :key="id"
      :node="node"
      :port="port"
      :port-component="portComponent"
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
import PortWrapperComponent from '../Port/Wrapper';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'NodeWrapper',

  components: {
    VueDraggableResizable,
    PortWrapperComponent,
  },

  props: {
    node: {
      type: Object as PropType<INode>,
      required: true,
    },
    nodeComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },
    portComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },
  },

  setup (props) {
    let draggingNodePosition: IPosition | null = null;

    const onDragStart = () => {
      draggingNodePosition = {
        x: props.node.x,
        y: props.node.y,
      };
    };

    const onNodeDragging = (left: number, top: number) => {
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
      onDragStart,
    };
  },
});
</script>

<style lang="scss">
.node-wrapper {
  display: inline-block;
  position: absolute;
}
</style>
