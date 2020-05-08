<template>
  <canvas-component>
    <node
      v-for="node in nodes"
      :key="node.id"
      :node="node"
    >
      {{ node.id }}
    </node>
  </canvas-component>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import { IGraph } from '@/types/graph';
import CanvasComponent from '../Canvas/Canvas.vue';
import Node from '../Node/Node.vue';
// import { getMatrix } from './utils/grid';

function useGraph (graph: IGraph) {
  const { nodes } = graph;

  // 创建矩阵并将节点占据的空间标记为 1
  // const matrix = getMatrix(graph.offset, Object.values(nodes));

  return {
    nodes: ref(nodes),
  };
}

export default defineComponent({
  name: 'FlowChart',

  components: {
    CanvasComponent,
    Node,
  },

  props: {
    graph: {
      type: Object as PropType<IGraph>,
      required: true,
    },
  },

  setup (props) {
    const { nodes } = useGraph(props.graph);

    return {
      nodes,
    };
  },
});
</script>
