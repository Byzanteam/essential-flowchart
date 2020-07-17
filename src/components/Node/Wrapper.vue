<template>
  <vue-draggable-resizable
    :onDragStart="dragActions.onNodeDragStart"
    :x="nodePosition.x"
    :y="nodePosition.y"
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
  >
    <component
      :is="nodeComponent"
      :node="node"
    />

    <template v-if="!readonly">
      <PortWrapperComponent
        v-for="port in getters.getNodePorts(node)"
        :key="getters.getPortIdentifier(port)"
        :node="node"
        :port="port"
        :draft-link="draftLink"
        :port-component="portComponent"
      />
    </template>
  </vue-draggable-resizable>
</template>

<script lang="ts">
// @ts-ignore
import VueDraggableResizable from 'vue-draggable-resizable';

import {
  defineComponent, computed,
  PropType,
} from '@vue/composition-api';
import { INode, IDraftLink } from '@/types';
import { useConfig } from '@/utils/config';
import { noop } from '@/utils/shared';

import useDragNode from './hooks/useDragNode';
import PortWrapperComponent from '../Port/Wrapper.vue';

type FlowchartComponent = ReturnType<typeof defineComponent>;

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
    draftLink: {
      type: Object as PropType<IDraftLink | null>,
      requried: true,
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
    const node = computed(() => props.node);

    const {
      scale,
      readonly,
      getters,
    } = useConfig();

    const nodePosition = computed(() => getters.value.getNodePosition(props.node));

    const defaultDragActions = useDragNode(node, getters);
    const readonlyDragActions = {
      onNodeDragStart: noop,
      onNodeDragging: noop,
      onNodeDragStop: noop,
    };

    const dragActions = computed(() => (
      readonly.value ? readonlyDragActions : defaultDragActions
    ));

    return {
      scale,
      readonly,
      nodePosition,
      getters,

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
  user-select: none !important;

  &.dragging {
    z-index: 51 !important;
  }

  &.draggable {
    cursor: grab;
  }
}
</style>
