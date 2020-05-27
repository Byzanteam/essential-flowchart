<template>
  <div
    @mousedown="onMousedown"
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
import { v4 } from 'uuid';
import {
  INode, INodePort, IPosition, FlowchartStore,
} from '@/types';
import { useStore } from '@/hooks/store';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

function useMouseDownOnPort (store: FlowchartStore, node: INode, port: INodePort) {
  const onMousedown = (evt: MouseEvent) => {
    const linkId = v4();
    const fromNodeId = node.id;
    const fromPortId = port.id;

    const mousemoveHandler = (e: MouseEvent) => {
      const toPosition: IPosition = {
        x: e.x,
        y: e.y,
      };

      store.dispatch('drawLink', {
        linkId,
        toPosition,
      });
    };

    // add mouse move listener
    window.addEventListener('mousemove', mousemoveHandler, false);

    store.dispatch('addLink', {
      id: linkId,
      from: {
        nodeId: fromNodeId,
        portId: fromPortId,
      },
      to: {},
    });

    evt.preventDefault();
    // prevent node move
    evt.stopPropagation();
  };

  return {
    onMousedown,
  };
}

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
  },

  setup (props) {
    const store = useStore();

    const { onMousedown } = useMouseDownOnPort(store, props.node, props.port);

    return {
      onMousedown,
    };
  },
});
</script>
