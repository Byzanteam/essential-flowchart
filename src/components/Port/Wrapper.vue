<template>
  <div
    :data-port-id="port.id"
    :data-node-id="node.id"
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
  defineComponent, PropType, computed,
} from '@vue/composition-api';
import {
  INode, INodePort,
} from '@/types';
import useStore from '@/hooks/useStore';

import useMousedownOnPort from './hooks/useMousedownOnPort';

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

    const editMousedownAction = useMousedownOnPort(store, props.node, props.port).onMousedown;

    const readonlyMousedownAction = (evt: MouseEvent) => {
      evt.stopPropagation();
      evt.preventDefault();
    };

    const onMousedown = computed(() => (
      store.state.config.readonly ? readonlyMousedownAction : editMousedownAction
    ));

    return {
      onMousedown,
    };
  },
});
</script>
