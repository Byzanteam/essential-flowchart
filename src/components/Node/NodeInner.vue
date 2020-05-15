<template>
  <div
    :style="{ width: node.width + 'px', height: node.height + 'px'}"
    class="node__inner"
  >
    {{ node.id }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { INode } from '@/types/graph';

export default defineComponent({
  name: 'NodeInner',

  props: {
    node: {
      type: Object as PropType<INode>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.node {
  &__inner {
    background-color: #fff;
  }
}
</style>
