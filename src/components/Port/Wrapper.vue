<template>
  <div
    :data-port-id="portId"
    :data-node-id="nodeId"
    @mousedown="onMouseDown"
  >
    <component
      :is="portComponent"
      :node="node"
      :port="positionedPort"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed,
} from '@vue/composition-api';
import useMouseDownOnPort from './hooks/useMouseDownOnPort';
import useGetPositionApi from './hooks/useGetPositionApi';
import { useConfig } from '../../utils/config';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'PortWrapper',

  props: {
    portComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },

    port: {
      type: Object,
      required: true,
    },

    node: {
      type: Object,
      required: true,
    },

    draftLink: {
      type: Object,
      default: null,
    },
  },

  setup (props) {
    const { getters } = useConfig();
    const getPositionApi = useGetPositionApi();
    const { onMouseDown } = useMouseDownOnPort(props, getPositionApi);

    const portId = computed(() => getters.value.getPortIdentifier(props.port));
    const nodeId = computed(() => getters.value.getNodeIdentifier(props.node));

    const positionedPort = computed(() => {
      const portPosition = getters.value.getPortPosition(props.node, props.port);
      return {
        ...props.port,
        position: portPosition,
      };
    });

    return {
      onMouseDown,
      positionedPort,
      portId,
      nodeId,
    };
  },
});
</script>
