<template>
  <CanvasComponent ref="canvasRef">
    <NodeWrapperComponent
      v-for="node in structNodes"
      :key="node.id"
      :node="node"
      :node-component="nodeComponent"
      :port-component="portComponent"
    />

    <LinkWrapperComponent
      v-for="link in structLinks"
      :key="link.id"
      :link="link"
      :link-component="linkComponent"
    />
  </CanvasComponent>
</template>

<script lang="ts">
import Vue from 'vue';
import VueCompositionApi, {
  ref,
  defineComponent,
  PropType,
  watch,
  computed,
} from '@vue/composition-api';
import useStore from '@/hooks/useStore';
import useEmitter from '@/hooks/useEmitter';
import {
  IConfigInput,
  INode,
  ILink,
} from '@/types';
import useApi from './hooks/useApi';
import useGraph from './hooks/useState';
import useFlowchartContext from './hooks/useFlowchartContext';

import CanvasComponent from '../Canvas/Canvas.vue';
import NodeWrapperComponent from '../Node/Wrapper.vue';
import NodeDefault from '../Node/Default.vue';
import PortDefault from '../Port/Default.vue';
import LinkWrapperComponent from '../Link/Wrapper.vue';
import LinkDefault from '../Link/Default.vue';

Vue.use(VueCompositionApi);

type IFlowchartComponent = ReturnType<typeof defineComponent>;
interface IFlowchartComponents {
  node?: IFlowchartComponent;
  port?: IFlowchartComponent;
  link?: IFlowchartComponent;
}

interface IFlowchartProps {
  nodes: Record<string, INode>;
  links: Record<string, ILink>;
  /**
   * Custom components
   */
  components?: IFlowchartComponents;

  config: IConfigInput;
}

// TODO: offset and scale
export default defineComponent({
  name: 'Flowchart',

  components: {
    CanvasComponent,
    NodeWrapperComponent,
    LinkWrapperComponent,
  },

  props: {
    nodes: {
      type: Object as PropType<IFlowchartProps['nodes']>,
      required: true,
    },
    links: {
      type: Object as PropType<IFlowchartProps['links']>,
      default: () => [],
    },

    components: {
      type: Object as PropType<IFlowchartProps['components']>,
      default: () => ({}),
    },

    config: {
      type: Object as PropType<IFlowchartProps['config']>,
      default: () => ({}),
    },
  },

  setup (props: IFlowchartProps, { emit }) {
    const store = useStore();
    useEmitter(emit);
    // TODO: why watch computed(() => [props.nodes, props.links]) not work
    watch([ref(props.nodes), ref(props.links)], ([nodes, links]) => {
      useGraph(nodes as Record<string, INode>, links as Record<string, ILink>, store);
    }, { deep: true });
    store.commit('updateConfig', props.config);
    // TODO: why watch(ref(props.config.readonly), cb) not work?
    // deep option for update exist props
    watch(ref(props.config), ({ readonly }, oldConfig = {}) => {
      if (readonly === oldConfig.readonly) return;
      // undefined -> false
      store.commit('updateReadonly', !!readonly);
    }, { deep: true });
    const { canvasRef } = useFlowchartContext();

    const {
      components: {
        node: nodeComponent = NodeDefault,
        port: portComponent = PortDefault,
        link: linkComponent = LinkDefault,
      } = {},
    } = props;

    return {
      canvasRef,

      nodeComponent,
      portComponent,
      linkComponent,

      structNodes: computed(() => store.state.graph.nodes),
      structLinks: computed(() => store.state.graph.links),

      ...useApi(store, { canvasRef }),
    };
  },
});
</script>
