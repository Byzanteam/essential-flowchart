<template>
  <div
    :style="portStyleObj"
    class="port"
  >
    <!-- TODO: port style -->
    <div
      ref="inner"
      class="port__inner"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, PropType,
} from '@vue/composition-api';
import { INode, INodePort } from '@/types';

export default defineComponent({
  name: 'Port',

  props: {
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
    const portStyleObj = computed(() => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      left: `${props.port.position!.x - props.node.x - 6}px`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      top: `${props.port.position!.y - props.node.y - 6}px`,
    }));

    return {
      portStyleObj,
    };
  },
});
</script>

<style lang="scss">
.port {
  display: flex;
  justify-content: center;
  position: absolute;

  &__inner {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    border: 1px solid purple;
  }
}
</style>
