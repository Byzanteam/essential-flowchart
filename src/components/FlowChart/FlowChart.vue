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
import {
  defineComponent, ref, watch,
  PropType,
} from '@vue/composition-api';
import store from '@/store';
import { IGraph } from '@/types';
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

interface IFlowChartProps {
  graph: IGraph;
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

  setup (props: IFlowChartProps) {
    const { nodes } = useGraph(props.graph);

    watch<IGraph>(() => props.graph, (graph: IFlowChartProps['graph']) => {
      store.commit('updateGraph', graph);
    }, { lazy: false });

    return {
      nodes,
    };
  },
});
</script>
