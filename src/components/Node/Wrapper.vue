<template>
  <vue-draggable-resizable
    :onDragStart="dragActions.onDragStart"
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
    @activated="onNodeClick"
  >
    <ResizeObserver @notify="onNodeResize" />

    <component
      :is="nodeComponent"
      :node="node"
      :is-selected="isSelected"
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
// @ts-ignore
import { ResizeObserver } from 'vue-resize';
import {
  defineComponent, computed,
  PropType,
} from '@vue/composition-api';
import useStore from '@/hooks/useStore';
import { INode } from '@/types';

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

    isSelected: {
      type: Boolean,
      default: false,
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

    const onNodeClick = () => {
      store.dispatch('selectNode', props.node.id);
    };

    const onNodeResize = ({ width, height }: Pick<INode, 'width' | 'height'>) => {
      store.commit({
        type: 'updateNodeSize',
        id: props.node.id,
        width,
        height,
      });
    };

    const editDragActions = useDragNode(store, node);
    const readonlyDragActions = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onDragStart () {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onNodeDragging () {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onNodeDragStop () {},
    };

    const dragActions = computed(() => (
      store.state.config.readonly ? readonlyDragActions : editDragActions
    ));

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
}
</style>
