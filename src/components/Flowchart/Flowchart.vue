<template>
  <CanvasComponent ref="canvasRef">
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
import { IGraph, IConfigInput, IPosition } from '@/types';
import useGraph from './hooks/useState';
import useSelected from './hooks/useSelected';
import useFlowchartContext, { ICanvasComponent } from './hooks/useFlowchartContext';

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
  state: IGraph;
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
    state: {
      type: Object as PropType<IFlowchartProps['state']>,
      required: true,
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

  setup (props: IFlowchartProps) {
    const store = useStore();
    const { nodes, links } = useGraph(props.state, store);
    const { canvasRef } = useFlowchartContext();
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

    function zoomIn () {
      zoom(0.2);
    }

    function zoomOut () {
      zoom(-0.2);
    }

    function getPosition (clientX: number, clientY: number): IPosition {
      return (canvasRef.value as ICanvasComponent).getPosition(clientX, clientY);
    }

    return {
      canvasRef,

      nodeComponent,
      portComponent,
      linkComponent,
      nodes,
      links,
      ...useSelected(store),

      zoom,
      zoomIn,
      zoomOut,
      getPosition,
    };
  },
});
</script>
