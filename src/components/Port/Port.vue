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
  defineComponent, ref, watch, onMounted,
  PropType, Ref,
} from '@vue/composition-api';
import store from '@/store';
import { INode, INodePort } from '@/types';

function useUpdatePortPosition (node: INode, port: INodePort, inner: HTMLElement) {
  let position;
  // eslint-disable-next-line default-case
  switch (port.direction) {
    case 'top':
      position = {
        x: node.x + node.width / 2,
        y: node.y - inner.offsetHeight / 2,
      };
      break;
    case 'bottom':
      position = {
        x: node.x + node.width / 2,
        y: node.y + node.height + inner.offsetHeight / 2,
      };
      break;
  }
  store.commit('updateNodePortPosition', {
    nodeId: node.id,
    portDir: port.direction,
    position,
  });
}

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
    const inner: Ref<HTMLElement | null> = ref(null);
    const { node, port } = props;

    onMounted(() => {
      useUpdatePortPosition(node, port, inner.value as HTMLElement);
    });

    watch([() => node.x, () => node.y], () => {
      useUpdatePortPosition(node, port, inner.value as HTMLElement);
    }, { lazy: true });

    return {
      inner,
    };
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
