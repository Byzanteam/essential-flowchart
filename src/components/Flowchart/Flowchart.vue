<template>
  <CanvasComponent>
    <NodeWrapperComponent
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :node-component="nodeComponent"
    >
      {{ node.id }}
    </NodeWrapperComponent>

    <LinkWrapperComponent
      v-for="link in links"
      :link-component="linkComponent"
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
import NodeWrapperComponent from '../Node/Wrapper.vue';
import NodeDefault from '../Node/Default.vue';
import LinkWrapperComponent from '../Link/Wrapper';
import LinkDefault from '../Link/Default.vue';
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
    NodeWrapperComponent,
    LinkWrapperComponent,
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

    const {
      components: {
        node: nodeComponent = NodeDefault,
        link: linkComponent = LinkDefault,
      } = {},
    } = props;

    return {
      nodeComponent,
      linkComponent,
      nodes,
      links,
    };
  },
});
</script>
