<template>
  <CanvasComponent>
    <Node
      v-for="node in nodes"
      :key="node.id"
      :node="node"
    >
      {{ node.id }}
    </Node>

    <Link
      v-for="link in links"
      :key="link.id"
      :link="link"
    />
  </CanvasComponent>
</template>

<script lang="ts">
import {
  defineComponent, ref,
  PropType,
} from '@vue/composition-api';
import store from '@/store';
import { IStateAttrs } from '@/types';
import { buildState } from '@/utils/graph';
import CanvasComponent from '../Canvas/Canvas.vue';
import Node from '../Node/Node.vue';
import Link from '../Link/Link.vue';
// import { getMatrix } from './utils/grid';

function useGraph (graph: IStateAttrs) {
  buildState(graph, store);
  const { nodes, links } = store.state.graph;

  // 创建矩阵并将节点占据的空间标记为 1
  // const matrix = getMatrix(graph.offset, Object.values(nodes));

  return {
    nodes: ref(nodes),
    links: ref(links),
  };
}

interface IFlowChartProps {
  graph: IStateAttrs;
}

export default defineComponent({
  name: 'FlowChart',

  components: {
    CanvasComponent,
    Node,
    Link,
  },

  props: {
    graph: {
      type: Object as PropType<IStateAttrs>,
      required: true,
    },
  },

  setup (props: IFlowChartProps) {
    const { nodes, links } = useGraph(props.graph);

    return {
      nodes,
      links,
    };
  },
});
</script>
