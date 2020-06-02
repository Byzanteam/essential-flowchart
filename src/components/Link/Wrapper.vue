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
      :is-selected="isSelected"
    />
  </span>
</template>

<script lang="ts">
import {
  defineComponent, computed, watch, PropType,
} from '@vue/composition-api';

import useStore from '@/hooks/useStore';
import { ILink } from '@/types';

import generatePath from './utils/generatePath';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'LinkWrapper',

  props: {
    link: {
      type: Object as PropType<ILink>,
      required: true,
    },

    isSelected: {
      type: Boolean,
      default: false,
    },

    linkComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },
  },

  setup (props) {
    const store = useStore();
    const graph = computed(() => store.state.graph);

    const fromNode = computed(() => graph.value.nodes[props.link.from.nodeId]);

    const startPort = computed(() => fromNode.value.ports[props.link.from.portId]);
    const endPort = computed(() => {
      const { link } = props;

      // the link can be draft
      if (link.to && link.to.nodeId && link.to.portId) {
        const toNode = graph.value.nodes[link.to.nodeId];
        return toNode.ports[link.to.portId];
      }
      if (store.state.mousePosition) {
        return {
          position: store.state.mousePosition,
        };
      }
      return null;
    });

    const path = computed(() => {
      if (endPort.value) {
        return generatePath(
          graph.value.grid,
          startPort.value,
          endPort.value,
          store.state.config,
          // track change
          store.state.linkVersions[props.link.id],
        );
      }
      return [];
    });

    watch(path, newPath => store.commit(
      'updateLinkPath',
      { linkId: props.link.id, path: [...newPath] },
    ));

    const onLinkClick = () => {
      store.dispatch('selectLink', props.link.id);
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