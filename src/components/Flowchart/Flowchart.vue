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
  defineComponent,
  PropType,
  watch,
  onMounted,
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

  config?: IConfigInput;
}

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
    useGraph({
      nodes: props.nodes,
      links: props.links,
      offset: { x: 0, y: 0 },
      scale: 1,
      grid: store.state.graph.grid,
    }, store);
    const { canvasRef } = useFlowchartContext();
    store.commit('updateConfig', props.config);

    onMounted(() => {
      // eslint-disable-next-line
      watch(() => props.config!.readonly, readonly => store.commit('updateReadonly', readonly));
    });

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
