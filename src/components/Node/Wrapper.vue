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
    :class="{ 'selected': isSelected }"
    class="node-wrapper"
    @dragging="onNodeDragging"
    @dragstop="onNodeDragStop"
    @click.native="onNodeClick"
  >
    <span>
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
    </span>
  </vue-draggable-resizable>
</template>

<script lang="ts">
// @ts-ignore
import VueDraggableResizable from 'vue-draggable-resizable';
import {
  defineComponent, PropType,
} from '@vue/composition-api';
import { useStore } from '@/hooks/store';
import { IPosition, INode, FlowchartStore } from '@/types';
import PortWrapperComponent from '../Port/Wrapper.vue';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

function useDragNode (store: FlowchartStore, node: INode) {
  let draggingNodePosition: IPosition | null = null;

  function onDragStart () {
    draggingNodePosition = {
      x: node.x,
      y: node.y,
    };
  }

  function onNodeDragging (left: number, top: number) {
    store.dispatch('dragNode', {
      id: node.id,
      position: {
        x: left,
        y: top,
      },
      prevPosition: {
        x: node.x,
        y: node.y,
      },
    });
  }

  function onNodeDragStop (left: number, top: number) {
    store.dispatch('dragNodeStop', {
      id: node.id,
      position: {
        x: left,
        y: top,
      },
      prevPosition: { ...draggingNodePosition },
    });

    draggingNodePosition = null;
  }

  return {
    onDragStart,
    onNodeDragging,
    onNodeDragStop,
  };
}

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

    isSelected: {
      type: Boolean,
      default: false,
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
    const store = useStore();

    const {
      onDragStart,
      onNodeDragging,
      onNodeDragStop,
    } = useDragNode(store, props.node);

    const onNodeClick = () => {
      store.dispatch('selectNode', props.node.id);
    };

    return {
      onNodeDragging,
      onNodeDragStop,
      onDragStart,
      onNodeClick,
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
