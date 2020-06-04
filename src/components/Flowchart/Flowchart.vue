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
import Vue from 'vue';
import VueCompositionApi, { defineComponent, PropType } from '@vue/composition-api';
import useStore from '@/hooks/useStore';
import { IStateInput, IConfigInput } from '@/types';
import useState from './hooks/useState';
import useSelected from './hooks/useSelected';

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
  rawState: IStateInput;
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
    rawState: {
      type: Object as PropType<IStateInput>,
      required: true,
    },

    components: {
      type: Object as PropType<IFlowchartComponent>,
      default: () => ({}),
    },

    config: {
      type: Object as PropType<IConfigInput>,
      default: () => ({}),
    },
  },

  setup (props: IFlowchartProps) {
    const store = useStore();
    const { nodes, links } = useState(props.rawState, store);
    store.commit('updateConfig', props.config);

    const {
      components: {
        node: nodeComponent = NodeDefault,
        port: portComponent = PortDefault,
        link: linkComponent = LinkDefault,
      } = {},
    } = props;

    function zoom (delta: number) {
      store.dispatch('updateScale', store.state.graph.scale + delta);
    }

    return {
      nodeComponent,
      portComponent,
      linkComponent,
      nodes,
      links,
      ...useSelected(store),

      zoom,
    };
  },
});
</script>
