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

import { ILink, INode } from '@/types';
import emitter from '@/emitter';
import { CLICK_LINK } from '@/emitter/events';
import { useConfig } from '@/utils/config';
import generatePath from './utils/generatePath';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'LinkWrapper',

  props: {
    link: {
      type: Object as PropType<ILink>,
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
    const { nodePadding } = useConfig();

    const fromNode = computed(() => props.nodes[props.link.from.nodeId]);

    const startPort = computed(() => fromNode.value.ports[props.link.from.portId]);
    const endPort = computed(() => {
      const { link } = props;

      // the link can be draft
      if (link.to && link.to.nodeId && link.to.portId) {
        const toNode = props.nodes[link.to.nodeId];
        return toNode.ports[link.to.portId];
      }
      if (link.mousePosition) {
        return {
          position: link.mousePosition,
        };
      }
      return null;
    });

    const path = computed(() => {
      if (endPort.value) {
        return generatePath(
          startPort.value,
          endPort.value,
          Object.values(props.nodes),
          nodePadding.value,
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
