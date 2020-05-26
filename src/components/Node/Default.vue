<template>
  <div
    :style="{ width: node.width + 'px', height: node.height + 'px'}"
    class="node__default"
  >
    {{ node.id }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { INode } from '@/types/graph';

export default defineComponent({
  name: 'NodeDefault',

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
  &__default {
    background-color: #fff;
  }
}
</style>
