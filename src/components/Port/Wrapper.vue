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
  defineComponent, PropType, computed,
} from '@vue/composition-api';
import {
  INode, INodePort,
} from '@/types';
// import useStore from '@/hooks/useStore';

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
  },

  setup (props) {
    // const store = useStore();

    const defaultMouseDownAction = useMouseDownOnPort(props.node, props.port).onMouseDown;

    // const readonlyMouseDownAction = (evt: MouseEvent) => {
    //   evt.stopPropagation();
    //   evt.preventDefault();
    // };

    const onMouseDown = computed(() => (
      defaultMouseDownAction
      // store.state.config.readonly ? readonlyMouseDownAction : defaultMouseDownAction
    ));

    return {
      onMouseDown,
    };
  },
});
</script>
