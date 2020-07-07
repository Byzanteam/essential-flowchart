<template>
  <span
    v-if="endPort"
    @click="onLinkClick"
  >
    <component
      :is="linkComponent"
      :link="link"
      :start-pos="startPort.position"
      :end-pos="endPort.position"
      :path="path"
    />
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
} from '@vue/composition-api';

import { INode, IDraftLink } from '@/types';
import emitter from '@/emitter';
import { CLICK_LINK } from '@/emitter/events';
import { useConfig } from '@/utils/config';
import generatePath from './utils/generatePath';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'LinkWrapper',

  props: {
    link: {
      type: Object as PropType<IDraftLink>,
      required: true,
    },

    nodes: {
      type: Object as PropType<Record<string, INode>>,
      required: true,
    },

    linkComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },
  },

  setup (props) {
    const { nodePadding, getters } = useConfig();

    const startPort = computed(() => {
      const portId = getters.value.getFromPortIdOfLink(props.link);
      const nodeId = getters.value.getFromNodeIdOfLink(props.link);
      const node = getters.value.getNode(props.nodes, nodeId);
      const port = getters.value.getNodePort(node, portId);
      const portPosition = getters.value.getPortPosition(node, port);
      return {
        ...port,
        position: portPosition,
      };
    });

    const endPort = computed(() => {
      if (getters.value.isDraftLink(props.link)) {
        return getters.value.getDraftPortOfLink(props.link);
      }
      const portId = getters.value.getToPortIdOfLink(props.link);
      const nodeId = getters.value.getToNodeIdOfLink(props.link);
      const node = getters.value.getNode(props.nodes, nodeId);
      const port = getters.value.getNodePort(node, portId);
      return {
        ...port,
        position: getters.value.getPortPosition(node, port),
      };
    });

    const path = computed(() => {
      if (endPort.value) {
        return generatePath(
          startPort.value,
          endPort.value,
          Object.values(props.nodes),
          {
            nodePadding: nodePadding.value,
            getters: getters.value,
          },
        );
      }
      return [];
    });

    const onLinkClick = (event: MouseEvent) => {
      emitter.emit(CLICK_LINK, { event, link: props.link });
    };

    return {
      startPort,
      endPort,
      path,
      onLinkClick,
    };
  },
});
</script>
