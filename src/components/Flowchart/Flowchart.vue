<template>
  <CanvasComponent>
    <NodeWrapperComponent
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :is-selected="isNodeSelected(node.id)"
      :node-component="nodeComponent"
      :port-component="portComponent"
    />

    <LinkWrapperComponent
      v-for="link in links"
      :key="link.id"
      :link="link"
      :is-selected="isLinkSelected(link.id)"
      :link-component="linkComponent"
    />
  </CanvasComponent>
</template>

<script lang="ts">
import {
  defineComponent, computed,
  PropType,
} from '@vue/composition-api';
import { useStore } from '@/hooks/store';
import { IStateInput, FlowchartStore, Id } from '@/types';
import { buildState } from '@/utils/graph';
import CanvasComponent from '../Canvas/Canvas.vue';
import NodeWrapperComponent from '../Node/Wrapper.vue';
import NodeDefault from '../Node/Default.vue';
import PortDefault from '../Port/Default.vue';
import LinkWrapperComponent from '../Link/Wrapper';
import LinkDefault from '../Link/Default.vue';

function useState (rawState: IStateInput, store: FlowchartStore) {
  buildState(rawState, store);
  const nodes = computed(() => store.state.graph.nodes);
  const links = computed(() => store.state.graph.links);

  return {
    nodes,
    links,
  };
}

type IFlowchartComponent = ReturnType<typeof defineComponent>;
interface IFlowchartComponents {
  node?: IFlowchartComponent;
  port?: IFlowchartComponent;
  link?: IFlowchartComponent;
}

interface IFlowchartProps {
  rawState: IStateInput;
  /**
   * Custom components
   */
  components?: IFlowchartComponents;
}

function useSelected (store: FlowchartStore) {
  const selected = computed(() => store.state.selected);

  function isNodeSelected (nodeId: Id) {
    return !!(selected.value
      && selected.value.type === 'node'
      && selected.value.id === nodeId
    );
  }

  function isLinkSelected (linkId: Id) {
    return !!(selected.value
      && selected.value.type === 'link'
      && selected.value.id === linkId
    );
  }

  return {
    isNodeSelected,
    isLinkSelected,
  };
}

export default defineComponent({
  name: 'Flowchart',

  components: {
    CanvasComponent,
    NodeWrapperComponent,
    LinkWrapperComponent,
  },

  props: {
    rawState: {
      type: Object as PropType<IStateInput>,
      required: true,
    },

    components: {
      type: Object as PropType<IFlowchartComponent>,
      default: () => ({}),
    },
  },

  setup (props: IFlowchartProps) {
    const store = useStore();
    const { nodes, links } = useState(props.rawState, store);

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
      ...useSelected(store),
    };
  },
});
</script>
