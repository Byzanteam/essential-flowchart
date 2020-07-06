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

    const startPort = computed(() => getters.value.getStartPortOfLink(props.nodes, props.link));

    const endPort = computed(() => getters.value.getEndPortOfLink(props.nodes, props.link));

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
