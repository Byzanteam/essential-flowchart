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
  defineComponent, computed, watch, PropType, inject,
} from '@vue/composition-api';

import useStore from '@/hooks/useStore';
import { ILink, ICanvasContext } from '@/types';
import { CanvasContextSymbol } from '../Canvas/hooks/useCanvasContext';
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
    const canvasContext: ICanvasContext = inject<ICanvasContext>(CanvasContextSymbol, {
      offsetX: 0,
      offsetY: 0,
    });

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
        const { scale, offset } = store.state.graph;

        return {
          position: {
            x: (store.state.mousePosition.x - canvasContext.offsetX - offset.x) / scale,
            y: (store.state.mousePosition.y - canvasContext.offsetY - offset.y) / scale,
          },
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
