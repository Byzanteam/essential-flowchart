<template>
  <div
    :class="['port--' + port.direction]"
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
  defineComponent, PropType,
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
});
</script>

<style lang="scss">
.port {
  display: flex;
  justify-content: center;
  position: absolute;

  &--top {
    width: 100%;
    left: 0;
    top: -12px;
    flex-direction: row;
  }

  &--bottom {
    width: 100%;
    left: 0;
    bottom: -12px;
    flex-direction: row;
  }

  &__inner {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    background-color: greenyellow;
  }
}
</style>
