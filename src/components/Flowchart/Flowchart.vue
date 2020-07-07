<template>
  <CanvasComponent ref="canvasRef">
    <NodeWrapperComponent
      v-for="node in nodes"
      :key="getters.getNodeIdentifier(node)"
      :node="node"
      :node-component="nodeComponent"
      :port-component="portComponent"
      :draft-link="draftLink"
    />

    <LinkWrapperComponent
      v-for="link in links"
      :nodes="nodes"
      :key="getters.getLinkIdentifier(link)"
      :link="link"
      :link-component="linkComponent"
    />

    <LinkWrapperComponent
      v-if="draftLink"
      :nodes="nodes"
      :link-component="linkComponent"
      :link="draftLink"
      key="draftLink"
    />
  </CanvasComponent>
</template>

<script lang="ts">
import Vue from 'vue';
import VueCompositionApi, {
  defineComponent,
  PropType,
  watch,
  provide,
  reactive,
  computed,
} from '@vue/composition-api';
import { buildConfig, ConfigSymbol } from '@/utils/config';
import useEmitter from '@/hooks/useEmitter';
import {
  IConfigInput,
  INode,
  ILink,
  IDraftLink,
} from '@/types';
import useApi from './hooks/useApi';
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
  draftLink: IDraftLink;
  /**
   * Custom components
   */
  components?: IFlowchartComponents;

  config: IConfigInput;
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

    draftLink: {
      type: Object as PropType<IFlowchartProps['draftLink']>,
      default: null,
    },
  },

  setup (props: IFlowchartProps, { emit }) {
    useEmitter(emit);
    const config = reactive(buildConfig(props.config));

    watch(() => props.config, cfg => {
      Object.assign(config, buildConfig(cfg));
    }, { deep: true });

    provide(ConfigSymbol, config);

    const { canvasRef } = useFlowchartContext();

    const {
      components: {
        node: nodeComponent = NodeDefault,
        port: portComponent = PortDefault,
        link: linkComponent = LinkDefault,
      } = {},
    } = props;

    const getters = computed(() => config.getters);

    return {
      canvasRef,

      nodeComponent,
      portComponent,
      linkComponent,
      getters,

      ...useApi({ canvasRef, config }),
    };
  },
});
</script>
