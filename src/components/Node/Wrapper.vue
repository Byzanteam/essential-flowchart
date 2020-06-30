<template>
  <vue-draggable-resizable
    :onDragStart="dragActions.onNodeDragStart"
    :x="node.x"
    :y="node.y"
    :z="50"
    :draggable="!readonly"
    :resizable="false"
    :grid="[1, 1]"
    :scale="scale"
    axis="both"
    w="auto"
    h="auto"
    class="node-wrapper"
    @dragging="dragActions.onNodeDragging"
    @dragstop="dragActions.onNodeDragStop"
    @click.native="onNodeClick"
  >
    <ResizeObserver @notify="onNodeResize" />

    <component
      :is="nodeComponent"
      :node="node"
    />

    <template v-if="!readonly">
      <PortWrapperComponent
        v-for="(port, id) in node.ports"
        :key="id"
        :node="node"
        :port="port"
        :port-component="portComponent"
      />
    </template>
  </vue-draggable-resizable>
</template>

<script lang="ts">
// @ts-ignore
import VueDraggableResizable from 'vue-draggable-resizable';
// @ts-ignore
import { ResizeObserver } from 'vue-resize';
import Vue from 'vue';
import {
  defineComponent, computed, watch,
  PropType,
} from '@vue/composition-api';
import useStore from '@/hooks/useStore';
import { INode, IRect } from '@/types';
import emitter from '@/emitter';
import { CLICK_NODE } from '@/emitter/events';
import { calcPortPosition } from '@/utils/graph';
import { noop } from '@/utils/shared';

import useDragNode from './hooks/useDragNode';
import PortWrapperComponent from '../Port/Wrapper.vue';

import 'vue-resize/dist/vue-resize.css';

type FlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'NodeWrapper',

  components: {
    VueDraggableResizable,
    PortWrapperComponent,
    ResizeObserver,
  },

  props: {
    node: {
      type: Object as PropType<INode>,
      required: true,
    },

    nodeComponent: {
      type: Object as PropType<FlowchartComponent>,
      required: true,
    },
    portComponent: {
      type: Object as PropType<FlowchartComponent>,
      required: true,
    },
  },

  setup (props) {
    const store = useStore();
    const node = computed(() => props.node);
    const scale = computed(() => store.state.graph.scale);
    const readonly = computed(() => store.state.config.readonly);

    const onNodeClick = (event: MouseEvent) => {
      emitter.emit(CLICK_NODE, { event, node: props.node });
    };

    const onNodeResize = ({ width, height }: Pick<INode, 'width' | 'height'>) => {
      store.commit({
        type: 'updateNodeSize',
        id: props.node.id,
        width,
        height,
      });
    };

    const defaultDragActions = useDragNode(store, node);
    const readonlyDragActions = {
      onNodeDragStart: noop,
      onNodeDragging: noop,
      onNodeDragStop: noop,
    };

    const dragActions = computed(() => (
      store.state.config.readonly ? readonlyDragActions : defaultDragActions
    ));

    const nodeRect = computed<IRect>(() => ({
      x: node.value.x,
      y: node.value.y,
      width: node.value.width,
      height: node.value.height,
    }));

    // watch node rect to update node port
    watch(nodeRect, rect => {
      const ports = calcPortPosition(
        Object.values(node.value.ports),
        rect,
        store.state.config.portGap,
      );

      Vue.set(node.value, 'ports', ports);
    });

    return {
      onNodeClick,
      onNodeResize,
      scale,
      readonly,

      dragActions,
    };
  },
});
</script>

<style lang="scss">
.node-wrapper {
  display: inline-block;
  position: absolute;
  cursor: pointer;

  &.draggable {
    cursor: grab;
  }
}
</style>
