<template>
  <CanvasComponent>
    <component
      v-for="node in nodes"
      :is="nodeComponent"
      :key="node.id"
      :node="node"
    >
      {{ node.id }}
    </component>

    <component
      v-for="link in links"
      :is="linkComponent"
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

function useGraph (stateAttrs: IStateAttrs) {
  buildState(stateAttrs, store);
  const { nodes, links } = store.state.graph;

  // 创建矩阵并将节点占据的空间标记为 1
  // const matrix = getMatrix(graph.offset, Object.values(nodes));

  return {
    nodes: ref(nodes),
    links: ref(links),
  };
}

type IFlowchartComponent = ReturnType<typeof defineComponent>;
interface IFlowchartComponents {
  node?: IFlowchartComponent;
  link?: IFlowchartComponent;
}

interface IFlowchartProps {
  stateAttrs: IStateAttrs;
  /**
   * Custom components
   */
  components?: IFlowchartComponents;
}

export default defineComponent({
  name: 'Flowchart',

  components: {
    CanvasComponent,
  },

  props: {
    stateAttrs: {
      type: Object as PropType<IStateAttrs>,
      required: true,
    },

    components: {
      type: Object as PropType<IFlowchartComponent>,
      default: () => ({}),
    },
  },

  setup (props: IFlowchartProps) {
    const { nodes, links } = useGraph(props.stateAttrs);

    const nodeComponent = props.components?.node || Node;
    const linkComponent = props.components?.link || Link;

    return {
      nodeComponent,
      linkComponent,
      nodes,
      links,
    };
  },
});
</script>
