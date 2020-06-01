<template>
  <vue-draggable-resizable
    :onDragStart="onDragStart"
    :x="node.x"
    :y="node.y"
    :z="50"
    :resizable="false"
    :grid="[1, 1]"
    :scale="scale"
    axis="both"
    w="auto"
    h="auto"
    class="node-wrapper"
    @dragging="onNodeDragging"
    @dragstop="onNodeDragStop"
    @activated="onNodeClick"
  >
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
import {
  defineComponent, computed,
  PropType, Ref,
} from '@vue/composition-api';
import { useStore } from '@/hooks/store';
import { IPosition, INode, FlowchartStore } from '@/types';
import PortWrapperComponent from '../Port/Wrapper.vue';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useDragNode (store: FlowchartStore, node: Ref<INode>, _scale: number) {
  let draggingNodePosition: IPosition | null = null;

  function onDragStart (evt: MouseEvent) {
    evt.stopPropagation(); // prevent canvas move

    draggingNodePosition = {
      x: node.value.x,
      y: node.value.y,
    };
  }

  function onNodeDragging (left: number, top: number) {
    store.dispatch('dragNode', {
      id: node.value.id,
      position: {
        x: left,
        y: top,
      },
      prevPosition: {
        x: node.value.x,
        y: node.value.y,
      },
    });
  }

  function onNodeDragStop (left: number, top: number) {
    store.dispatch('dragNodeStop', {
      id: node.value.id,
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
    const node = computed(() => props.node);
    const scale = computed(() => store.state.graph.scale);

    const onNodeClick = () => {
      store.dispatch('selectNode', props.node.id);
    };

    return {
      onNodeClick,
      scale,
      ...useDragNode(store, node, scale.value),
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
