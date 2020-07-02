<template>
  <div
    :data-port-id="port.id"
    :data-node-id="node.id"
    @mousedown="onMouseDown"
  >
    <component
      :is="portComponent"
      :node="node"
      :port="port"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from '@vue/composition-api';
import {
  INode, INodePort, ILink,
} from '@/types';
import useMouseDownOnPort from './hooks/useMouseDownOnPort';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'PortWrapper',

  props: {
    portComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },

    port: {
      type: Object as PropType<INodePort>,
      required: true,
    },

    node: {
      type: Object as PropType<INode>,
      required: true,
    },

    draftLink: {
      type: Object as PropType<ILink>,
      default: null,
    },
  },

  setup (props) {
    const { onMouseDown } = useMouseDownOnPort(props);

    return {
      onMouseDown,
    };
  },
});
</script>
