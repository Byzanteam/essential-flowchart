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
import useStore from '@/hooks/useStore';

import { useConfig } from '@/utils/config';
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
    const store = useStore();
    const { readonly, linkPipeline } = useConfig();

    const defaultMouseDownAction = useMouseDownOnPort(store, props.node, props.port, linkPipeline.value).onMouseDown;

    const readonlyMouseDownAction = (evt: MouseEvent) => {
      evt.stopPropagation();
      evt.preventDefault();
    };

    const onMouseDown = computed(() => (
      readonly.value ? readonlyMouseDownAction : defaultMouseDownAction
    ));

    return {
      onMouseDown,
    };
  },
});
</script>
