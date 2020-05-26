<template>
  <CanvasComponent>
    <NodeWrapperComponent
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :node-component="nodeComponent"
      :port-component="portComponent"
    />

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
import PortDefault from '../Port/Default.vue';
import LinkWrapperComponent from '../Link/Wrapper';
import LinkDefault from '../Link/Default.vue';

function useState (stateAttrs: IStateAttrs) {
  buildState(stateAttrs, store);
  const { nodes, links } = store.state.graph;

  return {
    nodes: ref(nodes),
    links: ref(links),
  };
}

type IFlowchartComponent = ReturnType<typeof defineComponent>;
interface IFlowchartComponents {
  node?: IFlowchartComponent;
  port?: IFlowchartComponent;
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
    const { nodes, links } = useState(props.stateAttrs);

    const {
      components: {
        node: nodeComponent = NodeDefault,
        port: portComponent = PortDefault,
        link: linkComponent = LinkDefault,
      } = {},
    } = props;

    return {
      nodeComponent,
      portComponent,
      linkComponent,
      nodes,
      links,
    };
  },
});
</script>
