<template>
  <vue-draggable-resizable
    :x="node.x"
    :y="node.y"
    :z="50"
    :resizable="false"
    :grid="[1, 1]"
    axis="both"
    w="auto"
    h="auto"
    class="node"
    @dragging="onNodeDragging"
    @dragstop="onNodeDragStop"
  >
    <node-inner :node="node" />

    <Port
      v-for="port in node.ports"
      :key="port.direction"
      :node="node"
      :port="port"
    />
  </vue-draggable-resizable>
</template>

<script lang="ts">
// @ts-ignore
import VueDraggableResizable from 'vue-draggable-resizable';
import {
  defineComponent, PropType, watch, computed,
} from '@vue/composition-api';
import store from '@/store';
import { INode } from '@/types/graph';
import { markNodeWalkable } from '@/utils/grid';
import NodeInner from './NodeInner.vue';
import Port from '../Port/Port.vue';

export default defineComponent({
  name: 'Node',

  components: {
    VueDraggableResizable,
    NodeInner,
    Port,
  },

  props: {
    node: {
      type: Object as PropType<INode>,
      required: true,
    },
  },

  setup (props) {
    // TODO: use func
    const { node } = props;

    const position = computed(() => ({
      x: node.x,
      y: node.y,
    }));

    // 观测 node 的坐标，将 oldPos 变为 walkable，pos 变为 unwalkable
    watch(position, (pos, prevPos) => {
      if (prevPos) {
        markNodeWalkable(
          store.state.graph.grid.pfGrid,
          [prevPos.x, prevPos.y, node.width, node.height],
          true,
        );
      }

      markNodeWalkable(
        store.state.graph.grid.pfGrid,
        [pos.x, pos.y, node.width, node.height],
        false,
      );
    });

    // 拖动时更新坐标，使用 mutation
    const onNodeDragging = (left: number, top: number) => {
      store.commit('dragNode', {
        nodeId: node.id,
        position: {
          x: left,
          y: top,
        },
      });
    };

    // 拖动结束后触发 action 记录历史
    const onNodeDragStop = (left: number, top: number) => {
      store.dispatch('dragNodeStop', {
        id: node.id,
        position: {
          x: left,
          y: top,
        },
      });
    };

    return {
      onNodeDragging,
      onNodeDragStop,
    };
  },
});
</script>

<style lang="scss">
.node {
  display: inline-block;
  position: absolute;
}
</style>
